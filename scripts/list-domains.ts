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
  const rows = await sql`
    SELECT
      id,
      name,
      custom_domain,
      custom_domain_status,
      use_netlify_dns,
      netlify_dns_zone_id
    FROM projects
    WHERE custom_domain IS NOT NULL
    LIMIT 10
  `;
  console.log("\nProjects with custom domains:\n");
  console.table(rows);
}

main().catch(console.error);
