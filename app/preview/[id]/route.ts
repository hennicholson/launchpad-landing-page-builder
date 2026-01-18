import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { renderLandingPage } from "@/lib/page-renderer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  });

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const html = renderLandingPage(project.pageData, project.settings || undefined);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
