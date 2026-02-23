/**
 * Voice Command Parse API Route
 *
 * Parses natural language voice input into structured editor commands
 * using the same Anthropic orchestrator client as the rest of the AI system.
 * POST /api/voice/parse
 */

import { NextRequest, NextResponse } from "next/server";
import { runOrchestrator } from "@/lib/ai/orchestrator/anthropic-client";
import { getWhopUser } from "@/lib/whop";

export const maxDuration = 30;

interface VoiceEditorContext {
  selectedSectionId?: string | null;
  selectedSection?: {
    id: string;
    type: string;
    heading?: string;
    subheading?: string;
    bodyText?: string;
    buttonText?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  selectedElementIds?: string[];
  selectedElement?: {
    id: string;
    type: string;
    content: Record<string, unknown>;
  };
  selectedItemId?: string | null;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  sectionList: Array<{
    id: string;
    type: string;
    heading?: string;
  }>;
  availableSectionTypes?: string[];
  availableElementTypes?: string[];
  themePresets?: string[];
  currentBreakpoint?: string;
}

interface VoiceCommand {
  type: string;
  target?: Record<string, string>;
  value?: Record<string, unknown>;
  acknowledgment?: string;
}

interface ParsedVoiceResponse {
  commands: VoiceCommand[];
  clarification?: string;
}

interface RequestBody {
  transcript: string;
  context: VoiceEditorContext;
}

// Voice parsing uses the same orchestrator model (Claude Sonnet 4) as the rest
// of the AI system. See lib/ai/orchestrator/anthropic-client.ts.

const SYSTEM_PROMPT = `You are the voice command parser for the LaunchPad landing page editor. You translate natural language voice input into structured editor commands.

RESPONSE FORMAT: Return valid JSON only. No explanation text.
{
  "commands": [{ "type": "...", "target": {...}, "value": {...}, "acknowledgment": "..." }],
  "clarification": "optional question if command is ambiguous"
}

AVAILABLE COMMANDS:

update_color: Change page-level colors
  value: { primary?: hex, secondary?: hex, accent?: hex, background?: hex, text?: hex }
  Examples: "make accent red" -> { accent: "#ef4444" }

update_typography: Change fonts
  value: { headingFont?: string, bodyFont?: string }
  Available fonts: Inter, Poppins, Playfair Display, DM Sans, Space Grotesk, Roboto, Open Sans, Montserrat, Lato, Oswald, Raleway, Ubuntu, Merriweather, Nunito, Sora, Archivo, Clash Display, Satoshi, Cabinet Grotesk, General Sans, Switzer, Outfit
  Examples: "change heading font to Poppins" -> { headingFont: "Poppins" }

update_section_content: Change section text or properties
  target: { sectionId: "use currently selected if not specified" }
  value: { heading?: string, subheading?: string, bodyText?: string, buttonText?: string, buttonLink?: string, badge?: string, backgroundColor?: hex, textColor?: hex }
  Examples: "change the heading to Welcome Home" -> { heading: "Welcome Home" }

update_element_style: Change element text styling
  target: { sectionId, field }
  value: { fontSize?: number, fontFamily?: string, fontWeight?: "normal"|"medium"|"semibold"|"bold", color?: hex, textAlign?: "left"|"center"|"right", textTransform?: "none"|"uppercase"|"lowercase"|"capitalize", lineHeight?: number, letterSpacing?: string, fontStyle?: "normal"|"italic", textDecoration?: "none"|"underline"|"line-through", textOpacity?: number }
  Examples: "make font size 48" -> { fontSize: 48 }

update_element_content: Change element content
  target: { sectionId, elementId }
  value: element-specific content updates
  Examples: "change button text to Sign Up Now" -> { text: "Sign Up Now" }

update_page_meta: Change page title/description/settings
  value: { title?: string, description?: string, animationPreset?: "none"|"subtle"|"moderate"|"dramatic", contentWidth?: "narrow"|"medium"|"wide", smoothScroll?: boolean }

apply_theme: Apply a theme preset
  value: { presetId: "dark"|"light"|"midnight"|"forest"|"ocean"|"sunset"|"neon"|"pastel"|"monochrome"|"warm"|"cool"|"vintage" }

add_section: Add a new section
  value: { type: SectionType }
  Section types: hero, features, testimonials, pricing, cta, faq, video, gallery, header, footer, founders, credibility, offer, audience, stats, logoCloud, comparison, process, blank

remove_section: Remove a section
  target: { sectionId: "use selected if not specified" }

move_section: Move section up or down
  target: { sectionId }
  value: { direction: "up"|"down" }

add_element: Add custom element to section
  value: { type: "button"|"text"|"image"|"divider"|"badge"|"icon"|"video"|"form"|"social"|"countdown"|"html", position?: { x: number, y: number } }

remove_element: Delete an element
  target: { sectionId, elementId }

select_section: Select a section by type or position
  target: { sectionId }

select_element: Select an element
  target: { sectionId, elementId }

update_item: Update a section item (feature, testimonial, pricing card)
  target: { sectionId, itemId }
  value: { title?: string, description?: string, icon?: string, price?: string, etc. }

undo: Undo last change
redo: Redo last undone change

toggle_visibility: Show/hide section elements
  target: { sectionId }
  value: { showHeading?: boolean, showSubheading?: boolean, showBodyText?: boolean, showButton?: boolean, showImage?: boolean, showBadge?: boolean }

update_background_effect: Change section background effect
  target: { sectionId }
  value: { backgroundEffect: "none"|"elegant-shapes"|"background-circles"|"glow"|"shooting-stars"|"aurora"|"spotlight"|"meteors"|"sparkles" }

COLOR NAMES (map to hex):
red=#ef4444, blue=#3b82f6, green=#22c55e, yellow=#eab308, purple=#a855f7, pink=#ec4899, orange=#f97316, teal=#14b8a6, cyan=#06b6d4, indigo=#6366f1, white=#ffffff, black=#000000, gray=#6b7280, dark=#1f2937, light=#f9fafb

MULTI-COMMAND: If the user says multiple things ("make it bigger and blue"), return multiple commands.

ACKNOWLEDGMENTS: Generate short, casual acknowledgments (1-3 words). Vary them:
"Done!", "Got it!", "Changed!", "Check it out", "Yep!", "Updated!", "There you go", "All set", "On it", "Check now"

CONTEXT AWARENESS: Use the provided editor context to:
- Default to the selected section when sectionId not specified
- Know what elements exist and their types
- Understand the current color scheme and typography
- Reference sections by their heading or type

AMBIGUITY: If you can't determine the intent, set clarification to a short question and return empty commands.`;

export async function POST(request: NextRequest) {
  try {
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { transcript, context } = body;

    if (!transcript || !context) {
      return NextResponse.json(
        { error: "Missing required fields: transcript, context" },
        { status: 400 }
      );
    }

    const sections = context.sectionList || [];
    const selectedType = context.selectedSection?.type || "none";
    const selectedElementIds = context.selectedElementIds || [];

    const contextMessage = `EDITOR CONTEXT:
Selected section: ${context.selectedSectionId || "none"} (${selectedType})
Selected element: ${selectedElementIds.length > 0 ? selectedElementIds.join(", ") : "none"}${context.selectedElement ? ` (${context.selectedElement.type})` : ""}
Sections: ${sections.map((s) => `${s.id}:${s.type}${s.heading ? ` ("${s.heading}")` : ""}`).join(", ") || "none"}
Colors: primary=${context.colorScheme.primary}, secondary=${context.colorScheme.secondary}, accent=${context.colorScheme.accent}, bg=${context.colorScheme.background}, text=${context.colorScheme.text}
Typography: heading=${context.typography.headingFont}, body=${context.typography.bodyFont}
Breakpoint: ${context.currentBreakpoint || "desktop"}

USER VOICE INPUT: "${transcript}"`;

    // Use the same orchestrator client (Claude Sonnet 4) as the rest of the AI system
    // Retry once on transient errors (overloaded, rate limited)
    let result;
    try {
      result = await runOrchestrator(SYSTEM_PROMPT, contextMessage, {
        maxTokens: 1024,
        temperature: 0.3,
      });
    } catch (firstErr) {
      const msg = firstErr instanceof Error ? firstErr.message : String(firstErr);
      if (msg.includes("overloaded") || msg.includes("529") || msg.includes("rate")) {
        // Wait 1s and retry once
        await new Promise((r) => setTimeout(r, 1000));
        result = await runOrchestrator(SYSTEM_PROMPT, contextMessage, {
          maxTokens: 1024,
          temperature: 0.3,
        });
      } else {
        throw firstErr;
      }
    }

    let parsed: ParsedVoiceResponse;
    try {
      parsed = JSON.parse(result.text);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = result.text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response as JSON" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      ...parsed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[API /voice/parse] Error:", message, error);
    return NextResponse.json(
      { error: message || "Internal server error" },
      { status: 500 }
    );
  }
}
