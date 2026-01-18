"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { BrandMarquee } from "../primitives/BrandMarquee";
import { VideoWithControls } from "../primitives/VideoWithControls";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";

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

  const DEFAULT_PADDING = { top: 48, bottom: 48 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 md:space-y-6">
          {/* Badge */}
          {content.showBadge !== false && content.badge && (
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
          )}

          {/* Headline */}
          {content.showHeading !== false && (
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
          )}

          {/* Subheading */}
          {content.showSubheading !== false && content.subheading && (
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
          )}

          {/* Video */}
          {content.showVideo !== false && content.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <VideoWithControls videoUrl={content.videoUrl} accentColor={accentColor} />
            </motion.div>
          )}

          {/* Image fallback if no video */}
          {content.showImage !== false && !content.videoUrl && content.imageUrl && (
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
        {content.showButton !== false && content.buttonText && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
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
          </motion.div>
        )}
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
