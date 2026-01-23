"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { GradientMeshBg } from "./primitives/GradientMeshBg";
import { MagneticButton } from "./primitives/MagneticButton";

/**
 * Premium Hero Section with Animated Gradient Mesh
 * Features:
 * - Stripe-inspired morphing gradient background
 * - Character-by-character headline animation
 * - 3D floating product mockup
 * - Magnetic CTA button
 * - Profile badge with glow
 */
export function HeroGradientMesh({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const containerRef = useRef<HTMLDivElement>(null);

  // Colors - Whop brand palette
  const bgColor = content.backgroundColor || colorScheme.background || "#141212";
  const textColor = content.textColor || colorScheme.text || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FA4616";
  const primaryColor = colorScheme.primary || "#FF6B3D";

  // Typography - Acid Grotesk as default
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Parallax effect for product image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  // Split headline into characters for stagger animation
  const headline = content.heading || "Master the Art of Building";
  const accentHeadline = content.accentHeading || "Profitable Digital Products";

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  // Default padding
  const DEFAULT_PADDING = { top: 96, bottom: 96 };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Animated Gradient Mesh Background - Whop warm tones */}
      <GradientMeshBg
        colors={[accentColor, primaryColor, "#FF8C42", "#E03D10"]}
        speed={0.0003}
      />

      {/* Radial overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, ${bgColor} 100%)`,
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Badge */}
        {content.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
                fontFamily: bodyFont,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              {renderText
                ? renderText({
                    value: content.badge,
                    sectionId: section.id,
                    field: "badge",
                    inline: true,
                  })
                : content.badge}
            </span>
          </motion.div>
        )}

        {/* Main Headline with Character Animation */}
        <motion.h1
          className="text-center max-w-5xl"
          initial="hidden"
          animate="visible"
        >
          {/* First line - skip animation in edit mode for inline editing */}
          <span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText ? (
              // Edit mode: render as single editable block
              renderText({
                value: content.heading || "Master the Art of Building",
                sectionId: section.id,
                field: "heading",
                inline: true,
              })
            ) : (
              // Display mode: character-by-character animation
              headline.split("").map((char, i) => (
                <motion.span
                  key={`h1-${i}`}
                  custom={i}
                  variants={characterVariants}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))
            )}
          </span>

          {/* Accent line with gradient - skip animation in edit mode */}
          <span
            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
            style={{
              fontFamily: headingFont,
              // Only apply gradient in non-edit mode - edit mode passes style to renderText
              ...(!renderText && {
                background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 50%, #FF8C42 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }),
            }}
          >
            {renderText ? (
              // Edit mode: render as single editable block with gradient style
              renderText({
                value: content.accentHeading || "Profitable Digital Products",
                sectionId: section.id,
                field: "accentHeading",
                inline: true,
                style: {
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 50%, #FF8C42 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                },
              })
            ) : (
              // Display mode: character-by-character animation
              accentHeadline.split("").map((char, i) => (
                <motion.span
                  key={`h2-${i}`}
                  custom={i + headline.length}
                  variants={characterVariants}
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))
            )}
          </span>
        </motion.h1>

        {/* Subheading */}
        {content.subheading && (
          <motion.p
            className="mt-8 text-lg md:text-xl text-center max-w-2xl"
            style={{
              color: `${textColor}cc`,
              fontFamily: bodyFont,
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {content.buttonText && (
            <MagneticButton
              href={content.buttonLink || "#"}
              variant="glow"
              primaryColor={accentColor}
              size="lg"
            >
              {renderText
                ? renderText({
                    value: content.buttonText,
                    sectionId: section.id,
                    field: "buttonText",
                    inline: true,
                  })
                : content.buttonText}
            </MagneticButton>
          )}

          {content.secondaryButtonText && (
            <motion.a
              href={content.secondaryButtonLink || "#"}
              className="px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
              style={{
                color: textColor,
                border: `1px solid ${textColor}30`,
                fontFamily: bodyFont,
              }}
              whileHover={{
                borderColor: `${textColor}60`,
                backgroundColor: `${textColor}10`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              {renderText
                ? renderText({
                    value: content.secondaryButtonText,
                    sectionId: section.id,
                    field: "secondaryButtonText",
                    inline: true,
                  })
                : content.secondaryButtonText}
            </motion.a>
          )}
        </motion.div>

        {/* Optional Profile Badge */}
        {content.creatorName && (
          <motion.div
            className="flex items-center gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {content.creatorImageUrl && (
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${accentColor}40`,
                      `0 0 40px ${accentColor}60`,
                      `0 0 20px ${accentColor}40`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img
                  src={content.creatorImageUrl}
                  alt={content.creatorName}
                  className="relative w-12 h-12 rounded-full object-cover border-2"
                  style={{ borderColor: accentColor }}
                />
              </div>
            )}
            <div>
              <p className="font-medium" style={{ color: textColor, fontFamily: bodyFont }}>
                {renderText
                  ? renderText({
                      value: content.creatorName,
                      sectionId: section.id,
                      field: "creatorName",
                      inline: true,
                    })
                  : content.creatorName}
              </p>
              {content.creatorRole && (
                <p className="text-sm" style={{ color: `${textColor}80`, fontFamily: bodyFont }}>
                  {renderText
                    ? renderText({
                        value: content.creatorRole,
                        sectionId: section.id,
                        field: "creatorRole",
                        inline: true,
                      })
                    : content.creatorRole}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* 3D Floating Product Image */}
        {content.imageUrl && (
          <motion.div
            className="relative mt-16 w-full max-w-4xl"
            style={{ y: imageY, rotateX: imageRotate, perspective: 1200 }}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {/* Glow behind image */}
            <div
              className="absolute inset-0 blur-3xl opacity-40 -z-10"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 100%)`,
                transform: "translateY(20px) scale(0.9)",
              }}
            />

            {/* Product image with 3D effect */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: `0 40px 80px -20px ${accentColor}40`,
              }}
              whileHover={{ scale: 1.02, rotateX: -2 }}
              transition={{ duration: 0.4 }}
            >
              {renderImage ? (
                renderImage({
                  src: content.imageUrl,
                  sectionId: section.id,
                  field: "imageUrl",
                  className: "w-full h-auto",
                  alt: content.heading || "Product preview",
                })
              ) : (
                <img
                  src={content.imageUrl}
                  alt={content.heading || "Product preview"}
                  className="w-full h-auto"
                  loading="lazy"
                />
              )}

              {/* Shine effect overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "100%", opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${bgColor} 0%, transparent 100%)`,
        }}
      />
    </section>
  );
}
