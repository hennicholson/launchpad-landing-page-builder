"use client";

import { motion } from "framer-motion";

export interface GridPatternProps {
  cellSize?: number; // size of each grid cell in px, default 40
  strokeWidth?: number; // line thickness, default 1
  color?: string; // grid color, default '#D6FC51'
  opacity?: number; // grid opacity, default 0.1
  fadeEdges?: boolean; // fade out at edges, default true
  animate?: boolean; // animate grid appearance, default false
  pattern?: "grid" | "dots" | "crosses"; // pattern type, default "grid"
  className?: string;
}

/**
 * GridPattern
 *
 * Animated grid, dot, or cross pattern background.
 * Perfect for technical/modern aesthetic.
 *
 * @example
 * ```tsx
 * <GridPattern
 *   cellSize={50}
 *   pattern="dots"
 *   color="#D6FC51"
 *   opacity={0.15}
 *   animate
 * />
 * ```
 */
export function GridPattern({
  cellSize = 40,
  strokeWidth = 1,
  color = "#D6FC51",
  opacity = 0.1,
  fadeEdges = true,
  animate = false,
  pattern = "grid",
  className = "",
}: GridPatternProps) {
  const getSVGString = () => {
    switch (pattern) {
      case "dots":
        return `<svg width="${cellSize}" height="${cellSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${cellSize / 2}" cy="${cellSize / 2}" r="${strokeWidth}" fill="${color}" opacity="${opacity}" /></svg>`;

      case "crosses":
        return `<svg width="${cellSize}" height="${cellSize}" xmlns="http://www.w3.org/2000/svg"><g opacity="${opacity}" stroke="${color}" stroke-width="${strokeWidth}"><line x1="${cellSize / 2 - 4}" y1="${cellSize / 2}" x2="${cellSize / 2 + 4}" y2="${cellSize / 2}" /><line x1="${cellSize / 2}" y1="${cellSize / 2 - 4}" x2="${cellSize / 2}" y2="${cellSize / 2 + 4}" /></g></svg>`;

      case "grid":
      default:
        return `<svg width="${cellSize}" height="${cellSize}" xmlns="http://www.w3.org/2000/svg"><path d="M ${cellSize} 0 L 0 0 0 ${cellSize}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" /></svg>`;
    }
  };

  // Convert SVG string to data URL for background-image
  const svgString = encodeURIComponent(getSVGString());
  const dataUrl = `data:image/svg+xml,${svgString}`;

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: `${cellSize}px ${cellSize}px`,
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
      initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={
        animate
          ? {
              duration: 1,
              ease: "easeOut",
            }
          : undefined
      }
    >
      {fadeEdges && (
        <>
          {/* Radial fade mask */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </>
      )}
    </motion.div>
  );
}
