import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublishedPageClient from "@/components/published/PublishedPageClient";
import type { Metadata } from "next";
import type { LandingPage, ProjectSettings } from "@/lib/page-schema";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Validate slug format
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)) {
    return { title: "Invalid Site" };
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
  });

  if (!project) {
    return { title: "Site Not Found" };
  }

  if (project.isPublished !== "true") {
    return { title: "Site Offline", robots: "noindex, nofollow" };
  }

  const pageData = project.pageData as LandingPage;
  const settings = project.settings as ProjectSettings | undefined;
  const seo = pageData.seo;

  const title = seo?.metaTitle || pageData.title || project.name;
  const description = seo?.metaDescription || pageData.description || `${project.name} - Built with Launchpad`;

  return {
    title,
    description,
    robots: seo?.robots || 'index, follow',
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      ...(seo?.ogImage || settings?.ogImage
        ? { images: [{ url: seo?.ogImage || settings?.ogImage! }] }
        : {}),
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
    },
    ...(seo?.canonicalUrl ? { alternates: { canonical: seo.canonicalUrl } } : {}),
    icons: settings?.favicon ? { icon: settings.favicon } : undefined,
  };
}

export default async function PublishedSitePage({ params }: Props) {
  const { slug } = await params;

  // Validate slug format (alphanumeric and hyphens only, prevent path traversal)
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)) {
    notFound();
  }

  // Look up project by slug
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
  });

  // Must exist
  if (!project) {
    notFound();
  }

  const siteIsPublished = project.isPublished === "true";
  const pageData = project.pageData as LandingPage;
  const settings = project.settings as ProjectSettings | undefined;

  return (
    <>
      {/* JSON-LD structured data - only for published sites */}
      {siteIsPublished && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              pageData.seo?.jsonLd || {
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: pageData.seo?.metaTitle || pageData.title || project.name,
                description: pageData.seo?.metaDescription || pageData.description,
              }
            ),
          }}
        />
      )}

      {/* Custom head content from settings - only for published sites */}
      {siteIsPublished && settings?.customHead && (
        <div dangerouslySetInnerHTML={{ __html: settings.customHead }} />
      )}

      <PublishedPageClient pageData={pageData} settings={settings} isPublished={siteIsPublished} />
    </>
  );
}
