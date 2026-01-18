import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyticsEvents, projects, users } from "@/lib/schema";
import { eq, and, gte, or, sql } from "drizzle-orm";
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
    const days = parseInt(url.searchParams.get("days") || "7");
    const type = url.searchParams.get("type") || "clicks"; // clicks or movement
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get heatmap data based on type
    const eventTypes = type === "clicks" ? ["click"] : ["heatmap"];

    const heatmapData = await db
      .select({
        x: analyticsEvents.xPosition,
        y: analyticsEvents.yPosition,
        viewportWidth: analyticsEvents.viewportWidth,
        viewportHeight: analyticsEvents.viewportHeight,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          or(
            ...eventTypes.map((t) => eq(analyticsEvents.eventType, t as any))
          ),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .limit(5000); // Limit for performance

    // Normalize coordinates to percentages for consistent rendering
    const normalizedData = heatmapData
      .filter((d) => d.x !== null && d.y !== null && d.viewportWidth && d.viewportHeight)
      .map((d) => ({
        x: Math.round(((d.x || 0) / (d.viewportWidth || 1)) * 100),
        y: d.y, // Keep y absolute for scroll-based heatmap
        viewportWidth: d.viewportWidth,
      }));

    // Group by position and count
    const grouped: Record<string, { x: number; y: number; count: number }> = {};
    normalizedData.forEach((d) => {
      // Round to grid (every 2% for x, every 50px for y)
      const gridX = Math.round(d.x / 2) * 2;
      const gridY = Math.round((d.y || 0) / 50) * 50;
      const key = `${gridX},${gridY}`;

      if (!grouped[key]) {
        grouped[key] = { x: gridX, y: gridY, count: 0 };
      }
      grouped[key].count++;
    });

    const points = Object.values(grouped);
    const maxCount = Math.max(...points.map((p) => p.count), 1);

    // Normalize intensity (0-1)
    const heatmapPoints = points.map((p) => ({
      x: p.x,
      y: p.y,
      intensity: p.count / maxCount,
      count: p.count,
    }));

    return NextResponse.json({
      type,
      points: heatmapPoints,
      totalPoints: heatmapData.length,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("[Analytics Heatmap] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
