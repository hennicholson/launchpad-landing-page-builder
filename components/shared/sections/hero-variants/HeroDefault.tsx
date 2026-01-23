"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { BrandMarquee } from "../../primitives/BrandMarquee";
import { VideoWithControls } from "../../primitives/VideoWithControls";
import SectionButton, { getButtonPropsFromContent } from "../SectionButton";
import { SectionBackground } from "../../SectionBackground";
import {
  MagneticButton,
  SpotlightCursor,
  AnimatedMesh,
  FloatingElements,
  TiltCard,
} from "../../primitives";

/**
 * HeroDefault - Premium Spotlight Design
 *
 * A world-class hero section featuring:
 * - Layered depth with multiple background effects
 * - Glass morphism badges with magnetic interactions
 * - Orchestrated staggered animations
 * - 3D tilt effects on media
 * - Corner accent borders
 * - Smooth 60fps animations
 */
export default function HeroDefault({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 80, bottom: 80 };

  // Animation timeline delays (orchestrated)
  const ANIMATION_DELAYS = {
    badge: 0,
    heading: 0.2,
    subheading: 0.5,
    cta: 0.7,
    media: 0.9,
    marquee: 1.2,
  };

  // Button hover state for glow effect
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* ============================================
          LAYER 1: Base Section Background Effect
          ============================================ */}
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />

      {/* ============================================
          LAYER 2: Animated Mesh Gradient
          Organic flowing colors for depth
          ============================================ */}
      <AnimatedMesh
        colors={[accentColor, `${primaryColor}80`, `${accentColor}60`]}
        speed={0.8}
        opacity={0.08}
        morphIntensity={0.4}
      />

      {/* ============================================
          LAYER 3: Floating Particles
          Subtle ambient animation
          ============================================ */}
      <FloatingElements count={20} speed={0.5} direction="random" spread={200}>
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: `${accentColor}30`,
            boxShadow: `0 0 10px ${accentColor}20`,
          }}
        />
      </FloatingElements>

      {/* ============================================
          LAYER 4: Radial Glow Overlays
          Creates depth and focal points
          ============================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left glow */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ backgroundColor: `${accentColor}08` }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ backgroundColor: `${primaryColor}06` }}
        />
        {/* Center subtle glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{ backgroundColor: `${accentColor}04` }}
        />
      </div>

      {/* ============================================
          LAYER 5: Spotlight Cursor Effect
          Follows mouse within section bounds
          ============================================ */}
      <SpotlightCursor
        size={600}
        color={accentColor}
        intensity={0.12}
        blur={120}
        followSpeed={100}
      />

      {/* ============================================
          Corner Accent Borders
          Subtle design flourish
          ============================================ */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-20">
        <div
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{
            background: `linear-gradient(to right, ${accentColor}50, transparent)`,
          }}
        />
        <div
          className="absolute top-0 left-0 w-[1px] h-full"
          style={{
            background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-20 rotate-180">
        <div
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{
            background: `linear-gradient(to right, ${accentColor}50, transparent)`,
          }}
        />
        <div
          className="absolute top-0 left-0 w-[1px] h-full"
          style={{
            background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
          }}
        />
      </div>

      {/* ============================================
          MAIN CONTENT CONTAINER
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 md:space-y-8">
          {/* ============================================
              BADGE - Glass Morphism with Magnetic Effect
              ============================================ */}
          {content.showBadge !== false && content.badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: ANIMATION_DELAYS.badge,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="inline-block"
            >
              <MagneticButton strength={0.3} radius={120}>
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer hover:shadow-lg group"
                  style={{
                    backgroundColor: `${textColor}05`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `${accentColor}30`,
                    boxShadow: `0 0 0 0 ${accentColor}00`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${accentColor}20`;
                    e.currentTarget.style.borderColor = `${accentColor}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 0 ${accentColor}00`;
                    e.currentTarget.style.borderColor = `${accentColor}30`;
                  }}
                >
                  {/* Sparkle Icon */}
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                    style={{ color: accentColor }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase"
                    style={{
                      color: textColor,
                      opacity: 0.85,
                      fontFamily: bodyFont,
                    }}
                  >
                    {renderText
                      ? renderText({
                          value: content.badge || "",
                          sectionId: section.id,
                          field: "badge",
                          className: "text-inherit",
                        })
                      : content.badge}
                  </span>
                </div>
              </MagneticButton>
            </motion.div>
          )}

          {/* ============================================
              HEADING - Character Reveal with Gradient
              ============================================ */}
          {content.showHeading !== false && (
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight"
              style={{ fontFamily: headingFont, color: textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: ANIMATION_DELAYS.heading }}
            >
              {renderText ? (
                renderText({
                  value: content.heading || "",
                  sectionId: section.id,
                  field: "heading",
                  className: "text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                content.heading || ""
              )}

              {/* Accent Heading (if provided) */}
              {content.accentHeading && (
                <>
                  <br />
                  <span
                    style={{ color: accentColor }}
                    className="relative inline-block"
                  >
                    {renderText ? (
                      renderText({
                        value: content.accentHeading,
                        sectionId: section.id,
                        field: "accentHeading",
                        className: "text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight",
                        style: { color: accentColor, fontFamily: headingFont },
                      })
                    ) : (
                      content.accentHeading
                    )}
                    {/* Subtle underline glow */}
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: ANIMATION_DELAYS.heading + 0.5,
                        ease: "easeOut",
                      }}
                    />
                  </span>
                </>
              )}
            </motion.h1>
          )}

          {/* ============================================
              SUBHEADING - Fade Up Animation
              ============================================ */}
          {content.showSubheading !== false && content.subheading && (
            <motion.p
              className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 text-center"
              style={{
                fontFamily: bodyFont,
                color: `${textColor}cc`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: ANIMATION_DELAYS.subheading,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {renderText
                ? renderText({
                    value: content.subheading || "",
                    sectionId: section.id,
                    field: "subheading",
                    multiline: true,
                    className:
                      "text-base sm:text-lg lg:text-xl leading-relaxed text-center",
                    style: { color: `${textColor}cc`, fontFamily: bodyFont },
                  })
                : content.subheading}
            </motion.p>
          )}

          {/* ============================================
              CTA BUTTON - Magnetic with Glow Effect
              ============================================ */}
          {content.showButton !== false && content.buttonText && (
            <motion.div
              className="flex justify-center pt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: ANIMATION_DELAYS.cta,
              }}
            >
              <MagneticButton
                strength={0.5}
                radius={150}
                speed={200}
                damping={20}
              >
                <div className="relative">
                  {/* Ambient glow behind button */}
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-xl transition-opacity duration-300"
                    style={{
                      backgroundColor: accentColor,
                      opacity: isButtonHovered ? 0.4 : 0.2,
                    }}
                  />
                  <div
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                  >
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
                  </div>
                </div>
              </MagneticButton>
            </motion.div>
          )}

          {/* ============================================
              MEDIA - 3D Tilt Card with Video/Image
              ============================================ */}
          {((content.showVideo !== false && content.videoUrl) ||
            (content.showImage !== false &&
              !content.videoUrl &&
              content.imageUrl)) && (
            <motion.div
              className="mt-12 md:mt-16 lg:mt-20"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: ANIMATION_DELAYS.media,
              }}
            >
              <TiltCard
                tiltIntensity={0.3}
                rotateXRange={[-5, 5]}
                rotateYRange={[-5, 5]}
                scaleOnHover={1.02}
                glare
                glareOpacity={0.15}
                perspective={1200}
              >
                <div
                  className="relative overflow-hidden rounded-2xl md:rounded-3xl"
                  style={{
                    backgroundColor: `${bgColor}20`,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: `${textColor}15`,
                    boxShadow: `0 25px 50px -12px ${accentColor}20, 0 0 0 1px ${textColor}08`,
                  }}
                >
                  {/* Video */}
                  {content.showVideo !== false && content.videoUrl && (
                    <VideoWithControls
                      videoUrl={content.videoUrl}
                      accentColor={accentColor}
                    />
                  )}

                  {/* Image (fallback if no video) */}
                  {content.showImage !== false &&
                    !content.videoUrl &&
                    content.imageUrl && (
                      <div className="relative">
                        {renderImage ? (
                          renderImage({
                            src: content.imageUrl,
                            sectionId: section.id,
                            field: "imageUrl",
                            className: "w-full h-auto object-cover",
                            alt: "Hero",
                          })
                        ) : (
                          <img
                            src={content.imageUrl}
                            alt="Hero"
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </div>
                    )}

                  {/* Gradient overlay at bottom for seamless blend */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                    style={{
                      background: `linear-gradient(to top, ${bgColor}, transparent)`,
                    }}
                  />

                  {/* Subtle inner border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
                    style={{
                      boxShadow: `inset 0 1px 0 0 ${textColor}10`,
                    }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          )}
        </div>
      </div>

      {/* ============================================
          BRAND MARQUEE
          ============================================ */}
      {content.brands && content.brands.length > 0 && (
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: ANIMATION_DELAYS.marquee }}
        >
          {/* "Trusted by" label */}
          <motion.p
            className="text-center text-[10px] tracking-[0.25em] uppercase mb-4"
            style={{
              color: `${textColor}40`,
              fontFamily: bodyFont,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: ANIMATION_DELAYS.marquee }}
          >
            Trusted by leading brands
          </motion.p>

          <BrandMarquee
            brands={content.brands}
            textColor={textColor}
            bgColor={bgColor}
            headingFont={headingFont}
          />
        </motion.div>
      )}

      {/* ============================================
          BOTTOM GRADIENT FADE
          Creates seamless transition to next section
          ============================================ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top, ${bgColor}, transparent)`,
        }}
      />
    </section>
  );
}
