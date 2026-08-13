import "server-only";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Db = ReturnType<typeof createDb>;

declare global {
  var __tsomiDb: Db | undefined;
}

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false, max: 5 });
  return drizzle(client, { schema });
}

// Created lazily on first query — importing this module must not require
// DATABASE_URL, or `next build` (which imports every route without a real
// environment, e.g. inside `docker build`) would crash. Cached on globalThis
// so dev-mode Fast Refresh reuses one pool instead of opening a new one on
// every reload.
function getDb(): Db {
  if (!global.__tsomiDb) global.__tsomiDb = createDb();
  return global.__tsomiDb;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop) as unknown;
    // bind to the real instance so drizzle's methods never see the proxy as `this`
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(real) : value;
  },
});
