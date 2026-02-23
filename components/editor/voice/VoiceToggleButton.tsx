"use client";

import { Mic, MicOff } from "lucide-react";
import type { VoiceConnectionState } from "@/lib/voice/types";

const STATE_COLORS: Record<VoiceConnectionState, string> = {
  disconnected: "",
  connecting: "ring-2 ring-amber-400/50 animate-pulse",
  connected: "ring-2 ring-emerald-400/30",
  listening: "ring-2 ring-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.3)]",
  processing: "ring-2 ring-amber-400/60 animate-pulse",
  speaking: "ring-2 ring-blue-400/60",
  error: "ring-2 ring-red-400/60",
};

export function VoiceToggleButton({
  isEnabled,
  connectionState,
  onToggle,
}: {
  isEnabled: boolean;
  connectionState: VoiceConnectionState;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative p-2 rounded-lg transition-all duration-200 ${
        isEnabled
          ? "bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      } ${STATE_COLORS[connectionState]}`}
      title={
        isEnabled
          ? `Voice mode active (${connectionState})`
          : "Toggle voice mode (Cmd+Shift+V)"
      }
    >
      {isEnabled ? (
        <Mic className="w-5 h-5 text-emerald-400" />
      ) : (
        <MicOff className="w-5 h-5 text-white/60" />
      )}
      {isEnabled && connectionState === "listening" && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {isEnabled && connectionState === "processing" && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
      )}
    </button>
  );
}
