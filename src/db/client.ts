import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

declare global {
  var __tsomiPostgresClient: ReturnType<typeof postgres> | undefined;
}

function getConnectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

// Cached on globalThis so dev-mode Fast Refresh reuses one pool instead of
// opening a new one on every reload.
const client =
  global.__tsomiPostgresClient ??
  postgres(getConnectionString(), { prepare: false, max: 5 });

if (process.env.NODE_ENV !== "production") {
  global.__tsomiPostgresClient = client;
}

export const db = drizzle(client, { schema });
