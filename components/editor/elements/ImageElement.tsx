"use client";

import type { PageElement, ShadowSize } from "@/lib/page-schema";
import { ImageIcon } from "lucide-react";

type Props = {
  element: PageElement;
  sectionId: string;
  isSelected: boolean;
  scaleFactor?: number; // Scale factor for responsive preview (1 = no scaling)
  onClick: (e: React.MouseEvent) => void;
};

// Shadow mapping
const SHADOW_MAP: Record<ShadowSize, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export default function ImageElement({ element, sectionId, isSelected, scaleFactor = 1, onClick }: Props) {
  const { content, position } = element;

  // Build style object with enhanced properties - apply scale factor
  const borderRadius = (content.imageBorderRadius ?? 8) * scaleFactor;
  const shadow = SHADOW_MAP[content.imageShadow || 'none'];
  const borderWidth = (content.imageBorderWidth ?? 0) * scaleFactor;
  const borderColor = content.imageBorderColor || '#ffffff';
  const objectFit = content.imageFit || 'cover';

  // Position dimensions take precedence over content dimensions (Figma-like sizing) - apply scale factor
  const rawWidth = position.width ?? content.imageWidth;
  const rawHeight = position.height;
  const width = rawWidth ? rawWidth * scaleFactor : undefined;
  const height = rawHeight ? rawHeight * scaleFactor : undefined;

  if (!content.imageUrl) {
    return (
      <div
        onClick={onClick}
        className={`
          flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/20 min-w-[120px] min-h-[80px]
          ${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black border-[#D6FC51]/50" : ""}
        `}
        style={{
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto",
          borderRadius: `${borderRadius}px`,
          padding: `${24 * scaleFactor}px`,
        }}
      >
        <ImageIcon className="text-white/30 mb-2" style={{ width: 32 * scaleFactor, height: 32 * scaleFactor }} />
        <span className="text-white/40" style={{ fontSize: Math.max(10, 12 * scaleFactor) }}>Add image</span>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="relative">
      <img
        src={content.imageUrl}
        alt={content.imageAlt || "Image"}
        className={`${isSelected ? "ring-2 ring-[#D6FC51] ring-offset-2 ring-offset-black" : ""}`}
        style={{
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto",
          maxWidth: "100%",
          borderRadius: `${borderRadius}px`,
          boxShadow: shadow,
          objectFit: objectFit,
          border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
        }}
      />
    </div>
  );
}
