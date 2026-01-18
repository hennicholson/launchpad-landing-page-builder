import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import FeaturesHoverBase from "@/components/shared/sections/FeaturesHoverBase";
import EditableText from "../EditableText";

export default function FeaturesHoverSection({
  section,
}: {
  section: PageSection;
}) {
  const { page } = useEditorStoreOrPublished();

  return (
    <FeaturesHoverBase
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
