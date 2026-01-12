"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { BrandMarquee } from "../primitives/BrandMarquee";
import { VideoWithControls } from "../primitives/VideoWithControls";

export default function HeroSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  return (
    <section
      className="relative"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="text-center space-y-4 md:space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase border rounded-full backdrop-blur-sm"
              style={{
                color: `${textColor}80`,
                borderColor: `${textColor}1a`,
                backgroundColor: `${textColor}0d`,
                fontFamily: bodyFont,
              }}
            >
              <svg className="w-3 h-3" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              {renderText ? (
                renderText({
                  value: content.badge || "",
                  sectionId: section.id,
                  field: "badge",
                  className: "text-inherit",
                })
              ) : (
                content.badge
              )}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]"
            style={{ fontFamily: headingFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span style={{ color: textColor }}>
              {renderText ? (
                renderText({
                  value: content.heading || "",
                  sectionId: section.id,
                  field: "heading",
                  className: "text-3xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                content.heading
              )}
            </span>
            <br />
            <span style={{ color: accentColor }}>
              {renderText ? (
                renderText({
                  value: content.accentHeading || "",
                  sectionId: section.id,
                  field: "accentHeading",
                  className: "text-3xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]",
                  style: { color: accentColor, fontFamily: headingFont },
                })
              ) : (
                content.accentHeading
              )}
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.div
            className="text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-4 sm:px-0"
            style={{ fontFamily: bodyFont, color: `${textColor}80` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {renderText ? (
              renderText({
                value: content.subheading || "",
                sectionId: section.id,
                field: "subheading",
                multiline: true,
                className: "text-sm sm:text-base lg:text-lg leading-relaxed",
                style: { color: `${textColor}80`, fontFamily: bodyFont },
              })
            ) : (
              content.subheading
            )}
          </motion.div>

          {/* Video */}
          {content.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <VideoWithControls videoUrl={content.videoUrl} accentColor={accentColor} />
            </motion.div>
          )}

          {/* Image fallback if no video */}
          {!content.videoUrl && content.imageUrl && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {renderImage ? (
                renderImage({
                  src: content.imageUrl,
                  sectionId: section.id,
                  field: "imageUrl",
                  className: "rounded-2xl md:rounded-3xl shadow-2xl max-w-full mx-auto",
                  alt: "Hero",
                })
              ) : (
                <img
                  src={content.imageUrl}
                  alt="Hero"
                  className="rounded-2xl md:rounded-3xl shadow-2xl max-w-full mx-auto"
                />
              )}
            </motion.div>
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a
            href={content.buttonLink || "#"}
            className="group relative inline-flex items-center"
          >
            {/* Button glow */}
            <div
              className="absolute -inset-1 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(to right, ${primaryColor}33, ${primaryColor}1a, ${primaryColor}33)` }}
            />

            {/* Button */}
            <div
              className="relative flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-full border group-hover:border-opacity-30 transition-all duration-300"
              style={{
                backgroundColor: bgColor,
                borderColor: `${primaryColor}4d`
              }}
            >
              <span
                className="text-xs sm:text-sm font-medium tracking-wide"
                style={{ color: `${textColor}b3`, fontFamily: bodyFont }}
              >
                {renderText ? (
                  renderText({
                    value: content.buttonText || "",
                    sectionId: section.id,
                    field: "buttonText",
                    className: "text-xs sm:text-sm font-medium tracking-wide",
                    style: { color: `${textColor}b3`, fontFamily: bodyFont },
                  })
                ) : (
                  content.buttonText
                )}
              </span>
              <div
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: primaryColor }}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: bgColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>
        </motion.div>
      </div>

      {/* Brand Marquee */}
      {content.brands && content.brands.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p
            className="text-center text-[10px] tracking-[0.2em] uppercase mb-3"
            style={{ color: `${textColor}4d`, fontFamily: bodyFont }}
          >
            Trusted by leading brands
          </p>
          <BrandMarquee brands={content.brands} textColor={textColor} bgColor={bgColor} headingFont={headingFont} />
        </motion.div>
      )}
    </section>
  );
}
