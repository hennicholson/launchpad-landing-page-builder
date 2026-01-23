"use client";

import type { LandingPage, ProjectSettings } from "@/lib/page-schema";
import { DEFAULT_DESIGN_WIDTH } from "@/lib/page-schema";
import { PublishedProvider } from "@/lib/published-context";
import SectionRenderer from "@/components/editor/SectionRenderer";
import ElementsLayer from "@/components/editor/ElementsLayer";

type Props = {
  pageData: LandingPage;
  settings?: ProjectSettings;
};

export default function PublishedPageClient({ pageData, settings }: Props) {
  const { sections, colorScheme, typography, smoothScroll } = pageData;

  return (
    <PublishedProvider pageData={pageData}>
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
          scrollBehavior: smoothScroll ? 'smooth' : 'auto',
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
