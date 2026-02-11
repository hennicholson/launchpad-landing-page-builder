import { NextResponse } from "next/server";
import { Whop } from "@whop/sdk";
import { db } from "@/lib/db";
import { users, topupPlans } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { LAUNCHPAD_PRO_PRODUCT_ID } from "@/lib/whop";
import { addCreditsFromTopup } from "@/lib/actions/billing";

export const runtime = "nodejs";

// Initialize Whop SDK with webhook key (base64 encoded as per docs)
const whopsdk = new Whop({
  appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  apiKey: process.env.WHOP_API_KEY,
  webhookKey: process.env.WHOP_WEBHOOK_SECRET
    ? Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString("base64")
    : undefined,
});

// Generate UUID from Whop user ID (same as in whop.ts)
function generateUUIDFromString(input: string): string {
  const hash = createHash("sha256").update(input).digest("hex");
  const uuidHex = hash.substring(0, 32);
  return [
    uuidHex.substring(0, 8),
    uuidHex.substring(8, 12),
    "4" + uuidHex.substring(13, 16),
    "8" + uuidHex.substring(17, 20),
    uuidHex.substring(20, 32),
  ].join("-");
}

export async function POST(request: Request) {
  try {
    // Get raw body and headers for SDK verification
    const rawBody = await request.text();
    const headers = Object.fromEntries(request.headers);

    console.log("[Whop Webhook] Received request");
    console.log("[Whop Webhook] Headers:", JSON.stringify({
      "webhook-id": headers["webhook-id"],
      "webhook-timestamp": headers["webhook-timestamp"],
      "webhook-signature": headers["webhook-signature"] ? "present" : "missing",
    }));

    // Use Whop SDK to unwrap and verify the webhook
    let webhookData: any;
    try {
      webhookData = whopsdk.webhooks.unwrap(rawBody, { headers });
      console.log("[Whop Webhook] SDK verification successful");
    } catch (verifyError) {
      console.error("[Whop Webhook] SDK verification failed");
      return NextResponse.json({ error: "Webhook verification failed" }, { status: 401 });
    }

    const eventType = webhookData.type || webhookData.action || "unknown";
    const data = webhookData.data || webhookData;

    console.log('[Whop Webhook] Received event:', data.event || eventType || 'unknown');

    // Helper to update user plan with fallback
    async function updateUserPlan(whopUserId: string, newPlan: "pro" | "free") {
      const internalUserId = generateUUIDFromString(whopUserId);

      console.log(`[Whop Webhook] Updating user - Whop ID: ${whopUserId}, Internal UUID: ${internalUserId}, Plan: ${newPlan}`);

      // Try updating by whopId (generated UUID) first
      const result1 = await db
        .update(users)
        .set({
          plan: newPlan,
          updatedAt: new Date(),
        })
        .where(eq(users.whopId, internalUserId))
        .returning({ id: users.id });

      if (result1.length > 0) {
        console.log(`[Whop Webhook] Updated user by whopId: ${result1[0].id}`);
        return true;
      }

      // Fallback: try updating by whopUniqueId (original Whop user ID)
      const result2 = await db
        .update(users)
        .set({
          plan: newPlan,
          updatedAt: new Date(),
        })
        .where(eq(users.whopUniqueId, whopUserId))
        .returning({ id: users.id });

      if (result2.length > 0) {
        console.log(`[Whop Webhook] Updated user by whopUniqueId: ${result2[0].id}`);
        return true;
      }

      console.warn(`[Whop Webhook] No user found for Whop ID: ${whopUserId}`);
      return false;
    }

    // Extract user ID and product ID
    const userId = data.user_id || data.user?.id;
    const productId = data.product_id || data.product?.id;

    console.log(`[Whop Webhook] Extracted - User: ${userId}, Product: ${productId}`);
    console.log(`[Whop Webhook] Expected Pro product: ${LAUNCHPAD_PRO_PRODUCT_ID}`);

    // Get plan ID from payment data
    const planId = data.plan_id || data.plan?.id;
    const amountCents = data.amount_cents || data.amount || data.total;

    console.log(`[Whop Webhook] Plan ID: ${planId}, Amount: ${amountCents}`);

    // Helper to check if this is a top-up payment
    async function isTopupPayment(planId: string | undefined): Promise<{ isTopup: boolean; credits: number }> {
      if (!planId) return { isTopup: false, credits: 0 };

      // Check if planId matches any of our topup plans
      const [topupPlan] = await db
        .select()
        .from(topupPlans)
        .where(eq(topupPlans.whopPlanId, planId))
        .limit(1);

      if (topupPlan) {
        return { isTopup: true, credits: topupPlan.credits };
      }
      return { isTopup: false, credits: 0 };
    }

    // Handle events based on type
    switch (eventType) {
      case "payment.succeeded":
        if (userId) {
          // Check if this is a top-up payment
          const { isTopup, credits } = await isTopupPayment(planId);

          if (isTopup && credits > 0) {
            // This is a credit top-up payment
            console.log(`[Whop Webhook] Top-up payment: ${credits} credits for user ${userId}`);
            const result = await addCreditsFromTopup(userId, credits, data.id || "unknown");
            if (result.success) {
              console.log(`[Whop Webhook] Credits added successfully, new balance: ${result.newBalance}`);
            } else {
              console.error(`[Whop Webhook] Failed to add credits: ${result.error}`);
            }
          } else if (productId === LAUNCHPAD_PRO_PRODUCT_ID || !productId) {
            // This is a subscription payment - upgrade to pro
            console.log(`[Whop Webhook] Subscription payment for user: ${userId}`);
            await updateUserPlan(userId, "pro");
          } else {
            console.log(`[Whop Webhook] Ignoring payment for different product: ${productId}`);
          }
        }
        break;

      case "membership.went_valid":
        if (userId) {
          // Only upgrade for our Pro product
          if (productId && productId !== LAUNCHPAD_PRO_PRODUCT_ID) {
            console.log(`[Whop Webhook] Ignoring activation for different product: ${productId}`);
            break;
          }
          console.log(`[Whop Webhook] Activation event for user: ${userId}`);
          await updateUserPlan(userId, "pro");
        }
        break;

      case "membership.went_invalid":
        if (userId) {
          console.log(`[Whop Webhook] Deactivation event for user: ${userId}`);
          await updateUserPlan(userId, "free");
        }
        break;

      default:
        console.log(`[Whop Webhook] Unhandled event type: ${eventType}`);
    }

    // Return 200 quickly as per docs
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Whop Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
