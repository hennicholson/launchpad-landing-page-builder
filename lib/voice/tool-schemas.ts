/**
 * OpenAI Realtime API Tool Schemas (compressed)
 *
 * Defines function/tool schemas for all editor commands.
 * Sent ONCE via session.update on connect — not on every update.
 *
 * Optimized for minimal token footprint:
 * - Descriptions stripped from self-explanatory properties
 * - Button/heading style merged into update_section_content
 * - Obvious enums removed
 */

import type { VoiceCommand, VoiceCommandType } from './types';

export type RealtimeTool = {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export const VOICE_TOOLS: RealtimeTool[] = [
  // =============================================
  // COLORS & TYPOGRAPHY
  // =============================================
  {
    type: 'function',
    name: 'update_color',
    description: 'Change page-level theme colors. Pass hex values.',
    parameters: {
      type: 'object',
      properties: {
        primary: { type: 'string' },
        secondary: { type: 'string' },
        accent: { type: 'string' },
        background: { type: 'string' },
        text: { type: 'string' },
      },
    },
  },
  {
    type: 'function',
    name: 'update_typography',
    description: 'Change page fonts.',
    parameters: {
      type: 'object',
      properties: {
        headingFont: { type: 'string' },
        bodyFont: { type: 'string' },
      },
    },
  },
  {
    type: 'function',
    name: 'apply_theme',
    description: 'Apply a theme preset.',
    parameters: {
      type: 'object',
      properties: {
        presetId: { type: 'string', enum: ['dark', 'light', 'midnight', 'forest', 'ocean', 'sunset'] },
      },
      required: ['presetId'],
    },
  },

  // =============================================
  // SECTION CONTENT (text, media, colors, buttons, heading style)
  // =============================================
  {
    type: 'function',
    name: 'update_section_content',
    description:
      'Change any section property: text, media, colors, button styling, heading style. Uses selected section if sectionId omitted.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        // --- Text ---
        heading: { type: 'string' },
        subheading: { type: 'string' },
        bodyText: { type: 'string' },
        description: { type: 'string' },
        introText: { type: 'string' },
        badge: { type: 'string' },
        topTitle: { type: 'string' },
        accentHeading: { type: 'string' },
        tagline: { type: 'string' },
        pullQuote: { type: 'string' },
        solutionTeaser: { type: 'string' },
        trustText: { type: 'string' },
        socialProof: { type: 'string' },
        creatorName: { type: 'string' },
        creatorRole: { type: 'string' },
        logoText: { type: 'string' },
        logoUrl: { type: 'string' },
        searchPlaceholder: { type: 'string' },
        // --- Buttons ---
        buttonText: { type: 'string' },
        buttonLink: { type: 'string' },
        ctaText: { type: 'string' },
        ctaUrl: { type: 'string' },
        ctaSecondaryText: { type: 'string' },
        buttonVariant: {
          type: 'string',
          enum: ['primary', 'secondary', 'outline', 'ghost', 'gradient', 'neon', '3d', 'glass', 'pill', 'icon', 'underline', 'bounce', 'animated-generate', 'liquid', 'flow', 'ripple', 'cartoon', 'win98', 'email-capture'],
        },
        buttonSize: { type: 'string', enum: ['sm', 'md', 'lg', 'xl'] },
        buttonShadow: { type: 'string', enum: ['none', 'sm', 'md', 'lg'] },
        buttonBorderRadius: { type: 'number' },
        buttonBorderWidth: { type: 'number' },
        buttonPaddingX: { type: 'number' },
        buttonPaddingY: { type: 'number' },
        buttonFontSize: { type: 'number' },
        buttonFontWeight: { type: 'string' },
        buttonBgColor: { type: 'string' },
        buttonTextColor: { type: 'string' },
        buttonBorderColor: { type: 'string' },
        showSecondaryButton: { type: 'boolean' },
        secondaryButtonBgColor: { type: 'string' },
        secondaryButtonTextColor: { type: 'string' },
        secondaryButtonBorderColor: { type: 'string' },
        // --- Media ---
        backgroundImageUrl: { type: 'string' },
        videoUrl: { type: 'string' },
        featuredImageUrl: { type: 'string' },
        featuredImageAlt: { type: 'string' },
        // --- Colors ---
        backgroundColor: { type: 'string' },
        textColor: { type: 'string' },
        accentColor: { type: 'string' },
        // --- Heading/subheading style ---
        headingStyle: { type: 'string', enum: ['solid', 'gradient', 'outline'] },
        subheadingAnimation: { type: 'string', enum: ['fadeUp', 'blurIn', 'slideRight', 'slideLeft', 'scaleIn', 'stagger', 'none'] },
        subheadingSize: { type: 'string', enum: ['sm', 'base', 'lg', 'xl'] },
        subheadingWeight: { type: 'string', enum: ['normal', 'medium', 'semibold'] },
        subheadingOpacity: { type: 'number' },
        badgeIcon: { type: 'string', enum: ['checkmark', 'shield', 'star', 'none'] },
        // --- Padding ---
        paddingTop: { type: 'number' },
        paddingBottom: { type: 'number' },
        // --- Layout ---
        layout: { type: 'string', enum: ['left', 'right', 'center', 'grid'] },
        overlayOpacity: { type: 'number' },
        // --- Section typography ---
        sectionHeadingFont: { type: 'string' },
        sectionBodyFont: { type: 'string' },
        sectionHeadingSizeScale: { type: 'number' },
        sectionTextAlign: { type: 'string', enum: ['left', 'center', 'right'] },
        // --- Section animation ---
        sectionAnimationPreset: { type: 'string', enum: ['none', 'subtle', 'moderate', 'dramatic'] },
        // --- Section-specific ---
        imageUrl: { type: 'string' },
        formPlaceholder: { type: 'string' },
        formButtonText: { type: 'string' },
        creatorBio: { type: 'string' },
        forHeading: { type: 'string' },
        notForHeading: { type: 'string' },
      },
    },
  },

  // =============================================
  // SECTION LAYOUT & VARIANTS
  // =============================================
  {
    type: 'function',
    name: 'update_section_layout',
    description:
      'Change section layout variant, spacing, or sizing. Uses selected section if sectionId omitted.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        heroVariant: { type: 'string', enum: ['default', 'animated-preview', 'email-signup', 'sales-funnel', 'glassmorphism-trust', 'hero-email-glass', 'hero-form-multi'] },
        featuresVariant: { type: 'string', enum: ['default', 'illustrated', 'hover', 'bento', 'table'] },
        ctaVariant: { type: 'string', enum: ['centered', 'split', 'banner', 'minimal'] },
        testimonialVariant: { type: 'string', enum: ['scrolling', 'twitter-cards', 'screenshots'] },
        galleryVariant: { type: 'string', enum: ['bento', 'focusrail'] },
        statsVariant: { type: 'string', enum: ['cards', 'minimal', 'bars', 'circles'] },
        processVariant: { type: 'string', enum: ['timeline', 'cards', 'horizontal'] },
        videoVariant: { type: 'string', enum: ['centered', 'grid', 'side-by-side', 'fullscreen'] },
        headerVariant: { type: 'string', enum: ['default', 'header-2', 'floating-header', 'simple-header', 'header-with-search'] },
        headerPaddingY: { type: 'number' },
        heroElementGap: { type: 'number' },
        statsCardGap: { type: 'number' },
        minHeight: { type: 'number' },
        logoSize: { type: 'string', enum: ['small', 'medium', 'large', 'custom'] },
        customLogoSize: { type: 'number' },
        videoAspectRatio: { type: 'string', enum: ['16:9', '4:3', '1:1'] },
        autoplayVideo: { type: 'boolean' },
        muteVideo: { type: 'boolean' },
        headerPosition: { type: 'string', enum: ['sticky', 'fixed', 'static'] },
        headerBackgroundOpacity: { type: 'number' },
      },
    },
  },

  // =============================================
  // TEXT ELEMENT STYLING
  // =============================================
  {
    type: 'function',
    name: 'update_element_style',
    description:
      'Change text styling for a section field (heading, subheading, bodyText, buttonText, etc). Uses selected section if sectionId omitted.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        field: { type: 'string', description: 'Which text field to style' },
        fontSize: { type: 'number' },
        fontFamily: { type: 'string' },
        fontWeight: { type: 'string' },
        color: { type: 'string' },
        textAlign: { type: 'string', enum: ['left', 'center', 'right'] },
        textTransform: { type: 'string', enum: ['none', 'uppercase', 'lowercase', 'capitalize'] },
        lineHeight: { type: 'number' },
        letterSpacing: { type: 'string' },
        fontStyle: { type: 'string', enum: ['normal', 'italic'] },
        textDecoration: { type: 'string', enum: ['none', 'underline', 'line-through'] },
        textOpacity: { type: 'number' },
        textShadow: { type: 'string', enum: ['none', 'subtle', 'medium', 'strong', 'glow', 'neon'] },
        webkitTextStroke: { type: 'string', enum: ['none', 'thin', 'med', 'bold'] },
        opacity: { type: 'number' },
      },
      required: ['field'],
    },
  },

  // =============================================
  // CUSTOM ELEMENT CONTENT
  // =============================================
  {
    type: 'function',
    name: 'update_element_content',
    description: 'Change custom element content (button text, image src, etc)',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        elementId: { type: 'string' },
        text: { type: 'string' },
        src: { type: 'string' },
        href: { type: 'string' },
        alt: { type: 'string' },
        html: { type: 'string' },
        label: { type: 'string' },
        placeholder: { type: 'string' },
        // --- Button ---
        buttonVariant: { type: 'string' },
        buttonSize: { type: 'string', enum: ['sm', 'md', 'lg', 'xl'] },
        buttonBgColor: { type: 'string' },
        buttonTextColor: { type: 'string' },
        buttonBorderRadius: { type: 'number' },
        // --- Image ---
        imageWidth: { type: 'number' },
        imageFit: { type: 'string', enum: ['cover', 'contain', 'fill'] },
        imageBorderRadius: { type: 'number' },
        // --- Icon ---
        iconName: { type: 'string' },
        iconSize: { type: 'number' },
        iconColor: { type: 'string' },
        // --- Badge ---
        badgeVariant: { type: 'string' },
        badgeBgColor: { type: 'string' },
        badgeTextColor: { type: 'string' },
        // --- Divider ---
        dividerVariant: { type: 'string', enum: ['solid', 'dashed', 'dotted', 'gradient', 'double'] },
        dividerColor: { type: 'string' },
        // --- Universal ---
        opacity: { type: 'number' },
      },
      required: ['elementId'],
    },
  },

  // =============================================
  // SECTION CRUD
  // =============================================
  {
    type: 'function',
    name: 'add_section',
    description: 'Add a new section to the page',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'hero', 'features', 'testimonials', 'pricing', 'cta', 'faq',
            'video', 'gallery', 'header', 'footer', 'founders', 'credibility',
            'offer', 'audience', 'stats', 'logoCloud', 'comparison', 'process', 'blank',
            'value-proposition', 'offer-details', 'creator', 'detailed-features', 'loader',
            'glass-cta', 'glass-features', 'glass-founders', 'glass-testimonials', 'glass-pricing',
            'whop-hero', 'whop-value-prop', 'whop-offer', 'whop-cta', 'whop-comparison',
            'whop-creator', 'whop-curriculum', 'whop-results', 'whop-testimonials', 'whop-final-cta',
          ],
        },
        afterSectionId: { type: 'string' },
      },
      required: ['type'],
    },
  },
  {
    type: 'function',
    name: 'remove_section',
    description: 'Remove a section. Uses selected if sectionId omitted.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
      },
    },
  },
  {
    type: 'function',
    name: 'move_section',
    description: 'Move a section up or down.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        direction: { type: 'string' },
      },
      required: ['direction'],
    },
  },
  {
    type: 'function',
    name: 'duplicate_section',
    description: 'Duplicate a section.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
      },
    },
  },

  // =============================================
  // SELECTION
  // =============================================
  {
    type: 'function',
    name: 'select_section',
    description: 'Select a section by ID',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
      },
      required: ['sectionId'],
    },
  },
  {
    type: 'function',
    name: 'select_element',
    description: 'Select an element within a section',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        elementId: { type: 'string' },
      },
      required: ['elementId'],
    },
  },
  {
    type: 'function',
    name: 'select_item',
    description: 'Select an item in a section (card, testimonial, pricing tier, etc). Pass null itemId to deselect.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        itemId: { type: 'string' },
      },
    },
  },

  // =============================================
  // ELEMENTS
  // =============================================
  {
    type: 'function',
    name: 'add_element',
    description: 'Add a custom element to a section',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        type: {
          type: 'string',
          enum: ['button', 'text', 'image', 'divider', 'badge', 'icon', 'video', 'form', 'social', 'countdown', 'html'],
        },
      },
      required: ['type'],
    },
  },
  {
    type: 'function',
    name: 'remove_element',
    description: 'Remove a custom element from a section',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        elementId: { type: 'string' },
      },
      required: ['elementId'],
    },
  },
  {
    type: 'function',
    name: 'reorder_element',
    description: 'Move element up or down in layer order',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        elementId: { type: 'string' },
        direction: { type: 'string', enum: ['up', 'down'] },
      },
      required: ['elementId', 'direction'],
    },
  },

  // =============================================
  // ITEMS (features, testimonials, pricing, stats)
  // =============================================
  {
    type: 'function',
    name: 'update_item',
    description: 'Update a section item (feature card, testimonial, pricing tier, stat, founder)',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        itemId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        icon: { type: 'string' },
        imageUrl: { type: 'string' },
        price: { type: 'string' },
        period: { type: 'string' },
        popular: { type: 'boolean' },
        features: { type: 'string', description: 'Comma-separated feature list' },
        name: { type: 'string' },
        role: { type: 'string' },
        quote: { type: 'string' },
        rating: { type: 'number' },
        result: { type: 'string' },
        bio: { type: 'string' },
        linkedinUrl: { type: 'string' },
        label: { type: 'string' },
        value: { type: 'string' },
        badge: { type: 'string' },
        buttonText: { type: 'string' },
        buttonLink: { type: 'string' },
        gridClass: { type: 'string' },
      },
      required: ['itemId'],
    },
  },
  {
    type: 'function',
    name: 'add_item',
    description: 'Add a new item to a section',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
      },
    },
  },
  {
    type: 'function',
    name: 'remove_item',
    description: 'Remove an item from a section',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        itemId: { type: 'string' },
      },
      required: ['itemId'],
    },
  },

  // =============================================
  // PAGE META
  // =============================================
  {
    type: 'function',
    name: 'update_page_meta',
    description: 'Change page title, description, or global settings',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        animationPreset: { type: 'string', enum: ['none', 'subtle', 'moderate', 'dramatic'] },
        contentWidth: { type: 'string', enum: ['narrow', 'medium', 'wide'] },
        smoothScroll: { type: 'boolean' },
      },
    },
  },

  // =============================================
  // VISIBILITY TOGGLES
  // =============================================
  {
    type: 'function',
    name: 'toggle_visibility',
    description: 'Show or hide section elements.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        field: {
          type: 'string',
          enum: [
            'showHeading', 'showSubheading', 'showBodyText', 'showButton',
            'showImage', 'showBadge', 'showSecondaryButton', 'showItems',
            'showBackground', 'showBackgroundImage', 'showAccentHeading',
            'showMiniStats', 'showClientLogos',
            'showVideo', 'showBrands', 'showLinks', 'showLogo', 'showTagline',
            'showSocial', 'showForItems', 'showNotForItems', 'showSearchBar', 'showFeatures',
          ],
        },
        visible: { type: 'boolean' },
      },
      required: ['field', 'visible'],
    },
  },

  // =============================================
  // BACKGROUND EFFECT
  // =============================================
  {
    type: 'function',
    name: 'update_background_effect',
    description: 'Change section background visual effect',
    parameters: {
      type: 'object',
      properties: {
        sectionId: { type: 'string' },
        backgroundEffect: {
          type: 'string',
          enum: ['none', 'elegant-shapes', 'background-circles', 'background-paths', 'glow', 'shooting-stars', 'stars-background', 'wavy-background', 'aurora', 'spotlight', 'background-beams', 'meteors', 'sparkles'],
        },
      },
      required: ['backgroundEffect'],
    },
  },

  // =============================================
  // UNDO / REDO
  // =============================================
  {
    type: 'function',
    name: 'undo',
    description: 'Undo the last change',
    parameters: { type: 'object', properties: {} },
  },
  {
    type: 'function',
    name: 'redo',
    description: 'Redo the last undone change',
    parameters: { type: 'object', properties: {} },
  },
];

// =============================================
// TOOL NAME → EXECUTOR COMMAND TYPE REMAPPING
// =============================================

const TOOL_TYPE_REMAP: Record<string, VoiceCommandType> = {
  update_section_layout: 'update_section_content',
};

/**
 * Convert a Realtime API function call into a VoiceCommand
 * that the existing command-executor understands.
 */
export function functionCallToVoiceCommand(
  name: string,
  args: Record<string, unknown>
): VoiceCommand {
  const target: Record<string, string> = {};
  const value: Record<string, unknown> = {};

  // Extract target fields
  const targetKeys = ['sectionId', 'elementId', 'itemId', 'field', 'afterSectionId'];
  for (const [key, val] of Object.entries(args)) {
    if (targetKeys.includes(key) && typeof val === 'string') {
      target[key] = val;
    } else {
      value[key] = val;
    }
  }

  // For add_section, the executor expects value.type
  if (name === 'add_section' && target.afterSectionId) {
    target.sectionId = target.afterSectionId;
    delete target.afterSectionId;
  }

  // Remap new tool names to existing command types
  const commandType = TOOL_TYPE_REMAP[name] || name;

  return {
    type: commandType as VoiceCommandType,
    target: Object.keys(target).length > 0 ? target : undefined,
    value: Object.keys(value).length > 0 ? value : undefined,
    acknowledgment: '',
  };
}
