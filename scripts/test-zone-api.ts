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

const zoneId = process.argv[2] || "6979bd971e27710fb2a35a23";
const token = process.env.NETLIFY_ACCESS_TOKEN;

console.log(`Testing zone: ${zoneId}\n`);

async function main() {
  const response = await fetch(`https://api.netlify.com/api/v1/dns_zones/${zoneId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(`Status: ${response.status} ${response.statusText}`);

  const data = await response.json();
  console.log("\nResponse:");
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
