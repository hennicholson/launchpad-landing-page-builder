"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../SectionBackground";

export default function CreatorSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
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

  // Parse bio into paragraphs (support both array and string with newlines)
  const bioParagraphs = Array.isArray(content.creatorBio)
    ? content.creatorBio
    : content.creatorBio
    ? content.creatorBio.split("\n\n").filter((p) => p.trim())
    : [
        "Share your story here. Explain who you are, what you've accomplished, and why you're qualified to help your audience.",
        "Build trust by sharing your experience, credentials, and personal journey. Make it authentic and relatable.",
        "Connect with your audience on an emotional level. Show them you understand their challenges because you've been there too.",
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
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          {content.showHeading !== false && content.heading && (
            <div className="mb-12 text-center">
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

          {/* Two-column layout: Photo + Bio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Creator Photo */}
            <div className="order-1 lg:order-1">
              {content.creatorPhotoUrl ? (
                renderImage ? (
                  renderImage({
                    value: content.creatorPhotoUrl,
                    alt: content.creatorPhotoAlt || content.creatorName || "Creator photo",
                    sectionId: section.id,
                    field: "creatorPhotoUrl",
                    className: "w-full max-w-md mx-auto rounded-lg shadow-sm",
                  })
                ) : (
                  <img
                    src={content.creatorPhotoUrl}
                    alt={content.creatorPhotoAlt || content.creatorName || "Creator photo"}
                    className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                  />
                )
              ) : (
                <div
                  className="w-full max-w-md mx-auto rounded-lg shadow-sm aspect-square flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <span
                    className="text-sm opacity-50"
                    style={{ color: textColor, fontFamily: bodyFont }}
                  >
                    Add creator photo URL
                  </span>
                </div>
              )}
            </div>

            {/* Bio Content */}
            <div className="order-2 lg:order-2">
              {/* Creator Name */}
              {content.creatorName && (
                <div className="mb-2">
                  {renderText ? (
                    renderText({
                      value: content.creatorName,
                      sectionId: section.id,
                      field: "creatorName",
                      className: "text-2xl md:text-3xl font-bold",
                      style: { color: textColor, fontFamily: headingFont },
                    })
                  ) : (
                    <h3
                      className="text-2xl md:text-3xl font-bold"
                      style={{ color: textColor, fontFamily: headingFont }}
                    >
                      {content.creatorName}
                    </h3>
                  )}
                </div>
              )}

              {/* Creator Role */}
              {content.creatorRole && (
                <div className="mb-6">
                  {renderText ? (
                    renderText({
                      value: content.creatorRole,
                      sectionId: section.id,
                      field: "creatorRole",
                      className: "text-lg opacity-80",
                      style: { color: textColor, fontFamily: bodyFont },
                    })
                  ) : (
                    <p
                      className="text-lg opacity-80"
                      style={{ color: textColor, fontFamily: bodyFont }}
                    >
                      {content.creatorRole}
                    </p>
                  )}
                </div>
              )}

              {/* Bio Paragraphs */}
              <div className="space-y-4 mb-6">
                {bioParagraphs.map((paragraph, index) => (
                  <div key={index}>
                    {renderText ? (
                      renderText({
                        value: paragraph,
                        sectionId: section.id,
                        field: `creatorBio.${index}`,
                        className: "text-base leading-relaxed",
                        style: {
                          color: textColor,
                          fontFamily: bodyFont,
                          lineHeight: "1.75",
                        },
                      })
                    ) : (
                      <p
                        className="text-base leading-relaxed"
                        style={{
                          color: textColor,
                          fontFamily: bodyFont,
                          lineHeight: "1.75",
                        }}
                      >
                        {paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Credentials List */}
              {content.creatorCredentials && content.creatorCredentials.length > 0 && (
                <div className="mt-6">
                  <div className="space-y-3">
                    {content.creatorCredentials.map((credential, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {/* Simple Checkmark Icon */}
                        <svg
                          className="flex-shrink-0 w-5 h-5 mt-0.5"
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

                        {/* Credential Text */}
                        <div className="flex-1">
                          {renderText ? (
                            renderText({
                              value: credential,
                              sectionId: section.id,
                              field: `creatorCredentials.${index}`,
                              className: "text-sm font-medium",
                              style: { color: textColor, fontFamily: bodyFont },
                            })
                          ) : (
                            <p
                              className="text-sm font-medium"
                              style={{ color: textColor, fontFamily: bodyFont }}
                            >
                              {credential}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
