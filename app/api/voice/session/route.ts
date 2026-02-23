/**
 * Voice Session API Route
 *
 * Reports session end data for cost tracking.
 * No auth required — the sessionId itself is the credential
 * (it was created during an authenticated /voice/token request).
 * This allows sendBeacon to work (which doesn't send cookies).
 *
 * POST /api/voice/session
 * Body: { sessionId, durationSeconds, commandCount }
 */

import { NextResponse } from "next/server";
import { endVoiceSession } from "@/lib/voice/usage-tracker";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, durationSeconds, commandCount, inputAudioTokens, outputAudioTokens, inputTextTokens, outputTextTokens } = body;

    if (!sessionId || typeof durationSeconds !== "number") {
      return NextResponse.json({ error: "Missing sessionId or durationSeconds" }, { status: 400 });
    }

    // Validate sessionId format (must start with vs_ prefix)
    if (typeof sessionId !== "string" || !sessionId.startsWith("vs_") || sessionId.length > 20) {
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });
    }

    // Cap duration to prevent abuse (max 1 hour)
    const cappedDuration = Math.min(Math.round(durationSeconds), 3600);

    // Build token usage if client sent it
    const hasTokenData = typeof inputAudioTokens === "number" || typeof outputAudioTokens === "number";
    const usage = hasTokenData ? {
      inputAudioTokens: inputAudioTokens || 0,
      outputAudioTokens: outputAudioTokens || 0,
      inputTextTokens: inputTextTokens || 0,
      outputTextTokens: outputTextTokens || 0,
    } : undefined;

    const result = await endVoiceSession(sessionId, {
      durationSeconds: cappedDuration,
      commandCount: commandCount || 0,
      usage,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ costCents: result.costCents });
  } catch (error) {
    console.error("[API /voice/session] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
