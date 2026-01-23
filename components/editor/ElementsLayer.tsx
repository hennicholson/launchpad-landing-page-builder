"use client";

import { useRef, useMemo } from "react";
import type { PageSection, PageElement } from "@/lib/page-schema";
import { DEFAULT_DESIGN_WIDTH } from "@/lib/page-schema";
import { DraggableElement } from "./elements";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getScaleFactor } from "@/lib/responsive-scaling";
import { getElementAtBreakpoint } from "@/lib/breakpoint-utils";

type Props = {
  section: PageSection;
  previewWidth?: number; // Width of preview viewport (undefined in edit mode)
};

// Alignment guide overlay component
function AlignmentGuides() {
  const { activeGuides } = useEditorStoreOrPublished();

  if (!activeGuides) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* Vertical guides (for X alignment) */}
      {activeGuides.vertical.map((guide, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${guide.position}%`,
            background: 'linear-gradient(to bottom, transparent, #D6FC51, #D6FC51, transparent)',
            boxShadow: '0 0 6px #D6FC51',
          }}
        >
          {guide.label && (
            <div
              className="absolute top-2 left-1 px-1.5 py-0.5 text-[10px] font-medium rounded"
              style={{
                backgroundColor: '#D6FC51',
                color: '#000',
              }}
            >
              {guide.label}
            </div>
          )}
        </div>
      ))}

      {/* Horizontal guides (for Y alignment) */}
      {activeGuides.horizontal.map((guide, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${guide.position}%`,
            background: 'linear-gradient(to right, transparent, #D6FC51, #D6FC51, transparent)',
            boxShadow: '0 0 6px #D6FC51',
          }}
        >
          {guide.label && (
            <div
              className="absolute left-2 -top-3 px-1.5 py-0.5 text-[10px] font-medium rounded"
              style={{
                backgroundColor: '#D6FC51',
                color: '#000',
              }}
            >
              {guide.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ElementsLayer({ section, previewWidth: previewWidthProp }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const storeOrContext = useEditorStoreOrPublished();
  const { isPreviewMode, page, currentEditingBreakpoint } = storeOrContext;

  // Use previewWidth from props (editor mode) or context (published mode)
  const previewWidth = previewWidthProp ?? (storeOrContext as { previewWidth?: number }).previewWidth;

  // Calculate scale factor for responsive preview
  const scaleFactor = useMemo(() => {
    // No scaling in edit mode
    if (!isPreviewMode || !previewWidth) return 1;
    // Calculate scale based on preview width vs design width
    const designWidth = page.designCanvasWidth || DEFAULT_DESIGN_WIDTH;
    return getScaleFactor(previewWidth, designWidth);
  }, [isPreviewMode, previewWidth, page.designCanvasWidth]);

  // Get elements with breakpoint overrides applied (in preview mode)
  const effectiveElements = useMemo(() => {
    if (!section.elements) return [];

    // In preview mode, apply breakpoint overrides
    if (isPreviewMode) {
      return section.elements
        .map((element) => getElementAtBreakpoint(element, currentEditingBreakpoint))
        .filter((element) => element.visible !== false);
    }

    // In edit mode, show all elements (base values)
    return section.elements;
  }, [section.elements, isPreviewMode, currentEditingBreakpoint]);

  if (effectiveElements.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ overflow: "visible" }}
    >
      {/* Alignment guides overlay */}
      <AlignmentGuides />

      {/* Each element is interactive individually - no wrapper div that blocks section clicks */}
      {effectiveElements.map((element) => {
        // Find the original element to pass for editing context
        const originalElement = section.elements?.find((e) => e.id === element.id);

        return (
          <DraggableElement
            key={element.id}
            element={element}
            originalElement={originalElement}
            sectionId={section.id}
            containerRef={containerRef}
            scaleFactor={scaleFactor}
          />
        );
      })}
    </div>
  );
}
