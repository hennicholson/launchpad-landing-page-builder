"use client";

import { useId } from "react";

interface NoiseOverlayProps {
  /** Opacity of the noise texture (0-1). Default: 0.05 */
  opacity?: number;
  /** Base frequency of the noise. Higher = finer grain. Default: 0.8 */
  baseFrequency?: number;
  /** Number of octaves for noise detail. Default: 4 */
  numOctaves?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * NoiseOverlay - Adds organic grain texture using SVG feTurbulence
 * Creates a subtle, textured feel without being overpowering
 */
export function NoiseOverlay({
  opacity = 0.05,
  baseFrequency = 0.8,
  numOctaves = 4,
  className = "",
}: NoiseOverlayProps) {
  const id = useId();
  const filterId = `noise-${id}`;

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="monoNoise"
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}

export default NoiseOverlay;
