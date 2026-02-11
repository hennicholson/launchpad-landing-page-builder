/**
 * Level 4: Page Generation API
 *
 * Uses background function pattern to avoid Netlify timeout limits.
 *
 * POST /api/ai/page - Trigger generation (returns generationId)
 * GET /api/ai/page?id=xxx - Poll for status
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiGenerations } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { checkAIGenerationsAvailable, trackAIUsage, calculateCost } from "@/lib/ai";
import { getWhopUser } from "@/lib/whop";
import { generateId } from "@/lib/page-schema";

export const maxDuration = 30; // Short timeout - we just trigger and return

interface RequestBody {
  action: "generate" | "regenerate" | "optimize";
  description: string;
  industry?: string;
  style?: "modern" | "minimal" | "bold" | "professional" | "playful";
  colorPreference?: "dark" | "light" | "colorful";
  additionalContext?: string;
  wizardData?: {
    businessName?: string;
    productDescription?: string;
    targetAudience?: string;
    colorTheme?: string;
    vibe?: string;
    fontPair?: string;
    pageType?: string;
  };
}

/**
 * GET - Poll for generation status
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get("id");

    if (!generationId) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    // Get generation status from database
    const [generation] = await db
      .select()
      .from(aiGenerations)
      .where(eq(aiGenerations.id, generationId))
      .limit(1);

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // Verify ownership
    if (generation.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      result: generation.result,
      error: generation.error,
    });
  } catch (error) {
    console.error("[API /ai/page GET] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST - Trigger background generation
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body: RequestBody = await request.json();
    const { action, description, industry, style, colorPreference, additionalContext, wizardData } = body;

    if (!action || !description) {
      return NextResponse.json(
        { error: "Missing required fields: action, description" },
        { status: 400 }
      );
    }

    // Check limits
    const availability = await checkAIGenerationsAvailable(user.id, "component");
    if (!availability.available) {
      return NextResponse.json(
        { error: "AI generation limit reached", used: availability.used, limit: availability.limit },
        { status: 429 }
      );
    }

    // Build enhanced description
    let enhancedDescription = description;
    if (industry) enhancedDescription += ` Industry: ${industry}.`;
    if (style) enhancedDescription += ` Style: ${style}.`;
    if (colorPreference) enhancedDescription += ` Color preference: ${colorPreference}.`;
    if (additionalContext) enhancedDescription += ` ${additionalContext}`;

    // Create generation record in database
    const generationId = generateId();
    const input = {
      action,
      description: enhancedDescription,
      wizardData: wizardData || undefined,
    };

    await db.insert(aiGenerations).values({
      id: generationId,
      userId: user.id,
      status: "pending",
      input,
    });

    console.log(`[API /ai/page] Created generation ${generationId}, triggering background function...`);

    // Trigger background function (fire-and-forget)
    const backgroundUrl = `${process.env.URL || "https://onwhop.com"}/.netlify/functions/ai-generation-background`;

    // Don't await - fire and forget
    fetch(backgroundUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationId,
        description: enhancedDescription,
        wizardData,
      }),
    }).catch((err) => {
      console.error("[API /ai/page] Failed to trigger background function:", err);
    });

    // Track usage immediately (we'll charge even if generation fails)
    const tokenUsage = { inputTokens: 2000, outputTokens: 4000, model: "claude" as const };
    await trackAIUsage(user.id, "component", tokenUsage);

    // Return immediately with generation ID
    return NextResponse.json({
      success: true,
      generationId,
      status: "pending",
      message: "Generation started. Poll GET /api/ai/page?id=xxx for status.",
    });
  } catch (error) {
    console.error("[API /ai/page POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
