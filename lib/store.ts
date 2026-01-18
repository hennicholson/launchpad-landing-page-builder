import { create } from "zustand";
import type { LandingPage, PageSection, SectionType, SectionItem, ElementStyleOverride, PageElement, ElementType, ElementPosition, ElementContent, ElementGroup, Breakpoint, BreakpointOverride, CTAVariant, HeaderVariant, TestimonialVariant, FeaturesVariant } from "./page-schema";
import { createSection, generateId, defaultPage, THEME_PRESETS } from "./page-schema";
import { setBreakpointOverride, setPositionAtBreakpoint, setContentAtBreakpoint } from "./breakpoint-utils";

type EditingField = {
  sectionId: string;
  field: string;
  itemId?: string; // For editing items within sections
};

// Alignment guide for smart positioning
export type AlignmentGuide = {
  type: 'horizontal' | 'vertical';
  position: number; // Percentage position (0-100)
  label?: string; // Optional label like "center"
};

// Active alignment guides during drag
export type ActiveGuides = {
  horizontal: AlignmentGuide[];
  vertical: AlignmentGuide[];
};

// Data for the element style panel
export type ElementStylePanelData = {
  sectionId: string;
  field: string;
  itemId?: string;
  position: { x: number; y: number };
};

type EditorState = {
  // Page data
  page: LandingPage;
  originalPage: LandingPage | null; // For tracking changes

  // Undo/Redo history
  history: LandingPage[];
  historyIndex: number;
  maxHistorySize: number;

  // UI state
  selectedSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isGenerating: boolean;

  // Inline editing state
  editingField: EditingField | null;
  isPreviewMode: boolean; // When true, editing is disabled

  // AI editing state
  aiEditingSectionId: string | null;
  isAIGenerating: boolean;

  // Element style panel state
  elementStylePanel: ElementStylePanelData | null;

  // Right panel tab state
  rightPanelTab: 'settings' | 'style';

  // Element selection state (supports multi-select)
  selectedElementIds: Set<string>;

  // Alignment guides state (shown during drag)
  activeGuides: ActiveGuides | null;

  // Element groups state (for grouped elements)
  elementGroups: Map<string, ElementGroup>;

  // Full-screen state
  isFullScreen: boolean;

  // Breakpoint editing state
  currentEditingBreakpoint: Breakpoint;

  // Actions
  setPage: (page: LandingPage) => void;
  updateSection: (sectionId: string, updates: Partial<PageSection>) => void;
  updateSectionContent: (sectionId: string, content: Partial<PageSection["content"]>) => void;
  addSection: (type: SectionType, afterId?: string, options?: { ctaVariant?: CTAVariant; headerVariant?: HeaderVariant; testimonialVariant?: TestimonialVariant; featuresVariant?: FeaturesVariant }) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  reorderSections: (sections: PageSection[]) => void;
  duplicateSection: (sectionId: string) => void;
  selectSection: (sectionId: string | null) => void;
  updateColorScheme: (colors: Partial<LandingPage["colorScheme"]>) => void;
  updateTypography: (typography: Partial<LandingPage["typography"]>) => void;
  updatePageMeta: (meta: Partial<Pick<LandingPage, 'title' | 'description' | 'smoothScroll' | 'animationPreset'>>) => void;
  applyThemePreset: (presetId: string) => void;

  // Item management (for features, testimonials, pricing, etc.)
  addItem: (sectionId: string) => void;
  updateItem: (sectionId: string, itemId: string, updates: Partial<SectionItem>) => void;
  removeItem: (sectionId: string, itemId: string) => void;

  // State management
  markSaved: () => void;
  setSaving: (isSaving: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  reset: () => void;

  // Inline editing actions
  setEditingField: (field: EditingField | null) => void;
  setPreviewMode: (isPreview: boolean) => void;
  updateFieldValue: (sectionId: string, field: string, value: string, itemId?: string) => void;

  // AI editing actions
  openAIEdit: (sectionId: string) => void;
  closeAIEdit: () => void;
  setAIGenerating: (isGenerating: boolean) => void;
  applyAISection: (sectionId: string, newSection: PageSection) => void;

  // Element style panel actions
  openElementStylePanel: (data: ElementStylePanelData) => void;
  closeElementStylePanel: () => void;
  updateElementStyle: (
    sectionId: string,
    field: string,
    styles: Partial<ElementStyleOverride>,
    itemId?: string
  ) => void;

  // Right panel tab actions
  setRightPanelTab: (tab: 'settings' | 'style') => void;

  // Undo/Redo actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Element manipulation actions
  addElement: (sectionId: string, type: ElementType, position: ElementPosition) => void;
  updateElement: (sectionId: string, elementId: string, updates: Partial<PageElement>) => void;
  updateElementContent: (sectionId: string, elementId: string, content: Partial<ElementContent>) => void;
  removeElement: (sectionId: string, elementId: string) => void;
  moveElement: (sectionId: string, elementId: string, position: ElementPosition) => void;
  selectElement: (sectionId: string | null, elementId: string | null, multiSelect?: boolean) => void;
  clearElementSelection: () => void;
  duplicateElement: (sectionId: string, elementId: string) => void;
  reorderElement: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;

  // Alignment guide actions
  setActiveGuides: (guides: ActiveGuides | null) => void;

  // Element group actions
  createGroup: (sectionId: string, elementIds: string[]) => string | null;
  ungroupElements: (sectionId: string, groupId: string) => void;
  moveGroupedElements: (sectionId: string, groupId: string, deltaX: number, deltaY: number) => void;
  getGroupById: (groupId: string) => ElementGroup | undefined;
  getElementsInGroup: (sectionId: string, groupId: string) => PageElement[];

  // Full-screen actions
  setFullScreen: (isFullScreen: boolean) => void;
  toggleFullScreen: () => void;

  // Breakpoint editing actions
  setEditingBreakpoint: (breakpoint: Breakpoint) => void;

  // Breakpoint-aware element actions
  updateElementAtBreakpoint: (
    sectionId: string,
    elementId: string,
    updates: BreakpointOverride,
    breakpoint?: Breakpoint
  ) => void;
  moveElementAtBreakpoint: (
    sectionId: string,
    elementId: string,
    position: Partial<ElementPosition>,
    breakpoint?: Breakpoint
  ) => void;
  updateElementContentAtBreakpoint: (
    sectionId: string,
    elementId: string,
    content: Partial<ElementContent>,
    breakpoint?: Breakpoint
  ) => void;
  clearElementBreakpointOverrides: (
    sectionId: string,
    elementId: string,
    breakpoint: Breakpoint
  ) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  page: defaultPage,
  originalPage: null,
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,
  selectedSectionId: null,
  isDirty: false,
  isSaving: false,
  isGenerating: false,
  editingField: null,
  isPreviewMode: false,
  aiEditingSectionId: null,
  isAIGenerating: false,
  elementStylePanel: null,
  rightPanelTab: 'settings',
  selectedElementIds: new Set<string>(),
  activeGuides: null,
  elementGroups: new Map<string, ElementGroup>(),
  isFullScreen: false,
  currentEditingBreakpoint: 'desktop' as Breakpoint,

  setPage: (page) =>
    set({
      page,
      originalPage: JSON.parse(JSON.stringify(page)),
      isDirty: false,
      selectedSectionId: page.sections[0]?.id || null,
    }),

  updateSection: (sectionId, updates) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      },
      isDirty: true,
    })),

  updateSectionContent: (sectionId, content) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? { ...s, content: { ...s.content, ...content } }
            : s
        ),
      },
      isDirty: true,
    })),

  addSection: (type, afterId, options) =>
    set((state) => {
      const newSection = createSection(type, options);
      const sections = [...state.page.sections];

      if (afterId) {
        const index = sections.findIndex((s) => s.id === afterId);
        sections.splice(index + 1, 0, newSection);
      } else {
        sections.push(newSection);
      }

      return {
        page: { ...state.page, sections },
        selectedSectionId: newSection.id,
        isDirty: true,
      };
    }),

  removeSection: (sectionId) =>
    set((state) => {
      const sections = state.page.sections.filter((s) => s.id !== sectionId);
      const wasSelected = state.selectedSectionId === sectionId;

      return {
        page: { ...state.page, sections },
        selectedSectionId: wasSelected
          ? sections[0]?.id || null
          : state.selectedSectionId,
        isDirty: true,
      };
    }),

  moveSection: (sectionId, direction) =>
    set((state) => {
      const sections = [...state.page.sections];
      const index = sections.findIndex((s) => s.id === sectionId);

      if (index === -1) return state;
      if (direction === "up" && index === 0) return state;
      if (direction === "down" && index === sections.length - 1) return state;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      const [section] = sections.splice(index, 1);
      sections.splice(newIndex, 0, section);

      return {
        page: { ...state.page, sections },
        isDirty: true,
      };
    }),

  reorderSections: (sections) =>
    set((state) => ({
      page: { ...state.page, sections },
      isDirty: true,
    })),

  duplicateSection: (sectionId) =>
    set((state) => {
      const sections = [...state.page.sections];
      const index = sections.findIndex((s) => s.id === sectionId);

      if (index === -1) return state;

      const original = sections[index];
      const duplicate: PageSection = {
        ...JSON.parse(JSON.stringify(original)),
        id: generateId(),
        items: original.items?.map((item) => ({
          ...item,
          id: generateId(),
        })),
      };

      sections.splice(index + 1, 0, duplicate);

      return {
        page: { ...state.page, sections },
        selectedSectionId: duplicate.id,
        isDirty: true,
      };
    }),

  selectSection: (sectionId) =>
    set({ selectedSectionId: sectionId, selectedElementIds: new Set<string>() }),

  updateColorScheme: (colors) =>
    set((state) => ({
      page: {
        ...state.page,
        colorScheme: { ...state.page.colorScheme, ...colors },
      },
      isDirty: true,
    })),

  updateTypography: (typography) =>
    set((state) => ({
      page: {
        ...state.page,
        typography: { ...state.page.typography, ...typography },
      },
      isDirty: true,
    })),

  updatePageMeta: (meta) =>
    set((state) => ({
      page: {
        ...state.page,
        ...meta,
      },
      isDirty: true,
    })),

  applyThemePreset: (presetId) =>
    set((state) => {
      const preset = THEME_PRESETS[presetId];
      if (!preset) return state;
      return {
        page: {
          ...state.page,
          colorScheme: { ...preset.colorScheme },
        },
        isDirty: true,
      };
    }),

  addItem: (sectionId) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: [
                  ...(s.items || []),
                  { id: generateId(), title: "New Item", description: "" },
                ],
              }
            : s
        ),
      },
      isDirty: true,
    })),

  updateItem: (sectionId, itemId, updates) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items?.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  removeItem: (sectionId, itemId) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items?.filter((item) => item.id !== itemId),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  markSaved: () =>
    set((state) => ({
      originalPage: JSON.parse(JSON.stringify(state.page)),
      isDirty: false,
    })),

  setSaving: (isSaving) => set({ isSaving }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setEditingField: (field) => set({ editingField: field }),

  setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview, editingField: null }),

  updateFieldValue: (sectionId, field, value, itemId) =>
    set((state) => {
      if (itemId) {
        // Update item field
        return {
          page: {
            ...state.page,
            sections: state.page.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    items: s.items?.map((item) =>
                      item.id === itemId ? { ...item, [field]: value } : item
                    ),
                  }
                : s
            ),
          },
          isDirty: true,
        };
      } else {
        // Update section content field
        return {
          page: {
            ...state.page,
            sections: state.page.sections.map((s) =>
              s.id === sectionId
                ? { ...s, content: { ...s.content, [field]: value } }
                : s
            ),
          },
          isDirty: true,
        };
      }
    }),

  openAIEdit: (sectionId) => set({ aiEditingSectionId: sectionId }),

  closeAIEdit: () => set({ aiEditingSectionId: null, isAIGenerating: false }),

  setAIGenerating: (isGenerating) => set({ isAIGenerating: isGenerating }),

  applyAISection: (sectionId, newSection) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId ? { ...newSection, id: sectionId } : s
        ),
      },
      isDirty: true,
      aiEditingSectionId: null,
      isAIGenerating: false,
    })),

  openElementStylePanel: (data) => set({ elementStylePanel: data, rightPanelTab: 'style' }),

  closeElementStylePanel: () => set({ elementStylePanel: null, rightPanelTab: 'settings' }),

  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  // Undo/Redo implementations
  pushHistory: () =>
    set((state) => {
      const { history, historyIndex, maxHistorySize, page } = state;
      // Remove any redo states (states after current index)
      const newHistory = history.slice(0, historyIndex + 1);
      // Add current page state
      newHistory.push(JSON.parse(JSON.stringify(page)));
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  undo: () =>
    set((state) => {
      const { history, historyIndex, page } = state;
      if (historyIndex < 0) return state;

      // If we're at the end, save current state first
      let newHistory = [...history];
      let newIndex = historyIndex;

      if (historyIndex === history.length - 1) {
        // Save current state before undoing
        newHistory = [...history, JSON.parse(JSON.stringify(page))];
        newIndex = historyIndex;
      } else {
        newIndex = historyIndex - 1;
      }

      if (newIndex < 0) return state;

      return {
        page: JSON.parse(JSON.stringify(newHistory[newIndex])),
        history: newHistory,
        historyIndex: newIndex,
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      const { history, historyIndex } = state;
      if (historyIndex >= history.length - 1) return state;

      const newIndex = historyIndex + 1;
      return {
        page: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex,
        isDirty: true,
      };
    }),

  canUndo: () => {
    const state = get();
    return state.historyIndex >= 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  updateElementStyle: (sectionId, field, styles, itemId) =>
    set((state) => {
      if (itemId) {
        // Update item's styleOverrides
        return {
          page: {
            ...state.page,
            sections: state.page.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    items: s.items?.map((item) =>
                      item.id === itemId
                        ? {
                            ...item,
                            styleOverrides: {
                              ...(item.styleOverrides || {}),
                              [field]: {
                                ...(item.styleOverrides?.[field] || {}),
                                ...styles,
                              },
                            },
                          }
                        : item
                    ),
                  }
                : s
            ),
          },
          isDirty: true,
        };
      } else {
        // Update section's elementStyles
        return {
          page: {
            ...state.page,
            sections: state.page.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    content: {
                      ...s.content,
                      elementStyles: {
                        ...(s.content.elementStyles || {}),
                        [field]: {
                          ...(s.content.elementStyles?.[field] || {}),
                          ...styles,
                        },
                      },
                    },
                  }
                : s
            ),
          },
          isDirty: true,
        };
      }
    }),

  // Element manipulation actions
  addElement: (sectionId, type, position) =>
    set((state) => {
      const newElement: PageElement = {
        id: generateId(),
        type,
        position,
        snapToGrid: true,
        visible: true,
        content: getDefaultElementContent(type),
        styles: {},
      };

      return {
        page: {
          ...state.page,
          sections: state.page.sections.map((s) =>
            s.id === sectionId
              ? { ...s, elements: [...(s.elements || []), newElement] }
              : s
          ),
        },
        selectedElementIds: new Set([newElement.id]),
        selectedSectionId: sectionId,  // Also select the section
        rightPanelTab: 'settings',     // Auto-switch to settings tab
        isDirty: true,
      };
    }),

  updateElement: (sectionId, elementId, updates) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId ? { ...el, ...updates } : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  updateElementContent: (sectionId, elementId, content) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId
                    ? { ...el, content: { ...el.content, ...content } }
                    : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  removeElement: (sectionId, elementId) =>
    set((state) => {
      const newSelection = new Set(state.selectedElementIds);
      newSelection.delete(elementId);
      return {
        page: {
          ...state.page,
          sections: state.page.sections.map((s) =>
            s.id === sectionId
              ? { ...s, elements: s.elements?.filter((el) => el.id !== elementId) }
              : s
          ),
        },
        selectedElementIds: newSelection,
        isDirty: true,
      };
    }),

  moveElement: (sectionId, elementId, position) =>
    set((state) => ({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId ? { ...el, position } : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  selectElement: (sectionId, elementId, multiSelect = false) =>
    set((state) => {
      if (!elementId) {
        // Clear selection
        return {
          selectedSectionId: sectionId,
          selectedElementIds: new Set<string>(),
          rightPanelTab: state.rightPanelTab,
        };
      }

      if (multiSelect) {
        // Toggle selection for multi-select (Shift+click)
        const newSelection = new Set(state.selectedElementIds);
        if (newSelection.has(elementId)) {
          newSelection.delete(elementId);
        } else {
          newSelection.add(elementId);
        }
        return {
          selectedSectionId: sectionId,
          selectedElementIds: newSelection,
          rightPanelTab: 'settings',
        };
      } else {
        // Single selection (replace)
        return {
          selectedSectionId: sectionId,
          selectedElementIds: new Set([elementId]),
          rightPanelTab: 'settings',
        };
      }
    }),

  clearElementSelection: () =>
    set({ selectedElementIds: new Set<string>() }),

  duplicateElement: (sectionId, elementId) =>
    set((state) => {
      const section = state.page.sections.find((s) => s.id === sectionId);
      const element = section?.elements?.find((el) => el.id === elementId);

      if (!element) return state;

      const duplicate: PageElement = {
        ...JSON.parse(JSON.stringify(element)),
        id: generateId(),
        position: {
          ...element.position,
          x: Math.min(element.position.x + 5, 95),
          y: Math.min(element.position.y + 5, 95),
        },
      };

      return {
        page: {
          ...state.page,
          sections: state.page.sections.map((s) =>
            s.id === sectionId
              ? { ...s, elements: [...(s.elements || []), duplicate] }
              : s
          ),
        },
        selectedElementIds: new Set([duplicate.id]),
        isDirty: true,
      };
    }),

  reorderElement: (sectionId, elementId, direction) =>
    set((state) => {
      const section = state.page.sections.find((s) => s.id === sectionId);
      if (!section?.elements) return state;

      const elements = [...section.elements];
      const index = elements.findIndex((el) => el.id === elementId);
      if (index === -1) return state;

      // up = later in array = higher z-index (on top)
      // down = earlier in array = lower z-index (behind)
      const newIndex = direction === 'up' ? index + 1 : index - 1;
      if (newIndex < 0 || newIndex >= elements.length) return state;

      // Swap elements
      [elements[index], elements[newIndex]] = [elements[newIndex], elements[index]];

      return {
        page: {
          ...state.page,
          sections: state.page.sections.map((s) =>
            s.id === sectionId ? { ...s, elements } : s
          ),
        },
        isDirty: true,
      };
    }),

  // Alignment guides
  setActiveGuides: (guides) => set({ activeGuides: guides }),

  // Element group actions
  createGroup: (sectionId, elementIds) => {
    if (elementIds.length < 2) return null;

    const state = get();
    const section = state.page.sections.find((s) => s.id === sectionId);
    if (!section?.elements) return null;

    // Get the elements to group
    const elementsToGroup = section.elements.filter((el) => elementIds.includes(el.id));
    if (elementsToGroup.length < 2) return null;

    // Calculate bounding box
    const minX = Math.min(...elementsToGroup.map((el) => el.position.x));
    const maxX = Math.max(...elementsToGroup.map((el) => el.position.x));
    const minY = Math.min(...elementsToGroup.map((el) => el.position.y));
    const maxY = Math.max(...elementsToGroup.map((el) => el.position.y));

    const groupId = generateId();
    const newGroup: ElementGroup = {
      id: groupId,
      elementIds: elementIds,
      bounds: { minX, maxX, minY, maxY },
    };

    // Update elements with groupId and add group to map
    const newGroups = new Map(state.elementGroups);
    newGroups.set(groupId, newGroup);

    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  elementIds.includes(el.id)
                    ? { ...el, groupId }
                    : el
                ),
              }
            : s
        ),
      },
      elementGroups: newGroups,
      isDirty: true,
    });

    return groupId;
  },

  ungroupElements: (sectionId, groupId) => {
    const state = get();
    const group = state.elementGroups.get(groupId);
    if (!group) return;

    // Remove groupId from all elements in the group
    const newGroups = new Map(state.elementGroups);
    newGroups.delete(groupId);

    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.groupId === groupId
                    ? { ...el, groupId: undefined }
                    : el
                ),
              }
            : s
        ),
      },
      elementGroups: newGroups,
      isDirty: true,
    });
  },

  moveGroupedElements: (sectionId, groupId, deltaX, deltaY) => {
    const state = get();
    const group = state.elementGroups.get(groupId);
    if (!group) return;

    // Move all elements in the group by the delta
    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.groupId === groupId
                    ? {
                        ...el,
                        position: {
                          ...el.position,
                          x: Math.max(0, Math.min(100, el.position.x + deltaX)),
                          y: Math.max(0, Math.min(100, el.position.y + deltaY)),
                        },
                      }
                    : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    });

    // Update group bounds
    const newGroups = new Map(state.elementGroups);
    const updatedGroup = {
      ...group,
      bounds: {
        minX: Math.max(0, Math.min(100, group.bounds.minX + deltaX)),
        maxX: Math.max(0, Math.min(100, group.bounds.maxX + deltaX)),
        minY: Math.max(0, Math.min(100, group.bounds.minY + deltaY)),
        maxY: Math.max(0, Math.min(100, group.bounds.maxY + deltaY)),
      },
    };
    newGroups.set(groupId, updatedGroup);
    set({ elementGroups: newGroups });
  },

  getGroupById: (groupId) => {
    return get().elementGroups.get(groupId);
  },

  getElementsInGroup: (sectionId, groupId) => {
    const state = get();
    const section = state.page.sections.find((s) => s.id === sectionId);
    if (!section?.elements) return [];
    return section.elements.filter((el) => el.groupId === groupId);
  },

  // Full-screen actions
  setFullScreen: (isFullScreen) => set({ isFullScreen }),
  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),

  // Breakpoint editing actions
  setEditingBreakpoint: (breakpoint) => set({ currentEditingBreakpoint: breakpoint }),

  // Breakpoint-aware element update
  // Updates element properties, saving to breakpoint overrides if not desktop
  updateElementAtBreakpoint: (sectionId, elementId, updates, breakpoint) => {
    const state = get();
    const bp = breakpoint ?? state.currentEditingBreakpoint;
    const section = state.page.sections.find((s) => s.id === sectionId);
    const element = section?.elements?.find((el) => el.id === elementId);

    if (!element) return;

    const updatedElement = setBreakpointOverride(element, bp, updates);

    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId ? updatedElement : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    });
  },

  // Breakpoint-aware position update (for dragging)
  moveElementAtBreakpoint: (sectionId, elementId, position, breakpoint) => {
    const state = get();
    const bp = breakpoint ?? state.currentEditingBreakpoint;
    const section = state.page.sections.find((s) => s.id === sectionId);
    const element = section?.elements?.find((el) => el.id === elementId);

    if (!element) return;

    const updatedElement = setPositionAtBreakpoint(element, bp, position);

    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId ? updatedElement : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    });
  },

  // Breakpoint-aware content update
  updateElementContentAtBreakpoint: (sectionId, elementId, content, breakpoint) => {
    const state = get();
    const bp = breakpoint ?? state.currentEditingBreakpoint;
    const section = state.page.sections.find((s) => s.id === sectionId);
    const element = section?.elements?.find((el) => el.id === elementId);

    if (!element) return;

    const updatedElement = setContentAtBreakpoint(element, bp, content);

    set({
      page: {
        ...state.page,
        sections: state.page.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                elements: s.elements?.map((el) =>
                  el.id === elementId ? updatedElement : el
                ),
              }
            : s
        ),
      },
      isDirty: true,
    });
  },

  // Clear breakpoint overrides for an element
  clearElementBreakpointOverrides: (sectionId, elementId, breakpoint) => {
    if (breakpoint === 'desktop') return; // Can't clear desktop

    set((state) => {
      const section = state.page.sections.find((s) => s.id === sectionId);
      const element = section?.elements?.find((el) => el.id === elementId);

      if (!element?.breakpointOverrides) return state;

      const { [breakpoint]: _, ...remainingOverrides } = element.breakpointOverrides;
      const hasRemainingOverrides = Object.keys(remainingOverrides).length > 0;

      return {
        page: {
          ...state.page,
          sections: state.page.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  elements: s.elements?.map((el) =>
                    el.id === elementId
                      ? {
                          ...el,
                          breakpointOverrides: hasRemainingOverrides
                            ? remainingOverrides
                            : undefined,
                        }
                      : el
                  ),
                }
              : s
          ),
        },
        isDirty: true,
      };
    });
  },

  reset: () =>
    set({
      page: defaultPage,
      originalPage: null,
      history: [],
      historyIndex: -1,
      selectedSectionId: null,
      selectedElementIds: new Set<string>(),
      elementGroups: new Map<string, ElementGroup>(),
      isDirty: false,
      isSaving: false,
      isGenerating: false,
      editingField: null,
      isPreviewMode: false,
      aiEditingSectionId: null,
      isAIGenerating: false,
      elementStylePanel: null,
      rightPanelTab: 'settings',
      isFullScreen: false,
      currentEditingBreakpoint: 'desktop' as Breakpoint,
    }),
}));

// Helper function to get default content for an element type
function getDefaultElementContent(type: ElementType): ElementContent {
  switch (type) {
    case 'button':
      return { buttonText: 'Click me', buttonLink: '#', buttonVariant: 'primary' };
    case 'image':
      return { imageUrl: '', imageAlt: 'Image', imageWidth: 200 };
    case 'text':
      return { text: 'Enter your text here', textType: 'paragraph' };
    case 'divider':
      return { dividerVariant: 'solid', dividerThickness: 1, dividerWidth: 200 };
    case 'icon':
      return { iconName: 'star', iconSize: 24 };
    case 'video':
      return { videoUrl: '', videoWidth: 400 };
    case 'social':
      return {
        socialLinks: [
          { platform: 'twitter', url: '#' },
          { platform: 'instagram', url: '#' },
          { platform: 'linkedin', url: '#' },
        ]
      };
    case 'badge':
      return { badgeText: 'New', badgeVariant: 'default' };
    case 'countdown':
      return { countdownTarget: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() };
    case 'form':
      return { formPlaceholder: 'Enter your email', formButtonText: 'Subscribe' };
    case 'html':
      return { htmlCode: '<p style="color: white;">Custom HTML</p>' };
    default:
      return {};
  }
}

// Selector for getting the currently selected section
export const useSelectedSection = () => {
  const page = useEditorStore((state) => state.page);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  return page.sections.find((s) => s.id === selectedSectionId) || null;
};

// Import published context for use in the wrapper hook
import { usePublishedContext } from "./published-context";

/**
 * Hook that works in BOTH editor and published contexts.
 *
 * In published mode: Returns the PublishedContext (read-only, preview mode)
 * In editor mode: Returns the full EditorStore
 *
 * This allows editor components to be reused for published pages without modification.
 */
export function useEditorStoreOrPublished() {
  const publishedContext = usePublishedContext();

  // We need to call the store hook unconditionally due to React hooks rules
  // But we'll only use its value if we're not in published context
  const editorStore = useEditorStore();

  // If we're in published context, return that instead
  if (publishedContext) {
    return publishedContext;
  }

  // Otherwise return the real editor store
  return editorStore;
}
