import { LandingPage, generateId } from "../page-schema";

/**
 * Agency Funnel Template
 * Black/Gold color scheme for luxury and premium positioning
 * PAS copywriting formula (Problem, Agitate, Solution)
 * 9-section high-converting funnel structure
 */
export const agencyTemplate: LandingPage = {
  title: "Your Agency",
  description: "Premium services for ambitious brands",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "ELEVATE",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        accentColor: "#D97706",
        links: [
          { label: "Services", url: "#features" },
          { label: "Results", url: "#stats" },
          { label: "Process", url: "#process" },
        ],
        buttonText: "Book Strategy Call",
        buttonLink: "#cta",
      },
      items: [],
    },

    // Hero Section (PROBLEM)
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "⚡ Elite Agency Partners",
        heading: "Your Brand Deserves",
        accentHeading: "More Than Generic Results",
        accentColor: "#D97706",
        subheading:
          "You've tried the templated solutions. The cookie-cutter strategies. The agencies that promise everything and deliver nothing. It's time for something different—a partner who treats your brand like their own.",
        buttonText: "Book My Free Strategy Call",
        buttonLink: "#cta",
        videoUrl: "",
        brands: [],
        backgroundColor: "#111827",
        textColor: "#ffffff",
      },
      items: [],
    },

    // Stats Section (AGITATE - Show what's possible)
    {
      id: generateId(),
      type: "stats",
      content: {
        heading: "While Your Competitors Scale, You're Stuck",
        subheading: "Every month you wait costs you market share",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#D97706",
        statsVariant: "minimal",
      },
      items: [
        {
          id: generateId(),
          title: "$2.4M+",
          description: "Revenue Generated for Clients",
        },
        {
          id: generateId(),
          title: "340%",
          description: "Average Conversion Increase",
        },
        {
          id: generateId(),
          title: "12+",
          description: "Years of Experience",
        },
        {
          id: generateId(),
          title: "150+",
          description: "Successful Projects",
        },
      ],
    },

    // Logo Cloud (Social Proof)
    {
      id: generateId(),
      type: "logoCloud",
      content: {
        heading: "Trusted by Premium Brands",
        subheading: "We've partnered with industry leaders across every sector",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        accentColor: "#D97706",
      },
      items: [
        { id: generateId(), title: "LuxBrand", imageUrl: "" },
        { id: generateId(), title: "Premier Co", imageUrl: "" },
        { id: generateId(), title: "Elite Inc", imageUrl: "" },
        { id: generateId(), title: "Apex Group", imageUrl: "" },
        { id: generateId(), title: "Pinnacle", imageUrl: "" },
        { id: generateId(), title: "Summit", imageUrl: "" },
      ],
    },

    // Process Section (SOLUTION - How we work)
    {
      id: generateId(),
      type: "process",
      content: {
        heading: "Our Proven 3-Step Process",
        subheading: "From strategy to execution, we handle everything",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#D97706",
      },
      items: [
        {
          id: generateId(),
          title: "Discovery & Strategy",
          description: "We deep-dive into your business, market, and goals to create a custom roadmap for success.",
          icon: "search",
        },
        {
          id: generateId(),
          title: "Design & Build",
          description: "Our elite team crafts premium solutions that position you above the competition.",
          icon: "paintbrush",
        },
        {
          id: generateId(),
          title: "Launch & Scale",
          description: "We execute, optimize, and scale—delivering measurable results month after month.",
          icon: "rocket",
        },
      ],
    },

    // Features Section (Services)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Premium Services, Premium Results",
        subheading: "Our Services",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        layout: "grid",
        accentColor: "#D97706",
      },
      items: [
        {
          id: generateId(),
          title: "Brand Strategy & Identity",
          description:
            "Comprehensive brand positioning, visual identity, and messaging that commands attention and premium pricing.",
          imageUrl: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "Web Design & Development",
          description:
            "Conversion-focused websites that look stunning and drive serious business results.",
          imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "Growth Marketing",
          description: "Data-driven campaigns that scale your revenue predictably and profitably.",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "Creative Direction",
          description:
            "End-to-end creative that elevates your brand across every touchpoint.",
          imageUrl: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
      ],
    },

    // Testimonials Section
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "Results Our Clients Rave About",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        scrollSpeed: 30,
      },
      items: [
        {
          id: generateId(),
          title: "Redesign increased conversions 340%",
          description:
            "Elevate transformed our brand and website. Within 90 days, our conversion rate tripled and we've never looked back.",
          author: "Victoria Sterling",
          role: "CEO, LuxBrand",
        },
        {
          id: generateId(),
          title: "Finally found the right partner",
          description:
            "After working with 4 agencies that overpromised and underdelivered, Elevate actually exceeded expectations.",
          author: "Marcus Webb",
          role: "Founder, Premier Co",
        },
        {
          id: generateId(),
          title: "$1.2M in new revenue",
          description:
            "Their growth strategy generated over $1.2 million in new business within the first year. Worth every penny.",
          author: "Alexandra Hayes",
          role: "CMO, Elite Inc",
        },
        {
          id: generateId(),
          title: "Premium results, premium team",
          description:
            "The attention to detail and strategic thinking is unmatched. They treat our brand like it's their own.",
          author: "Jonathan Pierce",
          role: "Director, Apex Group",
        },
        {
          id: generateId(),
          title: "Complete brand transformation",
          description:
            "From commodity to premium in 6 months. We've raised our prices 40% and demand has never been higher.",
          author: "Sophia Laurent",
          role: "Founder, Pinnacle",
        },
        {
          id: generateId(),
          title: "ROI that speaks for itself",
          description:
            "5x return on our investment within 120 days. The strategy was clear, execution was flawless.",
          author: "David Chen",
          role: "CEO, Summit",
        },
      ],
    },

    // FAQ Section
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Common Questions",
        subheading: "Everything you need to know about working with us",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        accentColor: "#D97706",
      },
      items: [
        {
          id: generateId(),
          title: "What's your process like?",
          description:
            "Every engagement starts with a discovery call to understand your goals, followed by a strategic deep-dive. From there, we create a custom roadmap and execute with precision—keeping you informed every step of the way.",
        },
        {
          id: generateId(),
          title: "How long do projects typically take?",
          description:
            "Most brand and web projects take 6-12 weeks from start to finish. Growth marketing engagements are ongoing partnerships with monthly deliverables and optimization.",
        },
        {
          id: generateId(),
          title: "What's your pricing structure?",
          description:
            "We offer project-based pricing for brand and web work, and monthly retainers for growth marketing. After our discovery call, we'll provide a detailed proposal tailored to your needs and budget.",
        },
        {
          id: generateId(),
          title: "Do you offer revisions?",
          description:
            "Yes. All projects include multiple revision rounds to ensure we nail the execution. We're not satisfied until you're thrilled with the results.",
        },
        {
          id: generateId(),
          title: "What industries do you specialize in?",
          description:
            "We work best with premium brands, ambitious startups, and established companies ready to level up. Our sweet spot is businesses doing $1M+ in revenue looking to scale.",
        },
        {
          id: generateId(),
          title: "How do we get started?",
          description:
            "Book a free strategy call using the button below. We'll discuss your goals, assess fit, and map out a path to success—no obligations, no pressure.",
        },
      ],
    },

    // Final CTA Section
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Ready to Elevate Your Brand?",
        subheading:
          "Stop settling for mediocre results. Book a free strategy call and discover how we can transform your business—just like we've done for 150+ premium brands.",
        buttonText: "Book My Free Strategy Call",
        buttonLink: "#",
        bodyText: "✓ 100% Free Consultation  ✓ Custom Strategy Session  ✓ No Obligations",
        backgroundColor: "#D97706",
        textColor: "#111827",
        accentColor: "#111827",
        ctaVariant: "split",
        headingStyle: "solid",
      },
      items: [],
    },

    // Footer Section
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "ELEVATE",
        tagline: "PREMIUM BRANDS. PREMIUM RESULTS.",
        backgroundColor: "#111827",
        textColor: "#ffffff",
        accentColor: "#D97706",
        links: [
          { label: "LinkedIn", url: "#" },
          { label: "Instagram", url: "#" },
          { label: "Privacy", url: "#" },
          { label: "Terms", url: "#" },
        ],
        bodyText: "© 2024 Elevate Agency. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#D97706",
    secondary: "#b45309",
    accent: "#D97706",
    background: "#111827",
    text: "#ffffff",
  },
  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Inter",
  },
  animationPreset: "dramatic",
  smoothScroll: true,
};
