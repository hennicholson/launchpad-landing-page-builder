import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, users, pdfExports } from "@/lib/schema";
import { requireWhopUser } from "@/lib/whop";
import { eq, and } from "drizzle-orm";
import { extractCopy } from "@/lib/copy-extractor";
import { renderCopySheet } from "@/lib/copy-sheet-renderer";
import type { LandingPage } from "@/lib/page-schema";

type Params = Promise<{ id: string }>;

// Generate a short unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// POST /api/export-pdf/[id] - Start a PDF export (triggers background function)
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the project with ownership check
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get page data
    const pageData = project.pageData as LandingPage | null;
    if (!pageData) {
      return NextResponse.json({ error: "No page data found" }, { status: 400 });
    }

    // Extract copy and render as HTML (do this in API route, not background function)
    const copyData = extractCopy(pageData);
    const html = renderCopySheet(project.name, copyData);
    const fileName = `${project.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-copy-sheet.pdf`;

    // Create export record
    const exportId = generateId();
    await db.insert(pdfExports).values({
      id: exportId,
      userId: userData.id,
      projectId: id,
      status: "pending",
    });

    // Trigger background function (fire-and-forget)
    const backgroundUrl = `${process.env.URL || "https://onwhop.com"}/.netlify/functions/pdf-export-background`;

    console.log("[PDF-EXPORT] Triggering background function:", backgroundUrl);

    fetch(backgroundUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exportId,
        html,
        fileName,
      }),
    }).catch((err) => {
      console.error("[PDF-EXPORT] Failed to trigger background function:", err);
    });

    return NextResponse.json({ exportId, status: "pending" });
  } catch (error) {
    console.error("Error starting PDF export:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to start PDF export", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET /api/export-pdf/[id] - Poll for status or download PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const exportId = searchParams.get("exportId");

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If exportId is provided, poll for that specific export
    if (exportId) {
      const [pdfExport] = await db
        .select()
        .from(pdfExports)
        .where(and(
          eq(pdfExports.id, exportId),
          eq(pdfExports.userId, userData.id)
        ))
        .limit(1);

      if (!pdfExport) {
        return NextResponse.json({ error: "Export not found" }, { status: 404 });
      }

      // If complete and has data, return the PDF file
      if (pdfExport.status === "complete" && pdfExport.fileData) {
        const buffer = Buffer.from(pdfExport.fileData, "base64");
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${pdfExport.fileName || "export.pdf"}"`,
            "Content-Length": buffer.length.toString(),
          },
        });
      }

      // Otherwise return status
      return NextResponse.json({
        status: pdfExport.status,
        error: pdfExport.error,
      });
    }

    // No exportId - this is the legacy synchronous export (keep for backwards compatibility)
    // This will likely fail on Netlify but works locally
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const pageData = project.pageData as LandingPage | null;
    if (!pageData) {
      return NextResponse.json({ error: "No page data found" }, { status: 400 });
    }

    // For backwards compatibility, try sync generation
    // This will likely timeout on Netlify - frontend should use POST instead
    const { generatePdfFromHtml } = await import("@/lib/pdf-export");
    const copyData = extractCopy(pageData);
    const html = renderCopySheet(project.name, copyData);
    const pdfBuffer = await generatePdfFromHtml(html);

    const filename = `${project.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-copy-sheet.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error with PDF export:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to process PDF request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
