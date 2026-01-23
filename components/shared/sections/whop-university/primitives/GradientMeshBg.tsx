"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { createNoise3D } from "simplex-noise";

interface GradientMeshBgProps {
  colors?: string[];
  speed?: number;
  className?: string;
}

/**
 * Stripe-inspired animated gradient mesh background
 * Uses Simplex noise for organic morphing effect
 */
export function GradientMeshBg({
  colors = ["#7C3AED", "#4F46E5", "#0EA5E9", "#10B981"],
  speed = 0.0005,
  className = "",
}: GradientMeshBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise3D = useRef(createNoise3D());
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 124, g: 58, b: 237 };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = timeRef.current;

    // Create gradient with morphing positions
    const gradient = ctx.createRadialGradient(
      width * (0.3 + 0.2 * Math.sin(time * 0.5)),
      height * (0.3 + 0.2 * Math.cos(time * 0.3)),
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.8
    );

    // Add color stops with noise-based offsets
    colors.forEach((color, i) => {
      const offset = i / (colors.length - 1);
      const noiseOffset = noise3D.current(offset * 2, time, 0) * 0.1;
      const clampedOffset = Math.max(0, Math.min(1, offset + noiseOffset));
      const rgb = hexToRgb(color);
      gradient.addColorStop(clampedOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add secondary gradient layer for depth
    const gradient2 = ctx.createRadialGradient(
      width * (0.7 + 0.15 * Math.cos(time * 0.4)),
      height * (0.6 + 0.15 * Math.sin(time * 0.6)),
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.6
    );

    colors.slice().reverse().forEach((color, i) => {
      const offset = i / (colors.length - 1);
      const noiseOffset = noise3D.current(offset * 2, time + 100, 0) * 0.1;
      const clampedOffset = Math.max(0, Math.min(1, offset + noiseOffset));
      const rgb = hexToRgb(color);
      gradient2.addColorStop(clampedOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
    });

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";

    timeRef.current += speed * 16.67; // Normalize to ~60fps
    animationRef.current = requestAnimationFrame(draw);
  }, [colors, speed, hexToRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    } else {
      // Draw single frame for reduced motion
      draw();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ filter: "blur(60px)" }}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
