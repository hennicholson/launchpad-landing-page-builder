"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionContent } from "@/lib/page-schema";
import {
  getSubheadingAnimation,
  getSubheadingClasses,
} from "@/lib/subheading-utils";

interface SubheadingTextProps {
  content: SectionContent;
  sectionId: string;
  textColor: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  className?: string;
}

export function SubheadingText({
  content,
  sectionId,
  textColor,
  bodyFont,
  renderText,
  className = "",
}: SubheadingTextProps) {
  // Don't render if disabled or empty
  if (content.showSubheading === false || !content.subheading) {
    return null;
  }

  const animationType = content.subheadingAnimation || "fadeUp";
  const size = content.subheadingSize || "base";
  const weight = content.subheadingWeight || "normal";
  const opacity = content.subheadingOpacity || 80;

  const animation = getSubheadingAnimation(animationType);
  const classes = getSubheadingClasses(size, weight, className);

  // Calculate opacity color (80 → "cc" in hex)
  const opacityHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
  const colorWithOpacity = `${textColor}${opacityHex}`;

  // Special handling for stagger animation
  if (animationType === "stagger") {
    const words = content.subheading.split(" ");

    return (
      <motion.div
        className={classes}
        style={{ fontFamily: bodyFont }}
        {...animation}
        viewport={{ once: true, margin: "-50px" }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            style={{ color: colorWithOpacity }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Standard animations
  return (
    <motion.div
      className={classes}
      style={{ color: colorWithOpacity, fontFamily: bodyFont }}
      {...animation}
      viewport={{ once: true, margin: "-50px" }}
    >
      {renderText
        ? renderText({
            value: content.subheading,
            sectionId,
            field: "subheading",
            className: "inline",
          })
        : content.subheading}
    </motion.div>
  );
}
