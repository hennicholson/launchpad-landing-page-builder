"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { CountUpNumber, StatCard } from "./primitives/CountUpNumber";
import { useEditorStore } from "@/lib/store";

/**
 * Creator Spotlight Section
 * Features the course creator with parallax image and animated stats
 */
export function CreatorSpotlight({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Editor state
  const { selectItem, selectedItemId } = useEditorStore();

  // Colors
  const bgColor = content.backgroundColor || colorScheme.background || "#141212";
  const textColor = content.textColor || colorScheme.text || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FA4616";

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Parallax for creator image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // First creator from items
  const creator = items[0] || {};

  // Stats data (can come from content or be hardcoded)
  const stats = content.stats || [
    { value: 15000, suffix: "+", label: "Students" },
    { value: 10, prefix: "$", suffix: "M+", label: "Revenue Generated" },
    { value: 50, suffix: "+", label: "Hours of Content" },
  ];

  // Default padding
  const DEFAULT_PADDING = { top: 80, bottom: 128 };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${accentColor}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                fontFamily: bodyFont,
              }}
            >
              {renderText
                ? renderText({
                    value: content.badge,
                    sectionId: section.id,
                    field: "badge",
                    inline: true,
                  })
                : content.badge}
            </span>
          )}

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText
              ? renderText({
                  value: content.heading || "Meet Your Instructor",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "Meet Your Instructor"}
          </h2>

          {content.subheading && (
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}80`, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: content.subheading,
                    sectionId: section.id,
                    field: "subheading",
                    inline: true,
                  })
                : content.subheading}
            </p>
          )}
        </motion.div>

        {/* Creator content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image with parallax */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{ y: imageY }}
            >
              {/* Glow behind image */}
              <div
                className="absolute -inset-4 blur-3xl opacity-30"
                style={{ backgroundColor: accentColor }}
              />

              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                {creator.imageUrl ? (
                  renderImage ? (
                    renderImage({
                      src: creator.imageUrl,
                      sectionId: section.id,
                      field: "items.0.imageUrl",
                      className: "w-full h-full object-cover",
                      alt: creator.title || "Creator",
                    })
                  ) : (
                    <img
                      src={creator.imageUrl}
                      alt={creator.title || "Creator"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <span style={{ color: accentColor, fontSize: 48 }}>+</span>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              {content.credentialBadge && (
                <motion.div
                  className="absolute -bottom-4 -right-4 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    color: "#FFFFFF",
                    fontFamily: bodyFont,
                  }}
                  animate={{
                    y: [0, -5, 0],
                    boxShadow: [
                      `0 10px 30px ${accentColor}40`,
                      `0 15px 40px ${accentColor}60`,
                      `0 10px 30px ${accentColor}40`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {renderText
                    ? renderText({
                        value: content.credentialBadge,
                        sectionId: section.id,
                        field: "credentialBadge",
                      })
                    : content.credentialBadge}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Bio and stats */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Name and role */}
            <div
              className={`cursor-pointer rounded-lg transition-all ${
                selectedItemId === creator.id
                  ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]"
                  : ""
              }`}
              onClick={() => creator.id && selectItem(section.id, creator.id)}
            >
              <h3
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: textColor, fontFamily: headingFont }}
              >
                {renderText
                  ? renderText({
                      value: creator.title || "Creator Name",
                      sectionId: section.id,
                      field: "title",
                      itemId: creator.id,
                      inline: true,
                    })
                  : creator.title || "Creator Name"}
              </h3>
              {creator.role && (
                <p
                  className="text-lg"
                  style={{ color: accentColor, fontFamily: bodyFont }}
                >
                  {renderText
                    ? renderText({
                        value: creator.role,
                        sectionId: section.id,
                        field: "role",
                        itemId: creator.id,
                        inline: true,
                      })
                    : creator.role}
                </p>
              )}
            </div>

            {/* Bio */}
            {creator.description && (
              <p
                className="text-base leading-relaxed"
                style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: creator.description,
                      sectionId: section.id,
                      field: "description",
                      itemId: creator.id,
                      inline: true,
                    })
                  : creator.description}
              </p>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat: any, index: number) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <CountUpNumber
                    value={stat.value}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: textColor }}
                  />
                  <p
                    className="text-sm mt-1"
                    style={{ color: `${textColor}60`, fontFamily: bodyFont }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Credentials list */}
            {content.credentials && content.credentials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {content.credentials.map((credential: string, index: number) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: `${textColor}10`,
                      color: `${textColor}cc`,
                      fontFamily: bodyFont,
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                  >
                    {credential}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
