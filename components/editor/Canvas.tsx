"use client";

import { useState, useRef, useEffect } from "react";
import { useEditorStore } from "@/lib/store";
import SectionRenderer from "./SectionRenderer";
import AIEditModal from "./AIEditModal";
import PaddingDragHandle from "./PaddingDragHandle";
import ElementStylePanel from "./ElementStylePanel";
import ElementsLayer from "./ElementsLayer";
import type { SectionType, PageSection, ElementType, Breakpoint } from "@/lib/page-schema";
import { PREVIEW_VIEWPORTS, type PreviewViewport } from "@/lib/responsive-scaling";

// Section categories for the dropdown
const SECTION_CATEGORIES = {
  blank: {
    label: "Blank",
    sections: ["blank"] as SectionType[],
  },
  navigation: {
    label: "Navigation",
    sections: ["header", "footer"] as SectionType[],
  },
  hero: {
    label: "Hero",
    sections: ["hero"] as SectionType[],
  },
  content: {
    label: "Content",
    sections: ["features", "faq", "process", "comparison", "video", "gallery", "founders", "audience"] as SectionType[],
  },
  socialProof: {
    label: "Social Proof",
    sections: ["testimonials", "logoCloud", "stats", "credibility"] as SectionType[],
  },
  conversion: {
    label: "Conversion",
    sections: ["cta", "pricing", "offer"] as SectionType[],
  },
};

// Display names for section types
const SECTION_NAMES: Record<SectionType, string> = {
  blank: "Blank Canvas",
  header: "Header",
  footer: "Footer",
  hero: "Hero",
  features: "Features",
  faq: "FAQ",
  process: "Process",
  comparison: "Comparison",
  video: "Video",
  gallery: "Gallery",
  founders: "Founders",
  audience: "Audience",
  testimonials: "Testimonials",
  logoCloud: "Logo Cloud",
  stats: "Stats",
  credibility: "Credibility",
  cta: "Call to Action",
  pricing: "Pricing",
  offer: "Offer",
};

// Default padding values for each section type (in pixels)
// These match the original Tailwind classes that were used
const DEFAULT_SECTION_PADDING: Record<SectionType, { top: number; bottom: number }> = {
  blank: { top: 48, bottom: 48 },
  header: { top: 0, bottom: 0 }, // Headers handle their own padding
  footer: { top: 48, bottom: 64 }, // py-12 lg:py-16
  hero: { top: 48, bottom: 48 }, // pt-12 pb-12
  features: { top: 64, bottom: 96 }, // py-16 lg:py-24
  faq: { top: 80, bottom: 128 }, // py-20 lg:py-32
  process: { top: 80, bottom: 128 }, // py-20 lg:py-32
  comparison: { top: 80, bottom: 128 }, // py-20 lg:py-32
  video: { top: 80, bottom: 128 }, // py-20 lg:py-32
  gallery: { top: 80, bottom: 128 }, // py-20 lg:py-32
  founders: { top: 96, bottom: 128 }, // py-24 lg:py-32
  audience: { top: 96, bottom: 128 }, // py-24 lg:py-32
  testimonials: { top: 80, bottom: 128 }, // py-20 lg:py-32
  logoCloud: { top: 64, bottom: 96 }, // py-16 lg:py-24
  stats: { top: 80, bottom: 128 }, // py-20 lg:py-32
  credibility: { top: 80, bottom: 80 }, // Uses min-h-[80vh]
  cta: { top: 96, bottom: 160 }, // py-24 lg:py-40
  pricing: { top: 96, bottom: 128 }, // py-24 lg:py-32
  offer: { top: 96, bottom: 128 }, // py-24 lg:py-32
};

// Get effective padding for a section (custom or default)
function getSectionPadding(section: PageSection): { top: number; bottom: number } {
  const defaults = DEFAULT_SECTION_PADDING[section.type] || { top: 80, bottom: 80 };
  return {
    top: section.content.paddingTop ?? defaults.top,
    bottom: section.content.paddingBottom ?? defaults.bottom,
  };
}

// Get smart suggestion based on existing sections
function getSuggestedSection(sections: PageSection[]): SectionType {
  const hasType = (type: SectionType) => sections.some((s) => s.type === type);

  // Suggestion order based on typical landing page structure
  if (!hasType("header")) return "header";
  if (!hasType("hero")) return "hero";
  if (!hasType("features")) return "features";
  if (!hasType("testimonials")) return "testimonials";
  if (!hasType("pricing")) return "pricing";
  if (!hasType("cta")) return "cta";
  if (!hasType("footer")) return "footer";

  // Default to features if everything exists
  return "features";
}

export default function Canvas() {
  const { page, selectedSectionId, selectSection, isPreviewMode, setPreviewMode, openAIEdit, updateSectionContent, addSection, addElement, currentEditingBreakpoint, setEditingBreakpoint } = useEditorStore();
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Handle viewport change - also sets the editing breakpoint
  const handleViewportChange = (viewport: PreviewViewport) => {
    setPreviewViewport(viewport);
    // Map viewport to breakpoint (they're the same values)
    setEditingBreakpoint(viewport as Breakpoint);
  };

  // When exiting preview mode, reset to desktop editing
  const handleModeChange = (preview: boolean) => {
    setPreviewMode(preview);
    if (!preview) {
      // Reset to desktop when exiting preview mode
      setPreviewViewport('desktop');
      setEditingBreakpoint('desktop');
    }
  };

  // Get preview width based on selected viewport
  const previewWidth = isPreviewMode ? PREVIEW_VIEWPORTS[previewViewport].width : undefined;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestedSection = getSuggestedSection(page.sections);

  const handleAddSection = (type: SectionType) => {
    addSection(type);
    setShowAddDropdown(false);
  };

  // Handle padding change from drag handle
  const handlePaddingChange = (sectionId: string, position: "top" | "bottom", padding: number) => {
    const updates = position === "top"
      ? { paddingTop: padding }
      : { paddingBottom: padding };
    updateSectionContent(sectionId, updates);
  };

  // Handle element drag over section
  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("elementtype")) {
      e.dataTransfer.dropEffect = "copy";
      setDragOverSectionId(sectionId);
    }
  };

  // Handle element drag leave section
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the section, not entering a child
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverSectionId(null);
    }
  };

  // Handle element drop on section
  const handleDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverSectionId(null);

    const elementType = e.dataTransfer.getData("elementType") as ElementType;
    if (!elementType) return;

    // Get the section container to calculate drop position
    const sectionEl = sectionRefs.current.get(sectionId);
    if (!sectionEl) return;

    const rect = sectionEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values to reasonable bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));

    addElement(sectionId, elementType, { x: clampedX, y: clampedY });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#18181b] overflow-hidden">
      {/* Preview Mode Toggle */}
      <div className="sticky top-0 z-50 bg-[#18181b]/80 backdrop-blur-sm border-b border-white/5 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">Mode:</span>
          <div className="flex rounded-lg bg-white/5 p-0.5">
            <button
              onClick={() => handleModeChange(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                !isPreviewMode
                  ? "bg-[#D6FC51] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </span>
            </button>
            <button
              onClick={() => handleModeChange(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                isPreviewMode
                  ? "bg-[#D6FC51] text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </span>
            </button>
          </div>

          {/* Viewport Size Selector - only visible in preview mode */}
          {isPreviewMode && (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
              <span className="text-xs text-white/40">Viewport:</span>
              <div className="flex rounded-lg bg-white/5 p-0.5">
                {(Object.entries(PREVIEW_VIEWPORTS) as [PreviewViewport, typeof PREVIEW_VIEWPORTS[PreviewViewport]][]).map(([key, viewport]) => (
                  <button
                    key={key}
                    onClick={() => handleViewportChange(key)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                      previewViewport === key
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                    title={`${viewport.label} (${viewport.width}px)`}
                  >
                    {key === 'mobile' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    {key === 'tablet' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                    {key === 'desktop' && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span>{viewport.width}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Breakpoint editing indicator - shown when editing non-desktop */}
          {currentEditingBreakpoint !== 'desktop' && (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
              <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                Editing: {currentEditingBreakpoint}
              </span>
            </div>
          )}
        </div>
        {!isPreviewMode && (
          <p className="text-xs text-white/40">
            Click on text or images to edit inline
          </p>
        )}
        {isPreviewMode && (
          <p className="text-xs text-white/40">
            Responsive preview at {PREVIEW_VIEWPORTS[previewViewport].width}px
          </p>
        )}
      </div>

      <div className="flex-1 p-8 overflow-hidden">
        {/* Preview Container - Scrollable container for template content */}
        <div
          className={`mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10 transition-all duration-300 ${
            !isPreviewMode ? "ring-[#D6FC51]/20 max-w-4xl" : ""
          }`}
          style={{
            backgroundColor: page.colorScheme.background,
            color: page.colorScheme.text,
            fontFamily: page.typography.bodyFont,
            // Preview container is the scroll parent for sticky header
            position: 'relative',
            overflowY: 'auto',
            overflowX: 'hidden',
            height: 'calc(100vh - 180px)',
            // Smooth scroll when enabled
            scrollBehavior: page.smoothScroll ? 'smooth' : 'auto',
            // Dynamic width in preview mode based on viewport selection
            ...(isPreviewMode ? { width: PREVIEW_VIEWPORTS[previewViewport].width, maxWidth: '100%' } : {}),
          }}
        >
          {page.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center relative">
              {/* Smart Add Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="group w-20 h-20 rounded-2xl bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 hover:border-[#D6FC51]/50 flex items-center justify-center mb-6 transition-all duration-200"
                >
                  <svg
                    className="w-10 h-10 text-white/30 group-hover:text-[#D6FC51] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showAddDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#1a1a1d] rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50">
                    {/* Recommended Section */}
                    <div className="p-2 border-b border-white/5">
                      <button
                        onClick={() => handleAddSection(suggestedSection)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#D6FC51]/10 hover:bg-[#D6FC51]/20 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#D6FC51]/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#D6FC51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">
                            {SECTION_NAMES[suggestedSection]}
                          </div>
                          <div className="text-xs text-[#D6FC51]">Recommended</div>
                        </div>
                      </button>
                    </div>

                    {/* All Sections by Category */}
                    <div className="max-h-64 overflow-y-auto p-2 space-y-3">
                      {Object.entries(SECTION_CATEGORIES).map(([key, category]) => (
                        <div key={key}>
                          <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                            {category.label}
                          </div>
                          <div className="space-y-0.5">
                            {category.sections.map((type) => (
                              <button
                                key={type}
                                onClick={() => handleAddSection(type)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                              >
                                <span className="text-sm text-white/80">{SECTION_NAMES[type]}</span>
                                {type === suggestedSection && (
                                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#D6FC51]/20 text-[#D6FC51]">
                                    Next
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: page.typography.headingFont }}
              >
                Start building your page
              </h3>
              <p className="opacity-50 max-w-sm">
                Click the button above to add your first section
              </p>
            </div>
          ) : (
            page.sections.map((section, index) => {
              const isSelected = selectedSectionId === section.id;
              const showPaddingHandles = !isPreviewMode && isSelected;
              // Skip padding handles for header and footer
              const canHavePadding = section.type !== "header" && section.type !== "footer";

              const isDragOver = dragOverSectionId === section.id;

              // Determine if this header should use sticky/fixed positioning
              const isHeader = section.type === "header";
              const headerPosition = section.content.headerPosition || "sticky";
              const shouldStick = isHeader && headerPosition !== "static";

              // Floating headers should have transparent wrapper background
              const isFloatingHeader = isHeader && section.content?.headerVariant === "floating-header";

              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(section.id, el);
                    else sectionRefs.current.delete(section.id);
                  }}
                  onClick={(e) => {
                    if (isPreviewMode) return;
                    // Don't select section if clicking on an element
                    const target = e.target as HTMLElement;
                    if (target.closest('[data-element-id]')) return;
                    selectSection(section.id);
                  }}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id)}
                  className={`${shouldStick ? "sticky top-0 z-50" : "relative"} transition-all ${
                    !isPreviewMode ? "cursor-pointer" : ""
                  } ${
                    !isPreviewMode && isSelected
                      ? "ring-2 ring-[#D6FC51] ring-inset"
                      : !isPreviewMode
                      ? "hover:ring-2 hover:ring-white/20 hover:ring-inset"
                      : ""
                  } ${
                    isDragOver ? "ring-2 ring-[#D6FC51] ring-inset bg-[#D6FC51]/5" : ""
                  }`}
                  style={{
                    // Apply section background color so padding area uses correct color
                    // Floating headers get transparent background so only the bar shows
                    backgroundColor: isFloatingHeader ? "transparent" : section.content.backgroundColor,
                    // Padding is handled inside section components, not here
                  }}
                >
                  {/* Drop indicator overlay */}
                  {isDragOver && (
                    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                      <div className="px-4 py-2 rounded-lg bg-[#D6FC51] text-black text-sm font-medium shadow-lg animate-pulse">
                        Drop element here
                      </div>
                    </div>
                  )}
                  {/* Top Padding Handle */}
                  {canHavePadding && index > 0 && (
                    <PaddingDragHandle
                      sectionId={section.id}
                      position="top"
                      currentPadding={getSectionPadding(section).top}
                      onPaddingChange={(padding) => handlePaddingChange(section.id, "top", padding)}
                      isVisible={showPaddingHandles}
                      backgroundColor={section.content.backgroundColor}
                    />
                  )}

                  {/* Selection indicator - only in edit mode */}
                  {!isPreviewMode && isSelected && (
                    <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                      <div className="px-2 py-1 rounded-md bg-[#D6FC51] text-black text-xs font-medium capitalize flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        {section.type}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAIEdit(section.id);
                        }}
                        className="px-3 py-1.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-black/90 hover:border-[#D6FC51]/50 transition-all"
                      >
                        <svg className="w-3.5 h-3.5 text-[#D6FC51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        Edit with AI
                      </button>
                    </div>
                  )}

                  <SectionRenderer section={section} />

                  {/* Elements Layer - custom positioned elements */}
                  {section.elements && section.elements.length > 0 && (
                    <ElementsLayer section={section} previewWidth={previewWidth} />
                  )}

                  {/* Bottom Padding Handle */}
                  {canHavePadding && index < page.sections.length - 1 && (
                    <PaddingDragHandle
                      sectionId={section.id}
                      position="bottom"
                      currentPadding={getSectionPadding(section).bottom}
                      onPaddingChange={(padding) => handlePaddingChange(section.id, "bottom", padding)}
                      isVisible={showPaddingHandles}
                      backgroundColor={section.content.backgroundColor}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* AI Edit Modal */}
      <AIEditModal />

      {/* Element Style Panel (right-click on text elements) */}
      <ElementStylePanel />
    </div>
  );
}
