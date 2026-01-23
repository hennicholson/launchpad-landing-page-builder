"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../SectionBackground";

// Icon mapping for common feature icons
const ICON_PATHS: Record<string, string> = {
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rocket: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  sparkles: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  cube: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
};

export default function DetailedFeaturesSectionBase({
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

  // Helper to render icon
  const renderIcon = (iconName: string = "star") => {
    const pathD = ICON_PATHS[iconName] || ICON_PATHS.star;
    return (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        style={{ color: accentColor }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={pathD} />
      </svg>
    );
  };

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

          {/* Intro Text */}
          {content.introText && (
            <div className="mb-8 sm:mb-12 text-center max-w-3xl mx-auto">
              {renderText ? (
                renderText({
                  value: content.introText,
                  sectionId: section.id,
                  field: "introText",
                  className: "text-lg md:text-xl opacity-90",
                  style: { color: textColor, fontFamily: bodyFont },
                })
              ) : (
                <p
                  className="text-lg md:text-xl opacity-90"
                  style={{ color: textColor, fontFamily: bodyFont }}
                >
                  {content.introText}
                </p>
              )}
            </div>
          )}

          {/* Featured Image */}
          {content.featuredImageUrl && (
            <div className="mb-10 sm:mb-16">
              {renderImage ? (
                renderImage({
                  value: content.featuredImageUrl,
                  alt: content.featuredImageAlt || "Product features",
                  sectionId: section.id,
                  field: "featuredImageUrl",
                  className: "w-full max-w-5xl mx-auto rounded-lg",
                })
              ) : (
                <img
                  src={content.featuredImageUrl}
                  alt={content.featuredImageAlt || "Product features"}
                  className="w-full max-w-5xl mx-auto rounded-lg"
                />
              )}
            </div>
          )}

          {/* Features Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14">
              {items.map((item, index) => (
                <div key={item.id || index} className="flex items-start gap-3 sm:gap-4">
                  {/* Simple Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {renderIcon(item.icon)}
                  </div>

                  {/* Feature Content */}
                  <div className="flex-1">
                    {/* Title */}
                    <div className="mb-2">
                      {renderText ? (
                        renderText({
                          value: item.title || `Feature ${index + 1}`,
                          sectionId: section.id,
                          field: `items.${index}.title`,
                          className: "text-lg sm:text-xl font-bold",
                          style: { color: textColor, fontFamily: headingFont },
                        })
                      ) : (
                        <h3
                          className="text-lg sm:text-xl font-bold"
                          style={{ color: textColor, fontFamily: headingFont }}
                        >
                          {item.title || `Feature ${index + 1}`}
                        </h3>
                      )}
                    </div>

                    {/* Description */}
                    {item.description && (
                      <>
                        {renderText ? (
                          renderText({
                            value: item.description,
                            sectionId: section.id,
                            field: `items.${index}.description`,
                            className: "text-sm sm:text-base leading-relaxed opacity-80",
                            style: { color: textColor, fontFamily: bodyFont },
                          })
                        ) : (
                          <p
                            className="text-sm sm:text-base leading-relaxed opacity-80"
                            style={{ color: textColor, fontFamily: bodyFont }}
                          >
                            {item.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <p style={{ color: textColor, fontFamily: bodyFont }}>
                Add detailed features to showcase what's inside your offer
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
