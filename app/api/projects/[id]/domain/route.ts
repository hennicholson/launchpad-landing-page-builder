import { NextRequest, NextResponse } from "next/server";
import {
  addCustomDomain,
  removeCustomDomain,
  getCustomDomainStatus,
} from "@/lib/actions/projects";

/**
 * GET /api/projects/[id]/domain
 * Get custom domain configuration for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const result = await getCustomDomainStatus(projectId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json({
      config: result.config,
      canUseCustomDomain: result.canUseCustomDomain,
    });
  } catch (error) {
    console.error("[API] GET /api/projects/[id]/domain error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/domain
 * Add a custom domain to a project
 *
 * Body: { domain: string, useNetlifyDns?: boolean }
 * - useNetlifyDns: true = use Netlify DNS (user changes nameservers)
 * - useNetlifyDns: false = user-managed DNS (user adds CNAME/A records)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();

    if (!body.domain || typeof body.domain !== "string") {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const useNetlifyDns = body.useNetlifyDns === true;
    const result = await addCustomDomain(projectId, body.domain, useNetlifyDns);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      config: result.config,
    });
  } catch (error) {
    console.error("[API] POST /api/projects/[id]/domain error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]/domain
 * Remove custom domain from a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const result = await removeCustomDomain(projectId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/projects/[id]/domain error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
