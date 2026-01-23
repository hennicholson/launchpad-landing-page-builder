import { LandingPage, generateId } from "../page-schema";

/**
 * Lead Magnet / Ebook Template
 * Based on funnel-library.html wireframe
 * Value-first email capture with ebook preview
 * Green/Navy color scheme for growth + trust
 * 6-section lead generation optimized structure
 */
export const leadMagnetTemplate: LandingPage = {
  title: "Free Download: Your Ultimate Guide",
  description: "Get your free comprehensive guide and transform your results",
  sections: [
    // Header Section (Minimal - Logo Only)
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "GROWTH GUIDES",
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        accentColor: "#16a34a",
        links: [],
        buttonText: "",
        buttonLink: "",
      },
      items: [],
    },

    // Hero + Email Signup Form
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "📚 FREE DOWNLOAD",
        heading: "The Complete Guide to",
        accentHeading: "Building a 7-Figure Business in 12 Months",
        accentColor: "#1e3a8a",
        subheading:
          "Download our 67-page comprehensive guide packed with proven strategies, real case studies, and actionable frameworks. Join 50,000+ entrepreneurs who've already downloaded this game-changing resource.",
        buttonText: "Download Free Guide",
        buttonLink: "#",
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        heroVariant: "email-signup",
        imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80",
        mockupDescription: "67-page guide with proven strategies",
      },
      items: [],
    },

    // What's Inside (Features Section)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "What's Inside This Powerful Guide",
        subheading: "Everything you need to build and scale your business successfully",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        accentColor: "#16a34a",
        featuresVariant: "hover",
      },
      items: [
        {
          id: generateId(),
          title: "The Proven Revenue Framework",
          description:
            "Step-by-step system for building predictable revenue streams that scale beyond 7-figures.",
          icon: "chart-bar",
        },
        {
          id: generateId(),
          title: "Customer Acquisition Strategies",
          description:
            "Learn the exact channels and tactics that drive consistent, high-quality leads.",
          icon: "users",
        },
        {
          id: generateId(),
          title: "Pricing & Positioning Mastery",
          description:
            "How to position your offer and price for maximum profit while staying competitive.",
          icon: "currency-dollar",
        },
        {
          id: generateId(),
          title: "Sales Funnel Blueprint",
          description:
            "Complete funnel architecture with conversion optimization techniques that actually work.",
          icon: "funnel",
        },
        {
          id: generateId(),
          title: "10 Real Case Studies",
          description:
            "Detailed breakdowns of businesses that went from zero to 7-figures using these exact strategies.",
          icon: "document-text",
        },
        {
          id: generateId(),
          title: "Implementation Checklist",
          description:
            "90-day action plan with specific milestones to keep you on track and accountable.",
          icon: "clipboard-check",
        },
        {
          id: generateId(),
          title: "Common Mistakes to Avoid",
          description:
            "Learn from others' failures. We cover the top 15 mistakes that kill most businesses.",
          icon: "exclamation-circle",
        },
        {
          id: generateId(),
          title: "Bonus: Financial Templates",
          description:
            "Downloadable spreadsheets for forecasting, budgeting, and tracking your key metrics.",
          icon: "calculator",
        },
      ],
    },

    // Author Bio (Founders Section)
    {
      id: generateId(),
      type: "founders",
      content: {
        heading: "About The Author",
        subheading: "Written by a proven expert who's helped thousands succeed",
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        accentColor: "#16a34a",
      },
      items: [
        {
          id: generateId(),
          title: "Marcus Thompson",
          description: "Marcus has built and sold 3 companies for a combined $50M+. Over the past decade, he's mentored 10,000+ entrepreneurs and helped 500+ businesses reach 7-figures. His strategies have been featured in Forbes, Inc, and Entrepreneur Magazine. He's also a bestselling author with 4 books on business growth and scaling.",
          role: "Serial Entrepreneur & Business Coach",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
        },
      ],
    },

    // Testimonials / Social Proof
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Readers Are Saying",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        scrollSpeed: 30,
        testimonialVariant: "scrolling",
      },
      items: [
        {
          id: generateId(),
          title: "Hit 7-figures in 8 months",
          description:
            "I implemented the revenue framework from this guide and scaled from $0 to $1.2M in revenue in just 8 months. This is the blueprint I wish I had when I started.",
          author: "Jessica Martinez",
          role: "Founder, EcomGrowth",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        },
        {
          id: generateId(),
          title: "The best business resource I've read",
          description:
            "I've read dozens of business books, but this guide is different. It's practical, actionable, and actually works. Highly recommend!",
          author: "Alex Chen",
          role: "CEO, TechStartup Co",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Changed my entire approach",
          description:
            "The customer acquisition strategies alone are worth 10x what I'd normally pay for this kind of content. Can't believe this is free!",
          author: "Samantha Lee",
          role: "Marketing Director, GrowthLabs",
          imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Finally, strategies that actually work",
          description:
            "No fluff, no theory - just real, actionable strategies backed by data and case studies. Implemented 3 tactics and saw results in 2 weeks.",
          author: "Robert Johnson",
          role: "Founder, ScaleUp Agency",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Saved me years of trial and error",
          description:
            "Marcus breaks down exactly what works and what doesn't. This guide saved me years of expensive mistakes. Absolute gold!",
          author: "Emily Park",
          role: "Co-Founder, InnovateNow",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        },
      ],
    },

    // Footer Section (Minimal)
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "GROWTH GUIDES",
        tagline: "LEARN. GROW. SUCCEED.",
        backgroundColor: "#0f172a",
        textColor: "#ffffff",
        accentColor: "#16a34a",
        links: [
          { label: "Privacy Policy", url: "#" },
          { label: "Terms of Use", url: "#" },
        ],
        bodyText: "© 2024 Growth Guides. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#16a34a",
    secondary: "#15803d",
    accent: "#1e3a8a",
    background: "#f8fafc",
    text: "#0f172a",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
  },
  animationPreset: "moderate",
  smoothScroll: true,
};
