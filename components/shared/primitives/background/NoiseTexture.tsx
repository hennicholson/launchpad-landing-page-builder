"use client";

import { useEffect, useRef } from "react";

export interface NoiseTextureProps {
  opacity?: number; // noise opacity, default 0.05
  scale?: number; // noise detail level, default 1
  animate?: boolean; // animate noise, default false
  animationSpeed?: number; // frames per second, default 12
  blend?: "normal" | "multiply" | "screen" | "overlay"; // blend mode, default "normal"
  className?: string;
}

/**
 * NoiseTexture
 *
 * Procedural noise overlay texture for adding grain/film effect.
 * Creates subtle texture and depth.
 *
 * @example
 * ```tsx
 * <NoiseTexture
 *   opacity={0.08}
 *   animate
 *   blend="overlay"
 * />
 * ```
 */
export function NoiseTexture({
  opacity = 0.05,
  scale = 1,
  animate = false,
  animationSpeed = 12,
  blend = "normal",
  className = "",
}: NoiseTextureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (smaller for performance, will be scaled up with CSS)
    const width = 300 * scale;
    const height = 300 * scale;
    canvas.width = width;
    canvas.height = height;

    // Generate noise pattern
    const generateNoise = () => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Random grayscale value
        const value = Math.random() * 255;
        data[i] = value; // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 255; // A
      }

      ctx.putImageData(imageData, 0, 0);
    };

    if (animate) {
      // Animated noise
      const animateNoise = (timestamp: number) => {
        const frameInterval = 1000 / animationSpeed;

        if (timestamp - lastFrameTime.current >= frameInterval) {
          generateNoise();
          lastFrameTime.current = timestamp;
        }

        rafRef.current = requestAnimationFrame(animateNoise);
      };

      rafRef.current = requestAnimationFrame(animateNoise);
    } else {
      // Static noise
      generateNoise();
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scale, animate, animationSpeed]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          opacity,
          mixBlendMode: blend,
          imageRendering: "pixelated",
          willChange: animate ? "contents" : undefined,
        }}
      />
    </div>
  );
}
