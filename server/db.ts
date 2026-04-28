import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// @neondatabase/serverless v1.x removed the regular function call signature
// but drizzle-orm's neon-http session calls client(sql, params, options).
// We wrap the neon tagged-template function so it also accepts regular calls.
const rawSql = neon(process.env.DATABASE_URL!);

function neonClient(strings: TemplateStringsArray | string, ...values: any[]): any {
  if (typeof strings === "string") {
    // drizzle calls: client(query, params, options) — redirect to sql.query()
    const params = values[0] ?? [];
    const options = values[1] ?? {};
    return (rawSql as any).query(strings, params, options);
  }
  // Normal tagged template: sql`SELECT ${val}`
  return rawSql(strings as TemplateStringsArray, ...values);
}
// Copy over .query and .unsafe methods needed by drizzle internals
(neonClient as any).query = (rawSql as any).query;
(neonClient as any).unsafe = (rawSql as any).unsafe;
(neonClient as any).transaction = (rawSql as any).transaction;

export const db = drizzle(neonClient as any, { schema });

// pool is not available in HTTP mode; export null for compat
export const pool = null;
