"use client";

import React from "react";
import type { PageSection, LandingPage } from "@/lib/page-schema";
import { RangeSlider } from "../shared-controls";

const FONT_CATEGORIES = [
  {
    label: "Sans Serif",
    fonts: [
      "Inter", "DM Sans", "Sora", "Plus Jakarta Sans", "Space Grotesk", "Outfit",
      "Poppins", "Montserrat", "Raleway", "Nunito", "Nunito Sans", "Lato",
      "Open Sans", "Roboto", "Work Sans", "Manrope", "Figtree", "Urbanist",
      "Lexend", "Geist Sans", "Albert Sans", "Red Hat Display", "General Sans",
      "Satoshi", "Switzer", "Cabinet Grotesk", "Clash Display",
    ],
  },
  {
    label: "Serif",
    fonts: [
      "Playfair Display", "Merriweather", "Lora", "Libre Baskerville",
      "Source Serif 4", "Crimson Pro", "Cormorant Garamond", "DM Serif Display",
      "Fraunces", "Instrument Serif", "Newsreader", "Bitter", "Noto Serif",
      "EB Garamond", "Spectral",
    ],
  },
  {
    label: "Display",
    fonts: [
      "Anton", "Bebas Neue", "Oswald", "Righteous", "Archivo Black",
      "Black Ops One", "Passion One", "Bungee", "Fredoka", "Titan One",
      "Lobster", "Pacifico", "Permanent Marker", "Abril Fatface", "Alfa Slab One",
    ],
  },
  {
    label: "Mono",
    fonts: [
      "JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono",
      "Space Mono", "Roboto Mono",
    ],
  },
];

export const ALL_AVAILABLE_FONTS = FONT_CATEGORIES.flatMap((c) => c.fonts);

export function TypographyControls({
  section,
  sectionId,
  page,
  updateSectionContent,
}: {
  section: PageSection;
  sectionId: string;
  page: LandingPage;
  updateSectionContent: (id: string, content: any) => void;
}) {
  const hasOverride = !!(
    section.content.sectionHeadingFont ||
    section.content.sectionBodyFont ||
    section.content.sectionHeadingSizeScale ||
    section.content.sectionTextAlign
  );

  return (
    <div className="space-y-3">
      {/* Heading Font */}
      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
          Heading Font
        </label>
        <select
          value={section.content.sectionHeadingFont || ""}
          onChange={(e) => updateSectionContent(sectionId, { sectionHeadingFont: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <option value="">Page Default</option>
          {FONT_CATEGORIES.map((category) => (
            <optgroup key={category.label} label={category.label}>
              {category.fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Body Font */}
      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
          Body Font
        </label>
        <select
          value={section.content.sectionBodyFont || ""}
          onChange={(e) => updateSectionContent(sectionId, { sectionBodyFont: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <option value="">Page Default</option>
          {FONT_CATEGORIES.map((category) => (
            <optgroup key={category.label} label={category.label}>
              {category.fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Heading Size Scale */}
      <RangeSlider
        label="Heading Size Scale"
        value={section.content.sectionHeadingSizeScale ?? 1}
        onChange={(v) => updateSectionContent(sectionId, { sectionHeadingSizeScale: v === 1 ? undefined : v })}
        min={0.5}
        max={2}
        step={0.1}
        unit="x"
      />

      {/* Text Alignment */}
      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
          Text Alignment
        </label>
        <div className="flex gap-1">
          {([
            {
              value: "left" as const,
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M3 6h18M3 12h12M3 18h16" />
                </svg>
              ),
            },
            {
              value: "center" as const,
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M3 6h18M6 12h12M4 18h16" />
                </svg>
              ),
            },
            {
              value: "right" as const,
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" d="M3 6h18M9 12h12M5 18h16" />
                </svg>
              ),
            },
          ] as const).map(({ value, icon }) => (
            <button
              key={value}
              onClick={() => updateSectionContent(sectionId, {
                sectionTextAlign: section.content.sectionTextAlign === value ? undefined : value,
              })}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg border transition-colors ${
                section.content.sectionTextAlign === value
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Reset all */}
      {hasOverride && (
        <button
          onClick={() => updateSectionContent(sectionId, {
            sectionHeadingFont: undefined,
            sectionBodyFont: undefined,
            sectionHeadingSizeScale: undefined,
            sectionTextAlign: undefined,
          })}
          className="text-[10px] text-white/40 hover:text-white/60 underline transition-colors"
        >
          Reset all typography overrides
        </button>
      )}
    </div>
  );
}
