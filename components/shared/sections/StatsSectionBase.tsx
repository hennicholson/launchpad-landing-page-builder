"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { StatsVariant, SectionItem } from "@/lib/page-schema";
import type { BaseSectionProps, RenderTextProps } from "@/lib/shared-section-types";
import { useCountUp, parseStatValue } from "../hooks/useCountUp";
import { SectionBackground } from "../SectionBackground";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// ==================== CARD VARIANT ====================
function StatCardVariant({
  itemId,
  value,
  label,
  suffix = "",
  prefix = "",
  textColor,
  accentColor,
  headingFont,
  index,
  inView,
  isEditorMode,
  isSelected,
  onSelect,
}: {
  itemId: string;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  index: number;
  inView: boolean;
  isEditorMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const count = useCountUp(value, 2, inView);

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorMode || !onSelect) return;
    if (window.getSelection()?.toString()) return;
    onSelect();
  };

  return (
    <motion.div
      onClick={isEditorMode ? handleClick : undefined}
      className={cn(
        "relative p-6 sm:p-8 rounded-2xl text-center group overflow-hidden min-w-0",
        isEditorMode && "cursor-pointer",
        isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
      )}
      style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.04)",
        borderColor: `${accentColor}30`,
      }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
        style={{ backgroundColor: `${accentColor}10` }}
      />

      <div
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ fontFamily: headingFont, color: textColor }}
      >
        <span style={{ color: accentColor }}>{prefix}</span>
        {count.toLocaleString()}
        <span style={{ color: accentColor }}>{suffix}</span>
      </div>

      <p
        className="text-xs sm:text-sm uppercase tracking-wider"
        style={{ color: `${textColor}60` }}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ==================== MINIMAL VARIANT ====================
function StatMinimalVariant({
  value,
  label,
  suffix = "",
  prefix = "",
  textColor,
  accentColor,
  headingFont,
  index,
  inView,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  index: number;
  inView: boolean;
}) {
  const count = useCountUp(value, 2, inView);

  return (
    <motion.div
      className="text-center py-6 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2"
        style={{ fontFamily: headingFont, color: textColor }}
      >
        <span style={{ color: accentColor }}>{prefix}</span>
        {count.toLocaleString()}
        <span style={{ color: accentColor }}>{suffix}</span>
      </div>

      {/* Accent underline */}
      <div
        className="w-12 h-0.5 mx-auto mb-3"
        style={{ backgroundColor: accentColor }}
      />

      <p
        className="text-sm uppercase tracking-wider"
        style={{ color: `${textColor}60` }}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ==================== BARS VARIANT ====================
function StatBarsVariant({
  value,
  label,
  suffix = "",
  prefix = "",
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  index,
  inView,
  maxValue,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  index: number;
  inView: boolean;
  maxValue: number;
}) {
  const count = useCountUp(value, 2, inView);
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 50;

  return (
    <motion.div
      className="py-4"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <p
          className="text-sm uppercase tracking-wider"
          style={{ color: `${textColor}70` }}
        >
          {label}
        </p>
        <div
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: headingFont, color: textColor }}
        >
          <span style={{ color: accentColor }}>{prefix}</span>
          {count.toLocaleString()}
          <span style={{ color: accentColor }}>{suffix}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: `${textColor}10` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: primaryColor }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: index * 0.15, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ==================== CIRCLES VARIANT ====================
function StatCirclesVariant({
  value,
  label,
  suffix = "",
  prefix = "",
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  index,
  inView,
  percentage = 75,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  index: number;
  inView: boolean;
  percentage?: number;
}) {
  const count = useCountUp(value, 2, inView);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center py-4"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Circle SVG */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={`${textColor}10`}
            strokeWidth="6"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: headingFont, color: textColor }}
          >
            <span style={{ color: accentColor }}>{prefix}</span>
            {count.toLocaleString()}
            <span style={{ color: accentColor }}>{suffix}</span>
          </div>
        </div>
      </div>

      <p
        className="mt-3 text-sm uppercase tracking-wider text-center"
        style={{ color: `${textColor}60` }}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function StatsSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  // Only enable selection in editor mode (when renderText exists)
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get variant
  const variant: StatsVariant = content.statsVariant || "cards";

  // Calculate max value for bars variant
  const maxValue = items
    ? Math.max(...items.map((item: SectionItem) => parseStatValue(item.title || "0").value))
    : 100;

  const DEFAULT_PADDING = { top: 80, bottom: 128 };

  // Helper to render text (editable in editor, static in deploy)
  const renderTextContent = (props: Omit<Parameters<NonNullable<typeof renderText>>[0], "sectionId">) => {
    if (renderText) {
      return renderText({ ...props, sectionId: section.id });
    }
    // Default static rendering
    const { value, className, style, as: Component = "span" } = props;
    return <Component className={className} style={style}>{value}</Component>;
  };

  // Render stats based on variant
  const renderStats = () => {
    if (!items || items.length === 0) {
      return (
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
          <p className="opacity-50">Add stat items in the properties panel</p>
          <p className="text-xs opacity-30 mt-2">
            Format: "10,000+" for the title, "Happy Customers" for description
          </p>
        </motion.div>
      );
    }

    switch (variant) {
      case "minimal":
        return (
          <div
            className={`grid gap-8 ${
              items.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : items.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {items.map((item: SectionItem, index: number) => {
              const { prefix, value, suffix } = parseStatValue(item.title || "0");
              return (
                <StatMinimalVariant
                  key={item.id}
                  prefix={prefix}
                  value={value}
                  suffix={suffix}
                  label={item.description || ""}
                  textColor={textColor}
                  accentColor={accentColor}
                  headingFont={headingFont}
                  index={index}
                  inView={inView}
                />
              );
            })}
          </div>
        );

      case "bars":
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {items.map((item: SectionItem, index: number) => {
              const { prefix, value, suffix } = parseStatValue(item.title || "0");
              return (
                <StatBarsVariant
                  key={item.id}
                  prefix={prefix}
                  value={value}
                  suffix={suffix}
                  label={item.description || ""}
                  textColor={textColor}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  headingFont={headingFont}
                  index={index}
                  inView={inView}
                  maxValue={maxValue}
                />
              );
            })}
          </div>
        );

      case "circles":
        return (
          <div
            className={`grid gap-6 ${
              items.length === 2
                ? "grid-cols-2"
                : items.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {items.map((item: SectionItem, index: number) => {
              const { prefix, value, suffix } = parseStatValue(item.title || "0");
              // Calculate percentage based on suffix (if it ends with %)
              let percentage = 75;
              if (suffix === "%") {
                percentage = Math.min(value, 100);
              } else if (maxValue > 0) {
                percentage = (value / maxValue) * 100;
              }
              return (
                <StatCirclesVariant
                  key={item.id}
                  prefix={prefix}
                  value={value}
                  suffix={suffix}
                  label={item.description || ""}
                  textColor={textColor}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  headingFont={headingFont}
                  index={index}
                  inView={inView}
                  percentage={percentage}
                />
              );
            })}
          </div>
        );

      case "cards":
      default:
        return (
          <div
            className={`grid gap-4 sm:gap-6 ${
              items.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : items.length === 3
                ? "grid-cols-1 sm:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            }`}
          >
            {items.map((item: SectionItem, index: number) => {
              const { prefix, value, suffix } = parseStatValue(item.title || "0");
              return (
                <StatCardVariant
                  key={item.id}
                  itemId={item.id}
                  prefix={prefix}
                  value={value}
                  suffix={suffix}
                  label={item.description || ""}
                  textColor={textColor}
                  accentColor={accentColor}
                  headingFont={headingFont}
                  index={index}
                  inView={inView}
                  isEditorMode={isEditorMode}
                  isSelected={isEditorMode && selectedItemId === item.id}
                  onSelect={() => selectItem(section.id, item.id)}
                />
              );
            })}
          </div>
        );
    }
  };

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
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
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
          {content.showHeading !== false && content.heading && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95]"
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
          {content.showSubheading !== false && content.subheading && (
            <span
              className="block mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}70`, fontFamily: bodyFont }}
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

        {/* Stats */}
        {content.showItems !== false && renderStats()}
      </div>
    </section>
  );
}
