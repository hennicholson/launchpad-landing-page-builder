"use client";

import { useState } from "react";
import { Check, Copy, Server, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

type NameserverInstructionsProps = {
  domain: string;
  nameservers: string[];
};

export function NameserverInstructions({ domain, nameservers }: NameserverInstructionsProps) {
  const [copiedNs, setCopiedNs] = useState<string | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNs(text);
      setTimeout(() => setCopiedNs(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Server className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-emerald-400 mb-1">
              Automatic Setup with Netlify DNS
            </h4>
            <p className="text-xs text-gray-400">
              Just change your nameservers once and we&apos;ll handle everything automatically -
              SSL certificates, DNS records, and routing.
            </p>
          </div>
        </div>
      </div>

      {/* Nameservers to add */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Update your nameservers to:
        </label>
        <div className="space-y-2">
          {nameservers.map((ns, index) => (
            <div
              key={ns}
              className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono">NS{index + 1}</span>
                <span className="text-sm font-mono text-white">{ns}</span>
              </div>
              <button
                onClick={() => copyToClipboard(ns)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Copy nameserver"
              >
                {copiedNs === ns ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions accordion */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="text-sm font-medium text-white">
            How to change nameservers at Namecheap
          </span>
          {showSteps ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {showSteps && (
          <div className="p-4 space-y-3">
            <ol className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-orange-400 font-medium">1.</span>
                <span>Log in to <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">namecheap.com</a></span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400 font-medium">2.</span>
                <span>Go to <strong className="text-white">Domain List</strong> → click <strong className="text-white">Manage</strong> next to <code className="text-orange-400">{domain}</code></span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400 font-medium">3.</span>
                <span>In the <strong className="text-white">Nameservers</strong> section, select <strong className="text-white">Custom DNS</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400 font-medium">4.</span>
                <span>Replace existing nameservers with the Netlify nameservers above</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400 font-medium">5.</span>
                <span>Click the <strong className="text-white">green checkmark</strong> to save</span>
              </li>
            </ol>

            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400">
                <strong>Note:</strong> Nameserver changes can take up to 48 hours to propagate globally,
                but usually complete within 1-2 hours. Click &quot;Verify&quot; to check the status.
              </p>
            </div>

            <a
              href="https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Namecheap help article
            </a>
          </div>
        )}
      </div>

      {/* Other providers */}
      <div className="text-xs text-gray-500">
        Using a different registrar? Look for &quot;Nameservers&quot; or &quot;DNS Settings&quot; in your domain management panel.
      </div>
    </div>
  );
}
