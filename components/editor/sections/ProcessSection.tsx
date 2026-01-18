"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import ProcessSectionBase from "@/components/shared/sections/ProcessSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function ProcessSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <ProcessSectionBase
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
