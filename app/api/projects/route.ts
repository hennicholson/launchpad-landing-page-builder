import { NextRequest, NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { projects, users, PLAN_LIMITS } from "@/lib/schema";
import { requireWhopUser } from "@/lib/whop";
import { eq, sql } from "drizzle-orm";
import { generateId, defaultPage } from "@/lib/page-schema";
import { getTemplateByIdOrDefault } from "@/lib/templates";
import { generateLandingPage } from "@/lib/claude";

export const runtime = "nodejs";

// GET /api/projects - List all projects for the current user
export async function GET() {
  try {
    // Detailed auth logging
    const headersList = await headers();
    const cookieStore = await cookies();

    // Log ALL headers to see what Whop proxy is forwarding
    const allHeadersObj = Object.fromEntries([...headersList.entries()]);
    console.log("[Projects API GET] ALL HEADERS:", JSON.stringify(allHeadersObj, null, 2));

    console.log("[Projects API GET] Auth debug:", {
      hasWhopToken: !!headersList.get("x-whop-user-token"),
      hasWhopUserId: !!headersList.get("x-whop-user-id"),
      hasCookieToken: !!cookieStore.get("whop_user_token")?.value,
      hasCookieUserId: !!cookieStore.get("whop_user_id")?.value,
      tokenLength: headersList.get("x-whop-user-token")?.length || 0,
    });

    const user = await requireWhopUser();
    console.log("[Projects API GET] Got user:", user?.username, user?.id);

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
      // Handle auth errors
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

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Detailed auth logging
    const headersList = await headers();
    const cookieStore = await cookies();
    console.log("[Projects API POST] Auth debug:", {
      hasWhopToken: !!headersList.get("x-whop-user-token"),
      hasWhopUserId: !!headersList.get("x-whop-user-id"),
      hasCookieToken: !!cookieStore.get("whop_user_token")?.value,
      hasCookieUserId: !!cookieStore.get("whop_user_id")?.value,
    });

    const user = await requireWhopUser();
    console.log("[Projects API POST] Got user:", user?.username, user?.id);

    const body = await request.json();
    const { name, templateId, aiPrompt } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Check user's plan limits
    let [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    // If user doesn't exist in DB yet, create them
    if (!userData) {
      [userData] = await db
        .insert(users)
        .values({
          whopId: user.id,
          whopUniqueId: user.unique_id,
          email: user.email,
          username: user.username,
          name: user.name,
          bio: user.bio,
          avatarUrl: user.profile_pic_url,
          bannerUrl: user.banner_url,
          userType: user.user_type,
          isSuspended: user.is_suspended ? "true" : "false",
        })
        .returning();
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
      .where(eq(users.whopId, user.id));

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
