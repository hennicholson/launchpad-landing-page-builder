"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Deployment = {
  id: string;
  projectId: string;
  status: string;
  url: string | null;
  errorMessage: string | null;
  errorCode: string | null;
  retryCount: number;
  maxRetries: number;
  isFatal: string | null;
  lastAttemptAt: string | null;
  createdAt: string;
  netlifyDeployId: string | null;
  projectName: string | null;
  projectSlug: string | null;
  userName: string | null;
  userEmail: string | null;
};

type Stats = {
  total: number;
  pending: number;
  building: number;
  ready: number;
  failed: number;
  retrying: number;
  successRate: string;
};

type ErrorBreakdown = {
  errorCode: string | null;
  count: number;
}[];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  building: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  retrying: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ready: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const ERROR_CODE_LABELS: Record<string, string> = {
  NPM_NETWORK: "npm Network Error",
  NPM_TIMEOUT: "npm Timeout",
  NPM_REGISTRY: "npm Registry Error",
  NPM_DEPENDENCY: "Dependency Error",
  BUILD_TYPESCRIPT: "TypeScript Error",
  BUILD_MEMORY: "Memory Error",
  BUILD_TIMEOUT: "Build Timeout",
  BUILD_UNKNOWN: "Unknown Build Error",
  NETLIFY_RATE_LIMIT: "Netlify Rate Limit",
  NETLIFY_TIMEOUT: "Netlify Timeout",
  NETLIFY_API: "Netlify API Error",
  NETLIFY_UPLOAD: "Upload Error",
  CONFIG_INVALID: "Invalid Config",
  AUTH_FAILED: "Auth Failed",
  UNKNOWN: "Unknown",
};

export default function AdminDeploysPage() {
  const router = useRouter();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [errorBreakdown, setErrorBreakdown] = useState<ErrorBreakdown>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [errorCodeFilter, setErrorCodeFilter] = useState<string>("");

  useEffect(() => {
    fetchDeployments();
  }, [statusFilter, errorCodeFilter]);

  async function fetchDeployments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (errorCodeFilter) params.set("errorCode", errorCodeFilter);

      const res = await fetch(`/api/admin/deployments?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 403) {
          throw new Error("Admin access required");
        }
        throw new Error("Failed to fetch deployments");
      }

      const data = await res.json();
      setDeployments(data.deployments);
      setStats(data.stats);
      setErrorBreakdown(data.errorBreakdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-white/60">{error}</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Back to Dashboard
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
            <h1 className="text-xl font-semibold">Deploy Monitoring</h1>
            <p className="text-sm text-white/50">Admin dashboard for deployment tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Back to Dashboard
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Total</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-emerald-400">{stats.ready}</p>
              <p className="text-xs text-emerald-400/70 uppercase tracking-wide">Ready</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
              <p className="text-xs text-red-400/70 uppercase tracking-wide">Failed</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-400">{stats.building}</p>
              <p className="text-xs text-blue-400/70 uppercase tracking-wide">Building</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              <p className="text-xs text-yellow-400/70 uppercase tracking-wide">Pending</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-orange-400">{stats.retrying}</p>
              <p className="text-xs text-orange-400/70 uppercase tracking-wide">Retrying</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-400">{stats.successRate}%</p>
              <p className="text-xs text-purple-400/70 uppercase tracking-wide">Success Rate</p>
            </div>
          </div>
        )}

        {/* Error Breakdown */}
        {errorBreakdown.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Error Breakdown</h2>
            <div className="flex flex-wrap gap-2">
              {errorBreakdown.map((item) => (
                <button
                  key={item.errorCode || "null"}
                  onClick={() => setErrorCodeFilter(item.errorCode || "")}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    errorCodeFilter === item.errorCode
                      ? "bg-amber-500/20 border-amber-500 text-amber-400"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {ERROR_CODE_LABELS[item.errorCode || ""] || item.errorCode || "Unknown"}: {item.count}
                </button>
              ))}
              {errorCodeFilter && (
                <button
                  onClick={() => setErrorCodeFilter("")}
                  className="px-3 py-1.5 rounded-lg text-sm bg-red-500/20 border border-red-500/30 text-red-400"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="building">Building</option>
            <option value="retrying">Retrying</option>
            <option value="ready">Ready</option>
            <option value="failed">Failed</option>
          </select>

          <button
            onClick={() => fetchDeployments()}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Deployments Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading deployments...</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">User</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Error</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Retries</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deployments.map((deploy) => (
                  <tr key={deploy.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          STATUS_COLORS[deploy.status] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {deploy.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{deploy.projectName || "—"}</p>
                        <p className="text-xs text-white/40">{deploy.projectSlug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{deploy.userName || "—"}</p>
                        <p className="text-xs text-white/40">{deploy.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {deploy.errorCode ? (
                        <div>
                          <p className="text-red-400 text-xs font-mono">
                            {ERROR_CODE_LABELS[deploy.errorCode] || deploy.errorCode}
                          </p>
                          <p className="text-xs text-white/40 truncate max-w-xs">
                            {deploy.errorMessage?.slice(0, 100)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {deploy.retryCount > 0 ? (
                        <span className="text-orange-400">
                          {deploy.retryCount}/{deploy.maxRetries}
                        </span>
                      ) : (
                        <span className="text-white/30">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {new Date(deploy.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {deployments.length === 0 && (
              <div className="text-center py-12 text-white/50">
                No deployments found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
