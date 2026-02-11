"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";

export default function PricingSectionBase({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get the first pricing item
  const pricingItem = items?.[0];

  const DEFAULT_PADDING = { top: 96, bottom: 128 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accentColor}05, transparent)`,
        }}
      />

      <div className={`relative ${getContentWidthClass(contentWidth)} mx-auto px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          {/* Badge */}
          {content.showBadge !== false && content.badge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
                style={{
                  borderColor: `${accentColor}33`,
                  backgroundColor: `${accentColor}0d`,
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  style={{ color: accentColor }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accentColor }}
                >
                  {renderText ? (
                    renderText({
                      value: content.badge,
                      sectionId: section.id,
                      field: "badge",
                      className: "",
                    })
                  ) : (
                    content.badge
                  )}
                </span>
              </div>
            </motion.div>
          )}

          {/* Heading */}
          {content.showHeading !== false && content.heading && (
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-4"
              style={{ color: textColor, fontFamily: headingFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
          {content.showSubheading !== false && content.subheading && (
            <motion.div
              className="text-base max-w-lg mx-auto"
              style={{ color: `${textColor}80`, fontFamily: bodyFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
        </div>

        {/* Pricing Card */}
        {content.showItems !== false && pricingItem && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Card glow */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-500"
              style={{
                backgroundColor: `${accentColor}08`,
                opacity: isHovered ? 1 : 0.5,
              }}
            />

            <div
              className="relative rounded-2xl p-8 lg:p-10 overflow-hidden"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Annual badge */}
              <div className="absolute top-6 right-6">
                <span
                  className="text-[9px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: `${accentColor}99` }}
                >
                  Annual
                </span>
              </div>

              {/* Title */}
              {pricingItem.title && (
                <h3
                  className="text-xl uppercase tracking-wide mb-4"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {renderText ? (
                    renderText({
                      value: pricingItem.title,
                      sectionId: section.id,
                      field: "title",
                      itemId: pricingItem.id,
                      className: "",
                    })
                  ) : (
                    pricingItem.title
                  )}
                </h3>
              )}

              {/* Price */}
              {pricingItem.price && (
                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className="text-5xl sm:text-6xl lg:text-7xl"
                    style={{ color: textColor, fontFamily: headingFont }}
                  >
                    {pricingItem.price.replace(/\/.*$/, "")}
                  </span>
                  <span style={{ color: `${textColor}66`, fontFamily: bodyFont }} className="text-lg">
                    {pricingItem.price.includes("/")
                      ? "/" + pricingItem.price.split("/")[1]
                      : ""}
                  </span>
                </div>
              )}

              {/* Description */}
              {pricingItem.description && (
                <span className="block text-sm mb-8" style={{ color: `${textColor}80`, fontFamily: bodyFont }}>
                  {renderText ? (
                    renderText({
                      value: pricingItem.description,
                      sectionId: section.id,
                      field: "description",
                      itemId: pricingItem.id,
                      className: "",
                    })
                  ) : (
                    pricingItem.description
                  )}
                </span>
              )}

              {/* CTA Button */}
              {content.showButton !== false && content.buttonText && (
                <SectionButton
                  text={content.buttonText || "Get Access Now"}
                  link={content.buttonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  className="w-full justify-center"
                />
              )}

              {/* Divider */}
              {content.showFeatures !== false && pricingItem.features && pricingItem.features.length > 0 && (
                <div
                  className="my-8 h-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                />
              )}

              {/* Features */}
              {content.showFeatures !== false && pricingItem.features && pricingItem.features.length > 0 && (
                <ul className="space-y-4">
                  {pricingItem.features.map((feature: string, i: number) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${accentColor}1a` }}
                      >
                        <svg
                          className="w-3 h-3"
                          style={{ color: accentColor }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: `${textColor}99` }}
                      >
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {(!items || items.length === 0) && (
          <div
            className="text-center py-12 opacity-50"
            style={{ color: textColor }}
          >
            Add a pricing plan in the properties panel
          </div>
        )}
      </div>
    </section>
  );
}
