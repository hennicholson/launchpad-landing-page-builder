/**
 * Deployment Error Classification System
 * Categorizes errors and determines retry behavior
 */

export type ErrorCode =
  | "NPM_NETWORK"
  | "NPM_TIMEOUT"
  | "NPM_REGISTRY"
  | "NPM_DEPENDENCY"
  | "BUILD_TYPESCRIPT"
  | "BUILD_MEMORY"
  | "BUILD_TIMEOUT"
  | "BUILD_UNKNOWN"
  | "NETLIFY_RATE_LIMIT"
  | "NETLIFY_TIMEOUT"
  | "NETLIFY_API"
  | "NETLIFY_UPLOAD"
  | "CONFIG_INVALID"
  | "AUTH_FAILED"
  | "UNKNOWN";

export type ErrorClassification = {
  code: ErrorCode;
  retryable: boolean;
  maxRetries: number;
  retryDelayMs: number; // Base delay before retry (uses exponential backoff)
  description: string;
  suggestedFix?: string;
};

export const ERROR_CLASSIFICATIONS: Record<ErrorCode, ErrorClassification> = {
  // Network/Transient errors - Auto-retry
  NPM_NETWORK: {
    code: "NPM_NETWORK",
    retryable: true,
    maxRetries: 3,
    retryDelayMs: 2000,
    description: "Network error during npm install",
    suggestedFix: "Automatic retry with exponential backoff",
  },
  NPM_TIMEOUT: {
    code: "NPM_TIMEOUT",
    retryable: true,
    maxRetries: 2,
    retryDelayMs: 5000,
    description: "npm install timed out",
    suggestedFix: "Retry with longer timeout",
  },
  NPM_REGISTRY: {
    code: "NPM_REGISTRY",
    retryable: true,
    maxRetries: 3,
    retryDelayMs: 3000,
    description: "npm registry unavailable",
    suggestedFix: "Retry after delay",
  },
  NPM_DEPENDENCY: {
    code: "NPM_DEPENDENCY",
    retryable: false,
    maxRetries: 0,
    retryDelayMs: 0,
    description: "Dependency resolution failed",
    suggestedFix: "Check package.json for invalid dependencies",
  },

  // Build errors
  BUILD_TYPESCRIPT: {
    code: "BUILD_TYPESCRIPT",
    retryable: false,
    maxRetries: 0,
    retryDelayMs: 0,
    description: "TypeScript compilation error",
    suggestedFix: "Fix type errors in generated code",
  },
  BUILD_MEMORY: {
    code: "BUILD_MEMORY",
    retryable: true,
    maxRetries: 1,
    retryDelayMs: 5000,
    description: "Build ran out of memory",
    suggestedFix: "Retry with garbage collection",
  },
  BUILD_TIMEOUT: {
    code: "BUILD_TIMEOUT",
    retryable: true,
    maxRetries: 1,
    retryDelayMs: 0,
    description: "Build timed out",
    suggestedFix: "Retry with longer timeout",
  },
  BUILD_UNKNOWN: {
    code: "BUILD_UNKNOWN",
    retryable: true,
    maxRetries: 1,
    retryDelayMs: 2000,
    description: "Unknown build error",
    suggestedFix: "Retry once",
  },

  // Netlify API errors
  NETLIFY_RATE_LIMIT: {
    code: "NETLIFY_RATE_LIMIT",
    retryable: true,
    maxRetries: 3,
    retryDelayMs: 10000,
    description: "Netlify rate limit hit",
    suggestedFix: "Wait and retry",
  },
  NETLIFY_TIMEOUT: {
    code: "NETLIFY_TIMEOUT",
    retryable: true,
    maxRetries: 2,
    retryDelayMs: 5000,
    description: "Netlify API timeout",
    suggestedFix: "Retry after delay",
  },
  NETLIFY_API: {
    code: "NETLIFY_API",
    retryable: true,
    maxRetries: 2,
    retryDelayMs: 3000,
    description: "Netlify API error",
    suggestedFix: "Retry after delay",
  },
  NETLIFY_UPLOAD: {
    code: "NETLIFY_UPLOAD",
    retryable: true,
    maxRetries: 3,
    retryDelayMs: 2000,
    description: "File upload failed",
    suggestedFix: "Retry upload",
  },

  // Fatal errors - Don't retry
  CONFIG_INVALID: {
    code: "CONFIG_INVALID",
    retryable: false,
    maxRetries: 0,
    retryDelayMs: 0,
    description: "Invalid project configuration",
    suggestedFix: "Fix project configuration",
  },
  AUTH_FAILED: {
    code: "AUTH_FAILED",
    retryable: false,
    maxRetries: 0,
    retryDelayMs: 0,
    description: "Authentication failed",
    suggestedFix: "Check API credentials",
  },
  UNKNOWN: {
    code: "UNKNOWN",
    retryable: true,
    maxRetries: 1,
    retryDelayMs: 2000,
    description: "Unknown error",
    suggestedFix: "Retry once",
  },
};

/**
 * Classify an error based on error message and logs
 */
export function classifyError(
  errorMessage: string,
  logs: string[] = []
): ErrorClassification {
  const fullText = [errorMessage, ...logs].join("\n").toLowerCase();

  // NPM Network errors
  if (
    fullText.includes("enotfound") ||
    fullText.includes("etimedout") ||
    fullText.includes("econnreset") ||
    fullText.includes("econnrefused") ||
    fullText.includes("socket hang up")
  ) {
    return ERROR_CLASSIFICATIONS.NPM_NETWORK;
  }

  // NPM ENOENT (our specific fix for serverless)
  if (fullText.includes("npm error code enoent") || fullText.includes("enoent")) {
    // This was the error we fixed - but if it still happens, it's network related
    return ERROR_CLASSIFICATIONS.NPM_NETWORK;
  }

  // NPM Registry errors
  if (
    fullText.includes("registry.npmjs.org") ||
    fullText.includes("npm err! 503") ||
    fullText.includes("npm err! 502")
  ) {
    return ERROR_CLASSIFICATIONS.NPM_REGISTRY;
  }

  // NPM timeout
  if (fullText.includes("timeout") && fullText.includes("npm")) {
    return ERROR_CLASSIFICATIONS.NPM_TIMEOUT;
  }

  // NPM dependency errors
  if (
    fullText.includes("could not resolve dependency") ||
    fullText.includes("peer dep") ||
    fullText.includes("eresolve") ||
    fullText.includes("npm err! 404")
  ) {
    return ERROR_CLASSIFICATIONS.NPM_DEPENDENCY;
  }

  // TypeScript errors
  if (
    fullText.includes("typescript") ||
    fullText.includes("type error") ||
    fullText.includes("ts(") ||
    fullText.includes("property") && fullText.includes("does not exist")
  ) {
    return ERROR_CLASSIFICATIONS.BUILD_TYPESCRIPT;
  }

  // Memory errors
  if (
    fullText.includes("javascript heap out of memory") ||
    fullText.includes("enomem") ||
    fullText.includes("out of memory")
  ) {
    return ERROR_CLASSIFICATIONS.BUILD_MEMORY;
  }

  // Build timeout
  if (fullText.includes("timeout") && fullText.includes("build")) {
    return ERROR_CLASSIFICATIONS.BUILD_TIMEOUT;
  }

  // Netlify rate limit
  if (fullText.includes("429") || fullText.includes("rate limit")) {
    return ERROR_CLASSIFICATIONS.NETLIFY_RATE_LIMIT;
  }

  // Netlify API errors
  if (fullText.includes("netlify api error")) {
    if (fullText.includes("timeout")) {
      return ERROR_CLASSIFICATIONS.NETLIFY_TIMEOUT;
    }
    return ERROR_CLASSIFICATIONS.NETLIFY_API;
  }

  // Upload errors
  if (fullText.includes("failed to upload")) {
    return ERROR_CLASSIFICATIONS.NETLIFY_UPLOAD;
  }

  // Auth errors
  if (
    fullText.includes("netlify_access_token") ||
    fullText.includes("unauthorized") ||
    fullText.includes("401")
  ) {
    return ERROR_CLASSIFICATIONS.AUTH_FAILED;
  }

  // Config errors
  if (fullText.includes("invalid config") || fullText.includes("configuration error")) {
    return ERROR_CLASSIFICATIONS.CONFIG_INVALID;
  }

  // Default - if build related, use BUILD_UNKNOWN
  if (fullText.includes("build failed") || fullText.includes("next build")) {
    return ERROR_CLASSIFICATIONS.BUILD_UNKNOWN;
  }

  return ERROR_CLASSIFICATIONS.UNKNOWN;
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(
  baseDelayMs: number,
  attemptNumber: number
): number {
  // Exponential backoff: delay * 2^attempt + random jitter
  const exponentialDelay = baseDelayMs * Math.pow(2, attemptNumber);
  const jitter = Math.random() * 1000; // Up to 1s jitter
  return Math.min(exponentialDelay + jitter, 60000); // Cap at 60s
}

/**
 * Check if a deployment should be retried
 */
export function shouldRetry(
  errorClass: ErrorClassification,
  currentRetryCount: number
): boolean {
  return errorClass.retryable && currentRetryCount < errorClass.maxRetries;
}

/**
 * Get human-readable error summary
 */
export function getErrorSummary(errorClass: ErrorClassification): string {
  return `${errorClass.description}. ${errorClass.suggestedFix || ""}`;
}
