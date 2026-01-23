import { LandingPage, generateId } from "../page-schema";

/**
 * SaaS Product Template
 * Based on funnel-library.html wireframe
 * Free trial + feature-focused conversion funnel
 * Blue/Orange color scheme for trust + action
 * 11-section conversion-optimized structure
 */
export const saasProductTemplate: LandingPage = {
  title: "Your SaaS Solution",
  description: "Transform your workflow with our powerful SaaS platform",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "SAAS PRO",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#2563EB",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "Demo", url: "#demo" },
        ],
        buttonText: "Start Free Trial",
        buttonLink: "#pricing",
      },
      items: [],
    },

    // Hero Section
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "🚀 Join 50,000+ Happy Customers",
        heading: "The Complete Platform to",
        accentHeading: "Scale Your Business 10x Faster",
        accentColor: "#F97316",
        subheading:
          "All-in-one software that streamlines operations, automates workflows, and accelerates growth. See results in days, not months.",
        buttonText: "Start Free 14-Day Trial",
        buttonLink: "#pricing",
        secondaryButtonText: "Watch Demo",
        secondaryButtonLink: "#demo",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        heroVariant: "default",
      },
      items: [],
    },

    // Logo Cloud Section
    {
      id: generateId(),
      type: "logoCloud",
      content: {
        heading: "Trusted by Industry Leaders",
        subheading: "Join thousands of companies already using our platform",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        { id: generateId(), title: "Microsoft", imageUrl: "" },
        { id: generateId(), title: "Google", imageUrl: "" },
        { id: generateId(), title: "Amazon", imageUrl: "" },
        { id: generateId(), title: "Salesforce", imageUrl: "" },
        { id: generateId(), title: "Adobe", imageUrl: "" },
        { id: generateId(), title: "Oracle", imageUrl: "" },
      ],
    },

    // Features Section
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Everything You Need in One Platform",
        subheading: "Powerful features designed for modern teams",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        layout: "grid",
        accentColor: "#2563EB",
        featuresVariant: "bento",
      },
      items: [
        {
          id: generateId(),
          title: "Automated Workflows",
          description:
            "Set up complex automations in minutes. Save 20+ hours per week on repetitive tasks.",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "Advanced Analytics",
          description:
            "Real-time dashboards and insights to make data-driven decisions instantly.",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "Team Collaboration",
          description: "Real-time sync, shared workspaces, and seamless communication tools.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "Enterprise Security",
          description:
            "SOC 2 certified with end-to-end encryption. Your data is always protected.",
          imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
      ],
    },

    // Video Demo Section
    {
      id: generateId(),
      type: "video",
      content: {
        heading: "See How It Works",
        subheading: "Watch a 2-minute overview of the platform",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#2563EB",
        videoVariant: "centered",
      },
      items: [],
    },

    // Stats Section
    {
      id: generateId(),
      type: "stats",
      content: {
        heading: "Trusted by Thousands",
        subheading: "Our customers see real results from day one",
        backgroundColor: "#2563EB",
        textColor: "#ffffff",
        accentColor: "#F97316",
        statsVariant: "cards",
      },
      items: [
        {
          id: generateId(),
          title: "50K+",
          description: "Active Users",
        },
        {
          id: generateId(),
          title: "20+",
          description: "Hours Saved Weekly",
        },
        {
          id: generateId(),
          title: "99.9%",
          description: "Uptime SLA",
        },
        {
          id: generateId(),
          title: "300%",
          description: "Average ROI",
        },
      ],
    },

    // Pricing Section
    {
      id: generateId(),
      type: "pricing",
      content: {
        heading: "Simple, Transparent Pricing",
        subheading: "Choose the plan that's right for your team",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        {
          id: generateId(),
          title: "Starter",
          description: "Perfect for small teams getting started",
          price: "$29/month",
          features: [
            "Up to 5 team members",
            "10GB storage",
            "Basic analytics",
            "Email support",
          ],
        },
        {
          id: generateId(),
          title: "Professional",
          description: "For growing teams that need more power",
          price: "$99/month",
          features: [
            "Up to 25 team members",
            "100GB storage",
            "Advanced analytics",
            "Priority support",
            "Custom integrations",
            "Advanced security",
          ],
        },
        {
          id: generateId(),
          title: "Enterprise",
          description: "Custom solutions for large organizations",
          price: "Custom",
          features: [
            "Unlimited team members",
            "Unlimited storage",
            "Custom analytics",
            "Dedicated support",
            "On-premise deployment",
            "SLA guarantee",
          ],
        },
      ],
    },

    // Testimonials Section
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Our Customers Say",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        scrollSpeed: 30,
        testimonialVariant: "scrolling",
      },
      items: [
        {
          id: generateId(),
          title: "Transformed our workflow completely",
          description:
            "We've cut our operational costs by 40% and increased productivity by 3x. This platform is absolutely essential for our business.",
          author: "Sarah Johnson",
          role: "CEO, TechStartup Inc",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Best investment we've made",
          description:
            "The ROI was immediate. Within the first month, we automated 80% of our manual processes and saved countless hours.",
          author: "Michael Chen",
          role: "Operations Director, GrowthCo",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Couldn't run without it",
          description:
            "This has become our single source of truth. The analytics alone have helped us make better decisions and grow faster.",
          author: "Emma Rodriguez",
          role: "Product Manager, ScaleUp",
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Incredible support team",
          description:
            "Not only is the product amazing, but the support team is always there when we need them. Truly world-class service.",
          author: "David Park",
          role: "CTO, InnovateLabs",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        },
      ],
    },

    // FAQ Section
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#2563EB",
      },
      items: [
        {
          id: generateId(),
          title: "How does the free trial work?",
          description:
            "Start your 14-day free trial with full access to all features. No credit card required. Cancel anytime before the trial ends and you won't be charged.",
        },
        {
          id: generateId(),
          title: "Can I change plans later?",
          description:
            "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.",
        },
        {
          id: generateId(),
          title: "What payment methods do you accept?",
          description:
            "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and ACH transfers for annual plans. Enterprise customers can request invoice billing.",
        },
        {
          id: generateId(),
          title: "Is my data secure?",
          description:
            "Absolutely. We're SOC 2 Type II certified and use bank-level encryption. All data is encrypted in transit and at rest. We never sell or share your data.",
        },
        {
          id: generateId(),
          title: "Do you offer discounts for annual plans?",
          description:
            "Yes! Save 20% when you pay annually. That's like getting 2.4 months free. Contact sales for enterprise volume discounts.",
        },
        {
          id: generateId(),
          title: "What kind of support do you provide?",
          description:
            "All plans include email support. Professional plans get priority support with 4-hour response times. Enterprise customers get dedicated success managers and 24/7 phone support.",
        },
      ],
    },

    // Final CTA Section
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Ready to Transform Your Business?",
        subheading:
          "Join 50,000+ companies already growing faster with our platform. Start your free trial today—no credit card required.",
        buttonText: "Start Free 14-Day Trial",
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
        logoText: "SAAS PRO",
        tagline: "SCALE. AUTOMATE. SUCCEED.",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#2563EB",
        links: [
          { label: "Privacy Policy", url: "#" },
          { label: "Terms of Service", url: "#" },
          { label: "Contact", url: "#" },
          { label: "Status", url: "#" },
        ],
        bodyText: "© 2024 SaaS Pro. All rights reserved.",
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
