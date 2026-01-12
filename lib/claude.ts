import Anthropic from "@anthropic-ai/sdk";
import type { LandingPage, PageSection, SectionType } from "./page-schema";
import { generateId } from "./page-schema";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const LANDING_PAGE_SCHEMA = `
{
  "title": "string - Page title for SEO",
  "description": "string - Meta description for SEO",
  "sections": [
    {
      "id": "string - unique identifier",
      "type": "hero | features | testimonials | pricing | cta | faq",
      "content": {
        "heading": "string",
        "subheading": "string (optional)",
        "bodyText": "string (optional)",
        "buttonText": "string (optional)",
        "buttonLink": "string (optional)",
        "backgroundColor": "hex color",
        "textColor": "hex color",
        "layout": "left | right | center | grid"
      },
      "items": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "icon": "string (optional)",
          "imageUrl": "string (optional)",
          "price": "string (optional, for pricing)",
          "features": ["string array (optional, for pricing)"],
          "author": "string (optional, for testimonials)",
          "role": "string (optional, for testimonials)"
        }
      ]
    }
  ],
  "colorScheme": {
    "primary": "hex color",
    "secondary": "hex color",
    "accent": "hex color",
    "background": "hex color",
    "text": "hex color"
  },
  "typography": {
    "headingFont": "Inter | Poppins | Playfair Display",
    "bodyFont": "Inter | Open Sans | Roboto"
  }
}
`;

const SYSTEM_PROMPT = `You are an expert landing page designer and copywriter. Your job is to generate high-converting funnel landing pages based on user prompts.

When generating a landing page:
1. Write compelling, benefit-focused copy that addresses the target audience's pain points
2. Use a clear value proposition in the hero section
3. Include social proof (testimonials) when appropriate
4. Create a logical flow from awareness to action
5. Use action-oriented button text
6. Choose colors that match the brand/industry feel

Output ONLY valid JSON matching this schema:
${LANDING_PAGE_SCHEMA}

Important:
- Generate unique IDs for each section and item (use random 7-character strings)
- Use realistic placeholder content, never "Lorem ipsum"
- Choose appropriate section types based on the product/service
- Keep copy concise but impactful
- Use modern, professional color schemes`;

export async function generateLandingPage(prompt: string): Promise<LandingPage> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a landing page for: ${prompt}

Include:
1. A hero section with a strong headline, subheading, and CTA button
2. A features/benefits section with 3-4 items
3. A testimonials section with 2-3 customer quotes
4. A pricing section if applicable (otherwise skip)
5. A final CTA section

Make it conversion-focused with professional, persuasive copy. Output only the JSON, no markdown formatting.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Clean up the response - remove markdown code blocks if present
  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const pageData = JSON.parse(jsonStr) as LandingPage;

    // Ensure all sections have IDs
    pageData.sections = pageData.sections.map((section) => ({
      ...section,
      id: section.id || generateId(),
      items: section.items?.map((item) => ({
        ...item,
        id: item.id || generateId(),
      })),
    }));

    return pageData;
  } catch (error) {
    console.error("Failed to parse Claude response:", jsonStr);
    throw new Error("Failed to generate landing page. Please try again.");
  }
}

export async function regenerateSection(
  currentPage: LandingPage,
  sectionType: SectionType,
  instructions: string
): Promise<PageSection> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are an expert landing page designer. Generate a single section for a landing page.

Current page context:
- Title: ${currentPage.title}
- Color scheme: ${JSON.stringify(currentPage.colorScheme)}
- Existing sections: ${currentPage.sections.map((s) => s.type).join(", ")}

Output ONLY valid JSON for a single section matching this structure:
{
  "id": "unique-string",
  "type": "${sectionType}",
  "content": { ... },
  "items": [ ... ]
}`,
    messages: [
      {
        role: "user",
        content: `Generate a ${sectionType} section with these instructions: ${instructions}

Output only the JSON, no markdown formatting.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const section = JSON.parse(jsonStr) as PageSection;
    section.id = section.id || generateId();
    return section;
  } catch (error) {
    console.error("Failed to parse section response:", jsonStr);
    throw new Error("Failed to generate section. Please try again.");
  }
}

type PageContext = {
  title: string;
  colorScheme: LandingPage["colorScheme"];
  typography: LandingPage["typography"];
  existingSections: string[];
};

export async function regenerateSectionWithContext(
  sectionType: SectionType,
  currentSection: PageSection,
  instructions: string,
  pageContext: PageContext
): Promise<PageSection> {
  const sectionSchema = `{
  "id": "string - keep the same ID",
  "type": "${sectionType}",
  "content": {
    "heading": "string",
    "subheading": "string (optional)",
    "bodyText": "string (optional)",
    "buttonText": "string (optional)",
    "buttonLink": "string (optional)",
    "backgroundColor": "hex color - use ${pageContext.colorScheme.background}",
    "textColor": "hex color - use ${pageContext.colorScheme.text}",
    "accentColor": "hex color - use ${pageContext.colorScheme.accent}",
    "badge": "string (optional, for badges/labels)",
    "accentHeading": "string (optional, accent colored text)"
  },
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "imageUrl": "string (optional, use Unsplash URLs)",
      "price": "string (optional, for pricing)",
      "features": ["string array (optional, for pricing)"],
      "author": "string (optional, for testimonials)",
      "role": "string (optional, for testimonials)"
    }
  ]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: `You are an expert landing page designer and copywriter. You're editing a ${sectionType} section based on user instructions.

Page context:
- Title: ${pageContext.title}
- Color scheme: Primary ${pageContext.colorScheme.primary}, Accent ${pageContext.colorScheme.accent}, Background ${pageContext.colorScheme.background}
- Typography: Headings use ${pageContext.typography.headingFont}, Body uses ${pageContext.typography.bodyFont}

Current section content:
${JSON.stringify(currentSection, null, 2)}

Your task is to modify this section based on the user's instructions while:
1. Keeping the same section type (${sectionType})
2. Preserving the ID
3. Maintaining consistency with the page's color scheme and style
4. Writing compelling, conversion-focused copy
5. Using realistic content (never Lorem ipsum)

Output ONLY valid JSON matching this structure:
${sectionSchema}`,
    messages: [
      {
        role: "user",
        content: `Modify this ${sectionType} section with these instructions: "${instructions}"

Keep what works, change what the user requested. Output only valid JSON, no markdown formatting or explanation.`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr = text.trim();
  if (jsonStr.startsWith("```json")) {
    jsonStr = jsonStr.slice(7);
  } else if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.slice(3);
  }
  if (jsonStr.endsWith("```")) {
    jsonStr = jsonStr.slice(0, -3);
  }
  jsonStr = jsonStr.trim();

  try {
    const section = JSON.parse(jsonStr) as PageSection;
    // Preserve the original ID
    section.id = currentSection.id;
    // Ensure items have IDs
    if (section.items) {
      section.items = section.items.map((item, index) => ({
        ...item,
        id: item.id || currentSection.items?.[index]?.id || generateId(),
      }));
    }
    return section;
  } catch (error) {
    console.error("Failed to parse section response:", jsonStr);
    throw new Error("Failed to generate section. Please try again.");
  }
}
