/**
 * Next.js Builder for Launchpad
 * Handles npm install and build process for generated projects
 */

import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
import {
  classifyError,
  calculateRetryDelay,
  shouldRetry,
  type ErrorClassification,
} from './deploy-errors';

const execAsync = promisify(exec);

/**
 * Get a clean environment for child processes
 * Filters out turbopack-related env vars that can interfere with Next.js builds
 */
function getCleanEnv(): Record<string, string | undefined> {
  const env = { ...process.env };

  // Remove turbopack-related environment variables
  const turbopackKeys = Object.keys(env).filter(key =>
    key.toUpperCase().includes('TURBO') ||
    key.toUpperCase().includes('TURBOPACK')
  );

  for (const key of turbopackKeys) {
    delete env[key];
  }

  return env;
}

export type BuildResult = {
  success: boolean;
  buildDir: string;
  outDir: string;
  error?: string;
  errorClassification?: ErrorClassification;
  logs?: string[];
  retryCount?: number;
};

export type BuildProgress = {
  status: 'preparing' | 'installing' | 'building' | 'ready' | 'failed';
  message: string;
  progress: number; // 0-100
};

/**
 * Create a temporary directory for the build
 */
async function createTempDir(projectSlug: string): Promise<string> {
  const tempBase = path.join(os.tmpdir(), 'launchpad-builds');
  await fs.mkdir(tempBase, { recursive: true });

  const tempDir = path.join(tempBase, `${projectSlug}-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });

  return tempDir;
}

/**
 * Write all project files to the temp directory
 */
async function writeProjectFiles(
  tempDir: string,
  files: Record<string, string>
): Promise<void> {
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(tempDir, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, content, 'utf-8');
  }
}

/**
 * Run npm install in the project directory
 */
async function runNpmInstall(
  tempDir: string,
  onProgress?: (progress: BuildProgress) => void
): Promise<{ success: boolean; logs: string[] }> {
  const logs: string[] = [];

  onProgress?.({
    status: 'installing',
    message: 'Installing dependencies...',
    progress: 20,
  });

  try {
    // Configure npm cache directory for sandboxed serverless environments
    const npmCacheDir = path.join(tempDir, '.npm-cache');

    const { stdout, stderr } = await execAsync('npm install --prefer-offline --no-audit --no-fund', {
      cwd: tempDir,
      env: {
        ...getCleanEnv(),
        NODE_ENV: 'production',
        NPM_CONFIG_CACHE: npmCacheDir,        // Use temp dir for cache
        NPM_CONFIG_USERCONFIG: '/dev/null',   // Skip user config
        HOME: tempDir,                         // Set HOME to writable dir
      },
      timeout: 120000, // 2 minute timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large installs
    });

    if (stdout) logs.push(stdout);
    if (stderr) logs.push(stderr);

    return { success: true, logs };
  } catch (error: unknown) {
    // Extract actual error details from exec error
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object') {
      const execError = error as { message?: string; stderr?: string; stdout?: string };
      if (execError.stderr) {
        logs.push(`stderr: ${execError.stderr}`);
        errorMessage = execError.stderr.slice(0, 500);
      }
      if (execError.stdout) {
        logs.push(`stdout: ${execError.stdout}`);
      }
      if (execError.message && !execError.stderr) {
        errorMessage = execError.message;
      }
    }
    logs.push(`npm install failed: ${errorMessage}`);
    return { success: false, logs };
  }
}

/**
 * Run npm install with automatic retries for transient errors
 */
export async function runNpmInstallWithRetry(
  tempDir: string,
  onProgress?: (progress: BuildProgress) => void
): Promise<{
  success: boolean;
  logs: string[];
  retryCount: number;
  errorClassification?: ErrorClassification;
}> {
  let allLogs: string[] = [];
  let retryCount = 0;
  let lastErrorClassification: ErrorClassification | undefined;

  // Initial attempt
  let result = await runNpmInstall(tempDir, onProgress);
  allLogs.push(...result.logs);

  if (result.success) {
    return { success: true, logs: allLogs, retryCount: 0 };
  }

  // Classify the error
  lastErrorClassification = classifyError(result.logs.join('\n'));

  // Retry loop
  while (shouldRetry(lastErrorClassification, retryCount)) {
    retryCount++;
    const delay = calculateRetryDelay(lastErrorClassification.retryDelayMs, retryCount);

    allLogs.push(`[Retry ${retryCount}/${lastErrorClassification.maxRetries}] Waiting ${Math.round(delay / 1000)}s before retry...`);

    onProgress?.({
      status: 'installing',
      message: `Retrying npm install (attempt ${retryCount + 1})...`,
      progress: 20,
    });

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));

    // Retry
    result = await runNpmInstall(tempDir, onProgress);
    allLogs.push(...result.logs);

    if (result.success) {
      allLogs.push(`[Retry ${retryCount}] npm install succeeded on retry`);
      return { success: true, logs: allLogs, retryCount };
    }

    // Re-classify in case error changed
    lastErrorClassification = classifyError(result.logs.join('\n'));
  }

  return {
    success: false,
    logs: allLogs,
    retryCount,
    errorClassification: lastErrorClassification,
  };
}

/**
 * Run next build with automatic retries for transient errors
 */
export async function runNextBuildWithRetry(
  tempDir: string,
  onProgress?: (progress: BuildProgress) => void
): Promise<{
  success: boolean;
  logs: string[];
  retryCount: number;
  errorClassification?: ErrorClassification;
}> {
  let allLogs: string[] = [];
  let retryCount = 0;
  let lastErrorClassification: ErrorClassification | undefined;

  // Initial attempt
  let result = await runNextBuild(tempDir, onProgress);
  allLogs.push(...result.logs);

  if (result.success) {
    return { success: true, logs: allLogs, retryCount: 0 };
  }

  // Classify the error
  lastErrorClassification = classifyError(result.logs.join('\n'));

  // Retry loop (builds have fewer retries typically)
  while (shouldRetry(lastErrorClassification, retryCount)) {
    retryCount++;
    const delay = calculateRetryDelay(lastErrorClassification.retryDelayMs, retryCount);

    allLogs.push(`[Retry ${retryCount}/${lastErrorClassification.maxRetries}] Waiting ${Math.round(delay / 1000)}s before retry...`);

    onProgress?.({
      status: 'building',
      message: `Retrying build (attempt ${retryCount + 1})...`,
      progress: 50,
    });

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, delay));

    // Retry
    result = await runNextBuild(tempDir, onProgress);
    allLogs.push(...result.logs);

    if (result.success) {
      allLogs.push(`[Retry ${retryCount}] Build succeeded on retry`);
      return { success: true, logs: allLogs, retryCount };
    }

    // Re-classify in case error changed
    lastErrorClassification = classifyError(result.logs.join('\n'));
  }

  return {
    success: false,
    logs: allLogs,
    retryCount,
    errorClassification: lastErrorClassification,
  };
}

/**
 * Run next build in the project directory
 */
async function runNextBuild(
  tempDir: string,
  onProgress?: (progress: BuildProgress) => void
): Promise<{ success: boolean; logs: string[] }> {
  const logs: string[] = [];

  onProgress?.({
    status: 'building',
    message: 'Building Next.js project...',
    progress: 50,
  });

  try {
    // Configure npm/node environment for sandboxed serverless environments
    const npmCacheDir = path.join(tempDir, '.npm-cache');

    const { stdout, stderr } = await execAsync('npm run build', {
      cwd: tempDir,
      env: {
        ...getCleanEnv(),
        NODE_ENV: 'production',
        NPM_CONFIG_CACHE: npmCacheDir,        // Use temp dir for cache
        NPM_CONFIG_USERCONFIG: '/dev/null',   // Skip user config
        HOME: tempDir,                         // Set HOME to writable dir
      },
      timeout: 300000, // 5 minute timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for build output
    });

    if (stdout) logs.push(stdout);
    if (stderr) logs.push(stderr);

    onProgress?.({
      status: 'ready',
      message: 'Build complete!',
      progress: 90,
    });

    return { success: true, logs };
  } catch (error: unknown) {
    // Extract actual error details from exec error
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object') {
      const execError = error as { message?: string; stderr?: string; stdout?: string };
      if (execError.stderr) {
        logs.push(`stderr: ${execError.stderr}`);
        errorMessage = execError.stderr.slice(0, 500); // First 500 chars of stderr
      }
      if (execError.stdout) {
        logs.push(`stdout: ${execError.stdout}`);
      }
      if (execError.message && !execError.stderr) {
        errorMessage = execError.message;
      }
    }
    logs.push(`next build failed: ${errorMessage}`);

    onProgress?.({
      status: 'failed',
      message: `Build failed: ${errorMessage}`,
      progress: 0,
    });

    return { success: false, logs };
  }
}

/**
 * Clean up old build directories (keep last 10)
 */
async function cleanupOldBuilds(): Promise<void> {
  try {
    const tempBase = path.join(os.tmpdir(), 'launchpad-builds');

    // Check if directory exists
    try {
      await fs.access(tempBase);
    } catch {
      return; // Directory doesn't exist, nothing to clean
    }

    const entries = await fs.readdir(tempBase, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({
        name: e.name,
        path: path.join(tempBase, e.name),
      }));

    // Sort by name (which includes timestamp) descending
    dirs.sort((a, b) => b.name.localeCompare(a.name));

    // Remove directories beyond the 10 most recent
    for (const dir of dirs.slice(10)) {
      try {
        await fs.rm(dir.path, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Build a Next.js project from generated files
 */
export async function buildNextJsProject(
  files: Record<string, string>,
  projectSlug: string,
  onProgress?: (progress: BuildProgress) => void
): Promise<BuildResult> {
  const logs: string[] = [];

  try {
    // Clean up old builds first
    await cleanupOldBuilds();

    onProgress?.({
      status: 'preparing',
      message: 'Preparing build environment...',
      progress: 5,
    });

    // Create temp directory
    const tempDir = await createTempDir(projectSlug);
    logs.push(`Created temp directory: ${tempDir}`);

    onProgress?.({
      status: 'preparing',
      message: 'Writing project files...',
      progress: 10,
    });

    // Write all project files
    await writeProjectFiles(tempDir, files);
    logs.push(`Wrote ${Object.keys(files).length} files`);

    // Run npm install with auto-retry
    const installResult = await runNpmInstallWithRetry(tempDir, onProgress);
    logs.push(...installResult.logs);

    if (!installResult.success) {
      return {
        success: false,
        buildDir: tempDir,
        outDir: path.join(tempDir, 'out'),
        error: 'npm install failed',
        errorClassification: installResult.errorClassification,
        logs,
        retryCount: installResult.retryCount,
      };
    }

    // Run next build with auto-retry
    const buildResult = await runNextBuildWithRetry(tempDir, onProgress);
    logs.push(...buildResult.logs);

    if (!buildResult.success) {
      return {
        success: false,
        buildDir: tempDir,
        outDir: path.join(tempDir, 'out'),
        error: 'next build failed',
        errorClassification: buildResult.errorClassification,
        logs,
        retryCount: buildResult.retryCount,
      };
    }

    // The static export output will be in the 'out' directory
    const outDir = path.join(tempDir, 'out');

    // Verify out directory exists
    try {
      await fs.access(outDir);
    } catch {
      return {
        success: false,
        buildDir: tempDir,
        outDir,
        error: 'Build output directory not found. Static export may have failed.',
        logs,
      };
    }

    onProgress?.({
      status: 'ready',
      message: 'Build complete!',
      progress: 100,
    });

    return {
      success: true,
      buildDir: tempDir,
      outDir,
      logs,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logs.push(`Build error: ${errorMessage}`);

    onProgress?.({
      status: 'failed',
      message: `Build failed: ${errorMessage}`,
      progress: 0,
    });

    return {
      success: false,
      buildDir: '',
      outDir: '',
      error: errorMessage,
      logs,
    };
  }
}

/**
 * Get all files from the build output directory
 */
export async function getOutputFiles(outDir: string): Promise<Record<string, Buffer>> {
  const files: Record<string, Buffer> = {};

  async function readDirRecursive(dir: string, basePath: string = ''): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory()) {
        await readDirRecursive(fullPath, relativePath);
      } else {
        const content = await fs.readFile(fullPath);
        // Normalize path separators for deployment
        const normalizedPath = '/' + relativePath.replace(/\\/g, '/');
        files[normalizedPath] = content;
      }
    }
  }

  await readDirRecursive(outDir);
  return files;
}

/**
 * Clean up a build directory after deployment
 */
export async function cleanupBuild(buildDir: string): Promise<void> {
  try {
    await fs.rm(buildDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}
