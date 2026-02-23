/**
 * Voice Context Builder
 *
 * Snapshots the current editor state into a lightweight context object
 * for the LLM to understand what the user is looking at and can modify.
 *
 * Optimized for minimal token footprint:
 * - Only selected section + immediate neighbors in section list
 * - Items included only when section has items
 * - Static arrays (section types, element types, theme presets) removed
 *   — these are already encoded in tool schema enums
 */

import type { PageSection, SectionContent } from "../page-schema";
import type { VoiceEditorContext } from "./types";

/**
 * Extract the editable surface of a section for voice context.
 */
function summarizeSection(section: PageSection): VoiceEditorContext['selectedSection'] {
  const c = section.content;
  const variant = c.heroVariant || c.featuresVariant || c.ctaVariant || c.testimonialVariant ||
                  c.galleryVariant || c.statsVariant || c.processVariant || c.videoVariant ||
                  c.headerVariant || undefined;
  return {
    id: section.id,
    type: section.type,
    ...(variant && { variant }),
    heading: c.heading,
    subheading: c.subheading,
    bodyText: c.bodyText,
    buttonText: c.buttonText,
    backgroundColor: c.backgroundColor,
    textColor: c.textColor,
  };
}

/**
 * Build a lightweight voice context from the editor store.
 */
export function buildVoiceContext(store: {
  page: {
    sections: PageSection[];
    colorScheme: { primary: string; secondary: string; accent: string; background: string; text: string };
    typography: { headingFont: string; bodyFont: string };
  };
  selectedSectionId: string | null;
  selectedElementIds: Set<string>;
  selectedItemId: string | null;
  currentEditingBreakpoint: string;
}): VoiceEditorContext {
  const { page, selectedSectionId, selectedElementIds, selectedItemId, currentEditingBreakpoint } = store;

  // Find the selected section
  const selectedIdx = selectedSectionId
    ? page.sections.findIndex((s) => s.id === selectedSectionId)
    : -1;
  const selectedSection = selectedIdx >= 0 ? page.sections[selectedIdx] : undefined;

  // Neighbor-only section list: selected + prev + next
  const sectionList = page.sections
    .filter((_, i) => selectedIdx < 0 || Math.abs(i - selectedIdx) <= 1)
    .map((s) => ({
      id: s.id,
      type: s.type,
      heading: (s.content as SectionContent).heading,
    }));

  // Find the first selected element (if any) within the selected section
  const elementIds = Array.from(selectedElementIds);
  let selectedElement: VoiceEditorContext['selectedElement'] | undefined;
  if (selectedSection && elementIds.length === 1) {
    const el = selectedSection.elements?.find((e) => e.id === elementIds[0]);
    if (el) {
      selectedElement = {
        id: el.id,
        type: el.type,
        content: el.content as Record<string, unknown>,
      };
    }
  }

  // Find the selected item's details (if any)
  const items = selectedSection?.items;
  let selectedItem: VoiceEditorContext['selectedItem'] | undefined;
  if (selectedItemId && items) {
    const item = items.find((i) => i.id === selectedItemId);
    if (item) {
      selectedItem = {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        quote: item.quote,
        name: item.name,
        role: item.role,
        label: item.label,
      };
    }
  }

  // Items list — only when section has items
  const sectionItems: VoiceEditorContext['sectionItems'] = items && items.length > 0
    ? items.map((item) => ({
        id: item.id,
        title: item.title,
        name: item.name,
        price: item.price,
      }))
    : undefined;

  return {
    selectedSectionId,
    selectedSection: selectedSection ? summarizeSection(selectedSection) : undefined,
    selectedElementIds: elementIds,
    selectedElement,
    selectedItemId,
    selectedItem,
    sectionItems,
    colorScheme: page.colorScheme,
    typography: page.typography,
    sectionList,
    currentBreakpoint: currentEditingBreakpoint,
  };
}
