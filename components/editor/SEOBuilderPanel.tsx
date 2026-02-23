"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import { PLAN_LIMITS, type PlanType } from "@/lib/schema";
import { CollapsibleSection } from "./shared-controls";
import {
  Lock,
  Search,
  Share2,
  Settings,
  Check,
  X,
  AlertCircle,
  Globe,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

// ─── SEO Score Calculation ───────────────────────────────────────────────────

type SEOCheckItem = {
  id: string;
  label: string;
  passed: boolean;
  points: number;
};

function calculateSEOScore(seo: Record<string, unknown> | undefined, pageTitle: string, pageDescription: string) {
  const items: SEOCheckItem[] = [
    {
      id: "metaTitle",
      label: "Meta title set",
      passed: !!(seo?.metaTitle as string)?.trim(),
      points: 15,
    },
    {
      id: "metaTitleLength",
      label: "Meta title 50-60 characters",
      passed: ((seo?.metaTitle as string) || "").length >= 50 && ((seo?.metaTitle as string) || "").length <= 60,
      points: 10,
    },
    {
      id: "metaDescription",
      label: "Meta description set",
      passed: !!(seo?.metaDescription as string)?.trim(),
      points: 15,
    },
    {
      id: "metaDescLength",
      label: "Meta description 150-160 characters",
      passed: ((seo?.metaDescription as string) || "").length >= 150 && ((seo?.metaDescription as string) || "").length <= 160,
      points: 10,
    },
    {
      id: "ogTitle",
      label: "Open Graph title set",
      passed: !!(seo?.ogTitle as string)?.trim(),
      points: 10,
    },
    {
      id: "ogDescription",
      label: "Open Graph description set",
      passed: !!(seo?.ogDescription as string)?.trim(),
      points: 10,
    },
    {
      id: "ogImage",
      label: "Open Graph image set",
      passed: !!(seo?.ogImage as string)?.trim(),
      points: 15,
    },
    {
      id: "canonicalUrl",
      label: "Canonical URL set",
      passed: !!(seo?.canonicalUrl as string)?.trim(),
      points: 10,
    },
    {
      id: "robots",
      label: "Search engine indexing enabled",
      passed: !(seo?.robots as string)?.includes("noindex"),
      points: 5,
    },
  ];

  const score = items.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0);
  return { items, score };
}

function getScoreColor(score: number) {
  if (score >= 90) return "#D6FC51";
  if (score >= 70) return "#facc15";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

// ─── Score Ring SVG ──────────────────────────────────────────────────────────

function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Character Count Input ───────────────────────────────────────────────────

function SEOTextInput({
  label,
  value,
  onChange,
  placeholder,
  idealMin,
  idealMax,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  idealMin?: number;
  idealMax?: number;
  disabled?: boolean;
}) {
  const len = value.length;
  const hasIdeal = idealMin !== undefined && idealMax !== undefined;
  const counterColor = hasIdeal
    ? len === 0
      ? "text-white/30"
      : len >= idealMin! && len <= idealMax!
        ? "text-emerald-400"
        : len > idealMax!
          ? "text-red-400"
          : len >= idealMin! - 10
            ? "text-amber-400"
            : "text-white/40"
    : "text-white/30";

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
      />
      {hasIdeal && (
        <div className={`text-[10px] ${counterColor} text-right`}>
          {len}/{idealMin}-{idealMax}
        </div>
      )}
    </div>
  );
}

function SEOTextAreaInput({
  label,
  value,
  onChange,
  placeholder,
  idealMin,
  idealMax,
  rows = 3,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  idealMin?: number;
  idealMax?: number;
  rows?: number;
  disabled?: boolean;
}) {
  const len = value.length;
  const hasIdeal = idealMin !== undefined && idealMax !== undefined;
  const counterColor = hasIdeal
    ? len === 0
      ? "text-white/30"
      : len >= idealMin! && len <= idealMax!
        ? "text-emerald-400"
        : len > idealMax!
          ? "text-red-400"
          : len >= idealMin! - 10
            ? "text-amber-400"
            : "text-white/40"
    : "text-white/30";

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none disabled:opacity-40 disabled:cursor-not-allowed"
      />
      {hasIdeal && (
        <div className={`text-[10px] ${counterColor} text-right`}>
          {len}/{idealMin}-{idealMax}
        </div>
      )}
    </div>
  );
}

// ─── Google Search Preview ───────────────────────────────────────────────────

function GoogleSearchPreview({
  metaTitle,
  metaDescription,
  canonicalUrl,
  pageTitle,
  pageDescription,
}: {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  pageTitle: string;
  pageDescription: string;
}) {
  const title = metaTitle || pageTitle || "Untitled Page";
  const description = metaDescription || pageDescription || "No description set";
  const url = canonicalUrl || "yoursite.com";
  const isFallbackTitle = !metaTitle;
  const isFallbackDesc = !metaDescription;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Search className="w-3 h-3 text-white/40" />
        <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          Google Preview
        </span>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-1.5">
        <div className="text-[12px] text-emerald-400/70 truncate">
          {url}
        </div>
        <div
          className={`text-[15px] leading-snug font-medium truncate ${
            isFallbackTitle ? "text-blue-400/50 italic" : "text-blue-400"
          }`}
        >
          {title.length > 60 ? title.slice(0, 60) + "..." : title}
          {isFallbackTitle && (
            <span className="text-[10px] text-white/20 not-italic ml-1">(page title)</span>
          )}
        </div>
        <div
          className={`text-[12px] leading-relaxed ${
            isFallbackDesc ? "text-white/30 italic" : "text-white/50"
          }`}
        >
          {description.length > 160 ? description.slice(0, 160) + "..." : description}
          {isFallbackDesc && (
            <span className="text-[10px] text-white/15 not-italic ml-1">(page description)</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Social Card Preview ─────────────────────────────────────────────────────

function SocialCardPreview({
  ogTitle,
  ogDescription,
  ogImage,
  metaTitle,
  pageTitle,
  canonicalUrl,
}: {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  metaTitle: string;
  pageTitle: string;
  canonicalUrl: string;
}) {
  const title = ogTitle || metaTitle || pageTitle || "Untitled Page";
  const description = ogDescription || "No description set";
  const domain = canonicalUrl
    ? canonicalUrl.replace(/^https?:\/\//, "").split("/")[0]
    : "yoursite.com";
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Share2 className="w-3 h-3 text-white/40" />
        <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
          Social Preview
        </span>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
        {/* Image area */}
        <div className="h-36 bg-white/[0.02] flex items-center justify-center border-b border-white/[0.06]">
          {ogImage && !imgError ? (
            <img
              src={ogImage}
              alt="OG Preview"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/15">
              <ImageIcon className="w-8 h-8" />
              <span className="text-[10px]">No image set</span>
            </div>
          )}
        </div>
        {/* Text area */}
        <div className="p-3 space-y-1">
          <div className="text-[10px] text-white/30 uppercase tracking-wide">{domain}</div>
          <div className="text-[13px] text-white/80 font-medium leading-snug truncate">{title}</div>
          <div className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{description}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SEO Checklist ───────────────────────────────────────────────────────────

function SEOChecklist({ items, score }: { items: SEOCheckItem[]; score: number }) {
  const [expanded, setExpanded] = useState(false);
  const passed = items.filter((i) => i.passed).length;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Checklist
          </span>
          <span className="text-[10px] text-white/25">
            {passed}/{items.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-3 h-3 text-white/30" />
        ) : (
          <ChevronDown className="w-3 h-3 text-white/30" />
        )}
      </button>
      {expanded && (
        <div className="space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              {item.passed ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <X className="w-3 h-3 text-white/20 shrink-0" />
              )}
              <span
                className={`text-[11px] ${
                  item.passed ? "text-white/50" : "text-white/30"
                }`}
              >
                {item.label}
              </span>
              <span className="text-[9px] text-white/15 ml-auto">+{item.points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pro Lock Overlay ────────────────────────────────────────────────────────

function ProLockOverlay() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-black/50 flex flex-col items-center justify-center rounded-xl">
      <div className="w-11 h-11 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-3">
        <Lock className="w-5 h-5 text-white/50" />
      </div>
      <p className="text-white/80 text-sm font-medium mb-1">Pro Feature</p>
      <p className="text-white/35 text-[11px] mb-4 text-center px-6 leading-relaxed">
        Unlock the SEO builder to optimize your pages for search engines and social sharing
      </p>
      <button
        onClick={() => router.push("/billing")}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
      >
        Upgrade to Pro
      </button>
    </div>
  );
}

// ─── Main SEO Builder Panel ──────────────────────────────────────────────────

export default function SEOBuilderPanel() {
  const page = useEditorStore((s) => s.page);
  const updatePageMeta = useEditorStore((s) => s.updatePageMeta);
  const userPlan = useEditorStore((s) => s.userPlan);

  const seo = page.seo || {};
  const canUseSeo = PLAN_LIMITS[(userPlan || "free") as PlanType]?.canUseSeo ?? false;

  const updateSeo = useCallback(
    (field: string, value: string) => {
      updatePageMeta({ seo: { ...page.seo, [field]: value } });
    },
    [page.seo, updatePageMeta]
  );

  const { items: checkItems, score } = useMemo(
    () => calculateSEOScore(seo as Record<string, unknown>, page.title, page.description),
    [seo, page.title, page.description]
  );

  return (
    <CollapsibleSection
      title="SEO Builder"
      defaultOpen={false}
      count={score > 0 ? score : undefined}
    >
      <div className="relative">
        {/* Lock overlay for non-pro users */}
        {!canUseSeo && <ProLockOverlay />}

        <div className={!canUseSeo ? "pointer-events-none select-none" : ""}>
          <div className="space-y-5">
            {/* Score + Checklist */}
            <div className="flex items-start gap-3">
              <ScoreRing score={score} size={44} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white/60 font-medium mb-0.5">
                  SEO Score
                </div>
                <div className="text-[10px] text-white/30">
                  {score >= 90
                    ? "Excellent! Your page is well optimized."
                    : score >= 70
                      ? "Good, but there's room for improvement."
                      : score >= 40
                        ? "Needs work. Fill in the fields below."
                        : "Get started by adding SEO metadata."}
                </div>
              </div>
            </div>

            <SEOChecklist items={checkItems} score={score} />

            {/* Divider */}
            <div className="border-t border-white/[0.05]" />

            {/* Google Search Preview */}
            <GoogleSearchPreview
              metaTitle={(seo as Record<string, string>).metaTitle || ""}
              metaDescription={(seo as Record<string, string>).metaDescription || ""}
              canonicalUrl={(seo as Record<string, string>).canonicalUrl || ""}
              pageTitle={page.title}
              pageDescription={page.description}
            />

            {/* Social Card Preview */}
            <SocialCardPreview
              ogTitle={(seo as Record<string, string>).ogTitle || ""}
              ogDescription={(seo as Record<string, string>).ogDescription || ""}
              ogImage={(seo as Record<string, string>).ogImage || ""}
              metaTitle={(seo as Record<string, string>).metaTitle || ""}
              pageTitle={page.title}
              canonicalUrl={(seo as Record<string, string>).canonicalUrl || ""}
            />

            {/* Divider */}
            <div className="border-t border-white/[0.05]" />

            {/* Basic SEO Fields */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Search className="w-3 h-3 text-white/40" />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Search Engine
                </span>
              </div>

              <SEOTextInput
                label="Meta Title"
                value={(seo as Record<string, string>).metaTitle || ""}
                onChange={(val) => updateSeo("metaTitle", val)}
                placeholder={page.title || "Page title for search engines"}
                idealMin={50}
                idealMax={60}
                disabled={!canUseSeo}
              />

              <SEOTextAreaInput
                label="Meta Description"
                value={(seo as Record<string, string>).metaDescription || ""}
                onChange={(val) => updateSeo("metaDescription", val)}
                placeholder="Describe your page for search engines..."
                idealMin={150}
                idealMax={160}
                rows={3}
                disabled={!canUseSeo}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.05]" />

            {/* Social Sharing Fields */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Share2 className="w-3 h-3 text-white/40" />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Social Sharing
                </span>
              </div>

              <SEOTextInput
                label="OG Title"
                value={(seo as Record<string, string>).ogTitle || ""}
                onChange={(val) => updateSeo("ogTitle", val)}
                placeholder={(seo as Record<string, string>).metaTitle || page.title || "Title for social media"}
                disabled={!canUseSeo}
              />

              <SEOTextAreaInput
                label="OG Description"
                value={(seo as Record<string, string>).ogDescription || ""}
                onChange={(val) => updateSeo("ogDescription", val)}
                placeholder="Description shown on social media..."
                rows={2}
                disabled={!canUseSeo}
              />

              <SEOTextInput
                label="OG Image URL"
                value={(seo as Record<string, string>).ogImage || ""}
                onChange={(val) => updateSeo("ogImage", val)}
                placeholder="https://example.com/og-image.jpg"
                disabled={!canUseSeo}
              />

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Twitter Card Type
                </label>
                <select
                  value={(seo as Record<string, string>).twitterCard || "summary_large_image"}
                  onChange={(e) => updateSeo("twitterCard", e.target.value)}
                  disabled={!canUseSeo}
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="summary_large_image">Large Image (recommended)</option>
                  <option value="summary">Summary</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.05]" />

            {/* Advanced Fields */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <Settings className="w-3 h-3 text-white/40" />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Advanced
                </span>
              </div>

              <SEOTextInput
                label="Canonical URL"
                value={(seo as Record<string, string>).canonicalUrl || ""}
                onChange={(val) => updateSeo("canonicalUrl", val)}
                placeholder="https://yourdomain.com/page"
                disabled={!canUseSeo}
              />

              <div className="space-y-1.5">
                <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Search Engine Indexing
                </label>
                <select
                  value={(seo as Record<string, string>).robots || "index, follow"}
                  onChange={(e) => updateSeo("robots", e.target.value)}
                  disabled={!canUseSeo}
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="index, follow">Index & Follow (default)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
