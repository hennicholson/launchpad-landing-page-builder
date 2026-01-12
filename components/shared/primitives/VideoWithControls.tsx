"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

type VideoWithControlsProps = {
  videoUrl: string;
  accentColor?: string;
};

export function VideoWithControls({ videoUrl, accentColor = "#D6FC51" }: VideoWithControlsProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!videoUrl) return null;

  return (
    <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden mt-8">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted
        loop
      />

      {/* Audio toggle button */}
      <motion.button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-2 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#D6FC51]/30 transition-all duration-300 z-10"
        style={{
          ["--accent-color" as string]: accentColor,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMuted ? (
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
        <span className="hidden sm:inline text-xs font-medium text-white/70">
          {isMuted ? "Unmute" : "Sound On"}
        </span>
      </motion.button>
    </div>
  );
}
