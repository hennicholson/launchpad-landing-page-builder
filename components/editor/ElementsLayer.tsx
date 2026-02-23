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
  const { isPreviewMode, isResponsiveEditing, page, currentEditingBreakpoint } = storeOrContext;
  const showGrid = (storeOrContext as any).showGrid ?? false;

  // Use previewWidth from props (editor mode) or context (published mode)
  const previewWidth = previewWidthProp ?? (storeOrContext as { previewWidth?: number }).previewWidth;

  // Calculate scale factor for responsive preview
  const scaleFactor = useMemo(() => {
    // No scaling in normal edit mode (desktop)
    if ((!isPreviewMode && !isResponsiveEditing) || !previewWidth) return 1;
    // Calculate scale based on preview width vs design width
    const designWidth = page.designCanvasWidth || DEFAULT_DESIGN_WIDTH;
    return getScaleFactor(previewWidth, designWidth);
  }, [isPreviewMode, isResponsiveEditing, previewWidth, page.designCanvasWidth]);

  // Get elements with breakpoint overrides applied (in preview mode or responsive editing mode)
  const effectiveElements = useMemo(() => {
    if (!section.elements) return [];

    // In preview mode or responsive editing mode, apply breakpoint overrides
    if (isPreviewMode || isResponsiveEditing) {
      return section.elements
        .map((element) => getElementAtBreakpoint(element, currentEditingBreakpoint))
        .filter((element) => element.visible !== false);
    }

    // In normal edit mode, show all elements (base values)
    return section.elements;
  }, [section.elements, isPreviewMode, isResponsiveEditing, currentEditingBreakpoint]);

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

      {/* Grid overlay — minor lines at 2.5%, major lines at 10%, center crosshairs at 50% */}
      {showGrid && !isPreviewMode && (
        <>
          {/* Minor grid lines (2.5% intervals) */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(214, 252, 81, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(214, 252, 81, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '2.5% 2.5%',
            }}
          />
          {/* Major grid lines (10% intervals) */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(214, 252, 81, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(214, 252, 81, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '10% 10%',
            }}
          />
          {/* Center crosshair — vertical */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none z-0"
            style={{
              left: '50%',
              width: '1px',
              background: 'rgba(214, 252, 81, 0.15)',
            }}
          />
          {/* Center crosshair — horizontal */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-0"
            style={{
              top: '50%',
              height: '1px',
              background: 'rgba(214, 252, 81, 0.15)',
            }}
          />
        </>
      )}

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
