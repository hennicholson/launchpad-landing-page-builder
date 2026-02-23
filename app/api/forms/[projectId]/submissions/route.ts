import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSubmissions, projects, users, PLAN_LIMITS } from "@/lib/schema";
import { eq, and, desc, like, sql, inArray } from "drizzle-orm";
import { requireWhopUser } from "@/lib/whop";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Verify user is logged in
    const whopUser = await requireWhopUser();

    // Get user's database record
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project belongs to user
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check plan access
    const planLimits = PLAN_LIMITS[userData.plan];
    if (!planLimits.canViewSubmissions) {
      return NextResponse.json({ error: "Upgrade to Pro to view submissions" }, { status: 403 });
    }

    // Parse query params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
    const search = url.searchParams.get("search") || "";
    const format = url.searchParams.get("format") || "json";
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(formSubmissions.projectId, projectId)];
    if (search) {
      conditions.push(like(formSubmissions.email, `%${search}%`));
    }

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(and(...conditions));

    const total = Number(countResult.count);

    // Get submissions with all columns
    const submissions = await db
      .select({
        id: formSubmissions.id,
        email: formSubmissions.email,
        fields: formSubmissions.fields,
        sectionId: formSubmissions.sectionId,
        sectionType: formSubmissions.sectionType,
        sourceUrl: formSubmissions.sourceUrl,
        referrer: formSubmissions.referrer,
        userAgent: formSubmissions.userAgent,
        ipCountry: formSubmissions.ipCountry,
        sessionId: formSubmissions.sessionId,
        isRead: formSubmissions.isRead,
        notes: formSubmissions.notes,
        createdAt: formSubmissions.createdAt,
      })
      .from(formSubmissions)
      .where(and(...conditions))
      .orderBy(desc(formSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    // CSV export
    if (format === "csv") {
      const csvHeader = "Email,Section,Date,Read,Country,Source URL,Referrer,Notes\n";
      const csvRows = submissions.map((s) => {
        const date = s.createdAt ? new Date(s.createdAt).toISOString() : "";
        return `"${(s.email || "").replace(/"/g, '""')}","${s.sectionType || ""}","${date}","${s.isRead === "true" ? "Yes" : "No"}","${(s.ipCountry || "").replace(/"/g, '""')}","${(s.sourceUrl || "").replace(/"/g, '""')}","${(s.referrer || "").replace(/"/g, '""')}","${(s.notes || "").replace(/"/g, '""')}"`;
      }).join("\n");

      return new Response(csvHeader + csvRows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="submissions-${projectId}.csv"`,
        },
      });
    }

    return NextResponse.json({
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[Submissions List] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Verify user is logged in
    const whopUser = await requireWhopUser();

    // Get user's database record
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project belongs to user
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check plan access
    const planLimits = PLAN_LIMITS[userData.plan];
    if (!planLimits.canViewSubmissions) {
      return NextResponse.json({ error: "Upgrade to Pro to manage submissions" }, { status: 403 });
    }

    const body = await request.json();
    const { ids, isRead } = body as { ids: string[]; isRead: string };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    await db
      .update(formSubmissions)
      .set({ isRead })
      .where(
        and(
          eq(formSubmissions.projectId, projectId),
          inArray(formSubmissions.id, ids)
        )
      );

    return NextResponse.json({ updated: ids.length });
  } catch (error) {
    console.error("[Submissions Bulk Update] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // Verify user is logged in
    const whopUser = await requireWhopUser();

    // Get user's database record
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project belongs to user
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check plan access
    const planLimits = PLAN_LIMITS[userData.plan];
    if (!planLimits.canViewSubmissions) {
      return NextResponse.json({ error: "Upgrade to Pro to manage submissions" }, { status: 403 });
    }

    const body = await request.json();
    const { ids } = body as { ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids array is required" }, { status: 400 });
    }

    await db
      .delete(formSubmissions)
      .where(
        and(
          eq(formSubmissions.projectId, projectId),
          inArray(formSubmissions.id, ids)
        )
      );

    return NextResponse.json({ deleted: ids.length });
  } catch (error) {
    console.error("[Submissions Bulk Delete] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
