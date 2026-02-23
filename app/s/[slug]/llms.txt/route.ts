import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { LandingPage } from "@/lib/page-schema";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  const { slug } = await params;

  // Validate slug format
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug)) {
    return new Response("Not Found", { status: 404 });
  }

  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
  });

  if (!project || project.isPublished !== "true") {
    return new Response("Not Found", { status: 404 });
  }

  const pageData = project.pageData as LandingPage;
  const title = pageData.seo?.metaTitle || pageData.title || project.name;
  const description = pageData.seo?.metaDescription || pageData.description || "";

  // Build section summary
  const sectionSummary = pageData.sections
    .map((s) => {
      const type = s.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const heading = s.content.heading || s.content.title || "";
      return heading ? `- ${type}: ${heading}` : `- ${type}`;
    })
    .join("\n");

  // Collect key content from sections
  const keyContent: string[] = [];
  for (const section of pageData.sections) {
    if (section.content.heading) keyContent.push(section.content.heading);
    if (section.content.subheading) keyContent.push(section.content.subheading);
  }

  const llmsTxt = `# ${title}

> ${description || "A landing page built with LaunchPad."}

${keyContent.length > 0 ? `## Key Content\n\n${keyContent.map((c) => `- ${c}`).join("\n")}\n` : ""}
## Page Sections

${sectionSummary}

## About This Page

This page was built with LaunchPad, an AI-powered landing page builder. It contains ${pageData.sections.length} sections designed for conversion optimization.
`;

  return new Response(llmsTxt.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
