"use client";

import { motion } from "framer-motion";
import type { PageElement, BadgeVariant, IconVariant, DividerVariant } from "@/lib/page-schema";
import { getAnimationVariants } from "@/lib/element-animation-utils";
import { useEditorStoreOrPublished } from "@/lib/store";
import ButtonElement from "./ButtonElement";
import ImageElement from "./ImageElement";
import TextElement from "./TextElement";
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

type Props = {
  element: PageElement;
  sectionId: string;
  isSelected: boolean;
  scaleFactor?: number; // Scale factor for responsive preview (1 = no scaling)
  onClick: (e: React.MouseEvent) => void;
};

// Icon mapping for the icon element
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

// Social icon mapping
const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  facebook: Facebook,
};

// Badge variant styles
const BADGE_VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white/80",
  success: "bg-green-500/20 text-green-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  error: "bg-red-500/20 text-red-400",
  info: "bg-blue-500/20 text-blue-400",
  gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  outline: "bg-transparent border border-white/30 text-white/80",
  glow: "bg-[#D6FC51]/20 text-[#D6FC51] shadow-[0_0_10px_rgba(214,252,81,0.3)]",
};

// Icon variant styles
const ICON_VARIANT_STYLES: Record<IconVariant, { wrapper: string; glow: boolean }> = {
  circle: { wrapper: "rounded-full bg-white/5", glow: false },
  square: { wrapper: "rounded-lg bg-white/5", glow: false },
  none: { wrapper: "bg-transparent", glow: false },
  glow: { wrapper: "rounded-full bg-transparent", glow: true },
  shadow: { wrapper: "rounded-full bg-white/5 shadow-lg shadow-black/30", glow: false },
};

// Countdown timer component
function CountdownElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const content = element.content;

  // Calculate time remaining (using target date from content)
  const targetDate = content.countdownTarget
    ? new Date(content.countdownTarget)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default: 7 days

  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

  // Enhanced styling - apply scale factor
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
    <div
      onClick={onClick}
      className={`flex items-center ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black rounded-lg" : ""}`}
      style={{ gap: `${gap}px` }}
    >
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

// Form element component
function FormElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { isPreviewMode } = useEditorStoreOrPublished();
  const content = element.content;

  // Enhanced styling - apply scale factor
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
    <div
      onClick={onClick}
      className={`flex ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black rounded-lg p-1" : ""}`}
      style={{ gap }}
    >
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
        readOnly={!isPreviewMode}
      />
      <button
        type="button"
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
    </div>
  );
}

// Shadow mapping for video
const VIDEO_SHADOW_MAP: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

// Aspect ratio mapping
const ASPECT_RATIO_MAP: Record<string, string> = {
  '16:9': '16/9',
  '4:3': '4/3',
  '1:1': '1/1',
};

// Video embed component
function VideoElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { content, position } = element;
  const videoUrl = content.videoUrl || "";

  // Enhanced styling
  const borderRadius = (content.videoBorderRadius ?? 12) * scaleFactor;
  const shadow = VIDEO_SHADOW_MAP[content.videoShadow || 'none'];

  // Position dimensions take precedence over content dimensions (Figma-like sizing)
  // Apply scale factor for responsive preview
  const width = (position.width ?? content.videoWidth ?? 400) * scaleFactor;
  const height = position.height ? position.height * scaleFactor : undefined;

  // Parse YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?]+)/);
    return match ? match[1] : null;
  };

  // Parse Vimeo URL
  const getVimeoId = (url: string) => {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
  };

  const youtubeId = getYouTubeId(videoUrl);
  const vimeoId = getVimeoId(videoUrl);

  // Use height if set, otherwise use aspect ratio
  const aspectRatio = height ? undefined : ASPECT_RATIO_MAP[content.videoAspectRatio || '16:9'];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${isSelected ? "ring-2 ring-[#D6FC51]" : ""}`}
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
            <Play className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Add a YouTube or Vimeo URL</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Social links component with variants
function SocialElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { isPreviewMode } = useEditorStoreOrPublished();
  const content = element.content;
  const links = content.socialLinks || [
    { platform: "twitter", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
  ];

  // Enhanced styling - apply scale factor
  const iconSize = (content.socialIconSize ?? 20) * scaleFactor;
  const gap = (content.socialGap ?? 12) * scaleFactor;
  const iconColor = content.socialIconColor;
  const padding = 10 * scaleFactor;

  // Social variant styles - dynamically generate with scaled padding
  const socialVariant = content.socialVariant || "default";
  const getVariantStyle = (variant: string) => {
    const base = `bg-white/5 rounded-lg hover:bg-white/10`;
    const filled = `bg-[#D6FC51] rounded-lg hover:bg-[#c5eb40]`;
    const minimal = `hover:text-[#D6FC51]`;
    switch (variant) {
      case 'filled': return filled;
      case 'minimal': return minimal;
      default: return base;
    }
  };

  // Get animation props
  const animationProps = getAnimationVariants(content.animation);

  // Determine icon color based on variant or custom color
  const getIconColor = () => {
    if (iconColor) return iconColor;
    switch (socialVariant) {
      case 'filled': return '#000000';
      case 'minimal': return 'rgba(255,255,255,0.6)';
      default: return 'rgba(255,255,255,0.6)';
    }
  };

  // In preview mode, let links work naturally. In edit mode, prevent default for element selection.
  const handleLinkClick = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      e.preventDefault();
    }
    // In preview mode, let the link navigate naturally
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black rounded-lg p-1" : ""}`}
      style={{ gap: `${gap}px` }}
    >
      {links.map((link: { platform: string; url: string }, index: number) => {
        const Icon = SOCIAL_ICON_MAP[link.platform] || Share2;
        return (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors ${getVariantStyle(socialVariant)}`}
            onClick={handleLinkClick}
            whileHover={animationProps.whileHover}
            whileTap={animationProps.whileTap}
            transition={animationProps.transition}
            style={{ color: getIconColor(), padding }}
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

// Custom HTML component
function HtmlElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const { content, position } = element;
  const htmlContent = content.htmlCode || "<p>Custom HTML</p>";

  // Apply scale factor to dimensions
  const width = position.width ? position.width * scaleFactor : undefined;
  const height = position.height ? position.height * scaleFactor : undefined;

  return (
    <div
      onClick={onClick}
      className={`relative ${isSelected ? "ring-2 ring-[#D6FC51] rounded-lg" : ""}`}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
        overflow: height ? "auto" : undefined,
      }}
    >
      <div
        className="prose prose-invert prose-sm max-w-none"
        style={{ fontSize: `${Math.max(12, 14 * scaleFactor)}px` }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {isSelected && (
        <div className="absolute -top-6 left-0 px-2 py-0.5 bg-[#D6FC51] text-black text-[10px] font-medium rounded">
          HTML
        </div>
      )}
    </div>
  );
}

// Badge variant default colors
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

// Badge element with variants and custom styles
function BadgeElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const content = element.content;
  const variant: BadgeVariant = content.badgeVariant || "default";
  const variantColors = BADGE_VARIANT_COLORS[variant];
  const animationProps = getAnimationVariants(content.animation);

  // Custom values or variant defaults - apply scale factor
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
      onClick={onClick}
      className={`
        inline-flex items-center
        ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black" : ""}
      `}
      style={badgeStyles}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
    >
      {content.badgeText || "Badge"}
    </motion.span>
  );
}

// Divider element with variants
function DividerElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const variant: DividerVariant = element.content.dividerVariant || "solid";
  // Apply scale factor to dimensions
  const width = (element.content.dividerWidth || 200) * scaleFactor;
  const thickness = Math.max(1, (element.content.dividerThickness || 1) * scaleFactor);
  const color = element.styles.color || "rgba(255,255,255,0.2)";

  // Gradient divider
  if (variant === "gradient") {
    return (
      <div
        onClick={onClick}
        className={`${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-4 ring-offset-transparent" : ""}`}
        style={{
          width,
          height: thickness,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />
    );
  }

  // Double line divider
  if (variant === "double") {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col gap-1 ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-4 ring-offset-transparent" : ""}`}
        style={{ width }}
      >
        <div style={{ borderTopWidth: thickness, borderTopStyle: "solid", borderTopColor: color }} />
        <div style={{ borderTopWidth: thickness, borderTopStyle: "solid", borderTopColor: color }} />
      </div>
    );
  }

  // Standard dividers (solid, dashed, dotted)
  return (
    <div
      onClick={onClick}
      className={`${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-4 ring-offset-transparent" : ""}`}
      style={{
        width,
        borderTopStyle: variant as "solid" | "dashed" | "dotted",
        borderTopWidth: `${thickness}px`,
        borderTopColor: color,
      }}
    />
  );
}

// Icon element with variants and custom styles
function IconElement({
  element,
  isSelected,
  scaleFactor = 1,
  onClick,
}: {
  element: PageElement;
  isSelected: boolean;
  scaleFactor?: number;
  onClick: (e: React.MouseEvent) => void;
}) {
  const content = element.content;
  const IconComponent = ICON_MAP[content.iconName || "star"] || Star;
  const variant: IconVariant = content.iconVariant || "circle";
  const animationProps = getAnimationVariants(content.animation);

  // Custom values or defaults - apply scale factor
  const size = (content.iconSize ?? 24) * scaleFactor;
  const color = content.iconColor ?? "#D6FC51";
  const bgColor = content.iconBgColor ?? "rgba(255,255,255,0.05)";
  const padding = 12 * scaleFactor;

  // Determine wrapper styles based on variant
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
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        ${isSelected ? "ring-2 ring-[#D6FC51]" : ""}
      `}
      style={wrapperStyles}
      whileHover={animationProps.whileHover}
      whileTap={animationProps.whileTap}
      transition={animationProps.transition}
    >
      <IconComponent
        className="transition-colors"
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

export default function ElementRenderer({ element, sectionId, isSelected, scaleFactor = 1, onClick }: Props) {
  switch (element.type) {
    case "button":
      return (
        <ButtonElement
          element={element}
          sectionId={sectionId}
          isSelected={isSelected}
          scaleFactor={scaleFactor}
          onClick={onClick}
        />
      );
    case "image":
      return (
        <ImageElement
          element={element}
          sectionId={sectionId}
          isSelected={isSelected}
          scaleFactor={scaleFactor}
          onClick={onClick}
        />
      );
    case "text":
      return (
        <TextElement
          element={element}
          sectionId={sectionId}
          isSelected={isSelected}
          scaleFactor={scaleFactor}
          onClick={onClick}
        />
      );
    case "divider":
      return <DividerElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "icon":
      return <IconElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "badge":
      return <BadgeElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "video":
      return <VideoElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "social":
      return <SocialElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "countdown":
      return <CountdownElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "form":
      return <FormElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    case "html":
      return <HtmlElement element={element} isSelected={isSelected} scaleFactor={scaleFactor} onClick={onClick} />;
    default:
      return (
        <div
          onClick={onClick}
          className={`
            px-4 py-2 bg-white/5 border border-dashed border-white/20 rounded text-sm text-white/40
            ${isSelected ? "ring-2 ring-[#D6FC51]" : ""}
          `}
        >
          {element.type} element
        </div>
      );
  }
}
