"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

interface SparkleProps {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesBackgroundProps {
  className?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
}

const generateSparkle = (color: string): SparkleProps => {
  return {
    id: String(Math.random()),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color,
    delay: Math.random() * 2,
    scale: Math.random() * 0.5 + 0.5,
    lifespan: Math.random() * 3 + 2,
  };
};

const Sparkle = ({ sparkle }: { sparkle: SparkleProps }) => {
  return (
    <span
      className="absolute animate-sparkle pointer-events-none"
      style={{
        left: sparkle.x,
        top: sparkle.y,
        animationDelay: `${sparkle.delay}s`,
        animationDuration: `${sparkle.lifespan}s`,
      }}
    >
      <svg
        width={20 * sparkle.scale}
        height={20 * sparkle.scale}
        viewBox="0 0 160 160"
        fill="none"
      >
        <path
          d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          fill={sparkle.color}
        />
      </svg>
    </span>
  );
};

export function SparklesBackground({
  className,
  particleColor = "#FFC700",
  particleDensity = 30,
}: SparklesBackgroundProps) {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    if (prefersReducedMotion.current) return;

    // Initialize sparkles
    const initialSparkles = Array.from({ length: particleDensity }, () =>
      generateSparkle(particleColor)
    );
    setSparkles(initialSparkles);

    // Regenerate sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prevSparkles) =>
        prevSparkles.map(() => generateSparkle(particleColor))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [particleColor, particleDensity]);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} sparkle={sparkle} />
      ))}
    </div>
  );
}

export default SparklesBackground;
