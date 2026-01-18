import { NextResponse } from "next/server";
import Whop from "@whop/sdk";
import { LAUNCHPAD_PRO_PLAN_ID } from "@/lib/constants";

export async function POST() {
  try {
    const client = new Whop({
      apiKey: process.env.WHOP_API_KEY!,
    });

    // Get the plan to retrieve the correct purchase URL
    const plan = await client.plans.retrieve(LAUNCHPAD_PRO_PLAN_ID);

    console.log("[Checkout] Retrieved plan:", {
      id: plan.id,
      title: plan.title,
      purchase_url: plan.purchase_url,
    });

    return NextResponse.json({
      checkoutUrl: plan.purchase_url,
    });
  } catch (error) {
    console.error("[Checkout] Error retrieving plan:", error);

    // Fallback to the product page URL
    return NextResponse.json({
      checkoutUrl: "https://whop.com/launchpad-app/launchpad-pro-cc/",
      error: "Could not retrieve checkout URL, using fallback",
    });
  }
}
