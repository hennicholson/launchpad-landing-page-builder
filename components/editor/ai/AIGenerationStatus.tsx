"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIGenerationStatusProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export function AIGenerationStatus({
  isLoading,
  message = "AI is thinking...",
  progress,
}: AIGenerationStatusProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{message}</span>
          {progress !== undefined && (
            <div className="w-32 h-1 mt-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Inline loading indicator for fields
 */
export function AIFieldLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md bg-purple-500/20",
        className
      )}
    >
      <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
      <span className="text-xs text-purple-400">AI improving...</span>
    </div>
  );
}

/**
 * Shimmer effect for loading content
 */
export function AIShimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/5",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default AIGenerationStatus;
