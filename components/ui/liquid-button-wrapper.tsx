"use client";

import { useState } from "react";
import { Liquid, DEFAULT_LIQUID_COLORS, Colors } from "./liquid-button";

interface LiquidButtonProps {
  children: React.ReactNode;
  colors?: Colors;
  primaryColor?: string;  // Simplified: main color that affects the gradient
  textColor?: string;     // Text color
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;  // Custom styles (fontSize, padding, borderRadius, etc.)
}

// Color manipulation helpers
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function adjustBrightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const adjust = (c: number) => Math.max(0, Math.min(255, c + amount));
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

// Generate a rich color palette based on a primary color
function generateColorsFromPrimary(primary: string): Colors {
  // Create variations for smooth liquid gradient effect
  const darker1 = adjustBrightness(primary, -40);
  const darker2 = adjustBrightness(primary, -80);
  const lighter1 = adjustBrightness(primary, 40);
  const lighter2 = adjustBrightness(primary, 80);

  return {
    ...DEFAULT_LIQUID_COLORS,
    // Spread variations across the palette for smooth gradients
    color1: darker2,
    color2: primary,
    color3: lighter1,
    color4: darker1,
    color7: primary,
    color8: lighter2,
    color11: darker1,
    color13: primary,
    color14: lighter1,
    color16: darker2,
  };
}

export function LiquidButton({
  children,
  colors,
  primaryColor,
  textColor = "#ffffff",
  className,
  onClick,
  style,
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Use provided colors, or generate from primaryColor, or use defaults
  const effectiveColors = colors
    ? colors
    : primaryColor
      ? generateColorsFromPrimary(primaryColor)
      : DEFAULT_LIQUID_COLORS;

  return (
    <button
      className={`relative overflow-hidden rounded-[140px] px-8 py-4 font-medium ${className || ""}`}
      style={{ color: textColor, ...style }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Liquid isHovered={isHovered} colors={effectiveColors} />
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default LiquidButton;
