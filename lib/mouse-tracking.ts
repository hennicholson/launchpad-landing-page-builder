/**
 * Mouse Tracking Utilities
 * Hooks for global and element-based cursor tracking
 */

import { useMotionValue, useSpring, MotionValue } from "framer-motion";
import { useEffect, RefObject } from "react";

/**
 * Global mouse position tracker
 * Provides spring-smoothed cursor coordinates
 */
export function useGlobalMouse(smoothing = 0.2): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 30 });
  const springY = useSpring(y, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x: springX, y: springY };
}

/**
 * Element-relative mouse position tracker
 * Calculates distance and position relative to element center
 */
export function useElementMouse(ref: RefObject<HTMLElement>): {
  x: MotionValue<number>;
  y: MotionValue<number>;
  distance: MotionValue<number>;
  centerX: MotionValue<number>;
  centerY: MotionValue<number>;
} {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const centerX = useMotionValue(0);
  const centerY = useMotionValue(0);
  const distance = useMotionValue(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Distance from cursor to element center
      const dist = Math.sqrt(
        Math.pow(mouseX - elCenterX, 2) + Math.pow(mouseY - elCenterY, 2)
      );

      x.set(mouseX - rect.left);
      y.set(mouseY - rect.top);
      centerX.set(mouseX - elCenterX);
      centerY.set(mouseY - elCenterY);
      distance.set(dist);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [ref, x, y, centerX, centerY, distance]);

  return { x, y, distance, centerX, centerY };
}

/**
 * Calculate distance between two points
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate angle between two points (in degrees)
 */
export function getAngle(x1: number, y1: number, x2: number, y2: number): number {
  const rad = Math.atan2(y2 - y1, x2 - x1);
  return (rad * 180) / Math.PI;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
