import type { WhopServerSdk as WhopServerSdkType } from "@whop/api";
import { headers, cookies } from "next/headers";
import { createHash } from "crypto";
import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

// Generate a consistent UUID from a string
function generateUUIDFromString(input: string): string {
  const hash = createHash("sha256").update(input).digest("hex");
  const uuidHex = hash.substring(0, 32);

  return [
    uuidHex.substring(0, 8),
    uuidHex.substring(8, 12),
    "4" + uuidHex.substring(13, 16),
    "8" + uuidHex.substring(17, 20),
    uuidHex.substring(20, 32),
  ].join("-");
}

// Lazy create to avoid import-time errors in edge runtimes
let whopSdk: WhopServerSdkType | null = null;

async function getWhopServerSdk() {
  if (whopSdk) return whopSdk;

  const { WhopServerSdk } = await import("@whop/api");
  whopSdk = WhopServerSdk({
    appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
    appApiKey: process.env.WHOP_API_KEY!,
  });

  return whopSdk;
}

// Extended user type with all available Whop data
export type WhopUser = {
  id: string;
  email?: string | null;
  username?: string | null;
  unique_id?: string | null;
  name?: string | null;
  bio?: string | null;
  profile_pic_url?: string | null;
  banner_url?: string | null;
  whop_created_at?: string | null;
  user_type?: string | null;
  roles?: string[];
  is_suspended?: boolean;
};

export async function verifyWhopTokenAndGetProfile(
  token: string,
  hintedId?: string
): Promise<WhopUser> {
  if (!token) throw new Error("Missing Whop token");

  try {
    const tokenParts = token.split(".");
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], "base64").toString()
        );

        if (payload.sub || payload.user_id || payload.id) {
          const userId = payload.sub || payload.user_id || payload.id;
          const uuid = generateUUIDFromString(userId);

          try {
            const { WhopServerSdk } = await import("@whop/api");
            const sdk = WhopServerSdk({
              appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
              appApiKey: process.env.WHOP_API_KEY!,
            });

            let whopUser: any = null;
            try {
              whopUser = await sdk.users.getUser({ userId });
            } catch (e) {
              // Whop API unavailable, continue with JWT data
            }

            if (whopUser) {
              const profilePicUrl = whopUser.profilePicture?.sourceUrl ||
                whopUser.profilePicture?.url ||
                (whopUser as any).profilePicUrl ||
                null;

              const bannerUrl = whopUser.banner?.sourceUrl ||
                whopUser.banner?.url ||
                null;

              return {
                id: uuid,
                email: whopUser.email || payload.email || null,
                username: whopUser.username || null,
                unique_id: whopUser.id || null,
                name: whopUser.name || null,
                bio: whopUser.bio || null,
                profile_pic_url: profilePicUrl,
                banner_url: bannerUrl,
                whop_created_at: whopUser.createdAt || null,
                user_type: whopUser.userType || null,
                roles: whopUser.roles || [],
                is_suspended: whopUser.isSuspended || false,
              };
            }

            return {
              id: uuid,
              email: payload.email || null,
              username: payload.username || payload.name || null,
              unique_id: payload.sub || payload.user_id || payload.id || null,
              name: payload.name || null,
              bio: null,
              profile_pic_url: null,
              banner_url: null,
              whop_created_at: null,
              user_type: null,
              roles: [],
              is_suspended: false,
            };
          } catch (whopError) {
            // Could not fetch from Whop API, using JWT data
            return {
              id: uuid,
              email: payload.email || null,
              username: payload.username || payload.name || null,
              unique_id: payload.sub || payload.user_id || payload.id || null,
              name: payload.name || null,
              bio: null,
              profile_pic_url: null,
              banner_url: null,
              whop_created_at: null,
              user_type: null,
              roles: [],
              is_suspended: false,
            };
          }
        }
      } catch (jwtError) {
        // JWT decode failed, using fallback approach
      }
    }

    // Fallback: Use the hintedId if available
    if (hintedId) {
      const uuid = generateUUIDFromString(hintedId);

      try {
        const { WhopServerSdk } = await import("@whop/api");
        const sdk = WhopServerSdk({
          appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
          appApiKey: process.env.WHOP_API_KEY!,
        });

        const whopUser = await sdk.users.getUser({ userId: hintedId });

        const user = whopUser as any;
        return {
          id: uuid,
          email: user?.email || null,
          username: user?.username || null,
          unique_id: user?.id || null,
          name: user?.name || null,
          bio: user?.bio || null,
          profile_pic_url: user?.profilePicture?.sourceUrl ||
            user?.profilePicture?.url ||
            user?.profilePicUrl ||
            null,
          banner_url: user?.banner?.sourceUrl || user?.banner?.url || null,
          whop_created_at: user?.createdAt || null,
          user_type: user?.userType || null,
          roles: user?.roles || [],
          is_suspended: user?.isSuspended || false,
        };
      } catch (whopError) {
        // Could not fetch from Whop API using hintedId
        return {
          id: uuid,
          email: null,
          username: null,
          unique_id: hintedId || null,
          name: null,
          bio: null,
          profile_pic_url: null,
          banner_url: null,
          whop_created_at: null,
          user_type: null,
          roles: [],
          is_suspended: false,
        };
      }
    }

    // Final fallback: Generate UUID from token
    const uuid = generateUUIDFromString(token);

    return {
      id: uuid,
      email: null,
      username: null,
      unique_id: null,
      name: null,
      bio: null,
      profile_pic_url: null,
      banner_url: null,
      whop_created_at: null,
      user_type: null,
      roles: [],
      is_suspended: false,
    };
  } catch (error) {
    throw new Error("Whop verification failed");
  }
}

/** Convenience: read Whop token/id hints from headers or cookies */
export async function getWhopAuthFromHeaders(): Promise<{
  token: string;
  hintedId?: string;
}> {
  const h = await headers();
  const c = await cookies();

  // Check headers first, then cookies
  let token = h.get("x-whop-user-token") || "";
  let hintedId = h.get("x-whop-user-id") || undefined;

  // Fallback to cookies if headers don't have the token
  if (!token) {
    token = c.get("whop_user_token")?.value || c.get("x-whop-user-token")?.value || "";
    hintedId = hintedId || c.get("whop_user_id")?.value || c.get("x-whop-user-id")?.value || undefined;
  }

  if (!token) throw new Error("Missing x-whop-user-token");

  return { token, hintedId };
}

/** Check if we have valid auth headers or cookies (doesn't throw) */
export async function hasWhopAuth(): Promise<boolean> {
  try {
    const h = await headers();
    const c = await cookies();

    const token = h.get("x-whop-user-token") ||
                  c.get("whop_user_token")?.value ||
                  c.get("x-whop-user-token")?.value || "";

    // In development, allow access without token
    if (!token && process.env.NODE_ENV === "development") {
      return true;
    }

    return !!token;
  } catch (e) {
    return false;
  }
}

/** Get the Whop SDK instance for sending notifications etc */
export async function getWhopSdk() {
  return getWhopServerSdk();
}

/**
 * Get the current Whop user from the request headers.
 * Creates a new user in the database if they don't exist.
 * (Legacy function for backward compatibility)
 */
export async function getWhopUser(): Promise<WhopUser | null> {
  try {
    const hasAuth = await hasWhopAuth();

    if (!hasAuth) {
      // In development, return a demo user if no token
      if (process.env.NODE_ENV === "development") {
        return {
          id: "demo-user-id",
          unique_id: "demo-whop-id",
          email: "demo@example.com",
          name: "Demo User",
          username: "demo_user",
          profile_pic_url: null,
          banner_url: null,
          bio: null,
          whop_created_at: null,
          user_type: null,
          roles: [],
          is_suspended: false,
        };
      }
      return null;
    }

    const { token, hintedId } = await getWhopAuthFromHeaders();
    const whop = await verifyWhopTokenAndGetProfile(token, hintedId);

    // Find or create user in database
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whop.id))
      .limit(1);

    if (existingUsers.length > 0) {
      // Update existing user with latest Whop data
      const [updatedUser] = await db
        .update(users)
        .set({
          whopUniqueId: whop.unique_id || undefined,
          email: whop.email || undefined,
          username: whop.username || undefined,
          name: whop.name || undefined,
          bio: whop.bio || undefined,
          avatarUrl: whop.profile_pic_url || undefined,
          bannerUrl: whop.banner_url || undefined,
          userType: whop.user_type || undefined,
          isSuspended: whop.is_suspended ? "true" : "false",
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.whopId, whop.id))
        .returning();

      return whop;
    }

    // Create new user
    await db
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
        userType: whop.user_type,
        isSuspended: whop.is_suspended ? "true" : "false",
      });

    return whop;
  } catch (error) {
    console.error("Error getting Whop user:", error);

    // In development, return demo user on error
    if (process.env.NODE_ENV === "development") {
      return {
        id: "demo-user-id",
        unique_id: "demo-whop-id",
        email: "demo@example.com",
        name: "Demo User",
        username: "demo_user",
        profile_pic_url: null,
        banner_url: null,
        bio: null,
        whop_created_at: null,
        user_type: null,
        roles: [],
        is_suspended: false,
      };
    }
    return null;
  }
}

/**
 * Require authentication - throws if no user
 */
export async function requireWhopUser(): Promise<WhopUser> {
  const user = await getWhopUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
