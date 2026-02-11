/**
 * Blueprint Planner Agent - Phase 2
 *
 * Creates the page blueprint including:
 * - Copy framework selection
 * - Section sequence with variants
 * - Color strategy
 * - Typography
 */

import { runOrchestrator } from "../anthropic-client";
import { cleanJsonResponse } from "@/lib/ai/response-processor";
import type {
  PageBlueprint,
  PageIntent,
  OrchestrationInput,
  SectionPlan,
  ColorStrategy,
  CopyFramework,
} from "../types";
import {
  matchTemplatePattern,
} from "../context/template-patterns";
import {
  selectCopyFramework,
  COPY_FRAMEWORKS,
  getSectionCopyGuidelines,
} from "../context/copy-frameworks";
import { selectPremiumVariant } from "../context/premium-variants";

/**
 * Color schemes based on themes
 */
const COLOR_SCHEMES: Record<string, ColorStrategy> = {
  dark: {
    mode: "dark",
    primary: "#D6FC51",
    secondary: "#a3c941",
    accent: "#D6FC51",
    background: "#0a0a0a",
    text: "#ffffff",
    psychology: "Bold, modern, tech-forward",
  },
  light: {
    mode: "light",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#111827",
    psychology: "Clean, trustworthy, professional",
  },
  midnight: {
    mode: "dark",
    primary: "#818cf8",
    secondary: "#6366f1",
    accent: "#a78bfa",
    background: "#0f172a",
    text: "#f1f5f9",
    psychology: "Premium, sophisticated, tech",
  },
  forest: {
    mode: "dark",
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#a3e635",
    background: "#052e16",
    text: "#f0fdf4",
    psychology: "Growth, natural, sustainable",
  },
  ocean: {
    mode: "dark",
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#2dd4bf",
    background: "#083344",
    text: "#ecfeff",
    psychology: "Calm, trustworthy, professional",
  },
  sunset: {
    mode: "dark",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#facc15",
    background: "#1c1917",
    text: "#fef3c7",
    psychology: "Warm, energetic, creative",
  },
};

/**
 * Font pairings
 */
const FONT_PAIRS: Record<string, { headingFont: string; bodyFont: string }> = {
  "anton-inter": { headingFont: "Anton", bodyFont: "Inter" },
  "playfair-inter": { headingFont: "Playfair Display", bodyFont: "Inter" },
  "space-grotesk-inter": { headingFont: "Space Grotesk", bodyFont: "Inter" },
  "poppins-inter": { headingFont: "Poppins", bodyFont: "Inter" },
  "inter-inter": { headingFont: "Inter", bodyFont: "Inter" },
};

/**
 * System prompt for blueprint planning
 */
const BLUEPRINT_SYSTEM_PROMPT = `You are a landing page architect creating a detailed blueprint for page generation.

Given the analyzed intent and template pattern, create a section-by-section blueprint.

Return ONLY valid JSON matching this structure:
{
  "copyFramework": "AIDA" | "PAS" | "BAB",
  "frameworkRationale": "Why this framework fits this product/audience",
  "sectionSequence": [
    {
      "type": "hero" | "features" | "testimonials" | "pricing" | "cta" | "faq" | "stats" | "process" | "header" | "footer" | "logoCloud" | "creator" | "comparison" | "value-proposition" | "offer-details" | "gallery" | "video",
      "variant": "variant name or null",
      "purpose": "attention" | "interest" | "desire" | "action" | "proof" | "objections" | "navigation" | "footer",
      "copyGuidelines": "Specific instructions for this section's copy",
      "keyElements": ["element1", "element2"]
    }
  ],
  "targetSectionCount": 9
}

SECTION TYPES available:
- header (navigation)
- hero (main attention grabber) - variants: default, animated-preview, email-signup, sales-funnel
- logoCloud (brand trust)
- stats (credibility numbers) - variants: cards, minimal, bars, circles
- features (benefits/capabilities) - variants: default, illustrated, hover, bento, table
- process (how it works) - variants: timeline, cards, horizontal
- testimonials (social proof) - variants: scrolling, twitter-cards
- creator (expert/founder bio)
- comparison (vs alternatives)
- value-proposition (story-based value)
- offer-details (what's included)
- pricing (pricing tables)
- faq (objection handling)
- cta (call to action) - variants: centered, split, banner, minimal
- footer

COPY FRAMEWORK Guidelines:
- AIDA: Attention → Interest → Desire → Action (best for SaaS, tech)
- PAS: Problem → Agitate → Solution (best for problem-solving, e-commerce)
- BAB: Before → After → Bridge (best for transformation, courses)

Return ONLY the JSON object, no markdown or explanation.`;

/**
 * Build user message for blueprint planning
 */
function buildBlueprintUserMessage(
  intent: PageIntent,
  templatePattern: ReturnType<typeof matchTemplatePattern>,
  input: OrchestrationInput
): string {
  return `
Create a page blueprint for:

PRODUCT TYPE: ${intent.productType}
TARGET AUDIENCE: ${intent.targetAudience}
PRIMARY VALUE PROP: ${intent.primaryValueProp}
TONE: ${intent.tone}
URGENCY: ${intent.urgencyLevel}
PRICE POINT: ${intent.pricePoint}

SUGGESTED TEMPLATE PATTERN: ${templatePattern.name}
- Copy Framework: ${templatePattern.copyFramework}
- Average Sections: ${templatePattern.avgSections}
- Conversion Tactics: ${templatePattern.conversionTactics.join(", ")}

${input.wizardData?.pageType && input.wizardData.pageType !== "auto" ? `USER REQUESTED PAGE TYPE: ${input.wizardData.pageType}` : ""}

Create a section sequence that:
1. Follows the ${templatePattern.copyFramework} framework progression
2. Includes appropriate variants for each section
3. Has specific copy guidelines for each section based on the product
4. Contains ${input.preferences?.sectionCount || 9} sections total

The copyGuidelines for each section should be SPECIFIC to this product, not generic.
`;
}

/**
 * Create page blueprint based on intent
 */
export async function createBlueprint(
  intent: PageIntent,
  input: OrchestrationInput
): Promise<{
  blueprint: PageBlueprint;
  tokensUsed: { input: number; output: number };
}> {
  // Match to template pattern
  const templatePattern = matchTemplatePattern(intent.productType, intent.keywords);

  // Select copy framework
  const copyFramework = selectCopyFramework(
    intent.productType,
    intent.urgencyLevel,
    intent.pricePoint
  );

  // Get color strategy from wizard or default
  const colorTheme = input.wizardData?.colorTheme || "dark";
  const colorStrategy = COLOR_SCHEMES[colorTheme] || COLOR_SCHEMES.dark;

  // Get typography from wizard or default
  const fontPair = input.wizardData?.fontPair || "inter-inter";
  const typography = FONT_PAIRS[fontPair] || FONT_PAIRS["inter-inter"];

  // Build user message
  const userMessage = buildBlueprintUserMessage(intent, templatePattern, input);

  // Call Claude for blueprint
  const response = await runOrchestrator(BLUEPRINT_SYSTEM_PROMPT, userMessage, {
    maxTokens: 2048,
  });

  try {
    const cleaned = cleanJsonResponse(response.text);
    const blueprintData = JSON.parse(cleaned);

    // Enhance section sequence with PREMIUM variant recommendations
    const vibe = input.wizardData?.vibe || "modern";
    const sectionSequence: SectionPlan[] = blueprintData.sectionSequence.map(
      (section: SectionPlan) => {
        // Select premium variant based on intent, vibe, and framework
        const variantSelection = selectPremiumVariant(
          section.type,
          intent,
          vibe,
          copyFramework
        );

        // Get copy guidelines from framework if not provided
        const copyGuidelines =
          section.copyGuidelines ||
          getSectionCopyGuidelines(copyFramework, section.type, section.purpose);

        return {
          ...section,
          variant: variantSelection.variant,
          effects: variantSelection.effects,
          backgroundEffect: variantSelection.backgroundEffect,
          tier: variantSelection.tier,
          copyGuidelines,
        };
      }
    );

    const blueprint: PageBlueprint = {
      copyFramework: blueprintData.copyFramework || copyFramework,
      frameworkRationale:
        blueprintData.frameworkRationale ||
        COPY_FRAMEWORKS[copyFramework].description,
      sectionSequence,
      colorStrategy,
      typography,
      targetSectionCount: blueprintData.targetSectionCount || 9,
    };

    return {
      blueprint,
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  } catch (error) {
    console.error("[BlueprintPlanner] Parse error:", error);
    console.error("[BlueprintPlanner] Raw response:", response.text);

    // Fall back to template pattern with premium variants
    const fallbackVibe = input.wizardData?.vibe || "modern";
    const fallbackBlueprint: PageBlueprint = {
      copyFramework,
      frameworkRationale: COPY_FRAMEWORKS[copyFramework].description,
      sectionSequence: templatePattern.sectionFlow.map((s) => {
        const variantSelection = selectPremiumVariant(s.type, intent, fallbackVibe, copyFramework);
        return {
          type: s.type,
          variant: variantSelection.variant,
          effects: variantSelection.effects,
          backgroundEffect: variantSelection.backgroundEffect,
          tier: variantSelection.tier,
          purpose: s.purpose,
          copyGuidelines: getSectionCopyGuidelines(copyFramework, s.type, s.purpose),
        };
      }),
      colorStrategy,
      typography,
      targetSectionCount: templatePattern.avgSections,
    };

    return {
      blueprint: fallbackBlueprint,
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  }
}
