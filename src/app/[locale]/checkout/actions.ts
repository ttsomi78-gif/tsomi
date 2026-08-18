"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createBogOrder } from "@/lib/bog";
import {
  CartError,
  attachBogOrder,
  createPendingOrder,
  priceCart,
  type CartLine,
} from "@/lib/orders";
import { getSiteUrl } from "@/lib/site";
import { isLocale } from "@/i18n/config";
import type { LocaleId } from "@/lib/products";

/**
 * Coded rather than pre-worded so the client can render the message in the
 * customer's language — the server has no business picking the wording.
 */
export type CheckoutError =
  | { code: "empty" | "unavailable" | "invalid" | "payment" }
  | { code: "sold_out"; product: string }
  | { code: "stock"; product: string; count: number };

export type CheckoutState = { error: CheckoutError } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{9,20}$/;

const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => EMAIL_PATTERN.test(value)),
  phone: z
    .string()
    .trim()
    .refine((value) => PHONE_PATTERN.test(value)),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(300),
  note: z.string().trim().max(500).optional(),
});

const cartSchema = z
  .array(
    z.object({
      productId: z.string().trim().min(1),
      quantity: z.number().int().positive(),
    }),
  )
  .min(1)
  .max(50);

export async function startCheckout(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const rawLocale = String(formData.get("locale") ?? "");
  const locale: LocaleId = isLocale(rawLocale) ? rawLocale : "en";

  const customer = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    note: formData.get("note") || undefined,
  });
  if (!customer.success) return { error: { code: "invalid" } };

  let lines: CartLine[];
  try {
    lines = cartSchema.parse(JSON.parse(String(formData.get("cart") ?? "[]")));
  } catch {
    return { error: { code: "empty" } };
  }

  let paymentUrl: string;
  try {
    // Prices, names and stock all come from the database here — the submitted
    // cart contributes product ids and quantities, nothing else.
    const cart = await priceCart(lines, locale);
    const order = await createPendingOrder({
      cart,
      customer: customer.data,
      locale,
    });

    const siteUrl = getSiteUrl();
    // Both redirect targets are the same page on purpose: the status shown there
    // is read from our database and BOG, never inferred from which URL fired.
    // A customer who edits the redirect URL learns nothing and changes nothing.
    const statusUrl = `${siteUrl}/${locale}/order/${order.id}`;

    const bog = await createBogOrder({
      externalOrderId: order.id,
      totalTetri: cart.totalTetri,
      deliveryTetri: cart.deliveryTetri,
      items: cart.lines,
      locale,
      callbackUrl: `${siteUrl}/api/bog/callback`,
      successUrl: statusUrl,
      failUrl: statusUrl,
    });

    await attachBogOrder(order.id, bog.bogOrderId, bog.paymentUrl);
    paymentUrl = bog.paymentUrl;
  } catch (error) {
    if (error instanceof CartError) {
      if (error.code === "empty") return { error: { code: "empty" } };
      if (error.code === "unavailable") return { error: { code: "unavailable" } };
      const product = error.productName ?? "";
      return error.remaining && error.remaining > 0
        ? { error: { code: "stock", product, count: error.remaining } }
        : { error: { code: "sold_out", product } };
    }
    console.error("[checkout] could not start payment", error);
    return { error: { code: "payment" } };
  }

  // Outside the try: `redirect` signals by throwing, and catching it here would
  // turn a successful checkout into a generic payment error.
  redirect(paymentUrl);
}
