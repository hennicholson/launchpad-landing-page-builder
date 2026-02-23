"use client";

import { useEffect, useRef } from "react";

type TranscriptEntry = {
  id: string;
  text: string;
  acknowledgment?: string;
  timestamp: number;
};

export function VoiceTranscript({
  entries,
  liveTranscript,
}: {
  entries: TranscriptEntry[];
  liveTranscript: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, liveTranscript]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto space-y-2 px-3 py-2 max-h-32 scrollbar-thin scrollbar-thumb-white/10"
    >
      {entries.map((entry) => (
        <div key={entry.id} className="space-y-0.5">
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="text-white/30 mr-1.5">You:</span>
            {entry.text}
          </p>
          {entry.acknowledgment && (
            <p className="text-xs text-emerald-400/70 leading-relaxed">
              <span className="text-emerald-400/40 mr-1.5">AI:</span>
              {entry.acknowledgment}
            </p>
          )}
        </div>
      ))}
      {liveTranscript && (
        <p className="text-xs text-white/70 leading-relaxed animate-pulse">
          <span className="text-white/30 mr-1.5">You:</span>
          {liveTranscript}
          <span className="inline-block w-0.5 h-3 bg-white/50 ml-0.5 animate-blink" />
        </p>
      )}
      {entries.length === 0 && !liveTranscript && (
        <p className="text-xs text-white/30 text-center py-3">
          Start speaking to edit your page...
        </p>
      )}
    </div>
  );
}
