"use client";

import { useEffect, useState } from "react";

/**
 * Animated counter hook that counts from 0 to end value
 * Uses requestAnimationFrame for smooth animation
 *
 * @param end - Target number to count up to
 * @param duration - Animation duration in seconds (default: 2)
 * @param inView - Whether the element is in view (triggers animation)
 * @returns Current count value
 */
export function useCountUp(
  end: number,
  duration: number = 2,
  inView: boolean = true
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth deceleration (cubic ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return count;
}

/**
 * Parse a stat value string like "10,000+" or "$5M" into components
 * @param title - The stat title string to parse
 * @returns Object with prefix, numeric value, and suffix
 */
export function parseStatValue(title: string): {
  prefix: string;
  value: number;
  suffix: string;
} {
  const match = title.match(/^([^0-9]*)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$/);
  if (match) {
    return {
      prefix: match[1].trim(),
      value: parseFloat(match[2].replace(/,/g, "")),
      suffix: match[3].trim(),
    };
  }
  return { prefix: "", value: 0, suffix: "" };
}
