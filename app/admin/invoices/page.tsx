"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getAdminInvoices,
  getUsersForInvoice,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  adjustUserCredits,
  type AdminInvoice,
  type UserForInvoice,
} from "@/lib/actions/admin-billing";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  overdue: "bg-red-500/20 text-red-400 border-red-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<AdminInvoice[]>([]);
  const [users, setUsers] = useState<UserForInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Create invoice form state
  const [selectedUserId, setSelectedUserId] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceGraceDate, setInvoiceGraceDate] = useState("");
  const [creating, setCreating] = useState(false);

  // Adjust credits form state
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [invoicesResult, usersResult] = await Promise.all([
        getAdminInvoices(),
        getUsersForInvoice(),
      ]);

      if (invoicesResult.success && invoicesResult.invoices) {
        setInvoices(invoicesResult.invoices);
      }

      if (usersResult.success && usersResult.users) {
        setUsers(usersResult.users);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateInvoice() {
    if (!selectedUserId || !invoiceAmount || !invoiceDueDate) {
      setError("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      const result = await createInvoice({
        userId: selectedUserId,
        amountCents: Math.round(parseFloat(invoiceAmount) * 100),
        description: invoiceDescription,
        dueDate: new Date(invoiceDueDate),
        graceUntil: invoiceGraceDate ? new Date(invoiceGraceDate) : undefined,
      });

      if (result.success) {
        setShowCreateModal(false);
        setSelectedUserId("");
        setInvoiceAmount("");
        setInvoiceDescription("");
        setInvoiceDueDate("");
        setInvoiceGraceDate("");
        fetchData();
      } else {
        setError(result.error || "Failed to create invoice");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateStatus(invoiceId: string, status: "paid" | "cancelled") {
    try {
      const result = await updateInvoiceStatus(invoiceId, status);
      if (result.success) {
        fetchData();
      } else {
        setError(result.error || "Failed to update status");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleDeleteInvoice(invoiceId: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const result = await deleteInvoice(invoiceId);
      if (result.success) {
        fetchData();
      } else {
        setError(result.error || "Failed to delete invoice");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete invoice");
    }
  }

  async function handleAdjustCredits() {
    if (!adjustUserId || !adjustAmount) {
      setError("Please fill in all required fields");
      return;
    }

    setAdjusting(true);
    try {
      const result = await adjustUserCredits({
        userId: adjustUserId,
        amountCents: Math.round(parseFloat(adjustAmount) * 100),
        description: adjustDescription || "Admin adjustment",
      });

      if (result.success) {
        setShowAdjustModal(false);
        setAdjustUserId("");
        setAdjustAmount("");
        setAdjustDescription("");
        fetchData();
      } else {
        setError(result.error || "Failed to adjust credits");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to adjust credits");
    } finally {
      setAdjusting(false);
    }
  }

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

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Invoice Management</h1>
            <p className="text-sm text-white/50">Create and manage user invoices</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/deploys"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Deploys
            </Link>
            <Link
              href="/admin/subscribers"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Subscribers
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Toast */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Invoice
          </button>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"
              />
            </svg>
            Adjust Credits
          </button>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-2xl font-bold">{invoices.length}</p>
            <p className="text-xs text-white/50 uppercase tracking-wide">Total Invoices</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">
              {invoices.filter((i) => i.status === "pending").length}
            </p>
            <p className="text-xs text-yellow-400/70 uppercase tracking-wide">Pending</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-400">
              {invoices.filter((i) => i.status === "overdue").length}
            </p>
            <p className="text-xs text-red-400/70 uppercase tracking-wide">Overdue</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-emerald-400">
              {formatCurrency(
                invoices
                  .filter((i) => i.status === "pending" || i.status === "overdue")
                  .reduce((sum, i) => sum + i.amountCents, 0)
              )}
            </p>
            <p className="text-xs text-emerald-400/70 uppercase tracking-wide">Outstanding</p>
          </div>
        </div>

        {/* Invoices Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading invoices...</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">User</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Description</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Due Date</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Grace Until</th>
                  <th className="text-left px-4 py-3 font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          STATUS_COLORS[invoice.status] || "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{invoice.userName || "—"}</p>
                        <p className="text-xs text-white/40">{invoice.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">
                      {invoice.description || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(invoice.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {invoice.graceUntil ? formatDate(invoice.graceUntil) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {invoice.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(invoice.id, "paid")}
                              className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(invoice.id, "cancelled")}
                              className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded hover:bg-gray-500/30 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {invoices.length === 0 && (
              <div className="text-center py-12 text-white/50">No invoices found</div>
            )}
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1b] rounded-xl border border-white/10 p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Create Invoice</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">User *</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email || user.username || user.id} ({formatCurrency(user.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="29.00"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <input
                  type="text"
                  value={invoiceDescription}
                  onChange={(e) => setInvoiceDescription(e.target.value)}
                  placeholder="Pro subscription - January 2025"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={invoiceDueDate}
                  onChange={(e) => setInvoiceDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Grace Period Until</label>
                <input
                  type="date"
                  value={invoiceGraceDate}
                  onChange={(e) => setInvoiceGraceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvoice}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Credits Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1b] rounded-xl border border-white/10 p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Adjust User Credits</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">User *</label>
                <select
                  value={adjustUserId}
                  onChange={(e) => setAdjustUserId(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email || user.username || user.id} ({formatCurrency(user.balanceCents)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Amount (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="10.00 (positive to add, negative to remove)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-white/40 mt-1">Use negative values to deduct credits</p>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1">Reason</label>
                <input
                  type="text"
                  value={adjustDescription}
                  onChange={(e) => setAdjustDescription(e.target.value)}
                  placeholder="Admin adjustment - refund"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustCredits}
                disabled={adjusting}
                className="flex-1 px-4 py-2 bg-emerald-500 text-black rounded-lg text-sm font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                {adjusting ? "Adjusting..." : "Adjust Credits"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
