"use client";

import React from "react";
import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import ComparisonSectionBase from "@/components/shared/sections/ComparisonSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default React.memo(function ComparisonSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <ComparisonSectionBase
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
          style={props.style}
          useElementStyles
        />
      )}
    />
  );
});
