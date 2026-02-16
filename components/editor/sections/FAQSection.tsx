"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import FAQSectionBase from "@/components/shared/sections/FAQSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function FAQSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <FAQSectionBase
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
