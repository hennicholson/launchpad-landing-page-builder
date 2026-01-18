"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

type Props = {
  onResize: (direction: ResizeDirection, deltaX: number, deltaY: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
};

const HANDLE_SIZE = 8;
const EDGE_SIZE = 6;

// Cursor styles for each direction
const CURSOR_MAP: Record<ResizeDirection, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize',
};

export default function ResizeHandles({ onResize, onResizeStart, onResizeEnd }: Props) {
  const [activeDirection, setActiveDirection] = useState<ResizeDirection | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const handleResizeMouseDown = useCallback((direction: ResizeDirection, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setActiveDirection(direction);
    onResizeStart?.();
  }, [onResizeStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!activeDirection) return;

    const deltaX = e.clientX - lastPosRef.current.x;
    const deltaY = e.clientY - lastPosRef.current.y;

    onResize(activeDirection, deltaX, deltaY);
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  }, [activeDirection, onResize]);

  const handleMouseUp = useCallback(() => {
    if (activeDirection) {
      setActiveDirection(null);
      onResizeEnd?.();
    }
  }, [activeDirection, onResizeEnd]);

  useEffect(() => {
    if (activeDirection) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = CURSOR_MAP[activeDirection];
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [activeDirection, handleMouseMove, handleMouseUp]);

  // Render corner handles
  const cornerPositions: Record<string, React.CSSProperties> = {
    nw: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
    ne: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
    sw: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 },
    se: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 },
  };

  // Render edge handles
  const edgePositions: Record<string, { style: React.CSSProperties; isVertical: boolean }> = {
    n: { style: { top: -EDGE_SIZE / 2, left: '50%', transform: 'translateX(-50%)' }, isVertical: true },
    s: { style: { bottom: -EDGE_SIZE / 2, left: '50%', transform: 'translateX(-50%)' }, isVertical: true },
    e: { style: { right: -EDGE_SIZE / 2, top: '50%', transform: 'translateY(-50%)' }, isVertical: false },
    w: { style: { left: -EDGE_SIZE / 2, top: '50%', transform: 'translateY(-50%)' }, isVertical: false },
  };

  return (
    <>
      {/* Corner handles */}
      {(['nw', 'ne', 'sw', 'se'] as const).map((direction) => (
        <div
          key={direction}
          className="absolute bg-white border-2 border-[#D6FC51] rounded-sm hover:bg-[#D6FC51] transition-colors z-50"
          style={{
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            cursor: CURSOR_MAP[direction],
            ...cornerPositions[direction],
          }}
          onMouseDown={(e) => handleResizeMouseDown(direction, e)}
        />
      ))}

      {/* Edge handles */}
      {(['n', 's', 'e', 'w'] as const).map((direction) => {
        const { style, isVertical } = edgePositions[direction];
        return (
          <div
            key={direction}
            className="absolute bg-white/80 border border-[#D6FC51] rounded-full hover:bg-[#D6FC51] transition-colors z-50"
            style={{
              width: isVertical ? EDGE_SIZE * 3 : EDGE_SIZE,
              height: isVertical ? EDGE_SIZE : EDGE_SIZE * 3,
              cursor: CURSOR_MAP[direction],
              ...style,
            }}
            onMouseDown={(e) => handleResizeMouseDown(direction, e)}
          />
        );
      })}
    </>
  );
}
