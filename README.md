# Launchpad - Landing Page Builder

An advanced landing page builder with rich text editing, multiple pre-built templates, and beautiful UI primitives. Built with Next.js, Tiptap, Framer Motion, and Supabase.

## 🚀 Features

### Rich Text Editor
- **Google Docs-style editing** - Click any paragraph to open a powerful WYSIWYG editor
- **Advanced formatting** - Bold, italic, underline, strikethrough, headings, lists, blockquotes, code blocks
- **Text colors & highlighting** - Full color picker and text highlighting
- **Links** - Add and edit hyperlinks with ease
- **Keyboard shortcuts** - Cmd/Ctrl+B, Cmd/Ctrl+I, Cmd/Ctrl+U, and more
- **XSS Protection** - DOMPurify sanitization built-in

### Pre-built Templates
1. **Sales Funnel** - High-converting sales page with value proposition, offer details, creator spotlight, and detailed features
2. **Whop University** - Premium course landing page with glass morphism effects, 3D cards, and animated sections
3. **SaaS Product** - Modern product landing page
4. **Lead Magnet** - Email capture focused template
5. **Webinar** - Event registration template
6. **Dark Conversion** - High-contrast conversion-focused template

### Advanced UI Primitives

#### Background Effects
- Animated Mesh
- Grid Pattern
- Morphing Blobs
- Noise Texture

#### Cursor Effects
- Magnetic Button
- Mouse Follower
- Spotlight Cursor

#### Particle Systems
- Floating Elements
- Interactive Dots
- Particle Field

#### Scroll Animations
- Container Scroll
- Parallax Container
- Tilt Card
- Velocity Tracker

#### Text Effects
- Character Reveal
- Gradient Text
- Split Text
- Typewriter Text
- Shimmer Text

#### Cards & Layouts
- 3D Cards
- Liquid Glass Cards
- Animated Groups
- Infinite Slider

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Rich Text:** Tiptap (ProseMirror)
- **Database:** Supabase
- **Auth:** Whop.com integration
- **State Management:** Zustand
- **UI Components:** Radix UI, shadcn/ui
- **Sanitization:** DOMPurify

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/hennicholson/launchpad-landing-page-builder.git
cd launchpad-landing-page-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Whop
NEXT_PUBLIC_WHOP_APP_ID=your_whop_app_id
WHOP_API_KEY=your_whop_api_key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
launchpad/
├── app/                          # Next.js app directory
│   ├── editor/[id]/             # Page editor interface
│   ├── preview/[id]/            # Published page preview
│   └── dashboard/               # User dashboard
├── components/
│   ├── editor/                  # Editor-specific components
│   │   ├── Canvas.tsx          # Main editor canvas
│   │   ├── PropertyPanel.tsx   # Section property editor
│   │   ├── RichTextEditor.tsx  # Tiptap editor wrapper
│   │   ├── RichTextToolbar.tsx # Formatting toolbar
│   │   └── sections/           # Editable section wrappers
│   ├── shared/                  # Shared components
│   │   ├── sections/           # Section base components
│   │   │   ├── hero-variants/  # Hero section variants
│   │   │   ├── glass/          # Glass morphism sections
│   │   │   └── whop-university/ # Whop University sections
│   │   └── primitives/         # Reusable UI primitives
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── store.ts                # Zustand store
│   ├── page-schema.ts          # Page & section schemas
│   ├── templates/              # Pre-built templates
│   └── utils/                  # Utility functions
└── public/
    ├── fonts/                  # Custom fonts
    └── illustrations/          # SVG illustrations
```

## 🎨 Creating a New Section

1. **Define the section type** in `lib/page-schema.ts`
2. **Create the base component** in `components/shared/sections/`
3. **Create the editor wrapper** in `components/editor/sections/`
4. **Register in SectionRenderer** (`components/editor/SectionRenderer.tsx`)
5. **Add factory function** in `lib/page-schema.ts`

## 📝 Rich Text Editing

The rich text editor is implemented for the Value Proposition section as an example. To add it to other sections:

1. Import `EditableRichText` in your editor section
2. Pass `isRichText={true}` and `paragraphIndex={index}` to renderText
3. Update the base component to render HTML with DOMPurify

Example:
```tsx
renderText={(props) => {
  if (props.isRichText && props.paragraphIndex !== undefined) {
    return <EditableRichText {...props} />;
  }
  return <EditableText {...props} />;
}}
```

## 🔒 Security

- **XSS Protection:** All HTML content is sanitized with DOMPurify
- **Whitelisted tags:** Only safe HTML tags are allowed
- **RLS Policies:** Supabase Row Level Security enabled
- **Environment variables:** Sensitive keys stored securely

## 🚢 Deployment

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

## 📚 Key Components

### RichTextEditorModal
Opens when clicking a paragraph in edit mode. Provides:
- Tiptap editor with full formatting toolbar
- Save/Cancel actions
- Keyboard shortcuts (Cmd+S to save, Esc to cancel)

### Store Management
Zustand store handles:
- Page state
- Section CRUD operations
- Rich text editor state
- Undo/Redo history
- Element selection

### Template System
Templates are defined in `lib/templates/`:
- Each template has metadata (name, description, thumbnail)
- Sections are created with factory functions
- Color schemes and typography are pre-configured

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

All rights reserved.

---

Built with ❤️ using Claude Code
