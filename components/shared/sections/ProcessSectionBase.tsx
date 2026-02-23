"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";
import { getContentWidthClass } from "@/lib/page-schema";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { getIconOrFallback } from "@/lib/icons";

// Simple icon component for step numbers
function StepIcon({ icon, accentColor }: { icon?: string; accentColor: string }) {
  if (!icon) return null;

  // Keep numbered steps as inline formatted text
  const numberMap: Record<string, React.ReactNode> = {
    "1": <span>01</span>,
    "2": <span>02</span>,
    "3": <span>03</span>,
  };

  const lowerIcon = icon.toLowerCase();
  const numberContent = numberMap[lowerIcon];

  if (numberContent) {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
      >
        {numberContent}
      </div>
    );
  }

  // For all other icons, use getIconOrFallback to get a proper Lucide component
  const IconComp = getIconOrFallback(lowerIcon);

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
    >
      <IconComp className="w-6 h-6" />
    </div>
  );
}

export default function ProcessSectionBase({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Only enable selection in editor mode (when renderText exists)
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

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
        paddingLeft: content.paddingLeft,
        paddingRight: content.paddingRight,
        '--section-heading-font': `'${headingFont}', sans-serif`,
        '--section-body-font': `'${bodyFont}', sans-serif`,
        fontFamily: `'${bodyFont}', sans-serif`,
      } as React.CSSProperties}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className={`relative ${getContentWidthClass(contentWidth)} mx-auto px-6 lg:px-8`}>
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
                const isSelected = isEditorMode && selectedItemId === item.id;

                const handleClick = (e: React.MouseEvent) => {
                  if (!isEditorMode) return;
                  if (window.getSelection()?.toString()) return;
                  selectItem(section.id, item.id);
                };

                return (
                  <motion.div
                    key={item.id}
                    onClick={isEditorMode ? handleClick : undefined}
                    className={cn(
                      "relative flex flex-col lg:flex-row items-start lg:items-center gap-8",
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse",
                      isEditorMode && "cursor-pointer",
                      isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-2xl"
                    )}
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
