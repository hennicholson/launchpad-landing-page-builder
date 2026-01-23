/**
 * Color utility functions for button variant styling
 * Handles color manipulation, gradient generation, and contrast calculations
 */

/**
 * Validates and normalizes color input to 7-character hex
 * Handles: #rgb, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), hsla()
 * @param color - Any CSS color format
 * @param fallback - Fallback color if validation fails
 * @returns Normalized 7-character hex
 */
export function normalizeColorToHex(color: string, fallback: string = "#000000"): string {
  if (!color || typeof color !== 'string') return fallback;

  // Remove whitespace
  const trimmed = color.trim();

  // Handle hex colors
  if (trimmed.startsWith('#')) {
    const hex = trimmed.replace('#', '');

    // 3-char shorthand (#abc → #aabbcc)
    if (hex.length === 3 && /^[0-9a-fA-F]{3}$/.test(hex)) {
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    // 6-char full hex
    if (hex.length === 6 && /^[0-9a-fA-F]{6}$/.test(hex)) {
      return `#${hex}`;
    }

    // 8-char with alpha (strip alpha)
    if (hex.length === 8 && /^[0-9a-fA-F]{8}$/.test(hex)) {
      return `#${hex.substring(0, 6)}`;
    }

    // Invalid hex
    console.warn(`Invalid hex color: ${color}, using fallback: ${fallback}`);
    return fallback;
  }

  // Handle rgb/rgba
  if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = Math.max(0, Math.min(255, parseInt(match[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(match[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(match[3], 10)));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }

  // Fallback for other formats (hsl, named colors, etc.)
  console.warn(`Unsupported color format: ${color}, using fallback: ${fallback}`);
  return fallback;
}

/**
 * Adjusts color brightness by a percentage
 * @param color - Hex color string (e.g., "#FF5733")
 * @param percent - Percentage to adjust brightness (positive = lighter, negative = darker)
 * @returns Adjusted hex color string
 */
export function adjustColorBrightness(color: string, percent: number): string {
  // Validate and normalize input
  const validColor = normalizeColorToHex(color, color);

  // Remove # if present
  const hex = validColor.replace("#", "");

  // Parse RGB values
  const num = parseInt(hex, 16);
  let r = (num >> 16) + Math.round(2.55 * percent);
  let g = ((num >> 8) & 0x00ff) + Math.round(2.55 * percent);
  let b = (num & 0x0000ff) + Math.round(2.55 * percent);

  // Clamp values to 0-255
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Convert back to hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Converts hex color to RGB format
 * @param hex - Hex color string (e.g., "#FF5733")
 * @returns RGB color string (e.g., "rgb(255, 87, 51)")
 */
export function hexToRgb(hex: string): string {
  const validHex = normalizeColorToHex(hex, '#000000');
  const sanitized = validHex.replace("#", "");
  const num = parseInt(sanitized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts hex color to RGBA format with specified opacity
 * @param hex - Hex color string (e.g., "#FF5733")
 * @param alpha - Opacity value (0-1)
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const validHex = normalizeColorToHex(hex, '#000000');
  const sanitized = validHex.replace("#", "");
  const num = parseInt(sanitized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Replaces colors in a box-shadow string while preserving structure
 * @param shadow - Original box-shadow CSS string
 * @param newColor - New color to use
 * @returns Updated box-shadow string
 */
export function replaceColorInShadow(shadow: string, newColor: string): string {
  // Match rgba(...) or rgb(...) or hex colors in the shadow string
  return shadow.replace(
    /rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/g,
    () => hexToRgba(newColor, 0.6)
  );
}

/**
 * Creates a gradient from a solid color by generating lighter and darker variations
 * @param userColor - Hex color to base gradient on
 * @param originalGradient - Original gradient string to extract structure from
 * @returns New gradient string or solid color if gradient can't be parsed
 */
export function createGradientFromColor(
  userColor: string,
  originalGradient: string
): string {
  // Validate color first
  const validColor = normalizeColorToHex(userColor, '#D6FC51');

  // Extract gradient type and direction (NO TRAILING COMMA!)
  const gradientPattern = /^(linear|radial)-gradient\(([^,]+),/;
  const match = originalGradient.match(gradientPattern);

  if (!match) {
    // Not a gradient, return solid color
    return validColor;
  }

  const [, type, direction] = match;

  // Create color variations
  const lighterColor = adjustColorBrightness(validColor, 20);
  const darkerColor = adjustColorBrightness(validColor, -20);

  // Build gradient with 3 stops (direction already clean, no comma)
  return `${type}-gradient(${direction}, ${lighterColor} 0%, ${validColor} 50%, ${darkerColor} 100%)`;
}

/**
 * Calculates relative luminance of a color (used for contrast)
 * @param hex - Hex color string
 * @returns Luminance value (0-1)
 */
function getRelativeLuminance(hex: string): number {
  const sanitized = hex.replace("#", "");
  const num = parseInt(sanitized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  // Convert to relative luminance
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Determines if a color is light or dark
 * @param hex - Hex color string
 * @returns true if color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  return getRelativeLuminance(hex) > 0.5;
}

/**
 * Generates a shadow color that's 40% darker than the base color
 * Used for 3D button variant shadow generation
 * @param baseColor - Hex color string
 * @returns Darker hex color for shadow
 */
export function generateShadowColor(baseColor: string): string {
  const validColor = normalizeColorToHex(baseColor, '#000000');
  return adjustColorBrightness(validColor, -40);
}

/**
 * Generates light and dark border colors for Win98 style buttons
 * @param baseColor - Hex color string
 * @returns Object with light and dark border colors
 */
export function generateWin98BorderColors(baseColor: string): {
  light: string;
  dark: string;
} {
  const validColor = normalizeColorToHex(baseColor, '#cccccc');
  return {
    light: adjustColorBrightness(validColor, 30),
    dark: adjustColorBrightness(validColor, -30),
  };
}
