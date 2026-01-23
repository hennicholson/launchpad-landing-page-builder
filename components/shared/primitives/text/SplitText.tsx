"use client";

import { motion } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { springConfigs, easingFunctions } from "@/lib/animation-utils";

export interface SplitTextProps {
  children: string;
  splitBy?: "word" | "line" | "character"; // default "word"
  staggerDelay?: number; // default 0.05
  duration?: number; // default 0.5
  trigger?: "viewport" | "hover" | "mount" | "manual";
  animate?: boolean; // default true
  effect?: "fade" | "slide-up" | "slide-down" | "scale" | "blur";
  once?: boolean; // default true
  spring?: keyof typeof springConfigs; // default "smoothPremium"
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  renderSegment?: (segment: string, index: number) => ReactNode; // custom render
}

/**
 * SplitText
 *
 * Utility component for splitting text into words, lines, or characters with staggered animations.
 *
 * @example
 * ```tsx
 * <SplitText splitBy="word" effect="slide-up" staggerDelay={0.05}>
 *   Welcome to the future of web design
 * </SplitText>
 * ```
 */
export function SplitText({
  children,
  splitBy = "word",
  staggerDelay = 0.05,
  duration = 0.5,
  trigger = "viewport",
  animate = true,
  effect = "fade",
  once = true,
  spring = "smoothPremium",
  className = "",
  as: Component = "span",
  renderSegment,
}: SplitTextProps) {
  // Split text based on splitBy prop
  const segments = useMemo(() => {
    switch (splitBy) {
      case "character":
        return children.split("");
      case "line":
        return children.split("\n");
      case "word":
      default:
        return children.split(" ");
    }
  }, [children, splitBy]);

  // Get animation variants based on effect
  const getVariants = () => {
    const springConfig = springConfigs[spring];

    switch (effect) {
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", ...springConfig, duration },
          },
        };
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", ...springConfig, duration },
          },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", ...springConfig, duration },
          },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(10px)" },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            transition: { type: "spring", ...springConfig, duration },
          },
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration, ease: easingFunctions.smoothBoth },
          },
        };
    }
  };

  const variants = getVariants();

  // Determine animation trigger
  const shouldAnimate = animate;
  const whileInView = trigger === "viewport" ? "visible" : undefined;
  const initial = trigger === "mount" ? "hidden" : undefined;
  const animateState = trigger === "mount" ? "visible" : undefined;

  return (
    <Component className={className}>
      {segments.map((segment, index) => {
        // Handle empty segments (like spaces in character mode)
        const isSpace = segment === " " || segment === "";
        const displaySegment = isSpace ? "\u00A0" : segment;

        // Custom render function if provided
        if (renderSegment) {
          return (
            <motion.span
              key={`${segment}-${index}`}
              // @ts-expect-error - Framer Motion type mismatch
              variants={shouldAnimate ? variants : undefined}
              initial={initial || (trigger === "viewport" ? "hidden" : undefined)}
              animate={animateState}
              whileInView={whileInView}
              viewport={trigger === "viewport" ? { once, margin: "-100px" } : undefined}
              transition={{ delay: staggerDelay * index }}
              style={{
                display: splitBy === "line" ? "block" : "inline-block",
                whiteSpace: "pre",
              }}
            >
              {renderSegment(segment, index)}
            </motion.span>
          );
        }

        // Default rendering
        return (
          <motion.span
            key={`${segment}-${index}`}
            variants={shouldAnimate ? variants : undefined}
            initial={initial || (trigger === "viewport" ? "hidden" : undefined)}
            animate={animateState}
            whileInView={whileInView}
            viewport={trigger === "viewport" ? { once, margin: "-100px" } : undefined}
            transition={{ delay: staggerDelay * index }}
            style={{
              display: splitBy === "line" ? "block" : "inline-block",
              whiteSpace: "pre",
            }}
          >
            {displaySegment}
            {splitBy === "word" && index < segments.length - 1 && " "}
          </motion.span>
        );
      })}
    </Component>
  );
}
