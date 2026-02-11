/**
 * AI Module - Main Entry Point
 *
 * Exports all AI functionality for the Launchpad editor.
 */

// Client
export { runClaude, runGemini, runClaudeSync, runGeminiSync, MODELS } from "./replicate-client";
export type { TokenUsage, AIResponse, ModelType } from "./replicate-client";

// Cost tracking
export {
  calculateCost,
  checkAIGenerationsAvailable,
  trackAIUsage,
  getAIUsageStats,
} from "./cost-tracker";
export type { CostResult, AIUsageResult } from "./cost-tracker";

// Orchestrator (incremental edits)
export { executeAIRequest, quickActions } from "./orchestrator";
export type { AILevel, AIAction, AIRequest, AISuggestion, AIResult } from "./orchestrator";

// Page Orchestrator (multi-phase page generation)
export { orchestratePage, generateLandingPageWithOrchestrator } from "./orchestrator/index";
export type {
  OrchestrationInput,
  OrchestrationResult,
  OrchestrationProgress,
  OrchestrationMetadata,
  PageIntent,
  PageBlueprint,
  SectionPlan,
} from "./orchestrator/index";

// Context
export {
  buildComponentLibraryContext,
  buildPageContext,
  buildSectionContext,
  buildInlineEditContext,
  buildFullContext,
  getSectionRecommendations,
  SECTION_TYPES,
} from "./context-builder";

// Response processing
export {
  cleanJsonResponse,
  validateSectionJson,
  validatePageJson,
  normalizeSection,
  normalizePage,
  processAIResponse,
  mergeSection,
  createDiff,
} from "./response-processor";

// Prompts
export {
  INLINE_SYSTEM_PROMPT,
  VISUAL_SYSTEM_PROMPT,
  SECTION_SYSTEM_PROMPT,
  PAGE_SYSTEM_PROMPT,
  getSectionEditPrompt,
  AB_TEST_PROMPT,
  getToneAdjustmentPrompt,
} from "./prompts/system-prompts";
