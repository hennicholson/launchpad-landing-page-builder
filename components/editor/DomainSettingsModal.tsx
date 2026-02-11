"use client";

import { useState, useEffect } from "react";
import { X, Globe, Loader2, CheckCircle, AlertCircle, Trash2, RefreshCw, Crown, Server, Settings2 } from "lucide-react";
import { DnsInstructions } from "./DnsInstructions";
import { NamecheapDnsGuide } from "./NamecheapDnsGuide";
import { NameserverInstructions } from "./NameserverInstructions";
import type { DomainStatus, DomainType } from "@/lib/schema";

type DnsProvider = "namecheap" | "cloudflare" | "godaddy" | "other";
type DnsMode = "netlify" | "manual";

type DnsInstruction = {
  recordType: "CNAME" | "A" | "TXT" | "ALIAS";
  host: string;
  value: string;
  purpose: "verification" | "routing";
  required: boolean;
};

type CustomDomainConfig = {
  domain: string | null;
  status: DomainStatus | null;
  domainType: DomainType | null;
  verificationToken: string | null;
  verifiedAt: Date | null;
  addedAt: Date | null;
  error: string | null;
  dnsInstructions: DnsInstruction[];
  netlifyTarget: string | null;
  sslStatus: string | null;
  useNetlifyDns: boolean;
  netlifyDnsZoneId: string | null;
  nameservers: string[] | null;
};

type DomainSettingsModalProps = {
  projectId: string;
  onClose: () => void;
};

const STATUS_DISPLAY: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending: { label: "Pending Verification", color: "text-yellow-400", icon: AlertCircle },
  verifying: { label: "Verifying...", color: "text-blue-400", icon: Loader2 },
  provisioning: { label: "Setting up SSL...", color: "text-blue-400", icon: Loader2 },
  active: { label: "Active", color: "text-green-400", icon: CheckCircle },
  failed: { label: "Failed", color: "text-red-400", icon: AlertCircle },
  expired: { label: "Verification Expired", color: "text-red-400", icon: AlertCircle },
};

export function DomainSettingsModal({ projectId, onClose }: DomainSettingsModalProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [domain, setDomain] = useState("");
  const [config, setConfig] = useState<CustomDomainConfig | null>(null);
  const [canUseCustomDomain, setCanUseCustomDomain] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dnsProvider, setDnsProvider] = useState<DnsProvider>("namecheap");
  const [dnsMode, setDnsMode] = useState<DnsMode>("netlify"); // Default to Netlify DNS (easier)

  // Fetch current domain config
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/projects/${projectId}/domain`);
        const data = await res.json();

        if (res.ok) {
          setConfig(data.config);
          setCanUseCustomDomain(data.canUseCustomDomain);
          if (data.config?.domain) {
            setDomain(data.config.domain);
          }
        } else {
          setError(data.error || "Failed to load domain settings");
        }
      } catch {
        setError("Failed to load domain settings");
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, [projectId]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.trim(),
          useNetlifyDns: dnsMode === "netlify",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setConfig(data.config);
      } else {
        setError(data.error || "Failed to add domain");
      }
    } catch {
      setError("Failed to add domain");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/domain/verify`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setConfig((prev) => prev ? {
          ...prev,
          status: data.status,
          sslStatus: data.sslStatus,
          error: data.error,
        } : null);

        if (!data.verified && data.error) {
          setError(data.error);
        }
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this custom domain?")) return;

    setRemoving(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConfig({
          domain: null,
          status: null,
          domainType: null,
          verificationToken: null,
          verifiedAt: null,
          addedAt: null,
          error: null,
          dnsInstructions: [],
          netlifyTarget: null,
          sslStatus: null,
          useNetlifyDns: false,
          netlifyDnsZoneId: null,
          nameservers: null,
        });
        setDomain("");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to remove domain");
      }
    } catch {
      setError("Failed to remove domain");
    } finally {
      setRemoving(false);
    }
  };

  const statusInfo = config?.status ? STATUS_DISPLAY[config.status] : null;
  const StatusIcon = statusInfo?.icon || AlertCircle;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Custom Domain</h2>
              <p className="text-xs text-gray-400">Connect your own domain</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          ) : !canUseCustomDomain ? (
            /* Pro plan required */
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pro Plan Required</h3>
              <p className="text-sm text-gray-400 mb-6">
                Custom domains are available on Pro and Enterprise plans.
                Upgrade to connect your own domain.
              </p>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Upgrade to Pro
              </a>
            </div>
          ) : !config?.domain ? (
            /* No domain - show add form */
            <form onSubmit={handleAddDomain} className="space-y-5">
              {/* Domain input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Enter your domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example.com or app.example.com"
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={submitting}
                />
                <p className="mt-2 text-xs text-gray-400">
                  You can use apex domains (example.com) or subdomains (app.example.com)
                </p>
              </div>

              {/* DNS Mode Selector */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Setup method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDnsMode("netlify")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      dnsMode === "netlify"
                        ? "bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Server className={`w-4 h-4 ${dnsMode === "netlify" ? "text-emerald-400" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${dnsMode === "netlify" ? "text-emerald-400" : "text-white"}`}>
                        Automatic
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Change nameservers once, we handle everything
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDnsMode("manual")}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      dnsMode === "manual"
                        ? "bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/30"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Settings2 className={`w-4 h-4 ${dnsMode === "manual" ? "text-blue-400" : "text-gray-400"}`} />
                      <span className={`text-sm font-medium ${dnsMode === "manual" ? "text-blue-400" : "text-white"}`}>
                        Manual DNS
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Add DNS records yourself (advanced)
                    </p>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!domain.trim() || submitting}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {dnsMode === "netlify" ? "Setting up DNS..." : "Adding Domain..."}
                  </>
                ) : (
                  "Add Domain"
                )}
              </button>
            </form>
          ) : (
            /* Domain configured - show status */
            <div className="space-y-6">
              {/* Current domain */}
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Domain</span>
                    {config.useNetlifyDns && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                        Automatic DNS
                      </span>
                    )}
                  </div>
                  {statusInfo && (
                    <span className={`flex items-center gap-1.5 text-xs ${statusInfo.color}`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${config.status === "verifying" || config.status === "provisioning" ? "animate-spin" : ""}`} />
                      {statusInfo.label}
                    </span>
                  )}
                </div>
                <p className="text-lg font-mono text-white">{config.domain}</p>
                {config.status === "active" && (
                  <a
                    href={`https://${config.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                  >
                    Visit site →
                  </a>
                )}
              </div>

              {/* SSL Status */}
              {config.status === "active" && config.sslStatus && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">SSL:</span>
                  <span className={config.sslStatus === "ready" ? "text-green-400" : "text-yellow-400"}>
                    {config.sslStatus === "ready" ? "Active" : "Provisioning..."}
                  </span>
                </div>
              )}

              {/* Error message */}
              {(error || config.error) && config.status !== "active" && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error || config.error}</p>
                </div>
              )}

              {/* Instructions (for pending status) */}
              {config.status === "pending" && (
                <>
                  {/* Netlify DNS mode - show nameservers */}
                  {config.useNetlifyDns && config.nameservers && config.nameservers.length > 0 && (
                    <NameserverInstructions
                      domain={config.domain}
                      nameservers={config.nameservers}
                    />
                  )}

                  {/* Manual DNS mode - show DNS instructions */}
                  {!config.useNetlifyDns && config.dnsInstructions.length > 0 && (
                    <div className="space-y-4">
                      {/* DNS Provider Selector */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Select your DNS provider
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          <button
                            onClick={() => setDnsProvider("namecheap")}
                            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                              dnsProvider === "namecheap"
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            Namecheap
                          </button>
                          <button
                            onClick={() => setDnsProvider("cloudflare")}
                            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                              dnsProvider === "cloudflare"
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            Cloudflare
                          </button>
                          <button
                            onClick={() => setDnsProvider("godaddy")}
                            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                              dnsProvider === "godaddy"
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            GoDaddy
                          </button>
                          <button
                            onClick={() => setDnsProvider("other")}
                            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                              dnsProvider === "other"
                                ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                            }`}
                          >
                            Other
                          </button>
                        </div>
                      </div>

                      {/* Provider-specific guide */}
                      {dnsProvider === "namecheap" ? (
                        <NamecheapDnsGuide
                          domain={config.domain}
                          domainType={config.domainType || "subdomain"}
                          instructions={config.dnsInstructions}
                        />
                      ) : (
                        <DnsInstructions
                          domain={config.domain}
                          domainType={config.domainType || "subdomain"}
                          instructions={config.dnsInstructions}
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {(config.status === "pending" || config.status === "failed" || config.status === "expired") && (
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {config.useNetlifyDns ? "Checking Nameservers..." : "Verifying..."}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        {config.useNetlifyDns ? "Check Nameservers" : "Verify DNS"}
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={handleRemove}
                  disabled={removing}
                  className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                >
                  {removing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
