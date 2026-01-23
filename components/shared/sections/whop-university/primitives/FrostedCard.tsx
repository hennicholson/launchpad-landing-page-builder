"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type FrostedCardVariant = "light" | "dark" | "accent";

interface FrostedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: FrostedCardVariant;
  /** Custom accent color for borders/highlights */
  accentColor?: string;
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Border radius preset */
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Add subtle hover effect */
  hoverable?: boolean;
  /** Show subtle glow on hover */
  glowOnHover?: boolean;
  /** As a wrapper for content */
  as?: "div" | "article" | "section";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

/**
 * FrostedCard - Minimal glass effect card component
 * Uses Whop brand aesthetics with subtle frosted glass
 *
 * Color Palette:
 * - Light: #FCF6F5 (whop-cream)
 * - Dark: #141212 (whop-dark)
 * - Accent: #FA4616 (whop-orange)
 */
export const FrostedCard = forwardRef<HTMLDivElement, FrostedCardProps>(
  (
    {
      children,
      variant = "dark",
      accentColor,
      padding = "md",
      rounded = "2xl",
      hoverable = false,
      glowOnHover = false,
      className = "",
      style,
      ...motionProps
    },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "light":
          return {
            background: "rgba(252, 246, 245, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.3)",
            shadowColor: "rgba(0, 0, 0, 0.05)",
          };
        case "dark":
          return {
            background: "rgba(20, 18, 18, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            shadowColor: "rgba(0, 0, 0, 0.3)",
          };
        case "accent":
          return {
            background: "rgba(250, 70, 22, 0.1)",
            borderColor: accentColor ? `${accentColor}30` : "rgba(250, 70, 22, 0.3)",
            shadowColor: accentColor ? `${accentColor}10` : "rgba(250, 70, 22, 0.1)",
          };
        default:
          return {
            background: "rgba(20, 18, 18, 0.85)",
            borderColor: "rgba(255, 255, 255, 0.08)",
            shadowColor: "rgba(0, 0, 0, 0.3)",
          };
      }
    };

    const variantStyles = getVariantStyles();

    const baseStyles: React.CSSProperties = {
      background: variantStyles.background,
      border: `1px solid ${variantStyles.borderColor}`,
      boxShadow: `0 4px 24px -4px ${variantStyles.shadowColor}`,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      ...style,
    };

    const hoverAnimation = hoverable
      ? {
          scale: 1.02,
          boxShadow: glowOnHover && accentColor
            ? `0 8px 32px -4px ${accentColor}30`
            : `0 8px 32px -4px ${variantStyles.shadowColor}`,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={`${paddingClasses[padding]} ${roundedClasses[rounded]} ${className}`}
        style={baseStyles}
        whileHover={hoverAnimation}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

FrostedCard.displayName = "FrostedCard";

/**
 * FrostedBadge - Small frosted glass badge/tag component
 */
interface FrostedBadgeProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export function FrostedBadge({
  children,
  accentColor = "#FA4616",
  className = "",
}: FrostedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${className}`}
      style={{
        background: `${accentColor}15`,
        color: accentColor,
        border: `1px solid ${accentColor}30`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {children}
    </span>
  );
}

/**
 * FrostedOverlay - Full-screen frosted glass overlay
 */
interface FrostedOverlayProps {
  children: React.ReactNode;
  visible: boolean;
  onClose?: () => void;
  className?: string;
}

export function FrostedOverlay({
  children,
  visible,
  onClose,
  className = "",
}: FrostedOverlayProps) {
  if (!visible) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        background: "rgba(20, 18, 18, 0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default FrostedCard;
