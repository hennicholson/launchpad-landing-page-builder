"use client";

import React, { useState } from "react";
import { Plus, Crown } from "lucide-react";
import type { CatalogEntry, ComponentCategory } from "@/lib/component-catalog";

const CATEGORY_GRADIENTS: Record<ComponentCategory, string> = {
  hero: "from-violet-500/5 to-blue-500/5",
  cta: "from-[#D6FC51]/5 to-emerald-500/5",
  conversion: "from-[#D6FC51]/5 to-emerald-500/5",
  features: "from-blue-500/5 to-cyan-500/5",
  content: "from-blue-500/5 to-cyan-500/5",
  socialProof: "from-amber-500/5 to-orange-500/5",
  navigation: "from-slate-500/5 to-slate-400/5",
  salesFunnel: "from-violet-500/5 to-purple-500/5",
  blank: "from-white/[0.02] to-white/[0.01]",
  video: "from-blue-500/5 to-cyan-500/5",
  faq: "from-blue-500/5 to-cyan-500/5",
};

// Schematic preview representations for each section category/type
function SectionSchematic({ type }: { type: string }) {
  switch (type) {
    case "hero":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5">
          <div className="w-20 h-2.5 bg-white/30 rounded" />
          <div className="w-32 h-3.5 bg-white/50 rounded" />
          <div className="w-16 h-2 bg-white/20 rounded" />
          <div className="w-14 h-5 bg-[#D6FC51]/40 rounded-lg mt-1" />
        </div>
      );
    case "header":
      return (
        <div className="w-full h-full flex items-start justify-center p-4 pt-6">
          <div className="w-full flex items-center justify-between">
            <div className="w-10 h-5 bg-white/40 rounded" />
            <div className="flex gap-3">
              <div className="w-8 h-2.5 bg-white/20 rounded" />
              <div className="w-8 h-2.5 bg-white/20 rounded" />
              <div className="w-8 h-2.5 bg-white/20 rounded" />
            </div>
            <div className="w-10 h-4 bg-[#D6FC51]/40 rounded" />
          </div>
        </div>
      );
    case "footer":
      return (
        <div className="w-full h-full flex flex-col justify-end p-4 pb-5">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-2.5 bg-white/30 rounded" />
              <div className="w-20 h-2 bg-white/15 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-white/20 rounded-full" />
              <div className="w-4 h-4 bg-white/20 rounded-full" />
              <div className="w-4 h-4 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="w-full h-px bg-white/10 mt-3" />
          <div className="w-24 h-2 bg-white/10 rounded mt-2 mx-auto" />
        </div>
      );
    case "cta":
    case "glass-cta":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5">
          <div className="w-24 h-3 bg-white/40 rounded" />
          <div className="w-18 h-2 bg-white/20 rounded" />
          <div className="w-20 h-6 bg-[#D6FC51]/40 rounded-lg mt-1" />
        </div>
      );
    case "video":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-16 h-2.5 bg-white/30 rounded" />
          <div className="relative w-28 h-16 bg-white/10 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-white/60 border-y-[5px] border-y-transparent ml-0.5" />
            </div>
          </div>
        </div>
      );
    case "faq":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded mb-1" />
          {[0.4, 0.3, 0.25].map((opacity, i) => (
            <div key={i} className="w-full flex items-center justify-between px-3 py-1.5 bg-white/5 rounded-md">
              <div className="h-2 bg-white/30 rounded" style={{ width: `${50 + i * 10}%`, opacity }} />
              <div className="w-3 h-3 text-white/20 text-[10px] leading-none">+</div>
            </div>
          ))}
        </div>
      );
    case "features":
    case "glass-features":
    case "detailed-features":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="grid grid-cols-3 gap-2 w-full px-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/[0.06] rounded-lg flex flex-col items-center justify-center gap-1 p-1.5">
                <div className="w-3.5 h-3.5 bg-blue-400/30 rounded" />
                <div className="w-full h-1.5 bg-white/15 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "testimonials":
    case "glass-testimonials":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-16 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-2 w-full px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 bg-white/5 rounded-lg p-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-amber-400/20 rounded-full" />
                  <div className="w-10 h-1.5 bg-white/20 rounded" />
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded" />
                <div className="w-3/4 h-1.5 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "stats":
      return (
        <div className="w-full h-full flex items-center justify-center gap-4 p-5">
          {[{ n: "10K+", l: 0.7 }, { n: "99%", l: 0.5 }, { n: "50M", l: 0.6 }].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="text-xs font-bold text-white/50">{s.n}</div>
              <div className="w-10 h-1.5 bg-white/15 rounded" />
            </div>
          ))}
        </div>
      );
    case "logoCloud":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
          <div className="w-20 h-2 bg-white/20 rounded" />
          <div className="flex gap-4 items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-4 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      );
    case "credibility":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-6 h-6 bg-[#D6FC51]/20 rounded-full flex items-center justify-center">
            <div className="w-4 h-3 bg-[#D6FC51]/40 rounded" />
          </div>
          <div className="w-20 h-2.5 bg-white/30 rounded" />
          <div className="w-16 h-2 bg-white/15 rounded" />
        </div>
      );
    case "pricing":
    case "glass-pricing":
      return (
        <div className="w-full h-full flex items-center justify-center gap-2.5 p-4">
          {[false, true, false].map((highlight, i) => (
            <div key={i} className={`flex-1 flex flex-col items-center gap-1.5 p-2 rounded-lg ${highlight ? "bg-violet-500/15 ring-1 ring-violet-500/30 scale-105" : "bg-white/5"}`}>
              <div className="w-8 h-1.5 bg-white/20 rounded" />
              <div className="text-[10px] font-bold text-white/40">${(i + 1) * 29}</div>
              <div className="w-full h-0.5 bg-white/10 rounded" />
              <div className="w-5 h-0.5 bg-white/10 rounded" />
              <div className="w-full h-2.5 bg-[#D6FC51]/30 rounded mt-0.5" />
            </div>
          ))}
        </div>
      );
    case "offer":
    case "offer-details":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-10 h-3.5 bg-[#D6FC51]/30 rounded-full" />
          <div className="w-24 h-3 bg-white/40 rounded" />
          <div className="w-18 h-2 bg-white/20 rounded" />
          <div className="w-16 h-5 bg-[#D6FC51]/40 rounded-lg mt-1" />
        </div>
      );
    case "audience":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white/20 rounded-full" />
                </div>
                <div className="w-10 h-1.5 bg-white/15 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "process":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-16 h-2.5 bg-white/30 rounded" />
          <div className="flex items-center gap-1.5 w-full px-3">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-5 h-5 bg-violet-400/20 rounded-full flex items-center justify-center text-[8px] text-white/40">{i}</div>
                  <div className="w-10 h-1.5 bg-white/15 rounded" />
                </div>
                {i < 3 && <div className="w-4 h-px bg-white/15" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-1.5 w-full px-2">
            <div className="flex-1 bg-red-500/10 rounded-md p-1.5 flex flex-col gap-1 items-center">
              <div className="w-8 h-1.5 bg-red-400/30 rounded" />
              <div className="text-[8px] text-red-400/50">Before</div>
            </div>
            <div className="flex-1 bg-green-500/10 rounded-md p-1.5 flex flex-col gap-1 items-center">
              <div className="w-8 h-1.5 bg-green-400/30 rounded" />
              <div className="text-[8px] text-green-400/50">After</div>
            </div>
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1.5 p-4">
          <div className="col-span-2 row-span-2 bg-white/10 rounded-lg" />
          <div className="bg-white/[0.06] rounded-lg" />
          <div className="bg-white/[0.06] rounded-lg" />
        </div>
      );
    case "founders":
    case "glass-founders":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-16 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 bg-white/10 rounded-full" />
                <div className="w-10 h-1.5 bg-white/20 rounded" />
                <div className="w-8 h-1 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "creator":
      return (
        <div className="w-full h-full flex items-center justify-center gap-4 p-4">
          <div className="w-14 h-14 bg-white/10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <div className="w-18 h-2.5 bg-white/30 rounded" />
            <div className="w-14 h-2 bg-white/15 rounded" />
            <div className="w-24 h-1.5 bg-white/10 rounded" />
          </div>
        </div>
      );
    case "value-proposition":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-24 h-3 bg-white/40 rounded" />
          <div className="w-20 h-2 bg-white/20 rounded" />
          <div className="flex gap-3 mt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 bg-[#D6FC51]/15 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-[#D6FC51]/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    // Whop / Sales Funnel sections
    case "whop-hero":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5 bg-gradient-to-b from-violet-500/10 to-transparent">
          <div className="w-4 h-4 bg-violet-400/30 rounded-full" />
          <div className="w-24 h-3.5 bg-white/50 rounded" />
          <div className="w-18 h-2 bg-white/20 rounded" />
          <div className="w-16 h-5 bg-violet-500/40 rounded-lg" />
        </div>
      );
    case "whop-value-prop":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-20 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-2 w-full px-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 bg-violet-500/10 rounded-lg p-2 flex flex-col gap-1.5">
                <div className="w-5 h-5 bg-violet-400/20 rounded" />
                <div className="w-full h-1.5 bg-white/15 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "whop-offer":
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5 p-4">
          <div className="bg-violet-500/10 rounded-lg p-1.5 flex flex-col gap-1">
            <div className="w-5 h-5 bg-violet-400/20 rounded" />
            <div className="w-10 h-1.5 bg-white/15 rounded" />
          </div>
          <div className="bg-white/5 rounded-lg row-span-2 flex items-center justify-center">
            <div className="w-10 h-14 bg-white/10 rounded" />
          </div>
          <div className="bg-violet-500/10 rounded-lg p-1.5 flex flex-col gap-1">
            <div className="w-5 h-5 bg-violet-400/20 rounded" />
            <div className="w-10 h-1.5 bg-white/15 rounded" />
          </div>
        </div>
      );
    case "whop-cta":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5">
          <div className="w-24 h-3 bg-white/40 rounded" />
          <div className="w-24 h-7 bg-gradient-to-r from-violet-500/40 to-violet-600/40 rounded-xl shadow-lg shadow-violet-500/10" />
        </div>
      );
    case "whop-comparison":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-1.5 w-full px-2">
            <div className="flex-1 bg-white/5 rounded-md p-1.5 flex flex-col gap-1 items-center ring-1 ring-white/5">
              <div className="w-8 h-1.5 bg-white/20 rounded" />
              <div className="w-4 h-4 bg-white/10 rounded-full" />
            </div>
            <div className="flex-1 bg-violet-500/10 rounded-md p-1.5 flex flex-col gap-1 items-center ring-1 ring-violet-500/20">
              <div className="w-8 h-1.5 bg-violet-400/30 rounded" />
              <div className="w-4 h-4 bg-violet-400/20 rounded-full" />
            </div>
          </div>
        </div>
      );
    case "whop-creator":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-400/20 to-violet-600/20 rounded-full" />
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="w-14 h-1.5 bg-white/15 rounded" />
          <div className="flex gap-1.5">
            <div className="w-4 h-4 bg-white/10 rounded-full" />
            <div className="w-4 h-4 bg-white/10 rounded-full" />
          </div>
        </div>
      );
    case "whop-curriculum":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md">
              <div className="w-4 h-4 bg-violet-400/20 rounded text-[7px] text-white/30 flex items-center justify-center">{i}</div>
              <div className="flex-1 h-1.5 bg-white/15 rounded" />
            </div>
          ))}
        </div>
      );
    case "whop-results":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-18 h-2.5 bg-white/30 rounded" />
          <div className="grid grid-cols-3 gap-1.5 w-full px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      );
    case "whop-testimonials":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-4">
          <div className="w-16 h-2.5 bg-white/30 rounded" />
          <div className="flex gap-1.5 perspective-[200px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 bg-white/5 rounded-md p-1.5 flex flex-col gap-1" style={{ transform: i === 2 ? "none" : `rotateY(${i === 1 ? 10 : -10}deg)` }}>
                <div className="w-4 h-4 bg-white/10 rounded-full mx-auto" />
                <div className="w-full h-1 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      );
    case "whop-final-cta":
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5 bg-gradient-to-t from-violet-500/5 to-transparent">
          <div className="w-24 h-3 bg-white/40 rounded" />
          <div className="w-18 h-2 bg-white/20 rounded" />
          <div className="w-20 h-6 bg-gradient-to-r from-[#D6FC51]/40 to-[#D6FC51]/30 rounded-lg" />
        </div>
      );
    case "blank":
      return (
        <div className="w-full h-full flex items-center justify-center p-5">
          <div className="w-10 h-10 border-2 border-dashed border-white/15 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white/20" />
          </div>
        </div>
      );
    case "loader":
      return (
        <div className="w-full h-full flex items-center justify-center p-5">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/50 rounded-full" />
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-5">
          <div className="w-20 h-2.5 bg-white/30 rounded" />
          <div className="w-16 h-2 bg-white/15 rounded" />
        </div>
      );
  }
}

type ComponentGalleryCardProps = {
  entry: CatalogEntry;
  onAdd: (type: string, variantId?: string) => void;
};

export default function ComponentGalleryCard({ entry, onAdd }: ComponentGalleryCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    entry.variants.length > 0 ? entry.variants[0].id : undefined
  );

  const gradient = CATEGORY_GRADIENTS[entry.category] || "from-white/[0.02] to-white/[0.01]";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200 overflow-hidden">
      {/* Preview area */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} overflow-hidden`}>
        <SectionSchematic type={entry.type} />
        {/* Pro badge */}
        {entry.tier === "pro" && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-violet-500/20 rounded-full ring-1 ring-violet-500/20">
            <Crown className="w-2.5 h-2.5 text-violet-400" />
            <span className="text-[10px] font-medium text-violet-300">PRO</span>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/90">{entry.label}</h3>
          <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
            {entry.category}
          </span>
        </div>
        <p className="text-xs text-white/40 mt-1 line-clamp-2">{entry.description}</p>

        {/* Variant pills */}
        {entry.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v.id)}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-all duration-200 ${
                  selectedVariant === v.id
                    ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <div className="px-4 pb-4 pt-2">
        <button
          onClick={() => onAdd(entry.type, selectedVariant)}
          className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-200 bg-white/5 text-white/50 hover:bg-[#D6FC51]/10 hover:text-[#D6FC51] flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to Page
        </button>
      </div>
    </div>
  );
}
