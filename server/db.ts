import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import pg from "pg";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

function cleanPgUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

let pool: pg.Pool | null = null;
try {
  pool = new pg.Pool({ connectionString: cleanPgUrl(process.env.DATABASE_URL!) });
} catch (e) {
  console.warn("[db] pg.Pool init failed (session store will use memory):", e);
}

export { pool };
