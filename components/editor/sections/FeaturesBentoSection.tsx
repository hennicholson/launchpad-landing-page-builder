import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import FeaturesBentoBase from "@/components/shared/sections/FeaturesBentoBase";
import EditableText from "../EditableText";

export default function FeaturesBentoSection({
  section,
}: {
  section: PageSection;
}) {
  const { page } = useEditorStoreOrPublished();

  return (
    <FeaturesBentoBase
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
