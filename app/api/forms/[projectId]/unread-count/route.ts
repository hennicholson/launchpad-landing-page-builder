import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSubmissions, projects, users } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { requireWhopUser } from "@/lib/whop";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const whopUser = await requireWhopUser();

    const [userData] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ count: 0 });
    }

    // Verify project belongs to user
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ count: 0 });
    }

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(
        and(
          eq(formSubmissions.projectId, projectId),
          eq(formSubmissions.isRead, "false")
        )
      );

    return NextResponse.json({ count: Number(result.count) });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
