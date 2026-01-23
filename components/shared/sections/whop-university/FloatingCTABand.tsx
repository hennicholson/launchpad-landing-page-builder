"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { MagneticButton } from "./primitives/MagneticButton";

/**
 * Floating CTA Band Section
 * Full-width gradient band with liquid button and optional profile
 * Used as conversion points throughout the funnel
 */
export function FloatingCTABand({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Colors - Whop brand palette
  const bgColor = content.backgroundColor || colorScheme.primary || "#FA4616";
  const textColor = content.textColor || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FF6B3D";

  // Typography - Acid Grotesk as default
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // Default padding
  const DEFAULT_PADDING = { top: 64, bottom: 80 };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: `${textColor}30`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient overlays for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 100% at 50% 0%, ${textColor}10 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 100% at 50% 100%, ${textColor}05 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Headline */}
        {content.heading && (
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
            style={{ color: textColor, fontFamily: headingFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {renderText
              ? renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading}
          </motion.h2>
        )}

        {/* Subheading */}
        {content.subheading && (
          <motion.p
            className="text-lg mb-8 opacity-90"
            style={{ color: textColor, fontFamily: bodyFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {renderText
              ? renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  multiline: true,
                  inline: true,
                })
              : content.subheading}
          </motion.p>
        )}

        {/* CTA Button with optional profile */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Profile badge (optional) */}
          {content.creatorImageUrl && (
            <div className="flex items-center gap-3">
              <motion.div
                className="relative rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 0 3px ${textColor}30`,
                    `0 0 0 6px ${textColor}10`,
                    `0 0 0 3px ${textColor}30`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src={content.creatorImageUrl}
                  alt={content.creatorName || "Creator"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </motion.div>
              {content.creatorName && (
                <span
                  className="text-sm font-medium hidden sm:block"
                  style={{ color: textColor }}
                >
                  {renderText
                    ? renderText({
                        value: content.creatorName,
                        sectionId: section.id,
                        field: "creatorName",
                        inline: true,
                      })
                    : content.creatorName}
                </span>
              )}
            </div>
          )}

          {/* Main CTA Button */}
          {content.buttonText && (
            <MagneticButton
              href={content.buttonLink || "#"}
              variant="solid"
              primaryColor={textColor}
              size="lg"
              className="!text-current"
              style={{
                backgroundColor: textColor,
                color: bgColor,
              }}
            >
              <span style={{ color: bgColor }}>
                {renderText
                  ? renderText({
                      value: content.buttonText,
                      sectionId: section.id,
                      field: "buttonText",
                      inline: true,
                    })
                  : content.buttonText}
              </span>
            </MagneticButton>
          )}
        </motion.div>

        {/* Trust indicators */}
        {content.trustText && (
          <motion.p
            className="mt-6 text-sm opacity-70"
            style={{ color: textColor, fontFamily: bodyFont }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {renderText
              ? renderText({
                  value: content.trustText,
                  sectionId: section.id,
                  field: "trustText",
                  multiline: true,
                  inline: true,
                })
              : content.trustText}
          </motion.p>
        )}
      </div>
    </section>
  );
}
