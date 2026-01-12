import { LandingPage, generateId } from "../page-schema";

/**
 * SaaS Funnel Template
 * Blue/Orange color scheme for trust + action
 * AIDA copywriting formula (Attention, Interest, Desire, Action)
 * 9-section high-converting funnel structure
 */
export const saasTemplate: LandingPage = {
  title: "Your SaaS Product",
  description: "The all-in-one platform that helps you achieve more",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "PRODUCTIFY",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#2563EB",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "Testimonials", url: "#testimonials" },
        ],
        buttonText: "Start Free Trial",
        buttonLink: "#pricing",
      },
      items: [],
    },

    // Hero Section (ATTENTION)
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "🚀 Trusted by 10,000+ Teams",
        heading: "The AI Tool That",
        accentHeading: "10x Your Productivity in Days",
        accentColor: "#F97316",
        subheading:
          "Stop wasting hours on repetitive tasks. Our AI-powered platform automates your workflow, saves 15+ hours per week, and helps you focus on what actually matters.",
        buttonText: "Start My Free 14-Day Trial",
        buttonLink: "#pricing",
        videoUrl: "",
        brands: [
          "STRIPE",
          "NOTION",
          "FIGMA",
          "SLACK",
          "LINEAR",
          "VERCEL",
        ],
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      items: [],
    },

    // Logo Cloud (Social Proof)
    {
      id: generateId(),
      type: "logoCloud",
      content: {
        heading: "Trusted by Industry Leaders",
        subheading: "Join 10,000+ companies already using our platform",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        { id: generateId(), title: "TechCorp", imageUrl: "" },
        { id: generateId(), title: "StartupX", imageUrl: "" },
        { id: generateId(), title: "ScaleUp", imageUrl: "" },
        { id: generateId(), title: "GrowthCo", imageUrl: "" },
        { id: generateId(), title: "InnovateLab", imageUrl: "" },
        { id: generateId(), title: "FutureTech", imageUrl: "" },
      ],
    },

    // Stats Section (INTEREST - Show credibility)
    {
      id: generateId(),
      type: "stats",
      content: {
        heading: "Results That Speak for Themselves",
        subheading: "Our customers see measurable improvements within the first week",
        backgroundColor: "#2563EB",
        textColor: "#ffffff",
        accentColor: "#F97316",
        statsVariant: "cards",
      },
      items: [
        {
          id: generateId(),
          title: "15+",
          description: "Hours Saved Per Week",
        },
        {
          id: generateId(),
          title: "340%",
          description: "Average ROI Increase",
        },
        {
          id: generateId(),
          title: "10K+",
          description: "Active Users",
        },
        {
          id: generateId(),
          title: "99.9%",
          description: "Uptime Guarantee",
        },
      ],
    },

    // Process Section (How It Works)
    {
      id: generateId(),
      type: "process",
      content: {
        heading: "Get Started in 3 Simple Steps",
        subheading: "From sign up to results in under 5 minutes",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        {
          id: generateId(),
          title: "Sign Up Free",
          description: "Create your account in 30 seconds. No credit card required.",
          icon: "user-plus",
        },
        {
          id: generateId(),
          title: "Connect Your Tools",
          description: "Integrate with 100+ apps you already use. One-click setup.",
          icon: "link",
        },
        {
          id: generateId(),
          title: "Watch Results Flow",
          description: "Sit back as AI automates your workflow and saves you hours daily.",
          icon: "rocket",
        },
      ],
    },

    // Features Section (INTEREST - Show value)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Everything You Need to Scale",
        subheading: "Powerful Features",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        layout: "grid",
        accentColor: "#2563EB",
      },
      items: [
        {
          id: generateId(),
          title: "AI-Powered Automation",
          description:
            "Let AI handle repetitive tasks while you focus on strategy. Save 15+ hours every week.",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "Real-Time Analytics",
          description:
            "Track performance with live dashboards. Make data-driven decisions instantly.",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "Team Collaboration",
          description: "Work together seamlessly with shared workspaces and real-time sync.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "100+ Integrations",
          description:
            "Connect with Slack, Notion, Zapier, and every tool your team already uses.",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
      ],
    },

    // Testimonials Section (DESIRE - Social proof)
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "Loved by Teams Worldwide",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        scrollSpeed: 30,
      },
      items: [
        {
          id: generateId(),
          title: "Increased conversions by 340%",
          description:
            "Within 30 days of implementing Productify, our team's efficiency doubled. The AI features are genuinely impressive.",
          author: "Sarah Chen",
          role: "Head of Operations, TechCorp",
        },
        {
          id: generateId(),
          title: "Saves us 20+ hours weekly",
          description:
            "We've automated 80% of our repetitive workflows. The ROI paid for itself in the first week.",
          author: "Michael Rodriguez",
          role: "CEO, StartupX",
        },
        {
          id: generateId(),
          title: "Best tool we've ever adopted",
          description:
            "The integrations are seamless, support is incredible, and our whole team actually uses it daily.",
          author: "Emily Watson",
          role: "Product Manager, ScaleUp",
        },
        {
          id: generateId(),
          title: "Game-changer for our team",
          description:
            "We reduced our tool stack from 12 apps to 3. Productify handles everything else.",
          author: "James Liu",
          role: "CTO, GrowthCo",
        },
        {
          id: generateId(),
          title: "Finally, software that works",
          description:
            "Setup took 5 minutes and we saw results the same day. Seriously impressive platform.",
          author: "Amanda Foster",
          role: "Director of Ops, InnovateLab",
        },
        {
          id: generateId(),
          title: "Worth every penny",
          description:
            "The analytics alone have helped us make better decisions and grow 3x faster this quarter.",
          author: "David Park",
          role: "Founder, FutureTech",
        },
      ],
    },

    // FAQ Section (Handle objections)
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know before getting started",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        {
          id: generateId(),
          title: "How long does setup take?",
          description:
            "Most teams are up and running in under 5 minutes. Our one-click integrations and intuitive onboarding make it easy to get started immediately.",
        },
        {
          id: generateId(),
          title: "Is my data secure?",
          description:
            "Absolutely. We're SOC 2 Type II certified and use enterprise-grade encryption. Your data never leaves our secure infrastructure and we never sell your information.",
        },
        {
          id: generateId(),
          title: "What integrations do you support?",
          description:
            "We integrate with 100+ tools including Slack, Notion, Zapier, Google Workspace, Microsoft 365, Salesforce, HubSpot, and many more. If you use it, we probably connect to it.",
        },
        {
          id: generateId(),
          title: "Can I cancel anytime?",
          description:
            "Yes, you can cancel your subscription at any time with no questions asked. We also offer a 14-day free trial so you can test everything risk-free.",
        },
        {
          id: generateId(),
          title: "Do you offer team pricing?",
          description:
            "Yes! We offer discounted rates for teams of 5 or more. Contact our sales team for a custom quote that fits your needs.",
        },
        {
          id: generateId(),
          title: "What kind of support do you provide?",
          description:
            "All plans include email support with 24-hour response times. Pro and Enterprise plans get priority support and dedicated success managers.",
        },
      ],
    },

    // Final CTA Section (ACTION)
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Ready to 10x Your Productivity?",
        subheading:
          "Join 10,000+ teams already saving 15+ hours every week. Start your free trial today—no credit card required.",
        buttonText: "Start My Free 14-Day Trial",
        buttonLink: "#pricing",
        bodyText: "✓ No credit card required  ✓ Cancel anytime  ✓ 24/7 support",
        backgroundColor: "#2563EB",
        textColor: "#ffffff",
        accentColor: "#F97316",
        ctaVariant: "centered",
        headingStyle: "solid",
      },
      items: [],
    },

    // Footer Section
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "PRODUCTIFY",
        tagline: "AUTOMATE. SCALE. SUCCEED.",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#2563EB",
        links: [
          { label: "Privacy", url: "#" },
          { label: "Terms", url: "#" },
          { label: "Support", url: "#" },
          { label: "Status", url: "#" },
        ],
        bodyText: "© 2024 Productify. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#2563EB",
    secondary: "#1d4ed8",
    accent: "#F97316",
    background: "#ffffff",
    text: "#1f2937",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
  },
  animationPreset: "moderate",
  smoothScroll: true,
};
