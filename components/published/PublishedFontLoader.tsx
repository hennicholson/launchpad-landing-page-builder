"use client";

import type { LandingPage } from "@/lib/page-schema";

/**
 * Collects all fonts used in a landing page (page-level + per-section overrides)
 * and renders a Google Fonts <link> tag.
 */
export default function PublishedFontLoader({ pageData }: { pageData: LandingPage }) {
  const fonts = new Set<string>();

  if (pageData.typography?.headingFont) fonts.add(pageData.typography.headingFont);
  if (pageData.typography?.bodyFont) fonts.add(pageData.typography.bodyFont);

  for (const section of pageData.sections || []) {
    if (section.content.sectionHeadingFont) fonts.add(section.content.sectionHeadingFont);
    if (section.content.sectionBodyFont) fonts.add(section.content.sectionBodyFont);

    // Element fonts
    for (const element of section.elements || []) {
      if (element.content.textFontFamily) fonts.add(element.content.textFontFamily);
      if (element.breakpointOverrides?.mobile?.content?.textFontFamily) {
        fonts.add(element.breakpointOverrides.mobile.content.textFontFamily);
      }
      if (element.breakpointOverrides?.tablet?.content?.textFontFamily) {
        fonts.add(element.breakpointOverrides.tablet.content.textFontFamily);
      }
    }
  }

  if (fonts.size === 0) return null;

  const fontParams = Array.from(fonts)
    .map((font) => `family=${font.replace(/\s+/g, "+")}:wght@300;400;500;600;700`)
    .join("&");
  const url = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;

  return (
    <link rel="stylesheet" href={url} />
  );
}
