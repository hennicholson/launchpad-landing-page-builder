/**
 * Level 2: Visual Enhancements API
 *
 * Color suggestions, typography, layout analysis.
 * POST /api/ai/visual
 */

import { NextRequest, NextResponse } from "next/server";
import {
  runClaude,
  runGemini,
  checkAIGenerationsAvailable,
  trackAIUsage,
  calculateCost,
} from "@/lib/ai";
import { VISUAL_SYSTEM_PROMPT } from "@/lib/ai/prompts/system-prompts";
import { cleanJsonResponse } from "@/lib/ai/response-processor";
import { getWhopUser } from "@/lib/whop";
import type { ColorScheme } from "@/lib/page-schema";

export const maxDuration = 45; // 45 second timeout

interface RequestBody {
  action: "suggest-colors" | "suggest-typography" | "analyze-layout" | "analyze-screenshot";
  currentColors?: ColorScheme;
  currentTypography?: { headingFont: string; bodyFont: string };
  screenshotBase64?: string;
  industry?: string;
  mood?: string;
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request
    const body: RequestBody = await request.json();
    const {
      action,
      currentColors,
      currentTypography,
      screenshotBase64,
      industry,
      mood,
      additionalContext,
    } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing required field: action" }, { status: 400 });
    }

    // Check limits
    const availability = await checkAIGenerationsAvailable(user.id, "copy");
    if (!availability.available) {
      return NextResponse.json(
        { error: "AI generation limit reached", used: availability.used, limit: availability.limit },
        { status: 429 }
      );
    }

    let userMessage = "";
    let useGemini = false;

    switch (action) {
      case "suggest-colors":
        userMessage = `
Suggest an improved color scheme for a landing page.

${currentColors ? `Current colors:
- Primary: ${currentColors.primary}
- Secondary: ${currentColors.secondary}
- Accent: ${currentColors.accent}
- Background: ${currentColors.background}
- Text: ${currentColors.text}` : "No current colors specified."}

${industry ? `Industry: ${industry}` : ""}
${mood ? `Desired mood: ${mood}` : ""}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Return a JSON object:
{
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex"
  },
  "reasoning": "Brief explanation of choices"
}
`;
        break;

      case "suggest-typography":
        userMessage = `
Suggest typography for a landing page.

${currentTypography ? `Current fonts:
- Heading: ${currentTypography.headingFont}
- Body: ${currentTypography.bodyFont}` : ""}

${industry ? `Industry: ${industry}` : ""}
${mood ? `Desired mood: ${mood}` : ""}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Return a JSON object:
{
  "typography": {
    "headingFont": "Font Name",
    "bodyFont": "Font Name"
  },
  "reasoning": "Brief explanation of choices"
}

Available fonts: Inter, Poppins, DM Sans, Playfair Display, Open Sans, Roboto, Lato, Montserrat
`;
        break;

      case "analyze-layout":
      case "analyze-screenshot":
        if (!screenshotBase64) {
          return NextResponse.json(
            { error: "Screenshot required for layout analysis" },
            { status: 400 }
          );
        }
        useGemini = true;
        userMessage = `
Analyze this landing page screenshot and provide specific improvement suggestions.

${additionalContext ? `User's concern: ${additionalContext}` : "Look for areas to improve conversion and visual appeal."}

Return a JSON object:
{
  "suggestions": [
    {
      "type": "spacing" | "alignment" | "hierarchy" | "color" | "typography" | "cta" | "layout",
      "element": "What element needs attention",
      "issue": "What's wrong",
      "recommendation": "How to fix it",
      "priority": "high" | "medium" | "low"
    }
  ],
  "overallScore": 1-10,
  "summary": "Brief overall assessment"
}
`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Execute with appropriate model
    const response = useGemini
      ? await runGemini(userMessage, {
          systemInstruction: VISUAL_SYSTEM_PROMPT,
          images: screenshotBase64 ? [screenshotBase64] : undefined,
        })
      : await runClaude(VISUAL_SYSTEM_PROMPT, userMessage, { maxTokens: 1500 });

    // Track usage
    await trackAIUsage(user.id, "copy", response.usage);
    const cost = calculateCost(response.usage);

    // Parse JSON response
    let result;
    try {
      const cleanedJson = cleanJsonResponse(response.text);
      result = JSON.parse(cleanedJson);
    } catch {
      result = { raw: response.text };
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      model: useGemini ? "gemini" : "claude",
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
    console.error("[API /ai/visual] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
