"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { splitTextToChars, calculateStaggerDelay } from "@/lib/text-utils";
import { springConfigs } from "@/lib/animation-utils";

export interface CharacterRevealProps {
  children: string;
  trigger?: "viewport" | "hover" | "mount" | "manual";
  staggerDelay?: number; // seconds between each character, auto-calculated if not provided
  duration?: number; // animation duration per character, default 0.5
  direction?: "left-to-right" | "right-to-left" | "center-out" | "random";
  effect?: "fade" | "slide" | "scale" | "blur" | "rotate" | "flip";
  className?: string;
  once?: boolean; // animate only once, default true
  onComplete?: () => void;
  gradientColors?: [string, string]; // optional gradient sweep effect
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"; // HTML element, default "span"
}

/**
 * CharacterReveal
 *
 * Reveals text character-by-character with customizable stagger and effects.
 *
 * @example
 * ```tsx
 * <CharacterReveal
 *   effect="blur"
 *   staggerDelay={0.03}
 *   trigger="viewport"
 * >
 *   Hello World
 * </CharacterReveal>
 * ```
 */
export function CharacterReveal({
  children,
  trigger = "viewport",
  staggerDelay,
  duration = 0.5,
  direction = "left-to-right",
  effect = "fade",
  className = "",
  once = true,
  onComplete,
  gradientColors,
  as: Component = "span",
}: CharacterRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.5 });

  // Split text into characters
  const characters = useMemo(() => splitTextToChars(children), [children]);

  // Auto-calculate stagger delay if not provided
  const delay = staggerDelay || calculateStaggerDelay(characters.length);

  // Determine character order based on direction
  const getCharacterIndex = (index: number) => {
    switch (direction) {
      case "right-to-left":
        return characters.length - 1 - index;
      case "center-out":
        const mid = Math.floor(characters.length / 2);
        const distance = Math.abs(index - mid);
        return distance;
      case "random":
        return Math.random();
      default: // left-to-right
        return index;
    }
  };

  // Effect variants
  const getVariants = () => {
    const baseHidden: any = { opacity: 0 };
    const baseVisible: any = {
      opacity: 1,
      transition: {
        type: "spring",
        ...springConfigs.smoothPremium,
        duration,
      },
    };

    switch (effect) {
      case "slide":
        return {
          hidden: { ...baseHidden, y: 20 },
          visible: { ...baseVisible, y: 0 },
        };
      case "scale":
        return {
          hidden: { ...baseHidden, scale: 0.5 },
          visible: { ...baseVisible, scale: 1 },
        };
      case "blur":
        return {
          hidden: { ...baseHidden, filter: "blur(10px)" },
          visible: { ...baseVisible, filter: "blur(0px)" },
        };
      case "rotate":
        return {
          hidden: { ...baseHidden, rotateY: 90 },
          visible: { ...baseVisible, rotateY: 0 },
        };
      case "flip":
        return {
          hidden: { ...baseHidden, rotateX: -90 },
          visible: { ...baseVisible, rotateX: 0 },
        };
      default: // fade
        return {
          hidden: baseHidden,
          visible: baseVisible,
        };
    }
  };

  const variants = getVariants();

  // Should animate based on trigger
  const shouldAnimate =
    trigger === "mount" ||
    (trigger === "viewport" && isInView) ||
    trigger === "manual";

  return (
    <Component
      ref={ref}
      className={className}
      style={
        gradientColors
          ? {
              backgroundImage: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : undefined
      }
    >
      {characters.map((char, index) => {
        const isSpace = char === " ";
        const characterDelay = delay * getCharacterIndex(index);

        return (
          <motion.span
            key={`${char}-${index}`}
            variants={variants}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            transition={{
              ...variants.visible.transition,
              delay: characterDelay,
            }}
            onAnimationComplete={
              index === characters.length - 1 ? onComplete : undefined
            }
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              width: isSpace ? "0.3em" : "auto",
            }}
          >
            {isSpace ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </Component>
  );
}
