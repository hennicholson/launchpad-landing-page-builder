"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface VideoMuteButtonProps {
  isMuted: boolean;
  onToggle: () => void;
  className?: string;
}

export function VideoMuteButton({
  isMuted,
  onToggle,
  className
}: VideoMuteButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/40 transition-colors ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isMuted ? "Unmute video" : "Mute video"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isMuted ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </motion.div>
      <span className="text-xs sm:text-sm text-white font-medium">
        {isMuted ? "Unmute" : "Mute"}
      </span>
    </motion.button>
  );
}
