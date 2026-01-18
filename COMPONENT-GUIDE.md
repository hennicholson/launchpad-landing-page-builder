# Component Architecture Guide

> **For Claude Code / AI Navigation**
> This guide helps AI assistants understand the Launchpad component system, how components are structured, and how to add or modify them while maintaining deployment parity.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [How Components Work](#how-components-work)
3. [Adding New Components](#adding-new-components)
4. [Variant System](#variant-system)
5. [Animation Guidelines](#animation-guidelines)
6. [Type Safety Patterns](#type-safety-patterns)
7. [Common Patterns](#common-patterns)
8. [Deployment Parity Rules](#deployment-parity-rules)

---

## Directory Structure

```
/components/
├── editor/                    # Editor-specific wrappers (NOT deployed)
│   ├── sections/              # EditableText, drag handles, selection UI
│   │   ├── HeroSection.tsx    # Wraps shared/HeroSectionBase.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── [20 section types]
│   └── PropertyPanel.tsx      # Controls for customization
│
├── shared/                    # DEPLOYED & EDITOR (single source of truth)
│   ├── sections/              # All section components (25+ files)
│   │   ├── HeroSectionBase.tsx
│   │   ├── FeaturesSectionBase.tsx
│   │   ├── features-variants/ # Feature variant subdirectory
│   │   │   └── FeaturesDefault.tsx
│   │   ├── FeaturesIllustratedBase.tsx
│   │   ├── FeaturesHoverBase.tsx
│   │   ├── FeaturesBentoBase.tsx
│   │   ├── CustomersTableBase.tsx
│   │   ├── SubheadingText.tsx
│   │   ├── SectionBackground.tsx
│   │   └── SectionButton.tsx
│   ├── primitives/            # Reusable components
│   │   ├── BrandMarquee.tsx
│   │   ├── ScrollColumn.tsx
│   │   ├── VideoMuteButton.tsx
│   │   └── VideoWithControls.tsx
│   ├── hooks/                 # Custom hooks
│   │   └── useCountUp.ts
│   └── ui/                    # shadcn/ui components
│       └── [various UI components]
│
├── ui/                        # shadcn/ui components (editor-specific)
│
└── [other editor-only components]

/lib/
├── page-schema.ts             # Type definitions for ALL sections
├── shared-section-types.ts    # Shared types for sections
├── subheading-utils.ts        # Subheading animation utilities
├── nextjs-project-generator.ts # Deployment code generator
└── utils.ts                   # Utility functions
```

---

## How Components Work

### Two Modes of Operation

**1. Editor Mode** (what user sees while building):
- Uses components from `/components/editor/sections/`
- These wrap the shared components with editing capabilities
- Adds: EditableText, drag handles, selection outlines
- Example: `HeroSection.tsx` wraps `HeroSectionBase.tsx`

**2. Deployed Sites** (what gets published to Netlify):
- Uses components from `/components/shared/sections/` directly
- No editing UI, just the pure section rendering
- Copied to deployed project by `nextjs-project-generator.ts`

### Single Source of Truth

**Critical Principle**: `/components/shared/` is the ONLY source of truth for section rendering.

```
Editor Preview:
  /components/editor/sections/HeroSection.tsx
    → wraps → /components/shared/sections/HeroSectionBase.tsx

Deployed Site:
  /components/shared/sections/HeroSectionBase.tsx (directly)

Result: Editor preview === Deployed site (100% parity)
```

### Why This Matters

- **Before**: Two separate codebases (editor templates vs deployed templates)
- **Now**: Single codebase, shared components copied to deployed sites
- **Benefit**: Changes to shared components automatically deploy correctly
- **Risk**: Breaking shared components breaks BOTH editor and deployed sites

---

## Adding New Components

### Step-by-Step Workflow

#### 1. Create the Shared Component

**File**: `/components/shared/sections/NewSectionBase.tsx`

```typescript
"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionContent } from "@/lib/page-schema";

interface NewSectionProps extends BaseSectionProps {
  content: SectionContent & {
    // Section-specific content fields
    title?: string;
    description?: string;
    // Add any new fields here
  };
}

export function NewSectionBase({
  content,
  sectionId,
  textColor,
  backgroundColor,
  headingFont,
  bodyFont,
  renderText,
}: NewSectionProps) {
  return (
    <motion.section
      id={sectionId}
      style={{ backgroundColor }}
      className="py-24 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <h2
            style={{ color: textColor, fontFamily: headingFont }}
            className="text-4xl font-bold mb-6"
          >
            {renderText
              ? renderText({
                  value: content.title,
                  sectionId,
                  field: "title",
                  className: "inline",
                })
              : content.title}
          </h2>
        )}
        {/* Add more rendering logic */}
      </div>
    </motion.section>
  );
}
```

**Key Points**:
- Always use `"use client"` directive (Framer Motion requires client components)
- Extend `BaseSectionProps` for consistent prop structure
- Use `renderText` prop for editor text editing (optional for deployed sites)
- Always include `sectionId` for proper element identification
- Use Framer Motion for animations

#### 2. Add to Schema

**File**: `/lib/page-schema.ts`

Add the new section type to the discriminated union:

```typescript
export type Section =
  | { type: "hero"; content: SectionContent & { /* hero fields */ }; id: string }
  | { type: "features"; content: SectionContent & { /* features fields */ }; id: string }
  // ... existing sections
  | { type: "newSection"; content: SectionContent & {
      title?: string;
      description?: string;
      // Add section-specific fields
    }; id: string };

export type SectionType =
  | "hero"
  | "features"
  // ... existing types
  | "newSection";
```

**TypeScript Discriminated Union Pattern**:
- Each section type has distinct content structure
- TypeScript knows which fields are available based on `type`
- Prevents accessing invalid fields (e.g., can't access `heroTitle` on features section)

#### 3. Create Editor Wrapper

**File**: `/components/editor/sections/NewSection.tsx`

```typescript
"use client";

import { NewSectionBase } from "@/components/shared/sections/NewSectionBase";
import { EditableText } from "@/components/editor/EditableText";
import type { BaseSectionProps } from "@/lib/shared-section-types";

export function NewSection(props: BaseSectionProps) {
  const renderText = ({
    value,
    sectionId,
    field,
    className,
  }: {
    value: string;
    sectionId: string;
    field: string;
    className?: string;
  }) => (
    <EditableText
      value={value}
      sectionId={sectionId}
      field={field}
      className={className}
    />
  );

  return <NewSectionBase {...props} renderText={renderText} />;
}
```

**Pattern**: Editor wrapper adds `renderText` prop that enables inline editing.

#### 4. Add PropertyPanel Controls

**File**: `/components/editor/PropertyPanel.tsx`

Add controls in the appropriate section of the PropertyPanel:

```typescript
{sectionType === "newSection" && (
  <>
    <TextInput
      label="Title"
      value={selectedSection.content.title || ""}
      onChange={(value) =>
        updateSectionContent(selectedSectionId, { title: value })
      }
    />

    <TextAreaInput
      label="Description"
      value={selectedSection.content.description || ""}
      onChange={(value) =>
        updateSectionContent(selectedSectionId, { description: value })
      }
    />
  </>
)}
```

#### 5. Register in Section Renderer

**File**: `/components/editor/SectionRenderer.tsx` (and deployed `app/page.tsx`)

Add to the section type switch:

```typescript
case "newSection":
  return <NewSection key={section.id} {...sectionProps} />;
```

#### 6. Verify Deployment Copying

**File**: `/lib/nextjs-project-generator.ts`

Ensure `generateSharedComponents()` copies your new file:

```typescript
// Existing logic (around line 848)
const sectionFiles = fs.readdirSync(sectionsPath).filter(f => f.endsWith('.tsx'));
for (const file of sectionFiles) {
  files[`components/shared/sections/${file}`] = readAndTransform(path.join(sectionsPath, file));
}
```

**Note**: Top-level `.tsx` files are automatically copied. If you create a subdirectory (like `newSection-variants/`), you MUST add explicit copying logic (see features-variants fix at line 857).

#### 7. Test Build

```bash
npm run build
```

Verify no TypeScript errors. The build will catch:
- Missing imports
- Type mismatches
- Invalid schema references

#### 8. Deploy Test Site

Use the editor to:
1. Add your new section to a test page
2. Customize it via PropertyPanel
3. Click "Deploy"
4. Verify it renders correctly on live Netlify site

---

## Variant System

### What Are Variants?

Variants allow a single section type to have multiple visual layouts while sharing the same data structure.

**Example**: Features section has 5 variants:
1. `default` - Classic 3-column grid
2. `illustrated` - Icons with illustrations
3. `hover` - Hover effects on cards
4. `bento` - Bento box layout with Fibonacci spiral
5. `table` - Customer table format

### How Variants Work

#### 1. Schema Definition

**File**: `/lib/page-schema.ts`

```typescript
export type FeaturesVariant = "default" | "illustrated" | "hover" | "bento" | "table";

export type Section =
  | { type: "features"; content: SectionContent & {
      featuresVariant?: FeaturesVariant;
      // Shared fields for ALL variants
      badge?: string;
      heading?: string;
      features?: Array<{ title: string; description: string; icon?: string }>;
    }; id: string };
```

#### 2. Variant Selector

**File**: `/components/shared/sections/FeaturesSectionBase.tsx`

```typescript
export function FeaturesSectionBase(props: FeaturesSection) {
  const variant = props.content.featuresVariant || "default";

  switch (variant) {
    case "default":
      return <FeaturesDefault {...props} />;
    case "illustrated":
      return <FeaturesIllustratedBase {...props} />;
    case "hover":
      return <FeaturesHoverBase {...props} />;
    case "bento":
      return <FeaturesBentoBase {...props} />;
    case "table":
      return <CustomersTableBase {...props} />;
    default:
      return <FeaturesDefault {...props} />;
  }
}
```

#### 3. PropertyPanel Variant Control

**File**: `/components/editor/PropertyPanel.tsx`

```typescript
{sectionType === "features" && (
  <div className="space-y-2 border-b border-white/5 pb-4 mb-4">
    <label className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
      Layout Style
    </label>
    <select
      value={selectedSection.content.featuresVariant || "default"}
      onChange={(e) => updateSectionContent(selectedSectionId, {
        featuresVariant: e.target.value as FeaturesVariant
      })}
      className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10 text-sm text-white"
    >
      <option value="default">Default (Grid)</option>
      <option value="illustrated">Illustrated</option>
      <option value="hover">Hover Effects</option>
      <option value="bento">Bento Layout</option>
      <option value="table">Customer Table</option>
    </select>
  </div>
)}
```

### Current Variant Systems

| Section Type | Variants | Count |
|--------------|----------|-------|
| features | default, illustrated, hover, bento, table | 5 |
| header | default, header-2, floating-header, simple-header, header-with-search | 5 |
| testimonials | scrolling, twitter-cards | 2 |
| cta | centered, split, banner, minimal | 4 |
| video | centered, grid, side-by-side, fullscreen | 4 |
| gallery | bento, focusrail | 2 |
| stats | cards, minimal, bars, circles | 4 |
| process | timeline, cards, horizontal | 3 |

**Total**: 8 variant systems, 29+ individual variants

---

## Animation Guidelines

### Core Principles

1. **Always use Framer Motion** for animations
2. **Always include `viewport={{ once: true }}`** - animations trigger only once
3. **Use `whileInView`** for scroll-triggered animations
4. **Use `whileTap`** for button feedback
5. **Keep transitions under 0.6s** for snappiness
6. **Never use CSS animations** (except for infinite loops like marquees)

### Standard Patterns

#### Fade Up on Scroll

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>
```

**When to use**: Section entrances, card reveals

#### Button Tap Feedback

```typescript
<motion.button
  whileTap={{ scale: 0.98 }}
  className="px-6 py-3 rounded-lg"
>
  Click Me
</motion.button>
```

**When to use**: ALL buttons, CTAs, interactive elements

#### Stagger Children

```typescript
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

**When to use**: Lists of items, feature grids, testimonials

#### Hover Glow

```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
  className="relative group"
>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  {content}
</motion.div>
```

**When to use**: Cards, feature boxes, testimonials

### SubheadingText Component

**File**: `/components/shared/sections/SubheadingText.tsx`

Special component with 7 animation types:

```typescript
<SubheadingText
  content={content}
  sectionId={sectionId}
  textColor={textColor}
  bodyFont={bodyFont}
  renderText={renderText}
/>
```

**Animation Types** (set via `content.subheadingAnimation`):
1. `fadeUp` - Fade in from below (default)
2. `blurIn` - Blur to clear
3. `slideRight` - Slide from left
4. `slideLeft` - Slide from right
5. `scaleIn` - Scale from 0.95 to 1
6. `stagger` - Word-by-word animation
7. `none` - No animation

**Customization** (via PropertyPanel):
- Size: xs, sm, base, lg, xl
- Weight: normal, medium, semibold, bold
- Opacity: 0-100% (default 80%)

### Animation Performance

- Avoid animating layout properties (`width`, `height`) when possible
- Use `transform` and `opacity` for best performance
- Use `will-change` sparingly (only for complex animations)
- Test on mobile devices (animations can be janky on low-end phones)

---

## Type Safety Patterns

### Discriminated Unions

**File**: `/lib/page-schema.ts`

```typescript
export type Section =
  | { type: "hero"; content: SectionContent & { heroTitle?: string }; id: string }
  | { type: "features"; content: SectionContent & { featuresVariant?: FeaturesVariant }; id: string };
```

**Benefits**:
- TypeScript knows exact content structure based on `type`
- Autocomplete for section-specific fields
- Compile-time errors for invalid field access

**Usage in Components**:

```typescript
function renderSection(section: Section) {
  if (section.type === "hero") {
    // TypeScript knows: section.content.heroTitle exists
    return <div>{section.content.heroTitle}</div>;
  }
  if (section.type === "features") {
    // TypeScript knows: section.content.featuresVariant exists
    // TypeScript error: section.content.heroTitle (doesn't exist on features)
    return <div>{section.content.featuresVariant}</div>;
  }
}
```

### BaseSectionProps

**File**: `/lib/shared-section-types.ts`

```typescript
export interface BaseSectionProps {
  content: SectionContent;
  sectionId: string;
  textColor: string;
  backgroundColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: (props: {
    value: string;
    sectionId: string;
    field: string;
    className?: string;
  }) => React.ReactNode;
}
```

**Every section component** extends this interface:

```typescript
interface HeroSectionProps extends BaseSectionProps {
  content: SectionContent & {
    heroTitle?: string;
    heroSubtitle?: string;
  };
}
```

---

## Common Patterns

### 1. Conditional Rendering

```typescript
{content.showBadge && content.badge && (
  <Badge>{content.badge}</Badge>
)}
```

**Pattern**: Check both the toggle (`showBadge`) AND the value (`badge`)

### 2. Fallback Values

```typescript
const variant = content.featuresVariant || "default";
const size = content.subheadingSize || "base";
const weight = content.subheadingWeight || "normal";
```

**Pattern**: Always provide default values for optional fields

### 3. Color with Opacity

```typescript
const opacity = content.subheadingOpacity || 80;
const opacityHex = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
const colorWithOpacity = `${textColor}${opacityHex}`;
```

**Pattern**: Convert 0-100% opacity to hex (00-FF) and append to color

### 4. Font Family Styles

```typescript
<h1 style={{ fontFamily: headingFont, color: textColor }}>
  {content.heading}
</h1>

<p style={{ fontFamily: bodyFont, color: textColor }}>
  {content.description}
</p>
```

**Pattern**: Use inline `style` for dynamic fonts and colors (CSS classes won't work)

### 5. EditableText Pattern

```typescript
{renderText
  ? renderText({
      value: content.heading,
      sectionId,
      field: "heading",
      className: "inline",
    })
  : content.heading}
```

**Pattern**: Use `renderText` if provided (editor), otherwise render raw text (deployed)

### 6. Section Container

```typescript
<motion.section
  id={sectionId}
  style={{ backgroundColor }}
  className="py-24 px-4"
>
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</motion.section>
```

**Pattern**:
- Section uses `id={sectionId}` for editor selection
- Background color via inline `style`
- Vertical padding: `py-24` (96px)
- Horizontal padding: `px-4` (16px)
- Max width container: `max-w-7xl mx-auto`

---

## Deployment Parity Rules

### Critical Requirements

**1. Shared Components Must Work Standalone**

❌ **Bad**: Importing from `/components/editor/`
```typescript
import { EditableText } from "@/components/editor/EditableText"; // Won't exist in deployed sites!
```

✅ **Good**: Only import from `/components/shared/` or standard libraries
```typescript
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
```

**2. Use Optional renderText Prop**

```typescript
{renderText
  ? renderText({ value: content.title, sectionId, field: "title" })
  : content.title}
```

This allows the same component to work in:
- **Editor**: `renderText` provided → EditableText wrapper
- **Deployed**: `renderText` undefined → plain text

**3. No Editor-Specific Logic**

❌ **Bad**: Editor-specific features in shared components
```typescript
if (isEditor) {
  return <div className="editor-outline">{content}</div>;
}
```

✅ **Good**: Keep editor UI in editor wrappers only

**4. All Dependencies in package.json**

Ensure deployed `package.json` includes:
- `framer-motion`: ^11.3.8
- `react`: ^18.3.1
- `next`: ^14.2.28
- Any other libraries used in shared components

**File**: `/lib/nextjs-project-generator.ts` (lines 28-50)

**5. Test Deployed Build**

Before marking a feature complete:
1. Build in editor ✅
2. Deploy to Netlify ✅
3. Verify on live site ✅
4. Side-by-side comparison (editor vs deployed) ✅

**No parity = broken feature**

---

## Quick Reference

### Adding a New Section Type

1. ✅ Create `/components/shared/sections/NewSectionBase.tsx`
2. ✅ Add to `/lib/page-schema.ts` (Section union + SectionType)
3. ✅ Create `/components/editor/sections/NewSection.tsx` (wrapper)
4. ✅ Add PropertyPanel controls in `PropertyPanel.tsx`
5. ✅ Register in `SectionRenderer.tsx`
6. ✅ Test build: `npm run build`
7. ✅ Deploy test site and verify parity

### Adding a New Variant

1. ✅ Add variant type to `/lib/page-schema.ts` (e.g., `export type NewVariant = "v1" | "v2"`)
2. ✅ Create variant component files in `/components/shared/sections/`
3. ✅ Add switch statement in base section (e.g., `NewSectionBase.tsx`)
4. ✅ Add variant selector in `PropertyPanel.tsx`
5. ✅ If using subdirectory, update `nextjs-project-generator.ts` copying logic
6. ✅ Test build and deploy

### Debugging Deployment Issues

**Symptom**: Component works in editor but not deployed

**Check**:
1. ✅ Is component in `/components/shared/`?
2. ✅ Is it being copied by `nextjs-project-generator.ts`?
3. ✅ Are all imports from shared or standard libraries?
4. ✅ Are all dependencies in deployed `package.json`?
5. ✅ Check browser console on deployed site for errors
6. ✅ Check Netlify build logs for TypeScript errors

**Symptom**: Animation works in editor but not deployed

**Check**:
1. ✅ Is `framer-motion` in deployed `package.json`?
2. ✅ Is component using `"use client"` directive?
3. ✅ Are animations in shared component, not editor wrapper?

---

## Future AI Integration Notes

### For Claude Code / AI Assistants

When AI assistance is integrated (Phase 4 - Q4 2026), the AI will:

1. **Understand Component Library**: System prompts will include:
   - All 50+ section types and variants
   - Component schema from `page-schema.ts`
   - Design system constraints (colors, typography, spacing)
   - Animation patterns from this guide

2. **Context-Aware Editing**: For each edit request, AI receives:
   - Current page structure (JSON)
   - Section being edited
   - Design system settings
   - User's brand guidelines
   - Conversion optimization goals

3. **Maintain Parity**: AI must ensure:
   - All edits use shared components
   - No editor-specific code in shared files
   - Animations work in both editor and deployed
   - Type safety maintained

4. **Example AI Commands**:
   - "Make this section more professional" → Adjust tone, improve copy, refine styling
   - "Add a pricing table with 3 tiers" → Create pricing section with pricing variant
   - "Optimize for mobile" → Adjust spacing, font sizes for mobile
   - "Add social proof" → Insert testimonials section in appropriate location

**This guide serves as the foundation for AI to understand and modify the system correctly.**

---

_Last updated: January 17, 2026_
