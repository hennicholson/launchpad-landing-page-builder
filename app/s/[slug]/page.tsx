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

  if (!project || project.isPublished !== "true") {
    return { title: "Site Not Found" };
  }

  const pageData = project.pageData as LandingPage;
  const settings = project.settings as ProjectSettings | undefined;

  return {
    title: pageData.title || project.name,
    description: pageData.description || `${project.name} - Built with Launchpad`,
    openGraph: settings?.ogImage
      ? {
          images: [{ url: settings.ogImage }],
        }
      : undefined,
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

  // Must exist and be published
  if (!project) {
    notFound();
  }

  if (project.isPublished !== "true") {
    notFound();
  }

  const pageData = project.pageData as LandingPage;
  const settings = project.settings as ProjectSettings | undefined;

  return (
    <>
      {/* Custom head content from settings */}
      {settings?.customHead && (
        <div dangerouslySetInnerHTML={{ __html: settings.customHead }} />
      )}

      <PublishedPageClient pageData={pageData} settings={settings} />
    </>
  );
}
