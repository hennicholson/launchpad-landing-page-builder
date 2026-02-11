/**
 * Response Processor
 *
 * Handles parsing, validation, and normalization of AI responses.
 */

import { generateId, type PageSection, type SectionType, type LandingPage } from "../page-schema";

/**
 * Clean JSON from AI response (remove markdown code blocks, extra text)
 */
export function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  cleaned = cleaned.trim();

  // Find JSON object/array boundaries
  const jsonStart = cleaned.search(/[{[]/);
  const jsonEndBrace = cleaned.lastIndexOf("}");
  const jsonEndBracket = cleaned.lastIndexOf("]");
  const jsonEnd = Math.max(jsonEndBrace, jsonEndBracket);

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
  }

  return cleaned;
}

/**
 * Validate section JSON against expected structure
 */
export function validateSectionJson(json: unknown, expectedType?: SectionType): {
  valid: boolean;
  errors: string[];
  section?: PageSection;
} {
  const errors: string[] = [];

  if (!json || typeof json !== "object") {
    return { valid: false, errors: ["Response is not a valid object"] };
  }

  const section = json as Record<string, unknown>;

  // Check required fields
  if (!section.id || typeof section.id !== "string") {
    errors.push("Missing or invalid 'id' field");
  }

  if (!section.type || typeof section.type !== "string") {
    errors.push("Missing or invalid 'type' field");
  } else if (expectedType && section.type !== expectedType) {
    errors.push(`Expected type '${expectedType}' but got '${section.type}'`);
  }

  if (!section.content || typeof section.content !== "object") {
    errors.push("Missing or invalid 'content' field");
  }

  // Validate items if present
  if (section.items !== undefined) {
    if (!Array.isArray(section.items)) {
      errors.push("'items' must be an array");
    } else {
      section.items.forEach((item: unknown, index: number) => {
        if (!item || typeof item !== "object") {
          errors.push(`Item at index ${index} is not a valid object`);
        } else {
          const itemObj = item as Record<string, unknown>;
          if (!itemObj.id || typeof itemObj.id !== "string") {
            errors.push(`Item at index ${index} missing valid 'id'`);
          }
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    section: errors.length === 0 ? (section as unknown as PageSection) : undefined,
  };
}

/**
 * Validate landing page JSON
 */
export function validatePageJson(json: unknown): {
  valid: boolean;
  errors: string[];
  page?: LandingPage;
} {
  const errors: string[] = [];

  if (!json || typeof json !== "object") {
    return { valid: false, errors: ["Response is not a valid object"] };
  }

  const page = json as Record<string, unknown>;

  // Check required fields
  if (!page.title || typeof page.title !== "string") {
    errors.push("Missing or invalid 'title' field");
  }

  if (!page.sections || !Array.isArray(page.sections)) {
    errors.push("Missing or invalid 'sections' array");
  } else {
    page.sections.forEach((section: unknown, index: number) => {
      const validation = validateSectionJson(section);
      if (!validation.valid) {
        errors.push(`Section ${index}: ${validation.errors.join(", ")}`);
      }
    });
  }

  if (!page.colorScheme || typeof page.colorScheme !== "object") {
    errors.push("Missing or invalid 'colorScheme' field");
  }

  if (!page.typography || typeof page.typography !== "object") {
    errors.push("Missing or invalid 'typography' field");
  }

  return {
    valid: errors.length === 0,
    errors,
    page: errors.length === 0 ? (page as unknown as LandingPage) : undefined,
  };
}

/**
 * Normalize section - ensure all IDs are unique and present
 */
export function normalizeSection(section: PageSection): PageSection {
  const normalized: PageSection = {
    ...section,
    id: section.id || generateId(),
    content: section.content || {},
    items: section.items?.map((item) => ({
      ...item,
      id: item.id || generateId(),
    })),
  };

  return normalized;
}

/**
 * Normalize page - ensure all sections and items have unique IDs
 */
export function normalizePage(page: LandingPage): LandingPage {
  return {
    ...page,
    sections: page.sections.map(normalizeSection),
  };
}

/**
 * Process AI response and extract the appropriate data
 */
export function processAIResponse<T>(
  response: string,
  type: "text" | "section" | "page" | "json"
): { success: boolean; data?: T; error?: string } {
  try {
    if (type === "text") {
      // Return raw text, just cleaned up
      return { success: true, data: response.trim() as unknown as T };
    }

    const cleanedJson = cleanJsonResponse(response);
    const parsed = JSON.parse(cleanedJson);

    if (type === "section") {
      const validation = validateSectionJson(parsed);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join("; ") };
      }
      return { success: true, data: normalizeSection(validation.section!) as unknown as T };
    }

    if (type === "page") {
      const validation = validatePageJson(parsed);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join("; ") };
      }
      return { success: true, data: normalizePage(validation.page!) as unknown as T };
    }

    // Generic JSON
    return { success: true, data: parsed as T };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse response: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Merge AI suggestion with existing section (partial updates)
 */
export function mergeSection(original: PageSection, proposed: Partial<PageSection>): PageSection {
  return {
    ...original,
    content: {
      ...original.content,
      ...proposed.content,
    },
    items: proposed.items || original.items,
  };
}

/**
 * Create a diff between original and proposed for preview
 */
export function createDiff(original: unknown, proposed: unknown): {
  added: string[];
  removed: string[];
  changed: Array<{ field: string; from: unknown; to: unknown }>;
} {
  const added: string[] = [];
  const removed: string[] = [];
  const changed: Array<{ field: string; from: unknown; to: unknown }> = [];

  if (typeof original !== "object" || typeof proposed !== "object") {
    if (original !== proposed) {
      changed.push({ field: "value", from: original, to: proposed });
    }
    return { added, removed, changed };
  }

  const origObj = original as Record<string, unknown>;
  const propObj = proposed as Record<string, unknown>;

  // Check for removed keys
  for (const key of Object.keys(origObj)) {
    if (!(key in propObj)) {
      removed.push(key);
    }
  }

  // Check for added and changed keys
  for (const key of Object.keys(propObj)) {
    if (!(key in origObj)) {
      added.push(key);
    } else if (JSON.stringify(origObj[key]) !== JSON.stringify(propObj[key])) {
      changed.push({ field: key, from: origObj[key], to: propObj[key] });
    }
  }

  return { added, removed, changed };
}
