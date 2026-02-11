/**
 * Quality Validator Agent - Phase 4
 *
 * Validates generated pages for quality issues and can
 * trigger regeneration of problematic sections.
 */

import type { LandingPage, PageSection } from "@/lib/page-schema";
import type { QualityReport, QualityIssue, PageBlueprint, PageIntent } from "../types";
import { generateSection } from "./section-generator";
import type { GenerationContext } from "../types";

/**
 * Patterns that indicate placeholder text
 */
const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /dolor sit amet/i,
  /your (text|content|headline|title) here/i,
  /placeholder/i,
  /example\.com/i,
  /test@test/i,
  /\[.*?\]/g, // [bracketed placeholders]
  /xxx+/i,
  /todo:/i,
  /fixme:/i,
  /insert .* here/i,
  /sample (text|content)/i,
  /default (text|content|heading)/i,
];

/**
 * Power words that indicate good headlines
 */
const POWER_WORDS = [
  "free",
  "new",
  "you",
  "instant",
  "proven",
  "guaranteed",
  "secret",
  "discover",
  "amazing",
  "exclusive",
  "limited",
  "save",
  "easy",
  "fast",
  "simple",
  "powerful",
  "ultimate",
  "complete",
  "transform",
  "boost",
  "unlock",
  "master",
  "effortless",
  "revolutionary",
];

/**
 * Check if text contains placeholder content
 */
function containsPlaceholder(text: string | undefined): boolean {
  if (!text) return false;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Check headline quality
 */
function checkHeadlineQuality(
  heading: string | undefined,
  sectionId: string,
  sectionType: string
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (!heading) {
    issues.push({
      severity: "error",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "heading",
      issue: "Missing headline",
      suggestion: "Add a compelling headline",
    });
    return issues;
  }

  // Check for placeholder
  if (containsPlaceholder(heading)) {
    issues.push({
      severity: "error",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "heading",
      issue: "Contains placeholder text",
      suggestion: "Replace with real, compelling copy",
    });
  }

  // Check length
  const wordCount = heading.split(/\s+/).length;
  if (wordCount < 3) {
    issues.push({
      severity: "warning",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "heading",
      issue: "Headline is too short",
      suggestion: "Add more benefit-focused words (aim for 3-10 words)",
    });
  }

  if (wordCount > 15) {
    issues.push({
      severity: "warning",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "heading",
      issue: "Headline is too long",
      suggestion: "Shorten to 10 words or fewer for impact",
    });
  }

  // Check for power words (only warn, don't error)
  const headingLower = heading.toLowerCase();
  const hasPowerWord = POWER_WORDS.some((word) => headingLower.includes(word));
  if (!hasPowerWord && sectionType === "hero") {
    issues.push({
      severity: "info",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "heading",
      issue: "Headline lacks power words",
      suggestion: `Consider adding words like: ${POWER_WORDS.slice(0, 5).join(", ")}`,
    });
  }

  return issues;
}

/**
 * Check CTA quality
 */
function checkCtaQuality(
  buttonText: string | undefined,
  sectionId: string,
  sectionType: string
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (!buttonText) return issues;

  if (containsPlaceholder(buttonText)) {
    issues.push({
      severity: "error",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "buttonText",
      issue: "CTA contains placeholder text",
      suggestion: "Replace with action-oriented button text",
    });
  }

  // Check for weak CTAs
  const weakCtas = ["click here", "submit", "send", "learn more", "read more"];
  if (weakCtas.includes(buttonText.toLowerCase())) {
    issues.push({
      severity: "warning",
      sectionId,
      sectionType: sectionType as QualityIssue["sectionType"],
      field: "buttonText",
      issue: "CTA is generic/weak",
      suggestion:
        "Use action + outcome: 'Start Free Trial', 'Get Instant Access'",
    });
  }

  return issues;
}

/**
 * Check items quality (for features, testimonials, etc.)
 */
function checkItemsQuality(
  items: PageSection["items"],
  sectionId: string,
  sectionType: string
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (!items || items.length === 0) {
    // Some sections require items
    const requiresItems = [
      "features",
      "testimonials",
      "pricing",
      "faq",
      "stats",
      "process",
    ];
    if (requiresItems.includes(sectionType)) {
      issues.push({
        severity: "error",
        sectionId,
        sectionType: sectionType as QualityIssue["sectionType"],
        field: "items",
        issue: "Section requires items but has none",
        suggestion: "Add at least 3 items",
      });
    }
    return issues;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (containsPlaceholder(item.title)) {
      issues.push({
        severity: "error",
        sectionId,
        sectionType: sectionType as QualityIssue["sectionType"],
        field: `items[${i}].title`,
        issue: "Item title contains placeholder",
        suggestion: "Replace with specific benefit/feature name",
      });
    }

    if (containsPlaceholder(item.description)) {
      issues.push({
        severity: "error",
        sectionId,
        sectionType: sectionType as QualityIssue["sectionType"],
        field: `items[${i}].description`,
        issue: "Item description contains placeholder",
        suggestion: "Write specific, benefit-focused description",
      });
    }
  }

  return issues;
}

/**
 * Check color consistency
 */
function checkColorConsistency(
  page: LandingPage,
  blueprint: PageBlueprint
): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const expectedBg = blueprint.colorStrategy.background.toLowerCase();
  const expectedText = blueprint.colorStrategy.text.toLowerCase();

  for (const section of page.sections) {
    const bg = section.content.backgroundColor?.toLowerCase();
    const text = section.content.textColor?.toLowerCase();

    // Allow some variation but flag if completely wrong
    if (bg && !bg.includes(expectedBg.slice(1, 4)) && bg !== expectedBg) {
      // This is just info level since variations can be intentional
      issues.push({
        severity: "info",
        sectionId: section.id,
        sectionType: section.type,
        field: "backgroundColor",
        issue: "Background color differs from scheme",
        suggestion: `Expected ${expectedBg}`,
      });
    }
  }

  return issues;
}

/**
 * Assess overall page quality
 */
export function assessQuality(
  page: LandingPage,
  blueprint: PageBlueprint
): QualityReport {
  const issues: QualityIssue[] = [];

  // Check each section
  for (const section of page.sections) {
    // Check headline
    issues.push(
      ...checkHeadlineQuality(
        section.content.heading,
        section.id,
        section.type
      )
    );

    // Check CTA
    issues.push(
      ...checkCtaQuality(section.content.buttonText, section.id, section.type)
    );

    // Check items
    issues.push(...checkItemsQuality(section.items, section.id, section.type));

    // Check subheading for placeholders
    if (containsPlaceholder(section.content.subheading)) {
      issues.push({
        severity: "error",
        sectionId: section.id,
        sectionType: section.type,
        field: "subheading",
        issue: "Subheading contains placeholder text",
        suggestion: "Replace with supporting copy",
      });
    }

    // Check body text for placeholders
    if (containsPlaceholder(section.content.bodyText)) {
      issues.push({
        severity: "error",
        sectionId: section.id,
        sectionType: section.type,
        field: "bodyText",
        issue: "Body text contains placeholder",
        suggestion: "Write specific, benefit-focused content",
      });
    }
  }

  // Check color consistency
  issues.push(...checkColorConsistency(page, blueprint));

  // Calculate score
  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, 100 - errorCount * 15 - warningCount * 5);

  // Generate suggestions
  const suggestions: string[] = [];
  if (errorCount > 0) {
    suggestions.push(
      `Fix ${errorCount} critical issues (placeholder text, missing content)`
    );
  }
  if (warningCount > 3) {
    suggestions.push(`Improve ${warningCount} areas for better conversion`);
  }
  if (score >= 90) {
    suggestions.push("Page quality is excellent!");
  }

  return {
    score,
    issues,
    suggestions,
    passesValidation: errorCount === 0,
  };
}

/**
 * Fix critical issues by regenerating problematic sections
 */
export async function validateAndRefine(
  page: LandingPage,
  blueprint: PageBlueprint,
  intent: PageIntent,
  maxIterations: number = 2
): Promise<{
  page: LandingPage;
  qualityReport: QualityReport;
  tokensUsed: { input: number; output: number };
}> {
  let currentPage = { ...page, sections: [...page.sections] };
  let totalTokens = { input: 0, output: 0 };

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const quality = assessQuality(currentPage, blueprint);

    // If quality is good enough, return (threshold lowered from 85 to 70 to prevent timeout)
    if (quality.passesValidation || quality.score >= 70) {
      return { page: currentPage, qualityReport: quality, tokensUsed: totalTokens };
    }

    // Find sections with critical errors
    const criticalSectionIds = quality.issues
      .filter((i) => i.severity === "error")
      .map((i) => i.sectionId);

    // Limit to max 2 sections per iteration to prevent timeout
    const sectionsToRegenerate = new Set(criticalSectionIds.slice(0, 2));

    if (sectionsToRegenerate.size === 0) {
      return { page: currentPage, qualityReport: quality, tokensUsed: totalTokens };
    }

    // Regenerate problematic sections (limited to prevent timeout)
    for (let i = 0; i < currentPage.sections.length; i++) {
      const section = currentPage.sections[i];
      if (!sectionsToRegenerate.has(section.id)) continue;

      // Find the section plan
      const sectionPlan = blueprint.sectionSequence.find(
        (s) => s.type === section.type
      );
      if (!sectionPlan) continue;

      // Create context for regeneration
      const context: GenerationContext = {
        blueprint,
        intent,
        previousSections: currentPage.sections.slice(0, i),
        colorScheme: {
          primary: blueprint.colorStrategy.primary,
          secondary: blueprint.colorStrategy.secondary,
          accent: blueprint.colorStrategy.accent,
          background: blueprint.colorStrategy.background,
          text: blueprint.colorStrategy.text,
        },
        currentSectionIndex: i,
        totalSections: currentPage.sections.length,
      };

      try {
        const result = await generateSection(sectionPlan, context);
        currentPage.sections[i] = result.section;
        totalTokens.input += result.tokensUsed.input;
        totalTokens.output += result.tokensUsed.output;
      } catch (error) {
        console.error(
          `[QualityValidator] Failed to regenerate section ${section.id}:`,
          error
        );
      }
    }
  }

  // Final quality check
  const finalQuality = assessQuality(currentPage, blueprint);

  return {
    page: currentPage,
    qualityReport: finalQuality,
    tokensUsed: totalTokens,
  };
}
