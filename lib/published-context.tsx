"use client";

import { createContext, useContext, useMemo } from "react";
import type { LandingPage, PageSection, ElementGroup, Breakpoint } from "./page-schema";
import type { ActiveGuides, ElementStylePanelData } from "./store";

// Minimal state needed for editor components to render in published/preview mode
type PublishedContextType = {
  // Page data
  page: LandingPage;

  // UI state - always in preview mode
  isPreviewMode: true;
  selectedSectionId: null;
  selectedElementIds: Set<string>;
  editingField: null;
  activeGuides: null;
  elementGroups: Map<string, ElementGroup>;
  aiEditingSectionId: null;
  isAIGenerating: false;
  elementStylePanel: null;
  rightPanelTab: "settings";
  isDirty: false;
  isSaving: false;
  isGenerating: false;

  // Full-screen and breakpoint state (for compatibility with editor components)
  isFullScreen: false;
  currentEditingBreakpoint: Breakpoint;

  // Stubbed action functions (no-ops in published mode)
  selectSection: (id: string | null) => void;
  selectElement: (sectionId: string | null, elementId: string | null, multiSelect?: boolean) => void;
  clearElementSelection: () => void;
  moveElement: (sectionId: string, elementId: string, position: any) => void;
  removeElement: (sectionId: string, elementId: string) => void;
  duplicateElement: (sectionId: string, elementId: string) => void;
  updateElement: (sectionId: string, elementId: string, updates: any) => void;
  updateElementContent: (sectionId: string, elementId: string, content: any) => void;
  setActiveGuides: (guides: ActiveGuides | null) => void;
  setEditingField: (field: any) => void;
  updateFieldValue: (sectionId: string, field: string, value: string, itemId?: string) => void;
  openAIEdit: (sectionId: string) => void;
  closeAIEdit: () => void;
  openElementStylePanel: (data: ElementStylePanelData) => void;
  closeElementStylePanel: () => void;
  setPreviewMode: (isPreview: boolean) => void;
  pushHistory: () => void;
  moveGroupedElements: (sectionId: string, groupId: string, deltaX: number, deltaY: number) => void;
  getGroupById: (groupId: string) => ElementGroup | undefined;
  getElementsInGroup: (sectionId: string, groupId: string) => any[];

  // Full-screen and breakpoint actions (no-ops in published mode)
  setFullScreen: (isFullScreen: boolean) => void;
  toggleFullScreen: () => void;
  setEditingBreakpoint: (breakpoint: Breakpoint) => void;
  updateElementAtBreakpoint: (sectionId: string, elementId: string, updates: any, breakpoint?: Breakpoint) => void;
  moveElementAtBreakpoint: (sectionId: string, elementId: string, position: any, breakpoint?: Breakpoint) => void;
  updateElementContentAtBreakpoint: (sectionId: string, elementId: string, content: any, breakpoint?: Breakpoint) => void;
  clearElementBreakpointOverrides: (sectionId: string, elementId: string, breakpoint: Breakpoint) => void;
};

const PublishedContext = createContext<PublishedContextType | null>(null);

// No-op function for stubbed actions
const noop = () => {};

export function PublishedProvider({
  children,
  pageData,
}: {
  children: React.ReactNode;
  pageData: LandingPage;
}) {
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<PublishedContextType>(() => ({
    // Page data
    page: pageData,

    // UI state - always preview mode, nothing selected
    isPreviewMode: true as const,
    selectedSectionId: null,
    selectedElementIds: new Set<string>(),
    editingField: null,
    activeGuides: null,
    elementGroups: new Map<string, ElementGroup>(),
    aiEditingSectionId: null,
    isAIGenerating: false as const,
    elementStylePanel: null,
    rightPanelTab: "settings" as const,
    isDirty: false as const,
    isSaving: false as const,
    isGenerating: false as const,

    // Full-screen and breakpoint state
    isFullScreen: false as const,
    currentEditingBreakpoint: 'desktop' as Breakpoint,

    // All actions are no-ops in published mode
    selectSection: noop,
    selectElement: noop,
    clearElementSelection: noop,
    moveElement: noop,
    removeElement: noop,
    duplicateElement: noop,
    updateElement: noop,
    updateElementContent: noop,
    setActiveGuides: noop,
    setEditingField: noop,
    updateFieldValue: noop,
    openAIEdit: noop,
    closeAIEdit: noop,
    openElementStylePanel: noop,
    closeElementStylePanel: noop,
    setPreviewMode: noop,
    pushHistory: noop,
    moveGroupedElements: noop,
    getGroupById: () => undefined,
    getElementsInGroup: () => [],

    // Full-screen and breakpoint actions (no-ops)
    setFullScreen: noop,
    toggleFullScreen: noop,
    setEditingBreakpoint: noop,
    updateElementAtBreakpoint: noop,
    moveElementAtBreakpoint: noop,
    updateElementContentAtBreakpoint: noop,
    clearElementBreakpointOverrides: noop,
  }), [pageData]);

  return (
    <PublishedContext.Provider value={value}>
      {children}
    </PublishedContext.Provider>
  );
}

// Hook to get published context (returns null if not in published mode)
export function usePublishedContext() {
  return useContext(PublishedContext);
}
