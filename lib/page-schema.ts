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
  | "process";

export type LayoutType = "left" | "right" | "center" | "grid";

// Section visual variants for template differentiation
export type StatsVariant = "cards" | "minimal" | "bars" | "circles";
export type CTAVariant = "centered" | "split" | "banner" | "minimal";
export type ProcessVariant = "timeline" | "cards" | "horizontal";

// Animation presets
export type AnimationPreset = "none" | "subtle" | "moderate" | "dramatic";

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
};

export type SectionItem = {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  price?: string;
  features?: string[];
  author?: string;
  role?: string;
  rating?: number;
  // Skinny-landing specific fields
  gridClass?: string;       // CSS grid class for bento layout (e.g., "md:col-span-2 md:row-span-2")
  aspectRatio?: string;     // Aspect ratio class (e.g., "aspect-video", "aspect-square")
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
};

export type NavLink = {
  label: string;
  url: string;
};

export type SectionContent = {
  heading?: string;
  subheading?: string;
  bodyText?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: LayoutType;
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
  headingStyle?: HeadingStyle;
  // Section-level padding overrides
  paddingTop?: number;      // Custom top padding in pixels
  paddingBottom?: number;   // Custom bottom padding in pixels
  // Element-level style overrides keyed by field name
  // e.g., { "heading": { fontSize: 48, fontWeight: "bold" }, "subheading": { color: "#ff0000" } }
  elementStyles?: Record<string, ElementStyleOverride>;
};

export type PageSection = {
  id: string;
  type: SectionType;
  content: SectionContent;
  items?: SectionItem[];
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

export type LandingPage = {
  title: string;
  description: string;
  sections: PageSection[];
  colorScheme: ColorScheme;
  typography: Typography;
  // Page-level settings
  smoothScroll?: boolean;
  animationPreset?: AnimationPreset;
};

export type ProjectSettings = {
  favicon?: string;
  ogImage?: string;
  customCss?: string;
  customHead?: string;
};

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
};

// Helper to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Create a new section with defaults
export function createSection(type: SectionType): PageSection {
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
      baseSection.content = {
        ...baseSection.content,
        heading: "Welcome to Your Landing Page",
        subheading: "Describe your product or service here",
        buttonText: "Get Started",
        buttonLink: "#",
      };
      break;
    case "features":
      baseSection.content = {
        ...baseSection.content,
        heading: "Features",
        subheading: "What makes us different",
        layout: "grid",
      };
      baseSection.items = [
        { id: generateId(), title: "Feature 1", description: "Description of feature 1", icon: "star" },
        { id: generateId(), title: "Feature 2", description: "Description of feature 2", icon: "zap" },
        { id: generateId(), title: "Feature 3", description: "Description of feature 3", icon: "shield" },
      ];
      break;
    case "testimonials":
      baseSection.content = {
        ...baseSection.content,
        heading: "What Our Customers Say",
      };
      baseSection.items = [
        { id: generateId(), title: "Great product!", description: "This changed everything for our business.", author: "John Doe", role: "CEO" },
      ];
      break;
    case "pricing":
      baseSection.content = {
        ...baseSection.content,
        heading: "Pricing",
        subheading: "Choose the plan that works for you",
      };
      baseSection.items = [
        { id: generateId(), title: "Starter", price: "$9/mo", description: "Perfect for getting started", features: ["Feature 1", "Feature 2"] },
        { id: generateId(), title: "Pro", price: "$29/mo", description: "For growing businesses", features: ["Everything in Starter", "Feature 3", "Feature 4"] },
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
      };
      break;
    case "faq":
      baseSection.content = {
        ...baseSection.content,
        heading: "Frequently Asked Questions",
      };
      baseSection.items = [
        { id: generateId(), title: "How does it work?", description: "Answer to the question goes here." },
        { id: generateId(), title: "What's included?", description: "Answer to the question goes here." },
      ];
      break;
    case "video":
      baseSection.content = {
        ...baseSection.content,
        heading: "See It In Action",
        videoUrl: "",
      };
      break;
    case "gallery":
      baseSection.content = {
        ...baseSection.content,
        heading: "Gallery",
        layout: "grid",
      };
      break;
    case "header":
      baseSection.content = {
        ...baseSection.content,
        logoText: "Your Brand",
        backgroundColor: "transparent",
        textColor: "#ffffff",
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
  }

  return baseSection;
}
