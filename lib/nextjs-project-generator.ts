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
      "lucide-react": "0.460.0",
      tailwindcss: "4.0.0",
      "@tailwindcss/postcss": "4.0.0",
      // shadcn/ui dependencies
      "@radix-ui/react-dialog": "1.1.4",
      "@radix-ui/react-slot": "1.1.1",
      "@radix-ui/react-avatar": "1.1.2",
      "class-variance-authority": "0.7.1",
      "clsx": "2.1.1",
      "tailwind-merge": "2.6.0",
      "vaul": "1.1.2",
      "embla-carousel-react": "8.5.1",
      "cmdk": "1.0.4",
      "simplex-noise": "4.0.3"
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

// Generate postcss.config.js (Tailwind v4)
function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
`;
}

// Generate app/globals.css (Tailwind v4 syntax with animations)
function generateGlobalsCss(colorScheme: ColorScheme, typography: Typography): string {
  return `@import "tailwindcss";

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
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Animation utilities */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation-duration: 200ms;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
}

.fade-in {
  animation-name: fade-in;
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}

/* Shimmer animation for skeleton loading */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
  background-size: 200% 100%;
}

/* Marquee animation */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Hide scrollbar utility */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;
}

// Tracking configuration for analytics injection
export type TrackingConfig = {
  enabled: boolean;
  projectId: string;
  apiUrl?: string;
};

// Generate app/layout.tsx
function generateLayout(page: LandingPage, settings?: ProjectSettings, tracking?: TrackingConfig): string {
  const faviconUrl = settings?.favicon || '/favicon.ico';
  const ogImageUrl = settings?.ogImage || '';

  // Generate Google Fonts URL dynamically from user's typography settings
  const headingFontParam = page.typography.headingFont.replace(/ /g, '+');
  const bodyFontParam = page.typography.bodyFont.replace(/ /g, '+');
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${headingFontParam}:wght@400;500;600;700&family=${bodyFontParam}:wght@400;500;600;700&display=swap`;

  // Generate tracking script tag if tracking is enabled (Free tier only)
  const trackingScript = tracking?.enabled && tracking?.projectId
    ? `<script
          src="${tracking.apiUrl || 'https://launchpad.whop.com'}/analytics.js"
          data-lp-project="${tracking.projectId}"
          data-lp-api="${tracking.apiUrl || 'https://launchpad.whop.com'}"
          defer
        ></script>`
    : '';

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
        ${trackingScript}
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
export type TestimonialVariant = "scrolling" | "twitter-cards";
export type HeaderVariant = "default" | "header-2" | "floating-header" | "simple-header" | "header-with-search";
export type BackgroundEffect = "none" | "elegant-shapes" | "background-circles" | "background-paths" | "glow" | "shooting-stars" | "stars-background" | "wavy-background";

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
  testimonialVariant?: TestimonialVariant;
  headerVariant?: HeaderVariant;
  backgroundEffect?: BackgroundEffect;
  paddingTop?: number;
  paddingBottom?: number;
};

// Element types for drag-and-drop elements
export type ElementType =
  | 'button'
  | 'image'
  | 'text'
  | 'divider'
  | 'icon'
  | 'video'
  | 'social'
  | 'badge'
  | 'countdown'
  | 'form'
  | 'html';

export type ElementPosition = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type ElementAnimation = {
  hover?: 'scale' | 'lift' | 'glow' | 'bounce' | 'shake' | 'pulse' | 'underline' | 'fill' | 'none';
  click?: 'press' | 'ripple' | 'bounce' | 'none';
};

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'neon' | '3d' | 'glass' | 'pill' | 'icon' | 'underline' | 'bounce'
  | 'animated-generate' | 'liquid' | 'flow' | 'ripple' | 'cartoon' | 'win98';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'outline' | 'glow';
export type IconVariant = 'circle' | 'square' | 'none' | 'glow' | 'shadow';
export type DividerVariant = 'solid' | 'dashed' | 'dotted' | 'gradient' | 'double';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type ShadowSize = 'none' | 'sm' | 'md' | 'lg';
export type WidthMode = 'auto' | 'full' | number;

export type ElementContent = {
  buttonText?: string;
  buttonLink?: string;
  buttonVariant?: ButtonVariant;
  buttonSize?: ButtonSize;
  buttonPaddingX?: number;
  buttonPaddingY?: number;
  buttonBorderRadius?: number;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderWidth?: number;
  buttonBorderColor?: string;
  buttonFontSize?: number;
  buttonFontWeight?: FontWeight;
  buttonShadow?: ShadowSize;
  buttonWidth?: WidthMode;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageFit?: 'cover' | 'contain' | 'fill';
  imageBorderRadius?: number;
  imageShadow?: ShadowSize;
  imageBorderWidth?: number;
  imageBorderColor?: string;
  text?: string;
  textType?: 'heading' | 'subheading' | 'paragraph' | 'caption';
  textFontSize?: number;
  textFontWeight?: FontWeight;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  textLineHeight?: number;
  textLetterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textMaxWidth?: number;
  iconName?: string;
  iconSize?: number;
  iconVariant?: IconVariant;
  iconColor?: string;
  iconBgColor?: string;
  videoUrl?: string;
  videoWidth?: number;
  videoBorderRadius?: number;
  videoAspectRatio?: '16:9' | '4:3' | '1:1';
  videoShadow?: ShadowSize;
  socialLinks?: Array<{ platform: string; url: string }>;
  socialVariant?: 'default' | 'filled' | 'minimal';
  socialIconSize?: number;
  socialGap?: number;
  socialIconColor?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  badgeBgColor?: string;
  badgeTextColor?: string;
  badgeFontSize?: number;
  badgePaddingX?: number;
  badgePaddingY?: number;
  badgeBorderRadius?: number;
  countdownTarget?: string;
  countdownBoxBgColor?: string;
  countdownNumberColor?: string;
  countdownLabelColor?: string;
  countdownBorderRadius?: number;
  countdownGap?: number;
  countdownShowLabels?: boolean;
  formPlaceholder?: string;
  formButtonText?: string;
  formInputBgColor?: string;
  formInputTextColor?: string;
  formButtonBgColor?: string;
  formButtonTextColor?: string;
  formBorderRadius?: number;
  formBorderColor?: string;
  htmlCode?: string;
  dividerVariant?: DividerVariant;
  dividerThickness?: number;
  dividerWidth?: number;
  dividerColor?: string;
  animation?: ElementAnimation;
};

export type ElementStyleOverride = {
  color?: string;
};

export type PageElement = {
  id: string;
  type: ElementType;
  position: ElementPosition;
  snapToGrid: boolean;
  visible: boolean;
  content: ElementContent;
  styles: ElementStyleOverride;
  groupId?: string;
};

export type PageSection = {
  id: string;
  type: SectionType;
  content: SectionContent;
  items?: SectionItem[];
  elements?: PageElement[];
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

// Default design canvas width (max-w-4xl = 896px)
export const DEFAULT_DESIGN_WIDTH = 896;

export type LandingPage = {
  title: string;
  description: string;
  sections: PageSection[];
  colorScheme: ColorScheme;
  typography: Typography;
  smoothScroll?: boolean;
  // Responsive scaling reference (design canvas width in px)
  designCanvasWidth?: number; // Default: 896 (max-w-4xl)
};
`;
}

// Generate the main page component
function generatePage(page: LandingPage): string {
  const pageDataJson = JSON.stringify(page).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  return `'use client';

import SectionRenderer from '../components/SectionRenderer';
import { ProductionElementsLayer } from '../components/shared/elements/ProductionElementRenderer';
import type { LandingPage } from '../lib/page-schema';

const pageData: LandingPage = JSON.parse('${pageDataJson}');

export default function Page() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: pageData.colorScheme.background,
        color: pageData.colorScheme.text,
        fontFamily: pageData.typography.bodyFont,
      }}
    >
      {pageData.sections.map((section) => (
        <div
          key={section.id}
          className="relative"
        >
          {/* Section components handle their own padding internally */}
          <SectionRenderer
            section={section}
            colorScheme={pageData.colorScheme}
            typography={pageData.typography}
          />
          {section.elements && section.elements.length > 0 && (
            <ProductionElementsLayer elements={section.elements} designCanvasWidth={pageData.designCanvasWidth} />
          )}
        </div>
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
      // From components/shared/elements/ need ../../../lib (3 levels)
      const libPrefix = '../'.repeat(depth) + 'lib/';
      content = content.replace(
        /@\/lib\/shared-section-types/g,
        libPrefix + 'shared-section-types'
      );
      content = content.replace(
        /@\/lib\/page-schema/g,
        libPrefix + 'page-schema'
      );
      content = content.replace(
        /@\/components\/shared\//g,
        '../'
      );
      // Transform @/components/ui/ imports
      content = content.replace(
        /@\/components\/ui\//g,
        '../'.repeat(depth) + 'components/ui/'
      );
      // Transform @/hooks/ imports (project-level hooks)
      content = content.replace(
        /@\/hooks\//g,
        '../'.repeat(depth) + 'hooks/'
      );
      // Transform @/lib/utils import
      content = content.replace(
        /@\/lib\/utils/g,
        '../'.repeat(depth) + 'lib/utils'
      );
      return content;
    } catch (error) {
      console.error(`Failed to read file: ${filePath}`, error);
      return '';
    }
  };

  // Read root-level shared files (like SectionBackground.tsx)
  const rootSharedFiles = fs.readdirSync(basePath).filter(f => f.endsWith('.tsx') && !fs.statSync(path.join(basePath, f)).isDirectory());
  for (const file of rootSharedFiles) {
    files[`components/shared/${file}`] = readAndTransform(path.join(basePath, file));
  }

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

  // Read features-variants subdirectory
  const featuresVariantsPath = path.join(basePath, 'sections', 'features-variants');
  if (fs.existsSync(featuresVariantsPath)) {
    const variantFiles = fs.readdirSync(featuresVariantsPath).filter(f => f.endsWith('.tsx'));
    for (const file of variantFiles) {
      files[`components/shared/sections/features-variants/${file}`] = readAndTransform(path.join(featuresVariantsPath, file), 4); // 4 levels deep
    }
  }

  // Read elements components (ProductionElementRenderer for deployed sites)
  const elementsPath = path.join(basePath, 'elements');
  if (fs.existsSync(elementsPath)) {
    const elementFiles = fs.readdirSync(elementsPath).filter(f => f.endsWith('.tsx'));
    for (const file of elementFiles) {
      files[`components/shared/elements/${file}`] = readAndTransform(path.join(elementsPath, file));
    }
  }

  // Read UI components (depth=2: components/ui/file.tsx → ../../lib/)
  const uiPath = path.join(process.cwd(), 'components', 'ui');
  if (fs.existsSync(uiPath)) {
    const uiFiles = fs.readdirSync(uiPath).filter(f => f.endsWith('.tsx'));
    for (const file of uiFiles) {
      files[`components/ui/${file}`] = readAndTransform(path.join(uiPath, file), 2);
    }
  }

  // Read UI backgrounds subdirectory (depth=3: components/ui/backgrounds/file.tsx → ../../../lib/)
  const backgroundsPath = path.join(process.cwd(), 'components', 'ui', 'backgrounds');
  if (fs.existsSync(backgroundsPath)) {
    const backgroundFiles = fs.readdirSync(backgroundsPath).filter(f => f.endsWith('.tsx'));
    for (const file of backgroundFiles) {
      files[`components/ui/backgrounds/${file}`] = readAndTransform(path.join(backgroundsPath, file), 3);
    }
  }

  // Read project-level hooks (depth=1: hooks/file.tsx → ../lib/)
  const hooksRootPath = path.join(process.cwd(), 'hooks');
  if (fs.existsSync(hooksRootPath)) {
    const hookFiles = fs.readdirSync(hooksRootPath).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
    for (const file of hookFiles) {
      files[`hooks/${file}`] = readAndTransform(path.join(hooksRootPath, file), 1);
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
  siteUrl?: string,
  tracking?: TrackingConfig
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
    // Note: Tailwind v4 doesn't require tailwind.config.js - it uses CSS-based configuration
    "postcss.config.js": generatePostcssConfig(),

    // App structure
    "app/layout.tsx": generateLayout(page, settings, tracking),
    "app/page.tsx": generatePage(page),
    "app/globals.css": generateGlobalsCss(page.colorScheme, page.typography),
    "app/not-found.tsx": generate404Page(page.colorScheme, page.typography),

    // SEO files
    "public/robots.txt": generateRobotsTxt(finalSiteUrl),
    "public/sitemap.xml": generateSitemapXml(page, finalSiteUrl),

    // Types and utilities
    "lib/page-schema.ts": generatePageSchemaTypes(),
    "lib/shared-section-types.ts": generateSharedSectionTypes(),
    "lib/utils.ts": fs.readFileSync(path.join(process.cwd(), 'lib', 'utils.ts'), 'utf-8'),

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
