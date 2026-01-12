"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";

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

  // Get comparison columns from items
  const yourProduct = items?.find(item => item.title?.toLowerCase().includes("you") || item.title?.toLowerCase().includes("us")) || items?.[0];
  const competitor = items?.find(item => item.title?.toLowerCase().includes("other") || item.title?.toLowerCase().includes("them")) || items?.[1];

  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {content.badge && (
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
          {content.heading && (
            <h2
              className="text-4xl sm:text-5xl uppercase leading-[0.95]"
              style={{ color: textColor, fontFamily: headingFont }}
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
            </h2>
          )}
          {content.subheading && (
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}70`, fontFamily: bodyFont }}
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
            </p>
          )}
        </motion.div>

        {/* Comparison Table */}
        {items && items.length >= 2 ? (
          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="text-sm uppercase tracking-wider" style={{ color: `${textColor}50` }}>
                Features
              </div>
              <div className="text-center">
                <span
                  className="inline-block px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: primaryColor,
                    color: bgColor,
                    fontFamily: headingFont,
                  }}
                >
                  {yourProduct?.title || "Us"}
                </span>
              </div>
              <div className="text-center">
                <span
                  className="inline-block px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: `${textColor}60`,
                    fontFamily: headingFont,
                  }}
                >
                  {competitor?.title || "Others"}
                </span>
              </div>
            </div>

            {/* Feature Rows */}
            {yourProduct?.features?.map((feature: string, index: number) => (
              <motion.div
                key={index}
                className="grid grid-cols-3 gap-4 p-6 items-center border-b last:border-b-0"
                style={{ borderColor: "rgba(255,255,255,0.03)" }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                <div
                  className="text-sm"
                  style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                >
                  {feature}
                </div>
                <div className="flex justify-center">
                  <motion.div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}20` }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: accentColor }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </div>
                <div className="flex justify-center">
                  {competitor?.features?.includes(feature) ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: `${textColor}30` }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#ef4444" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16 rounded-2xl"
            style={{
              color: textColor,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="opacity-50">Add two items to compare in the properties panel</p>
            <p className="text-xs opacity-30 mt-2">
              First item: Your product with features list<br />
              Second item: Competitor with their features
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
