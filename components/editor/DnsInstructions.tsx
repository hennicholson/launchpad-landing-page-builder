"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

type DnsInstruction = {
  recordType: "CNAME" | "A" | "TXT" | "ALIAS";
  host: string;
  value: string;
  purpose: "verification" | "routing";
  required: boolean;
};

type DnsInstructionsProps = {
  domain: string;
  domainType: "apex" | "subdomain";
  instructions: DnsInstruction[];
};

const DNS_PROVIDERS = [
  { name: "Cloudflare", url: "https://dash.cloudflare.com" },
  { name: "GoDaddy", url: "https://dcc.godaddy.com/manage/dns" },
  { name: "Namecheap", url: "https://www.namecheap.com/myaccount/login" },
  { name: "Google Domains", url: "https://domains.google.com" },
  { name: "AWS Route 53", url: "https://console.aws.amazon.com/route53" },
];

export function DnsInstructions({ domain, domainType, instructions }: DnsInstructionsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const verificationRecords = instructions.filter((i) => i.purpose === "verification");
  const routingRecords = instructions.filter((i) => i.purpose === "routing" && i.required);

  return (
    <div className="space-y-6">
      {/* Step 1: Verification */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
            1
          </span>
          Add verification record
        </h4>
        <p className="text-xs text-gray-400 mb-3">
          Add this TXT record to prove you own this domain:
        </p>
        <div className="bg-black/30 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Type</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Host/Name</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Value</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {verificationRecords.map((record, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-3 py-2 text-white font-mono">{record.recordType}</td>
                  <td className="px-3 py-2 text-white font-mono text-[11px]">{record.host}</td>
                  <td className="px-3 py-2 text-white font-mono text-[11px] break-all">{record.value}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => copyToClipboard(record.value, i)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy value"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 2: Routing */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
            2
          </span>
          Add routing record
        </h4>
        <p className="text-xs text-gray-400 mb-3">
          {domainType === "apex"
            ? "Add this A record to route traffic to your site:"
            : "Add this CNAME record to route traffic to your site:"}
        </p>
        <div className="bg-black/30 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Type</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Host/Name</th>
                <th className="text-left px-3 py-2 text-gray-400 font-medium">Value</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {routingRecords.map((record, i) => (
                <tr key={i} className="border-t border-white/5">
                  <td className="px-3 py-2 text-white font-mono">{record.recordType}</td>
                  <td className="px-3 py-2 text-white font-mono text-[11px]">
                    {domainType === "apex" ? "@" : record.host.split(".")[0]}
                  </td>
                  <td className="px-3 py-2 text-white font-mono text-[11px]">{record.value}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => copyToClipboard(record.value, i + 100)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy value"
                    >
                      {copiedIndex === i + 100 ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {domainType === "apex" && (
          <p className="text-xs text-gray-500 mt-2">
            Tip: If your DNS provider supports ALIAS or ANAME records, you can use those instead of A records
            for better performance.
          </p>
        )}
      </div>

      {/* DNS Provider Links */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-2">
          Common DNS providers
        </h4>
        <div className="flex flex-wrap gap-2">
          {DNS_PROVIDERS.map((provider) => (
            <a
              key={provider.name}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-white/5 hover:bg-white/10 rounded transition-colors"
            >
              {provider.name}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-yellow-400 mb-1">
          DNS propagation
        </h4>
        <p className="text-xs text-gray-400">
          DNS changes can take 1-48 hours to propagate worldwide. If verification fails,
          wait a few minutes and try again.
        </p>
      </div>
    </div>
  );
}
