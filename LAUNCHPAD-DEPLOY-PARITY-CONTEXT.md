# Launchpad Deployment Parity - Handoff Context

## Project Overview

**Launchpad** is a landing page builder that allows users to visually create landing pages with a drag-and-drop editor. The app has:

1. **Editor Mode** - Real-time visual editing with React + Framer Motion
2. **Preview Mode** - Shows exactly what the user built
3. **Deploy** - Publishes the site to Netlify as a standalone Next.js static export

**THE PROBLEM**: Deployed sites look significantly different from the editor/preview. Users build beautiful, animated pages but when deployed, they get a simplified, less polished version.

---

## Architecture

### How Deployment Works

```
User's pageData (JSON)
    ↓
generateNextJsProject() → Creates complete Next.js project files
    ↓
buildNextJsProject() → npm install + npm run build
    ↓
Static Export (out/ folder)
    ↓
deployNextJsApp() → Upload to Netlify
```

### Key Files

| File | Purpose |
|------|---------|
| `/lib/nextjs-project-generator.ts` | Generates the complete Next.js project structure |
| `/lib/deploy-section-components.ts` | **CRITICAL** - Contains all section component code as template strings |
| `/lib/nextjs-builder.ts` | Handles npm install and build process |
| `/lib/netlify.ts` | Deploys built files to Netlify |
| `/app/api/deploy/[id]/route.ts` | API endpoint that orchestrates deployment |
| `/components/sections/*.tsx` | **EDITOR COMPONENTS** - The real React components used in the editor |

---

## The Core Problem

### Editor Components vs Deploy Components

The **editor** uses real React components in `/components/sections/` with:
- Full Framer Motion animations
- State management (useEditorStore)
- EditableText/EditableImage for inline editing
- Complex interactive features

The **deployed** version uses template code strings in `/lib/deploy-section-components.ts`:
- Simplified animations
- No editor dependencies
- Missing many animation features
- Static content only

**These are TWO DIFFERENT CODEBASES for the same components.**

---

## Detailed Animation Parity Analysis

### What's MISSING in Deployed Version

#### Critical (Breaks Functionality)

| Component | Missing Feature | Impact |
|-----------|-----------------|--------|
| FAQ | AnimatePresence | Expand/collapse doesn't animate properly |
| Testimonials | Infinite scroll columns | 3 columns should scroll continuously, shows static grid instead |
| Stats | useCountUp hook | Numbers should count up on scroll, appear instantly instead |
| Stats | Variant support (bars, circles, minimal) | Only "cards" variant works |

#### Visual Polish (Looks Different)

| Component | Missing Feature | Impact |
|-----------|-----------------|--------|
| ALL buttons | whileTap={{ scale: 0.98 }} | No click feedback |
| CTA | Shine effect animation | Button looks flat |
| CTA | Button glow on hover | No premium feel |
| Features | Skeleton loading state | Images pop in instead of fade |
| Features | Hover glow overlay | Less depth on hover |
| Process | Step number glow (boxShadow) | Numbers less prominent |
| Process | Number hover scale 1.1 | No interactive feel |
| Hero | Video mute button whileTap | No click feedback |

### Animation Coverage Statistics

- **Editor animations**: ~194 instances
- **Deploy animations**: ~80 instances
- **Coverage**: Only 41% of animations make it to deployment

---

## Component-by-Component Comparison

### Hero Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
Badge scale animation         | ✓ Same
Heading y+opacity             | ✓ Same
Video mute whileTap           | ✗ MISSING
Button glow hover             | ✗ MISSING
Brand marquee infinite        | ✓ Same
```

### Features Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
Skeleton loading shimmer      | ✗ MISSING
Card stagger entrance         | ✓ Same
Hover scale 1.02              | ✓ Same
Hover glow overlay            | ✗ MISSING
Image hover zoom              | ✓ Same
Gradient text clipping        | ✗ MISSING (hardcoded colors)
```

### CTA Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
Background blur circles       | ✓ Same
Grid pattern background       | ✓ Same
Button shine @keyframes       | ✗ MISSING
4 layout variants             | Partial (3 variants)
Heading gradient styles       | ✓ Same (simplified)
Button hover glow             | ✓ Same
whileTap scale                | ✗ MISSING
```

### Testimonials Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
3-column infinite scroll      | ✗ BROKEN - static grid
Speed variation (28-35s)      | ✗ MISSING
Direction alternating         | ✗ MISSING
Card hover color              | ✓ Same
Avatar dynamic colors         | ✓ Same
```

### Stats Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
useCountUp animation          | ✗ MISSING
4 variants (cards/bars/etc)   | ✗ ONLY cards works
Progress bar width anim       | ✗ MISSING
Circle SVG progress           | ✗ MISSING
Hover glow effects            | Partial
```

### Process Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
Timeline alternating layout   | ✓ Same
Step number glow boxShadow    | ✗ MISSING
Number hover scale 1.1        | ✗ MISSING
Connecting line               | ✓ Same
Card hover color change       | ✗ MISSING
```

### FAQ Section
```
Editor Has                    | Deploy Has
------------------------------|------------------
AnimatePresence               | ✗ MISSING - CRITICAL
Height 0→auto animation       | ✗ BROKEN without AnimatePresence
Icon 180° rotation            | ✓ Same
Dynamic color transitions     | ✓ Static (reduced)
First item open by default    | ✓ Same
```

---

## Framer Motion Features Used

### In Editor Components

| Feature | Usage | Description |
|---------|-------|-------------|
| `motion.div` | All sections | Animation wrapper |
| `whileInView` | All sections | Scroll-triggered animations |
| `viewport={{ once: true }}` | All sections | One-time trigger |
| `initial` | All sections | Starting state |
| `animate` | All sections | End state |
| `whileHover` | 8 sections | Hover interactions |
| `whileTap` | 4 sections | Click feedback |
| `transition` | All sections | Timing control |
| `AnimatePresence` | FAQ only | Enter/exit animations |
| Custom hooks | Stats | useCountUp, useInView |

### In Deploy Components

Most basic features work, but missing:
- `whileTap` on buttons
- `AnimatePresence` for FAQ
- Complex scroll-based column animations for Testimonials
- Counter animations for Stats
- Various hover effects and glows

---

## File Structure

```
/Users/henrynicholson/launchpad/
├── components/
│   └── sections/           # EDITOR COMPONENTS (React)
│       ├── HeroSection.tsx
│       ├── FeaturesSection.tsx
│       ├── CTASection.tsx
│       ├── TestimonialsSection.tsx
│       ├── StatsSection.tsx
│       ├── ProcessSection.tsx
│       ├── FAQSection.tsx
│       ├── OfferSection.tsx
│       ├── AudienceSection.tsx
│       ├── ComparisonSection.tsx
│       ├── LogoCloudSection.tsx
│       ├── PricingSection.tsx
│       ├── HeaderSection.tsx
│       ├── FooterSection.tsx
│       ├── FoundersSection.tsx
│       └── CredibilitySection.tsx
│
├── lib/
│   ├── deploy-section-components.ts  # DEPLOY COMPONENTS (Template strings)
│   ├── nextjs-project-generator.ts   # Generates Next.js project
│   ├── nextjs-builder.ts             # Builds the project
│   ├── netlify.ts                    # Deploys to Netlify
│   └── page-schema.ts                # TypeScript types for page data
│
└── app/
    └── api/
        └── deploy/
            └── [id]/
                └── route.ts          # Deploy API endpoint
```

---

## The Solution Required

### Goal
Make `/lib/deploy-section-components.ts` produce IDENTICAL output to `/components/sections/*.tsx`

### Approach Options

#### Option A: Copy Exact Editor Components (Recommended)
1. Take each editor component from `/components/sections/`
2. Remove editor-specific code (EditableText, useEditorStore)
3. Replace with static equivalents that accept props
4. Maintain ALL animations, effects, and variants

#### Option B: Sync and Maintain Two Codebases
1. Keep both versions
2. Create a test suite to verify visual parity
3. Manually sync features

### What Needs to Change

For each component in `deploy-section-components.ts`:

1. **Add missing Framer Motion features**
   - Add `whileTap` to all buttons
   - Add `AnimatePresence` to FAQ
   - Add complex scroll animations to Testimonials

2. **Add missing visual effects**
   - Button glow/shine animations
   - Skeleton loading states
   - Hover overlays and glows
   - Box shadows on interactive elements

3. **Add missing variants**
   - Stats: bars, circles, minimal variants
   - CTA: all 4 variants with full styling

4. **Add missing custom hooks**
   - useCountUp for Stats counter animation
   - Proper scroll measurement for Testimonials columns

---

## Testing Checklist

After making changes, verify:

- [ ] FAQ expands/collapses with smooth animation
- [ ] Testimonials show 3 infinite-scrolling columns
- [ ] Stats numbers count up when scrolling into view
- [ ] All Stats variants (cards, bars, circles, minimal) work
- [ ] Buttons have click feedback (scale down on tap)
- [ ] CTA buttons have shine/glow effects
- [ ] Features cards have skeleton loading
- [ ] Process step numbers have glow and hover scale
- [ ] All hover effects match editor exactly
- [ ] Typography and colors match exactly
- [ ] Layout and spacing match exactly

---

## Quick Reference: Deploy Component Template

Each deploy component follows this pattern:

```typescript
const ComponentName = `'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { PageSection, ColorScheme, Typography } from '../../lib/page-schema';

type Props = {
  section: PageSection;
  colorScheme: ColorScheme;
  typography: Typography;
};

export default function ComponentName({ section, colorScheme, typography }: Props) {
  const { content, items = [] } = section;
  const { heading, subheading, /* other content fields */ } = content;

  // Access colors
  const accentColor = content.accentColor || colorScheme.accent;
  const textColor = content.textColor || colorScheme.text;
  const bgColor = content.backgroundColor || colorScheme.background;

  return (
    <section style={{ backgroundColor: bgColor }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Component content */}
      </motion.div>
    </section>
  );
}
`;
```

---

## Priority Order for Fixes

### P0 - Critical (Broken Functionality)
1. FAQ AnimatePresence
2. Testimonials infinite scroll columns
3. Stats counter animations
4. Stats variant support

### P1 - High (Obvious Visual Differences)
1. Button whileTap animations
2. CTA shine/glow effects
3. Features skeleton loading
4. Process step glow effects

### P2 - Medium (Polish)
1. All hover overlay effects
2. Gradient text support
3. Dynamic color transitions
4. Box shadow animations

### P3 - Low (Nice to Have)
1. Performance optimizations
2. Additional variant support
3. Edge case handling

---

## Context for New Session

When starting work on this:

1. **Read** `/lib/deploy-section-components.ts` to see current state
2. **Compare** with `/components/sections/*.tsx` for each component
3. **Focus** on P0 issues first (FAQ, Testimonials, Stats)
4. **Test** by deploying and comparing to editor preview
5. **Iterate** through P1, P2, P3 priorities

The goal is **1:1 visual parity** - what users see in the editor preview should be EXACTLY what gets deployed.

---

## Recent Work Done

- Next.js deployment pipeline is working (replaced static HTML)
- Turbopack env var filtering fixed
- Custom subdomain support added (CUSTOM_DOMAIN_BASE env var)
- All 16 section types are included in deploy components

**Remaining**: Fix the animation/visual parity issues documented above.
