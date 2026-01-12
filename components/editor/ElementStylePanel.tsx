"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  GripHorizontal,
  Type,
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useEditorStore } from "@/lib/store";
import {
  getElementStyleOverride,
  parseComputedFontSize,
  parseComputedFontWeight,
  parseComputedTextAlign,
  parseComputedColor,
} from "@/lib/style-utils";
import type { ElementStyleOverride } from "@/lib/page-schema";

type FontWeight = "normal" | "medium" | "semibold" | "bold";
type TextAlign = "left" | "center" | "right";
type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export default function ElementStylePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Store state
  const elementStylePanel = useEditorStore((s) => s.elementStylePanel);
  const closeElementStylePanel = useEditorStore((s) => s.closeElementStylePanel);
  const updateElementStyle = useEditorStore((s) => s.updateElementStyle);
  const page = useEditorStore((s) => s.page);

  // Get current section and item
  const section = useMemo(() => {
    if (!elementStylePanel) return null;
    return page.sections.find((s) => s.id === elementStylePanel.sectionId) || null;
  }, [page.sections, elementStylePanel]);

  const item = useMemo(() => {
    if (!elementStylePanel?.itemId || !section) return undefined;
    return section.items?.find((i) => i.id === elementStylePanel.itemId);
  }, [section, elementStylePanel?.itemId]);

  // Get current style override
  const currentOverride = useMemo(() => {
    if (!section || !elementStylePanel) return {};
    return getElementStyleOverride(section, elementStylePanel.field, item);
  }, [section, elementStylePanel, item]);

  // Local state for controls (synced with store)
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontWeight, setFontWeight] = useState<FontWeight>("normal");
  const [textAlign, setTextAlign] = useState<TextAlign>("left");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [textTransform, setTextTransform] = useState<TextTransform>("none");
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [letterSpacing, setLetterSpacing] = useState<string>("0em");

  // Initialize position near click point
  useEffect(() => {
    if (elementStylePanel?.position) {
      const panelWidth = 300;
      const panelHeight = 450;
      const padding = 20;

      let x = elementStylePanel.position.x + 10;
      let y = elementStylePanel.position.y + 10;

      // Keep within bounds
      if (x + panelWidth > window.innerWidth - padding) {
        x = elementStylePanel.position.x - panelWidth - 10;
      }
      if (y + panelHeight > window.innerHeight - padding) {
        y = window.innerHeight - panelHeight - padding;
      }
      if (x < padding) x = padding;
      if (y < padding) y = padding;

      setPosition({ x, y });
    }
  }, [elementStylePanel?.position]);

  // Initialize control values from current styles
  useEffect(() => {
    if (currentOverride.fontSize !== undefined) {
      setFontSize(currentOverride.fontSize);
    } else {
      setFontSize(16); // default
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
    } else if (section?.content.textColor) {
      setTextColor(section.content.textColor);
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
  }, [currentOverride, section, page.colorScheme.text]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".panel-header")) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const padding = 10;
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Keep within bounds
    newX = Math.max(padding, Math.min(newX, window.innerWidth - 300 - padding));
    newY = Math.max(padding, Math.min(newY, window.innerHeight - 100 - padding));

    setPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeElementStylePanel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeElementStylePanel]);

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
  const handleReset = useCallback(() => {
    if (!elementStylePanel) return;

    // Clear the style override by setting all to undefined
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

    // Reset local state to defaults
    setFontSize(16);
    setFontWeight("normal");
    setTextAlign("left");
    setTextColor(section?.content.textColor || page.colorScheme.text);
    setTextTransform("none");
    setLineHeight(1.5);
    setLetterSpacing("0em");
  }, [elementStylePanel, handleStyleChange, section, page.colorScheme.text]);

  if (!elementStylePanel || !mounted || !section) return null;

  const fieldLabel = elementStylePanel.field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

  const panel = (
    <div
      ref={panelRef}
      className="fixed z-[200] w-[300px] bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden select-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header - Draggable */}
      <div className="panel-header flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02] cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-white/30" />
          <span className="text-sm font-medium text-white/90">
            Style: {fieldLabel}
          </span>
        </div>
        <button
          onClick={closeElementStylePanel}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
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
                    ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-[#1a1a1c]"
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
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 bg-white/[0.02]">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 hover:text-white/80 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Default
        </button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
