"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import { SectionBackground } from "../../SectionBackground";

export default function HeroSalesFunnel({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
  renderImage,
  renderButton,
}: BaseSectionProps) {
  const { content } = section;

  // Extract colors and fonts
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Extract padding
  const paddingTop = content.paddingTop ?? 20;
  const paddingBottom = content.paddingBottom ?? 20;

  // Badge icon rendering helper
  const renderBadgeIcon = () => {
    const iconColor = accentColor;

    if (content.badgeIcon === "checkmark" || !content.badgeIcon) {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (content.badgeIcon === "shield") {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    } else if (content.badgeIcon === "star") {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill={iconColor} stroke={iconColor} strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: `${paddingTop * 4}px`,
        paddingBottom: `${paddingBottom * 4}px`,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${getContentWidthClass(contentWidth)} mx-auto text-center`}>

          {/* Top Title */}
          {content.topTitle && (
            <motion.div
              className="mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderText ? (
                renderText({
                  value: content.topTitle,
                  sectionId: section.id,
                  field: "topTitle",
                  className: "text-xs sm:text-sm md:text-base",
                  style: {
                    color: textColor,
                    fontFamily: bodyFont,
                    opacity: 0.8
                  },
                })
              ) : (
                <p className="text-xs sm:text-sm md:text-base" style={{ color: textColor, fontFamily: bodyFont, opacity: 0.8 }}>
                  {content.topTitle}
                </p>
              )}
            </motion.div>
          )}

          {/* Main Headline */}
          {content.heading && (
            <motion.div
              className="mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: textColor, fontFamily: headingFont }}>
                  {content.heading}
                </h1>
              )}
            </motion.div>
          )}

          {/* Subheading */}
          {content.subheading && (
            <motion.div
              className="mb-6 sm:mb-8 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {renderText ? (
                renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  className: "text-base sm:text-lg md:text-xl",
                  style: {
                    color: textColor,
                    fontFamily: bodyFont,
                    opacity: 0.9
                  },
                })
              ) : (
                <p className="text-base sm:text-lg md:text-xl" style={{ color: textColor, fontFamily: bodyFont, opacity: 0.9 }}>
                  {content.subheading}
                </p>
              )}
            </motion.div>
          )}

          {/* Product Image */}
          {content.showImage !== false && content.imageUrl && (
            <motion.div
              className="mb-6 sm:mb-8 md:mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {renderImage ? (
                renderImage({
                  src: content.imageUrl,
                  sectionId: section.id,
                  field: "imageUrl",
                  className: "w-full max-w-2xl mx-auto rounded-lg",
                  alt: "Product",
                })
              ) : (
                <img
                  src={content.imageUrl}
                  alt="Product"
                  className="w-full max-w-2xl mx-auto rounded-lg"
                />
              )}
            </motion.div>
          )}

          {/* CTA Button */}
          {content.ctaText && (
            <motion.div
              className="mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {renderButton ? (
                renderButton({
                  text: content.ctaText,
                  url: content.ctaUrl || "#",
                  sectionId: section.id,
                  field: "ctaText",
                  className: "inline-block px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow",
                  style: {
                    backgroundColor: accentColor,
                    color: bgColor,
                    fontFamily: headingFont,
                  },
                })
              ) : (
                <a
                  href={content.ctaUrl || "#"}
                  className="inline-block px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: accentColor,
                    color: bgColor,
                    fontFamily: headingFont,
                  }}
                >
                  {content.ctaText}
                </a>
              )}
            </motion.div>
          )}

          {/* Secondary CTA Text (Price) */}
          {content.ctaSecondaryText && (
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {renderText ? (
                renderText({
                  value: content.ctaSecondaryText,
                  sectionId: section.id,
                  field: "ctaSecondaryText",
                  className: "text-xs sm:text-sm md:text-base",
                  style: {
                    color: textColor,
                    fontFamily: bodyFont,
                    opacity: 0.8
                  },
                })
              ) : (
                <p className="text-xs sm:text-sm md:text-base" style={{ color: textColor, fontFamily: bodyFont, opacity: 0.8 }}>
                  {content.ctaSecondaryText}
                </p>
              )}
            </motion.div>
          )}

          {/* Badge */}
          {content.showBadge !== false && content.badge && (
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                {content.badgeIcon !== "none" && (
                  <span>
                    {renderBadgeIcon()}
                  </span>
                )}
                {renderText ? (
                  renderText({
                    value: content.badge,
                    sectionId: section.id,
                    field: "badge",
                    className: "text-xs sm:text-sm font-semibold uppercase tracking-wider",
                    style: { color: textColor, fontFamily: bodyFont },
                  })
                ) : (
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: textColor, fontFamily: bodyFont }}>
                    {content.badge}
                  </span>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
