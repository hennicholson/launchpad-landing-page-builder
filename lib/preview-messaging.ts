/**
 * Preview Messaging Protocol
 *
 * Typed message types for parent <-> iframe communication
 * used by the iframe-based preview system.
 */

import type { LandingPage, ProjectSettings } from "./page-schema";

// Messages sent from the parent editor to the iframe preview
export type ParentToIframeMessage =
  | { type: "PAGE_DATA_UPDATE"; page: LandingPage; settings?: ProjectSettings; projectId?: string }
  | { type: "VIEWPORT_CHANGE"; viewport: string };

// Messages sent from the iframe preview back to the parent editor
export type IframeToParentMessage =
  | { type: "IFRAME_READY" }
  | { type: "CONTENT_HEIGHT"; height: number };

/**
 * Send a typed message to an iframe element
 */
export function sendToIframe(
  iframe: HTMLIFrameElement,
  message: ParentToIframeMessage
): void {
  if (!iframe.contentWindow) return;
  iframe.contentWindow.postMessage(message, window.location.origin);
}

/**
 * Listen for typed messages from an iframe.
 * Returns a cleanup function to remove the listener.
 */
export function listenForIframeMessages(
  callback: (message: IframeToParentMessage) => void
): () => void {
  const handler = (event: MessageEvent) => {
    // Only accept messages from our own origin
    if (event.origin !== window.location.origin) return;

    const data = event.data;
    if (!data || typeof data.type !== "string") return;

    // Validate message types
    if (data.type === "IFRAME_READY" || data.type === "CONTENT_HEIGHT") {
      callback(data as IframeToParentMessage);
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

/**
 * Listen for typed messages from the parent window (used inside iframe).
 * Returns a cleanup function to remove the listener.
 */
export function listenForParentMessages(
  callback: (message: ParentToIframeMessage) => void
): () => void {
  const handler = (event: MessageEvent) => {
    // Only accept messages from our own origin
    if (event.origin !== window.location.origin) return;

    const data = event.data;
    if (!data || typeof data.type !== "string") return;

    // Validate message types
    if (data.type === "PAGE_DATA_UPDATE" || data.type === "VIEWPORT_CHANGE") {
      callback(data as ParentToIframeMessage);
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

/**
 * Send a typed message to the parent window (used inside iframe).
 */
export function sendToParent(message: IframeToParentMessage): void {
  if (!window.parent || window.parent === window) return;
  window.parent.postMessage(message, window.location.origin);
}
