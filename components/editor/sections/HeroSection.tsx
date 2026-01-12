"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStore } from "@/lib/store";
import HeroSectionBase from "@/components/shared/sections/HeroSectionBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default function HeroSection({ section }: Props) {
  const { page } = useEditorStore();

  return (
    <HeroSectionBase
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
