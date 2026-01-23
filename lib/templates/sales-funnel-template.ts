import type { LandingPage } from "../page-schema";
import { generateId } from "../page-schema";

export const salesFunnelTemplate: LandingPage = {
  title: "Sales Funnel Template",
  description: "High-converting sales funnel with proven 12-section structure. Perfect for digital products, courses, and services.",
  colorScheme: {
    primary: "#8B6F7D",      // Dusty mauve (from reference PDF header)
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
  sections: [
    // 1. HEADER - Navigation
    {
      id: generateId(),
      type: "header",
      content: {
        headerVariant: "simple-header",
        headerPosition: "sticky",
        logoText: "YourBrand",
        logoUrl: "",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        buttonText: "Get Started",
        buttonLink: "#pricing",
        buttonVariant: "primary",
        showLogo: true,
        showLinks: true,
        showButton: true,
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
        subheading: "Join 5,000+ Entrepreneurs Who've 10x'd Their Revenue With This Step-By-Step Framework",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop",
        showImage: true,
        ctaText: "YES! I WANT TO GROW MY BUSINESS",
        ctaUrl: "#offer",
        ctaSecondaryText: "Only $297 - One-Time Payment",
        badge: "365-DAY MONEY-BACK GUARANTEE",
        badgeIcon: "checkmark",
        showBadge: true,
        backgroundColor: "#ffffff",
        textColor: "#111827",
        accentColor: "#10b981",
        paddingTop: 20,
        paddingBottom: 16,
      },
    },

    // 3. VALUE PROPOSITION - Long-form copy (NEW SECTION)
    {
      id: generateId(),
      type: "value-proposition",
      content: {
        heading: "Here's the Truth About Success",
        badge: "THE PROBLEM",
        showBadge: true,
        showHeading: true,
        bodyParagraphs: [
          "You've probably tried everything. The courses, the books, the webinars. You're motivated, you're willing to put in the work, but something just isn't clicking. You feel stuck, watching others succeed while you're still searching for that breakthrough.",
          "The problem isn't you. It's the system you've been following. Most programs focus on theory without giving you the practical, step-by-step roadmap you need to get results. They leave you confused, overwhelmed, and unsure of what to do next.",
          "What if there was a proven system that took you by the hand and showed you exactly what to do, step by step? A system that's already helped thousands of people just like you achieve their goals?",
          "That's exactly what we've created. No fluff, no theory, just actionable steps that get real results. Whether you're starting from zero or looking to take your success to the next level, this is the system you've been looking for."
        ],
        backgroundColor: "#f9fafb",
        textColor: "#111827",
        accentColor: "#8B6F7D",
      },
    },

    // 4. OFFER DETAILS - Image + Bullet List (NEW SECTION)
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

    // 5. SECONDARY CTA
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Ready to Get Started?",
        subheading: "Join thousands of successful students who are already seeing results",
        buttonText: "Enroll Now",
        buttonLink: "#pricing",
        buttonVariant: "primary",
        backgroundColor: "#8B6F7D",
        textColor: "#ffffff",
        accentColor: "#10b981",
        showHeading: true,
        showSubheading: true,
        showButton: true,
      },
    },

    // 6. COMPARISON - Without/With Columns
    {
      id: generateId(),
      type: "comparison",
      content: {
        heading: "Before vs. After",
        subheading: "See the transformation our students experience",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
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

    // 7. CREATOR/EXPERT - Photo + Bio (NEW SECTION)
    {
      id: generateId(),
      type: "creator",
      content: {
        heading: "Meet Your Instructor",
        creatorPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop",
        creatorPhotoAlt: "Instructor photo",
        creatorName: "John Smith",
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
      },
    },

    // 8. DETAILED FEATURES - Image + Comprehensive List (NEW SECTION)
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

    // 9. THIRD CTA
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Your Success Story Starts Today",
        subheading: "Don't wait another day to start achieving your goals",
        buttonText: "Join Now",
        buttonLink: "#pricing",
        buttonVariant: "primary",
        backgroundColor: "#10b981",
        textColor: "#ffffff",
        accentColor: "#2563eb",
        showHeading: true,
        showSubheading: true,
        showButton: true,
      },
    },

    // 10. RESULTS GALLERY - 6 images in grid
    {
      id: generateId(),
      type: "gallery",
      content: {
        heading: "Real Results from Real Students",
        subheading: "See the transformations our students have achieved",
        galleryVariant: "bento",
        backgroundColor: "#ffffff",
        textColor: "#111827",
      },
      items: [
        {
          id: generateId(),
          imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop",
          title: "Sarah's Journey",
          gridClass: "md:col-span-2 md:row-span-2"
        },
        {
          id: generateId(),
          imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
          title: "Mike's Success",
          gridClass: "md:col-span-1 md:row-span-1"
        },
        {
          id: generateId(),
          imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop",
          title: "Emma's Transformation",
          gridClass: "md:col-span-1 md:row-span-1"
        },
        {
          id: generateId(),
          imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990fbb4e?w=800&auto=format&fit=crop",
          title: "David's Achievement",
          gridClass: "md:col-span-1 md:row-span-1"
        },
        {
          id: generateId(),
          imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
          title: "Lisa's Results",
          gridClass: "md:col-span-1 md:row-span-1"
        },
      ],
    },

    // 11. WRITTEN TESTIMONIALS - 3 cards
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Our Students Say",
        subheading: "Join thousands of satisfied students who've transformed their lives",
        testimonialVariant: "twitter-cards",
        backgroundColor: "#f9fafb",
        textColor: "#111827",
      },
      items: [
        {
          id: generateId(),
          title: "Life-Changing Results",
          description: "This program completely transformed my life. Within 90 days, I achieved goals I'd been working toward for years. The step-by-step system made it so easy to stay on track and see real progress.",
          author: "Sarah Johnson",
          role: "Marketing Director",
          rating: 5,
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        {
          id: generateId(),
          title: "Best Investment Ever",
          description: "I've tried other programs before, but nothing compares to this. The quality of the training, the support from the community, and the results I've achieved have exceeded all my expectations. Absolutely worth every penny.",
          author: "Michael Chen",
          role: "Entrepreneur",
          rating: 5,
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
        },
        {
          id: generateId(),
          title: "Finally Found Success",
          description: "After years of struggling and feeling stuck, I finally found the system that works. The clarity and confidence I've gained have been incredible. I wish I'd found this program sooner!",
          author: "Emily Rodriguez",
          role: "Business Owner",
          rating: 5,
          imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
        },
      ],
    },

    // 12. FAQ - Objection Handling
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

    // 13. FINAL CTA - Conversion Section
    {
      id: generateId(),
      type: "cta",
      content: {
        ctaVariant: "centered",
        heading: "Start Your Transformation Today",
        subheading: "Join thousands of successful students and achieve your goals in just 90 days. Backed by our 30-day money-back guarantee.",
        buttonText: "Enroll Now - Limited Time Offer",
        buttonLink: "#pricing",
        buttonVariant: "primary",
        backgroundColor: "#8B6F7D",
        textColor: "#ffffff",
        accentColor: "#10b981",
        showHeading: true,
        showSubheading: true,
        showButton: true,
      },
    },

    // 14. FOOTER
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
