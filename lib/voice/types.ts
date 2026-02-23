/**
 * Voice Agent Types
 *
 * TypeScript types for the AI voice agent system that maps
 * voice commands to editor store actions.
 */

// Voice command types mapping to store actions
export type VoiceCommandType =
  | 'update_color'
  | 'update_typography'
  | 'update_section_content'
  | 'update_element_style'
  | 'update_element_content'
  | 'update_page_meta'
  | 'apply_theme'
  | 'add_section'
  | 'remove_section'
  | 'move_section'
  | 'duplicate_section'
  | 'add_element'
  | 'remove_element'
  | 'reorder_element'
  | 'select_section'
  | 'select_element'
  | 'select_item'
  | 'update_item'
  | 'add_item'
  | 'remove_item'
  | 'undo'
  | 'redo'
  | 'toggle_visibility'
  | 'update_background_effect'
  | 'unknown';

export type VoiceCommand = {
  type: VoiceCommandType;
  target?: {
    sectionId?: string;
    elementId?: string;
    itemId?: string;
    field?: string;
  };
  value?: Record<string, unknown>;
  acknowledgment: string;
};

export type ParsedVoiceResponse = {
  commands: VoiceCommand[];
  clarification?: string;
};

export type VoiceConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export type VoiceConfig = {
  model: string;
  voice: string;
  language: string;
};

export type VoiceEditorContext = {
  selectedSectionId: string | null;
  selectedSection?: {
    id: string;
    type: string;
    variant?: string;
    heading?: string;
    subheading?: string;
    bodyText?: string;
    buttonText?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  selectedElementIds: string[];
  selectedElement?: {
    id: string;
    type: string;
    content: Record<string, unknown>;
  };
  selectedItemId: string | null;
  selectedItem?: {
    id: string;
    title?: string;
    description?: string;
    price?: string;
    quote?: string;
    name?: string;
    role?: string;
    label?: string;
  };
  sectionItems?: Array<{
    id: string;
    title?: string;
    name?: string;
    price?: string;
  }>;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  sectionList: Array<{ id: string; type: string; heading?: string }>;
  currentBreakpoint: string;
};
