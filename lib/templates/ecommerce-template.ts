import { LandingPage, generateId } from "../page-schema";

/**
 * E-Commerce Funnel Template
 * Red/Gold color scheme for urgency and premium feel
 * Direct Benefit copywriting formula
 * 9-section high-converting funnel structure
 */
export const ecommerceTemplate: LandingPage = {
  title: "Your Product",
  description: "The ultimate solution for your everyday needs",
  sections: [
    // Header Section
    {
      id: generateId(),
      type: "header",
      content: {
        logoText: "LUXEGOODS",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        accentColor: "#DC2626",
        links: [
          { label: "Features", url: "#features" },
          { label: "Reviews", url: "#testimonials" },
          { label: "FAQ", url: "#faq" },
        ],
        buttonText: "Shop Now",
        buttonLink: "#pricing",
      },
      items: [],
    },

    // Hero Section (Direct Benefit)
    {
      id: generateId(),
      type: "hero",
      content: {
        badge: "⭐ 50,000+ Happy Customers",
        heading: "Get Premium Quality",
        accentHeading: "Without the Premium Price",
        accentColor: "#DC2626",
        subheading:
          "Finally, a product that delivers on its promises. Engineered for performance, designed for style, and priced for everyone. Join 50,000+ customers who've made the switch.",
        buttonText: "Buy Now - Free Shipping",
        buttonLink: "#pricing",
        videoUrl: "",
        brands: [],
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
      },
      items: [],
    },

    // Stats Section (Social proof metrics)
    {
      id: generateId(),
      type: "stats",
      content: {
        heading: "Why 50,000+ Customers Choose Us",
        subheading: "Real numbers from real customers",
        backgroundColor: "#DC2626",
        textColor: "#ffffff",
        accentColor: "#FBBF24",
        statsVariant: "bars",
      },
      items: [
        {
          id: generateId(),
          title: "50,000+",
          description: "Units Sold",
        },
        {
          id: generateId(),
          title: "4.9/5",
          description: "Star Rating",
        },
        {
          id: generateId(),
          title: "98%",
          description: "Satisfaction Rate",
        },
        {
          id: generateId(),
          title: "30-Day",
          description: "Money-Back Guarantee",
        },
      ],
    },

    // Process Section (How it works)
    {
      id: generateId(),
      type: "process",
      content: {
        heading: "Simple as 1-2-3",
        subheading: "From order to delivery in record time",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#DC2626",
      },
      items: [
        {
          id: generateId(),
          title: "Order Online",
          description: "Choose your style and size. Checkout takes less than 2 minutes.",
          icon: "shopping-cart",
        },
        {
          id: generateId(),
          title: "Fast Shipping",
          description: "Free express shipping on all orders. Most arrive in 3-5 business days.",
          icon: "truck",
        },
        {
          id: generateId(),
          title: "Love It or Return It",
          description: "30-day hassle-free returns. Not satisfied? Full refund, no questions.",
          icon: "heart",
        },
      ],
    },

    // Features Section (Product Benefits)
    {
      id: generateId(),
      type: "features",
      content: {
        heading: "Built Different. Built Better.",
        subheading: "Product Features",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        layout: "grid",
        accentColor: "#DC2626",
      },
      items: [
        {
          id: generateId(),
          title: "Premium Materials",
          description:
            "Sourced from the finest suppliers. Every component is built to last years, not months.",
          imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
          gridClass: "md:col-span-2 md:row-span-2",
          aspectRatio: "aspect-video",
        },
        {
          id: generateId(),
          title: "Ergonomic Design",
          description:
            "Engineered for comfort and style. Looks great, feels even better.",
          imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
          gridClass: "md:col-span-1 md:row-span-2",
          aspectRatio: "aspect-square",
        },
        {
          id: generateId(),
          title: "Sustainable Production",
          description: "Eco-friendly manufacturing. Good for you, good for the planet.",
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
          gridClass: "md:col-span-1",
          aspectRatio: "",
        },
        {
          id: generateId(),
          title: "Lifetime Warranty",
          description:
            "We stand behind our products. If anything goes wrong, we'll make it right.",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
          gridClass: "md:col-span-2",
          aspectRatio: "aspect-[2/1]",
        },
      ],
    },

    // Comparison Section (vs Competitors)
    {
      id: generateId(),
      type: "comparison",
      content: {
        heading: "See How We Compare",
        subheading: "Why customers are switching to LuxeGoods",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#DC2626",
      },
      items: [
        {
          id: generateId(),
          title: "LuxeGoods",
          features: [
            "Premium Materials",
            "Lifetime Warranty",
            "Free Shipping",
            "30-Day Returns",
            "Affordable Price ($99)",
          ],
        },
        {
          id: generateId(),
          title: "Other Brands",
          features: [
            "Free Shipping",
          ],
        },
      ],
    },

    // Testimonials Section (Customer reviews with star ratings)
    {
      id: generateId(),
      type: "testimonials",
      content: {
        heading: "What Our Customers Say",
        backgroundColor: "#ffffff",
        textColor: "#1f2937",
        scrollSpeed: 30,
      },
      items: [
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Best purchase ever",
          description:
            "I've tried 5 different brands and LuxeGoods is by far the best quality. Worth every penny and then some.",
          author: "Jessica M.",
          role: "Verified Buyer",
        },
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Exceeded expectations",
          description:
            "The photos don't do it justice. Even more beautiful in person. Shipping was fast and packaging was premium.",
          author: "Michael R.",
          role: "Verified Buyer",
        },
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Perfect gift",
          description:
            "Bought this for my wife and she absolutely loves it. Already ordering two more for myself.",
          author: "David L.",
          role: "Verified Buyer",
        },
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Quality is unmatched",
          description:
            "You can feel the quality the moment you open the box. This is how products should be made.",
          author: "Sarah K.",
          role: "Verified Buyer",
        },
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Amazing customer service",
          description:
            "Had a question about sizing and their team responded in minutes. Product is fantastic too.",
          author: "Amanda T.",
          role: "Verified Buyer",
        },
        {
          id: generateId(),
          title: "⭐⭐⭐⭐⭐ Highly recommend",
          description:
            "Third time buying from LuxeGoods. Consistent quality every time. My go-to brand now.",
          author: "Chris P.",
          role: "Verified Buyer",
        },
      ],
    },

    // FAQ Section (Shipping, returns, product questions)
    {
      id: generateId(),
      type: "faq",
      content: {
        heading: "Frequently Asked Questions",
        subheading: "Everything you need to know before you buy",
        backgroundColor: "#f8fafc",
        textColor: "#1f2937",
        accentColor: "#DC2626",
      },
      items: [
        {
          id: generateId(),
          title: "How long does shipping take?",
          description:
            "We offer free express shipping on all orders. Most packages arrive within 3-5 business days. You'll receive tracking information as soon as your order ships.",
        },
        {
          id: generateId(),
          title: "What's your return policy?",
          description:
            "We offer a 30-day, no-questions-asked return policy. If you're not 100% satisfied, simply return the product in its original packaging for a full refund.",
        },
        {
          id: generateId(),
          title: "Is the warranty really for life?",
          description:
            "Yes! Our lifetime warranty covers manufacturing defects for as long as you own the product. If something breaks due to a defect, we'll replace it free of charge.",
        },
        {
          id: generateId(),
          title: "What materials do you use?",
          description:
            "We use only premium, sustainably-sourced materials. Every component is tested for durability and comfort. We're proud to say our products last 3x longer than industry average.",
        },
        {
          id: generateId(),
          title: "Do you ship internationally?",
          description:
            "Yes! We ship to over 50 countries worldwide. International shipping rates and delivery times vary by location. Check our shipping page for details.",
        },
        {
          id: generateId(),
          title: "How do I care for my product?",
          description:
            "Each order comes with care instructions. Generally, our products are low-maintenance and built to withstand everyday use. Specific care details are included with your purchase.",
        },
      ],
    },

    // Final CTA Section (Buy now with urgency)
    {
      id: generateId(),
      type: "cta",
      content: {
        heading: "Don't Wait—Free Shipping Ends Soon",
        subheading:
          "Join 50,000+ happy customers. Premium quality, free shipping, and a 30-day money-back guarantee. What are you waiting for?",
        buttonText: "Buy Now - Free Shipping",
        buttonLink: "#pricing",
        bodyText: "✓ Free Express Shipping  ✓ 30-Day Returns  ✓ Lifetime Warranty",
        backgroundColor: "#DC2626",
        textColor: "#ffffff",
        accentColor: "#FBBF24",
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
        logoText: "LUXEGOODS",
        tagline: "QUALITY. STYLE. VALUE.",
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        accentColor: "#DC2626",
        links: [
          { label: "Shipping", url: "#" },
          { label: "Returns", url: "#" },
          { label: "Privacy", url: "#" },
          { label: "Terms", url: "#" },
        ],
        bodyText: "© 2024 LuxeGoods. All rights reserved.",
      },
      items: [],
    },
  ],
  colorScheme: {
    primary: "#DC2626",
    secondary: "#b91c1c",
    accent: "#FBBF24",
    background: "#ffffff",
    text: "#1f2937",
  },
  typography: {
    headingFont: "Montserrat",
    bodyFont: "Inter",
  },
  animationPreset: "dramatic",
  smoothScroll: true,
};
