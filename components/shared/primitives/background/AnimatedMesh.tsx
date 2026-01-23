"use client";

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

export interface AnimatedMeshProps {
  colors?: string[]; // gradient colors, default ['#D6FC51', '#A78BFA', '#60A5FA']
  speed?: number; // animation speed, default 1
  blur?: number; // blur amount in px, default 0
  opacity?: number; // overall opacity, default 0.3
  morphIntensity?: number; // 0-1, how much the gradient morphs, default 0.5
  className?: string;
}

/**
 * AnimatedMesh
 *
 * Morphing mesh gradient background with continuous sine wave animation.
 * Creates organic, flowing gradient effects.
 *
 * @example
 * ```tsx
 * <AnimatedMesh
 *   colors={['#D6FC51', '#A78BFA', '#60A5FA', '#EC4899']}
 *   speed={1.5}
 *   morphIntensity={0.7}
 * />
 * ```
 */
export function AnimatedMesh({
  colors = ["#D6FC51", "#A78BFA", "#60A5FA"],
  speed = 1,
  blur = 0,
  opacity = 0.3,
  morphIntensity = 0.5,
  className = "",
}: AnimatedMeshProps) {
  const timeRef = useRef(0);

  // Motion values for gradient positions
  const pos1X = useMotionValue(0);
  const pos1Y = useMotionValue(0);
  const pos2X = useMotionValue(100);
  const pos2Y = useMotionValue(100);
  const pos3X = useMotionValue(50);
  const pos3Y = useMotionValue(0);

  // Animate gradient positions using sine waves
  useAnimationFrame((t) => {
    const seconds = (t / 1000) * speed;

    // Create organic movement with multiple sine waves
    const baseIntensity = morphIntensity * 50;

    // Position 1 (top-left area)
    pos1X.set(20 + Math.sin(seconds * 0.5) * baseIntensity);
    pos1Y.set(20 + Math.cos(seconds * 0.7) * baseIntensity);

    // Position 2 (bottom-right area)
    pos2X.set(80 + Math.sin(seconds * 0.6 + Math.PI) * baseIntensity);
    pos2Y.set(80 + Math.cos(seconds * 0.4 + Math.PI) * baseIntensity);

    // Position 3 (middle area)
    pos3X.set(50 + Math.sin(seconds * 0.8 + Math.PI / 2) * baseIntensity);
    pos3Y.set(50 + Math.cos(seconds * 0.5 + Math.PI / 2) * baseIntensity);
  });

  // Create color stops with positions
  const getColorStop = (color: string, index: number) => {
    switch (index % 3) {
      case 0:
        return `${color} ${pos1X.get()}% ${pos1Y.get()}%`;
      case 1:
        return `${color} ${pos2X.get()}% ${pos2Y.get()}%`;
      case 2:
        return `${color} ${pos3X.get()}% ${pos3Y.get()}%`;
      default:
        return `${color}`;
    }
  };

  // Build radial gradients for each color
  const gradients = colors.map((color, i) => {
    const xPos = i === 0 ? pos1X : i === 1 ? pos2X : pos3X;
    const yPos = i === 0 ? pos1Y : i === 1 ? pos2Y : pos3Y;
    return useMotionTemplate`radial-gradient(circle at ${xPos}% ${yPos}%, ${color}, transparent 50%)`;
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Multiple gradient layers for depth */}
      {gradients.map((gradient, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: gradient as any,
            opacity: opacity / colors.length,
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
            mixBlendMode: "screen",
            willChange: "background",
          }}
        />
      ))}
    </div>
  );
}
