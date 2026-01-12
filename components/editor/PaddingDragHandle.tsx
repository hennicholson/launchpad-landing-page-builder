"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GripHorizontal } from "lucide-react";

type Position = "top" | "bottom";

type Props = {
  sectionId: string;
  position: Position;
  currentPadding: number;
  onPaddingChange: (padding: number) => void;
  isVisible: boolean;
};

const DEFAULT_PADDING = 48;
const MIN_PADDING = 0;
const MAX_PADDING = 200;

export default function PaddingDragHandle({
  sectionId,
  position,
  currentPadding,
  onPaddingChange,
  isVisible,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const startYRef = useRef(0);
  const startPaddingRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastPaddingRef = useRef(currentPadding);

  // Smooth update using RAF
  const updatePadding = useCallback((newPadding: number) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const clampedPadding = Math.max(MIN_PADDING, Math.min(MAX_PADDING, Math.round(newPadding)));
      if (clampedPadding !== lastPaddingRef.current) {
        lastPaddingRef.current = clampedPadding;
        onPaddingChange(clampedPadding);
      }
    });
  }, [onPaddingChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setShowValue(true);
      startYRef.current = e.clientY;
      startPaddingRef.current = currentPadding || DEFAULT_PADDING;
      lastPaddingRef.current = currentPadding || DEFAULT_PADDING;
    },
    [currentPadding]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startYRef.current;

      // Direction logic:
      // Top handle: drag UP (negative delta) = MORE padding, drag DOWN = LESS padding
      // Bottom handle: drag DOWN (positive delta) = MORE padding, drag UP = LESS padding
      const direction = position === "top" ? -1 : 1;
      const newPadding = startPaddingRef.current + deltaY * direction;

      updatePadding(newPadding);
    },
    [isDragging, position, updatePadding]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Keep value visible briefly after release
      setTimeout(() => setShowValue(false), 1500);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  const displayPadding = currentPadding ?? DEFAULT_PADDING;

  return (
    <div
      className={`absolute left-0 right-0 z-20 ${
        position === "top" ? "top-0" : "bottom-0"
      }`}
    >
      {/* Full-width hit target area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setShowValue(true)}
        onMouseLeave={() => !isDragging && setShowValue(false)}
        className={`absolute left-0 right-0 h-6 cursor-ns-resize flex items-center justify-center ${
          position === "top" ? "-top-3" : "-bottom-3"
        }`}
      >
        {/* Visual line indicator */}
        <div
          className={`absolute left-4 right-4 h-0.5 transition-all duration-150 ${
            isDragging
              ? "bg-[#D6FC51] shadow-[0_0_8px_#D6FC51]"
              : showValue
              ? "bg-[#D6FC51]/60"
              : "bg-transparent"
          }`}
        />

        {/* Center handle button */}
        <div
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-150 ${
            isDragging
              ? "bg-[#D6FC51] text-black scale-110 shadow-lg shadow-[#D6FC51]/30"
              : showValue
              ? "bg-[#D6FC51]/90 text-black"
              : "bg-black/60 text-white/50 hover:bg-black/80 hover:text-white/70"
          }`}
        >
          <GripHorizontal className="w-4 h-4" />

          {/* Padding value */}
          <span
            className={`text-xs font-medium font-mono transition-all duration-150 overflow-hidden ${
              showValue || isDragging
                ? "max-w-[50px] opacity-100"
                : "max-w-0 opacity-0"
            }`}
          >
            {displayPadding}px
          </span>
        </div>
      </div>

      {/* Padding area visualization during drag */}
      {isDragging && displayPadding > 0 && (
        <div
          className={`absolute left-0 right-0 pointer-events-none ${
            position === "top" ? "top-0" : "bottom-0"
          }`}
          style={{
            height: `${displayPadding}px`,
            background: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(214, 252, 81, 0.1) 5px, rgba(214, 252, 81, 0.1) 10px)",
            borderTop: position === "bottom" ? "1px dashed rgba(214, 252, 81, 0.4)" : "none",
            borderBottom: position === "top" ? "1px dashed rgba(214, 252, 81, 0.4)" : "none",
          }}
        />
      )}
    </div>
  );
}
