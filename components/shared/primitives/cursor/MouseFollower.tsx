"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

export interface MouseFollowerProps {
  children?: ReactNode;
  speed?: number; // spring stiffness, default 150
  damping?: number; // default 25
  offsetX?: number; // px offset from cursor X, default 20
  offsetY?: number; // px offset from cursor Y, default 20
  scale?: number; // size scale, default 1
  rotate?: boolean; // rotate based on velocity, default false
  rotationMultiplier?: number; // default 0.1
  blur?: boolean; // add backdrop blur, default false
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MouseFollower
 *
 * Custom element that smoothly follows the cursor with configurable offset and physics.
 * Useful for custom cursor indicators, tooltips, or decorative elements.
 *
 * @example
 * ```tsx
 * <MouseFollower offsetX={30} offsetY={30}>
 *   <div className="w-8 h-8 bg-primary/20 rounded-full" />
 * </MouseFollower>
 * ```
 */
export function MouseFollower({
  children,
  speed = 150,
  damping = 25,
  offsetX = 20,
  offsetY = 20,
  scale = 1,
  rotate = false,
  rotationMultiplier = 0.1,
  blur = false,
  className = "",
  style = {},
}: MouseFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply spring smoothing
  const springX = useSpring(mouseX, { stiffness: speed, damping });
  const springY = useSpring(mouseY, { stiffness: speed, damping });

  // Track previous position for rotation calculation
  const prevX = useMotionValue(0);
  const prevY = useMotionValue(0);
  const rotation = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Get section-relative coordinates
      if (containerRef.current) {
        const section = containerRef.current.closest('section');
        if (section) {
          const rect = section.getBoundingClientRect();
          const targetX = event.clientX - rect.left + offsetX;
          const targetY = event.clientY - rect.top + offsetY;

          mouseX.set(targetX);
          mouseY.set(targetY);

          // Calculate rotation based on velocity if enabled
          if (rotate) {
            const deltaX = targetX - prevX.get();
            const deltaY = targetY - prevY.get();
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            rotation.set(angle * rotationMultiplier);

            prevX.set(targetX);
            prevY.set(targetY);
          }
          return;
        }
      }

      // Fallback to viewport coordinates if no section found
      const targetX = event.clientX + offsetX;
      const targetY = event.clientY + offsetY;

      mouseX.set(targetX);
      mouseY.set(targetY);

      // Calculate rotation based on velocity if enabled
      if (rotate) {
        const deltaX = targetX - prevX.get();
        const deltaY = targetY - prevY.get();
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        rotation.set(angle * rotationMultiplier);

        prevX.set(targetX);
        prevY.set(targetY);
      }
    };

    // Initialize position to center of screen
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, offsetX, offsetY, rotate, rotation, prevX, prevY, rotationMultiplier]);

  return (
    <motion.div
      ref={containerRef}
      className={`absolute pointer-events-none z-50 ${className}`}
      style={{
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        scale,
        rotate: rotate ? rotation : 0,
        backdropFilter: blur ? "blur(4px)" : undefined,
        WebkitBackdropFilter: blur ? "blur(4px)" : undefined,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
