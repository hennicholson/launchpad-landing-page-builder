"use client";

import React from "react";
import type { PageSection, LandingPage } from "@/lib/page-schema";
import { ColorInput } from "../shared-controls";

export function ColorControls({
  section,
  sectionId,
  page,
  updateSectionContent,
}: {
  section: PageSection;
  sectionId: string;
  page: LandingPage;
  updateSectionContent: (id: string, content: any) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <ColorInput
        label="Background"
        value={section.content.backgroundColor || "#0a0a0a"}
        onChange={(v) => updateSectionContent(sectionId, { backgroundColor: v })}
      />
      <ColorInput
        label="Text"
        value={section.content.textColor || "#ffffff"}
        onChange={(v) => updateSectionContent(sectionId, { textColor: v })}
      />
      <ColorInput
        label="Accent"
        value={section.content.accentColor || page.colorScheme.accent}
        onChange={(v) => updateSectionContent(sectionId, { accentColor: v })}
      />
    </div>
  );
}
