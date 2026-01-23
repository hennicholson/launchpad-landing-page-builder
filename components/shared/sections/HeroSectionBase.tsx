"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { HeroVariant } from "@/lib/page-schema";
import HeroDefault from "./hero-variants/HeroDefault";
import HeroAnimatedPreview from "./hero-variants/HeroAnimatedPreview";
import HeroEmailSignup from "./hero-variants/HeroEmailSignup";
import HeroSalesFunnel from "./hero-variants/HeroSalesFunnel";

export default function HeroSectionBase(props: BaseSectionProps) {
  const { section } = props;
  const variant: HeroVariant = section.content.heroVariant || "default";

  const sharedProps = { ...props };

  // Route to appropriate variant component
  if (variant === "sales-funnel") {
    return <HeroSalesFunnel {...sharedProps} />;
  }
  if (variant === "default") {
    return <HeroDefault {...sharedProps} />;
  }
  if (variant === "animated-preview") {
    return <HeroAnimatedPreview {...sharedProps} />;
  }
  if (variant === "email-signup") {
    return <HeroEmailSignup {...sharedProps} />;
  }

  // Fallback to default for unknown/unimplemented variants
  return <HeroDefault {...sharedProps} />;
}
