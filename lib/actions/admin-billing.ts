"use server";

import { db } from "@/lib/db";
import { users, invoices, creditTransactions, type InvoiceStatus } from "@/lib/schema";
import { eq, desc, sql } from "drizzle-orm";

// Admin invoice with user info
export type AdminInvoice = {
  id: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  amountCents: number;
  description: string | null;
  dueDate: Date;
  paidAt: Date | null;
  status: InvoiceStatus;
  graceUntil: Date | null;
  createdAt: Date | null;
};

// User for invoice creation
export type UserForInvoice = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  balanceCents: number;
};

/**
 * Get all invoices for admin view
 */
export async function getAdminInvoices(): Promise<{
  success: boolean;
  invoices?: AdminInvoice[];
  error?: string;
}> {
  try {
    const allInvoices = await db
      .select({
        id: invoices.id,
        userId: invoices.userId,
        userEmail: users.email,
        userName: users.name,
        amountCents: invoices.amountCents,
        description: invoices.description,
        dueDate: invoices.dueDate,
        paidAt: invoices.paidAt,
        status: invoices.status,
        graceUntil: invoices.graceUntil,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(users, eq(invoices.userId, users.id))
      .orderBy(desc(invoices.createdAt));

    return {
      success: true,
      invoices: allInvoices.map((inv) => ({
        ...inv,
        status: inv.status as InvoiceStatus,
      })),
    };
  } catch (error) {
    console.error("[Admin Billing] getAdminInvoices error:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

/**
 * Get all users for invoice creation dropdown
 */
export async function getUsersForInvoice(): Promise<{
  success: boolean;
  users?: UserForInvoice[];
  error?: string;
}> {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        balanceCents: users.balanceCents,
      })
      .from(users)
      .orderBy(users.email);

    return { success: true, users: allUsers };
  } catch (error) {
    console.error("[Admin Billing] getUsersForInvoice error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

/**
 * Create a new invoice for a user
 */
export async function createInvoice(data: {
  userId: string;
  amountCents: number;
  description: string;
  dueDate: Date;
  graceUntil?: Date;
}): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
  try {
    const { userId, amountCents, description, dueDate, graceUntil } = data;

    if (!userId || !amountCents || !dueDate) {
      return { success: false, error: "Missing required fields" };
    }

    // Verify user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Create the invoice
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        userId,
        amountCents,
        description,
        dueDate,
        graceUntil: graceUntil || null,
        status: "pending",
      })
      .returning();

    console.log(`[Admin Billing] Created invoice ${newInvoice.id} for user ${userId}`);

    return { success: true, invoiceId: newInvoice.id };
  } catch (error) {
    console.error("[Admin Billing] createInvoice error:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: { status: InvoiceStatus; paidAt?: Date; updatedAt: Date } = {
      status,
      updatedAt: new Date(),
    };

    if (status === "paid") {
      updateData.paidAt = new Date();
    }

    await db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));

    console.log(`[Admin Billing] Updated invoice ${invoiceId} status to ${status}`);

    return { success: true };
  } catch (error) {
    console.error("[Admin Billing] updateInvoiceStatus error:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(invoiceId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(invoices).where(eq(invoices.id, invoiceId));

    console.log(`[Admin Billing] Deleted invoice ${invoiceId}`);

    return { success: true };
  } catch (error) {
    console.error("[Admin Billing] deleteInvoice error:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}

/**
 * Manually adjust user credits (admin only)
 */
export async function adjustUserCredits(data: {
  userId: string;
  amountCents: number;
  description: string;
}): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const { userId, amountCents, description } = data;

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const newBalance = user.balanceCents + amountCents;

    if (newBalance < 0) {
      return { success: false, error: "Cannot reduce balance below zero" };
    }

    // Update balance
    await db
      .update(users)
      .set({ balanceCents: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId));

    // Log transaction
    await db.insert(creditTransactions).values({
      userId,
      amountCents,
      type: "admin_adjust",
      description,
      balanceAfter: newBalance,
    });

    console.log(`[Admin Billing] Adjusted credits for user ${userId} by ${amountCents}, new balance: ${newBalance}`);

    return { success: true, newBalance };
  } catch (error) {
    console.error("[Admin Billing] adjustUserCredits error:", error);
    return { success: false, error: "Failed to adjust credits" };
  }
}
