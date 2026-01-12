import { LandingPage, generateId } from "../page-schema";

/**
 * Skinny-landing inspired template
 * Dark theme with lime accent, Anton headings, full animations
 * Complete with all 11 section types
 */
export const skinnyTemplate: LandingPage = {
  title: "Your Product Name",
  description: "Your product description for SEO",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "YOUR BRAND",
        backgroundColor: "transparent",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
        links: [
          { label: "Features", url: "#features" },
          { label: "Pricing", url: "#pricing" },
          { label: "About", url: "#about" },
        ],
        buttonText: "Get Started",
        buttonLink: "#pricing",
      },
      items: [],
    },

    // Hero Section
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "For Creators & Agencies",
        heading: "Transform Your Business",
        accentHeading: "With AI Technology",
        accentColor: "#D6FC51",
        subheading:
          "We combine decades of industry expertise with cutting-edge AI tools to help you succeed in the modern market.",
        buttonText: "Get Started",
        buttonLink: "#pricing",
        videoUrl: "",
        brands: [
          "ACME",
          "GLOBEX",
          "INITECH",
          "UMBRELLA",
          "STARK",
          "WAYNE",
          "OSCORP",
          "LEXCORP",
        ],
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
      },
      items: [],
    },

    // Founders Section
    {
      id: generateId(),
      type: "founders",
      content: {
        heading: "Meet the Team",
        subheading: "The People Behind the Product",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      },
      items: [
        {
          id: generateId(),
          title: "Alex Johnson",
          label: "30+ Years Experience",
          role: "Co-Founder & CEO",
          bio: "Industry veteran with decades of experience building successful products and teams. Previously led growth at multiple unicorn startups.",
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
          linkedinUrl: "#",
        },
        {
          id: generateId(),
          title: "Sarah Chen",
          label: "AI Pioneer",
          role: "Co-Founder & CTO",
          bio: "Leading expert in AI and machine learning applications. Former research lead at top tech companies, with dozens of patents to her name.",
          imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
          linkedinUrl: "#",
        },
      ],
    },

    // Credibility Section
    {
      id: generateId(),
      type: "credibility",
      content: {
        heading: "We've Been Where You Are",
        subheading: "Years of experience, now available to you",
        bodyText:
          "We've built businesses, made mistakes, and learned what actually works. Now we're sharing everything we know so you don't have to figure it out alone.",
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
        overlayOpacity: 0.75,
        buttonText: "Join Us",
        buttonLink: "#pricing",
        priceYearly: "$299/year",
        priceMonthly: "$25/month",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      },
      items: [],
    },

    // Features Section (Bento Grid)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Everything You Need",
        subheading: "What's Inside",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        layout: "grid",
        accentColor: "#D6FC51",
      },
      items: [
        {
          id: generateId(),
          title: "AI TOOLS SUITE",
          description:
            "Powerful workflows engineered into easy-to-use tools. Access every leading generative AI model in one place.",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "DAILY UPDATES",
          description:
            "Stay ahead with daily insights on AI developments, new models, and industry news that matters.",
          imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "RESOURCE LIBRARY",
          description: "Deep-dive guides and tutorials for every skill level.",
          imageUrl: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "EXPERT CONSULTING",
          description:
            "Direct sessions with industry veterans. Decades of experience applied to your work.",
          imageUrl: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
        {
          id: generateId(),
          title: "BUSINESS PLAYBOOK",
          description:
            "Learn to find clients, pitch services, and turn skills into sustainable income.",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "COMMUNITY ACCESS",
          description:
            "Connect with creators shipping real work. Share wins, get feedback, find collaborators.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
      ],
    },

    // Offer Section
    {
      id: generateId(),
      type: "offer",
      content: {
        badge: "Your Price Today",
        heading: "One Payment. Full Access.",
        subheading:
          "No subscriptions. No hidden fees. Just everything you need to succeed.",
        priceYearly: "$299/year",
        priceMonthly: "$25/month",
        buttonText: "Get Access Now",
        buttonLink: "#",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      },
      items: [
        {
          id: generateId(),
          title: "Your Product",
          price: "$299",
          description: "One investment. Unlimited potential.",
          features: [
            "Full AI Tools Suite access",
            "Daily industry intelligence",
            "Complete resource library",
            "Monthly expert consulting sessions",
            "Business development playbook",
            "Private creator community",
          ],
        },
      ],
    },

    // Testimonials Section
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Our Members Say",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        scrollSpeed: 30,
      },
      items: [
        {
          id: generateId(),
          title: "Game changer for my business",
          description:
            "The AI tools alone are worth 10x the price. I've completely transformed how I work with clients.",
          author: "Sarah K.",
          role: "Freelance Designer",
        },
        {
          id: generateId(),
          title: "Finally, something that delivers",
          description:
            "No fluff, just real tools and strategies that work. The consulting sessions are incredible.",
          author: "Mike R.",
          role: "Agency Owner",
        },
        {
          id: generateId(),
          title: "Worth every penny",
          description:
            "I've tried dozens of courses and communities. This is the only one that actually helped me land clients.",
          author: "Jessica L.",
          role: "Content Creator",
        },
        {
          id: generateId(),
          title: "The community is amazing",
          description:
            "Surrounded by people actually doing the work. The feedback and connections have been invaluable.",
          author: "David T.",
          role: "Marketing Consultant",
        },
        {
          id: generateId(),
          title: "Exceeded all expectations",
          description:
            "I was skeptical at first, but the daily updates and tools have become essential to my workflow.",
          author: "Emily W.",
          role: "Startup Founder",
        },
        {
          id: generateId(),
          title: "Best investment I've made",
          description:
            "The playbook helped me close my first $10k client within two weeks of joining.",
          author: "Chris P.",
          role: "Freelancer",
        },
        {
          id: generateId(),
          title: "Truly premium quality",
          description:
            "The level of detail and care in everything they do shows. This isn't just another membership.",
          author: "Anna M.",
          role: "Creative Director",
        },
        {
          id: generateId(),
          title: "Changed my perspective",
          description:
            "I learned more in the first month than in years of trying to figure it out on my own.",
          author: "James H.",
          role: "Brand Strategist",
        },
        {
          id: generateId(),
          title: "Highly recommend",
          description:
            "If you're serious about building with AI, this is where you need to be. Period.",
          author: "Lisa N.",
          role: "Digital Creator",
        },
      ],
    },

    // Audience Section
    {
      id: generateId(),
      type: "audience",
      content: {
        heading: "Is This For You?",
        forHeading: "This Is For You If...",
        notForHeading: "This Is NOT For You If...",
        forItems: [
          "You're ready to put in the work and build something real",
          "You want to leverage AI to grow your business or career",
          "You're open to learning new skills and strategies",
          "You value community, collaboration, and feedback",
          "You're willing to invest in yourself and your future",
        ],
        notForItems: [
          "You're looking for get-rich-quick schemes or shortcuts",
          "You're not willing to invest time in learning",
          "You expect results without putting in effort",
          "You want someone else to do all the work for you",
          "You're not open to feedback or new ideas",
        ],
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
      },
      items: [],
    },

    // Final CTA Section
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "The Future Belongs To Those Who Create It.",
        subheading: "Join the creators who aren't waiting for permission.",
        buttonText: "Get Started",
        buttonLink: "#pricing",
        bodyText: "questions@yourbrand.com",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
        ctaVariant: "centered",
        headingStyle: "gradient",
      },
      items: [],
    },

    // Footer Section
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "YOUR BRAND",
        tagline: "BUILD. CREATE. SUCCEED.",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        accentColor: "#D6FC51",
        links: [
          { label: "Twitter", url: "#" },
          { label: "Contact", url: "#" },
          { label: "Privacy", url: "#" },
          { label: "Terms", url: "#" },
        ],
        bodyText: "© 2024 Your Brand. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#D6FC51",
    secondary: "#B8FF00",
    accent: "#D6FC51",
    background: "#0a0a0a",
    text: "#ffffff",
  },
  typography: {
    headingFont: "Anton",
    bodyFont: "Inter",
  },
  animationPreset: "moderate",
  smoothScroll: true,
};
