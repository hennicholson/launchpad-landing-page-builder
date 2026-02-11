/**
 * AI Usage API
 *
 * Get current user's AI usage stats.
 * GET /api/ai/usage
 */

import { NextResponse } from "next/server";
import { getAIUsageStats } from "@/lib/ai";
import { getWhopUser } from "@/lib/whop";

export async function GET() {
  try {
    // Get authenticated user
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get usage stats
    const stats = await getAIUsageStats(user.id);

    if (!stats) {
      // Return default values if no stats found
      return NextResponse.json({
        copyUsed: 0,
        copyLimit: 100,
        componentUsed: 0,
        componentLimit: 20,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCostCents: 0,
        resetAt: null,
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[API /ai/usage] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
