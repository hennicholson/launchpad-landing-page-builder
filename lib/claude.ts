import Anthropic from "@anthropic-ai/sdk";
import type { LandingPage, PageSection, SectionType } from "./page-schema";
import { generateId } from "./page-schema";
import { db } from "./db";
import { users, PLAN_LIMITS, type PlanType } from "./schema";
import { eq, sql } from "drizzle-orm";
import { orchestratePage, type OrchestrationInput, type OrchestrationProgress } from "./ai/orchestrator/index";

// Re-export orchestration types for consumers
export type { OrchestrationProgress } from "./ai/orchestrator/index";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Claude Sonnet 4 pricing (per million tokens)
const CLAUDE_PRICING = {
  input: 3.00,   // $3.00 per 1M input tokens
  output: 15.00, // $15.00 per 1M output tokens
};

// Max tokens configuration
const MAX_TOKENS = {
  landingPage: 4096,
  section: 2048,
};

export type AIUsageResult = {
  inputTokens: number;
  outputTokens: number;
  costCents: number;
};

/**
 * Calculate cost in cents from token usage
 */
function calculateCostCents(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * CLAUDE_PRICING.input;
  const outputCost = (outputTokens / 1_000_000) * CLAUDE_PRICING.output;
  return Math.ceil((inputCost + outputCost) * 100); // Convert to cents, round up
}

/**
 * Check if user has AI generations available and handle reset
 */
export async function checkAIGenerationsAvailable(
  userId: string,
  type: "copy" | "component"
): Promise<{ available: boolean; used: number; limit: number; error?: string }> {
  try {
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData) {
      return { available: false, used: 0, limit: 0, error: "User not found" };
    }

    const planLimits = PLAN_LIMITS[userData.plan as PlanType];
    const limit = type === "copy" ? planLimits.aiCopyGenerations : planLimits.aiComponentGenerations;
    const used = type === "copy" ? userData.aiCopyGenerationsUsed : userData.aiComponentGenerationsUsed;

    // Check if we need to reset (30 days since first use)
    if (userData.aiUsageResetAt && new Date() >= userData.aiUsageResetAt) {
      // Reset the counters
      await db
        .update(users)
        .set({
          aiCopyGenerationsUsed: 0,
          aiComponentGenerationsUsed: 0,
          aiUsageResetAt: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
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
  inputTokens: number,
  outputTokens: number
): Promise<void> {
  try {
    const costCents = calculateCostCents(inputTokens, outputTokens);
    const incrementField = type === "copy" ? users.aiCopyGenerationsUsed : users.aiComponentGenerationsUsed;

    // Get current user to check if this is first AI usage
    const [userData] = await db
      .select({ aiUsageResetAt: users.aiUsageResetAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Set reset date if first usage (30 days from now)
    const resetAt = userData?.aiUsageResetAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db
      .update(users)
      .set({
        [type === "copy" ? "aiCopyGenerationsUsed" : "aiComponentGenerationsUsed"]: sql`${incrementField} + 1`,
        aiTotalInputTokens: sql`${users.aiTotalInputTokens} + ${inputTokens}`,
        aiTotalOutputTokens: sql`${users.aiTotalOutputTokens} + ${outputTokens}`,
        aiTotalCostCents: sql`${users.aiTotalCostCents} + ${costCents}`,
        aiUsageResetAt: resetAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    console.log(`[AI] Tracked usage for user ${userId}: ${type}, ${inputTokens} in, ${outputTokens} out, ${costCents}¢`);
  } catch (error) {
    console.error("[AI] trackAIUsage error:", error);
  }
}

const LANDING_PAGE_SCHEMA = `
{
  "title": "string - Page title for SEO",
  "description": "string - Meta description for SEO",
  "sections": [
    {
      "id": "string - unique identifier",
      "type": "hero | features | testimonials | pricing | cta | faq",
      "content": {
        "heading": "string",
        "subheading": "string (optional)",
        "bodyText": "string (optional)",
        "buttonText": "string (optional)",
        "buttonLink": "string (optional)",
        "backgroundColor": "hex color",
        "textColor": "hex color",
        "layout": "left | right | center | grid"
      },
      "items": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "icon": "string (optional)",
          "imageUrl": "string (optional)",
          "price": "string (optional, for pricing)",
          "features": ["string array (optional, for pricing)"],
          "author": "string (optional, for testimonials)",
          "role": "string (optional, for testimonials)"
        }
      ]
    }
  ],
  "colorScheme": {
    "primary": "hex color",
    "secondary": "hex color",
    "accent": "hex color",
    "background": "hex color",
    "text": "hex color"
  },
  "typography": {
    "headingFont": "Inter | Poppins | Playfair Display",
    "bodyFont": "Inter | Open Sans | Roboto"
  }
}
`;

const SYSTEM_PROMPT = `You are an expert landing page designer and copywriter. Your job is to generate high-converting funnel landing pages based on user prompts.

When generating a landing page:
1. Write compelling, benefit-focused copy that addresses the target audience's pain points
2. Use a clear value proposition in the hero section
3. Include social proof (testimonials) when appropriate
4. Create a logical flow from awareness to action
5. Use action-oriented button text
6. Choose colors that match the brand/industry feel

Output ONLY valid JSON matching this schema:
${LANDING_PAGE_SCHEMA}

Important:
- Generate unique IDs for each section and item (use random 7-character strings)
- Use realistic placeholder content, never "Lorem ipsum"
- Choose appropriate section types based on the product/service
- Keep copy concise but impactful
- Use modern, professional color schemes`;

/**
 * Wizard data for enhanced page generation
 */
export interface WizardData {
  businessName: string;
  productDescription: string;
  targetAudience: string;
  colorTheme: "dark" | "light" | "midnight" | "forest" | "ocean" | "sunset" | "custom";
  vibe: "modern" | "minimal" | "bold" | "professional" | "playful" | "elegant" | "techy";
  fontPair: "anton-inter" | "playfair-inter" | "space-grotesk-inter" | "poppins-inter" | "inter-inter";
  pageType: "landing" | "sales-funnel" | "product" | "lead-magnet" | "auto";
}

// Theme color schemes for each theme option
const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string; background: string; text: string }> = {
  dark: {
    primary: "#D6FC51",
    secondary: "#a3c941",
    accent: "#D6FC51",
    background: "#0a0a0a",
    text: "#ffffff",
  },
  light: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#111827",
  },
  midnight: {
    primary: "#818cf8",
    secondary: "#6366f1",
    accent: "#a78bfa",
    background: "#0f172a",
    text: "#f1f5f9",
  },
  forest: {
    primary: "#22c55e",
    secondary: "#16a34a",
    accent: "#a3e635",
    background: "#052e16",
    text: "#f0fdf4",
  },
  ocean: {
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#2dd4bf",
    background: "#083344",
    text: "#ecfeff",
  },
  sunset: {
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#facc15",
    background: "#1c1917",
    text: "#fef3c7",
  },
};

// Font pairings
const FONT_PAIRS: Record<string, { heading: string; body: string }> = {
  "anton-inter": { heading: "Anton", body: "Inter" },
  "playfair-inter": { heading: "Playfair Display", body: "Inter" },
  "space-grotesk-inter": { heading: "Space Grotesk", body: "Inter" },
  "poppins-inter": { heading: "Poppins", body: "Inter" },
  "inter-inter": { heading: "Inter", body: "Inter" },
};

function buildEnhancedSystemPrompt(wizardData?: WizardData): string {
  if (!wizardData) return SYSTEM_PROMPT;

  const colors = THEME_COLORS[wizardData.colorTheme] || THEME_COLORS.dark;
  const fonts = FONT_PAIRS[wizardData.fontPair] || FONT_PAIRS["inter-inter"];

  const pageTypeInstructions: Record<string, string> = {
    landing: `
SECTION STRUCTURE (Standard Landing Page):
1. Header (navigation)
2. Hero (main value proposition)
3. Logo Cloud (social proof)
4. Features (3-4 key benefits)
5. Stats (credibility numbers)
6. Testimonials (2-3 customer quotes)
7. Pricing (if applicable)
8. FAQ (3-5 questions)
9. CTA (final conversion)
10. Footer`,
    "sales-funnel": `
SECTION STRUCTURE (High-Converting Sales Funnel):
1. Hero (urgency-focused, sales-funnel variant)
2. Value Proposition (story-based problem/solution)
3. Features (what they get with benefits)
4. Creator (trust building, about section)
5. Offer Details (full value breakdown)
6. Testimonials (proof and results)
7. Comparison (vs alternatives)
8. Pricing (clear offer with urgency)
9. FAQ (objection handling)
10. CTA (final push with scarcity)`,
    product: `
SECTION STRUCTURE (Product Page):
1. Header (navigation)
2. Hero (product showcase)
3. Features (key product features)
4. Gallery (product images)
5. Stats (product metrics)
6. Testimonials (customer reviews)
7. Pricing (product pricing)
8. FAQ (product questions)
9. CTA (buy now)
10. Footer`,
    "lead-magnet": `
SECTION STRUCTURE (Lead Magnet Page):
1. Header (minimal navigation)
2. Hero (lead magnet offer)
3. Benefits (what they'll learn/get)
4. Preview (sneak peek of content)
5. Testimonials (social proof)
6. CTA (email capture form)
7. Footer (minimal)`,
    auto: `
SECTION STRUCTURE (Based on product/service type):
Choose the most appropriate structure. Include 7-10 sections with logical flow.`,
  };

  return `${SYSTEM_PROMPT}

STYLE REQUIREMENTS FOR THIS PAGE:
- Design Vibe: ${wizardData.vibe}
${wizardData.vibe === "modern" ? "  → Clean lines, contemporary feel, cutting-edge visuals" : ""}
${wizardData.vibe === "minimal" ? "  → Lots of whitespace, simple layouts, focused content" : ""}
${wizardData.vibe === "bold" ? "  → Strong contrasts, impactful headlines, attention-grabbing CTAs" : ""}
${wizardData.vibe === "professional" ? "  → Trustworthy, authoritative tone, business-focused" : ""}
${wizardData.vibe === "playful" ? "  → Fun, creative copy, energetic feel" : ""}
${wizardData.vibe === "elegant" ? "  → Sophisticated, refined, premium positioning" : ""}
${wizardData.vibe === "techy" ? "  → Futuristic, innovative, tech-forward" : ""}

COLOR SCHEME (Use these exact colors):
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent}
- Background: ${colors.background}
- Text: ${colors.text}

TYPOGRAPHY:
- Heading Font: ${fonts.heading}
- Body Font: ${fonts.body}

${pageTypeInstructions[wizardData.pageType] || pageTypeInstructions.landing}

TARGET AUDIENCE: ${wizardData.targetAudience || "General audience"}

IMPORTANT:
- Write copy that speaks directly to the target audience
- Use the ${wizardData.vibe} tone throughout all copy
- Ensure all colors match the scheme above exactly`;
}

/**
 * Generate a landing page using the multi-phase AI orchestrator
 *
 * This uses a 4-phase approach:
 * 1. Understanding: Analyze intent and extract product/audience info
 * 2. Planning: Create blueprint with copy framework (AIDA/PAS/BAB)
 * 3. Generation: Generate each section with context awareness
 * 4. Validation: Check quality and auto-fix issues
 */
export async function generateLandingPage(
  prompt: string,
  userId?: string,
  wizardData?: WizardData,
  onProgress?: (progress: OrchestrationProgress) => void
): Promise<LandingPage & { usage?: AIUsageResult }> {
  // Convert wizard data to orchestration input format
  const orchestrationInput: OrchestrationInput = {
    description: prompt,
    wizardData: wizardData ? {
      businessName: wizardData.businessName,
      productDescription: wizardData.productDescription,
      targetAudience: wizardData.targetAudience,
      colorTheme: wizardData.colorTheme,
      vibe: wizardData.vibe,
      fontPair: wizardData.fontPair,
      pageType: wizardData.pageType,
    } : undefined,
    preferences: {
      sectionCount: 7, // Reduced from 9 to speed up generation
      enableRefinement: false, // Disabled to avoid Netlify timeout
    },
  };

  // Run the orchestrator
  const result = await orchestratePage(orchestrationInput, onProgress);

  if (!result.success || !result.page) {
    console.error("[generateLandingPage] Orchestrator failed:", result.error);
    throw new Error(result.error || "Failed to generate landing page. Please try again.");
  }

  // Calculate usage and cost
  const tokensUsed = result.metadata?.tokensUsed || 0;
  // Estimate input/output split (roughly 70/30 based on typical generation)
  const inputTokens = Math.round(tokensUsed * 0.7);
  const outputTokens = Math.round(tokensUsed * 0.3);
  const costCents = calculateCostCents(inputTokens, outputTokens);

  // Track usage in database if userId provided
  if (userId) {
    await trackAIUsage(userId, "copy", inputTokens, outputTokens);
  }

  return {
    ...result.page,
    usage: { inputTokens, outputTokens, costCents },
  };
}

export async function regenerateSection(
  currentPage: LandingPage,
  sectionType: SectionType,
  instructions: string,
  userId?: string
): Promise<PageSection & { usage?: AIUsageResult }> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: MAX_TOKENS.section,
    system: `You are an expert landing page designer. Generate a single section for a landing page.

Current page context:
- Title: ${currentPage.title}
- Color scheme: ${JSON.stringify(currentPage.colorScheme)}
- Existing sections: ${currentPage.sections.map((s) => s.type).join(", ")}

Output ONLY valid JSON for a single section matching this structure:
{
  "id": "unique-string",
  "type": "${sectionType}",
  "content": { ... },
  "items": [ ... ]
}`,
    messages: [
      {
        role: "user",
        content: `Generate a ${sectionType} section with these instructions: ${instructions}

Output only the JSON, no markdown formatting.`,
      },
    ],
  });

  // Track token usage
  const inputTokens = response.usage?.input_tokens || 0;
  const outputTokens = response.usage?.output_tokens || 0;
  const costCents = calculateCostCents(inputTokens, outputTokens);

  // Track usage in database if userId provided
  if (userId) {
    await trackAIUsage(userId, "component", inputTokens, outputTokens);
  }

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const section = JSON.parse(jsonStr) as PageSection;
    section.id = section.id || generateId();
    return { ...section, usage: { inputTokens, outputTokens, costCents } };
  } catch (error) {
    console.error("Failed to parse section response:", jsonStr);
    throw new Error("Failed to generate section. Please try again.");
  }
}

type PageContext = {
  title: string;
  colorScheme: LandingPage["colorScheme"];
  typography: LandingPage["typography"];
  existingSections: string[];
};

export async function regenerateSectionWithContext(
  sectionType: SectionType,
  currentSection: PageSection,
  instructions: string,
  pageContext: PageContext,
  userId?: string
): Promise<PageSection & { usage?: AIUsageResult }> {
  const sectionSchema = `{
  "id": "string - keep the same ID",
  "type": "${sectionType}",
  "content": {
    "heading": "string",
    "subheading": "string (optional)",
    "bodyText": "string (optional)",
    "buttonText": "string (optional)",
    "buttonLink": "string (optional)",
    "backgroundColor": "hex color - use ${pageContext.colorScheme.background}",
    "textColor": "hex color - use ${pageContext.colorScheme.text}",
    "accentColor": "hex color - use ${pageContext.colorScheme.accent}",
    "badge": "string (optional, for badges/labels)",
    "accentHeading": "string (optional, accent colored text)"
  },
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "imageUrl": "string (optional, use Unsplash URLs)",
      "price": "string (optional, for pricing)",
      "features": ["string array (optional, for pricing)"],
      "author": "string (optional, for testimonials)",
      "role": "string (optional, for testimonials)"
    }
  ]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: MAX_TOKENS.section,
    system: `You are an expert landing page designer and copywriter. You're editing a ${sectionType} section based on user instructions.

Page context:
- Title: ${pageContext.title}
- Color scheme: Primary ${pageContext.colorScheme.primary}, Accent ${pageContext.colorScheme.accent}, Background ${pageContext.colorScheme.background}
- Typography: Headings use ${pageContext.typography.headingFont}, Body uses ${pageContext.typography.bodyFont}

Current section content:
${JSON.stringify(currentSection, null, 2)}

Your task is to modify this section based on the user's instructions while:
1. Keeping the same section type (${sectionType})
2. Preserving the ID
3. Maintaining consistency with the page's color scheme and style
4. Writing compelling, conversion-focused copy
5. Using realistic content (never Lorem ipsum)

Output ONLY valid JSON matching this structure:
${sectionSchema}`,
    messages: [
      {
        role: "user",
        content: `Modify this ${sectionType} section with these instructions: "${instructions}"

Keep what works, change what the user requested. Output only valid JSON, no markdown formatting or explanation.`,
      },
    ],
  });

  // Track token usage
  const inputTokens = response.usage?.input_tokens || 0;
  const outputTokens = response.usage?.output_tokens || 0;
  const costCents = calculateCostCents(inputTokens, outputTokens);

  // Track usage in database if userId provided
  if (userId) {
    await trackAIUsage(userId, "component", inputTokens, outputTokens);
  }

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const section = JSON.parse(jsonStr) as PageSection;
    // Preserve the original ID
    section.id = currentSection.id;
    // Ensure items have IDs
    if (section.items) {
      section.items = section.items.map((item, index) => ({
        ...item,
        id: item.id || currentSection.items?.[index]?.id || generateId(),
      }));
    }
    return { ...section, usage: { inputTokens, outputTokens, costCents } };
  } catch (error) {
    console.error("Failed to parse section response:", jsonStr);
    throw new Error("Failed to generate section. Please try again.");
  }
}
