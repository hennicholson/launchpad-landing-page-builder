"use client";

import React from "react";
import type { PageSection, LandingPage } from "@/lib/page-schema";
import { NumberInput, RangeSlider } from "../shared-controls";

export function SpacingControls({
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
  return (
    <div className="space-y-3">
      {/* Existing padding controls */}
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Top (px)"
          value={section.content.paddingTop}
          onChange={(v) => updateSectionContent(sectionId, { paddingTop: v })}
          min={0}
          max={200}
          placeholder="64"
        />
        <NumberInput
          label="Bottom (px)"
          value={section.content.paddingBottom}
          onChange={(v) => updateSectionContent(sectionId, { paddingBottom: v })}
          min={0}
          max={200}
          placeholder="64"
        />
      </div>
      {(section.content.paddingTop !== undefined || section.content.paddingBottom !== undefined) && (
        <button
          onClick={() => updateSectionContent(sectionId, { paddingTop: undefined, paddingBottom: undefined })}
          className="text-[10px] text-white/40 hover:text-white/60 underline transition-colors"
        >
          Reset padding to default
        </button>
      )}

      {/* Content Gap */}
      <RangeSlider
        label="Content Gap"
        value={section.content.sectionContentGap ?? 0}
        onChange={(v) => updateSectionContent(sectionId, { sectionContentGap: v || undefined })}
        min={0}
        max={80}
        step={4}
        unit="px"
      />

      {/* Content Width */}
      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
          Content Width
        </label>
        <select
          value={section.content.sectionMaxWidth || ""}
          onChange={(e) => updateSectionContent(sectionId, { sectionMaxWidth: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <option value="">Page Default</option>
          <option value="narrow">Narrow (768px)</option>
          <option value="medium">Medium (1024px)</option>
          <option value="wide">Wide (1280px)</option>
          <option value="full">Full Width</option>
        </select>
      </div>

      {/* Reset all spacing overrides */}
      {(section.content.sectionContentGap || section.content.sectionMaxWidth) && (
        <button
          onClick={() => updateSectionContent(sectionId, { sectionContentGap: undefined, sectionMaxWidth: undefined })}
          className="text-[10px] text-white/40 hover:text-white/60 underline transition-colors"
        >
          Reset spacing overrides
        </button>
      )}
    </div>
  );
}
