"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";

// Simple icon component for step numbers
function StepIcon({ icon, accentColor }: { icon?: string; accentColor: string }) {
  // If icon is a number or number string, just display it
  if (!icon) return null;

  // Try to render as an icon from a common set
  const iconMap: Record<string, React.ReactNode> = {
    "1": <span>01</span>,
    "2": <span>02</span>,
    "3": <span>03</span>,
    "star": (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    "check": (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    "rocket": (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  };

  const iconContent = iconMap[icon.toLowerCase()] || <span style={{ color: accentColor }}>{icon}</span>;

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
    >
      {iconContent}
    </div>
  );
}

export default function ProcessSectionBase({
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

  const DEFAULT_PADDING = { top: 80, bottom: 128 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} />
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
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
              {renderText ? renderText({ value: content.badge, sectionId: section.id, field: "badge", className: "" }) : content.badge}
            </span>
          )}
          {content.showHeading !== false && content.heading && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              {renderText ? renderText({ value: content.heading, sectionId: section.id, field: "heading", className: "" }) : content.heading}
            </h2>
          )}
          {content.showSubheading !== false && content.subheading && (
            <span
              className="block mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}70`, fontFamily: bodyFont }}
            >
              {renderText ? renderText({ value: content.subheading, sectionId: section.id, field: "subheading", className: "" }) : content.subheading}
            </span>
          )}
        </motion.div>

        {/* Process Steps */}
        {content.showItems !== false && items && items.length > 0 ? (
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px hidden sm:block"
              style={{ backgroundColor: `${textColor}10` }}
            />

            <div className="space-y-12 lg:space-y-24">
              {items.map((item: SectionItem, index: number) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={item.id}
                    className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Step number circle */}
                    <motion.div
                      className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 z-10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                        style={{
                          backgroundColor: primaryColor,
                          color: bgColor,
                          fontFamily: headingFont,
                          boxShadow: `0 0 40px ${primaryColor}40`,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className={`flex-1 pl-24 lg:pl-0 ${isEven ? "lg:pr-24 lg:text-right" : "lg:pl-24 lg:text-left"}`}>
                      <motion.div
                        className="p-8 rounded-2xl"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                        whileHover={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          borderColor: `${accentColor}20`,
                        }}
                      >
                        {/* Icon */}
                        {item.icon && (
                          <div className={`mb-4 ${isEven ? "lg:ml-auto lg:mr-0" : ""}`}>
                            <StepIcon icon={item.icon} accentColor={accentColor} />
                          </div>
                        )}

                        <h3
                          className="text-xl font-semibold mb-3"
                          style={{ color: textColor, fontFamily: headingFont }}
                        >
                          {renderText ? renderText({ value: item.title || "", sectionId: section.id, field: "title", itemId: item.id, className: "" }) : item.title}
                        </h3>

                        <span
                          className="block text-base leading-relaxed"
                          style={{ color: `${textColor}70`, fontFamily: bodyFont }}
                        >
                          {renderText ? renderText({ value: item.description || "", sectionId: section.id, field: "description", itemId: item.id, className: "" }) : item.description}
                        </span>
                      </motion.div>
                    </div>

                    {/* Empty space for other side */}
                    <div className="hidden lg:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
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
            <p className="opacity-50">Add process steps in the properties panel</p>
          </motion.div>
        )}

        {/* CTA at the end */}
        {content.buttonText && (
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <SectionButton
              text={content.buttonText || ""}
              link={content.buttonLink || "#"}
              sectionId={section.id}
              {...getButtonPropsFromContent(content)}
              sectionBgColor={bgColor}
              primaryColor={primaryColor}
              accentColor={accentColor}
              schemeTextColor={textColor}
              bodyFont={bodyFont}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
