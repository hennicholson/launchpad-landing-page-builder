/**
 * AI Orchestrator
 *
 * Routes tasks between Claude 4.5 Sonnet and Gemini 3.0 Pro based on task type.
 * Manages the AI request lifecycle and model selection.
 */

import { runClaude, runGemini, type AIResponse, type ModelType } from "./replicate-client";
import { calculateCost, trackAIUsage, type AIUsageResult } from "./cost-tracker";
import {
  buildFullContext,
  buildComponentLibraryContext,
  buildPageContext,
  buildSectionContext,
} from "./context-builder";
import { processAIResponse, cleanJsonResponse, validateSectionJson } from "./response-processor";
import {
  INLINE_SYSTEM_PROMPT,
  VISUAL_SYSTEM_PROMPT,
  SECTION_SYSTEM_PROMPT,
  PAGE_SYSTEM_PROMPT,
} from "./prompts/system-prompts";
import type { LandingPage, PageSection, SectionType } from "../page-schema";

export type AILevel = 1 | 2 | 3 | 4;
export type AIAction =
  | "improve-text"
  | "rewrite"
  | "shorten"
  | "expand"
  | "add-urgency"
  | "suggest-colors"
  | "suggest-layout"
  | "analyze-screenshot"
  | "generate-section"
  | "edit-section"
  | "add-section"
  | "reorder-sections"
  | "generate-page"
  | "generate-from-description";

export interface AIRequest {
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

export interface AISuggestion {
  type: "text" | "section" | "page" | "style";
  field?: string;
  sectionId?: string;
  itemId?: string;
  original: unknown;
  proposed: unknown;
}

export interface AIResult {
  success: boolean;
  suggestion?: AISuggestion;
  error?: string;
  usage: AIUsageResult;
  model: ModelType;
}

/**
 * Determine which model to use based on the action
 */
function selectModel(action: AIAction, hasScreenshot: boolean): ModelType {
  // Use Gemini for visual/image-related tasks
  if (hasScreenshot || action === "analyze-screenshot" || action === "suggest-layout") {
    return "gemini";
  }

  // Use Claude for everything else (content, reasoning, generation)
  return "claude";
}

/**
 * Get the appropriate system prompt based on level and action
 */
function getSystemPrompt(level: AILevel, action: AIAction): string {
  switch (level) {
    case 1:
      return INLINE_SYSTEM_PROMPT;
    case 2:
      return VISUAL_SYSTEM_PROMPT;
    case 3:
      return SECTION_SYSTEM_PROMPT;
    case 4:
      return PAGE_SYSTEM_PROMPT;
    default:
      return INLINE_SYSTEM_PROMPT;
  }
}

/**
 * Build the user message for the AI request
 */
function buildUserMessage(request: AIRequest): string {
  const { action, instruction, page, selectedSectionId, selectedField, selectedItemId, targetSectionType } =
    request;

  const selectedSection = selectedSectionId
    ? page.sections.find((s) => s.id === selectedSectionId)
    : undefined;

  let message = "";

  switch (action) {
    case "improve-text":
    case "rewrite":
    case "shorten":
    case "expand":
    case "add-urgency":
      if (selectedSection && selectedField) {
        const currentValue = selectedItemId
          ? selectedSection.items?.find((i) => i.id === selectedItemId)?.[
              selectedField as keyof typeof selectedSection.items[0]
            ]
          : selectedSection.content[selectedField as keyof typeof selectedSection.content];

        message = `
Action: ${action}
Field: ${selectedField}
Current Value: "${currentValue}"
${instruction ? `Additional Instructions: ${instruction}` : ""}

Return ONLY the improved text, no JSON, no explanation.
`;
      }
      break;

    case "suggest-colors":
      message = `
Analyze the current page and suggest an improved color scheme.
Current colors:
- Primary: ${page.colorScheme.primary}
- Secondary: ${page.colorScheme.secondary}
- Accent: ${page.colorScheme.accent}
- Background: ${page.colorScheme.background}
- Text: ${page.colorScheme.text}

${instruction ? `User request: ${instruction}` : "Suggest colors that improve conversion and visual appeal."}

Return a JSON object with the new color scheme:
{
  "primary": "#hex",
  "secondary": "#hex",
  "accent": "#hex",
  "background": "#hex",
  "text": "#hex",
  "reasoning": "Brief explanation of the color choices"
}
`;
      break;

    case "suggest-layout":
    case "analyze-screenshot":
      message = `
${instruction}

Analyze the visual layout and provide specific suggestions for improvement.
Return a JSON object with suggestions:
{
  "suggestions": [
    { "type": "spacing" | "alignment" | "hierarchy" | "color" | "typography", "description": "...", "priority": "high" | "medium" | "low" }
  ]
}
`;
      break;

    case "generate-section":
    case "add-section":
      message = `
Generate a new ${targetSectionType} section based on the following:
${instruction}

${buildPageContext(page)}

Return ONLY valid JSON for a complete PageSection object matching the ${targetSectionType} type.
Include realistic, compelling content - never use Lorem ipsum.
`;
      break;

    case "edit-section":
      if (selectedSection) {
        message = `
Edit this ${selectedSection.type} section based on the following instruction:
"${instruction}"

${buildSectionContext(selectedSection)}

Return ONLY the modified section as valid JSON.
Keep the same ID (${selectedSection.id}).
Only change what the user requested.
`;
      }
      break;

    case "reorder-sections":
      message = `
Current sections:
${page.sections.map((s, i) => `${i + 1}. ${s.type}: ${s.content.heading || "(no heading)"}`).join("\n")}

User request: ${instruction}

Return a JSON array with the section IDs in the new optimal order:
{ "order": ["id1", "id2", ...], "reasoning": "Brief explanation" }
`;
      break;

    case "generate-page":
    case "generate-from-description":
      message = `
Generate a complete landing page based on this description:
"${instruction}"

${buildComponentLibraryContext()}

Return ONLY valid JSON for a complete LandingPage object with:
- title and description (for SEO)
- sections array with at least 5-7 sections
- colorScheme (modern, professional colors)
- typography (appropriate font pairing)

Make it conversion-focused with compelling copy. Use realistic content.
`;
      break;

    default:
      message = instruction;
  }

  return message;
}

/**
 * Main orchestrator function - routes and executes AI requests
 */
export async function executeAIRequest(request: AIRequest, userId?: string): Promise<AIResult> {
  const { level, action, screenshotBase64 } = request;

  try {
    // Select the appropriate model
    const model = selectModel(action, !!screenshotBase64);

    // Get system prompt
    const systemPrompt = getSystemPrompt(level, action);

    // Build user message with context
    const userMessage = buildUserMessage(request);

    // Execute the request
    let response: AIResponse;

    if (model === "gemini") {
      response = await runGemini(userMessage, {
        systemInstruction: systemPrompt,
        images: screenshotBase64 ? [screenshotBase64] : undefined,
      });
    } else {
      response = await runClaude(systemPrompt, userMessage, {
        maxTokens: level === 4 ? 8192 : level === 3 ? 4096 : 2048,
      });
    }

    // Calculate costs
    const cost = calculateCost(response.usage);

    // Track usage if userId provided
    if (userId) {
      const usageType = level <= 2 ? "copy" : "component";
      await trackAIUsage(userId, usageType, response.usage);
    }

    // Process the response based on level
    const suggestion = processResponse(request, response.text);

    return {
      success: true,
      suggestion,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        costCents: cost.totalCostCents,
        model,
      },
      model,
    };
  } catch (error) {
    console.error("[AI Orchestrator] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
        costCents: 0,
        model: "claude",
      },
      model: "claude",
    };
  }
}

/**
 * Process the AI response and create a suggestion object
 */
function processResponse(request: AIRequest, responseText: string): AISuggestion {
  const { level, action, selectedSectionId, selectedField, selectedItemId, page } = request;

  // Level 1: Text improvements - return raw text
  if (level === 1) {
    const selectedSection = page.sections.find((s) => s.id === selectedSectionId);
    const currentValue = selectedItemId
      ? selectedSection?.items?.find((i) => i.id === selectedItemId)?.[
          selectedField as keyof typeof selectedSection.items[0]
        ]
      : selectedSection?.content[selectedField as keyof typeof selectedSection.content];

    return {
      type: "text",
      field: selectedField,
      sectionId: selectedSectionId,
      itemId: selectedItemId,
      original: currentValue,
      proposed: responseText.trim(),
    };
  }

  // Level 2: Style suggestions - parse JSON
  if (level === 2) {
    const jsonResponse = cleanJsonResponse(responseText);
    return {
      type: "style",
      original: page.colorScheme,
      proposed: JSON.parse(jsonResponse),
    };
  }

  // Level 3: Section operations - parse section JSON
  if (level === 3) {
    const jsonResponse = cleanJsonResponse(responseText);
    const proposedSection = JSON.parse(jsonResponse) as PageSection;
    const originalSection = page.sections.find((s) => s.id === selectedSectionId);

    return {
      type: "section",
      sectionId: selectedSectionId,
      original: originalSection,
      proposed: proposedSection,
    };
  }

  // Level 4: Page generation - parse full page JSON
  if (level === 4) {
    const jsonResponse = cleanJsonResponse(responseText);
    const proposedPage = JSON.parse(jsonResponse) as LandingPage;

    return {
      type: "page",
      original: page,
      proposed: proposedPage,
    };
  }

  // Default fallback
  return {
    type: "text",
    original: "",
    proposed: responseText,
  };
}

/**
 * Quick action handlers for common operations
 */
export const quickActions = {
  improveHeadline: (page: LandingPage, sectionId: string) =>
    executeAIRequest({
      level: 1,
      action: "improve-text",
      instruction: "Make this headline more compelling and benefit-focused",
      page,
      selectedSectionId: sectionId,
      selectedField: "heading",
    }),

  improveCTA: (page: LandingPage, sectionId: string) =>
    executeAIRequest({
      level: 1,
      action: "improve-text",
      instruction: "Make this CTA more action-oriented and urgent",
      page,
      selectedSectionId: sectionId,
      selectedField: "buttonText",
    }),

  shortenText: (page: LandingPage, sectionId: string, field: string) =>
    executeAIRequest({
      level: 1,
      action: "shorten",
      instruction: "Make this more concise while keeping the key message",
      page,
      selectedSectionId: sectionId,
      selectedField: field,
    }),

  expandText: (page: LandingPage, sectionId: string, field: string) =>
    executeAIRequest({
      level: 1,
      action: "expand",
      instruction: "Add more detail and context while keeping it engaging",
      page,
      selectedSectionId: sectionId,
      selectedField: field,
    }),

  addUrgency: (page: LandingPage, sectionId: string) =>
    executeAIRequest({
      level: 1,
      action: "add-urgency",
      instruction: "Add urgency and scarcity to increase conversions",
      page,
      selectedSectionId: sectionId,
      selectedField: "heading",
    }),

  suggestColors: (page: LandingPage, instruction?: string) =>
    executeAIRequest({
      level: 2,
      action: "suggest-colors",
      instruction: instruction || "Suggest a modern, high-converting color scheme",
      page,
    }),

  generateSection: (page: LandingPage, sectionType: SectionType, instruction: string) =>
    executeAIRequest({
      level: 3,
      action: "generate-section",
      instruction,
      page,
      targetSectionType: sectionType,
    }),

  editSection: (page: LandingPage, sectionId: string, instruction: string) =>
    executeAIRequest({
      level: 3,
      action: "edit-section",
      instruction,
      page,
      selectedSectionId: sectionId,
    }),

  generatePage: (instruction: string) =>
    executeAIRequest({
      level: 4,
      action: "generate-page",
      instruction,
      page: {
        title: "",
        description: "",
        sections: [],
        colorScheme: {
          primary: "#3b82f6",
          secondary: "#1e40af",
          accent: "#f59e0b",
          background: "#ffffff",
          text: "#111827",
        },
        typography: {
          headingFont: "Inter",
          bodyFont: "Inter",
        },
      },
    }),
};
