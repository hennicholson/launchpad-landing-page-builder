"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

type DnsInstruction = {
  recordType: "CNAME" | "A" | "TXT" | "ALIAS";
  host: string;
  value: string;
  purpose: "verification" | "routing";
  required: boolean;
};

type NamecheapDnsGuideProps = {
  domain: string;
  domainType: "apex" | "subdomain";
  instructions: DnsInstruction[];
};

export function NamecheapDnsGuide({ domain, domainType, instructions }: NamecheapDnsGuideProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number>(1);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const verificationRecord = instructions.find((i) => i.purpose === "verification");
  const routingRecord = instructions.find((i) => i.purpose === "routing" && i.required);

  // Parse the TXT host for Namecheap format
  // Namecheap wants just the subdomain part, not the full domain
  // e.g., "_launchpad.example.com" becomes "_launchpad"
  // e.g., "_launchpad.app.example.com" becomes "_launchpad.app"
  const getTxtHost = () => {
    if (!verificationRecord) return "_launchpad";
    const host = verificationRecord.host;
    // Remove the main domain from the end
    const parts = domain.split(".");
    const mainDomain = parts.slice(-2).join("."); // e.g., "example.com"
    return host.replace(`.${mainDomain}`, "");
  };

  // For CNAME/A records, get the host portion for Namecheap
  const getRoutingHost = () => {
    if (domainType === "apex") return "@";
    // For subdomains, just return the subdomain part
    // e.g., "app.example.com" -> "app"
    const parts = domain.split(".");
    return parts.slice(0, -2).join(".");
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="p-1.5 hover:bg-white/10 rounded transition-colors group"
      title="Copy"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-500 group-hover:text-white" />
      )}
    </button>
  );

  const StepHeader = ({ step, title, isExpanded }: { step: number; title: string; isExpanded: boolean }) => (
    <button
      onClick={() => setExpandedStep(isExpanded ? 0 : step)}
      className="w-full flex items-center gap-3 text-left py-3"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 text-sm font-bold flex-shrink-0">
        {step}
      </span>
      <span className="text-sm font-semibold text-white flex-1">{title}</span>
      {isExpanded ? (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronRight className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Namecheap Header */}
      <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path fill="#DE3723" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-white">Namecheap DNS Setup</h3>
          <p className="text-xs text-gray-400">Follow these steps to connect {domain}</p>
        </div>
        <a
          href="https://ap.www.namecheap.com/domains/list/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded transition-colors flex items-center gap-1"
        >
          Open Namecheap
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Visual Guide - Where to find Host Records */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Where to find Host Records in Namecheap:</h4>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">Domain List</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">Manage</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">Nameservers: BasicDNS</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">Advanced DNS tab</span>
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30">Host Records</span>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          You must have <strong className="text-orange-400">Namecheap BasicDNS</strong> selected (not Custom DNS) to see the Host Records section.
        </p>
      </div>

      {/* Step 1: Enable BasicDNS and Go to Advanced DNS */}
      <div className="bg-black/30 rounded-lg overflow-hidden">
        <StepHeader step={1} title="Enable BasicDNS & Go to Advanced DNS" isExpanded={expandedStep === 1} />
        {expandedStep === 1 && (
          <div className="px-4 pb-4 space-y-3">
            <ol className="text-sm text-gray-300 space-y-3 list-decimal list-inside">
              <li>Log in to your <a href="https://www.namecheap.com/myaccount/login/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Namecheap account</a></li>
              <li>Go to <strong className="text-white">Domain List</strong> in the left sidebar</li>
              <li>Find <strong className="text-white">{domain.split(".").slice(-2).join(".")}</strong> and click <strong className="text-white">Manage</strong></li>
              <li>
                <strong className="text-white">Important:</strong> In the <strong className="text-white">Nameservers</strong> section, make sure it says <strong className="text-green-400">Namecheap BasicDNS</strong>
                <div className="mt-2 ml-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-400">
                  If you see "Custom DNS" with ns1/ns2 fields, click the dropdown and select <strong>Namecheap BasicDNS</strong> instead. This enables you to add custom DNS records.
                </div>
              </li>
              <li>Click the <strong className="text-white">Advanced DNS</strong> tab at the top</li>
              <li>Scroll down to the <strong className="text-white">Host Records</strong> section - this is where you'll add the records</li>
            </ol>

            <div className="bg-black/40 rounded p-3 text-xs space-y-2">
              <div className="text-gray-400">
                <strong className="text-gray-300">Path:</strong> Dashboard → Domain List → Manage → Set Nameservers to BasicDNS → Advanced DNS tab → Host Records
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <p className="text-xs text-blue-400">
                <strong>Note:</strong> If your domain is currently using Custom DNS (pointing to another provider like Cloudflare), switching to BasicDNS will take over DNS management. Your existing DNS records from the other provider won't transfer automatically.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Add TXT Record for Verification */}
      <div className="bg-black/30 rounded-lg overflow-hidden">
        <StepHeader step={2} title="Add TXT Record (Verification)" isExpanded={expandedStep === 2} />
        {expandedStep === 2 && verificationRecord && (
          <div className="px-4 pb-4 space-y-3">
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside mb-4">
              <li>In the <strong className="text-white">Host Records</strong> section, click the <strong className="text-white">Add New Record</strong> button</li>
              <li>A new row will appear with dropdown menus</li>
              <li>Fill in the fields as shown below:</li>
            </ol>

            <div className="bg-black/40 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium w-24">Field</th>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium">What to enter</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">Type</td>
                    <td className="px-3 py-2.5">
                      Select <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-mono">TXT Record</span> from dropdown
                    </td>
                    <td></td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">Host</td>
                    <td className="px-3 py-2.5">
                      <code className="px-2 py-1 bg-white/10 rounded font-mono text-white">{getTxtHost()}</code>
                    </td>
                    <td className="px-2">
                      <CopyButton text={getTxtHost()} field="txt-host" />
                    </td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">Value</td>
                    <td className="px-3 py-2.5">
                      <code className="px-2 py-1 bg-white/10 rounded font-mono text-white text-xs break-all">{verificationRecord.value}</code>
                    </td>
                    <td className="px-2">
                      <CopyButton text={verificationRecord.value} field="txt-value" />
                    </td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">TTL</td>
                    <td className="px-3 py-2.5 text-white">Leave as <strong>Automatic</strong> (or 30 min)</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
              <Check className="w-4 h-4" />
              Click the green checkmark (✓) to save the record
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Add CNAME or A Record */}
      <div className="bg-black/30 rounded-lg overflow-hidden">
        <StepHeader
          step={3}
          title={domainType === "apex" ? "Add A Record (Routing)" : "Add CNAME Record (Routing)"}
          isExpanded={expandedStep === 3}
        />
        {expandedStep === 3 && routingRecord && (
          <div className="px-4 pb-4 space-y-3">
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside mb-4">
              <li>Click <strong className="text-white">Add New Record</strong> again to add another row</li>
              <li>This record routes visitors to your site:</li>
            </ol>

            <div className="bg-black/40 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium w-24">Field</th>
                    <th className="text-left px-3 py-2 text-gray-400 font-medium">What to enter</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">Type</td>
                    <td className="px-3 py-2.5">
                      Select <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                        {domainType === "apex" ? "A Record" : "CNAME Record"}
                      </span> from dropdown
                    </td>
                    <td></td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">Host</td>
                    <td className="px-3 py-2.5">
                      <code className="px-2 py-1 bg-white/10 rounded font-mono text-white">{getRoutingHost()}</code>
                      {domainType === "apex" && (
                        <span className="ml-2 text-xs text-gray-500">(@ means root domain)</span>
                      )}
                    </td>
                    <td className="px-2">
                      <CopyButton text={getRoutingHost()} field="route-host" />
                    </td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">{domainType === "apex" ? "Value/IP Address" : "Target"}</td>
                    <td className="px-3 py-2.5">
                      <code className="px-2 py-1 bg-white/10 rounded font-mono text-white">{routingRecord.value}</code>
                    </td>
                    <td className="px-2">
                      <CopyButton text={routingRecord.value} field="route-value" />
                    </td>
                  </tr>
                  <tr className="border-t border-white/5">
                    <td className="px-3 py-2.5 text-gray-400">TTL</td>
                    <td className="px-3 py-2.5 text-white">Leave as <strong>Automatic</strong></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {domainType === "apex" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                <p className="text-xs text-yellow-400">
                  <strong>Note:</strong> For apex domains (no www), you need an A record pointing to the IP address above.
                  For better reliability, you might also want to add a CNAME for <code className="bg-black/30 px-1 rounded">www</code> pointing to your Netlify site.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
              <Check className="w-4 h-4" />
              Click the green checkmark (✓) to save the record
            </div>
          </div>
        )}
      </div>

      {/* Step 4: Verify */}
      <div className="bg-black/30 rounded-lg overflow-hidden">
        <StepHeader step={4} title="Verify Your Domain" isExpanded={expandedStep === 4} />
        {expandedStep === 4 && (
          <div className="px-4 pb-4 space-y-3">
            <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
              <li>Wait 1-5 minutes for DNS to propagate (can take up to 48 hours)</li>
              <li>Click the <strong className="text-white">Verify DNS</strong> button above</li>
              <li>Once verified, SSL will be automatically provisioned</li>
            </ol>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
              <p className="text-xs text-blue-400">
                <strong>Tip:</strong> You can check if your DNS records are set up correctly using{" "}
                <a
                  href={`https://dnschecker.org/#TXT/${verificationRecord?.host || domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  DNS Checker
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Quick Reference - Records to Add</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-mono">TXT</span>
            <span className="text-gray-400">Host:</span>
            <code className="text-white">{getTxtHost()}</code>
            <CopyButton text={getTxtHost()} field="quick-txt-host" />
          </div>
          <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-mono">TXT</span>
            <span className="text-gray-400">Value:</span>
            <code className="text-white truncate max-w-[200px]">{verificationRecord?.value}</code>
            <CopyButton text={verificationRecord?.value || ""} field="quick-txt-value" />
          </div>
          <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-mono">
              {domainType === "apex" ? "A" : "CNAME"}
            </span>
            <span className="text-gray-400">Host:</span>
            <code className="text-white">{getRoutingHost()}</code>
            <CopyButton text={getRoutingHost()} field="quick-route-host" />
          </div>
          <div className="flex items-center gap-2 p-2 bg-black/30 rounded">
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-mono">
              {domainType === "apex" ? "A" : "CNAME"}
            </span>
            <span className="text-gray-400">Value:</span>
            <code className="text-white">{routingRecord?.value}</code>
            <CopyButton text={routingRecord?.value || ""} field="quick-route-value" />
          </div>
        </div>
      </div>
    </div>
  );
}
