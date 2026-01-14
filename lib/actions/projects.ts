"use server";

import { db } from "@/lib/db";
import { projects, users, deployments, PLAN_LIMITS } from "@/lib/schema";
import { requireWhopUser, getWhopUser, type WhopUser } from "@/lib/whop";
import { eq, and, sql } from "drizzle-orm";
import { generateId, defaultPage, type LandingPage, type ProjectSettings } from "@/lib/page-schema";
import { getTemplateByIdOrDefault } from "@/lib/templates";
import { generateLandingPage } from "@/lib/claude";
import { revalidatePath } from "next/cache";
import { generateNextJsProject } from "@/lib/nextjs-project-generator";

export type Project = {
  id: string;
  name: string;
  slug: string;
  liveUrl: string | null;
  isPublished: string | null;
  updatedAt: Date | null;
  pageData: {
    title: string;
    colorScheme: {
      primary: string;
      background: string;
    };
  } | null;
};

export type DashboardUser = {
  whop: WhopUser | null;
  internal: {
    id: string;
    plan: string;
    projectCount: number;
    deployCount: number;
    email: string | null;
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

/**
 * Get current user for dashboard display
 */
export async function getDashboardUser(): Promise<DashboardUser> {
  try {
    const whopUser = await getWhopUser();

    if (!whopUser) {
      return { whop: null, internal: null };
    }

    // Get internal user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    return {
      whop: whopUser,
      internal: userData ? {
        id: userData.id,
        plan: userData.plan,
        projectCount: userData.projectCount,
        deployCount: userData.deployCount,
        email: userData.email,
        username: userData.username,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
      } : null,
    };
  } catch (error) {
    console.error("[Projects] getDashboardUser error:", error);
    return { whop: null, internal: null };
  }
}

/**
 * Get all projects for the current user
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const user = await requireWhopUser();

    // Get user from DB to get the correct UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return [];
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userData.id))
      .orderBy(sql`${projects.updatedAt} DESC`);

    return userProjects.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      liveUrl: p.liveUrl,
      isPublished: p.isPublished ?? "false",
      updatedAt: p.updatedAt ?? new Date(),
      pageData: (p.pageData as Project["pageData"]) ?? null,
    }));
  } catch (error) {
    console.error("[Projects] getProjects error:", error);
    return [];
  }
}

/**
 * Create a new project
 */
export async function createProject(data: {
  name: string;
  templateId?: string;
  aiPrompt?: string;
}): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    const user = await requireWhopUser();
    const { name, templateId, aiPrompt } = data;

    if (!name) {
      return { success: false, error: "Project name is required" };
    }

    // Get or create user in DB
    let [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

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

    // Check plan limits
    const planLimits = PLAN_LIMITS[userData.plan];
    if (planLimits.projects !== -1 && userData.projectCount >= planLimits.projects) {
      return {
        success: false,
        error: `Your ${userData.plan} plan allows ${planLimits.projects} project(s). Upgrade to create more.`,
      };
    }

    // Generate a unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${generateId()}`;

    // Determine page data
    let pageData;

    if (aiPrompt) {
      try {
        pageData = await generateLandingPage(aiPrompt);
        pageData.title = name;
      } catch (aiError) {
        console.error("AI generation failed:", aiError);
        pageData = { ...getTemplateByIdOrDefault("skinny"), title: name };
      }
    } else if (templateId === "blank") {
      pageData = { ...defaultPage, title: name };
    } else {
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

    revalidatePath("/dashboard");

    return { success: true, projectId: newProject.id };
  } catch (error) {
    console.error("[Projects] createProject error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to create project" };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Verify project belongs to user
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    if (project.userId !== userData.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete the project
    await db.delete(projects).where(eq(projects.id, projectId));

    // Update user's project count
    await db
      .update(users)
      .set({ projectCount: sql`GREATEST(${users.projectCount} - 1, 0)` })
      .where(eq(users.whopId, user.id));

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[Projects] deleteProject error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to delete project" };
  }
}

// Full project type for editor
export type FullProject = {
  id: string;
  name: string;
  slug: string;
  liveUrl: string | null;
  isPublished: string | null;
  netlifyId: string | null;
  netlifySiteName: string | null;
  pageData: LandingPage | null;
  settings: ProjectSettings | null;
  updatedAt: Date | null;
  createdAt: Date | null;
};

/**
 * Get a single project by ID
 */
export async function getProject(projectId: string): Promise<{ success: boolean; project?: FullProject; error?: string }> {
  try {
    const user = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Get project with ownership check
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    return {
      success: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        liveUrl: project.liveUrl,
        isPublished: project.isPublished,
        netlifyId: project.netlifyId,
        netlifySiteName: project.netlifySiteName,
        pageData: project.pageData as LandingPage | null,
        settings: project.settings as ProjectSettings | null,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
      },
    };
  } catch (error) {
    console.error("[Projects] getProject error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to fetch project" };
  }
}

/**
 * Update a project's page data
 */
export async function updateProject(
  projectId: string,
  data: { name?: string; pageData?: LandingPage; settings?: ProjectSettings }
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updates.name = data.name;
    if (data.pageData !== undefined) updates.pageData = data.pageData;
    if (data.settings !== undefined) updates.settings = data.settings;

    await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, projectId));

    return { success: true };
  } catch (error) {
    console.error("[Projects] updateProject error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to update project" };
  }
}

// Deployment types
export type Deployment = {
  id: string;
  status: string;
  url: string | null;
  errorMessage: string | null;
  createdAt: Date | null;
};

export type DeployStatus = {
  deployments: Deployment[];
  liveUrl: string | null;
  isPublished: boolean;
  netlifyId: string | null;
  netlifySiteName: string | null;
};

/**
 * Start a deployment for a project
 */
export async function startDeploy(
  projectId: string,
  customSubdomain?: string | null
): Promise<{ success: boolean; deploymentId?: string; error?: string; message?: string }> {
  try {
    const user = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Get the project
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Check user's deploy limits
    const planLimits = PLAN_LIMITS[userData.plan];
    if (planLimits.deploys !== -1 && userData.deployCount >= planLimits.deploys) {
      return {
        success: false,
        error: "Deploy limit reached",
        message: `Your ${userData.plan} plan allows ${planLimits.deploys} deploys. Upgrade to deploy more.`,
      };
    }

    // Create a pending deployment record
    const [deployment] = await db
      .insert(deployments)
      .values({
        projectId,
        status: "pending",
      })
      .returning();

    // Determine if tracking should be enabled (Free tier only)
    const trackingEnabled = planLimits.trackingEnabled;
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://launchpad.whop.com";

    // Generate project files
    const projectFiles = generateNextJsProject(
      project.pageData as LandingPage,
      (project.settings as ProjectSettings) || undefined,
      undefined,
      trackingEnabled ? {
        enabled: true,
        projectId,
        apiUrl: siteUrl,
      } : undefined
    );

    // Trigger background function
    try {
      fetch(`${siteUrl}/.netlify/functions/deploy-background`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          deploymentId: deployment.id,
          customSubdomain,
          userId: userData.id,
          projectFiles,
          slug: project.slug,
          netlifyId: project.netlifyId,
        }),
      }).catch((err) => {
        console.error("Failed to trigger background function:", err);
      });
    } catch (triggerError) {
      console.error("Error triggering background deploy:", triggerError);
    }

    return {
      success: true,
      deploymentId: deployment.id,
      message: "Deployment started. Building your site...",
    };
  } catch (error) {
    console.error("[Projects] startDeploy error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to start deployment" };
  }
}

/**
 * Get deployment status for a project
 */
export async function getDeployStatus(projectId: string): Promise<{ success: boolean; data?: DeployStatus; error?: string }> {
  try {
    const user = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Verify project ownership
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Get latest deployments
    const projectDeployments = await db
      .select()
      .from(deployments)
      .where(eq(deployments.projectId, projectId))
      .orderBy(sql`${deployments.createdAt} DESC`)
      .limit(10);

    return {
      success: true,
      data: {
        deployments: projectDeployments.map(d => ({
          id: d.id,
          status: d.status,
          url: d.url,
          errorMessage: d.errorMessage,
          createdAt: d.createdAt,
        })),
        liveUrl: project.liveUrl,
        isPublished: project.isPublished === "true",
        netlifyId: project.netlifyId,
        netlifySiteName: project.netlifySiteName,
      },
    };
  } catch (error) {
    console.error("[Projects] getDeployStatus error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to fetch deployments" };
  }
}
