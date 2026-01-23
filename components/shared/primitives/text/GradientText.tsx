"use client";

import { motion, useMotionTemplate, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { ReactNode, useRef } from "react";

export interface GradientTextProps {
  children: ReactNode;
  colors?: string[]; // array of hex colors, default ['#D6FC51', '#A78BFA', '#60A5FA']
  animate?: boolean; // animate gradient movement, default true
  duration?: number; // animation duration in seconds, default 3
  direction?: "horizontal" | "vertical" | "diagonal"; // gradient direction
  angle?: number; // degrees for diagonal direction, default 45
  blur?: boolean; // add slight blur at edges, default false
  glow?: boolean; // add text-shadow glow, default false
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"; // HTML element, default "span"
}

/**
 * GradientText
 *
 * Renders text with an animated gradient effect using background-clip.
 *
 * @example
 * ```tsx
 * <GradientText
 *   colors={['#D6FC51', '#A78BFA', '#60A5FA']}
 *   direction="horizontal"
 * >
 *   Beautiful Gradient Text
 * </GradientText>
 * ```
 */
export function GradientText({
  children,
  colors = ["#D6FC51", "#A78BFA", "#60A5FA"],
  animate = true,
  duration = 3,
  direction = "horizontal",
  angle = 45,
  blur = false,
  glow = false,
  className = "",
  as: Component = "span",
}: GradientTextProps) {
  const timeRef = useRef(0);
  const position = useMotionValue(0);

  // Animate gradient position
  useAnimationFrame((t) => {
    if (!animate) return;
    const seconds = t / 1000;
    const progress = (seconds % duration) / duration;
    position.set(progress * 200 - 100); // -100% to 100%
  });

  // Generate gradient direction
  const getGradientDirection = () => {
    switch (direction) {
      case "vertical":
        return "180deg";
      case "diagonal":
        return `${angle}deg`;
      default: // horizontal
        return "90deg";
    }
  };

  // Create color stops string
  const colorStops = colors.join(", ");

  // Animated gradient background
  const background = useMotionTemplate`linear-gradient(${getGradientDirection()}, ${colorStops})`;

  // For animated gradients, use background-position
  const backgroundPosition = useTransform(position, (p) => `${p}% 50%`);

  // Glow effect using text-shadow
  const getTextShadow = () => {
    if (!glow) return undefined;
    return colors
      .map((color) => `0 0 20px ${color}40, 0 0 40px ${color}20`)
      .join(", ");
  };

  return (
    <Component
      className={className}
      style={{
        backgroundImage: background as any,
        backgroundSize: animate ? "200% 200%" : "100% 100%",
        backgroundPosition: animate ? backgroundPosition as any : "0% 50%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: getTextShadow(),
        filter: blur ? "blur(0.5px)" : undefined,
      }}
    >
      {children}
    </Component>
  );
}
