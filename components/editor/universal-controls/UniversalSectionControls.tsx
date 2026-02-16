"use client";

import React from "react";
import type { PageSection, SectionType, LandingPage } from "@/lib/page-schema";
import { CollapsibleSection } from "../shared-controls";
import { VisibilityControls } from "./VisibilityControls";
import { SpacingControls } from "./SpacingControls";
import { ColorControls } from "./ColorControls";
import { BackgroundEffectControls } from "./BackgroundEffectControls";
import { AnimationControls } from "./AnimationControls";
import { TypographyControls } from "./TypographyControls";

function countToggledOff(section: PageSection): number {
  let count = 0;
  if (section.content.showHeading === false) count++;
  if (section.content.showSubheading === false) count++;
  if (section.content.showBodyText === false) count++;
  if (section.content.showButton === false) count++;
  if (section.content.showImage === false) count++;
  if (section.content.showVideo === false) count++;
  if (section.content.showBadge === false) count++;
  if (section.content.showItems === false) count++;
  if (section.content.showBrands === false) count++;
  if (section.content.showLinks === false) count++;
  if (section.content.showLogo === false) count++;
  if (section.content.showTagline === false) count++;
  if (section.content.showSocial === false) count++;
  if (section.content.showForItems === false) count++;
  if (section.content.showNotForItems === false) count++;
  if (section.content.showSearchBar === false) count++;
  if (section.content.showBackgroundImage === false) count++;
  if (section.content.showFeatures === false) count++;
  return count;
}

export function UniversalSectionControls({
  section,
  sectionId,
  sectionType,
  page,
  updateSectionContent,
}: {
  section: PageSection;
  sectionId: string;
  sectionType: SectionType;
  page: LandingPage;
  updateSectionContent: (id: string, content: any) => void;
}) {
  const visibilityCount = countToggledOff(section);
  const hasAnimOverride = section.content.sectionAnimationPreset !== undefined;
  const hasTypoOverride = !!(
    section.content.sectionHeadingFont ||
    section.content.sectionBodyFont ||
    section.content.sectionHeadingSizeScale ||
    section.content.sectionTextAlign
  );
  const hasSpacingOverride = !!(
    section.content.sectionContentGap ||
    section.content.sectionMaxWidth ||
    section.content.paddingTop !== undefined ||
    section.content.paddingBottom !== undefined
  );
  const hasColorOverride = !!(
    section.content.backgroundColor ||
    section.content.textColor ||
    section.content.accentColor
  );
  const hasBgEffect = section.content.backgroundEffect && section.content.backgroundEffect !== "none";

  return (
    <div>
      <CollapsibleSection title="Visibility" defaultOpen={false} count={visibilityCount}>
        <VisibilityControls
          section={section}
          sectionId={sectionId}
          sectionType={sectionType}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Animation" defaultOpen={false} count={hasAnimOverride ? 1 : undefined}>
        <AnimationControls
          section={section}
          sectionId={sectionId}
          page={page}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Colors" defaultOpen={false} count={hasColorOverride ? 1 : undefined}>
        <ColorControls
          section={section}
          sectionId={sectionId}
          page={page}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Background Effect" defaultOpen={false} count={hasBgEffect ? 1 : undefined}>
        <BackgroundEffectControls
          section={section}
          sectionId={sectionId}
          page={page}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Spacing" defaultOpen={false} count={hasSpacingOverride ? 1 : undefined}>
        <SpacingControls
          section={section}
          sectionId={sectionId}
          page={page}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
      <CollapsibleSection title="Typography" defaultOpen={false} count={hasTypoOverride ? 1 : undefined}>
        <TypographyControls
          section={section}
          sectionId={sectionId}
          page={page}
          updateSectionContent={updateSectionContent}
        />
      </CollapsibleSection>
    </div>
  );
}
