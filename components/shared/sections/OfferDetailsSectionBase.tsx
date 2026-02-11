"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import { SectionBackground } from "../SectionBackground";

export default function OfferDetailsSectionBase({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const items = section.items || [];

  // Extract colors and fonts
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Extract padding
  const paddingTop = content.paddingTop ?? 16;
  const paddingBottom = content.paddingBottom ?? 16;

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
            <div className="mb-4 text-center">
              {renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {content.heading}
                </h2>
              )}
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="mb-8 sm:mb-12 text-center">
              {renderText ? (
                renderText({
                  value: content.description,
                  sectionId: section.id,
                  field: "description",
                  className: "text-base sm:text-lg md:text-xl opacity-90",
                  style: { color: textColor, fontFamily: bodyFont },
                })
              ) : (
                <p
                  className="text-base sm:text-lg md:text-xl opacity-90"
                  style={{ color: textColor, fontFamily: bodyFont }}
                >
                  {content.description}
                </p>
              )}
            </div>
          )}

          {/* Two-column layout: Image + List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Featured Image */}
            <div className="order-1 lg:order-1">
              {content.featuredImageUrl ? (
                renderImage ? (
                  renderImage({
                    value: content.featuredImageUrl,
                    alt: content.featuredImageAlt || "Product image",
                    sectionId: section.id,
                    field: "featuredImageUrl",
                    className: "w-full rounded-lg",
                  })
                ) : (
                  <img
                    src={content.featuredImageUrl}
                    alt={content.featuredImageAlt || "Product image"}
                    className="w-full rounded-lg"
                  />
                )
              ) : (
                <div
                  className="w-full rounded-lg aspect-square flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <span
                    className="text-sm opacity-50"
                    style={{ color: textColor, fontFamily: bodyFont }}
                  >
                    Add featured image URL
                  </span>
                </div>
              )}
            </div>

            {/* Feature List */}
            <div className="order-2 lg:order-2">
              <div className="space-y-3 sm:space-y-4">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={item.id || index} className="flex items-start gap-2 sm:gap-3">
                      {/* Simple Checkmark Icon */}
                      <svg
                        className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 mt-0.5"
                        style={{ color: accentColor }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      {/* Item Content */}
                      <div className="flex-1 flex flex-col">
                        {/* Title */}
                        <div className="block">
                          {renderText ? (
                            renderText({
                              value: item.title || `Feature ${index + 1}`,
                              sectionId: section.id,
                              field: "title",
                              itemId: item.id,
                              className: "text-base sm:text-lg font-semibold",
                              style: { color: textColor, fontFamily: bodyFont },
                            })
                          ) : (
                            <h3
                              className="text-base sm:text-lg font-semibold"
                              style={{ color: textColor, fontFamily: bodyFont }}
                            >
                              {item.title || `Feature ${index + 1}`}
                            </h3>
                          )}
                        </div>

                        {/* Description */}
                        {item.description && (
                          <div className="block mt-1">
                            {renderText ? (
                              renderText({
                                value: item.description,
                                sectionId: section.id,
                                field: "description",
                                itemId: item.id,
                                className: "text-sm opacity-80",
                                style: { color: textColor, fontFamily: bodyFont },
                              })
                            ) : (
                              <p
                                className="text-sm opacity-80"
                                style={{ color: textColor, fontFamily: bodyFont }}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-50">
                    <p style={{ color: textColor, fontFamily: bodyFont }}>
                      Add items to showcase your offer features
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
