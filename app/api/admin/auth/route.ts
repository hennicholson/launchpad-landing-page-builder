import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdmin,
  verifyAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(username, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

// GET /api/admin/auth - Check session
export async function GET() {
  try {
    const session = await verifyAdminSession();
    return NextResponse.json(session);
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
