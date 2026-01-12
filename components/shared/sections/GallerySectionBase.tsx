"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";

export default function GallerySectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors
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
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
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
              className="block mt-4 text-lg max-w-2xl mx-auto"
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

        {/* Bento Grid Gallery */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {items.map((item: SectionItem, index: number) => {
              // Create varied grid sizes for bento effect
              const isLarge = index === 0 || index === 3;
              const isTall = index === 1 || index === 5;

              return (
                <motion.div
                  key={item.id}
                  className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                    isLarge ? "md:col-span-2 md:row-span-2" : ""
                  } ${isTall ? "row-span-2" : ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {item.imageUrl ? (
                    <>
                      {renderImage ? (
                        renderImage({
                          src: item.imageUrl,
                          sectionId: section.id,
                          field: "imageUrl",
                          itemId: item.id,
                          className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                          alt: item.title || "Gallery image",
                        })
                      ) : (
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Gallery image"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {/* Overlay with title on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        {item.title && (
                          <div>
                            <p
                              className="font-semibold text-lg"
                              style={{ color: "#fff", fontFamily: headingFont }}
                            >
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-sm text-white/70 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ color: `${textColor}30` }}
                    >
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
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
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="opacity-50">Add images in the properties panel</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
