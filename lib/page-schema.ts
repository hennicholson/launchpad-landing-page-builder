export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "pricing"
  | "cta"
  | "faq"
  | "video"
  | "gallery"
  | "header"
  | "founders"
  | "credibility"
  | "offer"
  | "audience"
  | "footer"
  | "stats"
  | "logoCloud"
  | "comparison"
  | "process"
  | "blank"
  | "loader"
  // Sales Funnel sections
  | "value-proposition"
  | "offer-details"
  | "creator"
  | "detailed-features"
  // Whop University premium funnel sections
  | "whop-hero"
  | "whop-value-prop"
  | "whop-offer"
  | "whop-cta"
  | "whop-comparison"
  | "whop-creator"
  | "whop-curriculum"
  | "whop-results"
  | "whop-testimonials"
  | "whop-final-cta"
  // Glass 3D components
  | "glass-cta"
  | "glass-features"
  | "glass-founders"
  | "glass-testimonials"
  | "glass-pricing";

export type LayoutType = "left" | "right" | "center" | "grid";

// Section visual variants for template differentiation
export type StatsVariant = "cards" | "minimal" | "bars" | "circles";
export type CTAVariant = "centered" | "split" | "banner" | "minimal";
export type ProcessVariant = "timeline" | "cards" | "horizontal";
export type HeaderVariant = "default" | "header-2" | "floating-header" | "simple-header" | "header-with-search";
export type HeaderPosition = "sticky" | "fixed" | "static";
export type TestimonialVariant = "scrolling" | "twitter-cards" | "screenshots";
export type VideoVariant = "centered" | "grid" | "side-by-side" | "fullscreen";
export type GalleryVariant = "bento" | "focusrail";
export type FeaturesVariant = "default" | "illustrated" | "hover" | "bento" | "table";
export type HeroVariant = "default" | "animated-preview" | "email-signup" | "sales-funnel" | "glassmorphism-trust" | "hero-email-glass" | "hero-form-multi" | "hero-split-form";
export type LogoSize = "small" | "medium" | "large" | "custom";
export type TransitionAnimation = "fade" | "slide" | "zoom";

// Background effect options
export type BackgroundEffect =
  | "none"
  | "elegant-shapes"
  | "background-circles"
  | "background-paths"
  | "glow"
  | "shooting-stars"
  | "stars-background"
  | "wavy-background"
  // Aceternity UI effects
  | "aurora"
  | "spotlight"
  | "background-beams"
  | "meteors"
  | "sparkles";

// Background effect configuration for Aceternity components
export type BackgroundConfig = {
  primaryColor?: string;
  secondaryColor?: string;
  speed?: "slow" | "medium" | "fast";
  intensity?: number; // 0-100
  showRadialGradient?: boolean;
  blurAmount?: number;
};

// Animation presets
export type AnimationPreset = "none" | "subtle" | "moderate" | "dramatic";

// Content width presets for section alignment
export type ContentWidth = "narrow" | "medium" | "wide";

// Subheading configuration types
export type SubheadingAnimation =
  | "fadeUp"      // Classic fade + translate (default)
  | "blurIn"      // Modern blur → sharp
  | "slideRight"  // Slide from left
  | "slideLeft"   // Slide from right
  | "scaleIn"     // Scale from 95% → 100%
  | "stagger"     // Word-by-word reveal
  | "none";       // No animation

export type SubheadingSize = "sm" | "base" | "lg" | "xl";
export type SubheadingWeight = "normal" | "medium" | "semibold";

// Heading style options (for better visibility control)
export type HeadingStyle = "solid" | "gradient" | "outline";

// Element-level style overrides for individual text elements
export type ElementStyleOverride = {
  fontSize?: number;        // px
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;           // hex
  letterSpacing?: string;   // em or px
  lineHeight?: number;      // multiplier
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  fontStyle?: 'normal' | 'italic';
  textShadow?: string;         // CSS text-shadow value
  webkitTextStroke?: string;   // CSS -webkit-text-stroke value
  opacity?: number;            // 0-1
};

// ==================== ELEMENTS SYSTEM ====================
// Elements are standalone UI pieces that can be placed anywhere within a section

export type ElementType =
  | 'button'      // CTA button with link
  | 'image'       // Standalone image
  | 'text'        // Text block (paragraph/heading)
  | 'divider'     // Visual separator/spacer
  | 'icon'        // Icon from library
  | 'video'       // YouTube/Vimeo embed
  | 'social'      // Social media icons
  | 'badge'       // Label/pill
  | 'countdown'   // Date-based countdown
  | 'form'        // Email capture field
  | 'html';       // Raw HTML block

// Position relative to section (percentage-based for responsiveness)
export type ElementPosition = {
  x: number;        // 0-100% from left
  y: number;        // 0-100% from top
  width?: number;   // Optional fixed width in px
  height?: number;  // Optional fixed height in px
};

// Animation configuration for elements
export type ElementAnimation = {
  hover?: 'scale' | 'lift' | 'glow' | 'bounce' | 'shake' | 'pulse' | 'underline' | 'fill' | 'none';
  click?: 'press' | 'ripple' | 'bounce' | 'none';
};

// Button style variants
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'neon' | '3d' | 'glass' | 'pill' | 'icon' | 'underline' | 'bounce'
  | 'animated-generate' | 'liquid' | 'flow' | 'ripple' | 'cartoon' | 'win98' | 'email-capture';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

// Badge style variants (extended)
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'outline' | 'glow';

// Icon display variants
export type IconVariant = 'circle' | 'square' | 'none' | 'glow' | 'shadow';

// Divider style variants
export type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'gradient' | 'double';

// Font weight options
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

// Shadow options
export type ShadowSize = 'none' | 'sm' | 'md' | 'lg';

// Width mode options
export type WidthMode = 'auto' | 'full' | number;

// ==================== BREAKPOINT SYSTEM ====================
// Breakpoints allow per-device customization of element properties

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// Breakpoint pixel thresholds (max-width for each)
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

// Per-breakpoint override for any element property
export type BreakpointOverride = {
  position?: Partial<ElementPosition>;
  content?: Partial<ElementContent>;
  styles?: Partial<ElementStyleOverride>;
  visible?: boolean;
};

// Collection of breakpoint overrides (desktop is the base, so not included)
export type BreakpointOverrides = {
  mobile?: BreakpointOverride;
  tablet?: BreakpointOverride;
};

// Content specific to each element type
export type ElementContent = {
  // Button - Basic
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  // Button - Custom styling
  buttonPaddingX?: number;       // Horizontal padding in px
  buttonPaddingY?: number;       // Vertical padding in px
  buttonBorderRadius?: number;   // Border radius in px
  buttonBgColor?: string;        // Background color hex
  buttonTextColor?: string;      // Text color hex
  buttonBorderWidth?: number;    // Border width in px
  buttonBorderColor?: string;    // Border color hex
  buttonFontSize?: number;       // Font size in px
  buttonFontWeight?: FontWeight; // Font weight
  buttonShadow?: ShadowSize;     // Shadow size
  buttonWidth?: WidthMode;       // Width mode: auto, full, or custom px
  buttonActiveText?: string;     // Text shown during loading/active state (for animated buttons)

  // Email Capture (for email-capture button variant)
  emailCapturePlaceholder?: string;    // Input placeholder text
  emailCaptureSuccessText?: string;    // Success message after submission
  emailCaptureButtonText?: string;     // Submit button text

  // Image - Basic
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageFit?: 'cover' | 'contain' | 'fill';
  // Image - Enhanced styling
  imageBorderRadius?: number;   // Border radius in px
  imageShadow?: ShadowSize;     // Shadow size
  imageBorderWidth?: number;    // Border width in px
  imageBorderColor?: string;    // Border color hex

  // Text - Basic
  text?: string;
  textType?: 'heading' | 'subheading' | 'paragraph' | 'caption';
  // Text - Custom styling
  textFontSize?: number;
  textFontWeight?: FontWeight;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  textLineHeight?: number;
  textLetterSpacing?: string;  // e.g., '0.05em', '-0.02em'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textMaxWidth?: number;       // Max width in px

  // Icon - Basic
  iconName?: string;
  iconSize?: number;
  iconVariant?: IconVariant;
  // Icon - Custom styling
  iconColor?: string;
  iconBgColor?: string;

  // Video - Basic
  videoUrl?: string;
  videoWidth?: number;
  // Video - Enhanced styling
  videoBorderRadius?: number;          // Border radius in px
  videoAspectRatio?: '16:9' | '4:3' | '1:1';
  videoShadow?: ShadowSize;

  // Social - Basic
  socialLinks?: Array<{ platform: string; url: string }>;
  socialVariant?: 'default' | 'filled' | 'minimal';
  // Social - Enhanced styling
  socialIconSize?: number;      // Icon size in px
  socialGap?: number;           // Gap between icons in px
  socialIconColor?: string;     // Icon color hex

  // Badge - Basic
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  // Badge - Custom styling
  badgeBgColor?: string;
  badgeTextColor?: string;
  badgeFontSize?: number;
  badgePaddingX?: number;
  badgePaddingY?: number;
  badgeBorderRadius?: number;

  // Countdown - Basic
  countdownTarget?: string;  // ISO date string for countdown target
  // Countdown - Enhanced styling
  countdownBoxBgColor?: string;    // Box background color
  countdownNumberColor?: string;   // Number text color
  countdownLabelColor?: string;    // Label text color
  countdownBorderRadius?: number;  // Border radius in px
  countdownGap?: number;           // Gap between boxes in px
  countdownShowLabels?: boolean;   // Show/hide labels

  // Form - Basic
  formPlaceholder?: string;
  formButtonText?: string;
  // Form - Enhanced styling
  formInputBgColor?: string;     // Input background color
  formInputTextColor?: string;   // Input text color
  formButtonBgColor?: string;    // Button background color
  formButtonTextColor?: string;  // Button text color
  formBorderRadius?: number;     // Border radius in px
  formBorderColor?: string;      // Input border color

  // HTML
  htmlCode?: string;

  // Divider
  dividerVariant?: DividerVariant;
  dividerThickness?: number;
  dividerWidth?: number;
  dividerColor?: string;

  // Animation (applies to all element types)
  animation?: ElementAnimation;

  // Universal element styling
  opacity?: number;               // 0-1
  rotation?: number;              // degrees -180 to 180
  elementBgColor?: string;        // generic background color
  elementBorderWidth?: number;    // px
  elementBorderColor?: string;    // hex
  elementBorderRadius?: number;   // px
  elementShadow?: 'none' | 'sm' | 'md' | 'lg';
  // Text element font family
  textFontFamily?: string;
};

// A single element within a section
export type PageElement = {
  id: string;
  type: ElementType;
  position: ElementPosition;
  snapToGrid: boolean;
  visible: boolean;
  content: ElementContent;
  styles: ElementStyleOverride;
  groupId?: string;  // Optional group membership for grouped elements
  breakpointOverrides?: BreakpointOverrides;  // Per-breakpoint property overrides
};

// Element group - allows multiple elements to move/resize together
export type ElementGroup = {
  id: string;
  name?: string;
  elementIds: string[];
  // Bounding box for the group (computed from member elements)
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
};

export type SectionItem = {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  proofImages?: string[];  // Array of proof/screenshot image URLs for testimonials
  videoUrl?: string;       // Video URL for grid video variant
  price?: string;
  features?: string[];
  author?: string;
  role?: string;
  rating?: number;
  // Skinny-landing specific fields
  gridClass?: string;       // CSS grid class for bento layout (e.g., "md:col-span-2 md:row-span-2")
  aspectRatio?: string;     // Aspect ratio class (e.g., "aspect-video", "aspect-square")
  // Features illustrated section field
  illustrationType?: "meeting" | "code-review" | "ai-assistant"; // Illustration variant
  // Customers table and other sections using metadata
  metadata?: string;        // JSON string for additional item data (status, revenue, joinDate, etc.)
  // Founders section fields
  linkedinUrl?: string;     // LinkedIn profile URL
  label?: string;           // Label above name (e.g., "30+ Years Experience")
  bio?: string;             // Short bio text
  // Offer/Pricing section fields
  popular?: boolean;        // Mark as popular/featured
  buttonText?: string;      // CTA button text
  buttonLink?: string;      // CTA button link
  // Audience section fields
  audienceType?: "for" | "not-for";  // Whether this is a "for" or "not for" item
  // Per-item style overrides for title, description, etc.
  styleOverrides?: Record<string, ElementStyleOverride>;
  // Whop University / Sales Funnel item fields
  duration?: string;
  lessons?: string[];
  result?: string;
  quote?: string;
  name?: string;
};

export type NavLink = {
  id?: string;
  label: string;
  url: string;
  styleOverrides?: Record<string, ElementStyleOverride>;
};

export type SectionContent = {
  heading?: string;
  subheading?: string;
  bodyText?: string;
  buttonText?: string;
  buttonLink?: string;
  // Button styling (for section-level buttons)
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: number;
  buttonBorderWidth?: number;
  buttonBorderColor?: string;
  buttonPaddingX?: number;
  buttonPaddingY?: number;
  buttonFontSize?: number;
  buttonFontWeight?: FontWeight;
  buttonShadow?: ShadowSize;
  // Secondary button styling (independent from primary)
  secondaryButtonVariant?: ButtonVariant;
  secondaryButtonSize?: ButtonSize;
  secondaryButtonBgColor?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonBorderRadius?: number;
  secondaryButtonBorderWidth?: number;
  secondaryButtonBorderColor?: string;
  secondaryButtonPaddingX?: number;
  secondaryButtonPaddingY?: number;
  secondaryButtonFontSize?: number;
  secondaryButtonFontWeight?: FontWeight;
  secondaryButtonShadow?: ShadowSize;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: LayoutType;
  // Visibility toggles for section elements
  showHeading?: boolean;      // default true
  showSubheading?: boolean;   // default true
  showBodyText?: boolean;     // default true
  showButton?: boolean;       // default true
  showSecondaryButton?: boolean; // default true
  showImage?: boolean;        // default true
  showBadge?: boolean;        // default true
  showVideo?: boolean;        // default true
  // Section-specific visibility toggles
  showItems?: boolean;        // default true - Control items[] array rendering (Features, Pricing, Testimonials, Stats, FAQ, Gallery, Process, Comparison, Founders, Audience)
  showBrands?: boolean;       // default true - Brand marquee (LogoCloud, Hero)
  showLinks?: boolean;        // default true - Navigation links (Header, Footer)
  showLogo?: boolean;         // default true - Logo display (Header, Footer)
  showTagline?: boolean;      // default true - Tagline (Footer)
  showSocial?: boolean;       // default true - Social media icons (Footer)
  showForItems?: boolean;     // default true - "For you" list (Audience)
  showNotForItems?: boolean;  // default true - "Not for you" list (Audience)
  showSearchBar?: boolean;    // default true - Search bar (Header with header-with-search variant)
  showBackgroundImage?: boolean; // default true - Background image (Credibility)
  showFeatures?: boolean;     // default true - Features list within pricing/offer items
  // Skinny-landing specific fields
  badge?: string;           // Badge text above headline (e.g., "For Creators & Agencies")
  brands?: string[];        // Brand names for marquee scroll
  accentColor?: string;     // Secondary color for 2-tone headlines
  accentHeading?: string;   // The portion of heading to highlight in accent color
  // Header/Footer fields
  logoUrl?: string;         // Logo image URL
  logoText?: string;        // Text logo fallback
  links?: NavLink[];        // Navigation links
  tagline?: string;         // Footer tagline
  searchPlaceholder?: string; // Search placeholder for header-with-search variant
  // Credibility section fields
  backgroundImage?: string; // Full-width background image
  overlayOpacity?: number;  // Gradient overlay strength (0-1)
  // Audience section fields
  forItems?: string[];      // "This is for you" items
  notForItems?: string[];   // "This is not for you" items
  forHeading?: string;      // Custom heading for "for" column
  notForHeading?: string;   // Custom heading for "not for" column
  // Animation/scroll fields
  scrollSpeed?: number;     // Speed for marquee/testimonial scroll
  // Offer section fields
  priceMonthly?: string;    // Monthly price for toggle
  priceYearly?: string;     // Yearly price for toggle
  // Section variants for visual differentiation
  statsVariant?: StatsVariant;
  ctaVariant?: CTAVariant;
  processVariant?: ProcessVariant;
  headerVariant?: HeaderVariant;
  headerPosition?: HeaderPosition;  // sticky, fixed, or static positioning for headers
  headerBackgroundOpacity?: number; // 0-100, default 100 (fully opaque) for glass effects
  headerPaddingY?: number; // vertical padding in pixels for headers
  testimonialVariant?: TestimonialVariant;
  videoVariant?: VideoVariant;
  galleryVariant?: GalleryVariant;
  featuresVariant?: FeaturesVariant;
  // Hero variant system
  heroVariant?: HeroVariant;
  // Animated-preview & minimal hero variants
  announcementText?: string;        // Badge announcement text
  announcementLink?: string;        // Announcement link URL
  primaryButtonText?: string;       // Primary CTA text
  primaryButtonLink?: string;       // Primary CTA link
  secondaryButtonText?: string;     // Secondary CTA text
  secondaryButtonLink?: string;     // Secondary CTA link
  appPreviewImageLight?: string;    // Light mode screenshot
  appPreviewImageDark?: string;     // Dark mode screenshot
  // Email-signup variant - Form
  formPlaceholder?: string;         // Email input placeholder
  formButtonText?: string;          // Form submit button text
  formAction?: string;              // Form submission endpoint
  // Email-signup variant - Editable Mockup Widget
  mockupTitle?: string;             // Widget title (e.g., "Steps")
  mockupCurrentValue?: string;      // Current stat value
  mockupCurrentLabel?: string;      // Label for current stat
  mockupPreviousValue?: string;     // Previous stat value
  mockupPreviousLabel?: string;     // Label for previous stat
  mockupDescription?: string;       // Description text
  mockupCurrentYear?: string;       // Current year label
  mockupPreviousYear?: string;      // Previous year label
  // Scroll-3d variant
  cardTitle?: string;               // Large centered title text
  cardImageUrl?: string;            // Main card image
  // Parallax gallery variant
  galleryImages?: { url: string; title?: string }[]; // 18 images for 3-row gallery
  // Logo cloud (all hero variants)
  logoScrollSpeed?: number;         // Logo marquee speed (0.5-2.0)
  // Subheading configuration
  subheadingAnimation?: SubheadingAnimation;
  subheadingSize?: SubheadingSize;
  subheadingWeight?: SubheadingWeight;
  subheadingOpacity?: number; // 50-100 (default 80)
  // Sales Funnel Hero variant fields
  topTitle?: string;           // Small text above main heading
  ctaText?: string;            // CTA button text
  ctaUrl?: string;             // CTA button URL
  ctaSecondaryText?: string;   // Secondary text below CTA (e.g., "Only $47")
  badgeIcon?: string;          // Icon name for badge (e.g., "checkmark", "shield")
  heroImageUrl?: string;       // Hero image URL
  heroImageAlt?: string;       // Hero image alt text
  // Glassmorphism-trust hero variant fields
  statValue?: string;          // Main stat number (e.g., "150+")
  statLabel?: string;          // Main stat description (e.g., "Projects Delivered")
  progressLabel?: string;      // Progress bar label (e.g., "Client Satisfaction")
  progressValue?: number;      // Progress bar percentage (0-100)
  miniStats?: { value: string; label: string }[];  // Array of mini stats
  clientLogos?: { name: string; icon?: string; imageUrl?: string }[];  // Client logos for marquee (icon or image URL)
  backgroundImageUrl?: string; // Hero background image URL
  // Glassmorphism-trust visibility toggles
  showAccentHeading?: boolean; // Show gradient accent heading line
  showMiniStats?: boolean;     // Show mini stats in stats card
  showClientLogos?: boolean;   // Show client logos marquee
  // Glassmorphism-trust spacing
  heroElementGap?: number;     // Gap between hero left column elements (px)
  statsCardGap?: number;       // Gap inside stats card between elements (px)
  // Glassmorphism-trust video modal
  showreelVideoUrl?: string;   // YouTube, Vimeo, or MP4 URL for "Watch Showreel" button
  // Video section specific
  autoplayVideo?: boolean;
  muteVideo?: boolean;
  showVideoControls?: boolean;
  videoDuration?: string;  // Duration display (e.g., "5:30")
  videoAspectRatio?: '16:9' | '4:3' | '1:1';
  backgroundEffect?: BackgroundEffect;
  backgroundConfig?: BackgroundConfig;
  headingStyle?: HeadingStyle;
  // Section-level padding overrides
  paddingTop?: number;      // Custom top padding in pixels
  paddingBottom?: number;   // Custom bottom padding in pixels
  paddingLeft?: number;     // Custom left padding in pixels
  paddingRight?: number;    // Custom right padding in pixels
  // Element-level style overrides keyed by field name
  // e.g., { "heading": { fontSize: 48, fontWeight: "bold" }, "subheading": { color: "#ff0000" } }
  elementStyles?: Record<string, ElementStyleOverride>;
  // Blank section specific
  minHeight?: number;        // Min height in pixels for blank canvas
  // Loader section specific
  logoSize?: LogoSize;       // Logo size preset or custom
  customLogoSize?: number;   // Custom logo width in pixels (when logoSize is "custom")
  transitionAnimation?: TransitionAnimation; // Page transition animation
  transitionDuration?: number; // Transition duration in seconds (default 0.8)
  // Sales Funnel sections
  // Value Proposition section
  bodyParagraphs?: string[];        // Array of paragraph text
  // Offer Details section
  featuredImageUrl?: string;        // Large product/featured image
  featuredImageAlt?: string;        // Alt text for featured image
  // Creator section
  creatorPhotoUrl?: string;         // Creator/expert photo
  creatorPhotoAlt?: string;         // Alt text for creator photo
  creatorName?: string;             // Creator name
  creatorRole?: string;             // Creator title/role
  creatorBio?: string;              // Multi-paragraph bio (string with \n\n or will be split)
  creatorCredentials?: string[];    // Optional array of credentials
  // Detailed Features section
  introText?: string;               // Brief intro before feature list
  // Per-section animation override (overrides page-level animationPreset)
  sectionAnimationPreset?: AnimationPreset;
  sectionAnimationDelay?: number; // delay in seconds (0-2)
  // Per-section typography overrides
  sectionHeadingFont?: string;
  sectionBodyFont?: string;
  sectionHeadingSizeScale?: number; // 0.5-2.0 multiplier
  sectionTextAlign?: 'left' | 'center' | 'right';
  // Per-section spacing overrides
  sectionContentGap?: number; // gap in px
  sectionMaxWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  // Whop University / Sales Funnel sections
  body?: string;
  pullQuote?: string;
  pullQuoteAuthor?: string;
  solutionTeaser?: string;
  painPoints?: string[];
  features?: string[];
  creatorImageUrl?: string;
  trustText?: string;
  credentialBadge?: string;
  credentials?: string[];
  highlights?: string[];
  summary?: string;
  originalPrice?: string;
  price?: string;
  pricePeriod?: string;
  socialProof?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
};

export type PageSection = {
  id: string;
  type: SectionType;
  content: SectionContent;
  items?: SectionItem[];
  elements?: PageElement[];  // Custom elements layer for free positioning
};

export type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type Typography = {
  headingFont: string;
  bodyFont: string;
  headingWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  bodyWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  headingSizeScale?: number;    // 0.75-1.5 multiplier
  bodyLineHeight?: number;      // 1.2-2.0
  headingLetterSpacing?: string; // e.g., '-0.02em', '0.05em'
  bodyLetterSpacing?: string;
};

export type SmoothScrollConfig = {
  lerp?: number;       // 0.05-0.2 (default 0.1)
  duration?: number;   // 0.5-2.0 (default 1.2)
  syncTouch?: boolean; // enable on touch devices
};

// Theme presets for quick color scheme switching
export const THEME_PRESETS: Record<string, { name: string; colorScheme: ColorScheme }> = {
  dark: {
    name: "Dark",
    colorScheme: {
      primary: "#D6FC51",
      secondary: "#3b82f6",
      accent: "#D6FC51",
      background: "#0a0a0a",
      text: "#ffffff",
    },
  },
  light: {
    name: "Light",
    colorScheme: {
      primary: "#0a0a0a",
      secondary: "#3b82f6",
      accent: "#D6FC51",
      background: "#ffffff",
      text: "#0a0a0a",
    },
  },
  midnight: {
    name: "Midnight",
    colorScheme: {
      primary: "#e94560",
      secondary: "#0f3460",
      accent: "#e94560",
      background: "#1a1a2e",
      text: "#eaeaea",
    },
  },
  forest: {
    name: "Forest",
    colorScheme: {
      primary: "#4ade80",
      secondary: "#22c55e",
      accent: "#4ade80",
      background: "#0f1f0f",
      text: "#f0fdf4",
    },
  },
  ocean: {
    name: "Ocean",
    colorScheme: {
      primary: "#38bdf8",
      secondary: "#0ea5e9",
      accent: "#38bdf8",
      background: "#0c1929",
      text: "#f0f9ff",
    },
  },
  sunset: {
    name: "Sunset",
    colorScheme: {
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#fb923c",
      background: "#1c1413",
      text: "#fff7ed",
    },
  },
};

export type SEOSettings = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, any>;
};

export type LandingPage = {
  title: string;
  description: string;
  sections: PageSection[];
  colorScheme: ColorScheme;
  typography: Typography;
  // Page-level settings
  smoothScroll?: boolean;
  smoothScrollConfig?: SmoothScrollConfig;
  animationPreset?: AnimationPreset;
  // Responsive scaling reference (design canvas width in px)
  designCanvasWidth?: number; // Default: 896 (max-w-4xl)
  // Content width for section alignment (narrow=672px, medium=896px, wide=1152px)
  contentWidth?: ContentWidth;
  // SEO settings
  seo?: SEOSettings;
};

export type ProjectSettings = {
  favicon?: string;
  ogImage?: string;
  customCss?: string;
  customHead?: string;
};

// Default design canvas width (standard desktop = 1280px)
export const DEFAULT_DESIGN_WIDTH = 1280;

// Default content width
export const DEFAULT_CONTENT_WIDTH: ContentWidth = "medium";

// Get Tailwind max-width class from contentWidth setting
export function getContentWidthClass(width?: ContentWidth): string {
  switch (width) {
    case "narrow":
      return "max-w-2xl"; // 672px - Sales funnel style
    case "medium":
      return "max-w-4xl"; // 896px - Balanced
    case "wide":
      return "max-w-6xl"; // 1152px - SaaS style
    default:
      return "max-w-4xl"; // Default to medium
  }
}

// Default empty page template
export const defaultPage: LandingPage = {
  title: "Untitled Page",
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
  designCanvasWidth: DEFAULT_DESIGN_WIDTH,
  contentWidth: DEFAULT_CONTENT_WIDTH,
};

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Create a new section with defaults
export function createSection(type: SectionType, options?: { ctaVariant?: CTAVariant; headerVariant?: HeaderVariant; testimonialVariant?: TestimonialVariant; featuresVariant?: FeaturesVariant; heroVariant?: HeroVariant }): PageSection {
  const baseSection: PageSection = {
    id: generateId(),
    type,
    content: {
      backgroundColor: "#ffffff",
      textColor: "#111827",
      layout: "center",
    },
    items: [],
  };

  // Add type-specific defaults
  switch (type) {
    case "hero":
      const heroVariant = options?.heroVariant || "default";
      if (heroVariant === "sales-funnel") {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          topTitle: "For [Target Audience] That Want To...",
          heading: "Your Compelling Main Headline Here",
          subheading: "Clear benefit statement that makes them want to learn more",
          imageUrl: "",
          ctaText: "YES! DOWNLOAD NOW!",
          ctaUrl: "#",
          ctaSecondaryText: "Only $47 - one time payment",
          badge: "365 DAYS MONEY BACK GUARANTEE",
          badgeIcon: "checkmark",
          showBadge: true,
        };
      } else if (heroVariant === "glassmorphism-trust") {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          badge: "Award-Winning Design",
          heading: "Crafting Digital",
          accentHeading: "Experiences",
          subheading: "That Matter",
          bodyText: "We design interfaces that combine beauty with functionality, creating seamless experiences that users love and businesses thrive on.",
          buttonText: "View Portfolio",
          buttonLink: "#",
          secondaryButtonText: "Watch Showreel",
          secondaryButtonLink: "#",
          statValue: "150+",
          statLabel: "Projects Delivered",
          progressLabel: "Client Satisfaction",
          progressValue: 98,
          miniStats: [
            { value: "5+", label: "Years" },
            { value: "24/7", label: "Support" },
            { value: "100%", label: "Quality" },
          ],
          clientLogos: [
            { name: "Acme Corp", icon: "hexagon" },
            { name: "Quantum", icon: "triangle" },
            { name: "Command+Z", icon: "command" },
            { name: "Phantom", icon: "ghost" },
            { name: "Ruby", icon: "gem" },
            { name: "Chipset", icon: "cpu" },
          ],
          backgroundImageUrl: "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80",
          backgroundColor: "#09090b",
          accentColor: "#ffcd75",
        };
      } else if (heroVariant === "hero-email-glass") {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          heading: "Join the Future of Creation",
          subheading: "Get early access to our platform and start building today.",
          badge: "Early Access",
          showBadge: true,
          formPlaceholder: "Enter your email address",
          formButtonText: "Get Access",
          buttonText: "Get Access",
          brands: ["10,000+ Creators", "Trusted Worldwide"],
          backgroundColor: "#0a0a0a",
          textColor: "#ffffff",
        };
      } else if (heroVariant === "hero-form-multi") {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          heading: "Start Your Free Trial",
          subheading: "No credit card required. Get started in under 2 minutes.",
          formPlaceholder: "your@email.com",
          formButtonText: "Start Free Trial",
          buttonText: "Start Free Trial",
          showBadge: true,
          badge: "Free Trial",
          backgroundColor: "#0a0a0a",
          textColor: "#ffffff",
        };
      } else if (heroVariant === "hero-split-form") {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          heading: "Get Early Access",
          subheading: "Be the first to experience our platform. Sign up now and get exclusive benefits.",
          badge: "Early Access",
          showBadge: true,
          formPlaceholder: "Enter your email",
          formButtonText: "Get Started",
          buttonText: "Get Started",
          heroImageUrl: "",
          backgroundColor: "#0a0a0a",
          textColor: "#ffffff",
        };
      } else {
        baseSection.content = {
          ...baseSection.content,
          heroVariant,
          heading: "Welcome to Your Landing Page",
          subheading: "Describe your product or service here",
          buttonText: "Get Started",
          buttonLink: "#",
        };
      }
      break;
    case "features":
      const featuresVariant = options?.featuresVariant || "default";

      baseSection.content = {
        ...baseSection.content,
        featuresVariant,
        heading: featuresVariant === "table" ? "Recent Customers" : "Features",
        subheading: featuresVariant === "table"
          ? "A list of your recent customers and their details"
          : "Powerful features designed to help you succeed",
        layout: "grid",
        // Subheading defaults
        subheadingAnimation: "fadeUp",
        subheadingSize: "base",
        subheadingWeight: "normal",
        subheadingOpacity: 80,
      };

      // Variant-specific default items
      if (featuresVariant === "default") {
        // Default bento grid items with images
        baseSection.items = [
          {
            id: generateId(),
            title: "Lightning Fast",
            description: "Experience blazing fast performance with our optimized infrastructure",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
            gridClass: "md:col-span-1"
          },
          {
            id: generateId(),
            title: "Secure by Default",
            description: "Enterprise-grade security built into every layer",
            imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop",
            gridClass: "md:col-span-2"
          },
          {
            id: generateId(),
            title: "Easy Integration",
            description: "Connect with your existing tools in minutes",
            imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
            gridClass: "md:col-span-1"
          },
        ];
      } else if (featuresVariant === "illustrated") {
        // Illustrated features with icon and illustration type
        baseSection.items = [
          {
            id: generateId(),
            title: "Strategic Planning",
            description: "Align your team with clear objectives and measurable goals that drive success",
            icon: "target",
            illustrationType: "meeting"
          },
          {
            id: generateId(),
            title: "Collaborative Workflow",
            description: "Streamline your development process with built-in code review and feedback tools",
            icon: "calendar",
            illustrationType: "code-review"
          },
          {
            id: generateId(),
            title: "AI-Powered Insights",
            description: "Get intelligent suggestions and automated assistance to boost productivity",
            icon: "sparkles",
            illustrationType: "ai-assistant"
          },
        ];
      } else if (featuresVariant === "hover") {
        // Hover features with icons
        baseSection.items = [
          { id: generateId(), title: "Built for developers", description: "Built for engineers, developers, dreamers, thinkers and doers", icon: "terminal" },
          { id: generateId(), title: "Ease of use", description: "It's as easy as using an Apple, and as expensive as buying one", icon: "ease" },
          { id: generateId(), title: "Pricing like no other", description: "Our prices are best in the market. No cap, no lock, no credit card required", icon: "dollar" },
          { id: generateId(), title: "100% Uptime guarantee", description: "We just cannot be taken down by anyone", icon: "cloud" },
          { id: generateId(), title: "Multi-tenant Architecture", description: "You can simply share passwords instead of buying new seats", icon: "route" },
          { id: generateId(), title: "24/7 Customer Support", description: "We are available a 100% of the time. Atleast our AI Agents are", icon: "help" },
          { id: generateId(), title: "Money back guarantee", description: "If you donot like EveryAI, we will convince you to like us", icon: "adjustments" },
          { id: generateId(), title: "And everything else", description: "I just ran out of copy ideas. Accept my sincere apologies", icon: "heart" },
        ];
      } else if (featuresVariant === "bento") {
        // Bento grid with varied sizes and spiral background
        baseSection.content.backgroundColor = "#0a1628";
        baseSection.items = [
          {
            id: generateId(),
            title: "Lightning Fast",
            description: "Experience blazing fast performance with our optimized infrastructure",
            gridClass: "md:col-span-4 md:row-span-2"
          },
          {
            id: generateId(),
            title: "Secure",
            description: "Enterprise-grade security",
            gridClass: "md:col-span-2 md:row-span-1"
          },
          {
            id: generateId(),
            title: "Scalable",
            description: "Grows with your business",
            gridClass: "md:col-span-2 md:row-span-1"
          },
          {
            id: generateId(),
            title: "Easy to Use",
            description: "Intuitive interface",
            gridClass: "md:col-span-2 md:row-span-1"
          },
          {
            id: generateId(),
            title: "Analytics",
            description: "Real-time insights",
            gridClass: "md:col-span-2 md:row-span-1"
          },
        ];
      } else if (featuresVariant === "table") {
        // Customer table with metadata
        baseSection.items = [
          {
            id: generateId(),
            title: "Sarah Johnson",
            description: "sarah.j@example.com",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            metadata: JSON.stringify({ status: "active", revenue: "$12,450", joinDate: "2024-01-15" })
          },
          {
            id: generateId(),
            title: "Michael Chen",
            description: "m.chen@company.com",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            metadata: JSON.stringify({ status: "active", revenue: "$8,200", joinDate: "2024-02-03" })
          },
          {
            id: generateId(),
            title: "Emily Rodriguez",
            description: "emily.r@business.io",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            metadata: JSON.stringify({ status: "pending", revenue: "$5,100", joinDate: "2024-03-12" })
          },
          {
            id: generateId(),
            title: "James Wilson",
            description: "j.wilson@startup.co",
            imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
            metadata: JSON.stringify({ status: "inactive", revenue: "$3,800", joinDate: "2023-11-20" })
          },
        ];
      }
      break;
    case "testimonials":
      baseSection.content = {
        ...baseSection.content,
        heading: "What Our Customers Say",
        subheading: "Real stories from real people",
        testimonialVariant: options?.testimonialVariant || "scrolling",
      };
      baseSection.items = [
        { id: generateId(), title: "Game Changer", description: "This platform completely transformed our workflow. We shipped 3x faster.", author: "Sarah Chen", role: "CTO at TechFlow", rating: 5 },
        { id: generateId(), title: "Best Investment", description: "The ROI we've seen has been incredible. Highly recommended.", author: "Marcus Johnson", role: "Founder at LaunchPad", rating: 5 },
        { id: generateId(), title: "Love It", description: "Simple, powerful, and beautiful. Everything we wanted in a tool.", author: "Emily Park", role: "Product Lead at Acme", rating: 5 },
      ];
      break;
    case "pricing":
      baseSection.content = {
        ...baseSection.content,
        heading: "Simple, Transparent Pricing",
        subheading: "Choose the plan that fits your needs",
      };
      baseSection.items = [
        { id: generateId(), title: "Starter", price: "$9/mo", description: "Perfect for individuals", features: ["3 Projects", "5GB Storage", "Basic Analytics", "Email Support"], buttonText: "Get Started", buttonLink: "#" },
        { id: generateId(), title: "Pro", price: "$29/mo", description: "For growing teams", features: ["Unlimited Projects", "50GB Storage", "Advanced Analytics", "Priority Support", "Custom Domain"], popular: true, buttonText: "Start Free Trial", buttonLink: "#" },
        { id: generateId(), title: "Enterprise", price: "$99/mo", description: "For large organizations", features: ["Everything in Pro", "Unlimited Storage", "SSO & SAML", "Dedicated Manager"], buttonText: "Contact Sales", buttonLink: "#" },
      ];
      break;
    case "cta":
      baseSection.content = {
        ...baseSection.content,
        heading: "Ready to Get Started?",
        subheading: "Join thousands of happy customers",
        buttonText: "Start Now",
        buttonLink: "#",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        ctaVariant: options?.ctaVariant || "centered",
      };
      break;
    case "faq":
      baseSection.content = {
        ...baseSection.content,
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know",
      };
      baseSection.items = [
        { id: generateId(), title: "How does the free trial work?", description: "You get full access to all features for 14 days. No credit card required." },
        { id: generateId(), title: "Can I change my plan later?", description: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
        { id: generateId(), title: "Is there a money-back guarantee?", description: "Yes! We offer a 30-day money-back guarantee on all paid plans." },
        { id: generateId(), title: "What payment methods do you accept?", description: "We accept all major credit cards, PayPal, and bank transfers for annual plans." },
      ];
      break;
    case "video":
      baseSection.content = {
        ...baseSection.content,
        heading: "See It In Action",
        subheading: "Watch a quick walkthrough of our platform",
        videoUrl: "",
        videoVariant: "centered",
        autoplayVideo: false,
        muteVideo: true,
        videoDuration: "2:30",
      };
      break;
    case "gallery":
      baseSection.content = {
        ...baseSection.content,
        heading: "Our Work",
        subheading: "A showcase of our latest projects",
        layout: "grid",
        galleryVariant: "bento",
      };
      baseSection.items = [
        { id: generateId(), title: "Brand Identity" },
        { id: generateId(), title: "Web Design" },
        { id: generateId(), title: "Mobile App" },
        { id: generateId(), title: "Dashboard UI" },
      ];
      break;
    case "header":
      baseSection.content = {
        ...baseSection.content,
        logoText: "Your Brand",
        backgroundColor: "transparent",
        textColor: "#ffffff",
        headerVariant: options?.headerVariant || "default",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "Contact", url: "#contact" },
        ],
        buttonText: "Get Started",
        buttonLink: "#",
      };
      break;
    case "founders":
      baseSection.content = {
        ...baseSection.content,
        heading: "Meet the Team",
        subheading: "The People Behind the Product",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "John Doe",
          label: "30+ Years Experience",
          role: "Co-Founder",
          bio: "Industry veteran with decades of experience building successful products.",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
          linkedinUrl: "#",
        },
        {
          id: generateId(),
          title: "Jane Smith",
          label: "AI Pioneer",
          role: "Co-Founder",
          bio: "Leading expert in AI and machine learning applications.",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          linkedinUrl: "#",
        },
      ];
      break;
    case "credibility":
      baseSection.content = {
        ...baseSection.content,
        heading: "We've Been Where You Are",
        subheading: "Years of experience, now available to you",
        bodyText: "We've built businesses, made mistakes, and learned what actually works. Now we're sharing everything.",
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
        overlayOpacity: 0.7,
        buttonText: "Join Us",
        buttonLink: "#pricing",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
      };
      break;
    case "offer":
      baseSection.content = {
        ...baseSection.content,
        badge: "Limited Time Offer",
        heading: "Everything You Need",
        subheading: "One price. Full access. No surprises.",
        priceYearly: "$299/year",
        priceMonthly: "$25/month",
        buttonText: "Get Access Now",
        buttonLink: "#",
        showButton: true,
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Your Product",
          price: "$299",
          description: "One investment. Unlimited potential.",
          features: [
            "Full access to all tools",
            "Daily updates and insights",
            "Complete resource library",
            "Expert consulting sessions",
            "Private community access",
          ],
        },
      ];
      break;
    case "audience":
      baseSection.content = {
        ...baseSection.content,
        heading: "Is This For You?",
        forHeading: "This Is For You If...",
        notForHeading: "This Is NOT For You If...",
        forItems: [
          "You're ready to put in the work",
          "You want to build a real business",
          "You're open to learning new things",
          "You value community and collaboration",
        ],
        notForItems: [
          "You're looking for get-rich-quick schemes",
          "You're not willing to invest in yourself",
          "You expect results without effort",
          "You want someone to do it all for you",
        ],
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      };
      break;
    case "footer":
      baseSection.content = {
        ...baseSection.content,
        logoText: "Your Brand",
        tagline: "Build. Create. Succeed.",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        links: [
          { label: "Twitter", url: "#" },
          { label: "Contact", url: "#" },
          { label: "Privacy", url: "#" },
        ],
        bodyText: "© 2024 Your Brand. All rights reserved.",
      };
      break;
    case "stats":
      baseSection.content = {
        ...baseSection.content,
        badge: "Results",
        heading: "Numbers That Speak",
        subheading: "Our impact in numbers",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      };
      baseSection.items = [
        { id: generateId(), title: "10,000+", description: "Happy Customers" },
        { id: generateId(), title: "$5M+", description: "Revenue Generated" },
        { id: generateId(), title: "99%", description: "Satisfaction Rate" },
        { id: generateId(), title: "24/7", description: "Support Available" },
      ];
      break;
    case "logoCloud":
      baseSection.content = {
        ...baseSection.content,
        heading: "Trusted by Industry Leaders",
        subheading: "Join thousands of satisfied customers",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        brands: ["Nike", "Apple", "Google", "Amazon", "Microsoft", "Tesla"],
      };
      break;
    case "comparison":
      baseSection.content = {
        ...baseSection.content,
        badge: "Comparison",
        heading: "Why Choose Us?",
        subheading: "See how we stack up against the competition",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Us",
          features: [
            "Unlimited projects",
            "Priority support",
            "Custom integrations",
            "Advanced analytics",
            "Team collaboration",
          ],
        },
        {
          id: generateId(),
          title: "Others",
          features: [
            "Limited projects",
            "Basic support",
          ],
        },
      ];
      break;
    case "process":
      baseSection.content = {
        ...baseSection.content,
        badge: "How It Works",
        heading: "Simple 3-Step Process",
        subheading: "Get started in minutes, not hours",
        buttonText: "Get Started Now",
        buttonLink: "#",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Sign Up",
          description: "Create your account in seconds. No credit card required.",
          icon: "1",
        },
        {
          id: generateId(),
          title: "Customize",
          description: "Personalize your experience to match your unique needs.",
          icon: "2",
        },
        {
          id: generateId(),
          title: "Launch",
          description: "Go live and start seeing results immediately.",
          icon: "3",
        },
      ];
      break;
    case "loader":
      baseSection.content = {
        ...baseSection.content,
        heading: "Welcome",
        buttonText: "Enter",
        buttonLink: "#content",
        buttonVariant: "primary",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        logoUrl: "",
        logoSize: "medium",
        transitionAnimation: "fade",
        transitionDuration: 0.8,
        backgroundEffect: "none",
      };
      break;
    case "blank":
      baseSection.content = {
        ...baseSection.content,
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        minHeight: 300,
      };
      break;
    // Sales Funnel sections
    case "value-proposition":
      baseSection.content = {
        ...baseSection.content,
        heading: "Here's How It Works",
        badge: "VALUE PROPOSITION",
        showBadge: true,
        bodyParagraphs: [
          "Tell your story here. This section is perfect for explaining the problem your audience faces and how your solution helps them.",
          "Build empathy by describing the pain points and challenges. Make it personal and relatable.",
          "Reveal your solution and explain why it works. Focus on benefits, not features."
        ],
        backgroundColor: "#ffffff",
        textColor: "#111827",
      };
      break;
    case "offer-details":
      baseSection.content = {
        ...baseSection.content,
        heading: "What You Get",
        description: "Everything included in your purchase:",
        badge: "THE OFFER",
        showBadge: true,
        featuredImageUrl: "",
        featuredImageAlt: "Product image",
        backgroundColor: "#ffffff",
        textColor: "#111827",
      };
      baseSection.items = [
        { id: generateId(), title: "Complete Access", description: "Full access to all features and content", icon: "check" },
        { id: generateId(), title: "Lifetime Updates", description: "Get all future updates and improvements for free", icon: "check" },
        { id: generateId(), title: "24/7 Support", description: "Round-the-clock customer support when you need it", icon: "check" },
        { id: generateId(), title: "Money-Back Guarantee", description: "30-day risk-free guarantee if you're not satisfied", icon: "check" },
        { id: generateId(), title: "Community Access", description: "Join our exclusive community of users", icon: "check" },
        { id: generateId(), title: "Bonus Resources", description: "Extra templates, guides, and resources", icon: "check" },
      ];
      break;
    case "creator":
      baseSection.content = {
        ...baseSection.content,
        heading: "Meet Your Instructor",
        creatorPhotoUrl: "",
        creatorPhotoAlt: "Creator photo",
        creatorName: "Your Name",
        creatorRole: "Expert & Founder",
        creatorBio: "Share your story here. Explain who you are, what you've accomplished, and why you're qualified to help your audience.\n\nBuild trust by sharing your experience, credentials, and personal journey. Make it authentic and relatable.\n\nConnect with your audience on an emotional level. Show them you understand their challenges because you've been there too.",
        creatorCredentials: [
          "10+ years of experience in the field",
          "Helped 1,000+ clients achieve success",
          "Featured in major publications",
          "Certified expert and thought leader"
        ],
        backgroundColor: "#ffffff",
        textColor: "#111827",
      };
      break;
    case "detailed-features":
      baseSection.content = {
        ...baseSection.content,
        heading: "What's Inside",
        introText: "Here's everything you'll get access to:",
        featuredImageUrl: "",
        featuredImageAlt: "Product features",
        backgroundColor: "#ffffff",
        textColor: "#111827",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Core Module 1",
          description: "Learn the fundamental concepts and strategies that form the foundation of success.",
          icon: "star"
        },
        {
          id: generateId(),
          title: "Advanced Techniques",
          description: "Master advanced methods used by top professionals to get extraordinary results.",
          icon: "rocket"
        },
        {
          id: generateId(),
          title: "Step-by-Step System",
          description: "Follow our proven system that takes you from beginner to expert level.",
          icon: "chart"
        },
        {
          id: generateId(),
          title: "Templates & Tools",
          description: "Access our complete library of ready-to-use templates and tools.",
          icon: "cube"
        },
        {
          id: generateId(),
          title: "Video Training",
          description: "Watch over 50 hours of detailed video training covering every aspect.",
          icon: "sparkles"
        },
        {
          id: generateId(),
          title: "Worksheets & Guides",
          description: "Download practical worksheets and guides to implement what you learn.",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Case Studies",
          description: "Study real-world examples and success stories from our clients.",
          icon: "lightning"
        },
        {
          id: generateId(),
          title: "Bonus Resources",
          description: "Get exclusive access to bonus materials and premium resources.",
          icon: "heart"
        },
      ];
      break;
    // Glass 3D sections
    case "glass-cta":
      baseSection.content = {
        ...baseSection.content,
        heading: "Ready to get started?",
        subheading: "Join thousands of happy customers",
        buttonText: "Start Free Trial",
        buttonLink: "#",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      break;
    case "glass-features":
      baseSection.content = {
        ...baseSection.content,
        badge: "FEATURES",
        heading: "Everything You Need to Succeed",
        subheading: "Powerful tools designed to help you build, launch, and scale.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        { id: generateId(), icon: "🚀", title: "Lightning Fast", description: "Experience blazing fast performance with our optimized infrastructure." },
        { id: generateId(), icon: "💰", title: "Built-in Payments", description: "Accept payments globally with Stripe, PayPal, and crypto." },
        { id: generateId(), icon: "📊", title: "Real-time Analytics", description: "Track conversions and revenue with beautiful dashboards." },
        { id: generateId(), icon: "🎨", title: "Custom Branding", description: "Make it yours with custom domains, colors, and fonts." },
        { id: generateId(), icon: "🔒", title: "Enterprise Security", description: "SOC 2 compliant with end-to-end encryption." },
        { id: generateId(), icon: "🤝", title: "24/7 Support", description: "Get help anytime from our expert team." },
      ];
      break;
    case "glass-founders":
      baseSection.content = {
        ...baseSection.content,
        badge: "MEET THE TEAM",
        heading: "Built by Founders, for Founders",
        subheading: "We've been in your shoes. Now we're building the tools we wish we had.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Alex Chen",
          role: "CEO & Founder",
          bio: "Built 3 successful startups. $50M+ in exits. Forbes 30 Under 30.",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
          label: "Serial Entrepreneur",
          features: ["YC Alumni", "Forbes 30u30"],
        },
        {
          id: generateId(),
          title: "Sarah Mitchell",
          role: "CTO",
          bio: "Ex-Google, Ex-Meta. 15 years building scalable systems.",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          label: "Tech Veteran",
          features: ["Ex-Google", "Ex-Meta"],
        },
        {
          id: generateId(),
          title: "Marcus Johnson",
          role: "Head of Product",
          bio: "Led product at 2 unicorns. Shipped to 10M+ users.",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
          label: "Product Expert",
          features: ["Unicorn Builder", "10M+ Users"],
        },
      ];
      break;
    case "glass-testimonials":
      baseSection.content = {
        ...baseSection.content,
        badge: "TESTIMONIALS",
        heading: "Loved by Thousands",
        subheading: "Don't just take our word for it.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "$50K MRR",
          description: "This platform completely transformed how I run my business. Revenue is up 300% in just 3 months.",
          author: "Emily Park",
          role: "Course Creator",
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
          rating: 5,
        },
        {
          id: generateId(),
          title: "10x ROI",
          description: "The best investment I've ever made. The ROI paid for itself in the first week.",
          author: "David Rodriguez",
          role: "Agency Owner",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
          rating: 5,
        },
        {
          id: generateId(),
          title: "Quit Job",
          description: "Finally quit my 9-5 thanks to this. The community alone is worth the price.",
          author: "Jennifer Lee",
          role: "Full-time Creator",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
          rating: 5,
        },
      ];
      break;
    case "glass-pricing":
      baseSection.content = {
        ...baseSection.content,
        badge: "PRICING",
        heading: "Simple, Transparent Pricing",
        subheading: "No hidden fees. No surprises. Cancel anytime.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Starter",
          price: "$29/mo",
          description: "Perfect for getting started",
          features: ["5 Projects", "10GB Storage", "Basic Analytics", "Email Support"],
          buttonText: "Start Free Trial",
          buttonLink: "#",
          popular: false,
        },
        {
          id: generateId(),
          title: "Pro",
          price: "$79/mo",
          description: "For growing businesses",
          features: ["Unlimited Projects", "100GB Storage", "Advanced Analytics", "Priority Support", "Custom Domain", "API Access"],
          buttonText: "Get Started",
          buttonLink: "#",
          popular: true,
        },
        {
          id: generateId(),
          title: "Enterprise",
          price: "$199/mo",
          description: "For large teams",
          features: ["Everything in Pro", "Unlimited Storage", "Dedicated Manager", "SLA Guarantee", "SSO/SAML", "Custom Integrations"],
          buttonText: "Contact Sales",
          buttonLink: "#",
          popular: false,
        },
      ];
      break;
    // Whop University premium funnel sections
    case "whop-hero":
      baseSection.content = {
        ...baseSection.content,
        badge: "New Course Available",
        heading: "Master the Art of Building",
        accentHeading: "Profitable Digital Products",
        subheading: "Learn the exact strategies that generated $2M+ in revenue",
        buttonText: "Enroll Now",
        buttonLink: "#",
        secondaryButtonText: "Watch Preview",
        secondaryButtonLink: "#",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      break;
    case "whop-value-prop":
      baseSection.content = {
        ...baseSection.content,
        badge: "Why This Course",
        heading: "Everything You Need to Succeed",
        subheading: "Three pillars of our proven methodology",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        { id: generateId(), title: "Proven Framework", description: "Battle-tested strategies used by 500+ successful creators", icon: "target" },
        { id: generateId(), title: "Live Mentorship", description: "Weekly live calls with industry experts", icon: "sparkles" },
        { id: generateId(), title: "Community Access", description: "Join a private network of ambitious creators", icon: "heart" },
      ];
      break;
    case "whop-offer":
      baseSection.content = {
        ...baseSection.content,
        badge: "The Offer",
        heading: "Everything You Get",
        subheading: "One investment, lifetime access",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        { id: generateId(), title: "Core Course", description: "40+ hours of video content", price: "$997" },
        { id: generateId(), title: "Templates Pack", description: "50+ ready-to-use templates", price: "$297" },
        { id: generateId(), title: "Private Community", description: "Lifetime access", price: "$497" },
      ];
      break;
    case "whop-cta":
      baseSection.content = {
        ...baseSection.content,
        heading: "Don't Miss Out",
        subheading: "Limited spots available for this cohort",
        buttonText: "Enroll Now",
        buttonLink: "#",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      break;
    case "whop-comparison":
      baseSection.content = {
        ...baseSection.content,
        badge: "Comparison",
        heading: "Why Students Choose Us",
        subheading: "See how we compare to alternatives",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Our Course",
          features: ["Proven $2M+ framework", "Live weekly coaching", "Private community", "Lifetime updates"],
        },
        {
          id: generateId(),
          title: "Other Courses",
          features: ["Generic advice", "No support", "Outdated content"],
        },
      ];
      break;
    case "whop-creator":
      baseSection.content = {
        ...baseSection.content,
        heading: "Your Instructor",
        creatorName: "Your Name",
        creatorRole: "Expert & Educator",
        creatorBio: "Share your story and credentials here. Build trust with your audience by highlighting your experience and achievements.",
        creatorCredentials: [
          "10+ years of experience",
          "1,000+ students mentored",
          "Featured in major publications",
        ],
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      break;
    case "whop-curriculum":
      baseSection.content = {
        ...baseSection.content,
        badge: "Curriculum",
        heading: "What's Inside",
        subheading: "A comprehensive roadmap to success",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Module 1: Foundation",
          description: "Build your knowledge base",
          duration: "4 hours",
          lessons: ["Finding your niche", "Market research", "Setting up"],
        },
        {
          id: generateId(),
          title: "Module 2: Building",
          description: "Create your first product",
          duration: "6 hours",
          lessons: ["Product ideation", "MVP development", "Design principles"],
        },
        {
          id: generateId(),
          title: "Module 3: Launch & Scale",
          description: "Go to market and grow",
          duration: "5 hours",
          lessons: ["Launch planning", "Marketing channels", "Scaling strategies"],
        },
      ];
      break;
    case "whop-results":
      baseSection.content = {
        ...baseSection.content,
        badge: "Student Results",
        heading: "Real Results",
        subheading: "From our community of students",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        { id: generateId(), title: "Sarah K.", result: "$12K/mo in 90 days", description: "Went from zero to $12K monthly revenue" },
        { id: generateId(), title: "James M.", result: "Quit 9-5 in 6 months", description: "Replaced his corporate salary" },
        { id: generateId(), title: "Lisa T.", result: "500+ customers", description: "Built a thriving community from scratch" },
      ];
      break;
    case "whop-testimonials":
      baseSection.content = {
        ...baseSection.content,
        badge: "Testimonials",
        heading: "What Students Say",
        subheading: "Hear from our community",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      baseSection.items = [
        {
          id: generateId(),
          title: "Life Changing",
          description: "This course completely changed my perspective on building a business.",
          author: "Maria Santos",
          role: "Course Creator",
          rating: 5,
        },
        {
          id: generateId(),
          title: "Worth Every Penny",
          description: "The only course where I actually got results. Highly recommend.",
          author: "Tom Wilson",
          role: "Freelancer",
          rating: 5,
        },
        {
          id: generateId(),
          title: "Incredible Value",
          description: "The live coaching calls alone are worth the price.",
          author: "Nina Patel",
          role: "Startup Founder",
          rating: 5,
        },
      ];
      break;
    case "whop-final-cta":
      baseSection.content = {
        ...baseSection.content,
        heading: "Your Transformation Starts Now",
        subheading: "Join students who already made the leap",
        buttonText: "Enroll Today",
        buttonLink: "#",
        bodyText: "30-day money-back guarantee. No questions asked.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      };
      break;
  }

  return baseSection;
}
