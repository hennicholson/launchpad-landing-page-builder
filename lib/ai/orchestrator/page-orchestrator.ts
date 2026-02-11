/**
 * Page Orchestrator - Main Entry Point
 *
 * Coordinates the multi-phase page generation pipeline:
 * Phase 1: Understanding (intent analysis)
 * Phase 2: Planning (blueprint creation)
 * Phase 3: Generation (section-by-section)
 * Phase 4: Validation (quality check and refinement)
 */

import type { LandingPage, ColorScheme } from "@/lib/page-schema";
import type {
  OrchestrationInput,
  OrchestrationResult,
  OrchestrationProgress,
  OrchestrationMetadata,
  PageIntent,
  PageBlueprint,
} from "./types";
import { analyzeIntent } from "./agents/intent-analyzer";
import { createBlueprint } from "./agents/blueprint-planner";
import { generateAllSections } from "./agents/section-generator";
import { validateAndRefine, assessQuality } from "./agents/quality-validator";

/**
 * Main orchestration function
 *
 * Generates a complete landing page through multi-phase AI orchestration.
 */
export async function orchestratePage(
  input: OrchestrationInput,
  onProgress?: (progress: OrchestrationProgress) => void
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  let totalTokens = { input: 0, output: 0 };

  try {
    // ========================================
    // Phase 1: Understanding
    // ========================================
    onProgress?.({
      phase: "understanding",
      progress: 0,
      message: "Analyzing your requirements...",
    });

    const intentResult = await analyzeIntent(input);
    const intent = intentResult.intent;
    totalTokens.input += intentResult.tokensUsed.input;
    totalTokens.output += intentResult.tokensUsed.output;

    onProgress?.({
      phase: "understanding",
      progress: 100,
      message: `Identified: ${intent.productType} for ${intent.targetAudience}`,
    });

    // ========================================
    // Phase 2: Planning
    // ========================================
    onProgress?.({
      phase: "planning",
      progress: 0,
      message: "Creating page blueprint...",
    });

    const blueprintResult = await createBlueprint(intent, input);
    const blueprint = blueprintResult.blueprint;
    totalTokens.input += blueprintResult.tokensUsed.input;
    totalTokens.output += blueprintResult.tokensUsed.output;

    onProgress?.({
      phase: "planning",
      progress: 100,
      message: `${blueprint.copyFramework} framework with ${blueprint.sectionSequence.length} sections`,
    });

    // ========================================
    // Phase 3: Generation
    // ========================================
    onProgress?.({
      phase: "generating",
      progress: 0,
      currentSection: 0,
      totalSections: blueprint.sectionSequence.length,
      message: "Generating sections...",
    });

    const generationResult = await generateAllSections(
      blueprint,
      intent,
      (current, total) => {
        onProgress?.({
          phase: "generating",
          progress: Math.round((current / total) * 100),
          currentSection: current,
          totalSections: total,
          message: `Generating ${blueprint.sectionSequence[current]?.type || "section"}...`,
        });
      }
    );

    totalTokens.input += generationResult.totalTokens.input;
    totalTokens.output += generationResult.totalTokens.output;

    // Assemble initial page
    const initialPage = assemblePage(
      generationResult.sections,
      intent,
      blueprint
    );

    // ========================================
    // Phase 4: Validation
    // ========================================
    onProgress?.({
      phase: "validating",
      progress: 0,
      message: "Validating quality...",
    });

    // Validate and optionally refine
    const enableRefinement = input.preferences?.enableRefinement !== false;
    let finalPage: LandingPage;
    let qualityScore: number;

    if (enableRefinement) {
      const validationResult = await validateAndRefine(
        initialPage,
        blueprint,
        intent,
        1 // max refinement iterations (reduced from 2 to prevent timeout)
      );
      finalPage = validationResult.page;
      qualityScore = validationResult.qualityReport.score;
      totalTokens.input += validationResult.tokensUsed.input;
      totalTokens.output += validationResult.tokensUsed.output;
    } else {
      finalPage = initialPage;
      const qualityReport = assessQuality(initialPage, blueprint);
      qualityScore = qualityReport.score;
    }

    onProgress?.({
      phase: "validating",
      progress: 100,
      message: `Quality score: ${qualityScore}/100`,
    });

    // ========================================
    // Complete
    // ========================================
    onProgress?.({
      phase: "complete",
      progress: 100,
      message: "Page generated successfully!",
    });

    const metadata: OrchestrationMetadata = {
      intent,
      blueprint,
      tokensUsed: totalTokens.input + totalTokens.output,
      generationTimeMs: Date.now() - startTime,
      qualityScore,
    };

    return {
      success: true,
      page: finalPage,
      metadata,
    };
  } catch (error) {
    console.error("[PageOrchestrator] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Assemble sections into a complete page
 */
function assemblePage(
  sections: LandingPage["sections"],
  intent: PageIntent,
  blueprint: PageBlueprint
): LandingPage {
  // Create color scheme from blueprint
  const colorScheme: ColorScheme = {
    primary: blueprint.colorStrategy.primary,
    secondary: blueprint.colorStrategy.secondary,
    accent: blueprint.colorStrategy.accent,
    background: blueprint.colorStrategy.background,
    text: blueprint.colorStrategy.text,
  };

  // Generate title and description from intent
  const title = generatePageTitle(intent);
  const description = generateMetaDescription(intent);

  return {
    title,
    description,
    sections,
    colorScheme,
    typography: blueprint.typography,
    smoothScroll: true,
    animationPreset: "moderate" as const,
    contentWidth: "medium" as const,
    designCanvasWidth: 896,
  };
}

/**
 * Generate SEO-friendly page title
 */
function generatePageTitle(intent: PageIntent): string {
  // Use primary value prop, cleaned up
  const valueClean = intent.primaryValueProp
    .replace(/[^\w\s-]/g, "")
    .slice(0, 60);

  // If we have keywords, try to include the first one
  if (intent.keywords.length > 0) {
    const keyword = intent.keywords[0];
    if (!valueClean.toLowerCase().includes(keyword.toLowerCase())) {
      return `${keyword} - ${valueClean}`;
    }
  }

  return valueClean;
}

/**
 * Generate SEO meta description
 */
function generateMetaDescription(intent: PageIntent): string {
  const parts: string[] = [];

  // Start with value prop
  parts.push(intent.primaryValueProp);

  // Add target audience if short enough
  if (intent.targetAudience.length < 50) {
    parts.push(`Perfect for ${intent.targetAudience}.`);
  }

  // Add secondary value prop if we have room
  if (intent.secondaryValueProps.length > 0) {
    parts.push(intent.secondaryValueProps[0]);
  }

  // Join and truncate to 160 chars
  return parts.join(" ").slice(0, 160);
}

/**
 * Quick generation function for simple use cases
 * (Wrapper for backward compatibility)
 */
export async function generateLandingPageWithOrchestrator(
  description: string,
  wizardData?: OrchestrationInput["wizardData"]
): Promise<LandingPage> {
  const result = await orchestratePage({
    description,
    wizardData,
  });

  if (!result.success || !result.page) {
    throw new Error(result.error || "Failed to generate page");
  }

  return result.page;
}
