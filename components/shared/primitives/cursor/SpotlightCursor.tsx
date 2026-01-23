"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export interface SpotlightCursorProps {
  size?: number; // pixels, default 400
  color?: string; // hex color, default '#D6FC51'
  intensity?: number; // 0-1, default 0.6
  blur?: number; // pixels, default 80
  followSpeed?: number; // spring stiffness, default 150
  className?: string;
  gradient?: boolean; // use radial gradient, default true
  mix?: "normal" | "screen" | "overlay" | "multiply"; // blend mode
}

/**
 * SpotlightCursor
 *
 * Creates a gradient spotlight effect that follows the cursor.
 * Rendered as an overlay with pointer-events: none.
 *
 * @example
 * ```tsx
 * <section className="relative">
 *   <SpotlightCursor size={500} color="#A78BFA" intensity={0.4} />
 *   <div>Your content here</div>
 * </section>
 * ```
 */
export function SpotlightCursor({
  size = 400,
  color = "#D6FC51",
  intensity = 0.6,
  blur = 80,
  followSpeed = 150,
  className = "",
  gradient = true,
  mix = "normal",
}: SpotlightCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed cursor position
  const springX = useSpring(mouseX, { stiffness: followSpeed, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: followSpeed, damping: 30 });

  // Convert hex to RGB for alpha transparency
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "214, 252, 81"; // fallback to default color
  };

  const rgbColor = hexToRgb(color);

  // Dynamic radial gradient background
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${springX}px ${springY}px, rgba(${rgbColor}, ${intensity}), transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Get section-relative coordinates
      if (containerRef.current) {
        const section = containerRef.current.closest('section');
        if (section) {
          const rect = section.getBoundingClientRect();
          const relativeX = event.clientX - rect.left;
          const relativeY = event.clientY - rect.top;
          mouseX.set(relativeX);
          mouseY.set(relativeY);
          return;
        }
      }
      // Fallback to viewport coordinates if no section found
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!gradient) {
    // Simple circle spotlight without gradient
    return (
      <motion.div
        ref={containerRef}
        className={`absolute top-0 left-0 pointer-events-none z-50 ${className}`}
        style={{
          width: size,
          height: size,
          x: springX,
          y: springY,
          translateX: -size / 2,
          translateY: -size / 2,
          backgroundColor: `rgba(${rgbColor}, ${intensity})`,
          borderRadius: "50%",
          filter: `blur(${blur}px)`,
          mixBlendMode: mix,
          willChange: "transform",
        }}
      />
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-50 ${className}`}
      style={{
        background,
        mixBlendMode: mix,
        willChange: "background",
      }}
    />
  );
}
