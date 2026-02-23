/**
 * Voice Command Executor
 *
 * Maps VoiceCommand types to Zustand editor store actions.
 * Supports single and batched command execution with undo history.
 */

import type { SectionType, ElementType, ElementPosition, SectionItem, ElementContent, ElementStyleOverride } from "../page-schema";
import type { VoiceCommand, VoiceCommandType } from "./types";

/**
 * Minimal store interface — only the actions the executor needs.
 * This avoids a hard dependency on the full EditorState type.
 */
export type VoiceExecutorStore = {
  // State
  page: { sections: Array<{ id: string; type: string }> };
  selectedSectionId: string | null;

  // History
  pushHistory: () => void;

  // Section actions
  updateSectionContent: (sectionId: string, content: Record<string, unknown>) => void;
  addSection: (type: SectionType, afterId?: string) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  duplicateSection: (sectionId: string) => void;
  selectSection: (sectionId: string | null) => void;

  // Color / typography / meta
  updateColorScheme: (colors: Record<string, string>) => void;
  updateTypography: (typography: Record<string, string>) => void;
  updatePageMeta: (meta: Record<string, unknown>) => void;
  applyThemePreset: (presetId: string) => void;

  // Item actions
  addItem: (sectionId: string) => void;
  updateItem: (sectionId: string, itemId: string, updates: Partial<SectionItem>) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  selectItem: (sectionId: string, itemId: string | null) => void;

  // Element actions
  addElement: (sectionId: string, type: ElementType, position: ElementPosition) => void;
  removeElement: (sectionId: string, elementId: string) => void;
  reorderElement: (sectionId: string, elementId: string, direction: 'up' | 'down') => void;
  selectElement: (sectionId: string | null, elementId: string | null) => void;
  updateElementContent: (sectionId: string, elementId: string, content: Partial<ElementContent>) => void;
  updateElementStyle: (sectionId: string, field: string, styles: Partial<ElementStyleOverride>, itemId?: string) => void;

  // Undo / redo
  undo: () => void;
  redo: () => void;
};

type ExecutionResult = {
  success: boolean;
  acknowledgment: string;
  error?: string;
};

/**
 * Resolve the target sectionId — use the command's explicit target,
 * fall back to the currently selected section.
 */
function resolveSectionId(command: VoiceCommand, store: VoiceExecutorStore): string | undefined {
  return command.target?.sectionId ?? store.selectedSectionId ?? undefined;
}

/**
 * Execute a single voice command against the store.
 */
export function executeVoiceCommand(
  command: VoiceCommand,
  store: VoiceExecutorStore
): ExecutionResult {
  try {
    const sectionId = resolveSectionId(command, store);
    const value = command.value ?? {};

    switch (command.type) {
      // --- Color & style ---
      case 'update_color': {
        store.pushHistory();
        store.updateColorScheme(value as Record<string, string>);
        break;
      }

      case 'update_typography': {
        store.pushHistory();
        store.updateTypography(value as Record<string, string>);
        break;
      }

      case 'apply_theme': {
        const presetId = (value.presetId ?? value.theme) as string | undefined;
        if (!presetId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing presetId' };
        store.pushHistory();
        store.applyThemePreset(presetId);
        break;
      }

      // --- Section content ---
      case 'update_section_content': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        store.pushHistory();
        store.updateSectionContent(sectionId, value);
        break;
      }

      case 'update_background_effect': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        store.pushHistory();
        store.updateSectionContent(sectionId, { backgroundEffect: value.backgroundEffect });
        break;
      }

      case 'toggle_visibility': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const field = command.target?.field;
        if (!field) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing visibility field' };
        store.pushHistory();
        store.updateSectionContent(sectionId, { [field]: value.visible ?? true });
        break;
      }

      // --- Section CRUD ---
      case 'add_section': {
        const type = (value.sectionType ?? value.type) as SectionType | undefined;
        if (!type) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing section type' };
        store.pushHistory();
        store.addSection(type, sectionId);
        break;
      }

      case 'remove_section': {
        const targetId = sectionId;
        if (!targetId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        store.pushHistory();
        store.removeSection(targetId);
        break;
      }

      case 'move_section': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const direction = (value.direction as "up" | "down") ?? "up";
        store.pushHistory();
        store.moveSection(sectionId, direction);
        break;
      }

      case 'duplicate_section': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        store.pushHistory();
        store.duplicateSection(sectionId);
        break;
      }

      // --- Selection ---
      case 'select_section': {
        const targetId = command.target?.sectionId ?? null;
        store.selectSection(targetId);
        break;
      }

      case 'select_element': {
        const elSectionId = sectionId ?? null;
        const elementId = command.target?.elementId ?? null;
        store.selectElement(elSectionId ?? null, elementId);
        break;
      }

      case 'select_item': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const itemId = command.target?.itemId ?? null;
        store.selectItem(sectionId, itemId);
        break;
      }

      // --- Element CRUD ---
      case 'add_element': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const elType = (value.elementType ?? value.type) as ElementType | undefined;
        if (!elType) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing element type' };
        const position: ElementPosition = (value.position as ElementPosition) ?? { x: 50, y: 50, width: 200, height: 40 };
        store.pushHistory();
        store.addElement(sectionId, elType, position);
        break;
      }

      case 'remove_element': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const elementId = command.target?.elementId;
        if (!elementId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing element ID' };
        store.pushHistory();
        store.removeElement(sectionId, elementId);
        break;
      }

      case 'reorder_element': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const elementId = command.target?.elementId;
        if (!elementId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing element ID' };
        const direction = (value.direction as 'up' | 'down') ?? 'up';
        store.pushHistory();
        store.reorderElement(sectionId, elementId, direction);
        break;
      }

      case 'update_element_content': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const elementId = command.target?.elementId;
        if (!elementId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing element ID' };
        store.pushHistory();
        store.updateElementContent(sectionId, elementId, value as Partial<ElementContent>);
        break;
      }

      case 'update_element_style': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const field = command.target?.field ?? 'heading';
        const itemId = command.target?.itemId;
        // Map webkitTextStroke semantic values to CSS
        const styles = { ...value } as Partial<ElementStyleOverride>;
        if (styles.webkitTextStroke) {
          const strokeMap: Record<string, string> = { none: '', thin: '1px currentColor', med: '2px currentColor', bold: '3px currentColor' };
          styles.webkitTextStroke = strokeMap[styles.webkitTextStroke as string] ?? (styles.webkitTextStroke as string);
        }
        store.pushHistory();
        store.updateElementStyle(sectionId, field, styles, itemId);
        break;
      }

      // --- Items ---
      case 'add_item': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        store.pushHistory();
        store.addItem(sectionId);
        break;
      }

      case 'update_item': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const itemId = command.target?.itemId;
        if (!itemId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing item ID' };
        store.pushHistory();
        store.updateItem(sectionId, itemId, value as Partial<SectionItem>);
        break;
      }

      case 'remove_item': {
        if (!sectionId) return { success: false, acknowledgment: command.acknowledgment, error: 'No section selected' };
        const itemId = command.target?.itemId;
        if (!itemId) return { success: false, acknowledgment: command.acknowledgment, error: 'Missing item ID' };
        store.pushHistory();
        store.removeItem(sectionId, itemId);
        break;
      }

      // --- Page meta ---
      case 'update_page_meta': {
        store.pushHistory();
        store.updatePageMeta(value);
        break;
      }

      // --- Undo / redo ---
      case 'undo': {
        store.undo();
        break;
      }

      case 'redo': {
        store.redo();
        break;
      }

      case 'unknown':
      default:
        return { success: false, acknowledgment: command.acknowledgment, error: `Unrecognized command type: ${command.type}` };
    }

    return { success: true, acknowledgment: command.acknowledgment };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, acknowledgment: command.acknowledgment, error: message };
  }
}

/**
 * Execute a batch of voice commands.
 * Pushes a single history entry before the batch so the entire
 * batch can be undone in one step, then delegates to individual
 * handlers *without* extra pushHistory calls.
 */
export function executeVoiceCommandBatch(
  commands: VoiceCommand[],
  store: VoiceExecutorStore
): ExecutionResult[] {
  if (commands.length === 0) return [];

  // Push one history snapshot before the batch
  store.pushHistory();

  // Wrap store so individual commands skip pushHistory
  const batchStore: VoiceExecutorStore = {
    ...store,
    pushHistory: () => {}, // no-op inside batch
  };

  return commands.map((cmd) => executeVoiceCommand(cmd, batchStore));
}
