"use client";

import React from "react";
import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import OfferSectionBase from "@/components/shared/sections/OfferSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default React.memo(function OfferSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <OfferSectionBase
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
});
