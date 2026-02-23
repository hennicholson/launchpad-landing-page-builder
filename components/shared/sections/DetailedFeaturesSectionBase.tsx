"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import { SectionBackground } from "../SectionBackground";

// Icon mapping for common feature icons
const ICON_PATHS: Record<string, string> = {
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
  zap: "M13 10V3L4 14h7v7l9-11h-7z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  rocket: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  "bar-chart": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  sparkles: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  cube: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  // Additional icons
  "book-open": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  layout: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z",
  key: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100 8 4 4 0 000-8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  cpu: "M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z",
  database: "M12 8c4.97 0 9-1.343 9-3s-4.03-3-9-3-9 1.343-9 3 4.03 3 9 3z M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3 M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
  award: "M12 15l-3.5 7 1-4.5L5 15h4.5L12 8l2.5 7H19l-4.5 2.5 1 4.5z",
  gift: "M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  palette: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z",
  monitor: "M20 3H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2zM8 21h8M12 17v4",
};

export default function DetailedFeaturesSectionBase({
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
  const paddingLeft = content.paddingLeft;
  const paddingRight = content.paddingRight;

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
        paddingLeft,
        paddingRight,
        '--section-heading-font': `'${headingFont}', sans-serif`,
        '--section-body-font': `'${bodyFont}', sans-serif`,
        fontFamily: `'${bodyFont}', sans-serif`,
      } as React.CSSProperties}
    >
      {/* Background Effect */}
      <SectionBackground
        effect={content.backgroundEffect || "none"}
        config={content.backgroundConfig}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${getContentWidthClass(contentWidth)} mx-auto`}>
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
            <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto">
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
