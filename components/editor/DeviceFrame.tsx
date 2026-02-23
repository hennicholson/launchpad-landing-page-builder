"use client";

import type { ReactNode } from "react";
import type { PreviewViewport } from "@/lib/responsive-scaling";
import { PREVIEW_VIEWPORTS } from "@/lib/responsive-scaling";

type Props = {
  viewport: PreviewViewport;
  children: ReactNode;
  contentHeight?: number;
};

/**
 * DeviceFrame — Pure presentational component that renders device chrome
 * around the iframe preview content.
 *
 * - Mobile: Rounded rectangle with notch at top, home indicator at bottom
 * - Tablet: Thinner bezels, rounded corners
 * - Desktop: Monitor frame with stand
 */
export default function DeviceFrame({ viewport, children, contentHeight }: Props) {
  const deviceWidth = PREVIEW_VIEWPORTS[viewport].width;
  const label = `${deviceWidth} x ${contentHeight ? Math.round(contentHeight) : "..."}`;

  if (viewport === "mobile") {
    return (
      <div className="flex flex-col items-center">
        {/* Phone frame */}
        <div
          className="relative rounded-[40px] bg-[#1a1a1c] shadow-2xl"
          style={{
            padding: "48px 16px 36px 16px",
            border: "3px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Notch / Dynamic Island */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-black rounded-full border border-white/5" />

          {/* Screen area */}
          <div
            className="relative rounded-[8px] overflow-hidden bg-black"
            style={{ width: deviceWidth }}
          >
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full bg-white/20" />
        </div>

        {/* Size label */}
        <div className="mt-3 text-xs text-white/30 font-mono">{label}</div>
      </div>
    );
  }

  if (viewport === "tablet") {
    return (
      <div className="flex flex-col items-center">
        {/* Tablet frame */}
        <div
          className="relative rounded-[20px] bg-[#1a1a1c] shadow-2xl"
          style={{
            padding: "28px 12px 28px 12px",
            border: "3px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Camera dot */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-white/10 rounded-full" />

          {/* Screen area */}
          <div
            className="relative rounded-[4px] overflow-hidden bg-black"
            style={{ width: deviceWidth }}
          >
            {children}
          </div>
        </div>

        {/* Size label */}
        <div className="mt-3 text-xs text-white/30 font-mono">{label}</div>
      </div>
    );
  }

  // Desktop — monitor frame with stand
  return (
    <div className="flex flex-col items-center">
      {/* Monitor frame */}
      <div
        className="relative rounded-t-[12px] bg-[#1a1a1c] shadow-2xl"
        style={{
          padding: "20px 20px 24px 20px",
          border: "3px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
        }}
      >
        {/* Screen area */}
        <div
          className="relative rounded-[4px] overflow-hidden bg-black"
          style={{ width: deviceWidth }}
        >
          {children}
        </div>
      </div>

      {/* Chin / bottom bezel */}
      <div
        className="rounded-b-[12px] bg-[#1a1a1c] flex items-center justify-center"
        style={{
          width: deviceWidth + 46,
          height: 20,
          border: "3px solid rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      />

      {/* Stand neck */}
      <div
        className="bg-[#1a1a1c]"
        style={{
          width: 60,
          height: 24,
          borderLeft: "2px solid rgba(255,255,255,0.06)",
          borderRight: "2px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Stand base */}
      <div
        className="rounded-[4px] bg-[#1a1a1c]"
        style={{
          width: 140,
          height: 8,
          border: "2px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Size label */}
      <div className="mt-3 text-xs text-white/30 font-mono">{label}</div>
    </div>
  );
}
