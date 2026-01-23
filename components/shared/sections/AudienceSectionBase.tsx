"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../SectionBackground";

export default function AudienceSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;
  const [hoveredColumn, setHoveredColumn] = useState<"for" | "not" | null>(null);

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const redColor = "#ef4444";

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

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
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${accentColor}05, transparent 50%, ${redColor}05)`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        {content.showHeading !== false && content.heading && (
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] text-center mb-16"
            style={{ color: textColor, fontFamily: headingFont }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* FOR Column */}
          {content.showForItems !== false && content.forItems && content.forItems.length > 0 && (
          <motion.div
            className="relative rounded-2xl p-6 lg:p-8 transition-all duration-300"
            style={{
              backgroundColor: `${textColor}05`,
              border: `1px solid ${hoveredColumn === "for" ? `${accentColor}33` : `${textColor}0d`}`,
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onMouseEnter={() => setHoveredColumn("for")}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: hoveredColumn === "for" ? accentColor : `${accentColor}1a`,
                }}
              >
                <svg
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: hoveredColumn === "for" ? "#0a0a0a" : accentColor }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                className="text-lg uppercase tracking-wide"
                style={{ color: accentColor, fontFamily: headingFont }}
              >
                {content.forHeading || "This Is For You If..."}
              </h3>
            </div>

            {/* FOR Items */}
            <ul className="space-y-4">
              {content.forItems?.map((item: string, index: number) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: hoveredColumn === "for" ? accentColor : `${accentColor}66` }}
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: `${textColor}99`, fontFamily: bodyFont }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: `${accentColor}02`,
                opacity: hoveredColumn === "for" ? 1 : 0,
              }}
            />
          </motion.div>
          )}

          {/* NOT FOR Column */}
          {content.showNotForItems !== false && content.notForItems && content.notForItems.length > 0 && (
          <motion.div
            className="relative rounded-2xl p-6 lg:p-8 transition-all duration-300"
            style={{
              backgroundColor: `${textColor}05`,
              border: `1px solid ${hoveredColumn === "not" ? `${redColor}33` : `${textColor}0d`}`,
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onMouseEnter={() => setHoveredColumn("not")}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {/* Column Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{
                  backgroundColor: hoveredColumn === "not" ? redColor : `${redColor}1a`,
                }}
              >
                <svg
                  className="w-4 h-4 transition-colors duration-300"
                  style={{ color: hoveredColumn === "not" ? "#ffffff" : redColor }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3
                className="text-lg uppercase tracking-wide"
                style={{ color: redColor, fontFamily: headingFont }}
              >
                {content.notForHeading || "This Is NOT For You If..."}
              </h3>
            </div>

            {/* NOT FOR Items */}
            <ul className="space-y-4">
              {content.notForItems?.map((item: string, index: number) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.05 }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: hoveredColumn === "not" ? redColor : `${redColor}66` }}
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: `${textColor}99`, fontFamily: bodyFont }}
                  >
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
              style={{
                backgroundColor: `${redColor}02`,
                opacity: hoveredColumn === "not" ? 1 : 0,
              }}
            />
          </motion.div>
          )}
        </div>

        {/* Empty state */}
        {(!content.forItems?.length && !content.notForItems?.length) && (
          <div
            className="text-center py-12 opacity-50"
            style={{ color: textColor }}
          >
            Add audience criteria in the properties panel
          </div>
        )}
      </div>
    </section>
  );
}
