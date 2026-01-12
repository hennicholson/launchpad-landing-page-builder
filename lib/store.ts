import { create } from "zustand";
import type { LandingPage, PageSection, SectionType, SectionItem, ElementStyleOverride } from "./page-schema";
import { createSection, generateId, defaultPage, THEME_PRESETS } from "./page-schema";

type EditingField = {
  sectionId: string;
  field: string;
  itemId?: string; // For editing items within sections
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

  // Actions
  setPage: (page: LandingPage) => void;
  updateSection: (sectionId: string, updates: Partial<PageSection>) => void;
  updateSectionContent: (sectionId: string, content: Partial<PageSection["content"]>) => void;
  addSection: (type: SectionType, afterId?: string) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
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

  // Undo/Redo actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
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

  addSection: (type, afterId) =>
    set((state) => {
      const newSection = createSection(type);
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
    set({ selectedSectionId: sectionId }),

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

  openElementStylePanel: (data) => set({ elementStylePanel: data }),

  closeElementStylePanel: () => set({ elementStylePanel: null }),

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

  reset: () =>
    set({
      page: defaultPage,
      originalPage: null,
      history: [],
      historyIndex: -1,
      selectedSectionId: null,
      isDirty: false,
      isSaving: false,
      isGenerating: false,
      editingField: null,
      isPreviewMode: false,
      aiEditingSectionId: null,
      isAIGenerating: false,
      elementStylePanel: null,
    }),
}));

// Selector for getting the currently selected section
export const useSelectedSection = () => {
  const page = useEditorStore((state) => state.page);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  return page.sections.find((s) => s.id === selectedSectionId) || null;
};
