import { LandingPage, generateId } from "../page-schema";

// Whop Brand SVG Logos
const WHOP_LOGOS = {
  main: "https://framerusercontent.com/images/5PA67Dmrqg1otDCdWO8o1vmoqyQ.png",
  icon: "https://framerusercontent.com/images/78TaPrLzPNCx6uXVh8Qafpc2cdI.png?scale-down-to=512",
  full: "https://framerusercontent.com/images/HXoXiG1GWEOHDX264b7IO7hw.svg",
  wordmark: "https://framerusercontent.com/images/vHeTNlIP4TK1sJ933tBkk3Xlxvc.png",
  badge: "https://framerusercontent.com/images/IDljSoilER0NtjIwGXfzRnuJux8.png",
  symbol: "https://framerusercontent.com/images/kgnJLYdtOxgxShDUf4lL6BxxWs.svg",
};

// Whop Illustrations (from brand kit)
const WHOP_ILLUSTRATIONS = {
  graduation: "/illustrations/whop/graduation.svg",
  trophy: "/illustrations/whop/trophy.svg",
  lambo: "/illustrations/whop/lambo.svg",
  moneyStack: "/illustrations/whop/money-stack.svg",
  laptop: "/illustrations/whop/laptop.svg",
  gaming: "/illustrations/whop/gaming.svg",
  bullseye: "/illustrations/whop/bullseye.svg",
  coins: "/illustrations/whop/coins.svg",
  piggybank: "/illustrations/whop/piggybank.svg",
  rolex: "/illustrations/whop/rolex.svg",
  plane: "/illustrations/whop/plane.svg",
  telescope: "/illustrations/whop/telescope.svg",
  microphone: "/illustrations/whop/microphone.svg",
  messaging: "/illustrations/whop/messaging.svg",
  books: "/illustrations/whop/books.svg",
};

/**
 * Whop University Premium Funnel Template
 *
 * A world-class high-converting sales funnel with custom 3D animations,
 * Framer Motion effects, and research-backed conversion optimization.
 *
 * Features:
 * - Animated gradient mesh hero (Stripe-inspired)
 * - 3D tilt cards and parallax effects
 * - Magnetic CTA buttons with liquid effects
 * - SVG path animations for checkmarks
 * - Scroll-triggered reveals
 * - Count-up animations for stats
 * - Before/after comparison with color psychology
 * - Results gallery with lightbox
 */
export const whopUniversityTemplate: LandingPage = {
  title: "Whop University",
  description: "Premium high-converting course sales funnel",
  sections: [
    // Section 1: Header (Keep standard for navigation)
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "WHOP UNIVERSITY",
        backgroundColor: "transparent",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
        headerVariant: "floating-header",
        headerBackgroundOpacity: 80,
        links: [
          { label: "What's Included", url: "#features" },
          { label: "Results", url: "#testimonials" },
          { label: "Enroll", url: "#offer" },
        ],
        buttonText: "Enroll Now",
        buttonLink: "#offer",
      },
      items: [],
    },

    // Section 2: Hero with Gradient Mesh
    {
      id: generateId(),
      type: "whop-hero",
      content: {
        badge: "EXCLUSIVE PROGRAM",
        heading: "Master the Art of Building",
        accentHeading: "Profitable Digital Products",
        accentColor: "#FA4616",
        subheading:
          "Learn the exact system that's generated over $10M in revenue. Join 15,000+ students who've transformed their online business with proven strategies, step-by-step training, and expert mentorship.",
        buttonText: "Start Learning Today",
        buttonLink: "#offer",
        secondaryButtonText: "Watch Free Preview",
        secondaryButtonLink: "#video",
        creatorName: "Creator Name",
        creatorRole: "Founder, Whop University",
        creatorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
      },
      items: [],
    },

    // Section 3: Value Proposition Story
    {
      id: generateId(),
      type: "whop-value-prop",
      content: {
        badge: "THE JOURNEY",
        heading: "We've Been Where You Are",
        body: `You've watched countless YouTube videos, bought courses that promised results, and still feel stuck at the same income level.

The truth is, **most courses teach theory**. They give you information but not a system. ==Information without implementation is useless.==

After building multiple 7-figure businesses from scratch, we realized the missing piece wasn't more content. **It was a proven framework with expert guidance.**

That's exactly why we created Whop University—to give you everything we wish we had when starting out.`,
        pullQuote: "Information without implementation is useless.",
        painPoints: [
          "Spending hours on tactics that don't move the needle",
          "Watching others succeed while you stay stuck",
          "Buying course after course with no real results",
          "Feeling overwhelmed with too much conflicting advice",
        ],
        solutionTeaser: "There's a better way. And 15,000+ students have already discovered it.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [],
    },

    // Section 4: Offer Bento Grid (What's Included)
    {
      id: generateId(),
      type: "whop-offer",
      content: {
        badge: "WHAT'S INCLUDED",
        heading: "Everything You Need to Succeed",
        subheading: "Over 100+ hours of premium content designed to accelerate your success",
        features: [
          "Lifetime access to all content",
          "All future updates included",
          "30-day money-back guarantee",
        ],
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          title: "Core Curriculum",
          description:
            "50+ video modules covering product creation, marketing, sales, and scaling. From zero to launch in weeks, not months.",
          icon: "📚",
          imageUrl: WHOP_ILLUSTRATIONS.books,
        },
        {
          id: generateId(),
          title: "Private Community",
          description: "24/7 access to our exclusive Discord with channels for feedback, wins, and networking.",
          icon: "💬",
          imageUrl: WHOP_ILLUSTRATIONS.messaging,
        },
        {
          id: generateId(),
          title: "Weekly Live Calls",
          description: "Q&A sessions, hot seat coaching, and strategy breakdowns every week.",
          icon: "🎥",
          imageUrl: WHOP_ILLUSTRATIONS.microphone,
        },
        {
          id: generateId(),
          title: "Templates & Resources",
          description: "Done-for-you templates, scripts, SOPs, and swipe files to fast-track your progress.",
          icon: "📋",
          imageUrl: WHOP_ILLUSTRATIONS.laptop,
        },
        {
          id: generateId(),
          title: "1-on-1 Mentorship",
          description: "Direct access to successful creators who've already achieved what you want.",
          icon: "🎯",
          imageUrl: WHOP_ILLUSTRATIONS.bullseye,
        },
      ],
    },

    // Section 5: Floating CTA Band (First)
    {
      id: generateId(),
      type: "whop-cta",
      content: {
        heading: "Ready to Transform Your Online Business?",
        subheading: "Join 15,000+ students who've already started their journey",
        buttonText: "Enroll Now",
        buttonLink: "#offer",
        trustText: "30-day money-back guarantee • Instant access",
        backgroundColor: "#FA4616",
        textColor: "#FFFFFF",
      },
      items: [],
    },

    // Section 6: Comparison with Glow Effects
    {
      id: generateId(),
      type: "whop-comparison",
      content: {
        badge: "THE DIFFERENCE",
        heading: "Why Students Choose Whop University",
        subheading: "See how we stack up against trying to figure it out alone",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          title: "Going It Alone",
          features: [
            "Months of trial and error",
            "No guidance on what's working",
            "Isolated with no accountability",
            "Building everything from scratch",
            "No one to answer questions",
            "Miss trends and new strategies",
          ],
        },
        {
          id: generateId(),
          title: "With Whop University",
          features: [
            "Launch in weeks with proven blueprint",
            "Expert feedback on every step",
            "15,000+ student support network",
            "Templates & resources save 100+ hours",
            "Weekly live coaching calls",
            "Lifetime access + future updates",
          ],
        },
      ],
    },

    // Section 7: Creator Spotlight
    {
      id: generateId(),
      type: "whop-creator",
      content: {
        badge: "YOUR INSTRUCTOR",
        heading: "Learn From Someone Who's Done It",
        subheading:
          "Built multiple 7-figure digital businesses and helped 15,000+ students do the same",
        credentials: [
          "$10M+ Revenue",
          "15,000+ Students",
          "Forbes 30 Under 30",
          "YC Alumni",
        ],
        credentialBadge: "Verified Creator",
        stats: [
          { value: 15000, suffix: "+", label: "Students" },
          { value: 10, prefix: "$", suffix: "M+", label: "Revenue" },
          { value: 50, suffix: "+", label: "Hours Content" },
        ],
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          title: "Creator Name",
          role: "Founder, Whop University",
          description:
            "After generating over $10M in online revenue, I created Whop University to share the exact strategies that work. No fluff, no theory—just actionable systems that get results. My students have collectively generated over $50M in revenue.",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
        },
      ],
    },

    // Section 8: Curriculum Accordion
    {
      id: generateId(),
      type: "whop-curriculum",
      content: {
        badge: "CURRICULUM",
        heading: "What's Inside the Program",
        subheading: "A complete roadmap from idea to 6-figure business",
        imageUrl: WHOP_ILLUSTRATIONS.graduation,
        highlights: ["100+ Hours", "6 Modules", "Templates Included"],
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          title: "Module 1: Foundation",
          description: "Find your profitable niche, validate your idea, and position yourself as the go-to expert.",
          duration: "12 lessons • 3 hours",
          icon: "💡",
          lessons: [
            "Finding your profitable niche",
            "Validating your idea with real customers",
            "Positioning yourself as an authority",
            "Building your personal brand",
          ],
        },
        {
          id: generateId(),
          title: "Module 2: Product Creation",
          description: "Build a product people actually want to buy. Pricing, packaging, and delivery systems.",
          duration: "15 lessons • 4 hours",
          icon: "📦",
          lessons: [
            "Structuring your offer for maximum value",
            "Pricing strategies that convert",
            "Creating compelling course content",
            "Setting up your delivery platform",
          ],
        },
        {
          id: generateId(),
          title: "Module 3: Audience Building",
          description: "Grow your following with content that attracts your ideal customers on any platform.",
          duration: "18 lessons • 5 hours",
          icon: "📈",
          lessons: [
            "Content strategy that builds authority",
            "Growing on Twitter, YouTube, and TikTok",
            "Email list building techniques",
            "Creating viral content consistently",
          ],
        },
        {
          id: generateId(),
          title: "Module 4: Sales & Marketing",
          description: "Convert followers into customers with proven funnels, email sequences, and launch strategies.",
          duration: "20 lessons • 6 hours",
          icon: "💰",
          lessons: [
            "High-converting sales page frameworks",
            "Email sequences that sell",
            "Launch strategies for maximum revenue",
            "Webinar and workshop templates",
          ],
        },
        {
          id: generateId(),
          title: "Module 5: Scaling & Systems",
          description: "Automate your business, hire your first team member, and scale to 6 figures and beyond.",
          duration: "14 lessons • 4 hours",
          icon: "🚀",
          lessons: [
            "Automation workflows that save time",
            "Hiring and managing a team",
            "Building recurring revenue streams",
            "Scaling past 6-figures",
          ],
        },
        {
          id: generateId(),
          title: "Module 6: Advanced Strategies",
          description: "Partnerships, affiliates, paid ads, and advanced tactics used by 7-figure creators.",
          duration: "16 lessons • 4 hours",
          icon: "⚡",
          lessons: [
            "Strategic partnerships and JVs",
            "Building an affiliate program",
            "Paid advertising fundamentals",
            "Advanced scaling tactics",
          ],
        },
      ],
    },

    // Section 9: Floating CTA Band (Second)
    {
      id: generateId(),
      type: "whop-cta",
      content: {
        heading: "Join 15,000+ Students Already Inside",
        subheading: "The average student sees results within their first 30 days",
        buttonText: "Get Started Now",
        buttonLink: "#offer",
        creatorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        creatorName: "Creator Name",
        trustText: "Start transforming your business today",
        backgroundColor: "#E03D10",
        textColor: "#FFFFFF",
      },
      items: [],
    },

    // Section 10: Results Gallery (Image Testimonials)
    {
      id: generateId(),
      type: "whop-results",
      content: {
        badge: "REAL RESULTS",
        heading: "Student Success Stories",
        subheading: "Screenshots from our community—real students, real results",
        summary: "These are just a few of the thousands of success stories from our community.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#E03D10",
      },
      items: [
        {
          id: generateId(),
          title: "First $10K Month",
          result: "$10,847 Revenue",
          imageUrl: WHOP_ILLUSTRATIONS.moneyStack,
          description: "Revenue screenshot from student dashboard after 30 days in the program",
        },
        {
          id: generateId(),
          title: "500+ Customers",
          result: "523 Sales",
          imageUrl: WHOP_ILLUSTRATIONS.coins,
          description: "Customer growth chart showing consistent growth",
        },
        {
          id: generateId(),
          title: "Quit My 9-5",
          result: "Full-Time Creator",
          imageUrl: WHOP_ILLUSTRATIONS.plane,
          description: "Student celebration post after going full-time",
        },
        {
          id: generateId(),
          title: "$50K Month",
          result: "$52,340 Revenue",
          imageUrl: WHOP_ILLUSTRATIONS.piggybank,
          description: "High-ticket launch revenue proof",
        },
        {
          id: generateId(),
          title: "1000 Sales Milestone",
          result: "1,000+ Customers",
          imageUrl: WHOP_ILLUSTRATIONS.trophy,
          description: "Sales milestone screenshot celebration",
        },
        {
          id: generateId(),
          title: "6-Figure Year",
          result: "$127K Annual",
          imageUrl: WHOP_ILLUSTRATIONS.lambo,
          description: "Annual revenue proof from year one in the program",
        },
      ],
    },

    // Section 11: Testimonial Cards 3D
    {
      id: generateId(),
      type: "whop-testimonials",
      content: {
        badge: "TESTIMONIALS",
        heading: "What Students Are Saying",
        subheading: "Don't just take our word for it",
        trustSummary: "Join 15,000+ students who've transformed their business",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          name: "Alex Chen",
          role: "Course Creator",
          quote:
            "I was stuck at $2K/month for a year. After Whop University, I hit $15K in month two. The framework actually works.",
          result: "$15K in Month 2",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        },
        {
          id: generateId(),
          name: "Sarah Mitchell",
          role: "Digital Product Creator",
          quote:
            "The templates alone saved me months of work. Launched my product in 3 weeks and made back my investment on day one.",
          result: "ROI in 24 Hours",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        },
        {
          id: generateId(),
          name: "Marcus Johnson",
          role: "Agency Owner",
          quote:
            "The Discord community is the real secret weapon. Got feedback that 10x'd my landing page conversions.",
          result: "10x Conversions",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        },
        {
          id: generateId(),
          name: "Jennifer Lee",
          role: "Content Creator",
          quote:
            "Went from side hustle to full-time creator in 90 days. The roadmap made it clear exactly what to do next.",
          result: "Full-Time in 90 Days",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        },
        {
          id: generateId(),
          name: "David Rodriguez",
          role: "Membership Site Owner",
          quote:
            "Tried 5 other courses before this. Whop University is the only one with a real system and actual support.",
          result: "Finally Found Success",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        },
        {
          id: generateId(),
          name: "Emily Park",
          role: "SaaS Founder",
          quote:
            "From $0 to $8.5K MRR in 60 days. The live calls are worth the entire investment.",
          result: "$8.5K MRR",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
        },
      ],
    },

    // Section 12: Final Conversion
    {
      id: generateId(),
      type: "whop-final-cta",
      content: {
        badge: "LIMITED TIME OFFER",
        heading: "Ready to Transform?",
        subheading:
          "Get instant access to everything you need to build a profitable online business. Start your journey today.",
        originalPrice: "1497",
        price: "997",
        pricePeriod: "one-time",
        buttonText: "Get Instant Access",
        buttonLink: "#",
        socialProof: "Join 15,000+ students • Rated 4.9/5 • 30-day guarantee",
        creatorName: "Creator Name",
        creatorRole: "Founder, Whop University",
        creatorImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
      },
      items: [
        {
          id: generateId(),
          icon: "🔒",
          label: "Secure Checkout",
        },
        {
          id: generateId(),
          icon: "💯",
          label: "30-Day Guarantee",
        },
        {
          id: generateId(),
          icon: "⚡",
          label: "Instant Access",
        },
      ],
    },

    // Section 13: Footer (Keep standard)
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "WHOP UNIVERSITY",
        tagline: "Build. Launch. Scale.",
        backgroundColor: "#141212",
        textColor: "#FCF6F5",
        accentColor: "#FA4616",
        links: [
          { label: "Contact", url: "#" },
          { label: "Privacy Policy", url: "#" },
          { label: "Terms of Service", url: "#" },
          { label: "Refund Policy", url: "#" },
        ],
        bodyText: "© 2026 Whop University. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#FA4616", // Whop Orange (primary brand)
    secondary: "#FF6B3D", // Whop Orange Light (hover states)
    accent: "#FA4616", // Whop Orange (CTAs)
    background: "#141212", // Whop Dark
    text: "#FCF6F5", // Whop Cream
  },
  typography: {
    headingFont: "Acid Grotesk",
    bodyFont: "Inter",
  },
  animationPreset: "dramatic",
  smoothScroll: true,
  designCanvasWidth: 896,
};
