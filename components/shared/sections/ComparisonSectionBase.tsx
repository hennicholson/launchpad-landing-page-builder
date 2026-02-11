"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../SectionBackground";

export default function ComparisonSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get the two comparison cards from items
  const problemCard = items?.[0];
  const solutionCard = items?.[1];

  const DEFAULT_PADDING = { top: 80, bottom: 128 };

  // Helper to determine if background is light
  const isLightBg = (color: string) => {
    if (!color) return false;
    const hex = color.replace('#', '');
    if (hex.length !== 6) return false;
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const isLight = isLightBg(bgColor);
  const cardBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  const cardBorder = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const solutionCardBg = isLight
    ? `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}15 100%)`
    : `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}20 100%)`;

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {content.showBadge !== false && content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
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
          )}
          {content.showHeading !== false && content.heading && (
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                <h2 style={{ color: textColor, fontFamily: headingFont }}>
                  {content.heading}
                </h2>
              )}
            </div>
          )}
          {content.showSubheading !== false && content.subheading && (
            <div className="mt-4 text-base sm:text-lg max-w-2xl mx-auto text-center">
              {renderText ? (
                renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  className: "",
                  style: { color: `${textColor}99`, fontFamily: bodyFont },
                })
              ) : (
                <p style={{ color: `${textColor}99`, fontFamily: bodyFont }}>
                  {content.subheading}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Two Card Layout - using subgrid for aligned content */}
        {content.showItems !== false && items && items.length >= 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" style={{ gridAutoRows: '1fr' }}>
            {/* Problem Card */}
            <motion.div
              className="rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col h-full"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                style={{ backgroundColor: isLight ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.15)" }}
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "#f59e0b" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <div className="mb-2">
                {renderText ? (
                  renderText({
                    value: problemCard?.title || "The Problem",
                    sectionId: section.id,
                    field: "items.0.title",
                    itemId: problemCard?.id,
                    className: "text-xl sm:text-2xl lg:text-3xl font-bold",
                    style: { color: textColor, fontFamily: headingFont },
                  })
                ) : (
                  <h3
                    className="text-xl sm:text-2xl lg:text-3xl font-bold"
                    style={{ color: textColor, fontFamily: headingFont }}
                  >
                    {problemCard?.title || "The Problem"}
                  </h3>
                )}
              </div>

              {/* Subtitle */}
              <div className="mb-6 sm:mb-8">
                {problemCard?.description && (
                  renderText ? (
                    renderText({
                      value: problemCard.description,
                      sectionId: section.id,
                      field: "items.0.description",
                      itemId: problemCard?.id,
                      className: "text-sm",
                      style: { color: `${textColor}70`, fontFamily: bodyFont },
                    })
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: `${textColor}70`, fontFamily: bodyFont }}
                    >
                      {problemCard.description}
                    </p>
                  )
                )}
              </div>

              {/* Section Label */}
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: `${textColor}50` }}
              >
                What's the Problem?
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3 sm:space-y-4 flex-grow">
                {problemCard?.features?.map((feature: string, index: number) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: "#ef4444" }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solution Card */}
            <motion.div
              className="rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col h-full"
              style={{
                background: solutionCardBg,
                border: `1px solid ${accentColor}30`,
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: accentColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>

              {/* Title - fixed height for alignment */}
              <div className="mb-2 min-h-[72px] sm:min-h-[80px]">
                {renderText ? (
                  renderText({
                    value: solutionCard?.title || "The Solution",
                    sectionId: section.id,
                    field: "items.1.title",
                    itemId: solutionCard?.id,
                    className: "text-xl sm:text-2xl lg:text-3xl font-bold",
                    style: { color: textColor, fontFamily: headingFont },
                  })
                ) : (
                  <h3
                    className="text-xl sm:text-2xl lg:text-3xl font-bold"
                    style={{ color: textColor, fontFamily: headingFont }}
                  >
                    {solutionCard?.title || "The Solution"}
                  </h3>
                )}
              </div>

              {/* Subtitle - fixed height for alignment */}
              <div className="mb-6 sm:mb-8 min-h-[24px]">
                {solutionCard?.description && (
                  renderText ? (
                    renderText({
                      value: solutionCard.description,
                      sectionId: section.id,
                      field: "items.1.description",
                      itemId: solutionCard?.id,
                      className: "text-sm",
                      style: { color: `${textColor}70`, fontFamily: bodyFont },
                    })
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: `${textColor}70`, fontFamily: bodyFont }}
                    >
                      {solutionCard.description}
                    </p>
                  )
                )}
              </div>

              {/* Section Label */}
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4"
                style={{ color: `${textColor}50` }}
              >
                What's the Solution?
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3 sm:space-y-4 flex-grow">
                {solutionCard?.features?.map((feature: string, index: number) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: accentColor }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="text-center py-16 rounded-2xl"
            style={{
              color: textColor,
              backgroundColor: cardBg,
              border: `1px dashed ${cardBorder}`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="opacity-50">Add two items to compare in the properties panel</p>
            <p className="text-xs opacity-30 mt-2">
              First item: The problem with features list<br />
              Second item: The solution with features list
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
