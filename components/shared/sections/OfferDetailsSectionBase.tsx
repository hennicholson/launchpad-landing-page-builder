"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../SectionBackground";

export default function OfferDetailsSectionBase({
  section,
  colorScheme,
  typography,
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
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          {content.showBadge && content.badge && (
            <div className="flex justify-center mb-6">
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
                  className: "text-3xl md:text-4xl lg:text-5xl font-bold",
                  style: { color: textColor, fontFamily: headingFont },
                })
              ) : (
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold"
                  style={{ color: textColor, fontFamily: headingFont }}
                >
                  {content.heading}
                </h2>
              )}
            </div>
          )}

          {/* Description */}
          {content.description && (
            <div className="mb-12 text-center">
              {renderText ? (
                renderText({
                  value: content.description,
                  sectionId: section.id,
                  field: "description",
                  className: "text-lg md:text-xl opacity-90",
                  style: { color: textColor, fontFamily: bodyFont },
                })
              ) : (
                <p
                  className="text-lg md:text-xl opacity-90"
                  style={{ color: textColor, fontFamily: bodyFont }}
                >
                  {content.description}
                </p>
              )}
            </div>
          )}

          {/* Two-column layout: Image + List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Featured Image */}
            <div className="order-1 lg:order-1">
              {content.featuredImageUrl ? (
                renderImage ? (
                  renderImage({
                    src: content.featuredImageUrl,
                    alt: content.featuredImageAlt || "Product image",
                    sectionId: section.id,
                    field: "featuredImageUrl",
                    className: "w-full max-w-lg mx-auto rounded-lg",
                  })
                ) : (
                  <img
                    src={content.featuredImageUrl}
                    alt={content.featuredImageAlt || "Product image"}
                    className="w-full max-w-lg mx-auto rounded-lg"
                  />
                )
              ) : (
                <div
                  className="w-full max-w-lg mx-auto rounded-lg aspect-square flex items-center justify-center"
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
              <div className="space-y-4">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={item.id || index} className="flex items-start gap-3">
                      {/* Simple Checkmark Icon */}
                      <svg
                        className="flex-shrink-0 w-6 h-6 mt-0.5"
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
                      <div className="flex-1">
                        {/* Title */}
                        {renderText ? (
                          renderText({
                            value: item.title || `Feature ${index + 1}`,
                            sectionId: section.id,
                            field: `items.${index}.title`,
                            className: "text-lg font-semibold mb-1",
                            style: { color: textColor, fontFamily: bodyFont },
                          })
                        ) : (
                          <h3
                            className="text-lg font-semibold mb-1"
                            style={{ color: textColor, fontFamily: bodyFont }}
                          >
                            {item.title || `Feature ${index + 1}`}
                          </h3>
                        )}

                        {/* Description */}
                        {item.description && (
                          <>
                            {renderText ? (
                              renderText({
                                value: item.description,
                                sectionId: section.id,
                                field: `items.${index}.description`,
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
                          </>
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
