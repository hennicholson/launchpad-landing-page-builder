"use client";

import { useEditorStore } from "@/lib/store";
import SectionRenderer from "./SectionRenderer";
import AIEditModal from "./AIEditModal";
import PaddingDragHandle from "./PaddingDragHandle";
import ElementStylePanel from "./ElementStylePanel";

export default function Canvas() {
  const { page, selectedSectionId, selectSection, isPreviewMode, setPreviewMode, openAIEdit, updateSectionContent } = useEditorStore();

  // Handle padding change from drag handle
  const handlePaddingChange = (sectionId: string, position: "top" | "bottom", padding: number) => {
    const updates = position === "top"
      ? { paddingTop: padding }
      : { paddingBottom: padding };
    updateSectionContent(sectionId, updates);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#18181b] overflow-hidden">
      {/* Preview Mode Toggle */}
      <div className="sticky top-0 z-50 bg-[#18181b]/80 backdrop-blur-sm border-b border-white/5 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/60">Mode:</span>
          <div className="flex rounded-lg bg-white/5 p-0.5">
            <button
              onClick={() => setPreviewMode(false)}
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
              onClick={() => setPreviewMode(true)}
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
        </div>
        {!isPreviewMode && (
          <p className="text-xs text-white/40">
            Click on text or images to edit inline
          </p>
        )}
      </div>

      <div className="flex-1 p-8 overflow-hidden">
        {/* Preview Container - Scrollable container for template content */}
        <div
          className={`mx-auto max-w-4xl rounded-2xl shadow-2xl ring-1 ring-white/10 ${
            !isPreviewMode ? "ring-[#D6FC51]/20" : ""
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
          }}
        >
          {page.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 opacity-30"
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
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: page.typography.headingFont }}
              >
                Your page is empty
              </h3>
              <p className="opacity-50 max-w-sm">
                Add sections from the left panel to start building your landing page.
              </p>
            </div>
          ) : (
            page.sections.map((section, index) => {
              const isSelected = selectedSectionId === section.id;
              const showPaddingHandles = !isPreviewMode && isSelected;
              // Skip padding handles for header and footer
              const canHavePadding = section.type !== "header" && section.type !== "footer";

              return (
                <div
                  key={section.id}
                  onClick={() => !isPreviewMode && selectSection(section.id)}
                  className={`relative transition-all ${
                    !isPreviewMode ? "cursor-pointer" : ""
                  } ${
                    !isPreviewMode && isSelected
                      ? "ring-2 ring-[#D6FC51] ring-inset"
                      : !isPreviewMode
                      ? "hover:ring-2 hover:ring-white/20 hover:ring-inset"
                      : ""
                  }`}
                  style={{
                    // Apply custom padding if set
                    ...(section.content.paddingTop !== undefined && canHavePadding
                      ? { paddingTop: `${section.content.paddingTop}px` }
                      : {}),
                    ...(section.content.paddingBottom !== undefined && canHavePadding
                      ? { paddingBottom: `${section.content.paddingBottom}px` }
                      : {}),
                  }}
                >
                  {/* Top Padding Handle */}
                  {canHavePadding && index > 0 && (
                    <PaddingDragHandle
                      sectionId={section.id}
                      position="top"
                      currentPadding={section.content.paddingTop || 0}
                      onPaddingChange={(padding) => handlePaddingChange(section.id, "top", padding)}
                      isVisible={showPaddingHandles}
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

                  {/* Bottom Padding Handle */}
                  {canHavePadding && index < page.sections.length - 1 && (
                    <PaddingDragHandle
                      sectionId={section.id}
                      position="bottom"
                      currentPadding={section.content.paddingBottom || 0}
                      onPaddingChange={(padding) => handlePaddingChange(section.id, "bottom", padding)}
                      isVisible={showPaddingHandles}
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
