/**
 * Section Generator Agent - Phase 3
 *
 * Generates individual sections with full context awareness.
 * This is the core generation agent that produces high-quality content.
 */

import { runOrchestrator } from "../anthropic-client";
import { cleanJsonResponse } from "@/lib/ai/response-processor";
import { generateId } from "@/lib/page-schema";
import type { PageSection, SectionType } from "@/lib/page-schema";
import type {
  GenerationContext,
  SectionPlan,
  PageIntent,
  PageBlueprint,
  SectionGenerationResult,
} from "../types";
import { getSectionTypeInfo } from "../context/template-patterns";
import { getSectionCopyGuidelines } from "../context/copy-frameworks";

/**
 * Base system prompt for section generation
 */
const SECTION_GENERATOR_BASE = `You are an expert landing page copywriter and designer.

Your job is to generate a SINGLE section with compelling, conversion-focused content.

CRITICAL RULES:
1. NEVER use placeholder text like "Lorem ipsum" or "Your text here"
2. Write SPECIFIC, REALISTIC content that matches the product/service
3. Use the EXACT color scheme provided
4. Follow the copy framework guidelines for this section's purpose
5. Generate unique 7-character IDs for the section and all items

Return ONLY valid JSON for a single PageSection object:
{
  "id": "7-char-id",
  "type": "section-type",
  "content": {
    "heading": "...",
    "subheading": "...",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "accentColor": "#hex",
    ...other content fields
  },
  "items": [
    {
      "id": "7-char-id",
      "title": "...",
      "description": "...",
      ...other item fields
    }
  ]
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanation.`;

/**
 * Build system prompt for a specific section
 */
function buildSectionSystemPrompt(
  sectionPlan: SectionPlan,
  blueprint: PageBlueprint,
  intent: PageIntent
): string {
  const sectionInfo = getSectionTypeInfo(sectionPlan.type);
  const copyGuidelines = getSectionCopyGuidelines(
    blueprint.copyFramework,
    sectionPlan.type,
    sectionPlan.purpose
  );

  // Build visual effects context
  const effectsContext = sectionPlan.effects?.length
    ? `\n## VISUAL EFFECTS TO APPLY (Premium Design)
This section uses the "${sectionPlan.variant}" variant (${sectionPlan.tier || 'standard'} tier).
Visual effects: ${sectionPlan.effects.join(', ')}
${sectionPlan.backgroundEffect ? `Background effect: ${sectionPlan.backgroundEffect}` : ''}

IMPORTANT: Include these visual properties in the content object:
- ${sectionPlan.type}Variant: "${sectionPlan.variant}"
${sectionPlan.backgroundEffect ? `- backgroundEffect: "${sectionPlan.backgroundEffect}"` : ''}
- Enable hover effects, animations, and premium styling as appropriate
`
    : '';

  return `${SECTION_GENERATOR_BASE}

## SECTION TYPE: ${sectionPlan.type.toUpperCase()}
Variant: ${sectionPlan.variant || 'default'}
Tier: ${sectionPlan.tier || 'standard'}

${sectionInfo}
${effectsContext}

## COLOR SCHEME (Use these exact colors)
- Background: ${blueprint.colorStrategy.background}
- Text: ${blueprint.colorStrategy.text}
- Primary/Accent: ${blueprint.colorStrategy.accent}
- Secondary: ${blueprint.colorStrategy.secondary}

## TYPOGRAPHY
- Heading Font: ${blueprint.typography.headingFont}
- Body Font: ${blueprint.typography.bodyFont}

## COPY FRAMEWORK: ${blueprint.copyFramework}
Section Purpose: ${sectionPlan.purpose}

${copyGuidelines}

## SPECIFIC GUIDELINES FOR THIS SECTION
${sectionPlan.copyGuidelines}

## PRODUCT CONTEXT
- Product Type: ${intent.productType}
- Target Audience: ${intent.targetAudience}
- Value Proposition: ${intent.primaryValueProp}
- Tone: ${intent.tone}
- Keywords: ${intent.keywords.join(", ")}
`;
}

/**
 * Build user message for section generation
 */
function buildSectionUserMessage(
  sectionPlan: SectionPlan,
  context: GenerationContext,
  previousSectionSummary: string
): string {
  return `
Generate a ${sectionPlan.type} section for this landing page.

SECTION DETAILS:
- Type: ${sectionPlan.type}
${sectionPlan.variant ? `- Variant: ${sectionPlan.variant}` : ""}
- Purpose in page: ${sectionPlan.purpose}
- Position: Section ${context.currentSectionIndex + 1} of ${context.totalSections}

${previousSectionSummary ? `PREVIOUS SECTION CONTEXT:\n${previousSectionSummary}\n` : ""}

REQUIREMENTS:
1. Write compelling, specific copy for ${context.blueprint.copyFramework} ${sectionPlan.purpose} stage
2. Target audience: "${context.intent.targetAudience}"
3. Main benefit to emphasize: "${context.intent.primaryValueProp}"
4. Tone: ${context.intent.tone}
${sectionPlan.keyElements?.length ? `5. Include these elements: ${sectionPlan.keyElements.join(", ")}` : ""}

Generate the complete section JSON now.`;
}

/**
 * Summarize a section for context in next generation
 */
function summarizePreviousSection(section: PageSection): string {
  const content = section.content;
  return `Previous section (${section.type}):
- Headline: "${content.heading || "N/A"}"
- Key message: "${content.subheading || content.bodyText?.slice(0, 100) || "N/A"}"
- Items: ${section.items?.length || 0} items`;
}

/**
 * Generate a single section
 */
export async function generateSection(
  sectionPlan: SectionPlan,
  context: GenerationContext
): Promise<SectionGenerationResult> {
  // Build context from previous sections
  const previousSections = context.previousSections;
  const lastSection = previousSections[previousSections.length - 1];
  const previousSectionSummary = lastSection
    ? summarizePreviousSection(lastSection)
    : "";

  // Build prompts
  const systemPrompt = buildSectionSystemPrompt(
    sectionPlan,
    context.blueprint,
    context.intent
  );
  const userMessage = buildSectionUserMessage(
    sectionPlan,
    context,
    previousSectionSummary
  );

  // Generate section
  const response = await runOrchestrator(systemPrompt, userMessage, {
    maxTokens: 2048,
  });

  try {
    const cleaned = cleanJsonResponse(response.text);
    const sectionData = JSON.parse(cleaned);

    // Ensure IDs
    const section: PageSection = {
      ...sectionData,
      id: sectionData.id || generateId(),
      type: sectionPlan.type,
      content: {
        ...sectionData.content,
        // Ensure colors are set
        backgroundColor:
          sectionData.content?.backgroundColor ||
          context.blueprint.colorStrategy.background,
        textColor:
          sectionData.content?.textColor || context.blueprint.colorStrategy.text,
        accentColor:
          sectionData.content?.accentColor ||
          context.blueprint.colorStrategy.accent,
      },
      items: sectionData.items?.map((item: { id?: string }) => ({
        ...item,
        id: item.id || generateId(),
      })),
    };

    // Set variant if specified
    if (sectionPlan.variant && section.content) {
      const variantKey = `${sectionPlan.type}Variant` as keyof typeof section.content;
      (section.content as Record<string, unknown>)[variantKey] = sectionPlan.variant;
    }

    // Apply premium visual effects
    if (section.content) {
      const contentRecord = section.content as Record<string, unknown>;

      // Apply background effect if specified
      if (sectionPlan.backgroundEffect) {
        contentRecord.backgroundEffect = sectionPlan.backgroundEffect;
      }

      // Apply subheading animation for premium tiers
      if (sectionPlan.tier === 'premium' || sectionPlan.tier === 'advanced') {
        if (!contentRecord.subheadingAnimation) {
          contentRecord.subheadingAnimation = 'stagger';
        }
      }
    }

    return {
      section,
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  } catch (error) {
    console.error(`[SectionGenerator] Parse error for ${sectionPlan.type}:`, error);
    console.error("[SectionGenerator] Raw response:", response.text);

    // Return a minimal valid section
    return {
      section: createFallbackSection(sectionPlan, context),
      tokensUsed: {
        input: response.usage.inputTokens,
        output: response.usage.outputTokens,
      },
    };
  }
}

/**
 * Create fallback section if generation fails
 */
function createFallbackSection(
  sectionPlan: SectionPlan,
  context: GenerationContext
): PageSection {
  const { blueprint, intent } = context;

  const baseContent = {
    heading: intent.primaryValueProp || "Welcome",
    subheading: `For ${intent.targetAudience}`,
    backgroundColor: blueprint.colorStrategy.background,
    textColor: blueprint.colorStrategy.text,
    accentColor: blueprint.colorStrategy.accent,
  };

  const section: PageSection = {
    id: generateId(),
    type: sectionPlan.type,
    content: baseContent,
  };

  // Add variant and premium effects
  if (sectionPlan.variant) {
    const variantKey = `${sectionPlan.type}Variant`;
    const contentRecord = section.content as Record<string, unknown>;
    contentRecord[variantKey] = sectionPlan.variant;

    // Apply background effect if specified
    if (sectionPlan.backgroundEffect) {
      contentRecord.backgroundEffect = sectionPlan.backgroundEffect;
    }

    // Apply animation for premium tiers
    if (sectionPlan.tier === 'premium' || sectionPlan.tier === 'advanced') {
      contentRecord.subheadingAnimation = 'stagger';
    }
  }

  // Add default items for list-based sections
  const listSections: SectionType[] = [
    "features",
    "testimonials",
    "pricing",
    "faq",
    "stats",
    "process",
  ];

  if (listSections.includes(sectionPlan.type)) {
    section.items = [
      {
        id: generateId(),
        title: "Key Feature",
        description: "Description of the feature benefit",
      },
      {
        id: generateId(),
        title: "Another Feature",
        description: "Another important benefit",
      },
      {
        id: generateId(),
        title: "Third Feature",
        description: "Yet another compelling benefit",
      },
    ];
  }

  return section;
}

/**
 * Generate all sections sequentially
 */
export async function generateAllSections(
  blueprint: PageBlueprint,
  intent: PageIntent,
  onProgress?: (current: number, total: number) => void
): Promise<{
  sections: PageSection[];
  totalTokens: { input: number; output: number };
}> {
  const sections: PageSection[] = [];
  const totalTokens = { input: 0, output: 0 };

  for (let i = 0; i < blueprint.sectionSequence.length; i++) {
    const sectionPlan = blueprint.sectionSequence[i];

    onProgress?.(i, blueprint.sectionSequence.length);

    const context: GenerationContext = {
      blueprint,
      intent,
      previousSections: sections,
      colorScheme: {
        primary: blueprint.colorStrategy.primary,
        secondary: blueprint.colorStrategy.secondary,
        accent: blueprint.colorStrategy.accent,
        background: blueprint.colorStrategy.background,
        text: blueprint.colorStrategy.text,
      },
      currentSectionIndex: i,
      totalSections: blueprint.sectionSequence.length,
    };

    const result = await generateSection(sectionPlan, context);
    sections.push(result.section);
    totalTokens.input += result.tokensUsed.input;
    totalTokens.output += result.tokensUsed.output;
  }

  onProgress?.(blueprint.sectionSequence.length, blueprint.sectionSequence.length);

  return { sections, totalTokens };
}
