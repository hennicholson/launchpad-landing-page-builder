"use client";

import DOMPurify from "dompurify";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { PageElement, BadgeVariant, IconVariant, DividerVariant, ButtonVariant, ButtonSize, FontWeight, ShadowSize, Breakpoint } from "@/lib/page-schema";
import { DEFAULT_DESIGN_WIDTH, BREAKPOINT_WIDTHS } from "@/lib/page-schema";
import { getElementAtBreakpoint, getCurrentBreakpoint } from "@/lib/breakpoint-utils";
import {
  Star,
  Heart,
  Zap,
  Check,
  X,
  AlertCircle,
  Info,
  ArrowRight,
  Play,
  Share2,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Facebook,
} from "lucide-react";

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

// Default colors for each button variant (used when no custom color is set)
const VARIANT_COLORS: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
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

type Props = {
  element: PageElement;
  scaleFactor?: number;
};

// ===== ANIMATION UTILITIES =====
type AnimationConfig = {
  whileHover?: Record<string, number | string>;
  whileTap?: Record<string, number | string>;
  transition?: Record<string, number | string>;
};

function getAnimationVariants(animation?: { hover?: string; click?: string }): AnimationConfig {
  const config: AnimationConfig = {};

  if (animation?.hover) {
    switch (animation.hover) {
      case 'scale':
        config.whileHover = { scale: 1.05 };
        break;
      case 'lift':
        config.whileHover = { y: -2 };
        break;
      case 'glow':
        config.whileHover = { filter: 'brightness(1.1)' };
        break;
      case 'bounce':
        config.whileHover = { y: -4 };
        config.transition = { type: 'spring', stiffness: 400 };
        break;
      case 'pulse':
        config.whileHover = { scale: 1.02 };
        break;
    }
  }

  if (animation?.click) {
    switch (animation.click) {
      case 'press':
        config.whileTap = { scale: 0.95 };
        break;
      case 'bounce':
        config.whileTap = { scale: 0.9 };
        break;
    }
  }

  return config;
}

// ===== ICON MAPS =====
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  star: Star,
  heart: Heart,
  zap: Zap,
  check: Check,
  x: X,
  alert: AlertCircle,
  info: Info,
  arrow: ArrowRight,
  play: Play,
};

const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  facebook: Facebook,
};

// ===== STYLE MAPS =====
const BADGE_VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.8)" },
  success: { bg: "rgba(34,197,94,0.2)", text: "#4ade80" },
  warning: { bg: "rgba(234,179,8,0.2)", text: "#facc15" },
  error: { bg: "rgba(239,68,68,0.2)", text: "#f87171" },
  info: { bg: "rgba(59,130,246,0.2)", text: "#60a5fa" },
  gradient: { bg: "linear-gradient(to right, #a855f7, #ec4899)", text: "#ffffff" },
  outline: { bg: "transparent", text: "rgba(255,255,255,0.8)" },
  glow: { bg: "rgba(214,252,81,0.2)", text: "#D6FC51" },
};

const VIDEO_SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

const ASPECT_RATIO_MAP: Record<string, string> = {
  '16:9': '16/9',
  '4:3': '4/3',
  '1:1': '1/1',
};

const IMAGE_SHADOW_MAP: Record<ShadowSize, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
};

// ===== BUTTON ELEMENT =====
function ButtonElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const { content, position } = element;
  const animationProps = getAnimationVariants(content.animation);

  // Size defaults for buttons
  const SIZE_DEFAULTS: Record<ButtonSize, { px: number; py: number; fontSize: number }> = {
    sm: { px: 16, py: 8, fontSize: 12 },
    md: { px: 24, py: 12, fontSize: 14 },
    lg: { px: 32, py: 16, fontSize: 16 },
    xl: { px: 40, py: 20, fontSize: 18 },
  };

  const variant: ButtonVariant = content.buttonVariant || "primary";
  const size: ButtonSize = content.buttonSize || "md";
  const sizeDefaults = SIZE_DEFAULTS[size];

  // Apply scale factor to all dimensions
  const paddingX = (content.buttonPaddingX ?? sizeDefaults.px) * scaleFactor;
  const paddingY = (content.buttonPaddingY ?? sizeDefaults.py) * scaleFactor;
  const borderRadius = (content.buttonBorderRadius ?? (variant === 'pill' ? 9999 : 8)) * scaleFactor;
  const fontSize = Math.max(10, (content.buttonFontSize ?? sizeDefaults.fontSize) * scaleFactor);
  const borderWidth = (content.buttonBorderWidth ?? 0) * scaleFactor;

  // Build custom styles with scaling
  const customStyles: React.CSSProperties = {
    paddingLeft: paddingX,
    paddingRight: paddingX,
    paddingTop: paddingY,
    paddingBottom: paddingY,
    borderRadius,
    fontSize,
  };

  if (content.buttonBgColor) customStyles.backgroundColor = content.buttonBgColor;
  if (content.buttonTextColor) customStyles.color = content.buttonTextColor;
  if (borderWidth > 0) {
    customStyles.borderWidth = borderWidth;
    customStyles.borderStyle = 'solid';
    customStyles.borderColor = content.buttonBorderColor || 'currentColor';
  }
  if (content.buttonFontWeight) customStyles.fontWeight = content.buttonFontWeight;

  // Width handling - apply scale factor
  let widthStyle: React.CSSProperties = {};
  if (position.width) {
    widthStyle.width = position.width * scaleFactor;
  } else if (content.buttonWidth === 'full') {
    widthStyle.width = '100%';
  } else if (typeof content.buttonWidth === 'number') {
    widthStyle.width = content.buttonWidth * scaleFactor;
  }

  // Height handling - apply scale factor
  if (position.height) {
    widthStyle.height = position.height * scaleFactor;
  }

  // Shadow
  if (content.buttonShadow && content.buttonShadow !== 'none') {
    customStyles.boxShadow = IMAGE_SHADOW_MAP[content.buttonShadow];
  }

  // Variant-specific base styles
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-[#D6FC51] text-black hover:bg-[#c5eb40]",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outline: "bg-transparent text-white hover:bg-white/10",
    ghost: "bg-transparent text-white/70 hover:text-white",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    neon: "bg-transparent text-[#D6FC51] hover:shadow-[0_0_20px_rgba(214,252,81,0.5)]",
    "3d": "bg-[#D6FC51] text-black shadow-[0_4px_0_#a5c93f]",
    glass: "bg-white/5 backdrop-blur-sm text-white",
    pill: "bg-[#D6FC51] text-black",
    icon: "bg-white/10 text-white",
    underline: "bg-transparent text-white border-b-2 border-[#D6FC51]",
    bounce: "bg-[#D6FC51] text-black",
    // New 21st.dev button variants
    "animated-generate": "bg-[#0a0a0b] text-white border border-white/20",
    liquid: "bg-gradient-to-r from-[#1E10C5] via-[#4743EF] to-[#1E10C5] text-white",
    flow: "bg-transparent text-[#111111] border border-[#333333]/40 hover:bg-[#111111] hover:text-white",
    ripple: "bg-[#D6FC51] text-black border-2 border-[#D6FC51]/50",
    cartoon: "bg-orange-400 text-neutral-800 border-2 border-neutral-800 shadow-[0_4px_0_#262626]",
    win98: "bg-[silver] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]",
  };

  // Font weight mapping
  const FONT_WEIGHTS: Record<FontWeight, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  // Render fancy button components for special variants
  if (FANCY_VARIANTS.includes(variant as typeof FANCY_VARIANTS[number])) {
    const buttonText = content.buttonText || "Button";

    // Get variant defaults for fallback colors
    const variantDefaults = VARIANT_COLORS[variant];

    // Determine final colors: use custom if set, otherwise use variant defaults
    const finalBgColor = content.buttonBgColor || variantDefaults.bg;
    const finalTextColor = content.buttonTextColor || variantDefaults.text;
    const finalBorderColor = content.buttonBorderColor || variantDefaults.border;

    // Build wrapper styles for position-based sizing only
    const wrapperStyles: React.CSSProperties = {
      display: 'inline-flex',
      ...(position.width && { width: `${position.width * scaleFactor}px` }),
      ...(position.height && { height: `${position.height * scaleFactor}px` }),
      ...(content.buttonWidth === "full" && !position.width && { width: "100%" }),
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

    const fancyButton = renderFancyButton();

    // Wrap in link if URL provided, with wrapper styles
    if (content.buttonLink) {
      return (
        <div style={wrapperStyles}>
          <a href={content.buttonLink} target="_blank" rel="noopener noreferrer">
            {fancyButton}
          </a>
        </div>
      );
    }

    return <div style={wrapperStyles}>{fancyButton}</div>;
  }

  const buttonContent = (
    <motion.span
      className={`
        inline-flex items-center justify-center font-semibold transition-all cursor-pointer
        ${variantStyles[variant]}
        ${variant === 'outline' ? 'border border-white/30' : ''}
        ${variant === 'neon' ? 'border border-[#D6FC51]' : ''}
      `}
      style={{ ...customStyles, ...widthStyle }}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
    >
      {content.buttonText || "Click me"}
    </motion.span>
  );

  // Wrap in link if URL provided
  if (content.buttonLink) {
    return (
      <a href={content.buttonLink} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
}

// ===== IMAGE ELEMENT =====
function ImageElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const { content, position } = element;

  // Apply scale factor to all dimensions
  const borderRadius = (content.imageBorderRadius ?? 8) * scaleFactor;
  const shadow = content.imageShadow ? IMAGE_SHADOW_MAP[content.imageShadow] : 'none';
  const rawWidth = position.width ?? content.imageWidth ?? 200;
  const rawHeight = position.height;
  const width = rawWidth * scaleFactor;
  const height = rawHeight ? rawHeight * scaleFactor : undefined;
  const borderWidth = (content.imageBorderWidth ?? 0) * scaleFactor;

  const imageStyles: React.CSSProperties = {
    width,
    height: height ?? 'auto',
    objectFit: content.imageFit || 'cover',
    borderRadius,
    boxShadow: shadow,
  };

  if (borderWidth > 0) {
    imageStyles.border = `${borderWidth}px solid ${content.imageBorderColor || '#fff'}`;
  }

  if (!content.imageUrl) {
    return (
      <div
        className="bg-white/5 flex items-center justify-center"
        style={{ ...imageStyles, backgroundColor: 'rgba(255,255,255,0.05)' }}
      >
        <span className="text-white/30" style={{ fontSize: Math.max(10, 14 * scaleFactor) }}>No image</span>
      </div>
    );
  }

  return (
    <img
      src={content.imageUrl}
      alt={content.imageAlt || ""}
      style={imageStyles}
    />
  );
}

// ===== TEXT ELEMENT =====
function TextElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const { content, position, styles } = element;

  const textType = content.textType || 'paragraph';
  const baseFontSizes: Record<string, number> = {
    heading: 32,
    subheading: 24,
    paragraph: 16,
    caption: 14,
  };

  // Apply scale factor with minimum bounds for readability
  const minFontSize = textType === 'heading' || textType === 'subheading' ? 12 : 10;
  const rawFontSize = content.textFontSize ?? baseFontSizes[textType] ?? 16;
  const fontSize = Math.max(minFontSize, rawFontSize * scaleFactor);

  const textStyles: React.CSSProperties = {
    fontSize,
    fontWeight: textType === 'heading' ? 'bold' : textType === 'subheading' ? 600 : 'normal',
    lineHeight: content.textLineHeight ?? (textType === 'heading' ? 1.2 : textType === 'subheading' ? 1.3 : 1.6),
    color: content.textColor || styles.color || '#ffffff',
    textAlign: content.textAlign || 'left',
  };

  if (textType === 'caption') textStyles.opacity = 0.7;
  if (content.textFontWeight) textStyles.fontWeight = content.textFontWeight;
  if (content.textLetterSpacing) textStyles.letterSpacing = content.textLetterSpacing;
  if (content.textTransform) textStyles.textTransform = content.textTransform;

  // Scale maxWidth proportionally
  const rawMaxWidth = content.textMaxWidth;
  if (rawMaxWidth) {
    textStyles.maxWidth = rawMaxWidth * scaleFactor;
  } else {
    textStyles.maxWidth = 600 * scaleFactor;
  }

  if (position.width) textStyles.width = position.width * scaleFactor;

  return (
    <div style={textStyles}>
      {content.text || "Text element"}
    </div>
  );
}

// ===== DIVIDER ELEMENT =====
function DividerElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const variant: DividerVariant = element.content.dividerVariant || "solid";
  // Apply scale factor to dimensions
  const width = (element.content.dividerWidth || 200) * scaleFactor;
  const thickness = Math.max(1, (element.content.dividerThickness || 1) * scaleFactor);
  const color = element.styles.color || "rgba(255,255,255,0.2)";

  if (variant === "gradient") {
    return (
      <div
        style={{
          width,
          height: thickness,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    );
  }

  if (variant === "double") {
    return (
      <div className="flex flex-col gap-1" style={{ width }}>
        <div style={{ borderTopWidth: thickness, borderTopStyle: "solid", borderTopColor: color }} />
        <div style={{ borderTopWidth: thickness, borderTopStyle: "solid", borderTopColor: color }} />
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        borderTopStyle: variant as "solid" | "dashed" | "dotted",
        borderTopWidth: `${thickness}px`,
        borderTopColor: color,
      }}
    />
  );
}

// ===== ICON ELEMENT =====
function IconElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const content = element.content;
  const IconComponent = ICON_MAP[content.iconName || "star"] || Star;
  const variant: IconVariant = content.iconVariant || "circle";
  const animationProps = getAnimationVariants(content.animation);

  // Apply scale factor to dimensions
  const size = (content.iconSize ?? 24) * scaleFactor;
  const color = content.iconColor ?? "#D6FC51";
  const bgColor = content.iconBgColor ?? "rgba(255,255,255,0.05)";
  const padding = 12 * scaleFactor;

  const showBackground = variant !== "none";
  const isCircle = variant === "circle" || variant === "glow" || variant === "shadow";
  const hasGlow = variant === "glow";
  const hasShadow = variant === "shadow";

  const wrapperStyles: React.CSSProperties = {
    padding,
    borderRadius: isCircle ? "9999px" : `${8 * scaleFactor}px`,
    backgroundColor: showBackground ? bgColor : "transparent",
    ...(hasShadow ? { boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)" } : {}),
  };

  return (
    <motion.div
      className="inline-flex items-center justify-center"
      style={wrapperStyles}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
    >
      <IconComponent
        style={{
          width: size,
          height: size,
          color,
          ...(hasGlow ? { filter: `drop-shadow(0 0 8px ${color})` } : {}),
        }}
      />
    </motion.div>
  );
}

// ===== BADGE ELEMENT =====
function BadgeElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const content = element.content;
  const variant: BadgeVariant = content.badgeVariant || "default";
  const variantColors = BADGE_VARIANT_COLORS[variant];
  const animationProps = getAnimationVariants(content.animation);

  // Apply scale factor to dimensions
  const bgColor = content.badgeBgColor ?? variantColors.bg;
  const textColor = content.badgeTextColor ?? variantColors.text;
  const paddingX = (content.badgePaddingX ?? 12) * scaleFactor;
  const paddingY = (content.badgePaddingY ?? 4) * scaleFactor;
  const borderRadius = (content.badgeBorderRadius ?? 9999) * scaleFactor;
  const fontSize = Math.max(8, (content.badgeFontSize ?? 12) * scaleFactor);

  const badgeStyles: React.CSSProperties = {
    paddingLeft: paddingX,
    paddingRight: paddingX,
    paddingTop: paddingY,
    paddingBottom: paddingY,
    borderRadius: borderRadius,
    backgroundColor: bgColor.startsWith("linear-gradient") ? undefined : bgColor,
    backgroundImage: bgColor.startsWith("linear-gradient") ? bgColor : undefined,
    color: textColor,
    fontSize: fontSize,
    fontWeight: 600,
    ...(variant === "outline" ? { border: "1px solid rgba(255,255,255,0.3)" } : {}),
    ...(variant === "glow" ? { boxShadow: "0 0 10px rgba(214,252,81,0.3)" } : {}),
  };

  return (
    <motion.span
      className="inline-flex items-center"
      style={badgeStyles}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
    >
      {content.badgeText || "Badge"}
    </motion.span>
  );
}

// ===== VIDEO ELEMENT =====
function VideoElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const { content, position } = element;
  const videoUrl = content.videoUrl || "";

  // Apply scale factor to dimensions
  const borderRadius = (content.videoBorderRadius ?? 12) * scaleFactor;
  const shadow = VIDEO_SHADOW_MAP[content.videoShadow || 'none'];
  const width = (position.width ?? content.videoWidth ?? 400) * scaleFactor;
  const height = position.height ? position.height * scaleFactor : undefined;

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
    return match ? match[1] : null;
  };

  const getVimeoId = (url: string) => {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);
  const aspectRatio = height ? undefined : ASPECT_RATIO_MAP[content.videoAspectRatio || '16:9'];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height: height ?? undefined,
        aspectRatio,
        borderRadius: `${borderRadius}px`,
        boxShadow: shadow,
      }}
    >
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          className="w-full h-full"
          style={{ borderRadius: `${borderRadius}px` }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : vimeoId ? (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          className="w-full h-full"
          style={{ borderRadius: `${borderRadius}px` }}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div
          className="w-full h-full bg-white/5 flex items-center justify-center"
          style={{ borderRadius: `${borderRadius}px` }}
        >
          <div className="text-center text-white/40">
            <Play style={{ width: 48 * scaleFactor, height: 48 * scaleFactor }} className="mx-auto mb-2 opacity-30" />
            <p style={{ fontSize: Math.max(10, 14 * scaleFactor) }}>Video not available</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== SOCIAL ELEMENT =====
function SocialElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const content = element.content;
  const links = content.socialLinks || [
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ];

  // Apply scale factor to dimensions
  const iconSize = (content.socialIconSize ?? 20) * scaleFactor;
  const gap = (content.socialGap ?? 12) * scaleFactor;
  const iconColor = content.socialIconColor;
  const socialVariant = content.socialVariant || "default";
  const padding = 10 * scaleFactor;

  const animationProps = getAnimationVariants(content.animation);

  const getIconColor = () => {
    if (iconColor) return iconColor;
    switch (socialVariant) {
      case 'filled': return '#000000';
      case 'minimal': return 'rgba(255,255,255,0.6)';
      default: return 'rgba(255,255,255,0.6)';
    }
  };

  const getVariantStyle = () => {
    const borderRadius = 8 * scaleFactor;
    switch (socialVariant) {
      case 'filled': return { backgroundColor: '#D6FC51', borderRadius };
      case 'minimal': return {};
      default: return { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius };
    }
  };

  return (
    <div className="flex items-center" style={{ gap: `${gap}px` }}>
      {links.map((link: { platform: string; url: string }, index: number) => {
        const Icon = SOCIAL_ICON_MAP[link.platform] || Share2;
        return (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            whileHover={animationProps.whileHover}
            whileTap={animationProps.whileTap}
            transition={animationProps.transition}
            style={{ color: getIconColor(), padding, ...getVariantStyle() }}
          >
            <Icon
              className="transition-colors"
              style={{
                width: iconSize,
                height: iconSize,
              } as React.CSSProperties}
            />
          </motion.a>
        );
      })}
    </div>
  );
}

// ===== COUNTDOWN ELEMENT =====
function CountdownElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const content = element.content;

  // For static export, we calculate once at build time
  // In production, you'd want to use useEffect with setInterval for live updates
  const targetDate = content.countdownTarget
    ? new Date(content.countdownTarget)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

  // Apply scale factor to dimensions
  const boxBgColor = content.countdownBoxBgColor || 'rgba(255,255,255,0.05)';
  const numberColor = content.countdownNumberColor || '#ffffff';
  const labelColor = content.countdownLabelColor || 'rgba(255,255,255,0.4)';
  const borderRadius = (content.countdownBorderRadius ?? 8) * scaleFactor;
  const gap = (content.countdownGap ?? 12) * scaleFactor;
  const showLabels = content.countdownShowLabels !== false;
  const fontSize = Math.max(12, 24 * scaleFactor);
  const labelFontSize = Math.max(8, 10 * scaleFactor);
  const minWidth = 60 * scaleFactor;
  const paddingX = 12 * scaleFactor;
  const paddingY = 8 * scaleFactor;

  return (
    <div className="flex items-center" style={{ gap: `${gap}px` }}>
      {[
        { value: days, label: "Days" },
        { value: hours, label: "Hrs" },
        { value: minutes, label: "Min" },
        { value: seconds, label: "Sec" },
      ].map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center"
          style={{
            backgroundColor: boxBgColor,
            borderRadius: `${borderRadius}px`,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            minWidth,
          }}
        >
          <span
            className="font-bold tabular-nums"
            style={{ color: numberColor, fontSize }}
          >
            {String(value).padStart(2, "0")}
          </span>
          {showLabels && (
            <span
              className="uppercase tracking-wider"
              style={{ color: labelColor, fontSize: labelFontSize }}
            >
              {label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== FORM ELEMENT =====
function FormElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const content = element.content;

  // Apply scale factor to dimensions
  const inputBgColor = content.formInputBgColor || 'rgba(255,255,255,0.05)';
  const inputTextColor = content.formInputTextColor || '#ffffff';
  const buttonBgColor = content.formButtonBgColor || '#D6FC51';
  const buttonTextColor = content.formButtonTextColor || '#000000';
  const borderRadius = (content.formBorderRadius ?? 8) * scaleFactor;
  const borderColor = content.formBorderColor || 'rgba(255,255,255,0.1)';
  const fontSize = Math.max(12, 14 * scaleFactor);
  const inputPadding = `${10 * scaleFactor}px ${16 * scaleFactor}px`;
  const buttonPadding = `${10 * scaleFactor}px ${20 * scaleFactor}px`;
  const minWidth = 200 * scaleFactor;
  const gap = 8 * scaleFactor;

  return (
    <form className="flex" style={{ gap }} onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder={content.formPlaceholder || "Enter your email"}
        className="focus:outline-none"
        style={{
          backgroundColor: inputBgColor,
          color: inputTextColor,
          border: `1px solid ${borderColor}`,
          borderRadius: `${borderRadius}px`,
          padding: inputPadding,
          minWidth,
          fontSize,
        }}
      />
      <button
        type="submit"
        className="font-semibold transition-colors whitespace-nowrap"
        style={{
          backgroundColor: buttonBgColor,
          color: buttonTextColor,
          borderRadius: `${borderRadius}px`,
          padding: buttonPadding,
          fontSize,
        }}
      >
        {content.formButtonText || "Subscribe"}
      </button>
    </form>
  );
}

// ===== HTML ELEMENT =====
function HtmlElement({ element, scaleFactor = 1 }: { element: PageElement; scaleFactor?: number }) {
  const { content, position } = element;
  // Note: In production, htmlCode should be sanitized before storage
  const htmlContent = content.htmlCode || "<p>Custom HTML</p>";

  // Apply scale factor to dimensions
  const width = position.width ? position.width * scaleFactor : undefined;
  const height = position.height ? position.height * scaleFactor : undefined;

  return (
    <div
      className="prose prose-invert prose-sm max-w-none"
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        overflow: height ? "auto" : undefined,
        fontSize: `${Math.max(12, 14 * scaleFactor)}px`,
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
    />
  );
}

// ===== MAIN RENDERER =====
export default function ProductionElementRenderer({ element, scaleFactor = 1 }: Props) {
  // Don't render hidden elements
  if (element.visible === false) {
    return null;
  }

  switch (element.type) {
    case "button":
      return <ButtonElement element={element} scaleFactor={scaleFactor} />;
    case "image":
      return <ImageElement element={element} scaleFactor={scaleFactor} />;
    case "text":
      return <TextElement element={element} scaleFactor={scaleFactor} />;
    case "divider":
      return <DividerElement element={element} scaleFactor={scaleFactor} />;
    case "icon":
      return <IconElement element={element} scaleFactor={scaleFactor} />;
    case "badge":
      return <BadgeElement element={element} scaleFactor={scaleFactor} />;
    case "video":
      return <VideoElement element={element} scaleFactor={scaleFactor} />;
    case "social":
      return <SocialElement element={element} scaleFactor={scaleFactor} />;
    case "countdown":
      return <CountdownElement element={element} scaleFactor={scaleFactor} />;
    case "form":
      return <FormElement element={element} scaleFactor={scaleFactor} />;
    case "html":
      return <HtmlElement element={element} scaleFactor={scaleFactor} />;
    default:
      return (
        <div className="px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded text-sm text-white/40">
          {element.type} element
        </div>
      );
  }
}

// ===== ELEMENTS LAYER FOR PRODUCTION =====
// Renders all elements in a section with absolute positioning
// Supports responsive scaling based on container width vs design canvas width
// Also handles per-breakpoint element overrides
type ProductionElementsLayerProps = {
  elements: PageElement[];
  designCanvasWidth?: number; // Design reference width (default: 896px)
};

export function ProductionElementsLayer({ elements, designCanvasWidth }: ProductionElementsLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Use ResizeObserver to track container width for responsive scaling
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Determine current breakpoint based on container width
  const currentBreakpoint: Breakpoint = containerWidth > 0
    ? getCurrentBreakpoint(containerWidth)
    : 'desktop';

  // Calculate scale factor based on container width vs design width
  const designWidth = designCanvasWidth || DEFAULT_DESIGN_WIDTH;
  const scaleFactor = containerWidth > 0 ? containerWidth / designWidth : 1;

  // Apply breakpoint overrides to elements and filter out hidden ones
  const effectiveElements = elements
    ?.map((element) => getElementAtBreakpoint(element, currentBreakpoint))
    .filter((element) => element.visible !== false) || [];

  if (effectiveElements.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ overflow: "visible" }}>
      {effectiveElements.map((element) => (
        <div
          key={element.id}
          className="absolute pointer-events-auto"
          style={{
            left: `${element.position.x}%`,
            top: `${element.position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <ProductionElementRenderer element={element} scaleFactor={scaleFactor} />
        </div>
      ))}
    </div>
  );
}
