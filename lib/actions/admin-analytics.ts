/**
 * Admin Analytics Server Actions
 *
 * Aggregation queries for the admin analytics dashboard.
 * Pulls data from users, voiceSessions, payments, and creditTransactions.
 */

"use server";

import { db } from "../db";
import { users, voiceSessions, payments, creditTransactions, type PlanType } from "../schema";
import { eq, desc, sql, and, gte, ilike, or, asc } from "drizzle-orm";

// ---- Types ----

export type AnalyticsOverview = {
  totalUsers: number;
  planBreakdown: Record<string, number>;
  totalRevenueCents: number;
  subscriptionRevenueCents: number;
  topupRevenueCents: number;
  totalAICostCents: number;
  totalVoiceCostCents: number;
  totalCostCents: number;
  profitCents: number;
  totalVoiceSessions: number;
  activeVoiceSessions: number;
  recentPayments30d: number;
  recentRevenue30dCents: number;
};

export type AnalyticsUser = {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  plan: string;
  aiTotalCostCents: number;
  voiceTotalCostCents: number;
  voiceTotalSessions: number;
  balanceCents: number;
  projectCount: number;
  deployCount: number;
  lastLoginAt: string | null;
  createdAt: string | null;
};

export type AnalyticsUsersResult = {
  users: AnalyticsUser[];
  total: number;
  pagination: { limit: number; offset: number; hasMore: boolean };
};

export type PaymentRecord = {
  id: string;
  whopPaymentId: string | null;
  whopUserId: string | null;
  amountCents: number;
  type: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: string | null;
};

export type RevenueData = {
  recentPayments: PaymentRecord[];
  subscriptionTotal: number;
  topupTotal: number;
  totalRevenue: number;
  paymentCount: number;
};

// ---- Queries ----

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  // Run aggregate queries in parallel
  const [userStats, costStats, revenueStats, voiceSessionStats, recent30dRevenue] = await Promise.all([
    // User count by plan
    db
      .select({
        plan: users.plan,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .groupBy(users.plan),

    // Total AI + voice costs
    db
      .select({
        totalAICost: sql<number>`coalesce(sum(${users.aiTotalCostCents}), 0)::int`,
        totalVoiceCost: sql<number>`coalesce(sum(${users.voiceTotalCostCents}), 0)::int`,
      })
      .from(users),

    // Revenue from payments table
    db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${payments.amountCents}), 0)::int`,
        subscriptionRevenue: sql<number>`coalesce(sum(case when ${payments.type} = 'subscription' then ${payments.amountCents} else 0 end), 0)::int`,
        topupRevenue: sql<number>`coalesce(sum(case when ${payments.type} = 'topup' then ${payments.amountCents} else 0 end), 0)::int`,
      })
      .from(payments),

    // Voice session stats
    db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${voiceSessions.status} = 'active')::int`,
      })
      .from(voiceSessions),

    // Last 30 days revenue
    db
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum(${payments.amountCents}), 0)::int`,
      })
      .from(payments)
      .where(gte(payments.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))),
  ]);

  const planBreakdown: Record<string, number> = {};
  let totalUsers = 0;
  for (const row of userStats) {
    planBreakdown[row.plan || "free"] = row.count;
    totalUsers += row.count;
  }

  const totalAICostCents = costStats[0]?.totalAICost || 0;
  const totalVoiceCostCents = costStats[0]?.totalVoiceCost || 0;
  const totalCostCents = totalAICostCents + totalVoiceCostCents;
  const totalRevenueCents = revenueStats[0]?.totalRevenue || 0;

  return {
    totalUsers,
    planBreakdown,
    totalRevenueCents,
    subscriptionRevenueCents: revenueStats[0]?.subscriptionRevenue || 0,
    topupRevenueCents: revenueStats[0]?.topupRevenue || 0,
    totalAICostCents,
    totalVoiceCostCents,
    totalCostCents,
    profitCents: totalRevenueCents - totalCostCents,
    totalVoiceSessions: voiceSessionStats[0]?.total || 0,
    activeVoiceSessions: voiceSessionStats[0]?.active || 0,
    recentPayments30d: recent30dRevenue[0]?.count || 0,
    recentRevenue30dCents: recent30dRevenue[0]?.revenue || 0,
  };
}

export async function getAnalyticsUsers(filters: {
  plan?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<AnalyticsUsersResult> {
  const limit = Math.min(filters.limit || 50, 200);
  const offset = filters.offset || 0;

  // Build WHERE conditions
  const conditions = [];
  if (filters.plan && filters.plan !== "all") {
    conditions.push(eq(users.plan, filters.plan as PlanType));
  }
  if (filters.search) {
    const search = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(users.email, search),
        ilike(users.username, search),
        ilike(users.name, search)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Determine sort column
  const sortOrder = filters.order === "asc" ? asc : desc;
  type SortableColumn = typeof users.aiTotalCostCents | typeof users.voiceTotalCostCents | typeof users.voiceTotalSessions | typeof users.balanceCents | typeof users.createdAt | typeof users.plan;
  const sortMap: Record<string, SortableColumn> = {
    aiCost: users.aiTotalCostCents,
    voiceCost: users.voiceTotalCostCents,
    voiceSessions: users.voiceTotalSessions,
    balance: users.balanceCents,
    joined: users.createdAt,
    plan: users.plan,
  };
  const sortColumn = sortMap[filters.sort || ""] || users.createdAt;

  // Parallel: fetch users + count
  const [rows, countResult] = await Promise.all([
    db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        name: users.name,
        avatarUrl: users.avatarUrl,
        plan: users.plan,
        aiTotalCostCents: users.aiTotalCostCents,
        voiceTotalCostCents: users.voiceTotalCostCents,
        voiceTotalSessions: users.voiceTotalSessions,
        balanceCents: users.balanceCents,
        projectCount: users.projectCount,
        deployCount: users.deployCount,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(sortOrder(sortColumn))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count || 0;

  return {
    users: rows.map((u) => ({
      ...u,
      lastLoginAt: u.lastLoginAt?.toISOString() || null,
      createdAt: u.createdAt?.toISOString() || null,
    })),
    total,
    pagination: { limit, offset, hasMore: offset + limit < total },
  };
}

export async function getRevenueData(limit = 50): Promise<RevenueData> {
  const [recentPayments, aggregates] = await Promise.all([
    // Recent payments with user info
    db
      .select({
        id: payments.id,
        whopPaymentId: payments.whopPaymentId,
        whopUserId: payments.whopUserId,
        amountCents: payments.amountCents,
        type: payments.type,
        userName: users.name,
        userEmail: users.email,
        createdAt: payments.createdAt,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .orderBy(desc(payments.createdAt))
      .limit(limit),

    // Aggregates
    db
      .select({
        total: sql<number>`coalesce(sum(${payments.amountCents}), 0)::int`,
        subscriptionTotal: sql<number>`coalesce(sum(case when ${payments.type} = 'subscription' then ${payments.amountCents} else 0 end), 0)::int`,
        topupTotal: sql<number>`coalesce(sum(case when ${payments.type} = 'topup' then ${payments.amountCents} else 0 end), 0)::int`,
        count: sql<number>`count(*)::int`,
      })
      .from(payments),
  ]);

  return {
    recentPayments: recentPayments.map((p) => ({
      ...p,
      createdAt: p.createdAt?.toISOString() || null,
    })),
    subscriptionTotal: aggregates[0]?.subscriptionTotal || 0,
    topupTotal: aggregates[0]?.topupTotal || 0,
    totalRevenue: aggregates[0]?.total || 0,
    paymentCount: aggregates[0]?.count || 0,
  };
}
