import { NextRequest, NextResponse } from "next/server";
import { verifyCustomDomain } from "@/lib/actions/projects";

/**
 * POST /api/projects/[id]/domain/verify
 * Trigger DNS verification check for a custom domain
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const result = await verifyCustomDomain(projectId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: result.verified,
      status: result.status,
      sslStatus: result.sslStatus,
      error: result.error, // May contain info messages even on success
    });
  } catch (error) {
    console.error("[API] POST /api/projects/[id]/domain/verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
