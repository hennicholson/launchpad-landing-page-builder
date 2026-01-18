"use client";

import { useMemo, useState } from "react";
import { useEditorStore } from "@/lib/store";
import type { PageElement, ElementContent, Breakpoint } from "@/lib/page-schema";
import { ELEMENT_PRESETS, getPreset, hasPresets } from "@/lib/element-presets";
import ElementPresetBrowser from "./ElementPresetBrowser";
import {
  Star, Heart, Zap, Check, X, AlertCircle, Info, ArrowRight, Play, Lock, Unlock, Eye, EyeOff, Smartphone, RotateCcw,
} from "lucide-react";
import { hasBreakpointOverrides, getOverriddenBreakpoints } from "@/lib/breakpoint-utils";

// Icon options for icon element
const ICON_OPTIONS = [
  { id: 'star', name: 'Star', icon: Star },
  { id: 'heart', name: 'Heart', icon: Heart },
  { id: 'zap', name: 'Zap', icon: Zap },
  { id: 'check', name: 'Check', icon: Check },
  { id: 'x', name: 'X', icon: X },
  { id: 'alert', name: 'Alert', icon: AlertCircle },
  { id: 'info', name: 'Info', icon: Info },
  { id: 'arrow', name: 'Arrow', icon: ArrowRight },
  { id: 'play', name: 'Play', icon: Play },
];

export default function ElementSettingsPanel() {
  const {
    page,
    selectedSectionId,
    selectedElementIds,
    updateElementContent,
    updateElement,
    selectElement,
    currentEditingBreakpoint,
    updateElementContentAtBreakpoint,
    updateElementAtBreakpoint,
    clearElementBreakpointOverrides,
  } = useEditorStore();

  // Get the first selected element ID (for editing, we focus on one at a time)
  const selectedElementId = useMemo(() => {
    return selectedElementIds.size > 0 ? Array.from(selectedElementIds)[0] : null;
  }, [selectedElementIds]);

  // Find the selected element
  const selectedElement = useMemo(() => {
    if (!selectedSectionId || !selectedElementId) return null;
    const section = page.sections.find(s => s.id === selectedSectionId);
    return section?.elements?.find(el => el.id === selectedElementId) || null;
  }, [page.sections, selectedSectionId, selectedElementId]);

  // Check if element has overrides for current breakpoint
  const hasCurrentOverrides = selectedElement
    ? hasBreakpointOverrides(selectedElement, currentEditingBreakpoint)
    : false;
  const overriddenBreakpoints = selectedElement
    ? getOverriddenBreakpoints(selectedElement)
    : [];

  if (!selectedElement) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-white/40">Select an element to edit its settings</p>
      </div>
    );
  }

  // Use breakpoint-aware content update
  const handleContentUpdate = (updates: Partial<ElementContent>) => {
    if (selectedSectionId && selectedElementId) {
      updateElementContentAtBreakpoint(selectedSectionId, selectedElementId, updates);
    }
  };

  // Reset overrides for current breakpoint
  const handleResetBreakpoint = () => {
    if (selectedSectionId && selectedElementId && currentEditingBreakpoint !== 'desktop') {
      clearElementBreakpointOverrides(selectedSectionId, selectedElementId, currentEditingBreakpoint);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = getPreset(selectedElement.type, presetId);
    if (preset && selectedSectionId && selectedElementId) {
      updateElementContent(selectedSectionId, selectedElementId, preset.content);
      if (Object.keys(preset.styles).length > 0) {
        updateElement(selectedSectionId, selectedElementId, {
          styles: { ...selectedElement.styles, ...preset.styles }
        });
      }
    }
  };

  const handleDeselectElement = () => {
    selectElement(selectedSectionId, null);
  };

  // Handler for updating element position dimensions - breakpoint-aware
  const handlePositionUpdate = (updates: Partial<{ width: number; height: number }>) => {
    if (selectedSectionId && selectedElementId) {
      updateElementAtBreakpoint(selectedSectionId, selectedElementId, {
        position: updates,
      });
    }
  };

  // Get current preset ID based on element type
  const getCurrentPresetId = (): string | undefined => {
    switch (selectedElement.type) {
      case 'button': return selectedElement.content.buttonVariant;
      case 'badge': return selectedElement.content.badgeVariant;
      case 'divider': return selectedElement.content.dividerVariant;
      case 'icon': return selectedElement.content.iconVariant;
      case 'text': return selectedElement.content.textType;
      default: return undefined;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white capitalize">{selectedElement.type} Element</h3>
          <p className="text-xs text-white/40 mt-0.5">Edit element properties</p>
        </div>
        <button
          onClick={handleDeselectElement}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Deselect element"
        >
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>

      {/* Breakpoint editing banner */}
      {currentEditingBreakpoint !== 'desktop' && (
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-medium text-purple-300 capitalize">
                Editing {currentEditingBreakpoint} overrides
              </span>
            </div>
          </div>
          <p className="text-[10px] text-purple-300/60 mb-2">
            Changes made here only apply to {currentEditingBreakpoint} viewport
          </p>
          {hasCurrentOverrides && (
            <button
              onClick={handleResetBreakpoint}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to desktop
            </button>
          )}
        </div>
      )}

      {/* Breakpoint overrides indicator */}
      {currentEditingBreakpoint === 'desktop' && overriddenBreakpoints.length > 0 && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-medium text-white/60">
              Has responsive overrides
            </span>
          </div>
          <p className="text-[10px] text-white/40">
            Overrides: {overriddenBreakpoints.join(', ')}
          </p>
        </div>
      )}

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          {selectedElement.visible !== false ? (
            <Eye className="w-4 h-4 text-[#D6FC51]" />
          ) : (
            <EyeOff className="w-4 h-4 text-white/40" />
          )}
          <span className="text-xs text-white/60">
            {selectedElement.visible !== false ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <button
          onClick={() => {
            if (selectedSectionId && selectedElementId) {
              updateElement(selectedSectionId, selectedElementId, {
                visible: selectedElement.visible === false
              });
            }
          }}
          className={`w-10 h-5 rounded-full transition-colors ${
            selectedElement.visible !== false ? 'bg-[#D6FC51]' : 'bg-white/20'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
              selectedElement.visible !== false ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Preset Browser (if presets exist for this type) */}
      {hasPresets(selectedElement.type) && (
        <ElementPresetBrowser
          elementType={selectedElement.type}
          currentPresetId={getCurrentPresetId()}
          onSelectPreset={handleApplyPreset}
        />
      )}

      {/* Dimensions Section (Figma-like sizing) */}
      <DimensionsSection
        element={selectedElement}
        onUpdatePosition={handlePositionUpdate}
      />

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Type-specific settings */}
      {renderSettingsForType(selectedElement, handleContentUpdate)}
    </div>
  );
}

// Render type-specific settings forms
function renderSettingsForType(
  element: PageElement,
  onUpdate: (updates: Partial<ElementContent>) => void
) {
  switch (element.type) {
    case 'button':
      return <ButtonSettings element={element} onUpdate={onUpdate} />;
    case 'image':
      return <ImageSettings element={element} onUpdate={onUpdate} />;
    case 'text':
      return <TextSettings element={element} onUpdate={onUpdate} />;
    case 'badge':
      return <BadgeSettings element={element} onUpdate={onUpdate} />;
    case 'icon':
      return <IconSettings element={element} onUpdate={onUpdate} />;
    case 'divider':
      return <DividerSettings element={element} onUpdate={onUpdate} />;
    case 'video':
      return <VideoSettings element={element} onUpdate={onUpdate} />;
    case 'countdown':
      return <CountdownSettings element={element} onUpdate={onUpdate} />;
    case 'form':
      return <FormSettings element={element} onUpdate={onUpdate} />;
    case 'html':
      return <HtmlSettings element={element} onUpdate={onUpdate} />;
    case 'social':
      return <SocialSettings element={element} onUpdate={onUpdate} />;
    default:
      return <p className="text-xs text-white/40">No settings available</p>;
  }
}

// ==================== SETTINGS COMPONENTS ====================

// ==================== HELPER COMPONENTS ====================

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50">{label}</label>
        <span className="text-xs text-white/40">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#D6FC51]
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:cursor-pointer"
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

function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 4,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/50">{label}</label>
      <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`py-2 text-[10px] font-medium rounded-lg transition-all ${
              value === opt.value
                ? 'bg-[#D6FC51] text-black'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">{title}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

// Dimensions section for Figma-like sizing
function DimensionsSection({
  element,
  onUpdatePosition,
}: {
  element: PageElement;
  onUpdatePosition: (updates: Partial<{ width: number; height: number }>) => void;
}) {
  const [aspectLocked, setAspectLocked] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Get current dimensions (from position or defaults based on element type)
  const getDefaultDimensions = () => {
    switch (element.type) {
      case 'image':
        return { width: element.content.imageWidth || 200, height: 150 };
      case 'video':
        return { width: element.content.videoWidth || 400, height: 225 };
      case 'button':
        return { width: 'auto', height: 'auto' };
      case 'html':
        return { width: 300, height: 200 };
      default:
        return { width: 'auto', height: 'auto' };
    }
  };

  const defaults = getDefaultDimensions();
  const width = element.position.width ?? (typeof defaults.width === 'number' ? defaults.width : undefined);
  const height = element.position.height ?? (typeof defaults.height === 'number' ? defaults.height : undefined);

  const handleWidthChange = (newWidth: number) => {
    if (aspectLocked && aspectRatio && height) {
      const newHeight = Math.round(newWidth / aspectRatio);
      onUpdatePosition({ width: newWidth, height: newHeight });
    } else {
      onUpdatePosition({ width: newWidth });
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (aspectLocked && aspectRatio && width) {
      const newWidth = Math.round(newHeight * aspectRatio);
      onUpdatePosition({ width: newWidth, height: newHeight });
    } else {
      onUpdatePosition({ height: newHeight });
    }
  };

  const toggleAspectLock = () => {
    if (!aspectLocked && width && height) {
      setAspectRatio(width / height);
    }
    setAspectLocked(!aspectLocked);
  };

  const clearDimensions = () => {
    onUpdatePosition({ width: undefined as any, height: undefined as any });
  };

  // Don't show for elements that don't support dimensions
  if (!['image', 'video', 'button', 'icon', 'badge', 'countdown', 'form', 'html'].includes(element.type)) {
    return null;
  }

  return (
    <div className="space-y-3">
      <SectionDivider title="Dimensions" />

      <div className="flex items-end gap-2">
        {/* Width Input */}
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-medium text-white/40">W</label>
          <input
            type="number"
            value={width ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : undefined;
              if (val && val > 0) handleWidthChange(val);
            }}
            placeholder="auto"
            className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white text-center placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          />
        </div>

        {/* Aspect Lock Button */}
        <button
          onClick={toggleAspectLock}
          className={`p-1.5 rounded-lg transition-colors ${
            aspectLocked
              ? 'bg-[#D6FC51]/20 text-[#D6FC51]'
              : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
          title={aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
        >
          {aspectLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Height Input */}
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-medium text-white/40">H</label>
          <input
            type="number"
            value={height ?? ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : undefined;
              if (val && val > 0) handleHeightChange(val);
            }}
            placeholder="auto"
            className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white text-center placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          />
        </div>
      </div>

      {/* Clear dimensions button */}
      {(width || height) && (
        <button
          onClick={clearDimensions}
          className="text-[10px] text-white/40 hover:text-white/60 transition-colors"
        >
          Reset to auto
        </button>
      )}
    </div>
  );
}

// ==================== BUTTON SETTINGS ====================

// Default colors for each button variant (must match ButtonElement.tsx VARIANT_STYLES)
const BUTTON_VARIANT_COLORS: Record<string, { bg: string; text: string; border?: string }> = {
  primary: { bg: "#D6FC51", text: "#000000" },
  secondary: { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.1)" },
  outline: { bg: "transparent", text: "#ffffff", border: "rgba(255,255,255,0.3)" },
  ghost: { bg: "transparent", text: "#ffffff" },
  gradient: { bg: "linear-gradient(to right, #a855f7, #ec4899, #ef4444)", text: "#ffffff" },
  neon: { bg: "transparent", text: "#D6FC51", border: "#D6FC51" },
  "3d": { bg: "#D6FC51", text: "#000000" },
  glass: { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.2)" },
  pill: { bg: "#D6FC51", text: "#000000" },
  icon: { bg: "#D6FC51", text: "#000000" },
  underline: { bg: "transparent", text: "#ffffff" },
  bounce: { bg: "#D6FC51", text: "#000000" },
  "animated-generate": { bg: "#0a0a0b", text: "#ffffff", border: "rgba(255,255,255,0.2)" },
  liquid: { bg: "#1E10C5", text: "#ffffff" },
  flow: { bg: "#111111", text: "#111111", border: "rgba(51,51,51,0.4)" },
  ripple: { bg: "#D6FC51", text: "#000000", border: "#D6FC5180" },
  cartoon: { bg: "#fb923c", text: "#262626", border: "#262626" },
  win98: { bg: "#c0c0c0", text: "#000000" },
};

// Fancy button variants that have fixed designs (borderRadius/padding shouldn't be customized)
const FANCY_BUTTON_VARIANTS = ['glass', 'animated-generate', 'liquid', 'flow', 'ripple', 'cartoon', 'win98'];

function ButtonSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  // Get variant-specific default colors
  const variant = content.buttonVariant || 'primary';
  const variantColors = BUTTON_VARIANT_COLORS[variant] || BUTTON_VARIANT_COLORS.primary;
  const isFancyVariant = FANCY_BUTTON_VARIANTS.includes(variant);

  return (
    <div className="space-y-4">
      {/* Content Section */}
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Button Text</label>
        <input
          type="text"
          value={content.buttonText || ''}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="Click me"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Link URL</label>
        <input
          type="text"
          value={content.buttonLink || ''}
          onChange={(e) => onUpdate({ buttonLink: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="https://..."
        />
      </div>

      {/* Active State Text - only for animated-generate variant */}
      {content.buttonVariant === 'animated-generate' && (
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Active State Text</label>
          <input
            type="text"
            value={content.buttonActiveText || ''}
            onChange={(e) => onUpdate({ buttonActiveText: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
            placeholder="Processing..."
          />
          <p className="text-xs text-white/30 mt-1">Text shown when button is active/loading</p>
        </div>
      )}

      <SectionDivider title="Size & Spacing" />

      {/* Width Mode */}
      <ToggleGroup
        label="Width"
        options={[
          { value: 'auto', label: 'Auto' },
          { value: 'full', label: 'Full' },
        ]}
        value={content.buttonWidth === 'full' ? 'full' : 'auto'}
        onChange={(v) => onUpdate({ buttonWidth: v as 'auto' | 'full' })}
        columns={2}
      />

      {/* Padding - hidden for fancy variants as it breaks their designs */}
      {!isFancyVariant && (
        <div className="grid grid-cols-2 gap-3">
          <SliderInput
            label="Padding X"
            value={content.buttonPaddingX ?? 24}
            min={8}
            max={64}
            onChange={(v) => onUpdate({ buttonPaddingX: v })}
          />
          <SliderInput
            label="Padding Y"
            value={content.buttonPaddingY ?? 12}
            min={4}
            max={32}
            onChange={(v) => onUpdate({ buttonPaddingY: v })}
          />
        </div>
      )}

      {/* Border Radius - hidden for fancy variants as it breaks their designs */}
      {!isFancyVariant && (
        <SliderInput
          label="Border Radius"
          value={content.buttonBorderRadius ?? 8}
          min={0}
          max={50}
          onChange={(v) => onUpdate({ buttonBorderRadius: v })}
        />
      )}

      {/* Info note for fancy button variants */}
      {isFancyVariant && (
        <p className="text-xs text-white/40 italic">
          This button style has a fixed shape. Customize colors and font below.
        </p>
      )}

      <SectionDivider title="Colors" />

      {/* Colors - use variant-specific defaults */}
      <div className="grid grid-cols-2 gap-2">
        <ColorInput
          label="Background"
          value={content.buttonBgColor || variantColors.bg}
          onChange={(v) => onUpdate({ buttonBgColor: v })}
        />
        <ColorInput
          label="Text"
          value={content.buttonTextColor || variantColors.text}
          onChange={(v) => onUpdate({ buttonTextColor: v })}
        />
      </div>

      {/* Border - hidden for fancy variants as they have their own border styling */}
      {!isFancyVariant && (
        <>
          <SectionDivider title="Border" />
          <SliderInput
            label="Border Width"
            value={content.buttonBorderWidth ?? 0}
            min={0}
            max={4}
            onChange={(v) => onUpdate({ buttonBorderWidth: v })}
          />

          {content.buttonBorderWidth && content.buttonBorderWidth > 0 && (
            <ColorInput
              label="Border Color"
              value={content.buttonBorderColor || variantColors.border || '#ffffff'}
              onChange={(v) => onUpdate({ buttonBorderColor: v })}
            />
          )}
        </>
      )}

      {/* Border color for fancy variants - they have built-in borders */}
      {isFancyVariant && variantColors.border && (
        <>
          <SectionDivider title="Border" />
          <ColorInput
            label="Border Color"
            value={content.buttonBorderColor || variantColors.border}
            onChange={(v) => onUpdate({ buttonBorderColor: v })}
          />
        </>
      )}

      <SectionDivider title="Typography" />

      {/* Font Size */}
      <SliderInput
        label="Font Size"
        value={content.buttonFontSize ?? 14}
        min={10}
        max={24}
        onChange={(v) => onUpdate({ buttonFontSize: v })}
      />

      {/* Font Weight */}
      <ToggleGroup
        label="Font Weight"
        options={[
          { value: 'normal', label: 'Regular' },
          { value: 'medium', label: 'Medium' },
          { value: 'semibold', label: 'Semi' },
          { value: 'bold', label: 'Bold' },
        ]}
        value={content.buttonFontWeight || 'semibold'}
        onChange={(v) => onUpdate({ buttonFontWeight: v })}
        columns={4}
      />

      <SectionDivider title="Effects" />

      {/* Shadow */}
      <ToggleGroup
        label="Shadow"
        options={[
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        value={content.buttonShadow || 'none'}
        onChange={(v) => onUpdate({ buttonShadow: v })}
        columns={4}
      />
    </div>
  );
}

function ImageSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Image URL</label>
        <input
          type="text"
          value={content.imageUrl || ''}
          onChange={(e) => onUpdate({ imageUrl: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Alt Text</label>
        <input
          type="text"
          value={content.imageAlt || ''}
          onChange={(e) => onUpdate({ imageAlt: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="Image description"
        />
      </div>

      <SectionDivider title="Size" />

      <SliderInput
        label="Width"
        value={content.imageWidth || 200}
        min={50}
        max={600}
        step={10}
        onChange={(v) => onUpdate({ imageWidth: v })}
      />

      <ToggleGroup
        label="Object Fit"
        options={[
          { value: 'cover', label: 'Cover' },
          { value: 'contain', label: 'Contain' },
          { value: 'fill', label: 'Fill' },
        ]}
        value={content.imageFit || 'cover'}
        onChange={(v) => onUpdate({ imageFit: v })}
        columns={3}
      />

      <SectionDivider title="Style" />

      <SliderInput
        label="Border Radius"
        value={content.imageBorderRadius ?? 8}
        min={0}
        max={50}
        onChange={(v) => onUpdate({ imageBorderRadius: v })}
      />

      <ToggleGroup
        label="Shadow"
        options={[
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        value={content.imageShadow || 'none'}
        onChange={(v) => onUpdate({ imageShadow: v })}
        columns={4}
      />

      <SectionDivider title="Border" />

      <SliderInput
        label="Border Width"
        value={content.imageBorderWidth ?? 0}
        min={0}
        max={8}
        onChange={(v) => onUpdate({ imageBorderWidth: v })}
      />

      {content.imageBorderWidth && content.imageBorderWidth > 0 && (
        <ColorInput
          label="Border Color"
          value={content.imageBorderColor || '#ffffff'}
          onChange={(v) => onUpdate({ imageBorderColor: v })}
        />
      )}
    </div>
  );
}

function TextSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Text Content</label>
        <textarea
          value={content.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50 resize-none"
          placeholder="Enter your text..."
        />
      </div>

      <SectionDivider title="Typography" />

      <SliderInput
        label="Font Size"
        value={content.textFontSize ?? 16}
        min={10}
        max={72}
        onChange={(v) => onUpdate({ textFontSize: v })}
      />

      <ToggleGroup
        label="Font Weight"
        options={[
          { value: 'normal', label: 'Regular' },
          { value: 'medium', label: 'Medium' },
          { value: 'semibold', label: 'Semi' },
          { value: 'bold', label: 'Bold' },
        ]}
        value={content.textFontWeight || 'normal'}
        onChange={(v) => onUpdate({ textFontWeight: v })}
        columns={4}
      />

      <ToggleGroup
        label="Text Align"
        options={[
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ]}
        value={content.textAlign || 'left'}
        onChange={(v) => onUpdate({ textAlign: v })}
        columns={3}
      />

      <SectionDivider title="Advanced" />

      <SliderInput
        label="Line Height"
        value={content.textLineHeight ?? 1.5}
        min={1}
        max={2.5}
        step={0.1}
        unit=""
        onChange={(v) => onUpdate({ textLineHeight: v })}
      />

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/50">Letter Spacing</label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { value: '-0.05em', label: 'Tight' },
            { value: 'normal', label: 'Normal' },
            { value: '0.05em', label: 'Wide' },
            { value: '0.1em', label: 'Wider' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ textLetterSpacing: opt.value })}
              className={`py-2 text-[10px] font-medium rounded-lg transition-all ${
                (content.textLetterSpacing || 'normal') === opt.value
                  ? 'bg-[#D6FC51] text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <ToggleGroup
        label="Text Transform"
        options={[
          { value: 'none', label: 'None' },
          { value: 'uppercase', label: 'Upper' },
          { value: 'lowercase', label: 'Lower' },
          { value: 'capitalize', label: 'Cap' },
        ]}
        value={content.textTransform || 'none'}
        onChange={(v) => onUpdate({ textTransform: v })}
        columns={4}
      />

      <SliderInput
        label="Max Width"
        value={content.textMaxWidth ?? 600}
        min={100}
        max={800}
        step={10}
        onChange={(v) => onUpdate({ textMaxWidth: v })}
      />

      <SectionDivider title="Color" />

      <ColorInput
        label="Text Color"
        value={content.textColor || '#ffffff'}
        onChange={(v) => onUpdate({ textColor: v })}
      />
    </div>
  );
}

function BadgeSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Badge Text</label>
        <input
          type="text"
          value={content.badgeText || ''}
          onChange={(e) => onUpdate({ badgeText: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="New"
        />
      </div>

      <SectionDivider title="Size & Spacing" />

      <div className="grid grid-cols-2 gap-3">
        <SliderInput
          label="Padding X"
          value={content.badgePaddingX ?? 12}
          min={4}
          max={32}
          onChange={(v) => onUpdate({ badgePaddingX: v })}
        />
        <SliderInput
          label="Padding Y"
          value={content.badgePaddingY ?? 4}
          min={2}
          max={16}
          onChange={(v) => onUpdate({ badgePaddingY: v })}
        />
      </div>

      <SliderInput
        label="Border Radius"
        value={content.badgeBorderRadius ?? 9999}
        min={0}
        max={50}
        onChange={(v) => onUpdate({ badgeBorderRadius: v })}
      />

      <SectionDivider title="Colors" />

      <div className="grid grid-cols-2 gap-2">
        <ColorInput
          label="Background"
          value={content.badgeBgColor || '#D6FC51'}
          onChange={(v) => onUpdate({ badgeBgColor: v })}
        />
        <ColorInput
          label="Text"
          value={content.badgeTextColor || '#000000'}
          onChange={(v) => onUpdate({ badgeTextColor: v })}
        />
      </div>

      <SectionDivider title="Typography" />

      <SliderInput
        label="Font Size"
        value={content.badgeFontSize ?? 12}
        min={8}
        max={18}
        onChange={(v) => onUpdate({ badgeFontSize: v })}
      />
    </div>
  );
}

function IconSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Icon</label>
        <div className="grid grid-cols-5 gap-1.5">
          {ICON_OPTIONS.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onUpdate({ iconName: id })}
              className={`p-2 rounded-lg transition-colors ${
                content.iconName === id
                  ? 'bg-[#D6FC51]/20 text-[#D6FC51]'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
              title={name}
            >
              <Icon className="w-4 h-4 mx-auto" />
            </button>
          ))}
        </div>
      </div>

      <SectionDivider title="Size" />

      <SliderInput
        label="Icon Size"
        value={content.iconSize ?? 24}
        min={12}
        max={64}
        onChange={(v) => onUpdate({ iconSize: v })}
      />

      <SectionDivider title="Colors" />

      <ColorInput
        label="Icon Color"
        value={content.iconColor || '#D6FC51'}
        onChange={(v) => onUpdate({ iconColor: v })}
      />

      <ColorInput
        label="Background"
        value={content.iconBgColor || 'rgba(255,255,255,0.05)'}
        onChange={(v) => onUpdate({ iconBgColor: v })}
      />

      <SectionDivider title="Style" />

      <ToggleGroup
        label="Background Shape"
        options={[
          { value: 'none', label: 'None' },
          { value: 'circle', label: 'Circle' },
          { value: 'square', label: 'Square' },
        ]}
        value={content.iconVariant || 'circle'}
        onChange={(v) => onUpdate({ iconVariant: v })}
        columns={3}
      />
    </div>
  );
}

function DividerSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Width (px)</label>
        <input
          type="number"
          value={element.content.dividerWidth || 200}
          onChange={(e) => onUpdate({ dividerWidth: parseInt(e.target.value) || 200 })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6FC51]/50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Thickness (px)</label>
        <input
          type="number"
          value={element.content.dividerThickness || 1}
          onChange={(e) => onUpdate({ dividerThickness: parseInt(e.target.value) || 1 })}
          min={1}
          max={10}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6FC51]/50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Color</label>
        <input
          type="color"
          value={element.content.dividerColor || '#ffffff33'}
          onChange={(e) => onUpdate({ dividerColor: e.target.value })}
          className="w-full h-10 bg-white/5 border border-white/10 rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
}

function VideoSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Video URL</label>
        <input
          type="text"
          value={content.videoUrl || ''}
          onChange={(e) => onUpdate({ videoUrl: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="YouTube or Vimeo URL"
        />
        <p className="text-[10px] text-white/30 mt-1">Supports YouTube and Vimeo URLs</p>
      </div>

      <SectionDivider title="Size" />

      <SliderInput
        label="Width"
        value={content.videoWidth || 400}
        min={200}
        max={800}
        step={10}
        onChange={(v) => onUpdate({ videoWidth: v })}
      />

      <ToggleGroup
        label="Aspect Ratio"
        options={[
          { value: '16:9', label: '16:9' },
          { value: '4:3', label: '4:3' },
          { value: '1:1', label: '1:1' },
        ]}
        value={content.videoAspectRatio || '16:9'}
        onChange={(v) => onUpdate({ videoAspectRatio: v })}
        columns={3}
      />

      <SectionDivider title="Style" />

      <SliderInput
        label="Border Radius"
        value={content.videoBorderRadius ?? 12}
        min={0}
        max={32}
        onChange={(v) => onUpdate({ videoBorderRadius: v })}
      />

      <ToggleGroup
        label="Shadow"
        options={[
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        value={content.videoShadow || 'none'}
        onChange={(v) => onUpdate({ videoShadow: v })}
        columns={4}
      />
    </div>
  );
}

function CountdownSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  // Convert ISO string to datetime-local format
  const currentDate = content.countdownTarget
    ? new Date(content.countdownTarget).toISOString().slice(0, 16)
    : '';

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Target Date & Time</label>
        <input
          type="datetime-local"
          value={currentDate}
          onChange={(e) => onUpdate({ countdownTarget: new Date(e.target.value).toISOString() })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#D6FC51]/50"
        />
      </div>

      <SectionDivider title="Display" />

      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs text-white/60">Show Labels</span>
        <button
          onClick={() => onUpdate({ countdownShowLabels: !(content.countdownShowLabels !== false) })}
          className={`w-10 h-5 rounded-full transition-colors ${
            content.countdownShowLabels !== false ? 'bg-[#D6FC51]' : 'bg-white/20'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
              content.countdownShowLabels !== false ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <SliderInput
        label="Gap Between Boxes"
        value={content.countdownGap ?? 12}
        min={4}
        max={32}
        onChange={(v) => onUpdate({ countdownGap: v })}
      />

      <SectionDivider title="Style" />

      <SliderInput
        label="Border Radius"
        value={content.countdownBorderRadius ?? 8}
        min={0}
        max={24}
        onChange={(v) => onUpdate({ countdownBorderRadius: v })}
      />

      <SectionDivider title="Colors" />

      <ColorInput
        label="Box Background"
        value={content.countdownBoxBgColor || 'rgba(255,255,255,0.05)'}
        onChange={(v) => onUpdate({ countdownBoxBgColor: v })}
      />

      <ColorInput
        label="Number Color"
        value={content.countdownNumberColor || '#ffffff'}
        onChange={(v) => onUpdate({ countdownNumberColor: v })}
      />

      <ColorInput
        label="Label Color"
        value={content.countdownLabelColor || 'rgba(255,255,255,0.4)'}
        onChange={(v) => onUpdate({ countdownLabelColor: v })}
      />
    </div>
  );
}

function FormSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Placeholder Text</label>
        <input
          type="text"
          value={content.formPlaceholder || ''}
          onChange={(e) => onUpdate({ formPlaceholder: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Button Text</label>
        <input
          type="text"
          value={content.formButtonText || ''}
          onChange={(e) => onUpdate({ formButtonText: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
          placeholder="Subscribe"
        />
      </div>

      <SectionDivider title="Style" />

      <SliderInput
        label="Border Radius"
        value={content.formBorderRadius ?? 8}
        min={0}
        max={24}
        onChange={(v) => onUpdate({ formBorderRadius: v })}
      />

      <SectionDivider title="Input Colors" />

      <div className="grid grid-cols-2 gap-2">
        <ColorInput
          label="Input Background"
          value={content.formInputBgColor || 'rgba(255,255,255,0.05)'}
          onChange={(v) => onUpdate({ formInputBgColor: v })}
        />
        <ColorInput
          label="Input Text"
          value={content.formInputTextColor || '#ffffff'}
          onChange={(v) => onUpdate({ formInputTextColor: v })}
        />
      </div>

      <ColorInput
        label="Border Color"
        value={content.formBorderColor || 'rgba(255,255,255,0.1)'}
        onChange={(v) => onUpdate({ formBorderColor: v })}
      />

      <SectionDivider title="Button Colors" />

      <div className="grid grid-cols-2 gap-2">
        <ColorInput
          label="Button Background"
          value={content.formButtonBgColor || '#D6FC51'}
          onChange={(v) => onUpdate({ formButtonBgColor: v })}
        />
        <ColorInput
          label="Button Text"
          value={content.formButtonTextColor || '#000000'}
          onChange={(v) => onUpdate({ formButtonTextColor: v })}
        />
      </div>
    </div>
  );
}

function HtmlSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">HTML Code</label>
        <textarea
          value={element.content.htmlCode || ''}
          onChange={(e) => onUpdate({ htmlCode: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50 resize-none"
          placeholder="<div>Your HTML here</div>"
        />
        <p className="text-[10px] text-white/30 mt-1">Be careful with custom HTML - it renders as-is</p>
      </div>
    </div>
  );
}

function SocialSettings({ element, onUpdate }: { element: PageElement; onUpdate: (u: Partial<ElementContent>) => void }) {
  const content = element.content;
  const links = content.socialLinks || [
    { platform: 'twitter', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
  ];

  const updateLink = (index: number, url: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], url };
    onUpdate({ socialLinks: newLinks });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 mb-1.5">Social Links</label>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-white/40 w-16 capitalize">{link.platform}</span>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(index, e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D6FC51]/50"
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>

      <SectionDivider title="Style" />

      <ToggleGroup
        label="Variant"
        options={[
          { value: 'default', label: 'Default' },
          { value: 'filled', label: 'Filled' },
          { value: 'minimal', label: 'Minimal' },
        ]}
        value={content.socialVariant || 'default'}
        onChange={(v) => onUpdate({ socialVariant: v })}
        columns={3}
      />

      <SectionDivider title="Size" />

      <SliderInput
        label="Icon Size"
        value={content.socialIconSize ?? 20}
        min={12}
        max={40}
        onChange={(v) => onUpdate({ socialIconSize: v })}
      />

      <SliderInput
        label="Gap"
        value={content.socialGap ?? 12}
        min={4}
        max={32}
        onChange={(v) => onUpdate({ socialGap: v })}
      />

      <SectionDivider title="Color" />

      <ColorInput
        label="Icon Color (Custom)"
        value={content.socialIconColor || ''}
        onChange={(v) => onUpdate({ socialIconColor: v })}
      />
      <p className="text-[10px] text-white/30">Leave empty to use variant default colors</p>
    </div>
  );
}
