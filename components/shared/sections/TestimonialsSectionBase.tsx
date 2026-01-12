"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";
import { ScrollColumn } from "../primitives/ScrollColumn";

export default function TestimonialsSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;

  // Split items into 3 columns
  const column1 = items?.filter((_: SectionItem, i: number) => i % 3 === 0) || [];
  const column2 = items?.filter((_: SectionItem, i: number) => i % 3 === 1) || [];
  const column3 = items?.filter((_: SectionItem, i: number) => i % 3 === 2) || [];

  // Different animation speeds for visual interest
  const speeds = [35, 28, 32];

  return (
    <section
      className="py-20 lg:py-32 overflow-hidden"
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
              className="text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]"
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
              style={{ color: `${textColor}70` }}
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

        {/* 3-Column Scrolling Grid */}
        {items && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1 - scrolls up */}
            {column1.length > 0 && (
              <ScrollColumn
                items={column1}
                speed={speeds[0]}
                textColor={textColor}
                bgColor={bgColor}
                accentColor={accentColor}
                startIndex={0}
                direction="up"
              />
            )}

            {/* Column 2 - scrolls down (opposite direction) */}
            {column2.length > 0 && (
              <div className="hidden md:block">
                <ScrollColumn
                  items={column2}
                  speed={speeds[1]}
                  textColor={textColor}
                  bgColor={bgColor}
                  accentColor={accentColor}
                  startIndex={column1.length}
                  direction="down"
                />
              </div>
            )}

            {/* Column 3 - scrolls up */}
            {column3.length > 0 && (
              <div className="hidden lg:block">
                <ScrollColumn
                  items={column3}
                  speed={speeds[2]}
                  textColor={textColor}
                  bgColor={bgColor}
                  accentColor={accentColor}
                  startIndex={column1.length + column2.length}
                  direction="up"
                />
              </div>
            )}
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
            <p className="opacity-50">Add testimonials in the properties panel</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
