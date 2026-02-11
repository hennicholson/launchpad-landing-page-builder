/**
 * Direct Anthropic Client for Page Orchestrator
 *
 * Uses the Anthropic SDK directly for more reliable multi-phase generation.
 * This provides better control over the AI calls for complex orchestration.
 */

import Anthropic from "@anthropic-ai/sdk";

// Use the dedicated orchestrator API key, fallback to main Claude key
const ORCHESTRATOR_API_KEY =
  process.env.ANTHROPIC_ORCHESTRATOR_KEY || process.env.CLAUDE_API_KEY;

const client = new Anthropic({
  apiKey: ORCHESTRATOR_API_KEY,
});

// Model for orchestration - Claude 4 Sonnet
const ORCHESTRATOR_MODEL = "claude-sonnet-4-20250514";

export interface OrchestratorResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Run Claude for orchestration tasks
 */
export async function runOrchestrator(
  systemPrompt: string,
  userMessage: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
  }
): Promise<OrchestratorResponse> {
  const { maxTokens = 4096, temperature = 0.7 } = options || {};

  try {
    const response = await client.messages.create({
      model: ORCHESTRATOR_MODEL,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return {
      text,
      usage: {
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
      },
    };
  } catch (error) {
    console.error("[OrchestratorClient] Error:", error);
    throw error;
  }
}
