import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSubmissions, projects, users, PLAN_LIMITS } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { requireWhopUser } from "@/lib/whop";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> }
) {
  try {
    const { projectId, submissionId } = await params;

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
    const { isRead, email, notes } = body as { isRead?: string; email?: string; notes?: string };

    // Build update object from provided fields only
    const updates: Record<string, string> = {};
    if (isRead !== undefined) updates.isRead = isRead;
    if (email !== undefined) updates.email = email;
    if (notes !== undefined) updates.notes = notes;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(formSubmissions)
      .set(updates)
      .where(
        and(
          eq(formSubmissions.id, submissionId),
          eq(formSubmissions.projectId, projectId)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[Submission Update] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; submissionId: string }> }
) {
  try {
    const { projectId, submissionId } = await params;

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

    await db
      .delete(formSubmissions)
      .where(
        and(
          eq(formSubmissions.id, submissionId),
          eq(formSubmissions.projectId, projectId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Submission Delete] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
