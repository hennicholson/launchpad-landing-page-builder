"use client";

import React from "react";
import type { PageSection, LandingPage, AnimationPreset } from "@/lib/page-schema";
import { ANIMATION_PRESET_LABELS, ANIMATION_PRESET_DESCRIPTIONS } from "@/lib/animation-presets";
import { RangeSlider } from "../shared-controls";

export function AnimationControls({
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
  const hasOverride = section.content.sectionAnimationPreset !== undefined;
  const currentPreset = section.content.sectionAnimationPreset ?? page.animationPreset ?? "moderate";

  return (
    <div className="space-y-3">
      {!hasOverride && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] text-white/40">
            Using page default ({ANIMATION_PRESET_LABELS[page.animationPreset ?? "moderate"]})
          </span>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
          Entrance Animation
        </label>
        <select
          value={section.content.sectionAnimationPreset || ""}
          onChange={(e) => updateSectionContent(sectionId, { sectionAnimationPreset: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <option value="">Page Default</option>
          {Object.entries(ANIMATION_PRESET_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {section.content.sectionAnimationPreset && (
          <p className="text-[10px] text-white/30">
            {ANIMATION_PRESET_DESCRIPTIONS[section.content.sectionAnimationPreset]}
          </p>
        )}
      </div>

      <RangeSlider
        label="Animation Delay"
        value={section.content.sectionAnimationDelay ?? 0}
        onChange={(v) => updateSectionContent(sectionId, { sectionAnimationDelay: v || undefined })}
        min={0}
        max={2}
        step={0.1}
        unit="s"
      />

      {hasOverride && (
        <button
          onClick={() => updateSectionContent(sectionId, { sectionAnimationPreset: undefined, sectionAnimationDelay: undefined })}
          className="text-[10px] text-white/40 hover:text-white/60 underline transition-colors"
        >
          Reset to page default
        </button>
      )}
    </div>
  );
}
