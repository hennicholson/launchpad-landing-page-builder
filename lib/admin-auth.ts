/**
 * Admin Authentication System
 * Handles password hashing, verification, and session management
 */

import { db } from "./db";
import { adminAccounts } from "./schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Simple password hashing using SHA-256 with salt
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const useSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, useSalt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt: useSalt };
}

function verifyPassword(password: string, storedHash: string): boolean {
  // storedHash format: "salt:hash"
  const [salt, hash] = storedHash.split(":");
  const { hash: computedHash } = hashPassword(password, salt);
  return hash === computedHash;
}

export function createPasswordHash(password: string): string {
  const { hash, salt } = hashPassword(password);
  return `${salt}:${hash}`;
}

/**
 * Verify admin credentials and create session
 */
export async function authenticateAdmin(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [admin] = await db
      .select()
      .from(adminAccounts)
      .where(eq(adminAccounts.username, username))
      .limit(1);

    if (!admin) {
      return { success: false, error: "Invalid credentials" };
    }

    if (!verifyPassword(password, admin.passwordHash)) {
      return { success: false, error: "Invalid credentials" };
    }

    // Update last login
    await db
      .update(adminAccounts)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminAccounts.id, admin.id));

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionData = {
      adminId: admin.id,
      username: admin.username,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };

    // Store session in cookie (signed with a hash)
    const sessionPayload = Buffer.from(JSON.stringify(sessionData)).toString("base64");
    const signature = crypto
      .createHmac("sha256", process.env.ADMIN_SECRET || "launchpad-admin-secret")
      .update(sessionPayload)
      .digest("hex");

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, `${sessionPayload}.${signature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Admin auth error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Verify admin session from cookies
 */
export async function verifyAdminSession(): Promise<{
  authenticated: boolean;
  admin?: { id: string; username: string };
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionCookie?.value) {
      return { authenticated: false };
    }

    const [payload, signature] = sessionCookie.value.split(".");
    if (!payload || !signature) {
      return { authenticated: false };
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.ADMIN_SECRET || "launchpad-admin-secret")
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { authenticated: false };
    }

    // Parse session data
    const sessionData = JSON.parse(Buffer.from(payload, "base64").toString());

    // Check expiration
    if (Date.now() > sessionData.expiresAt) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      admin: { id: sessionData.adminId, username: sessionData.username },
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return { authenticated: false };
  }
}

/**
 * Clear admin session
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Create or update admin account
 */
export async function upsertAdminAccount(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const passwordHash = createPasswordHash(password);

    // Check if account exists
    const [existing] = await db
      .select()
      .from(adminAccounts)
      .where(eq(adminAccounts.username, username))
      .limit(1);

    if (existing) {
      // Update password
      await db
        .update(adminAccounts)
        .set({ passwordHash })
        .where(eq(adminAccounts.id, existing.id));
    } else {
      // Create new account
      await db.insert(adminAccounts).values({
        username,
        passwordHash,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Upsert admin error:", error);
    return { success: false, error: "Failed to create admin account" };
  }
}
