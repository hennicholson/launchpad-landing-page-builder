/**
 * Background PDF Export Function
 * Runs for up to 15 minutes - handles long-running PDF generation with Chromium
 */

import type { Handler, HandlerEvent } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import puppeteer from "puppeteer-core";

// Re-define schema for the function (can't use @/ imports in Netlify functions)
const pdfExports = pgTable("pdf_exports", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  projectId: uuid("project_id").notNull(),
  status: text("status").notNull(),
  fileData: text("file_data"),
  fileName: text("file_name"),
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

// Generate PDF from HTML using puppeteer
async function generatePdfFromHtml(html: string): Promise<Buffer> {
  let browser = null;

  try {
    // Import chromium for serverless
    const chromium = await import("@sparticuz/chromium");

    const launchOptions = {
      args: chromium.default.args,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    };

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Set viewport for document-style rendering
    await page.setViewport({ width: 850, height: 1100 });

    // Set the HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Wait for styles to fully render
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

    // Generate PDF with Letter format
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Main handler
export const handler: Handler = async (event: HandlerEvent) => {
  console.log("=== PDF-EXPORT-BACKGROUND FUNCTION INVOKED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("ENV CHECK - DATABASE_URL:", !!process.env.DATABASE_URL);

  let exportId: string | null = null;

  try {
    // Parse request body
    console.log("[STEP 1] Parsing request body...");
    const body = JSON.parse(event.body || "{}");
    exportId = body.exportId;
    const { html, fileName } = body;

    console.log("  - exportId:", exportId);
    console.log("  - html length:", html?.length || 0);
    console.log("  - fileName:", fileName);

    if (!exportId || !html) {
      console.error("[STEP 1] FAILED - Missing required parameters");
      return { statusCode: 400, body: "Missing exportId or html" };
    }
    console.log("[STEP 1] Parameters valid");

    // Connect to database and update status
    console.log("[STEP 2] Connecting to database...");
    const db = getDb();
    await db.update(pdfExports)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(pdfExports.id, exportId));
    console.log("[STEP 2] Status updated to 'generating'");

    // Generate PDF
    console.log("[STEP 3] Generating PDF...");
    const pdfBuffer = await generatePdfFromHtml(html);
    const base64Pdf = pdfBuffer.toString("base64");
    console.log("[STEP 3] PDF generated successfully, size:", pdfBuffer.length);

    // Save result to database
    console.log("[STEP 4] Saving result to database...");
    await db.update(pdfExports)
      .set({
        status: "complete",
        fileData: base64Pdf,
        fileName: fileName || "export.pdf",
        updatedAt: new Date(),
      })
      .where(eq(pdfExports.id, exportId));
    console.log("[STEP 4] Result saved");

    console.log("=== PDF-EXPORT-BACKGROUND COMPLETED SUCCESSFULLY ===");
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error("=== PDF-EXPORT-BACKGROUND FATAL ERROR ===");
    console.error("Error:", error instanceof Error ? error.message : String(error));
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    // Update database with error
    try {
      if (exportId) {
        const db = getDb();
        await db.update(pdfExports)
          .set({
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date(),
          })
          .where(eq(pdfExports.id, exportId));
      }
    } catch (dbError) {
      console.error("Failed to update export status:", dbError);
    }

    return { statusCode: 500, body: "PDF generation failed" };
  }
};

export const config = {
  type: "background",
};
