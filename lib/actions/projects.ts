"use server";

import { db } from "@/lib/db";
import { projects, users, deployments, PLAN_LIMITS } from "@/lib/schema";
import { requireWhopUser, getWhopUser, type WhopUser } from "@/lib/whop";
import { eq, and, sql } from "drizzle-orm";
import { generateId, defaultPage, type LandingPage, type ProjectSettings } from "@/lib/page-schema";
import { getTemplateByIdOrDefault } from "@/lib/templates";
import { generateLandingPage } from "@/lib/claude";
import { revalidatePath } from "next/cache";
import {
  deleteSite,
  addUserCustomDomain,
  removeUserCustomDomain,
  getNetlifyTarget,
  checkDomainSsl,
  setupNetlifyDns,
  deleteDnsZone,
  checkNameserverStatus,
  removeDomainFromMainSite,
} from "@/lib/netlify";
import {
  validateDomainFormat,
  getDomainType,
  generateVerificationToken,
  getDnsInstructions,
  verifyDomainOwnership,
  type DnsInstruction,
} from "@/lib/domain-verification";
import type { DomainStatus, DomainType } from "@/lib/schema";

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
    balanceCents: number;
    email: string | null;
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
  } | null;
};

/**
 * Get current user for dashboard display
 * Creates user in DB if authenticated via Whop but not yet in our database
 */
export async function getDashboardUser(): Promise<DashboardUser> {
  try {
    const whopUser = await getWhopUser();

    if (!whopUser) {
      return { whop: null, internal: null };
    }

    // Get internal user from DB
    let [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    // CREATE USER IF NOT EXISTS - this is the key fix
    if (!userData) {
      console.log("[getDashboardUser] User authenticated but not in DB, creating:", whopUser.id);

      try {
        [userData] = await db
          .insert(users)
          .values({
            whopId: whopUser.id,
            whopUniqueId: whopUser.unique_id,
            email: whopUser.email,
            username: whopUser.username,
            name: whopUser.name,
            bio: whopUser.bio,
            avatarUrl: whopUser.profile_pic_url,
            bannerUrl: whopUser.banner_url,
            userType: whopUser.user_type,
            isSuspended: whopUser.is_suspended ? "true" : "false",
            plan: "free",
            balanceCents: 0,
          })
          .returning();
        console.log("[getDashboardUser] User created successfully:", userData.id);
      } catch (insertError) {
        // Handle race condition where user was created between select and insert
        console.error("[getDashboardUser] Insert error (might be race condition):", insertError);

        // Try to fetch again
        [userData] = await db
          .select()
          .from(users)
          .where(eq(users.whopId, whopUser.id))
          .limit(1);
      }
    }

    return {
      whop: whopUser,
      internal: userData ? {
        id: userData.id,
        plan: userData.plan,
        projectCount: userData.projectCount,
        deployCount: userData.deployCount,
        balanceCents: userData.balanceCents,
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
 * Wizard data for AI page generation
 */
export interface WizardData {
  businessName: string;
  productDescription: string;
  targetAudience: string;
  colorTheme: "dark" | "light" | "midnight" | "forest" | "ocean" | "sunset" | "custom";
  vibe: "modern" | "minimal" | "bold" | "professional" | "playful" | "elegant" | "techy";
  fontPair: "anton-inter" | "playfair-inter" | "space-grotesk-inter" | "poppins-inter" | "inter-inter";
  pageType: "landing" | "sales-funnel" | "product" | "lead-magnet" | "auto";
}

/**
 * Build an enhanced prompt from wizard data
 */
function buildPromptFromWizard(wizardData: WizardData, additionalPrompt?: string): string {
  const fontNames: Record<string, string> = {
    "anton-inter": "Anton + Inter (Bold & Modern)",
    "playfair-inter": "Playfair Display + Inter (Elegant & Classic)",
    "space-grotesk-inter": "Space Grotesk + Inter (Tech & Clean)",
    "poppins-inter": "Poppins + Inter (Friendly & Rounded)",
    "inter-inter": "Inter (Clean & Professional)",
  };

  const pageTypeDescriptions: Record<string, string> = {
    landing: "standard landing page (hero → features → testimonials → pricing → cta)",
    "sales-funnel": "sales funnel (hero with urgency → value-prop → offer → testimonials → final CTA)",
    product: "product page (hero → features → gallery → pricing → faq)",
    "lead-magnet": "lead magnet page (hero → benefits → form → testimonials)",
    auto: "appropriate page structure based on the product/service",
  };

  return `Generate a ${pageTypeDescriptions[wizardData.pageType] || "landing page"} for:

BUSINESS: ${wizardData.businessName}
PRODUCT/SERVICE: ${wizardData.productDescription}
${wizardData.targetAudience ? `TARGET AUDIENCE: ${wizardData.targetAudience}` : ""}

STYLE REQUIREMENTS:
- Design Vibe: ${wizardData.vibe} (${getVibeDescription(wizardData.vibe)})
- Color Theme: ${wizardData.colorTheme} mode
- Typography: ${fontNames[wizardData.fontPair] || wizardData.fontPair}

${additionalPrompt ? `ADDITIONAL CONTEXT: ${additionalPrompt}` : ""}

Write compelling copy that speaks directly to the target audience. Use the specified style and tone throughout.`;
}

function getVibeDescription(vibe: string): string {
  const descriptions: Record<string, string> = {
    modern: "clean lines, contemporary feel, cutting-edge",
    minimal: "lots of whitespace, simple, focused",
    bold: "strong contrasts, impactful, attention-grabbing",
    professional: "trustworthy, authoritative, business-focused",
    playful: "fun, creative, energetic",
    elegant: "sophisticated, refined, premium feel",
    techy: "futuristic, innovative, tech-forward",
  };
  return descriptions[vibe] || vibe;
}

/**
 * Create a new project
 *
 * For AI generation, pass pre-generated pageData from /api/ai/page endpoint.
 * This avoids server action timeout issues since the API route has a longer timeout.
 */
export async function createProject(data: {
  name: string;
  templateId?: string;
  aiPrompt?: string;
  wizardData?: WizardData;
  pageData?: LandingPage; // Pre-generated page data from /api/ai/page
}): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    const user = await requireWhopUser();
    const { name, templateId, aiPrompt, wizardData, pageData: preGeneratedPage } = data;

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

    if (preGeneratedPage) {
      // Use pre-generated page data (from /api/ai/page endpoint)
      // This is the recommended path for AI generation to avoid server action timeout
      pageData = { ...preGeneratedPage, title: name };
    } else if (aiPrompt || wizardData) {
      // Legacy path: generate directly in server action
      // Warning: This may timeout on Netlify due to server action limits
      try {
        const enhancedPrompt = wizardData
          ? buildPromptFromWizard(wizardData, aiPrompt)
          : aiPrompt!;
        pageData = await generateLandingPage(enhancedPrompt, undefined, wizardData);
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
    let newProject;
    try {
      [newProject] = await db
        .insert(projects)
        .values({
          userId: userData.id,
          name,
          slug,
          pageData,
        })
        .returning();
    } catch (insertError: unknown) {
      // Check for unique constraint violation on slug
      const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);
      if (errorMessage.includes("unique") || errorMessage.includes("duplicate") || errorMessage.includes("slug")) {
        return { success: false, error: "A project with this name already exists. Please choose a different name." };
      }
      throw insertError;
    }

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
    return { success: false, error: "Failed to create project. Please try again." };
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

    // If project has custom domain on Netlify, remove it first
    if (project.netlifyId && project.customDomain) {
      try {
        await removeUserCustomDomain(project.netlifyId, project.customDomain);
        console.log(`[Projects] Removed custom domain ${project.customDomain} from Netlify`);
      } catch (domainError) {
        console.warn(`[Projects] Failed to remove custom domain:`, domainError);
      }
    }

    // If project is deployed to Netlify, delete the site (don't block on failure)
    if (project.netlifyId) {
      try {
        await deleteSite(project.netlifyId);
        console.log(`[Projects] Deleted Netlify site: ${project.netlifyId}`);
      } catch (netlifyError) {
        // Log but don't block deletion - site might already be deleted or token invalid
        console.warn(`[Projects] Failed to delete Netlify site ${project.netlifyId}:`, netlifyError);
      }
    }

    // Delete all deployments first (foreign key constraint)
    await db.delete(deployments).where(eq(deployments.projectId, projectId));

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
 *
 * NEW APPROACH: Dynamic subdomain rendering
 * - No separate Netlify sites per user
 * - Main app serves all landing pages based on subdomain
 * - Deploy = instant DB update (mark as published, set liveUrl)
 */
export async function startDeploy(
  projectId: string,
  customSubdomain?: string | null
): Promise<{ success: boolean; url?: string; error?: string; message?: string }> {
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

    // Check user's deploy limits (first deploy counts)
    const planLimits = PLAN_LIMITS[userData.plan];
    const isFirstDeploy = project.isPublished !== "true";

    if (isFirstDeploy && planLimits.deploys !== -1 && userData.deployCount >= planLimits.deploys) {
      return {
        success: false,
        error: "Deploy limit reached",
        message: `Your ${userData.plan} plan allows ${planLimits.deploys} deploys. Upgrade to deploy more.`,
      };
    }

    // Determine the slug to use
    // Priority: customSubdomain (user-specified) > project.slug (default)
    const finalSlug = customSubdomain || project.slug;
    const liveUrl = `https://onwhop.com/s/${finalSlug}`;

    // Check if slug is already taken by another project
    if (customSubdomain) {
      const [existingProject] = await db
        .select()
        .from(projects)
        .where(and(
          eq(projects.slug, customSubdomain),
          sql`${projects.id} != ${projectId}`
        ))
        .limit(1);

      if (existingProject) {
        return {
          success: false,
          error: "URL path already taken",
          message: `The path "${customSubdomain}" is already in use. Please choose a different one.`,
        };
      }
    }

    // Update project as published with live URL
    await db
      .update(projects)
      .set({
        isPublished: "true",
        liveUrl,
        slug: finalSlug, // Update slug if custom path was provided
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    // Increment deploy count only on first publish
    if (isFirstDeploy) {
      await db
        .update(users)
        .set({ deployCount: sql`${users.deployCount} + 1` })
        .where(eq(users.id, userData.id));
    }

    // Create a deployment record for history
    await db
      .insert(deployments)
      .values({
        projectId,
        status: "ready",
        url: liveUrl,
      });

    revalidatePath("/dashboard");

    return {
      success: true,
      url: liveUrl,
      message: "Your site is live!",
    };
  } catch (error) {
    console.error("[Projects] startDeploy error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to publish site" };
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

// ============================================
// Custom Domain Management
// ============================================

export type CustomDomainConfig = {
  domain: string | null;
  status: DomainStatus | null;
  domainType: DomainType | null;
  verificationToken: string | null;
  verifiedAt: Date | null;
  addedAt: Date | null;
  error: string | null;
  dnsInstructions: DnsInstruction[];
  netlifyTarget: string | null;
  sslStatus: string | null;
  // Netlify DNS mode
  useNetlifyDns: boolean;
  netlifyDnsZoneId: string | null;
  nameservers: string[] | null;
};

/**
 * Add a custom domain to a project
 * Only available for Pro and Enterprise plans
 *
 * @param projectId - The project ID
 * @param domain - The domain to add
 * @param useNetlifyDns - If true, use Netlify DNS (user just changes nameservers)
 *                        If false, use user-managed DNS (CNAME/A records)
 */
export async function addCustomDomain(
  projectId: string,
  domain: string,
  useNetlifyDns: boolean = false
): Promise<{
  success: boolean;
  config?: CustomDomainConfig;
  error?: string;
}> {
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

    // Check plan allows custom domains
    const planLimits = PLAN_LIMITS[userData.plan];
    if (!planLimits.canUseCustomDomain) {
      return {
        success: false,
        error: `Custom domains are only available on Pro and Enterprise plans. Your current plan: ${userData.plan}`,
      };
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

    // Validate domain format
    const validation = validateDomainFormat(domain);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const normalizedDomain = validation.normalizedDomain!;

    // Check if domain is already used by another project
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.customDomain, normalizedDomain),
        sql`${projects.id} != ${projectId}`
      ))
      .limit(1);

    if (existingProject) {
      return {
        success: false,
        error: "This domain is already connected to another project.",
      };
    }

    const domainType = getDomainType(normalizedDomain);

    // Get Netlify target for CNAME instructions
    let netlifyTarget = "your-site.netlify.app";
    if (project.netlifyId) {
      try {
        netlifyTarget = await getNetlifyTarget(project.netlifyId);
      } catch {
        // Use default if we can't get the target
      }
    } else if (project.netlifySiteName) {
      netlifyTarget = `${project.netlifySiteName}.netlify.app`;
    }

    // Netlify DNS mode - create DNS zone and get nameservers
    if (useNetlifyDns) {
      try {
        const netlifySubdomain = project.netlifySiteName || project.slug;
        const dnsSetup = await setupNetlifyDns(normalizedDomain, project.netlifyId || "", netlifySubdomain);

        if (!dnsSetup.success) {
          return {
            success: false,
            error: dnsSetup.error || "Failed to set up Netlify DNS",
          };
        }

        // Update project with Netlify DNS info
        await db
          .update(projects)
          .set({
            customDomain: normalizedDomain,
            customDomainStatus: "pending" as DomainStatus,
            customDomainType: domainType,
            customDomainVerificationToken: null, // No TXT verification needed
            customDomainAddedAt: new Date(),
            customDomainVerifiedAt: null,
            customDomainError: null,
            useNetlifyDns: "true",
            netlifyDnsZoneId: dnsSetup.zoneId,
            netlifyNameservers: JSON.stringify(dnsSetup.nameservers),
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));

        return {
          success: true,
          config: {
            domain: normalizedDomain,
            status: "pending",
            domainType,
            verificationToken: null,
            verifiedAt: null,
            addedAt: new Date(),
            error: null,
            dnsInstructions: [], // No DNS instructions needed - just nameserver change
            netlifyTarget,
            sslStatus: null,
            useNetlifyDns: true,
            netlifyDnsZoneId: dnsSetup.zoneId || null,
            nameservers: dnsSetup.nameservers || null,
          },
        };
      } catch (error) {
        console.error("[Projects] Netlify DNS setup error:", error);
        return {
          success: false,
          error: "Failed to set up Netlify DNS. Please try again.",
        };
      }
    }

    // User-managed DNS mode - generate verification token
    const verificationToken = generateVerificationToken();

    // Get DNS instructions
    const dnsInstructions = getDnsInstructions(normalizedDomain, netlifyTarget, verificationToken);

    // Update project with domain info
    await db
      .update(projects)
      .set({
        customDomain: normalizedDomain,
        customDomainStatus: "pending" as DomainStatus,
        customDomainType: domainType,
        customDomainVerificationToken: verificationToken,
        customDomainAddedAt: new Date(),
        customDomainVerifiedAt: null,
        customDomainError: null,
        useNetlifyDns: "false",
        netlifyDnsZoneId: null,
        netlifyNameservers: null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    return {
      success: true,
      config: {
        domain: normalizedDomain,
        status: "pending",
        domainType,
        verificationToken,
        verifiedAt: null,
        addedAt: new Date(),
        error: null,
        dnsInstructions,
        netlifyTarget,
        sslStatus: null,
        useNetlifyDns: false,
        netlifyDnsZoneId: null,
        nameservers: null,
      },
    };
  } catch (error) {
    console.error("[Projects] addCustomDomain error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to add custom domain" };
  }
}

/**
 * Verify domain ownership
 * - For user-managed DNS: Check DNS TXT record
 * - For Netlify DNS: Check nameserver propagation
 */
export async function verifyCustomDomain(
  projectId: string
): Promise<{
  success: boolean;
  verified?: boolean;
  status?: DomainStatus;
  sslStatus?: string;
  error?: string;
}> {
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

    if (!project.customDomain) {
      return { success: false, error: "No custom domain configured" };
    }

    // Update status to verifying
    await db
      .update(projects)
      .set({
        customDomainStatus: "verifying" as DomainStatus,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    const isNetlifyDns = project.useNetlifyDns === "true";

    // Netlify DNS mode - check nameserver propagation
    if (isNetlifyDns && project.netlifyDnsZoneId) {
      const nsCheck = await checkNameserverStatus(project.netlifyDnsZoneId);

      if (!nsCheck.success) {
        await db
          .update(projects)
          .set({
            customDomainStatus: "pending" as DomainStatus,
            customDomainError: nsCheck.error || "Failed to check nameserver status",
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));

        return {
          success: true,
          verified: false,
          status: "pending",
          error: nsCheck.error || "Failed to check nameserver status",
        };
      }

      if (!nsCheck.verified) {
        await db
          .update(projects)
          .set({
            customDomainStatus: "pending" as DomainStatus,
            customDomainError: "Nameservers not yet propagated. This can take up to 48 hours.",
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));

        return {
          success: true,
          verified: false,
          status: "pending",
          error: "Nameservers not yet propagated. This can take up to 48 hours.",
        };
      }

      // Nameservers verified! Domain is now active via Netlify DNS
      await db
        .update(projects)
        .set({
          customDomainStatus: "active" as DomainStatus,
          customDomainVerifiedAt: new Date(),
          customDomainError: null,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      return {
        success: true,
        verified: true,
        status: "active",
        sslStatus: "ready", // Netlify handles SSL automatically with DNS
      };
    }

    // User-managed DNS mode - check TXT record
    if (!project.customDomainVerificationToken) {
      return { success: false, error: "No verification token found" };
    }

    const verification = await verifyDomainOwnership(
      project.customDomain,
      project.customDomainVerificationToken
    );

    if (!verification.verified) {
      // Update status back to pending with error
      await db
        .update(projects)
        .set({
          customDomainStatus: "pending" as DomainStatus,
          customDomainError: verification.error,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      return {
        success: true,
        verified: false,
        status: "pending",
        error: verification.error,
      };
    }

    // Domain verified! Now add to Netlify
    await db
      .update(projects)
      .set({
        customDomainStatus: "provisioning" as DomainStatus,
        customDomainVerifiedAt: new Date(),
        customDomainError: null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    // Add domain to Netlify site
    if (project.netlifyId) {
      const netlifyResult = await addUserCustomDomain(project.netlifyId, project.customDomain);

      if (!netlifyResult.success) {
        await db
          .update(projects)
          .set({
            customDomainStatus: "failed" as DomainStatus,
            customDomainError: netlifyResult.error,
            updatedAt: new Date(),
          })
          .where(eq(projects.id, projectId));

        return {
          success: true,
          verified: true,
          status: "failed",
          error: `Domain verified but failed to add to hosting: ${netlifyResult.error}`,
        };
      }

      // Check SSL status
      const sslCheck = await checkDomainSsl(project.netlifyId, project.customDomain);

      // Update to active
      await db
        .update(projects)
        .set({
          customDomainStatus: "active" as DomainStatus,
          customDomainError: null,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      return {
        success: true,
        verified: true,
        status: "active",
        sslStatus: sslCheck.status,
      };
    } else {
      // No Netlify site yet - mark as verified but note it needs deployment
      await db
        .update(projects)
        .set({
          customDomainStatus: "active" as DomainStatus,
          customDomainError: "Domain verified. Deploy your site to activate the custom domain.",
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId));

      return {
        success: true,
        verified: true,
        status: "active",
        error: "Domain verified. Deploy your site to activate the custom domain.",
      };
    }
  } catch (error) {
    console.error("[Projects] verifyCustomDomain error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to verify domain" };
  }
}

/**
 * Remove custom domain from a project
 */
export async function removeCustomDomain(
  projectId: string
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

    // Get the project
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // If using Netlify DNS, delete the DNS zone and remove from main site
    if (project.useNetlifyDns === "true") {
      // Delete DNS zone
      if (project.netlifyDnsZoneId) {
        try {
          await deleteDnsZone(project.netlifyDnsZoneId);
          console.log(`[Projects] Deleted Netlify DNS zone: ${project.netlifyDnsZoneId}`);
        } catch (zoneError) {
          console.warn(`[Projects] Failed to delete DNS zone:`, zoneError);
        }
      }

      // Remove domain alias from main site
      if (project.customDomain) {
        const result = await removeDomainFromMainSite(project.customDomain);
        if (!result.success) {
          console.warn(`[Projects] Failed to remove domain from main site: ${result.error}`);
        }
      }
    }

    // Remove from per-project Netlify site if deployed (for user-managed DNS mode)
    if (project.netlifyId && project.customDomain && project.useNetlifyDns !== "true") {
      const result = await removeUserCustomDomain(project.netlifyId, project.customDomain);
      if (!result.success) {
        console.warn(`[Projects] Failed to remove domain from Netlify: ${result.error}`);
      }
    }

    // Clear all domain fields in database
    await db
      .update(projects)
      .set({
        customDomain: null,
        customDomainStatus: null,
        customDomainType: null,
        customDomainVerificationToken: null,
        customDomainVerifiedAt: null,
        customDomainAddedAt: null,
        customDomainError: null,
        useNetlifyDns: "false",
        netlifyDnsZoneId: null,
        netlifyNameservers: null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    return { success: true };
  } catch (error) {
    console.error("[Projects] removeCustomDomain error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to remove domain" };
  }
}

/**
 * Get custom domain configuration for a project
 */
export async function getCustomDomainStatus(
  projectId: string
): Promise<{
  success: boolean;
  config?: CustomDomainConfig;
  canUseCustomDomain?: boolean;
  error?: string;
}> {
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

    // Check plan allows custom domains
    const planLimits = PLAN_LIMITS[userData.plan];

    // Get the project
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // If no custom domain configured
    if (!project.customDomain) {
      return {
        success: true,
        canUseCustomDomain: planLimits.canUseCustomDomain,
        config: {
          domain: null,
          status: null,
          domainType: null,
          verificationToken: null,
          verifiedAt: null,
          addedAt: null,
          error: null,
          dnsInstructions: [],
          netlifyTarget: null,
          sslStatus: null,
          useNetlifyDns: false,
          netlifyDnsZoneId: null,
          nameservers: null,
        },
      };
    }

    const isNetlifyDns = project.useNetlifyDns === "true";

    // Get Netlify target
    let netlifyTarget = "your-site.netlify.app";
    if (project.netlifyId) {
      try {
        netlifyTarget = await getNetlifyTarget(project.netlifyId);
      } catch {
        // Use default
      }
    } else if (project.netlifySiteName) {
      netlifyTarget = `${project.netlifySiteName}.netlify.app`;
    }

    // Get DNS instructions (only for user-managed DNS mode)
    const dnsInstructions = !isNetlifyDns && project.customDomainVerificationToken
      ? getDnsInstructions(project.customDomain, netlifyTarget, project.customDomainVerificationToken)
      : [];

    // Parse nameservers from JSON
    let nameservers: string[] | null = null;
    if (project.netlifyNameservers) {
      try {
        nameservers = JSON.parse(project.netlifyNameservers);
      } catch {
        // Ignore parse errors
      }
    }

    // Check SSL status if active
    let sslStatus: string | null = null;
    if (project.customDomainStatus === "active") {
      if (isNetlifyDns) {
        // Netlify DNS automatically handles SSL
        sslStatus = "ready";
      } else if (project.netlifyId) {
        try {
          const ssl = await checkDomainSsl(project.netlifyId, project.customDomain);
          sslStatus = ssl.status;
        } catch {
          // Ignore SSL check errors
        }
      }
    }

    return {
      success: true,
      canUseCustomDomain: planLimits.canUseCustomDomain,
      config: {
        domain: project.customDomain,
        status: project.customDomainStatus as DomainStatus | null,
        domainType: project.customDomainType as DomainType | null,
        verificationToken: project.customDomainVerificationToken,
        verifiedAt: project.customDomainVerifiedAt,
        addedAt: project.customDomainAddedAt,
        error: project.customDomainError,
        dnsInstructions,
        netlifyTarget,
        sslStatus,
        useNetlifyDns: isNetlifyDns,
        netlifyDnsZoneId: project.netlifyDnsZoneId,
        nameservers,
      },
    };
  } catch (error) {
    console.error("[Projects] getCustomDomainStatus error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to get domain status" };
  }
}
