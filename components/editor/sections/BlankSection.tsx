"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import BlankSectionBase from "@/components/shared/sections/BlankSectionBase";

type Props = {
  section: PageSection;
};

export default function BlankSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <BlankSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
      contentWidth={page.contentWidth}
    />
  );
}
