import { NextRequest, NextResponse } from "next/server";
import Whop from "@whop/sdk";
import { db } from "@/lib/db";
import { topupPlans } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * POST /api/checkout/topup
 * Generate a Whop checkout URL for a top-up plan
 *
 * Body: { planId: string } - Local topup plan ID from our database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "Missing planId parameter" },
        { status: 400 }
      );
    }

    // Look up the plan in our database
    const [plan] = await db
      .select()
      .from(topupPlans)
      .where(eq(topupPlans.id, planId))
      .limit(1);

    if (!plan) {
      return NextResponse.json(
        { error: "Top-up plan not found" },
        { status: 404 }
      );
    }

    if (plan.isActive !== "true") {
      return NextResponse.json(
        { error: "This top-up plan is no longer available" },
        { status: 400 }
      );
    }

    if (!plan.whopPlanId) {
      // No Whop plan ID configured - this plan isn't linked to Whop yet
      console.error(`[Checkout/TopUp] Plan ${planId} has no whopPlanId configured`);
      return NextResponse.json(
        { error: "This top-up plan is not yet available for purchase" },
        { status: 400 }
      );
    }

    // Option 1: Direct checkout URL (simpler, doesn't require API call)
    const directCheckoutUrl = `https://whop.com/checkout/${plan.whopPlanId}`;

    // Option 2: Use Whop SDK to get the official purchase URL (more reliable)
    let sdkCheckoutUrl: string | null = null;
    try {
      const client = new Whop({
        apiKey: process.env.WHOP_API_KEY!,
      });

      const whopPlan = await client.plans.retrieve(plan.whopPlanId);
      sdkCheckoutUrl = whopPlan.purchase_url || null;

      console.log("[Checkout/TopUp] Retrieved plan from Whop:", {
        localPlanId: planId,
        whopPlanId: plan.whopPlanId,
        title: whopPlan.title,
        purchase_url: sdkCheckoutUrl,
      });
    } catch (sdkError) {
      console.warn("[Checkout/TopUp] SDK lookup failed, using direct URL:", sdkError);
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: sdkCheckoutUrl || directCheckoutUrl,
      plan: {
        id: plan.id,
        name: plan.name,
        amountCents: plan.amountCents,
        credits: plan.credits,
      },
    });
  } catch (error) {
    console.error("[Checkout/TopUp] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate checkout URL" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout/topup?planId=xxx
 * Alternative GET endpoint for simpler integrations
 */
export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get("planId");

  if (!planId) {
    return NextResponse.json(
      { error: "Missing planId parameter" },
      { status: 400 }
    );
  }

  // Reuse POST logic
  const fakeRequest = new NextRequest(request.url, {
    method: "POST",
    body: JSON.stringify({ planId }),
  });

  return POST(fakeRequest);
}
