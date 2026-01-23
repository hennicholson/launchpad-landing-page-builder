"use client";

import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { useEditorStore } from "@/lib/store";

/**
 * Results Gallery Section with 3D Effects
 * Masonry grid of result screenshots with tilt, captions, and lightbox
 */
export function ResultsGallery3D({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<any>(null);

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

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${accentColor}20 0%, transparent 70%)`,
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
                  value: content.heading || "Real Results",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading || "Real Results"}
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

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {items.map((item, index) => {
            const itemId = item.id || `item-${index}`;
            const isSelected = selectedItemId === itemId;
            return (
              <ResultCard
                key={itemId}
                item={item}
                index={index}
                isInView={isInView}
                textColor={textColor}
                accentColor={accentColor}
                bodyFont={bodyFont}
                renderImage={renderImage}
                renderText={renderText}
                sectionId={section.id}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                onSelect={() => selectItem(section.id, itemId)}
                onClick={() => setSelectedImage(item)}
                isTall={index % 5 === 0 || index % 5 === 3}
              />
            );
          })}
        </div>

        {/* Results summary */}
        {content.summary && (
          <motion.p
            className="text-center mt-12 text-lg"
            style={{ color: `${textColor}80`, fontFamily: bodyFont }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {renderText
              ? renderText({
                  value: content.summary,
                  sectionId: section.id,
                  field: "summary",
                  inline: true,
                })
              : content.summary}
          </motion.p>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageLightbox
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            textColor={textColor}
            accentColor={accentColor}
            bodyFont={bodyFont}
            bgColor={bgColor}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Individual Result Card with 3D tilt
 */
function ResultCard({
  item,
  index,
  isInView,
  textColor,
  accentColor,
  bodyFont,
  renderImage,
  renderText,
  sectionId,
  isEditorMode,
  isSelected,
  onSelect,
  onClick,
  isTall,
}: {
  item: any;
  index: number;
  isInView: boolean;
  textColor: string;
  accentColor: string;
  bodyFont: string;
  renderImage?: any;
  renderText?: any;
  sectionId: string;
  isEditorMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  isTall: boolean;
}) {
  const itemId = item.id || `item-${index}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
  const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);

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

  const handleClick = (e: React.MouseEvent) => {
    if (isEditorMode) {
      e.stopPropagation();
      onSelect();
    } else {
      onClick();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-xl overflow-hidden cursor-pointer h-full ${isTall ? "row-span-2" : ""} ${isSelected ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Image container */}
        <div
          className="relative overflow-hidden rounded-xl h-full"
          style={{
            border: `1px solid ${isHovered ? accentColor + "40" : textColor + "10"}`,
          }}
        >
          {item.imageUrl ? (
            renderImage ? (
              renderImage({
                src: item.imageUrl,
                sectionId,
                field: `items.${index}.imageUrl`,
                className: "w-full h-full object-cover",
                alt: item.title || "Result",
              })
            ) : (
              <img
                src={item.imageUrl}
                alt={item.title || "Result"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <span style={{ color: accentColor, fontSize: 32 }}>📊</span>
            </div>
          )}

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${textColor === "#FCF6F5" ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.8)"} 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.9 : 0.6 }}
          />

          {/* Caption overlay that slides up */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ y: 10, opacity: 0.8 }}
            animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {item.title && (
              <p
                className="font-medium text-sm mb-1"
                style={{ color: "#FFFFFF", fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: item.title,
                      sectionId,
                      field: `items.${index}.title`,
                      itemId,
                      inline: true,
                    })
                  : item.title}
              </p>
            )}
            {item.result && (
              <p
                className="text-xs px-2 py-1 rounded inline-block"
                style={{
                  backgroundColor: `${accentColor}90`,
                  color: "#FFFFFF",
                  fontFamily: bodyFont,
                }}
              >
                {renderText
                  ? renderText({
                      value: item.result,
                      sectionId,
                      field: `items.${index}.result`,
                      itemId,
                      inline: true,
                    })
                  : item.result}
              </p>
            )}
            {item.description && (
              <p
                className="text-xs mt-1 line-clamp-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: item.description,
                      sectionId,
                      field: `items.${index}.description`,
                      itemId,
                      inline: true,
                    })
                  : item.description}
              </p>
            )}
          </motion.div>

          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${textColor}15 45%, ${textColor}05 55%, transparent 60%)`,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Zoom icon on hover */}
          <motion.div
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${textColor}20` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v6" />
              <path d="M8 11h6" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Lightbox Modal for full image view
 */
function ImageLightbox({
  image,
  onClose,
  textColor,
  accentColor,
  bodyFont,
  bgColor,
}: {
  image: any;
  onClose: () => void;
  textColor: string;
  accentColor: string;
  bodyFont: string;
  bgColor: string;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: `${bgColor}e6` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Image container */}
      <motion.div
        className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={image.imageUrl}
          alt={image.title || "Result"}
          className="w-full h-auto"
        />

        {/* Caption bar */}
        {(image.title || image.result || image.description) && (
          <div
            className="p-4"
            style={{ backgroundColor: `${textColor}05` }}
          >
            {image.title && (
              <h3
                className="font-medium mb-1"
                style={{ color: textColor, fontFamily: bodyFont }}
              >
                {image.title}
              </h3>
            )}
            {image.result && (
              <span
                className="text-sm px-2 py-1 rounded inline-block mr-2"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  fontFamily: bodyFont,
                }}
              >
                {image.result}
              </span>
            )}
            {image.description && (
              <p
                className="text-sm mt-2"
                style={{ color: `${textColor}80`, fontFamily: bodyFont }}
              >
                {image.description}
              </p>
            )}
          </div>
        )}

        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${textColor}20` }}
          onClick={onClose}
          whileHover={{ scale: 1.1, backgroundColor: `${textColor}30` }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
