import type { ElementType, ElementContent, ElementStyleOverride } from './page-schema';

export type ElementPreset = {
  id: string;
  name: string;
  description?: string;
  content: Partial<ElementContent>;
  styles: Partial<ElementStyleOverride>;
  previewClasses: string;  // Tailwind classes for thumbnail preview
};

// ==================== BUTTON PRESETS (12) ====================
export const BUTTON_PRESETS: ElementPreset[] = [
  {
    id: 'primary',
    name: 'Primary',
    description: 'Solid color, scale on hover',
    content: { buttonVariant: 'primary', animation: { hover: 'scale', click: 'press' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black hover:scale-105',
  },
  {
    id: 'secondary',
    name: 'Secondary',
    description: 'Muted background, lift on hover',
    content: { buttonVariant: 'secondary', animation: { hover: 'lift' } },
    styles: {},
    previewClasses: 'bg-white/10 text-white hover:-translate-y-0.5',
  },
  {
    id: 'outline',
    name: 'Outline',
    description: 'Border only, fill on hover',
    content: { buttonVariant: 'outline', animation: { hover: 'fill' } },
    styles: {},
    previewClasses: 'border-2 border-white/30 text-white bg-transparent hover:bg-white/10',
  },
  {
    id: 'ghost',
    name: 'Ghost',
    description: 'Transparent, subtle glow on hover',
    content: { buttonVariant: 'ghost', animation: { hover: 'glow' } },
    styles: {},
    previewClasses: 'text-white bg-transparent hover:bg-white/5',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Gradient background, glow on hover',
    content: { buttonVariant: 'gradient', animation: { hover: 'glow' } },
    styles: {},
    previewClasses: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Glowing border, pulse animation',
    content: { buttonVariant: 'neon', animation: { hover: 'pulse' } },
    styles: {},
    previewClasses: 'border-2 border-[#D6FC51] text-[#D6FC51] bg-transparent shadow-[0_0_10px_#D6FC51]',
  },
  {
    id: '3d',
    name: '3D',
    description: 'Shadow depth, press down on click',
    content: { buttonVariant: '3d', animation: { click: 'press' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black shadow-[0_4px_0_#a8c941]',
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Frosted glass effect',
    content: { buttonVariant: 'glass', animation: { hover: 'glow' } },
    styles: {},
    previewClasses: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white',
  },
  {
    id: 'pill',
    name: 'Rounded Pill',
    description: 'Full border-radius pill shape',
    content: { buttonVariant: 'pill', animation: { hover: 'scale' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black rounded-full',
  },
  {
    id: 'icon',
    name: 'Icon Button',
    description: 'With arrow icon',
    content: { buttonVariant: 'icon', animation: { hover: 'scale' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black flex items-center gap-2',
  },
  {
    id: 'underline',
    name: 'Underline',
    description: 'Text with underline animation',
    content: { buttonVariant: 'underline', animation: { hover: 'underline' } },
    styles: {},
    previewClasses: 'text-white bg-transparent underline-offset-4 hover:underline',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Bounces on hover',
    content: { buttonVariant: 'bounce', animation: { hover: 'bounce' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black',
  },
  // ==================== NEW 21ST.DEV BUTTON VARIANTS ====================
  {
    id: 'animated-generate',
    name: 'Animated Generate',
    description: 'Sparkle icon with letter animations',
    content: { buttonVariant: 'animated-generate', animation: { hover: 'glow' } },
    styles: {},
    previewClasses: 'bg-[#0a0a0b] text-white border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]',
  },
  {
    id: 'liquid',
    name: 'Liquid',
    description: 'Animated gradient background',
    content: { buttonVariant: 'liquid', animation: { hover: 'glow' } },
    styles: {},
    previewClasses: 'bg-gradient-to-r from-[#1E10C5] via-[#4743EF] to-[#1E10C5] text-white',
  },
  {
    id: 'flow',
    name: 'Flow',
    description: 'Arrow slide-through effect',
    content: { buttonVariant: 'flow', animation: { hover: 'fill' } },
    styles: {},
    previewClasses: 'bg-transparent text-[#111111] border border-[#333]/40 hover:bg-[#111111] hover:text-white',
  },
  {
    id: 'ripple',
    name: 'Ripple',
    description: 'Click ripple effect',
    content: { buttonVariant: 'ripple', animation: { click: 'ripple' } },
    styles: {},
    previewClasses: 'bg-[#D6FC51] text-black border-2 border-[#D6FC51]/50',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Playful highlight sweep',
    content: { buttonVariant: 'cartoon', animation: { hover: 'lift' } },
    styles: {},
    previewClasses: 'bg-orange-400 text-neutral-800 border-2 border-neutral-800 shadow-[0_4px_0_#262626]',
  },
  {
    id: 'win98',
    name: 'Win98',
    description: 'Retro Windows 98 style',
    content: { buttonVariant: 'win98', animation: { click: 'press' } },
    styles: {},
    previewClasses: 'bg-[silver] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]',
  },
];

// ==================== BADGE PRESETS (8) ====================
export const BADGE_PRESETS: ElementPreset[] = [
  {
    id: 'default',
    name: 'Default',
    content: { badgeVariant: 'default' },
    styles: {},
    previewClasses: 'bg-white/10 text-white/80',
  },
  {
    id: 'success',
    name: 'Success',
    content: { badgeVariant: 'success' },
    styles: {},
    previewClasses: 'bg-green-500/20 text-green-400',
  },
  {
    id: 'warning',
    name: 'Warning',
    content: { badgeVariant: 'warning' },
    styles: {},
    previewClasses: 'bg-yellow-500/20 text-yellow-400',
  },
  {
    id: 'error',
    name: 'Error',
    content: { badgeVariant: 'error' },
    styles: {},
    previewClasses: 'bg-red-500/20 text-red-400',
  },
  {
    id: 'info',
    name: 'Info',
    content: { badgeVariant: 'info' },
    styles: {},
    previewClasses: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    content: { badgeVariant: 'gradient' },
    styles: {},
    previewClasses: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  },
  {
    id: 'outline',
    name: 'Outline',
    content: { badgeVariant: 'outline' },
    styles: {},
    previewClasses: 'border border-white/30 text-white/80 bg-transparent',
  },
  {
    id: 'glow',
    name: 'Glow',
    content: { badgeVariant: 'glow' },
    styles: {},
    previewClasses: 'bg-[#D6FC51]/20 text-[#D6FC51] shadow-[0_0_8px_#D6FC51]',
  },
];

// ==================== ICON PRESETS (5) ====================
export const ICON_PRESETS: ElementPreset[] = [
  {
    id: 'circle',
    name: 'Circle Background',
    content: { iconVariant: 'circle' },
    styles: {},
    previewClasses: 'p-3 rounded-full bg-white/10',
  },
  {
    id: 'square',
    name: 'Square Background',
    content: { iconVariant: 'square' },
    styles: {},
    previewClasses: 'p-3 rounded-lg bg-white/10',
  },
  {
    id: 'none',
    name: 'No Background',
    content: { iconVariant: 'none' },
    styles: {},
    previewClasses: '',
  },
  {
    id: 'glow',
    name: 'With Glow',
    content: { iconVariant: 'glow' },
    styles: {},
    previewClasses: 'p-3 rounded-xl bg-white/5 shadow-[0_0_15px_rgba(214,252,81,0.3)]',
  },
  {
    id: 'shadow',
    name: 'With Shadow',
    content: { iconVariant: 'shadow' },
    styles: {},
    previewClasses: 'p-3 rounded-xl bg-white/10 shadow-xl',
  },
];

// ==================== DIVIDER PRESETS (5) ====================
export const DIVIDER_PRESETS: ElementPreset[] = [
  {
    id: 'solid',
    name: 'Solid',
    content: { dividerVariant: 'solid' },
    styles: {},
    previewClasses: 'border-t border-white/20',
  },
  {
    id: 'dashed',
    name: 'Dashed',
    content: { dividerVariant: 'dashed' },
    styles: {},
    previewClasses: 'border-t border-dashed border-white/20',
  },
  {
    id: 'dotted',
    name: 'Dotted',
    content: { dividerVariant: 'dotted' },
    styles: {},
    previewClasses: 'border-t border-dotted border-white/20',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    content: { dividerVariant: 'gradient' },
    styles: {},
    previewClasses: 'h-px bg-gradient-to-r from-transparent via-white/30 to-transparent',
  },
  {
    id: 'double',
    name: 'Double',
    content: { dividerVariant: 'double' },
    styles: {},
    previewClasses: 'border-t-4 border-double border-white/20',
  },
];

// ==================== TEXT PRESETS (4) ====================
export const TEXT_PRESETS: ElementPreset[] = [
  {
    id: 'heading',
    name: 'Heading',
    content: { textType: 'heading' },
    styles: { fontSize: 32, fontWeight: 'bold' },
    previewClasses: 'text-2xl font-bold',
  },
  {
    id: 'subheading',
    name: 'Subheading',
    content: { textType: 'subheading' },
    styles: { fontSize: 20, fontWeight: 'medium' },
    previewClasses: 'text-lg font-medium text-white/70',
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    content: { textType: 'paragraph' },
    styles: { fontSize: 16, fontWeight: 'normal' },
    previewClasses: 'text-base text-white/60',
  },
  {
    id: 'caption',
    name: 'Caption',
    content: { textType: 'caption' },
    styles: { fontSize: 12, fontWeight: 'normal' },
    previewClasses: 'text-xs text-white/40',
  },
];

// ==================== SOCIAL PRESETS (3) ====================
export const SOCIAL_PRESETS: ElementPreset[] = [
  {
    id: 'default',
    name: 'Default',
    content: {},
    styles: {},
    previewClasses: 'bg-white/5 rounded-lg',
  },
  {
    id: 'circle',
    name: 'Circle',
    content: {},
    styles: {},
    previewClasses: 'bg-white/5 rounded-full',
  },
  {
    id: 'colored',
    name: 'Colored',
    content: {},
    styles: {},
    previewClasses: 'bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg',
  },
];

// ==================== ALL PRESETS BY TYPE ====================
export const ELEMENT_PRESETS: Record<ElementType, ElementPreset[]> = {
  button: BUTTON_PRESETS,
  badge: BADGE_PRESETS,
  icon: ICON_PRESETS,
  divider: DIVIDER_PRESETS,
  text: TEXT_PRESETS,
  social: SOCIAL_PRESETS,
  image: [],      // Images use URL/size settings, not style presets
  video: [],      // Videos use URL/size settings
  countdown: [],  // Countdown uses date picker
  form: [],       // Form uses input/button text settings
  html: [],       // HTML uses code editor
};

// Helper to get a preset by type and id
export function getPreset(type: ElementType, presetId: string): ElementPreset | undefined {
  return ELEMENT_PRESETS[type]?.find(p => p.id === presetId);
}

// Helper to check if an element type has presets
export function hasPresets(type: ElementType): boolean {
  return (ELEMENT_PRESETS[type]?.length || 0) > 0;
}
