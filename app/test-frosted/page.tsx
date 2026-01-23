"use client";

import { Avatar, Tabs } from "frosted-ui";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Card3DContainer,
  Card3DBody,
  Card3DItem,
  GlassCard3D,
} from "@/components/shared/primitives/Card3D";
import { ShimmerText } from "@/components/shared/primitives/ShimmerText";
import { NoiseOverlay } from "@/components/shared/primitives/NoiseOverlay";
import { InsetButton } from "@/components/shared/primitives/InsetButton";

// Whop Brand Colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
  orangeLight: "#FF6B3D",
  orangeDark: "#E03D10",
};

// ============================================
// FOUNDERS SECTION - 3D Glass Cards
// ============================================
function FoundersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const founders = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      bio: "Built 3 successful startups. $50M+ in exits. Forbes 30 Under 30.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      badges: ["YC Alumni", "Forbes 30u30"],
    },
    {
      name: "Sarah Mitchell",
      role: "CTO",
      bio: "Ex-Google, Ex-Meta. 15 years building scalable systems.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      badges: ["Ex-Google", "Ex-Meta"],
    },
    {
      name: "Marcus Johnson",
      role: "Head of Product",
      bio: "Led product at 2 unicorns. Shipped to 10M+ users.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      badges: ["Product Lead", "10M+ Users"],
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: `${WHOP.orange}20`, color: WHOP.orange }}
        >
          MEET THE TEAM
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
        >
          Built by <ShimmerText colorFrom={WHOP.cream} colorVia={WHOP.orange} colorTo={WHOP.cream}>Founders</ShimmerText>, for Founders
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: `${WHOP.cream}99` }}>
          We've been in your shoes. Now we're building the tools we wish we had.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {founders.map((founder, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Card3DContainer>
              <Card3DBody variant="default" style={{ padding: "32px" }}>
                <div className="text-center">
                  {/* Avatar floats forward on hover */}
                  <Card3DItem translateZ={60} className="mb-4 inline-block">
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{ backgroundColor: WHOP.orange, opacity: 0.3 }}
                      />
                      <Avatar
                        src={founder.avatar}
                        fallback={founder.name[0]}
                        size="6"
                        className="relative ring-2 ring-white/10"
                      />
                    </div>
                  </Card3DItem>

                  {/* Name floats slightly */}
                  <Card3DItem translateZ={40}>
                    <h3 className="text-xl font-bold mb-1" style={{ color: WHOP.cream }}>
                      {founder.name}
                    </h3>
                  </Card3DItem>

                  <Card3DItem translateZ={30}>
                    <p className="text-sm font-medium mb-3" style={{ color: WHOP.orange }}>
                      {founder.role}
                    </p>
                  </Card3DItem>

                  <Card3DItem translateZ={20}>
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: `${WHOP.cream}bb` }}>
                      {founder.bio}
                    </p>
                  </Card3DItem>

                  {/* Badges float forward most */}
                  <Card3DItem translateZ={50} className="flex gap-2 justify-center flex-wrap">
                    {founder.badges.map((badge, j) => (
                      <span
                        key={j}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${WHOP.orange}18`,
                          color: WHOP.orange,
                          border: `1px solid ${WHOP.orange}30`,
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </Card3DItem>
                </div>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// CTA SECTION - Glass Card Style
// ============================================
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative">
      <Card3DContainer className="rounded-3xl overflow-hidden">
        <Card3DBody
          variant="prominent"
          radius={24}
          showGlare={true}
          style={{ padding: "48px" }}
        >
          <NoiseOverlay opacity={0.03} baseFrequency={0.7} />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <Card3DItem translateZ={30}>
                <h2
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
                >
                  Ready to get started?
                </h2>
              </Card3DItem>

              <Card3DItem translateZ={40}>
                <InsetButton href="#" variant="primary" size="lg">
                  Start Free Trial
                </InsetButton>
              </Card3DItem>
            </motion.div>
          </div>
        </Card3DBody>
      </Card3DContainer>
    </section>
  );
}

// ============================================
// FEATURES SECTION - 3D Glass Cards
// ============================================
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: "🚀", title: "Launch in Minutes", description: "Go from idea to live product in under 10 minutes with our AI-powered builder." },
    { icon: "💰", title: "Built-in Payments", description: "Accept payments globally with Stripe, PayPal, and crypto. No setup required." },
    { icon: "📊", title: "Real-time Analytics", description: "Track conversions, revenue, and user behavior with beautiful dashboards." },
    { icon: "🎨", title: "Custom Branding", description: "Make it yours with custom domains, colors, fonts, and white-label options." },
    { icon: "🔒", title: "Enterprise Security", description: "SOC 2 compliant with end-to-end encryption. Your data is always safe." },
    { icon: "🤝", title: "24/7 Support", description: "Get help anytime from our expert team via chat, email, or phone." },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${WHOP.cream} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: `${WHOP.orange}20`, color: WHOP.orange }}
        >
          FEATURES
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
        >
          Everything You Need to <ShimmerText>Succeed</ShimmerText>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: `${WHOP.cream}99` }}>
          Powerful tools designed to help you build, launch, and scale.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Card3DContainer>
              <Card3DBody variant="subtle" style={{ padding: "28px" }}>
                <Card3DItem translateZ={50}>
                  <div
                    className="text-3xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${WHOP.orange}15`,
                      boxShadow: `0 4px 12px ${WHOP.orange}20`,
                    }}
                  >
                    {feature.icon}
                  </div>
                </Card3DItem>
                <Card3DItem translateZ={30}>
                  <h3 className="text-xl font-bold mb-2" style={{ color: WHOP.cream }}>
                    {feature.title}
                  </h3>
                </Card3DItem>
                <Card3DItem translateZ={15}>
                  <p className="text-sm leading-relaxed" style={{ color: `${WHOP.cream}99` }}>
                    {feature.description}
                  </p>
                </Card3DItem>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// TESTIMONIALS SECTION - 3D Glass Cards
// ============================================
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "This platform completely transformed how I run my business. Revenue is up 300% in just 3 months.",
      name: "Emily Park",
      role: "Course Creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
      result: "$50K MRR",
    },
    {
      quote: "The best investment I've ever made. The ROI paid for itself in the first week.",
      name: "David Rodriguez",
      role: "Agency Owner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      result: "10x ROI",
    },
    {
      quote: "Finally quit my 9-5 thanks to this. The community alone is worth the price.",
      name: "Jennifer Lee",
      role: "Full-time Creator",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      result: "Quit Job",
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: `${WHOP.orange}20`, color: WHOP.orange }}
        >
          TESTIMONIALS
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
        >
          Loved by <ShimmerText>Thousands</ShimmerText>
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: `${WHOP.cream}99` }}>
          Don't just take our word for it.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Card3DContainer>
              <Card3DBody variant="default" style={{ padding: "28px" }}>
                {/* Stars */}
                <Card3DItem translateZ={25} className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-lg" style={{ color: WHOP.orange }}>★</span>
                  ))}
                </Card3DItem>

                <Card3DItem translateZ={35}>
                  <p className="text-base mb-6 italic leading-relaxed" style={{ color: `${WHOP.cream}dd` }}>
                    "{testimonial.quote}"
                  </p>
                </Card3DItem>

                <Card3DItem translateZ={45} className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{ backgroundColor: WHOP.orange, opacity: 0.25 }}
                    />
                    <Avatar
                      src={testimonial.avatar}
                      fallback={testimonial.name[0]}
                      size="3"
                      className="relative ring-1 ring-white/10"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: WHOP.cream }}>{testimonial.name}</p>
                    <p className="text-xs" style={{ color: `${WHOP.cream}70` }}>{testimonial.role}</p>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#10B98125", color: "#10B981", border: "1px solid #10B98140" }}
                  >
                    {testimonial.result}
                  </span>
                </Card3DItem>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// PRICING SECTION - 3D Glass Cards
// ============================================
function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      features: ["5 Projects", "10GB Storage", "Basic Analytics", "Email Support"],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      description: "For growing businesses",
      features: ["Unlimited Projects", "100GB Storage", "Advanced Analytics", "Priority Support", "Custom Domain", "API Access"],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large teams",
      features: ["Everything in Pro", "Unlimited Storage", "Dedicated Manager", "SLA Guarantee", "SSO/SAML", "Custom Integrations"],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          style={{ backgroundColor: `${WHOP.orange}20`, color: WHOP.orange }}
        >
          PRICING
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
        >
          Simple, <ShimmerText>Transparent</ShimmerText> Pricing
        </h2>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: `${WHOP.cream}99` }}>
          No hidden fees. No surprises. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10 items-start">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold z-30"
                style={{
                  backgroundColor: WHOP.orange,
                  color: WHOP.cream,
                  boxShadow: `0 4px 14px ${WHOP.orange}50`,
                }}
              >
                MOST POPULAR
              </div>
            )}
            <Card3DContainer>
              <Card3DBody
                variant={plan.popular ? "prominent" : "default"}
                style={{
                  padding: "32px",
                  border: plan.popular ? `2px solid ${WHOP.orange}` : undefined,
                }}
              >
                <Card3DItem translateZ={20}>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: WHOP.cream }}>{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span
                        className="text-5xl font-black"
                        style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
                      >
                        {plan.price}
                      </span>
                      <span className="text-lg" style={{ color: `${WHOP.cream}70` }}>{plan.period}</span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: `${WHOP.cream}80` }}>{plan.description}</p>
                  </div>
                </Card3DItem>

                <Card3DItem translateZ={35}>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: "#10B98120", color: "#10B981" }}
                        >
                          ✓
                        </span>
                        <span className="text-sm" style={{ color: `${WHOP.cream}cc` }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card3DItem>

                <Card3DItem translateZ={50}>
                  <InsetButton
                    href="#"
                    variant={plan.popular ? "primary" : "default"}
                    size="md"
                    fullWidth
                  >
                    {plan.cta}
                  </InsetButton>
                </Card3DItem>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function TestFrostedPage() {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: WHOP.dark }}>
      <NoiseOverlay opacity={0.015} baseFrequency={0.5} className="fixed z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="py-10 text-center border-b mb-10" style={{ borderColor: `${WHOP.cream}10` }}>
          <h1
            className="text-5xl md:text-6xl font-black mb-3"
            style={{ color: WHOP.cream, fontFamily: "Acid Grotesk, sans-serif" }}
          >
            <ShimmerText duration={3}>3D Glass</ShimmerText> Cards
          </h1>
          <p className="text-lg" style={{ color: `${WHOP.cream}70` }}>
            Hover over cards to see perspective transforms and dynamic shine
          </p>
        </div>

        {/* Section Navigation */}
        <Tabs.Root defaultValue="all" className="mb-8">
          <Tabs.List className="justify-center">
            <Tabs.Trigger value="founders">Founders</Tabs.Trigger>
            <Tabs.Trigger value="cta">CTA</Tabs.Trigger>
            <Tabs.Trigger value="features">Features</Tabs.Trigger>
            <Tabs.Trigger value="testimonials">Testimonials</Tabs.Trigger>
            <Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
            <Tabs.Trigger value="all">All Sections</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="founders"><FoundersSection /></Tabs.Content>
          <Tabs.Content value="cta"><CTASection /></Tabs.Content>
          <Tabs.Content value="features"><FeaturesSection /></Tabs.Content>
          <Tabs.Content value="testimonials"><TestimonialsSection /></Tabs.Content>
          <Tabs.Content value="pricing"><PricingSection /></Tabs.Content>
          <Tabs.Content value="all">
            <FoundersSection />
            <CTASection />
            <FeaturesSection />
            <TestimonialsSection />
            <PricingSection />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
