/**
 * Level 1: Inline Text Improvements API
 *
 * Quick text improvements for headlines, CTAs, descriptions.
 * POST /api/ai/inline
 */

import { NextRequest, NextResponse } from "next/server";
import { runClaude, checkAIGenerationsAvailable, trackAIUsage, calculateCost } from "@/lib/ai";
import { INLINE_SYSTEM_PROMPT } from "@/lib/ai/prompts/system-prompts";
import { getWhopUser } from "@/lib/whop";

export const maxDuration = 30; // 30 second timeout for inline edits

interface RequestBody {
  action: "improve" | "rewrite" | "shorten" | "expand" | "add-urgency" | "professional" | "casual";
  field: string;
  currentValue: string;
  sectionType: string;
  additionalContext?: string;
}

const ACTION_INSTRUCTIONS: Record<string, string> = {
  improve: "Improve this text to be more compelling and conversion-focused",
  rewrite: "Completely rewrite this text with a fresh angle while keeping the core message",
  shorten: "Make this more concise while keeping the key message",
  expand: "Add more detail and context while keeping it engaging",
  "add-urgency": "Add urgency and scarcity to increase conversions",
  professional: "Make this more professional and authoritative",
  casual: "Make this more casual and conversational",
};

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body: RequestBody = await request.json();
    const { action, field, currentValue, sectionType, additionalContext } = body;

    if (!action || !field || !currentValue) {
      return NextResponse.json(
        { error: "Missing required fields: action, field, currentValue" },
        { status: 400 }
      );
    }

    // Check limits
    const availability = await checkAIGenerationsAvailable(user.id, "copy");
    if (!availability.available) {
      return NextResponse.json(
        { error: "AI generation limit reached", used: availability.used, limit: availability.limit },
        { status: 429 }
      );
    }

    // Build prompt
    const instruction = ACTION_INSTRUCTIONS[action] || ACTION_INSTRUCTIONS.improve;
    const userMessage = `
Action: ${instruction}
Field type: ${field}
Section type: ${sectionType}
Current text: "${currentValue}"
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Return ONLY the improved text. No quotes, no explanation, just the new text.
`;

    // Execute
    const response = await runClaude(INLINE_SYSTEM_PROMPT, userMessage, { maxTokens: 1024 });

    // Track usage
    await trackAIUsage(user.id, "copy", response.usage);
    const cost = calculateCost(response.usage);

    return NextResponse.json({
      success: true,
      original: currentValue,
      improved: response.text.trim(),
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        costCents: cost.totalCostCents,
      },
      remaining: {
        used: availability.used + 1,
        limit: availability.limit,
      },
    });
  } catch (error) {
    console.error("[API /ai/inline] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
