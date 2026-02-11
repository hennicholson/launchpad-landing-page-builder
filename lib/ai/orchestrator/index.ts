/**
 * AI Orchestrator - Advanced Page Generation System
 *
 * Multi-phase orchestrator that generates high-quality landing pages
 * using industry-specific patterns and copy frameworks.
 */

// Main orchestrator
export {
  orchestratePage,
  generateLandingPageWithOrchestrator,
} from "./page-orchestrator";

// Types
export type {
  OrchestrationInput,
  OrchestrationResult,
  OrchestrationProgress,
  OrchestrationMetadata,
  PageIntent,
  PageBlueprint,
  SectionPlan,
  ColorStrategy,
  CopyFramework,
  QualityReport,
  QualityIssue,
} from "./types";

// Agents (for advanced usage)
export { analyzeIntent } from "./agents/intent-analyzer";
export { createBlueprint } from "./agents/blueprint-planner";
export { generateSection, generateAllSections } from "./agents/section-generator";
export { assessQuality, validateAndRefine } from "./agents/quality-validator";

// Context utilities
export {
  TEMPLATE_PATTERNS,
  matchTemplatePattern,
  getSectionTypeInfo,
  getRecommendedVariant,
} from "./context/template-patterns";

export {
  COPY_FRAMEWORKS,
  selectCopyFramework,
  getSectionCopyGuidelines,
  getHeadlineExamples,
} from "./context/copy-frameworks";

export {
  PREMIUM_VARIANTS,
  selectPremiumVariant,
  getVariantOptions,
  getVariantDescription,
} from "./context/premium-variants";
