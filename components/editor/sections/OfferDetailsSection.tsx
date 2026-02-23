"use client";

import React from "react";
import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import OfferDetailsSectionBase from "@/components/shared/sections/OfferDetailsSectionBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default React.memo(function OfferDetailsSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <OfferDetailsSectionBase
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
      renderImage={(props) => (
        <EditableImage
          value={props.value}
          alt={props.alt}
          sectionId={props.sectionId}
          field={props.field}
          itemId={props.itemId}
          className={props.className}
        />
      )}
    />
  );
});
