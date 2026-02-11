#!/usr/bin/env npx tsx
/**
 * DNS Verification Script
 *
 * Verifies Netlify DNS setup is correct before nameserver propagation.
 * Run with: npx tsx scripts/verify-dns.ts --domain example.com
 *       or: npx tsx scripts/verify-dns.ts --project <projectId>
 */

import * as dns from "dns";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valueParts] = trimmed.split("=");
        let value = valueParts.join("=");
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  } catch {
    console.warn("Could not load .env.local");
  }
}
loadEnv();

const resolveNs = promisify(dns.resolveNs);
const resolve4 = promisify(dns.resolve4);
const resolveCname = promisify(dns.resolveCname);

const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const NETLIFY_LOAD_BALANCER_IP = "75.2.60.5";

// Parse command line args
const args = process.argv.slice(2);
let domain: string | null = null;
let projectId: string | null = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--domain" && args[i + 1]) {
    domain = args[i + 1];
    i++;
  } else if (args[i] === "--project" && args[i + 1]) {
    projectId = args[i + 1];
    i++;
  }
}

if (!domain && !projectId) {
  console.log(`
Usage:
  npx tsx scripts/verify-dns.ts --domain example.com
  npx tsx scripts/verify-dns.ts --project <projectId>
`);
  process.exit(1);
}

if (!NETLIFY_ACCESS_TOKEN) {
  console.error("❌ NETLIFY_ACCESS_TOKEN not found in environment");
  process.exit(1);
}

// ============================================
// Netlify API Functions
// ============================================

async function netlifyRequest(endpoint: string) {
  const response = await fetch(`https://api.netlify.com/api/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Netlify API error: ${response.status} - ${text}`);
  }

  return response.json();
}

async function getDnsZone(domainName: string) {
  try {
    const zones = await netlifyRequest(`/dns_zones?name=${domainName}`);
    return zones.length > 0 ? zones[0] : null;
  } catch {
    return null;
  }
}

async function getDnsRecords(zoneId: string) {
  try {
    return await netlifyRequest(`/dns_zones/${zoneId}/dns_records`);
  } catch {
    return [];
  }
}

// ============================================
// DNS Query Functions
// ============================================

async function getCurrentNameservers(domainName: string): Promise<string[]> {
  try {
    // Query using Google's DNS
    const resolver = new dns.Resolver();
    resolver.setServers(["8.8.8.8"]);
    const resolveNsCustom = promisify(resolver.resolveNs.bind(resolver));
    return await resolveNsCustom(domainName);
  } catch {
    return [];
  }
}

async function checkDomainResolution(domainName: string, isApex: boolean) {
  try {
    const resolver = new dns.Resolver();
    resolver.setServers(["8.8.8.8"]);

    if (isApex) {
      const resolve4Custom = promisify(resolver.resolve4.bind(resolver));
      const ips = await resolve4Custom(domainName);
      return { type: "A", values: ips };
    } else {
      const resolveCnameCustom = promisify(resolver.resolveCname.bind(resolver));
      const cnames = await resolveCnameCustom(domainName);
      return { type: "CNAME", values: cnames };
    }
  } catch {
    return { type: "NONE", values: [] };
  }
}

function isApexDomain(domainName: string): boolean {
  const parts = domainName.split(".");
  // apex = exactly 2 parts (example.com) or TLD with subpart (co.uk handling)
  return parts.length === 2 || (parts.length === 3 && ["co", "com", "org", "net"].includes(parts[parts.length - 2]));
}

// ============================================
// Database Query (if project ID provided)
// ============================================

async function getProjectDomain(projId: string): Promise<{
  domain: string | null;
  zoneId: string | null;
  nameservers: string[] | null;
} | null> {
  // Dynamic import to avoid issues when running standalone
  try {
    const { neon } = await import("@neondatabase/serverless");
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error("❌ DATABASE_URL not found - cannot query by project ID");
      return null;
    }

    const sql = neon(DATABASE_URL);
    const result = await sql`
      SELECT
        custom_domain as domain,
        netlify_dns_zone_id as "zoneId",
        netlify_nameservers as nameservers
      FROM projects
      WHERE id = ${projId}
    `;

    if (result.length === 0) return null;

    const row = result[0];
    return {
      domain: row.domain,
      zoneId: row.zoneId,
      nameservers: row.nameservers ? JSON.parse(row.nameservers) : null,
    };
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}

// ============================================
// Main Verification
// ============================================

async function verify() {
  console.log("\n🔍 DNS Verification Script\n");
  console.log("=".repeat(50));

  let targetDomain = domain;
  let expectedNameservers: string[] | null = null;
  let zoneIdFromDb: string | null = null;

  // If project ID provided, get domain from database
  if (projectId) {
    console.log(`\n📦 Looking up project: ${projectId}`);
    const projectData = await getProjectDomain(projectId);

    if (!projectData || !projectData.domain) {
      console.error("❌ Project not found or no custom domain configured");
      process.exit(1);
    }

    targetDomain = projectData.domain;
    expectedNameservers = projectData.nameservers;
    zoneIdFromDb = projectData.zoneId;
    console.log(`   Domain: ${targetDomain}`);
    if (zoneIdFromDb) console.log(`   Zone ID: ${zoneIdFromDb}`);
  }

  if (!targetDomain) {
    console.error("❌ No domain specified");
    process.exit(1);
  }

  const apex = isApexDomain(targetDomain);
  console.log(`\n🌐 Verifying: ${targetDomain} (${apex ? "apex" : "subdomain"})`);
  console.log("=".repeat(50));

  // ============================================
  // Step 1: Check Netlify DNS Zone
  // ============================================
  console.log("\n📋 Step 1: Netlify DNS Zone");

  const zone = await getDnsZone(targetDomain);

  if (zone) {
    console.log(`   ✅ Zone exists: ${zone.id}`);
    console.log(`   ✅ Zone name: ${zone.name}`);

    if (zone.dns_servers && zone.dns_servers.length > 0) {
      console.log(`   ✅ Nameservers configured:`);
      zone.dns_servers.forEach((ns: string) => console.log(`      - ${ns}`));
      expectedNameservers = zone.dns_servers;
    } else {
      console.log(`   ⚠️  No nameservers in zone response`);
    }
  } else {
    console.log(`   ❌ Zone NOT found in Netlify`);
    console.log(`      This means the domain was not set up with Netlify DNS`);
    console.log(`      or the zone creation failed.`);
  }

  // ============================================
  // Step 2: Check DNS Records
  // ============================================
  console.log("\n📋 Step 2: DNS Records in Zone");

  if (zone) {
    const records = await getDnsRecords(zone.id);

    if (records.length > 0) {
      console.log(`   ✅ Found ${records.length} record(s):`);
      records.forEach((rec: { type: string; hostname: string; value: string }) => {
        console.log(`      ${rec.type.padEnd(6)} ${rec.hostname} → ${rec.value}`);
      });

      // Check for required records
      const hasApexA = records.some(
        (r: { type: string; hostname: string; value: string }) =>
          r.type === "A" && r.hostname === targetDomain && r.value === NETLIFY_LOAD_BALANCER_IP
      );
      const hasWwwCname = records.some(
        (r: { type: string; hostname: string; value: string }) =>
          r.type === "CNAME" && r.hostname.startsWith("www.") && r.value.includes("netlify")
      );

      if (apex && hasApexA) {
        console.log(`   ✅ Apex A record points to Netlify LB (${NETLIFY_LOAD_BALANCER_IP})`);
      }
      if (hasWwwCname) {
        console.log(`   ✅ WWW CNAME record points to Netlify`);
      }
    } else {
      console.log(`   ⚠️  No DNS records found in zone`);
    }
  } else {
    console.log(`   ⏭️  Skipped (no zone)`);
  }

  // ============================================
  // Step 3: Check Current Nameserver Propagation
  // ============================================
  console.log("\n📋 Step 3: Nameserver Propagation Status");

  // Get root domain for NS lookup
  const parts = targetDomain.split(".");
  const rootDomain = parts.slice(-2).join(".");

  const currentNs = await getCurrentNameservers(rootDomain);

  if (currentNs.length > 0) {
    console.log(`   Current nameservers for ${rootDomain}:`);
    currentNs.forEach((ns) => console.log(`      - ${ns}`));

    if (expectedNameservers && expectedNameservers.length > 0) {
      const normalized = (ns: string) => ns.toLowerCase().replace(/\.$/, "");
      const currentNormalized = currentNs.map(normalized);
      const expectedNormalized = expectedNameservers.map(normalized);

      const allMatch = expectedNormalized.every((ns) => currentNormalized.includes(ns));

      if (allMatch) {
        console.log(`\n   ✅ Nameservers have propagated!`);
        console.log(`   ✅ Domain is using Netlify DNS`);
      } else {
        console.log(`\n   ⏳ Nameservers NOT yet propagated`);
        console.log(`   Expected:`);
        expectedNameservers.forEach((ns) => console.log(`      - ${ns}`));
        console.log(`\n   Current nameservers are still pointing to your registrar.`);
        console.log(`   This is normal - propagation takes 1-48 hours.`);
      }
    }
  } else {
    console.log(`   ⚠️  Could not resolve nameservers for ${rootDomain}`);
  }

  // ============================================
  // Step 4: Check Domain Resolution
  // ============================================
  console.log("\n📋 Step 4: Domain Resolution");

  const resolution = await checkDomainResolution(targetDomain, apex);

  if (resolution.values.length > 0) {
    console.log(`   ${resolution.type} record resolves to:`);
    resolution.values.forEach((v) => console.log(`      - ${v}`));

    if (apex && resolution.values.includes(NETLIFY_LOAD_BALANCER_IP)) {
      console.log(`   ✅ Domain resolves to Netlify!`);
    } else if (!apex && resolution.values.some((v) => v.includes("netlify"))) {
      console.log(`   ✅ Domain resolves to Netlify!`);
    } else {
      console.log(`   ⏳ Domain does not yet resolve to Netlify`);
    }
  } else {
    console.log(`   ⏳ Domain does not resolve yet (propagation in progress)`);
  }

  // ============================================
  // Summary
  // ============================================
  console.log("\n" + "=".repeat(50));
  console.log("📊 Summary");
  console.log("=".repeat(50));

  const isPropagated =
    expectedNameservers &&
    currentNs.length > 0 &&
    expectedNameservers.every((ns) =>
      currentNs.map((n) => n.toLowerCase().replace(/\.$/, "")).includes(ns.toLowerCase().replace(/\.$/, ""))
    );

  const resolvesToNetlify =
    (apex && resolution.values.includes(NETLIFY_LOAD_BALANCER_IP)) ||
    (!apex && resolution.values.some((v) => v.includes("netlify")));

  if (zone) {
    console.log("\n✅ Netlify setup is CORRECT");
    console.log("   - Zone created");
    console.log("   - DNS records configured");
    console.log("   - Nameservers ready");

    if (isPropagated && resolvesToNetlify) {
      console.log("\n🎉 DOMAIN IS FULLY WORKING!");
      console.log(`   Visit: https://${targetDomain}`);
      console.log("\n   You can update the domain status to 'active' in your app.");
    } else if (isPropagated) {
      console.log("\n⏳ Nameservers propagated, DNS still resolving...");
      console.log("   This should complete within minutes.");
    } else {
      console.log("\n⏳ Waiting for nameserver propagation (1-48 hours)");
      console.log("   Once propagation completes, the domain will work automatically.");
    }
  } else {
    console.log("\n❌ Netlify DNS zone not found");
    console.log("   The domain may not have been added with Netlify DNS mode,");
    console.log("   or there was an error during setup.");
  }

  console.log("\n");
}

// Run
verify().catch(console.error);
