import { LandingPage, generateId } from "../page-schema";

/**
 * Webinar Registration Template
 * Based on funnel-library.html wireframe
 * Countdown + speaker + registration form
 * Purple/Pink color scheme for premium + urgency
 * 7-section event registration optimized structure
 */
export const webinarTemplate: LandingPage = {
  title: "Join Our Exclusive Webinar",
  description: "Register now for our free live training session",
  sections: [
    // Header Section (Minimal)
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "WEBINAR",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        accentColor: "#7c3aed",
        links: [],
        buttonText: "Register Now",
        buttonLink: "#register",
      },
      items: [],
    },

    // Hero + Countdown Section
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "🔴 LIVE WEBINAR",
        heading: "Master the Secrets to",
        accentHeading: "10x Your Sales in 90 Days",
        accentColor: "#ec4899",
        subheading:
          "Join industry expert Sarah Johnson for an exclusive 60-minute training session. Learn the proven strategies that helped 10,000+ businesses transform their sales process.",
        buttonText: "Save My Free Seat",
        buttonLink: "#register",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        heroVariant: "default",
      },
      items: [],
    },

    // What You'll Learn (Features Section)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "What You'll Learn",
        subheading: "Walk away with actionable strategies you can implement immediately",
        backgroundColor: "#f8fafc",
        textColor: "#18181b",
        accentColor: "#7c3aed",
        featuresVariant: "illustrated",
      },
      items: [
        {
          id: generateId(),
          title: "The Sales Framework That Never Fails",
          description:
            "Discover the exact 5-step process that's helped thousands close bigger deals faster.",
          icon: "target",
        },
        {
          id: generateId(),
          title: "How to Handle Any Objection",
          description:
            "Master the psychology of objections and turn every 'no' into a 'yes' using proven techniques.",
          icon: "shield-check",
        },
        {
          id: generateId(),
          title: "Triple Your Close Rate Overnight",
          description:
            "Learn the secret tactics top performers use to consistently hit 60%+ close rates.",
          icon: "trending-up",
        },
        {
          id: generateId(),
          title: "Build a Scalable Sales System",
          description:
            "Create processes that work whether you're doing 10 calls or 1,000 calls per month.",
          icon: "cog",
        },
        {
          id: generateId(),
          title: "Leverage AI for Sales Success",
          description:
            "Harness AI tools to automate follow-ups, qualify leads faster, and close more deals.",
          icon: "sparkles",
        },
        {
          id: generateId(),
          title: "Live Q&A Session",
          description:
            "Get your specific questions answered in real-time during our exclusive Q&A segment.",
          icon: "chat",
        },
      ],
    },

    // Speaker Bio (Founders Section)
    {
      id: generateId(),
      type: "founders",
      content: {
        heading: "Meet Your Instructor",
        subheading: "Learn from a proven expert with a track record of success",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        accentColor: "#7c3aed",
      },
      items: [
        {
          id: generateId(),
          title: "Sarah Johnson",
          description: "Sarah has trained over 50,000 sales professionals and helped 10,000+ businesses scale their revenue. She's spoken at Fortune 500 companies including Google, Microsoft, and Salesforce. Her book 'The Sales Playbook' hit #1 on Amazon and has been translated into 15 languages.",
          role: "Sales Expert & Bestselling Author",
          imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
        },
      ],
    },

    // Registration Form (CTA Section)
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Secure Your Free Seat Now",
        subheading:
          "Limited to 500 attendees. Over 8,000 people registered last time. Don't miss out!",
        buttonText: "Register for Free Webinar",
        buttonLink: "#",
        bodyText:
          "📅 December 15, 2024 at 2:00 PM EST\n⏱️ 60 minutes + Q&A\n💯 100% Free - No catch",
        backgroundColor: "#7c3aed",
        textColor: "#ffffff",
        accentColor: "#ec4899",
        ctaVariant: "centered",
        headingStyle: "solid",
      },
      items: [],
    },

    // Testimonials from Past Attendees
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Past Attendees Are Saying",
        backgroundColor: "#f8fafc",
        textColor: "#18181b",
        scrollSpeed: 30,
        testimonialVariant: "twitter-cards",
      },
      items: [
        {
          id: generateId(),
          title: "Doubled my close rate in 2 weeks",
          description:
            "I implemented Sarah's framework immediately after the webinar and closed 3 deals in the first week. This training is pure gold!",
          author: "Michael Chen",
          role: "Sales Manager, TechCorp",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Finally cracked the code",
          description:
            "After struggling for months, Sarah's objection handling techniques completely transformed my approach. I'm now hitting quota consistently.",
          author: "Emily Rodriguez",
          role: "Account Executive, SalesPro",
          imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
        },
        {
          id: generateId(),
          title: "Best sales training I've ever attended",
          description:
            "I've been to dozens of sales trainings and this webinar delivered more value in 60 minutes than most multi-day conferences. Incredible!",
          author: "David Park",
          role: "VP Sales, GrowthStartup",
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
        },
      ],
    },

    // Footer Section (Minimal)
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "WEBINAR",
        tagline: "MASTER. SELL. SUCCEED.",
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        accentColor: "#7c3aed",
        links: [
          { label: "Privacy Policy", url: "#" },
          { label: "Contact", url: "#" },
        ],
        bodyText: "© 2024 Webinar Training. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#7c3aed",
    secondary: "#6d28d9",
    accent: "#ec4899",
    background: "#ffffff",
    text: "#18181b",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
  },
  animationPreset: "moderate",
  smoothScroll: true,
};
