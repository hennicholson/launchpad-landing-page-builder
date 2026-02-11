"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import { SectionBackground } from "../SectionBackground";

export default function BlankSectionBase({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 48, bottom: 48 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        minHeight: content.minHeight || 300,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Empty canvas area - users add elements here */}
      <div className={`relative w-full h-full ${getContentWidthClass(contentWidth)} mx-auto px-6 lg:px-8`}>
        {/* Optional heading and subheading */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-12">
            {content.showHeading !== false && content.heading && (
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6"
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
              <p
                className="text-lg max-w-2xl mx-auto"
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
              </p>
            )}
          </div>
        )}

        {/* Placeholder when empty (only shown in editor via CSS) */}
        {(!section.elements || section.elements.length === 0) && (
          <div
            className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-white/10 rounded-xl opacity-0 pointer-events-none"
            style={{ color: `${textColor}30` }}
          >
            <svg
              className="w-12 h-12 mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <p className="text-sm font-medium">Blank Canvas</p>
            <p className="text-xs opacity-70 mt-1">Drag elements here to build your section</p>
          </div>
        )}
      </div>
    </section>
  );
}
