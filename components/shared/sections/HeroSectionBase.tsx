"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { HeroVariant } from "@/lib/page-schema";
import HeroDefault from "./hero-variants/HeroDefault";
import HeroAnimatedPreview from "./hero-variants/HeroAnimatedPreview";
import HeroEmailSignup from "./hero-variants/HeroEmailSignup";
import HeroSalesFunnel from "./hero-variants/HeroSalesFunnel";
import HeroGlassmorphismTrust from "./hero-variants/HeroGlassmorphismTrust";
import HeroEmailGlass from "./hero-variants/HeroEmailGlass";
import HeroFormMulti from "./hero-variants/HeroFormMulti";
import HeroSplitForm from "./hero-variants/HeroSplitForm";

export default function HeroSectionBase(props: BaseSectionProps) {
  const { section, previewMode } = props;
  const variant: HeroVariant = section.content.heroVariant || "default";

  const sharedProps = { ...props, previewMode };

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
  if (variant === "glassmorphism-trust") {
    return <HeroGlassmorphismTrust {...sharedProps} />;
  }
  if (variant === "hero-email-glass") {
    return <HeroEmailGlass {...sharedProps} />;
  }
  if (variant === "hero-form-multi") {
    return <HeroFormMulti {...sharedProps} />;
  }
  if (variant === "hero-split-form") {
    return <HeroSplitForm {...sharedProps} />;
  }

  // Fallback to default for unknown/unimplemented variants
  return <HeroDefault {...sharedProps} />;
}
