"use client";

import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import ValuePropositionSectionBase from "@/components/shared/sections/ValuePropositionSectionBase";
import EditableText from "../EditableText";
import EditableRichText from "../EditableRichText";

type Props = {
  section: PageSection;
};

export default function ValuePropositionSection({ section }: Props) {
  const { page } = useEditorStoreOrPublished();

  return (
    <ValuePropositionSectionBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
      contentWidth={page.contentWidth}
      renderText={(props) => {
        // Use EditableRichText for bodyParagraphs (rich text), EditableText for others (plain text)
        if (props.isRichText && props.paragraphIndex !== undefined) {
          return (
            <EditableRichText
              value={props.value}
              sectionId={props.sectionId}
              field={props.field}
              paragraphIndex={props.paragraphIndex}
              className={props.className}
              style={props.style}
              isRichText={true}
            />
          );
        }

        // Use regular EditableText for heading, badge, etc.
        return (
          <EditableText
            value={props.value}
            sectionId={props.sectionId}
            field={props.field}
            className={props.className}
            style={props.style}
            useElementStyles
          />
        );
      }}
    />
  );
}
