# Component Development Guide

This guide ensures new components work correctly with Launchpad's deployment system.

## How Deployment Works

When users deploy a page, `lib/nextjs-project-generator.ts` generates a standalone Next.js project:

1. **Files are copied** from `/components/shared/`, `/components/ui/`, `/hooks/`
2. **Import paths are transformed** from `@/` aliases to relative paths
3. **Types are generated** from hardcoded definitions (must match source!)
4. **npm dependencies** are specified in the generated `package.json`

---

## Checklists

### Adding a New UI Component (`/components/ui/`)

- [ ] Create component in `/components/ui/`
- [ ] **Auto-copied** - no additional action needed
- [ ] If using NEW npm packages, add to `generatePackageJson()` in `lib/nextjs-project-generator.ts`:
  ```typescript
  dependencies: {
    // ... existing
    "new-package": "1.0.0",
  }
  ```

### Adding a New Variant Type

**CRITICAL: Types must be defined in TWO places!**

1. [ ] Add type to `lib/page-schema.ts`:
   ```typescript
   export type MyNewVariant = "option-a" | "option-b" | "option-c";
   ```

2. [ ] Add **EXACT SAME** type to `generatePageSchemaTypes()` in `lib/nextjs-project-generator.ts`:
   ```typescript
   export type MyNewVariant = "option-a" | "option-b" | "option-c";
   ```

3. [ ] Add field to `SectionContent` in **BOTH** files:
   ```typescript
   // In lib/page-schema.ts AND in generatePageSchemaTypes()
   myNewVariant?: MyNewVariant;
   ```

### Adding a New Shared Section

1. [ ] Create in `/components/shared/sections/MySectionBase.tsx`
2. [ ] Use these imports (auto-transformed for deployment):
   ```typescript
   import type { BaseSectionProps } from "@/lib/shared-section-types";
   import type { SectionItem, MyVariant } from "@/lib/page-schema";
   import { cn } from "@/lib/utils";
   import { SomeUIComponent } from "@/components/ui/some-component";
   import { useScroll } from "@/hooks/use-scroll";
   ```

3. [ ] Add to `generateSectionRenderer()` in `lib/nextjs-project-generator.ts`:
   ```typescript
   // Add import
   import MySectionBase from './shared/sections/MySectionBase';

   // Add case in switch
   case 'mySection':
     return <MySectionBase {...props} />;
   ```

4. [ ] Add section type to `SectionType` in **BOTH** `lib/page-schema.ts` AND `generatePageSchemaTypes()`

### Adding a New Hook

- [ ] `/hooks/` - Auto-copied, no action needed
- [ ] `/components/shared/hooks/` - Auto-copied, no action needed

---

## Import Path Transformations

These paths are automatically transformed for deployment:

| Source Path | Transforms To |
|-------------|---------------|
| `@/lib/page-schema` | `../../../lib/page-schema` (depth varies) |
| `@/lib/shared-section-types` | `../../../lib/shared-section-types` |
| `@/lib/utils` | `../../../lib/utils` |
| `@/components/shared/` | `../` (relative to shared) |
| `@/components/ui/` | `../../../components/ui/` |
| `@/hooks/` | `../../../hooks/` |

---

## Current npm Dependencies (in generator)

```typescript
// lib/nextjs-project-generator.ts - generatePackageJson()
dependencies: {
  next: "14.2.28",
  react: "18.3.1",
  "react-dom": "18.3.1",
  "framer-motion": "11.3.8",
  "lucide-react": "0.460.0",
  tailwindcss: "4.0.0",
  "@tailwindcss/postcss": "4.0.0",
  "@radix-ui/react-dialog": "1.1.4",
  "@radix-ui/react-slot": "1.1.1",
  "@radix-ui/react-avatar": "1.1.2",
  "class-variance-authority": "0.7.1",
  "clsx": "2.1.1",
  "tailwind-merge": "2.6.0",
  "vaul": "1.1.2",
  "embla-carousel-react": "8.5.1",
  "cmdk": "1.0.4"
}
```

---

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Forgot to add variant type to generator | Deployed code won't recognize variant values | Copy exact type definition to `generatePageSchemaTypes()` |
| Wrong variant values in generator | Variant never matches, shows default | Values must match EXACTLY between files |
| Missing npm dependency | Build fails on deployment | Add to `generatePackageJson()` |
| New section not in SectionRenderer | Section renders as "Unknown section type" | Add import and case to `generateSectionRenderer()` |
| Using unsupported import path | Import error in deployed build | Use only supported `@/` paths listed above |

---

## Testing Deployment

After adding new components:

1. Run `npm run build` to check for errors
2. Deploy a test page using the new component
3. Verify the deployed page renders correctly
4. Check browser console for any import/type errors

---

## File Reference

| Purpose | File |
|---------|------|
| Source types | `lib/page-schema.ts` |
| Generator | `lib/nextjs-project-generator.ts` |
| Generated types | `generatePageSchemaTypes()` function |
| Generated package.json | `generatePackageJson()` function |
| Section routing | `generateSectionRenderer()` function |
| File copying | `getSharedComponentFiles()` function |
