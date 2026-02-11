/**
 * Context Builder for AI Integration
 *
 * Generates comprehensive context about the Launchpad component library
 * so AI models can understand and generate valid section JSON.
 */

import type {
  LandingPage,
  PageSection,
  SectionType,
  SectionContent,
  SectionItem,
  ColorScheme,
  Typography,
} from "../page-schema";

/**
 * All available section types in the Launchpad component library
 */
export const SECTION_TYPES: SectionType[] = [
  // Core sections
  "hero",
  "features",
  "testimonials",
  "pricing",
  "cta",
  "faq",
  "video",
  "gallery",
  "header",
  "footer",
  "founders",
  "credibility",
  "offer",
  "audience",
  "stats",
  "logoCloud",
  "comparison",
  "process",
  "blank",
  "loader",
  // Sales Funnel sections
  "value-proposition",
  "offer-details",
  "creator",
  "detailed-features",
  // Whop University premium sections
  "whop-hero",
  "whop-value-prop",
  "whop-offer",
  "whop-cta",
  "whop-comparison",
  "whop-creator",
  "whop-curriculum",
  "whop-results",
  "whop-testimonials",
  "whop-final-cta",
  // Glass 3D sections
  "glass-cta",
  "glass-features",
  "glass-founders",
  "glass-testimonials",
  "glass-pricing",
];

/**
 * Section type descriptions for AI understanding
 */
const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero: "Main banner section with headline, subheading, CTA button. Variants: default, animated-preview, email-signup, sales-funnel",
  features:
    "Feature grid showcasing benefits. Variants: default (image grid), illustrated (with illustrations), hover (animated cards), bento (masonry), table (customer table)",
  testimonials:
    "Customer testimonials/reviews. Variants: scrolling (auto-scroll marquee), twitter-cards (Twitter-style cards)",
  pricing: "Pricing tables with plans and features",
  cta: "Call-to-action sections. Variants: centered, split (image + text), banner (full-width), minimal",
  faq: "FAQ accordion with expandable questions",
  video:
    "Video embed sections. Variants: centered, grid (multiple videos), side-by-side (video + text), fullscreen",
  gallery: "Image galleries. Variants: bento (masonry grid), focusrail (horizontal scroll)",
  header: "Navigation header. Variants: default, header-2, floating-header, simple-header, header-with-search",
  footer: "Footer with links and branding",
  founders: "Team/founders section with photos and bios",
  credibility: "Trust-building section with background image and text overlay",
  offer: "Special offer/pricing with toggle between monthly/yearly",
  audience: "For/Not For section showing ideal customer fit",
  stats: "Statistics display. Variants: cards, minimal, bars, circles",
  logoCloud: "Brand logo marquee/carousel",
  comparison: "Feature comparison between options",
  process: "Step-by-step process. Variants: timeline, cards, horizontal",
  blank: "Empty canvas for custom elements",
  loader: "Page loader/splash screen with transition",
  "value-proposition": "Sales funnel: Story-based value proposition with paragraphs",
  "offer-details": "Sales funnel: What's included list with featured image",
  creator: "Sales funnel: Meet the creator/instructor with photo and bio",
  "detailed-features": "Sales funnel: Detailed feature list with icons",
  "whop-hero": "Premium: Whop University hero with gradient effects",
  "whop-value-prop": "Premium: Value proposition with 3D cards",
  "whop-offer": "Premium: Pricing offer with glass effects",
  "whop-cta": "Premium: Call-to-action with animations",
  "whop-comparison": "Premium: Feature comparison table",
  "whop-creator": "Premium: Creator spotlight",
  "whop-curriculum": "Premium: Course curriculum display",
  "whop-results": "Premium: Results/outcomes showcase",
  "whop-testimonials": "Premium: Testimonials with ratings",
  "whop-final-cta": "Premium: Final conversion CTA",
  "glass-cta": "3D Glass: CTA with glassmorphism effects",
  "glass-features": "3D Glass: Features with glass cards",
  "glass-founders": "3D Glass: Team with glass styling",
  "glass-testimonials": "3D Glass: Testimonials with glass cards",
  "glass-pricing": "3D Glass: Pricing with glass effects",
};

/**
 * Build the full component library context for AI prompts
 */
export function buildComponentLibraryContext(): string {
  return `
# Launchpad Component Library (${SECTION_TYPES.length} Section Types)

## Section Types Overview
${SECTION_TYPES.map((type) => `- ${type}: ${SECTION_DESCRIPTIONS[type]}`).join("\n")}

## Section Variants

### Hero Variants
- default: Standard hero with headline, subheading, buttons
- animated-preview: Hero with app preview screenshots (light/dark mode)
- email-signup: Hero with email capture form and mockup widget
- sales-funnel: High-conversion hero with badge, urgency, and guarantee

### Features Variants
- default: Grid of feature cards with images
- illustrated: Features with custom illustrations (meeting, code-review, ai-assistant)
- hover: Animated hover effect cards
- bento: Masonry/bento box grid layout
- table: Customer table display

### Header Variants
- default: Standard nav with logo, links, CTA button
- header-2: Alternative header style
- floating-header: Floating glass-effect header
- simple-header: Minimal header
- header-with-search: Header with search bar

### CTA Variants
- centered: Centered text and button
- split: Image on one side, text on other
- banner: Full-width banner style
- minimal: Simple, minimal CTA

### Stats Variants
- cards: Stats in card containers
- minimal: Clean, minimal stats display
- bars: Stats with progress bars
- circles: Stats with circular progress

### Process Variants
- timeline: Vertical timeline layout
- cards: Horizontal cards
- horizontal: Horizontal step flow

### Video Variants
- centered: Single centered video
- grid: Multiple videos in grid
- side-by-side: Video with text
- fullscreen: Full-width video

### Gallery Variants
- bento: Masonry grid layout
- focusrail: Horizontal scrolling gallery

### Testimonial Variants
- scrolling: Auto-scrolling marquee
- twitter-cards: Twitter-style testimonial cards

## JSON Schema

### PageSection Structure
\`\`\`typescript
{
  id: string,           // Unique 7-char ID
  type: SectionType,    // One of the section types above
  content: {            // Section-specific content
    heading?: string,
    subheading?: string,
    bodyText?: string,
    buttonText?: string,
    buttonLink?: string,
    backgroundColor?: string,  // hex color
    textColor?: string,        // hex color
    // ... variant-specific fields
  },
  items?: SectionItem[], // For lists (features, testimonials, pricing, etc.)
}
\`\`\`

### SectionItem Structure (for lists)
\`\`\`typescript
{
  id: string,
  title?: string,
  description?: string,
  icon?: string,           // Icon name or emoji
  imageUrl?: string,
  price?: string,          // For pricing items
  features?: string[],     // Feature list for pricing
  author?: string,         // For testimonials
  role?: string,           // Role/title for testimonials
  rating?: number,         // 1-5 star rating
  popular?: boolean,       // Mark as featured
  buttonText?: string,
  buttonLink?: string,
}
\`\`\`

## Button Variants
primary, secondary, outline, ghost, gradient, neon, 3d, glass, pill, icon, underline, bounce, animated-generate, liquid, flow, ripple, cartoon, win98

## Background Effects
none, elegant-shapes, background-circles, background-paths, glow, shooting-stars, stars-background, wavy-background, aurora, spotlight, background-beams, meteors, sparkles

## Subheading Animations
fadeUp (default), blurIn, slideRight, slideLeft, scaleIn, stagger (word-by-word), none

## Color Scheme
Always use hex colors:
- primary: Main brand color
- secondary: Supporting color
- accent: Highlight/CTA color
- background: Page background
- text: Main text color

## Complete SectionContent Properties Reference

### Text Fields (Copy)
- heading: Main headline text
- subheading: Supporting text below heading
- bodyText: Paragraph content
- buttonText: Primary CTA button text
- buttonLink: Primary CTA button URL
- secondaryButtonText: Secondary button text
- secondaryButtonLink: Secondary button URL
- badge: Badge/label text (above headline)
- tagline: Short tagline (footer)
- description: General description text

### Button Styling (Primary)
- buttonVariant: primary|secondary|outline|ghost|gradient|neon|3d|glass|pill|icon|underline|bounce|animated-generate|liquid|flow|ripple|cartoon|win98
- buttonSize: sm|md|lg|xl
- buttonBgColor: Hex color (#ffffff)
- buttonTextColor: Hex color
- buttonBorderRadius: Number (px)
- buttonBorderWidth: Number (px)
- buttonBorderColor: Hex color
- buttonPaddingX: Number (px)
- buttonPaddingY: Number (px)
- buttonFontSize: Number (px)
- buttonFontWeight: normal|medium|semibold|bold
- buttonShadow: none|sm|md|lg

### Button Styling (Secondary) - Same properties with "secondaryButton" prefix
- secondaryButtonVariant, secondaryButtonSize, secondaryButtonBgColor, etc.

### Colors & Background
- backgroundColor: Section background hex color
- textColor: Section text hex color
- accentColor: Highlight/accent hex color
- backgroundImage: Full URL for background image
- overlayOpacity: 0-1 for gradient overlay strength

### Layout & Spacing
- layout: left|right|center|grid
- paddingTop: Number (px)
- paddingBottom: Number (px)
- minHeight: Number (px) for blank sections

### Media
- imageUrl: Primary image URL
- videoUrl: Video embed URL (YouTube, Vimeo)
- logoUrl: Logo image URL
- logoText: Text-based logo fallback
- heroImageUrl: Hero section image
- appPreviewImageLight: Light mode screenshot
- appPreviewImageDark: Dark mode screenshot
- featuredImageUrl: Featured product image

### Section Variants
- heroVariant: default|animated-preview|email-signup|sales-funnel
- featuresVariant: default|illustrated|hover|bento|table
- ctaVariant: centered|split|banner|minimal
- headerVariant: default|header-2|floating-header|simple-header|header-with-search
- testimonialVariant: scrolling|twitter-cards|screenshots
- statsVariant: cards|minimal|bars|circles
- processVariant: timeline|cards|horizontal
- videoVariant: centered|grid|side-by-side|fullscreen
- galleryVariant: bento|focusrail

### Visibility Toggles (all boolean, default true)
- showHeading, showSubheading, showBodyText
- showButton, showSecondaryButton
- showImage, showBadge, showVideo
- showItems (features, testimonials, pricing list)
- showBrands (logo marquee)
- showLinks (nav links)
- showLogo, showTagline, showSocial
- showForItems, showNotForItems (audience section)
- showSearchBar, showBackgroundImage, showFeatures

### Animation & Effects
- backgroundEffect: none|elegant-shapes|background-circles|background-paths|glow|shooting-stars|stars-background|wavy-background|aurora|spotlight|background-beams|meteors|sparkles
- headingStyle: solid|gradient|outline
- subheadingAnimation: fadeUp|blurIn|slideRight|slideLeft|scaleIn|stagger|none
- subheadingSize: sm|base|lg|xl
- subheadingWeight: normal|medium|semibold
- subheadingOpacity: 50-100 (default 80)
- scrollSpeed: Number for marquee speed

### Header-Specific
- headerPosition: sticky|fixed|static
- headerBackgroundOpacity: 0-100
- headerPaddingY: Number (px)
- links: Array of {label, url} for navigation
- searchPlaceholder: Placeholder for search bar

### Hero Sales Funnel
- topTitle: Text above main heading
- ctaText: CTA button text
- ctaUrl: CTA button URL
- ctaSecondaryText: Below CTA text (e.g. "Only $47")
- badgeIcon: Icon name for badge

### Pricing/Offer
- priceMonthly: "$X/month"
- priceYearly: "$X/year"

### Audience Section
- forHeading: "This Is For You If..."
- notForHeading: "This Is NOT For You If..."
- forItems: Array of strings
- notForItems: Array of strings

### Creator Section
- creatorName, creatorRole, creatorBio
- creatorPhotoUrl, creatorPhotoAlt
- creatorCredentials: Array of strings

### Video Section
- autoplayVideo: boolean
- muteVideo: boolean
- showVideoControls: boolean
- videoDuration: String "5:30"
- videoAspectRatio: 16:9|4:3|1:1

### Loader Section
- logoSize: small|medium|large|custom
- customLogoSize: Number (px)
- transitionAnimation: fade|slide|zoom
- transitionDuration: Number (seconds)

### Element-Level Style Overrides
- elementStyles: Record<fieldName, {fontSize, fontWeight, fontFamily, textAlign, color, letterSpacing, lineHeight, textTransform}>

## Key Content Fields by Section Type

### Hero
- heading, subheading, buttonText, buttonLink
- heroVariant: "default" | "animated-preview" | "email-signup" | "sales-funnel"
- badge: Badge text above headline
- brands: string[] for logo marquee
- For sales-funnel: topTitle, ctaText, ctaUrl, ctaSecondaryText, badgeIcon

### Features
- heading, subheading, featuresVariant
- items[]: { title, description, icon?, imageUrl?, gridClass? (for bento) }

### Testimonials
- heading, testimonialVariant
- items[]: { title, description, author, role, rating?, imageUrl? }

### Pricing
- heading, subheading
- items[]: { title, price, description, features[], popular?, buttonText, buttonLink }

### CTA
- heading, subheading, buttonText, buttonLink, ctaVariant

### FAQ
- heading
- items[]: { title (question), description (answer) }

### Stats
- heading, subheading, statsVariant
- items[]: { title (number), description (label) }

### Process
- heading, subheading, processVariant
- items[]: { title, description, icon (step number) }

### Header
- logoUrl, logoText, headerVariant
- links: [{ label, url }]
- buttonText, buttonLink

### Footer
- logoUrl, logoText, tagline
- links: [{ label, url }]
- bodyText (copyright)
`;
}

/**
 * Build page-specific context for AI requests
 */
export function buildPageContext(page: LandingPage): string {
  return `
## Current Page Context

**Title:** ${page.title}
**Description:** ${page.description}

**Color Scheme:**
- Primary: ${page.colorScheme.primary}
- Secondary: ${page.colorScheme.secondary}
- Accent: ${page.colorScheme.accent}
- Background: ${page.colorScheme.background}
- Text: ${page.colorScheme.text}

**Typography:**
- Heading Font: ${page.typography.headingFont}
- Body Font: ${page.typography.bodyFont}

**Existing Sections (${page.sections.length}):**
${page.sections.map((s, i) => `${i + 1}. ${s.type}${s.content.heading ? `: "${s.content.heading}"` : ""}`).join("\n")}
`;
}

/**
 * Build section-specific context for editing
 * Provides AI with full visibility into editable properties
 */
export function buildSectionContext(section: PageSection): string {
  // Extract key editable properties by category
  const textProps = ['heading', 'subheading', 'bodyText', 'buttonText', 'buttonLink', 'badge', 'tagline', 'description'];
  const styleProps = ['buttonVariant', 'buttonSize', 'buttonBgColor', 'buttonTextColor', 'backgroundColor', 'textColor', 'accentColor'];
  const layoutProps = ['layout', 'paddingTop', 'paddingBottom'];
  const visibilityProps = Object.keys(section.content).filter(k => k.startsWith('show'));

  return `
## Section Being Edited

**Type:** ${section.type}
**ID:** ${section.id}

**Editable Text Properties:**
${textProps.map(p => `- ${p}: ${section.content[p as keyof SectionContent] !== undefined ? `"${section.content[p as keyof SectionContent]}"` : '(not set)'}`).filter(p => !p.includes('(not set)')).join('\n')}

**Current Style Settings:**
${styleProps.map(p => `- ${p}: ${section.content[p as keyof SectionContent] !== undefined ? section.content[p as keyof SectionContent] : '(default)'}`).filter(p => !p.includes('(default)')).join('\n') || '(using defaults)'}

**Visibility Toggles:**
${visibilityProps.map(p => `- ${p}: ${section.content[p as keyof SectionContent]}`).join('\n') || '(all visible by default)'}

**Full Content Object:**
\`\`\`json
${JSON.stringify(section.content, null, 2)}
\`\`\`

${
  section.items && section.items.length > 0
    ? `
**Items (${section.items.length}):**
\`\`\`json
${JSON.stringify(section.items, null, 2)}
\`\`\`
`
    : ""
}

**AI Can Modify:**
- All text fields (heading, subheading, buttonText, etc.)
- All style properties (colors, variants, sizes)
- All visibility toggles (show/hide elements)
- Item arrays (add, remove, edit items)
- Layout and spacing values
`;
}

/**
 * Build context for inline text editing
 */
export function buildInlineEditContext(
  field: string,
  currentValue: string,
  sectionType: SectionType
): string {
  return `
## Inline Text Edit

**Field:** ${field}
**Section Type:** ${sectionType}
**Current Value:** "${currentValue}"

Guidelines for this field:
${getFieldGuidelines(field)}
`;
}

/**
 * Get guidelines for specific field types
 */
function getFieldGuidelines(field: string): string {
  const guidelines: Record<string, string> = {
    heading:
      "- Keep concise (3-10 words)\n- Focus on benefits, not features\n- Use power words that create urgency or excitement\n- Avoid generic phrases",
    subheading:
      "- Support the main heading\n- Add context or expand on the benefit\n- Keep under 20 words\n- Can include a soft CTA",
    buttonText:
      "- Use action verbs (Get, Start, Join, Try)\n- Be specific about the action\n- Create urgency when appropriate\n- Keep to 2-4 words",
    bodyText:
      "- Be clear and concise\n- Focus on benefits\n- Use simple language\n- Break up long text into short paragraphs",
    title:
      "- Clear and descriptive\n- Highlight the key benefit\n- Keep under 6 words",
    description:
      "- Expand on the title\n- Include specific benefits\n- Keep under 25 words",
    badge:
      "- Short and punchy (2-4 words)\n- Create urgency or social proof\n- Use ALL CAPS for attention",
    price:
      "- Include currency symbol\n- Show period (/mo, /year)\n- Consider showing original price for discounts",
  };

  return guidelines[field] || "- Keep it clear and compelling\n- Focus on the user's benefit";
}

/**
 * Build full context for AI request
 */
export function buildFullContext(
  page: LandingPage,
  selectedSection?: PageSection,
  selectedField?: string
): string {
  let context = buildComponentLibraryContext();
  context += "\n---\n";
  context += buildPageContext(page);

  if (selectedSection) {
    context += "\n---\n";
    context += buildSectionContext(selectedSection);

    if (selectedField && selectedSection.content[selectedField as keyof SectionContent]) {
      context += "\n---\n";
      context += buildInlineEditContext(
        selectedField,
        String(selectedSection.content[selectedField as keyof SectionContent]),
        selectedSection.type
      );
    }
  }

  return context;
}

/**
 * Get section type recommendations based on current page structure
 */
export function getSectionRecommendations(page: LandingPage): SectionType[] {
  const existingTypes = new Set(page.sections.map((s) => s.type));
  const recommendations: SectionType[] = [];

  // Common landing page structure
  const idealOrder: SectionType[] = [
    "header",
    "hero",
    "logoCloud",
    "features",
    "stats",
    "testimonials",
    "pricing",
    "faq",
    "cta",
    "footer",
  ];

  // Recommend missing sections from ideal structure
  for (const type of idealOrder) {
    if (!existingTypes.has(type)) {
      recommendations.push(type);
    }
  }

  // Add some premium options
  if (!existingTypes.has("process")) recommendations.push("process");
  if (!existingTypes.has("comparison")) recommendations.push("comparison");
  if (!existingTypes.has("founders")) recommendations.push("founders");

  return recommendations.slice(0, 5);
}
