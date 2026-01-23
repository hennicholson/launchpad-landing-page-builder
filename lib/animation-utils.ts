/**
 * Animation Utilities
 * Centralized spring configurations, easing functions, and duration standards
 */

// Spring Physics Configurations
export const springConfigs = {
  ultraResponsive: {
    stiffness: 400,
    damping: 25,
    bounce: 0.2,
  },
  smoothPremium: {
    stiffness: 300,
    damping: 30,
    bounce: 0.25,
  },
  gentlePhysics: {
    stiffness: 100,
    damping: 35,
    bounce: 0.1,
  },
  elasticPlayful: {
    stiffness: 300,
    damping: 20,
    bounce: 0.4,
  },
} as const;

// Easing Functions (cubic-bezier values)
export const easingFunctions = {
  sharpEntrance: [0.16, 1, 0.3, 1] as const, // easeOutExpo
  smoothBoth: [0.645, 0.045, 0.355, 1] as const, // easeInOutCubic
  elastic: [0.68, -0.55, 0.265, 1.55] as const, // easeOutBack
  gentle: [0.25, 0.1, 0.25, 1] as const, // ease-in-out
  linear: [0, 0, 1, 1] as const,
} as const;

// Duration Standards (milliseconds)
export const durations = {
  microInteraction: 200, // 150-300ms
  elementEntrance: 600, // 500-800ms
  sectionTransition: 1000, // 800-1200ms
  continuousAnimation: 3000, // 2000-5000ms
  ambientEffect: 7000, // 5000-10000ms
} as const;

// Animation variant presets
export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.elementEntrance / 1000,
      ease: easingFunctions.smoothBoth,
    },
  },
};

export const blurInVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      ...springConfigs.smoothPremium,
      duration: durations.elementEntrance / 1000,
    },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      ...springConfigs.ultraResponsive,
    },
  },
};

// Helper function to create stagger container variants
export function createStaggerVariants(staggerDelay = 0.1) {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    },
    item: fadeInVariants,
  };
}
