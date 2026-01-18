"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export interface WavyBackgroundProps {
  className?: string;
  colors?: string[];
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

export function WavyBackground({
  className,
  colors,
  waveWidth,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
}: WavyBackgroundProps) {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>(0);
  const [isSafari, setIsSafari] = useState(false);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w: number;
    let h: number;
    let nt = 0;

    const init = () => {
      w = ctx.canvas.width = canvas.offsetWidth;
      h = ctx.canvas.height = canvas.offsetHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (n: number) => {
      nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);
      drawWave(5);
      animationIdRef.current = requestAnimationFrame(render);
    };

    init();
    render();

    const handleResize = () => {
      w = ctx.canvas.width = canvas.offsetWidth;
      h = ctx.canvas.height = canvas.offsetHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [blur, waveOpacity, waveWidth, waveColors, noise]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
}
