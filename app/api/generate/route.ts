import { NextRequest, NextResponse } from "next/server";
import { generateLandingPage, regenerateSectionWithContext } from "@/lib/claude";
import { requireWhopUser } from "@/lib/whop";

// POST /api/generate - Generate a landing page or regenerate a section
export async function POST(request: NextRequest) {
  try {
    await requireWhopUser();
    const body = await request.json();
    const { action, prompt } = body;

    // Handle section regeneration
    if (action === "regenerate-section") {
      const { sectionType, currentSection, instructions, pageContext } = body;

      if (!sectionType || !instructions) {
        return NextResponse.json(
          { error: "Section type and instructions are required" },
          { status: 400 }
        );
      }

      const newSection = await regenerateSectionWithContext(
        sectionType,
        currentSection,
        instructions,
        pageContext
      );

      return NextResponse.json(newSection);
    }

    // Handle full page generation
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (prompt.length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed description (at least 10 characters)" },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const pageData = await generateLandingPage(prompt);

    return NextResponse.json({ pageData });
  } catch (error) {
    console.error("Error generating page:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to generate. Please try again." },
      { status: 500 }
    );
  }
}
