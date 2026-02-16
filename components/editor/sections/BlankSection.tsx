"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import { getSectionTypography } from "@/lib/section-overrides";
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
      typography={getSectionTypography(section, page)}
      contentWidth={page.contentWidth}
    />
  );
}
