import { NextResponse } from "next/server";
import {
  getWhopAuthFromHeaders,
  verifyWhopTokenAndGetProfile,
  verifyTokenSimple,
  generateUUIDFromString,
  hasWhopAuth,
  checkUserHasProAccess,
} from "@/lib/whop";
import { db } from "@/lib/db";
import { users, type PlanType } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

// POST: Accept token from request body (for client-side auth after redirect)
// Uses SIMPLE token verification - no Whop API calls
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      console.log("[Users/Me POST] No token in request body");
      return NextResponse.json({
        whop: null,
        user: null,
        error: "No token provided",
      });
    }

    console.log("[Users/Me POST] Got token from body, length:", token.length);
    console.log("[Users/Me POST] Token preview:", token.substring(0, 50) + "...");

    // Use SIMPLE verification - just decode JWT, no API calls
    const verified = verifyTokenSimple(token);

    console.log("[Users/Me POST] Verification result:", JSON.stringify(verified));

    if (!verified) {
      console.log("[Users/Me POST] Token verification failed - verified is null");
      return NextResponse.json({
        whop: null,
        user: null,
        error: "Invalid token",
      }, { status: 401 });
    }

    if (!verified.userId) {
      console.log("[Users/Me POST] Token verification failed - no userId in verified object");
      return NextResponse.json({
        whop: null,
        user: null,
        error: "No user ID in token",
      }, { status: 401 });
    }

    const userId = generateUUIDFromString(verified.userId);
    console.log("[Users/Me POST] Verified user:", verified.userId, "UUID:", userId, "email:", verified.email, "name:", verified.name);

    // Look up user in database
    let internalUser = null;
    try {
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.whopId, userId))
        .limit(1);

      // Check pro access if we have the Whop user ID
      const whopUserId = existingUsers[0]?.whopUniqueId || verified.userId || null;
      let correctPlan: PlanType = "free";

      if (whopUserId) {
        try {
          console.log(`[Users/Me POST] Checking pro access for Whop user: ${whopUserId}`);
          const hasPro = await checkUserHasProAccess(whopUserId);
          correctPlan = hasPro ? "pro" : "free";
          console.log(`[Users/Me POST] Pro access result: ${correctPlan}`);
        } catch (accessError) {
          console.error(`[Users/Me POST] Failed to check pro access:`, accessError);
          if (existingUsers.length > 0) {
            correctPlan = existingUsers[0].plan as PlanType;
          }
        }
      } else if (existingUsers.length > 0) {
        correctPlan = existingUsers[0].plan as PlanType;
      }

      if (existingUsers.length > 0) {
        // Update existing user
        const [result] = await db
          .update(users)
          .set({
            whopUniqueId: verified.userId || undefined,
            email: verified.email || undefined,
            name: verified.name || undefined,
            plan: correctPlan,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.whopId, userId))
          .returning();
        internalUser = result;
        console.log("[Users/Me POST] Updated user:", internalUser?.username);
      } else {
        // Create new user
        console.log("[Users/Me POST] Creating new user:", userId);
        const [result] = await db
          .insert(users)
          .values({
            whopId: userId,
            whopUniqueId: verified.userId,
            email: verified.email,
            name: verified.name,
            plan: correctPlan,
          })
          .returning();
        internalUser = result;
        console.log("[Users/Me POST] Created new user:", internalUser?.username);
      }
    } catch (dbError) {
      console.error("[Users/Me POST] DB sync error:", dbError);
    }

    // Return simplified whop object (we don't have full profile from simple verification)
    return NextResponse.json({
      whop: {
        id: userId,
        unique_id: verified.userId,
        email: verified.email,
        name: verified.name,
        username: verified.name,
        profile_pic_url: null,
        banner_url: null,
        bio: null,
      },
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
        balanceCents: internalUser.balanceCents,
        isAdmin: internalUser.isAdmin === "true",
        isSuspended: internalUser.isSuspended === "true",
        lastLoginAt: internalUser.lastLoginAt,
        createdAt: internalUser.createdAt,
      } : null,
    });
  } catch (e: unknown) {
    console.error("Error in /api/users/me POST:", e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET: Use headers/cookies for auth (original behavior)
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

    // Try to get auth headers - may fail in dev mode
    let token: string;
    let hintedId: string | undefined;
    try {
      const auth = await getWhopAuthFromHeaders();
      token = auth.token;
      hintedId = auth.hintedId;
    } catch (authError) {
      // In development, return demo user if no token
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          whop: {
            id: "demo-user-id",
            unique_id: "demo-whop-id",
            email: "demo@example.com",
            name: "Demo User",
            username: "demo_user",
          },
          user: {
            id: "demo-user-id",
            plan: "free",
            projectCount: 0,
            deployCount: 0,
            balanceCents: 0,
          },
        });
      }
      throw authError;
    }
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

      // Always check Pro access via Whop API on every login
      // This catches missed webhooks and ensures plan accuracy
      // IMPORTANT: Must use Whop's user_xxx format, NOT our internal UUID
      const whopUserId = existingUsers[0]?.whopUniqueId || whop.unique_id || null;
      let correctPlan: PlanType = "free";

      if (!whopUserId) {
        // No Whop unique ID available - can't check access
        console.log(`[Users/Me] No Whop unique ID available for access check (whop.unique_id=${whop.unique_id})`);
        // Keep existing plan if user exists, otherwise default to free
        correctPlan = existingUsers.length > 0 ? (existingUsers[0].plan as PlanType) : "free";
      } else {
        try {
          console.log(`[Users/Me] Checking pro access for Whop user: ${whopUserId}`);
          const hasPro = await checkUserHasProAccess(whopUserId);
          correctPlan = hasPro ? "pro" : "free";
          console.log(`[Users/Me] Pro access result for ${whopUserId}: ${correctPlan}`);
        } catch (accessError) {
          console.error(`[Users/Me] Failed to check pro access for ${whopUserId}:`, accessError);
          // On error, keep existing plan if user exists
          if (existingUsers.length > 0) {
            correctPlan = existingUsers[0].plan as PlanType;
          }
        }
      }

      if (existingUsers.length > 0) {
        const existingUser = existingUsers[0];
        // Check if plan needs updating
        const planChanged = existingUser.plan !== correctPlan;
        if (planChanged) {
          console.log(`[Users/Me] Plan changed: ${existingUser.plan} → ${correctPlan}`);
        }

        // Update existing user - sync plan if it changed
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
            // Always sync plan from Whop API check (catches missed webhooks)
            plan: correctPlan,
            isSuspended: whop.is_suspended ? "true" : "false",
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.whopId, whop.id))
          .returning();
        internalUser = result;
        console.log("[Users/Me] Updated user:", internalUser?.username, "plan:", internalUser?.plan);
      } else {
        // Create new user with plan from access check
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
            plan: correctPlan,
            isSuspended: whop.is_suspended ? "true" : "false",
          })
          .returning();
        internalUser = result;
        console.log("[Users/Me] Created new user:", internalUser?.username, "plan:", internalUser?.plan);
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
        balanceCents: internalUser.balanceCents,
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
