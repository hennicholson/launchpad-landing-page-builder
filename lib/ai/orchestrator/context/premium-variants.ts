/**
 * Premium Variant Selection System
 *
 * Scores and selects the best visual variants for each section type
 * based on product type, vibe, and copy framework matching.
 */

import type { PageIntent, CopyFramework } from "../types";

// ============================================
// Variant Tier System
// ============================================

export type VariantTier = "premium" | "advanced" | "standard" | "basic";

export interface VariantMetadata {
  tier: VariantTier;
  visualEffects: string[];
  bestFor: {
    productTypes: string[];
    vibes: string[];
    frameworks: string[];
  };
  description: string;
}

// ============================================
// Premium Variants Database
// ============================================

export const PREMIUM_VARIANTS: Record<string, Record<string, VariantMetadata>> = {
  // Valid HeroVariant: "default" | "animated-preview" | "email-signup" | "sales-funnel" | "glassmorphism-trust"
  hero: {
    "glassmorphism-trust": {
      tier: "premium",
      visualEffects: ["glassmorphism", "animated-stats", "video-modal", "glow"],
      bestFor: {
        productTypes: ["agency", "course", "saas"],
        vibes: ["professional", "elegant", "modern"],
        frameworks: ["BAB", "AIDA"],
      },
      description: "Agency-focused with glassmorphism badges and animated trust elements",
    },
    "animated-preview": {
      tier: "premium",
      visualEffects: ["tilt-card", "shimmer", "brand-marquee", "spring-animations"],
      bestFor: {
        productTypes: ["saas", "ecommerce"],
        vibes: ["playful", "modern", "techy", "bold"],
        frameworks: ["AIDA", "PAS"],
      },
      description: "Animated product preview with TiltCard and shimmer effects",
    },
    "sales-funnel": {
      tier: "advanced",
      visualEffects: ["urgency-elements", "countdown", "scarcity-badge"],
      bestFor: {
        productTypes: ["course", "leadmagnet", "webinar"],
        vibes: ["bold", "urgent"],
        frameworks: ["PAS", "BAB"],
      },
      description: "High-conversion sales page hero with urgency elements",
    },
    "email-signup": {
      tier: "standard",
      visualEffects: ["form-focus"],
      bestFor: {
        productTypes: ["leadmagnet", "webinar"],
        vibes: ["professional", "minimal"],
        frameworks: ["any"],
      },
      description: "Email capture focused hero layout",
    },
    default: {
      tier: "basic",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["minimal"],
        frameworks: ["any"],
      },
      description: "Clean, classic hero layout",
    },
  },

  features: {
    bento: {
      tier: "premium",
      visualEffects: ["masonry-grid", "parallax-images", "mesh-gradient", "hover-glow"],
      bestFor: {
        productTypes: ["saas", "course"],
        vibes: ["modern", "techy", "bold"],
        frameworks: ["AIDA"],
      },
      description: "Masonry bento grid with parallax images and mesh gradient backgrounds",
    },
    hover: {
      tier: "advanced",
      visualEffects: ["animated-borders", "glow-bars", "hover-transforms"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["bold", "playful"],
        frameworks: ["any"],
      },
      description: "4-column grid with animated hover borders and glowing accent bars",
    },
    illustrated: {
      tier: "standard",
      visualEffects: ["custom-illustrations"],
      bestFor: {
        productTypes: ["saas", "course"],
        vibes: ["professional", "friendly"],
        frameworks: ["BAB"],
      },
      description: "Feature cards with custom illustrations",
    },
    table: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["saas"],
        vibes: ["professional", "techy"],
        frameworks: ["any"],
      },
      description: "Comparison table format for feature lists",
    },
    default: {
      tier: "basic",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["minimal"],
        frameworks: ["any"],
      },
      description: "Simple grid feature layout",
    },
  },

  // Valid TestimonialVariant: "scrolling" | "twitter-cards" | "screenshots"
  testimonials: {
    "twitter-cards": {
      tier: "premium",
      visualEffects: ["social-format", "avatar-stack", "star-animation"],
      bestFor: {
        productTypes: ["saas", "course", "agency"],
        vibes: ["modern", "techy", "bold"],
        frameworks: ["AIDA", "any"],
      },
      description: "Twitter/social proof card format with ratings",
    },
    screenshots: {
      tier: "advanced",
      visualEffects: ["screenshot-frame", "quote-overlay"],
      bestFor: {
        productTypes: ["saas", "course"],
        vibes: ["professional", "elegant"],
        frameworks: ["any"],
      },
      description: "Screenshot format testimonials with frame styling",
    },
    scrolling: {
      tier: "standard",
      visualEffects: ["marquee"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Horizontally scrolling testimonial marquee",
    },
  },

  // Valid CTAVariant: "centered" | "split" | "banner" | "minimal"
  cta: {
    split: {
      tier: "premium",
      visualEffects: ["two-column", "image-float", "glow-accent"],
      bestFor: {
        productTypes: ["saas", "agency"],
        vibes: ["professional", "elegant", "modern"],
        frameworks: ["AIDA", "any"],
      },
      description: "Two-column split CTA with visual element",
    },
    banner: {
      tier: "advanced",
      visualEffects: ["full-width", "gradient-bg"],
      bestFor: {
        productTypes: ["ecommerce", "course", "saas"],
        vibes: ["bold", "techy"],
        frameworks: ["PAS", "any"],
      },
      description: "Full-width banner CTA with impact",
    },
    centered: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Clean centered CTA",
    },
    minimal: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["minimal", "elegant"],
        frameworks: ["any"],
      },
      description: "Minimal, focused CTA section",
    },
  },

  stats: {
    circles: {
      tier: "advanced",
      visualEffects: ["animated-circles", "count-up"],
      bestFor: {
        productTypes: ["course", "agency"],
        vibes: ["modern", "bold"],
        frameworks: ["any"],
      },
      description: "Circular progress indicators with count-up animation",
    },
    bars: {
      tier: "advanced",
      visualEffects: ["animated-bars", "progress-fill"],
      bestFor: {
        productTypes: ["saas"],
        vibes: ["techy"],
        frameworks: ["AIDA"],
      },
      description: "Animated progress bars",
    },
    cards: {
      tier: "standard",
      visualEffects: ["hover-lift"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard stat cards",
    },
    minimal: {
      tier: "basic",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["minimal", "elegant"],
        frameworks: ["any"],
      },
      description: "Minimalist stat display",
    },
  },

  // Pricing doesn't have a variant type - uses default styling with background effects
  pricing: {
    default: {
      tier: "standard",
      visualEffects: ["hover-lift", "glow-accent"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard pricing grid with hover effects",
    },
  },

  // Valid ProcessVariant: "timeline" | "cards" | "horizontal"
  process: {
    timeline: {
      tier: "premium",
      visualEffects: ["animated-line", "step-reveal"],
      bestFor: {
        productTypes: ["course", "agency", "saas"],
        vibes: ["professional", "elegant", "modern"],
        frameworks: ["BAB", "AIDA"],
      },
      description: "Vertical timeline with animated reveal",
    },
    horizontal: {
      tier: "advanced",
      visualEffects: ["connector-lines", "step-animation"],
      bestFor: {
        productTypes: ["saas"],
        vibes: ["modern", "techy", "bold"],
        frameworks: ["AIDA"],
      },
      description: "Horizontal step process",
    },
    cards: {
      tier: "standard",
      visualEffects: ["number-badges"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Card-based process steps",
    },
  },

  faq: {
    default: {
      tier: "standard",
      visualEffects: ["accordion-smooth"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Accordion FAQ section",
    },
  },

  logoCloud: {
    default: {
      tier: "standard",
      visualEffects: ["logo-marquee", "grayscale-hover"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Logo cloud with marquee scroll",
    },
  },

  // Valid HeaderVariant: "default" | "header-2" | "floating-header" | "simple-header" | "header-with-search"
  header: {
    "floating-header": {
      tier: "premium",
      visualEffects: ["backdrop-blur", "scroll-shrink"],
      bestFor: {
        productTypes: ["saas", "agency"],
        vibes: ["modern", "professional", "techy"],
        frameworks: ["any"],
      },
      description: "Floating header with blur effect",
    },
    "header-2": {
      tier: "advanced",
      visualEffects: ["nav-animation"],
      bestFor: {
        productTypes: ["any"],
        vibes: ["modern"],
        frameworks: ["any"],
      },
      description: "Modern header variant",
    },
    "simple-header": {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["minimal", "elegant"],
        frameworks: ["any"],
      },
      description: "Minimalist simple header",
    },
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard header",
    },
  },

  footer: {
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard footer with links",
    },
  },

  video: {
    centered: {
      tier: "advanced",
      visualEffects: ["video-modal", "play-button-glow"],
      bestFor: {
        productTypes: ["course", "saas"],
        vibes: ["modern"],
        frameworks: ["any"],
      },
      description: "Centered video with modal playback",
    },
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard video embed",
    },
  },

  founders: {
    "glass-3d": {
      tier: "premium",
      visualEffects: ["glassmorphism", "3d-cards", "avatar-ring"],
      bestFor: {
        productTypes: ["course", "agency"],
        vibes: ["modern", "elegant"],
        frameworks: ["BAB"],
      },
      description: "Glassmorphic founder cards with 3D effects",
    },
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard founder profiles",
    },
  },

  comparison: {
    glow: {
      tier: "advanced",
      visualEffects: ["row-glow", "checkmark-animation"],
      bestFor: {
        productTypes: ["saas"],
        vibes: ["modern", "techy"],
        frameworks: ["AIDA", "PAS"],
      },
      description: "Comparison table with glow effects",
    },
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard comparison table",
    },
  },

  offer: {
    "bento-3d": {
      tier: "premium",
      visualEffects: ["3d-tilt", "glow-borders", "shine-effect", "checkmark-draw"],
      bestFor: {
        productTypes: ["course", "leadmagnet"],
        vibes: ["bold", "modern"],
        frameworks: ["PAS", "BAB"],
      },
      description: "Premium bento offer showcase with 3D tilt cards",
    },
    default: {
      tier: "standard",
      visualEffects: [],
      bestFor: {
        productTypes: ["any"],
        vibes: ["any"],
        frameworks: ["any"],
      },
      description: "Standard offer section",
    },
  },
};

// ============================================
// Background Effects Database
// ============================================

export const BACKGROUND_EFFECTS = {
  "shooting-stars": { vibes: ["bold", "modern"], tiers: ["premium", "advanced"] },
  glow: { vibes: ["any"], tiers: ["premium", "advanced"] },
  "elegant-shapes": { vibes: ["elegant", "professional"], tiers: ["advanced"] },
  aurora: { vibes: ["modern", "playful"], tiers: ["premium"] },
  spotlight: { vibes: ["modern", "techy"], tiers: ["premium", "advanced"] },
  meteors: { vibes: ["bold", "techy"], tiers: ["premium"] },
  sparkles: { vibes: ["playful"], tiers: ["advanced"] },
  "background-beams": { vibes: ["techy"], tiers: ["advanced"] },
};

// ============================================
// Selection Algorithm
// ============================================

const TIER_SCORES: Record<VariantTier, number> = {
  premium: 100,
  advanced: 75,
  standard: 50,
  basic: 25,
};

export interface VariantSelection {
  variant: string;
  effects: string[];
  backgroundEffect?: string;
  tier: VariantTier;
}

/**
 * Select the best variant for a section type based on context
 */
export function selectPremiumVariant(
  sectionType: string,
  intent: PageIntent,
  vibe: string,
  framework: CopyFramework
): VariantSelection {
  const variants = PREMIUM_VARIANTS[sectionType];
  if (!variants) {
    return { variant: "default", effects: [], tier: "basic" };
  }

  // Score each variant based on match quality
  const scored = Object.entries(variants).map(([name, meta]) => {
    let score = 0;

    // Tier bonus (strongly favor premium components)
    score += TIER_SCORES[meta.tier];

    // Product type match (+40 for exact match)
    if (
      meta.bestFor.productTypes.includes(intent.productType) ||
      meta.bestFor.productTypes.includes("any")
    ) {
      score += meta.bestFor.productTypes.includes("any") ? 20 : 40;
    }

    // Vibe match (+30 for match)
    if (meta.bestFor.vibes.includes(vibe) || meta.bestFor.vibes.includes("any")) {
      score += meta.bestFor.vibes.includes("any") ? 15 : 30;
    }

    // Framework match (+25 for match)
    if (meta.bestFor.frameworks.includes(framework) || meta.bestFor.frameworks.includes("any")) {
      score += meta.bestFor.frameworks.includes("any") ? 12 : 25;
    }

    return { name, meta, score };
  });

  // Sort by score descending and pick the best
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Select background effect for applicable sections
  let backgroundEffect: string | undefined;
  if (["hero", "cta"].includes(sectionType) && best.meta.tier !== "basic") {
    backgroundEffect = selectBackgroundEffect(vibe, best.meta.tier);
  }

  return {
    variant: best.name,
    effects: best.meta.visualEffects,
    backgroundEffect,
    tier: best.meta.tier,
  };
}

/**
 * Select a background effect based on vibe and tier
 */
function selectBackgroundEffect(vibe: string, tier: VariantTier): string | undefined {
  const suitable = Object.entries(BACKGROUND_EFFECTS)
    .filter(([_, config]) => {
      const vibeMatch = config.vibes.includes(vibe) || config.vibes.includes("any");
      const tierMatch = config.tiers.includes(tier);
      return vibeMatch && tierMatch;
    })
    .map(([name]) => name);

  if (suitable.length === 0) return undefined;

  // Return a deterministic choice (first match)
  return suitable[0];
}

/**
 * Get all premium variants for a section type (for AI context)
 */
export function getVariantOptions(sectionType: string): string[] {
  const variants = PREMIUM_VARIANTS[sectionType];
  if (!variants) return ["default"];
  return Object.keys(variants);
}

/**
 * Get variant description for AI context
 */
export function getVariantDescription(sectionType: string, variant: string): string {
  const variants = PREMIUM_VARIANTS[sectionType];
  if (!variants || !variants[variant]) return "";
  return variants[variant].description;
}
