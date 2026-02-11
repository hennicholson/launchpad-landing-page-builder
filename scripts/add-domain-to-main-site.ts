import * as fs from "fs";
import * as path from "path";

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

const MAIN_SITE_ID = "475f6573-8400-4bdc-add7-a776a299f083";
const domain = process.argv[2];

if (!domain) {
  console.log("Usage: npx tsx scripts/add-domain-to-main-site.ts <domain>");
  process.exit(1);
}

const token = process.env.NETLIFY_ACCESS_TOKEN;

async function main() {
  console.log(`\nAdding ${domain} to main Netlify site...\n`);

  // First get current site info
  const siteRes = await fetch(`https://api.netlify.com/api/v1/sites/${MAIN_SITE_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!siteRes.ok) {
    console.error(`Failed to get site: ${siteRes.status}`);
    return;
  }

  const site = await siteRes.json();
  console.log(`Site: ${site.name}`);
  console.log(`Current aliases: ${site.domain_aliases?.join(", ") || "(none)"}`);

  // Try PATCH to update site with domain_aliases
  const currentAliases = site.domain_aliases || [];
  const newAliases = [...currentAliases, domain];

  // For apex domains, also add www
  if (domain.split(".").length === 2) {
    newAliases.push(`www.${domain}`);
  }

  console.log(`\nAdding aliases: ${newAliases.join(", ")}`);

  const updateRes = await fetch(`https://api.netlify.com/api/v1/sites/${MAIN_SITE_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain_aliases: newAliases }),
  });

  if (!updateRes.ok) {
    const error = await updateRes.text();
    console.error(`\nFailed to update site: ${updateRes.status}`);
    console.error(error);
    return;
  }

  console.log(`\n✅ Added domains to site!`)

  // Verify
  const verifyRes = await fetch(`https://api.netlify.com/api/v1/sites/${MAIN_SITE_ID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const updated = await verifyRes.json();
  console.log(`\nUpdated aliases: ${updated.domain_aliases?.join(", ") || "(none)"}`);
}

main().catch(console.error);
