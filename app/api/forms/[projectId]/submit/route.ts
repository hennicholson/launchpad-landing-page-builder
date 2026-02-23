import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formSubmissions, projects, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { PLAN_LIMITS } from "@/lib/schema";

export const runtime = "edge";

// CORS headers for cross-origin requests from deployed pages
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const data = await request.json();

    const { email, fields, sectionId, sectionType, sourceUrl, referrer, sessionId } = data;

    // Validate at least an email is provided
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify project exists
    const project = await db
      .select({ id: projects.id, userId: projects.userId })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check if user's plan allows form collection
    const user = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, project[0].userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const planLimits = PLAN_LIMITS[user[0].plan];
    if (!planLimits.canCollectForms) {
      // Graceful degradation - accept but don't store
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    // Get country from headers
    const country =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      null;

    const userAgent = request.headers.get("user-agent") || null;

    // Insert form submission
    await db.insert(formSubmissions).values({
      projectId,
      email,
      fields: fields || null,
      sectionId: sectionId || null,
      sectionType: sectionType || null,
      sourceUrl: sourceUrl || null,
      referrer: referrer || null,
      userAgent,
      ipCountry: country,
      sessionId: sessionId || null,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("[Form Submit] Error:", error);
    // Return success anyway to not break user experience on deployed pages
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  }
}
