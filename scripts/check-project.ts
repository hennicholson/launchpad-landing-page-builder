import * as fs from "fs";
import * as path from "path";
import { neon } from "@neondatabase/serverless";

// Load env
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const [key, ...valueParts] = trimmed.split("=");
    let value = valueParts.join("=");
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  const domain = process.argv[2] || "skinny.codes";

  const rows = await sql`
    SELECT
      id,
      name,
      slug,
      netlify_id,
      netlify_site_name,
      live_url,
      is_published,
      custom_domain,
      custom_domain_status,
      use_netlify_dns,
      netlify_dns_zone_id
    FROM projects
    WHERE custom_domain = ${domain}
  `;

  if (rows.length === 0) {
    console.log(`No project found with domain: ${domain}`);
    return;
  }

  console.log("\nProject details:\n");
  const row = rows[0];
  console.log(`  ID:               ${row.id}`);
  console.log(`  Name:             ${row.name}`);
  console.log(`  Slug:             ${row.slug}`);
  console.log(`  Netlify ID:       ${row.netlify_id || "(not deployed)"}`);
  console.log(`  Netlify Name:     ${row.netlify_site_name || "(none)"}`);
  console.log(`  Live URL:         ${row.live_url || "(none)"}`);
  console.log(`  Published:        ${row.is_published}`);
  console.log(`  Custom Domain:    ${row.custom_domain}`);
  console.log(`  Domain Status:    ${row.custom_domain_status}`);
  console.log(`  Uses Netlify DNS: ${row.use_netlify_dns}`);
  console.log(`  DNS Zone ID:      ${row.netlify_dns_zone_id}`);

  // Check Netlify site domain aliases if we have a site ID
  if (row.netlify_id) {
    console.log("\n\nChecking Netlify site domain aliases...\n");

    const token = process.env.NETLIFY_ACCESS_TOKEN;
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${row.netlify_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const site = await response.json();
      console.log(`  Site Name:        ${site.name}`);
      console.log(`  Default URL:      ${site.ssl_url || site.url}`);
      console.log(`  Domain Aliases:   ${site.domain_aliases?.length ? site.domain_aliases.join(", ") : "(none)"}`);
      console.log(`  Custom Domain:    ${site.custom_domain || "(none)"}`);
    } else {
      console.log(`  Error fetching site: ${response.status} ${response.statusText}`);
    }
  }
}

main().catch(console.error);
