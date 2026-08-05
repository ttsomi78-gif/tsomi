import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

const directUrl = process.env.DIRECT_URL;
if (!directUrl) throw new Error("DIRECT_URL is not set");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: directUrl },
} satisfies Config;
