"use client";

import { motion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

interface ShimmerTextProps {
  children: ReactNode;
  /** CSS class for the container */
  className?: string;
  /** Shimmer animation duration in seconds. Default: 2.5 */
  duration?: number;
  /** Start color of the gradient. Default: #FCF6F5 (Whop cream) */
  colorFrom?: string;
  /** Middle highlight color. Default: #FA4616 (Whop orange) */
  colorVia?: string;
  /** End color of the gradient. Default: #FCF6F5 (Whop cream) */
  colorTo?: string;
  /** HTML tag to render. Default: span */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * ShimmerText - Animated gradient text with smooth shimmer effect
 * Creates a premium, Apple-like text highlight animation
 */
export function ShimmerText({
  children,
  className = "",
  duration = 2.5,
  colorFrom = "#FCF6F5",
  colorVia = "#FA4616",
  colorTo = "#FCF6F5",
  as: Component = "span",
  style,
}: ShimmerTextProps) {
  const shimmerStyle: CSSProperties = {
    backgroundImage: `linear-gradient(
      90deg,
      ${colorFrom} 0%,
      ${colorFrom} 40%,
      ${colorVia} 50%,
      ${colorTo} 60%,
      ${colorTo} 100%
    )`,
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    ...style,
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={shimmerStyle}
      animate={{
        backgroundPosition: ["100% 50%", "-100% 50%"],
      }}
      transition={{
        duration,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {Component === "span" ? (
        children
      ) : (
        <Component className="inline">{children}</Component>
      )}
    </motion.span>
  );
}

/**
 * GradientText - Static gradient text without animation
 * Use when you want the gradient look but not the shimmer
 */
export function GradientText({
  children,
  className = "",
  colorFrom = "#FCF6F5",
  colorVia = "#FA4616",
  colorTo = "#FCF6F5",
  as: Component = "span",
  style,
}: Omit<ShimmerTextProps, "duration">) {
  const gradientStyle: CSSProperties = {
    backgroundImage: `linear-gradient(
      90deg,
      ${colorFrom} 0%,
      ${colorVia} 50%,
      ${colorTo} 100%
    )`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    ...style,
  };

  return (
    <Component className={`inline-block ${className}`} style={gradientStyle}>
      {children}
    </Component>
  );
}

export default ShimmerText;
