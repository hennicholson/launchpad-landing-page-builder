"use client";

import { cn } from "@/lib/utils";
import type { BackgroundEffect, BackgroundConfig } from "@/lib/page-schema";
import {
  ElegantShapesBackground,
  BackgroundCirclesBackground,
  BackgroundPathsBackground,
  GlowBackground,
  ShootingStarsBackground,
  StarsBackground,
  WavyBackground,
} from "@/components/ui/backgrounds";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MeteorsBackground } from "@/components/ui/meteors";
import { SparklesBackground } from "@/components/ui/sparkles-background";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeams } from "@/components/ui/background-beams";

export interface SectionBackgroundProps {
  effect?: BackgroundEffect;
  config?: BackgroundConfig;
  className?: string;
}

/**
 * Renders the selected background effect for a section.
 * All effects are positioned absolutely with inset-0 and should be placed
 * within a relative container with overflow-hidden.
 * Backgrounds fill the entire section container (including padding areas).
 */
export function SectionBackground({ effect, config, className }: SectionBackgroundProps) {
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
    // Aceternity UI effects
    case "aurora":
      return (
        <AuroraBackground
          className={cn("overflow-hidden pointer-events-none", className)}
          primaryColor={config?.primaryColor}
          secondaryColor={config?.secondaryColor}
          speed={config?.speed}
          blurAmount={config?.blurAmount}
          opacity={config?.intensity}
          showRadialGradient={config?.showRadialGradient ?? true}
        >
          <div />
        </AuroraBackground>
      );
    case "spotlight":
      return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill={config?.primaryColor || "white"}
          />
        </div>
      );
    case "background-beams":
      return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
          <BackgroundBeams className="opacity-50" />
        </div>
      );
    case "meteors":
      return <MeteorsBackground className={className} />;
    case "sparkles":
      return (
        <SparklesBackground
          className={className}
          particleColor={config?.primaryColor || "#FFC700"}
          particleDensity={config?.intensity ? Math.round(config.intensity / 3) : 30}
        />
      );
    default:
      return null;
  }
}
