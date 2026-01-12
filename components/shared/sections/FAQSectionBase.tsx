"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";

export default function FAQSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8">
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
            <span
              className="block mt-4 text-lg"
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
            </span>
          )}
        </motion.div>

        {/* FAQ Items */}
        {items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item: SectionItem, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: openIndex === index
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.02)",
                    border: `1px solid ${openIndex === index ? `${accentColor}30` : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <motion.button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <span
                      className="font-semibold text-base pr-8"
                      style={{ color: textColor, fontFamily: headingFont }}
                    >
                      {renderText ? (
                        renderText({
                          value: item.title || "",
                          sectionId: section.id,
                          field: "title",
                          itemId: item.id,
                          className: "",
                        })
                      ) : (
                        item.title
                      )}
                    </span>
                    <motion.div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: openIndex === index ? accentColor : "rgba(255,255,255,0.05)",
                      }}
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <svg
                        className="w-4 h-4"
                        style={{
                          color: openIndex === index ? bgColor : textColor,
                        }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.2 },
                        }}
                      >
                        <div
                          className="px-6 pb-5"
                          style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                        >
                          <p className="text-base leading-relaxed">
                            {renderText ? (
                              renderText({
                                value: item.description || "",
                                sectionId: section.id,
                                field: "description",
                                itemId: item.id,
                                className: "",
                              })
                            ) : (
                              item.description
                            )}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
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
            <p className="opacity-50">Add FAQ items in the properties panel</p>
          </motion.div>
        )}

        {/* Optional contact prompt */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p
            className="text-sm"
            style={{ color: `${textColor}50` }}
          >
            Still have questions?{" "}
            <a
              href="#"
              className="font-medium underline underline-offset-4 transition-colors hover:opacity-80"
              style={{ color: accentColor }}
            >
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
