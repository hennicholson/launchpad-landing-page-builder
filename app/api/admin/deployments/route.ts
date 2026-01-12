import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deployments, projects, users, type DeploymentStatus } from "@/lib/schema";
import { verifyAdminSession } from "@/lib/admin-auth";
import { eq, desc, sql, and } from "drizzle-orm";

// GET /api/admin/deployments - Get all deployments (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized - Admin login required" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const errorCode = searchParams.get("errorCode");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(deployments.status, status as DeploymentStatus));
    }
    if (errorCode) {
      conditions.push(eq(deployments.errorCode, errorCode));
    }

    // Get deployments with project and user info
    const allDeployments = await db
      .select({
        id: deployments.id,
        projectId: deployments.projectId,
        status: deployments.status,
        url: deployments.url,
        errorMessage: deployments.errorMessage,
        errorCode: deployments.errorCode,
        retryCount: deployments.retryCount,
        maxRetries: deployments.maxRetries,
        isFatal: deployments.isFatal,
        lastAttemptAt: deployments.lastAttemptAt,
        createdAt: deployments.createdAt,
        netlifyDeployId: deployments.netlifyDeployId,
        projectName: projects.name,
        projectSlug: projects.slug,
        userName: users.name,
        userEmail: users.email,
      })
      .from(deployments)
      .leftJoin(projects, eq(deployments.projectId, projects.id))
      .leftJoin(users, eq(projects.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(deployments.createdAt))
      .limit(limit)
      .offset(offset);

    // Get stats
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`count(*) filter (where status = 'pending')`,
        building: sql<number>`count(*) filter (where status = 'building')`,
        ready: sql<number>`count(*) filter (where status = 'ready')`,
        failed: sql<number>`count(*) filter (where status = 'failed')`,
        retrying: sql<number>`count(*) filter (where status = 'retrying')`,
      })
      .from(deployments);

    // Get error code breakdown
    const errorBreakdown = await db
      .select({
        errorCode: deployments.errorCode,
        count: sql<number>`count(*)`,
      })
      .from(deployments)
      .where(eq(deployments.status, "failed"))
      .groupBy(deployments.errorCode)
      .orderBy(desc(sql`count(*)`));

    return NextResponse.json({
      deployments: allDeployments,
      stats: {
        ...stats,
        successRate: stats?.total ? ((Number(stats.ready) / Number(stats.total)) * 100).toFixed(1) : 0,
      },
      errorBreakdown,
      pagination: {
        limit,
        offset,
        hasMore: allDeployments.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching admin deployments:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}
