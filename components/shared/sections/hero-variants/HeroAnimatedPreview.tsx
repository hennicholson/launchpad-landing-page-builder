"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { BrandMarquee } from "../../primitives/BrandMarquee";
import { SectionBackground } from "../../SectionBackground";
import { AnimatedMesh, TiltCard } from "../../primitives";
import Link from "next/link";
import SectionButton, {
  getButtonPropsFromContent,
  getSecondaryButtonPropsFromContent,
} from "../SectionButton";

export default function HeroAnimatedPreview({
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

  const DEFAULT_PADDING = { top: 0, bottom: 80 };

  // Determine which app preview image to show (light or dark based on background luminance)
  const isDarkBg = bgColor.startsWith("#")
    ? parseInt(bgColor.slice(1, 3), 16) < 128
    : bgColor.includes("rgb")
      ? parseInt(bgColor.match(/\d+/)?.[0] || "0") < 128
      : false;

  const appPreviewImage = isDarkBg
    ? content.appPreviewImageLight || content.imageUrl
    : content.appPreviewImageDark || content.imageUrl;

  return (
    <main className="overflow-hidden">
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />

      {/* Animated Mesh Background Layer */}
      <AnimatedMesh
        colors={[accentColor, `${textColor}40`, `${accentColor}80`]}
        speed={1.2}
        opacity={0.06}
        morphIntensity={0.6}
      />

      {/* Radial Gradient Background Effects */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
      >
        {/* Purple-blue gradient - top left */}
        <div
          className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${accentColor}15 0%, transparent 100%)`,
          }}
        />
        {/* Secondary gradient - top right */}
        <div
          className="w-[30rem] h-[60rem] translate-y-[200px] absolute right-0 top-1/4 rotate-12 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${accentColor}12 0%, transparent 100%)`,
          }}
        />
        {/* Tertiary gradient - bottom center */}
        <div
          className="w-[40rem] h-[70rem] absolute left-1/4 bottom-0 -rotate-12 rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${textColor}08 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* Hero Content Section */}
      <section
        className="relative pt-32 pb-20 md:pt-40 md:pb-32"
        style={{
          backgroundColor: bgColor,
          paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
          paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
        }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-8">
            {/* Announcement Badge with Shimmer */}
            {content.showAnnouncement !== false && content.announcementText && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href={content.announcementLink || "#"}>
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden group"
                    style={{
                      color: accentColor,
                      borderColor: `${accentColor}30`,
                      backgroundColor: `${accentColor}10`,
                      fontFamily: bodyFont,
                    }}
                  >
                    {/* Shimmer effect */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)`,
                      }}
                    />

                    <svg
                      className="w-3 h-3 relative z-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>

                    <span className="relative z-10">
                      {renderText ? (
                        renderText({
                          value: content.announcementText,
                          sectionId: section.id,
                          field: "announcementText",
                          className:
                            "text-xs font-semibold uppercase tracking-wider",
                        })
                      ) : (
                        content.announcementText
                      )}
                    </span>

                    <svg
                      className="w-3 h-3 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Heading */}
            {content.showHeading !== false && (
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
                style={{ fontFamily: headingFont, color: textColor }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {renderText ? (
                  renderText({
                    value: content.heading || "",
                    sectionId: section.id,
                    field: "heading",
                    className: "text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight",
                    style: { color: textColor, fontFamily: headingFont },
                  })
                ) : (
                  content.heading || "Ship faster with precision"
                )}
              </motion.h1>
            )}

            {/* Subheading */}
            {content.showSubheading !== false && content.subheading && (
              <motion.p
                className="text-base sm:text-lg lg:text-xl mx-auto leading-relaxed"
                style={{
                  fontFamily: bodyFont,
                  color: `${textColor}b3`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {renderText ? (
                  renderText({
                    value: content.subheading,
                    sectionId: section.id,
                    field: "subheading",
                    multiline: true,
                    inline: true,
                    className: "text-base sm:text-lg lg:text-xl leading-relaxed",
                    style: { color: `${textColor}b3`, fontFamily: bodyFont },
                  })
                ) : (
                  content.subheading
                )}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Primary Button */}
              {content.showButton !== false && (content.primaryButtonText || content.buttonText) && (
                <SectionButton
                  text={content.primaryButtonText || content.buttonText || ""}
                  link={content.primaryButtonLink || content.buttonLink || "#"}
                  sectionId={section.id}
                  buttonType="primary"
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
                  buttonType="secondary"
                  {...getSecondaryButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />
              )}
            </motion.div>
          </div>

          {/* App Preview with 3D Perspective */}
          {content.showImage !== false && appPreviewImage && (
            <motion.div
              className="relative mt-16 md:mt-24"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.7,
              }}
            >
              <TiltCard
                tiltIntensity={0.3}
                rotateXRange={[-8, 8]}
                rotateYRange={[-8, 8]}
                scaleOnHover={1.01}
                glare
                glareOpacity={0.2}
                perspective={1200}
              >
                <div
                  className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border shadow-2xl"
                  style={{
                    backgroundColor: `${bgColor}40`,
                    borderColor: `${textColor}20`,
                    boxShadow: `0 25px 50px -12px ${textColor}30`,
                  }}
                >
                  {/* Inner glow */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 60px ${accentColor}15`,
                    }}
                  />

                  {/* Image */}
                  {renderImage ? (
                    renderImage({
                      src: appPreviewImage,
                      sectionId: section.id,
                      field: isDarkBg
                        ? "appPreviewImageLight"
                        : "appPreviewImageDark",
                      className: "w-full h-auto relative z-10",
                      alt: "App Preview",
                    })
                  ) : (
                    <img
                      src={appPreviewImage}
                      alt="App Preview"
                      className="w-full h-auto relative z-10"
                    />
                  )}

                  {/* Bottom gradient fade */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-20"
                    style={{
                      background: `linear-gradient(to top, ${bgColor}, transparent)`,
                    }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          )}
        </div>
      </section>

      {/* Brand Logo Cloud */}
      {content.brands && content.brands.length > 0 && (
        <section className="pb-16 md:pb-24" style={{ backgroundColor: bgColor }}>
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p
                className="text-center text-xs tracking-widest uppercase mb-8"
                style={{ color: `${textColor}60`, fontFamily: bodyFont }}
              >
                Trusted by leading teams
              </p>
              <BrandMarquee
                brands={content.brands}
                textColor={textColor}
                bgColor={bgColor}
                headingFont={headingFont}
              />
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
}
