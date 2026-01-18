import { pgTable, text, timestamp, jsonb, uuid, integer } from "drizzle-orm/pg-core";
import type { LandingPage, ProjectSettings } from "./page-schema";

// Plan types for the business model
export type PlanType = "free" | "starter" | "pro" | "enterprise";

export type PlanLimits = {
  projects: number;
  deploys: number;
  aiCopyGenerations: number;      // per month, resets, no stacking
  aiComponentGenerations: number; // per month, resets, no stacking
  canPublish: boolean;
  canUseSubdomain: boolean;
  trackingEnabled: boolean;       // true = we collect funnel analytics
};

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    projects: 1,
    deploys: 3,
    aiCopyGenerations: 0,
    aiComponentGenerations: 0,
    canPublish: false,
    canUseSubdomain: false,
    trackingEnabled: true,  // We collect data on free funnels
  },
  starter: {
    projects: 5,
    deploys: 50,
    aiCopyGenerations: 10,
    aiComponentGenerations: 5,
    canPublish: true,
    canUseSubdomain: false,
    trackingEnabled: true,
  },
  pro: {
    projects: 7,
    deploys: -1,  // unlimited
    aiCopyGenerations: 50,
    aiComponentGenerations: 25,
    canPublish: true,
    canUseSubdomain: true,
    trackingEnabled: false,  // Pro = secure, no tracking
  },
  enterprise: {
    projects: -1,  // unlimited
    deploys: -1,   // unlimited
    aiCopyGenerations: -1,  // unlimited
    aiComponentGenerations: -1,  // unlimited
    canPublish: true,
    canUseSubdomain: true,
    trackingEnabled: false,
  },
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  whopId: text("whop_id").notNull().unique(),
  whopUniqueId: text("whop_unique_id").unique(), // Original Whop user ID (user_xxx)
  email: text("email"),
  username: text("username"),
  name: text("name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  whopCreatedAt: timestamp("whop_created_at"),
  userType: text("user_type"),
  plan: text("plan").$type<PlanType>().default("free").notNull(),
  projectCount: integer("project_count").default(0).notNull(),
  deployCount: integer("deploy_count").default(0).notNull(),
  // Credit balance system
  balanceCents: integer("balance_cents").default(0).notNull(),
  // AI usage tracking (resets monthly, doesn't stack)
  aiCopyGenerationsUsed: integer("ai_copy_generations_used").default(0).notNull(),
  aiComponentGenerationsUsed: integer("ai_component_generations_used").default(0).notNull(),
  aiUsageResetAt: timestamp("ai_usage_reset_at"),  // When to reset counters (30 days from first use)
  // AI token tracking for cost analytics
  aiTotalInputTokens: integer("ai_total_input_tokens").default(0).notNull(),
  aiTotalOutputTokens: integer("ai_total_output_tokens").default(0).notNull(),
  aiTotalCostCents: integer("ai_total_cost_cents").default(0).notNull(),  // Lifetime cost in cents
  isAdmin: text("is_admin").default("false"),
  isSuspended: text("is_suspended").default("false"),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // Used for subdomain: {slug}.launchpad.site
  pageData: jsonb("page_data").$type<LandingPage>().notNull(),
  settings: jsonb("settings").$type<ProjectSettings>(),
  netlifyId: text("netlify_id"), // Netlify site ID
  netlifySiteName: text("netlify_site_name"), // Netlify subdomain name
  liveUrl: text("live_url"), // Full deployed URL
  customDomain: text("custom_domain"), // Optional custom domain (pro feature)
  isPublished: text("is_published").default("false"), // Whether currently live
  thumbnailUrl: text("thumbnail_url"), // Screenshot thumbnail of the site
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Deployment status types
export type DeploymentStatus = "pending" | "building" | "retrying" | "ready" | "failed";

export const deployments = pgTable("deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  netlifyDeployId: text("netlify_deploy_id"),
  url: text("url"),
  status: text("status").$type<DeploymentStatus>().notNull(), // pending, building, retrying, ready, failed
  errorMessage: text("error_message"),
  // Auto-retry tracking fields
  errorCode: text("error_code"), // NPM_NETWORK, BUILD_FAIL, NETLIFY_API, etc.
  retryCount: integer("retry_count").default(0).notNull(),
  maxRetries: integer("max_retries").default(3).notNull(),
  isFatal: text("is_fatal").default("false"), // "true" = don't retry
  lastAttemptAt: timestamp("last_attempt_at"),
  buildLogs: text("build_logs"), // Full build logs for debugging
  createdAt: timestamp("created_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // image, video
  filename: text("filename"),
  size: text("size"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin accounts for dashboard access
export const adminAccounts = pgTable("admin_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// Analytics event types
export type AnalyticsEventType = "pageview" | "click" | "scroll" | "leave" | "heatmap";

// Analytics events - tracks all user interactions on deployed pages (Free tier only)
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").$type<AnalyticsEventType>().notNull(),
  pageUrl: text("page_url"),
  elementId: text("element_id"),         // for clicks
  elementText: text("element_text"),     // for clicks
  scrollDepth: integer("scroll_depth"),  // percentage 0-100
  xPosition: integer("x_position"),      // for heatmap
  yPosition: integer("y_position"),      // for heatmap
  viewportWidth: integer("viewport_width"),
  viewportHeight: integer("viewport_height"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics sessions - aggregated session data
export const analyticsSessions = pgTable("analytics_sessions", {
  id: text("id").primaryKey(),  // session_id
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  pageCount: integer("page_count").default(1),
  totalTimeSeconds: integer("total_time_seconds"),
  converted: text("converted").default("false"),
  exitPage: text("exit_page"),
  funnelStage: text("funnel_stage"),  // where they dropped off
});

// Top-up Plans - available credit purchase options
export const topupPlans = pgTable("topup_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // "Starter", "Popular", "Power User"
  amountCents: integer("amount_cents").notNull(), // 500, 1000, 2000, 2900
  credits: integer("credits").notNull(), // 500, 1000, 2000, 2900
  whopPlanId: text("whop_plan_id"), // Whop plan ID for checkout
  isFeatured: text("is_featured").default("false"), // highlight $29
  sortOrder: integer("sort_order").default(0),
  isActive: text("is_active").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invoice status types
export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";

// Invoices - admin-created bills for users
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amountCents: integer("amount_cents").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  status: text("status").$type<InvoiceStatus>().default("pending").notNull(),
  graceUntil: timestamp("grace_until"), // grace period before service suspension
  createdBy: uuid("created_by"), // admin who created it
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit transaction types
export type CreditTransactionType =
  | "topup"           // user bought credits
  | "subscription"    // credits used for subscription
  | "invoice_payment" // credits used to pay invoice
  | "admin_adjust"    // admin manually adjusted
  | "refund";         // credits refunded

// Credit Transactions - audit log of all credit changes
export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amountCents: integer("amount_cents").notNull(), // positive = credit, negative = debit
  type: text("type").$type<CreditTransactionType>().notNull(),
  description: text("description"),
  referenceId: text("reference_id"), // Whop payment ID, invoice ID, etc.
  balanceAfter: integer("balance_after"), // balance after this transaction
  createdAt: timestamp("created_at").defaultNow(),
});

// Types for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Deployment = typeof deployments.$inferSelect;
export type NewDeployment = typeof deployments.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type AdminAccount = typeof adminAccounts.$inferSelect;
export type NewAdminAccount = typeof adminAccounts.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type AnalyticsSession = typeof analyticsSessions.$inferSelect;
export type NewAnalyticsSession = typeof analyticsSessions.$inferInsert;
export type TopupPlan = typeof topupPlans.$inferSelect;
export type NewTopupPlan = typeof topupPlans.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type NewCreditTransaction = typeof creditTransactions.$inferInsert;
