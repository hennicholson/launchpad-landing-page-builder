"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import LoaderSectionBase from "@/components/shared/sections/LoaderSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function LoaderSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <LoaderSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
      contentWidth={page.contentWidth}
      renderText={(props) => (
        <EditableText
          value={props.value}
          sectionId={props.sectionId}
          field={props.field}
          className={props.className}
          useElementStyles
        />
      )}
    />
  );
}
