import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const val = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = val;
}

const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  // Check if table exists
  const exists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'form_submissions'
    )
  `;

  if (exists[0].exists) {
    console.log("form_submissions table already exists");

    // Add notes column if it doesn't exist
    await sql`ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS notes TEXT`;
    console.log("Ensured notes column exists");

    return;
  }

  console.log("Creating form_submissions table...");
  await sql`
    CREATE TABLE form_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id),
      email TEXT,
      fields JSONB,
      section_id TEXT,
      section_type TEXT,
      source_url TEXT,
      referrer TEXT,
      user_agent TEXT,
      ip_country TEXT,
      session_id TEXT,
      is_read TEXT DEFAULT 'false',
      notes TEXT,
      created_at TIMESTAMP DEFAULT now()
    )
  `;
  console.log("form_submissions table created successfully!");
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
