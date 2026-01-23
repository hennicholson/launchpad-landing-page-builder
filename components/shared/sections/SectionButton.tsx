"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type {
  ButtonVariant,
  ButtonSize,
  FontWeight,
  ShadowSize,
  SectionContent
} from "@/lib/page-schema";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import {
  adjustColorBrightness,
  createGradientFromColor,
  hexToRgba,
  generateShadowColor,
  generateWin98BorderColors,
  normalizeColorToHex,
} from "@/lib/utils/colorUtils";

// Helper to determine if a color is light or dark
function isLightColor(color: string): boolean {
  if (!color || color === "transparent") return false;

  // Handle rgba colors
  if (color.startsWith("rgba") || color.startsWith("rgb")) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
  }

  // Remove any alpha channel and convert to lowercase
  let hex = color.toLowerCase().replace(/[^0-9a-f]/g, "");

  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // If not valid hex, assume dark
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// Get auto-contrast text color based on background
function getContrastTextColor(bgColor: string): string {
  return isLightColor(bgColor) ? "#000000" : "#ffffff";
}

// Darken a hex color by a percentage
function darkenColor(color: string, percent: number): string {
  if (!color || color === "transparent" || !color.startsWith("#")) {
    return color;
  }

  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = Math.max(0, Math.floor(parseInt(hex.substring(0, 2), 16) * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(parseInt(hex.substring(2, 4), 16) * (1 - percent / 100)));
  const b = Math.max(0, Math.floor(parseInt(hex.substring(4, 6), 16) * (1 - percent / 100)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Lighten a hex color by a percentage
function lightenColor(color: string, percent: number): string {
  if (!color || color === "transparent" || !color.startsWith("#")) {
    return color;
  }

  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = Math.min(255, Math.floor(parseInt(hex.substring(0, 2), 16) + (255 - parseInt(hex.substring(0, 2), 16)) * (percent / 100)));
  const g = Math.min(255, Math.floor(parseInt(hex.substring(2, 4), 16) + (255 - parseInt(hex.substring(2, 4), 16)) * (percent / 100)));
  const b = Math.min(255, Math.floor(parseInt(hex.substring(4, 6), 16) + (255 - parseInt(hex.substring(4, 6), 16)) * (percent / 100)));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Size defaults
const SIZE_DEFAULTS: Record<ButtonSize, { px: number; py: number; fontSize: number }> = {
  sm: { px: 16, py: 10, fontSize: 12 },
  md: { px: 24, py: 14, fontSize: 14 },
  lg: { px: 32, py: 16, fontSize: 15 },
  xl: { px: 40, py: 20, fontSize: 16 },
};

// Font weight mapping
const FONT_WEIGHTS: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Shadow styles
const SHADOW_STYLES: Record<ShadowSize, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
};

type SectionButtonProps = {
  // Core props
  text: string;
  link: string;
  sectionId: string;

  // Button type for field differentiation
  buttonType?: "primary" | "secondary";

  // Button customization from SectionContent
  variant?: ButtonVariant;
  size?: ButtonSize;
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  paddingX?: number;
  paddingY?: number;
  fontSize?: number;
  fontWeight?: FontWeight;
  shadow?: ShadowSize;

  // Context props - color scheme from the page
  sectionBgColor?: string;
  primaryColor?: string;
  accentColor?: string;
  schemeTextColor?: string;
  bodyFont?: string;

  // Render props
  renderText?: BaseSectionProps["renderText"];

  // Layout props
  large?: boolean;
  showArrow?: boolean;
  className?: string;
};

export default function SectionButton({
  text,
  link,
  sectionId,
  buttonType,
  variant,
  size = "lg",
  bgColor,
  textColor,
  borderRadius,
  borderWidth,
  borderColor,
  paddingX,
  paddingY,
  fontSize,
  fontWeight,
  shadow,
  sectionBgColor,
  primaryColor = "#D6FC51",
  accentColor,
  schemeTextColor,
  bodyFont,
  renderText,
  large = false,
  showArrow = true,
  className = "",
}: SectionButtonProps) {
  // Determine the effective variant
  const effectiveVariant: ButtonVariant = variant || "primary";

  // Default scheme text color based on section background
  const defaultSchemeText = sectionBgColor ? getContrastTextColor(sectionBgColor) : "#ffffff";
  const effectiveSchemeTextColor = schemeTextColor || defaultSchemeText;

  // Determine effective size
  const effectiveSize: ButtonSize = large ? "xl" : size;
  const sizeDefaults = SIZE_DEFAULTS[effectiveSize];

  // Calculate effective values
  const effectivePaddingX = paddingX ?? sizeDefaults.px;
  const effectivePaddingY = paddingY ?? sizeDefaults.py;
  const effectiveFontSize = fontSize ?? sizeDefaults.fontSize;
  const effectiveFontWeight = FONT_WEIGHTS[fontWeight ?? "semibold"];

  /**
   * Helper function to get base variant styling separated into structure and colors
   * This allows us to preserve variant effects while customizing colors
   */
  function getVariantBaseStyle(variant: ButtonVariant): {
    structural: React.CSSProperties;
    colors: {
      bg: string;
      text: string;
      borderWidth: number;
      borderColor: string;
      borderRadius: number;
      shadow: string;
    };
    isFancyVariant: boolean;
  } {
    switch (variant) {
      case "gradient":
        return {
          structural: {},
          colors: {
            bg: `linear-gradient(135deg, ${primaryColor}, ${accentColor || lightenColor(primaryColor, 30)})`,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 14,
            shadow: shadow ? SHADOW_STYLES[shadow] : `0 4px 20px ${primaryColor}40`,
          },
          isFancyVariant: true,
        };

      case "neon":
        return {
          structural: {},
          colors: {
            bg: "transparent",
            text: primaryColor,
            borderWidth: 2,
            borderColor: primaryColor,
            borderRadius: 12,
            shadow: `0 0 15px ${primaryColor}60, 0 0 30px ${primaryColor}30, inset 0 0 15px ${primaryColor}10`,
          },
          isFancyVariant: true,
        };

      case "3d":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 14,
            shadow: `0 6px 0 ${darkenColor(primaryColor, 25)}, 0 8px 20px ${primaryColor}30`,
          },
          isFancyVariant: true,
        };

      case "glass":
        return {
          structural: {
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          },
          colors: {
            bg: `${effectiveSchemeTextColor}08`,
            text: effectiveSchemeTextColor,
            borderWidth: 1,
            borderColor: `${effectiveSchemeTextColor}15`,
            borderRadius: 16,
            shadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
          isFancyVariant: true,
        };

      case "pill":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 9999,
            shadow: shadow ? SHADOW_STYLES[shadow] : `0 4px 15px ${primaryColor}30`,
          },
          isFancyVariant: true,
        };

      case "liquid":
        return {
          structural: {},
          colors: {
            bg: `linear-gradient(135deg, ${primaryColor}, ${accentColor || lightenColor(primaryColor, 20)}, ${primaryColor})`,
            text: getContrastTextColor(primaryColor),
            borderWidth: 2,
            borderColor: `${primaryColor}80`,
            borderRadius: 24,
            shadow: `0 8px 32px ${primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
          },
          isFancyVariant: true,
        };

      case "flow":
        return {
          structural: {},
          colors: {
            bg: "transparent",
            text: "#111111",
            borderWidth: 2,
            borderColor: "rgba(51,51,51,0.4)",
            borderRadius: 100,
            shadow: "none",
          },
          isFancyVariant: true,
        };

      case "ripple":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 2,
            borderColor: `${primaryColor}50`,
            borderRadius: 8,
            shadow: SHADOW_STYLES[shadow ?? "sm"],
          },
          isFancyVariant: true,
        };

      case "cartoon":
        return {
          structural: {},
          colors: {
            bg: "#fb923c",
            text: "#262626",
            borderWidth: 2,
            borderColor: "#262626",
            borderRadius: 9999,
            shadow: "0 4px 0 0 #262626",
          },
          isFancyVariant: true,
        };

      case "win98":
        return {
          structural: {},
          colors: {
            bg: "#c0c0c0",
            text: "#000000",
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 0,
            shadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf",
          },
          isFancyVariant: true,
        };

      case "bounce":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 14,
            shadow: shadow ? SHADOW_STYLES[shadow] : `0 4px 15px ${primaryColor}30`,
          },
          isFancyVariant: true,
        };

      // Simple variants - fully overridable
      case "primary":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 12,
            shadow: SHADOW_STYLES[shadow ?? "none"],
          },
          isFancyVariant: false,
        };

      case "secondary":
        return {
          structural: {},
          colors: {
            bg: `${effectiveSchemeTextColor}12`,
            text: effectiveSchemeTextColor,
            borderWidth: 1,
            borderColor: `${effectiveSchemeTextColor}20`,
            borderRadius: 12,
            shadow: SHADOW_STYLES[shadow ?? "none"],
          },
          isFancyVariant: false,
        };

      case "outline":
        return {
          structural: {},
          colors: {
            bg: "transparent",
            text: effectiveSchemeTextColor,
            borderWidth: 2,
            borderColor: `${effectiveSchemeTextColor}50`,
            borderRadius: 12,
            shadow: SHADOW_STYLES[shadow ?? "none"],
          },
          isFancyVariant: false,
        };

      case "ghost":
        return {
          structural: {},
          colors: {
            bg: "transparent",
            text: effectiveSchemeTextColor,
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 12,
            shadow: SHADOW_STYLES[shadow ?? "none"],
          },
          isFancyVariant: false,
        };

      case "icon":
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 12,
            shadow: SHADOW_STYLES[shadow ?? "none"],
          },
          isFancyVariant: false,
        };

      case "underline":
        return {
          structural: {},
          colors: {
            bg: "transparent",
            text: effectiveSchemeTextColor,
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 0,
            shadow: "none",
          },
          isFancyVariant: false,
        };

      case "animated-generate":
        return {
          structural: {},
          colors: {
            bg: "#0a0a0b",
            text: "#ffffff",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
            borderRadius: 24,
            shadow: "inset 0px 1px 1px rgba(255,255,255,0.2), inset 0px 2px 2px rgba(255,255,255,0.15), 0 -4px 8px rgba(0,0,0,0.1)",
          },
          isFancyVariant: false,
        };

      default:
        return {
          structural: {},
          colors: {
            bg: primaryColor,
            text: getContrastTextColor(primaryColor),
            borderWidth: 0,
            borderColor: "transparent",
            borderRadius: 12,
            shadow: "none",
          },
          isFancyVariant: false,
        };
    }
  }

  /**
   * Applies color overrides while preserving variant structural properties
   */
  function applyColorOverrides(
    baseStyle: ReturnType<typeof getVariantBaseStyle>,
    overrides: {
      bgColor?: string;
      textColor?: string;
      borderRadius?: number;
      borderWidth?: number;
      borderColor?: string;
    }
  ): {
    effectiveBgColor: string;
    effectiveTextColor: string;
    effectiveBorderRadius: number;
    effectiveBorderWidth: number;
    effectiveBorderColor: string;
    effectiveShadow: string;
    structuralStyle: React.CSSProperties;
  } {
    const { structural, colors, isFancyVariant } = baseStyle;

    // VALIDATE all color overrides before processing
    const validatedOverrides = {
      ...overrides,
      bgColor: overrides.bgColor ? normalizeColorToHex(overrides.bgColor, colors.bg) : undefined,
      textColor: overrides.textColor ? normalizeColorToHex(overrides.textColor, colors.text) : undefined,
      borderColor: overrides.borderColor ? normalizeColorToHex(overrides.borderColor, colors.borderColor) : undefined,
    };

    let finalBgColor = colors.bg;
    let finalTextColor = colors.text;
    let finalShadow = colors.shadow;
    let finalBorderColor = colors.borderColor;

    // For fancy variants, intelligently apply color overrides while preserving effects
    if (isFancyVariant && validatedOverrides.bgColor) {
      const customBg = validatedOverrides.bgColor;

      // Special handling per variant type
      if (effectiveVariant === "gradient" || effectiveVariant === "liquid") {
        // For gradient variants, create a new gradient from the custom color
        finalBgColor = createGradientFromColor(customBg, colors.bg);
        // Update shadow to match new color
        finalShadow = `0 4px 20px ${hexToRgba(customBg, 0.25)}`;
      } else if (effectiveVariant === "neon") {
        // Neon stays transparent but updates border/text/glow to match
        finalBgColor = "transparent";
        finalTextColor = validatedOverrides.textColor ?? customBg;
        finalBorderColor = validatedOverrides.borderColor ?? customBg;
        finalShadow = `0 0 15px ${hexToRgba(customBg, 0.6)}, 0 0 30px ${hexToRgba(customBg, 0.3)}, inset 0 0 15px ${hexToRgba(customBg, 0.1)}`;
      } else if (effectiveVariant === "3d") {
        // 3D uses custom bg and auto-generates shadow
        finalBgColor = customBg;
        finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(customBg);
        const shadowColor = generateShadowColor(customBg);
        finalShadow = `0 6px 0 ${shadowColor}, 0 8px 20px ${hexToRgba(customBg, 0.3)}`;
      } else if (effectiveVariant === "glass") {
        // Glass adjusts opacity but keeps backdrop blur
        finalBgColor = hexToRgba(customBg, 0.08);
        finalTextColor = validatedOverrides.textColor ?? customBg;
        finalBorderColor = validatedOverrides.borderColor ?? hexToRgba(customBg, 0.15);
      } else if (effectiveVariant === "pill" || effectiveVariant === "bounce") {
        // Pill and bounce use custom bg with updated glow
        finalBgColor = customBg;
        finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(customBg);
        finalShadow = `0 4px 15px ${hexToRgba(customBg, 0.3)}`;
      } else if (effectiveVariant === "win98") {
        // Win98 generates borders from custom color
        const { light, dark } = generateWin98BorderColors(customBg);
        finalBgColor = customBg;
        finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(customBg);
        finalShadow = `inset -1px -1px ${dark}, inset 1px 1px ${light}, inset -2px -2px ${adjustColorBrightness(dark, -10)}, inset 2px 2px ${adjustColorBrightness(light, 10)}`;
      } else if (effectiveVariant === "cartoon") {
        // Cartoon uses custom bg with dark border
        finalBgColor = customBg;
        finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(customBg);
        const borderCol = adjustColorBrightness(customBg, -60);
        finalBorderColor = validatedOverrides.borderColor ?? borderCol;
        finalShadow = `0 4px 0 0 ${borderCol}`;
      } else {
        // Default fancy variant handling
        finalBgColor = customBg;
        finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(customBg);
      }
    } else if (!isFancyVariant && validatedOverrides.bgColor) {
      // Simple variants: fully override colors
      finalBgColor = validatedOverrides.bgColor;
      finalTextColor = validatedOverrides.textColor ?? getContrastTextColor(validatedOverrides.bgColor);
    } else {
      // No bgColor override, just apply text color if provided
      if (validatedOverrides.textColor) {
        finalTextColor = validatedOverrides.textColor;
      }
    }

    return {
      effectiveBgColor: finalBgColor,
      effectiveTextColor: finalTextColor,
      effectiveBorderRadius: validatedOverrides.borderRadius ?? colors.borderRadius,
      effectiveBorderWidth: validatedOverrides.borderWidth ?? colors.borderWidth,
      effectiveBorderColor: validatedOverrides.borderColor ?? finalBorderColor,
      effectiveShadow: shadow ? SHADOW_STYLES[shadow] : finalShadow,
      structuralStyle: structural,
    };
  }

  // Memoize expensive style calculations
  const buttonStyleData = useMemo(() => {
    // Get base variant styling (preserves effects)
    const baseStyle = getVariantBaseStyle(effectiveVariant);

    // Apply user color overrides while preserving variant effects
    const {
      effectiveBgColor,
      effectiveTextColor,
      effectiveBorderRadius,
      effectiveBorderWidth,
      effectiveBorderColor,
      effectiveShadow,
      structuralStyle,
    } = applyColorOverrides(baseStyle, {
      bgColor,
      textColor,
      borderRadius,
      borderWidth,
      borderColor,
    });

    // Build inline styles
    const isGradient = effectiveBgColor.includes("linear-gradient");
    const buttonStyles: React.CSSProperties = {
      ...structuralStyle, // Apply variant structural properties (backdrop blur, etc.)
      paddingLeft: effectivePaddingX,
      paddingRight: effectivePaddingX,
      paddingTop: effectivePaddingY,
      paddingBottom: effectivePaddingY,
      borderRadius: effectiveBorderRadius,
      backgroundColor: isGradient ? undefined : effectiveBgColor,
      backgroundImage: isGradient ? effectiveBgColor : undefined,
      color: effectiveTextColor,
      borderWidth: effectiveBorderWidth,
      borderStyle: effectiveBorderWidth > 0 ? "solid" : "none",
      borderColor: effectiveBorderColor,
      fontSize: effectiveFontSize,
      fontWeight: effectiveFontWeight,
      fontFamily: bodyFont,
      boxShadow: effectiveShadow,
    };

    return {
      buttonStyles,
      effectiveBgColor,
      effectiveTextColor,
    };
  }, [
    effectiveVariant,
    bgColor,
    textColor,
    borderRadius,
    borderWidth,
    borderColor,
    shadow,
    effectivePaddingX,
    effectivePaddingY,
    effectiveFontSize,
    bodyFont,
    primaryColor,
    accentColor,
    effectiveSchemeTextColor,
  ]);

  const { buttonStyles, effectiveBgColor, effectiveTextColor } = buttonStyleData;

  // Memoize hover animation
  const hoverAnimation = useMemo(() => {
    switch (effectiveVariant) {
      case "primary":
        return { scale: 1.03, boxShadow: `0 8px 25px ${primaryColor}40` };
      case "secondary":
        return { scale: 1.02, backgroundColor: `${effectiveSchemeTextColor}18` };
      case "outline":
        return { scale: 1.02, backgroundColor: `${effectiveSchemeTextColor}08`, borderColor: effectiveSchemeTextColor };
      case "ghost":
        return { scale: 1.02, backgroundColor: `${effectiveSchemeTextColor}08` };
      case "gradient":
        return { scale: 1.03, boxShadow: `0 8px 30px ${primaryColor}50` };
      case "neon":
        return {
          scale: 1.02,
          boxShadow: `0 0 20px ${primaryColor}80, 0 0 40px ${primaryColor}50, 0 0 60px ${primaryColor}30, inset 0 0 20px ${primaryColor}20`,
          backgroundColor: `${primaryColor}10`
        };
      case "3d":
        return { y: 3, boxShadow: `0 3px 0 ${darkenColor(primaryColor, 25)}, 0 4px 10px ${primaryColor}20` };
      case "glass":
        return { scale: 1.02, backgroundColor: `${effectiveSchemeTextColor}12`, boxShadow: `0 12px 40px rgba(0, 0, 0, 0.15)` };
      case "pill":
        return { scale: 1.05, boxShadow: `0 8px 25px ${primaryColor}40` };
      case "icon":
        return { scale: 1.03 };
      case "underline":
        return { opacity: 0.8 };
      case "bounce":
        return { scale: 1.05, y: -3, boxShadow: `0 10px 25px ${primaryColor}40` };
      case "animated-generate":
        return { scale: 1.02, boxShadow: `0 0 20px rgba(255,255,255,0.2), inset 0 1px 2px rgba(255,255,255,0.3)` };
      case "liquid":
        return { scale: 1.03, boxShadow: `0 12px 40px ${primaryColor}50` };
      case "flow":
        return { scale: 1.02, borderColor: "transparent" };
      case "ripple":
        return { scale: 1.02, boxShadow: `0 6px 20px ${primaryColor}30` };
      case "cartoon":
        return { y: -4, boxShadow: "0 8px 0 0 #262626" };
      case "win98":
        return { boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080" };
      default:
        return { scale: 1.02 };
    }
  }, [effectiveVariant, primaryColor, effectiveSchemeTextColor]);

  // Memoize tap animation
  const tapAnimation = useMemo(() => {
    switch (effectiveVariant) {
      case "3d":
        return { y: 6, boxShadow: "none" };
      case "bounce":
        return { scale: 0.95, y: 0 };
      case "cartoon":
        return { y: 0, boxShadow: "none" };
      case "win98":
        return { boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080" };
      default:
        return { scale: 0.98 };
    }
  }, [effectiveVariant]);

  // Extra classes for specific variants
  const extraClasses = `
    group relative inline-flex items-center justify-center gap-3 transition-all overflow-hidden cursor-pointer
    ${effectiveVariant === "underline" ? "underline underline-offset-8 decoration-2 decoration-current hover:underline-offset-4" : ""}
    ${className}
  `.trim();

  return (
    <motion.a
      href={link || "#"}
      className={extraClasses}
      style={buttonStyles}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        ...(effectiveVariant === "bounce" ? { type: "spring", stiffness: 500, damping: 15 } : {})
      }}
    >
      {/* Shine effect overlay */}
      {effectiveVariant !== "underline" && effectiveVariant !== "ghost" && (
        <span
          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${isLightColor(effectiveBgColor) ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"} 50%, transparent 60%)`,
            transform: "translateX(-100%)",
            animation: "none",
          }}
        />
      )}

      {/* Glow pulse for neon variant */}
      {effectiveVariant === "neon" && (
        <span
          className="absolute inset-0 rounded-[inherit] opacity-50"
          style={{
            boxShadow: `0 0 20px ${primaryColor}40`,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}

      <span
        className="relative z-10 uppercase tracking-wider"
        style={{ fontWeight: effectiveFontWeight }}
      >
        {renderText ? (
          renderText({
            value: text || "",
            sectionId,
            field: buttonType === "secondary" ? "secondaryButtonText" :
                   buttonType === "primary" ? "primaryButtonText" :
                   "buttonText",
            className: "uppercase tracking-wider",
            style: { fontFamily: bodyFont, fontWeight: effectiveFontWeight },
          })
        ) : (
          text || "Get Started"
        )}
      </span>

      {showArrow && effectiveVariant !== "underline" && (
        <svg
          className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      )}

      {/* Underline indicator for underline variant */}
      {effectiveVariant === "underline" && (
        <span
          className="absolute bottom-0 left-0 w-full h-0.5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
          style={{ backgroundColor: effectiveTextColor }}
        />
      )}

      {/* Add keyframe for neon pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </motion.a>
  );
}

// Helper to extract button props from SectionContent
export function getButtonPropsFromContent(content: SectionContent) {
  return {
    variant: content.buttonVariant,
    size: content.buttonSize,
    bgColor: content.buttonBgColor,
    textColor: content.buttonTextColor,
    borderRadius: content.buttonBorderRadius,
    borderWidth: content.buttonBorderWidth,
    borderColor: content.buttonBorderColor,
    paddingX: content.buttonPaddingX,
    paddingY: content.buttonPaddingY,
    fontSize: content.buttonFontSize,
    fontWeight: content.buttonFontWeight,
    shadow: content.buttonShadow,
  };
}

// Helper to extract secondary button props from SectionContent
// Falls back to primary button properties if secondary properties are not set
export function getSecondaryButtonPropsFromContent(content: SectionContent) {
  return {
    variant: content.secondaryButtonVariant ?? content.buttonVariant,
    size: content.secondaryButtonSize ?? content.buttonSize,
    bgColor: content.secondaryButtonBgColor ?? content.buttonBgColor,
    textColor: content.secondaryButtonTextColor ?? content.buttonTextColor,
    borderRadius: content.secondaryButtonBorderRadius ?? content.buttonBorderRadius,
    borderWidth: content.secondaryButtonBorderWidth ?? content.buttonBorderWidth,
    borderColor: content.secondaryButtonBorderColor ?? content.buttonBorderColor,
    paddingX: content.secondaryButtonPaddingX ?? content.buttonPaddingX,
    paddingY: content.secondaryButtonPaddingY ?? content.buttonPaddingY,
    fontSize: content.secondaryButtonFontSize ?? content.buttonFontSize,
    fontWeight: content.secondaryButtonFontWeight ?? content.buttonFontWeight,
    shadow: content.secondaryButtonShadow ?? content.buttonShadow,
  };
}
