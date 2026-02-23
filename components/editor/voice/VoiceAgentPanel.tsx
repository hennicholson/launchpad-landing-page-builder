"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useDragControls } from "framer-motion";
import { Mic, X, Volume2, GripHorizontal, AlertCircle } from "lucide-react";
import { useVoiceAgent } from "@/hooks/use-voice-agent";
import { VoiceTranscript } from "./VoiceTranscript";
import { VoiceEditSparkle } from "./VoiceEditSparkle";
import type { VoiceConnectionState } from "@/lib/voice/types";

type TranscriptEntry = {
  id: string;
  text: string;
  acknowledgment?: string;
  timestamp: number;
};

const STATE_LABELS: Record<VoiceConnectionState, string> = {
  disconnected: "Disconnected",
  connecting: "Connecting...",
  connected: "Ready",
  listening: "Listening...",
  processing: "Thinking...",
  speaking: "Speaking...",
  error: "Error",
};

const STATE_DOT_COLORS: Record<VoiceConnectionState, string> = {
  disconnected: "bg-white/30",
  connecting: "bg-amber-400 animate-pulse",
  connected: "bg-emerald-400",
  listening: "bg-emerald-400 animate-pulse",
  processing: "bg-amber-400 animate-pulse",
  speaking: "bg-blue-400 animate-pulse",
  error: "bg-red-400",
};

export function VoiceAgentPanel({
  onClose,
}: {
  onClose: () => void;
}) {
  const {
    connectionState,
    transcript,
    aiTranscript,
    isEnabled,
    isSpeaking,
    error,
    voiceEditedSectionId,
    toggle,
    startSpeaking,
    stopSpeaking,
    getAnalyserNode,
  } = useVoiceAgent();

  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const prevConnectionStateRef = useRef(connectionState);

  // Track when AI finishes responding — add entry
  useEffect(() => {
    const prevState = prevConnectionStateRef.current;
    prevConnectionStateRef.current = connectionState;

    // When transitioning from processing/speaking to connected, the response is done
    if (
      connectionState === "connected" &&
      (prevState === "processing" || prevState === "speaking") &&
      (transcript || aiTranscript)
    ) {
      setEntries((prev) => [
        ...prev.slice(-19),
        {
          id: Date.now().toString(),
          text: transcript || "...",
          acknowledgment: aiTranscript || undefined,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [connectionState, transcript, aiTranscript]);

  // Audio visualization
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = getAnalyserNode();
    if (!canvas || !analyser) {
      animationRef.current = requestAnimationFrame(drawWaveform);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isSpeaking
      ? "rgba(52, 211, 153, 0.8)"
      : connectionState === "processing"
        ? "rgba(251, 191, 36, 0.5)"
        : connectionState === "speaking"
          ? "rgba(96, 165, 250, 0.6)"
          : "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    animationRef.current = requestAnimationFrame(drawWaveform);
  }, [connectionState, isSpeaking, getAnalyserNode]);

  useEffect(() => {
    if (isEnabled) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isEnabled, drawWaveform]);

  // Auto-connect when panel opens
  useEffect(() => {
    if (!isEnabled) {
      toggle();
    }
  }, []);

  // Push-to-talk handlers
  const handleMicDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (connectionState === "connected" || connectionState === "listening") {
        startSpeaking();
      }
    },
    [connectionState, startSpeaking]
  );

  const handleMicUp = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (isSpeaking) {
        stopSpeaking();
      }
    },
    [isSpeaking, stopSpeaking]
  );

  // Prevent context menu on long press
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const isReady =
    connectionState === "connected" ||
    connectionState === "listening" ||
    connectionState === "processing" ||
    connectionState === "speaking";

  return (
    <>
      {/* Full-screen drag boundary */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 z-[10000] pointer-events-none"
      />

      {/* Draggable panel */}
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 right-6 z-[10000] w-[420px] max-w-[calc(100vw-2rem)]"
        style={{ touchAction: "none" }}
      >
        <div
          className={`rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden transition-shadow duration-200 ${
            isDragging ? "shadow-[0_25px_60px_rgba(0,0,0,0.5)]" : ""
          }`}
        >
          {/* Drag handle + Header */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className={`flex items-center justify-between px-4 py-2.5 border-b border-white/5 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GripHorizontal className="w-4 h-4 text-white/20" />
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${STATE_DOT_COLORS[connectionState]}`}
                />
                <span className="text-xs text-white/50 font-medium">
                  {STATE_LABELS[connectionState]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/40" />
              </button>
            </div>
          </div>

          {/* Waveform visualization */}
          <div className="px-4 py-2 border-b border-white/5">
            <canvas
              ref={canvasRef}
              width={380}
              height={40}
              className="w-full h-10 rounded-md bg-white/[0.02]"
            />
          </div>

          {/* Transcript area */}
          <VoiceTranscript
            entries={entries}
            liveTranscript={
              isSpeaking
                ? transcript || "Listening..."
                : connectionState === "processing" || connectionState === "speaking"
                  ? aiTranscript
                    ? `AI: ${aiTranscript}`
                    : ""
                  : ""
            }
          />

          {/* Error display */}
          {error && (
            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-400/70 flex-shrink-0" />
                <span className="text-xs text-red-400/70 truncate">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* AI response preview */}
          {aiTranscript && !error && connectionState === "connected" && (
            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-blue-400/60 flex-shrink-0" />
                <span className="text-xs text-blue-400/70 truncate">
                  {aiTranscript}
                </span>
              </div>
            </div>
          )}

          {/* Footer with push-to-talk mic button */}
          <div className="flex flex-col items-center justify-center px-4 py-3 border-t border-white/5 gap-1.5">
            <button
              onPointerDown={handleMicDown}
              onPointerUp={handleMicUp}
              onPointerLeave={handleMicUp}
              onContextMenu={handleContextMenu}
              disabled={!isReady}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 select-none ${
                isSpeaking
                  ? "bg-emerald-500/30 ring-2 ring-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] scale-110"
                  : connectionState === "processing"
                    ? "bg-amber-500/20 ring-2 ring-amber-400/40"
                    : connectionState === "speaking"
                      ? "bg-blue-500/20 ring-2 ring-blue-400/40"
                      : connectionState === "error"
                        ? "bg-red-500/20 ring-2 ring-red-400/40"
                        : isReady
                          ? "bg-white/10 hover:bg-white/20 active:bg-emerald-500/20 active:ring-2 active:ring-emerald-400/40"
                          : "bg-white/5 opacity-50 cursor-not-allowed"
              }`}
            >
              <Mic
                className={`w-6 h-6 transition-colors ${
                  isSpeaking
                    ? "text-emerald-400"
                    : connectionState === "processing"
                      ? "text-amber-400"
                      : connectionState === "speaking"
                        ? "text-blue-400"
                        : connectionState === "error"
                          ? "text-red-400"
                          : isReady
                            ? "text-white/70"
                            : "text-white/30"
                }`}
              />
              {isSpeaking && (
                <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/30 animate-ping" />
              )}
            </button>
            <span className="text-[10px] text-white/25 select-none">
              {isReady
                ? isSpeaking
                  ? "Release to send"
                  : "Hold Space or mic"
                : connectionState === "connecting"
                  ? "Connecting..."
                  : ""}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sparkle effect overlay when voice edits a section */}
      <VoiceEditSparkle sectionId={voiceEditedSectionId} />
    </>
  );
}
