import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { verifyAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

// POST /api/migrate - Run database migrations
export async function POST() {
  try {
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: "Database URL not configured" }, { status: 500 });
    }

    const sql = neon(dbUrl);

    const results = [];

    // Migration 1: Add whop_unique_id column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS whop_unique_id TEXT`;
      results.push({ migration: "whop_unique_id", status: "success" });
    } catch (err: any) {
      results.push({ migration: "whop_unique_id", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 2: Add username column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT`;
      results.push({ migration: "username", status: "success" });
    } catch (err: any) {
      results.push({ migration: "username", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 3: Add bio column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`;
      results.push({ migration: "bio", status: "success" });
    } catch (err: any) {
      results.push({ migration: "bio", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 4: Add avatar_url column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
      results.push({ migration: "avatar_url", status: "success" });
    } catch (err: any) {
      results.push({ migration: "avatar_url", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 5: Add banner_url column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS banner_url TEXT`;
      results.push({ migration: "banner_url", status: "success" });
    } catch (err: any) {
      results.push({ migration: "banner_url", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 6: Add whop_created_at column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS whop_created_at TIMESTAMP WITH TIME ZONE`;
      results.push({ migration: "whop_created_at", status: "success" });
    } catch (err: any) {
      results.push({ migration: "whop_created_at", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 7: Add user_type column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT`;
      results.push({ migration: "user_type", status: "success" });
    } catch (err: any) {
      results.push({ migration: "user_type", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 8: Add is_admin column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin TEXT DEFAULT 'false'`;
      results.push({ migration: "is_admin", status: "success" });
    } catch (err: any) {
      results.push({ migration: "is_admin", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 9: Add is_suspended column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_suspended TEXT DEFAULT 'false'`;
      results.push({ migration: "is_suspended", status: "success" });
    } catch (err: any) {
      results.push({ migration: "is_suspended", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 10: Add last_login_at column if not exists
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;
      results.push({ migration: "last_login_at", status: "success" });
    } catch (err: any) {
      results.push({ migration: "last_login_at", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 11: Add deployment retry tracking - error_code
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS error_code TEXT`;
      results.push({ migration: "deployments.error_code", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.error_code", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 12: Add deployment retry tracking - retry_count
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0 NOT NULL`;
      results.push({ migration: "deployments.retry_count", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.retry_count", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 13: Add deployment retry tracking - max_retries
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3 NOT NULL`;
      results.push({ migration: "deployments.max_retries", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.max_retries", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 14: Add deployment retry tracking - is_fatal
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS is_fatal TEXT DEFAULT 'false'`;
      results.push({ migration: "deployments.is_fatal", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.is_fatal", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 15: Add deployment retry tracking - last_attempt_at
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMP WITH TIME ZONE`;
      results.push({ migration: "deployments.last_attempt_at", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.last_attempt_at", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 16: Add deployment retry tracking - build_logs
    try {
      await sql`ALTER TABLE deployments ADD COLUMN IF NOT EXISTS build_logs TEXT`;
      results.push({ migration: "deployments.build_logs", status: "success" });
    } catch (err: any) {
      results.push({ migration: "deployments.build_logs", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    // Migration 17: Create admin_accounts table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_accounts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login_at TIMESTAMP WITH TIME ZONE
        )
      `;
      results.push({ migration: "admin_accounts_table", status: "success" });
    } catch (err: any) {
      results.push({ migration: "admin_accounts_table", status: err.message?.includes("already exists") ? "skipped" : "error", error: err.message });
    }

    return NextResponse.json({
      success: true,
      message: "Migrations completed",
      results,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    );
  }
}

// GET /api/migrate - Check migration status
export async function GET() {
  try {
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: "Database URL not configured" }, { status: 500 });
    }

    const sql = neon(dbUrl);

    // Check which columns exist
    const result = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      columns: result,
    });
  } catch (error) {
    console.error("Check error:", error);
    return NextResponse.json(
      { error: "Check failed" },
      { status: 500 }
    );
  }
}
