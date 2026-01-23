import { LandingPage, generateId } from "@/lib/page-schema";

/**
 * Dark Conversion Pro Template
 *
 * A high-converting sales page template with dark & bold styling
 * that showcases all advanced Launchpad components and variants.
 *
 * Features:
 * - 3 Features variants (bento, hover, table)
 * - 2 Stats variants (bars, circles)
 * - Multiple CTA variants (liquid button, split, banner)
 * - Process timeline
 * - Animated subheadings (stagger, blurIn, slideRight)
 * - Background effects (shooting-stars, glow, elegant-shapes)
 * - Scrolling testimonials
 * - Comparison table
 */
export const darkConversionTemplate: LandingPage = {
  title: "Dark Conversion Pro",
  description: "High-converting sales page template with advanced components",
  sections: [
    // Section 1: Header (Floating)
    {
      type: "header",
      id: "header-1",
      content: {
        logoText: "YourProduct",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        accentColor: "#0EA5E9",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "Testimonials", url: "#testimonials" },
        ],
        buttonText: "Get Started",
        buttonLink: "#cta",
      },
      items: [],
    },

    // Section 2: Hero (Shooting Stars Background)
    {
      type: "hero",
      id: "hero-1",
      content: {
        badge: "NEW LAUNCH",
        heading: "Transform Your Business With AI-Powered Solutions",
        accentHeading: "AI-Powered",
        subheading: "Join 10,000+ companies already using our platform to scale faster",
        subheadingAnimation: "stagger",
        subheadingSize: "xl",
        buttonText: "Start Free Trial",
        buttonLink: "#signup",
        buttonVariant: "liquid",
        imageUrl: "/hero-product-screenshot.png",
        videoUrl: "/hero-background.mp4",
        layout: "center",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        backgroundEffect: "shooting-stars",
        paddingTop: 120,
        paddingBottom: 120,
      },
    },

    // Section 3: LogoCloud
    {
      type: "logoCloud",
      id: "logocloud-1",
      content: {
        heading: "Trusted by Industry Leaders",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 48,
        paddingBottom: 48,
      },
      items: [
        { id: generateId(), title: "Google", imageUrl: "/logos/google.svg" },
        { id: generateId(), title: "Microsoft", imageUrl: "/logos/microsoft.svg" },
        { id: generateId(), title: "Amazon", imageUrl: "/logos/amazon.svg" },
        { id: generateId(), title: "Meta", imageUrl: "/logos/meta.svg" },
        { id: generateId(), title: "Stripe", imageUrl: "/logos/stripe.svg" },
        { id: generateId(), title: "Shopify", imageUrl: "/logos/shopify.svg" },
      ],
    },

    // Section 4: Stats (Bars Variant)
    {
      type: "stats",
      id: "stats-bars",
      content: {
        statsVariant: "bars",
        badge: "PROVEN RESULTS",
        heading: "Numbers That Speak for Themselves",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        backgroundEffect: "elegant-shapes",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        { id: generateId(), title: "10000+", description: "Active Users" },
        { id: generateId(), title: "98%", description: "Customer Satisfaction" },
        { id: generateId(), title: "500+", description: "Companies Served" },
        { id: generateId(), title: "24h", description: "Support Response" },
      ],
    },

    // Section 5: Features (Bento Variant)
    {
      type: "features",
      id: "features-bento",
      content: {
        featuresVariant: "bento",
        badge: "POWERFUL FEATURES",
        heading: "Everything You Need to Succeed",
        subheading: "Comprehensive tools designed for maximum conversion",
        subheadingAnimation: "blurIn",
        subheadingSize: "lg",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        showBadge: true,
        showSubheading: true,
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "AI-Powered Analytics",
          description: "Real-time insights powered by machine learning",
          icon: "ChartBar",
          imageUrl: "/features/analytics.png",
        },
        {
          id: generateId(),
          title: "Automated Workflows",
          description: "Save hours with intelligent automation",
          icon: "Zap",
          imageUrl: "/features/automation.png",
        },
        {
          id: generateId(),
          title: "Team Collaboration",
          description: "Work together seamlessly in real-time",
          icon: "Users",
          imageUrl: "/features/collaboration.png",
        },
        {
          id: generateId(),
          title: "Advanced Security",
          description: "Enterprise-grade protection for your data",
          icon: "Shield",
          imageUrl: "/features/security.png",
        },
        {
          id: generateId(),
          title: "Custom Integrations",
          description: "Connect with your favorite tools",
          icon: "Puzzle",
          imageUrl: "/features/integrations.png",
        },
        {
          id: generateId(),
          title: "24/7 Support",
          description: "Expert help whenever you need it",
          icon: "HeartHandshake",
          imageUrl: "/features/support.png",
        },
      ],
    },

    // Section 6: Video (Centered with Glow)
    {
      type: "video",
      id: "video-demo",
      content: {
        videoVariant: "centered",
        badge: "SEE IT IN ACTION",
        heading: "Watch How It Works",
        subheading: "2-minute demo showing the platform in action",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/video-thumbnail.png",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        backgroundEffect: "glow",
        paddingTop: 96,
        paddingBottom: 96,
      },
    },

    // Section 7: Features (Hover Variant)
    {
      type: "features",
      id: "features-hover",
      content: {
        featuresVariant: "hover",
        badge: "KEY BENEFITS",
        heading: "Why Customers Choose Us",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "10x Faster Deployment",
          description: "Launch in minutes, not months",
          icon: "Rocket",
        },
        {
          id: generateId(),
          title: "Zero Learning Curve",
          description: "Intuitive interface anyone can use",
          icon: "Brain",
        },
        {
          id: generateId(),
          title: "Cost Effective",
          description: "Save 70% compared to alternatives",
          icon: "DollarSign",
        },
        {
          id: generateId(),
          title: "Scales With You",
          description: "From startup to enterprise",
          icon: "TrendingUp",
        },
      ],
    },

    // Section 8: Process (Timeline Variant)
    {
      type: "process",
      id: "process-timeline",
      content: {
        processVariant: "timeline",
        badge: "HOW IT WORKS",
        heading: "Get Started in 3 Simple Steps",
        subheading: "From signup to success in under 10 minutes",
        subheadingAnimation: "slideRight",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "Sign Up",
          description: "Create your account in 30 seconds",
          icon: "UserPlus",
        },
        {
          id: generateId(),
          title: "Customize",
          description: "Configure settings to match your workflow",
          icon: "Settings",
        },
        {
          id: generateId(),
          title: "Launch",
          description: "Go live and start seeing results",
          icon: "Rocket",
        },
      ],
    },

    // Section 9: Features (Table Variant)
    {
      type: "features",
      id: "features-table",
      content: {
        featuresVariant: "table",
        badge: "WHO USES THIS",
        heading: "Built for Every Team Size",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "Startups",
          description: "Starter plan: 1-10 users, 100GB storage",
          features: ["Basic Analytics", "Email Support"],
        },
        {
          id: generateId(),
          title: "Growing Teams",
          description: "Professional plan: 11-50 users, 1TB storage",
          features: [
            "Advanced Analytics",
            "Priority Support",
            "Custom Integrations",
          ],
        },
        {
          id: generateId(),
          title: "Enterprises",
          description: "Enterprise plan: Unlimited users and storage",
          features: [
            "Full Analytics Suite",
            "Dedicated Support",
            "Custom Everything",
          ],
        },
      ],
    },

    // Section 10: Testimonials (Scrolling)
    {
      type: "testimonials",
      id: "testimonials-scroll",
      content: {
        testimonialVariant: "scrolling",
        badge: "CUSTOMER LOVE",
        heading: "Hear From Our Happy Customers",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          description: "This tool completely transformed how we work. ROI in week 1.",
          author: "Sarah Chen",
          role: "CEO, TechCorp",
          imageUrl: "/avatars/sarah.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Best investment we made this year. Team productivity up 300%.",
          author: "Marcus Johnson",
          role: "CTO, StartupXYZ",
          imageUrl: "/avatars/marcus.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Incredibly intuitive. Our team was up and running in 10 minutes.",
          author: "Emily Rodriguez",
          role: "Product Manager, Enterprise Inc",
          imageUrl: "/avatars/emily.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Game changer for our business. Customers love the new experience.",
          author: "David Kim",
          role: "Founder, Startup Labs",
          imageUrl: "/avatars/david.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "The support team is amazing. They went above and beyond to help us.",
          author: "Lisa Anderson",
          role: "Head of Operations, ScaleUp Co",
          imageUrl: "/avatars/lisa.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Finally, a tool that actually delivers on its promises. Highly recommend!",
          author: "Michael Torres",
          role: "VP Product, InnovateTech",
          imageUrl: "/avatars/michael.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Saved us thousands of dollars and countless hours. Worth every penny.",
          author: "Jennifer Wu",
          role: "CFO, GrowthCo",
          imageUrl: "/avatars/jennifer.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "The AI features are next-level. It's like having an extra team member.",
          author: "Robert Smith",
          role: "CTO, AI Innovations",
          imageUrl: "/avatars/robert.jpg",
          rating: 5,
        },
        {
          id: generateId(),
          description: "Seamless integration with our existing tools. No disruption to workflow.",
          author: "Amanda Martinez",
          role: "Director of IT, Enterprise Solutions",
          imageUrl: "/avatars/amanda.jpg",
          rating: 5,
        },
      ],
    },

    // Section 11: Comparison
    {
      type: "comparison",
      id: "comparison-1",
      content: {
        badge: "WHY US",
        heading: "See How We Stack Up",
        subheading: "Side-by-side comparison with traditional solutions",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "Our Platform",
          features: [
            "Setup Time: 10 minutes",
            "Learning Curve: Minimal",
            "Cost: $49/mo",
            "Support: 24/7 Live",
            "Integrations: 200+",
            "AI Features: Built-in",
          ],
        },
        {
          id: generateId(),
          title: "Traditional Tools",
          features: [
            "Setup Time: Weeks",
            "Learning Curve: Steep",
            "Cost: $500+/mo",
            "Support: Email Only",
            "Integrations: Limited",
            "AI Features: Add-on",
          ],
        },
      ],
    },

    // Section 12: Stats (Circles Variant)
    {
      type: "stats",
      id: "stats-circles",
      content: {
        statsVariant: "circles",
        badge: "PERFORMANCE METRICS",
        heading: "Real Impact on Your Business",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        { id: generateId(), title: "300%", description: "Productivity Increase" },
        { id: generateId(), title: "10min", description: "Setup Time" },
        { id: generateId(), title: "99.9%", description: "Uptime Guarantee" },
        { id: generateId(), title: "24/7", description: "Support Availability" },
      ],
    },

    // Section 13: FAQ
    {
      type: "faq",
      id: "faq-1",
      content: {
        badge: "FAQ",
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        paddingTop: 96,
        paddingBottom: 96,
      },
      items: [
        {
          id: generateId(),
          title: "How long does it take to set up?",
          description: "Most teams are fully operational within 10 minutes. Our onboarding wizard guides you through each step.",
        },
        {
          id: generateId(),
          title: "What if I need help?",
          description: "Our support team is available 24/7 via live chat, email, and phone. Plus, we have extensive documentation and video tutorials.",
        },
        {
          id: generateId(),
          title: "Can I cancel anytime?",
          description: "Yes! No contracts, no commitments. Cancel with one click anytime.",
        },
        {
          id: generateId(),
          title: "Do you offer a free trial?",
          description: "Absolutely! Try all features free for 14 days. No credit card required.",
        },
        {
          id: generateId(),
          title: "How secure is my data?",
          description: "We use bank-level encryption, SOC 2 Type II certified, and GDPR compliant. Your data is safe with us.",
        },
        {
          id: generateId(),
          title: "Can I integrate with my existing tools?",
          description: "Yes! We support 200+ integrations including Slack, Salesforce, HubSpot, and more.",
        },
        {
          id: generateId(),
          title: "What happens after my trial ends?",
          description: "You can choose a plan that fits your needs, or your account will automatically downgrade to our free tier.",
        },
        {
          id: generateId(),
          title: "Do you offer discounts for annual billing?",
          description: "Yes! Save 20% when you pay annually. Plus, get priority support and exclusive features.",
        },
      ],
    },

    // Section 14: CTA (Split Variant)
    {
      type: "cta",
      id: "cta-split",
      content: {
        ctaVariant: "split",
        badge: "GET STARTED TODAY",
        heading: "Ready to Transform Your Business?",
        subheading: "Join 10,000+ companies already seeing results",
        buttonText: "Start Free Trial",
        buttonLink: "#signup",
        buttonVariant: "neon",
        imageUrl: "/cta-dashboard.png",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
        backgroundEffect: "glow",
        paddingTop: 120,
        paddingBottom: 120,
      },
    },

    // Section 15: CTA (Banner Variant)
    {
      type: "cta",
      id: "cta-banner",
      content: {
        ctaVariant: "banner",
        heading: "🔥 Limited Time: 50% Off All Plans",
        buttonText: "Claim Discount",
        buttonLink: "#signup",
        buttonVariant: "flow",
        backgroundColor: "#8B5CF6",
        textColor: "#FFFFFF",
      },
    },

    // Section 16: Footer
    {
      type: "footer",
      id: "footer-1",
      content: {
        logoText: "YourProduct",
        tagline: "Transform your business with AI-powered solutions",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "About", url: "#about" },
          { label: "Contact", url: "#contact" },
          { label: "Twitter", url: "https://twitter.com/yourproduct" },
          { label: "LinkedIn", url: "https://linkedin.com/company/yourproduct" },
          { label: "GitHub", url: "https://github.com/yourproduct" },
          { label: "Privacy", url: "#privacy" },
          { label: "Terms", url: "#terms" },
        ],
        bodyText: "© 2026 YourProduct. All rights reserved.",
        backgroundColor: "#0a0a0a",
        textColor: "#F9FAFB",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#0EA5E9", // Electric Blue
    secondary: "#8B5CF6", // Vivid Purple
    accent: "#10B981", // Emerald Green
    background: "#0a0a0a", // Near Black
    text: "#F9FAFB", // Off-White
  },
  typography: {
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
  },
  smoothScroll: true,
  animationPreset: "dramatic",
  designCanvasWidth: 896,
};
