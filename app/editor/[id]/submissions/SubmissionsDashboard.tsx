"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Search, Mail, Users, TrendingUp, BarChart3 } from "lucide-react";

type Submission = {
  id: string;
  email: string | null;
  sectionType: string | null;
  isRead: string | null;
  createdAt: string | null;
};

type Stats = {
  totalSubmissions: number;
  uniqueEmails: number;
  thisWeek: number;
  submissionsPerDay: { date: string; count: number }[];
};

type Props = {
  projectId: string;
  projectName: string;
  userPlan: string;
};

export default function SubmissionsDashboard({ projectId, projectName, userPlan }: Props) {
  const isPro = userPlan === "pro" || userPlan === "enterprise";

  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/forms/${projectId}/stats`);
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  }, [projectId]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/forms/${projectId}/submissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error("Failed to fetch submissions:", e);
    } finally {
      setLoading(false);
    }
  }, [projectId, page, search]);

  useEffect(() => {
    if (isPro) {
      fetchStats();
      fetchSubmissions();
    } else {
      setLoading(false);
    }
  }, [isPro, fetchStats, fetchSubmissions]);

  const handleExportCSV = () => {
    window.open(`/api/forms/${projectId}/submissions?format=csv`, "_blank");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  // Upgrade prompt overlay for non-pro users
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href={`/editor/${projectId}`}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Link>
            <span className="text-white/20">|</span>
            <span className="text-white/80 font-medium">{projectName}</span>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Unlock Form Submissions</h2>
            <p className="text-white/60 mb-6">
              Upgrade to Pro to collect email submissions from your landing pages and track conversions with a powerful dashboard.
            </p>
            <a
              href="/dashboard?upgrade=pro"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Chart rendering helper
  const renderChart = () => {
    if (!stats || stats.submissionsPerDay.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-white/30 text-sm">
          No submission data yet
        </div>
      );
    }

    // Fill in missing days over last 30 days
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = stats.submissionsPerDay.find((s) => s.date === dateStr);
      days.push({ date: dateStr, count: found ? found.count : 0 });
    }

    const maxCount = Math.max(...days.map((d) => d.count), 1);
    const chartHeight = 160;
    const chartWidth = 100; // percentage
    const barWidth = chartWidth / days.length;

    return (
      <div className="h-48 px-2">
        <svg viewBox={`0 0 ${days.length * 20} ${chartHeight + 20}`} className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1="0"
              y1={chartHeight - pct * chartHeight}
              x2={days.length * 20}
              y2={chartHeight - pct * chartHeight}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}
          {/* Area fill */}
          <path
            d={`M 0 ${chartHeight} ${days.map((d, i) => `L ${i * 20 + 10} ${chartHeight - (d.count / maxCount) * chartHeight}`).join(" ")} L ${(days.length - 1) * 20 + 10} ${chartHeight} Z`}
            fill="url(#chartGradient)"
          />
          {/* Line */}
          <path
            d={days.map((d, i) => `${i === 0 ? "M" : "L"} ${i * 20 + 10} ${chartHeight - (d.count / maxCount) * chartHeight}`).join(" ")}
            fill="none"
            stroke="#D6FC51"
            strokeWidth="2"
          />
          {/* Dots */}
          {days.map((d, i) =>
            d.count > 0 ? (
              <circle
                key={i}
                cx={i * 20 + 10}
                cy={chartHeight - (d.count / maxCount) * chartHeight}
                r="3"
                fill="#D6FC51"
              />
            ) : null
          )}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6FC51" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D6FC51" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex justify-between text-[10px] text-white/30 mt-1 px-1">
          <span>{days[0]?.date.slice(5)}</span>
          <span>{days[14]?.date.slice(5)}</span>
          <span>{days[29]?.date.slice(5)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/editor/${projectId}`}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/80 font-medium">{projectName}</span>
          <span className="text-white/20">|</span>
          <span className="text-white font-semibold">Submissions</span>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#D6FC51]/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#D6FC51]" />
                </div>
                <span className="text-white/50 text-sm">Total Submissions</span>
              </div>
              <p className="text-3xl font-bold">{stats?.totalSubmissions ?? "..."}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/50 text-sm">Unique Emails</span>
              </div>
              <p className="text-3xl font-bold">{stats?.uniqueEmails ?? "..."}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/50 text-sm">This Week</span>
              </div>
              <p className="text-3xl font-bold">{stats?.thisWeek ?? "..."}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-white/50 text-sm">Conversion Rate</span>
              </div>
              <p className="text-3xl font-bold text-white/30">--</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-medium text-white/60 mb-4">Submissions (Last 30 Days)</h3>
            {renderChart()}
          </div>

          {/* Submissions Table */}
          <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
            {/* Search bar */}
            <div className="p-4 border-b border-white/5">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Email</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Date</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Source Section</th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        <td className="px-5 py-3"><div className="h-4 w-48 bg-white/5 rounded animate-pulse" /></td>
                        <td className="px-5 py-3"><div className="h-4 w-32 bg-white/5 rounded animate-pulse" /></td>
                        <td className="px-5 py-3"><div className="h-4 w-24 bg-white/5 rounded animate-pulse" /></td>
                        <td className="px-5 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                      </tr>
                    ))
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-white/30">
                        No submissions yet. Deploy your page with email capture forms to start collecting leads.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3 text-white/80">{sub.email || "N/A"}</td>
                        <td className="px-5 py-3 text-white/50">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                          }) : "N/A"}
                        </td>
                        <td className="px-5 py-3 text-white/50 capitalize">{sub.sectionType || "Unknown"}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            sub.isRead === "true"
                              ? "bg-white/5 text-white/40"
                              : "bg-[#D6FC51]/10 text-[#D6FC51]"
                          }`}>
                            {sub.isRead === "true" ? "Read" : "New"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                <p className="text-sm text-white/40">
                  Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-white/40">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
