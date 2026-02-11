"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { springConfigs } from "@/lib/animation-utils";

export interface MorphingBlobsProps {
  count?: number; // number of blobs, default 3
  colors?: string[]; // blob colors, default ['#D6FC51', '#A78BFA', '#60A5FA']
  speed?: number; // morph speed in seconds, default 8
  blur?: number; // blur amount in px, default 60
  opacity?: number; // blob opacity, default 0.4
  size?: number; // base size in px, default 300
  className?: string;
}

/**
 * MorphingBlobs
 *
 * Organic blob shapes that continuously morph and move.
 * Creates abstract, fluid background effects.
 *
 * @example
 * ```tsx
 * <MorphingBlobs
 *   count={4}
 *   colors={['#D6FC51', '#A78BFA', '#60A5FA', '#EC4899']}
 *   speed={10}
 *   blur={80}
 * />
 * ```
 */
export function MorphingBlobs({
  count = 3,
  colors = ["#D6FC51", "#A78BFA", "#60A5FA"],
  speed = 8,
  blur = 60,
  opacity = 0.4,
  size = 300,
  className = "",
}: MorphingBlobsProps) {
  // Memoize random blob sizes so they are generated once and remain stable across re-renders
  const blobSizes = useMemo(
    () => Array.from({ length: count }, () => size + (Math.random() - 0.5) * 100),
    [] // eslint-disable-line react-hooks/exhaustive-deps -- intentionally generate once
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        // Position blobs at different locations
        const positions = [
          { x: "20%", y: "30%" },
          { x: "70%", y: "60%" },
          { x: "50%", y: "80%" },
          { x: "80%", y: "20%" },
          { x: "30%", y: "70%" },
        ];

        const position = positions[index % positions.length];
        const color = colors[index % colors.length];
        const delay = index * (speed / count);

        return (
          <Blob
            key={index}
            color={color}
            size={blobSizes[index] ?? size}
            speed={speed}
            blur={blur}
            opacity={opacity}
            position={position}
            delay={delay}
          />
        );
      })}
    </div>
  );
}

interface BlobProps {
  color: string;
  size: number;
  speed: number;
  blur: number;
  opacity: number;
  position: { x: string; y: string };
  delay: number;
}

function Blob({ color, size, speed, blur, opacity, position, delay }: BlobProps) {
  // Generate random blob path (SVG path for organic shape)
  const generateBlobPath = () => {
    // Create organic blob using quadratic curves
    const points = 8;
    const angleStep = (Math.PI * 2) / points;
    let path = "M";

    for (let i = 0; i <= points; i++) {
      const angle = angleStep * i;
      const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      const x = 50 + Math.cos(angle) * 40 * randomVariation;
      const y = 50 + Math.sin(angle) * 40 * randomVariation;

      if (i === 0) {
        path += `${x},${y}`;
      } else {
        // Use quadratic curves for smooth organic shapes
        const prevAngle = angleStep * (i - 1);
        const controlX = 50 + Math.cos(prevAngle + angleStep / 2) * 45;
        const controlY = 50 + Math.sin(prevAngle + angleStep / 2) * 45;
        path += ` Q${controlX},${controlY} ${x},${y}`;
      }
    }

    path += " Z";
    return path;
  };

  // Create multiple morph states — memoized so random paths are generated once per mount
  const morphStates = useMemo(
    () => Array.from({ length: 4 }, () => generateBlobPath()),
    [] // eslint-disable-line react-hooks/exhaustive-deps -- intentionally generate once
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        filter: `blur(${blur}px)`,
        opacity,
        willChange: "transform",
      }}
      animate={{
        x: [0, 20, -20, 10, 0],
        y: [0, -15, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        rotate: [0, 5, -5, 3, 0],
      }}
      transition={{
        duration: speed,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          fill={color}
          animate={{
            d: morphStates,
          }}
          transition={{
            duration: speed,
            delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
