import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { FeaturesVariant } from "@/lib/page-schema";
import FeaturesDefault from "./features-variants/FeaturesDefault";
import FeaturesIllustratedBase from "./FeaturesIllustratedBase";
import FeaturesHoverBase from "./FeaturesHoverBase";
import FeaturesBentoBase from "./FeaturesBentoBase";
import CustomersTableBase from "./CustomersTableBase";

export default function FeaturesSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const variant: FeaturesVariant = content.featuresVariant || "default";

  // Shared props for all variants
  const sharedProps = {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
  };

  // Route to appropriate variant component
  if (variant === "default") {
    return <FeaturesDefault {...sharedProps} />;
  }
  if (variant === "illustrated") {
    return <FeaturesIllustratedBase {...sharedProps} />;
  }
  if (variant === "hover") {
    return <FeaturesHoverBase {...sharedProps} />;
  }
  if (variant === "bento") {
    return <FeaturesBentoBase {...sharedProps} />;
  }
  if (variant === "table") {
    return <CustomersTableBase {...sharedProps} />;
  }

  // Fallback to default
  return <FeaturesDefault {...sharedProps} />;
}
