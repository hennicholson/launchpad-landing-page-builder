/**
 * Netlify API client for deploying landing pages
 */

const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

type NetlifySite = {
  id: string;
  name: string;
  url: string;
  ssl_url: string;
  admin_url: string;
  state: string;
};

type NetlifyDeploy = {
  id: string;
  site_id: string;
  state: string;
  url: string;
  ssl_url: string;
  deploy_url: string;
  created_at: string;
};

function getAccessToken(): string {
  const token = process.env.NETLIFY_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NETLIFY_ACCESS_TOKEN environment variable is not set");
  }
  return token;
}

async function netlifyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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

/**
 * Create a new Netlify site
 */
export async function createSite(name: string): Promise<NetlifySite> {
  // Sanitize site name - only lowercase letters, numbers, and hyphens
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return netlifyFetch<NetlifySite>("/sites", {
    method: "POST",
    body: JSON.stringify({
      name: sanitizedName,
      // Force SSL
      force_ssl: true,
    }),
  });
}

/**
 * Get an existing Netlify site by ID
 */
export async function getSite(siteId: string): Promise<NetlifySite> {
  return netlifyFetch<NetlifySite>(`/sites/${siteId}`);
}

/**
 * Update site name
 */
export async function updateSite(
  siteId: string,
  name: string
): Promise<NetlifySite> {
  const sanitizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return netlifyFetch<NetlifySite>(`/sites/${siteId}`, {
    method: "PATCH",
    body: JSON.stringify({ name: sanitizedName }),
  });
}

/**
 * Delete a Netlify site
 */
export async function deleteSite(siteId: string): Promise<void> {
  const token = getAccessToken();

  const response = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete site: ${response.status} - ${errorText}`);
  }
}

/**
 * Deploy files to a Netlify site using the deploy API
 * This uses the "deploy by digest" method for atomic deploys
 */
export async function deployFiles(
  siteId: string,
  files: Record<string, string> // path -> content
): Promise<NetlifyDeploy> {
  const token = getAccessToken();

  // Calculate SHA1 digests for each file
  const fileDigests: Record<string, string> = {};
  const fileContents: Record<string, string> = {};

  for (const [path, content] of Object.entries(files)) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    fileDigests[path] = hashHex;
    fileContents[hashHex] = content;
  }

  // Create deploy with file digests
  const deploy = await netlifyFetch<NetlifyDeploy & { required: string[] }>(
    `/sites/${siteId}/deploys`,
    {
      method: "POST",
      body: JSON.stringify({
        files: fileDigests,
        draft: false, // Publish immediately
      }),
    }
  );

  // Upload any required files
  if (deploy.required && deploy.required.length > 0) {
    for (const hash of deploy.required) {
      const content = fileContents[hash];
      if (!content) continue;

      const response = await fetch(
        `${NETLIFY_API_BASE}/deploys/${deploy.id}/files/${hash}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/octet-stream",
          },
          body: content,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${response.status} - ${errorText}`);
      }
    }
  }

  // Wait for deploy to be ready (poll status)
  let deployStatus: NetlifyDeploy = { ...deploy };
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max

  while (deployStatus.state === "uploading" || deployStatus.state === "processing") {
    if (attempts >= maxAttempts) {
      throw new Error("Deploy timed out");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    deployStatus = await netlifyFetch<NetlifyDeploy>(`/deploys/${deploy.id}`);
    attempts++;
  }

  if (deployStatus.state === "error") {
    throw new Error("Deploy failed");
  }

  return deployStatus;
}

/**
 * Full deployment flow: create site if needed, then deploy
 */
export async function deployLandingPage(
  projectSlug: string,
  existingNetlifyId: string | null,
  files: Record<string, string>
): Promise<{ siteId: string; siteName: string; url: string; deployId: string }> {
  let site: NetlifySite;

  // Generate a unique site name using the project slug
  const siteName = `lp-${projectSlug}`;

  if (existingNetlifyId) {
    // Try to get existing site
    try {
      site = await getSite(existingNetlifyId);
    } catch {
      // Site doesn't exist anymore, create new one
      site = await createSite(siteName);
    }
  } else {
    // Create new site
    try {
      site = await createSite(siteName);
    } catch (error) {
      // Site name might be taken, add random suffix
      const uniqueName = `${siteName}-${Date.now().toString(36)}`;
      site = await createSite(uniqueName);
    }
  }

  // Deploy the files
  const deploy = await deployFiles(site.id, files);

  return {
    siteId: site.id,
    siteName: site.name,
    url: site.ssl_url || site.url,
    deployId: deploy.id,
  };
}

/**
 * Deploy binary files (Buffer) to a Netlify site
 * Used for built Next.js static export which includes binary assets
 */
export async function deployBinaryFiles(
  siteId: string,
  files: Record<string, Buffer> // path -> content as Buffer
): Promise<NetlifyDeploy> {
  const token = getAccessToken();

  // Calculate SHA1 digests for each file
  const fileDigests: Record<string, string> = {};
  const fileContents: Record<string, ArrayBuffer> = {};

  for (const [path, content] of Object.entries(files)) {
    // Convert Buffer to ArrayBuffer for crypto.subtle and fetch compatibility
    const arrayBuffer = content.buffer.slice(
      content.byteOffset,
      content.byteOffset + content.byteLength
    ) as ArrayBuffer;

    const hashBuffer = await crypto.subtle.digest("SHA-1", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    fileDigests[path] = hashHex;
    fileContents[hashHex] = arrayBuffer;
  }

  // Create deploy with file digests
  const deploy = await netlifyFetch<NetlifyDeploy & { required: string[] }>(
    `/sites/${siteId}/deploys`,
    {
      method: "POST",
      body: JSON.stringify({
        files: fileDigests,
        draft: false, // Publish immediately
      }),
    }
  );

  // Upload any required files
  if (deploy.required && deploy.required.length > 0) {
    for (const hash of deploy.required) {
      const content = fileContents[hash];
      if (!content) continue;

      const response = await fetch(
        `${NETLIFY_API_BASE}/deploys/${deploy.id}/files/${hash}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/octet-stream",
          },
          body: content,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload file: ${response.status} - ${errorText}`);
      }
    }
  }

  // Wait for deploy to be ready (poll status)
  let deployStatus: NetlifyDeploy = { ...deploy };
  let attempts = 0;
  const maxAttempts = 60; // 60 seconds max for larger deploys

  while (deployStatus.state === "uploading" || deployStatus.state === "processing") {
    if (attempts >= maxAttempts) {
      throw new Error("Deploy timed out");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    deployStatus = await netlifyFetch<NetlifyDeploy>(`/deploys/${deploy.id}`);
    attempts++;
  }

  if (deployStatus.state === "error") {
    throw new Error("Deploy failed");
  }

  return deployStatus;
}

/**
 * Get the custom domain base from environment variable
 * When set, deployed sites will get a custom subdomain like: slug.onwhop.com
 */
function getCustomDomainBase(): string | null {
  return process.env.CUSTOM_DOMAIN_BASE || null;
}

/**
 * Add a custom domain alias to a Netlify site
 * This allows the site to be accessed via a custom subdomain
 */
export async function addCustomDomain(
  siteId: string,
  subdomain: string
): Promise<void> {
  const domainBase = getCustomDomainBase();
  if (!domainBase) return; // Skip if no custom domain configured

  const domain = `${subdomain}.${domainBase}`;
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/sites/${siteId}/domain_aliases`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain }),
    });

    // Don't fail on errors - domain might already exist or DNS might not be ready
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to add custom domain ${domain}: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    // Log but don't fail deploy if custom domain fails
    console.warn(`Failed to add custom domain ${domain}:`, error);
  }
}

/**
 * Get the URL for a deployed site, preferring custom domain if available
 */
export function getDeployedUrl(siteName: string, netlifyUrl: string): string {
  const domainBase = getCustomDomainBase();
  if (domainBase) {
    // Extract the slug from siteName (e.g., "lp-mysite" -> "mysite")
    const slug = siteName.replace(/^lp-/, '');
    return `https://${slug}.${domainBase}`;
  }
  return netlifyUrl;
}

/**
 * Deploy a built Next.js static export to Netlify
 * This handles the full flow: create site if needed, then deploy all built files
 */
export async function deployNextJsApp(
  projectSlug: string,
  existingNetlifyId: string | null,
  outputFiles: Record<string, Buffer>
): Promise<{ siteId: string; siteName: string; url: string; deployId: string }> {
  let site: NetlifySite;

  // Generate a unique site name using the project slug
  const siteName = `lp-${projectSlug}`;

  if (existingNetlifyId) {
    // Try to get existing site
    try {
      site = await getSite(existingNetlifyId);
    } catch {
      // Site doesn't exist anymore, create new one
      site = await createSite(siteName);
    }
  } else {
    // Create new site
    try {
      site = await createSite(siteName);
    } catch {
      // Site name might be taken, add random suffix
      const uniqueName = `${siteName}-${Date.now().toString(36)}`;
      site = await createSite(uniqueName);
    }
  }

  // Deploy the built files
  const deploy = await deployBinaryFiles(site.id, outputFiles);

  return {
    siteId: site.id,
    siteName: site.name,
    url: site.ssl_url || site.url,
    deployId: deploy.id,
  };
}
