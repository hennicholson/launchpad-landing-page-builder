"use client";

import { useState } from "react";
import { useEditorStore, useSelectedSection } from "@/lib/store";
import type { SectionType, LayoutType, NavLink, StatsVariant, CTAVariant, AnimationPreset, HeadingStyle } from "@/lib/page-schema";
import { THEME_PRESETS } from "@/lib/page-schema";
import { IconPicker } from "./IconPicker";
import { ANIMATION_PRESET_LABELS, ANIMATION_PRESET_DESCRIPTIONS } from "@/lib/animation-presets";

export default function PropertyPanel() {
  const {
    page,
    selectedSectionId,
    updateSectionContent,
    updateColorScheme,
    updateTypography,
    updatePageMeta,
    addItem,
    updateItem,
    removeItem,
    applyThemePreset,
  } = useEditorStore();

  const selectedSection = useSelectedSection();

  // If no section selected, show page settings
  if (!selectedSectionId || !selectedSection) {
    return (
      <div className="w-80 border-l border-white/5 flex flex-col flex-shrink-0 bg-[#0f0f10] overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <h2 className="font-['Sora',sans-serif] font-medium text-sm text-white/80">
            Page Settings
          </h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Page Meta */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Page Title
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => updatePageMeta({ title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={page.description}
              onChange={(e) => updatePageMeta({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
            />
          </div>

          {/* Theme Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Theme Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(THEME_PRESETS).map(([id, preset]) => (
                <button
                  key={id}
                  onClick={() => applyThemePreset(id)}
                  className="group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all hover:border-white/20"
                  style={{
                    borderColor:
                      page.colorScheme.background === preset.colorScheme.background &&
                      page.colorScheme.primary === preset.colorScheme.primary
                        ? preset.colorScheme.primary
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="flex gap-0.5">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colorScheme.background }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: preset.colorScheme.primary }}
                    />
                  </div>
                  <span className="text-[10px] text-white/60">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Custom Colors
            </label>
            <div className="grid grid-cols-2 gap-2">
              <ColorInput
                label="Primary"
                value={page.colorScheme.primary}
                onChange={(v) => updateColorScheme({ primary: v })}
              />
              <ColorInput
                label="Secondary"
                value={page.colorScheme.secondary}
                onChange={(v) => updateColorScheme({ secondary: v })}
              />
              <ColorInput
                label="Accent"
                value={page.colorScheme.accent}
                onChange={(v) => updateColorScheme({ accent: v })}
              />
              <ColorInput
                label="Background"
                value={page.colorScheme.background}
                onChange={(v) => updateColorScheme({ background: v })}
              />
              <ColorInput
                label="Text"
                value={page.colorScheme.text}
                onChange={(v) => updateColorScheme({ text: v })}
              />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Typography
            </label>
            <div className="space-y-2">
              <select
                value={page.typography.headingFont}
                onChange={(e) => updateTypography({ headingFont: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="Anton">Anton</option>
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Sora">Sora</option>
                <option value="DM Sans">DM Sans</option>
              </select>
              <select
                value={page.typography.bodyFont}
                onChange={(e) => updateTypography({ bodyFont: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="Inter">Inter (Body)</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="DM Sans">DM Sans</option>
              </select>
            </div>
          </div>

          {/* Animation Preset */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Animation Style
            </label>
            <select
              value={page.animationPreset || "moderate"}
              onChange={(e) => updatePageMeta({ animationPreset: e.target.value as AnimationPreset })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              {(Object.keys(ANIMATION_PRESET_LABELS) as AnimationPreset[]).map((preset) => (
                <option key={preset} value={preset}>
                  {ANIMATION_PRESET_LABELS[preset]}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-white/40">
              {ANIMATION_PRESET_DESCRIPTIONS[page.animationPreset || "moderate"]}
            </p>
          </div>

          {/* Smooth Scroll */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={page.smoothScroll || false}
                onChange={(e) => updatePageMeta({ smoothScroll: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
              />
              <div>
                <span className="text-xs font-medium text-white/70">Smooth Scroll</span>
                <p className="text-[10px] text-white/40">Enable buttery-smooth scrolling effect</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  const sectionType = selectedSection.type;

  return (
    <div className="w-80 border-l border-white/5 flex flex-col flex-shrink-0 bg-[#0f0f10] overflow-y-auto">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-['Sora',sans-serif] font-medium text-sm text-white/80 capitalize">
          {selectedSection.type} Settings
        </h2>
      </div>

      <div className="p-4 space-y-5">
        {/* ==================== HEADER SECTION ==================== */}
        {sectionType === "header" && (
          <>
            <TextInput
              label="Logo Text"
              value={selectedSection.content.logoText || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { logoText: v })}
            />
            <TextInput
              label="Logo URL (optional)"
              value={selectedSection.content.logoUrl || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { logoUrl: v })}
              placeholder="https://..."
            />
            <NavLinksEditor
              links={selectedSection.content.links || []}
              onChange={(links) => updateSectionContent(selectedSectionId, { links })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="CTA Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="CTA Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
                placeholder="#"
              />
            </div>
          </>
        )}

        {/* ==================== HERO SECTION ==================== */}
        {sectionType === "hero" && (
          <>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
              placeholder="For Creators & Agencies"
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Accent Heading (2nd color)"
              value={selectedSection.content.accentHeading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { accentHeading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <TextInput
              label="Video URL"
              value={selectedSection.content.videoUrl || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { videoUrl: v })}
              placeholder="https://youtube.com/embed/..."
            />
            <ArrayEditor
              label="Brand Names (Marquee)"
              items={selectedSection.content.brands || []}
              onChange={(brands) => updateSectionContent(selectedSectionId, { brands })}
              placeholder="Brand Name"
            />
          </>
        )}

        {/* ==================== FOUNDERS SECTION ==================== */}
        {sectionType === "founders" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <ItemsSection label="Team Members">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Name"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextInput
                    label="Label"
                    value={item.label || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { label: v })}
                    placeholder="30+ Years Experience"
                  />
                  <TextInput
                    label="Role"
                    value={item.role || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { role: v })}
                  />
                  <TextAreaInput
                    label="Bio"
                    value={item.bio || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { bio: v })}
                    rows={2}
                  />
                  <TextInput
                    label="Image URL"
                    value={item.imageUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })}
                  />
                  <TextInput
                    label="LinkedIn URL"
                    value={item.linkedinUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { linkedinUrl: v })}
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Team Member
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== CREDIBILITY SECTION ==================== */}
        {sectionType === "credibility" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <TextAreaInput
              label="Body Text"
              value={selectedSection.content.bodyText || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { bodyText: v })}
            />
            <TextInput
              label="Background Image URL"
              value={selectedSection.content.backgroundImage || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { backgroundImage: v })}
            />
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Overlay Opacity ({Math.round((selectedSection.content.overlayOpacity || 0.7) * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selectedSection.content.overlayOpacity || 0.7}
                onChange={(e) => updateSectionContent(selectedSectionId, { overlayOpacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Yearly Price"
                value={selectedSection.content.priceYearly || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { priceYearly: v })}
                placeholder="$299/year"
              />
              <TextInput
                label="Monthly Price"
                value={selectedSection.content.priceMonthly || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { priceMonthly: v })}
                placeholder="$25/month"
              />
            </div>
          </>
        )}

        {/* ==================== FEATURES SECTION ==================== */}
        {sectionType === "features" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <ItemsSection label="Features">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Title"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextAreaInput
                    label="Description"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                    rows={2}
                  />
                  <TextInput
                    label="Image URL"
                    value={item.imageUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })}
                  />
                  <div className="space-y-2">
                    <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
                      Grid Size
                    </label>
                    <select
                      value={item.gridClass || "md:col-span-1"}
                      onChange={(e) => updateItem(selectedSectionId, item.id, { gridClass: e.target.value })}
                      className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white focus:outline-none"
                    >
                      <option value="md:col-span-1">1x1 (Small)</option>
                      <option value="md:col-span-2">2x1 (Wide)</option>
                      <option value="md:col-span-1 md:row-span-2">1x2 (Tall)</option>
                      <option value="md:col-span-2 md:row-span-2">2x2 (Large)</option>
                    </select>
                  </div>
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Feature
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== OFFER SECTION ==================== */}
        {sectionType === "offer" && (
          <>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Yearly Price"
                value={selectedSection.content.priceYearly || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { priceYearly: v })}
              />
              <TextInput
                label="Monthly Price"
                value={selectedSection.content.priceMonthly || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { priceMonthly: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <ItemsSection label="Offer Details">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Title"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextInput
                    label="Price"
                    value={item.price || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { price: v })}
                  />
                  <TextInput
                    label="Description"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                  />
                  <ArrayEditor
                    label="Features"
                    items={item.features || []}
                    onChange={(features) => updateItem(selectedSectionId, item.id, { features })}
                    placeholder="Feature item"
                  />
                </ItemCard>
              ))}
            </ItemsSection>
          </>
        )}

        {/* ==================== PRICING SECTION ==================== */}
        {sectionType === "pricing" && (
          <>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <ItemsSection label="Pricing Plans">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Plan Name"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextInput
                    label="Price"
                    value={item.price || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { price: v })}
                  />
                  <TextInput
                    label="Description"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                  />
                  <ArrayEditor
                    label="Features"
                    items={item.features || []}
                    onChange={(features) => updateItem(selectedSectionId, item.id, { features })}
                    placeholder="Feature item"
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Plan
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        {sectionType === "testimonials" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <ItemsSection label="Testimonials">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Quote Title"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextAreaInput
                    label="Quote"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <TextInput
                      label="Author"
                      value={item.author || ""}
                      onChange={(v) => updateItem(selectedSectionId, item.id, { author: v })}
                    />
                    <TextInput
                      label="Role"
                      value={item.role || ""}
                      onChange={(v) => updateItem(selectedSectionId, item.id, { role: v })}
                    />
                  </div>
                  <TextInput
                    label="Avatar URL (optional)"
                    value={item.imageUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })}
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Testimonial
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== AUDIENCE SECTION ==================== */}
        {sectionType === "audience" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="For You Heading"
              value={selectedSection.content.forHeading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { forHeading: v })}
            />
            <ArrayEditor
              label="For You Items"
              items={selectedSection.content.forItems || []}
              onChange={(forItems) => updateSectionContent(selectedSectionId, { forItems })}
              placeholder="Reason this is for them"
            />
            <TextInput
              label="Not For You Heading"
              value={selectedSection.content.notForHeading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { notForHeading: v })}
            />
            <ArrayEditor
              label="Not For You Items"
              items={selectedSection.content.notForItems || []}
              onChange={(notForItems) => updateSectionContent(selectedSectionId, { notForItems })}
              placeholder="Reason this is not for them"
            />
          </>
        )}

        {/* ==================== CTA SECTION ==================== */}
        {sectionType === "cta" && (
          <>
            {/* Variant Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Style
              </label>
              <select
                value={selectedSection.content.ctaVariant || "centered"}
                onChange={(e) => updateSectionContent(selectedSectionId, { ctaVariant: e.target.value as CTAVariant })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="centered">Centered (classic)</option>
                <option value="split">Split (text + button)</option>
                <option value="banner">Banner (full width)</option>
                <option value="minimal">Minimal (clean)</option>
              </select>
            </div>
            {/* Heading Style */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Heading Style
              </label>
              <select
                value={selectedSection.content.headingStyle || "solid"}
                onChange={(e) => updateSectionContent(selectedSectionId, { headingStyle: e.target.value as HeadingStyle })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="solid">Solid (always visible)</option>
                <option value="gradient">Gradient (colorful)</option>
                <option value="outline">Outline (dramatic)</option>
              </select>
            </div>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <TextInput
              label="Contact Info"
              value={selectedSection.content.bodyText || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { bodyText: v })}
              placeholder="email@example.com"
            />
          </>
        )}

        {/* ==================== FAQ SECTION ==================== */}
        {sectionType === "faq" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <ItemsSection label="Questions">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Question"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextAreaInput
                    label="Answer"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                    rows={3}
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Question
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== FOOTER SECTION ==================== */}
        {sectionType === "footer" && (
          <>
            <TextInput
              label="Logo Text"
              value={selectedSection.content.logoText || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { logoText: v })}
            />
            <TextInput
              label="Tagline"
              value={selectedSection.content.tagline || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { tagline: v })}
            />
            <NavLinksEditor
              links={selectedSection.content.links || []}
              onChange={(links) => updateSectionContent(selectedSectionId, { links })}
            />
            <TextInput
              label="Copyright Text"
              value={selectedSection.content.bodyText || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { bodyText: v })}
            />
          </>
        )}

        {/* ==================== VIDEO SECTION ==================== */}
        {sectionType === "video" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Video URL"
              value={selectedSection.content.videoUrl || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { videoUrl: v })}
              placeholder="https://youtube.com/embed/..."
            />
          </>
        )}

        {/* ==================== GALLERY SECTION ==================== */}
        {sectionType === "gallery" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <ItemsSection label="Images">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Image URL"
                    value={item.imageUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })}
                  />
                  <TextInput
                    label="Caption (optional)"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Image
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== STATS SECTION ==================== */}
        {sectionType === "stats" && (
          <>
            {/* Variant Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Style
              </label>
              <select
                value={selectedSection.content.statsVariant || "cards"}
                onChange={(e) => updateSectionContent(selectedSectionId, { statsVariant: e.target.value as StatsVariant })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="cards">Cards (with borders)</option>
                <option value="minimal">Minimal (clean lines)</option>
                <option value="bars">Progress Bars</option>
                <option value="circles">Circular Indicators</option>
              </select>
            </div>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <ItemsSection label="Stats">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Value"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                    placeholder="e.g., 10,000+ or $5M"
                  />
                  <TextInput
                    label="Label"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                    placeholder="e.g., Happy Customers"
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Stat
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== LOGO CLOUD SECTION ==================== */}
        {sectionType === "logoCloud" && (
          <>
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <ItemsSection label="Logos">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Brand Name"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextInput
                    label="Logo Image URL"
                    value={item.imageUrl || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })}
                    placeholder="https://..."
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Logo
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== COMPARISON SECTION ==================== */}
        {sectionType === "comparison" && (
          <>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <ItemsSection label="Products to Compare">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Product Name"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                    placeholder="e.g., Us, Competitors"
                  />
                  <ArrayEditor
                    label="Features"
                    items={item.features || []}
                    onChange={(features) => updateItem(selectedSectionId, item.id, { features })}
                    placeholder="Add a feature..."
                  />
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Product
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== PROCESS SECTION ==================== */}
        {sectionType === "process" && (
          <>
            <TextInput
              label="Badge"
              value={selectedSection.content.badge || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { badge: v })}
            />
            <TextInput
              label="Heading"
              value={selectedSection.content.heading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })}
            />
            <TextAreaInput
              label="Subheading"
              value={selectedSection.content.subheading || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="Button Text"
                value={selectedSection.content.buttonText || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonText: v })}
              />
              <TextInput
                label="Button Link"
                value={selectedSection.content.buttonLink || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { buttonLink: v })}
              />
            </div>
            <ItemsSection label="Process Steps">
              {selectedSection.items?.map((item, index) => (
                <ItemCard
                  key={item.id}
                  index={index}
                  onRemove={() => removeItem(selectedSectionId, item.id)}
                >
                  <TextInput
                    label="Step Title"
                    value={item.title || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })}
                  />
                  <TextAreaInput
                    label="Description"
                    value={item.description || ""}
                    onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })}
                    rows={2}
                  />
                  <div className="space-y-2">
                    <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
                      Icon
                    </label>
                    <IconPicker
                      value={item.icon || ""}
                      onChange={(v) => updateItem(selectedSectionId, item.id, { icon: v })}
                    />
                  </div>
                </ItemCard>
              ))}
              <button
                onClick={() => addItem(selectedSectionId)}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
              >
                + Add Step
              </button>
            </ItemsSection>
          </>
        )}

        {/* ==================== SECTION PADDING ==================== */}
        {sectionType !== "header" && sectionType !== "footer" && (
          <div className="pt-4 border-t border-white/5 space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Section Padding
            </label>
            <p className="text-[10px] text-white/30">Drag the handles on the section or set values below</p>
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Top (px)"
                value={selectedSection.content.paddingTop}
                onChange={(v) => updateSectionContent(selectedSectionId, { paddingTop: v })}
                min={0}
                max={200}
                placeholder="64"
              />
              <NumberInput
                label="Bottom (px)"
                value={selectedSection.content.paddingBottom}
                onChange={(v) => updateSectionContent(selectedSectionId, { paddingBottom: v })}
                min={0}
                max={200}
                placeholder="64"
              />
            </div>
            {(selectedSection.content.paddingTop !== undefined || selectedSection.content.paddingBottom !== undefined) && (
              <button
                onClick={() => updateSectionContent(selectedSectionId, { paddingTop: undefined, paddingBottom: undefined })}
                className="text-[10px] text-white/40 hover:text-white/60 underline transition-colors"
              >
                Reset to default
              </button>
            )}
          </div>
        )}

        {/* ==================== COMMON SECTION COLORS ==================== */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
            Section Colors
          </label>
          <div className="grid grid-cols-2 gap-2">
            <ColorInput
              label="Background"
              value={selectedSection.content.backgroundColor || "#0a0a0a"}
              onChange={(v) => updateSectionContent(selectedSectionId, { backgroundColor: v })}
            />
            <ColorInput
              label="Text"
              value={selectedSection.content.textColor || "#ffffff"}
              onChange={(v) => updateSectionContent(selectedSectionId, { textColor: v })}
            />
            <ColorInput
              label="Accent"
              value={selectedSection.content.accentColor || page.colorScheme.accent}
              onChange={(v) => updateSectionContent(selectedSectionId, { accentColor: v })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      />
    </div>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/40">{label}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 999,
  placeholder,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            onChange(undefined);
          } else {
            const num = Math.min(max, Math.max(min, parseInt(val, 10)));
            onChange(isNaN(num) ? undefined : num);
          }
        }}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      />
    </div>
  );
}

function ArrayEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [newItem, setNewItem] = useState("");

  const addNewItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        {label}
      </label>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
            <button
              onClick={() => removeItem(index)}
              className="p-1 rounded hover:bg-red-500/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white/40 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNewItem()}
          placeholder={placeholder}
          className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none"
        />
        <button
          onClick={addNewItem}
          className="px-3 py-1.5 rounded bg-white/10 text-xs text-white/60 hover:bg-white/20 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function NavLinksEditor({
  links,
  onChange,
}: {
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
}) {
  const addLink = () => {
    onChange([...links, { label: "Link", url: "#" }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, updates: Partial<NavLink>) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], ...updates };
    onChange(newLinks);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        Navigation Links
      </label>
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(index, { label: e.target.value })}
              placeholder="Label"
              className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, { url: e.target.value })}
              placeholder="URL"
              className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
            />
            <button
              onClick={() => removeLink(index)}
              className="p-1 rounded hover:bg-red-500/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white/40 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addLink}
        className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
      >
        + Add Link
      </button>
    </div>
  );
}

function ItemsSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
        {label}
      </label>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ItemCard({
  index,
  children,
  onRemove,
}: {
  index: number;
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">Item {index + 1}</span>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-white/40 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
}
