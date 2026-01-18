"use client";

// This component is no longer used as a floating panel.
// The styling functionality has been moved to the PropertyPanel's Style tab.
// This file is kept for backward compatibility and to handle keyboard shortcuts.

import { useEffect } from "react";
import { useEditorStore } from "@/lib/store";

export default function ElementStylePanel() {
  const closeElementStylePanel = useEditorStore((s) => s.closeElementStylePanel);
  const elementStylePanel = useEditorStore((s) => s.elementStylePanel);

  // Close on escape - keep this behavior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && elementStylePanel) {
        closeElementStylePanel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeElementStylePanel, elementStylePanel]);

  // Don't render anything - the style panel is now in PropertyPanel
  return null;
}
