import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, type PlanType } from "@/lib/schema";
import { verifyAdminSession } from "@/lib/admin-auth";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/admin/subscribers - Get all Pro subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized - Admin login required" }, { status: 401 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const planFilter = (searchParams.get("plan") || "pro") as PlanType;
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get subscribers by plan
    const subscribers = await db
      .select({
        id: users.id,
        whopId: users.whopId,
        whopUniqueId: users.whopUniqueId,
        email: users.email,
        username: users.username,
        name: users.name,
        avatarUrl: users.avatarUrl,
        plan: users.plan,
        projectCount: users.projectCount,
        deployCount: users.deployCount,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.plan, planFilter))
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Get stats by plan
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        free: sql<number>`count(*) filter (where plan = 'free')`,
        starter: sql<number>`count(*) filter (where plan = 'starter')`,
        pro: sql<number>`count(*) filter (where plan = 'pro')`,
        enterprise: sql<number>`count(*) filter (where plan = 'enterprise')`,
      })
      .from(users);

    return NextResponse.json({
      subscribers,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: subscribers.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching admin subscribers:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
