"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { cn } from "@/lib/utils";
import { SubheadingText } from "./SubheadingText";

interface BentoCardProps {
  title: string;
  description: string;
  gridClass?: string;
  textColor: string;
  accentColor: string;
  sectionId: string;
  itemId: string;
  renderText?: BaseSectionProps["renderText"];
}

const BentoCard = ({ title, description, gridClass, textColor, accentColor, sectionId, itemId, renderText }: BentoCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/50 to-indigo-950/50 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10",
        gridClass || "md:col-span-1"
      )}
    >
      <div className="relative z-10">
        {renderText ? (
          renderText({
            value: title,
            sectionId,
            field: "title",
            itemId,
            className: "mb-2 text-xl font-semibold text-white",
          })
        ) : (
          <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        )}
        {renderText ? (
          renderText({
            value: description,
            sectionId,
            field: "description",
            itemId,
            className: "text-sm text-blue-200/80",
          })
        ) : (
          <p className="text-sm text-blue-200/80">{description}</p>
        )}
      </div>
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-all group-hover:bg-blue-500/20"
        style={{ backgroundColor: `${accentColor}10` }}
      />
    </div>
  );
};

interface SpiralPoint {
  x: number;
  y: number;
}

export default function FeaturesBentoBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  const [offset, setOffset] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Extract styling
  const bgColor = content.backgroundColor || "#0a1628";
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const DEFAULT_PADDING = { top: 96, bottom: 96 };

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

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, ${bgColor}dd, ${bgColor})`,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
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
            <radialGradient id={`spiralGradient-${section.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
            </radialGradient>
            <mask id={`spiralMask-${section.id}`}>
              <circle cx="400" cy="400" r="350" fill="white" />
            </mask>
          </defs>
          <g mask={`url(#spiralMask-${section.id})`}>
            <path
              d={pathString}
              fill="none"
              stroke={`url(#spiralGradient-${section.id})`}
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
                  fill={accentColor}
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
        {/* Heading Section */}
        {(content.showHeading !== false && content.heading) || (content.showSubheading !== false && content.subheading) ? (
          <div className="mb-16 text-center">
            {content.showHeading !== false && content.heading && (
              renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent",
                })
              ) : (
                <h2 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
                  {content.heading}
                </h2>
              )
            )}
            <SubheadingText
              content={content}
              sectionId={section.id}
              textColor={textColor}
              bodyFont={typography.bodyFont}
              renderText={renderText}
            />
          </div>
        ) : null}

        {/* Bento Grid */}
        {content.showItems !== false && items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-3">
            {items.map((item) => (
              <BentoCard
                key={item.id}
                title={item.title || ""}
                description={item.description || ""}
                gridClass={item.gridClass}
                textColor={textColor}
                accentColor={accentColor}
                sectionId={section.id}
                itemId={item.id}
                renderText={renderText}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
