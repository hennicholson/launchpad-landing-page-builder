"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStore } from "@/lib/store";
import PricingSectionBase from "@/components/shared/sections/PricingSectionBase";
import EditableText from "../EditableText";

type Props = {
  section: PageSection;
};

export default function PricingSection({ section }: Props) {
  const { page } = useEditorStore();

  return (
    <PricingSectionBase
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
