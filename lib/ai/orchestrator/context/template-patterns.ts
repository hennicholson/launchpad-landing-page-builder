/**
 * Template Patterns - Pre-extracted from existing templates
 *
 * These patterns represent proven section flows and configurations
 * that convert well for different industries.
 */

import type { TemplatePattern, CopyFramework, SectionPurpose } from "../types";
import type { SectionType } from "@/lib/page-schema";

/**
 * Pre-extracted patterns from the 11 existing templates
 */
export const TEMPLATE_PATTERNS: TemplatePattern[] = [
  {
    id: "saas",
    name: "SaaS Landing Page",
    industries: ["software", "tech", "b2b", "startup", "api", "developer-tools"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "default" },
      { type: "hero", purpose: "attention", variant: "default" },
      { type: "logoCloud", purpose: "proof" },
      { type: "stats", purpose: "interest", variant: "cards" },
      { type: "process", purpose: "interest", variant: "horizontal" },
      { type: "features", purpose: "interest", variant: "bento" },
      { type: "testimonials", purpose: "desire", variant: "twitter-cards" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "AIDA",
    colorPsychology: "Blue (trust) + Orange (action) for enterprise appeal",
    conversionTactics: [
      "Free trial emphasis",
      "No credit card required",
      "Stats showing usage/customers",
      "Logo cloud for social proof",
    ],
    avgSections: 10,
  },
  {
    id: "agency",
    name: "Agency/Services Page",
    industries: ["agency", "consulting", "creative", "marketing", "design"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "floating-header" },
      { type: "hero", purpose: "attention", variant: "default" },
      { type: "stats", purpose: "proof", variant: "minimal" },
      { type: "features", purpose: "interest", variant: "illustrated" },
      { type: "process", purpose: "interest", variant: "timeline" },
      { type: "testimonials", purpose: "desire", variant: "scrolling" },
      { type: "founders", purpose: "desire" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "split" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "PAS",
    colorPsychology: "Black + Gold for premium positioning",
    conversionTactics: [
      "Case study results",
      "Problem-focused headlines",
      "Team credibility",
      "Process transparency",
    ],
    avgSections: 10,
  },
  {
    id: "course",
    name: "Online Course Page",
    industries: ["education", "course", "coaching", "training", "workshop"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "simple-header" },
      { type: "hero", purpose: "attention", variant: "sales-funnel" },
      { type: "value-proposition", purpose: "interest" },
      { type: "features", purpose: "interest", variant: "default" },
      { type: "creator", purpose: "desire" },
      { type: "testimonials", purpose: "desire", variant: "scrolling" },
      { type: "pricing", purpose: "action" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "BAB",
    colorPsychology: "Green (growth) + Navy (trust) for transformation",
    conversionTactics: [
      "Transformation promise",
      "Instructor credibility",
      "Student results",
      "Money-back guarantee",
    ],
    avgSections: 10,
  },
  {
    id: "ecommerce",
    name: "E-Commerce Product Page",
    industries: ["ecommerce", "retail", "product", "physical-goods", "ddc"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "header-with-search" },
      { type: "hero", purpose: "attention", variant: "default" },
      { type: "features", purpose: "interest", variant: "default" },
      { type: "gallery", purpose: "interest", variant: "bento" },
      { type: "testimonials", purpose: "desire", variant: "twitter-cards" },
      { type: "comparison", purpose: "interest" },
      { type: "pricing", purpose: "action" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "banner" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "PAS",
    colorPsychology: "Red (urgency) + Gold (premium) for purchase motivation",
    conversionTactics: [
      "Scarcity messaging",
      "Customer reviews",
      "Product comparisons",
      "Free shipping threshold",
    ],
    avgSections: 10,
  },
  {
    id: "leadmagnet",
    name: "Lead Magnet Page",
    industries: ["leadgen", "newsletter", "ebook", "guide", "checklist"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "simple-header" },
      { type: "hero", purpose: "attention", variant: "email-signup" },
      { type: "features", purpose: "interest", variant: "default" },
      { type: "creator", purpose: "desire" },
      { type: "testimonials", purpose: "desire", variant: "scrolling" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "AIDA",
    colorPsychology: "Green (growth) + Navy (trust) for value exchange",
    conversionTactics: [
      "Value preview",
      "Expert positioning",
      "Social proof from users",
      "No spam promise",
    ],
    avgSections: 7,
  },
  {
    id: "webinar",
    name: "Webinar/Event Page",
    industries: ["webinar", "event", "workshop", "masterclass", "live"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "simple-header" },
      { type: "hero", purpose: "attention", variant: "sales-funnel" },
      { type: "features", purpose: "interest", variant: "default" },
      { type: "creator", purpose: "desire" },
      { type: "testimonials", purpose: "desire", variant: "twitter-cards" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "AIDA",
    colorPsychology: "Purple (premium) + Pink (urgency) for event excitement",
    conversionTactics: [
      "Limited seats",
      "Date/time urgency",
      "Speaker credibility",
      "What you'll learn",
    ],
    avgSections: 8,
  },
  {
    id: "sales-funnel",
    name: "High-Converting Sales Funnel",
    industries: ["info-product", "digital-product", "high-ticket"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "simple-header" },
      { type: "hero", purpose: "attention", variant: "sales-funnel" },
      { type: "value-proposition", purpose: "interest" },
      { type: "features", purpose: "interest", variant: "default" },
      { type: "creator", purpose: "desire" },
      { type: "offer-details", purpose: "interest" },
      { type: "testimonials", purpose: "desire", variant: "scrolling" },
      { type: "comparison", purpose: "interest" },
      { type: "pricing", purpose: "action" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "PAS",
    colorPsychology: "Dark background with lime accent for urgency",
    conversionTactics: [
      "Story-based value prop",
      "Detailed offer breakdown",
      "Multiple testimonials",
      "Risk reversal",
    ],
    avgSections: 12,
  },
  {
    id: "dark-conversion",
    name: "Dark Mode Tech Product",
    industries: ["developer", "api", "tech-product", "tool"],
    sectionFlow: [
      { type: "header", purpose: "navigation", variant: "floating-header" },
      { type: "hero", purpose: "attention", variant: "animated-preview" },
      { type: "logoCloud", purpose: "proof" },
      { type: "features", purpose: "interest", variant: "bento" },
      { type: "stats", purpose: "interest", variant: "cards" },
      { type: "video", purpose: "interest", variant: "centered" },
      { type: "testimonials", purpose: "desire", variant: "twitter-cards" },
      { type: "pricing", purpose: "action" },
      { type: "faq", purpose: "objections" },
      { type: "cta", purpose: "action", variant: "centered" },
      { type: "footer", purpose: "footer" },
    ],
    copyFramework: "AIDA",
    colorPsychology: "Black + Cyan for tech sophistication",
    conversionTactics: [
      "App preview demo",
      "Technical features",
      "Developer testimonials",
      "Free tier option",
    ],
    avgSections: 11,
  },
];

/**
 * Find the best matching template pattern for a given intent
 */
export function matchTemplatePattern(
  productType: string,
  keywords: string[]
): TemplatePattern {
  // Direct product type match
  const directMatch = TEMPLATE_PATTERNS.find((p) => p.id === productType);
  if (directMatch) return directMatch;

  // Industry keyword match
  const keywordLower = keywords.map((k) => k.toLowerCase());
  for (const pattern of TEMPLATE_PATTERNS) {
    for (const industry of pattern.industries) {
      if (keywordLower.some((k) => k.includes(industry) || industry.includes(k))) {
        return pattern;
      }
    }
  }

  // Default to SaaS pattern
  return TEMPLATE_PATTERNS[0];
}

/**
 * Get section documentation for a specific section type
 * Returns targeted info instead of full library context
 */
export function getSectionTypeInfo(sectionType: SectionType): string {
  const sectionInfo: Record<string, string> = {
    hero: `
HERO SECTION
Variants: default, animated-preview, email-signup, sales-funnel
Required: heading, subheading, buttonText, buttonLink
Optional: badge, backgroundEffect, heroImageUrl, brands[]
Best practices:
- Headline: 3-10 words, benefit-focused, power words
- Subheading: Under 20 words, expand on headline
- CTA: Action verb + specific outcome
- Badge: Social proof or urgency (e.g., "Trusted by 10,000+ teams")
`,
    features: `
FEATURES SECTION
Variants: default, illustrated, hover, bento, table
Required: heading, items[]
Items need: title, description, icon or imageUrl
Best practices:
- 3-6 features optimal
- Benefit-focused titles, not feature names
- Short descriptions (1-2 sentences)
- Icons: use emoji or icon names like "Zap", "Shield", "Clock"
`,
    testimonials: `
TESTIMONIALS SECTION
Variants: scrolling, twitter-cards
Required: heading, items[]
Items need: description (the quote), author, role, imageUrl
Best practices:
- 3-5 testimonials
- Include specific results when possible
- Real-sounding names and roles
- Diverse roles/companies
`,
    pricing: `
PRICING SECTION
Required: heading, items[]
Items need: title, description, price, features[], buttonText, buttonLink
Optional: popular (boolean for highlighting)
Best practices:
- 2-3 pricing tiers
- Mark one as "popular" or "recommended"
- Include feature comparison
- Clear CTA on each tier
`,
    cta: `
CTA SECTION
Variants: centered, split, banner, minimal
Required: heading, buttonText, buttonLink
Optional: subheading, secondaryButtonText, backgroundEffect
Best practices:
- Strong action-oriented headline
- Single focused CTA
- Add urgency or guarantee
- Contrast background for visibility
`,
    faq: `
FAQ SECTION
Required: heading, items[]
Items need: title (question), description (answer)
Best practices:
- 5-8 questions
- Address common objections
- Include pricing/guarantee questions
- Benefit-focused answers
`,
    stats: `
STATS SECTION
Variants: cards, minimal, bars, circles
Required: heading, items[]
Items need: title (the number), description (what it means)
Best practices:
- 3-4 stats
- Use specific numbers
- Add context (e.g., "340% average increase")
- Include time frame when relevant
`,
    process: `
PROCESS SECTION
Variants: timeline, cards, horizontal
Required: heading, items[]
Items need: title, description, icon (step number or icon name)
Best practices:
- 3-5 steps maximum
- Simple, clear step names
- Action-oriented descriptions
- Logical progression
`,
    header: `
HEADER SECTION
Variants: default, header-2, floating-header, simple-header, header-with-search
Required: links[], buttonText, buttonLink
Optional: logoUrl, logoText, searchPlaceholder
Best practices:
- 3-5 navigation links
- Clear CTA button
- Logo or logo text
`,
    footer: `
FOOTER SECTION
Required: links[]
Optional: logoUrl, logoText, tagline, socialLinks
Best practices:
- Organize links by category
- Include legal links
- Social media icons
`,
    logoCloud: `
LOGO CLOUD SECTION
Required: heading, brands[]
Brands: array of company names (e.g., ["Google", "Microsoft", "Stripe"])
Best practices:
- 5-8 recognizable brands
- Mix of company sizes
- Relevant to target audience
`,
    creator: `
CREATOR SECTION
Required: creatorName, creatorRole, creatorBio, creatorPhotoUrl
Optional: creatorCredentials[]
Best practices:
- Professional photo
- Relevant credentials
- Personal but professional bio
- Include achievements
`,
    comparison: `
COMPARISON SECTION
Required: heading, items[]
Items: your product vs competitors
Best practices:
- 5-10 comparison points
- Highlight your advantages
- Be honest about limitations
`,
    "value-proposition": `
VALUE PROPOSITION SECTION
Required: heading, bodyParagraphs[]
Optional: painPoints[]
Best practices:
- Story-based structure
- Address pain points
- Build to solution
`,
    "offer-details": `
OFFER DETAILS SECTION
Required: heading, items[], featuredImageUrl
Items: what's included in the offer
Best practices:
- Detailed breakdown
- Visual representation
- Value stacking
`,
  };

  return sectionInfo[sectionType] || `
${sectionType.toUpperCase()} SECTION
Generate appropriate content for this section type.
Required: heading
Optional: subheading, items[], buttonText
`;
}

/**
 * Get recommended variants for a section based on style/vibe
 */
export function getRecommendedVariant(
  sectionType: SectionType,
  vibe: string
): string | undefined {
  const vibeVariants: Record<string, Record<string, string>> = {
    modern: {
      hero: "default",
      features: "bento",
      testimonials: "twitter-cards",
      header: "floating-header",
      stats: "cards",
      process: "horizontal",
    },
    minimal: {
      hero: "default",
      features: "default",
      testimonials: "scrolling",
      header: "simple-header",
      stats: "minimal",
      process: "cards",
    },
    bold: {
      hero: "sales-funnel",
      features: "hover",
      testimonials: "twitter-cards",
      header: "default",
      stats: "bars",
      process: "timeline",
    },
    professional: {
      hero: "default",
      features: "illustrated",
      testimonials: "scrolling",
      header: "default",
      stats: "cards",
      process: "timeline",
    },
    playful: {
      hero: "animated-preview",
      features: "hover",
      testimonials: "twitter-cards",
      header: "floating-header",
      stats: "circles",
      process: "horizontal",
    },
    techy: {
      hero: "animated-preview",
      features: "bento",
      testimonials: "twitter-cards",
      header: "floating-header",
      stats: "cards",
      process: "horizontal",
    },
    elegant: {
      hero: "default",
      features: "illustrated",
      testimonials: "scrolling",
      header: "simple-header",
      stats: "minimal",
      process: "timeline",
    },
  };

  return vibeVariants[vibe]?.[sectionType];
}
