import type { AnimationPreset } from "./page-schema";

export type AnimationConfig = {
  // Entry animation values
  initial: {
    opacity: number;
    y: number;
    scale: number;
  };
  // Animation timing
  duration: number;
  stagger: number;
  // Easing function
  ease: number[] | string;
};

export const ANIMATION_CONFIGS: Record<AnimationPreset, AnimationConfig> = {
  none: {
    initial: { opacity: 1, y: 0, scale: 1 },
    duration: 0,
    stagger: 0,
    ease: "linear",
  },
  subtle: {
    initial: { opacity: 0, y: 10, scale: 1 },
    duration: 0.3,
    stagger: 0.05,
    ease: [0.25, 0.1, 0.25, 1],
  },
  moderate: {
    initial: { opacity: 0, y: 20, scale: 1 },
    duration: 0.5,
    stagger: 0.1,
    ease: [0.25, 0.1, 0.25, 1],
  },
  dramatic: {
    initial: { opacity: 0, y: 40, scale: 0.95 },
    duration: 0.7,
    stagger: 0.15,
    ease: [0.25, 0.1, 0.25, 1],
  },
};

// Get animation variants for framer-motion
export function getAnimationVariants(preset: AnimationPreset = "moderate") {
  const config = ANIMATION_CONFIGS[preset];

  return {
    hidden: config.initial,
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  };
}

// Get container variants with stagger
export function getContainerVariants(preset: AnimationPreset = "moderate") {
  const config = ANIMATION_CONFIGS[preset];

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: 0.1,
      },
    },
  };
}

// Get single item animation props (for whileInView usage)
export function getItemAnimation(preset: AnimationPreset = "moderate", delay = 0) {
  const config = ANIMATION_CONFIGS[preset];

  return {
    initial: config.initial,
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-50px" },
    transition: {
      duration: config.duration,
      delay,
      ease: config.ease,
    },
  };
}

// Preset display names for UI
export const ANIMATION_PRESET_LABELS: Record<AnimationPreset, string> = {
  none: "None",
  subtle: "Subtle",
  moderate: "Moderate",
  dramatic: "Dramatic",
};

// Preset descriptions for UI
export const ANIMATION_PRESET_DESCRIPTIONS: Record<AnimationPreset, string> = {
  none: "No animations - content appears instantly",
  subtle: "Quick, professional micro-animations",
  moderate: "Balanced, smooth animations (recommended)",
  dramatic: "Bold, attention-grabbing entrance effects",
};
