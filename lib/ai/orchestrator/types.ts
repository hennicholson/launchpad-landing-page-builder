/**
 * Advanced AI Page Generation Orchestrator - Types
 *
 * Shared types for the multi-phase page generation system.
 */

import type { LandingPage, PageSection, SectionType, ColorScheme } from "@/lib/page-schema";

// ============================================
// Phase 1: Intent Analysis Types
// ============================================

export type ProductType =
  | "saas"
  | "course"
  | "ecommerce"
  | "agency"
  | "leadmagnet"
  | "webinar"
  | "general";

export type Tone =
  | "professional"
  | "casual"
  | "urgent"
  | "playful"
  | "technical"
  | "aspirational";

export type UrgencyLevel = "low" | "medium" | "high";

export type PricePoint = "free" | "low" | "medium" | "premium" | "enterprise";

export interface PageIntent {
  productType: ProductType;
  targetAudience: string;
  primaryValueProp: string;
  secondaryValueProps: string[];
  tone: Tone;
  urgencyLevel: UrgencyLevel;
  pricePoint: PricePoint;
  keywords: string[];
  competitorContext?: string;
  uniqueDifferentiator?: string;
}

// ============================================
// Phase 2: Blueprint Types
// ============================================

export type CopyFramework = "AIDA" | "PAS" | "BAB";

export type SectionPurpose =
  | "navigation"
  | "attention"
  | "interest"
  | "desire"
  | "action"
  | "proof"
  | "objections"
  | "footer";

export interface SectionPlan {
  type: SectionType;
  variant?: string;
  purpose: SectionPurpose;
  copyGuidelines: string;
  keyElements?: string[];
  // Premium design properties
  effects?: string[];
  backgroundEffect?: string;
  tier?: "premium" | "advanced" | "standard" | "basic";
}

export interface ColorStrategy {
  mode: "dark" | "light";
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  psychology?: string;
}

export interface PageBlueprint {
  copyFramework: CopyFramework;
  frameworkRationale: string;
  sectionSequence: SectionPlan[];
  colorStrategy: ColorStrategy;
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  targetSectionCount: number;
}

// ============================================
// Phase 3: Generation Types
// ============================================

export interface GenerationContext {
  blueprint: PageBlueprint;
  intent: PageIntent;
  previousSections: PageSection[];
  colorScheme: ColorScheme;
  currentSectionIndex: number;
  totalSections: number;
}

export interface SectionGenerationResult {
  section: PageSection;
  tokensUsed: {
    input: number;
    output: number;
  };
}

// ============================================
// Phase 4: Validation Types
// ============================================

export type IssueSeverity = "error" | "warning" | "info";

export interface QualityIssue {
  severity: IssueSeverity;
  sectionId: string;
  sectionType: SectionType;
  field: string;
  issue: string;
  suggestion: string;
}

export interface QualityReport {
  score: number; // 0-100
  issues: QualityIssue[];
  suggestions: string[];
  passesValidation: boolean;
}

// ============================================
// Orchestrator Types
// ============================================

export type OrchestrationPhase =
  | "understanding"
  | "planning"
  | "generating"
  | "validating"
  | "complete";

export interface OrchestrationProgress {
  phase: OrchestrationPhase;
  progress: number; // 0-100
  currentSection?: number;
  totalSections?: number;
  message?: string;
}

export interface OrchestrationInput {
  description: string;
  wizardData?: {
    businessName: string;
    productDescription: string;
    targetAudience: string;
    colorTheme: string;
    vibe: string;
    fontPair: string;
    pageType: string;
  };
  preferences?: {
    sectionCount?: number; // 5-15, default 9
    enableRefinement?: boolean; // default true
  };
}

export interface OrchestrationMetadata {
  intent: PageIntent;
  blueprint: PageBlueprint;
  tokensUsed: number;
  generationTimeMs: number;
  qualityScore: number;
}

export interface OrchestrationResult {
  success: boolean;
  page?: LandingPage;
  metadata?: OrchestrationMetadata;
  error?: string;
}

// ============================================
// Template Pattern Types
// ============================================

export interface TemplatePattern {
  id: string;
  name: string;
  industries: string[];
  sectionFlow: Array<{
    type: SectionType;
    purpose: SectionPurpose;
    variant?: string;
  }>;
  copyFramework: CopyFramework;
  colorPsychology: string;
  conversionTactics: string[];
  avgSections: number;
}

// ============================================
// Copy Framework Types
// ============================================

export interface FrameworkStage {
  name: string;
  sections: SectionType[];
  copyGuidelines: string;
}

export interface CopyFrameworkDefinition {
  id: CopyFramework;
  name: string;
  description: string;
  stages: FrameworkStage[];
  sectionMapping: Record<SectionPurpose, SectionType[]>;
  headlines: string;
  subheadlines: string;
  ctas: string;
  bodyText: string;
}
