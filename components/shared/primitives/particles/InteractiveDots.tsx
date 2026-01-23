"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { getDistance } from "@/lib/mouse-tracking";

export interface InteractiveDotsProps {
  rows?: number; // number of rows, default 10
  cols?: number; // number of columns, default 15
  dotSize?: number; // base dot size in px, default 2
  gap?: number; // gap between dots in px, default 40
  color?: string; // dot color, default '#D6FC51'
  interactionRadius?: number; // radius where dots react to cursor, default 100
  maxScale?: number; // maximum scale on hover, default 3
  className?: string;
}

/**
 * InteractiveDots
 *
 * Grid of dots that scale and move based on cursor proximity.
 * Creates a dynamic, interactive background effect.
 *
 * @example
 * ```tsx
 * <InteractiveDots
 *   rows={12}
 *   cols={20}
 *   color="#D6FC51"
 *   interactionRadius={120}
 * />
 * ```
 */
export function InteractiveDots({
  rows = 10,
  cols = 15,
  dotSize = 2,
  gap = 40,
  color = "#D6FC51",
  interactionRadius = 100,
  maxScale = 3,
  className = "",
}: InteractiveDotsProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}
    >
      <div
        className="relative"
        style={{
          width: cols * gap,
          height: rows * gap,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const x = col * gap;
          const y = row * gap;

          return (
            <Dot
              key={index}
              x={x}
              y={y}
              size={dotSize}
              color={color}
              mouseX={mouseX}
              mouseY={mouseY}
              interactionRadius={interactionRadius}
              maxScale={maxScale}
            />
          );
        })}
      </div>
    </div>
  );
}

interface DotProps {
  x: number;
  y: number;
  size: number;
  color: string;
  mouseX: any;
  mouseY: any;
  interactionRadius: number;
  maxScale: number;
}

function Dot({
  x,
  y,
  size,
  color,
  mouseX,
  mouseY,
  interactionRadius,
  maxScale,
}: DotProps) {
  const [dotCenter, setDotCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculate absolute position of dot center
    const element = document.elementFromPoint(x, y);
    if (element) {
      const rect = element.getBoundingClientRect();
      setDotCenter({
        x: rect.left + x,
        y: rect.top + y,
      });
    }
  }, [x, y]);

  // Calculate distance from mouse to dot
  const distance = useTransform([mouseX, mouseY], ([mX, mY]) => {
    return getDistance(mX as number, mY as number, dotCenter.x + x, dotCenter.y + y);
  });

  // Calculate scale based on distance
  const scale = useTransform(distance, [0, interactionRadius], [maxScale, 1]);
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 20 });

  // Calculate offset based on distance (move away from cursor)
  const offsetX = useTransform([mouseX, distance], ([mX, dist]) => {
    if ((dist as number) > interactionRadius) return 0;
    const force = 1 - (dist as number) / interactionRadius;
    return ((dotCenter.x + x - (mX as number)) / interactionRadius) * force * 10;
  });

  const offsetY = useTransform([mouseY, distance], ([mY, dist]) => {
    if ((dist as number) > interactionRadius) return 0;
    const force = 1 - (dist as number) / interactionRadius;
    return ((dotCenter.y + y - (mY as number)) / interactionRadius) * force * 10;
  });

  const smoothOffsetX = useSpring(offsetX, { stiffness: 200, damping: 20 });
  const smoothOffsetY = useSpring(offsetY, { stiffness: 200, damping: 20 });

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: color,
        scale: smoothScale,
        x: smoothOffsetX,
        y: smoothOffsetY,
        willChange: "transform",
      }}
    />
  );
}
