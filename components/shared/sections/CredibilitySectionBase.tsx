"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";

export default function CredibilitySectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;
  const overlayOpacity = content.overlayOpacity ?? 0.7;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Image */}
      {content.backgroundImage && (
        <div className="absolute inset-0">
          {renderImage ? (
            renderImage({
              src: content.backgroundImage,
              sectionId: section.id,
              field: "backgroundImage",
              className: "w-full h-full object-cover",
              alt: "",
            })
          ) : (
            <img
              src={content.backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          {/* Multiple gradient overlays for depth */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${bgColor}${Math.round((overlayOpacity + 0.2) * 255).toString(16).padStart(2, '0')}, ${bgColor}${Math.round(overlayOpacity * 0.5 * 255).toString(16).padStart(2, '0')})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${bgColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, '0')}, transparent 50%, ${bgColor}${Math.round(overlayOpacity * 0.5 * 255).toString(16).padStart(2, '0')})`,
            }}
          />
        </div>
      )}

      {/* Content Card */}
      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          className="relative rounded-3xl p-8 lg:p-12 text-center"
          style={{
            backgroundColor: `${bgColor}99`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${textColor}14`,
          }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow effect behind card */}
          <div
            className="absolute -inset-4 rounded-3xl blur-2xl opacity-30 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative">
            {/* Heading */}
            {content.heading && (
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6"
                style={{ color: textColor, fontFamily: headingFont }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {renderText ? (
                  renderText({
                    value: content.heading,
                    sectionId: section.id,
                    field: "heading",
                    className: "",
                  })
                ) : (
                  content.heading
                )}
              </motion.h2>
            )}

            {/* Subheading */}
            {content.subheading && (
              <motion.div
                className="text-lg sm:text-xl mb-4"
                style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {renderText ? (
                  renderText({
                    value: content.subheading,
                    sectionId: section.id,
                    field: "subheading",
                    className: "",
                  })
                ) : (
                  content.subheading
                )}
              </motion.div>
            )}

            {/* Body Text */}
            {content.bodyText && (
              <motion.div
                className="text-base max-w-xl mx-auto mb-8"
                style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {renderText ? (
                  renderText({
                    value: content.bodyText,
                    sectionId: section.id,
                    field: "bodyText",
                    className: "",
                  })
                ) : (
                  content.bodyText
                )}
              </motion.div>
            )}

            {/* CTA Button with price toggle animation */}
            {content.buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a
                  href={content.buttonLink || "#"}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wide overflow-hidden"
                  style={{
                    backgroundColor: primaryColor,
                    color: bgColor,
                    fontFamily: bodyFont,
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Main text - slides up on hover */}
                  <span
                    className="inline-flex items-center gap-2 transition-transform duration-300"
                    style={{
                      transform: isHovered ? "translateY(-100%)" : "translateY(0)",
                    }}
                  >
                    {content.buttonText}
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>

                  {/* Price text - slides up from below on hover */}
                  {content.priceYearly && (
                    <span
                      className="absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-300"
                      style={{
                        transform: isHovered ? "translateY(0)" : "translateY(100%)",
                      }}
                    >
                      {content.priceYearly}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  )}
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
