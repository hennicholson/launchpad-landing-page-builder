import type { WhopServerSdk as WhopServerSdkType } from "@whop/api";
import { validateToken } from "@whop-apps/sdk";
import { headers, cookies } from "next/headers";
import { createHash } from "crypto";
import { db } from "./db";
import { users, type PlanType } from "./schema";
import { eq } from "drizzle-orm";
import { LAUNCHPAD_PRO_PRODUCT_ID } from "./constants";

// Generate a consistent UUID from a string
export function generateUUIDFromString(input: string): string {
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

/**
 * Simple token verification - just decode JWT, no API calls
 * Use this for client-side auth where we just need the user ID
 * This matches the skinny-studio approach - simple and reliable
 */
export function verifyTokenSimple(token: string): { userId: string; email: string | null; name: string | null } | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      console.log("[verifyTokenSimple] Invalid JWT format");
      return null;
    }

    // Decode the payload (middle part)
    const base64Payload = parts[1];

    const decodedPayload = Buffer.from(base64Payload, "base64").toString();

    const payload = JSON.parse(decodedPayload);

    const userId = payload.sub || payload.user_id || payload.id;

    if (!userId) {
      console.log("[verifyTokenSimple] No user ID found in JWT payload");
      return null;
    }

    console.log("[verifyTokenSimple] Successfully verified token for user");

    return {
      userId,
      email: payload.email || null,
      name: payload.name || payload.username || null,
    };
  } catch (error) {
    console.error("[verifyTokenSimple] JWT decode failed");
    return null;
  }
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

/**
 * Validate Whop auth using the OFFICIAL @whop-apps/sdk
 * Checks both cookies and headers for the token
 * This is the recommended approach for apps running inside Whop's iframe
 */
export async function validateWhopAuthWithSDK(): Promise<{ userId: string; appId: string } | null> {
  try {
    const h = await headers();
    const c = await cookies();

    // Try multiple sources for the token (Whop's proxy behavior varies)
    // 1. Cookie: whop_user_token (set by Whop proxy)
    // 2. Header: x-whop-user-token (forwarded by Whop proxy)
    // 3. Cookie: x-whop-user-token (alternative cookie name)
    const token =
      c.get("whop_user_token")?.value ||
      h.get("x-whop-user-token") ||
      c.get("x-whop-user-token")?.value ||
      "";

    console.log("[Whop SDK] Validating token with official SDK...");

    if (!token) {
      console.log("[Whop SDK] No token found in cookies or headers");
      return null;
    }

    // Pass the token directly to validateToken (avoids Next.js headers compatibility issues)
    const result = await validateToken({
      token,
      dontThrow: true,
    });

    if (result) {
      console.log("[Whop SDK] Token validated successfully, userId:", result.userId);
    } else {
      console.log("[Whop SDK] Token validation returned null (invalid token)");
    }

    return result;
  } catch (error) {
    console.error("[Whop SDK] Token validation error:", error);
    return null;
  }
}

/**
 * Get Whop user using the official SDK for token validation
 * Falls back to legacy method if SDK validation fails
 */
export async function getWhopUserWithSDK(): Promise<WhopUser | null> {
  try {
    // First try the official SDK validation (reads from cookies)
    const sdkResult = await validateWhopAuthWithSDK();

    if (sdkResult?.userId) {
      console.log("[Whop SDK] Got userId from SDK:", sdkResult.userId);

      // The userId from the SDK is in user_xxx format
      // Generate our internal UUID from it
      const uuid = generateUUIDFromString(sdkResult.userId);

      // Try to fetch full user profile from Whop API
      try {
        const { WhopServerSdk } = await import("@whop/api");
        const sdk = WhopServerSdk({
          appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
          appApiKey: process.env.WHOP_API_KEY!,
        });

        const whopUser = await sdk.users.getUser({ userId: sdkResult.userId });

        if (whopUser) {
          const user = whopUser as any;
          return {
            id: uuid,
            email: user?.email || null,
            username: user?.username || null,
            unique_id: user?.id || sdkResult.userId,
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
        }
      } catch (apiError) {
        console.log("[Whop SDK] Could not fetch full profile, using SDK data");
      }

      // Return minimal user data from SDK validation
      return {
        id: uuid,
        email: null,
        username: null,
        unique_id: sdkResult.userId,
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

    // Fall back to legacy method (header-based)
    console.log("[Whop SDK] SDK validation failed, trying legacy method...");
    return await getWhopUser();
  } catch (error) {
    console.error("[Whop SDK] Error in getWhopUserWithSDK:", error);

    // Final fallback to legacy method
    return await getWhopUser();
  }
}

/**
 * Require authentication using the official SDK
 * Throws if no user authenticated
 */
export async function requireWhopUserWithSDK(): Promise<WhopUser> {
  const user = await getWhopUserWithSDK();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/** Get the Whop SDK instance for sending notifications etc */
export async function getWhopSdk() {
  return getWhopServerSdk();
}

/**
 * Get the current Whop user from the request headers.
 * Uses simple JWT decode approach (like skinny-studio) for reliability.
 */
export async function getWhopUser(): Promise<WhopUser | null> {
  try {
    const h = await headers();
    const c = await cookies();

    // Try headers first, then fall back to cookies
    let token = h.get("x-whop-user-token");
    const tokenSource = token ? "headers" : "none";

    if (!token) {
      // Fall back to cookies (set by middleware after first request)
      token = c.get("whop_user_token")?.value ||
              c.get("x-whop-user-token")?.value ||
              null;
    }

    const finalSource = token ? (tokenSource === "headers" ? "headers" : "cookies") : "none";
    console.log("[getWhopUser] Token present:", !!token, "source:", finalSource);

    if (!token) {
      console.log("[getWhopUser] No token found in headers or cookies");
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

    // Decode JWT to get user ID (simple approach that works)
    let userId: string;
    let userEmail: string | null = null;
    let userName: string | null = null;

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
        userId = payload.sub || payload.user_id || payload.id;
        userEmail = payload.email || null;
        userName = payload.name || payload.username || null;
        console.log("[getWhopUser] JWT decoded, userId:", userId);
      } else {
        console.log("[getWhopUser] Invalid JWT format");
        return null;
      }
    } catch (decodeError) {
      console.error("[getWhopUser] JWT decode error:", decodeError);
      return null;
    }

    if (!userId) {
      console.log("[getWhopUser] No userId in JWT");
      return null;
    }

    // Generate consistent UUID from the Whop user ID
    const uuid = generateUUIDFromString(userId);

    // Try to fetch full profile from Whop API (optional enrichment)
    let whopProfile: any = null;
    try {
      const { WhopServerSdk } = await import("@whop/api");
      const sdk = WhopServerSdk({
        appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
        appApiKey: process.env.WHOP_API_KEY!,
      });
      whopProfile = await sdk.users.getUser({ userId });
      console.log("[getWhopUser] Fetched profile from Whop API");
    } catch (apiError) {
      console.log("[getWhopUser] Could not fetch Whop profile, using JWT data");
    }

    const whopUser: WhopUser = {
      id: uuid,
      unique_id: whopProfile?.id || userId,
      email: whopProfile?.email || userEmail,
      username: whopProfile?.username || null,
      name: whopProfile?.name || userName,
      bio: whopProfile?.bio || null,
      profile_pic_url: whopProfile?.profilePicture?.sourceUrl ||
                       whopProfile?.profilePicture?.url ||
                       whopProfile?.profilePicUrl || null,
      banner_url: whopProfile?.banner?.sourceUrl || whopProfile?.banner?.url || null,
      whop_created_at: whopProfile?.createdAt || null,
      user_type: whopProfile?.userType || null,
      roles: whopProfile?.roles || [],
      is_suspended: whopProfile?.isSuspended || false,
    };

    // Sync user to database
    try {
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.whopId, uuid))
        .limit(1);

      if (existingUsers.length > 0) {
        await db
          .update(users)
          .set({
            whopUniqueId: whopUser.unique_id || undefined,
            email: whopUser.email || undefined,
            username: whopUser.username || undefined,
            name: whopUser.name || undefined,
            bio: whopUser.bio || undefined,
            avatarUrl: whopUser.profile_pic_url || undefined,
            bannerUrl: whopUser.banner_url || undefined,
            userType: whopUser.user_type || undefined,
            isSuspended: whopUser.is_suspended ? "true" : "false",
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.whopId, uuid));
        console.log("[getWhopUser] Updated existing user in DB");
      } else {
        await db.insert(users).values({
          whopId: uuid,
          whopUniqueId: whopUser.unique_id,
          email: whopUser.email,
          username: whopUser.username,
          name: whopUser.name,
          bio: whopUser.bio,
          avatarUrl: whopUser.profile_pic_url,
          bannerUrl: whopUser.banner_url,
          userType: whopUser.user_type,
          isSuspended: whopUser.is_suspended ? "true" : "false",
        });
        console.log("[getWhopUser] Created new user in DB");
      }
    } catch (dbError) {
      console.error("[getWhopUser] DB sync error:", dbError);
      // Continue even if DB sync fails - user is still authenticated
    }

    return whopUser;
  } catch (error) {
    console.error("[getWhopUser] Error:", error);

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

// Re-export product ID for backward compatibility (import from constants.ts for client code)
export { LAUNCHPAD_PRO_PRODUCT_ID } from "./constants";

/**
 * Check if a user has Pro access via Whop API
 * Uses WhopServerSdk from @whop/api with access.checkIfUserHasAccessToAccessPass
 */
export async function checkUserHasProAccess(whopUserId: string): Promise<boolean> {
  // Validate user ID format - should be user_xxx format from Whop
  if (!whopUserId || !whopUserId.startsWith("user_")) {
    console.warn(`[Whop] Invalid user ID format: ${whopUserId} (expected user_xxx format)`);
    return false;
  }

  try {
    // Import WhopServerSdk from @whop/api
    const { WhopServerSdk } = await import("@whop/api");

    const whopSdk = WhopServerSdk({
      appId: process.env.NEXT_PUBLIC_WHOP_APP_ID!,
      appApiKey: process.env.WHOP_API_KEY!,
    });

    console.log(`[Whop] Checking access for user ${whopUserId} to product ${LAUNCHPAD_PRO_PRODUCT_ID}`);

    // Use the correct method to check access pass membership
    const result = await whopSdk.access.checkIfUserHasAccessToAccessPass({
      accessPassId: LAUNCHPAD_PRO_PRODUCT_ID,  // prod_xxx is the access pass ID
      userId: whopUserId,
    });

    console.log(`[Whop] Access check result for ${whopUserId}:`, {
      hasAccess: result.hasAccess,
      accessLevel: result.accessLevel,
    });

    // Only return true if hasAccess is explicitly true
    return result.hasAccess === true;
  } catch (error) {
    console.error(`[Whop] Failed to check pro access for ${whopUserId}:`, error);
    // Default to false (no access) on error
    return false;
  }
}

/**
 * Get user's plan based on their Whop product access
 */
export async function getUserPlan(whopUserId: string): Promise<PlanType> {
  const hasPro = await checkUserHasProAccess(whopUserId);
  return hasPro ? "pro" : "free";
}
