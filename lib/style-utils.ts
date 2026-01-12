import type { LandingPage, PageSection, SectionItem, ElementStyleOverride } from "./page-schema";
import type { CSSProperties } from "react";

/**
 * Map font weight string values to numeric CSS font-weight values
 */
const FONT_WEIGHT_MAP: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * Resolves the final computed styles for an element by layering:
 * 1. Page defaults (colorScheme, typography)
 * 2. Section content overrides (textColor, accentColor)
 * 3. Section-level element styles (content.elementStyles[field])
 * 4. Item-level style overrides (item.styleOverrides[field])
 *
 * @param page - The full landing page data
 * @param section - The section containing the element
 * @param field - The field name (e.g., "heading", "subheading", "buttonText")
 * @param item - Optional item for item-level overrides
 * @returns CSSProperties object to apply to the element
 */
export function resolveElementStyle(
  page: LandingPage,
  section: PageSection,
  field: string,
  item?: SectionItem
): CSSProperties {
  const styles: CSSProperties = {};

  // Layer 1: Page defaults
  // Apply page-level font family based on field type
  const isHeading = field.toLowerCase().includes("heading") ||
                    field === "title" ||
                    field === "logoText" ||
                    field === "badge";

  if (isHeading) {
    styles.fontFamily = page.typography.headingFont;
  } else {
    styles.fontFamily = page.typography.bodyFont;
  }

  // Layer 2: Section content defaults (textColor, accentColor)
  if (section.content.textColor) {
    styles.color = section.content.textColor;
  } else {
    styles.color = page.colorScheme.text;
  }

  // Special handling for accent fields
  const isAccentField = field === "accentHeading" || field === "badge" || field === "price";
  if (isAccentField && section.content.accentColor) {
    styles.color = section.content.accentColor;
  }

  // Layer 3: Section-level element overrides
  const sectionElementStyles = section.content.elementStyles?.[field];
  if (sectionElementStyles) {
    applyStyleOverride(styles, sectionElementStyles);
  }

  // Layer 4: Item-level style overrides (highest priority)
  if (item?.styleOverrides?.[field]) {
    applyStyleOverride(styles, item.styleOverrides[field]);
  }

  return styles;
}

/**
 * Apply style overrides to a CSSProperties object
 */
function applyStyleOverride(styles: CSSProperties, override: ElementStyleOverride): void {
  if (override.fontSize !== undefined) {
    styles.fontSize = `${override.fontSize}px`;
  }

  if (override.fontWeight !== undefined) {
    styles.fontWeight = FONT_WEIGHT_MAP[override.fontWeight] || 400;
  }

  if (override.fontFamily !== undefined) {
    styles.fontFamily = override.fontFamily;
  }

  if (override.textAlign !== undefined) {
    styles.textAlign = override.textAlign;
  }

  if (override.color !== undefined) {
    styles.color = override.color;
  }

  if (override.letterSpacing !== undefined) {
    styles.letterSpacing = override.letterSpacing;
  }

  if (override.lineHeight !== undefined) {
    styles.lineHeight = override.lineHeight;
  }

  if (override.textTransform !== undefined) {
    styles.textTransform = override.textTransform;
  }
}

/**
 * Get the current element style override for a specific field
 * Used by the style panel to show current values
 */
export function getElementStyleOverride(
  section: PageSection,
  field: string,
  item?: SectionItem
): ElementStyleOverride {
  // Item-level takes priority
  if (item?.styleOverrides?.[field]) {
    return item.styleOverrides[field];
  }

  // Fall back to section-level
  if (section.content.elementStyles?.[field]) {
    return section.content.elementStyles[field];
  }

  return {};
}

/**
 * Parse computed CSS style to get numeric font size
 */
export function parseComputedFontSize(element: HTMLElement): number {
  const computed = window.getComputedStyle(element);
  return parseFloat(computed.fontSize) || 16;
}

/**
 * Parse computed CSS style to get font weight as our enum value
 */
export function parseComputedFontWeight(element: HTMLElement): ElementStyleOverride['fontWeight'] {
  const computed = window.getComputedStyle(element);
  const weight = parseInt(computed.fontWeight) || 400;

  if (weight >= 700) return 'bold';
  if (weight >= 600) return 'semibold';
  if (weight >= 500) return 'medium';
  return 'normal';
}

/**
 * Parse computed CSS style to get text alignment
 */
export function parseComputedTextAlign(element: HTMLElement): ElementStyleOverride['textAlign'] {
  const computed = window.getComputedStyle(element);
  const align = computed.textAlign;

  if (align === 'center') return 'center';
  if (align === 'right' || align === 'end') return 'right';
  return 'left';
}

/**
 * Parse computed CSS color to hex format
 */
export function parseComputedColor(element: HTMLElement): string {
  const computed = window.getComputedStyle(element);
  const color = computed.color;

  // Convert rgb/rgba to hex
  const match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  return color;
}
