"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import ComparisonSectionBase from "@/components/shared/sections/ComparisonSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function ComparisonSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <ComparisonSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
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
