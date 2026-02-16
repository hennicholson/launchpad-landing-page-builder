import type { PageSection, LandingPage, AnimationPreset, Typography } from "./page-schema";

/**
 * Get the effective animation preset for a section.
 * Falls back to page-level preset, then 'moderate'.
 */
export function getSectionAnimationPreset(
  section: PageSection,
  page: LandingPage
): AnimationPreset {
  return section.content.sectionAnimationPreset ?? page.animationPreset ?? "moderate";
}

/**
 * Get the animation delay for a section (in seconds).
 */
export function getSectionAnimationDelay(section: PageSection): number {
  return section.content.sectionAnimationDelay ?? 0;
}

/**
 * Get the effective Typography for a section, merging per-section overrides
 * into the page-level typography.
 */
export function getSectionTypography(
  section: PageSection,
  page: LandingPage
): Typography {
  return {
    headingFont: section.content.sectionHeadingFont || page.typography.headingFont,
    bodyFont: section.content.sectionBodyFont || page.typography.bodyFont,
  };
}

/**
 * Get the font family for a section element (heading or body).
 * Returns undefined if using page default.
 */
export function getSectionFontFamily(
  section: PageSection,
  page: LandingPage,
  element: "heading" | "body"
): string | undefined {
  if (element === "heading") {
    return section.content.sectionHeadingFont ?? undefined;
  }
  return section.content.sectionBodyFont ?? undefined;
}

/**
 * Get the font style object for a section element.
 * Returns inline style with fontFamily if an override is set.
 */
export function getSectionFontStyle(
  section: PageSection,
  page: LandingPage,
  element: "heading" | "body"
): React.CSSProperties | undefined {
  const font = getSectionFontFamily(section, page, element);
  if (!font) return undefined;
  return { fontFamily: `'${font}', sans-serif` };
}

/**
 * Get the heading size scale multiplier.
 * Returns 1 if no override is set.
 */
export function getSectionHeadingSizeScale(section: PageSection): number {
  return section.content.sectionHeadingSizeScale ?? 1;
}

/**
 * Get the Tailwind text alignment class for a section.
 * Returns undefined if no override is set.
 */
export function getSectionTextAlign(
  section: PageSection
): string | undefined {
  const align = section.content.sectionTextAlign;
  if (!align) return undefined;
  return `text-${align}`;
}

/**
 * Get the max-width class for a section's content container.
 * Falls back to page-level contentWidth.
 */
export function getSectionMaxWidthClass(
  section: PageSection,
  page: LandingPage
): string {
  const width = section.content.sectionMaxWidth ?? page.contentWidth;
  switch (width) {
    case "narrow":
      return "max-w-3xl";
    case "medium":
      return "max-w-5xl";
    case "wide":
      return "max-w-7xl";
    case "full":
      return "max-w-full";
    default:
      return "max-w-6xl";
  }
}

/**
 * Get inline style for content gap within a section.
 * Returns undefined if no override is set.
 */
export function getSectionContentGapStyle(
  section: PageSection
): React.CSSProperties | undefined {
  const gap = section.content.sectionContentGap;
  if (!gap) return undefined;
  return { gap: `${gap}px` };
}
