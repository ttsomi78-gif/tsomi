import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import {
  DEFAULT_SHIPPING_RATES,
  SHIPPING_ZONES,
  type ShippingRates,
} from "@/lib/shipping";

/**
 * Shop-wide knobs the admin can turn without a deploy. One JSON row per
 * concern in the `settings` table; a missing row means "use the defaults".
 */

const SHIPPING_KEY = "shipping";

export async function getShippingRates(): Promise<ShippingRates> {
  const [row] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, SHIPPING_KEY))
    .limit(1);

  const stored =
    row && typeof row.value === "object" && row.value !== null
      ? (row.value as Record<string, unknown>)
      : {};

  // Each zone falls back on its own, so a rate added after the row was first
  // saved still gets its default rather than NaN.
  const rates = { ...DEFAULT_SHIPPING_RATES };
  const valid = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value >= 0;
  for (const zone of SHIPPING_ZONES) {
    const value = stored[zone];
    if (valid(value)) rates[zone] = value;
  }
  // A row saved when Europe was a single zone: its "eu" rate covers both tiers.
  if (valid(stored.eu)) {
    if (!valid(stored.euA)) rates.euA = stored.eu;
    if (!valid(stored.euB)) rates.euB = stored.eu;
  }
  return rates;
}

export async function saveShippingRates(rates: ShippingRates): Promise<void> {
  const now = new Date();
  await db
    .insert(settings)
    .values({ key: SHIPPING_KEY, value: rates, updatedAt: now })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: rates, updatedAt: now },
    });
}
