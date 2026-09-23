"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/session";
import { gelToTetri } from "@/lib/money";
import { saveShippingRates } from "@/lib/settings";
import { SHIPPING_ZONES, type ShippingRates } from "@/lib/shipping";

const gelAmount = z.coerce
  .number()
  .min(0, "A rate can't be negative")
  .max(10000, "That's more than 10 000 ₾ — check the number");

const ratesSchema = z.object(
  Object.fromEntries(SHIPPING_ZONES.map((zone) => [zone, gelAmount])) as Record<
    keyof ShippingRates,
    typeof gelAmount
  >,
);

export type ShippingRatesState = { error?: string; saved?: boolean } | undefined;

export async function updateShippingRates(
  _prevState: ShippingRatesState,
  formData: FormData,
): Promise<ShippingRatesState> {
  await requireAdminSession();

  const parsed = ratesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const rates = Object.fromEntries(
    SHIPPING_ZONES.map((zone) => [zone, gelToTetri(parsed.data[zone])]),
  ) as ShippingRates;
  await saveShippingRates(rates);

  // The rates show up in the cart drawer (every storefront page's layout),
  // product pages and the delivery policy page — the layout pattern covers
  // all of it in every locale at once.
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/settings");
  return { saved: true };
}
