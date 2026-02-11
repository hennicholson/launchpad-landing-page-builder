"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import { SectionBackground } from "../SectionBackground";
import DOMPurify from 'dompurify';

export default function ValuePropositionSectionBase({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
}: BaseSectionProps) {
  const { content } = section;

  // Extract colors and fonts
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Extract padding
  const paddingTop = content.paddingTop ?? 16;
  const paddingBottom = content.paddingBottom ?? 16;

  // Get body paragraphs
  const bodyParagraphs = content.bodyParagraphs || [
    "Tell your story here. This section is perfect for explaining the problem your audience faces and how your solution helps them.",
    "Build empathy by describing the pain points and challenges. Make it personal and relatable.",
    "Reveal your solution and explain why it works. Focus on benefits, not features."
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: `${paddingTop * 4}px`,
        paddingBottom: `${paddingBottom * 4}px`,
      }}
    >
      {/* Background Effect */}
      <SectionBackground
        effect={content.backgroundEffect || "none"}
        config={content.backgroundConfig}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${getContentWidthClass(contentWidth)} mx-auto`}>
          {/* Badge */}
          {content.showBadge && content.badge && (
            <div className="flex justify-center mb-4 sm:mb-6">
              {renderText ? (
                renderText({
                  value: content.badge,
                  sectionId: section.id,
                  field: "badge",
                  className:
                    "inline-block px-4 py-2 rounded-full text-sm font-medium",
                  style: {
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    fontFamily: bodyFont,
                  },
                })
              ) : (
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    fontFamily: bodyFont,
                  }}
                >
                  {content.badge}
                </span>
              )}
            </div>
          )}

          {/* Heading */}
          {content.showHeading !== false && content.heading && (
            <div className="mb-6 sm:mb-8 text-center">
              {renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "text-3xl sm:text-4xl md:text-5xl font-bold leading-tight",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {content.heading}
                </h2>
              )}
            </div>
          )}

          {/* Body Paragraphs */}
          <div className="space-y-4 sm:space-y-6">
            {bodyParagraphs.map((paragraph, index) => (
              <div key={index}>
                {renderText ? (
                  renderText({
                    value: paragraph,
                    sectionId: section.id,
                    field: "bodyParagraphs",
                    paragraphIndex: index,
                    isRichText: true,
                    className: "text-sm sm:text-base md:text-lg leading-relaxed rich-text-rendered",
                    style: {
                      color: textColor,
                      fontFamily: bodyFont,
                      lineHeight: "1.75",
                    },
                  })
                ) : (
                  <div
                    className="text-sm sm:text-base md:text-lg leading-relaxed rich-text-rendered"
                    style={{
                      color: textColor,
                      fontFamily: bodyFont,
                      lineHeight: "1.75",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(paragraph, {
                        ALLOWED_TAGS: [
                          'p', 'strong', 'em', 'u', 's', 'a',
                          'h1', 'h2', 'h3', 'h4',
                          'ul', 'ol', 'li',
                          'blockquote', 'code', 'pre', 'mark', 'span'
                        ],
                        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
                        ALLOWED_STYLES: {
                          '*': {
                            'color': [/^#[0-9a-fA-F]{3,6}$/],
                            'background-color': [/^#[0-9a-fA-F]{3,6}$/],
                          }
                        }
                      })
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
