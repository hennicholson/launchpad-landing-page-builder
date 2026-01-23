/**
 * Text Utilities
 * Functions for splitting and manipulating text for animations
 */

/**
 * Split text into individual characters
 * Preserves spaces and special characters
 */
export function splitTextToChars(text: string, preserveSpaces = true): string[] {
  if (preserveSpaces) {
    return text.split("");
  }
  return text.split("").filter((char) => char !== " ");
}

/**
 * Split text into words
 */
export function splitTextToWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Split text into lines based on element wrapping
 * Useful for line-by-line animations
 */
export function splitTextToLines(text: string, maxCharsPerLine = 50): string[] {
  const words = splitTextToWords(text);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    if (testLine.length > maxCharsPerLine && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Wrap each character in a span for individual animation
 */
export function wrapCharsInSpans(text: string): string {
  return text
    .split("")
    .map((char, index) => {
      const isSpace = char === " ";
      return `<span key="${index}" style="display: inline-block; ${
        isSpace ? "width: 0.3em;" : ""
      }">${isSpace ? "\u00A0" : char}</span>`;
    })
    .join("");
}

/**
 * Generate stagger delays for array of elements
 */
export function generateStaggerDelays(
  count: number,
  baseDelay: number,
  delayIncrement: number
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + i * delayIncrement);
}

/**
 * Calculate optimal stagger delay based on text length
 * Shorter text = longer per-character delay for readability
 */
export function calculateStaggerDelay(textLength: number): number {
  if (textLength < 10) return 0.05; // 50ms per char
  if (textLength < 20) return 0.03; // 30ms per char
  if (textLength < 40) return 0.02; // 20ms per char
  return 0.015; // 15ms per char for long text
}
