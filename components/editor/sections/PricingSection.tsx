"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import PricingSectionBase from "@/components/shared/sections/PricingSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function PricingSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <PricingSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={getSectionTypography(section, page)}
      contentWidth={page.contentWidth}
      renderText={(props) => (
        <EditableText
          value={props.value}
          sectionId={props.sectionId}
          field={props.field}
          itemId={props.itemId}
          className={props.className}
          useElementStyles
        />
      )}
    />
  );
}
