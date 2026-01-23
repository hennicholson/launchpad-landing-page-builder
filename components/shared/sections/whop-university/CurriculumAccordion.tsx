"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { DrawCheckmark } from "./primitives/DrawCheckmark";
import { useEditorStore } from "@/lib/store";

/**
 * Curriculum Accordion Section
 * Large product image with expandable module accordions
 * Shows what's inside the course with smooth animations
 */
export function CurriculumAccordion({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Editor state for item selection
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

  // Calculate total lessons/content
  const totalLessons = items.reduce((acc, item) => {
    return acc + (item.lessons?.length || item.features?.length || 0);
  }, 0);

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
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 50%, ${accentColor}30 0%, transparent 70%)`,
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
                  value: content.heading || "What's Inside",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "What's Inside"}
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
                    multiline: true,
                    inline: true,
                  })
                : content.subheading}
            </p>
          )}

          {/* Progress indicator */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <span style={{ color: accentColor }}>📚</span>
              </div>
              <div className="text-left">
                <p
                  className="text-2xl font-bold"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {items.length}
                </p>
                <p
                  className="text-sm"
                  style={{ color: `${textColor}60`, fontFamily: bodyFont }}
                >
                  Modules
                </p>
              </div>
            </div>

            <div className="w-px h-12 bg-white/10" />

            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <span style={{ color: accentColor }}>🎯</span>
              </div>
              <div className="text-left">
                <p
                  className="text-2xl font-bold"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {totalLessons}+
                </p>
                <p
                  className="text-sm"
                  style={{ color: `${textColor}60`, fontFamily: bodyFont }}
                >
                  Lessons
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product Image with 3D effect */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                perspective: 1200,
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              {/* Glow behind */}
              <div
                className="absolute -inset-4 blur-3xl opacity-30"
                style={{ backgroundColor: accentColor }}
              />

              {/* Main image container */}
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `0 40px 80px -20px ${accentColor}30`,
                }}
                whileHover={{ rotateX: -3, rotateY: 3 }}
                transition={{ duration: 0.4 }}
              >
                {content.imageUrl ? (
                  renderImage ? (
                    renderImage({
                      src: content.imageUrl,
                      sectionId: section.id,
                      field: "imageUrl",
                      className: "w-full h-auto",
                      alt: content.heading || "Course preview",
                    })
                  ) : (
                    <img
                      src={content.imageUrl}
                      alt={content.heading || "Course preview"}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  )
                ) : (
                  <div
                    className="w-full aspect-[4/3] flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <span style={{ color: accentColor, fontSize: 48 }}>🎓</span>
                  </div>
                )}

                {/* Shine overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "100%", opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
                />
              </motion.div>
            </motion.div>

            {/* Floating feature badges */}
            {content.highlights && content.highlights.length > 0 && (
              <div className="absolute -bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
                {content.highlights.slice(0, 3).map((highlight: string, index: number) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      border: `1px solid ${accentColor}40`,
                      fontFamily: bodyFont,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    {highlight}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Accordion list */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {items.map((module, index) => (
              <AccordionItem
                key={module.id || index}
                module={module}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                textColor={textColor}
                accentColor={accentColor}
                headingFont={headingFont}
                bodyFont={bodyFont}
                isInView={isInView}
                renderText={renderText}
                sectionId={section.id}
                isEditorMode={isEditorMode}
                isSelected={selectedItemId === module.id}
                onSelect={() => {
                  if (isEditorMode) {
                    selectItem(section.id, module.id);
                  }
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Accordion Item
 */
function AccordionItem({
  module,
  index,
  isOpen,
  onToggle,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  isInView,
  renderText,
  sectionId,
  isEditorMode,
  isSelected,
  onSelect,
}: {
  module: any;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  isInView: boolean;
  renderText?: any;
  sectionId: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const lessons = module.lessons || module.features || [];

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${isSelected ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
      style={{
        backgroundColor: isOpen ? `${textColor}08` : `${textColor}05`,
        border: `1px solid ${isSelected ? "#FA4616" : isOpen ? accentColor + "40" : textColor + "10"}`,
        cursor: isEditorMode ? "pointer" : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={(e) => {
        if (isEditorMode && onSelect) {
          // Don't trigger selection if user is selecting text
          if (window.getSelection()?.toString()) return;
          onSelect();
        }
      }}
    >
      {/* Header */}
      <motion.button
        className="w-full flex items-center gap-4 p-4 text-left"
        onClick={onToggle}
        whileHover={{ backgroundColor: `${textColor}05` }}
      >
        {/* Module number/icon */}
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: isOpen ? accentColor : `${accentColor}20`,
            color: isOpen ? "#FFFFFF" : accentColor,
          }}
          animate={isOpen ? {
            boxShadow: `0 0 20px ${accentColor}40`,
          } : {
            boxShadow: "none",
          }}
        >
          {module.icon || (
            <span className="text-sm font-bold" style={{ fontFamily: headingFont }}>
              {(index + 1).toString().padStart(2, "0")}
            </span>
          )}
        </motion.div>

        {/* Title and meta */}
        <div className="flex-1 min-w-0">
          <h4
            className="font-semibold truncate"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText
              ? renderText({
                  value: module.title || "",
                  sectionId,
                  field: "title",
                  itemId: module.id,
                  inline: true,
                })
              : module.title}
          </h4>
          {module.duration && (
            <p
              className="text-sm"
              style={{ color: `${textColor}60`, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: module.duration,
                    sectionId,
                    field: "duration",
                    itemId: module.id,
                    inline: true,
                  })
                : module.duration}
            </p>
          )}
        </div>

        {/* Expand icon */}
        <motion.div
          className="w-6 h-6 flex items-center justify-center"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{ color: `${textColor}60` }}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4">
              {/* Description */}
              {module.description && (
                <p
                  className="text-sm mb-4 pl-14"
                  style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                >
                  {renderText
                    ? renderText({
                        value: module.description,
                        sectionId,
                        field: "description",
                        itemId: module.id,
                        multiline: true,
                        inline: true,
                      })
                    : module.description}
                </p>
              )}

              {/* Lessons list */}
              {lessons.length > 0 && (
                <ul className="space-y-2 pl-14">
                  {lessons.map((lesson: string, lessonIndex: number) => (
                    <motion.li
                      key={lessonIndex}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                    >
                      <DrawCheckmark
                        size={16}
                        color={accentColor}
                        delay={lessonIndex * 0.05}
                      />
                      <span
                        className="text-sm"
                        style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                      >
                        {lesson}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
