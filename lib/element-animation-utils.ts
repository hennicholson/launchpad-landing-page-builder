import type { ElementAnimation } from "./page-schema";
import type { TargetAndTransition, Transition } from "framer-motion";

// Tailwind hover classes for each animation type
export const HOVER_ANIMATION_CLASSES: Record<string, string> = {
  scale: "hover:scale-105 transition-transform duration-200",
  lift: "hover:-translate-y-1 transition-transform duration-200",
  glow: "hover:shadow-[0_0_20px_rgba(214,252,81,0.4)] transition-shadow duration-200",
  bounce: "hover:animate-bounce",
  shake: "hover:animate-pulse", // Using pulse as shake alternative
  pulse: "hover:animate-pulse",
  underline: "hover:underline underline-offset-4 transition-all duration-200",
  fill: "hover:bg-white/10 transition-colors duration-200",
  none: "",
};

// Click animation classes
export const CLICK_ANIMATION_CLASSES: Record<string, string> = {
  press: "active:scale-95 transition-transform duration-100",
  ripple: "active:scale-95", // Ripple would need JS implementation
  bounce: "active:scale-110 transition-transform duration-100",
  none: "",
};

// Get combined animation classes for an element
export function getAnimationClasses(animation?: ElementAnimation): string {
  if (!animation) return "";

  const hoverClass = animation.hover ? HOVER_ANIMATION_CLASSES[animation.hover] || "" : "";
  const clickClass = animation.click ? CLICK_ANIMATION_CLASSES[animation.click] || "" : "";

  return `${hoverClass} ${clickClass}`.trim();
}

// Return type for animation variants
type AnimationVariants = {
  whileHover: TargetAndTransition;
  whileTap: TargetAndTransition;
  transition: Transition;
};

// For framer-motion integration - returns whileHover and whileTap props
export function getAnimationVariants(animation?: ElementAnimation): AnimationVariants {
  if (!animation) {
    return {
      whileHover: {},
      whileTap: {},
      transition: { duration: 0.2 },
    };
  }

  const hoverVariant: TargetAndTransition = {};
  const tapVariant: TargetAndTransition = {};

  // Map hover animations to framer-motion
  switch (animation.hover) {
    case 'scale':
      hoverVariant.scale = 1.05;
      break;
    case 'lift':
      hoverVariant.y = -4;
      break;
    case 'glow':
      hoverVariant.boxShadow = "0 0 20px rgba(214, 252, 81, 0.4)";
      break;
    case 'bounce':
      hoverVariant.y = [0, -8, 0];
      break;
    case 'shake':
      hoverVariant.x = [0, -2, 2, -2, 0];
      break;
    case 'pulse':
      hoverVariant.scale = [1, 1.02, 1];
      break;
  }

  // Map click animations
  switch (animation.click) {
    case 'press':
      tapVariant.scale = 0.95;
      break;
    case 'bounce':
      tapVariant.scale = [1, 0.9, 1.05, 1];
      break;
    case 'ripple':
      tapVariant.scale = 0.98;
      break;
  }

  return {
    whileHover: hoverVariant,
    whileTap: tapVariant,
    transition: { duration: 0.2 },
  };
}

// Get CSS custom properties for neon glow effect
export function getNeonGlowStyle(color: string = '#D6FC51') {
  return {
    boxShadow: `0 0 10px ${color}, 0 0 20px ${color}40, 0 0 30px ${color}20`,
  };
}

// Get 3D button shadow style
export function get3DButtonStyle(baseColor: string = '#D6FC51') {
  // Darken the color for shadow
  return {
    boxShadow: `0 4px 0 ${darkenColor(baseColor, 20)}`,
    transform: 'translateY(0)',
  };
}

export function get3DButtonActiveStyle() {
  return {
    boxShadow: '0 0 0 transparent',
    transform: 'translateY(4px)',
  };
}

// Simple color darkening utility
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}
