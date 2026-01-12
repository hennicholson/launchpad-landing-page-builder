import { NextResponse } from "next/server";
import {
  getWhopAuthFromHeaders,
  verifyWhopTokenAndGetProfile,
  hasWhopAuth,
} from "@/lib/whop";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check if we have auth headers
    const hasAuth = await hasWhopAuth();
    console.log("[Users/Me] hasAuth:", hasAuth);

    if (!hasAuth) {
      // Return empty state for unauthenticated requests
      console.log("[Users/Me] No auth, returning null");
      return NextResponse.json({
        whop: null,
        user: null,
        error: "Not authenticated",
      });
    }

    const { token, hintedId } = await getWhopAuthFromHeaders();
    console.log("[Users/Me] Got token, hintedId:", hintedId);

    const whop = await verifyWhopTokenAndGetProfile(token, hintedId);
    console.log("[Users/Me] Whop user:", whop?.username, whop?.id);

    // Also sync the user to the database while we have auth
    let internalUser = null;
    try {
      // Convert Unix timestamp to ISO string if needed
      let whopCreatedAt: Date | null = null;
      if (whop.whop_created_at) {
        const ts = whop.whop_created_at;
        // Check if it's a Unix timestamp (number or numeric string)
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
        .where(eq(users.whopId, whop.id))
        .limit(1);

      if (existingUsers.length > 0) {
        // Update existing user
        const [result] = await db
          .update(users)
          .set({
            whopUniqueId: whop.unique_id || undefined,
            email: whop.email || undefined,
            username: whop.username || undefined,
            name: whop.name || undefined,
            bio: whop.bio || undefined,
            avatarUrl: whop.profile_pic_url || undefined,
            bannerUrl: whop.banner_url || undefined,
            whopCreatedAt: whopCreatedAt || undefined,
            userType: whop.user_type || undefined,
            isSuspended: whop.is_suspended ? "true" : "false",
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.whopId, whop.id))
          .returning();
        internalUser = result;
        console.log("[Users/Me] Updated user:", internalUser?.username);
      } else {
        // Create new user
        const [result] = await db
          .insert(users)
          .values({
            whopId: whop.id,
            whopUniqueId: whop.unique_id,
            email: whop.email,
            username: whop.username,
            name: whop.name,
            bio: whop.bio,
            avatarUrl: whop.profile_pic_url,
            bannerUrl: whop.banner_url,
            whopCreatedAt: whopCreatedAt || undefined,
            userType: whop.user_type,
            isSuspended: whop.is_suspended ? "true" : "false",
          })
          .returning();
        internalUser = result;
        console.log("[Users/Me] Created new user:", internalUser?.username);
      }
    } catch (dbError) {
      console.error("[Users/Me] DB sync error:", dbError);
    }

    return NextResponse.json({
      whop,
      user: internalUser ? {
        id: internalUser.id,
        whopId: internalUser.whopId,
        whopUniqueId: internalUser.whopUniqueId,
        email: internalUser.email,
        username: internalUser.username,
        name: internalUser.name,
        bio: internalUser.bio,
        avatarUrl: internalUser.avatarUrl,
        bannerUrl: internalUser.bannerUrl,
        plan: internalUser.plan,
        projectCount: internalUser.projectCount,
        deployCount: internalUser.deployCount,
        isAdmin: internalUser.isAdmin === "true",
        isSuspended: internalUser.isSuspended === "true",
        lastLoginAt: internalUser.lastLoginAt,
        createdAt: internalUser.createdAt,
      } : null,
    });
  } catch (e: unknown) {
    console.error("Error in /api/users/me:", e);

    if (e instanceof Error) {
      return NextResponse.json(
        { error: e.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
