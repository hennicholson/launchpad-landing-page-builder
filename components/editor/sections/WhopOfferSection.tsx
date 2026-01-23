"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { OfferBento3D } from "@/components/shared/sections/whop-university";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

type Props = {
  section: PageSection;
};

export default function WhopOfferSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <OfferBento3D
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
      renderText={(props) => (
        <EditableText
          {...props}
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
