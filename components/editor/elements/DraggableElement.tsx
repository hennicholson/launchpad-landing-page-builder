"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { PageElement, ElementPosition } from "@/lib/page-schema";
import { useEditorStoreOrPublished, type AlignmentGuide, type ActiveGuides } from "@/lib/store";
import { ElementRenderer } from "./index";
import ResizeHandles, { type ResizeDirection } from "./ResizeHandles";
import { Move, Trash2, Copy, GripVertical, EyeOff, Link, Smartphone } from "lucide-react";
import { hasBreakpointOverrides, getOverriddenBreakpoints } from "@/lib/breakpoint-utils";

// Elements that support visual resizing
const RESIZABLE_TYPES = ['image', 'video', 'button', 'icon', 'badge', 'countdown', 'form', 'html'];

type Props = {
  element: PageElement;
  originalElement?: PageElement; // The original element (for tracking breakpoint state)
  sectionId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  scaleFactor?: number; // Scale factor for responsive preview (1 = no scaling)
};

const GRID_SIZE = 8; // 8px grid for snap-to-grid
const SNAP_THRESHOLD = 2; // Percentage threshold for snapping to guides

export default function DraggableElement({ element, originalElement, sectionId, containerRef, scaleFactor = 1 }: Props) {
  const {
    selectedElementIds,
    selectElement,
    moveElement,
    removeElement,
    duplicateElement,
    updateElement,
    isPreviewMode,
    setActiveGuides,
    page,
    moveGroupedElements,
    currentEditingBreakpoint,
    moveElementAtBreakpoint,
    updateElementAtBreakpoint,
  } = useEditorStoreOrPublished();

  // Use original element to check for breakpoint overrides
  const sourceElement = originalElement || element;
  const hasOverrides = hasBreakpointOverrides(sourceElement, currentEditingBreakpoint);
  const overriddenBreakpoints = getOverriddenBreakpoints(sourceElement);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedElementIds.has(element.id);
  const isResizable = RESIZABLE_TYPES.includes(element.type);
  const isHidden = element.visible === false;
  const isGrouped = !!element.groupId;

  // In preview mode, completely hide hidden elements
  if (isPreviewMode && isHidden) {
    return null;
  }

  // Calculate pixel position from percentage
  const getPixelPosition = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (element.position.x / 100) * rect.width,
      y: (element.position.y / 100) * rect.height,
    };
  }, [element.position, containerRef]);

  // Get all potential guide positions from other elements
  const getGuidePositions = useCallback((): { horizontal: number[]; vertical: number[] } => {
    const section = page.sections.find((s) => s.id === sectionId);
    if (!section?.elements) return { horizontal: [50], vertical: [50] };

    const horizontalGuides: number[] = [50]; // Always include center
    const verticalGuides: number[] = [50]; // Always include center

    // Add guides for other elements
    section.elements.forEach((el) => {
      if (el.id !== element.id && el.visible !== false) {
        // Add element center positions as guides
        horizontalGuides.push(el.position.x);
        verticalGuides.push(el.position.y);
      }
    });

    return { horizontal: horizontalGuides, vertical: verticalGuides };
  }, [page.sections, sectionId, element.id]);

  // Check if position is near a guide and return snapped position + active guides
  const checkGuideSnapping = useCallback(
    (x: number, y: number): { x: number; y: number; guides: ActiveGuides } => {
      const { horizontal: hGuides, vertical: vGuides } = getGuidePositions();
      const activeGuides: ActiveGuides = { horizontal: [], vertical: [] };
      let snappedX = x;
      let snappedY = y;

      // Check horizontal guides (for X position)
      for (const guideX of hGuides) {
        if (Math.abs(x - guideX) < SNAP_THRESHOLD) {
          snappedX = guideX;
          activeGuides.vertical.push({
            type: 'vertical',
            position: guideX,
            label: guideX === 50 ? 'center' : undefined,
          });
          break;
        }
      }

      // Check vertical guides (for Y position)
      for (const guideY of vGuides) {
        if (Math.abs(y - guideY) < SNAP_THRESHOLD) {
          snappedY = guideY;
          activeGuides.horizontal.push({
            type: 'horizontal',
            position: guideY,
            label: guideY === 50 ? 'center' : undefined,
          });
          break;
        }
      }

      return { x: snappedX, y: snappedY, guides: activeGuides };
    },
    [getGuidePositions]
  );

  // Convert pixel position to percentage
  const getPercentagePosition = useCallback(
    (pixelX: number, pixelY: number): ElementPosition => {
      if (!containerRef.current) return element.position;
      const rect = containerRef.current.getBoundingClientRect();
      let x = (pixelX / rect.width) * 100;
      let y = (pixelY / rect.height) * 100;

      // Clamp to bounds
      x = Math.max(0, Math.min(x, 100));
      y = Math.max(0, Math.min(y, 100));

      // Snap to grid if enabled
      if (element.snapToGrid) {
        const gridPercentX = (GRID_SIZE / rect.width) * 100;
        const gridPercentY = (GRID_SIZE / rect.height) * 100;
        x = Math.round(x / gridPercentX) * gridPercentX;
        y = Math.round(y / gridPercentY) * gridPercentY;
      }

      return {
        ...element.position,
        x,
        y,
      };
    },
    [element.position, element.snapToGrid, containerRef]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isPreviewMode) return;
      e.stopPropagation();

      // Shift+click for multi-select
      const isMultiSelect = e.shiftKey;
      selectElement(sectionId, element.id, isMultiSelect);

      if ((e.target as HTMLElement).closest(".drag-handle")) {
        setIsDragging(true);
        const pixelPos = getPixelPosition();
        setDragOffset({
          x: e.clientX - pixelPos.x - (containerRef.current?.getBoundingClientRect().left || 0),
          y: e.clientY - pixelPos.y - (containerRef.current?.getBoundingClientRect().top || 0),
        });
        // Store initial position for grouped element movement
        setLastPosition({ x: element.position.x, y: element.position.y });
      }
    },
    [isPreviewMode, selectElement, sectionId, element.id, getPixelPosition, containerRef, element.position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const pixelX = e.clientX - rect.left - dragOffset.x;
      const pixelY = e.clientY - rect.top - dragOffset.y;

      const newPosition = getPercentagePosition(pixelX, pixelY);

      // Check for guide snapping
      const { x: snappedX, y: snappedY, guides } = checkGuideSnapping(newPosition.x, newPosition.y);

      // Update active guides
      if (guides.horizontal.length > 0 || guides.vertical.length > 0) {
        setActiveGuides(guides);
      } else {
        setActiveGuides(null);
      }

      // If element is grouped, move all elements in the group
      if (element.groupId) {
        const deltaX = snappedX - lastPosition.x;
        const deltaY = snappedY - lastPosition.y;
        moveGroupedElements(sectionId, element.groupId, deltaX, deltaY);
        setLastPosition({ x: snappedX, y: snappedY });
      } else {
        // Move single element - use breakpoint-aware function
        moveElementAtBreakpoint(sectionId, element.id, {
          x: snappedX,
          y: snappedY,
        });
      }
    },
    [isDragging, dragOffset, getPercentagePosition, checkGuideSnapping, moveElementAtBreakpoint, moveGroupedElements, sectionId, element.id, element.groupId, containerRef, setActiveGuides, lastPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveGuides(null); // Clear guides when drag ends
  }, [setActiveGuides]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(sectionId, element.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateElement(sectionId, element.id);
  };

  const toggleSnapToGrid = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateElement(sectionId, element.id, { snapToGrid: !element.snapToGrid });
  };

  // Handle resize from ResizeHandles
  const handleResize = useCallback((direction: ResizeDirection, deltaX: number, deltaY: number) => {
    // Get current dimensions or calculate from element
    const currentWidth = element.position.width ?? (elementRef.current?.offsetWidth || 100);
    const currentHeight = element.position.height ?? (elementRef.current?.offsetHeight || 100);

    let newWidth = currentWidth;
    let newHeight = currentHeight;

    // Apply delta based on direction
    switch (direction) {
      case 'e':
        newWidth = Math.max(20, currentWidth + deltaX);
        break;
      case 'w':
        newWidth = Math.max(20, currentWidth - deltaX);
        break;
      case 's':
        newHeight = Math.max(20, currentHeight + deltaY);
        break;
      case 'n':
        newHeight = Math.max(20, currentHeight - deltaY);
        break;
      case 'se':
        newWidth = Math.max(20, currentWidth + deltaX);
        newHeight = Math.max(20, currentHeight + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(20, currentWidth - deltaX);
        newHeight = Math.max(20, currentHeight + deltaY);
        break;
      case 'ne':
        newWidth = Math.max(20, currentWidth + deltaX);
        newHeight = Math.max(20, currentHeight - deltaY);
        break;
      case 'nw':
        newWidth = Math.max(20, currentWidth - deltaX);
        newHeight = Math.max(20, currentHeight - deltaY);
        break;
    }

    // Calculate position adjustments for top/left resize handles
    // When resizing from the left or top, the element's position needs to shift
    // to keep the opposite edge anchored
    let positionUpdates: Partial<ElementPosition> = {};
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const widthChange = newWidth - currentWidth;
      const heightChange = newHeight - currentHeight;

      // For 'w', 'nw', 'sw' handles: adjust x position
      if (direction === 'w' || direction === 'nw' || direction === 'sw') {
        const xDeltaPercent = (widthChange / rect.width) * 100;
        positionUpdates.x = element.position.x - xDeltaPercent;
      }

      // For 'n', 'nw', 'ne' handles: adjust y position
      if (direction === 'n' || direction === 'nw' || direction === 'ne') {
        const yDeltaPercent = (heightChange / rect.height) * 100;
        positionUpdates.y = element.position.y - yDeltaPercent;
      }
    }

    // Update element position with new dimensions - use breakpoint-aware function
    updateElementAtBreakpoint(sectionId, element.id, {
      position: {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
        ...positionUpdates,
      }
    });
  }, [element.position, element.id, sectionId, updateElementAtBreakpoint, containerRef]);

  return (
    <div
      ref={elementRef}
      data-element-id={element.id}
      className={`
        absolute group pointer-events-auto
        ${isDragging ? "opacity-80 z-50" : ""}
        ${isHidden && !isPreviewMode ? "opacity-40" : ""}
      `}
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Breakpoint indicator - show when element has overrides */}
      {overriddenBreakpoints.length > 0 && !isPreviewMode && (
        <div className="absolute -top-6 right-0 flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full z-40">
          <Smartphone className="w-3 h-3 text-purple-300" />
          <span className="text-[10px] text-purple-300 font-medium">
            {overriddenBreakpoints.join(', ')}
          </span>
        </div>
      )}

      {/* Hidden indicator badge - show when element is hidden and not in preview mode */}
      {isHidden && !isPreviewMode && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full z-40">
          <EyeOff className="w-3 h-3 text-white/60" />
          <span className="text-[10px] text-white/60 font-medium">Hidden</span>
        </div>
      )}

      {/* Element toolbar - only show when selected and not in preview mode */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-[#1a1a1c] border border-white/10 rounded-lg shadow-xl z-50">
          {/* Group indicator */}
          {isGrouped && (
            <>
              <div className="p-1.5 rounded bg-blue-500/20" title="Part of a group">
                <Link className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="w-px h-4 bg-white/10" />
            </>
          )}

          {/* Drag handle */}
          <button className="drag-handle p-1.5 rounded hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors">
            <GripVertical className="w-3.5 h-3.5 text-white/50" />
          </button>

          {/* Snap to grid toggle */}
          <button
            onClick={toggleSnapToGrid}
            className={`p-1.5 rounded transition-colors ${
              element.snapToGrid ? "bg-[#D6FC51]/20 text-[#D6FC51]" : "hover:bg-white/10 text-white/50"
            }`}
            title={element.snapToGrid ? "Snap to grid: ON" : "Snap to grid: OFF"}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          </button>

          <div className="w-px h-4 bg-white/10" />

          {/* Duplicate */}
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded hover:bg-white/10 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5 text-white/50" />
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-white/50 hover:text-red-400" />
          </button>
        </div>
      )}

      {/* The actual element */}
      <div className="relative">
        <ElementRenderer
          element={element}
          sectionId={sectionId}
          isSelected={isSelected}
          scaleFactor={scaleFactor}
          onClick={(e) => !isPreviewMode && selectElement(sectionId, element.id, e.shiftKey)}
        />

        {/* Resize handles - only show when selected, resizable, and not in preview mode */}
        {isSelected && isResizable && !isPreviewMode && (
          <ResizeHandles
            onResize={handleResize}
            onResizeStart={() => setIsResizing(true)}
            onResizeEnd={() => setIsResizing(false)}
          />
        )}
      </div>
    </div>
  );
}
