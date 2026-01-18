"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useEditorStore, useSelectedSection } from "@/lib/store";
import type { SectionType, LayoutType, NavLink, StatsVariant, CTAVariant, HeaderVariant, HeaderPosition, TestimonialVariant, BackgroundEffect, AnimationPreset, HeadingStyle, ElementStyleOverride, ButtonVariant, ButtonSize, FontWeight as ButtonFontWeight, ShadowSize, SectionContent, FeaturesVariant, SubheadingAnimation, SubheadingSize, SubheadingWeight, ProcessVariant } from "@/lib/page-schema";
import { THEME_PRESETS } from "@/lib/page-schema";
import { IconPicker } from "./IconPicker";
import { ANIMATION_PRESET_LABELS, ANIMATION_PRESET_DESCRIPTIONS } from "@/lib/animation-presets";
import { getElementStyleOverride } from "@/lib/style-utils";
import ElementSettingsPanel from "./ElementSettingsPanel";
import {
  Type,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RotateCcw,
  Settings,
  Paintbrush,
  ChevronUp,
  ChevronDown,
  Trash2,
  MousePointer2,
  Image,
  Minus,
  Tag,
  Star,
  Video,
  Share2,
  Timer,
  Mail,
  Code,
  Link,
  Unlink,
} from "lucide-react";
import type { PageSection, PageElement, ElementType } from "@/lib/page-schema";

type FontWeight = "normal" | "medium" | "semibold" | "bold";
type TextAlign = "left" | "center" | "right";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

// Element type icon mapping
const ELEMENT_TYPE_ICONS: Record<ElementType, React.ComponentType<{ className?: string }>> = {
  button: MousePointer2,
  text: Type,
  image: Image,
  divider: Minus,
  badge: Tag,
  icon: Star,
  video: Video,
  social: Share2,
  countdown: Timer,
  form: Mail,
  html: Code,
};

// Get a label for the element based on its content
function getElementLabel(element: PageElement): string {
  switch (element.type) {
    case 'button': return element.content.buttonText || 'Button';
    case 'text': return (element.content.text || 'Text').slice(0, 20) + (element.content.text && element.content.text.length > 20 ? '...' : '');
    case 'badge': return element.content.badgeText || 'Badge';
    case 'image': return element.content.imageAlt || 'Image';
    case 'icon': return element.content.iconName || 'Icon';
    case 'video': return 'Video Embed';
    case 'countdown': return 'Countdown';
    case 'form': return 'Email Form';
    case 'html': return 'Custom HTML';
    case 'social': return 'Social Links';
    case 'divider': return 'Divider';
    default: return `${element.type} element`;
  }
}

// Get a contextual label for items[] based on section type
function getItemsLabel(sectionType: SectionType): string {
  switch (sectionType) {
    case "features": return "Feature Cards";
    case "pricing": return "Pricing Plans";
    case "offer": return "Offer Details";
    case "testimonials": return "Testimonials";
    case "stats": return "Statistics";
    case "faq": return "FAQ Items";
    case "gallery": return "Gallery Images";
    case "process": return "Process Steps";
    case "comparison": return "Comparison Items";
    case "founders": return "Team Members";
    default: return "Items";
  }
}

// Section Elements List Component
function SectionElementsList({
  section,
  sectionId
}: {
  section: PageSection;
  sectionId: string;
}) {
  const { selectElement, removeElement, reorderElement, selectedElementIds, createGroup, ungroupElements } = useEditorStore();

  const elements = section.elements || [];

  if (elements.length === 0) {
    return null;
  }

  // Check if selected elements can be grouped (2+ selected, not already all in same group)
  const selectedElements = elements.filter(el => selectedElementIds.has(el.id));
  const canGroup = selectedElements.length >= 2;

  // Check if selected elements are all in the same group (for ungrouping)
  const selectedGroupId = selectedElements.length > 0 && selectedElements.every(el => el.groupId && el.groupId === selectedElements[0]?.groupId)
    ? selectedElements[0]?.groupId
    : null;

  const handleGroup = () => {
    if (canGroup) {
      const elementIds = Array.from(selectedElementIds);
      createGroup(sectionId, elementIds);
    }
  };

  const handleUngroup = () => {
    if (selectedGroupId) {
      ungroupElements(sectionId, selectedGroupId);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
          Elements in Section
        </label>
        <span className="text-xs text-white/30">{elements.length}</span>
      </div>

      {/* Group/Ungroup buttons - show when multiple elements selected */}
      {selectedElementIds.size >= 2 && (
        <div className="flex gap-2">
          {canGroup && !selectedGroupId && (
            <button
              onClick={handleGroup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition-colors"
              title="Group selected elements"
            >
              <Link className="w-3 h-3" />
              Group ({selectedElementIds.size})
            </button>
          )}
          {selectedGroupId && (
            <button
              onClick={handleUngroup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/30 transition-colors"
              title="Ungroup elements"
            >
              <Unlink className="w-3 h-3" />
              Ungroup
            </button>
          )}
        </div>
      )}

      <div className="space-y-1">
        {elements.map((element, index) => {
          const IconComponent = ELEMENT_TYPE_ICONS[element.type] || Star;
          const isSelected = selectedElementIds.has(element.id);
          const isFirst = index === 0;
          const isLast = index === elements.length - 1;
          const isGrouped = !!element.groupId;

          return (
            <div
              key={element.id}
              onClick={(e) => selectElement(sectionId, element.id, e.shiftKey)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#D6FC51]/10 ring-1 ring-[#D6FC51]/30"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded ${isSelected ? 'bg-[#D6FC51]/20' : 'bg-white/5'}`}>
                  <IconComponent className={`w-3 h-3 ${isSelected ? 'text-[#D6FC51]' : 'text-white/40'}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-white/70 capitalize">{element.type}</p>
                    {isGrouped && (
                      <span title="Grouped element">
                        <Link className="w-2.5 h-2.5 text-blue-400" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 truncate">
                    {getElementLabel(element)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {/* Reorder buttons - up brings forward (higher z-index), down sends backward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderElement(sectionId, element.id, 'up');
                  }}
                  disabled={isLast}
                  className={`p-1 rounded transition-colors ${
                    isLast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                  }`}
                  title="Bring forward"
                >
                  <ChevronUp className="w-3 h-3 text-white/40" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reorderElement(sectionId, element.id, 'down');
                  }}
                  disabled={isFirst}
                  className={`p-1 rounded transition-colors ${
                    isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                  }`}
                  title="Send backward"
                >
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(sectionId, element.id);
                  }}
                  className="p-1 rounded hover:bg-red-500/20 transition-colors"
                  title="Delete element"
                >
                  <Trash2 className="w-3 h-3 text-white/40 hover:text-red-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PropertyPanel() {
  const {
    page,
    selectedSectionId,
    selectedElementIds,
    updateSectionContent,
    updateColorScheme,
    updateTypography,
    updatePageMeta,
    addItem,
    updateItem,
    removeItem,
    applyThemePreset,
    elementStylePanel,
    closeElementStylePanel,
    updateElementStyle,
    rightPanelTab,
    setRightPanelTab,
  } = useEditorStore();

  const selectedSection = useSelectedSection();

  // Get current section and item for style panel
  const styleSection = useMemo(() => {
    if (!elementStylePanel) return null;
    return page.sections.find((s) => s.id === elementStylePanel.sectionId) || null;
  }, [page.sections, elementStylePanel]);

  const styleItem = useMemo(() => {
    if (!elementStylePanel?.itemId || !styleSection) return undefined;
    return styleSection.items?.find((i) => i.id === elementStylePanel.itemId);
  }, [styleSection, elementStylePanel?.itemId]);

  // Get current style override
  const currentOverride = useMemo(() => {
    if (!styleSection || !elementStylePanel) return {};
    return getElementStyleOverride(styleSection, elementStylePanel.field, styleItem);
  }, [styleSection, elementStylePanel, styleItem]);

  // Local state for style controls (synced with store)
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontWeight, setFontWeight] = useState<FontWeight>("normal");
  const [textAlign, setTextAlign] = useState<TextAlign>("left");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [textTransform, setTextTransform] = useState<TextTransform>("none");
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [letterSpacing, setLetterSpacing] = useState<string>("0em");

  // Initialize control values from current styles
  useEffect(() => {
    if (currentOverride.fontSize !== undefined) {
      setFontSize(currentOverride.fontSize);
    } else {
      setFontSize(16);
    }

    if (currentOverride.fontWeight !== undefined) {
      setFontWeight(currentOverride.fontWeight);
    } else {
      setFontWeight("normal");
    }

    if (currentOverride.textAlign !== undefined) {
      setTextAlign(currentOverride.textAlign);
    } else {
      setTextAlign("left");
    }

    if (currentOverride.color !== undefined) {
      setTextColor(currentOverride.color);
    } else if (styleSection?.content.textColor) {
      setTextColor(styleSection.content.textColor);
    } else {
      setTextColor(page.colorScheme.text);
    }

    if (currentOverride.textTransform !== undefined) {
      setTextTransform(currentOverride.textTransform);
    } else {
      setTextTransform("none");
    }

    if (currentOverride.lineHeight !== undefined) {
      setLineHeight(currentOverride.lineHeight);
    } else {
      setLineHeight(1.5);
    }

    if (currentOverride.letterSpacing !== undefined) {
      setLetterSpacing(currentOverride.letterSpacing);
    } else {
      setLetterSpacing("0em");
    }
  }, [currentOverride, styleSection, page.colorScheme.text]);

  // Update store when values change
  const handleStyleChange = useCallback(
    (styles: Partial<ElementStyleOverride>) => {
      if (!elementStylePanel) return;
      updateElementStyle(
        elementStylePanel.sectionId,
        elementStylePanel.field,
        styles,
        elementStylePanel.itemId
      );
    },
    [elementStylePanel, updateElementStyle]
  );

  // Reset all styles
  const handleResetStyles = useCallback(() => {
    if (!elementStylePanel) return;

    handleStyleChange({
      fontSize: undefined,
      fontWeight: undefined,
      fontFamily: undefined,
      textAlign: undefined,
      color: undefined,
      letterSpacing: undefined,
      lineHeight: undefined,
      textTransform: undefined,
    });

    setFontSize(16);
    setFontWeight("normal");
    setTextAlign("left");
    setTextColor(styleSection?.content.textColor || page.colorScheme.text);
    setTextTransform("none");
    setLineHeight(1.5);
    setLetterSpacing("0em");
  }, [elementStylePanel, handleStyleChange, styleSection, page.colorScheme.text]);

  const fieldLabel = elementStylePanel?.field
    ?.replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim() || "Element";

  // If element is selected, show element settings panel
  if (selectedElementIds.size > 0) {
    return (
      <div className="w-80 border-l border-white/5 flex flex-col flex-shrink-0 bg-[#0f0f10] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/5 flex-shrink-0">
          <button
            onClick={() => setRightPanelTab('settings')}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
              rightPanelTab === 'settings'
                ? 'text-white'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </span>
            {rightPanelTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6FC51]" />
            )}
          </button>
          <button
            onClick={() => setRightPanelTab('style')}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-colors relative ${
              rightPanelTab === 'style'
                ? 'text-white'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Paintbrush className="w-3.5 h-3.5" />
              Style
            </span>
            {rightPanelTab === 'style' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6FC51]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {rightPanelTab === 'settings' ? (
            <ElementSettingsPanel />
          ) : (
            <div className="p-4">
              <p className="text-xs text-white/40 text-center">
                Style options coming soon for custom elements
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

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

  // Style tab content component
  const renderStyleTab = () => {
    if (!elementStylePanel || !styleSection) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
            <Paintbrush className="w-6 h-6 text-white/30" />
          </div>
          <p className="text-sm text-white/50 mb-2">No element selected</p>
          <p className="text-xs text-white/30">
            Right-click on text in the preview to style it
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-5">
        {/* Element info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40">Styling</p>
            <p className="text-sm font-medium text-white/90">{fieldLabel}</p>
          </div>
          <button
            onClick={closeElementStylePanel}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Clear selection
          </button>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-white/50">
              <Type className="w-3.5 h-3.5" />
              Font Size
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={fontSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 16;
                  setFontSize(val);
                  handleStyleChange({ fontSize: val });
                }}
                className="w-14 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white font-mono text-right focus:outline-none focus:ring-1 focus:ring-[#D6FC51]/50"
                min={8}
                max={120}
              />
              <span className="text-xs text-white/40">px</span>
            </div>
          </div>
          <input
            type="range"
            min="8"
            max="120"
            value={fontSize}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setFontSize(val);
              handleStyleChange({ fontSize: val });
            }}
            className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-white/50">
            <Bold className="w-3.5 h-3.5" />
            Font Weight
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["normal", "medium", "semibold", "bold"] as const).map((weight) => (
              <button
                key={weight}
                onClick={() => {
                  setFontWeight(weight);
                  handleStyleChange({ fontWeight: weight });
                }}
                className={`py-2 text-[10px] rounded-lg transition-all ${
                  fontWeight === weight
                    ? "bg-[#D6FC51] text-black font-semibold"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {weight.charAt(0).toUpperCase() + weight.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-white/50">
            <AlignLeft className="w-3.5 h-3.5" />
            Alignment
          </label>
          <div className="flex gap-1.5">
            {[
              { value: "left" as const, icon: AlignLeft },
              { value: "center" as const, icon: AlignCenter },
              { value: "right" as const, icon: AlignRight },
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTextAlign(value);
                  handleStyleChange({ textAlign: value });
                }}
                className={`flex-1 py-2.5 flex items-center justify-center rounded-lg transition-all ${
                  textAlign === value
                    ? "bg-[#D6FC51] text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-white/50">
            <Palette className="w-3.5 h-3.5" />
            Text Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                handleStyleChange({ color: e.target.value });
              }}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                handleStyleChange({ color: e.target.value });
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#D6FC51]/50"
            />
          </div>
          {/* Quick colors */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              "#ffffff",
              "#D6FC51",
              "#3b82f6",
              "#ef4444",
              "#22c55e",
              "#f97316",
              "#a855f7",
              "#000000",
            ].map((color) => (
              <button
                key={color}
                onClick={() => {
                  setTextColor(color);
                  handleStyleChange({ color });
                }}
                className={`w-7 h-7 rounded-lg border transition-transform hover:scale-110 ${
                  textColor === color
                    ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-[#0f0f10]"
                    : "border-white/20"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-white/50">
            <Type className="w-3.5 h-3.5" />
            Text Transform
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["none", "uppercase", "lowercase", "capitalize"] as const).map(
              (transform) => (
                <button
                  key={transform}
                  onClick={() => {
                    setTextTransform(transform);
                    handleStyleChange({ textTransform: transform });
                  }}
                  className={`py-2 text-[9px] rounded-lg transition-all ${
                    textTransform === transform
                      ? "bg-[#D6FC51] text-black font-semibold"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {transform === "none" ? "None" : transform.slice(0, 5)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/50">Line Height</label>
            <span className="text-xs text-white/70 font-mono">
              {lineHeight.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={lineHeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setLineHeight(val);
              handleStyleChange({ lineHeight: val });
            }}
            className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/50">Letter Spacing</label>
            <span className="text-xs text-white/70 font-mono">
              {letterSpacing}
            </span>
          </div>
          <input
            type="range"
            min="-0.1"
            max="0.5"
            step="0.01"
            value={parseFloat(letterSpacing)}
            onChange={(e) => {
              const val = `${e.target.value}em`;
              setLetterSpacing(val);
              handleStyleChange({ letterSpacing: val });
            }}
            className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetStyles}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 hover:text-white/80 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Default
        </button>
      </div>
    );
  };

  return (
    <div className="w-80 border-l border-white/5 flex flex-col flex-shrink-0 bg-[#0f0f10] overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0">
        <button
          onClick={() => setRightPanelTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all ${
            rightPanelTab === 'settings'
              ? "text-white border-b-2 border-[#D6FC51] bg-white/[0.02]"
              : "text-white/50 hover:text-white/70 hover:bg-white/[0.02]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
        <button
          onClick={() => setRightPanelTab('style')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all ${
            rightPanelTab === 'style'
              ? "text-white border-b-2 border-[#D6FC51] bg-white/[0.02]"
              : "text-white/50 hover:text-white/70 hover:bg-white/[0.02]"
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
          Style
          {elementStylePanel && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FC51]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {rightPanelTab === 'style' ? (
        <div className="flex-1 overflow-y-auto">
          {renderStyleTab()}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-['Sora',sans-serif] font-medium text-sm text-white/80 capitalize">
                {selectedSection.type} Settings
              </h2>
              {selectedSection.elements && selectedSection.elements.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-[#D6FC51]/20 text-[#D6FC51] rounded-full">
                  {selectedSection.elements.length} elements
                </span>
              )}
            </div>
          </div>

          {/* Elements List */}
          {selectedSection.elements && selectedSection.elements.length > 0 && (
            <div className="p-4 border-b border-white/5">
              <SectionElementsList section={selectedSection} sectionId={selectedSectionId} />
            </div>
          )}

          <div className="p-4 space-y-5">
        {/* ==================== HEADER SECTION ==================== */}
        {sectionType === "header" && (
          <>
            {/* Layout Style Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Style
              </label>
              <select
                value={selectedSection.content.headerVariant || "default"}
                onChange={(e) => updateSectionContent(selectedSectionId, { headerVariant: e.target.value as HeaderVariant })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="default">Default (Animated)</option>
                <option value="header-2">Scroll Header</option>
                <option value="floating-header">Floating Header</option>
                <option value="simple-header">Simple Header</option>
                <option value="header-with-search">Search Header</option>
              </select>
            </div>
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
            {/* Search placeholder - only for header-with-search variant */}
            {selectedSection.content.headerVariant === "header-with-search" && (
              <TextInput
                label="Search Placeholder"
                value={selectedSection.content.searchPlaceholder || ""}
                onChange={(v) => updateSectionContent(selectedSectionId, { searchPlaceholder: v })}
                placeholder="Search documentation..."
              />
            )}
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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
            {/* Variant Selector - FIRST control */}
            <div className="space-y-2 border-b border-white/5 pb-4 mb-4">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                Layout Style
              </label>
              <select
                value={selectedSection.content.featuresVariant || "default"}
                onChange={(e) => updateSectionContent(selectedSectionId, {
                  featuresVariant: e.target.value as FeaturesVariant
                })}
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10 text-sm text-white hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="default">Default Grid</option>
                <option value="illustrated">Illustrated Cards</option>
                <option value="hover">Hover Effects</option>
                <option value="bento">Bento Grid</option>
                <option value="table">Customer Table</option>
              </select>
            </div>

            {/* Subheading Configuration */}
            <div className="space-y-3 border-b border-white/5 pb-4 mb-4">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                Subheading Style
              </label>

              {/* Animation Type */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 uppercase tracking-wide">
                  Animation
                </label>
                <select
                  value={selectedSection.content.subheadingAnimation || "fadeUp"}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    subheadingAnimation: e.target.value as SubheadingAnimation
                  })}
                  className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/10 text-xs text-white hover:border-white/20 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="fadeUp">Fade Up (Classic)</option>
                  <option value="blurIn">Blur In (Modern)</option>
                  <option value="slideRight">Slide Right</option>
                  <option value="slideLeft">Slide Left</option>
                  <option value="scaleIn">Scale In</option>
                  <option value="stagger">Stagger Words</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 uppercase tracking-wide">
                  Size
                </label>
                <select
                  value={selectedSection.content.subheadingSize || "base"}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    subheadingSize: e.target.value as SubheadingSize
                  })}
                  className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/10 text-xs text-white hover:border-white/20 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="sm">Small (14-16px)</option>
                  <option value="base">Base (16-18px)</option>
                  <option value="lg">Large (18-20px)</option>
                  <option value="xl">Extra Large (20-24px)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 uppercase tracking-wide">
                  Weight
                </label>
                <select
                  value={selectedSection.content.subheadingWeight || "normal"}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    subheadingWeight: e.target.value as SubheadingWeight
                  })}
                  className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/10 text-xs text-white hover:border-white/20 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="normal">Normal (400)</option>
                  <option value="medium">Medium (500)</option>
                  <option value="semibold">Semibold (600)</option>
                </select>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-2">
                <label className="text-[9px] text-white/30 uppercase tracking-wide flex justify-between">
                  <span>Opacity</span>
                  <span className="text-white/50">{selectedSection.content.subheadingOpacity || 80}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={selectedSection.content.subheadingOpacity || 80}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    subheadingOpacity: parseInt(e.target.value)
                  })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Default variant controls */}
            {(!selectedSection.content.featuresVariant || selectedSection.content.featuresVariant === "default") && (
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

            {/* Illustrated variant controls - copy from features-illustrated */}
            {selectedSection.content.featuresVariant === "illustrated" && (
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
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-white/40 uppercase tracking-wide">Visibility</label>
                  <VisibilityToggle
                    label="Show Heading"
                    checked={selectedSection.content.showHeading !== false}
                    onChange={(v) => updateSectionContent(selectedSectionId, { showHeading: v })}
                  />
                  <VisibilityToggle
                    label="Show Subheading"
                    checked={selectedSection.content.showSubheading !== false}
                    onChange={(v) => updateSectionContent(selectedSectionId, { showSubheading: v })}
                  />
                  <VisibilityToggle
                    label="Show Features"
                    checked={selectedSection.content.showItems !== false}
                    onChange={(v) => updateSectionContent(selectedSectionId, { showItems: v })}
                  />
                </div>
                <ItemsSection label="Features">
                  {selectedSection.items?.map((item, index) => (
                    <ItemCard key={item.id} index={index} onRemove={() => removeItem(selectedSectionId, item.id)}>
                      <TextInput label="Title" value={item.title || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })} />
                      <TextAreaInput label="Description" value={item.description || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })} rows={2} />
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">Icon</label>
                        <select value={item.icon || "target"} onChange={(e) => updateItem(selectedSectionId, item.id, { icon: e.target.value })} className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white focus:outline-none">
                          <option value="target">Target</option>
                          <option value="calendar">Calendar Check</option>
                          <option value="sparkles">Sparkles</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">Illustration</label>
                        <select value={item.illustrationType || "meeting"} onChange={(e) => updateItem(selectedSectionId, item.id, { illustrationType: e.target.value as "meeting" | "code-review" | "ai-assistant" })} className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white focus:outline-none">
                          <option value="meeting">Meeting Calendar</option>
                          <option value="code-review">Code Review</option>
                          <option value="ai-assistant">AI Assistant</option>
                        </select>
                      </div>
                    </ItemCard>
                  ))}
                  <button onClick={() => addItem(selectedSectionId)} className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors">+ Add Feature</button>
                </ItemsSection>
              </>
            )}

            {/* Hover variant controls - simplified version */}
            {selectedSection.content.featuresVariant === "hover" && (
              <>
                <TextInput label="Heading" value={selectedSection.content.heading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })} />
                <TextInput label="Subheading" value={selectedSection.content.subheading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })} />
                <ItemsSection label="Features">
                  {selectedSection.items?.map((item, index) => (
                    <ItemCard key={item.id} index={index} onRemove={() => removeItem(selectedSectionId, item.id)}>
                      <TextInput label="Title" value={item.title || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })} />
                      <TextAreaInput label="Description" value={item.description || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })} rows={2} />
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">Icon</label>
                        <select value={item.icon || "terminal"} onChange={(e) => updateItem(selectedSectionId, item.id, { icon: e.target.value })} className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white focus:outline-none">
                          <option value="terminal">Terminal</option>
                          <option value="ease">Ease In Out</option>
                          <option value="dollar">Currency Dollar</option>
                          <option value="cloud">Cloud</option>
                          <option value="route">Route</option>
                          <option value="help">Help</option>
                          <option value="adjustments">Adjustments</option>
                          <option value="heart">Heart</option>
                        </select>
                      </div>
                    </ItemCard>
                  ))}
                  <button onClick={() => addItem(selectedSectionId)} className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors">+ Add Feature</button>
                </ItemsSection>
              </>
            )}

            {/* Bento variant controls - uses grid class */}
            {selectedSection.content.featuresVariant === "bento" && (
              <>
                <TextInput label="Heading" value={selectedSection.content.heading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })} />
                <TextInput label="Subheading" value={selectedSection.content.subheading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })} />
                <ColorInput label="Background Color" value={selectedSection.content.backgroundColor || "#0a1628"} onChange={(v) => updateSectionContent(selectedSectionId, { backgroundColor: v })} />
                <ItemsSection label="Features">
                  {selectedSection.items?.map((item, index) => (
                    <ItemCard key={item.id} index={index} onRemove={() => removeItem(selectedSectionId, item.id)}>
                      <TextInput label="Title" value={item.title || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })} />
                      <TextAreaInput label="Description" value={item.description || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })} rows={2} />
                      <div className="space-y-2">
                        <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Grid Size</label>
                        <select value={item.gridClass || "md:col-span-1"} onChange={(e) => updateItem(selectedSectionId, item.id, { gridClass: e.target.value })} className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white focus:outline-none">
                          <option value="md:col-span-1 md:row-span-1">1x1 (Small)</option>
                          <option value="md:col-span-2 md:row-span-1">2x1 (Wide)</option>
                          <option value="md:col-span-1 md:row-span-2">1x2 (Tall)</option>
                          <option value="md:col-span-2 md:row-span-2">2x2 (Large)</option>
                          <option value="md:col-span-3 md:row-span-1">3x1 (Extra Wide)</option>
                          <option value="md:col-span-4 md:row-span-2">4x2 (Hero)</option>
                        </select>
                      </div>
                    </ItemCard>
                  ))}
                  <button onClick={() => addItem(selectedSectionId)} className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors">+ Add Feature</button>
                </ItemsSection>
              </>
            )}

            {/* Table variant controls - customers table */}
            {selectedSection.content.featuresVariant === "table" && (
              <>
                <TextInput label="Heading" value={selectedSection.content.heading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { heading: v })} />
                <TextInput label="Subheading" value={selectedSection.content.subheading || ""} onChange={(v) => updateSectionContent(selectedSectionId, { subheading: v })} />
                <ItemsSection label="Customers">
                  {selectedSection.items?.map((item, index) => {
                    const meta = item.metadata ? JSON.parse(item.metadata) : {};
                    return (
                      <ItemCard key={item.id} index={index} onRemove={() => removeItem(selectedSectionId, item.id)}>
                        <TextInput label="Name" value={item.title || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { title: v })} />
                        <TextInput label="Email" value={item.description || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { description: v })} />
                        <TextInput label="Avatar URL" value={item.imageUrl || ""} onChange={(v) => updateItem(selectedSectionId, item.id, { imageUrl: v })} />
                        <div className="space-y-2">
                          <label className="text-[10px] font-medium text-white/40 uppercase">Status</label>
                          <select value={meta.status || "active"} onChange={(e) => { const newMeta = { ...meta, status: e.target.value }; updateItem(selectedSectionId, item.id, { metadata: JSON.stringify(newMeta) }); }} className="w-full px-2 py-1.5 rounded bg-black/20 border border-white/5 text-xs text-white">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                        <TextInput label="Revenue" value={meta.revenue || ""} onChange={(v) => { const newMeta = { ...meta, revenue: v }; updateItem(selectedSectionId, item.id, { metadata: JSON.stringify(newMeta) }); }} />
                        <TextInput label="Join Date" value={meta.joinDate || ""} onChange={(v) => { const newMeta = { ...meta, joinDate: v }; updateItem(selectedSectionId, item.id, { metadata: JSON.stringify(newMeta) }); }} />
                      </ItemCard>
                    );
                  })}
                  <button onClick={() => addItem(selectedSectionId)} className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors">+ Add Customer</button>
                </ItemsSection>
              </>
            )}
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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
            {/* Layout Style Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Style
              </label>
              <select
                value={selectedSection.content.testimonialVariant || "scrolling"}
                onChange={(e) => updateSectionContent(selectedSectionId, { testimonialVariant: e.target.value as TestimonialVariant })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="scrolling">Scrolling Columns</option>
                <option value="twitter-cards">Twitter Cards</option>
              </select>
            </div>
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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

            {/* Layout Variant Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Variant
              </label>
              <select
                value={selectedSection.content.videoVariant || "centered"}
                onChange={(e) => updateSectionContent(selectedSectionId, {
                  videoVariant: e.target.value as "centered" | "grid" | "side-by-side" | "fullscreen"
                })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="centered">Centered (Default)</option>
                <option value="grid">Grid Layout</option>
                <option value="side-by-side">Side by Side</option>
                <option value="fullscreen">Fullscreen Hero</option>
              </select>
            </div>

            <TextInput
              label="Video URL"
              value={selectedSection.content.videoUrl || ""}
              onChange={(v) => updateSectionContent(selectedSectionId, { videoUrl: v })}
              placeholder="https://youtube.com/embed/..."
            />

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Aspect Ratio
              </label>
              <select
                value={selectedSection.content.videoAspectRatio || "16:9"}
                onChange={(e) => updateSectionContent(selectedSectionId, {
                  videoAspectRatio: e.target.value as "16:9" | "4:3" | "1:1"
                })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Classic)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>

            {/* Autoplay Toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSection.content.autoplayVideo || false}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    autoplayVideo: e.target.checked
                  })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
                />
                <div>
                  <span className="text-xs font-medium text-white/70">Autoplay Video</span>
                  <p className="text-[10px] text-white/40">Start playing automatically when visible</p>
                </div>
              </label>
            </div>

            {/* Mute Toggle */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSection.content.muteVideo ?? true}
                  onChange={(e) => updateSectionContent(selectedSectionId, {
                    muteVideo: e.target.checked
                  })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50 focus:ring-offset-0"
                />
                <div>
                  <span className="text-xs font-medium text-white/70">Mute Video</span>
                  <p className="text-[10px] text-white/40">Start with audio muted</p>
                </div>
              </label>
            </div>
          </>
        )}

        {/* ==================== GALLERY SECTION ==================== */}
        {sectionType === "gallery" && (
          <>
            {/* Layout Variant Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Layout Style
              </label>
              <select
                value={selectedSection.content.galleryVariant || "bento"}
                onChange={(e) => updateSectionContent(selectedSectionId, {
                  galleryVariant: e.target.value as "bento" | "focusrail"
                })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="bento">Bento Grid</option>
                <option value="focusrail">3D Carousel (FocusRail)</option>
              </select>
            </div>

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
            {/* Variant Selector */}
            <div className="space-y-2 border-b border-white/5 pb-4 mb-4">
              <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                Layout Style
              </label>
              <select
                value={selectedSection.content.processVariant || "timeline"}
                onChange={(e) => updateSectionContent(selectedSectionId, {
                  processVariant: e.target.value as ProcessVariant
                })}
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10 text-sm text-white hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="timeline">Timeline (Vertical)</option>
                <option value="cards">Cards (Grid)</option>
                <option value="horizontal">Horizontal (Steps)</option>
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
            <SectionButtonSettings
              content={selectedSection.content}
              onUpdate={(updates) => updateSectionContent(selectedSectionId, updates)}
            />
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

        {/* ==================== BLANK SECTION ==================== */}
        {sectionType === "blank" && (
          <>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#D6FC51]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#D6FC51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">Blank Canvas</p>
                  <p className="text-[10px] text-white/50">Build freely with custom elements</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Canvas Height
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={selectedSection.content.minHeight || 300}
                  onChange={(e) => updateSectionContent(selectedSectionId, { minHeight: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-xs text-white/60 font-mono w-14 text-right">
                  {selectedSection.content.minHeight || 300}px
                </span>
              </div>
            </div>
          </>
        )}

        {/* ==================== ELEMENT VISIBILITY ==================== */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Element Visibility
            </label>
            <p className="text-[10px] text-white/30 mt-1">Toggle elements on/off</p>
          </div>

          {/* Text Content Group */}
          {(selectedSection.content.heading !== undefined ||
            selectedSection.content.subheading !== undefined ||
            selectedSection.content.bodyText !== undefined ||
            selectedSection.content.badge !== undefined) && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wide">Text Content</div>
              {selectedSection.content.heading !== undefined && (
                <VisibilityToggle
                  label="Heading"
                  checked={selectedSection.content.showHeading !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showHeading: v })}
                />
              )}
              {selectedSection.content.subheading !== undefined && (
                <VisibilityToggle
                  label="Subheading"
                  checked={selectedSection.content.showSubheading !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showSubheading: v })}
                />
              )}
              {selectedSection.content.bodyText !== undefined && (
                <VisibilityToggle
                  label="Body Text"
                  checked={selectedSection.content.showBodyText !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showBodyText: v })}
                />
              )}
              {selectedSection.content.badge !== undefined && (
                <VisibilityToggle
                  label="Badge"
                  checked={selectedSection.content.showBadge !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showBadge: v })}
                />
              )}
            </div>
          )}

          {/* Media Content Group */}
          {(selectedSection.content.imageUrl !== undefined ||
            selectedSection.content.videoUrl !== undefined ||
            selectedSection.content.backgroundImage !== undefined) && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wide">Media</div>
              {selectedSection.content.imageUrl !== undefined && (
                <VisibilityToggle
                  label="Image"
                  checked={selectedSection.content.showImage !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showImage: v })}
                />
              )}
              {selectedSection.content.videoUrl !== undefined && (
                <VisibilityToggle
                  label="Video"
                  checked={selectedSection.content.showVideo !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showVideo: v })}
                />
              )}
              {selectedSection.content.backgroundImage !== undefined && (
                <VisibilityToggle
                  label="Background Image"
                  checked={selectedSection.content.showBackgroundImage !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showBackgroundImage: v })}
                />
              )}
            </div>
          )}

          {/* Interactive Elements Group */}
          {(selectedSection.content.buttonText !== undefined ||
            (sectionType === "header" && selectedSection.content.headerVariant === "header-with-search" && selectedSection.content.searchPlaceholder !== undefined)) && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wide">Interactive</div>
              {selectedSection.content.buttonText !== undefined && (
                <VisibilityToggle
                  label="Button"
                  checked={selectedSection.content.showButton !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showButton: v })}
                />
              )}
              {sectionType === "header" && selectedSection.content.headerVariant === "header-with-search" && selectedSection.content.searchPlaceholder !== undefined && (
                <VisibilityToggle
                  label="Search Bar"
                  checked={selectedSection.content.showSearchBar !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showSearchBar: v })}
                />
              )}
            </div>
          )}

          {/* Section-Specific Content Group */}
          {(selectedSection.items && selectedSection.items.length > 0 ||
            selectedSection.content.brands && selectedSection.content.brands.length > 0 ||
            ((sectionType === "header" || sectionType === "footer") && (selectedSection.content.links && selectedSection.content.links.length > 0)) ||
            ((sectionType === "header" || sectionType === "footer") && (selectedSection.content.logoUrl || selectedSection.content.logoText)) ||
            (sectionType === "footer" && selectedSection.content.tagline) ||
            (sectionType === "audience" && (selectedSection.content.forItems || selectedSection.content.notForItems))) && (
            <div className="space-y-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wide">Section Content</div>
              {selectedSection.items && selectedSection.items.length > 0 && (
                <VisibilityToggle
                  label={getItemsLabel(sectionType)}
                  checked={selectedSection.content.showItems !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showItems: v })}
                />
              )}
              {selectedSection.content.brands && selectedSection.content.brands.length > 0 && (
                <VisibilityToggle
                  label="Brand Logos"
                  checked={selectedSection.content.showBrands !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showBrands: v })}
                />
              )}
              {(sectionType === "header" || sectionType === "footer") && (selectedSection.content.logoUrl || selectedSection.content.logoText) && (
                <VisibilityToggle
                  label="Logo"
                  checked={selectedSection.content.showLogo !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showLogo: v })}
                />
              )}
              {(sectionType === "header" || sectionType === "footer") && selectedSection.content.links && selectedSection.content.links.length > 0 && (
                <VisibilityToggle
                  label="Navigation Links"
                  checked={selectedSection.content.showLinks !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showLinks: v })}
                />
              )}
              {sectionType === "footer" && selectedSection.content.tagline && (
                <VisibilityToggle
                  label="Tagline"
                  checked={selectedSection.content.showTagline !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showTagline: v })}
                />
              )}
              {sectionType === "footer" && (
                <VisibilityToggle
                  label="Social Icons"
                  checked={selectedSection.content.showSocial !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showSocial: v })}
                />
              )}
              {sectionType === "audience" && selectedSection.content.forItems && selectedSection.content.forItems.length > 0 && (
                <VisibilityToggle
                  label="'For You' List"
                  checked={selectedSection.content.showForItems !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showForItems: v })}
                />
              )}
              {sectionType === "audience" && selectedSection.content.notForItems && selectedSection.content.notForItems.length > 0 && (
                <VisibilityToggle
                  label="'Not For You' List"
                  checked={selectedSection.content.showNotForItems !== false}
                  onChange={(v) => updateSectionContent(selectedSectionId, { showNotForItems: v })}
                />
              )}
            </div>
          )}
        </div>

        {/* ==================== SECTION PADDING ==================== */}
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

        {/* ==================== BACKGROUND EFFECT ==================== */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
            Background Effect
          </label>
          <select
            value={selectedSection.content.backgroundEffect || "none"}
            onChange={(e) => updateSectionContent(selectedSectionId, { backgroundEffect: e.target.value as BackgroundEffect })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          >
            <option value="none">None</option>
            <option value="elegant-shapes">Elegant Shapes</option>
            <option value="background-circles">Animated Circles</option>
            <option value="background-paths">Floating Paths</option>
            <option value="glow">Glow Effect</option>
            <option value="shooting-stars">Shooting Stars</option>
            <option value="stars-background">Starry Night</option>
            <option value="wavy-background">Wavy Lines</option>
          </select>
          <p className="text-xs text-white/30">
            Animated background effects work best on dark sections
          </p>
        </div>

        {/* Header Position - only for header sections */}
        {selectedSection.type === "header" && (
          <div className="pt-4 border-t border-white/5 space-y-3">
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
              Header Position
            </label>
            <select
              value={selectedSection.content.headerPosition || "sticky"}
              onChange={(e) => updateSectionContent(selectedSectionId, { headerPosition: e.target.value as HeaderPosition })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              <option value="sticky">Sticky (Follows Scroll)</option>
              <option value="fixed">Fixed (Always Visible)</option>
              <option value="static">Static (Scrolls Away)</option>
            </select>
            <p className="text-xs text-white/30">
              Controls how the header behaves when scrolling
            </p>

            {/* Header Background Opacity */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Background Opacity
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedSection.content.headerBackgroundOpacity ?? 100}
                  onChange={(e) => updateSectionContent(selectedSectionId, { headerBackgroundOpacity: Number(e.target.value) })}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-xs text-white/50 w-10 text-right">
                  {selectedSection.content.headerBackgroundOpacity ?? 100}%
                </span>
              </div>
              <p className="text-xs text-white/30">
                Lower values create glass/blur effects
              </p>
            </div>

            {/* Header Padding */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                Header Padding
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="4"
                  max="40"
                  value={selectedSection.content.headerPaddingY ?? 16}
                  onChange={(e) => updateSectionContent(selectedSectionId, { headerPaddingY: Number(e.target.value) })}
                  className="flex-1 accent-amber-500"
                />
                <span className="text-xs text-white/50 w-10 text-right">
                  {selectedSection.content.headerPaddingY ?? 16}px
                </span>
              </div>
              <p className="text-xs text-white/30">
                Adjust to fit larger buttons
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
      )}
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

function VisibilityToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className={`text-xs transition-colors ${checked ? 'text-white/70' : 'text-white/40'}`}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D6FC51]/50 focus:ring-offset-2 focus:ring-offset-[#0f0f10] ${
          checked ? 'bg-[#D6FC51]' : 'bg-white/10'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

// Button variant options
const BUTTON_VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'neon', label: 'Neon' },
  { value: '3d', label: '3D' },
  { value: 'glass', label: 'Glass' },
  { value: 'pill', label: 'Pill' },
  { value: 'underline', label: 'Underline' },
  { value: 'animated-generate', label: 'Animated Generate' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'flow', label: 'Flow' },
  { value: 'ripple', label: 'Ripple' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'win98', label: 'Win98' },
];

// Button size options
const BUTTON_SIZES: { value: ButtonSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
];

// Reusable Section Button Settings component
function SectionButtonSettings({
  content,
  onUpdate,
}: {
  content: SectionContent;
  onUpdate: (updates: Partial<SectionContent>) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2 mt-3">
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs text-white/60 hover:text-white/80 transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Button Style
      </button>

      {isExpanded && (
        <div className="pl-3 border-l border-white/10 space-y-3">
          {/* Variant */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
              Style
            </label>
            <select
              value={content.buttonVariant || 'primary'}
              onChange={(e) => onUpdate({ buttonVariant: e.target.value as ButtonVariant })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              {BUTTON_VARIANTS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
              Size
            </label>
            <div className="grid grid-cols-4 gap-1">
              {BUTTON_SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onUpdate({ buttonSize: s.value })}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    (content.buttonSize || 'lg') === s.value
                      ? 'bg-[#D6FC51] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-2">
            <ColorInput
              label="Background"
              value={content.buttonBgColor || '#D6FC51'}
              onChange={(v) => onUpdate({ buttonBgColor: v })}
            />
            <ColorInput
              label="Text"
              value={content.buttonTextColor || '#000000'}
              onChange={(v) => onUpdate({ buttonTextColor: v })}
            />
          </div>

          {/* Border */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
                Border Width
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={content.buttonBorderWidth ?? 0}
                  onChange={(e) => onUpdate({ buttonBorderWidth: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51]"
                />
                <span className="text-[10px] text-white/40 w-6 text-right">{content.buttonBorderWidth ?? 0}px</span>
              </div>
            </div>
            <ColorInput
              label="Border Color"
              value={content.buttonBorderColor || '#ffffff'}
              onChange={(v) => onUpdate({ buttonBorderColor: v })}
            />
          </div>

          {/* Border Radius */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
              Border Radius
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={50}
                value={content.buttonBorderRadius ?? 12}
                onChange={(e) => onUpdate({ buttonBorderRadius: parseInt(e.target.value) })}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D6FC51]"
              />
              <span className="text-[10px] text-white/40 w-8 text-right">{content.buttonBorderRadius ?? 12}px</span>
            </div>
          </div>

          {/* Padding */}
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Padding X"
              value={content.buttonPaddingX}
              min={8}
              max={64}
              onChange={(v) => onUpdate({ buttonPaddingX: v })}
            />
            <NumberInput
              label="Padding Y"
              value={content.buttonPaddingY}
              min={4}
              max={32}
              onChange={(v) => onUpdate({ buttonPaddingY: v })}
            />
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <NumberInput
              label="Font Size"
              value={content.buttonFontSize}
              min={10}
              max={24}
              onChange={(v) => onUpdate({ buttonFontSize: v })}
            />
            <div className="space-y-1.5">
              <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
                Font Weight
              </label>
              <select
                value={content.buttonFontWeight || 'semibold'}
                onChange={(e) => onUpdate({ buttonFontWeight: e.target.value as FontWeight })}
                className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
          </div>

          {/* Shadow */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-medium text-white/40 uppercase tracking-wide">
              Shadow
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['none', 'sm', 'md', 'lg'] as ShadowSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ buttonShadow: s })}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                    (content.buttonShadow || 'none') === s
                      ? 'bg-[#D6FC51] text-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {s === 'none' ? 'Off' : s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
