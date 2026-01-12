"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";

export default function FoundersSectionBase({
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
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}08 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {content.subheading && (
            <motion.span
              className="inline-block mb-4 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase border rounded-full"
              style={{
                borderColor: `${accentColor}33`,
                color: accentColor,
                backgroundColor: `${accentColor}0d`,
                fontFamily: bodyFont,
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
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
            </motion.span>
          )}

          {content.heading && (
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]"
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
        </div>

        {/* Founders Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {items.map((founder: SectionItem, index: number) => (
              <motion.div
                key={founder.id}
                className="group relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Image Container */}
                  {founder.imageUrl && (
                    <div className="relative aspect-[2/3] overflow-hidden">
                      {renderImage ? (
                        renderImage({
                          src: founder.imageUrl,
                          sectionId: section.id,
                          field: "imageUrl",
                          itemId: founder.id,
                          className: "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105",
                          alt: founder.title || "Founder",
                        })
                      ) : (
                        <img
                          src={founder.imageUrl}
                          alt={founder.title || "Founder"}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                        />
                      )}
                      {/* Gradient Overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${bgColor}, ${bgColor}66 40%, transparent)`,
                        }}
                      />

                      {/* LinkedIn Button */}
                      {founder.linkedinUrl && (
                        <a
                          href={founder.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            style={{ color: textColor }}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    {/* Label */}
                    {founder.label && (
                      <span
                        className="inline-block mb-2 text-[10px] font-semibold tracking-[0.2em] uppercase"
                        style={{ color: accentColor, fontFamily: bodyFont }}
                      >
                        {founder.label}
                      </span>
                    )}

                    {/* Name */}
                    {founder.title && (
                      <h3
                        className="text-2xl lg:text-3xl uppercase mb-1"
                        style={{ color: textColor, fontFamily: headingFont }}
                      >
                        {renderText ? (
                          renderText({
                            value: founder.title,
                            sectionId: section.id,
                            field: "title",
                            itemId: founder.id,
                            className: "",
                          })
                        ) : (
                          founder.title
                        )}
                      </h3>
                    )}

                    {/* Role */}
                    {founder.role && (
                      <p
                        className="text-sm font-medium mb-3"
                        style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                      >
                        {founder.role}
                      </p>
                    )}

                    {/* Bio */}
                    {founder.bio && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: `${textColor}66`, fontFamily: bodyFont }}
                      >
                        {founder.bio}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 opacity-50"
            style={{ color: textColor }}
          >
            Add team members in the properties panel
          </div>
        )}
      </div>
    </section>
  );
}
