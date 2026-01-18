"use client";

import type { BackgroundEffect } from "@/lib/page-schema";
import {
  ElegantShapesBackground,
  BackgroundCirclesBackground,
  BackgroundPathsBackground,
  GlowBackground,
  ShootingStarsBackground,
  StarsBackground,
  WavyBackground,
} from "@/components/ui/backgrounds";

export interface SectionBackgroundProps {
  effect?: BackgroundEffect;
  className?: string;
}

/**
 * Renders the selected background effect for a section.
 * All effects are positioned absolutely with inset-0 and should be placed
 * within a relative container with overflow-hidden.
 * Backgrounds fill the entire section container (including padding areas).
 */
export function SectionBackground({ effect, className }: SectionBackgroundProps) {
  if (!effect || effect === "none") {
    return null;
  }

  switch (effect) {
    case "elegant-shapes":
      return <ElegantShapesBackground className={className} />;
    case "background-circles":
      return <BackgroundCirclesBackground className={className} />;
    case "background-paths":
      return <BackgroundPathsBackground className={className} />;
    case "glow":
      return <GlowBackground className={className} variant="center" />;
    case "shooting-stars":
      return <ShootingStarsBackground className={className} />;
    case "stars-background":
      return <StarsBackground className={className} />;
    case "wavy-background":
      return <WavyBackground className={className} />;
    default:
      return null;
  }
}
