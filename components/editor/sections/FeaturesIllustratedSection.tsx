import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import FeaturesIllustratedBase from "@/components/shared/sections/FeaturesIllustratedBase";
import EditableText from "../EditableText";

export default function FeaturesIllustratedSection({
  section,
}: {
  section: PageSection;
}) {
  const { page } = useEditorStoreOrPublished();

  return (
    <FeaturesIllustratedBase
      section={section}
      colorScheme={page.colorScheme}
      typography={page.typography}
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
    />
  );
}
