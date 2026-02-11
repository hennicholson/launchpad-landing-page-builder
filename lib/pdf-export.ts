import puppeteer from "puppeteer-core";

/**
 * Generate a PDF from HTML content using Puppeteer
 * Uses system Chrome for local dev, @sparticuz/chromium for serverless
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  let browser = null;

  try {
    const isDev = process.env.NODE_ENV === "development";

    let launchOptions: Parameters<typeof puppeteer.launch>[0];

    if (isDev) {
      // Local development: use system Chrome
      const chromePath =
        process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : process.platform === "win32"
            ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            : "/usr/bin/google-chrome";

      launchOptions = {
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      };
    } else {
      // Production: use @sparticuz/chromium for serverless
      const chromium = await import("@sparticuz/chromium");
      launchOptions = {
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      };
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // Set viewport for document-style rendering
    await page.setViewport({ width: 850, height: 1100 });

    // Set the HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0", // Wait for all resources to load
    });

    // Wait for fonts to load
    await page.evaluateHandle("document.fonts.ready");

    // Wait for styles to fully render
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));

    // Generate PDF with Letter format
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true, // Include background colors/images
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
