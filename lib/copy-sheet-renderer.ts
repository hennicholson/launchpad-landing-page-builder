/**
 * Render a clean, print-friendly HTML document for the copy sheet
 */

import type { SectionCopy, CopyItem, ItemCopy } from "./copy-extractor";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Render a single copy item
 */
function renderCopyItem(item: CopyItem, indent: number = 0): string {
  const indentClass = indent > 0 ? `padding-left: ${indent * 24}px;` : "";
  const linkHtml = item.link
    ? `<span class="link">→ ${escapeHtml(item.link)}</span>`
    : "";

  return `
    <div class="copy-item" style="${indentClass}">
      <span class="label">${escapeHtml(item.label)}:</span>
      <span class="value">"${escapeHtml(item.value)}"</span>
      ${linkHtml}
    </div>
  `;
}

/**
 * Render an item group (feature, testimonial, pricing tier, etc.)
 */
function renderItemGroup(item: ItemCopy, index: number): string {
  const itemsHtml = item.content.map((ci) => renderCopyItem(ci, 1)).join("");

  return `
    <div class="item-group">
      <div class="item-title">${escapeHtml(item.title)}</div>
      ${itemsHtml}
    </div>
  `;
}

/**
 * Render a section
 */
function renderSection(section: SectionCopy): string {
  const contentHtml = section.content.map((item) => renderCopyItem(item)).join("");

  const itemsHtml = section.items
    ? section.items.map((item, i) => renderItemGroup(item, i)).join("")
    : "";

  return `
    <div class="section">
      <div class="section-header">
        <span class="section-type">${escapeHtml(section.sectionType.toUpperCase())}</span>
      </div>
      <div class="section-content">
        ${contentHtml}
        ${itemsHtml}
      </div>
    </div>
  `;
}

/**
 * Generate complete HTML for the copy sheet
 */
export function renderCopySheet(projectName: string, sections: SectionCopy[]): string {
  const sectionsHtml = sections.map(renderSection).join("");
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Launchpad logo as base64 data URL for reliable embedding in PDF
  const logoDataUrl = "data:image/png;base64,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";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectName)} - Copy Reference Sheet</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 48px;
      max-width: 900px;
      margin: 0 auto;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Header */
    .header {
      margin-bottom: 48px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f97316;
    }

    .header-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .logo {
      height: 36px;
      width: auto;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
      color: #0a0a0a;
    }

    .header .subtitle {
      font-size: 16px;
      color: #525252;
    }

    .header .date {
      font-size: 13px;
      color: #737373;
      margin-top: 4px;
    }

    /* Section */
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .section-header {
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }

    .section-type {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #fff;
      background: linear-gradient(135deg, #f97316, #ea580c);
      padding: 5px 12px;
      border-radius: 6px;
      display: inline-block;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .section-content {
      padding-left: 4px;
    }

    /* Copy item */
    .copy-item {
      margin-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: baseline;
    }

    .copy-item .label {
      font-weight: 600;
      color: #525252;
      min-width: 140px;
      flex-shrink: 0;
      font-size: 13px;
    }

    .copy-item .value {
      color: #1a1a1a;
      flex: 1;
      word-break: break-word;
    }

    .copy-item .link {
      font-size: 12px;
      color: #f97316;
      width: 100%;
      padding-left: 148px;
      word-break: break-all;
    }

    /* Item group (features, testimonials, etc.) */
    .item-group {
      margin-top: 20px;
      margin-bottom: 20px;
      padding: 16px;
      background: #fafafa;
      border-radius: 10px;
      border: 1px solid #e5e5e5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .item-title {
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 12px;
      color: #0a0a0a;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;
    }

    .item-group .copy-item {
      margin-bottom: 8px;
    }

    .item-group .copy-item .label {
      min-width: 100px;
    }

    .item-group .copy-item .link {
      padding-left: 108px;
    }

    /* Footer */
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #737373;
      font-size: 12px;
    }

    .footer img {
      height: 20px;
      width: auto;
    }

    /* Print styles */
    @media print {
      body {
        padding: 24px;
        font-size: 12px;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <img src="${logoDataUrl}" alt="Launchpad" class="logo" />
    </div>
    <h1>${escapeHtml(projectName)}</h1>
    <div class="subtitle">Copy Reference Sheet</div>
    <div class="date">Generated: ${date}</div>
  </div>

  ${sectionsHtml}

  <div class="footer">
    <span>Powered by</span>
    <img src="${logoDataUrl}" alt="Launchpad" />
  </div>
</body>
</html>`;
}
