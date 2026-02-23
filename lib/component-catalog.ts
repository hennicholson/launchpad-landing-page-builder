import type { SectionType } from "./page-schema";

export type ComponentCategory =
  | "hero"
  | "navigation"
  | "cta"
  | "video"
  | "faq"
  | "features"
  | "socialProof"
  | "conversion"
  | "content"
  | "salesFunnel"
  | "blank";

export type UseCaseTag =
  | "Sales Funnel"
  | "Landing Page"
  | "Tech"
  | "Courses"
  | "Templates";

export type ComponentVariant = {
  id: string;
  label: string;
};

export type CatalogEntry = {
  type: SectionType;
  label: string;
  description: string;
  category: ComponentCategory;
  tags: UseCaseTag[];
  variants: ComponentVariant[];
  tier: "free" | "pro";
};

export const GALLERY_CATEGORIES: { id: ComponentCategory; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "navigation", label: "Navigation" },
  { id: "cta", label: "CTA" },
  { id: "video", label: "Video" },
  { id: "faq", label: "FAQ" },
  { id: "features", label: "Features" },
  { id: "socialProof", label: "Social Proof" },
  { id: "conversion", label: "Conversion" },
  { id: "content", label: "Content" },
  { id: "salesFunnel", label: "Sales Funnel" },
  { id: "blank", label: "Blank" },
];

export const USE_CASE_TAGS: UseCaseTag[] = [
  "Sales Funnel",
  "Landing Page",
  "Tech",
  "Courses",
  "Templates",
];

export const COMPONENT_CATALOG: CatalogEntry[] = [
  // Hero
  {
    type: "hero",
    label: "Hero",
    description: "Large headline section with CTA and optional media",
    category: "hero",
    tags: ["Landing Page", "Sales Funnel", "Tech"],
    variants: [
      { id: "default", label: "Default" },
      { id: "animated-preview", label: "Animated" },
      { id: "email-signup", label: "Email Signup" },
      { id: "sales-funnel", label: "Sales Funnel" },
      { id: "glassmorphism-trust", label: "Glass Trust" },
      { id: "hero-email-glass", label: "Email Glass" },
      { id: "hero-form-multi", label: "Multi-Field Form" },
    ],
    tier: "free",
  },

  // Navigation
  {
    type: "header",
    label: "Header",
    description: "Top navigation bar with logo and menu links",
    category: "navigation",
    tags: ["Landing Page", "Tech", "Templates"],
    variants: [
      { id: "default", label: "Animated" },
      { id: "header-2", label: "Scroll" },
      { id: "floating-header", label: "Floating" },
      { id: "simple-header", label: "Simple" },
      { id: "header-with-search", label: "Search" },
    ],
    tier: "free",
  },
  {
    type: "footer",
    label: "Footer",
    description: "Page footer with links, social icons, and copyright",
    category: "navigation",
    tags: ["Landing Page", "Templates"],
    variants: [],
    tier: "free",
  },

  // CTA
  {
    type: "cta",
    label: "Call to Action",
    description: "Prominent action section to drive conversions",
    category: "cta",
    tags: ["Landing Page", "Sales Funnel"],
    variants: [
      { id: "centered", label: "Centered" },
      { id: "split", label: "Split" },
      { id: "banner", label: "Banner" },
      { id: "minimal", label: "Minimal" },
    ],
    tier: "free",
  },
  {
    type: "glass-cta",
    label: "Glass CTA",
    description: "3D glassmorphism call-to-action with depth effects",
    category: "cta",
    tags: ["Tech", "Landing Page"],
    variants: [],
    tier: "pro",
  },

  // Video
  {
    type: "video",
    label: "Video",
    description: "Embedded video showcase section",
    category: "video",
    tags: ["Landing Page", "Courses", "Tech"],
    variants: [
      { id: "centered", label: "Centered" },
      { id: "grid", label: "Grid" },
      { id: "side-by-side", label: "Side by Side" },
      { id: "fullscreen", label: "Fullscreen" },
    ],
    tier: "free",
  },

  // FAQ
  {
    type: "faq",
    label: "FAQ",
    description: "Frequently asked questions with expandable answers",
    category: "faq",
    tags: ["Landing Page", "Courses", "Templates"],
    variants: [],
    tier: "free",
  },

  // Features
  {
    type: "features",
    label: "Features",
    description: "Showcase product features in a grid layout",
    category: "features",
    tags: ["Landing Page", "Tech", "Templates"],
    variants: [
      { id: "default", label: "Default" },
      { id: "illustrated", label: "Illustrated" },
      { id: "hover", label: "Hover" },
      { id: "bento", label: "Bento" },
      { id: "table", label: "Table" },
    ],
    tier: "free",
  },
  {
    type: "glass-features",
    label: "Glass Features",
    description: "3D glassmorphism feature cards with depth effects",
    category: "features",
    tags: ["Tech"],
    variants: [],
    tier: "pro",
  },
  {
    type: "detailed-features",
    label: "Detailed Features",
    description: "In-depth feature breakdown with descriptions",
    category: "features",
    tags: ["Tech", "Courses", "Sales Funnel"],
    variants: [],
    tier: "free",
  },

  // Social Proof
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer reviews and social proof cards",
    category: "socialProof",
    tags: ["Landing Page", "Sales Funnel", "Courses"],
    variants: [
      { id: "scrolling", label: "Scrolling" },
      { id: "twitter-cards", label: "Twitter Cards" },
      { id: "screenshots", label: "Screenshots" },
    ],
    tier: "free",
  },
  {
    type: "glass-testimonials",
    label: "Glass Testimonials",
    description: "3D glassmorphism testimonial cards",
    category: "socialProof",
    tags: ["Tech"],
    variants: [],
    tier: "pro",
  },
  {
    type: "stats",
    label: "Stats",
    description: "Key metrics and statistics display",
    category: "socialProof",
    tags: ["Landing Page", "Tech", "Sales Funnel"],
    variants: [
      { id: "cards", label: "Cards" },
      { id: "minimal", label: "Minimal" },
      { id: "bars", label: "Bars" },
      { id: "circles", label: "Circles" },
    ],
    tier: "free",
  },
  {
    type: "logoCloud",
    label: "Logo Cloud",
    description: "Showcase partner or client logos",
    category: "socialProof",
    tags: ["Landing Page", "Tech", "Templates"],
    variants: [],
    tier: "free",
  },
  {
    type: "credibility",
    label: "Credibility",
    description: "Trust badges, certifications, and authority signals",
    category: "socialProof",
    tags: ["Landing Page", "Sales Funnel"],
    variants: [],
    tier: "free",
  },

  // Conversion
  {
    type: "pricing",
    label: "Pricing",
    description: "Pricing plans comparison table",
    category: "conversion",
    tags: ["Landing Page", "Sales Funnel", "Tech"],
    variants: [],
    tier: "free",
  },
  {
    type: "glass-pricing",
    label: "Glass Pricing",
    description: "3D glassmorphism pricing cards with depth effects",
    category: "conversion",
    tags: ["Tech"],
    variants: [],
    tier: "pro",
  },
  {
    type: "offer",
    label: "Offer",
    description: "Special offer or deal showcase section",
    category: "conversion",
    tags: ["Sales Funnel", "Landing Page"],
    variants: [],
    tier: "free",
  },
  {
    type: "offer-details",
    label: "Offer Details",
    description: "Detailed breakdown of what's included in the offer",
    category: "conversion",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "free",
  },
  {
    type: "audience",
    label: "Audience",
    description: "Define who this product is for",
    category: "conversion",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "free",
  },

  // Content
  {
    type: "process",
    label: "Process",
    description: "Step-by-step process or workflow display",
    category: "content",
    tags: ["Landing Page", "Courses", "Templates"],
    variants: [
      { id: "timeline", label: "Timeline" },
      { id: "cards", label: "Cards" },
      { id: "horizontal", label: "Horizontal" },
    ],
    tier: "free",
  },
  {
    type: "comparison",
    label: "Comparison",
    description: "Side-by-side comparison of options or products",
    category: "content",
    tags: ["Sales Funnel", "Landing Page"],
    variants: [],
    tier: "free",
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Image gallery with multiple layout options",
    category: "content",
    tags: ["Landing Page", "Templates"],
    variants: [
      { id: "bento", label: "Bento" },
      { id: "focusrail", label: "Focus Rail" },
    ],
    tier: "free",
  },
  {
    type: "founders",
    label: "Founders",
    description: "Team members or founders showcase",
    category: "content",
    tags: ["Landing Page", "Tech"],
    variants: [],
    tier: "free",
  },
  {
    type: "glass-founders",
    label: "Glass Founders",
    description: "3D glassmorphism team member cards",
    category: "content",
    tags: ["Tech"],
    variants: [],
    tier: "pro",
  },
  {
    type: "creator",
    label: "Creator",
    description: "Creator or expert spotlight section",
    category: "content",
    tags: ["Courses", "Sales Funnel"],
    variants: [],
    tier: "free",
  },
  {
    type: "value-proposition",
    label: "Value Proposition",
    description: "Communicate your core value and unique selling points",
    category: "content",
    tags: ["Sales Funnel", "Landing Page"],
    variants: [],
    tier: "free",
  },

  // Sales Funnel (Whop)
  {
    type: "whop-hero",
    label: "Whop Hero",
    description: "Premium gradient hero with sparkle animations",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-value-prop",
    label: "Value Story",
    description: "Narrative value proposition with visual storytelling",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-offer",
    label: "Bento Offer",
    description: "Bento grid offer layout with feature highlights",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-cta",
    label: "Floating CTA",
    description: "Floating call-to-action with glow effects",
    category: "salesFunnel",
    tags: ["Sales Funnel"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-comparison",
    label: "Comparison Glow",
    description: "Glowing comparison table with premium styling",
    category: "salesFunnel",
    tags: ["Sales Funnel"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-creator",
    label: "Creator Spotlight",
    description: "Premium creator profile with social proof",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-curriculum",
    label: "Curriculum",
    description: "Course curriculum breakdown with modules",
    category: "salesFunnel",
    tags: ["Courses", "Sales Funnel"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-results",
    label: "Results Gallery",
    description: "Student or customer results showcase",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-testimonials",
    label: "Testimonials 3D",
    description: "3D-styled testimonial cards with premium effects",
    category: "salesFunnel",
    tags: ["Sales Funnel", "Courses"],
    variants: [],
    tier: "pro",
  },
  {
    type: "whop-final-cta",
    label: "Final CTA",
    description: "Closing call-to-action with urgency elements",
    category: "salesFunnel",
    tags: ["Sales Funnel"],
    variants: [],
    tier: "pro",
  },

  // Blank
  {
    type: "blank",
    label: "Blank Canvas",
    description: "Empty section for custom content and elements",
    category: "blank",
    tags: ["Templates"],
    variants: [],
    tier: "free",
  },
  {
    type: "loader",
    label: "Loader",
    description: "Loading animation placeholder section",
    category: "blank",
    tags: ["Templates"],
    variants: [],
    tier: "free",
  },
];
