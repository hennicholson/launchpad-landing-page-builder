"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ---- Types ----

type Overview = {
  totalUsers: number;
  planBreakdown: Record<string, number>;
  totalRevenueCents: number;
  subscriptionRevenueCents: number;
  topupRevenueCents: number;
  totalAICostCents: number;
  totalVoiceCostCents: number;
  totalCostCents: number;
  profitCents: number;
  totalVoiceSessions: number;
  activeVoiceSessions: number;
  recentPayments30d: number;
  recentRevenue30dCents: number;
};

type AnalyticsUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  aiTotalCostCents: number;
  voiceTotalCostCents: number;
  voiceTotalSessions: number;
  balanceCents: number;
  projectCount: number;
  deployCount: number;
  lastLoginAt: string | null;
  createdAt: string | null;
};

type PaymentRecord = {
  id: string;
  whopPaymentId: string | null;
  whopUserId: string | null;
  amountCents: number;
  type: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: string | null;
};

type RevenueData = {
  recentPayments: PaymentRecord[];
  subscriptionTotal: number;
  topupTotal: number;
  totalRevenue: number;
  paymentCount: number;
};

// ---- Helpers ----

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  starter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const SORT_OPTIONS = [
  { key: "joined", label: "Joined" },
  { key: "aiCost", label: "AI Cost" },
  { key: "voiceCost", label: "Voice Cost" },
  { key: "voiceSessions", label: "Voice Sessions" },
  { key: "balance", label: "Balance" },
];

// ---- Component ----

export default function AdminAnalyticsPage() {
  const router = useRouter();

  // Overview state
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Users state
  const [analyticsUsers, setAnalyticsUsers] = useState<AnalyticsUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersPlanFilter, setUsersPlanFilter] = useState("all");
  const [usersSearch, setUsersSearch] = useState("");
  const [usersSort, setUsersSort] = useState("joined");
  const [usersSortOrder, setUsersSortOrder] = useState<"asc" | "desc">("desc");
  const [usersOffset, setUsersOffset] = useState(0);
  const USERS_LIMIT = 25;

  // Revenue state
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // Error + auth
  const [error, setError] = useState<string | null>(null);

  // ---- Data fetching ----

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const res = await fetch("/api/admin/analytics?view=overview");
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to fetch overview");
      setOverview(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setOverviewLoading(false);
    }
  }, [router]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        view: "users",
        plan: usersPlanFilter,
        sort: usersSort,
        order: usersSortOrder,
        limit: String(USERS_LIMIT),
        offset: String(usersOffset),
      });
      if (usersSearch) params.set("search", usersSearch);
      const res = await fetch(`/api/admin/analytics?${params}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setAnalyticsUsers(data.users);
      setUsersTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setUsersLoading(false);
    }
  }, [router, usersPlanFilter, usersSearch, usersSort, usersSortOrder, usersOffset]);

  const fetchRevenue = useCallback(async () => {
    setRevenueLoading(true);
    try {
      const res = await fetch("/api/admin/analytics?view=revenue&limit=30");
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to fetch revenue");
      setRevenue(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setRevenueLoading(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => { fetchOverview(); fetchRevenue(); }, [fetchOverview, fetchRevenue]);

  // Users refresh on filter/sort changes
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setUsersOffset(0);
      fetchUsers();
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersSearch]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  function handleSort(key: string) {
    if (usersSort === key) {
      setUsersSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setUsersSort(key);
      setUsersSortOrder("desc");
    }
    setUsersOffset(0);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-white/60">{error}</p>
          <Link href="/admin/login" className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Analytics</h1>
            <p className="text-sm text-white/50">AI costs, voice costs, revenue, and user metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/subscribers" className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Subscribers
            </Link>
            <Link href="/admin/deploys" className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Deploys
            </Link>
            <Link href="/admin/invoices" className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              Invoices
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* ========================= OVERVIEW CARDS ========================= */}
        {overviewLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-[88px]" />
            ))}
          </div>
        ) : overview ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Total Users */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{overview.totalUsers}</p>
                <p className="text-xs text-white/50 uppercase tracking-wide">Total Users</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {Object.entries(overview.planBreakdown).map(([plan, count]) => (
                    <span key={plan} className={`text-[10px] px-1.5 py-0.5 rounded border ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
                      {count} {plan}
                    </span>
                  ))}
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-2xl font-bold text-emerald-400">{formatCents(overview.totalRevenueCents)}</p>
                <p className="text-xs text-emerald-400/60 uppercase tracking-wide">Total Revenue</p>
                <p className="text-[10px] text-white/40 mt-1">30d: {formatCents(overview.recentRevenue30dCents)}</p>
              </div>

              {/* AI Costs */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                <p className="text-2xl font-bold text-blue-400">{formatCents(overview.totalAICostCents)}</p>
                <p className="text-xs text-blue-400/60 uppercase tracking-wide">AI Costs</p>
              </div>

              {/* Voice Costs */}
              <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
                <p className="text-2xl font-bold text-violet-400">{formatCents(overview.totalVoiceCostCents)}</p>
                <p className="text-xs text-violet-400/60 uppercase tracking-wide">Voice Costs</p>
                <p className="text-[10px] text-white/40 mt-1">{overview.totalVoiceSessions} sessions</p>
              </div>

              {/* Profit */}
              <div className={`border rounded-xl p-4 ${overview.profitCents >= 0 ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                <p className={`text-2xl font-bold ${overview.profitCents >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCents(overview.profitCents)}
                </p>
                <p className={`text-xs uppercase tracking-wide ${overview.profitCents >= 0 ? "text-green-400/60" : "text-red-400/60"}`}>
                  Profit
                </p>
                {overview.totalRevenueCents > 0 && (
                  <p className="text-[10px] text-white/40 mt-1">
                    {Math.round((overview.profitCents / overview.totalRevenueCents) * 100)}% margin
                  </p>
                )}
              </div>

              {/* Active Voice */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <p className="text-2xl font-bold text-amber-400">{overview.activeVoiceSessions}</p>
                <p className="text-xs text-amber-400/60 uppercase tracking-wide">Active Voice</p>
                <p className="text-[10px] text-white/40 mt-1">{overview.recentPayments30d} payments (30d)</p>
              </div>
            </div>

            {/* Revenue breakdown bar */}
            {overview.totalRevenueCents > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50 uppercase tracking-wide">Revenue Breakdown</span>
                  <span className="text-sm font-medium">{formatCents(overview.totalRevenueCents)}</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
                  {overview.subscriptionRevenueCents > 0 && (
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${(overview.subscriptionRevenueCents / overview.totalRevenueCents) * 100}%` }}
                      title={`Subscriptions: ${formatCents(overview.subscriptionRevenueCents)}`}
                    />
                  )}
                  {overview.topupRevenueCents > 0 && (
                    <div
                      className="bg-cyan-500 transition-all"
                      style={{ width: `${(overview.topupRevenueCents / overview.totalRevenueCents) * 100}%` }}
                      title={`Top-ups: ${formatCents(overview.topupRevenueCents)}`}
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-white/50">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Subscriptions ({formatCents(overview.subscriptionRevenueCents)})</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Top-ups ({formatCents(overview.topupRevenueCents)})</span>
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* ========================= USERS TABLE ========================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Users</h2>
            <span className="text-sm text-white/40">{usersTotal} total</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Plan filter */}
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {["all", "free", "starter", "pro", "enterprise"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => { setUsersPlanFilter(plan); setUsersOffset(0); }}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors capitalize ${
                    usersPlanFilter === plan
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={usersSearch}
              onChange={(e) => setUsersSearch(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg outline-none focus:border-white/25 text-white placeholder:text-white/30 w-64"
            />

            {/* Sort */}
            <div className="flex items-center gap-1 ml-auto">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                    usersSort === opt.key
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {opt.label}
                  {usersSort === opt.key && (
                    <span className="ml-1">{usersSortOrder === "desc" ? "\u2193" : "\u2191"}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-right px-4 py-3">AI Cost</th>
                    <th className="text-right px-4 py-3">Voice Cost</th>
                    <th className="text-right px-4 py-3">Voice Sessions</th>
                    <th className="text-right px-4 py-3">Balance</th>
                    <th className="text-right px-4 py-3">Projects</th>
                    <th className="text-right px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="h-4 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : analyticsUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-white/30 py-8">No users found</td>
                    </tr>
                  ) : (
                    analyticsUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full bg-white/10" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/40">
                                {(user.name || user.email || "?")[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate text-sm">{user.name || user.username || "—"}</p>
                              <p className="text-xs text-white/40 truncate">{user.email || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] px-2 py-0.5 rounded border ${PLAN_COLORS[user.plan] || PLAN_COLORS.free}`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {user.aiTotalCostCents > 0 ? (
                            <span className="text-blue-400">{formatCents(user.aiTotalCostCents)}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {user.voiceTotalCostCents > 0 ? (
                            <span className="text-violet-400">{formatCents(user.voiceTotalCostCents)}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {user.voiceTotalSessions > 0 ? (
                            <span className="text-white/70">{user.voiceTotalSessions}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          {user.balanceCents > 0 ? (
                            <span className="text-emerald-400">{formatCents(user.balanceCents)}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-white/50">{user.projectCount}</td>
                        <td className="px-4 py-3 text-right text-xs text-white/40">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersTotal > USERS_LIMIT && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                <p className="text-xs text-white/40">
                  Showing {usersOffset + 1}-{Math.min(usersOffset + USERS_LIMIT, usersTotal)} of {usersTotal}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={usersOffset === 0}
                    onClick={() => setUsersOffset(Math.max(0, usersOffset - USERS_LIMIT))}
                    className="px-3 py-1 text-xs bg-white/10 rounded-md disabled:opacity-30 hover:bg-white/20 transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    disabled={usersOffset + USERS_LIMIT >= usersTotal}
                    onClick={() => setUsersOffset(usersOffset + USERS_LIMIT)}
                    className="px-3 py-1 text-xs bg-white/10 rounded-md disabled:opacity-30 hover:bg-white/20 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================= REVENUE SECTION ========================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue</h2>
            {revenue && (
              <span className="text-sm text-white/40">{revenue.paymentCount} payments</span>
            )}
          </div>

          {revenueLoading ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse h-[200px]" />
          ) : revenue ? (
            <div className="space-y-4">
              {/* Revenue summary cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xl font-bold text-emerald-400">{formatCents(revenue.totalRevenue)}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Total Revenue</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xl font-bold text-emerald-300">{formatCents(revenue.subscriptionTotal)}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Subscriptions</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xl font-bold text-cyan-400">{formatCents(revenue.topupTotal)}</p>
                  <p className="text-xs text-white/50 uppercase tracking-wide">Top-ups</p>
                </div>
              </div>

              {/* Recent payments table */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-medium text-white/70">Recent Payments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wide">
                        <th className="text-left px-4 py-2">User</th>
                        <th className="text-left px-4 py-2">Type</th>
                        <th className="text-right px-4 py-2">Amount</th>
                        <th className="text-right px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.recentPayments.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-white/30 py-6">No payments yet</td>
                        </tr>
                      ) : (
                        revenue.recentPayments.map((payment) => (
                          <tr key={payment.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-2.5">
                              <p className="text-sm">{payment.userName || payment.userEmail || payment.whopUserId || "Unknown"}</p>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`text-[11px] px-2 py-0.5 rounded border ${
                                payment.type === "subscription"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                              }`}>
                                {payment.type}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-400">
                              {formatCents(payment.amountCents)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-xs text-white/40">
                              {formatDateShort(payment.createdAt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
