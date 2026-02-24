"use client";

import { useEffect, useRef } from "react";
import type { SmoothScrollConfig } from "@/lib/page-schema";

export function useLenisScroll(
  enabled: boolean,
  config?: SmoothScrollConfig
) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    let cancelled = false;

    // Dynamic import to avoid SSR issues
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      // Destroy previous instance if exists
      lenisRef.current?.destroy();

      lenisRef.current = new Lenis({
        autoRaf: true,
        lerp: config?.lerp ?? 0.1,
        duration: config?.duration ?? 1.2,
        smoothWheel: true,
        syncTouch: config?.syncTouch ?? false,
      });
    });

    return () => {
      cancelled = true;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [enabled, config?.lerp, config?.duration, config?.syncTouch]);

  return lenisRef;
}
