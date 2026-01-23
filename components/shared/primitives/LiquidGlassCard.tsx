"use client";

import { GlassCard } from "@developer-hub/liquid-glass";
import { motion } from "framer-motion";
import { ReactNode, useRef, CSSProperties } from "react";
import { NoiseOverlay } from "./NoiseOverlay";

interface LiquidGlassCardProps {
  children: ReactNode;
  /** Liquid displacement intensity (0-200). Default: 80 */
  displacementScale?: number;
  /** Blur amount (0-1). Default: 0.01 */
  blurAmount?: number;
  /** Border radius in pixels. Default: 16 */
  cornerRadius?: number;
  /** Padding CSS value. Default: "24px" */
  padding?: string;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Light background mode */
  shadowMode?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Show noise texture overlay. Default: true */
  showNoise?: boolean;
  /** Noise opacity (0-1). Default: 0.04 */
  noiseOpacity?: number;
  /** Show specular highlight. Default: true */
  showSpecular?: boolean;
  /** Show border gradient. Default: true */
  showBorder?: boolean;
  /** Variant for different styles */
  variant?: "default" | "prominent" | "subtle";
  /** Hover lift effect. Default: true */
  hoverLift?: boolean;
}

// Whop brand colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
  orangeLight: "#FF6B3D",
};

/**
 * LiquidGlassCard - Premium liquid glass card with depth and texture
 * Combines liquid-glass animations with noise, specular highlights, and gradients
 */
export function LiquidGlassCard({
  children,
  displacementScale = 80,
  blurAmount = 0.01,
  cornerRadius = 16,
  padding = "24px",
  className = "",
  style,
  shadowMode = false,
  onClick,
  showNoise = true,
  noiseOpacity = 0.04,
  showSpecular = true,
  showBorder = true,
  variant = "default",
  hoverLift = true,
}: LiquidGlassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Variant-specific settings
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: `${WHOP.cream}08`,
    },
    prominent: {
      backgroundColor: `${WHOP.cream}12`,
    },
    subtle: {
      backgroundColor: `${WHOP.cream}04`,
    },
  };

  const variantDisplacement: Record<string, number> = {
    default: displacementScale,
    prominent: displacementScale * 1.2,
    subtle: displacementScale * 0.6,
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: cornerRadius,
        ...style,
      }}
      whileHover={hoverLift ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Glass Card with liquid effect */}
      <GlassCard
        displacementScale={variantDisplacement[variant]}
        blurAmount={blurAmount}
        cornerRadius={cornerRadius}
        padding={padding}
        shadowMode={shadowMode}
        onClick={onClick}
        className="relative z-10"
        style={{
          ...variantStyles[variant],
          boxShadow: `
            inset 0 1px 0 0 ${WHOP.cream}15,
            inset 0 -1px 0 0 ${WHOP.dark}30,
            0 4px 24px -4px ${WHOP.dark}60
          `,
        }}
        mouseContainer={containerRef}
      >
        {/* Content */}
        <div className="relative z-20">{children}</div>

        {/* Noise texture overlay */}
        {showNoise && (
          <NoiseOverlay
            opacity={noiseOpacity}
            baseFrequency={0.9}
            numOctaves={4}
            className="z-10 rounded-inherit"
          />
        )}

        {/* Specular highlight - top-left shine */}
        {showSpecular && (
          <div
            className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-30"
            style={{
              background: `linear-gradient(
                180deg,
                ${WHOP.cream}08 0%,
                transparent 100%
              )`,
              borderTopLeftRadius: cornerRadius,
              borderTopRightRadius: cornerRadius,
            }}
          />
        )}

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            borderRadius: cornerRadius,
            boxShadow: `
              inset 0 2px 4px 0 ${WHOP.dark}20,
              inset 0 -2px 4px 0 ${WHOP.cream}05
            `,
          }}
        />
      </GlassCard>

      {/* Border gradient */}
      {showBorder && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            borderRadius: cornerRadius,
            padding: 1,
            background: `linear-gradient(
              135deg,
              ${WHOP.cream}20 0%,
              ${WHOP.cream}05 50%,
              ${WHOP.cream}15 100%
            )`,
            WebkitMask: `
              linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0)
            `,
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * LiquidGlassButton - Smaller liquid glass for buttons/badges
 */
export function LiquidGlassButton({
  children,
  className = "",
  onClick,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "prominent";
}) {
  return (
    <LiquidGlassCard
      displacementScale={60}
      cornerRadius={8}
      padding="8px 16px"
      className={className}
      onClick={onClick}
      variant={variant}
      showNoise={false}
      showSpecular={true}
      showBorder={true}
      hoverLift={false}
    >
      {children}
    </LiquidGlassCard>
  );
}

export default LiquidGlassCard;
