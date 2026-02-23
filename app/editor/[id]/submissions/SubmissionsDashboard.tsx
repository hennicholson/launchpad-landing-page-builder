"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Search,
  Mail,
  Users,
  TrendingUp,
  BarChart3,
  Eye,
  BookOpen,
  Trash2,
  X,
} from "lucide-react";

type Submission = {
  id: string;
  email: string | null;
  fields: Record<string, string> | null;
  sectionId: string | null;
  sectionType: string | null;
  sourceUrl: string | null;
  referrer: string | null;
  userAgent: string | null;
  ipCountry: string | null;
  sessionId: string | null;
  isRead: string | null;
  notes: string | null;
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

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) =>
      String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))
    );
}

function parseUserAgent(ua: string): string {
  const browser =
    ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/)?.[1] || "Unknown";
  const os =
    ua
      .match(/(Windows|Mac OS X|Linux|Android|iOS)/)?.[1]
      ?.replace("Mac OS X", "macOS") || "Unknown";
  return `${browser} on ${os}`;
}

function formatHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default function SubmissionsDashboard({
  projectId,
  projectName,
  userPlan,
}: Props) {
  const isPro = userPlan === "pro" || userPlan === "enterprise";

  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Detail drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(
    null
  );
  const [drawerEmail, setDrawerEmail] = useState("");
  const [drawerNotes, setDrawerNotes] = useState("");

  // Inline confirm state for delete buttons
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const confirmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bulkConfirmTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      const res = await fetch(
        `/api/forms/${projectId}/submissions?${params}`
      );
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

  // Cleanup confirm timers
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      if (bulkConfirmTimerRef.current)
        clearTimeout(bulkConfirmTimerRef.current);
    };
  }, []);

  const handleExportCSV = () => {
    window.open(`/api/forms/${projectId}/submissions?format=csv`, "_blank");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  // --- Selection handlers ---
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map((s) => s.id)));
    }
  };

  // --- Bulk actions ---
  const handleBulkMarkRead = async (isRead: string) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await fetch(`/api/forms/${projectId}/submissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, isRead }),
      });
      setSelectedIds(new Set());
      await Promise.all([fetchSubmissions(), fetchStats()]);
    } catch (e) {
      console.error("Bulk update failed:", e);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirmBulkDelete) {
      setConfirmBulkDelete(true);
      bulkConfirmTimerRef.current = setTimeout(
        () => setConfirmBulkDelete(false),
        3000
      );
      return;
    }
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await fetch(`/api/forms/${projectId}/submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setSelectedIds(new Set());
      setConfirmBulkDelete(false);
      await Promise.all([fetchSubmissions(), fetchStats()]);
    } catch (e) {
      console.error("Bulk delete failed:", e);
    }
  };

  // --- Single row actions ---
  const handleToggleRead = async (sub: Submission) => {
    const newVal = sub.isRead === "true" ? "false" : "true";
    try {
      await fetch(`/api/forms/${projectId}/submissions/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: newVal }),
      });
      await Promise.all([fetchSubmissions(), fetchStats()]);
    } catch (e) {
      console.error("Toggle read failed:", e);
    }
  };

  const handleSingleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = setTimeout(
        () => setConfirmDeleteId(null),
        3000
      );
      return;
    }
    try {
      await fetch(`/api/forms/${projectId}/submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setConfirmDeleteId(null);
      if (activeSubmission?.id === id) {
        setDrawerOpen(false);
        setActiveSubmission(null);
      }
      await Promise.all([fetchSubmissions(), fetchStats()]);
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  // --- Drawer ---
  const openDrawer = async (sub: Submission) => {
    setActiveSubmission(sub);
    setDrawerEmail(sub.email || "");
    setDrawerNotes(sub.notes || "");
    setDrawerOpen(true);

    // Auto-mark as read
    if (sub.isRead !== "true") {
      try {
        await fetch(`/api/forms/${projectId}/submissions/${sub.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: "true" }),
        });
        await Promise.all([fetchSubmissions(), fetchStats()]);
      } catch (e) {
        console.error("Auto mark read failed:", e);
      }
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setActiveSubmission(null), 300);
  };

  const handleSaveEmail = async () => {
    if (!activeSubmission) return;
    try {
      await fetch(
        `/api/forms/${projectId}/submissions/${activeSubmission.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: drawerEmail }),
        }
      );
      await fetchSubmissions();
    } catch (e) {
      console.error("Save email failed:", e);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeSubmission) return;
    try {
      await fetch(
        `/api/forms/${projectId}/submissions/${activeSubmission.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: drawerNotes }),
        }
      );
      await fetchSubmissions();
    } catch (e) {
      console.error("Save notes failed:", e);
    }
  };

  const handleDrawerToggleRead = async () => {
    if (!activeSubmission) return;
    const newVal = activeSubmission.isRead === "true" ? "false" : "true";
    try {
      await fetch(
        `/api/forms/${projectId}/submissions/${activeSubmission.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: newVal }),
        }
      );
      setActiveSubmission({ ...activeSubmission, isRead: newVal });
      await Promise.all([fetchSubmissions(), fetchStats()]);
    } catch (e) {
      console.error("Toggle read failed:", e);
    }
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
            <h2 className="text-2xl font-bold mb-3">
              Unlock Form Submissions
            </h2>
            <p className="text-white/60 mb-6">
              Upgrade to Pro to collect email submissions from your landing
              pages and track conversions with a powerful dashboard.
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

    return (
      <div className="h-48 px-2">
        <svg
          viewBox={`0 0 ${days.length * 20} ${chartHeight + 20}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
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
            d={days
              .map(
                (d, i) =>
                  `${i === 0 ? "M" : "L"} ${i * 20 + 10} ${chartHeight - (d.count / maxCount) * chartHeight}`
              )
              .join(" ")}
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
                <span className="text-white/50 text-sm">
                  Total Submissions
                </span>
              </div>
              <p className="text-3xl font-bold">
                {stats?.totalSubmissions ?? "..."}
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-white/50 text-sm">Unique Emails</span>
              </div>
              <p className="text-3xl font-bold">
                {stats?.uniqueEmails ?? "..."}
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/50 text-sm">This Week</span>
              </div>
              <p className="text-3xl font-bold">
                {stats?.thisWeek ?? "..."}
              </p>
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
            <h3 className="text-sm font-medium text-white/60 mb-4">
              Submissions (Last 30 Days)
            </h3>
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

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
              <div className="px-5 py-3 bg-white/[0.04] border-b border-white/5 flex items-center gap-3">
                <span className="text-sm text-white/70 font-medium">
                  {selectedIds.size} selected
                </span>
                <div className="h-4 w-px bg-white/10" />
                <button
                  onClick={() => handleBulkMarkRead("true")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkMarkRead("false")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors"
                >
                  Mark Unread
                </button>
                <button
                  onClick={handleBulkDelete}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    confirmBulkDelete
                      ? "bg-red-500/20 border-red-500/30 text-red-400"
                      : "bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
                  }`}
                >
                  {confirmBulkDelete ? "Confirm?" : "Delete"}
                </button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        checked={
                          submissions.length > 0 &&
                          selectedIds.size === submissions.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-white/20 bg-white/5 accent-[#D6FC51] w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Email
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Country
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Source
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 text-white/40 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        <td className="px-3 py-3">
                          <div className="h-4 w-4 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3">
                          <div className="h-4 w-20 bg-white/5 rounded animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-white/30"
                      >
                        No submissions yet. Deploy your page with email capture
                        forms to start collecting leads.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr
                        key={sub.id}
                        onClick={() => openDrawer(sub)}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <td
                          className="px-3 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.has(sub.id)}
                            onChange={() => toggleSelect(sub.id)}
                            className="rounded border-white/20 bg-white/5 accent-[#D6FC51] w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-5 py-3 text-white/80">
                          {sub.email || "N/A"}
                        </td>
                        <td className="px-5 py-3 text-white/50">
                          {sub.ipCountry ? (
                            <span>
                              {countryFlag(sub.ipCountry)} {sub.ipCountry}
                            </span>
                          ) : (
                            <span className="text-white/20">--</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-white/50">
                          {sub.sourceUrl
                            ? formatHostname(sub.sourceUrl)
                            : sub.sectionType
                              ? sub.sectionType.charAt(0).toUpperCase() +
                                sub.sectionType.slice(1)
                              : "--"}
                        </td>
                        <td className="px-5 py-3 text-white/50">
                          {sub.createdAt
                            ? new Date(sub.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                              sub.isRead === "true"
                                ? "bg-white/5 text-white/40"
                                : "bg-[#D6FC51]/10 text-[#D6FC51]"
                            }`}
                          >
                            {sub.isRead === "true" ? "Read" : "New"}
                          </span>
                        </td>
                        <td
                          className="px-5 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openDrawer(sub)}
                              className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleRead(sub)}
                              className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                              title={
                                sub.isRead === "true"
                                  ? "Mark as unread"
                                  : "Mark as read"
                              }
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSingleDelete(sub.id)}
                              className={`p-1.5 rounded-md transition-colors ${
                                confirmDeleteId === sub.id
                                  ? "bg-red-500/20 text-red-400"
                                  : "hover:bg-white/10 text-white/40 hover:text-red-400"
                              }`}
                              title={
                                confirmDeleteId === sub.id
                                  ? "Click again to confirm"
                                  : "Delete"
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                  Showing {(page - 1) * 20 + 1}-
                  {Math.min(page * 20, total)} of {total}
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

      {/* Detail Slide-Over Panel */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-zinc-950 border-l border-white/5 shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {activeSubmission && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
              <h2 className="text-lg font-semibold">Submission Details</h2>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={drawerEmail}
                  onChange={(e) => setDrawerEmail(e.target.value)}
                  onBlur={handleSaveEmail}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              {/* Submitted */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  Submitted
                </label>
                <p className="text-sm text-white/80">
                  {activeSubmission.createdAt
                    ? new Date(activeSubmission.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  Country
                </label>
                <p className="text-sm text-white/80">
                  {activeSubmission.ipCountry ? (
                    <span>
                      {countryFlag(activeSubmission.ipCountry)}{" "}
                      {activeSubmission.ipCountry}
                    </span>
                  ) : (
                    <span className="text-white/30">Unknown</span>
                  )}
                </p>
              </div>

              {/* Source URL */}
              {activeSubmission.sourceUrl && (
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">
                    Source URL
                  </label>
                  <a
                    href={activeSubmission.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline break-all transition-colors"
                  >
                    {activeSubmission.sourceUrl}
                  </a>
                </div>
              )}

              {/* Referrer */}
              {activeSubmission.referrer && (
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">
                    Referrer
                  </label>
                  <a
                    href={activeSubmission.referrer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline break-all transition-colors"
                  >
                    {activeSubmission.referrer}
                  </a>
                </div>
              )}

              {/* Browser */}
              {activeSubmission.userAgent && (
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">
                    Browser
                  </label>
                  <p className="text-sm text-white/80">
                    {parseUserAgent(activeSubmission.userAgent)}
                  </p>
                </div>
              )}

              {/* Section */}
              {activeSubmission.sectionType && (
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">
                    Section
                  </label>
                  <p className="text-sm text-white/80 capitalize">
                    {activeSubmission.sectionType}
                  </p>
                </div>
              )}

              {/* Custom Fields */}
              {activeSubmission.fields &&
                Object.keys(activeSubmission.fields).length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-2">
                      Custom Fields
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(activeSubmission.fields).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white/[0.03] border border-white/5 rounded-lg p-3"
                          >
                            <p className="text-[11px] text-white/40 font-medium mb-0.5">
                              {key}
                            </p>
                            <p className="text-sm text-white/80 break-words">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  Notes
                </label>
                <textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors resize-none"
                  placeholder="Add notes about this submission..."
                />
              </div>

              {/* Status toggle */}
              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">
                  Status
                </label>
                <button
                  onClick={handleDrawerToggleRead}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    activeSubmission.isRead === "true"
                      ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      : "bg-[#D6FC51]/10 border-[#D6FC51]/20 text-[#D6FC51] hover:bg-[#D6FC51]/20"
                  }`}
                >
                  {activeSubmission.isRead === "true"
                    ? "Mark as Unread"
                    : "Mark as Read"}
                </button>
              </div>
            </div>

            {/* Drawer Footer - Delete */}
            <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button
                onClick={() => handleSingleDelete(activeSubmission.id)}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  confirmDeleteId === activeSubmission.id
                    ? "bg-red-500/20 border-red-500/30 text-red-400"
                    : "bg-white/5 border-red-500/20 text-red-400 hover:bg-red-500/10"
                }`}
              >
                {confirmDeleteId === activeSubmission.id
                  ? "Click again to confirm"
                  : "Delete Submission"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
