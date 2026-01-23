"use client";

import { motion } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";

export interface TypewriterTextProps {
  text?: string | string[]; // single string or array for rotating text
  speed?: number; // ms per character, default 50
  deleteSpeed?: number; // ms per character when deleting, default 30
  delay?: number; // delay before starting, default 0
  pauseAfter?: number; // pause after typing before delete, default 1500
  cursor?: boolean; // show blinking cursor, default true
  cursorChar?: string; // cursor character, default '|'
  cursorBlink?: boolean; // animate cursor blink, default true
  loop?: boolean; // loop through array of text, default true
  onComplete?: () => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

/**
 * TypewriterText
 *
 * Classic typewriter effect with optional cursor and text rotation.
 *
 * @example
 * ```tsx
 * <TypewriterText
 *   text={["Hello World", "Welcome Back", "Let's Build"]}
 *   speed={50}
 *   loop
 * />
 * ```
 */
export function TypewriterText({
  text = "",
  speed = 50,
  deleteSpeed = 30,
  delay = 0,
  pauseAfter = 1500,
  cursor = true,
  cursorChar = "|",
  cursorBlink = true,
  loop = true,
  onComplete,
  className = "",
  as: Component = "span",
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const texts = Array.isArray(text) ? text : [text];
  const currentText = texts[currentIndex] || "";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Initial delay
    if (displayText === "" && delay > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText[0] || "");
      }, delay);
      return () => clearTimeout(timeout);
    }

    // Pause after completing current text
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseAfter);
      return () => clearTimeout(timeout);
    }

    // Typing
    if (!isDeleting && displayText !== currentText) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, speed);
    }
    // Finished typing
    else if (!isDeleting && displayText === currentText) {
      if (texts.length > 1) {
        setIsPaused(true);
      } else if (onComplete) {
        onComplete();
      }
    }
    // Deleting
    else if (isDeleting && displayText !== "") {
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      }, deleteSpeed);
    }
    // Finished deleting, move to next text
    else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      if (loop || currentIndex < texts.length - 1) {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    currentText,
    isDeleting,
    isPaused,
    speed,
    deleteSpeed,
    delay,
    pauseAfter,
    texts,
    currentIndex,
    loop,
    onComplete,
  ]);

  return (
    <Component className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={cursorBlink ? { opacity: [1, 0] } : { opacity: 1 }}
          transition={
            cursorBlink
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              : undefined
          }
          style={{ display: "inline-block", marginLeft: "2px" }}
        >
          {cursorChar}
        </motion.span>
      )}
    </Component>
  );
}
