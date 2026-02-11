"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import CreatorSectionBase from "@/components/shared/sections/CreatorSectionBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default function CreatorSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <CreatorSectionBase
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
          className={props.className}
        />
      )}
    />
  );
}
