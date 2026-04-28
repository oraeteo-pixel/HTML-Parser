import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// @neondatabase/serverless v1+ requires passing the URL directly to drizzle
export const db = drizzle(process.env.DATABASE_URL!, { schema });

// pool is not available in HTTP mode; export null for compat
export const pool = null;
