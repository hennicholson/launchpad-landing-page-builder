"use client";

import React from "react";
import {
  IconTerminal2,
  IconEaseInOut,
  IconCurrencyDollar,
  IconCloud,
  IconRouteAltLeft,
  IconHelp,
  IconAdjustmentsBolt,
  IconHeart,
} from "@tabler/icons-react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { cn } from "@/lib/utils";
import { SubheadingText } from "./SubheadingText";
import { useEditorStore } from "@/lib/store";
import { SectionBackground } from "../SectionBackground";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: IconTerminal2,
  ease: IconEaseInOut,
  dollar: IconCurrencyDollar,
  cloud: IconCloud,
  route: IconRouteAltLeft,
  help: IconHelp,
  adjustments: IconAdjustmentsBolt,
  heart: IconHeart,
};

const Feature = ({
  title,
  description,
  icon,
  index,
  textColor,
  accentColor,
  sectionId,
  itemId,
  renderText,
  isEditorMode,
  isSelected,
  onSelect,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
  textColor: string;
  accentColor: string;
  sectionId: string;
  itemId: string;
  renderText?: BaseSectionProps["renderText"];
  isEditorMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}) => {
  const isTopRow = index < 4;
  const isLeftColumn = index % 4 === 0;
  const isRightColumn = (index + 1) % 4 === 0;

  const IconComponent = iconMap[icon] || IconTerminal2;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditorMode || !onSelect) return;
    if (window.getSelection()?.toString()) return;
    onSelect();
  };

  return (
    <div
      onClick={isEditorMode ? handleClick : undefined}
      className={cn(
        "group relative flex flex-col py-10 lg:border-r lg:border-l dark:border-neutral-800 hover:bg-gradient-to-b transition-all duration-300",
        isTopRow
          ? "from-neutral-50 to-transparent dark:from-neutral-900/50 hover:from-neutral-100 dark:hover:from-neutral-900"
          : "from-transparent to-neutral-50 dark:to-neutral-900/50 hover:to-neutral-100 dark:hover:to-neutral-900",
        isLeftColumn && "lg:border-l-0",
        isRightColumn && "lg:border-r-0",
        isEditorMode && "cursor-pointer",
        isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
      )}
      style={{
        borderColor: `${textColor}20`,
      }}
    >
      <div
        className={cn(
          "absolute left-0 h-0 w-1 bg-gradient-to-b transition-all duration-300 group-hover:h-full",
          isTopRow ? "top-0" : "bottom-0"
        )}
        style={{
          backgroundImage: `linear-gradient(to bottom, ${accentColor}, ${accentColor}80)`,
        }}
      />
      <div className="relative z-10 mb-4 px-10">
        <div className="inline-block rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30" style={{ backgroundColor: `${accentColor}20` }}>
          <div style={{ color: accentColor }}>
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div
          className="absolute inset-y-0 left-0 h-6 w-1 origin-top rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-300 group-hover:h-8 dark:bg-neutral-700"
          style={{ backgroundColor: `${textColor}40` }}
        />
        {renderText ? (
          renderText({
            value: title,
            sectionId,
            field: "title",
            itemId,
            className: "inline-block transition-all duration-300 group-hover:translate-x-2",
          })
        ) : (
          <span className="inline-block transition-all duration-300 group-hover:translate-x-2" style={{ color: textColor }}>
            {title}
          </span>
        )}
      </div>
      {renderText ? (
        renderText({
          value: description,
          sectionId,
          field: "description",
          itemId,
          className: "relative z-10 max-w-xs px-10 text-sm text-muted-foreground",
        })
      ) : (
        <p className="relative z-10 max-w-xs px-10 text-sm text-muted-foreground" style={{ color: `${textColor}99` }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default function FeaturesHoverBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Only enable selection in editor mode (when renderText exists)
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

  // Extract styling
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 80, bottom: 80 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Heading Section */}
      {(content.showHeading !== false && content.heading) || (content.showSubheading !== false && content.subheading) ? (
        <div className="container mx-auto px-4 pb-10">
          {content.showHeading !== false && content.heading && (
            renderText ? (
              renderText({
                value: content.heading,
                sectionId: section.id,
                field: "heading",
                className: "text-3xl md:text-4xl font-bold text-center mb-4",
              })
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: textColor }}>
                {content.heading}
              </h2>
            )
          )}
          <SubheadingText
            content={content}
            sectionId={section.id}
            textColor={textColor}
            bodyFont={bodyFont}
            renderText={renderText}
          />
        </div>
      ) : null}

      {/* Features Grid */}
      {content.showItems !== false && items && items.length > 0 && (
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Feature
              key={item.id}
              title={item.title || ""}
              description={item.description || ""}
              icon={item.icon || "terminal"}
              index={index}
              textColor={textColor}
              accentColor={accentColor}
              sectionId={section.id}
              itemId={item.id}
              renderText={renderText}
              isEditorMode={isEditorMode}
              isSelected={isEditorMode && selectedItemId === item.id}
              onSelect={() => selectItem(section.id, item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
