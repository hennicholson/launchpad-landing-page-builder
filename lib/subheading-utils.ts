import type { SubheadingAnimation, SubheadingSize, SubheadingWeight } from "./page-schema";

/**
 * Get Framer Motion animation props for subheading
 */
export function getSubheadingAnimation(type: SubheadingAnimation = "fadeUp") {
  const animations = {
    fadeUp: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    blurIn: {
      initial: { opacity: 0, filter: "blur(10px)" },
      whileInView: { opacity: 1, filter: "blur(0px)" },
      transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    slideRight: {
      initial: { opacity: 0, x: -30 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    slideLeft: {
      initial: { opacity: 0, x: 30 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
    },
    stagger: {
      // Will be handled differently in component (word-by-word)
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
    none: {
      initial: {},
      whileInView: {},
      transition: {},
    },
  };

  return animations[type];
}

/**
 * Get Tailwind classes for subheading size
 */
export function getSubheadingSizeClasses(size: SubheadingSize = "base"): string {
  const sizes = {
    sm: "text-sm sm:text-base",           // 14px → 16px
    base: "text-base sm:text-lg",         // 16px → 18px (default)
    lg: "text-lg sm:text-xl",             // 18px → 20px
    xl: "text-xl sm:text-2xl",            // 20px → 24px
  };
  return sizes[size];
}

/**
 * Get Tailwind classes for subheading weight
 */
export function getSubheadingWeightClass(weight: SubheadingWeight = "normal"): string {
  const weights = {
    normal: "font-normal",    // 400
    medium: "font-medium",    // 500
    semibold: "font-semibold", // 600
  };
  return weights[weight];
}

/**
 * Get complete subheading className string
 */
export function getSubheadingClasses(
  size?: SubheadingSize,
  weight?: SubheadingWeight,
  additionalClasses?: string
): string {
  const classes = [
    getSubheadingSizeClasses(size),
    getSubheadingWeightClass(weight),
    "max-w-2xl mx-auto leading-relaxed mt-4",
    "tracking-tight", // Modern SaaS style
    additionalClasses || "",
  ];

  return classes.filter(Boolean).join(" ");
}
