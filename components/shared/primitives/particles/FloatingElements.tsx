"use client";

import { motion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { springConfigs } from "@/lib/animation-utils";

export interface FloatingElementsProps {
  count?: number; // number of floating elements, default 5
  children?: ReactNode; // custom element(s) to float, or use default shapes
  speed?: number; // animation speed multiplier, default 1
  direction?: "up" | "down" | "random"; // float direction, default "random"
  spread?: number; // horizontal spread in px, default 100
  blur?: boolean; // add backdrop blur, default false
  className?: string;
}

/**
 * FloatingElements
 *
 * Abstract floating shapes with parallax movement and optional blur.
 * Useful for decorative ambient animations.
 *
 * @example
 * ```tsx
 * <FloatingElements count={8} speed={1.5} blur>
 *   <div className="w-16 h-16 bg-primary/10 rounded-full" />
 * </FloatingElements>
 * ```
 */
export function FloatingElements({
  count = 5,
  children,
  speed = 1,
  direction = "random",
  spread = 100,
  blur = false,
  className = "",
}: FloatingElementsProps) {
  // Memoize all random values so they are generated once and remain stable across re-renders
  const elementConfigs = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        startX: Math.random() * spread - spread / 2,
        startY: direction === "random" ? Math.random() * 100 : 0,
        duration: (15 + Math.random() * 10) / speed,
        scale: 0.5 + Math.random() * 1,
        delay: Math.random() * 5,
        yMovement:
          direction === "up"
            ? -100
            : direction === "down"
              ? 100
              : Math.random() > 0.5
                ? -100
                : 100,
        rotation: Math.random() * 360,
        rotationDirection: Math.random() > 0.5 ? 1 : -1,
      })),
    [] // eslint-disable-line react-hooks/exhaustive-deps -- intentionally generate once
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {elementConfigs.map((config, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{
            left: `${50 + (config.startX / spread) * 50}%`,
            top: `${config.startY}%`,
            scale: 0,
            opacity: 0,
            rotate: config.rotation,
          }}
          animate={{
            top: `${config.startY + config.yMovement}%`,
            scale: [0, config.scale, config.scale, 0],
            opacity: [0, 0.4, 0.4, 0],
            rotate: config.rotation + config.rotationDirection * 180,
          }}
          transition={{
            duration: config.duration,
            delay: config.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            scale: {
              duration: config.duration / 2,
              times: [0, 0.1, 0.9, 1],
            },
            opacity: {
              duration: config.duration / 2,
              times: [0, 0.1, 0.9, 1],
            },
          }}
          style={{
            backdropFilter: blur ? "blur(4px)" : undefined,
            WebkitBackdropFilter: blur ? "blur(4px)" : undefined,
            willChange: "transform, opacity",
          }}
        >
          {children || <DefaultShape index={index} />}
        </motion.div>
      ))}
    </div>
  );
}

// Default floating shape — deterministic selection based on index
function DefaultShape({ index }: { index: number }) {
  const shapes = [
    // Circle
    <div
      key="circle"
      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-transparent"
    />,
    // Square
    <div
      key="square"
      className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/15 to-transparent rotate-45"
    />,
    // Triangle (using border trick)
    <div
      key="triangle"
      className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-primary/20"
    />,
  ];

  return shapes[index % shapes.length];
}
