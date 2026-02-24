"use client";

import { useState, useRef, useEffect } from "react";
import { useEditorStore } from "@/lib/store";
import SectionRenderer from "./SectionRenderer";
import AIEditModal from "./AIEditModal";
import RichTextEditorModal from "./RichTextEditorModal";
import PaddingDragHandle from "./PaddingDragHandle";
import ElementStylePanel from "./ElementStylePanel";
import ElementsLayer from "./ElementsLayer";
import PreviewIframe from "./PreviewIframe";
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
const SECTION_NAMES: Partial<Record<SectionType, string>> = {
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
  // Whop University section types
  "whop-hero": "Whop Hero",
  "whop-value-prop": "Value Story",
  "whop-offer": "Bento Offer",
  "whop-cta": "Floating CTA",
  "whop-comparison": "Comparison Glow",
  "whop-creator": "Creator Spotlight",
  "whop-curriculum": "Curriculum",
  "whop-results": "Results Gallery",
  "whop-testimonials": "Testimonials 3D",
  "whop-final-cta": "Final CTA",
};

// Default padding values for each section type (in pixels)
// These match the original Tailwind classes that were used
const DEFAULT_SECTION_PADDING: Partial<Record<SectionType, { top: number; bottom: number }>> = {
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
  // Whop University section types (60-100px industry standard)
  "whop-hero": { top: 80, bottom: 80 },
  "whop-value-prop": { top: 80, bottom: 96 },
  "whop-offer": { top: 80, bottom: 96 },
  "whop-cta": { top: 64, bottom: 80 },
  "whop-comparison": { top: 80, bottom: 96 },
  "whop-creator": { top: 80, bottom: 96 },
  "whop-curriculum": { top: 80, bottom: 96 },
  "whop-results": { top: 80, bottom: 96 },
  "whop-testimonials": { top: 80, bottom: 96 },
  "whop-final-cta": { top: 80, bottom: 96 },
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

type CanvasProps = {
  projectId?: string;
};

export default function Canvas({ projectId }: CanvasProps) {
  const page = useEditorStore(state => state.page);
  const selectedSectionId = useEditorStore(state => state.selectedSectionId);
  const selectSection = useEditorStore(state => state.selectSection);
  const isPreviewMode = useEditorStore(state => state.isPreviewMode);
  const setPreviewMode = useEditorStore(state => state.setPreviewMode);
  const openAIEdit = useEditorStore(state => state.openAIEdit);
  const updateSectionContent = useEditorStore(state => state.updateSectionContent);
  const addSection = useEditorStore(state => state.addSection);
  const addElement = useEditorStore(state => state.addElement);
  const currentEditingBreakpoint = useEditorStore(state => state.currentEditingBreakpoint);
  const setEditingBreakpoint = useEditorStore(state => state.setEditingBreakpoint);
  const isResponsiveEditing = useEditorStore(state => state.isResponsiveEditing);
  const setResponsiveEditing = useEditorStore(state => state.setResponsiveEditing);
  const copyElement = useEditorStore(state => state.copyElement);
  const pasteElement = useEditorStore(state => state.pasteElement);
  const duplicateElement = useEditorStore(state => state.duplicateElement);
  const removeElement = useEditorStore(state => state.removeElement);
  const moveElementAtBreakpoint = useEditorStore(state => state.moveElementAtBreakpoint);
  const selectedElementIds = useEditorStore(state => state.selectedElementIds);
  const selectElement = useEditorStore(state => state.selectElement);
  const toggleGrid = useEditorStore(state => state.toggleGrid);
  const showGrid = useEditorStore(state => state.showGrid);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(null);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150];
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Derive single selected element ID from the set
  const selectedElementId = selectedElementIds.size > 0 ? Array.from(selectedElementIds)[0] : null;

  // Handle viewport change - also sets the editing breakpoint
  const handleViewportChange = (viewport: PreviewViewport) => {
    setPreviewViewport(viewport);
    // Map viewport to breakpoint (they're the same values)
    setEditingBreakpoint(viewport as Breakpoint);

    // In edit mode, toggle responsive editing
    if (!isPreviewMode) {
      if (viewport === 'desktop') {
        setResponsiveEditing(false);
      } else {
        setResponsiveEditing(true);
      }
    }
  };

  // When exiting preview mode, reset to desktop editing
  const handleModeChange = (preview: boolean) => {
    setPreviewMode(preview);
    if (!preview) {
      // Reset to desktop when exiting preview mode
      setPreviewViewport('desktop');
      setEditingBreakpoint('desktop');
      setResponsiveEditing(false);
    }
  };

  // Get preview width based on selected viewport
  const previewWidth = (isPreviewMode || isResponsiveEditing) ? PREVIEW_VIEWPORTS[previewViewport].width : undefined;

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

  // Auto-scroll to the selected section when it changes
  useEffect(() => {
    if (selectedSectionId) {
      const el = document.getElementById(`section-${selectedSectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSectionId]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      // Skip if in pure preview mode (not responsive editing)
      if (isPreviewMode && !isResponsiveEditing) return;

      const isMeta = e.metaKey || e.ctrlKey;

      // Zoom shortcuts (don't need element selection)
      if (isMeta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoomLevel(prev => {
          const idx = ZOOM_LEVELS.indexOf(prev);
          return ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, idx + 1)] || prev;
        });
        return;
      }
      if (isMeta && e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => {
          const idx = ZOOM_LEVELS.indexOf(prev);
          return ZOOM_LEVELS[Math.max(0, idx - 1)] || prev;
        });
        return;
      }
      if (isMeta && e.key === '0') {
        e.preventDefault();
        setZoomLevel(100);
        return;
      }

      // Escape - deselect
      if (e.key === 'Escape') {
        selectElement(null, null);
        return;
      }

      // Need a selected element for the rest
      if (!selectedSectionId || !selectedElementId) return;

      // Delete / Backspace - remove element
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeElement(selectedSectionId, selectedElementId);
        return;
      }

      // Cmd+C - copy
      if (isMeta && e.key === 'c') {
        copyElement(selectedSectionId, selectedElementId);
        return; // Don't preventDefault - allow native copy for text
      }

      // Cmd+V - paste
      if (isMeta && e.key === 'v') {
        e.preventDefault();
        pasteElement(selectedSectionId);
        return;
      }

      // Cmd+D - duplicate
      if (isMeta && e.key === 'd') {
        e.preventDefault();
        duplicateElement(selectedSectionId, selectedElementId);
        return;
      }

      // Arrow keys - nudge position
      const nudgeAmount = e.shiftKey ? 0.25 : 1;
      const section = page.sections.find(s => s.id === selectedSectionId);
      const el = section?.elements?.find(el => el.id === selectedElementId);
      if (!el) return;

      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -nudgeAmount;
      if (e.key === 'ArrowRight') dx = nudgeAmount;
      if (e.key === 'ArrowUp') dy = -nudgeAmount;
      if (e.key === 'ArrowDown') dy = nudgeAmount;

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        useEditorStore.getState().pushHistory();
        moveElementAtBreakpoint(selectedSectionId, selectedElementId, {
          x: Math.max(0, Math.min(100, el.position.x + dx)),
          y: Math.max(0, Math.min(100, el.position.y + dy)),
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, isResponsiveEditing, selectedSectionId, selectedElementId, page.sections, selectElement, removeElement, copyElement, pasteElement, duplicateElement, moveElementAtBreakpoint]);

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
    <div className="flex-1 flex flex-col bg-[#18181b] overflow-hidden" data-tour="canvas">
      {/* Preview Mode Toggle */}
      <div className="sticky top-0 z-50 bg-[#18181b]/80 backdrop-blur-sm border-b border-white/5 px-8 py-3 flex items-center justify-between" data-tour="viewport-controls">
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

          {/* Viewport Size Selector - visible in both edit mode and preview mode */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
            <span className="text-xs text-white/40">Viewport:</span>
            <div className="flex rounded-lg bg-white/5 p-0.5">
              {(Object.entries(PREVIEW_VIEWPORTS) as [PreviewViewport, typeof PREVIEW_VIEWPORTS[PreviewViewport]][]).map(([key, viewport]) => (
                <button
                  key={key}
                  onClick={() => handleViewportChange(key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                    previewViewport === key
                      ? isResponsiveEditing && key !== 'desktop'
                        ? "bg-purple-500/30 text-purple-200"
                        : "bg-white/10 text-white"
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

          {/* Grid toggle button */}
          {!isPreviewMode && (
            <button
              onClick={toggleGrid}
              className={`p-1.5 rounded-md transition-colors ${showGrid ? 'bg-[#D6FC51]/20 text-[#D6FC51]' : 'text-white/40 hover:text-white/60'}`}
              title="Toggle grid overlay"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
          )}

          {/* Breakpoint editing indicator - shown when editing non-desktop (but not during responsive editing, which has its own banner) */}
          {currentEditingBreakpoint !== 'desktop' && !isResponsiveEditing && (
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
        {!isPreviewMode && !isResponsiveEditing && (
          <p className="text-xs text-white/40">
            Click on text or images to edit inline
          </p>
        )}
        {!isPreviewMode && isResponsiveEditing && (
          <p className="text-xs text-purple-300">
            Editing {currentEditingBreakpoint} elements at {PREVIEW_VIEWPORTS[previewViewport].width}px — <button onClick={() => handleModeChange(true)} className="underline hover:text-purple-200">preview responsive layout</button>
          </p>
        )}
        {isPreviewMode && (
          <p className="text-xs text-white/40">
            Responsive preview at {PREVIEW_VIEWPORTS[previewViewport].width}px
          </p>
        )}
      </div>

      <div className="flex-1 p-8 overflow-clip relative" ref={previewContainerRef}>
        {/* Preview mode: iframe-based rendering with device frames */}
        {isPreviewMode ? (
          <PreviewIframe
            page={page}
            viewport={previewViewport}
            containerRef={previewContainerRef}
          />
        ) : (
        /* Edit mode: Preview Container - Scrollable container for template content */
        <div
          className="w-full h-full flex justify-center"
          style={{
            // Zoom wrapper — transform here so the scroll container inside is unaffected
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
        >
        <div
          className={`mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10 transition-all duration-300 ${
            !isResponsiveEditing ? "ring-[#D6FC51]/20 max-w-4xl w-full" : ""
          } ${
            isResponsiveEditing ? "ring-purple-500/30" : ""
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
            // Smooth scroll handled by Lenis in iframe preview
            // Dynamic width in responsive editing mode based on viewport selection
            ...(isResponsiveEditing ? { width: PREVIEW_VIEWPORTS[previewViewport].width } : {}),
          }}
        >
          {/* Responsive editing banner */}
          {isResponsiveEditing && !isPreviewMode && (
            <div className="sticky top-0 z-[60] flex items-center justify-between px-4 py-2 bg-purple-600/90 backdrop-blur-sm border-b border-purple-400/30">
              <div className="flex items-center gap-2">
                {currentEditingBreakpoint === 'mobile' ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-sm font-medium text-white">
                  Editing {currentEditingBreakpoint} elements
                </span>
                <span className="text-xs text-white/70">
                  ({PREVIEW_VIEWPORTS[previewViewport].width}px) — Section layouts preview in Preview mode
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleModeChange(true); // Enter preview mode
                    // Viewport already set to mobile/tablet, so iframe will render correctly
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-purple-500/30 border border-purple-400/30 rounded-md hover:bg-purple-500/40 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Layout
                </button>
                <button
                  onClick={() => handleViewportChange('desktop')}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-purple-900 bg-white rounded-md hover:bg-white/90 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Back to Desktop
                </button>
              </div>
            </div>
          )}

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
              <p className="opacity-50 max-w-sm mb-4">
                Click the button above to browse 44 section types, or use AI to generate your page.
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/60">⌘K</kbd>
                <span className="text-xs text-white/40">Open AI commands anytime</span>
              </div>
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
                  id={`section-${section.id}`}
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
                    // Elevate selected section so padding drag handles are never obscured by adjacent sections
                    zIndex: !isPreviewMode && isSelected ? 30 : undefined,
                    // Ensure padding handles that extend beyond section bounds are visible
                    overflow: 'visible',
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
        )}

        {/* Zoom controls - bottom right overlay */}
        {!isPreviewMode && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 px-2 py-1 bg-[#1a1a1c] border border-white/10 rounded-lg shadow-xl z-50">
            <button onClick={() => setZoomLevel(prev => ZOOM_LEVELS[Math.max(0, ZOOM_LEVELS.indexOf(prev) - 1)] || prev)} className="p-1 rounded hover:bg-white/10 text-white/50 text-xs">-</button>
            <span className="text-xs text-white/60 w-10 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(prev => ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, ZOOM_LEVELS.indexOf(prev) + 1)] || prev)} className="p-1 rounded hover:bg-white/10 text-white/50 text-xs">+</button>
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button onClick={() => setZoomLevel(100)} className="px-1.5 py-0.5 rounded hover:bg-white/10 text-white/50 text-[10px] font-medium">Fit</button>
          </div>
        )}

        {/* Keyboard shortcut help - bottom right overlay, next to zoom */}
        {!isPreviewMode && (
          <div className="absolute bottom-4 right-36 z-50">
            <button
              onClick={() => setShowShortcutHelp(!showShortcutHelp)}
              className="p-1.5 rounded-lg bg-[#1a1a1c] border border-white/10 shadow-xl text-white/40 hover:text-white/60 transition-colors"
              title="Keyboard shortcuts"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </button>
            {showShortcutHelp && (
              <div className="absolute bottom-10 right-0 w-64 bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl p-4 space-y-2">
                <div className="text-xs font-semibold text-white/70 mb-3">Keyboard Shortcuts</div>
                {[
                  ['Delete', 'Remove element'],
                  ['\u2318C', 'Copy element'],
                  ['\u2318V', 'Paste element'],
                  ['\u2318D', 'Duplicate'],
                  ['Escape', 'Deselect'],
                  ['\u2190\u2191\u2192\u2193', 'Nudge (1%)'],
                  ['Shift+Arrow', 'Fine nudge (0.25%)'],
                  ['\u2318+/-', 'Zoom in/out'],
                  ['\u23180', 'Reset zoom'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center justify-between">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/60">{key}</kbd>
                    <span className="text-[11px] text-white/40">{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Edit Modal */}
      <AIEditModal />

      {/* Rich Text Editor Modal */}
      <RichTextEditorModal />

      {/* Element Style Panel (right-click on text elements) */}
      <ElementStylePanel />
    </div>
  );
}
