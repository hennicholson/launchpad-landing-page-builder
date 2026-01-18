"use client";

import { motion } from "framer-motion";
import type {
  ButtonVariant,
  ButtonSize,
  FontWeight,
  ShadowSize,
  SectionContent
} from "@/lib/page-schema";
import type { BaseSectionProps } from "@/lib/shared-section-types";

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

  // Handle colors based on variant and custom settings
  let effectiveBgColor: string;
  let effectiveTextColor: string;
  let effectiveBorderWidth: number;
  let effectiveBorderColor: string;
  let effectiveBorderRadius: number;
  let effectiveShadow: string;

  // If user set custom bgColor, use it with auto-contrast text (unless text is also set)
  if (bgColor) {
    effectiveBgColor = bgColor;
    effectiveTextColor = textColor ?? getContrastTextColor(bgColor);
    effectiveBorderWidth = borderWidth ?? 0;
    effectiveBorderColor = borderColor ?? "transparent";
    effectiveBorderRadius = borderRadius ?? 12;
    effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
  } else {
    // Use variant-based defaults
    switch (effectiveVariant) {
      case "primary":
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
        break;

      case "secondary":
        effectiveBgColor = `${effectiveSchemeTextColor}12`;
        effectiveTextColor = textColor ?? effectiveSchemeTextColor;
        effectiveBorderWidth = borderWidth ?? 1;
        effectiveBorderColor = borderColor ?? `${effectiveSchemeTextColor}20`;
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
        break;

      case "outline":
        effectiveBgColor = "transparent";
        effectiveTextColor = textColor ?? effectiveSchemeTextColor;
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? `${effectiveSchemeTextColor}50`;
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
        break;

      case "ghost":
        effectiveBgColor = "transparent";
        effectiveTextColor = textColor ?? effectiveSchemeTextColor;
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
        break;

      case "gradient":
        effectiveBgColor = `linear-gradient(135deg, ${primaryColor}, ${accentColor || lightenColor(primaryColor, 30)})`;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 14;
        effectiveShadow = shadow ? SHADOW_STYLES[shadow] : `0 4px 20px ${primaryColor}40`;
        break;

      case "neon":
        effectiveBgColor = "transparent";
        effectiveTextColor = textColor ?? primaryColor;
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? primaryColor;
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = `0 0 15px ${primaryColor}60, 0 0 30px ${primaryColor}30, inset 0 0 15px ${primaryColor}10`;
        break;

      case "3d":
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 14;
        effectiveShadow = `0 6px 0 ${darkenColor(primaryColor, 25)}, 0 8px 20px ${primaryColor}30`;
        break;

      case "glass":
        effectiveBgColor = `${effectiveSchemeTextColor}08`;
        effectiveTextColor = textColor ?? effectiveSchemeTextColor;
        effectiveBorderWidth = borderWidth ?? 1;
        effectiveBorderColor = borderColor ?? `${effectiveSchemeTextColor}15`;
        effectiveBorderRadius = borderRadius ?? 16;
        effectiveShadow = `0 8px 32px rgba(0, 0, 0, 0.1)`;
        break;

      case "pill":
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 9999;
        effectiveShadow = shadow ? SHADOW_STYLES[shadow] : `0 4px 15px ${primaryColor}30`;
        break;

      case "icon":
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 12;
        effectiveShadow = SHADOW_STYLES[shadow ?? "none"];
        break;

      case "underline":
        effectiveBgColor = "transparent";
        effectiveTextColor = textColor ?? effectiveSchemeTextColor;
        effectiveBorderWidth = 0;
        effectiveBorderColor = "transparent";
        effectiveBorderRadius = 0;
        effectiveShadow = "none";
        break;

      case "bounce":
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 0;
        effectiveBorderColor = borderColor ?? "transparent";
        effectiveBorderRadius = borderRadius ?? 14;
        effectiveShadow = shadow ? SHADOW_STYLES[shadow] : `0 4px 15px ${primaryColor}30`;
        break;

      case "animated-generate":
        effectiveBgColor = bgColor ?? "#0a0a0b";
        effectiveTextColor = textColor ?? "#ffffff";
        effectiveBorderWidth = borderWidth ?? 1;
        effectiveBorderColor = borderColor ?? "rgba(255,255,255,0.2)";
        effectiveBorderRadius = borderRadius ?? 24;
        effectiveShadow = `inset 0px 1px 1px rgba(255,255,255,0.2), inset 0px 2px 2px rgba(255,255,255,0.15), 0 -4px 8px rgba(0,0,0,0.1)`;
        break;

      case "liquid":
        effectiveBgColor = `linear-gradient(135deg, ${primaryColor}, ${accentColor || lightenColor(primaryColor, 20)}, ${primaryColor})`;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? `${primaryColor}80`;
        effectiveBorderRadius = borderRadius ?? 24;
        effectiveShadow = `0 8px 32px ${primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.3)`;
        break;

      case "flow":
        effectiveBgColor = "transparent";
        effectiveTextColor = textColor ?? "#111111";
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? "rgba(51,51,51,0.4)";
        effectiveBorderRadius = borderRadius ?? 100;
        effectiveShadow = "none";
        break;

      case "ripple":
        effectiveBgColor = bgColor ?? primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? `${primaryColor}50`;
        effectiveBorderRadius = borderRadius ?? 8;
        effectiveShadow = SHADOW_STYLES[shadow ?? "sm"];
        break;

      case "cartoon":
        effectiveBgColor = bgColor ?? "#fb923c";
        effectiveTextColor = textColor ?? "#262626";
        effectiveBorderWidth = borderWidth ?? 2;
        effectiveBorderColor = borderColor ?? "#262626";
        effectiveBorderRadius = borderRadius ?? 9999;
        effectiveShadow = "0 4px 0 0 #262626";
        break;

      case "win98":
        effectiveBgColor = "#c0c0c0";
        effectiveTextColor = "#000000";
        effectiveBorderWidth = 0;
        effectiveBorderColor = "transparent";
        effectiveBorderRadius = borderRadius ?? 0;
        effectiveShadow = "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf";
        break;

      default:
        effectiveBgColor = primaryColor;
        effectiveTextColor = textColor ?? getContrastTextColor(primaryColor);
        effectiveBorderWidth = 0;
        effectiveBorderColor = "transparent";
        effectiveBorderRadius = 12;
        effectiveShadow = "none";
    }
  }

  // Build inline styles
  const isGradient = effectiveBgColor.includes("linear-gradient");
  const buttonStyles: React.CSSProperties = {
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
    ...(effectiveVariant === "glass" ? { backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" } : {}),
  };

  // Get hover animations based on variant
  const getHoverAnimation = () => {
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
  };

  // Get tap animations based on variant
  const getTapAnimation = () => {
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
  };

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
      whileHover={getHoverAnimation()}
      whileTap={getTapAnimation()}
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
            field: "buttonText",
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
