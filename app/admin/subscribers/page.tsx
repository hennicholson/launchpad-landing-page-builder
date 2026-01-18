"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Subscriber = {
  id: string;
  whopId: string;
  whopUniqueId: string | null;
  email: string | null;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  projectCount: number;
  deployCount: number;
  lastLoginAt: string | null;
  createdAt: string;
};

type Stats = {
  total: number;
  free: number;
  starter: number;
  pro: number;
  enterprise: number;
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  starter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pro: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function AdminSubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string>("pro");

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter]);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (planFilter) params.set("plan", planFilter);

      const res = await fetch(`/api/admin/subscribers?${params}`);
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 403) {
          throw new Error("Admin access required");
        }
        throw new Error("Failed to fetch subscribers");
      }

      const data = await res.json();
      setSubscribers(data.subscribers);
      setStats(data.stats);
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
            <h1 className="text-xl font-semibold">Subscribers</h1>
            <p className="text-sm text-white/50">View users by subscription plan</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/deploys"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Deploys
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Dashboard
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Total Users</p>
            </div>
            <button
              onClick={() => setPlanFilter("free")}
              className={`rounded-xl p-4 transition-colors text-left ${
                planFilter === "free"
                  ? "bg-gray-500/20 border-2 border-gray-500"
                  : "bg-gray-500/10 border border-gray-500/20"
              }`}
            >
              <p className="text-2xl font-bold text-gray-400">{stats.free}</p>
              <p className="text-xs text-gray-400/70 uppercase tracking-wide">Free</p>
            </button>
            <button
              onClick={() => setPlanFilter("starter")}
              className={`rounded-xl p-4 transition-colors text-left ${
                planFilter === "starter"
                  ? "bg-blue-500/20 border-2 border-blue-500"
                  : "bg-blue-500/10 border border-blue-500/20"
              }`}
            >
              <p className="text-2xl font-bold text-blue-400">{stats.starter}</p>
              <p className="text-xs text-blue-400/70 uppercase tracking-wide">Starter</p>
            </button>
            <button
              onClick={() => setPlanFilter("pro")}
              className={`rounded-xl p-4 transition-colors text-left ${
                planFilter === "pro"
                  ? "bg-amber-500/20 border-2 border-amber-500"
                  : "bg-amber-500/10 border border-amber-500/20"
              }`}
            >
              <p className="text-2xl font-bold text-amber-400">{stats.pro}</p>
              <p className="text-xs text-amber-400/70 uppercase tracking-wide">Pro</p>
            </button>
            <button
              onClick={() => setPlanFilter("enterprise")}
              className={`rounded-xl p-4 transition-colors text-left ${
                planFilter === "enterprise"
                  ? "bg-purple-500/20 border-2 border-purple-500"
                  : "bg-purple-500/10 border border-purple-500/20"
              }`}
            >
              <p className="text-2xl font-bold text-purple-400">{stats.enterprise}</p>
              <p className="text-xs text-purple-400/70 uppercase tracking-wide">Enterprise</p>
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => fetchSubscribers()}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Subscribers Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading subscribers...</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-white/70">User</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Projects</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Deploys</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Last Login</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.username || "User"}
                            className="w-8 h-8 rounded-full bg-white/10"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-white/50 text-xs">
                              {(user.username || user.email || "?")[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name || user.username || "Unknown"}</p>
                          <p className="text-xs text-white/40">{user.email || user.whopUniqueId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border uppercase ${
                          PLAN_COLORS[user.plan] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70">{user.projectCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/70">{user.deployCount}</span>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {subscribers.length === 0 && (
              <div className="text-center py-12 text-white/50">
                No {planFilter} subscribers found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
