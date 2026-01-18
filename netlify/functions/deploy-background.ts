/**
 * Background Deploy Function
 * Pushes project files to GitHub, Netlify auto-builds from the branch
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  jsonb,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

// Re-define schema for the function (can't use @/ imports in Netlify functions)
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  whopId: text("whop_id").notNull().unique(),
  deployCount: integer("deploy_count").default(0).notNull(),
});

const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  pageData: jsonb("page_data").notNull(),
  settings: jsonb("settings"),
  netlifyId: text("netlify_id"),
  netlifySiteName: text("netlify_site_name"),
  liveUrl: text("live_url"),
  isPublished: text("is_published").default("false"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const deployments = pgTable("deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  netlifyDeployId: text("netlify_deploy_id"),
  url: text("url"),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  errorCode: text("error_code"),
  retryCount: integer("retry_count").default(0).notNull(),
  maxRetries: integer("max_retries").default(3).notNull(),
  isFatal: text("is_fatal").default("false"),
  lastAttemptAt: timestamp("last_attempt_at"),
  buildLogs: text("build_logs"),
});

// Initialize database
function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  const sqlClient = neon(dbUrl);
  return drizzle(sqlClient);
}

// ============ GitHub API Helpers ============
const GITHUB_API_BASE = "https://api.github.com";

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // e.g., "hennicholson/launchpad"
  if (!token) throw new Error("GITHUB_TOKEN not set");
  if (!repo) throw new Error("GITHUB_REPO not set");
  return { token, repo };
}

async function githubFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { token } = getGitHubConfig();
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// Push all files to a branch using GitHub's Git Data API
async function pushFilesToBranch(
  branchName: string,
  files: Record<string, string>,
  commitMessage: string
): Promise<{ sha: string }> {
  const { repo } = getGitHubConfig();

  console.log(`  - Creating/updating branch: ${branchName}`);

  // 1. Get the SHA of the main branch
  let mainSha: string;
  try {
    const mainRef = await githubFetch<{ object: { sha: string } }>(`/repos/${repo}/git/ref/heads/main`);
    mainSha = mainRef.object.sha;
    console.log(`  - Main branch SHA: ${mainSha}`);
  } catch {
    throw new Error("Could not find main branch in GitHub repo");
  }

  // 2. Check if branch exists, create if not
  let branchSha = mainSha;
  try {
    const branchRef = await githubFetch<{ object: { sha: string } }>(`/repos/${repo}/git/ref/heads/${branchName}`);
    branchSha = branchRef.object.sha;
    console.log(`  - Branch exists, SHA: ${branchSha}`);
  } catch {
    // Branch doesn't exist, create it from main
    console.log(`  - Creating new branch from main...`);
    await githubFetch(`/repos/${repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: mainSha,
      }),
    });
    console.log(`  - Branch created`);
  }

  // 3. Get the current tree SHA
  const commit = await githubFetch<{ tree: { sha: string } }>(`/repos/${repo}/git/commits/${branchSha}`);
  const baseTreeSha = commit.tree.sha;

  // 4. Create blobs for each file
  console.log(`  - Creating ${Object.keys(files).length} file blobs...`);
  const treeItems: { path: string; mode: string; type: string; sha: string }[] = [];

  for (const [filePath, content] of Object.entries(files)) {
    const blob = await githubFetch<{ sha: string }>(`/repos/${repo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(content).toString("base64"),
        encoding: "base64",
      }),
    });
    treeItems.push({
      path: filePath.startsWith("/") ? filePath.slice(1) : filePath,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  // 5. Create new tree
  console.log(`  - Creating tree with ${treeItems.length} items...`);
  const newTree = await githubFetch<{ sha: string }>(`/repos/${repo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });

  // 6. Create commit
  console.log(`  - Creating commit...`);
  const newCommit = await githubFetch<{ sha: string }>(`/repos/${repo}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: commitMessage,
      tree: newTree.sha,
      parents: [branchSha],
    }),
  });

  // 7. Update branch reference
  console.log(`  - Updating branch reference...`);
  await githubFetch(`/repos/${repo}/git/refs/heads/${branchName}`, {
    method: "PATCH",
    body: JSON.stringify({
      sha: newCommit.sha,
      force: true,
    }),
  });

  console.log(`  - ✓ Pushed to branch ${branchName}, commit: ${newCommit.sha}`);
  return { sha: newCommit.sha };
}

// ============ Netlify API Helpers ============
const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

function getNetlifyToken(): string {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) throw new Error("NETLIFY_ACCESS_TOKEN not set");
  return token;
}

async function netlifyFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getNetlifyToken();
  const response = await fetch(`${NETLIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Netlify API error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// Create or get site linked to GitHub repo branch
async function createOrGetSiteLinkedToGitHub(
  siteName: string,
  branchName: string,
  existingId: string | null
): Promise<{ id: string; name: string; ssl_url: string }> {
  const { repo, token } = getGitHubConfig();
  const [owner] = repo.split("/");

  // Get the GitHub repo ID (numeric)
  let repoId: number | undefined;
  try {
    const repoInfo = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (repoInfo.ok) {
      const data = await repoInfo.json();
      repoId = data.id;
      console.log(`  - GitHub repo ID: ${repoId}`);
    }
  } catch (e) {
    console.warn("  - Could not get GitHub repo ID:", e);
  }

  const repoSettings = {
    provider: "github",
    id: repoId, // GitHub repo numeric ID
    repo: repo, // owner/repo format
    repo_path: repo,
    repo_branch: branchName,
    repo_url: `https://github.com/${repo}`, // HTTPS URL
    cmd: "npm run build",
    dir: "out",
    private: true, // Mark repo as private
    private_logs: false,
    installation_id: parseInt(process.env.GITHUB_INSTALLATION_ID || "0", 10) || undefined,
  };

  if (existingId) {
    try {
      // Get existing site and update repo settings
      const site = await netlifyFetch<{ id: string; name: string; ssl_url: string }>(`/sites/${existingId}`);

      // Update with repo link
      await netlifyFetch(`/sites/${existingId}`, {
        method: "PATCH",
        body: JSON.stringify({ repo: repoSettings }),
      });

      return site;
    } catch {
      // Site doesn't exist, create new
    }
  }

  const sanitizedName = siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

  const createSite = async (name: string) => {
    return await netlifyFetch<{ id: string; name: string; ssl_url: string }>("/sites", {
      method: "POST",
      body: JSON.stringify({
        name,
        force_ssl: true,
        repo: repoSettings,
      }),
    });
  };

  try {
    return await createSite(sanitizedName);
  } catch {
    const uniqueName = `${sanitizedName}-${Date.now().toString(36)}`;
    return await createSite(uniqueName);
  }
}

// Trigger a build on a site
async function triggerNetlifyBuild(siteId: string): Promise<{ id: string; deploy_id: string }> {
  return await netlifyFetch<{ id: string; deploy_id: string }>(
    `/sites/${siteId}/builds`,
    { method: "POST" }
  );
}

// Purge site cache to ensure visitors see latest version
async function purgeNetlifyCache(siteId: string): Promise<void> {
  const token = getNetlifyToken();
  try {
    const response = await fetch(`${NETLIFY_API_BASE}/purge`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ site_id: siteId }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`  - Cache purge warning: ${response.status} - ${errorText}`);
    } else {
      console.log("  - ✓ Cache purged for site");
    }
  } catch (e) {
    console.warn("  - Cache purge failed (non-fatal):", e);
  }
}

// ============ Main Handler ============
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log("=== DEPLOY-BACKGROUND FUNCTION INVOKED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("ENV CHECK - DATABASE_URL:", !!process.env.DATABASE_URL);
  console.log("ENV CHECK - NETLIFY_ACCESS_TOKEN:", !!process.env.NETLIFY_ACCESS_TOKEN);
  console.log("ENV CHECK - GITHUB_TOKEN:", !!process.env.GITHUB_TOKEN);
  console.log("ENV CHECK - GITHUB_REPO:", process.env.GITHUB_REPO || "not set");
  console.log("ENV CHECK - CUSTOM_DOMAIN_BASE:", process.env.CUSTOM_DOMAIN_BASE || "not set");
  console.log("Event body exists:", !!event.body);
  console.log("Event body length:", event.body?.length || 0);

  let deploymentId: string | null = null;

  try {
    // [STEP 1/8] Parse request body
    console.log("[STEP 1/8] Parsing request body...");
    const body = JSON.parse(event.body || "{}");
    console.log("[STEP 1/8] ✓ Parsed body keys:", Object.keys(body));

    const { projectId, customSubdomain, userId, slug, netlifyId, compressedProjectFiles } = body;
    deploymentId = body.deploymentId;

    // Decompress projectFiles if sent compressed
    let projectFiles = body.projectFiles;
    if (compressedProjectFiles && !projectFiles) {
      console.log("  - Decompressing projectFiles...");
      const zlib = await import("zlib");
      const { promisify } = await import("util");
      const gunzip = promisify(zlib.gunzip);
      const compressedBuffer = Buffer.from(compressedProjectFiles, "base64");
      const decompressedBuffer = await gunzip(compressedBuffer);
      projectFiles = JSON.parse(decompressedBuffer.toString("utf-8"));
      console.log("  - ✓ Decompressed:", Object.keys(projectFiles).length, "files");
    }

    console.log("  - projectId:", projectId);
    console.log("  - deploymentId:", deploymentId);
    console.log("  - customSubdomain:", customSubdomain);
    console.log("  - slug:", slug);
    console.log("  - netlifyId:", netlifyId);
    console.log("  - projectFiles count:", projectFiles ? Object.keys(projectFiles).length : 0);

    // [STEP 2/8] Validate parameters
    console.log("[STEP 2/8] Validating parameters...");
    if (!projectId || !deploymentId) {
      console.error("[STEP 2/8] ✗ FAILED - Missing required parameters");
      return { statusCode: 400, body: "Missing projectId or deploymentId" };
    }
    if (!projectFiles || Object.keys(projectFiles).length === 0) {
      console.error("[STEP 2/8] ✗ FAILED - No project files provided");
      return { statusCode: 400, body: "Missing projectFiles" };
    }
    console.log("[STEP 2/8] ✓ Parameters valid");

    // [STEP 3/8] Connect to database
    console.log("[STEP 3/8] Connecting to database...");
    const db = getDb();
    await db.update(deployments).set({ status: "building" }).where(eq(deployments.id, deploymentId));
    console.log("[STEP 3/8] ✓ Database connected, status updated to 'building'");

    const siteSlug = customSubdomain || slug;
    const branchName = `sites/${siteSlug}`;

    // [STEP 4/8] Push files to GitHub
    console.log("[STEP 4/8] Pushing files to GitHub...");
    const pushResult = await pushFilesToBranch(
      branchName,
      projectFiles as Record<string, string>,
      `Deploy ${siteSlug} - ${new Date().toISOString()}`
    );
    console.log("[STEP 4/8] ✓ Files pushed to GitHub, commit:", pushResult.sha);

    // [STEP 5/8] Create/get Netlify site linked to the branch
    console.log("[STEP 5/8] Creating/getting Netlify site linked to GitHub branch...");
    const siteName = `lp-${siteSlug}`;
    const site = await createOrGetSiteLinkedToGitHub(siteName, branchName, netlifyId);
    console.log("[STEP 5/8] ✓ Site ready:", site.name, "ID:", site.id);

    // [STEP 6/8] Trigger build and wait for completion
    console.log("[STEP 6/8] Triggering Netlify build...");
    let deployId: string;
    try {
      const build = await triggerNetlifyBuild(site.id);
      deployId = build.deploy_id;
      console.log("  - Build triggered, deploy ID:", deployId);
    } catch (buildError) {
      // If triggering build fails, Netlify might auto-build from webhook
      // Poll for latest deploy instead
      console.log("  - Manual trigger failed, waiting for auto-build...");
      await new Promise(r => setTimeout(r, 5000));
      const deploys = await netlifyFetch<{ id: string; state: string }[]>(`/sites/${site.id}/deploys?per_page=1`);
      if (deploys.length === 0) {
        throw new Error("No deploys found after push");
      }
      deployId = deploys[0].id;
      console.log("  - Found latest deploy:", deployId);
    }

    // Poll for deploy completion
    console.log("  - Waiting for build to complete...");
    type DeployStatus = { id: string; state: string; ssl_url?: string; error_message?: string };
    let deployStatus = await netlifyFetch<DeployStatus>(`/deploys/${deployId}`);
    const maxWaitTime = 10 * 60 * 1000; // 10 minutes
    const pollInterval = 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      console.log("  - Deploy state:", deployStatus.state);

      if (deployStatus.state === "ready") break;
      if (deployStatus.state === "error") {
        console.error("[STEP 6/8] ✗ FAILED - Build failed:", deployStatus.error_message);
        await db.update(deployments).set({
          status: "failed",
          errorMessage: `Build failed: ${deployStatus.error_message || "Unknown error"}`,
          errorCode: "BUILD_FAILED",
          lastAttemptAt: new Date(),
        }).where(eq(deployments.id, deploymentId));
        return { statusCode: 500, body: "Build failed" };
      }

      await new Promise(r => setTimeout(r, pollInterval));
      deployStatus = await netlifyFetch<DeployStatus>(`/deploys/${deployId}`);
    }

    if (deployStatus.state !== "ready") {
      console.error("[STEP 6/8] ✗ FAILED - Build timed out, last state:", deployStatus.state);
      await db.update(deployments).set({
        status: "failed",
        errorMessage: `Build timed out after 10 minutes (state: ${deployStatus.state})`,
        errorCode: "BUILD_TIMEOUT",
        lastAttemptAt: new Date(),
      }).where(eq(deployments.id, deploymentId));
      return { statusCode: 500, body: "Build timed out" };
    }
    console.log("[STEP 6/8] ✓ Build completed");

    // Purge cache so visitors see the latest version immediately
    console.log("  - Purging cache...");
    await purgeNetlifyCache(site.id);

    // [STEP 7/8] Get deploy URL
    console.log("[STEP 7/8] Getting deploy URL...");
    const siteInfo = await netlifyFetch<{ ssl_url: string; url: string }>(`/sites/${site.id}`);
    console.log("[STEP 7/8] ✓ Site URL:", siteInfo.ssl_url);

    // [STEP 8/8] Set up custom domain
    console.log("[STEP 8/8] Setting up custom domain...");
    const domainBase = process.env.CUSTOM_DOMAIN_BASE;
    const dnsZoneId = process.env.NETLIFY_DNS_ZONE_ID;

    if (domainBase) {
      const domain = `${siteSlug}.${domainBase}`;
      console.log("  - Target domain:", domain);

      // Create DNS CNAME record
      if (dnsZoneId) {
        try {
          const dnsResponse = await fetch(`${NETLIFY_API_BASE}/dns_zones/${dnsZoneId}/dns_records`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getNetlifyToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "CNAME",
              hostname: siteSlug,
              value: `${site.name}.netlify.app`,
              ttl: 3600,
            }),
          });

          if (dnsResponse.ok) {
            console.log(`  - ✓ DNS record created: ${domain} → ${site.name}.netlify.app`);
          } else {
            const errorText = await dnsResponse.text();
            if (!errorText.includes("already exists")) {
              console.warn(`  - ⚠ Failed to create DNS record: ${errorText}`);
            } else {
              console.log(`  - ✓ DNS record already exists`);
            }
          }
        } catch (e) {
          console.warn("  - ⚠ Failed to create DNS record:", e);
        }
      }

      // Set custom domain on site
      try {
        await fetch(`${NETLIFY_API_BASE}/sites/${site.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getNetlifyToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ custom_domain: domain }),
        });
        console.log(`  - ✓ Custom domain set: ${domain}`);
      } catch (e) {
        console.warn("  - ⚠ Failed to set custom domain:", e);
      }
    }
    console.log("[STEP 8/8] ✓ Custom domain setup complete");

    // Final URL
    const finalUrl = domainBase
      ? `https://${siteSlug}.${domainBase}`
      : siteInfo.ssl_url;

    // Update deployment as ready
    await db.update(deployments).set({
      status: "ready",
      url: finalUrl,
      netlifyDeployId: deployId,
    }).where(eq(deployments.id, deploymentId));

    // Update project
    await db.update(projects).set({
      netlifyId: site.id,
      netlifySiteName: site.name,
      liveUrl: finalUrl,
      isPublished: "true",
      updatedAt: new Date(),
    }).where(eq(projects.id, projectId));

    // Increment user deploy count
    if (userId) {
      await db.update(users).set({
        deployCount: sql`${users.deployCount} + 1`,
      }).where(eq(users.id, userId));
    }

    console.log("=== DEPLOY-BACKGROUND COMPLETED SUCCESSFULLY ===");
    console.log("Final URL:", finalUrl);
    return { statusCode: 200, body: JSON.stringify({ success: true, url: finalUrl }) };

  } catch (error) {
    console.error("=== DEPLOY-BACKGROUND FATAL ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    try {
      if (deploymentId) {
        const db = getDb();
        await db.update(deployments).set({
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          errorCode: "UNKNOWN",
          lastAttemptAt: new Date(),
        }).where(eq(deployments.id, deploymentId));
      }
    } catch (dbError) {
      console.error("Failed to update deployment status:", dbError);
    }

    return { statusCode: 500, body: "Deploy failed" };
  }
};

export const config = {
  type: "background",
};
