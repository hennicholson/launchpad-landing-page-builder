"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SectionItem } from "@/lib/page-schema";

const avatarColors = ["#D6FC51", "#34d399", "#14b8a6", "#60a5fa", "#a78bfa"];

type TestimonialCardProps = {
  item: SectionItem;
  index: number;
  textColor?: string;
  accentColor?: string;
};

export function TestimonialCard({
  item,
  index,
  textColor,
  accentColor,
}: TestimonialCardProps) {
  const avatarColor = avatarColors[index % avatarColors.length];
  const initials = item.author
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <motion.div
      className="p-6 rounded-2xl mb-4 flex-shrink-0"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.05)",
        borderColor: `${accentColor}33`,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Rating stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4"
            style={{ color: accentColor || "#D6FC51" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote/title */}
      {item.title && (
        <p
          className="font-medium text-base mb-4 leading-relaxed"
          style={{ color: textColor || "#ffffff" }}
        >
          &ldquo;{item.title}&rdquo;
        </p>
      )}

      {/* Description */}
      {item.description && (
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: `${textColor || "#ffffff"}70` }}
        >
          {item.description}
        </p>
      )}

      {/* Author info */}
      <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.author || ""}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: avatarColor, color: "#0a0a0a" }}
          >
            {initials}
          </div>
        )}
        <div>
          {item.author && (
            <p
              className="font-semibold text-sm"
              style={{ color: textColor || "#ffffff" }}
            >
              {item.author}
            </p>
          )}
          {item.role && (
            <p
              className="text-xs"
              style={{ color: `${textColor || "#ffffff"}50` }}
            >
              {item.role}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type ScrollColumnProps = {
  items: SectionItem[];
  speed: number;
  textColor?: string;
  bgColor?: string;
  accentColor?: string;
  startIndex: number;
  direction?: "up" | "down";
};

export function ScrollColumn({
  items,
  speed,
  textColor,
  bgColor,
  accentColor,
  startIndex,
  direction = "up",
}: ScrollColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Triple the items for smoother seamless loop
  const triplicatedItems = [...items, ...items, ...items];

  useEffect(() => {
    if (columnRef.current) {
      // Get height of one set of items
      const singleSetHeight = columnRef.current.scrollHeight / 3;
      setContentHeight(singleSetHeight);
    }
  }, [items]);

  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Mask gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${bgColor}, transparent)` }}
      />
      {/* Mask gradient bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to top, ${bgColor}, transparent)` }}
      />

      <motion.div
        ref={columnRef}
        className="flex flex-col"
        animate={contentHeight > 0 ? {
          y: direction === "up"
            ? [0, -contentHeight]
            : [-contentHeight, 0]
        } : {}}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {triplicatedItems.map((item, index) => (
          <TestimonialCard
            key={`${item.id}-${index}`}
            item={item}
            index={startIndex + (index % items.length)}
            textColor={textColor}
            accentColor={accentColor}
          />
        ))}
      </motion.div>
    </div>
  );
}
