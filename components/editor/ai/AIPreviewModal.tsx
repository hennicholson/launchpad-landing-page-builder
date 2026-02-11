"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestion {
  type: "text" | "section" | "page" | "style";
  field?: string;
  sectionId?: string;
  itemId?: string;
  original: unknown;
  proposed: unknown;
}

interface AIPreviewModalProps {
  isOpen: boolean;
  suggestion: AISuggestion | null;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    costCents: number;
  };
}

export function AIPreviewModal({
  isOpen,
  suggestion,
  onApprove,
  onReject,
  onClose,
  usage,
}: AIPreviewModalProps) {
  const [viewMode, setViewMode] = useState<"split" | "original" | "proposed">("split");

  if (!isOpen || !suggestion) return null;

  const renderTextComparison = () => {
    const original = String(suggestion.original || "");
    const proposed = String(suggestion.proposed || "");

    if (viewMode === "original") {
      return (
        <div className="p-6 bg-white/5 rounded-lg">
          <div className="text-xs text-white/50 mb-2">Original</div>
          <p className="text-white text-lg">{original}</p>
        </div>
      );
    }

    if (viewMode === "proposed") {
      return (
        <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="text-xs text-purple-400 mb-2">AI Suggestion</div>
          <p className="text-white text-lg">{proposed}</p>
        </div>
      );
    }

    // Split view
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="text-xs text-white/50 mb-2">Original</div>
          <p className="text-white/80">{original}</p>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="text-xs text-purple-400 mb-2">AI Suggestion</div>
          <p className="text-white">{proposed}</p>
        </div>
      </div>
    );
  };

  const renderJsonComparison = () => {
    const original = JSON.stringify(suggestion.original, null, 2);
    const proposed = JSON.stringify(suggestion.proposed, null, 2);

    return (
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-auto">
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="text-xs text-white/50 mb-2">Original</div>
          <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap">
            {original}
          </pre>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="text-xs text-purple-400 mb-2">AI Suggestion</div>
          <pre className="text-xs text-white font-mono whitespace-pre-wrap">
            {proposed}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="w-full max-w-3xl bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Suggestion</h2>
                <p className="text-sm text-white/50">
                  {suggestion.type === "text" && `Improved ${suggestion.field || "text"}`}
                  {suggestion.type === "section" && "Section update"}
                  {suggestion.type === "page" && "Page generation"}
                  {suggestion.type === "style" && "Style suggestions"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View mode toggle for text */}
          {suggestion.type === "text" && (
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10">
              <span className="text-xs text-white/50 mr-2">View:</span>
              <button
                onClick={() => setViewMode("split")}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  viewMode === "split"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("original")}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  viewMode === "original"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                Original
              </button>
              <button
                onClick={() => setViewMode("proposed")}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  viewMode === "proposed"
                    ? "bg-white/20 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                Proposed
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {suggestion.type === "text" && renderTextComparison()}
            {(suggestion.type === "section" || suggestion.type === "page") &&
              renderJsonComparison()}
            {suggestion.type === "style" && (
              <div className="space-y-4">
                <p className="text-white/70">Style suggestions:</p>
                <pre className="p-4 bg-purple-500/10 rounded-lg text-sm text-white font-mono whitespace-pre-wrap">
                  {JSON.stringify(suggestion.proposed, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
            {/* Usage stats */}
            {usage && (
              <div className="text-xs text-white/40">
                {usage.inputTokens + usage.outputTokens} tokens •{" "}
                ${(usage.costCents / 100).toFixed(4)}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onReject}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIPreviewModal;
