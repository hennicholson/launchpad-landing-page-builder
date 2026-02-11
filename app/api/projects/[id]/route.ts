import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, users, deployments } from "@/lib/schema";
import { requireWhopUser } from "@/lib/whop";
import { eq, and, sql } from "drizzle-orm";
import { deleteSite } from "@/lib/netlify";

type Params = Promise<{ id: string }>;

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;
    const body = await request.json();
    const { name, pageData, settings } = body;

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name;
    if (pageData !== undefined) updates.pageData = pageData;
    if (settings !== undefined) updates.settings = settings;

    const [updated] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const user = await requireWhopUser();
    const { id } = await params;

    // Get user's database UUID
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify ownership
    const [existing] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userData.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If project is deployed to Netlify, delete the site
    if (existing.netlifyId) {
      try {
        await deleteSite(existing.netlifyId);
        console.log(`Undeployed Netlify site: ${existing.netlifyId}`);
      } catch (netlifyError) {
        // Log but don't fail deletion if Netlify undeploy fails
        // Site might already be deleted or token might be invalid
        console.warn(`Failed to undeploy Netlify site ${existing.netlifyId}:`, netlifyError);
      }
    }

    // Delete all deployments for this project first (foreign key constraint)
    await db.delete(deployments).where(eq(deployments.projectId, id));

    // Delete the project
    await db.delete(projects).where(eq(projects.id, id));

    // Decrement user's project count
    await db
      .update(users)
      .set({ projectCount: sql`GREATEST(${users.projectCount} - 1, 0)` })
      .where(eq(users.whopId, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
