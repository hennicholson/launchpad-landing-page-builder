"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStore } from "@/lib/store";
import FoundersSectionBase from "@/components/shared/sections/FoundersSectionBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default function FoundersSection({ section }: Props) {
  const { page } = useEditorStore();

  return (
    <FoundersSectionBase
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
      renderImage={(props) => (
        <EditableImage
          value={props.src}
          sectionId={props.sectionId}
          field={props.field}
          itemId={props.itemId}
          className={props.className}
          alt={props.alt}
        />
      )}
    />
  );
}
