"use client";

import { useEffect, useRef } from "react";
import { useEditorStoreOrPublished } from "@/lib/store";

/**
 * Dynamically loads Google Fonts as they're used in the editor.
 * Watches page typography + per-section typography overrides and
 * injects <link> tags for any fonts not already loaded.
 */
export default function DynamicFontLoader() {
  const { page } = useEditorStoreOrPublished();
  const loadedFontsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!page) return;

    // Collect all fonts in use
    const fontsInUse = new Set<string>();

    // Page-level fonts
    if (page.typography?.headingFont) fontsInUse.add(page.typography.headingFont);
    if (page.typography?.bodyFont) fontsInUse.add(page.typography.bodyFont);

    // Per-section font overrides
    for (const section of page.sections || []) {
      if (section.content.sectionHeadingFont) fontsInUse.add(section.content.sectionHeadingFont);
      if (section.content.sectionBodyFont) fontsInUse.add(section.content.sectionBodyFont);
    }

    // Scan element fonts (drag-and-drop elements)
    for (const section of page.sections || []) {
      for (const element of section.elements || []) {
        if (element.content.textFontFamily) fontsInUse.add(element.content.textFontFamily);
        // Also check breakpoint overrides
        if (element.breakpointOverrides?.mobile?.content?.textFontFamily) {
          fontsInUse.add(element.breakpointOverrides.mobile.content.textFontFamily);
        }
        if (element.breakpointOverrides?.tablet?.content?.textFontFamily) {
          fontsInUse.add(element.breakpointOverrides.tablet.content.textFontFamily);
        }
      }

      // Scan inline text element style overrides (from right-click styling)
      const elementStyles = section.content.elementStyles as Record<string, { fontFamily?: string }> | undefined;
      if (elementStyles) {
        for (const override of Object.values(elementStyles)) {
          if (override?.fontFamily) fontsInUse.add(override.fontFamily);
        }
      }

      // Scan item-level style overrides
      for (const item of section.items || []) {
        const itemOverrides = item.styleOverrides as Record<string, { fontFamily?: string }> | undefined;
        if (itemOverrides) {
          for (const override of Object.values(itemOverrides)) {
            if (override?.fontFamily) fontsInUse.add(override.fontFamily);
          }
        }
      }
    }

    // Load any new fonts
    const newFonts: string[] = [];
    for (const font of fontsInUse) {
      if (!loadedFontsRef.current.has(font)) {
        newFonts.push(font);
        loadedFontsRef.current.add(font);
      }
    }

    if (newFonts.length === 0) return;

    // Create Google Fonts link
    const fontParams = newFonts
      .map((font) => `family=${font.replace(/\s+/g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700`)
      .join("&");
    const url = `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.dataset.dynamicFont = "true";
    document.head.appendChild(link);
  }, [page]);

  return null;
}
