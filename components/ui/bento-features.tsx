"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
}

const BentoCard = ({ title, description, className }: BentoCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10",
        className
      )}
    >
      <div className="relative z-10">
        <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-blue-200/80">{description}</p>
      </div>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20" />
    </div>
  );
};

interface SpiralPoint {
  x: number;
  y: number;
}

const FeaturesSection = () => {
  const [offset, setOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Golden ratio and spiral parameters
  const phi = (1 + Math.sqrt(5)) / 2;
  const spiralTurns = 4;
  const points = 500;

  // Generate Fibonacci spiral points
  const spiralPath = useMemo(() => {
    const pathPoints: SpiralPoint[] = [];
    const centerX = 400;
    const centerY = 400;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * spiralTurns * 2 * Math.PI;
      const radius = Math.pow(phi, (angle / Math.PI) * 2) * 2;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      pathPoints.push({ x, y });
    }

    return pathPoints;
  }, []);

  // Create SVG path string
  const pathString = useMemo(() => {
    if (spiralPath.length === 0) return "";
    let path = `M ${spiralPath[0].x} ${spiralPath[0].y}`;
    for (let i = 1; i < spiralPath.length; i++) {
      path += ` L ${spiralPath[i].x} ${spiralPath[i].y}`;
    }
    return path;
  }, [spiralPath]);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setOffset((prev) => (prev + 0.5) % 100);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const features = [
    {
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with our optimized infrastructure.",
      span: "md:col-span-4 md:row-span-2",
    },
    {
      title: "Secure by Default",
      description: "Enterprise-grade security built into every layer.",
      span: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Scale Effortlessly",
      description: "Grow from startup to enterprise without breaking a sweat.",
      span: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team in real-time.",
      span: "md:col-span-3 md:row-span-1",
    },
    {
      title: "Analytics & Insights",
      description: "Make data-driven decisions with powerful analytics.",
      span: "md:col-span-3 md:row-span-1",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 py-24">
      {/* Animated Spiral Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          className="h-full w-full"
          style={{
            filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
          }}
        >
          <defs>
            <radialGradient id="spiralGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.2" />
            </radialGradient>
            <mask id="spiralMask">
              <circle cx="400" cy="400" r="350" fill="white" />
            </mask>
          </defs>
          <g mask="url(#spiralMask)">
            <path
              d={pathString}
              fill="none"
              stroke="url(#spiralGradient)"
              strokeWidth="2"
              strokeDasharray="10 5"
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
            {/* Pulsing dots along the spiral */}
            {spiralPath
              .filter((_, i) => i % 50 === 0)
              .map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="rgb(59, 130, 246)"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="2;4;2"
                    dur="2s"
                    begin={`${i * 0.1}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
          </g>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
            Built for the Future
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-blue-200/80">
            Experience the next generation of modern web development with our
            cutting-edge features.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-3">
          {features.map((feature, index) => (
            <BentoCard
              key={index}
              title={feature.title}
              description={feature.description}
              className={feature.span}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
export { FeaturesSection };
