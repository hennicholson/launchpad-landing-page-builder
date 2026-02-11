"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import OfferSectionBase from "@/components/shared/sections/OfferSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function OfferSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <OfferSectionBase
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
