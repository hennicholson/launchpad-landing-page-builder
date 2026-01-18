"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const plans = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    interval: "forever",
    description: "For creators testing their first offer or building their first landing funnel inside Whop.",
    features: [
      { name: "1 site", included: true },
      { name: "Visual editor", included: true },
      { name: "Template library", included: true },
      { name: "Live preview", included: true },
      { name: "Publish to live URL", included: false },
      { name: "onwhop.com subdomain", included: false },
      { name: "AI copy generation", included: false },
      { name: "AI component generation", included: false },
    ],
    privacyNote: "Analytics collected on your funnels",
    cta: "Get Started",
    currentCta: "Current Plan",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month",
    description: "For creators running traffic, scaling offers, and optimizing conversion.",
    badge: "Best Value",
    features: [
      { name: "7 sites", included: true },
      { name: "Visual editor", included: true },
      { name: "Template library", included: true },
      { name: "Live preview", included: true },
      { name: "Publish to live URL", included: true },
      { name: "onwhop.com subdomain", included: true, highlight: true },
      { name: "50 AI copy generations / mo", included: true },
      { name: "25 AI component generations / mo", included: true },
    ],
    privacyNote: "Secure — no tracking on your funnels",
    cta: "Upgrade to Pro",
    currentCta: "Current Plan",
  },
};

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    // Fetch user's current plan
    async function fetchUserPlan() {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.user?.plan || "free");
        } else {
          setCurrentPlan("free");
        }
      } catch (error) {
        setCurrentPlan("free");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserPlan();
  }, []);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Get the checkout URL from our API (which retrieves it from Whop)
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      } else {
        // Fallback to product page
        window.open("https://whop.com/launchpad-app/launchpad-pro-cc/", "_blank");
      }
    } catch (error) {
      console.error("Failed to get checkout URL:", error);
      // Fallback to product page
      window.open("https://whop.com/launchpad-app/launchpad-pro-cc/", "_blank");
    } finally {
      setIsUpgrading(false);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (planId === "free") return currentPlan === "free";
    if (planId === "pro") return currentPlan === "pro" || currentPlan === "enterprise";
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-['DM_Sans',sans-serif] relative overflow-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient gradients */}
      <div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-orange-500/6 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img
              src="/launchpad-logo.png"
              alt="LaunchPad"
              className="h-10 w-auto"
            />
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Simple, transparent pricing
            </div>
            <h1 className="font-['Sora',sans-serif] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Launch pages that{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                convert
              </span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Build high-converting landing funnels that route buyers directly to your Whop offers.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 h-full flex flex-col">
                {/* Current Plan Badge */}
                {!isLoading && isCurrentPlan("free") && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className={`mb-6 ${isCurrentPlan("free") ? "mt-2" : ""}`}>
                  <h3 className="font-['Sora',sans-serif] text-2xl font-semibold mb-2">
                    {plans.free.name}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {plans.free.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Sora',sans-serif] text-5xl font-bold">$0</span>
                    <span className="text-white/40 text-lg">/{plans.free.interval}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {plans.free.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {feature.included ? <CheckIcon /> : <XIcon />}
                        <span className={feature.included ? "text-white/70" : "text-white/30"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Privacy note */}
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <p className="text-xs text-white/30 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {plans.free.privacyNote}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  {isCurrentPlan("free") ? (
                    <div className="block w-full py-3.5 px-6 rounded-xl bg-white/5 border border-white/10 text-white/50 font-semibold text-center cursor-default">
                      Current Plan
                    </div>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="block w-full py-3.5 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-center hover:bg-white/10 transition-all"
                    >
                      {plans.free.cta}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative group">
              {/* Glow effect behind card */}
              <div className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-amber-500/20 h-full flex flex-col">
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {!isLoading && isCurrentPlan("pro") ? (
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold uppercase tracking-wider">
                      Current Plan
                    </div>
                  ) : (
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold uppercase tracking-wider">
                      {plans.pro.badge}
                    </div>
                  )}
                </div>

                <div className="mb-6 mt-2">
                  <h3 className="font-['Sora',sans-serif] text-2xl font-semibold mb-2">
                    {plans.pro.name}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {plans.pro.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Sora',sans-serif] text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      $29
                    </span>
                    <span className="text-white/40 text-lg">/{plans.pro.interval}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4">
                    {plans.pro.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckIcon />
                        <span className={`text-white/70 ${feature.highlight ? "text-amber-400/90" : ""}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Privacy note - highlighted for Pro */}
                  <div className="mt-6 pt-4 border-t border-amber-500/10">
                    <p className="text-xs text-emerald-400/80 flex items-center gap-2 font-medium">
                      <ShieldIcon />
                      {plans.pro.privacyNote}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  {isCurrentPlan("pro") ? (
                    <div className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500/50 to-orange-500/50 text-black/70 font-semibold text-center cursor-default">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={handleUpgrade}
                      disabled={isLoading || isUpgrading}
                      className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-center hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isUpgrading ? "Loading..." : plans.pro.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ/Info Section */}
          <div className="mt-20 text-center">
            <p className="text-white/30 text-sm">
              Need a custom domain or professional copy audit?{" "}
              <a href="#" className="text-amber-400/80 hover:text-amber-400 underline underline-offset-4">
                Contact us
              </a>{" "}
              for enterprise solutions.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/20 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span>AI-powered</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} LaunchPad. Built with AI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
