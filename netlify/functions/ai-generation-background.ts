/**
 * Background AI Generation Function
 * Runs for up to 15 minutes - handles long-running AI page generation
 */

import type { Handler, HandlerEvent } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import Anthropic from "@anthropic-ai/sdk";

// Re-define schema for the function (can't use @/ imports in Netlify functions)
const aiGenerations = pgTable("ai_generations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(),
  input: jsonb("input"),
  result: jsonb("result"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Initialize database
function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  const sqlClient = neon(dbUrl);
  return drizzle(sqlClient);
}

// Initialize Anthropic client
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_ORCHESTRATOR_KEY || process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_ORCHESTRATOR_KEY not set");
  return new Anthropic({ apiKey });
}

// Section types for landing pages
const SECTION_TYPES = ["header", "hero", "features", "testimonials", "pricing", "faq", "cta", "footer"];

// Generate a landing page using Claude
async function generateLandingPage(
  description: string,
  wizardData?: {
    businessName?: string;
    productDescription?: string;
    targetAudience?: string;
    colorTheme?: string;
    vibe?: string;
    fontPair?: string;
    pageType?: string;
  }
): Promise<object> {
  const client = getAnthropicClient();

  // Build the prompt
  const systemPrompt = `You are an expert landing page designer and copywriter. Generate a complete landing page as JSON.

The page must include these sections in order: ${SECTION_TYPES.join(", ")}

For each section, generate:
- id: 7 random alphanumeric characters
- type: the section type
- content: { heading, subheading, bodyText, buttonText, backgroundColor, textColor, accentColor, ...other fields }
- items: array of items (for features, testimonials, pricing, faq)

Colors should use hex format. Use the provided color theme and vibe.

Return ONLY valid JSON in this exact format:
{
  "title": "Page Title",
  "description": "Meta description",
  "sections": [...],
  "colorScheme": { "primary": "#hex", "secondary": "#hex", "accent": "#hex", "background": "#hex", "text": "#hex" },
  "typography": { "headingFont": "Inter", "bodyFont": "Inter" }
}`;

  const userPrompt = wizardData ? `
Create a landing page for:
Business: ${wizardData.businessName || "Unknown"}
Product/Service: ${wizardData.productDescription || description}
Target Audience: ${wizardData.targetAudience || "General audience"}
Color Theme: ${wizardData.colorTheme || "dark"}
Vibe: ${wizardData.vibe || "modern"}
Typography: ${wizardData.fontPair || "inter-inter"}
Page Type: ${wizardData.pageType || "landing"}

Write compelling, conversion-focused copy. NO placeholder text.
` : `Create a landing page for: ${description}

Write compelling, conversion-focused copy. NO placeholder text.`;

  console.log("  - Calling Claude API...");
  const startTime = Date.now();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const elapsed = Date.now() - startTime;
  console.log(`  - Claude response received in ${elapsed}ms`);

  // Extract text content
  const textContent = response.content.find(c => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from Claude");
  }

  // Parse JSON from response
  let jsonText = textContent.text;

  // Clean up markdown code blocks if present
  if (jsonText.includes("```json")) {
    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (jsonText.includes("```")) {
    jsonText = jsonText.replace(/```\n?/g, "");
  }

  jsonText = jsonText.trim();

  try {
    const pageData = JSON.parse(jsonText);
    console.log("  - Successfully parsed page JSON");
    return pageData;
  } catch (parseError) {
    console.error("  - Failed to parse JSON:", parseError);
    console.error("  - Raw response:", jsonText.slice(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }
}

// Main handler
export const handler: Handler = async (event: HandlerEvent) => {
  console.log("=== AI-GENERATION-BACKGROUND FUNCTION INVOKED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("ENV CHECK - DATABASE_URL:", !!process.env.DATABASE_URL);
  console.log("ENV CHECK - ANTHROPIC_ORCHESTRATOR_KEY:", !!process.env.ANTHROPIC_ORCHESTRATOR_KEY);

  let generationId: string | null = null;

  try {
    // Parse request body
    console.log("[STEP 1] Parsing request body...");
    const body = JSON.parse(event.body || "{}");
    generationId = body.generationId;
    const { description, wizardData } = body;

    console.log("  - generationId:", generationId);
    console.log("  - description length:", description?.length || 0);
    console.log("  - wizardData:", !!wizardData);

    if (!generationId || !description) {
      console.error("[STEP 1] ✗ FAILED - Missing required parameters");
      return { statusCode: 400, body: "Missing generationId or description" };
    }
    console.log("[STEP 1] ✓ Parameters valid");

    // Connect to database and update status
    console.log("[STEP 2] Connecting to database...");
    const db = getDb();
    await db.update(aiGenerations)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(aiGenerations.id, generationId));
    console.log("[STEP 2] ✓ Status updated to 'generating'");

    // Generate the landing page
    console.log("[STEP 3] Generating landing page...");
    const pageData = await generateLandingPage(description, wizardData);
    console.log("[STEP 3] ✓ Page generated successfully");

    // Save result to database
    console.log("[STEP 4] Saving result to database...");
    await db.update(aiGenerations)
      .set({
        status: "complete",
        result: pageData,
        updatedAt: new Date(),
      })
      .where(eq(aiGenerations.id, generationId));
    console.log("[STEP 4] ✓ Result saved");

    console.log("=== AI-GENERATION-BACKGROUND COMPLETED SUCCESSFULLY ===");
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error("=== AI-GENERATION-BACKGROUND FATAL ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    // Update database with error
    try {
      if (generationId) {
        const db = getDb();
        await db.update(aiGenerations)
          .set({
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date(),
          })
          .where(eq(aiGenerations.id, generationId));
      }
    } catch (dbError) {
      console.error("Failed to update generation status:", dbError);
    }

    return { statusCode: 500, body: "Generation failed" };
  }
};

export const config = {
  type: "background",
};
