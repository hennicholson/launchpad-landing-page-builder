"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

/**
 * Animated number counter that counts up when in view
 * Uses spring physics for natural motion
 */
export function CountUpNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
  decimals = 0,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toLocaleString();
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, springValue, hasAnimated]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

/**
 * Stat card with count-up animation
 */
interface StatCardProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  accentColor?: string;
}

export function StatCard({
  value,
  label,
  prefix = "",
  suffix = "",
  className = "",
  accentColor = "#7C3AED",
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={`relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      whileHover={{
        scale: 1.02,
        borderColor: `${accentColor}40`,
        boxShadow: `0 0 30px ${accentColor}20`,
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${accentColor}10 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <CountUpNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          className="text-4xl md:text-5xl font-bold text-white"
        />
        <p className="mt-2 text-sm text-white/60">{label}</p>
      </div>
    </motion.div>
  );
}
