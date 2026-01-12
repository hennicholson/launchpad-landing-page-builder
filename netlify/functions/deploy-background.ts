/**
 * Background Deploy Function
 * Handles the heavy lifting of building and deploying Next.js projects
 * Runs in the background for up to 15 minutes
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

// Netlify API helpers
const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

function getAccessToken(): string {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) throw new Error("NETLIFY_ACCESS_TOKEN not set");
  return token;
}

async function netlifyFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
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

// Build helpers (simplified inline versions)
import { exec } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

// Clean up old build directories to prevent disk space issues
async function cleanOldBuilds(): Promise<void> {
  const tempBase = path.join(os.tmpdir(), "launchpad-builds");
  try {
    const entries = await fs.readdir(tempBase, { withFileTypes: true });
    const now = Date.now();
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const dirPath = path.join(tempBase, entry.name);
        try {
          const stat = await fs.stat(dirPath);
          // Remove directories older than 5 minutes
          if (now - stat.mtimeMs > 5 * 60 * 1000) {
            console.log(`Cleaning old build directory: ${entry.name}`);
            await fs.rm(dirPath, { recursive: true, force: true });
          }
        } catch {
          // Failed to stat or remove, skip
        }
      }
    }
  } catch {
    // tempBase doesn't exist yet, that's fine
  }
}

async function createTempDir(slug: string): Promise<string> {
  const tempBase = path.join(os.tmpdir(), "launchpad-builds");
  await fs.mkdir(tempBase, { recursive: true });
  const tempDir = path.join(tempBase, `${slug}-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });
  return tempDir;
}

async function writeProjectFiles(tempDir: string, files: Record<string, string>): Promise<void> {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(tempDir, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf-8");
  }
}

function getCleanEnv(): Record<string, string | undefined> {
  const env = { ...process.env };
  const turboKeys = Object.keys(env).filter(
    (key) => key.toUpperCase().includes("TURBO") || key.toUpperCase().includes("TURBOPACK")
  );
  for (const key of turboKeys) delete env[key];
  return env;
}

async function runNpmInstall(tempDir: string): Promise<{ success: boolean; logs: string[] }> {
  const logs: string[] = [];
  try {
    const npmCacheDir = path.join(tempDir, ".npm-cache");
    const { stdout, stderr } = await execAsync(
      "npm install --prefer-offline --no-audit --no-fund",
      {
        cwd: tempDir,
        env: {
          ...getCleanEnv(),
          NODE_ENV: "production",
          NPM_CONFIG_CACHE: npmCacheDir,
          NPM_CONFIG_USERCONFIG: "/dev/null",
          HOME: tempDir,
        },
        timeout: 180000, // 3 minutes
        maxBuffer: 10 * 1024 * 1024,
      }
    );
    if (stdout) logs.push(stdout);
    if (stderr) logs.push(stderr);

    // Clean up npm cache after successful install to save disk space
    try {
      await fs.rm(path.join(tempDir, ".npm-cache"), { recursive: true, force: true });
    } catch {}

    return { success: true, logs };
  } catch (error: unknown) {
    const execError = error as { stderr?: string; stdout?: string; message?: string };
    if (execError.stderr) logs.push(`stderr: ${execError.stderr}`);
    if (execError.stdout) logs.push(`stdout: ${execError.stdout}`);
    logs.push(`npm install failed: ${execError.message || "Unknown error"}`);
    return { success: false, logs };
  }
}

async function runNextBuild(tempDir: string): Promise<{ success: boolean; logs: string[] }> {
  const logs: string[] = [];
  try {
    const npmCacheDir = path.join(tempDir, ".npm-cache");
    const { stdout, stderr } = await execAsync("npm run build", {
      cwd: tempDir,
      env: {
        ...getCleanEnv(),
        NODE_ENV: "production",
        NPM_CONFIG_CACHE: npmCacheDir,
        NPM_CONFIG_USERCONFIG: "/dev/null",
        HOME: tempDir,
      },
      timeout: 300000, // 5 minutes
      maxBuffer: 10 * 1024 * 1024,
    });
    if (stdout) logs.push(stdout);
    if (stderr) logs.push(stderr);
    return { success: true, logs };
  } catch (error: unknown) {
    const execError = error as { stderr?: string; stdout?: string; message?: string };
    if (execError.stderr) logs.push(`stderr: ${execError.stderr}`);
    if (execError.stdout) logs.push(`stdout: ${execError.stdout}`);
    logs.push(`next build failed: ${execError.message || "Unknown error"}`);
    return { success: false, logs };
  }
}

async function getOutputFiles(outDir: string): Promise<Record<string, Buffer>> {
  const files: Record<string, Buffer> = {};
  async function readDirRecursive(dir: string, basePath: string = ""): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      if (entry.isDirectory()) {
        await readDirRecursive(fullPath, relativePath);
      } else {
        const content = await fs.readFile(fullPath);
        files["/" + relativePath.replace(/\\/g, "/")] = content;
      }
    }
  }
  await readDirRecursive(outDir);
  return files;
}

async function deployBinaryFiles(
  siteId: string,
  files: Record<string, Buffer>
): Promise<{ id: string; ssl_url: string }> {
  const token = getAccessToken();
  const fileDigests: Record<string, string> = {};
  const fileContents: Record<string, ArrayBuffer> = {};

  for (const [filePath, content] of Object.entries(files)) {
    const arrayBuffer = content.buffer.slice(
      content.byteOffset,
      content.byteOffset + content.byteLength
    ) as ArrayBuffer;
    const hashBuffer = await crypto.subtle.digest("SHA-1", arrayBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    fileDigests[filePath] = hashHex;
    fileContents[hashHex] = arrayBuffer;
  }

  const deploy = await netlifyFetch<{ id: string; required: string[]; ssl_url: string }>(
    `/sites/${siteId}/deploys`,
    {
      method: "POST",
      body: JSON.stringify({ files: fileDigests, draft: false }),
    }
  );

  if (deploy.required?.length > 0) {
    for (const hash of deploy.required) {
      const content = fileContents[hash];
      if (!content) continue;
      const response = await fetch(`${NETLIFY_API_BASE}/deploys/${deploy.id}/files/${hash}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
        },
        body: content,
      });
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.status}`);
      }
    }
  }

  // Poll for deploy ready
  let status = deploy;
  for (let i = 0; i < 60; i++) {
    if (status.ssl_url && !["uploading", "processing"].includes((status as any).state)) break;
    await new Promise((r) => setTimeout(r, 1000));
    status = await netlifyFetch<typeof deploy>(`/deploys/${deploy.id}`);
  }

  return status;
}

async function createOrGetSite(siteName: string, existingId: string | null) {
  if (existingId) {
    try {
      return await netlifyFetch<{ id: string; name: string; ssl_url: string }>(`/sites/${existingId}`);
    } catch {
      // Site doesn't exist, create new
    }
  }

  const sanitizedName = siteName.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  try {
    return await netlifyFetch<{ id: string; name: string; ssl_url: string }>("/sites", {
      method: "POST",
      body: JSON.stringify({ name: sanitizedName, force_ssl: true }),
    });
  } catch {
    // Name taken, add suffix
    const uniqueName = `${sanitizedName}-${Date.now().toString(36)}`;
    return await netlifyFetch<{ id: string; name: string; ssl_url: string }>("/sites", {
      method: "POST",
      body: JSON.stringify({ name: uniqueName, force_ssl: true }),
    });
  }
}

// Main handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log("Background deploy function started");

  // Clean up old build directories first to free disk space
  await cleanOldBuilds();

  let tempDir: string | null = null;

  try {
    const body = JSON.parse(event.body || "{}");
    const { projectId, deploymentId, customSubdomain, userId, projectFiles, slug, netlifyId } = body;

    if (!projectId || !deploymentId) {
      console.error("Missing required parameters");
      return { statusCode: 400, body: "Missing projectId or deploymentId" };
    }

    if (!projectFiles || Object.keys(projectFiles).length === 0) {
      console.error("No project files provided");
      return { statusCode: 400, body: "Missing projectFiles" };
    }

    const db = getDb();

    // Update status to building
    await db.update(deployments).set({ status: "building" }).where(eq(deployments.id, deploymentId));
    console.log("Status updated to building");

    // Project files are pre-generated by the API (which has filesystem access for shared components)
    console.log(`Received ${Object.keys(projectFiles).length} project files`);

    // Create temp directory and write files
    const siteSlug = customSubdomain || slug;
    tempDir = await createTempDir(siteSlug);
    await writeProjectFiles(tempDir, projectFiles);
    console.log("Project files written to", tempDir);

    // npm install
    console.log("Running npm install...");
    const installResult = await runNpmInstall(tempDir);
    if (!installResult.success) {
      await db.update(deployments).set({
        status: "failed",
        errorMessage: "npm install failed",
        errorCode: "NPM_DEPENDENCY",
        buildLogs: installResult.logs.join("\n").slice(-10000),
        lastAttemptAt: new Date(),
      }).where(eq(deployments.id, deploymentId));
      console.error("npm install failed:", installResult.logs.slice(-3));
      return { statusCode: 500, body: "npm install failed" };
    }
    console.log("npm install complete");

    // npm run build
    console.log("Running next build...");
    const buildResult = await runNextBuild(tempDir);
    if (!buildResult.success) {
      await db.update(deployments).set({
        status: "failed",
        errorMessage: "next build failed",
        errorCode: "BUILD_UNKNOWN",
        buildLogs: buildResult.logs.join("\n").slice(-10000),
        lastAttemptAt: new Date(),
      }).where(eq(deployments.id, deploymentId));
      console.error("next build failed:", buildResult.logs.slice(-3));
      return { statusCode: 500, body: "next build failed" };
    }
    console.log("Build complete");

    // Get output files
    const outDir = path.join(tempDir, "out");
    const outputFiles = await getOutputFiles(outDir);
    console.log(`Collected ${Object.keys(outputFiles).length} output files`);

    // Create/get Netlify site
    const siteName = `lp-${siteSlug}`;
    const site = await createOrGetSite(siteName, netlifyId);
    console.log("Site ready:", site.name);

    // Deploy to Netlify
    console.log("Uploading to Netlify...");
    const deploy = await deployBinaryFiles(site.id, outputFiles);
    console.log("Deploy complete:", deploy.ssl_url);

    // Add custom domain if configured
    const domainBase = process.env.CUSTOM_DOMAIN_BASE;
    const dnsZoneId = process.env.NETLIFY_DNS_ZONE_ID;

    if (domainBase) {
      const domain = `${siteSlug}.${domainBase}`;

      // Step 1: Create DNS CNAME record in Netlify DNS
      if (dnsZoneId) {
        try {
          const dnsResponse = await fetch(`${NETLIFY_API_BASE}/dns_zones/${dnsZoneId}/dns_records`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "CNAME",
              hostname: siteSlug,  // Just the subdomain part (e.g., "examplecourse")
              value: `${site.name}.netlify.app`,  // Target (e.g., "lp-examplecourse-xxx.netlify.app")
              ttl: 3600,
            }),
          });

          if (dnsResponse.ok) {
            console.log(`DNS record created: ${domain} → ${site.name}.netlify.app`);
          } else {
            const errorText = await dnsResponse.text();
            // Don't fail if record already exists
            if (!errorText.includes("already exists")) {
              console.warn(`Failed to create DNS record: ${errorText}`);
            } else {
              console.log(`DNS record already exists for ${domain}`);
            }
          }
        } catch (e) {
          console.warn("Failed to create DNS record:", e);
        }
      }

      // Step 2: Set custom domain on the Netlify site
      try {
        const domainResponse = await fetch(`${NETLIFY_API_BASE}/sites/${site.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ custom_domain: domain }),
        });

        if (domainResponse.ok) {
          console.log(`Custom domain set: ${domain}`);
        } else {
          const errorText = await domainResponse.text();
          console.warn(`Failed to set custom domain: ${errorText}`);
        }
      } catch (e) {
        console.warn("Failed to set custom domain:", e);
      }
    }

    // Get final URL
    const finalUrl = domainBase
      ? `https://${siteSlug}.${domainBase}`
      : deploy.ssl_url;

    // Update deployment as ready
    await db.update(deployments).set({
      status: "ready",
      url: finalUrl,
      netlifyDeployId: deploy.id,
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

    console.log("Background deploy completed successfully:", finalUrl);
    return { statusCode: 200, body: JSON.stringify({ success: true, url: finalUrl }) };

  } catch (error) {
    console.error("Background deploy error:", error);

    // Try to update deployment as failed
    try {
      const body = JSON.parse(event.body || "{}");
      if (body.deploymentId) {
        const db = getDb();
        await db.update(deployments).set({
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          errorCode: "UNKNOWN",
          lastAttemptAt: new Date(),
        }).where(eq(deployments.id, body.deploymentId));
      }
    } catch {}

    return { statusCode: 500, body: "Deploy failed" };
  } finally {
    // Always clean up temp directory to prevent disk space issues
    if (tempDir) {
      console.log("Cleaning up temp directory:", tempDir);
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.warn("Failed to clean up temp directory:", cleanupError);
      }
    }
  }
};

// Mark as background function
export const config = {
  type: "background",
};
