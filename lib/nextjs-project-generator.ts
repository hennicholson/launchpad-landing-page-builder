/**
 * Next.js Project Generator for Launchpad
 * Generates a complete deployable Next.js project with Framer Motion
 *
 * Uses the shared component library for full animation parity with editor
 */

import type { LandingPage, ProjectSettings, ColorScheme, Typography } from "./page-schema";
import fs from "fs";
import path from "path";

// Generate the package.json for the project
function generatePackageJson(): string {
  return JSON.stringify({
    name: "landing-page",
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start"
    },
    dependencies: {
      next: "14.2.28",
      react: "18.3.1",
      "react-dom": "18.3.1",
      "framer-motion": "11.3.8",
      tailwindcss: "3.4.4",
      postcss: "8.4.39",
      autoprefixer: "10.4.19"
    },
    devDependencies: {
      "@types/node": "20.14.10",
      "@types/react": "18.3.3",
      "@types/react-dom": "18.3.0",
      typescript: "5.5.3"
    }
  }, null, 2);
}

// Generate tsconfig.json
function generateTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      baseUrl: ".",
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  }, null, 2);
}

// Generate next.config.js
function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
`;
}

// Generate tailwind.config.js
function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;
}

// Generate postcss.config.js
function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

// Generate app/globals.css (fonts loaded via <link> in layout for better performance)
function generateGlobalsCss(colorScheme: ColorScheme, typography: Typography): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: ${colorScheme.primary};
  --color-secondary: ${colorScheme.secondary};
  --color-accent: ${colorScheme.accent};
  --color-background: ${colorScheme.background};
  --color-text: ${colorScheme.text};
  --font-heading: '${typography.headingFont}', sans-serif;
  --font-body: '${typography.bodyFont}', sans-serif;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-text);
  opacity: 0.2;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  opacity: 0.4;
}
`;
}

// Generate app/layout.tsx
function generateLayout(page: LandingPage, settings?: ProjectSettings): string {
  const faviconUrl = settings?.favicon || '/favicon.ico';
  const ogImageUrl = settings?.ogImage || '';

  // Generate Google Fonts URL dynamically from user's typography settings
  const headingFontParam = page.typography.headingFont.replace(/ /g, '+');
  const bodyFontParam = page.typography.bodyFont.replace(/ /g, '+');
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${headingFontParam}:wght@400;500;600;700&family=${bodyFontParam}:wght@400;500;600;700&display=swap`;

  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${page.title.replace(/'/g, "\\'")}',
  description: '${page.description.replace(/'/g, "\\'")}',
  ${ogImageUrl ? `openGraph: {
    images: ['${ogImageUrl}'],
  },` : ''}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="${page.colorScheme.primary}" />
        <link rel="icon" href="${faviconUrl}" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${fontsUrl}" rel="stylesheet" />
        ${settings?.customHead || ''}
      </head>
      <body>{children}</body>
    </html>
  );
}
`;
}

// Generate shared-section-types.ts for deployment
function generateSharedSectionTypes(): string {
  return `import type { ReactNode, CSSProperties } from "react";

export type PageSection = {
  id: string;
  type: string;
  content: Record<string, any>;
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
    price?: string;
    features?: string[];
    author?: string;
    role?: string;
    rating?: number;
    linkedinUrl?: string;
    label?: string;
    bio?: string;
    popular?: boolean;
    buttonText?: string;
    buttonLink?: string;
  }>;
};

export type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type Typography = {
  headingFont: string;
  bodyFont: string;
};

export type RenderTextProps = {
  value: string;
  sectionId: string;
  field: string;
  itemId?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
};

export type RenderImageProps = {
  src: string;
  sectionId: string;
  field: string;
  itemId?: string;
  className?: string;
  alt?: string;
  style?: CSSProperties;
};

export type BaseSectionProps = {
  section: PageSection;
  colorScheme: ColorScheme;
  typography: Typography;
  renderText?: (props: RenderTextProps) => ReactNode;
  renderImage?: (props: RenderImageProps) => ReactNode;
};
`;
}

// Generate the page-schema types file
function generatePageSchemaTypes(): string {
  return `export type SectionType =
  | "hero"
  | "features"
  | "testimonials"
  | "pricing"
  | "cta"
  | "faq"
  | "video"
  | "gallery"
  | "header"
  | "founders"
  | "credibility"
  | "offer"
  | "audience"
  | "footer"
  | "stats"
  | "logoCloud"
  | "comparison"
  | "process";

export type LayoutType = "left" | "right" | "center" | "grid";
export type StatsVariant = "cards" | "minimal" | "bars" | "circles";
export type CTAVariant = "centered" | "split" | "banner" | "minimal";
export type ProcessVariant = "timeline" | "cards" | "horizontal";
export type HeadingStyle = "solid" | "gradient" | "outline";

export type NavLink = {
  label: string;
  url: string;
};

export type SectionItem = {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  price?: string;
  features?: string[];
  author?: string;
  role?: string;
  rating?: number;
  gridClass?: string;
  aspectRatio?: string;
  linkedinUrl?: string;
  label?: string;
  bio?: string;
  popular?: boolean;
  buttonText?: string;
  buttonLink?: string;
  audienceType?: "for" | "not-for";
};

export type SectionContent = {
  heading?: string;
  subheading?: string;
  bodyText?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: LayoutType;
  badge?: string;
  brands?: string[];
  accentColor?: string;
  accentHeading?: string;
  logoUrl?: string;
  logoText?: string;
  links?: NavLink[];
  tagline?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  forItems?: string[];
  notForItems?: string[];
  forHeading?: string;
  notForHeading?: string;
  scrollSpeed?: number;
  priceMonthly?: string;
  priceYearly?: string;
  statsVariant?: StatsVariant;
  ctaVariant?: CTAVariant;
  processVariant?: ProcessVariant;
  headingStyle?: HeadingStyle;
  paddingTop?: number;
  paddingBottom?: number;
};

export type PageSection = {
  id: string;
  type: SectionType;
  content: SectionContent;
  items?: SectionItem[];
};

export type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type Typography = {
  headingFont: string;
  bodyFont: string;
};

export type LandingPage = {
  title: string;
  description: string;
  sections: PageSection[];
  colorScheme: ColorScheme;
  typography: Typography;
  smoothScroll?: boolean;
};
`;
}

// Generate the main page component
function generatePage(page: LandingPage): string {
  const pageDataJson = JSON.stringify(page).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  return `'use client';

import SectionRenderer from '../components/SectionRenderer';
import type { LandingPage } from '../lib/page-schema';

const pageData: LandingPage = JSON.parse('${pageDataJson}');

export default function Page() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: pageData.colorScheme.background }}>
      {pageData.sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          colorScheme={pageData.colorScheme}
          typography={pageData.typography}
        />
      ))}
    </main>
  );
}
`;
}

// Generate the SectionRenderer component
function generateSectionRenderer(): string {
  return `'use client';

import type { PageSection, ColorScheme, Typography } from '../lib/page-schema';
import HeroSectionBase from './shared/sections/HeroSectionBase';
import FeaturesSectionBase from './shared/sections/FeaturesSectionBase';
import TestimonialsSectionBase from './shared/sections/TestimonialsSectionBase';
import PricingSectionBase from './shared/sections/PricingSectionBase';
import CTASectionBase from './shared/sections/CTASectionBase';
import FAQSectionBase from './shared/sections/FAQSectionBase';
import HeaderSectionBase from './shared/sections/HeaderSectionBase';
import FoundersSectionBase from './shared/sections/FoundersSectionBase';
import CredibilitySectionBase from './shared/sections/CredibilitySectionBase';
import OfferSectionBase from './shared/sections/OfferSectionBase';
import AudienceSectionBase from './shared/sections/AudienceSectionBase';
import FooterSectionBase from './shared/sections/FooterSectionBase';
import StatsSectionBase from './shared/sections/StatsSectionBase';
import LogoCloudSectionBase from './shared/sections/LogoCloudSectionBase';
import ComparisonSectionBase from './shared/sections/ComparisonSectionBase';
import ProcessSectionBase from './shared/sections/ProcessSectionBase';
import GallerySectionBase from './shared/sections/GallerySectionBase';
import VideoSectionBase from './shared/sections/VideoSectionBase';

type Props = {
  section: PageSection;
  colorScheme: ColorScheme;
  typography: Typography;
};

export default function SectionRenderer({ section, colorScheme, typography }: Props) {
  const props = { section, colorScheme, typography };

  switch (section.type) {
    case 'hero':
      return <HeroSectionBase {...props} />;
    case 'features':
      return <FeaturesSectionBase {...props} />;
    case 'testimonials':
      return <TestimonialsSectionBase {...props} />;
    case 'pricing':
      return <PricingSectionBase {...props} />;
    case 'cta':
      return <CTASectionBase {...props} />;
    case 'faq':
      return <FAQSectionBase {...props} />;
    case 'header':
      return <HeaderSectionBase {...props} />;
    case 'founders':
      return <FoundersSectionBase {...props} />;
    case 'credibility':
      return <CredibilitySectionBase {...props} />;
    case 'offer':
      return <OfferSectionBase {...props} />;
    case 'audience':
      return <AudienceSectionBase {...props} />;
    case 'footer':
      return <FooterSectionBase {...props} />;
    case 'stats':
      return <StatsSectionBase {...props} />;
    case 'logoCloud':
      return <LogoCloudSectionBase {...props} />;
    case 'comparison':
      return <ComparisonSectionBase {...props} />;
    case 'process':
      return <ProcessSectionBase {...props} />;
    case 'gallery':
      return <GallerySectionBase {...props} />;
    case 'video':
      return <VideoSectionBase {...props} />;
    default:
      return (
        <div className="py-16 px-8 text-center opacity-50">
          Unknown section type: {section.type}
        </div>
      );
  }
}
`;
}

// Read all shared component files from disk
function getSharedComponentFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  const basePath = path.join(process.cwd(), 'components', 'shared');

  // Helper to read and transform file for deploy context
  const readAndTransform = (filePath: string, depth: number = 3): string => {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      // Update imports to use relative paths for deploy
      // From components/shared/sections/ need ../../../lib (3 levels)
      // From components/shared/hooks/ need ../../../lib (3 levels)
      // From components/shared/primitives/ need ../../../lib (3 levels)
      const libPath = '../'.repeat(depth) + 'lib/shared-section-types';
      content = content.replace(
        /@\/lib\/shared-section-types/g,
        libPath
      );
      content = content.replace(
        /@\/components\/shared\//g,
        '../'
      );
      return content;
    } catch (error) {
      console.error(`Failed to read file: ${filePath}`, error);
      return '';
    }
  };

  // Read hooks
  const hooksPath = path.join(basePath, 'hooks');
  if (fs.existsSync(hooksPath)) {
    const hookFiles = fs.readdirSync(hooksPath).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    for (const file of hookFiles) {
      files[`components/shared/hooks/${file}`] = readAndTransform(path.join(hooksPath, file));
    }
  }

  // Read primitives
  const primitivesPath = path.join(basePath, 'primitives');
  if (fs.existsSync(primitivesPath)) {
    const primitiveFiles = fs.readdirSync(primitivesPath).filter(f => f.endsWith('.tsx'));
    for (const file of primitiveFiles) {
      files[`components/shared/primitives/${file}`] = readAndTransform(path.join(primitivesPath, file));
    }
  }

  // Read base section components
  const sectionsPath = path.join(basePath, 'sections');
  if (fs.existsSync(sectionsPath)) {
    const sectionFiles = fs.readdirSync(sectionsPath).filter(f => f.endsWith('.tsx'));
    for (const file of sectionFiles) {
      files[`components/shared/sections/${file}`] = readAndTransform(path.join(sectionsPath, file));
    }
  }

  return files;
}

// Generate robots.txt for SEO
function generateRobotsTxt(siteUrl: string): string {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

// Generate sitemap.xml for SEO indexing
function generateSitemapXml(page: LandingPage, siteUrl: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

// Generate 404 page with proper styling
function generate404Page(colorScheme: ColorScheme, typography: Typography): string {
  return `'use client';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: '${colorScheme.background}' }}
    >
      <div className="text-center max-w-md">
        <h1
          className="text-8xl font-bold mb-4"
          style={{ color: '${colorScheme.primary}', fontFamily: "'${typography.headingFont}', sans-serif" }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: '${colorScheme.text}', fontFamily: "'${typography.headingFont}', sans-serif" }}
        >
          Page Not Found
        </h2>
        <p
          className="mb-8 opacity-70"
          style={{ color: '${colorScheme.text}', fontFamily: "'${typography.bodyFont}', sans-serif" }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '${colorScheme.primary}',
            color: '${colorScheme.background}',
            fontFamily: "'${typography.bodyFont}', sans-serif"
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
`;
}

/**
 * Generate a complete Next.js project for deployment
 * Uses the shared component library for full animation parity
 */
export function generateNextJsProject(
  page: LandingPage,
  settings?: ProjectSettings,
  siteUrl?: string
): Record<string, string> {
  // Get all shared component files
  const sharedFiles = getSharedComponentFiles();

  // Default site URL for SEO files (passed from deployment context)
  const finalSiteUrl = siteUrl || 'https://example.com';

  return {
    // Package configuration
    "package.json": generatePackageJson(),
    "tsconfig.json": generateTsConfig(),
    "next.config.js": generateNextConfig(),
    "tailwind.config.js": generateTailwindConfig(),
    "postcss.config.js": generatePostcssConfig(),

    // App structure
    "app/layout.tsx": generateLayout(page, settings),
    "app/page.tsx": generatePage(page),
    "app/globals.css": generateGlobalsCss(page.colorScheme, page.typography),
    "app/not-found.tsx": generate404Page(page.colorScheme, page.typography),

    // SEO files
    "public/robots.txt": generateRobotsTxt(finalSiteUrl),
    "public/sitemap.xml": generateSitemapXml(page, finalSiteUrl),

    // Types
    "lib/page-schema.ts": generatePageSchemaTypes(),
    "lib/shared-section-types.ts": generateSharedSectionTypes(),

    // Components
    "components/SectionRenderer.tsx": generateSectionRenderer(),

    // Shared component library (copied from source)
    ...sharedFiles,

    // Next.js required files
    "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`,
  };
}
