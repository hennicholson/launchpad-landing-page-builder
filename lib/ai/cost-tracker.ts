import { db } from "../db";
import { users, PLAN_LIMITS, type PlanType } from "../schema";
import { eq, or, sql } from "drizzle-orm";
import type { TokenUsage, ModelType } from "./replicate-client";

/**
 * Replicate Pricing (per million tokens)
 *
 * Claude 4.5 Sonnet:
 * - Input: $3.00 per million tokens
 * - Output: $15.00 per million tokens ($0.015 per thousand)
 *
 * Gemini 3.0 Pro:
 * - Input (≤200k tokens): $2.00 per million tokens
 * - Input (>200k tokens): $12.00 per million tokens ($0.012 per thousand)
 * - Output (≤200k context): $12.00 per million tokens ($0.012 per thousand)
 * - Output (>200k context): $18.00 per million tokens ($0.018 per thousand)
 */
const REPLICATE_PRICING = {
  claude: {
    input: 3.0, // $3.00 per million
    output: 15.0, // $15.00 per million
  },
  gemini: {
    input: {
      standard: 2.0, // $2.00 per million (≤200k input tokens)
      extended: 12.0, // $12.00 per million (>200k input tokens)
    },
    output: {
      standard: 12.0, // $12.00 per million (≤200k context)
      extended: 18.0, // $18.00 per million (>200k context)
    },
    inputThreshold: 200_000, // 200k tokens
  },
};

export interface CostResult {
  inputCostCents: number;
  outputCostCents: number;
  totalCostCents: number;
}

/**
 * Calculate cost in cents from token usage
 */
export function calculateCost(usage: TokenUsage): CostResult {
  const { inputTokens, outputTokens, model } = usage;

  let inputCost: number;
  let outputCost: number;

  if (model === "claude") {
    inputCost = (inputTokens / 1_000_000) * REPLICATE_PRICING.claude.input;
    outputCost = (outputTokens / 1_000_000) * REPLICATE_PRICING.claude.output;
  } else {
    // Gemini - check if extended pricing applies based on input token count
    const isExtended = inputTokens > REPLICATE_PRICING.gemini.inputThreshold;

    const inputRate = isExtended
      ? REPLICATE_PRICING.gemini.input.extended
      : REPLICATE_PRICING.gemini.input.standard;

    const outputRate = isExtended
      ? REPLICATE_PRICING.gemini.output.extended
      : REPLICATE_PRICING.gemini.output.standard;

    inputCost = (inputTokens / 1_000_000) * inputRate;
    outputCost = (outputTokens / 1_000_000) * outputRate;
  }

  return {
    inputCostCents: Math.ceil(inputCost * 100),
    outputCostCents: Math.ceil(outputCost * 100),
    totalCostCents: Math.ceil((inputCost + outputCost) * 100),
  };
}

export interface AIUsageResult {
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  model: ModelType;
}

// Helper to check if string is valid UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Check if user has AI generations available and handle reset
 */
export async function checkAIGenerationsAvailable(
  userId: string,
  type: "copy" | "component"
): Promise<{ available: boolean; used: number; limit: number; error?: string }> {
  try {
    // Build conditions based on userId format
    // Only compare against uuid column if userId is valid UUID format
    const conditions = [eq(users.whopId, userId), eq(users.whopUniqueId, userId)];
    if (isValidUUID(userId)) {
      conditions.unshift(eq(users.id, userId));
    }

    const [userData] = await db.select().from(users).where(
      or(...conditions)
    ).limit(1);

    if (!userData) {
      return { available: false, used: 0, limit: 0, error: "User not found" };
    }

    const planLimits = PLAN_LIMITS[userData.plan as PlanType];
    const limit =
      type === "copy" ? planLimits.aiCopyGenerations : planLimits.aiComponentGenerations;
    const used =
      type === "copy" ? userData.aiCopyGenerationsUsed : userData.aiComponentGenerationsUsed;

    // Check if we need to reset (30 days since first use)
    if (userData.aiUsageResetAt && new Date() >= userData.aiUsageResetAt) {
      // Reset the counters (use actual user ID from database)
      await db
        .update(users)
        .set({
          aiCopyGenerationsUsed: 0,
          aiComponentGenerationsUsed: 0,
          aiUsageResetAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id));
      return { available: limit === -1 || limit > 0, used: 0, limit };
    }

    // -1 means unlimited
    if (limit === -1) {
      return { available: true, used, limit: -1 };
    }

    return { available: used < limit, used, limit };
  } catch (error) {
    console.error("[AI] checkAIGenerationsAvailable error:", error);
    return { available: false, used: 0, limit: 0, error: "Failed to check AI limits" };
  }
}

/**
 * Track AI usage after a generation
 */
export async function trackAIUsage(
  userId: string,
  type: "copy" | "component",
  usage: TokenUsage
): Promise<void> {
  try {
    const { totalCostCents } = calculateCost(usage);
    const incrementField =
      type === "copy" ? users.aiCopyGenerationsUsed : users.aiComponentGenerationsUsed;

    // Get current user to check if this is first AI usage
    // Build conditions based on userId format
    const trackConditions = [eq(users.whopId, userId), eq(users.whopUniqueId, userId)];
    if (isValidUUID(userId)) {
      trackConditions.unshift(eq(users.id, userId));
    }

    const [userData] = await db
      .select({ id: users.id, aiUsageResetAt: users.aiUsageResetAt })
      .from(users)
      .where(or(...trackConditions))
      .limit(1);

    // Set reset date if first usage (30 days from now)
    const resetAt = userData?.aiUsageResetAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Use the actual user ID from the database lookup
    const actualUserId = userData?.id || userId;

    await db
      .update(users)
      .set({
        [type === "copy" ? "aiCopyGenerationsUsed" : "aiComponentGenerationsUsed"]:
          sql`${incrementField} + 1`,
        aiTotalInputTokens: sql`${users.aiTotalInputTokens} + ${usage.inputTokens}`,
        aiTotalOutputTokens: sql`${users.aiTotalOutputTokens} + ${usage.outputTokens}`,
        aiTotalCostCents: sql`${users.aiTotalCostCents} + ${totalCostCents}`,
        aiUsageResetAt: resetAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, actualUserId));

    console.log(
      `[AI] Tracked usage for user ${userId}: ${type}, model=${usage.model}, ${usage.inputTokens} in, ${usage.outputTokens} out, ${totalCostCents}c`
    );
  } catch (error) {
    console.error("[AI] trackAIUsage error:", error);
  }
}

/**
 * Get user's current AI usage stats
 */
export async function getAIUsageStats(userId: string): Promise<{
  copyUsed: number;
  copyLimit: number;
  componentUsed: number;
  componentLimit: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostCents: number;
  resetAt: Date | null;
} | null> {
  try {
    // Build conditions based on userId format
    const statsConditions = [eq(users.whopId, userId), eq(users.whopUniqueId, userId)];
    if (isValidUUID(userId)) {
      statsConditions.unshift(eq(users.id, userId));
    }

    const [userData] = await db.select().from(users).where(
      or(...statsConditions)
    ).limit(1);

    if (!userData) {
      return null;
    }

    const planLimits = PLAN_LIMITS[userData.plan as PlanType];

    return {
      copyUsed: userData.aiCopyGenerationsUsed,
      copyLimit: planLimits.aiCopyGenerations,
      componentUsed: userData.aiComponentGenerationsUsed,
      componentLimit: planLimits.aiComponentGenerations,
      totalInputTokens: userData.aiTotalInputTokens,
      totalOutputTokens: userData.aiTotalOutputTokens,
      totalCostCents: userData.aiTotalCostCents,
      resetAt: userData.aiUsageResetAt,
    };
  } catch (error) {
    console.error("[AI] getAIUsageStats error:", error);
    return null;
  }
}
