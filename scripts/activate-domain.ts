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
    console.log("Usage: npx tsx scripts/activate-domain.ts <domain>");
    process.exit(1);
  }

  console.log(`Activating domain: ${domain}`);

  const result = await sql`
    UPDATE projects
    SET
      custom_domain_status = 'active',
      custom_domain_verified_at = NOW(),
      custom_domain_error = NULL,
      updated_at = NOW()
    WHERE custom_domain = ${domain}
    RETURNING id, name, custom_domain, custom_domain_status
  `;

  if (result.length === 0) {
    console.log("❌ No project found with that domain");
    process.exit(1);
  }

  console.log("✅ Domain activated!");
  console.table(result);
}

main().catch(console.error);
