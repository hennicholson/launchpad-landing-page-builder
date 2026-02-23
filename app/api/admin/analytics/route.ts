/**
 * Admin Analytics API Route
 *
 * GET /api/admin/analytics?view=overview|users|revenue
 * Requires admin session authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getAnalyticsOverview,
  getAnalyticsUsers,
  getRevenueData,
} from "@/lib/actions/admin-analytics";

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "overview";

    switch (view) {
      case "overview": {
        const overview = await getAnalyticsOverview();
        return NextResponse.json(overview);
      }

      case "users": {
        const result = await getAnalyticsUsers({
          plan: searchParams.get("plan") || undefined,
          search: searchParams.get("search") || undefined,
          sort: searchParams.get("sort") || undefined,
          order: (searchParams.get("order") as "asc" | "desc") || "desc",
          limit: parseInt(searchParams.get("limit") || "50"),
          offset: parseInt(searchParams.get("offset") || "0"),
        });
        return NextResponse.json(result);
      }

      case "revenue": {
        const limit = parseInt(searchParams.get("limit") || "50");
        const revenue = await getRevenueData(limit);
        return NextResponse.json(revenue);
      }

      default:
        return NextResponse.json({ error: "Invalid view parameter" }, { status: 400 });
    }
  } catch (error) {
    console.error("[API /admin/analytics] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
