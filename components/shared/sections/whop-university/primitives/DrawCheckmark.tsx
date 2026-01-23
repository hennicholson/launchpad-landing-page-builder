"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface DrawCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  className?: string;
}

/**
 * Animated SVG checkmark that draws itself when in view
 */
export function DrawCheckmark({
  size = 24,
  color = "#10B981",
  strokeWidth = 2.5,
  delay = 0,
  className = "",
}: DrawCheckmarkProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {/* Circle background */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill={`${color}20`}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay }}
      />

      {/* Checkmark path */}
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: delay + 0.2,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  );
}

/**
 * Animated X mark for comparison sections
 */
interface DrawXMarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  delay?: number;
  className?: string;
}

export function DrawXMark({
  size = 24,
  color = "#EF4444",
  strokeWidth = 2.5,
  delay = 0,
  className = "",
}: DrawXMarkProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {/* Circle background */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill={`${color}20`}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay }}
      />

      {/* X paths */}
      <motion.path
        d="M9 9l6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{
          duration: 0.3,
          delay: delay + 0.2,
          ease: "easeOut",
        }}
      />
      <motion.path
        d="M15 9l-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{
          duration: 0.3,
          delay: delay + 0.35,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  );
}

/**
 * Feature item with animated checkmark
 */
interface FeatureItemProps {
  text: string;
  delay?: number;
  checkColor?: string;
  textColor?: string;
  className?: string;
}

export function FeatureItem({
  text,
  delay = 0,
  checkColor = "#10B981",
  textColor = "white",
  className = "",
}: FeatureItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      <DrawCheckmark color={checkColor} delay={delay} />
      <span style={{ color: textColor }}>{text}</span>
    </motion.div>
  );
}
