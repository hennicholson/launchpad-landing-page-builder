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
  const domain = process.argv[2];

  if (!domain) {
    console.log("Usage: npx tsx scripts/publish-project.ts <domain>");
    process.exit(1);
  }

  console.log(`\nPublishing project with domain: ${domain}\n`);

  const result = await sql`
    UPDATE projects
    SET is_published = true
    WHERE custom_domain = ${domain}
    RETURNING id, name, slug, is_published
  `;

  if (result.length === 0) {
    console.log("No project found with that domain.");
    return;
  }

  console.log("Updated project:");
  console.log(`  ID: ${result[0].id}`);
  console.log(`  Name: ${result[0].name}`);
  console.log(`  Slug: ${result[0].slug}`);
  console.log(`  Published: ${result[0].is_published}`);
}

main().catch(console.error);
