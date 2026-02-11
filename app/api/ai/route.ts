/**
 * Main AI API Route
 *
 * Handles all AI requests through the orchestrator.
 * POST /api/ai
 */

import { NextRequest, NextResponse } from "next/server";
import { executeAIRequest, checkAIGenerationsAvailable } from "@/lib/ai";
import type { AIRequest, AILevel, AIAction } from "@/lib/ai";
import type { LandingPage, SectionType } from "@/lib/page-schema";
import { getWhopUser } from "@/lib/whop";

export const maxDuration = 60; // 60 second timeout for AI requests

interface RequestBody {
  level: AILevel;
  action: AIAction;
  instruction: string;
  page: LandingPage;
  selectedSectionId?: string;
  selectedField?: string;
  selectedItemId?: string;
  screenshotBase64?: string;
  targetSectionType?: SectionType;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: RequestBody = await request.json();
    const {
      level,
      action,
      instruction,
      page,
      selectedSectionId,
      selectedField,
      selectedItemId,
      screenshotBase64,
      targetSectionType,
    } = body;

    // Validate required fields
    if (!level || !action || !instruction || !page) {
      return NextResponse.json(
        { error: "Missing required fields: level, action, instruction, page" },
        { status: 400 }
      );
    }

    // Check AI generation limits
    const usageType = level <= 2 ? "copy" : "component";
    const availability = await checkAIGenerationsAvailable(user.id, usageType);

    if (!availability.available) {
      return NextResponse.json(
        {
          error: "AI generation limit reached",
          used: availability.used,
          limit: availability.limit,
        },
        { status: 429 }
      );
    }

    // Build AI request
    const aiRequest: AIRequest = {
      level,
      action,
      instruction,
      page,
      selectedSectionId,
      selectedField,
      selectedItemId,
      screenshotBase64,
      targetSectionType,
    };

    // Execute AI request
    const result = await executeAIRequest(aiRequest, user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "AI request failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      suggestion: result.suggestion,
      usage: result.usage,
      model: result.model,
      remaining: {
        used: availability.used + 1,
        limit: availability.limit,
      },
    });
  } catch (error) {
    console.error("[API /ai] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
