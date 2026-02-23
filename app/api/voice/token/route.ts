/**
 * Voice Token API Route
 *
 * Creates an ephemeral session token for the OpenAI Realtime API.
 * Checks voice budget before issuing — returns 403 if budget exhausted.
 *
 * POST /api/voice/token
 */

import { NextResponse } from "next/server";
import { getWhopUser } from "@/lib/whop";
import { checkVoiceBudgetAvailable, startVoiceSession } from "@/lib/voice/usage-tracker";

const REALTIME_MODEL = "gpt-realtime-mini";

export async function POST(request: Request) {
  try {
    const user = await getWhopUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check voice budget before issuing token
    const budget = await checkVoiceBudgetAvailable(user.id);
    if (!budget.available) {
      return NextResponse.json(
        {
          error: budget.error || "Voice budget exhausted for this month",
          spentCents: budget.spentCents,
          budgetCents: budget.budgetCents,
        },
        { status: 403 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Voice service not configured (missing OPENAI_API_KEY)" },
        { status: 503 }
      );
    }

    // Parse optional projectId from request body
    let projectId: string | undefined;
    try {
      const body = await request.json();
      projectId = body.projectId;
    } catch {
      // No body is fine
    }

    // Start a tracked voice session
    const sessionResult = await startVoiceSession(user.id, projectId);
    if ("error" in sessionResult) {
      return NextResponse.json({ error: sessionResult.error }, { status: 500 });
    }

    // Create an ephemeral token via the OpenAI Realtime sessions endpoint
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: REALTIME_MODEL,
        voice: "verse",
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[API /voice/token] OpenAI error:", response.status, text);
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      ephemeralKey: data.client_secret?.value,
      model: REALTIME_MODEL,
      sessionId: sessionResult.sessionId,
      budget: {
        spentCents: budget.spentCents,
        budgetCents: budget.budgetCents,
      },
    });
  } catch (error) {
    console.error("[API /voice/token] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
