import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy initialization to avoid build-time errors
let sql: NeonQueryFunction<false, false> | null = null;
let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
  if (!_db) {
    // Netlify extension uses NETLIFY_DATABASE_URL, fallback to DATABASE_URL for local dev
    const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("Database connection string not set (NETLIFY_DATABASE_URL or DATABASE_URL)");
    }
    sql = neon(dbUrl);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Proxy object that lazily initializes the database
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    const database = getDb();
    const value = (database as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(database);
    }
    return value;
  },
});

export { sql };
