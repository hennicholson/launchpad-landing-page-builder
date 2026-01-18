"use client";

import type { PageElement, FontWeight } from "@/lib/page-schema";

type Props = {
  element: PageElement;
  sectionId: string;
  isSelected: boolean;
  scaleFactor?: number; // Scale factor for responsive preview (1 = no scaling)
  onClick: (e: React.MouseEvent) => void;
};

// Font weight mapping
const FONT_WEIGHTS: Record<FontWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Default sizes for text types
const TEXT_TYPE_DEFAULTS: Record<string, { fontSize: number; fontWeight: FontWeight }> = {
  heading: { fontSize: 30, fontWeight: "bold" },
  subheading: { fontSize: 20, fontWeight: "semibold" },
  paragraph: { fontSize: 16, fontWeight: "normal" },
  caption: { fontSize: 14, fontWeight: "normal" },
};

export default function TextElement({ element, sectionId, isSelected, scaleFactor = 1, onClick }: Props) {
  const { content, styles } = element;

  const textType = content.textType || "paragraph";
  const defaults = TEXT_TYPE_DEFAULTS[textType] || TEXT_TYPE_DEFAULTS.paragraph;

  // Use custom values or type defaults - apply scale factor with min bounds for readability
  const rawFontSize = content.textFontSize ?? defaults.fontSize;
  // Clamp font size to ensure readability (min 10px for body text, min 12px for headings)
  const minFontSize = textType === 'heading' || textType === 'subheading' ? 12 : 10;
  const fontSize = Math.max(minFontSize, rawFontSize * scaleFactor);

  const fontWeight = FONT_WEIGHTS[content.textFontWeight ?? defaults.fontWeight];
  const color = content.textColor ?? (textType === "caption" ? "rgba(255,255,255,0.6)" : "#ffffff");
  const textAlign = content.textAlign ?? "left";
  const lineHeight = content.textLineHeight ?? 1.5;

  // Enhanced styling - scale maxWidth proportionally
  const letterSpacing = content.textLetterSpacing || 'normal';
  const textTransform = content.textTransform || 'none';
  const rawMaxWidth = content.textMaxWidth;
  const maxWidth = rawMaxWidth ? rawMaxWidth * scaleFactor : 600 * scaleFactor;

  return (
    <div
      onClick={onClick}
      className={`${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black rounded" : ""}`}
      style={{
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight,
        color: color,
        textAlign: textAlign,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
        textTransform: textTransform as React.CSSProperties['textTransform'],
        maxWidth: `${maxWidth}px`,
      }}
    >
      {content.text || "Enter your text here"}
    </div>
  );
}
