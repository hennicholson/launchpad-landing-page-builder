"use client";

interface DropIndicatorProps {
  beforeId: string | null;  // ID of section this indicator is before (null = end)
}

export function DropIndicator({ beforeId }: DropIndicatorProps) {
  return (
    <div
      data-drop-indicator="true"
      data-before={beforeId || "-1"}
      className="my-0.5 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent rounded-full mx-3 opacity-0 transition-opacity duration-150"
      style={{
        boxShadow: "0 0 8px rgba(251, 191, 36, 0.6)",
      }}
    />
  );
}
