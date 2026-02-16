"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
import VideoSectionBase from "@/components/shared/sections/VideoSectionBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default function VideoSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <VideoSectionBase
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
