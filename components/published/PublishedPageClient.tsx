"use client";

import type { LandingPage, ProjectSettings } from "@/lib/page-schema";
import { DEFAULT_DESIGN_WIDTH } from "@/lib/page-schema";
import { PublishedProvider } from "@/lib/published-context";
import SectionRenderer from "@/components/editor/SectionRenderer";
import ElementsLayer from "@/components/editor/ElementsLayer";
import PublishedFontLoader from "@/components/published/PublishedFontLoader";
import { useLenisScroll } from "@/hooks/use-lenis";

type Props = {
  pageData: LandingPage;
  settings?: ProjectSettings;
  isPublished?: boolean;
  projectId?: string;
};

export default function PublishedPageClient({ pageData, settings, isPublished = true, projectId }: Props) {
  const { sections, colorScheme, typography, smoothScroll, smoothScrollConfig } = pageData;

  // Initialize Lenis smooth scroll when enabled
  useLenisScroll(!!smoothScroll, smoothScrollConfig);

  if (!isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] text-white">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">This site is currently offline</h1>
          <p className="text-white/50">The site owner has temporarily taken this page offline. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <PublishedProvider pageData={pageData} projectId={projectId}>
      <PublishedFontLoader pageData={pageData} />

      {/* Custom CSS from settings */}
      {settings?.customCss && (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      )}

      {/* Main page content */}
      <main
        className="min-h-screen"
        style={{
          backgroundColor: colorScheme.background,
          color: colorScheme.text,
          fontFamily: typography.bodyFont,
          fontWeight: typography.bodyWeight || undefined,
          lineHeight: typography.bodyLineHeight || undefined,
          letterSpacing: typography.bodyLetterSpacing || undefined,
        }}
      >
        {sections.map((section) => {
          const designWidth = pageData.designCanvasWidth || DEFAULT_DESIGN_WIDTH;

          return (
            <div
              key={section.id}
              className="relative"
            >
              {/* Section components handle their own padding internally */}
              <SectionRenderer section={section} />
              {section.elements && section.elements.length > 0 && (
                /* Container constrains elements to design width and centers them */
                <div
                  className="absolute inset-0 flex justify-center pointer-events-none"
                  style={{ overflow: 'visible' }}
                >
                  <div
                    className="relative w-full pointer-events-none"
                    style={{
                      maxWidth: designWidth,
                      overflow: 'visible'
                    }}
                  >
                    <ElementsLayer section={section} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
    </PublishedProvider>
  );
}
