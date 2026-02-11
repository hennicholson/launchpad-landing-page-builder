"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  FileText,
  Palette,
  Layout,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";
import type { AILevel, AIAction } from "@/lib/ai";

interface AICommandInputProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string | null;
}

// Map commands to AI levels and actions
const COMMAND_CONFIG: Record<string, { level: AILevel; action: AIAction }> = {
  "improve": { level: 1, action: "improve-text" },
  "rewrite": { level: 1, action: "rewrite" },
  "shorten": { level: 1, action: "shorten" },
  "expand": { level: 1, action: "expand" },
  "colors": { level: 2, action: "suggest-colors" },
  "add-section": { level: 3, action: "generate-section" },
  "improve-section": { level: 3, action: "edit-section" },
  "generate-page": { level: 4, action: "generate-page" },
};

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  command: string;
  category: "text" | "visual" | "section" | "page";
}

const COMMAND_SUGGESTIONS: CommandSuggestion[] = [
  // Text improvements
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Improve copy",
    description: "Make text more compelling",
    command: "/improve",
    category: "text",
  },
  {
    icon: <Wand2 className="w-4 h-4" />,
    label: "Rewrite",
    description: "Completely rewrite the text",
    command: "/rewrite",
    category: "text",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Shorten",
    description: "Make it more concise",
    command: "/shorten",
    category: "text",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Expand",
    description: "Add more detail",
    command: "/expand",
    category: "text",
  },
  // Visual
  {
    icon: <Palette className="w-4 h-4" />,
    label: "Suggest colors",
    description: "Generate a new color scheme",
    command: "/colors",
    category: "visual",
  },
  // Section
  {
    icon: <Layout className="w-4 h-4" />,
    label: "Add section",
    description: "Generate a new section",
    command: "/add-section",
    category: "section",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: "Improve section",
    description: "Enhance the current section",
    command: "/improve-section",
    category: "section",
  },
  // Page
  {
    icon: <FileText className="w-4 h-4" />,
    label: "Generate page",
    description: "Create a full landing page",
    command: "/generate-page",
    category: "page",
  },
];

export function AICommandInput({
  isOpen,
  onClose,
  sectionId,
}: AICommandInputProps) {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<CommandSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get page data from store
  const page = useEditorStore((state) => state.page);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const setAIPendingSuggestion = useEditorStore((state) => state.setAIPendingSuggestion);
  const setAILoadingAction = useEditorStore((state) => state.setAILoadingAction);

  // Handle command submission
  const handleSubmit = useCallback(async (command: string) => {
    if (!page) {
      setError("No page loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse the command
      const isSlashCommand = command.startsWith("/");
      let cmd = "generate-page";
      let instruction = command;

      if (isSlashCommand) {
        const parts = command.split(" ");
        cmd = parts[0].slice(1); // Remove leading /
        instruction = parts.slice(1).join(" ") || command;
      }

      // Get level and action from config
      const config = COMMAND_CONFIG[cmd] || { level: 4 as AILevel, action: "generate-page" as AIAction };
      const { level, action } = config;

      // Set loading action in store for UI feedback
      setAILoadingAction(action);

      // Build request body with correct field names
      const requestBody = {
        level,
        action,
        instruction: instruction || `${action} the content`,
        page,
        selectedSectionId: sectionId || selectedSectionId || undefined,
      };

      // Call the AI API
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "AI request failed");
      }

      console.log("AI result:", result);

      // Set the pending suggestion for preview/approval
      if (result.suggestion) {
        setAIPendingSuggestion({
          type: level <= 2 ? "text" : level === 3 ? "section" : "page",
          sectionId: sectionId || selectedSectionId || undefined,
          original: null,
          proposed: result.suggestion,
        });
      }

      // Close the command input after successful submission
      onClose();
    } catch (err) {
      console.error("AI command failed:", err);
      setError(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setIsLoading(false);
      setAILoadingAction(null);
    }
  }, [page, sectionId, selectedSectionId, onClose, setAIPendingSuggestion, setAILoadingAction]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter suggestions based on input
  useEffect(() => {
    if (input.startsWith("/")) {
      const query = input.slice(1).toLowerCase();
      const filtered = COMMAND_SUGGESTIONS.filter(
        (s) =>
          s.label.toLowerCase().includes(query) ||
          s.command.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
      setFilteredSuggestions(filtered);
      setSelectedIndex(0);
    } else if (input.length === 0) {
      setFilteredSuggestions(COMMAND_SUGGESTIONS.slice(0, 6));
    } else {
      setFilteredSuggestions([]);
    }
  }, [input]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      }

      if (e.key === "Tab" && filteredSuggestions.length > 0) {
        e.preventDefault();
        const selected = filteredSuggestions[selectedIndex];
        if (selected) {
          setInput(selected.command + " ");
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (input.trim()) {
          handleSubmit(input.trim());
          setInput("");
        }
        return;
      }
    },
    [filteredSuggestions, selectedIndex, input, onClose, handleSubmit]
  );

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: CommandSuggestion) => {
    setInput(suggestion.command + " ");
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Input area */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI to help... (try /improve, /add-section, /generate-page)"
              className="flex-1 bg-transparent text-white placeholder-white/40 text-base outline-none"
              disabled={isLoading}
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.command}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    index === selectedIndex
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg",
                      suggestion.category === "text" && "bg-blue-500/20 text-blue-400",
                      suggestion.category === "visual" && "bg-purple-500/20 text-purple-400",
                      suggestion.category === "section" && "bg-green-500/20 text-green-400",
                      suggestion.category === "page" && "bg-orange-500/20 text-orange-400"
                    )}
                  >
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{suggestion.label}</div>
                    <div className="text-sm text-white/50 truncate">
                      {suggestion.description}
                    </div>
                  </div>
                  <span className="text-xs text-white/30 font-mono">
                    {suggestion.command}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="p-4 border-t border-red-500/20 bg-red-500/10">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Natural language hint */}
          {input.length > 0 && !input.startsWith("/") && !error && (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <ArrowRight className="w-4 h-4" />
                <span>Press Enter to send: "{input}"</span>
              </div>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 text-xs text-white/40">
            <div className="flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Tab</kbd> autocomplete
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Enter</kbd> submit
              </span>
            </div>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd> close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AICommandInput;
