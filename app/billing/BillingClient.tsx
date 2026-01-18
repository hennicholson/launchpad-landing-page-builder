"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { payInvoiceWithCredits, type BillingInfo } from "@/lib/actions/billing";

type Props = {
  billingData: BillingInfo;
};

// Progress bar component for usage displays
function UsageBar({ used, limit, color = "amber" }: { used: number; limit: number; color?: string }) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isAtLimit = !isUnlimited && used >= limit;

  const colorClasses = {
    amber: {
      bg: "bg-amber-500/20",
      fill: isAtLimit ? "bg-red-500" : isNearLimit ? "bg-orange-500" : "bg-amber-500",
      text: isAtLimit ? "text-red-400" : "text-white/70",
    },
    blue: {
      bg: "bg-blue-500/20",
      fill: isAtLimit ? "bg-red-500" : isNearLimit ? "bg-orange-500" : "bg-blue-500",
      text: isAtLimit ? "text-red-400" : "text-white/70",
    },
    purple: {
      bg: "bg-purple-500/20",
      fill: isAtLimit ? "bg-red-500" : isNearLimit ? "bg-orange-500" : "bg-purple-500",
      text: isAtLimit ? "text-red-400" : "text-white/70",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.amber;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={colors.text}>
          {isUnlimited ? `${used.toLocaleString()} used` : `${used} / ${limit}`}
        </span>
        {isUnlimited && (
          <span className="text-emerald-400 text-xs font-medium">Unlimited</span>
        )}
        {isAtLimit && !isUnlimited && (
          <span className="text-red-400 text-xs font-medium">Limit reached</span>
        )}
      </div>
      <div className={`h-2 rounded-full ${colors.bg}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors.fill}`}
          style={{ width: isUnlimited ? "0%" : `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function BillingClient({ billingData }: Props) {
  const router = useRouter();
  const [balance, setBalance] = useState(billingData.balanceCents);
  const [invoices, setInvoices] = useState(billingData.invoices);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "pro": return "from-amber-500 to-orange-500";
      case "starter": return "from-blue-500 to-cyan-500";
      case "enterprise": return "from-purple-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    setError(null);

    const result = await payInvoiceWithCredits(invoiceId);

    if (result.success && result.newBalance !== undefined) {
      setBalance(result.newBalance);
      setInvoices(invoices.filter((inv) => inv.id !== invoiceId));
      router.refresh();
    } else {
      setError(result.error || "Failed to pay invoice");
    }

    setPayingInvoiceId(null);
  };

  const handleTopUp = (planId: string | null) => {
    if (planId) {
      // Open Whop checkout in new window
      window.open(`https://whop.com/checkout/${planId}`, "_blank");
    } else {
      // Fallback - go to pricing page
      router.push("/pricing");
    }
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status === "overdue" || new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-['DM_Sans',sans-serif]">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors mb-6 group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </button>

          {/* User Profile & Plan */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {billingData.user.avatarUrl ? (
                <img
                  src={billingData.user.avatarUrl}
                  alt={billingData.user.name || "User"}
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                  <span className="text-2xl font-bold text-amber-400">
                    {(billingData.user.name || billingData.user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold tracking-tight">
                  {billingData.user.name || billingData.user.email || "Your Account"}
                </h1>
                <p className="text-white/50 text-sm">
                  Member since {formatDate(billingData.user.createdAt)}
                </p>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getPlanBadgeColor(billingData.plan)} text-black font-bold text-sm uppercase tracking-wider`}>
              {billingData.plan} Plan
            </div>
          </div>
        </header>

        {/* Error Toast */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Balance Card */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#151516] to-[#0f0f10] border border-white/[0.06] p-8 sm:p-10">
            {/* Card glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Available Balance</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-['Sora',sans-serif] text-5xl sm:text-6xl font-bold tracking-tight tabular-nums">
                  {formatCurrency(balance)}
                </span>
                <span className="text-white/40 text-lg">credits</span>
              </div>

              <p className="mt-4 text-white/40 text-sm">
                {balance >= 2900
                  ? "You have enough credits for your Pro subscription"
                  : `Add ${formatCurrency(2900 - balance)} more for Pro subscription`}
              </p>
            </div>
          </div>
        </section>

        {/* Usage Limits Section */}
        <section className="mb-12">
          <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full" />
            Plan Limits
            {billingData.usage.aiCopyGenerations.resetAt && (
              <span className="ml-auto text-xs text-white/40 font-normal">
                AI resets {formatDate(billingData.usage.aiCopyGenerations.resetAt)}
              </span>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projects */}
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">Projects</div>
                  <div className="text-xs text-white/40">Funnel pages you can create</div>
                </div>
              </div>
              <UsageBar
                used={billingData.usage.projects.used}
                limit={billingData.usage.projects.limit}
                color="blue"
              />
            </div>

            {/* Deploys */}
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">Deployments</div>
                  <div className="text-xs text-white/40">Publish your pages live</div>
                </div>
              </div>
              <UsageBar
                used={billingData.usage.deploys.used}
                limit={billingData.usage.deploys.limit}
                color="purple"
              />
            </div>

            {/* AI Copy Generations */}
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">AI Page Generation</div>
                  <div className="text-xs text-white/40">Generate full landing pages</div>
                </div>
              </div>
              <UsageBar
                used={billingData.usage.aiCopyGenerations.used}
                limit={billingData.usage.aiCopyGenerations.limit}
                color="amber"
              />
            </div>

            {/* AI Component Generations */}
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-white">AI Section Edits</div>
                  <div className="text-xs text-white/40">Regenerate individual sections</div>
                </div>
              </div>
              <UsageBar
                used={billingData.usage.aiComponentGenerations.used}
                limit={billingData.usage.aiComponentGenerations.limit}
                color="amber"
              />
            </div>
          </div>

          {/* Plan Features */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${billingData.features.canPublish ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
              {billingData.features.canPublish ? "✓" : "✗"} Can Publish
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${billingData.features.canUseSubdomain ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
              {billingData.features.canUseSubdomain ? "✓" : "✗"} Custom Subdomain
            </div>
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!billingData.features.trackingEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
              {!billingData.features.trackingEnabled ? "✓ Analytics Off (Private)" : "⚡ Analytics Enabled"}
            </div>
          </div>
        </section>

        {/* AI Usage Stats */}
        {(billingData.aiStats.totalInputTokens > 0 || billingData.aiStats.totalOutputTokens > 0) && (
          <section className="mb-12">
            <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
              AI Usage Stats
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5 text-center">
                <div className="text-2xl font-bold text-white font-['Sora',sans-serif]">
                  {formatNumber(billingData.aiStats.totalInputTokens)}
                </div>
                <div className="text-xs text-white/40 mt-1">Input Tokens</div>
              </div>
              <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5 text-center">
                <div className="text-2xl font-bold text-white font-['Sora',sans-serif]">
                  {formatNumber(billingData.aiStats.totalOutputTokens)}
                </div>
                <div className="text-xs text-white/40 mt-1">Output Tokens</div>
              </div>
              <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-5 text-center">
                <div className="text-2xl font-bold text-emerald-400 font-['Sora',sans-serif]">
                  {formatCurrency(billingData.aiStats.totalCostCents)}
                </div>
                <div className="text-xs text-white/40 mt-1">Total AI Cost</div>
              </div>
            </div>
          </section>
        )}

        {/* Upsells Section (Placeholder) */}
        <section className="mb-12">
          <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
            Power-Ups
          </h2>

          <div className="rounded-xl bg-gradient-to-br from-[#151516] to-[#0f0f10] border border-white/[0.06] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">More Power-Ups Coming Soon</h3>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Additional AI credits, custom domains, priority support, and more add-ons will be available here.
            </p>
          </div>
        </section>

        {/* Top-up Section */}
        <section className="mb-12">
          <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            Add Credits
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {billingData.topupPlans.map((plan) => {
              const isFeatured = plan.isFeatured === "true";
              return (
                <button
                  key={plan.id}
                  onClick={() => handleTopUp(plan.whopPlanId)}
                  className={`relative group rounded-xl p-5 text-left transition-all duration-300 ${
                    isFeatured
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/30 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                      : "bg-[#131314] border border-white/[0.06] hover:border-white/10 hover:bg-[#161617]"
                  } hover:-translate-y-1`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className={`text-sm font-medium mb-2 ${isFeatured ? "text-amber-400" : "text-white/50"}`}>
                    {plan.name}
                  </div>

                  <div className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold mb-1">
                    {formatCurrency(plan.amountCents)}
                  </div>

                  <div className="text-white/40 text-sm">{plan.credits.toLocaleString()} credits</div>

                  <div
                    className={`mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isFeatured
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black"
                        : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    Add Credits
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pending Invoices */}
        {invoices.length > 0 && (
          <section className="mb-12">
            <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-gradient-to-b from-red-400 to-orange-500 rounded-full" />
              Pending Invoices
              <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-sm">
                {invoices.length}
              </span>
            </h2>

            <div className="space-y-3">
              {invoices.map((invoice) => {
                const overdue = isOverdue(invoice.dueDate, invoice.status);
                const isPaying = payingInvoiceId === invoice.id;
                const canPay = balance >= invoice.amountCents;

                return (
                  <div
                    key={invoice.id}
                    className={`rounded-xl p-5 border transition-colors ${
                      overdue
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-[#131314] border-white/[0.06]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {overdue && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                              OVERDUE
                            </span>
                          )}
                          <span className="text-white font-medium truncate">
                            {invoice.description || "Invoice"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/50">
                          <span>Due: {formatDate(invoice.dueDate)}</span>
                          {invoice.graceUntil && (
                            <span className="text-amber-400">
                              Grace until: {formatDate(invoice.graceUntil)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="font-['Sora',sans-serif] text-xl font-bold">
                          {formatCurrency(invoice.amountCents)}
                        </div>

                        <button
                          onClick={() => handlePayInvoice(invoice.id)}
                          disabled={isPaying || !canPay}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                            canPay
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400"
                              : "bg-white/5 text-white/30 cursor-not-allowed"
                          }`}
                        >
                          {isPaying ? (
                            <>
                              <svg
                                className="w-4 h-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Paying...
                            </>
                          ) : canPay ? (
                            "Pay Now"
                          ) : (
                            "Insufficient Balance"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Transaction History */}
        <section>
          <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-gradient-to-b from-white/40 to-white/10 rounded-full" />
            Transaction History
          </h2>

          {billingData.transactions.length === 0 ? (
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <p className="text-white/50">No transactions yet</p>
              <p className="text-white/30 text-sm mt-1">Your credit history will appear here</p>
            </div>
          ) : (
            <div className="rounded-xl bg-[#131314] border border-white/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">
                        Balance
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {billingData.transactions.map((tx, index) => {
                      const isCredit = tx.amountCents > 0;
                      return (
                        <tr
                          key={tx.id}
                          className={`${index % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"} hover:bg-white/[0.02] transition-colors`}
                        >
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                                isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {isCredit ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-white/80 text-sm">
                              {tx.description || tx.type.replace("_", " ")}
                            </div>
                            <div className="text-white/30 text-xs capitalize">{tx.type.replace("_", " ")}</div>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <span
                              className={`font-['Sora',sans-serif] font-semibold ${
                                isCredit ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {isCredit ? "+" : ""}
                              {formatCurrency(tx.amountCents)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap hidden sm:table-cell">
                            <span className="text-white/50 text-sm">
                              {tx.balanceAfter !== null ? formatCurrency(tx.balanceAfter) : "-"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap text-white/40 text-sm">
                            {formatDate(tx.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
