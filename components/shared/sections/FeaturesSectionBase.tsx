"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SectionItem } from "@/lib/page-schema";
import type { BaseSectionProps } from "@/lib/shared-section-types";

const staggerDelays = [0.1, 0.2, 0.25, 0.3, 0.35, 0.4];

function BentoCard({
  item,
  index,
  textColor,
  accentColor,
  bgColor,
  headingFont,
  bodyFont,
  sectionId,
  renderText,
  renderImage,
}: {
  item: SectionItem;
  index: number;
  textColor: string;
  accentColor: string;
  bgColor: string;
  headingFont: string;
  bodyFont: string;
  sectionId: string;
  renderText?: BaseSectionProps["renderText"];
  renderImage?: BaseSectionProps["renderImage"];
}) {
  const isLarge = item.gridClass?.includes("col-span-2") || item.gridClass?.includes("col-span-3");
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border hover:border-opacity-20 transition-colors duration-500 ${item.gridClass || ""}`}
      style={{
        borderColor: `${accentColor}33`,
        backgroundColor: `${textColor}05`,
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: staggerDelays[index] || 0.1,
        ease: "easeOut",
      }}
      onAnimationComplete={() => {
        setTimeout(() => setIsLoaded(true), 100);
      }}
    >
      {/* Skeleton loading state */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? "opacity-0" : "opacity-100"}`}
        style={{ background: `linear-gradient(135deg, ${textColor}08, ${textColor}0d, ${textColor}08)` }}
      >
        <div
          className="absolute inset-0 animate-shimmer"
          style={{ background: `linear-gradient(90deg, transparent, ${textColor}08, transparent)` }}
        />
      </div>

      {/* Actual content - fades in after skeleton */}
      <div className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* Image container */}
        <div className={`relative ${item.aspectRatio || "aspect-video"} overflow-hidden`}>
          {renderImage ? (
            renderImage({
              src: item.imageUrl || "",
              sectionId,
              field: "imageUrl",
              itemId: item.id,
              className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
              alt: item.title || "Feature",
            })
          ) : (
            <img
              src={item.imageUrl || ""}
              alt={item.title || "Feature"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {/* Gradient overlay - uses dynamic background color */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${bgColor}, ${bgColor}99, transparent)` }}
          />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <span
            className={`uppercase tracking-wide mb-2 block ${isLarge ? "text-xl lg:text-2xl" : "text-sm lg:text-base"}`}
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText ? (
              renderText({
                value: item.title || "",
                sectionId,
                field: "title",
                itemId: item.id,
                className: `uppercase tracking-wide mb-2 block ${isLarge ? "text-xl lg:text-2xl" : "text-sm lg:text-base"}`,
              })
            ) : (
              item.title
            )}
          </span>
          <span
            className={`leading-relaxed block ${isLarge ? "text-sm lg:text-base" : "text-xs lg:text-sm"}`}
            style={{ color: `${textColor}80`, fontFamily: bodyFont }}
          >
            {renderText ? (
              renderText({
                value: item.description || "",
                sectionId,
                field: "description",
                itemId: item.id,
                multiline: true,
                className: `leading-relaxed block ${isLarge ? "text-sm lg:text-base" : "text-xs lg:text-sm"}`,
              })
            ) : (
              item.description
            )}
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${accentColor}08` }}
      />
    </motion.div>
  );
}

export default function FeaturesSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  return (
    <section
      id="features"
      className="py-16 lg:py-24"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header with gradient reveal */}
        <div className="text-center mb-12 overflow-hidden">
          {/* Badge/subheading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span
              className="inline-block mb-6 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase border rounded-full"
              style={{
                borderColor: `${accentColor}33`,
                color: accentColor,
                backgroundColor: `${accentColor}0d`,
              }}
            >
              {renderText ? (
                renderText({
                  value: content.subheading || "",
                  sectionId: section.id,
                  field: "subheading",
                  className: "text-[10px] font-semibold tracking-[0.2em] uppercase",
                })
              ) : (
                content.subheading
              )}
            </span>
          </motion.div>

          {/* Title with gradient reveal mask */}
          <div className="relative">
            <motion.h2
              className="text-4xl sm:text-5xl uppercase leading-[0.9]"
              style={{ fontFamily: headingFont }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span
                className="inline-block bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${textColor}, ${textColor}, ${accentColor})`,
                }}
              >
                {renderText ? (
                  renderText({
                    value: content.heading || "",
                    sectionId: section.id,
                    field: "heading",
                    className: "text-4xl sm:text-5xl uppercase",
                    style: { fontFamily: headingFont },
                  })
                ) : (
                  content.heading
                )}
              </span>
            </motion.h2>

            {/* Subtle glow behind title */}
            <motion.div
              className="absolute inset-0 -z-10 blur-3xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to right, transparent, ${accentColor}1a, transparent)`,
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Bento Grid */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item: SectionItem, index: number) => (
              <BentoCard
                key={item.id}
                item={item}
                index={index}
                textColor={textColor}
                accentColor={accentColor}
                bgColor={bgColor}
                headingFont={headingFont}
                bodyFont={bodyFont}
                sectionId={section.id}
                renderText={renderText}
                renderImage={renderImage}
              />
            ))}
          </div>
        )}

        {(!items || items.length === 0) && (
          <div
            className="text-center py-12 opacity-50"
            style={{ color: textColor }}
          >
            Add features in the properties panel
          </div>
        )}
      </div>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </section>
  );
}
