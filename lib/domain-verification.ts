import * as dns from "dns";
import { promisify } from "util";
import type { DomainType } from "./schema";

const resolveTxt = promisify(dns.resolveTxt);

// Netlify's load balancer IP for apex domains
export const NETLIFY_LOAD_BALANCER_IP = "75.2.60.5";

export type DnsInstruction = {
  recordType: "CNAME" | "A" | "TXT" | "ALIAS";
  host: string;
  value: string;
  purpose: "verification" | "routing";
  required: boolean;
};

/**
 * Check if a domain is an apex domain (e.g., example.com) vs subdomain (e.g., app.example.com)
 * Note: This is a simple check that works for most common TLDs.
 * For complex TLDs like co.uk, the logic may need adjustment.
 */
export function isApexDomain(domain: string): boolean {
  const parts = domain.toLowerCase().split(".");

  // Handle common multi-part TLDs
  const multiPartTLDs = ["co.uk", "com.au", "co.nz", "com.br", "co.jp"];
  const domainLower = domain.toLowerCase();

  for (const tld of multiPartTLDs) {
    if (domainLower.endsWith(`.${tld}`)) {
      // For multi-part TLDs, apex has 3 parts (example.co.uk)
      return parts.length === 3;
    }
  }

  // For standard TLDs, apex has 2 parts (example.com)
  return parts.length === 2;
}

/**
 * Detect the domain type
 */
export function getDomainType(domain: string): DomainType {
  return isApexDomain(domain) ? "apex" : "subdomain";
}

/**
 * Generate a unique verification token
 */
export function generateVerificationToken(): string {
  // Generate a random string without dashes, 24 chars
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Get the TXT record host for domain verification
 */
export function getVerificationHost(domain: string): string {
  return `_launchpad.${domain}`;
}

/**
 * Get the expected verification TXT record value
 */
export function getVerificationValue(token: string): string {
  return `launchpad-verify=${token}`;
}

/**
 * Verify domain ownership by checking DNS TXT record
 */
export async function verifyDomainOwnership(
  domain: string,
  verificationToken: string
): Promise<{ verified: boolean; error?: string }> {
  const txtHost = getVerificationHost(domain);
  const expectedValue = getVerificationValue(verificationToken);

  try {
    const records = await resolveTxt(txtHost);
    // TXT records come as arrays of strings, flatten them
    const flatRecords = records.flat();

    if (flatRecords.some((record) => record.includes(expectedValue))) {
      return { verified: true };
    }

    return {
      verified: false,
      error: `TXT record not found. Expected "${expectedValue}" at ${txtHost}`,
    };
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === "ENODATA" || err.code === "ENOTFOUND") {
      return {
        verified: false,
        error: `No TXT record found at ${txtHost}. Please add the verification record and try again.`,
      };
    }
    return {
      verified: false,
      error: `DNS lookup failed: ${err.code || "Unknown error"}`,
    };
  }
}

/**
 * Get DNS instructions for setting up a custom domain
 */
export function getDnsInstructions(
  domain: string,
  netlifyTarget: string,
  verificationToken: string
): DnsInstruction[] {
  const domainType = getDomainType(domain);
  const instructions: DnsInstruction[] = [];

  // Always add verification TXT record first
  instructions.push({
    recordType: "TXT",
    host: getVerificationHost(domain),
    value: getVerificationValue(verificationToken),
    purpose: "verification",
    required: true,
  });

  if (domainType === "apex") {
    // Apex domains need an A record (or ALIAS if supported)
    instructions.push({
      recordType: "A",
      host: domain,
      value: NETLIFY_LOAD_BALANCER_IP,
      purpose: "routing",
      required: true,
    });

    // Also suggest ALIAS as alternative for DNS providers that support it
    instructions.push({
      recordType: "ALIAS",
      host: domain,
      value: netlifyTarget,
      purpose: "routing",
      required: false, // Alternative to A record
    });
  } else {
    // Subdomains use CNAME
    instructions.push({
      recordType: "CNAME",
      host: domain,
      value: netlifyTarget,
      purpose: "routing",
      required: true,
    });
  }

  return instructions;
}

/**
 * Validate domain format
 */
export function validateDomainFormat(domain: string): {
  valid: boolean;
  error?: string;
  normalizedDomain?: string;
} {
  // Remove any protocol prefix
  let cleaned = domain
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, ""); // Remove trailing paths

  // Remove www. prefix if present (user should add www separately if needed)
  if (cleaned.startsWith("www.")) {
    cleaned = cleaned.slice(4);
  }

  // Basic hostname validation
  const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

  if (!hostnameRegex.test(cleaned)) {
    return {
      valid: false,
      error: "Invalid domain format. Please enter a valid domain like example.com or app.example.com",
    };
  }

  // Check for reserved/internal domains
  const reservedPatterns = [
    /\.local$/,
    /\.localhost$/,
    /\.test$/,
    /\.example$/,
    /\.invalid$/,
    /netlify\.app$/,
    /netlify\.com$/,
    /onwhop\.com$/,
  ];

  for (const pattern of reservedPatterns) {
    if (pattern.test(cleaned)) {
      return {
        valid: false,
        error: "This domain cannot be used. Please use your own domain.",
      };
    }
  }

  return { valid: true, normalizedDomain: cleaned };
}

/**
 * Check if domain has CNAME/A record pointing to Netlify
 * This is used to verify routing after ownership is verified
 */
export async function verifyDomainRouting(
  domain: string,
  netlifyTarget: string
): Promise<{ routed: boolean; error?: string }> {
  const domainType = getDomainType(domain);

  try {
    if (domainType === "apex") {
      // Check A record for apex domains
      const resolve4 = promisify(dns.resolve4);
      const addresses = await resolve4(domain);

      if (addresses.includes(NETLIFY_LOAD_BALANCER_IP)) {
        return { routed: true };
      }
      return {
        routed: false,
        error: `A record not pointing to Netlify. Expected ${NETLIFY_LOAD_BALANCER_IP}`,
      };
    } else {
      // Check CNAME for subdomains
      const resolveCname = promisify(dns.resolveCname);
      const cnames = await resolveCname(domain);

      if (cnames.some((cname) => cname.includes("netlify"))) {
        return { routed: true };
      }
      return {
        routed: false,
        error: `CNAME not pointing to Netlify. Expected ${netlifyTarget}`,
      };
    }
  } catch (error: unknown) {
    const err = error as { code?: string };
    return {
      routed: false,
      error: `DNS lookup failed: ${err.code || "Unknown error"}`,
    };
  }
}
