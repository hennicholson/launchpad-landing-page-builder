import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSubmissions, projects, users, PLAN_LIMITS } from "@/lib/schema";
import { eq, and, gte, sql } from "drizzle-orm";
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
      return NextResponse.json({ error: "Upgrade to Pro to view stats" }, { status: 403 });
    }

    // Get total submissions
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(eq(formSubmissions.projectId, projectId));

    // Get unique emails
    const [uniqueResult] = await db
      .select({ count: sql<number>`count(distinct ${formSubmissions.email})` })
      .from(formSubmissions)
      .where(eq(formSubmissions.projectId, projectId));

    // Get this week's submissions
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [weekResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(
        and(
          eq(formSubmissions.projectId, projectId),
          gte(formSubmissions.createdAt, weekAgo)
        )
      );

    // Get submissions per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const submissionsPerDay = await db
      .select({
        date: sql<string>`to_char(${formSubmissions.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)`,
      })
      .from(formSubmissions)
      .where(
        and(
          eq(formSubmissions.projectId, projectId),
          gte(formSubmissions.createdAt, thirtyDaysAgo)
        )
      )
      .groupBy(sql`to_char(${formSubmissions.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${formSubmissions.createdAt}, 'YYYY-MM-DD')`);

    return NextResponse.json({
      totalSubmissions: Number(totalResult.count),
      uniqueEmails: Number(uniqueResult.count),
      thisWeek: Number(weekResult.count),
      submissionsPerDay: submissionsPerDay.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
    });
  } catch (error) {
    console.error("[Form Stats] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
