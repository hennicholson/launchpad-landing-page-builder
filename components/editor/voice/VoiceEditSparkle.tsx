"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VoiceEditSparkle — visual feedback overlay when the voice agent edits a section.
 *
 * Positions itself over the target section DOM element using getBoundingClientRect.
 * Shows a brief shimmer border + sparkle particles, then fades out.
 */
export function VoiceEditSparkle({
  sectionId,
}: {
  sectionId: string | null;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!sectionId) {
      setRect(null);
      return;
    }

    // Find the section element in the canvas
    const el = document.getElementById(`section-${sectionId}`);
    if (!el) {
      setRect(null);
      return;
    }

    // Update position on mount and track for the effect duration
    const updateRect = () => {
      const r = el.getBoundingClientRect();
      setRect(r);
    };
    updateRect();

    // Track position in case of scroll during effect
    rafRef.current = requestAnimationFrame(function track() {
      updateRect();
      rafRef.current = requestAnimationFrame(track);
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [sectionId]);

  return (
    <AnimatePresence>
      {sectionId && rect && (
        <motion.div
          key={sectionId + '-' + Date.now()}
          className="fixed pointer-events-none z-[9998]"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Shimmer border */}
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                border: '2px solid transparent',
                background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.4), rgba(52,211,153,0.6), rgba(52,211,153,0.4), transparent) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'voice-sparkle-shimmer 0.6s ease-out',
              }}
            />
          </div>

          {/* Corner sparkle dots */}
          {[
            { top: -2, left: -2 },
            { top: -2, right: -2 },
            { bottom: -2, left: -2 },
            { bottom: -2, right: -2 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={pos as React.CSSProperties}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            />
          ))}

          {/* Subtle glow overlay */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: '0 0 20px rgba(52,211,153,0.15), inset 0 0 20px rgba(52,211,153,0.05)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
