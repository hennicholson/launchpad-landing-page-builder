import type {
  SectionType,
  PageSection,
  CTAVariant,
  HeaderVariant,
  TestimonialVariant,
  FeaturesVariant,
  HeroVariant,
  StatsVariant,
  ProcessVariant,
  VideoVariant,
  GalleryVariant,
} from "./page-schema";
import { createSection, generateId } from "./page-schema";

export type SectionPreview = {
  type: SectionType;
  variant?: string;
  label: string;
  description: string;
  section: PageSection;
};

// ==================== HERO PREVIEWS ====================

function heroDefault(): SectionPreview {
  const section = createSection("hero", { heroVariant: "default" });
  section.content = {
    ...section.content,
    heading: "Launch Your Next Big Thing",
    subheading: "Build beautiful landing pages in minutes, not weeks. No code required.",
    buttonText: "Get Started Free",
    buttonLink: "#",
    badge: "Now in Beta",
    showBadge: true,
    brands: ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Raycast"],
  };
  return {
    type: "hero",
    variant: "default",
    label: "Hero - Default",
    description: "Classic centered hero with headline, subheading and CTA button",
    section,
  };
}

function heroAnimatedPreview(): SectionPreview {
  const section = createSection("hero", { heroVariant: "animated-preview" });
  section.content = {
    ...section.content,
    heading: "See It In Action",
    subheading: "Watch how our platform transforms your workflow in real time",
    announcementText: "v2.0 just launched",
    announcementLink: "#",
    primaryButtonText: "Start Building",
    primaryButtonLink: "#",
    secondaryButtonText: "View Demo",
    secondaryButtonLink: "#",
    appPreviewImageLight: "",
    appPreviewImageDark: "",
  };
  return {
    type: "hero",
    variant: "animated-preview",
    label: "Hero - Animated Preview",
    description: "Hero with app screenshot preview and announcement badge",
    section,
  };
}

function heroEmailSignup(): SectionPreview {
  const section = createSection("hero", { heroVariant: "email-signup" });
  section.content = {
    ...section.content,
    heading: "Join 10,000+ Creators",
    subheading: "Get early access to the tools that will change how you build on the web",
    formPlaceholder: "Enter your email",
    formButtonText: "Get Early Access",
    mockupTitle: "Steps",
    mockupCurrentValue: "12,458",
    mockupCurrentLabel: "This Month",
    mockupPreviousValue: "8,200",
    mockupPreviousLabel: "Last Month",
    mockupDescription: "+52% growth from previous month",
    mockupCurrentYear: "2026",
    mockupPreviousYear: "2025",
  };
  return {
    type: "hero",
    variant: "email-signup",
    label: "Hero - Email Signup",
    description: "Hero focused on email capture with stats mockup widget",
    section,
  };
}

function heroSalesFunnel(): SectionPreview {
  const section = createSection("hero", { heroVariant: "sales-funnel" });
  section.content = {
    ...section.content,
    topTitle: "For Entrepreneurs That Want To Scale",
    heading: "Transform Your Business With Our Proven System",
    subheading: "Discover the exact framework used by 500+ successful founders to 10x their revenue",
    ctaText: "YES! I WANT ACCESS NOW!",
    ctaUrl: "#",
    ctaSecondaryText: "Only $47 - one time payment",
    badge: "365 DAYS MONEY BACK GUARANTEE",
    badgeIcon: "checkmark",
    showBadge: true,
  };
  return {
    type: "hero",
    variant: "sales-funnel",
    label: "Hero - Sales Funnel",
    description: "High-converting sales funnel hero with urgency and guarantee badge",
    section,
  };
}

function heroGlassmorphismTrust(): SectionPreview {
  const section = createSection("hero", { heroVariant: "glassmorphism-trust" });
  section.content = {
    ...section.content,
    badge: "Trusted by 50,000+",
    heading: "Crafting Digital",
    accentHeading: "Experiences",
    subheading: "That Matter",
    bodyText: "We design interfaces that combine beauty with functionality, creating seamless experiences that users love.",
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
    backgroundColor: "#09090b",
    accentColor: "#ffcd75",
  };
  return {
    type: "hero",
    variant: "glassmorphism-trust",
    label: "Hero - Glassmorphism Trust",
    description: "Premium glassmorphism hero with trust stats and client logos",
    section,
  };
}

function heroEmailGlass(): SectionPreview {
  const section = createSection("hero", { heroVariant: "hero-email-glass" });
  section.content = {
    ...section.content,
    heading: "Join the Future of Creation",
    subheading: "Get early access to our platform and start building today.",
    badge: "Early Access",
    showBadge: true,
    formPlaceholder: "Enter your email address",
    formButtonText: "Get Access",
    brands: ["10,000+ Creators", "Trusted Worldwide"],
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    accentColor: "#D6FC51",
  };
  return {
    type: "hero",
    variant: "hero-email-glass",
    label: "Hero - Email Glass",
    description: "Premium glassmorphism hero with email capture form",
    section,
  };
}

function heroFormMulti(): SectionPreview {
  const section = createSection("hero", { heroVariant: "hero-form-multi" });
  section.content = {
    ...section.content,
    heading: "Start Your Free Trial",
    subheading: "No credit card required. Get started in under 2 minutes.",
    formPlaceholder: "your@email.com",
    formButtonText: "Start Free Trial",
    showBadge: true,
    badge: "Free Trial",
    backgroundColor: "#0a0a0a",
    textColor: "#ffffff",
    accentColor: "#D6FC51",
  };
  return {
    type: "hero",
    variant: "hero-form-multi",
    label: "Hero - Multi-Field Form",
    description: "Lead generation hero with multi-field form",
    section,
  };
}

// ==================== HEADER PREVIEWS ====================

function headerDefault(): SectionPreview {
  const section = createSection("header", { headerVariant: "default" });
  section.content = {
    ...section.content,
    logoText: "Acme",
    links: [
      { label: "Products", url: "#products" },
      { label: "Pricing", url: "#pricing" },
      { label: "About", url: "#about" },
      { label: "Blog", url: "#blog" },
    ],
    buttonText: "Sign Up",
    buttonLink: "#",
  };
  return {
    type: "header",
    variant: "default",
    label: "Header - Default",
    description: "Standard navigation header with logo, links and CTA",
    section,
  };
}

function headerVariant2(): SectionPreview {
  const section = createSection("header", { headerVariant: "header-2" });
  section.content = {
    ...section.content,
    logoText: "Acme",
    headerVariant: "header-2",
    links: [
      { label: "Products", url: "#products" },
      { label: "Pricing", url: "#pricing" },
      { label: "About", url: "#about" },
      { label: "Blog", url: "#blog" },
    ],
    buttonText: "Sign Up",
    buttonLink: "#",
  };
  return {
    type: "header",
    variant: "header-2",
    label: "Header - Style 2",
    description: "Alternative header layout with centered navigation",
    section,
  };
}

function headerFloating(): SectionPreview {
  const section = createSection("header", { headerVariant: "floating-header" });
  section.content = {
    ...section.content,
    logoText: "Acme",
    headerVariant: "floating-header",
    links: [
      { label: "Products", url: "#products" },
      { label: "Pricing", url: "#pricing" },
      { label: "About", url: "#about" },
      { label: "Blog", url: "#blog" },
    ],
    buttonText: "Sign Up",
    buttonLink: "#",
  };
  return {
    type: "header",
    variant: "floating-header",
    label: "Header - Floating",
    description: "Floating header with rounded corners and shadow",
    section,
  };
}

function headerSimple(): SectionPreview {
  const section = createSection("header", { headerVariant: "simple-header" });
  section.content = {
    ...section.content,
    logoText: "Acme",
    headerVariant: "simple-header",
    links: [
      { label: "Products", url: "#products" },
      { label: "Pricing", url: "#pricing" },
      { label: "About", url: "#about" },
      { label: "Blog", url: "#blog" },
    ],
    buttonText: "Sign Up",
    buttonLink: "#",
  };
  return {
    type: "header",
    variant: "simple-header",
    label: "Header - Simple",
    description: "Minimal header with clean layout",
    section,
  };
}

function headerWithSearch(): SectionPreview {
  const section = createSection("header", { headerVariant: "header-with-search" });
  section.content = {
    ...section.content,
    logoText: "Acme",
    headerVariant: "header-with-search",
    searchPlaceholder: "Search docs...",
    links: [
      { label: "Products", url: "#products" },
      { label: "Pricing", url: "#pricing" },
      { label: "About", url: "#about" },
      { label: "Blog", url: "#blog" },
    ],
    buttonText: "Sign Up",
    buttonLink: "#",
  };
  return {
    type: "header",
    variant: "header-with-search",
    label: "Header - With Search",
    description: "Header with integrated search bar",
    section,
  };
}

// ==================== CTA PREVIEWS ====================

function ctaCentered(): SectionPreview {
  const section = createSection("cta", { ctaVariant: "centered" });
  section.content = {
    ...section.content,
    heading: "Ready to Get Started?",
    subheading: "Join thousands of happy customers building amazing things",
    buttonText: "Start Free Trial",
    buttonLink: "#",
    badge: "No Credit Card Required",
    bodyText: "Free 14-day trial. Cancel anytime.",
  };
  return {
    type: "cta",
    variant: "centered",
    label: "CTA - Centered",
    description: "Centered call-to-action with headline and button",
    section,
  };
}

function ctaSplit(): SectionPreview {
  const section = createSection("cta", { ctaVariant: "split" });
  section.content = {
    ...section.content,
    ctaVariant: "split",
    heading: "Take Your Business to the Next Level",
    subheading: "Everything you need to launch, grow, and scale your product",
    buttonText: "Get Started Now",
    buttonLink: "#",
    badge: "Limited Offer",
    bodyText: "Trusted by 10,000+ teams worldwide",
  };
  return {
    type: "cta",
    variant: "split",
    label: "CTA - Split",
    description: "Two-column CTA with text on left and action on right",
    section,
  };
}

function ctaBanner(): SectionPreview {
  const section = createSection("cta", { ctaVariant: "banner" });
  section.content = {
    ...section.content,
    ctaVariant: "banner",
    heading: "Limited Time: 50% Off All Plans",
    subheading: "Use code LAUNCH50 at checkout. Offer ends Friday.",
    buttonText: "Claim Discount",
    buttonLink: "#",
  };
  return {
    type: "cta",
    variant: "banner",
    label: "CTA - Banner",
    description: "Compact banner CTA for promotions and announcements",
    section,
  };
}

function ctaMinimal(): SectionPreview {
  const section = createSection("cta", { ctaVariant: "minimal" });
  section.content = {
    ...section.content,
    ctaVariant: "minimal",
    heading: "Start Building Today",
    subheading: "No setup required. Get started in seconds.",
    buttonText: "Try It Free",
    buttonLink: "#",
  };
  return {
    type: "cta",
    variant: "minimal",
    label: "CTA - Minimal",
    description: "Clean minimal CTA with underline button style",
    section,
  };
}

// ==================== FEATURES PREVIEWS ====================

function featuresDefault(): SectionPreview {
  const section = createSection("features", { featuresVariant: "default" });
  section.content = {
    ...section.content,
    heading: "Everything You Need",
    subheading: "Powerful features designed to help you build faster and smarter",
  };
  section.items = [
    {
      id: generateId(),
      title: "Lightning Fast",
      description: "Experience blazing fast performance with our optimized infrastructure",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
      gridClass: "md:col-span-1",
    },
    {
      id: generateId(),
      title: "Secure by Default",
      description: "Enterprise-grade security built into every layer of the platform",
      imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop",
      gridClass: "md:col-span-2",
    },
    {
      id: generateId(),
      title: "Easy Integration",
      description: "Connect with your existing tools and workflows in minutes",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
      gridClass: "md:col-span-1",
    },
  ];
  return {
    type: "features",
    variant: "default",
    label: "Features - Grid",
    description: "Image-based feature cards in a responsive grid layout",
    section,
  };
}

function featuresIllustrated(): SectionPreview {
  const section = createSection("features", { featuresVariant: "illustrated" });
  return {
    type: "features",
    variant: "illustrated",
    label: "Features - Illustrated",
    description: "Features with side illustrations and detailed descriptions",
    section,
  };
}

function featuresHover(): SectionPreview {
  const section = createSection("features", { featuresVariant: "hover" });
  return {
    type: "features",
    variant: "hover",
    label: "Features - Hover Cards",
    description: "Interactive feature cards with hover reveal effects",
    section,
  };
}

function featuresBento(): SectionPreview {
  const section = createSection("features", { featuresVariant: "bento" });
  return {
    type: "features",
    variant: "bento",
    label: "Features - Bento Grid",
    description: "Mixed-size bento grid layout with feature cards",
    section,
  };
}

function featuresTable(): SectionPreview {
  const section = createSection("features", { featuresVariant: "table" });
  return {
    type: "features",
    variant: "table",
    label: "Features - Customer Table",
    description: "Data table format showing customer information",
    section,
  };
}

// ==================== TESTIMONIALS PREVIEWS ====================

function testimonialsScrolling(): SectionPreview {
  const section = createSection("testimonials", { testimonialVariant: "scrolling" });
  section.content = {
    ...section.content,
    heading: "What Our Customers Say",
    subheading: "Real stories from real people who love our product",
  };
  section.items = [
    {
      id: generateId(),
      title: "Game Changer",
      description: "This platform completely transformed our workflow. We shipped 3x faster within the first month.",
      author: "Sarah Chen",
      role: "CTO at TechFlow",
      rating: 5,
    },
    {
      id: generateId(),
      title: "Best Investment",
      description: "The ROI we've seen has been incredible. Our team productivity went through the roof.",
      author: "Marcus Johnson",
      role: "Founder at LaunchPad",
      rating: 5,
    },
    {
      id: generateId(),
      title: "Absolutely Love It",
      description: "Simple, powerful, and beautiful. Everything we wanted in a tool and more.",
      author: "Emily Park",
      role: "Product Lead at Acme",
      rating: 5,
    },
    {
      id: generateId(),
      title: "Highly Recommend",
      description: "We evaluated 10+ tools before choosing this one. No regrets at all.",
      author: "David Kim",
      role: "Engineering Manager",
      rating: 5,
    },
  ];
  return {
    type: "testimonials",
    variant: "scrolling",
    label: "Testimonials - Scrolling",
    description: "Horizontally scrolling testimonial cards",
    section,
  };
}

function testimonialsTwitterCards(): SectionPreview {
  const section = createSection("testimonials", { testimonialVariant: "twitter-cards" });
  section.content = {
    ...section.content,
    heading: "Loved on Social Media",
    subheading: "See what people are saying about us",
    testimonialVariant: "twitter-cards",
  };
  section.items = [
    {
      id: generateId(),
      title: "@sarahdev",
      description: "Just migrated our entire stack to this platform. Mind blown by how smooth it was.",
      author: "Sarah Chen",
      role: "@sarahdev",
      rating: 5,
    },
    {
      id: generateId(),
      title: "@marcusj",
      description: "Been using this for 6 months now. Genuinely the best developer tool I've ever used.",
      author: "Marcus Johnson",
      role: "@marcusj",
      rating: 5,
    },
    {
      id: generateId(),
      title: "@emilypark",
      description: "Our team shipped a complete redesign in 2 weeks instead of 2 months. This is the future.",
      author: "Emily Park",
      role: "@emilypark",
      rating: 5,
    },
  ];
  return {
    type: "testimonials",
    variant: "twitter-cards",
    label: "Testimonials - Social Cards",
    description: "Twitter/X-style social proof testimonial cards",
    section,
  };
}

function testimonialsScreenshots(): SectionPreview {
  const section = createSection("testimonials", { testimonialVariant: "screenshots" });
  section.content = {
    ...section.content,
    heading: "Real Results, Real People",
    subheading: "See proof from our community",
    testimonialVariant: "screenshots",
  };
  section.items = [
    {
      id: generateId(),
      title: "Revenue Up 300%",
      description: "Switched from our old system 3 months ago. The results speak for themselves.",
      author: "Alex Rivera",
      role: "Agency Owner",
      rating: 5,
    },
    {
      id: generateId(),
      title: "Shipped 10x Faster",
      description: "What used to take weeks now takes hours. Our clients are thrilled.",
      author: "Jordan Lee",
      role: "Freelance Developer",
      rating: 5,
    },
    {
      id: generateId(),
      title: "Best Tool Ever",
      description: "I've tried everything. Nothing comes close to this level of quality and polish.",
      author: "Taylor Kim",
      role: "Startup Founder",
      rating: 5,
    },
  ];
  return {
    type: "testimonials",
    variant: "screenshots",
    label: "Testimonials - Screenshots",
    description: "Testimonials with proof screenshots and images",
    section,
  };
}

// ==================== PRICING PREVIEW ====================

function pricingPreview(): SectionPreview {
  const section = createSection("pricing");
  section.content = {
    ...section.content,
    heading: "Simple, Transparent Pricing",
    subheading: "Choose the plan that fits your needs. Upgrade or cancel anytime.",
    badge: "Pricing",
  };
  section.items = [
    {
      id: generateId(),
      title: "Starter",
      price: "$9/mo",
      description: "Perfect for individuals and side projects",
      features: ["3 Projects", "5GB Storage", "Basic Analytics", "Community Support"],
      buttonText: "Get Started",
      buttonLink: "#",
    },
    {
      id: generateId(),
      title: "Pro",
      price: "$29/mo",
      description: "For growing teams and businesses",
      features: ["Unlimited Projects", "50GB Storage", "Advanced Analytics", "Priority Support", "Custom Domain"],
      popular: true,
      buttonText: "Start Free Trial",
      buttonLink: "#",
    },
    {
      id: generateId(),
      title: "Enterprise",
      price: "$99/mo",
      description: "For large teams with advanced needs",
      features: ["Everything in Pro", "Unlimited Storage", "SSO & SAML", "Dedicated Manager", "SLA Guarantee"],
      buttonText: "Contact Sales",
      buttonLink: "#",
    },
  ];
  return {
    type: "pricing",
    label: "Pricing",
    description: "Three-tier pricing table with feature comparison",
    section,
  };
}

// ==================== FAQ PREVIEW ====================

function faqPreview(): SectionPreview {
  const section = createSection("faq");
  section.content = {
    ...section.content,
    heading: "Frequently Asked Questions",
    subheading: "Everything you need to know about our platform",
  };
  section.items = [
    {
      id: generateId(),
      title: "How does the free trial work?",
      description: "You get full access to all Pro features for 14 days. No credit card required. At the end of the trial, you can choose a plan or continue on the free tier.",
    },
    {
      id: generateId(),
      title: "Can I change my plan later?",
      description: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing adjustments.",
    },
    {
      id: generateId(),
      title: "What payment methods do you accept?",
      description: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are securely processed through Stripe.",
    },
    {
      id: generateId(),
      title: "Is there a money-back guarantee?",
      description: "Yes! We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, just reach out and we'll process your refund.",
    },
    {
      id: generateId(),
      title: "Do you offer discounts for teams?",
      description: "Yes, we offer volume discounts for teams of 10 or more. Contact our sales team for a custom quote tailored to your organization.",
    },
    {
      id: generateId(),
      title: "How do I cancel my subscription?",
      description: "You can cancel your subscription anytime from your account settings. Your access continues until the end of the current billing period.",
    },
  ];
  return {
    type: "faq",
    label: "FAQ",
    description: "Accordion-style frequently asked questions",
    section,
  };
}

// ==================== VIDEO PREVIEWS ====================

function videoCentered(): SectionPreview {
  const section = createSection("video");
  section.content = {
    ...section.content,
    heading: "See It In Action",
    subheading: "Watch a 2-minute walkthrough of our platform",
    videoUrl: "",
    videoVariant: "centered",
    videoDuration: "2:30",
  };
  return {
    type: "video",
    variant: "centered",
    label: "Video - Centered",
    description: "Single centered video player with title",
    section,
  };
}

function videoGrid(): SectionPreview {
  const section = createSection("video");
  section.content = {
    ...section.content,
    heading: "Video Library",
    subheading: "Learn from our collection of tutorials and demos",
    videoVariant: "grid",
  };
  section.items = [
    { id: generateId(), title: "Getting Started", description: "A quick intro to the platform", videoUrl: "" },
    { id: generateId(), title: "Advanced Features", description: "Deep dive into power user tools", videoUrl: "" },
    { id: generateId(), title: "Integration Guide", description: "Connect with your favorite apps", videoUrl: "" },
    { id: generateId(), title: "Tips & Tricks", description: "Pro tips to boost productivity", videoUrl: "" },
  ];
  return {
    type: "video",
    variant: "grid",
    label: "Video - Grid",
    description: "Multiple video grid layout",
    section,
  };
}

function videoSideBySide(): SectionPreview {
  const section = createSection("video");
  section.content = {
    ...section.content,
    heading: "How It Works",
    subheading: "Step-by-step walkthrough of the core workflow",
    videoUrl: "",
    videoVariant: "side-by-side",
  };
  return {
    type: "video",
    variant: "side-by-side",
    label: "Video - Side by Side",
    description: "Video with text content on the side",
    section,
  };
}

function videoFullscreen(): SectionPreview {
  const section = createSection("video");
  section.content = {
    ...section.content,
    heading: "Watch the Full Story",
    videoUrl: "",
    videoVariant: "fullscreen",
  };
  return {
    type: "video",
    variant: "fullscreen",
    label: "Video - Fullscreen",
    description: "Immersive fullscreen video section",
    section,
  };
}

// ==================== STATS PREVIEWS ====================

function statsCards(): SectionPreview {
  const section = createSection("stats");
  section.content = {
    ...section.content,
    badge: "By the Numbers",
    heading: "Trusted by Thousands",
    subheading: "Our impact speaks for itself",
    statsVariant: "cards",
  };
  section.items = [
    { id: generateId(), title: "10,000+", description: "Active Users" },
    { id: generateId(), title: "99.9%", description: "Uptime" },
    { id: generateId(), title: "50+", description: "Countries" },
    { id: generateId(), title: "4.9/5", description: "Average Rating" },
  ];
  return {
    type: "stats",
    variant: "cards",
    label: "Stats - Cards",
    description: "Statistics displayed in card format",
    section,
  };
}

function statsMinimal(): SectionPreview {
  const section = createSection("stats");
  section.content = {
    ...section.content,
    heading: "Numbers That Matter",
    statsVariant: "minimal",
  };
  section.items = [
    { id: generateId(), title: "10K+", description: "Users" },
    { id: generateId(), title: "99.9%", description: "Uptime" },
    { id: generateId(), title: "50+", description: "Countries" },
    { id: generateId(), title: "4.9/5", description: "Rating" },
  ];
  return {
    type: "stats",
    variant: "minimal",
    label: "Stats - Minimal",
    description: "Clean minimal statistics display",
    section,
  };
}

function statsBars(): SectionPreview {
  const section = createSection("stats");
  section.content = {
    ...section.content,
    heading: "Growth Metrics",
    subheading: "Watch our progress in real time",
    statsVariant: "bars",
  };
  section.items = [
    { id: generateId(), title: "10,000+", description: "Active Users" },
    { id: generateId(), title: "99.9%", description: "Uptime" },
    { id: generateId(), title: "50+", description: "Countries" },
    { id: generateId(), title: "4.9/5", description: "Rating" },
  ];
  return {
    type: "stats",
    variant: "bars",
    label: "Stats - Bars",
    description: "Statistics with animated bar graphs",
    section,
  };
}

function statsCircles(): SectionPreview {
  const section = createSection("stats");
  section.content = {
    ...section.content,
    heading: "Our Achievements",
    statsVariant: "circles",
  };
  section.items = [
    { id: generateId(), title: "10K+", description: "Users" },
    { id: generateId(), title: "99.9%", description: "Uptime" },
    { id: generateId(), title: "50+", description: "Countries" },
    { id: generateId(), title: "4.9/5", description: "Rating" },
  ];
  return {
    type: "stats",
    variant: "circles",
    label: "Stats - Circles",
    description: "Circular progress indicator statistics",
    section,
  };
}

// ==================== PROCESS PREVIEWS ====================

function processTimeline(): SectionPreview {
  const section = createSection("process");
  section.content = {
    ...section.content,
    processVariant: "timeline",
    badge: "How It Works",
    heading: "Get Started in 4 Simple Steps",
    subheading: "From signup to launch in minutes",
    buttonText: "Get Started Now",
    buttonLink: "#",
  };
  section.items = [
    { id: generateId(), title: "Sign Up", description: "Create your free account in seconds. No credit card needed.", icon: "1" },
    { id: generateId(), title: "Choose Template", description: "Pick from 50+ professionally designed templates.", icon: "2" },
    { id: generateId(), title: "Customize", description: "Make it yours with our drag-and-drop editor.", icon: "3" },
    { id: generateId(), title: "Launch", description: "Publish to your custom domain with one click.", icon: "4" },
  ];
  return {
    type: "process",
    variant: "timeline",
    label: "Process - Timeline",
    description: "Vertical timeline showing step-by-step process",
    section,
  };
}

function processCards(): SectionPreview {
  const section = createSection("process");
  section.content = {
    ...section.content,
    processVariant: "cards",
    badge: "How It Works",
    heading: "Simple 3-Step Process",
    subheading: "Get started in minutes, not hours",
    buttonText: "Start Now",
    buttonLink: "#",
  };
  section.items = [
    { id: generateId(), title: "Sign Up", description: "Create your account in seconds. No credit card required.", icon: "1" },
    { id: generateId(), title: "Customize", description: "Personalize your experience to match your brand.", icon: "2" },
    { id: generateId(), title: "Launch", description: "Go live and start seeing results immediately.", icon: "3" },
  ];
  return {
    type: "process",
    variant: "cards",
    label: "Process - Cards",
    description: "Step-by-step process displayed in card format",
    section,
  };
}

function processHorizontal(): SectionPreview {
  const section = createSection("process");
  section.content = {
    ...section.content,
    processVariant: "horizontal",
    badge: "How It Works",
    heading: "Your Journey Starts Here",
    subheading: "Three simple steps to success",
    buttonText: "Begin Now",
    buttonLink: "#",
  };
  section.items = [
    { id: generateId(), title: "Sign Up", description: "Quick and easy registration process.", icon: "1" },
    { id: generateId(), title: "Build", description: "Create with our intuitive tools.", icon: "2" },
    { id: generateId(), title: "Launch", description: "Ship and share with the world.", icon: "3" },
  ];
  return {
    type: "process",
    variant: "horizontal",
    label: "Process - Horizontal",
    description: "Horizontal flow showing connected process steps",
    section,
  };
}

// ==================== GALLERY PREVIEWS ====================

function galleryBento(): SectionPreview {
  const section = createSection("gallery");
  section.content = {
    ...section.content,
    heading: "Our Work",
    subheading: "A showcase of our latest projects",
    galleryVariant: "bento",
  };
  section.items = [
    { id: generateId(), title: "Brand Identity", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Web Design", imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Mobile App", imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Dashboard UI", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "E-commerce", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Marketing Site", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop" },
  ];
  return {
    type: "gallery",
    variant: "bento",
    label: "Gallery - Bento",
    description: "Bento-style image gallery with mixed sizes",
    section,
  };
}

function galleryFocusrail(): SectionPreview {
  const section = createSection("gallery");
  section.content = {
    ...section.content,
    heading: "Portfolio",
    subheading: "Browse our featured work",
    galleryVariant: "focusrail",
  };
  section.items = [
    { id: generateId(), title: "Project Alpha", imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Project Beta", imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Project Gamma", imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Project Delta", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Project Epsilon", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop" },
    { id: generateId(), title: "Project Zeta", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop" },
  ];
  return {
    type: "gallery",
    variant: "focusrail",
    label: "Gallery - Focus Rail",
    description: "Horizontal scrolling gallery with focus effect",
    section,
  };
}

// ==================== FOOTER PREVIEW ====================

function footerPreview(): SectionPreview {
  const section = createSection("footer");
  section.content = {
    ...section.content,
    logoText: "Acme",
    tagline: "Build. Ship. Scale.",
    links: [
      { label: "Twitter", url: "#" },
      { label: "GitHub", url: "#" },
      { label: "Discord", url: "#" },
      { label: "Privacy", url: "#" },
      { label: "Terms", url: "#" },
    ],
    bodyText: "2026 Acme Inc. All rights reserved.",
  };
  return {
    type: "footer",
    label: "Footer",
    description: "Page footer with logo, links and copyright",
    section,
  };
}

// ==================== FOUNDERS PREVIEW ====================

function foundersPreview(): SectionPreview {
  const section = createSection("founders");
  return {
    type: "founders",
    label: "Founders",
    description: "Team member profiles with photos and bios",
    section,
  };
}

// ==================== LOGO CLOUD PREVIEW ====================

function logoCloudPreview(): SectionPreview {
  const section = createSection("logoCloud");
  section.content = {
    ...section.content,
    heading: "Trusted by Industry Leaders",
    subheading: "Join 10,000+ companies already using our platform",
    brands: ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Raycast"],
  };
  return {
    type: "logoCloud",
    label: "Logo Cloud",
    description: "Scrolling logo marquee of partner brands",
    section,
  };
}

// ==================== CREDIBILITY PREVIEW ====================

function credibilityPreview(): SectionPreview {
  const section = createSection("credibility");
  return {
    type: "credibility",
    label: "Credibility",
    description: "Trust-building section with background image and overlay",
    section,
  };
}

// ==================== COMPARISON PREVIEW ====================

function comparisonPreview(): SectionPreview {
  const section = createSection("comparison");
  section.items = [
    {
      id: generateId(),
      title: "Us",
      features: [
        "Unlimited projects",
        "Priority 24/7 support",
        "Custom integrations",
        "Advanced analytics dashboard",
        "Team collaboration tools",
        "99.9% uptime SLA",
      ],
    },
    {
      id: generateId(),
      title: "Others",
      features: [
        "Limited to 3 projects",
        "Email-only support",
        "No custom integrations",
      ],
    },
  ];
  return {
    type: "comparison",
    label: "Comparison",
    description: "Side-by-side feature comparison table",
    section,
  };
}

// ==================== OFFER PREVIEW ====================

function offerPreview(): SectionPreview {
  const section = createSection("offer");
  return {
    type: "offer",
    label: "Offer",
    description: "Product offer section with pricing and feature list",
    section,
  };
}

// ==================== OFFER DETAILS PREVIEW ====================

function offerDetailsPreview(): SectionPreview {
  const section = createSection("offer-details");
  return {
    type: "offer-details",
    label: "Offer Details",
    description: "Detailed breakdown of what's included in your offer",
    section,
  };
}

// ==================== AUDIENCE PREVIEW ====================

function audiencePreview(): SectionPreview {
  const section = createSection("audience");
  return {
    type: "audience",
    label: "Audience",
    description: "Target audience section with for/not-for lists",
    section,
  };
}

// ==================== VALUE PROPOSITION PREVIEW ====================

function valuePropositionPreview(): SectionPreview {
  const section = createSection("value-proposition");
  section.content = {
    ...section.content,
    heading: "Why This Works",
    badge: "THE SECRET",
    bodyParagraphs: [
      "Most people struggle because they're following outdated advice. They spend months trying things that worked 5 years ago, burning through time and money.",
      "We've distilled 10 years of experience into a proven framework that gets results in weeks, not months. Every step is battle-tested with real data.",
      "The difference? We focus on what actually moves the needle. No fluff, no theory, just actionable steps that drive real results.",
    ],
  };
  return {
    type: "value-proposition",
    label: "Value Proposition",
    description: "Story-driven section explaining the problem and solution",
    section,
  };
}

// ==================== CREATOR PREVIEW ====================

function creatorPreview(): SectionPreview {
  const section = createSection("creator");
  return {
    type: "creator",
    label: "Creator",
    description: "Creator/instructor profile with bio and credentials",
    section,
  };
}

// ==================== DETAILED FEATURES PREVIEW ====================

function detailedFeaturesPreview(): SectionPreview {
  const section = createSection("detailed-features");
  return {
    type: "detailed-features",
    label: "Detailed Features",
    description: "In-depth feature list with icons and descriptions",
    section,
  };
}

// ==================== BLANK PREVIEW ====================

function blankPreview(): SectionPreview {
  const section = createSection("blank");
  return {
    type: "blank",
    label: "Blank Canvas",
    description: "Empty section for custom element placement",
    section,
  };
}

// ==================== LOADER PREVIEW ====================

function loaderPreview(): SectionPreview {
  const section = createSection("loader");
  return {
    type: "loader",
    label: "Loader / Splash",
    description: "Page intro loader with logo and enter button",
    section,
  };
}

// ==================== GLASS COMPONENT PREVIEWS ====================

function glassCTAPreview(): SectionPreview {
  const section = createSection("glass-cta");
  section.content = {
    ...section.content,
    heading: "Ready to Start Building?",
    subheading: "Join thousands of creators on our platform",
    buttonText: "Start Free Trial",
    buttonLink: "#",
  };
  return {
    type: "glass-cta",
    label: "Glass CTA",
    description: "Premium glassmorphism call-to-action section",
    section,
  };
}

function glassFeaturesPreview(): SectionPreview {
  const section = createSection("glass-features");
  return {
    type: "glass-features",
    label: "Glass Features",
    description: "Premium glassmorphism feature cards with 3D effects",
    section,
  };
}

function glassFoundersPreview(): SectionPreview {
  const section = createSection("glass-founders");
  return {
    type: "glass-founders",
    label: "Glass Founders",
    description: "Premium glassmorphism team member profiles",
    section,
  };
}

function glassTestimonialsPreview(): SectionPreview {
  const section = createSection("glass-testimonials");
  return {
    type: "glass-testimonials",
    label: "Glass Testimonials",
    description: "Premium glassmorphism testimonial cards with ratings",
    section,
  };
}

function glassPricingPreview(): SectionPreview {
  const section = createSection("glass-pricing");
  return {
    type: "glass-pricing",
    label: "Glass Pricing",
    description: "Premium glassmorphism pricing table with 3D cards",
    section,
  };
}

// ==================== WHOP UNIVERSITY PREVIEWS ====================

function whopHeroPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-hero",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "New Course Available",
      heading: "Master the Art of Building",
      accentHeading: "Profitable Digital Products",
      subheading: "Learn the exact strategies that generated $2M+ in revenue",
      buttonText: "Enroll Now",
      buttonLink: "#",
      secondaryButtonText: "Watch Preview",
      secondaryButtonLink: "#",
    },
    items: [],
  };
  return {
    type: "whop-hero",
    label: "Whop - Hero",
    description: "Premium gradient mesh hero for course pages",
    section,
  };
}

function whopValuePropPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-value-prop",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "Why This Course",
      heading: "Everything You Need to Succeed",
      subheading: "Three pillars of our proven methodology",
    },
    items: [
      { id: generateId(), title: "Proven Framework", description: "Battle-tested strategies used by 500+ successful creators", icon: "target" },
      { id: generateId(), title: "Live Mentorship", description: "Weekly live calls with industry experts and Q&A sessions", icon: "sparkles" },
      { id: generateId(), title: "Community Access", description: "Join a private network of ambitious creators and founders", icon: "heart" },
    ],
  };
  return {
    type: "whop-value-prop",
    label: "Whop - Value Proposition",
    description: "Premium value proposition with animated story cards",
    section,
  };
}

function whopOfferPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-offer",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "The Offer",
      heading: "Everything You Get",
      subheading: "One investment, lifetime access to everything",
    },
    items: [
      { id: generateId(), title: "Core Course", description: "40+ hours of video content", price: "$997" },
      { id: generateId(), title: "Templates Pack", description: "50+ ready-to-use templates", price: "$297" },
      { id: generateId(), title: "Private Community", description: "Lifetime access", price: "$497" },
      { id: generateId(), title: "Live Coaching", description: "12 weekly group calls", price: "$1,200" },
    ],
  };
  return {
    type: "whop-offer",
    label: "Whop - Offer",
    description: "Premium 3D bento grid offer breakdown",
    section,
  };
}

function whopCTAPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-cta",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      heading: "Don't Miss Out",
      subheading: "Limited spots available for this cohort",
      buttonText: "Enroll Now - $497",
      buttonLink: "#",
    },
    items: [],
  };
  return {
    type: "whop-cta",
    label: "Whop - CTA",
    description: "Premium floating CTA band with urgency",
    section,
  };
}

function whopComparisonPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-comparison",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "Comparison",
      heading: "Why Students Choose Us",
      subheading: "See how we compare to alternatives",
    },
    items: [
      {
        id: generateId(),
        title: "Our Course",
        features: ["Proven $2M+ framework", "Live weekly coaching", "Private community", "Lifetime updates", "Done-for-you templates"],
      },
      {
        id: generateId(),
        title: "Other Courses",
        features: ["Generic advice", "No support", "Outdated content"],
      },
    ],
  };
  return {
    type: "whop-comparison",
    label: "Whop - Comparison",
    description: "Premium glowing comparison table",
    section,
  };
}

function whopCreatorPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-creator",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      heading: "Your Instructor",
      creatorName: "Alex Rivera",
      creatorRole: "Serial Entrepreneur & Educator",
      creatorBio: "Built 3 successful businesses generating over $5M in revenue. Now teaching others the exact playbook.\n\nFeatured in Forbes, TechCrunch, and The Hustle. Helped 1,000+ students launch profitable businesses.",
      creatorCredentials: [
        "$5M+ in revenue generated",
        "1,000+ students mentored",
        "Forbes 30 Under 30",
        "3x successful exits",
      ],
    },
    items: [],
  };
  return {
    type: "whop-creator",
    label: "Whop - Creator",
    description: "Premium creator spotlight with credentials",
    section,
  };
}

function whopCurriculumPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-curriculum",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "Curriculum",
      heading: "What's Inside",
      subheading: "A comprehensive roadmap to success",
    },
    items: [
      {
        id: generateId(),
        title: "Module 1: Foundation",
        description: "Build your knowledge base",
        duration: "4 hours",
        lessons: ["Finding your niche", "Market research basics", "Setting up your workspace", "Goal setting framework"],
      },
      {
        id: generateId(),
        title: "Module 2: Building",
        description: "Create your first product",
        duration: "6 hours",
        lessons: ["Product ideation", "MVP development", "Design principles", "Testing strategies"],
      },
      {
        id: generateId(),
        title: "Module 3: Launch",
        description: "Go to market strategies",
        duration: "5 hours",
        lessons: ["Launch planning", "Marketing channels", "Pricing strategy", "Sales techniques"],
      },
      {
        id: generateId(),
        title: "Module 4: Scale",
        description: "Grow beyond limits",
        duration: "5 hours",
        lessons: ["Automation systems", "Team building", "Revenue optimization", "Long-term growth"],
      },
    ],
  };
  return {
    type: "whop-curriculum",
    label: "Whop - Curriculum",
    description: "Premium accordion curriculum with module details",
    section,
  };
}

function whopResultsPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-results",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "Student Results",
      heading: "Real Results",
      subheading: "From our community of 1,000+ students",
    },
    items: [
      { id: generateId(), title: "Sarah K.", result: "$12K/mo in 90 days", description: "Went from 0 to $12K monthly recurring revenue in just 3 months" },
      { id: generateId(), title: "James M.", result: "Quit 9-5 in 6 months", description: "Replaced his corporate salary and now works from anywhere" },
      { id: generateId(), title: "Lisa T.", result: "500+ customers", description: "Built a thriving community of paying customers from scratch" },
    ],
  };
  return {
    type: "whop-results",
    label: "Whop - Results",
    description: "Premium 3D results gallery with student outcomes",
    section,
  };
}

function whopTestimonialsPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-testimonials",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      badge: "Testimonials",
      heading: "What Students Say",
      subheading: "Hear from our community",
    },
    items: [
      {
        id: generateId(),
        title: "Life Changing",
        description: "This course completely changed my perspective. The framework is brilliant and the community is incredibly supportive.",
        author: "Maria Santos",
        role: "Course Creator",
        rating: 5,
      },
      {
        id: generateId(),
        title: "Worth Every Penny",
        description: "I've taken 20+ courses. This is the only one where I actually got results. Highly recommend.",
        author: "Tom Wilson",
        role: "Freelancer",
        rating: 5,
      },
      {
        id: generateId(),
        title: "Incredible Value",
        description: "The live coaching calls alone are worth the price. Alex genuinely cares about student success.",
        author: "Nina Patel",
        role: "Startup Founder",
        rating: 5,
      },
    ],
  };
  return {
    type: "whop-testimonials",
    label: "Whop - Testimonials",
    description: "Premium 3D testimonial cards with ratings",
    section,
  };
}

function whopFinalCTAPreview(): SectionPreview {
  const section: PageSection = {
    id: generateId(),
    type: "whop-final-cta",
    content: {
      backgroundColor: "#141212",
      textColor: "#FCF6F5",
      accentColor: "#FA4616",
      layout: "center",
      heading: "Your Transformation Starts Now",
      subheading: "Join 1,000+ students who already made the leap",
      buttonText: "Enroll Today - Limited Spots",
      buttonLink: "#",
      bodyText: "30-day money-back guarantee. No questions asked.",
    },
    items: [],
  };
  return {
    type: "whop-final-cta",
    label: "Whop - Final CTA",
    description: "Premium final conversion section with countdown urgency",
    section,
  };
}

// ==================== MASTER LIST ====================

const ALL_PREVIEWS: SectionPreview[] = [
  // Headers
  headerDefault(),
  headerVariant2(),
  headerFloating(),
  headerSimple(),
  headerWithSearch(),
  // Heroes
  heroDefault(),
  heroAnimatedPreview(),
  heroEmailSignup(),
  heroSalesFunnel(),
  heroGlassmorphismTrust(),
  heroEmailGlass(),
  heroFormMulti(),
  // Features
  featuresDefault(),
  featuresIllustrated(),
  featuresHover(),
  featuresBento(),
  featuresTable(),
  // Testimonials
  testimonialsScrolling(),
  testimonialsTwitterCards(),
  testimonialsScreenshots(),
  // CTA
  ctaCentered(),
  ctaSplit(),
  ctaBanner(),
  ctaMinimal(),
  // Pricing
  pricingPreview(),
  // FAQ
  faqPreview(),
  // Video
  videoCentered(),
  videoGrid(),
  videoSideBySide(),
  videoFullscreen(),
  // Stats
  statsCards(),
  statsMinimal(),
  statsBars(),
  statsCircles(),
  // Process
  processTimeline(),
  processCards(),
  processHorizontal(),
  // Gallery
  galleryBento(),
  galleryFocusrail(),
  // Footer
  footerPreview(),
  // Founders
  foundersPreview(),
  // Logo Cloud
  logoCloudPreview(),
  // Credibility
  credibilityPreview(),
  // Comparison
  comparisonPreview(),
  // Offer
  offerPreview(),
  // Offer Details
  offerDetailsPreview(),
  // Audience
  audiencePreview(),
  // Value Proposition
  valuePropositionPreview(),
  // Creator
  creatorPreview(),
  // Detailed Features
  detailedFeaturesPreview(),
  // Blank & Loader
  blankPreview(),
  loaderPreview(),
  // Glass Components
  glassCTAPreview(),
  glassFeaturesPreview(),
  glassFoundersPreview(),
  glassTestimonialsPreview(),
  glassPricingPreview(),
  // Whop University
  whopHeroPreview(),
  whopValuePropPreview(),
  whopOfferPreview(),
  whopCTAPreview(),
  whopComparisonPreview(),
  whopCreatorPreview(),
  whopCurriculumPreview(),
  whopResultsPreview(),
  whopTestimonialsPreview(),
  whopFinalCTAPreview(),
];

/**
 * Returns preview data for all section types and their variants.
 * Each preview includes a complete PageSection with rich sample content
 * suitable for rendering in the Component Gallery.
 */
export function getSectionPreviews(): SectionPreview[] {
  return ALL_PREVIEWS;
}

/**
 * Returns preview data for a specific section type and optional variant.
 * Falls back to the first matching type if variant not found.
 */
export function getPreviewForType(type: SectionType, variant?: string): SectionPreview | undefined {
  if (variant) {
    const exact = ALL_PREVIEWS.find((p) => p.type === type && p.variant === variant);
    if (exact) return exact;
  }
  return ALL_PREVIEWS.find((p) => p.type === type);
}

/**
 * Returns all previews for a given section type (across all variants).
 */
export function getPreviewsForType(type: SectionType): SectionPreview[] {
  return ALL_PREVIEWS.filter((p) => p.type === type);
}
