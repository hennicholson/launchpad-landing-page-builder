/**
 * Voice Usage Tracker
 *
 * Handles voice session budget checking, session lifecycle,
 * and cost tracking. Follows the same pattern as lib/ai/cost-tracker.ts.
 *
 * OpenAI Realtime API pricing (gpt-realtime-mini):
 *   Audio input:  $10.00 / 1M audio tokens
 *   Audio output: $20.00 / 1M audio tokens
 *   Text input:   $0.60 / 1M tokens
 *   Text output:  $2.40 / 1M tokens
 *
 * When we have actual token data from response.done events, we calculate
 * precise cost. Otherwise, fall back to a conservative per-second estimate.
 */

import { db } from "../db";
import { users, voiceSessions, PLAN_LIMITS, type PlanType } from "../schema";
import { eq, or, sql } from "drizzle-orm";
import crypto from "crypto";

// Fallback estimate when no token data available (conservative)
const FALLBACK_COST_PER_SECOND_CENTS = 0.15;

// OpenAI Realtime API pricing (per million tokens → dollars)
const REALTIME_PRICING = {
  audioInput: 10.00,  // $10.00 per 1M audio input tokens
  audioOutput: 20.00, // $20.00 per 1M audio output tokens
  textInput: 0.60,    // $0.60 per 1M text input tokens
  textOutput: 2.40,   // $2.40 per 1M text output tokens
};

export type RealtimeTokenUsage = {
  inputAudioTokens: number;
  outputAudioTokens: number;
  inputTextTokens: number;
  outputTextTokens: number;
};

/**
 * Calculate actual cost from token usage data.
 * Returns cost in cents.
 */
export function calculateRealtimeCost(usage: RealtimeTokenUsage): number {
  const audioInCost = (usage.inputAudioTokens / 1_000_000) * REALTIME_PRICING.audioInput;
  const audioOutCost = (usage.outputAudioTokens / 1_000_000) * REALTIME_PRICING.audioOutput;
  const textInCost = (usage.inputTextTokens / 1_000_000) * REALTIME_PRICING.textInput;
  const textOutCost = (usage.outputTextTokens / 1_000_000) * REALTIME_PRICING.textOutput;
  return Math.ceil((audioInCost + audioOutCost + textInCost + textOutCost) * 100);
}

// Helper to check if string is valid UUID format
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Find user by flexible ID (UUID, whopId, or whopUniqueId)
 */
async function findUser(userId: string) {
  const conditions = [eq(users.whopId, userId), eq(users.whopUniqueId, userId)];
  if (isValidUUID(userId)) {
    conditions.unshift(eq(users.id, userId));
  }
  const [userData] = await db.select().from(users).where(or(...conditions)).limit(1);
  return userData;
}

/**
 * Check if user has voice budget remaining this month.
 * Handles monthly reset cycle (30 days from first use).
 */
export async function checkVoiceBudgetAvailable(
  userId: string
): Promise<{ available: boolean; spentCents: number; budgetCents: number; error?: string }> {
  try {
    const userData = await findUser(userId);
    if (!userData) {
      return { available: false, spentCents: 0, budgetCents: 0, error: "User not found" };
    }

    const planLimits = PLAN_LIMITS[userData.plan as PlanType];
    const budget = planLimits.voiceBudgetCents;

    // 0 = voice disabled for this plan
    if (budget === 0) {
      return { available: false, spentCents: 0, budgetCents: 0, error: "Voice not available on your plan" };
    }

    // Check if monthly reset is due
    if (userData.voiceSpendResetAt && new Date() >= userData.voiceSpendResetAt) {
      await db
        .update(users)
        .set({
          voiceMonthlySpendCents: 0,
          voiceSpendResetAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id));
      return { available: true, spentCents: 0, budgetCents: budget };
    }

    // -1 = unlimited
    if (budget === -1) {
      return { available: true, spentCents: userData.voiceMonthlySpendCents, budgetCents: -1 };
    }

    return {
      available: userData.voiceMonthlySpendCents < budget,
      spentCents: userData.voiceMonthlySpendCents,
      budgetCents: budget,
    };
  } catch (error) {
    console.error("[Voice] checkVoiceBudgetAvailable error:", error);
    return { available: false, spentCents: 0, budgetCents: 0, error: "Failed to check voice budget" };
  }
}

/**
 * Start a new voice session. Creates a record in voice_sessions.
 */
export async function startVoiceSession(
  userId: string,
  projectId?: string
): Promise<{ sessionId: string } | { error: string }> {
  try {
    const userData = await findUser(userId);
    if (!userData) {
      return { error: "User not found" };
    }

    const sessionId = `vs_${crypto.randomBytes(6).toString("hex")}`;

    await db.insert(voiceSessions).values({
      id: sessionId,
      userId: userData.id,
      projectId: projectId || null,
      status: "active",
      commandCount: 0,
      estimatedCostCents: 0,
    });

    console.log(`[Voice] Started session ${sessionId} for user ${userData.id}`);
    return { sessionId };
  } catch (error) {
    console.error("[Voice] startVoiceSession error:", error);
    return { error: "Failed to start voice session" };
  }
}

/**
 * End a voice session. Calculates cost from actual token data if available,
 * otherwise falls back to duration-based estimate. Updates user budget.
 */
export async function endVoiceSession(
  sessionId: string,
  data: {
    durationSeconds: number;
    commandCount: number;
    usage?: RealtimeTokenUsage;
  }
): Promise<{ costCents: number } | { error: string }> {
  try {
    // Get the session
    const [session] = await db
      .select()
      .from(voiceSessions)
      .where(eq(voiceSessions.id, sessionId))
      .limit(1);

    if (!session) {
      return { error: "Session not found" };
    }

    if (session.status !== "active") {
      return { error: "Session already ended" };
    }

    // Calculate cost — use actual tokens if available, else fall back to duration estimate
    const hasTokenData = data.usage && (
      data.usage.inputAudioTokens > 0 ||
      data.usage.outputAudioTokens > 0 ||
      data.usage.inputTextTokens > 0 ||
      data.usage.outputTextTokens > 0
    );
    const costCents = hasTokenData
      ? calculateRealtimeCost(data.usage!)
      : Math.ceil(data.durationSeconds * FALLBACK_COST_PER_SECOND_CENTS);

    // Update the session record (include token data if available)
    await db
      .update(voiceSessions)
      .set({
        endedAt: new Date(),
        durationSeconds: data.durationSeconds,
        commandCount: data.commandCount,
        estimatedCostCents: costCents,
        ...(data.usage ? {
          inputAudioTokens: data.usage.inputAudioTokens,
          outputAudioTokens: data.usage.outputAudioTokens,
          inputTextTokens: data.usage.inputTextTokens,
          outputTextTokens: data.usage.outputTextTokens,
        } : {}),
        status: "ended",
      })
      .where(eq(voiceSessions.id, sessionId));

    // Update user's voice spend + totals
    const userData = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
    const resetAt = userData[0]?.voiceSpendResetAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        voiceMonthlySpendCents: sql`${users.voiceMonthlySpendCents} + ${costCents}`,
        voiceTotalCostCents: sql`${users.voiceTotalCostCents} + ${costCents}`,
        voiceTotalSessions: sql`${users.voiceTotalSessions} + 1`,
        voiceSpendResetAt: resetAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId));

    const costMethod = hasTokenData ? "tokens" : "duration-fallback";
    console.log(
      `[Voice] Ended session ${sessionId}: ${data.durationSeconds}s, ${data.commandCount} cmds, ${costCents}¢ (${costMethod})`
    );
    return { costCents };
  } catch (error) {
    console.error("[Voice] endVoiceSession error:", error);
    return { error: "Failed to end voice session" };
  }
}

/**
 * Get user's voice usage stats for billing display.
 */
export async function getVoiceUsageStats(userId: string): Promise<{
  monthlySpendCents: number;
  monthlyBudgetCents: number;
  totalCostCents: number;
  totalSessions: number;
  resetAt: Date | null;
} | null> {
  try {
    const userData = await findUser(userId);
    if (!userData) return null;

    const planLimits = PLAN_LIMITS[userData.plan as PlanType];

    return {
      monthlySpendCents: userData.voiceMonthlySpendCents,
      monthlyBudgetCents: planLimits.voiceBudgetCents,
      totalCostCents: userData.voiceTotalCostCents,
      totalSessions: userData.voiceTotalSessions,
      resetAt: userData.voiceSpendResetAt,
    };
  } catch (error) {
    console.error("[Voice] getVoiceUsageStats error:", error);
    return null;
  }
}
