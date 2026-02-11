/**
 * Intent Analyzer Agent - Phase 1
 *
 * Analyzes user input and wizard data to extract structured intent.
 * This determines what kind of page to generate and how to approach it.
 */

import { runOrchestrator } from "../anthropic-client";
import { cleanJsonResponse } from "@/lib/ai/response-processor";
import type { PageIntent, OrchestrationInput } from "../types";

/**
 * System prompt for intent analysis
 */
const INTENT_SYSTEM_PROMPT = `You are an expert at understanding business and marketing intent for landing page generation.

Your job is to analyze the user's description of their product/service and extract structured information that will guide page generation.

IMPORTANT: Extract real, useful information. Don't make generic assumptions.

Return ONLY valid JSON matching this exact structure:
{
  "productType": "saas" | "course" | "ecommerce" | "agency" | "leadmagnet" | "webinar" | "general",
  "targetAudience": "specific description of ideal customer",
  "primaryValueProp": "the main benefit/promise in clear language",
  "secondaryValueProps": ["additional benefit 1", "additional benefit 2"],
  "tone": "professional" | "casual" | "urgent" | "playful" | "technical" | "aspirational",
  "urgencyLevel": "low" | "medium" | "high",
  "pricePoint": "free" | "low" | "medium" | "premium" | "enterprise",
  "keywords": ["relevant", "keywords", "from", "description"],
  "competitorContext": "what alternatives exist or what they compare to",
  "uniqueDifferentiator": "what makes this unique vs competitors"
}

Guidelines for each field:

productType - Classify based on:
- saas: software, apps, tools, APIs, developer products
- course: education, training, coaching, workshops, tutorials
- ecommerce: physical products, retail, shopping
- agency: services, consulting, creative work
- leadmagnet: free resources, ebooks, guides, newsletters
- webinar: live events, masterclasses, workshops
- general: doesn't fit other categories

targetAudience - Be specific:
- BAD: "businesses" or "everyone"
- GOOD: "SaaS founders with 10-50 employees struggling to scale customer support"

primaryValueProp - The ONE main promise:
- BAD: "Great product that helps you"
- GOOD: "Cut customer support response time by 80% with AI automation"

tone - Match the language used:
- professional: formal, B2B, enterprise
- casual: friendly, conversational, startup
- urgent: time-sensitive, scarcity, FOMO
- playful: fun, creative, bold
- technical: developer-focused, detailed specs
- aspirational: transformation, lifestyle, dreams

urgencyLevel:
- low: informational, no pressure
- medium: some urgency, limited offer
- high: scarcity, deadline, FOMO-driven

pricePoint - Infer from language:
- free: completely free, open source
- low: budget-friendly, starter tier
- medium: mid-market, standard pricing
- premium: high-ticket, expensive
- enterprise: custom pricing, large orgs

keywords: Extract 5-10 important terms from the description

competitorContext: What alternatives exist (if mentioned or implied)

uniqueDifferentiator: What makes this different (if clear from description)

Return ONLY the JSON object, no markdown or explanation.`;

/**
 * Build user message from input
 */
function buildIntentUserMessage(input: OrchestrationInput): string {
  const parts: string[] = [];

  parts.push(`Analyze this landing page request:\n\n"${input.description}"`);

  if (input.wizardData) {
    parts.push(`\nAdditional context from user selections:`);
    if (input.wizardData.businessName) {
      parts.push(`- Business Name: ${input.wizardData.businessName}`);
    }
    if (input.wizardData.productDescription) {
      parts.push(`- Product/Service: ${input.wizardData.productDescription}`);
    }
    if (input.wizardData.targetAudience) {
      parts.push(`- Target Audience: ${input.wizardData.targetAudience}`);
    }
    if (input.wizardData.vibe) {
      parts.push(`- Desired Vibe: ${input.wizardData.vibe}`);
    }
    if (input.wizardData.pageType) {
      parts.push(`- Page Type: ${input.wizardData.pageType}`);
    }
  }

  parts.push(`\nExtract the structured intent from this information.`);

  return parts.join("\n");
}

/**
 * Analyze user input to extract structured intent
 */
export async function analyzeIntent(
  input: OrchestrationInput
): Promise<{ intent: PageIntent; tokensUsed: { input: number; output: number } }> {
  const userMessage = buildIntentUserMessage(input);

  const response = await runOrchestrator(INTENT_SYSTEM_PROMPT, userMessage, {
    maxTokens: 1024,
  });

  try {
    const cleaned = cleanJsonResponse(response.text);
    const intent = JSON.parse(cleaned) as PageIntent;

    // Validate and fill defaults
    const validated: PageIntent = {
      productType: intent.productType || "general",
      targetAudience: intent.targetAudience || "potential customers",
      primaryValueProp: intent.primaryValueProp || input.description.slice(0, 100),
      secondaryValueProps: intent.secondaryValueProps || [],
      tone: intent.tone || "professional",
      urgencyLevel: intent.urgencyLevel || "medium",
      pricePoint: intent.pricePoint || "medium",
      keywords: intent.keywords || [],
      competitorContext: intent.competitorContext,
      uniqueDifferentiator: intent.uniqueDifferentiator,
    };

    // If wizard data provided vibe, map to tone
    if (input.wizardData?.vibe) {
      const vibeToTone: Record<string, PageIntent["tone"]> = {
        modern: "professional",
        minimal: "professional",
        bold: "urgent",
        professional: "professional",
        playful: "playful",
        elegant: "aspirational",
        techy: "technical",
      };
      validated.tone = vibeToTone[input.wizardData.vibe] || validated.tone;
    }

    // If wizard data provided page type, map to product type
    if (input.wizardData?.pageType && input.wizardData.pageType !== "auto") {
      const pageTypeToProduct: Record<string, PageIntent["productType"]> = {
        landing: validated.productType, // Keep existing
        "sales-funnel": "course", // Sales funnels often for courses/products
        product: "ecommerce",
        "lead-magnet": "leadmagnet",
      };
      validated.productType =
        pageTypeToProduct[input.wizardData.pageType] || validated.productType;
    }

    return {
      intent: validated,
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  } catch (error) {
    console.error("[IntentAnalyzer] Parse error:", error);
    console.error("[IntentAnalyzer] Raw response:", response.text);

    // Return reasonable defaults
    return {
      intent: {
        productType: "general",
        targetAudience: input.wizardData?.targetAudience || "potential customers",
        primaryValueProp: input.description.slice(0, 100),
        secondaryValueProps: [],
        tone: "professional",
        urgencyLevel: "medium",
        pricePoint: "medium",
        keywords: input.description.split(" ").slice(0, 5),
      },
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  }
}
