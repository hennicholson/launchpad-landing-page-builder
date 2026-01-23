"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";
import { getDistance } from "@/lib/mouse-tracking";
import { springConfigs } from "@/lib/animation-utils";

export interface TiltCardProps {
  children: ReactNode;
  tiltIntensity?: number; // 0-1, amount of tilt, default 0.5
  rotateXRange?: [number, number]; // X rotation range in degrees, default [-10, 10]
  rotateYRange?: [number, number]; // Y rotation range in degrees, default [-10, 10]
  scaleOnHover?: number; // scale on hover, default 1.02
  glare?: boolean; // add glare effect, default false
  glareOpacity?: number; // glare max opacity, default 0.3
  perspective?: number; // 3D perspective, default 1000
  spring?: keyof typeof springConfigs; // spring config, default "ultraResponsive"
  className?: string;
}

/**
 * TiltCard
 *
 * 3D tilt effect based on mouse position.
 * Creates depth and interactivity for cards and images.
 *
 * @example
 * ```tsx
 * <TiltCard
 *   tiltIntensity={0.7}
 *   glare
 *   rotateXRange={[-15, 15]}
 *   rotateYRange={[-15, 15]}
 * >
 *   <div className="card-content">
 *     Card content here
 *   </div>
 * </TiltCard>
 * ```
 */
export function TiltCard({
  children,
  tiltIntensity = 0.5,
  rotateXRange = [-10, 10],
  rotateYRange = [-10, 10],
  scaleOnHover = 1.02,
  glare = false,
  glareOpacity = 0.3,
  perspective = 1000,
  spring = "ultraResponsive",
  className = "",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply spring smoothing
  const springConfig = springConfigs[spring];
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Scale on hover
  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, springConfig);

  // Transform mouse position to rotation
  const rotateX = useTransform(
    smoothMouseY,
    [-0.5, 0.5],
    [rotateXRange[1] * tiltIntensity, rotateXRange[0] * tiltIntensity]
  );
  const rotateY = useTransform(
    smoothMouseX,
    [-0.5, 0.5],
    [rotateYRange[0] * tiltIntensity, rotateYRange[1] * tiltIntensity]
  );

  // Glare gradient position
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -0.5 to 0.5 range
    const normalizedX = (event.clientX - centerX) / rect.width;
    const normalizedY = (event.clientY - centerY) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: smoothScale,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}

        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) =>
                  `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 50%)`
              ) as any,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
