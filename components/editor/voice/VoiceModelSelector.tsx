"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Model = "haiku" | "sonnet";

const MODEL_OPTIONS: { value: Model; label: string; description: string }[] = [
  { value: "haiku", label: "Haiku", description: "Fast" },
  { value: "sonnet", label: "Sonnet", description: "Capable" },
];

export function VoiceModelSelector({
  value,
  onChange,
}: {
  value: Model;
  onChange: (model: Model) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = MODEL_OPTIONS.find((m) => m.value === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors"
      >
        <span>{selected.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 w-36 rounded-lg bg-zinc-900/95 border border-white/10 shadow-xl backdrop-blur-xl z-50 overflow-hidden">
          {MODEL_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                onChange(m.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                m.value === value
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{m.label}</span>
              <span className="text-white/40">{m.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
