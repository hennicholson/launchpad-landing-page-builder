import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { projects, users, PLAN_LIMITS } from "@/lib/schema";
import { requireWhopUser, verifyTokenSimple, generateUUIDFromString } from "@/lib/whop";
import { eq, sql } from "drizzle-orm";
import { generateId, defaultPage } from "@/lib/page-schema";
import { getTemplateByIdOrDefault } from "@/lib/templates";
import { generateLandingPage } from "@/lib/claude";

export const runtime = "nodejs";

// GET /api/users/projects - List all projects for the current user
export async function GET() {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();

    console.log("[Users/Projects API GET] Auth debug:", {
      hasWhopToken: !!headersList.get("x-whop-user-token"),
      hasWhopUserId: !!headersList.get("x-whop-user-id"),
      hasCookieToken: !!cookieStore.get("whop_user_token")?.value,
      hasCookieUserId: !!cookieStore.get("whop_user_id")?.value,
      tokenLength: headersList.get("x-whop-user-token")?.length || 0,
    });

    // Use the official SDK-based authentication
    const user = await requireWhopUser();
    console.log("[Users/Projects API GET] Got user:", user?.username, user?.id);

    // Get user from DB to get the correct UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ projects: [] });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userData.id))
      .orderBy(sql`${projects.updatedAt} DESC`);

    return NextResponse.json({ projects: userProjects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    if (error instanceof Error) {
      if (error.message === "Unauthorized" || error.message.includes("Missing x-whop-user-token")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/users/projects - List or create projects
// If body contains only `token`, list projects (client-side auth)
// If body contains `name` + `token`, create project (client-side auth)
// If body contains `name` only, create project (header/cookie auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, templateId, aiPrompt, token } = body;

    let userId: string;
    let userEmail: string | null = null;
    let userName: string | null = null;
    let whopUniqueId: string | null = null;

    // If token provided in body, use SIMPLE verification (no API calls)
    if (token) {
      console.log("[Users/Projects API POST] Using simple token verification");
      console.log("[Users/Projects API POST] Token length:", token.length);
      console.log("[Users/Projects API POST] Token preview:", token.substring(0, 50) + "...");

      const verified = verifyTokenSimple(token);
      console.log("[Users/Projects API POST] Verification result:", JSON.stringify(verified));

      if (!verified) {
        console.log("[Users/Projects API POST] Token verification failed - verified is null");
        return NextResponse.json({ error: "Invalid token", projects: [] }, { status: 401 });
      }

      if (!verified.userId) {
        console.log("[Users/Projects API POST] Token verification failed - no userId");
        return NextResponse.json({ error: "No user ID in token", projects: [] }, { status: 401 });
      }

      userId = generateUUIDFromString(verified.userId);
      userEmail = verified.email;
      userName = verified.name;
      whopUniqueId = verified.userId;
      console.log("[Users/Projects API POST] Verified user:", verified.userId, "UUID:", userId);
    } else {
      // Fall back to header/cookie auth
      const headersList = await headers();
      const cookieStore = await cookies();
      console.log("[Users/Projects API POST] Auth debug:", {
        hasWhopToken: !!headersList.get("x-whop-user-token"),
        hasWhopUserId: !!headersList.get("x-whop-user-id"),
        hasCookieToken: !!cookieStore.get("whop_user_token")?.value,
        hasCookieUserId: !!cookieStore.get("whop_user_id")?.value,
      });
      const user = await requireWhopUser();
      userId = user.id;
      userEmail = user.email || null;
      userName = user.name || user.username || null;
      whopUniqueId = user.unique_id || null;
      console.log("[Users/Projects API POST] Got user from headers:", user?.username, userId);
    }

    // If no name provided, this is a LIST request
    if (!name) {
      console.log("[Users/Projects API POST] Listing projects for user:", userId);

      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.whopId, userId))
        .limit(1);

      if (!userData) {
        console.log("[Users/Projects API POST] User not found in DB, returning empty projects");
        return NextResponse.json({ projects: [] });
      }

      const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userData.id))
        .orderBy(sql`${projects.updatedAt} DESC`);

      console.log("[Users/Projects API POST] Found", userProjects.length, "projects");
      return NextResponse.json({ projects: userProjects });
    }

    // Otherwise, CREATE a new project
    console.log("[Users/Projects API POST] Creating project:", name);

    // Check user's plan limits
    let [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, userId))
      .limit(1);

    // If user doesn't exist in DB yet, create them
    if (!userData) {
      console.log("[Users/Projects API POST] Creating new user in DB:", userId);
      [userData] = await db
        .insert(users)
        .values({
          whopId: userId,
          whopUniqueId: whopUniqueId,
          email: userEmail,
          name: userName,
        })
        .returning();
      console.log("[Users/Projects API POST] Created user:", userData.id);
    }

    const planLimits = PLAN_LIMITS[userData.plan];
    if (planLimits.projects !== -1 && userData.projectCount >= planLimits.projects) {
      return NextResponse.json(
        {
          error: "Project limit reached",
          message: `Your ${userData.plan} plan allows ${planLimits.projects} project(s). Upgrade to create more.`,
        },
        { status: 403 }
      );
    }

    // Generate a unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${generateId()}`;

    // Determine page data based on creation method
    let pageData;

    if (aiPrompt) {
      // Generate with AI
      try {
        pageData = await generateLandingPage(aiPrompt);
        pageData.title = name;
      } catch (aiError) {
        console.error("AI generation failed:", aiError);
        // Fall back to default template if AI fails
        pageData = { ...getTemplateByIdOrDefault("skinny"), title: name };
      }
    } else if (templateId === "blank") {
      // Blank template
      pageData = { ...defaultPage, title: name };
    } else {
      // Use specified template or default to skinny
      pageData = { ...getTemplateByIdOrDefault(templateId || "skinny"), title: name };
    }

    // Create the project
    const [newProject] = await db
      .insert(projects)
      .values({
        userId: userData.id,
        name,
        slug,
        pageData,
      })
      .returning();

    // Update user's project count
    await db
      .update(users)
      .set({ projectCount: sql`${users.projectCount} + 1` })
      .where(eq(users.whopId, userId));

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
