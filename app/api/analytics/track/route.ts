import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents, analyticsSessions, projects, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { PLAN_LIMITS } from "@/lib/schema";

export const runtime = "edge";

// CORS headers for cross-origin requests from deployed pages
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      projectId,
      sessionId,
      eventType,
      pageUrl,
      referrer,
      viewportWidth,
      viewportHeight,
      elementId,
      elementText,
      elementTag,
      xPosition,
      yPosition,
      scrollDepth,
      timeOnPage,
      positions, // For heatmap batch
    } = data;

    // Validate required fields
    if (!projectId || !sessionId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify project exists and tracking is enabled for their plan
    const project = await db
      .select({
        id: projects.id,
        userId: projects.userId,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if user's plan allows tracking (Free tier only)
    const user = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, project[0].userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const planLimits = PLAN_LIMITS[user[0].plan];
    if (!planLimits.trackingEnabled) {
      // Pro users don't get tracked - silently accept but don't store
      return NextResponse.json({ received: true }, { headers: corsHeaders });
    }

    // Get country from headers (Cloudflare, Vercel, etc.)
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      null;

    const userAgent = request.headers.get("user-agent") || null;

    // Handle different event types
    if (eventType === "heatmap" && positions && Array.isArray(positions)) {
      // Batch insert heatmap positions
      const heatmapEvents = positions.map((pos: { x: number; y: number; t: number }) => ({
        projectId,
        sessionId,
        eventType: "heatmap" as const,
        pageUrl,
        xPosition: pos.x,
        yPosition: pos.y,
        viewportWidth,
        viewportHeight,
        referrer,
        userAgent,
        country,
      }));

      if (heatmapEvents.length > 0) {
        await db.insert(analyticsEvents).values(heatmapEvents);
      }
    } else {
      // Single event insert
      await db.insert(analyticsEvents).values({
        projectId,
        sessionId,
        eventType,
        pageUrl,
        elementId: elementId || null,
        elementText: elementText ? elementText.slice(0, 200) : null,
        scrollDepth: scrollDepth || null,
        xPosition: xPosition || null,
        yPosition: yPosition || null,
        viewportWidth: viewportWidth || null,
        viewportHeight: viewportHeight || null,
        referrer: referrer || null,
        userAgent,
        country,
      });
    }

    // Update or create session
    if (eventType === "pageview") {
      // Try to update existing session
      const existingSession = await db
        .select()
        .from(analyticsSessions)
        .where(eq(analyticsSessions.id, sessionId))
        .limit(1);

      if (existingSession.length === 0) {
        // Create new session
        await db.insert(analyticsSessions).values({
          id: sessionId,
          projectId,
          pageCount: 1,
        });
      } else {
        // Increment page count
        await db
          .update(analyticsSessions)
          .set({
            pageCount: (existingSession[0].pageCount || 1) + 1,
          })
          .where(eq(analyticsSessions.id, sessionId));
      }
    } else if (eventType === "leave") {
      // Update session with end data
      await db
        .update(analyticsSessions)
        .set({
          endedAt: new Date(),
          totalTimeSeconds: timeOnPage || null,
          exitPage: pageUrl || null,
        })
        .where(eq(analyticsSessions.id, sessionId));
    }

    return NextResponse.json({ received: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("[Analytics Track] Error:", error);
    // Return success anyway to not break user experience
    return NextResponse.json({ received: true }, { headers: corsHeaders });
  }
}
