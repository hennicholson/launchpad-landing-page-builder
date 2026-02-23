"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { LandingPage } from "@/lib/page-schema";
import type { PreviewViewport } from "@/lib/responsive-scaling";
import { PREVIEW_VIEWPORTS, PREVIEW_VIEWPORT_HEIGHTS } from "@/lib/responsive-scaling";
import { DEVICE_FRAME_PADDING, calculateFitZoom } from "@/lib/responsive-scaling";
import {
  sendToIframe,
  listenForIframeMessages,
} from "@/lib/preview-messaging";
import DeviceFrame from "./DeviceFrame";

type Props = {
  page: LandingPage;
  viewport: PreviewViewport;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * PreviewIframe — Container component used in Canvas when preview mode is active.
 *
 * - Renders an <iframe src="/preview/iframe">
 * - Sends PAGE_DATA_UPDATE via postMessage on mount and page data changes (debounced 100ms)
 * - Listens for IFRAME_READY to send initial data
 * - Listens for CONTENT_HEIGHT to know iframe content size
 * - Calculates smart zoom to fit the device frame in available space
 * - Wraps iframe in DeviceFrame component
 */
export default function PreviewIframe({ page, viewport, containerRef }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [fitZoom, setFitZoom] = useState(1);
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const pendingDataRef = useRef<LandingPage | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveZoom = manualZoom ?? fitZoom;
  const deviceWidth = PREVIEW_VIEWPORTS[viewport].width;
  const deviceHeight = PREVIEW_VIEWPORT_HEIGHTS[viewport];
  const framePadding = DEVICE_FRAME_PADDING[viewport];

  // Recalculate fit zoom when container size or viewport changes
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const calculateZoom = () => {
      const rect = containerEl.getBoundingClientRect();
      const availableWidth = rect.width - 128; // 32px outer (p-8) + 32px inner padding each side
      const availableHeight = rect.height - 128; // 32px outer (p-8) + 32px inner padding each side
      const zoom = calculateFitZoom(availableWidth, availableHeight, deviceWidth, framePadding);
      setFitZoom(zoom);
    };

    // Calculate immediately
    calculateZoom();

    // Recalculate on resize
    const observer = new ResizeObserver(calculateZoom);
    observer.observe(containerEl);

    return () => observer.disconnect();
  }, [containerRef, deviceWidth, framePadding]);

  // Reset manual zoom when viewport changes (auto-fit)
  useEffect(() => {
    setManualZoom(null);
  }, [viewport]);

  // Send page data to iframe (debounced)
  const sendPageData = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframeReady) {
      return;
    }

    sendToIframe(iframe, {
      type: "PAGE_DATA_UPDATE",
      page,
    });
  }, [page, iframeReady]);

  // Debounced page data sending
  useEffect(() => {
    if (!iframeReady) {
      // Store data to send when iframe becomes ready
      pendingDataRef.current = page;
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      sendPageData();
    }, 100);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [page, iframeReady, sendPageData]);

  // Listen for messages from iframe
  useEffect(() => {
    const cleanup = listenForIframeMessages((message) => {
      switch (message.type) {
        case "IFRAME_READY":
          setIframeReady(true);
          // Send any pending data immediately
          const iframe = iframeRef.current;
          if (iframe) {
            sendToIframe(iframe, {
              type: "PAGE_DATA_UPDATE",
              page: pendingDataRef.current ?? page,
            });
            pendingDataRef.current = null;
          }
          break;
        // CONTENT_HEIGHT intentionally ignored — using fixed viewport heights
        // to prevent vh unit feedback loop (hero min-h-[90vh] → infinite growth)
      }
    });

    return cleanup;
  }, [page]);

  return (
    <div
      className="flex items-start justify-center w-full h-full overflow-auto"
      style={{ padding: 32 }}
    >
      <div
        style={{
          transform: `scale(${effectiveZoom})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease",
        }}
      >
        <DeviceFrame viewport={viewport} contentHeight={deviceHeight}>
          <iframe
            ref={iframeRef}
            src="/preview/iframe"
            title="Page Preview"
            style={{
              width: deviceWidth,
              height: deviceHeight,
              border: "none",
              display: "block",
              backgroundColor: "white",
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        </DeviceFrame>
      </div>
    </div>
  );
}
