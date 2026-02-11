import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Model identifiers
export const MODELS = {
  CLAUDE: "anthropic/claude-4.5-sonnet" as const,
  GEMINI: "google/gemini-3-pro" as const,
};

export type ModelType = "claude" | "gemini";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: ModelType;
}

export interface AIResponse {
  text: string;
  usage: TokenUsage;
}

/**
 * Estimate token count from text (rough approximation)
 * ~4 characters per token for English text
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Run Claude 4.5 Sonnet via Replicate
 */
export async function runClaude(
  systemPrompt: string,
  userMessage: string,
  options: { maxTokens?: number } = {}
): Promise<AIResponse> {
  const maxTokens = options.maxTokens || 4096;

  try {
    const output: string[] = [];

    for await (const event of replicate.stream(MODELS.CLAUDE, {
      input: {
        system_prompt: systemPrompt,
        prompt: userMessage,
        max_tokens: maxTokens,
      },
    })) {
      output.push(String(event));
    }

    const responseText = output.join("");

    // Estimate token usage (Replicate doesn't return exact counts for streaming)
    const inputTokens = estimateTokens(systemPrompt + userMessage);
    const outputTokens = estimateTokens(responseText);

    return {
      text: responseText,
      usage: {
        inputTokens,
        outputTokens,
        model: "claude",
      },
    };
  } catch (error) {
    console.error("[Replicate] Claude error:", error);
    throw new Error(
      `Failed to run Claude: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Run Gemini 3.0 Pro via Replicate
 */
export async function runGemini(
  prompt: string,
  options: {
    systemInstruction?: string;
    images?: string[];
    thinkingLevel?: "low" | "high";
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  const { systemInstruction, images = [], thinkingLevel, maxTokens = 8192 } = options;

  try {
    const output: string[] = [];

    const input: Record<string, unknown> = {
      prompt,
      max_output_tokens: maxTokens,
    };

    if (systemInstruction) {
      input.system_instruction = systemInstruction;
    }

    if (images.length > 0) {
      input.images = images;
    }

    if (thinkingLevel) {
      input.thinking_level = thinkingLevel;
    }

    for await (const event of replicate.stream(MODELS.GEMINI, {
      input,
    })) {
      output.push(String(event));
    }

    const responseText = output.join("");

    // Estimate token usage
    const inputTokens = estimateTokens(prompt + (systemInstruction || ""));
    const outputTokens = estimateTokens(responseText);

    return {
      text: responseText,
      usage: {
        inputTokens,
        outputTokens,
        model: "gemini",
      },
    };
  } catch (error) {
    console.error("[Replicate] Gemini error:", error);
    throw new Error(
      `Failed to run Gemini: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Run Claude without streaming (for simpler use cases)
 */
export async function runClaudeSync(
  systemPrompt: string,
  userMessage: string,
  options: { maxTokens?: number } = {}
): Promise<AIResponse> {
  const maxTokens = options.maxTokens || 4096;

  try {
    const output = await replicate.run(MODELS.CLAUDE, {
      input: {
        system_prompt: systemPrompt,
        prompt: userMessage,
        max_tokens: maxTokens,
      },
    });

    const responseText = Array.isArray(output) ? output.join("") : String(output);

    const inputTokens = estimateTokens(systemPrompt + userMessage);
    const outputTokens = estimateTokens(responseText);

    return {
      text: responseText,
      usage: {
        inputTokens,
        outputTokens,
        model: "claude",
      },
    };
  } catch (error) {
    console.error("[Replicate] Claude sync error:", error);
    throw new Error(
      `Failed to run Claude: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Run Gemini without streaming
 */
export async function runGeminiSync(
  prompt: string,
  options: {
    systemInstruction?: string;
    images?: string[];
    thinkingLevel?: "low" | "high";
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  const { systemInstruction, images = [], thinkingLevel, maxTokens = 8192 } = options;

  try {
    const input: Record<string, unknown> = {
      prompt,
      max_output_tokens: maxTokens,
    };

    if (systemInstruction) {
      input.system_instruction = systemInstruction;
    }

    if (images.length > 0) {
      input.images = images;
    }

    if (thinkingLevel) {
      input.thinking_level = thinkingLevel;
    }

    const output = await replicate.run(MODELS.GEMINI, { input });

    const responseText = Array.isArray(output) ? output.join("") : String(output);

    const inputTokens = estimateTokens(prompt + (systemInstruction || ""));
    const outputTokens = estimateTokens(responseText);

    return {
      text: responseText,
      usage: {
        inputTokens,
        outputTokens,
        model: "gemini",
      },
    };
  } catch (error) {
    console.error("[Replicate] Gemini sync error:", error);
    throw new Error(
      `Failed to run Gemini: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
