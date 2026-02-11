"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

export interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number; // parallax speed multiplier, default 0.5 (slower than scroll)
  direction?: "up" | "down"; // parallax direction, default "up"
  startOffset?: number; // start parallax at this scroll offset, default 0
  endOffset?: number; // end parallax at this scroll offset, default 1
  className?: string;
}

/**
 * ParallaxContainer
 *
 * Container that creates parallax scroll effect for its children.
 * Children move at a different speed than the page scroll.
 *
 * @example
 * ```tsx
 * <ParallaxContainer speed={0.3} direction="down">
 *   <img src="background.jpg" alt="Background" />
 * </ParallaxContainer>
 * ```
 */
export function ParallaxContainer({
  children,
  speed = 0.5,
  direction = "up",
  startOffset = 0,
  endOffset = 1,
  className = "",
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress of this element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate parallax range based on speed
  const range = 100 * speed;
  const yRange: [number, number] =
    direction === "down" ? [range, -range] : [-range, range];

  // Transform scroll progress to Y position
  const y = useTransform(scrollYProgress, [startOffset, endOffset], yRange);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          y,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Multi-layer parallax variant
export interface ParallaxLayersProps {
  layers: {
    content: ReactNode;
    speed: number;
    className?: string;
  }[];
  className?: string;
}

interface ParallaxLayerProps {
  layer: { content: ReactNode; speed: number; className?: string };
  scrollYProgress: import("framer-motion").MotionValue<number>;
  index: number;
}

/** Individual parallax layer — hooks are called unconditionally at the top level. */
function ParallaxLayer({ layer, scrollYProgress, index }: ParallaxLayerProps) {
  const range = 100 * layer.speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <motion.div
      className={`absolute inset-0 ${layer.className || ""}`}
      style={{
        y,
        zIndex: index,
        willChange: "transform",
      }}
    >
      {layer.content}
    </motion.div>
  );
}

/**
 * ParallaxLayers
 *
 * Multi-layer parallax container for depth effects.
 * Each layer moves at a different speed.
 *
 * @example
 * ```tsx
 * <ParallaxLayers
 *   layers={[
 *     { content: <BackgroundImage />, speed: 0.2 },
 *     { content: <MiddleContent />, speed: 0.5 },
 *     { content: <ForegroundContent />, speed: 0.8 },
 *   ]}
 * />
 * ```
 */
export function ParallaxLayers({ layers, className = "" }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      {layers.map((layer, index) => (
        <ParallaxLayer
          key={index}
          layer={layer}
          scrollYProgress={scrollYProgress}
          index={index}
        />
      ))}
    </div>
  );
}
