"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { LandingPage } from "@/lib/page-schema";
import { DEFAULT_DESIGN_WIDTH } from "@/lib/page-schema";
import { PublishedProvider } from "@/lib/published-context";
import SectionRenderer from "@/components/editor/SectionRenderer";
import ElementsLayer from "@/components/editor/ElementsLayer";
import PublishedFontLoader from "@/components/published/PublishedFontLoader";
import {
  listenForParentMessages,
  sendToParent,
  type ParentToIframeMessage,
} from "@/lib/preview-messaging";

/**
 * Iframe Preview Page
 *
 * This is a full Next.js page that renders inside an iframe within the editor.
 * It listens for postMessage events from the parent editor to receive page data,
 * and uses the same rendering pipeline as PublishedPageClient.tsx.
 *
 * Key behaviors:
 * - Sends IFRAME_READY when mounted
 * - Sends CONTENT_HEIGHT on content size changes via ResizeObserver
 * - Renders SectionRenderer + ElementsLayer for each section
 * - No editor chrome — pure page rendering
 */
export default function IframePreviewPage() {
  const [pageData, setPageData] = useState<LandingPage | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const contentRef = useRef<HTMLElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Handle messages from the parent editor
  const handleParentMessage = useCallback((message: ParentToIframeMessage) => {
    switch (message.type) {
      case "PAGE_DATA_UPDATE":
        setPageData(message.page);
        if (message.projectId) setProjectId(message.projectId);
        break;
      case "VIEWPORT_CHANGE":
        // Viewport changes are handled by the iframe width set by the parent
        break;
    }
  }, []);

  // Set up message listener and send IFRAME_READY on mount
  useEffect(() => {
    const cleanup = listenForParentMessages(handleParentMessage);

    // Signal to parent that we're ready to receive data
    sendToParent({ type: "IFRAME_READY" });

    return cleanup;
  }, [handleParentMessage]);

  // Set up ResizeObserver to report content height changes
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        sendToParent({ type: "CONTENT_HEIGHT", height });
      }
    });

    resizeObserverRef.current.observe(contentEl);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [pageData]); // Re-attach when pageData changes since content ref may change

  // Show a loading state until we receive page data
  if (!pageData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#18181b",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
        }}
      >
        Waiting for preview data...
      </div>
    );
  }

  const { sections, colorScheme, typography, smoothScroll } = pageData;

  return (
    <PublishedProvider pageData={pageData} projectId={projectId}>
      <PublishedFontLoader pageData={pageData} />

      {/* Main page content — mirrors PublishedPageClient.tsx */}
      <main
        ref={contentRef}
        className="min-h-screen"
        style={{
          backgroundColor: colorScheme.background,
          color: colorScheme.text,
          fontFamily: typography.bodyFont,
          scrollBehavior: smoothScroll ? "smooth" : "auto",
        }}
      >
        {sections.map((section) => {
          const designWidth =
            pageData.designCanvasWidth || DEFAULT_DESIGN_WIDTH;

          return (
            <div key={section.id} className="relative">
              {/* Section components handle their own padding internally */}
              <SectionRenderer section={section} />
              {section.elements && section.elements.length > 0 && (
                /* Container constrains elements to design width and centers them */
                <div
                  className="absolute inset-0 flex justify-center pointer-events-none"
                  style={{ overflow: "visible" }}
                >
                  <div
                    className="relative w-full pointer-events-none"
                    style={{
                      maxWidth: designWidth,
                      overflow: "visible",
                    }}
                  >
                    <ElementsLayer section={section} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </PublishedProvider>
  );
}
