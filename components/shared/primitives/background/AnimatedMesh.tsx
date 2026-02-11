"use client";

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, MotionValue } from "framer-motion";
import { useRef } from "react";

export interface AnimatedMeshProps {
  colors?: string[]; // gradient colors, default ['#D6FC51', '#A78BFA', '#60A5FA']
  speed?: number; // animation speed, default 1
  blur?: number; // blur amount in px, default 0
  opacity?: number; // overall opacity, default 0.3
  morphIntensity?: number; // 0-1, how much the gradient morphs, default 0.5
  className?: string;
}

interface GradientLayerProps {
  xPos: MotionValue<number>;
  yPos: MotionValue<number>;
  color: string;
  layerOpacity: number;
  blur: number;
}

/** Individual gradient layer — hooks are called unconditionally at the top level. */
function GradientLayer({ xPos, yPos, color, layerOpacity, blur }: GradientLayerProps) {
  const gradient = useMotionTemplate`radial-gradient(circle at ${xPos}% ${yPos}%, ${color}, transparent 50%)`;

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: gradient as any,
        opacity: layerOpacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        mixBlendMode: "screen",
        willChange: "background",
      }}
    />
  );
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

  // Map each color index to the corresponding position motion values
  const positionsByIndex = [
    { x: pos1X, y: pos1Y },
    { x: pos2X, y: pos2Y },
    { x: pos3X, y: pos3Y },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Multiple gradient layers for depth */}
      {colors.map((color, index) => {
        const pos = positionsByIndex[index % positionsByIndex.length];
        return (
          <GradientLayer
            key={index}
            xPos={pos.x}
            yPos={pos.y}
            color={color}
            layerOpacity={opacity / colors.length}
            blur={blur}
          />
        );
      })}
    </div>
  );
}
