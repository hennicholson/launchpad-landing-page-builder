import { pgTable, text, timestamp, jsonb, uuid, integer } from "drizzle-orm/pg-core";
import type { LandingPage, ProjectSettings } from "./page-schema";

// Plan types for the business model
export type PlanType = "free" | "starter" | "pro" | "enterprise";

export const PLAN_LIMITS: Record<PlanType, { projects: number; deploys: number }> = {
  free: { projects: 1, deploys: 3 },
  starter: { projects: 5, deploys: 50 },
  pro: { projects: 25, deploys: 500 },
  enterprise: { projects: -1, deploys: -1 }, // unlimited
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
  plan: text("plan").$type<PlanType>().default("enterprise").notNull(),
  projectCount: integer("project_count").default(0).notNull(),
  deployCount: integer("deploy_count").default(0).notNull(),
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
