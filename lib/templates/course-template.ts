import { LandingPage, generateId } from "../page-schema";

/**
 * Course Funnel Template
 * Green/Navy color scheme for growth and trust
 * Before-After-Bridge copywriting formula
 * 9-section high-converting funnel structure
 */
export const courseTemplate: LandingPage = {
  title: "Your Online Course",
  description: "Transform your skills and achieve your goals",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "SKILLFORGE",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#10B981",
        links: [
          { label: "Curriculum", url: "#features" },
          { label: "Results", url: "#testimonials" },
          { label: "FAQ", url: "#faq" },
        ],
        buttonText: "Enroll Now",
        buttonLink: "#pricing",
      },
      items: [],
    },

    // Hero Section (BEFORE - Paint the pain)
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "🎓 12,000+ Students Enrolled",
        heading: "From Struggling Beginner to",
        accentHeading: "Six-Figure Expert in 90 Days",
        accentColor: "#10B981",
        subheading:
          "You're smart. You're capable. But you're stuck—watching others succeed while you spin your wheels. This proven system has helped 12,000+ students go from zero to earning $5K-$25K/month. Your transformation starts today.",
        buttonText: "Join the Program",
        buttonLink: "#pricing",
        videoUrl: "",
        brands: [],
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      items: [],
    },

    // Stats Section (AFTER - Show transformation)
    {
      id: generateId(),
      type: "stats",
      content: {
        heading: "Real Students. Real Results.",
        subheading: "Our students are building businesses and changing their lives",
        backgroundColor: "#10B981",
        textColor: "#ffffff",
        accentColor: "#1E40AF",
        statsVariant: "circles",
      },
      items: [
        {
          id: generateId(),
          title: "12,000+",
          description: "Students Enrolled",
        },
        {
          id: generateId(),
          title: "94%",
          description: "Success Rate",
        },
        {
          id: generateId(),
          title: "$8.5K",
          description: "Avg. Monthly Earnings",
        },
        {
          id: generateId(),
          title: "60",
          description: "Day Money-Back Guarantee",
        },
      ],
    },

    // Process Section (BRIDGE - The path forward)
    {
      id: generateId(),
      type: "process",
      content: {
        heading: "Your Path to Mastery",
        subheading: "A proven 3-phase system that works",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#1E40AF",
      },
      items: [
        {
          id: generateId(),
          title: "Learn the Fundamentals",
          description: "Master the core skills with bite-sized video lessons, exercises, and real-world projects.",
          icon: "book-open",
        },
        {
          id: generateId(),
          title: "Apply & Build",
          description: "Put your skills into practice with guided projects and personalized feedback from experts.",
          icon: "hammer",
        },
        {
          id: generateId(),
          title: "Launch & Earn",
          description: "Use our proven templates and strategies to land your first clients and scale your income.",
          icon: "rocket",
        },
      ],
    },

    // Features Section (Curriculum)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Everything You Need to Succeed",
        subheading: "Complete Curriculum",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        layout: "grid",
        accentColor: "#10B981",
      },
      items: [
        {
          id: generateId(),
          title: "50+ Video Lessons",
          description:
            "Comprehensive training covering everything from foundations to advanced strategies. Learn at your own pace, rewatch anytime.",
          imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "Private Community",
          description:
            "Connect with 12,000+ students, share wins, get feedback, and find accountability partners.",
          imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "Weekly Live Coaching",
          description: "Get your questions answered in real-time with weekly Q&A sessions.",
          imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "Templates & Resources",
          description:
            "Done-for-you templates, scripts, and tools to fast-track your success.",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
      ],
    },

    // Testimonials Section (Social proof - specific results)
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "Student Success Stories",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        scrollSpeed: 30,
      },
      items: [
        {
          id: generateId(),
          title: "From $0 to $8.5K in 60 days",
          description:
            "I was completely lost before SkillForge. Within 60 days of completing the program, I landed my first 3 clients and hit $8.5K in monthly revenue.",
          author: "Sarah Mitchell",
          role: "Freelance Designer",
        },
        {
          id: generateId(),
          title: "Quit my 9-5 in 90 days",
          description:
            "The step-by-step system actually works. I followed it exactly and replaced my $75K salary within 90 days. Life-changing.",
          author: "Marcus Thompson",
          role: "Marketing Consultant",
        },
        {
          id: generateId(),
          title: "Best investment I ever made",
          description:
            "Skeptical at first, but the community and coaching made all the difference. Now earning $15K/month consistently.",
          author: "Jennifer Lee",
          role: "Course Creator",
        },
        {
          id: generateId(),
          title: "Finally found what works",
          description:
            "I'd tried 5 other courses before this. SkillForge was the only one with a clear path and actual support.",
          author: "David Rodriguez",
          role: "Business Coach",
        },
        {
          id: generateId(),
          title: "Exceeded all expectations",
          description:
            "Went from complete beginner to earning $6K in my first month. The templates alone are worth 10x the price.",
          author: "Emma Wilson",
          role: "Virtual Assistant",
        },
        {
          id: generateId(),
          title: "Community is incredible",
          description:
            "The support from other students pushed me to keep going. Now I'm helping others do the same.",
          author: "Chris Patterson",
          role: "Agency Owner",
        },
      ],
    },

    // Offer Section (Pricing)
    {
      id: generateId(),
      type: "offer",
      content: {
        badge: "Limited Time Offer",
        heading: "Start Your Transformation Today",
        subheading:
          "Join 12,000+ students who've already changed their lives. Full program access with a 60-day money-back guarantee.",
        priceYearly: "$997",
        priceMonthly: "3x $367",
        buttonText: "Enroll Now - Start Today",
        buttonLink: "#",
        backgroundColor: "#1E40AF",
        textColor: "#ffffff",
        accentColor: "#10B981",
      },
      items: [
        {
          id: generateId(),
          title: "Complete Program",
          price: "$997",
          description: "One-time payment, lifetime access",
          features: [
            "50+ Video Lessons",
            "Private Community Access",
            "Weekly Live Coaching Calls",
            "Templates & Resource Library",
            "Certificate of Completion",
            "Lifetime Updates",
            "60-Day Money-Back Guarantee",
          ],
        },
      ],
    },

    // FAQ Section
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Got Questions? We've Got Answers",
        subheading: "Everything you need to know before enrolling",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#10B981",
      },
      items: [
        {
          id: generateId(),
          title: "What if I'm a complete beginner?",
          description:
            "Perfect! This program is designed for beginners. We start from the fundamentals and build up step-by-step. Many of our most successful students started with zero experience.",
        },
        {
          id: generateId(),
          title: "How much time do I need to commit?",
          description:
            "Most students spend 5-10 hours per week on the program. You can learn at your own pace, and all content is available on-demand. Many students complete the core curriculum in 4-6 weeks.",
        },
        {
          id: generateId(),
          title: "What's the refund policy?",
          description:
            "We offer a 60-day, no-questions-asked money-back guarantee. If you go through the material and don't see results, we'll refund every penny. We're that confident in the program.",
        },
        {
          id: generateId(),
          title: "How long do I have access?",
          description:
            "Forever! You get lifetime access to all course materials, including any future updates and additions. Once you're in, you're in for life.",
        },
        {
          id: generateId(),
          title: "Is there support if I get stuck?",
          description:
            "Absolutely. You'll have access to our private community where you can ask questions 24/7, plus weekly live coaching calls where you can get personalized help.",
        },
        {
          id: generateId(),
          title: "Can I pay in installments?",
          description:
            "Yes! We offer a 3-payment plan of $367/month for those who prefer to spread out the investment. Same program, same access, just more flexibility.",
        },
      ],
    },

    // Final CTA Section
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Your Transformation Starts Now",
        subheading:
          "12,000+ students have already changed their lives. 60-day money-back guarantee means zero risk. The only question is: are you ready?",
        buttonText: "Enroll Now - Change Your Life",
        buttonLink: "#pricing",
        bodyText: "✓ Instant Access  ✓ 60-Day Guarantee  ✓ Lifetime Updates",
        backgroundColor: "#10B981",
        textColor: "#ffffff",
        accentColor: "#1E40AF",
        ctaVariant: "banner",
        headingStyle: "solid",
      },
      items: [],
    },

    // Footer Section
    {
      id: generateId(),
      type: "footer",
      content: {
        logoText: "SKILLFORGE",
        tagline: "LEARN. BUILD. EARN.",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#10B981",
        links: [
          { label: "Contact", url: "#" },
          { label: "Privacy", url: "#" },
          { label: "Terms", url: "#" },
          { label: "Refunds", url: "#" },
        ],
        bodyText: "© 2024 SkillForge. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#10B981",
    secondary: "#059669",
    accent: "#1E40AF",
    background: "#ffffff",
    text: "#1f2937",
  },
  typography: {
    headingFont: "Poppins",
    bodyFont: "Inter",
  },
  animationPreset: "moderate",
  smoothScroll: true,
};
