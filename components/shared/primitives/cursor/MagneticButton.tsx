"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, ReactNode } from "react";
import { getDistance } from "@/lib/mouse-tracking";

export interface MagneticButtonProps {
  children: ReactNode;
  strength?: number; // 0-1, controls attraction intensity, default 0.5
  radius?: number; // pixels, activation radius, default 100
  speed?: number; // spring stiffness, default 150
  damping?: number; // spring damping, default 15
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMagnetize?: (distance: number) => void;
  resetOnLeave?: boolean; // reset position when mouse leaves radius, default true
}

/**
 * MagneticButton
 *
 * Creates a magnetic pull effect where the button follows the cursor
 * when it enters the proximity radius.
 *
 * @example
 * ```tsx
 * <MagneticButton strength={0.6} radius={120}>
 *   <button>Hover me</button>
 * </MagneticButton>
 * ```
 */
export function MagneticButton({
  children,
  strength = 0.5,
  radius = 100,
  speed = 150,
  damping = 15,
  disabled = false,
  className = "",
  style,
  onMagnetize,
  resetOnLeave = true,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for transform
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth movement
  const springX = useSpring(x, { stiffness: speed, damping });
  const springY = useSpring(y, { stiffness: speed, damping });

  // Optional rotation based on position
  const rotateX = useTransform(springY, [-20, 20], [5, -5]);
  const rotateY = useTransform(springX, [-20, 20], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const distance = getDistance(mouseX, mouseY, centerX, centerY);

    // Only apply magnetic effect within radius
    if (distance < radius) {
      const deltaX = (mouseX - centerX) * strength;
      const deltaY = (mouseY - centerY) * strength;

      x.set(deltaX);
      y.set(deltaY);

      if (onMagnetize) {
        onMagnetize(distance);
      }
    } else if (resetOnLeave) {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (resetOnLeave) {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </motion.div>
  );
}
