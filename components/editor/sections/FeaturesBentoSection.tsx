import React from "react";
import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import FeaturesBentoBase from "@/components/shared/sections/FeaturesBentoBase";
import EditableText from "../EditableText";

export default React.memo(function FeaturesBentoSection({
  section,
}: {
  section: PageSection;
}) {
  const { page } = useEditorStoreOrPublished();

  return (
    <FeaturesBentoBase
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
