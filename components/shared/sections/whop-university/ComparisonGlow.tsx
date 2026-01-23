"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { DrawCheckmark, DrawXMark } from "./primitives/DrawCheckmark";
import { useEditorStore } from "@/lib/store";

/**
 * Comparison Section with Glowing Effects
 * Two-column before/after layout with animated icons
 * Uses color psychology: red for pain, green for solution
 */
export function ComparisonGlow({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Editor state
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

  // Colors
  const bgColor = content.backgroundColor || colorScheme.background || "#141212";
  const textColor = content.textColor || colorScheme.text || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FA4616";

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Split items into without/with columns (first item = without, second = with)
  const withoutItem = items[0];
  const withItem = items[1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

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
      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(${textColor}40 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
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
                  value: content.heading || "The Difference",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "The Difference"}
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

        {/* Comparison columns */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* WITHOUT column (Pain - Red) */}
          <motion.div
            className={`relative rounded-2xl p-8 overflow-hidden ${isEditorMode ? "cursor-pointer" : ""} ${selectedItemId === withoutItem?.id ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
            onClick={
              isEditorMode && withoutItem?.id
                ? (e) => {
                    e.stopPropagation();
                    selectItem(section.id, withoutItem.id);
                  }
                : undefined
            }
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: "#EF4444" }}
            />

            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "#EF4444", fontFamily: headingFont }}
            >
              <span className="w-3 h-3 rounded-full bg-red-500" />
              {renderText && withoutItem?.id
                ? renderText({
                    value: withoutItem?.title || "Without This",
                    sectionId: section.id,
                    field: "title",
                    itemId: withoutItem.id,
                    inline: true,
                  })
                : withoutItem?.title || "Without This"}
            </h3>

            <motion.ul
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {(withoutItem?.features || []).map((feature: string, index: number) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <DrawXMark
                    size={22}
                    color="#EF4444"
                    delay={index * 0.1}
                  />
                  <span
                    className="text-base"
                    style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                  >
                    {feature}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* WITH column (Solution - Green) */}
          <motion.div
            className={`relative rounded-2xl p-8 overflow-hidden ${isEditorMode ? "cursor-pointer" : ""} ${selectedItemId === withItem?.id ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(16, 185, 129, 0.3)",
            }}
            onClick={
              isEditorMode && withItem?.id
                ? (e) => {
                    e.stopPropagation();
                    selectItem(section.id, withItem.id);
                  }
                : undefined
            }
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: "#E03D10" }}
            />

            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-3"
              style={{ color: "#E03D10", fontFamily: headingFont }}
            >
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              {renderText && withItem?.id
                ? renderText({
                    value: withItem?.title || "With This",
                    sectionId: section.id,
                    field: "title",
                    itemId: withItem.id,
                    inline: true,
                  })
                : withItem?.title || "With This"}
            </h3>

            <motion.ul
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {(withItem?.features || []).map((feature: string, index: number) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  variants={itemVariants}
                >
                  <DrawCheckmark
                    size={22}
                    color="#E03D10"
                    delay={index * 0.1}
                  />
                  <span
                    className="text-base"
                    style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                  >
                    {feature}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Diagonal divider for desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[60%]">
          <motion.div
            className="w-full h-full"
            style={{
              background: `linear-gradient(to bottom, transparent, ${accentColor}40, transparent)`,
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </div>
    </section>
  );
}
