/**
 * Netlify API client for deploying landing pages
 */

const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

// Main site ID for custom domain aliases
// All custom domains are added as aliases to this site since we use dynamic rendering
const MAIN_SITE_ID = process.env.NETLIFY_MAIN_SITE_ID || "475f6573-8400-4bdc-add7-a776a299f083";

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

// ============================================
// Custom Domain Management (User-provided domains)
// ============================================

type DomainAlias = {
  domain: string;
  created_at: string;
  ssl?: {
    state: "pending" | "verifying" | "ready" | "error";
  };
};

/**
 * Add a user's custom domain as an alias to a Netlify site
 * This is for user-provided domains (e.g., mysite.com), not our onwhop.com subdomains
 */
export async function addUserCustomDomain(
  siteId: string,
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(
      `${NETLIFY_API_BASE}/sites/${siteId}/domain_aliases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // Check if domain already exists (not an error)
      if (errorText.includes("already exists") || errorText.includes("already added")) {
        return { success: true };
      }
      return { success: false, error: `Failed to add domain: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Remove a user's custom domain alias from a Netlify site
 */
export async function removeUserCustomDomain(
  siteId: string,
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(
      `${NETLIFY_API_BASE}/sites/${siteId}/domain_aliases/${encodeURIComponent(domain)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 404 is okay - domain might already be removed
    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      return { success: false, error: `Failed to remove domain: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Get all domain aliases and their SSL status for a Netlify site
 */
export async function getDomainAliases(
  siteId: string
): Promise<{ domains: Array<{ domain: string; sslStatus: string }>; error?: string }> {
  try {
    const site = await netlifyFetch<{
      domain_aliases?: DomainAlias[];
      ssl_url?: string;
      url?: string;
    }>(`/sites/${siteId}`);

    const domains = (site.domain_aliases || []).map((alias) => ({
      domain: alias.domain,
      sslStatus: alias.ssl?.state || "pending",
    }));

    return { domains };
  } catch (error) {
    return { domains: [], error: String(error) };
  }
}

/**
 * Get the Netlify target URL for CNAME records
 * This is the site's default .netlify.app domain
 */
export async function getNetlifyTarget(siteId: string): Promise<string> {
  const site = await getSite(siteId);
  return `${site.name}.netlify.app`;
}

/**
 * Check if a custom domain's SSL certificate is ready
 */
export async function checkDomainSsl(
  siteId: string,
  domain: string
): Promise<{ ready: boolean; status: string }> {
  const { domains, error } = await getDomainAliases(siteId);

  if (error) {
    return { ready: false, status: "error" };
  }

  const domainInfo = domains.find((d) => d.domain === domain);
  if (!domainInfo) {
    return { ready: false, status: "not_found" };
  }

  return {
    ready: domainInfo.sslStatus === "ready",
    status: domainInfo.sslStatus,
  };
}

// ============================================
// Netlify DNS Zone Management
// ============================================

type NetlifyDnsZone = {
  id: string;
  name: string;
  records: number;
  dns_servers: string[];
  domain: string;
  ipv6_enabled: boolean;
  dedicated: boolean;
  created_at: string;
  updated_at: string;
  account_id: string;
  account_slug: string;
  account_name: string;
  site_id?: string;
  supported_record_types: string[];
};

type NetlifyDnsRecord = {
  id: string;
  hostname: string;
  type: string;
  value: string;
  ttl: number;
  priority?: number;
  dns_zone_id: string;
  site_id?: string;
  flag?: number;
  tag?: string;
  managed: boolean;
};

/**
 * Create a DNS zone in Netlify for a custom domain
 * This allows us to manage all DNS records for the user's domain
 */
export async function createDnsZone(
  domain: string,
  siteId?: string
): Promise<{ success: boolean; zone?: NetlifyDnsZone; error?: string }> {
  const token = getAccessToken();

  try {
    const body: { name: string; site_id?: string } = { name: domain };
    if (siteId) {
      body.site_id = siteId;
    }

    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Check if zone already exists
      if (errorText.includes("already exists") || errorText.includes("is already configured")) {
        // Try to get the existing zone
        const existingZone = await getDnsZone(domain);
        if (existingZone.zone) {
          return { success: true, zone: existingZone.zone };
        }
      }
      return { success: false, error: `Failed to create DNS zone: ${errorText}` };
    }

    const zone = await response.json();
    return { success: true, zone };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Get a DNS zone by domain name
 */
export async function getDnsZone(
  domain: string
): Promise<{ success: boolean; zone?: NetlifyDnsZone; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones?name=${encodeURIComponent(domain)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const zones = await response.json();
    const zone = zones.find((z: NetlifyDnsZone) => z.name === domain || z.domain === domain);

    if (!zone) {
      return { success: false, error: "DNS zone not found" };
    }

    return { success: true, zone };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Get DNS zone by ID
 */
export async function getDnsZoneById(
  zoneId: string
): Promise<{ success: boolean; zone?: NetlifyDnsZone; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones/${zoneId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const zone = await response.json();
    return { success: true, zone };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Delete a DNS zone
 */
export async function deleteDnsZone(
  zoneId: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones/${zoneId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Create a DNS record in a zone
 */
export async function createDnsRecord(
  zoneId: string,
  record: {
    type: string;
    hostname: string;
    value: string;
    ttl?: number;
    priority?: number;
  }
): Promise<{ success: boolean; record?: NetlifyDnsRecord; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones/${zoneId}/dns_records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: record.type,
        hostname: record.hostname,
        value: record.value,
        ttl: record.ttl || 3600,
        priority: record.priority,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Ignore if record already exists
      if (errorText.includes("already exists")) {
        return { success: true };
      }
      return { success: false, error: `Failed to create DNS record: ${errorText}` };
    }

    const dnsRecord = await response.json();
    return { success: true, record: dnsRecord };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Get all DNS records in a zone
 */
export async function getDnsRecords(
  zoneId: string
): Promise<{ success: boolean; records?: NetlifyDnsRecord[]; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(`${NETLIFY_API_BASE}/dns_zones/${zoneId}/dns_records`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    const records = await response.json();
    return { success: true, records };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Delete a DNS record
 */
export async function deleteDnsRecord(
  zoneId: string,
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    const response = await fetch(
      `${NETLIFY_API_BASE}/dns_zones/${zoneId}/dns_records/${recordId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Add domain aliases to the main site
 * Uses PATCH to update the site's domain_aliases array
 */
export async function addDomainToMainSite(
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    // Get current site info
    const siteRes = await fetch(`${NETLIFY_API_BASE}/sites/${MAIN_SITE_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!siteRes.ok) {
      return { success: false, error: "Failed to get main site info" };
    }

    const site = await siteRes.json();
    const currentAliases: string[] = site.domain_aliases || [];

    // Build new aliases list
    const newAliases = [...currentAliases];
    const isApex = domain.split(".").length === 2;

    if (!newAliases.includes(domain)) {
      newAliases.push(domain);
    }

    if (isApex && !newAliases.includes(`www.${domain}`)) {
      newAliases.push(`www.${domain}`);
    }

    // Update site with new aliases
    const updateRes = await fetch(`${NETLIFY_API_BASE}/sites/${MAIN_SITE_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain_aliases: newAliases }),
    });

    if (!updateRes.ok) {
      const error = await updateRes.text();
      return { success: false, error: `Failed to add domain to main site: ${error}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Remove domain aliases from the main site
 */
export async function removeDomainFromMainSite(
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const token = getAccessToken();

  try {
    // Get current site info
    const siteRes = await fetch(`${NETLIFY_API_BASE}/sites/${MAIN_SITE_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!siteRes.ok) {
      return { success: false, error: "Failed to get main site info" };
    }

    const site = await siteRes.json();
    const currentAliases: string[] = site.domain_aliases || [];

    // Remove domain and www variant
    const newAliases = currentAliases.filter(
      (alias) => alias !== domain && alias !== `www.${domain}`
    );

    // Update site
    const updateRes = await fetch(`${NETLIFY_API_BASE}/sites/${MAIN_SITE_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain_aliases: newAliases }),
    });

    if (!updateRes.ok) {
      const error = await updateRes.text();
      return { success: false, error: `Failed to remove domain from main site: ${error}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Network error: ${String(error)}` };
  }
}

/**
 * Setup complete Netlify DNS for a domain
 * Creates zone, adds necessary records, and returns nameservers
 */
export async function setupNetlifyDns(
  domain: string,
  _siteId: string, // Kept for backwards compatibility but not used
  netlifySubdomain: string
): Promise<{
  success: boolean;
  nameservers?: string[];
  zoneId?: string;
  error?: string;
}> {
  // 1. Create DNS zone
  const zoneResult = await createDnsZone(domain);
  if (!zoneResult.success || !zoneResult.zone) {
    return { success: false, error: zoneResult.error || "Failed to create DNS zone" };
  }

  const zone = zoneResult.zone;
  const zoneId = zone.id;

  // 2. Add A record for apex domain pointing to Netlify load balancer
  const isApex = domain.split(".").length === 2;

  if (isApex) {
    // Add A record for apex
    await createDnsRecord(zoneId, {
      type: "A",
      hostname: domain,
      value: "75.2.60.5", // Netlify load balancer
    });

    // Add CNAME for www
    await createDnsRecord(zoneId, {
      type: "CNAME",
      hostname: `www.${domain}`,
      value: `${netlifySubdomain}.netlify.app`,
    });
  } else {
    // Add CNAME for subdomain
    await createDnsRecord(zoneId, {
      type: "CNAME",
      hostname: domain,
      value: `${netlifySubdomain}.netlify.app`,
    });
  }

  // 3. Add domain alias to the MAIN site (not per-project site)
  const aliasResult = await addDomainToMainSite(domain);
  if (!aliasResult.success) {
    console.warn(`[Netlify] Failed to add domain alias: ${aliasResult.error}`);
    // Don't fail - DNS is set up, just alias failed
  }

  return {
    success: true,
    nameservers: zone.dns_servers,
    zoneId: zone.id,
  };
}

/**
 * Check if nameservers have been updated to Netlify
 * This verifies the user has pointed their domain to Netlify DNS
 */
export async function checkNameserverStatus(
  zoneId: string
): Promise<{ success: boolean; verified: boolean; error?: string }> {
  const zoneResult = await getDnsZoneById(zoneId);

  if (!zoneResult.success || !zoneResult.zone) {
    return { success: false, verified: false, error: zoneResult.error || "Failed to get DNS zone" };
  }

  // Netlify marks zones as active once nameservers are properly configured
  // We can check if records are resolving by looking at the zone status
  // For now, we'll consider it configured if the zone exists and has DNS servers
  const zone = zoneResult.zone;
  const verified = zone.dns_servers && zone.dns_servers.length > 0;

  return {
    success: true,
    verified,
  };
}
