"use client";

import { useScroll, useVelocity, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";

export interface VelocityTrackerResult {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  velocity: MotionValue<number>;
  velocityFactor: MotionValue<number>; // normalized velocity (0-1)
  isScrollingFast: MotionValue<boolean>;
}

/**
 * useVelocityTracker
 *
 * Hook for tracking scroll position and velocity.
 * Returns scroll metrics that can be used to create velocity-reactive animations.
 *
 * @example
 * ```tsx
 * function Component() {
 *   const { velocity, velocityFactor } = useVelocityTracker();
 *
 *   return (
 *     <motion.div
 *       style={{
 *         scale: useTransform(velocityFactor, [0, 1], [1, 0.95]),
 *         opacity: useTransform(velocity, [-1000, 0, 1000], [0.5, 1, 0.5]),
 *       }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useVelocityTracker(
  target?: RefObject<HTMLElement>,
  velocityThreshold: number = 500
): VelocityTrackerResult {
  // Track scroll position
  const { scrollY, scrollYProgress } = useScroll(
    target ? { target } : undefined
  );

  // Track scroll velocity
  const velocity = useVelocity(scrollY);

  // Normalize velocity to 0-1 range
  const velocityFactor = useTransform(
    velocity,
    [-velocityThreshold, 0, velocityThreshold],
    [1, 0, 1]
  );

  // Boolean for fast scrolling detection
  const isScrollingFast = useTransform(
    velocity,
    (v) => Math.abs(v) > velocityThreshold
  ) as MotionValue<boolean>;

  return {
    scrollY,
    scrollYProgress,
    velocity,
    velocityFactor,
    isScrollingFast,
  };
}

// Export as both hook and component wrapper
export interface VelocityTrackerProps {
  children: (result: VelocityTrackerResult) => React.ReactNode;
  target?: RefObject<HTMLElement>;
  velocityThreshold?: number;
}

/**
 * VelocityTracker
 *
 * Component wrapper for useVelocityTracker hook.
 * Provides render prop pattern for velocity-reactive content.
 *
 * @example
 * ```tsx
 * <VelocityTracker>
 *   {({ velocity, velocityFactor }) => (
 *     <motion.div style={{ scale: velocityFactor }}>
 *       Content
 *     </motion.div>
 *   )}
 * </VelocityTracker>
 * ```
 */
export function VelocityTracker({
  children,
  target,
  velocityThreshold = 500,
}: VelocityTrackerProps) {
  const result = useVelocityTracker(target, velocityThreshold);
  return <>{children(result)}</>;
}
