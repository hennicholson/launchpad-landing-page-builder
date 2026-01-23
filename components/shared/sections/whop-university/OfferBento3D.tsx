"use client";

import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { DrawCheckmark } from "./primitives/DrawCheckmark";
import { useEditorStore } from "@/lib/store";

/**
 * Offer Bento Grid Section with 3D Tilt Cards
 * Shows what's included with animated checkmarks and hover effects
 */
export function OfferBento3D({
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
                  value: content.heading || "Everything You Need",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "Everything You Need"}
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => (
            <TiltCard
              key={item.id || index}
              item={item}
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
              isSelected={selectedItemId === item.id}
              onSelect={() => {
                if (isEditorMode) {
                  selectItem(section.id, item.id);
                }
              }}
            />
          ))}
        </div>

        {/* Feature list below (optional) */}
        {content.features && content.features.length > 0 && (
          <motion.div
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {content.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <DrawCheckmark
                  size={20}
                  color={accentColor}
                  delay={index * 0.05}
                />
                <span
                  className="text-sm"
                  style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/**
 * Individual 3D Tilt Card Component
 */
function TiltCard({
  item,
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
  item: any;
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

  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

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

  // Determine card size based on index for bento layout
  const isLarge = index === 0;
  const isMedium = index === 1 || index === 2;

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden ${
        isLarge ? "md:col-span-2 md:row-span-2" : isMedium ? "md:col-span-1" : ""
      } ${isSelected ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
      style={{
        perspective: 1000,
        backgroundColor: `${textColor}05`,
        border: `1px solid ${isSelected ? "#FA4616" : textColor + "10"}`,
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
          if (window.getSelection()?.toString()) return;
          onSelect();
        }
      }}
    >
      <motion.div
        className="relative w-full h-full p-6"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Glowing border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `1px solid ${accentColor}`,
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Image */}
        {item.imageUrl && (
          <div className={`relative mb-4 rounded-xl overflow-hidden ${isLarge ? "h-48 md:h-64" : "h-32"}`}>
            {renderImage ? (
              renderImage({
                src: item.imageUrl,
                sectionId,
                field: `items.${index}.imageUrl`,
                className: "w-full h-full object-cover",
                alt: item.title,
              })
            ) : (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}

            {/* Image overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)`,
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          {item.icon && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: `${accentColor}20` }}
            >
              <span style={{ color: accentColor }}>{item.icon}</span>
            </div>
          )}

          <h3
            className={`font-semibold mb-2 ${isLarge ? "text-xl md:text-2xl" : "text-lg"}`}
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText
              ? renderText({
                  value: item.title || "",
                  sectionId,
                  field: "title",
                  itemId: item.id,
                  inline: true,
                })
              : item.title}
          </h3>

          {item.description && (
            <p
              className="text-sm"
              style={{ color: `${textColor}80`, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: item.description,
                    sectionId,
                    field: "description",
                    itemId: item.id,
                    multiline: true,
                    inline: true,
                  })
                : item.description}
            </p>
          )}
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${textColor}10 45%, ${textColor}05 55%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
