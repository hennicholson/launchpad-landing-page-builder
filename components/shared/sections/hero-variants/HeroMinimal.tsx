"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { BrandMarquee } from "../../primitives/BrandMarquee";
import { GradientText } from "../../primitives/text/GradientText";
import { GridPattern } from "../../primitives/background/GridPattern";
import { ParallaxContainer } from "../../primitives/scroll/ParallaxContainer";
import Link from "next/link";
import SectionButton, { getButtonPropsFromContent } from "../SectionButton";
import { SectionBackground } from "../../SectionBackground";

export default function HeroMinimal({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary || accentColor;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  return (
    <main className="overflow-hidden">
      <section
        className="relative min-h-screen"
        style={{
          backgroundColor: bgColor,
          paddingTop: content.paddingTop ?? 120,
          paddingBottom: content.paddingBottom ?? 160,
        }}
      >
        {/* User-configurable Background Effect */}
        <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
        {/* Background System */}
        {/* Base Radial Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${accentColor}08, transparent 70%)`,
            }}
          />
        </div>

        {/* Gradient Dots Pattern */}
        <GridPattern
          cellSize={60}
          pattern="dots"
          color={accentColor}
          opacity={0.15}
          fadeEdges
          animate
        />

        {/* Radial Blur Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top center glow */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ backgroundColor: `${accentColor}12` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Bottom left glow */}
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ backgroundColor: `${primaryColor}08` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />

          {/* Bottom right glow */}
          <motion.div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]"
            style={{ backgroundColor: `${accentColor}10` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col items-center text-center space-y-12 md:space-y-16">
            {/* Heading Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <GradientText
                colors={[textColor, accentColor, textColor]}
                animate
                duration={3}
                direction="horizontal"
                as="h1"
                className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
              >
                <span style={{ fontFamily: headingFont }}>
                  {content.heading || "Elegant Solutions"}
                </span>
              </GradientText>

              {content.accentHeading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                >
                  <GradientText
                    colors={[accentColor, primaryColor, accentColor]}
                    animate
                    duration={3}
                    direction="horizontal"
                    as="span"
                    className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.95] block"
                  >
                    <span style={{ fontFamily: headingFont }}>
                      {content.accentHeading}
                    </span>
                  </GradientText>
                </motion.div>
              )}
            </motion.div>

            {/* Subheading */}
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
              style={{
                fontFamily: bodyFont,
                color: `${textColor}b3`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {renderText ? (
                renderText({
                  value: content.subheading || "",
                  sectionId: section.id,
                  field: "subheading",
                  multiline: true,
                  inline: true,
                  className: "text-lg sm:text-xl lg:text-2xl leading-relaxed",
                  style: { fontFamily: bodyFont, color: `${textColor}b3` },
                })
              ) : (
                content.subheading ||
                "Crafted with precision and elegance for the modern web"
              )}
            </motion.p>

            {/* Glass Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.6,
              }}
            >
              {/* Primary Button */}
              {content.showButton !== false && content.buttonText && (
                <SectionButton
                  text={content.buttonText || ""}
                  link={content.buttonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />
              )}

              {/* Secondary Button */}
              {content.showSecondaryButton !== false && content.secondaryButtonText && (
                <SectionButton
                  text={content.secondaryButtonText || ""}
                  link={content.secondaryButtonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />
              )}
            </motion.div>

            {/* Image with Parallax Container */}
            {content.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 0.8,
                }}
                className="mt-16 md:mt-24 w-full"
              >
                <ParallaxContainer speed={0.5} direction="down">
                  <div
                    className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border shadow-2xl"
                    style={{
                      backgroundColor: `${bgColor}40`,
                      borderColor: `${textColor}20`,
                      boxShadow: `0 25px 50px -12px ${textColor}30`,
                    }}
                  >
                    {/* Inner glow border */}
                    <div
                      className="absolute inset-0 rounded-3xl pointer-events-none z-10"
                      style={{
                        boxShadow: `inset 0 0 40px ${accentColor}20`,
                      }}
                    />

                    {renderImage ? (
                      renderImage({
                        src: content.imageUrl,
                        sectionId: section.id,
                        field: "imageUrl",
                        className: "w-full h-auto relative z-0",
                        alt: "Hero Image",
                      })
                    ) : (
                      <img
                        src={content.imageUrl}
                        alt="Hero"
                        className="w-full h-auto relative z-0"
                      />
                    )}

                    {/* Bottom gradient fade */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-20"
                      style={{
                        background: `linear-gradient(to top, ${bgColor}e6, transparent)`,
                      }}
                    />
                  </div>
                </ParallaxContainer>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: `${textColor}60`, fontFamily: bodyFont }}
            >
              Scroll
            </span>
            <svg
              className="w-5 h-5"
              style={{ color: `${textColor}60` }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Logo Cloud */}
      {content.brands && content.brands.length > 0 && (
        <section
          className="pb-16 md:pb-32"
          style={{ backgroundColor: bgColor }}
        >
          <div className="group relative m-auto max-w-5xl px-6">
            <BrandMarquee
              brands={content.brands}
              textColor={textColor}
              bgColor={bgColor}
              headingFont={headingFont}
            />
          </div>
        </section>
      )}
    </main>
  );
}
