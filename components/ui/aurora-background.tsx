"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
  /** Primary color for the aurora effect */
  primaryColor?: string;
  /** Secondary color for the aurora effect */
  secondaryColor?: string;
  /** Animation speed - controls the duration */
  speed?: "slow" | "medium" | "fast";
  /** Blur intensity */
  blurAmount?: number;
  /** Opacity of the effect */
  opacity?: number;
}

const SPEED_MAP = {
  slow: "120s",
  medium: "60s",
  fast: "30s",
};

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  primaryColor = "#3b82f6",
  secondaryColor = "#8b5cf6",
  speed = "medium",
  blurAmount = 10,
  opacity = 50,
  ...props
}: AuroraBackgroundProps) => {
  const animationDuration = SPEED_MAP[speed];

  // Create the aurora gradient
  const auroraGradient = `repeating-linear-gradient(
    100deg,
    ${primaryColor} 10%,
    #a5b4fc 15%,
    #93c5fd 20%,
    ${secondaryColor} 25%,
    #60a5fa 30%
  )`;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Aurora layer */}
      <div
        className="absolute -inset-[10px] animate-aurora"
        style={{
          backgroundImage: auroraGradient,
          backgroundSize: "200% 100%",
          filter: `blur(${blurAmount}px)`,
          opacity: opacity / 100,
          animationDuration,
          maskImage: showRadialGradient
            ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)"
            : undefined,
          WebkitMaskImage: showRadialGradient
            ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)"
            : undefined,
        }}
      />
      {children}
    </div>
  );
};

export default AuroraBackground;
