"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";

export default function OfferSectionBase({
  section,
  colorScheme,
  typography,
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

  const offerItem = items?.[0];

  return (
    <section
      id="pricing"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center top, ${accentColor}08 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Badge */}
          {content.badge && (
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
                  style={{ color: accentColor, fontFamily: bodyFont }}
                >
                  {renderText ? renderText({ value: content.badge, sectionId: section.id, field: "badge", className: "" }) : content.badge}
                </span>
              </div>
            </motion.div>
          )}

          {/* Heading */}
          {content.heading && (
            <motion.h2
              className="text-4xl sm:text-5xl uppercase leading-[0.95] mb-4"
              style={{ color: textColor, fontFamily: headingFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {renderText ? renderText({ value: content.heading, sectionId: section.id, field: "heading", className: "" }) : content.heading}
            </motion.h2>
          )}

          {/* Subheading */}
          {content.subheading && (
            <motion.div
              className="text-base max-w-lg mx-auto"
              style={{ color: `${textColor}80`, fontFamily: bodyFont }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {renderText ? renderText({ value: content.subheading, sectionId: section.id, field: "subheading", className: "" }) : content.subheading}
            </motion.div>
          )}
        </div>

        {/* Offer Card */}
        {offerItem && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Card glow */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-500"
              style={{
                backgroundColor: `${accentColor}15`,
                opacity: isHovered ? 1 : 0.5,
              }}
            />

            <div
              className="relative rounded-2xl p-8 lg:p-10 overflow-hidden"
              style={{
                backgroundColor: `${textColor}05`,
                border: `1px solid ${textColor}14`,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Annual badge */}
              <div className="absolute top-6 right-6">
                <span
                  className="text-[9px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: `${accentColor}99`, fontFamily: bodyFont }}
                >
                  Annual
                </span>
              </div>

              {/* Title */}
              {offerItem.title && (
                <h3
                  className="text-xl uppercase tracking-wide mb-4"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {renderText ? renderText({ value: offerItem.title, sectionId: section.id, field: "title", itemId: offerItem.id, className: "" }) : offerItem.title}
                </h3>
              )}

              {/* Price with toggle effect */}
              {offerItem.price && (
                <div className="flex items-baseline gap-2 mb-3">
                  <div className="relative overflow-hidden h-[72px] lg:h-[84px]">
                    <motion.div
                      className="transition-transform duration-300"
                      style={{
                        transform: isHovered && content.priceMonthly
                          ? "translateY(-50%)"
                          : "translateY(0)",
                      }}
                    >
                      {/* Yearly price */}
                      <span
                        className="block text-6xl lg:text-7xl"
                        style={{ color: textColor, fontFamily: headingFont }}
                      >
                        {content.priceYearly?.replace(/\/.*$/, "") || offerItem.price}
                      </span>
                      {/* Monthly price */}
                      {content.priceMonthly && (
                        <span
                          className="block text-6xl lg:text-7xl"
                          style={{ color: textColor, fontFamily: headingFont }}
                        >
                          {content.priceMonthly.replace(/\/.*$/, "")}
                        </span>
                      )}
                    </motion.div>
                  </div>
                  <span style={{ color: `${textColor}66`, fontFamily: bodyFont }} className="text-lg">
                    /{isHovered && content.priceMonthly ? "month" : "year"}
                  </span>
                </div>
              )}

              {/* Description */}
              {offerItem.description && (
                <span className="block text-sm mb-8" style={{ color: `${textColor}80`, fontFamily: bodyFont }}>
                  {renderText ? renderText({ value: offerItem.description, sectionId: section.id, field: "description", itemId: offerItem.id, className: "" }) : offerItem.description}
                </span>
              )}

              {/* CTA Button */}
              <a
                href={content.buttonLink || "#"}
                className="group flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300"
                style={{
                  backgroundColor: primaryColor,
                  color: bgColor,
                  fontFamily: bodyFont,
                  boxShadow: isHovered ? `0 0 40px ${primaryColor}4d` : "none",
                }}
              >
                {content.buttonText || "Get Access Now"}
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
              </a>

              {/* Divider */}
              <div
                className="my-8 h-px"
                style={{ backgroundColor: `${textColor}10` }}
              />

              {/* Features */}
              {offerItem.features && offerItem.features.length > 0 && (
                <ul className="space-y-4">
                  {offerItem.features.map((feature: string, i: number) => (
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
                        style={{ color: `${textColor}99`, fontFamily: bodyFont }}
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
            Add an offer in the properties panel
          </div>
        )}
      </div>
    </section>
  );
}
