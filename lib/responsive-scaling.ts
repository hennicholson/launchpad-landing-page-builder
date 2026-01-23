/**
 * Responsive Scaling Utilities
 *
 * Enables proportional scaling of custom elements across different viewports.
 * Elements are designed at a reference canvas width (1280px) and automatically
 * scale to maintain their relative proportions at any screen size.
 */

import { DEFAULT_DESIGN_WIDTH } from './page-schema';

// Re-export for convenience
export { DEFAULT_DESIGN_WIDTH };

// Preview viewport sizes (industry standard breakpoints)
export const PREVIEW_VIEWPORTS = {
  mobile: { width: 375, label: 'Mobile', icon: 'smartphone' },
  tablet: { width: 768, label: 'Tablet', icon: 'tablet' },
  desktop: { width: 1280, label: 'Desktop', icon: 'monitor' },
} as const;

export type PreviewViewport = keyof typeof PREVIEW_VIEWPORTS;

// Text scaling bounds to ensure readability
export const TEXT_BOUNDS = {
  button: { min: 10, max: 24 },
  heading: { min: 16, max: 64 },
  subheading: { min: 14, max: 48 },
  paragraph: { min: 12, max: 24 },
  caption: { min: 10, max: 20 },
  badge: { min: 8, max: 16 },
} as const;

export type TextType = keyof typeof TEXT_BOUNDS;

/**
 * Calculate scale factor based on container width vs design width
 */
export function getScaleFactor(
  containerWidth: number,
  designWidth: number = DEFAULT_DESIGN_WIDTH
): number {
  if (containerWidth <= 0 || designWidth <= 0) return 1;
  return containerWidth / designWidth;
}

/**
 * Scale a pixel value by the scale factor
 */
export function scaleValue(value: number, scaleFactor: number): number {
  return value * scaleFactor;
}

/**
 * Scale a pixel value with optional min/max bounds
 */
export function scaleValueClamped(
  value: number,
  scaleFactor: number,
  min?: number,
  max?: number
): number {
  const scaled = value * scaleFactor;
  if (min !== undefined && scaled < min) return min;
  if (max !== undefined && scaled > max) return max;
  return scaled;
}

/**
 * Scale font size with readability bounds
 * Returns both the numeric value and a CSS clamp() string
 */
export function scaleFontSize(
  fontSize: number,
  scaleFactor: number,
  textType: TextType = 'paragraph'
): { value: number; cssClamp: string } {
  const bounds = TEXT_BOUNDS[textType];
  const scaled = fontSize * scaleFactor;
  const clamped = Math.max(bounds.min, Math.min(scaled, bounds.max));

  return {
    value: clamped,
    cssClamp: `clamp(${bounds.min}px, ${scaled}px, ${bounds.max}px)`,
  };
}

/**
 * Scale element dimensions while maintaining aspect ratio
 */
export function scaleElementDimensions(
  width: number | undefined,
  height: number | undefined,
  scaleFactor: number
): { width?: number; height?: number } {
  return {
    width: width !== undefined ? width * scaleFactor : undefined,
    height: height !== undefined ? height * scaleFactor : undefined,
  };
}

/**
 * Scale padding/margin values
 */
export function scaleSpacing(
  value: number,
  scaleFactor: number,
  minValue: number = 2
): number {
  const scaled = value * scaleFactor;
  return Math.max(minValue, scaled);
}

/**
 * Scale border radius with reasonable bounds
 */
export function scaleBorderRadius(
  radius: number,
  scaleFactor: number,
  minRadius: number = 2,
  maxRadius: number = 32
): number {
  const scaled = radius * scaleFactor;
  return Math.max(minRadius, Math.min(scaled, maxRadius));
}

/**
 * Get inline styles for scaled element dimensions
 * Used by element renderers in preview/production mode
 */
export function getScaledElementStyles(
  position: { width?: number; height?: number },
  scaleFactor: number
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (position.width !== undefined) {
    styles.width = position.width * scaleFactor;
  }

  if (position.height !== undefined) {
    styles.height = position.height * scaleFactor;
  }

  return styles;
}
