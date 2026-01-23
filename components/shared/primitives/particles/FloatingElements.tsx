"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
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
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        // Random positioning
        const startX = Math.random() * spread - spread / 2;
        const startY = direction === "random" ? Math.random() * 100 : 0;

        // Random animation duration
        const duration = (15 + Math.random() * 10) / speed;

        // Random size scale
        const scale = 0.5 + Math.random() * 1;

        // Random delay
        const delay = Math.random() * 5;

        // Calculate vertical movement based on direction
        const getYMovement = () => {
          switch (direction) {
            case "up":
              return -100;
            case "down":
              return 100;
            case "random":
            default:
              return Math.random() > 0.5 ? -100 : 100;
          }
        };

        const yMovement = getYMovement();

        // Random rotation
        const rotation = Math.random() * 360;
        const rotationDirection = Math.random() > 0.5 ? 1 : -1;

        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              left: `${50 + (startX / spread) * 50}%`,
              top: `${startY}%`,
              scale: 0,
              opacity: 0,
              rotate: rotation,
            }}
            animate={{
              top: `${startY + yMovement}%`,
              scale: [0, scale, scale, 0],
              opacity: [0, 0.4, 0.4, 0],
              rotate: rotation + rotationDirection * 180,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              scale: {
                duration: duration / 2,
                times: [0, 0.1, 0.9, 1],
              },
              opacity: {
                duration: duration / 2,
                times: [0, 0.1, 0.9, 1],
              },
            }}
            style={{
              backdropFilter: blur ? "blur(4px)" : undefined,
              WebkitBackdropFilter: blur ? "blur(4px)" : undefined,
              willChange: "transform, opacity",
            }}
          >
            {children || <DefaultShape />}
          </motion.div>
        );
      })}
    </div>
  );
}

// Default floating shape
function DefaultShape() {
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

  return shapes[Math.floor(Math.random() * shapes.length)];
}
