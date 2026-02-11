"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import StatsSectionBase from "@/components/shared/sections/StatsSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function StatsSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <StatsSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
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
