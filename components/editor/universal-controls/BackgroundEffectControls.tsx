"use client";

import React from "react";
import type { PageSection, LandingPage, BackgroundEffect } from "@/lib/page-schema";

export function BackgroundEffectControls({
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
      <select
        value={section.content.backgroundEffect || "none"}
        onChange={(e) => updateSectionContent(sectionId, { backgroundEffect: e.target.value as BackgroundEffect })}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      >
        <option value="none">None</option>
        <optgroup label="Premium Effects">
          <option value="aurora">Aurora (Northern Lights)</option>
          <option value="spotlight">Spotlight</option>
          <option value="background-beams">Background Beams</option>
          <option value="meteors">Meteors</option>
          <option value="sparkles">Sparkles</option>
        </optgroup>
        <optgroup label="Classic Effects">
          <option value="elegant-shapes">Elegant Shapes</option>
          <option value="background-circles">Animated Circles</option>
          <option value="background-paths">Floating Paths</option>
          <option value="glow">Glow Effect</option>
          <option value="shooting-stars">Shooting Stars</option>
          <option value="stars-background">Starry Night</option>
          <option value="wavy-background">Wavy Lines</option>
        </optgroup>
      </select>
      <p className="text-xs text-white/30">
        Animated background effects work best on dark sections
      </p>

      {/* Aurora Configuration */}
      {section.content.backgroundEffect === "aurora" && (
        <div className="pt-3 space-y-3 border-t border-white/5">
          <label className="block text-xs font-medium text-white/40 uppercase tracking-wide">
            Aurora Settings
          </label>

          {/* Primary Color */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50">Primary Color</span>
            <input
              type="color"
              value={section.content.backgroundConfig?.primaryColor || "#3b82f6"}
              onChange={(e) => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  primaryColor: e.target.value,
                },
              })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Secondary Color */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50">Secondary Color</span>
            <input
              type="color"
              value={section.content.backgroundConfig?.secondaryColor || "#8b5cf6"}
              onChange={(e) => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  secondaryColor: e.target.value,
                },
              })}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
          </div>

          {/* Animation Speed */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Animation Speed</span>
              <span className="text-xs text-white/30 capitalize">
                {section.content.backgroundConfig?.speed || "medium"}
              </span>
            </div>
            <select
              value={section.content.backgroundConfig?.speed || "medium"}
              onChange={(e) => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  speed: e.target.value as "slow" | "medium" | "fast",
                },
              })}
              className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              <option value="slow">Slow (120s)</option>
              <option value="medium">Medium (60s)</option>
              <option value="fast">Fast (30s)</option>
            </select>
          </div>

          {/* Intensity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Intensity</span>
              <span className="text-xs text-white/30">
                {section.content.backgroundConfig?.intensity || 50}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={section.content.backgroundConfig?.intensity || 50}
              onChange={(e) => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  intensity: parseInt(e.target.value),
                },
              })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
            />
          </div>

          {/* Blur Amount */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Blur Amount</span>
              <span className="text-xs text-white/30">
                {section.content.backgroundConfig?.blurAmount || 10}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={section.content.backgroundConfig?.blurAmount || 10}
              onChange={(e) => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  blurAmount: parseInt(e.target.value),
                },
              })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
            />
          </div>

          {/* Show Radial Gradient */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Radial Gradient Mask</span>
            <button
              onClick={() => updateSectionContent(sectionId, {
                backgroundConfig: {
                  ...section.content.backgroundConfig,
                  showRadialGradient: !(section.content.backgroundConfig?.showRadialGradient ?? true),
                },
              })}
              className={`w-10 h-5 rounded-full transition-colors ${
                (section.content.backgroundConfig?.showRadialGradient ?? true)
                  ? "bg-amber-500"
                  : "bg-white/20"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  (section.content.backgroundConfig?.showRadialGradient ?? true)
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
