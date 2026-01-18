"use server";

import { db } from "@/lib/db";
import {
  users,
  invoices,
  creditTransactions,
  topupPlans,
  type InvoiceStatus,
  type CreditTransactionType,
} from "@/lib/schema";
import { requireWhopUser } from "@/lib/whop";
import { eq, and, desc, or } from "drizzle-orm";

import { PLAN_LIMITS, type PlanType } from "@/lib/schema";

// Types for billing info response
export type BillingInfo = {
  balanceCents: number;
  plan: PlanType;
  // Usage limits
  usage: {
    projects: { used: number; limit: number };
    deploys: { used: number; limit: number };
    aiCopyGenerations: { used: number; limit: number; resetAt: Date | null };
    aiComponentGenerations: { used: number; limit: number; resetAt: Date | null };
  };
  // AI stats
  aiStats: {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalCostCents: number;
  };
  // Plan features
  features: {
    canPublish: boolean;
    canUseSubdomain: boolean;
    trackingEnabled: boolean;
  };
  invoices: {
    id: string;
    amountCents: number;
    description: string | null;
    dueDate: Date;
    status: InvoiceStatus;
    graceUntil: Date | null;
    createdAt: Date | null;
  }[];
  transactions: {
    id: string;
    amountCents: number;
    type: CreditTransactionType;
    description: string | null;
    balanceAfter: number | null;
    createdAt: Date | null;
  }[];
  topupPlans: {
    id: string;
    name: string;
    amountCents: number;
    credits: number;
    whopPlanId: string | null;
    isFeatured: string | null;
  }[];
  // User info
  user: {
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
    createdAt: Date | null;
  };
};

/**
 * Get user's billing information including balance, invoices, transactions, and available top-up plans
 */
export async function getBillingInfo(): Promise<{ success: boolean; data?: BillingInfo; error?: string }> {
  try {
    const whopUser = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Get pending/overdue invoices
    const userInvoices = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userData.id),
          or(eq(invoices.status, "pending"), eq(invoices.status, "overdue"))
        )
      )
      .orderBy(desc(invoices.dueDate));

    // Get recent transactions
    const recentTransactions = await db
      .select()
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userData.id))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(20);

    // Get available top-up plans
    const plans = await db
      .select()
      .from(topupPlans)
      .where(eq(topupPlans.isActive, "true"))
      .orderBy(topupPlans.sortOrder);

    const plan = userData.plan as PlanType;
    const planLimits = PLAN_LIMITS[plan];

    return {
      success: true,
      data: {
        balanceCents: userData.balanceCents,
        plan,
        usage: {
          projects: {
            used: userData.projectCount,
            limit: planLimits.projects,
          },
          deploys: {
            used: userData.deployCount,
            limit: planLimits.deploys,
          },
          aiCopyGenerations: {
            used: userData.aiCopyGenerationsUsed,
            limit: planLimits.aiCopyGenerations,
            resetAt: userData.aiUsageResetAt,
          },
          aiComponentGenerations: {
            used: userData.aiComponentGenerationsUsed,
            limit: planLimits.aiComponentGenerations,
            resetAt: userData.aiUsageResetAt,
          },
        },
        aiStats: {
          totalInputTokens: (userData as any).aiTotalInputTokens || 0,
          totalOutputTokens: (userData as any).aiTotalOutputTokens || 0,
          totalCostCents: (userData as any).aiTotalCostCents || 0,
        },
        features: {
          canPublish: planLimits.canPublish,
          canUseSubdomain: planLimits.canUseSubdomain,
          trackingEnabled: planLimits.trackingEnabled,
        },
        invoices: userInvoices.map((inv) => ({
          id: inv.id,
          amountCents: inv.amountCents,
          description: inv.description,
          dueDate: inv.dueDate,
          status: inv.status as InvoiceStatus,
          graceUntil: inv.graceUntil,
          createdAt: inv.createdAt,
        })),
        transactions: recentTransactions.map((tx) => ({
          id: tx.id,
          amountCents: tx.amountCents,
          type: tx.type as CreditTransactionType,
          description: tx.description,
          balanceAfter: tx.balanceAfter,
          createdAt: tx.createdAt,
        })),
        topupPlans: plans.map((p) => ({
          id: p.id,
          name: p.name,
          amountCents: p.amountCents,
          credits: p.credits,
          whopPlanId: p.whopPlanId,
          isFeatured: p.isFeatured,
        })),
        user: {
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          createdAt: userData.createdAt,
        },
      },
    };
  } catch (error) {
    console.error("[Billing] getBillingInfo error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to fetch billing info" };
  }
}

/**
 * Pay an invoice using credit balance
 */
export async function payInvoiceWithCredits(
  invoiceId: string
): Promise<{ success: boolean; newBalance?: number; error?: string; required?: number; available?: number }> {
  try {
    const whopUser = await requireWhopUser();

    // Get user from DB
    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopId, whopUser.id))
      .limit(1);

    if (!userData) {
      return { success: false, error: "User not found" };
    }

    // Get the invoice
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(
        and(
          eq(invoices.id, invoiceId),
          eq(invoices.userId, userData.id),
          or(eq(invoices.status, "pending"), eq(invoices.status, "overdue"))
        )
      )
      .limit(1);

    if (!invoice) {
      return { success: false, error: "Invoice not found or already paid" };
    }

    // Check if user has enough balance
    if (userData.balanceCents < invoice.amountCents) {
      return {
        success: false,
        error: "Insufficient balance",
        required: invoice.amountCents,
        available: userData.balanceCents,
      };
    }

    // Deduct credits and mark invoice paid
    const newBalance = userData.balanceCents - invoice.amountCents;

    // Update user balance
    await db
      .update(users)
      .set({ balanceCents: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userData.id));

    // Mark invoice paid
    await db
      .update(invoices)
      .set({
        status: "paid",
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, invoiceId));

    // Log transaction
    await db.insert(creditTransactions).values({
      userId: userData.id,
      amountCents: -invoice.amountCents,
      type: "invoice_payment",
      description: `Payment for invoice: ${invoice.description || invoiceId}`,
      referenceId: invoiceId,
      balanceAfter: newBalance,
    });

    console.log(`[Billing] User ${userData.id} paid invoice ${invoiceId}, new balance: ${newBalance}`);

    return { success: true, newBalance };
  } catch (error) {
    console.error("[Billing] payInvoiceWithCredits error:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    return { success: false, error: "Failed to pay invoice" };
  }
}

/**
 * Add credits to user's balance (called by webhook after successful top-up payment)
 * This is an internal function, not exposed to client
 */
export async function addCreditsFromTopup(
  userWhopId: string,
  amountCents: number,
  paymentId: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    // Find user by Whop ID (could be whopId or whopUniqueId)
    let [userData] = await db
      .select()
      .from(users)
      .where(eq(users.whopUniqueId, userWhopId))
      .limit(1);

    if (!userData) {
      // Try with whopId
      [userData] = await db
        .select()
        .from(users)
        .where(eq(users.whopId, userWhopId))
        .limit(1);
    }

    if (!userData) {
      console.error("[Billing] User not found for credit top-up:", userWhopId);
      return { success: false, error: "User not found" };
    }

    const newBalance = userData.balanceCents + amountCents;

    // Update user balance
    await db
      .update(users)
      .set({ balanceCents: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userData.id));

    // Log transaction
    await db.insert(creditTransactions).values({
      userId: userData.id,
      amountCents: amountCents,
      type: "topup",
      description: `Credit top-up: ${amountCents / 100} credits`,
      referenceId: paymentId,
      balanceAfter: newBalance,
    });

    console.log(`[Billing] Added ${amountCents} credits to user ${userData.id}, new balance: ${newBalance}`);
    return { success: true, newBalance };
  } catch (error) {
    console.error("[Billing] addCreditsFromTopup error:", error);
    return { success: false, error: "Failed to add credits" };
  }
}

/**
 * Get available top-up plans (public, no auth required)
 */
export async function getTopupPlans(): Promise<{
  success: boolean;
  plans?: {
    id: string;
    name: string;
    amountCents: number;
    credits: number;
    whopPlanId: string | null;
    isFeatured: string | null;
  }[];
  error?: string;
}> {
  try {
    const plans = await db
      .select()
      .from(topupPlans)
      .where(eq(topupPlans.isActive, "true"))
      .orderBy(topupPlans.sortOrder);

    return {
      success: true,
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        amountCents: p.amountCents,
        credits: p.credits,
        whopPlanId: p.whopPlanId,
        isFeatured: p.isFeatured,
      })),
    };
  } catch (error) {
    console.error("[Billing] getTopupPlans error:", error);
    return { success: false, error: "Failed to fetch top-up plans" };
  }
}
