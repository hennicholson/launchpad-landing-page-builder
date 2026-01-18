import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, deployments, users, PLAN_LIMITS } from "@/lib/schema";
import { requireWhopUser } from "@/lib/whop";
import { eq, and, sql } from "drizzle-orm";
import { generateNextJsProject } from "@/lib/nextjs-project-generator";
import type { LandingPage, ProjectSettings } from "@/lib/page-schema";

type Params = Promise<{ id: string }>;

// POST /api/users/deploy/[id] - Start deployment (triggers background function)
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;

    // Parse request body for custom subdomain
    let customSubdomain: string | null = null;
    try {
      const body = await request.json();
      customSubdomain = body.subdomain || null;
    } catch {
      // No body or invalid JSON, use default
    }

    // Get user's database UUID first
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the project
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check user's deploy limits
    const planLimits = PLAN_LIMITS[userData.plan];
    if (planLimits.deploys !== -1 && userData.deployCount >= planLimits.deploys) {
      return NextResponse.json(
        {
          error: "Deploy limit reached",
          message: `Your ${userData.plan} plan allows ${planLimits.deploys} deploys. Upgrade to deploy more.`,
        },
        { status: 403 }
      );
    }

    // Create a pending deployment record
    const [deployment] = await db
      .insert(deployments)
      .values({
        projectId: id,
        status: "pending",
      })
      .returning();

    // Determine if tracking should be enabled (Free tier only)
    const trackingEnabled = planLimits.trackingEnabled;

    // Get the site URL for triggering the background function
    // Priority: Netlify env vars > NEXT_PUBLIC_APP_URL > fallback
    let siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;
    if (!siteUrl) {
      // Check if we're in local dev
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (appUrl?.includes("localhost")) {
        // Local dev - need to use netlify dev or the production URL
        console.warn("[Deploy] Running locally - background functions require 'netlify dev' or will use production");
        siteUrl = "https://launchpad-builder.netlify.app"; // Production fallback (must use .netlify.app for functions)
      } else {
        siteUrl = appUrl || "https://launchpad-builder.netlify.app";
      }
    }

    // Generate project files here (where we have filesystem access for shared components)
    const projectFiles = generateNextJsProject(
      project.pageData as LandingPage,
      (project.settings as ProjectSettings) || undefined,
      undefined, // siteUrl for SEO - will be set after deploy
      trackingEnabled ? {
        enabled: true,
        projectId: id,
        apiUrl: siteUrl,
      } : undefined
    );

    // Trigger background function to handle the actual build/deploy
    // This runs asynchronously for up to 15 minutes
    const functionUrl = `${siteUrl}/.netlify/functions/deploy-background`;
    console.log(`[Deploy] Triggering background function at: ${functionUrl}`);
    console.log(`[Deploy] Project: ${project.slug}, Deployment: ${deployment.id}`);

    try {
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          deploymentId: deployment.id,
          customSubdomain,
          userId: userData.id,
          projectFiles, // Pre-generated files (generator needs filesystem access)
          slug: project.slug,
          netlifyId: project.netlifyId,
        }),
      });

      // For background functions, Netlify returns 202 Accepted
      if (!response.ok && response.status !== 202) {
        const errorText = await response.text();
        console.error(`[Deploy] Background function returned ${response.status}: ${errorText}`);
        // Update deployment to failed
        await db.update(deployments).set({
          status: "failed",
          errorMessage: `Failed to trigger build: ${response.status}`,
          errorCode: "TRIGGER_FAILED",
        }).where(eq(deployments.id, deployment.id));
      } else {
        console.log(`[Deploy] Background function triggered successfully (status: ${response.status})`);
      }
    } catch (triggerError) {
      console.error("[Deploy] Error triggering background deploy:", triggerError);
      // Update deployment to failed so user sees error instead of infinite pending
      await db.update(deployments).set({
        status: "failed",
        errorMessage: triggerError instanceof Error ? triggerError.message : "Failed to start build",
        errorCode: "TRIGGER_ERROR",
      }).where(eq(deployments.id, deployment.id));
    }

    // Return immediately - client will poll GET /api/users/deploy/[id] for status
    return NextResponse.json({
      success: true,
      deploymentId: deployment.id,
      status: "pending",
      message: "Deployment started. Building your site...",
    });
  } catch (error) {
    console.error("Error starting deployment:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to start deployment" },
      { status: 500 }
    );
  }
}

// GET /api/users/deploy/[id] - Get deployment status
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project ownership
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get latest deployment
    const projectDeployments = await db
      .select()
      .from(deployments)
      .where(eq(deployments.projectId, id))
      .orderBy(sql`${deployments.createdAt} DESC`)
      .limit(10);

    return NextResponse.json({
      deployments: projectDeployments,
      liveUrl: project.liveUrl,
      isPublished: project.isPublished === "true",
      netlifyId: project.netlifyId,
      netlifySiteName: project.netlifySiteName,
    });
  } catch (error) {
    console.error("Error fetching deployments:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}
