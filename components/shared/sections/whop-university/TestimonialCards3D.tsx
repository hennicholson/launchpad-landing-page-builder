"use client";

import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { useEditorStore } from "@/lib/store";

/**
 * Testimonial Cards Section with 3D Effects
 * Features star ratings, lift animations, and quote marks
 */
export function TestimonialCards3D({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(${textColor}40 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Gradient accents */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: accentColor }}
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
                  value: content.heading || "What Students Say",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "What Students Say"}
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
        </motion.div>

        {/* Testimonial cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id || index}
              testimonial={testimonial}
              index={index}
              isInView={isInView}
              textColor={textColor}
              accentColor={accentColor}
              headingFont={headingFont}
              bodyFont={bodyFont}
              renderText={renderText}
              renderImage={renderImage}
              sectionId={section.id}
              isEditorMode={isEditorMode}
              isSelected={selectedItemId === testimonial.id}
              onSelect={() => {
                if (isEditorMode) {
                  selectItem(section.id, testimonial.id);
                }
              }}
            />
          ))}
        </div>

        {/* Trust summary */}
        {content.trustSummary && (
          <motion.div
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Stacked avatars */}
            <div className="flex -space-x-3">
              {items.slice(0, 4).map((t, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 overflow-hidden"
                  style={{ borderColor: bgColor, zIndex: 4 - i }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {t.imageUrl ? (
                    <img
                      src={t.imageUrl}
                      alt={t.name || "Student"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${accentColor}30` }}
                    >
                      <span className="text-xs" style={{ color: accentColor }}>
                        {(t.name || "?")[0]}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <p
              className="text-sm"
              style={{ color: `${textColor}80`, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: content.trustSummary,
                    sectionId: section.id,
                    field: "trustSummary",
                    inline: true,
                  })
                : content.trustSummary}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/**
 * Individual Testimonial Card with 3D lift effect
 */
function TestimonialCard({
  testimonial,
  index,
  isInView,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  renderText,
  renderImage,
  sectionId,
  isEditorMode,
  isSelected,
  onSelect,
}: {
  testimonial: any;
  index: number;
  isInView: boolean;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: any;
  renderImage?: any;
  sectionId: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 1], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  const rating = testimonial.rating || 5;

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl p-6 h-full ${isSelected ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
      style={{
        backgroundColor: `${textColor}05`,
        border: `1px solid ${isSelected ? "#FA4616" : textColor + "10"}`,
        perspective: 1000,
        cursor: isEditorMode ? "pointer" : undefined,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (isEditorMode && onSelect) {
          // Don't trigger selection if user is selecting text
          if (window.getSelection()?.toString()) return;
          onSelect();
        }
      }}
      whileHover={{
        y: -10,
        boxShadow: `0 20px 40px -10px ${accentColor}20`,
        borderColor: isSelected ? "#FA4616" : `${accentColor}30`,
      }}
    >
      <motion.div
        className="relative h-full flex flex-col"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Quote mark */}
        <motion.div
          className="absolute -top-2 -left-1 text-6xl opacity-20"
          style={{ color: accentColor, fontFamily: "serif" }}
          animate={isHovered ? { y: -5, opacity: 0.3 } : { y: 0, opacity: 0.2 }}
        >
          "
        </motion.div>

        {/* Star rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.svg
              key={i}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={i < rating ? accentColor : "none"}
              stroke={i < rating ? accentColor : `${textColor}30`}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.1 + i * 0.05, duration: 0.3 }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </motion.svg>
          ))}
        </div>

        {/* Quote text */}
        <p
          className="flex-1 text-base leading-relaxed mb-6"
          style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
        >
          "
          {renderText
            ? renderText({
                value: testimonial.quote || testimonial.description || "",
                sectionId,
                field: "quote",
                itemId: testimonial.id,
                multiline: true,
                inline: true,
              })
            : testimonial.quote || testimonial.description}
          "
        </p>

        {/* Result highlight (optional) */}
        {testimonial.result && (
          <motion.div
            className="mb-4 px-3 py-2 rounded-lg inline-block"
            style={{ backgroundColor: `${accentColor}15` }}
            whileHover={{ backgroundColor: `${accentColor}25` }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: accentColor, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: testimonial.result,
                    sectionId,
                    field: "result",
                    itemId: testimonial.id,
                    inline: true,
                  })
                : testimonial.result}
            </span>
          </motion.div>
        )}

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${textColor}10` }}>
          {/* Avatar */}
          <div className="relative">
            {testimonial.imageUrl ? (
              renderImage ? (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  {renderImage({
                    src: testimonial.imageUrl,
                    sectionId,
                    field: `items.${index}.imageUrl`,
                    className: "w-full h-full object-cover",
                    alt: testimonial.name || "Student",
                  })}
                </div>
              ) : (
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name || "Student"}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <span className="text-lg font-medium" style={{ color: accentColor }}>
                  {(testimonial.name || "A")[0]}
                </span>
              </div>
            )}

            {/* Online indicator */}
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
              style={{
                backgroundColor: "#E03D10",
                borderColor: `${textColor}05`,
              }}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Name and role */}
          <div>
            <p
              className="font-medium"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              {renderText
                ? renderText({
                    value: testimonial.name || testimonial.title || "Anonymous",
                    sectionId,
                    field: "name",
                    itemId: testimonial.id,
                    inline: true,
                  })
                : testimonial.name || testimonial.title || "Anonymous"}
            </p>
            {testimonial.role && (
              <p
                className="text-sm"
                style={{ color: `${textColor}60`, fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: testimonial.role,
                      sectionId,
                      field: "role",
                      itemId: testimonial.id,
                      inline: true,
                    })
                  : testimonial.role}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
