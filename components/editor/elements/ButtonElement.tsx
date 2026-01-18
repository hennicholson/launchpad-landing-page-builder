"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PageElement, ButtonVariant, ButtonSize, FontWeight, ShadowSize, WidthMode } from "@/lib/page-schema";
import { getAnimationVariants, get3DButtonStyle, get3DButtonActiveStyle } from "@/lib/element-animation-utils";
import { useEditorStoreOrPublished } from "@/lib/store";

// Fancy button components
import { GlassButton } from "@/components/ui/glass-button";
import { AnimatedGenerateButton } from "@/components/ui/animated-generate-button";
import { LiquidButton } from "@/components/ui/liquid-button-wrapper";
import { FlowButton } from "@/components/ui/flow-button";
import { RippleButton } from "@/components/ui/ripple-button";
import { CartoonButton } from "@/components/ui/cartoon-button";
import { Win98Button } from "@/components/ui/win-98-button";

// Variants that use actual fancy components instead of inline styles
const FANCY_VARIANTS = ['glass', 'animated-generate', 'liquid', 'flow', 'ripple', 'cartoon', 'win98'] as const;

type Props = {
  element: PageElement;
  sectionId: string;
  isSelected: boolean;
  scaleFactor?: number; // Scale factor for responsive preview (1 = no scaling)
  onClick: (e: React.MouseEvent) => void;
};

// Variant styles for all button presets (used as defaults when no custom styles)
const VARIANT_STYLES: Record<ButtonVariant, { bg: string; text: string; border?: string; extra?: string }> = {
  primary: { bg: "#D6FC51", text: "#000000", extra: "hover:brightness-95" },
  secondary: { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.1)", extra: "hover:bg-white/20" },
  outline: { bg: "transparent", text: "#ffffff", border: "rgba(255,255,255,0.3)", extra: "hover:bg-white/10" },
  ghost: { bg: "transparent", text: "#ffffff", extra: "hover:bg-white/5" },
  gradient: { bg: "linear-gradient(to right, #a855f7, #ec4899, #ef4444)", text: "#ffffff" },
  neon: { bg: "transparent", text: "#D6FC51", border: "#D6FC51", extra: "shadow-[0_0_10px_#D6FC51,0_0_20px_#D6FC5140]" },
  "3d": { bg: "#D6FC51", text: "#000000", extra: "shadow-[0_4px_0_#a8c940]" },
  glass: { bg: "rgba(255,255,255,0.1)", text: "#ffffff", border: "rgba(255,255,255,0.2)", extra: "backdrop-blur-md" },
  pill: { bg: "#D6FC51", text: "#000000", extra: "hover:brightness-95" },
  icon: { bg: "#D6FC51", text: "#000000", extra: "hover:brightness-95" },
  underline: { bg: "transparent", text: "#ffffff", extra: "underline underline-offset-4 decoration-[#D6FC51]" },
  bounce: { bg: "#D6FC51", text: "#000000", extra: "hover:brightness-95" },
  // New 21st.dev button variants
  "animated-generate": { bg: "#0a0a0b", text: "#ffffff", border: "rgba(255,255,255,0.2)", extra: "shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" },
  liquid: { bg: "linear-gradient(135deg, #1E10C5, #4743EF, #1E10C5)", text: "#ffffff", border: "#1E10C580" },
  flow: { bg: "transparent", text: "#111111", border: "rgba(51,51,51,0.4)", extra: "hover:bg-[#111111] hover:text-white" },
  ripple: { bg: "#D6FC51", text: "#000000", border: "#D6FC5180", extra: "hover:brightness-95" },
  cartoon: { bg: "#fb923c", text: "#262626", border: "#262626", extra: "shadow-[0_4px_0_#262626] hover:-translate-y-1" },
  win98: { bg: "#c0c0c0", text: "#000000", extra: "shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]" },
};

// Size defaults (used when no custom padding/fontSize)
const SIZE_DEFAULTS: Record<ButtonSize, { px: number; py: number; fontSize: number }> = {
  sm: { px: 16, py: 8, fontSize: 12 },
  md: { px: 24, py: 12, fontSize: 14 },
  lg: { px: 32, py: 16, fontSize: 16 },
  xl: { px: 40, py: 20, fontSize: 18 },
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

// Icons for icon variant
function getButtonIcon(variant: ButtonVariant) {
  if (variant === 'icon') {
    return <ArrowRight className="w-4 h-4" />;
  }
  return null;
}

export default function ButtonElement({ element, sectionId, isSelected, scaleFactor = 1, onClick }: Props) {
  const { content, position } = element;
  const { isPreviewMode } = useEditorStoreOrPublished();

  // Get variant and size with fallbacks
  const variant: ButtonVariant = content.buttonVariant || "primary";
  const size: ButtonSize = content.buttonSize || "md";
  const variantStyle = VARIANT_STYLES[variant];
  const sizeDefaults = SIZE_DEFAULTS[size];

  // Get custom values or use variant/size defaults - apply scale factor
  const paddingX = (content.buttonPaddingX ?? sizeDefaults.px) * scaleFactor;
  const paddingY = (content.buttonPaddingY ?? sizeDefaults.py) * scaleFactor;
  const borderRadius = (content.buttonBorderRadius ?? (variant === 'pill' ? 9999 : 8)) * scaleFactor;
  const bgColor = content.buttonBgColor ?? variantStyle.bg;
  const textColor = content.buttonTextColor ?? variantStyle.text;
  const borderWidth = (content.buttonBorderWidth ?? (variantStyle.border ? 2 : 0)) * scaleFactor;
  const borderColor = content.buttonBorderColor ?? variantStyle.border ?? "transparent";
  const fontSize = Math.max(10, (content.buttonFontSize ?? sizeDefaults.fontSize) * scaleFactor);
  const fontWeight = FONT_WEIGHTS[content.buttonFontWeight ?? "semibold"];
  const shadow = content.buttonShadow ?? "none";
  const widthMode: WidthMode = content.buttonWidth ?? "auto";

  // Get animation variants for framer-motion
  const animation = content.animation;
  const animationProps = getAnimationVariants(animation);

  // Special handling for 3D button
  const is3D = variant === "3d";

  // Position dimensions take precedence (Figma-like sizing) - apply scale factor
  const getWidth = () => {
    if (position.width) return `${position.width * scaleFactor}px`;
    if (widthMode === "full") return "100%";
    return "auto";
  };

  // Build inline styles
  const buttonStyles: React.CSSProperties = {
    paddingLeft: paddingX,
    paddingRight: paddingX,
    paddingTop: paddingY,
    paddingBottom: paddingY,
    borderRadius: borderRadius,
    backgroundColor: bgColor.startsWith("linear-gradient") ? undefined : bgColor,
    backgroundImage: bgColor.startsWith("linear-gradient") ? bgColor : undefined,
    color: textColor,
    borderWidth: borderWidth,
    borderStyle: borderWidth > 0 ? "solid" : "none",
    borderColor: borderColor,
    fontSize: fontSize,
    fontWeight: fontWeight,
    boxShadow: is3D ? `0 ${4 * scaleFactor}px 0 #a8c940` : SHADOW_STYLES[shadow],
    width: getWidth(),
    height: position.height ? `${position.height * scaleFactor}px` : "auto",
    ...(variant === "glass" ? { backdropFilter: "blur(12px)" } : {}),
    ...(variant === "neon" ? { boxShadow: "0 0 10px #D6FC51, 0 0 20px #D6FC5140" } : {}),
  };

  // Extra classes for certain variants
  const extraClasses = `
    inline-flex items-center justify-center gap-2 transition-all cursor-pointer
    ${variant === "underline" ? "underline underline-offset-4 decoration-[#D6FC51]" : ""}
    ${isSelected && !isPreviewMode ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black" : ""}
  `;

  // In preview mode, let links work naturally. In edit mode, prevent default for element selection.
  const handleLinkClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.preventDefault();
    }
    // In preview mode, let the link navigate naturally
  };

  // Render fancy button components for special variants
  if (FANCY_VARIANTS.includes(variant as typeof FANCY_VARIANTS[number])) {
    const wrapperClass = `relative inline-flex ${widthMode === "full" && !position.width ? "w-full" : ""} ${isSelected && !isPreviewMode ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black rounded-xl" : ""}`;
    const buttonText = content.buttonText || "Button";

    // Get variant defaults for fallback colors
    const variantDefaults = VARIANT_STYLES[variant];

    // Determine final colors: use custom if set, otherwise use variant defaults
    // This ensures buttons always have appropriate colors for their design
    const finalBgColor = content.buttonBgColor || variantDefaults.bg;
    const finalTextColor = content.buttonTextColor || variantDefaults.text;
    const finalBorderColor = content.buttonBorderColor || variantDefaults.border;

    // Build wrapper styles for position-based sizing only
    const wrapperStyles: React.CSSProperties = {
      ...(position.width && { width: `${position.width * scaleFactor}px` }),
      ...(position.height && { height: `${position.height * scaleFactor}px` }),
      ...(widthMode === "full" && !position.width && { width: "100%" }),
    };

    // Build safe inner styles for fancy buttons
    // Include width/height when user has resized the button via the canvas
    // DO NOT pass borderRadius or padding as they break fancy button designs
    const safeInnerStyles: React.CSSProperties = {
      ...(content.buttonFontSize && { fontSize: `${content.buttonFontSize * scaleFactor}px` }),
      ...(content.buttonFontWeight && { fontWeight: FONT_WEIGHTS[content.buttonFontWeight] }),
      // When user resizes via canvas, make button fill the wrapper
      ...(position.width && { width: '100%' }),
      ...(position.height && { height: '100%' }),
    };

    const renderFancyButton = () => {
      switch (variant) {
        case 'glass':
          return (
            <GlassButton
              bgColor={finalBgColor}
              textColor={finalTextColor}
              borderColor={finalBorderColor}
              style={safeInnerStyles}
            >
              {buttonText}
            </GlassButton>
          );
        case 'animated-generate':
          return (
            <AnimatedGenerateButton
              labelIdle={buttonText}
              labelActive={content.buttonActiveText || "Processing..."}
              bgColor={finalBgColor}
              textColor={finalTextColor}
              borderColor={finalBorderColor}
              style={safeInnerStyles}
            />
          );
        case 'liquid':
          return (
            <LiquidButton
              primaryColor={finalBgColor}
              textColor={finalTextColor}
              style={safeInnerStyles}
            >
              {buttonText}
            </LiquidButton>
          );
        case 'flow':
          return (
            <FlowButton
              text={buttonText}
              bgColor={finalBgColor}
              textColor={finalTextColor}
              borderColor={finalBorderColor}
              style={safeInnerStyles}
            />
          );
        case 'ripple':
          return (
            <RippleButton
              bgColor={finalBgColor}
              textColor={finalTextColor}
              borderColor={finalBorderColor}
              rippleColor={finalTextColor}
              style={safeInnerStyles}
            >
              {buttonText}
            </RippleButton>
          );
        case 'cartoon':
          return (
            <CartoonButton
              label={buttonText}
              bgColor={finalBgColor}
              textColor={finalTextColor}
              borderColor={finalBorderColor}
              style={safeInnerStyles}
            />
          );
        case 'win98':
          return (
            <Win98Button
              bgColor={finalBgColor}
              textColor={finalTextColor}
              style={safeInnerStyles}
            >
              {buttonText}
            </Win98Button>
          );
        default:
          return null;
      }
    };

    return (
      <div onClick={onClick} className={wrapperClass} style={wrapperStyles}>
        {renderFancyButton()}
      </div>
    );
  }

  return (
    <div onClick={onClick} className={`relative ${widthMode === "full" && !position.width ? "w-full" : ""}`}>
      <motion.a
        href={content.buttonLink || "#"}
        target={isPreviewMode && content.buttonLink ? "_blank" : undefined}
        rel={isPreviewMode && content.buttonLink ? "noopener noreferrer" : undefined}
        className={extraClasses}
        style={buttonStyles}
        onClick={handleLinkClick}
        whileHover={{
          ...animationProps.whileHover,
          ...(is3D ? { y: 2, boxShadow: "0 2px 0 #a8c940" } : {}),
          ...(variant === "neon" ? { boxShadow: "0 0 15px #D6FC51, 0 0 30px #D6FC5160" } : {}),
        }}
        whileTap={{
          ...animationProps.whileTap,
          ...(is3D ? get3DButtonActiveStyle() : {}),
        }}
        transition={animationProps.transition}
      >
        {content.buttonText || "Button"}
        {getButtonIcon(variant)}
      </motion.a>
    </div>
  );
}
