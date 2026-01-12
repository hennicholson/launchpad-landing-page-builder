"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store";
import type { PageSection } from "@/lib/page-schema";

export default function AIEditModal() {
  const {
    page,
    aiEditingSectionId,
    isAIGenerating,
    closeAIEdit,
    setAIGenerating,
    applyAISection,
  } = useEditorStore();

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const currentSection = page.sections.find((s) => s.id === aiEditingSectionId);

  const handleSubmit = async () => {
    if (!prompt.trim() || !currentSection) return;

    setError(null);
    setAIGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regenerate-section",
          sectionId: currentSection.id,
          sectionType: currentSection.type,
          currentSection: currentSection,
          instructions: prompt,
          pageContext: {
            title: page.title,
            colorScheme: page.colorScheme,
            typography: page.typography,
            existingSections: page.sections.map((s) => s.type),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate section");
      }

      const newSection = (await response.json()) as PageSection;
      applyAISection(currentSection.id, newSection);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setAIGenerating(false);
    }
  };

  if (!aiEditingSectionId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={closeAIEdit}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D6FC51]/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#D6FC51]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Edit with AI</h2>
                <p className="text-xs text-white/50 capitalize">
                  {currentSection?.type} section
                </p>
              </div>
            </div>
            <button
              onClick={closeAIEdit}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Describe the changes you want
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make the headline more urgent and add a countdown timer feel. Use power words like 'exclusive' and 'limited time'..."
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D6FC51] focus:border-transparent resize-none"
                disabled={isAIGenerating}
              />
            </div>

            {/* Example prompts */}
            <div>
              <p className="text-xs text-white/50 mb-2">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Make it more professional",
                  "Add urgency",
                  "More casual tone",
                  "Emphasize benefits",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    disabled={isAIGenerating}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={closeAIEdit}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              disabled={isAIGenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isAIGenerating}
              className="px-5 py-2.5 bg-[#D6FC51] text-black text-sm font-semibold rounded-lg hover:bg-[#D6FC51]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isAIGenerating ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
