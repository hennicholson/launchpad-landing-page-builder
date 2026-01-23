"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

export interface AnimatedGroupProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: React.ReactNode;
  variants: Variants;
  className?: string;
}

/**
 * AnimatedGroup - Wrapper component for coordinated stagger animations
 *
 * Based on ibelick animated-group pattern
 * Provides container/item animation coordination with staggerChildren support
 */
export function AnimatedGroup({
  children,
  variants,
  className,
  ...props
}: AnimatedGroupProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
