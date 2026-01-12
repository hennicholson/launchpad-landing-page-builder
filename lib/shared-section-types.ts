import type { ReactNode, CSSProperties } from "react";
import type { PageSection, ColorScheme, Typography } from "./page-schema";

// Props for rendering text content - used by renderText slot
export type RenderTextProps = {
  value: string;
  sectionId: string;
  field: string;
  itemId?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
};

// Props for rendering images - used by renderImage slot
export type RenderImageProps = {
  src: string;
  sectionId: string;
  field: string;
  itemId?: string;
  className?: string;
  alt?: string;
  style?: CSSProperties;
};

// Base props that ALL section components receive
export type BaseSectionProps = {
  section: PageSection;
  colorScheme: ColorScheme;
  typography: Typography;

  // Optional render slots for editable content
  // If not provided, components render static content
  renderText?: (props: RenderTextProps) => ReactNode;
  renderImage?: (props: RenderImageProps) => ReactNode;
};

// Helper to create default text renderer (static display)
export function defaultRenderText({
  value,
  className,
  style,
  as: Component = "span",
  placeholder
}: RenderTextProps): ReactNode {
  const displayValue = value || placeholder || "";

  // We can't use JSX here since this is a .ts file, so we return the value
  // The actual default will be implemented in each component
  return null; // Components will handle this inline
}

// Helper to create default image renderer (static display)
export function defaultRenderImage({
  src,
  className,
  alt,
  style,
}: RenderImageProps): ReactNode {
  // Components will handle this inline
  return null;
}
