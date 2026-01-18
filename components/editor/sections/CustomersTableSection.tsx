import type { PageSection } from "@/lib/page-schema";
import { useEditorStoreOrPublished } from "@/lib/store";
import CustomersTableBase from "@/components/shared/sections/CustomersTableBase";
import EditableText from "../EditableText";
import EditableImage from "../EditableImage";

export default function CustomersTableSection({
  section,
}: {
  section: PageSection;
}) {
  const { page } = useEditorStoreOrPublished();

  return (
    <CustomersTableBase
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
