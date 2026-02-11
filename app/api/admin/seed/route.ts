import { NextRequest, NextResponse } from "next/server";
import { upsertAdminAccount } from "@/lib/admin-auth";

// POST /api/admin/seed - Create/update admin account
// Protected by a secret key to prevent unauthorized access
export async function POST(request: NextRequest) {
  try {
    const { username, password, secretKey } = await request.json();

    // Require secret key for seeding (prevents unauthorized account creation)
    const expectedSecret = process.env.ADMIN_SEED_SECRET;
    if (!expectedSecret) {
      return NextResponse.json({ error: "Seed endpoint not configured" }, { status: 503 });
    }
    if (secretKey !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 403 }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const result = await upsertAdminAccount(username, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create admin" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin account '${username}' created/updated successfully`
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed" },
      { status: 500 }
    );
  }
}
