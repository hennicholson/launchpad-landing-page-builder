import type { LandingPage } from "../page-schema";
import { generateId } from "../page-schema";

export const salesFunnelTemplate: LandingPage = {
  title: "Sales Funnel Template",
  description: "High-converting sales funnel with proven 12-section structure. Perfect for digital products, courses, and services.",
  colorScheme: {
    primary: "#8B6F7D",      // Dusty mauve
    secondary: "#8B6F7D",    // Same as primary for consistency
    accent: "#10b981",       // Green for CTAs
    background: "#ffffff",   // White background
    text: "#111827",         // Darker text for better contrast
  },
  typography: {
    headingFont: "Inter",    // Clean, professional
    bodyFont: "Inter",
  },
  animationPreset: "subtle", // Minimal animations
  smoothScroll: true,
  designCanvasWidth: 896,
  contentWidth: "narrow", // Focused sales funnel style
  sections: [
    // 1. HEADER - Navigation
    {
      id: generateId(),
      type: "header",
      content: {
        headerVariant: "simple-header",
        headerPosition: "fixed",
        logoText: "YourBrand",
        logoUrl: "",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        buttonText: "Get Started",
        buttonLink: "#pricing",
        buttonVariant: "primary",
        showLogo: true,
        showLinks: true,
        showButton: false,
        links: [
          { id: generateId(), label: "Features", url: "#features" },
          { id: generateId(), label: "Pricing", url: "#pricing" },
          { id: generateId(), label: "Testimonials", url: "#testimonials" },
        ],
      },
      items: [
        { id: generateId(), label: "Features", url: "#features" },
        { id: generateId(), label: "Pricing", url: "#pricing" },
        { id: generateId(), label: "Testimonials", url: "#testimonials" },
        { id: generateId(), label: "FAQ", url: "#faq" },
      ],
    },

    // 2. HERO - Headline + Subheadline + Hero Image + Primary CTA
    {
      id: generateId(),
      type: "hero",
      content: {
        heroVariant: "sales-funnel",
        topTitle: "For Entrepreneurs & Business Owners Who Want To Scale Their Success...",
        heading: "Transform Your Business With Our Proven 90-Day Growth System",
        subheading: "Easy To Implement & See Results So You Can Start Winning Today!",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop",
        heroImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop",
        showImage: true,
        ctaText: "YES! I WANT TO GROW MY BUSINESS",
        ctaUrl: "#offer",
        ctaSecondaryText: "Only $297 - One-Time Payment",
        badge: "365 days money back guarantee",
        badgeIcon: "shield",
        showBadge: true,
        backgroundColor: "#ffffff",
        textColor: "#111827",
        accentColor: "#10b981",
        paddingTop: 15,
        paddingBottom: 6,
        showHeading: true,
        showSubheading: true,
        showButton: true,
        buttonVariant: "primary",
        buttonShadow: "md",
        buttonBorderWidth: 3,
        elementStyles: {
          heading: {
            fontSize: 31,
            textAlign: "center",
          },
          subheading: {
            fontSize: 22,
            textAlign: "left",
            lineHeight: 1,
          },
        },
      },
    },

    // 3. VALUE PROPOSITION - Long-form copy
    {
      id: generateId(),
      type: "value-proposition",
      content: {
        heading: "Here's the Truth About Success",
        badge: "THE PROBLEM",
        showBadge: false,
        showHeading: true,
        bodyParagraphs: [
          "<p>You've probably tried everything. The courses, the books, the webinars. You're motivated, you're willing to put in the work, but something just isn't clicking. You feel stuck, watching others succeed while you're still searching for that <strong>breakthrough</strong>.</p>",
          "<p>The problem isn't you. It's the system you've been following. Most programs focus on theory without giving you the practical, step-by-step roadmap you need to get results. They leave you confused, overwhelmed, and unsure of what to do next.</p>",
          "What if there was a proven system that took you by the hand and showed you exactly what to do, step by step? A system that's already helped thousands of people just like you achieve their goals?",
          "<p>That's exactly what we've created. No fluff, no theory, just actionable steps that get real results. Whether you're starting from zero or looking to take your success to the next level, this is the system you've been looking for.</p>",
        ],
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        accentColor: "#8B6F7D",
        paddingTop: 28,
        paddingBottom: 28,
      },
    },

    // 4. OFFER DETAILS - Image + Bullet List
    {
      id: generateId(),
      type: "offer-details",
      content: {
        heading: "What You Get Today",
        description: "Everything you need to succeed, all in one complete system:",
        badge: "COMPLETE PACKAGE",
        showBadge: true,
        featuredImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop",
        featuredImageAlt: "Complete system overview",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        accentColor: "#10b981",
      },
      items: [
        {
          id: generateId(),
          title: "The Complete Video Training",
          description: "Over 50 hours of step-by-step training covering everything you need to know",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Done-For-You Templates",
          description: "Save hundreds of hours with our proven templates and frameworks",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Private Community Access",
          description: "Join our exclusive community of high-achievers and get support when you need it",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Weekly Live Coaching Calls",
          description: "Get your questions answered and stay accountable with our live sessions",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Lifetime Updates",
          description: "Get all future updates and improvements completely free",
          icon: "check"
        },
        {
          id: generateId(),
          title: "30-Day Money-Back Guarantee",
          description: "Try it risk-free - if you're not satisfied, get a full refund",
          icon: "check"
        },
      ],
    },

    // 5. FIRST CTA
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Ready to Get Started?",
        subheading: "Join thousands of successful students who are already seeing results",
        buttonText: "Enroll Now",
        buttonLink: "#pricing",
        buttonVariant: "cartoon",
        buttonBgColor: "#32c36a",
        buttonTextColor: "#131514",
        backgroundColor: "#f2f3f2",
        textColor: "#111827",
        accentColor: "#10b981",
        showHeading: true,
        showSubheading: true,
        showButton: true,
        showGridBackground: false,
        paddingTop: 37,
        paddingBottom: 21,
        elementStyles: {
          buttonText: {
            color: "#000000",
          },
        },
      },
    },

    // 6. COMPARISON - Before/After Columns
    {
      id: generateId(),
      type: "comparison",
      content: {
        heading: "Before vs. After",
        subheading: "See the transformation our students experience",
        badge: "Comparison",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        elementStyles: {
          heading: {
            fontSize: 45,
          },
        },
      },
      items: [
        {
          id: generateId(),
          title: "Without Our System",
          description: "Feeling stuck and frustrated",
          features: [
            "Trying random strategies without a clear plan",
            "Wasting time on tactics that don't work",
            "Feeling overwhelmed and confused",
            "Seeing others succeed while you struggle",
            "Lacking confidence in your abilities",
            "Ready to give up on your goals"
          ],
        },
        {
          id: generateId(),
          title: "With Our System",
          description: "Confident and achieving your goals",
          features: [
            "Following a proven step-by-step roadmap",
            "Implementing strategies that actually work",
            "Clear on exactly what to do next",
            "Seeing real, measurable progress",
            "Building unstoppable confidence",
            "Achieving goals you thought were impossible"
          ],
        },
      ],
    },

    // 7. CREATOR/EXPERT - Josh Gavin
    {
      id: generateId(),
      type: "creator",
      content: {
        heading: "Meet Your Instructor",
        creatorPhotoUrl: "https://yt3.googleusercontent.com/YubqTr6nBGKty8Ou8s35vwS-WUSdrE3QffEfZ7w4htrJkoaLCrT5hYd3nf_btKNXgs5J7NRB2A=s900-c-k-c0x00ffffff-no-rj",
        creatorPhotoAlt: "Instructor photo",
        creatorName: "Josh Gavin",
        creatorRole: "Founder & Lead Instructor",
        creatorBio: "I know what it's like to feel stuck. Ten years ago, I was exactly where you are now - frustrated, confused, and ready to give up on my dreams.\n\nBut everything changed when I discovered the system I'm about to share with you. Within 90 days, I went from struggling to thriving. I achieved goals I thought were impossible and built the life I'd always dreamed of.\n\nSince then, I've dedicated my life to helping others achieve the same transformation. I've worked with over 10,000 students from around the world, and the results speak for themselves.\n\nThis isn't theory - it's a proven system that works. I've refined it over years of real-world testing, and I'm confident it will work for you too.",
        creatorCredentials: [
          "Featured in Forbes, Entrepreneur, and Inc. Magazine",
          "10+ years of experience in the field",
          "Helped over 10,000 students achieve their goals",
          "Award-winning instructor and speaker"
        ],
        backgroundColor: "#ffffff",
        textColor: "#111827",
        accentColor: "#10b981",
        twitterUrl: "",
        instagramUrl: "",
        linkedinUrl: "",
        youtubeUrl: "",
        tiktokUrl: "",
      },
    },

    // 8. DETAILED FEATURES - What's Inside
    {
      id: generateId(),
      type: "detailed-features",
      content: {
        heading: "What's Inside the Program",
        introText: "A complete, step-by-step system designed to take you from where you are to where you want to be:",
        featuredImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop",
        featuredImageAlt: "Program curriculum overview",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        accentColor: "#8B6F7D",
        paddingBottom: 32,
      },
      items: [
        {
          id: generateId(),
          title: "Module 1: Foundation",
          description: "Build a rock-solid foundation with the mindset and principles that separate winners from the rest.",
          icon: "star"
        },
        {
          id: generateId(),
          title: "Module 2: Strategy",
          description: "Discover the exact strategy used by top performers to achieve their goals faster than they ever thought possible.",
          icon: "chart"
        },
        {
          id: generateId(),
          title: "Module 3: Implementation",
          description: "Learn how to take action consistently and overcome the obstacles that stop most people from succeeding.",
          icon: "rocket"
        },
        {
          id: generateId(),
          title: "Module 4: Optimization",
          description: "Fine-tune your approach and maximize your results with advanced tactics that accelerate your progress.",
          icon: "lightning"
        },
        {
          id: generateId(),
          title: "Module 5: Scaling",
          description: "Take your success to the next level and achieve results that exceed your wildest expectations.",
          icon: "sparkles"
        },
        {
          id: generateId(),
          title: "Bonus: Resource Library",
          description: "Access our complete library of templates, worksheets, and tools to make implementation effortless.",
          icon: "cube"
        },
        {
          id: generateId(),
          title: "Bonus: Case Studies",
          description: "Study real-world examples from our most successful students and learn from their journey.",
          icon: "check"
        },
        {
          id: generateId(),
          title: "Bonus: Quick-Start Guide",
          description: "Get results fast with our condensed quick-start guide that shows you exactly where to begin.",
          icon: "clock"
        },
      ],
    },

    // 9. SECOND CTA
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Your Success Story Starts Today",
        subheading: "Don't wait another day to start achieving your goals",
        buttonText: "Join Now",
        buttonLink: "#pricing",
        buttonVariant: "cartoon",
        buttonBgColor: "#33c36a",
        buttonShadow: "md",
        buttonFontSize: 24,
        buttonBorderWidth: 4,
        backgroundColor: "#f2f3f2",
        textColor: "#111827",
        accentColor: "#2563eb",
        showHeading: true,
        showSubheading: true,
        showButton: true,
        showGridBackground: false,
        paddingTop: 28,
        paddingBottom: 14,
        elementStyles: {
          heading: {
            color: "#111827",
            fontSize: 35,
          },
          buttonText: {
            color: "#111827",
          },
          subheading: {
            color: "#111827",
            lineHeight: 2.8,
          },
        },
      },
    },

    // 10. TESTIMONIALS - Screenshot Gallery Style
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Our Students Say",
        subheading: "Join thousands of satisfied students who've transformed their lives",
        testimonialVariant: "screenshots",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
      },
      items: [
        {
          id: generateId(),
          title: "Life-Changing Results",
          description: "This program completely transformed my life. Within 90 days, I achieved goals I'd been working toward for years.",
          author: "Discord",
          role: "Community",
          rating: 5,
          imageUrl: "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/665643dd8c7ac752237b5cef_Discord-OG-1200x630.jpg",
          proofImages: ["https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/665643dd8c7ac752237b5cef_Discord-OG-1200x630.jpg"]
        },
        {
          id: generateId(),
          title: "Best Investment Ever",
          description: "I've tried other programs before, but nothing compares to this. The quality of the training exceeded all my expectations.",
          author: "Michael Chen",
          role: "Entrepreneur",
          rating: 5,
          imageUrl: "https://static01.nyt.com/images/2021/12/28/business/28discord3/28discord3-articleLarge.png?quality=75&auto=webp&disable=upscale",
          proofImages: ["https://static01.nyt.com/images/2021/12/28/business/28discord3/28discord3-articleLarge.png?quality=75&auto=webp&disable=upscale"]
        },
        {
          id: generateId(),
          title: "Finally Found Success",
          description: "After years of struggling and feeling stuck, I finally found the system that works. The clarity I've gained has been incredible.",
          author: "Emily Rodriguez",
          role: "Business Owner",
          rating: 5,
          imageUrl: "https://techcrunch.com/wp-content/uploads/2023/12/discord-app.jpg",
          proofImages: ["https://techcrunch.com/wp-content/uploads/2023/12/discord-app.jpg"]
        },
        {
          id: generateId(),
          title: "Community Proof",
          description: "",
          author: "DM",
          role: "Community",
          imageUrl: "https://i.ytimg.com/vi/ZBd8O52Ohvg/maxresdefault.jpg",
          proofImages: ["https://i.ytimg.com/vi/ZBd8O52Ohvg/maxresdefault.jpg"]
        },
      ],
    },

    // 11. FAQ - Objection Handling
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Frequently Asked Questions",
        subheading: "Got questions? We've got answers.",
        backgroundColor: "#ffffff",
        textColor: "#111827",
      },
      items: [
        {
          id: generateId(),
          title: "How long does it take to see results?",
          description: "Most students start seeing results within the first 30 days. However, we recommend committing to the full 90-day program to achieve the best possible outcomes."
        },
        {
          id: generateId(),
          title: "What if I don't have much time?",
          description: "The program is designed to work with your schedule. You can go at your own pace and access all the materials whenever it's convenient for you."
        },
        {
          id: generateId(),
          title: "Is this suitable for beginners?",
          description: "Absolutely! The program is designed for all levels, from complete beginners to advanced practitioners. We start with the fundamentals and progressively build up to more advanced strategies."
        },
        {
          id: generateId(),
          title: "What's your refund policy?",
          description: "We offer a 30-day money-back guarantee. If you're not completely satisfied with the program, simply contact us within 30 days for a full refund - no questions asked."
        },
        {
          id: generateId(),
          title: "How is this different from other programs?",
          description: "Unlike other programs that focus on theory, we provide a step-by-step, actionable system that's been proven to work by thousands of students. You'll get practical strategies you can implement immediately."
        },
        {
          id: generateId(),
          title: "Do I get lifetime access?",
          description: "Yes! Once you enroll, you have lifetime access to all the program materials, including all future updates and additions at no extra cost."
        },
      ],
    },

    // 12. FINAL CTA - Conversion Section
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Start Your Transformation Today",
        subheading: "Join thousands of successful students and achieve your goals in just 90 days. Backed by our 30-day money-back guarantee.",
        buttonText: "Enroll Now - Limited Time Offer",
        buttonLink: "#pricing",
        buttonVariant: "win98",
        buttonBgColor: "#111827",
        backgroundColor: "#f2f3f2",
        textColor: "#111827",
        accentColor: "#10b981",
        showHeading: true,
        showSubheading: true,
        showButton: true,
        showGridBackground: false,
        paddingTop: 31,
        paddingBottom: 16,
        elementStyles: {
          heading: {
            color: "#111827",
            fontSize: 33,
          },
          buttonText: {
            color: "#ffffff",
          },
          subheading: {
            color: "#111827",
          },
        },
      },
    },

    // 13. FOOTER
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "YourBrand",
        logoUrl: "",
        tagline: "Transform your life in 90 days with our proven system",
        backgroundColor: "#1f2937",
        textColor: "#f9fafb",
        showLogo: true,
        showTagline: true,
        showLinks: true,
        showSocial: true,
      },
      items: [
        { id: generateId(), label: "Privacy Policy", url: "#privacy" },
        { id: generateId(), label: "Terms of Service", url: "#terms" },
        { id: generateId(), label: "Contact", url: "#contact" },
      ],
    },
  ],
};
