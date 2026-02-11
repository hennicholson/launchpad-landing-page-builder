/**
 * Level 3: Section Intelligence API
 *
 * Generate, edit, and manage sections.
 * POST /api/ai/section
 */

import { NextRequest, NextResponse } from "next/server";
import {
  runClaude,
  checkAIGenerationsAvailable,
  trackAIUsage,
  calculateCost,
  buildPageContext,
  buildSectionContext,
  buildComponentLibraryContext,
} from "@/lib/ai";
import { SECTION_SYSTEM_PROMPT } from "@/lib/ai/prompts/system-prompts";
import { cleanJsonResponse, validateSectionJson, normalizeSection } from "@/lib/ai/response-processor";
import { getWhopUser } from "@/lib/whop";
import type { LandingPage, PageSection, SectionType } from "@/lib/page-schema";

export const maxDuration = 60; // 60 second timeout

interface RequestBody {
  action: "generate" | "edit" | "improve" | "add-items" | "suggest-variant";
  page: LandingPage;
  sectionType?: SectionType;
  sectionId?: string;
  instruction: string;
  itemCount?: number;
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
    const { action, page, sectionType, sectionId, instruction, itemCount } = body;

    if (!action || !page || !instruction) {
      return NextResponse.json(
        { error: "Missing required fields: action, page, instruction" },
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

    // Get existing section if editing
    const existingSection = sectionId ? page.sections.find((s) => s.id === sectionId) : undefined;

    let userMessage = "";

    switch (action) {
      case "generate":
        if (!sectionType) {
          return NextResponse.json(
            { error: "sectionType required for generate action" },
            { status: 400 }
          );
        }
        userMessage = `
Generate a new ${sectionType} section based on this instruction:
"${instruction}"

${buildPageContext(page)}

Requirements:
- Generate a complete ${sectionType} section
- Use realistic, compelling content
- Match the page's color scheme and style
${itemCount ? `- Include ${itemCount} items` : "- Include appropriate number of items"}

Return ONLY valid JSON for a PageSection object.
`;
        break;

      case "edit":
        if (!existingSection) {
          return NextResponse.json(
            { error: "Section not found for edit action" },
            { status: 400 }
          );
        }
        userMessage = `
Edit this ${existingSection.type} section based on this instruction:
"${instruction}"

${buildSectionContext(existingSection)}
${buildPageContext(page)}

Requirements:
- Keep the same section ID: ${existingSection.id}
- Only modify what the user requested
- Maintain consistency with the page style

Return ONLY the complete modified section as valid JSON.
`;
        break;

      case "improve":
        if (!existingSection) {
          return NextResponse.json(
            { error: "Section not found for improve action" },
            { status: 400 }
          );
        }
        userMessage = `
Improve this ${existingSection.type} section to be more compelling and conversion-focused.

${buildSectionContext(existingSection)}

Additional guidance: ${instruction || "Make it more engaging and professional"}

Requirements:
- Keep the same section ID: ${existingSection.id}
- Improve headlines, copy, and CTAs
- Maintain the same structure and type

Return ONLY the improved section as valid JSON.
`;
        break;

      case "add-items":
        if (!existingSection) {
          return NextResponse.json(
            { error: "Section not found for add-items action" },
            { status: 400 }
          );
        }
        userMessage = `
Add ${itemCount || 3} new items to this ${existingSection.type} section.

${buildSectionContext(existingSection)}

New items should:
- Match the style of existing items
- Be based on: "${instruction}"
- Have unique IDs

Return ONLY the complete section with old + new items as valid JSON.
`;
        break;

      case "suggest-variant":
        if (!existingSection) {
          return NextResponse.json(
            { error: "Section not found for suggest-variant action" },
            { status: 400 }
          );
        }
        userMessage = `
The user wants to explore different visual styles for this ${existingSection.type} section.

${buildSectionContext(existingSection)}

Available variants for ${existingSection.type}:
${getVariantsForType(existingSection.type)}

Suggest the best variant and modify the content to fit that variant.
${instruction ? `User preference: ${instruction}` : ""}

Return ONLY the modified section with the new variant as valid JSON.
`;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Execute
    const response = await runClaude(SECTION_SYSTEM_PROMPT, userMessage, { maxTokens: 4096 });

    // Track usage
    await trackAIUsage(user.id, "component", response.usage);
    const cost = calculateCost(response.usage);

    // Parse and validate response
    let section: PageSection;
    try {
      const cleanedJson = cleanJsonResponse(response.text);
      const parsed = JSON.parse(cleanedJson);
      const validation = validateSectionJson(parsed);

      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid section JSON: ${validation.errors.join(", ")}` },
          { status: 500 }
        );
      }

      section = normalizeSection(validation.section!);
    } catch (e) {
      return NextResponse.json(
        { error: `Failed to parse section: ${e instanceof Error ? e.message : "Unknown error"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      section,
      original: existingSection || null,
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
    console.error("[API /ai/section] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Get available variants for a section type
 */
function getVariantsForType(type: SectionType): string {
  const variants: Record<string, string[]> = {
    hero: ["default", "animated-preview", "email-signup", "sales-funnel"],
    features: ["default", "illustrated", "hover", "bento", "table"],
    testimonials: ["scrolling", "twitter-cards"],
    cta: ["centered", "split", "banner", "minimal"],
    stats: ["cards", "minimal", "bars", "circles"],
    process: ["timeline", "cards", "horizontal"],
    video: ["centered", "grid", "side-by-side", "fullscreen"],
    gallery: ["bento", "focusrail"],
    header: ["default", "header-2", "floating-header", "simple-header", "header-with-search"],
  };

  return variants[type]?.join(", ") || "default";
}
