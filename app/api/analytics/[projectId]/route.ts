import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents, analyticsSessions, projects, users } from "@/lib/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";
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

    // Get date range from query params
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get aggregate stats
    const [stats] = await db
      .select({
        totalPageviews: sql<number>`count(case when ${analyticsEvents.eventType} = 'pageview' then 1 end)`,
        totalClicks: sql<number>`count(case when ${analyticsEvents.eventType} = 'click' then 1 end)`,
        uniqueSessions: sql<number>`count(distinct ${analyticsEvents.sessionId})`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          gte(analyticsEvents.createdAt, startDate)
        )
      );

    // Get session stats
    const [sessionStats] = await db
      .select({
        avgTimeOnPage: sql<number>`avg(${analyticsSessions.totalTimeSeconds})`,
        totalSessions: sql<number>`count(*)`,
        bounceRate: sql<number>`
          round(
            (count(case when ${analyticsSessions.pageCount} = 1 then 1 end)::decimal /
            nullif(count(*), 0)) * 100
          )
        `,
      })
      .from(analyticsSessions)
      .where(
        and(
          eq(analyticsSessions.projectId, projectId),
          gte(analyticsSessions.startedAt, startDate)
        )
      );

    // Get pageviews by day
    const pageviewsByDay = await db
      .select({
        date: sql<string>`date(${analyticsEvents.createdAt})`,
        count: sql<number>`count(*)`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "pageview"),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(sql`date(${analyticsEvents.createdAt})`)
      .orderBy(sql`date(${analyticsEvents.createdAt})`);

    // Get top clicked elements
    const topClicks = await db
      .select({
        elementId: analyticsEvents.elementId,
        elementText: analyticsEvents.elementText,
        count: sql<number>`count(*)`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "click"),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(analyticsEvents.elementId, analyticsEvents.elementText)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Get scroll depth distribution
    const scrollDepths = await db
      .select({
        scrollDepth: analyticsEvents.scrollDepth,
        count: sql<number>`count(*)`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "scroll"),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(analyticsEvents.scrollDepth)
      .orderBy(analyticsEvents.scrollDepth);

    // Get referrer breakdown
    const referrers = await db
      .select({
        referrer: analyticsEvents.referrer,
        count: sql<number>`count(distinct ${analyticsEvents.sessionId})`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "pageview"),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(analyticsEvents.referrer)
      .orderBy(desc(sql`count(distinct ${analyticsEvents.sessionId})`))
      .limit(10);

    // Get country breakdown
    const countries = await db
      .select({
        country: analyticsEvents.country,
        count: sql<number>`count(distinct ${analyticsEvents.sessionId})`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          eq(analyticsEvents.eventType, "pageview"),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(analyticsEvents.country)
      .orderBy(desc(sql`count(distinct ${analyticsEvents.sessionId})`))
      .limit(10);

    return NextResponse.json({
      overview: {
        pageviews: stats.totalPageviews || 0,
        uniqueVisitors: stats.uniqueSessions || 0,
        clicks: stats.totalClicks || 0,
        avgTimeOnPage: sessionStats.avgTimeOnPage || 0,
        bounceRate: sessionStats.bounceRate || 0,
      },
      pageviewsByDay,
      topClicks,
      scrollDepths,
      referrers,
      countries,
    });
  } catch (error) {
    console.error("[Analytics] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
