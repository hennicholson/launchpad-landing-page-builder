import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { getWhopAuthFromHeaders, verifyWhopTokenAndGetProfile, hasWhopAuth } from "@/lib/whop";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// POST /api/users/sync - Sync Whop user to internal database
export async function POST() {
  try {
    const hasAuth = await hasWhopAuth();
    console.log("[Sync] hasAuth:", hasAuth);

    if (!hasAuth) {
      console.log("[Sync] No auth found, returning 401");
      return NextResponse.json({ error: "Unauthorized", debug: "No whop auth token found" }, { status: 401 });
    }

    const { token, hintedId } = await getWhopAuthFromHeaders();
    const whopUser = await verifyWhopTokenAndGetProfile(token, hintedId);

    // Convert Unix timestamp to Date if needed
    let whopCreatedAt: Date | null = null;
    if (whopUser.whop_created_at) {
      const ts = whopUser.whop_created_at;
      if (typeof ts === 'number' || /^\d+$/.test(ts)) {
        whopCreatedAt = new Date(Number(ts) * 1000);
      } else {
        whopCreatedAt = new Date(ts);
      }
    }

    // Try to find existing user
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    let user;

    if (existingUsers.length > 0) {
      // Update existing user with all available data
      const [result] = await db
        .update(users)
        .set({
          whopUniqueId: whopUser.unique_id || undefined,
          email: whopUser.email || undefined,
          username: whopUser.username || undefined,
          name: whopUser.name || undefined,
          bio: whopUser.bio || undefined,
          avatarUrl: whopUser.profile_pic_url || undefined,
          bannerUrl: whopUser.banner_url || undefined,
          whopCreatedAt: whopCreatedAt || undefined,
          userType: whopUser.user_type || undefined,
          isSuspended: whopUser.is_suspended ? "true" : "false",
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.whopId, whopUser.id))
        .returning();
      user = result;
    } else {
      // Create new user with all available data
      const [result] = await db
        .insert(users)
        .values({
          whopId: whopUser.id,
          whopUniqueId: whopUser.unique_id,
          email: whopUser.email,
          username: whopUser.username,
          name: whopUser.name,
          bio: whopUser.bio,
          avatarUrl: whopUser.profile_pic_url,
          bannerUrl: whopUser.banner_url,
          whopCreatedAt: whopCreatedAt || undefined,
          userType: whopUser.user_type,
          isSuspended: whopUser.is_suspended ? "true" : "false",
        })
        .returning();
      user = result;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        whopId: user.whopId,
        whopUniqueId: user.whopUniqueId,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        bannerUrl: user.bannerUrl,
        plan: user.plan,
        projectCount: user.projectCount,
        deployCount: user.deployCount,
        isAdmin: user.isAdmin === "true",
        isSuspended: user.isSuspended === "true",
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}

// GET /api/users/sync - Get current synced user
export async function GET() {
  try {
    const hasAuth = await hasWhopAuth();
    if (!hasAuth) {
      return NextResponse.json({ user: null });
    }

    const { token, hintedId } = await getWhopAuthFromHeaders();
    const whopUser = await verifyWhopTokenAndGetProfile(token, hintedId);

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (existingUsers.length === 0) {
      return NextResponse.json({ user: null, needsSync: true });
    }

    const user = existingUsers[0];
    return NextResponse.json({
      user: {
        id: user.id,
        whopId: user.whopId,
        whopUniqueId: user.whopUniqueId,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        bannerUrl: user.bannerUrl,
        plan: user.plan,
        projectCount: user.projectCount,
        deployCount: user.deployCount,
        isAdmin: user.isAdmin === "true",
        isSuspended: user.isSuspended === "true",
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ user: null });
  }
}
