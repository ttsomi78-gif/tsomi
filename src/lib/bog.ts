import "server-only";
import { createVerify } from "node:crypto";
import { tetriToGel } from "@/lib/money";
import type { LocaleId } from "@/lib/products";

/**
 * Bank of Georgia e-commerce API.
 *
 * Flow: authenticate (client_credentials) → create an order → redirect the
 * customer to BOG's hosted payment page → BOG POSTs a signed callback to us.
 * The callback is the only source of truth for "was this paid"; `fetchBogOrder`
 * exists so a lost callback doesn't strand an order forever.
 */

const AUTH_URL = "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const API_BASE = "https://api.bog.ge/payments/v1";

/** Minutes BOG keeps the payment page alive. Mirrored into `orders.expiresAt`. */
export const BOG_ORDER_TTL_MINUTES = 30;

/**
 * BOG's callback-signing public key, published by the bank. Overridable via env
 * so a key rotation is a redeploy of config rather than of code.
 */
const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4RUyAw3+CdkS3ZNILQh
zHI9Hemo+vKB9U2BSabppkKjzjjkf+0Sm76hSMiu/HFtYhqWOESryoCDJoqffY0Q
1VNt25aTxbj068QNUtnxQ7KQVLA+pG0smf+EBWlS1vBEAFbIas9d8c9b9sSEkTrr
TYQ90WIM8bGB6S/KLVoT1a7SnzabjoLc5Qf/SLDG5fu8dH8zckyeYKdRKSBJKvhx
tcBuHV4f7qsynQT+f2UYbESX/TLHwT5qFWZDHZ0YUOUIvb8n7JujVSGZO9/+ll/g
4ZIWhC1MlJgPObDwRkRd8NFOopgxMcMsDIZIoLbWKhHVq67hdbwpAq9K9WMmEhPn
PwIDAQAB
-----END PUBLIC KEY-----`;

export class BogError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "BogError";
  }
}

// ── auth ────────────────────────────────────────────────────────────────────

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) return tokenCache.token;

  const clientId = process.env.BOG_CLIENT_ID;
  const clientSecret = process.env.BOG_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new BogError("BOG_CLIENT_ID and BOG_CLIENT_SECRET are not set");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
      Accept: "application/json",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new BogError(`BOG auth failed: ${response.status} ${text}`, response.status);
  }

  let data: { access_token?: string; expires_in?: number };
  try {
    data = JSON.parse(text);
  } catch {
    throw new BogError(`BOG auth returned non-JSON: ${text.slice(0, 200)}`);
  }
  if (!data.access_token) throw new BogError("BOG auth response had no access_token");

  // Retire the cached token a minute early so an in-flight request can't be the
  // one that discovers it expired.
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 - 60_000,
  };
  return data.access_token;
}

// ── order creation ──────────────────────────────────────────────────────────

export type BogBasketItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceTetri: number;
  totalTetri: number;
};

/** BOG's hosted page only speaks Georgian and English; ru/ja fall back to en. */
function bogLanguage(locale: LocaleId): "ka" | "en" {
  return locale === "ka" ? "ka" : "en";
}

export async function createBogOrder(input: {
  /** Our order id — also the Idempotency-Key, so retries never double-charge. */
  externalOrderId: string;
  totalTetri: number;
  deliveryTetri: number;
  items: BogBasketItem[];
  locale: LocaleId;
  callbackUrl: string;
  successUrl: string;
  failUrl: string;
}): Promise<{ bogOrderId: string; paymentUrl: string }> {
  const token = await getAccessToken();

  const basket = input.items.map((item) => ({
    product_id: item.productId,
    description: item.name,
    quantity: item.quantity,
    unit_price: tetriToGel(item.unitPriceTetri),
    total_price: tetriToGel(item.totalTetri),
  }));

  // Delivery rides along as a basket line so BOG's receipt totals reconcile with
  // ours — `total_amount` is validated against the basket on their side.
  if (input.deliveryTetri > 0) {
    basket.push({
      product_id: "delivery",
      description: "Delivery",
      quantity: 1,
      unit_price: tetriToGel(input.deliveryTetri),
      total_price: tetriToGel(input.deliveryTetri),
    });
  }

  const response = await fetch(`${API_BASE}/ecommerce/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Accept-Language": bogLanguage(input.locale),
      // Derived from our order id, not random: a network retry of this exact
      // order must resolve to the same BOG order rather than a second one.
      "Idempotency-Key": input.externalOrderId,
    },
    body: JSON.stringify({
      callback_url: input.callbackUrl,
      external_order_id: input.externalOrderId,
      purchase_units: {
        currency: "GEL",
        total_amount: tetriToGel(input.totalTetri),
        basket,
      },
      redirect_urls: { success: input.successUrl, fail: input.failUrl },
      ttl: BOG_ORDER_TTL_MINUTES,
    }),
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new BogError(
      `BOG order creation failed: ${response.status} ${text.slice(0, 500)}`,
      response.status,
    );
  }

  const data = JSON.parse(text) as {
    id?: string;
    _links?: { redirect?: { href?: string } };
  };
  const bogOrderId = data.id;
  const paymentUrl = data._links?.redirect?.href;
  if (!bogOrderId || !paymentUrl) {
    throw new BogError(`BOG order response missing id/redirect: ${text.slice(0, 300)}`);
  }

  return { bogOrderId, paymentUrl };
}

// ── callbacks ───────────────────────────────────────────────────────────────

/**
 * Verifies the `Callback-Signature` header against the *raw* request body.
 * Re-serialising parsed JSON changes byte order and whitespace, which breaks the
 * signature — callers must pass the exact bytes BOG sent.
 */
export function verifyBogSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  try {
    const publicKey = process.env.BOG_PUBLIC_KEY?.trim() || DEFAULT_PUBLIC_KEY;
    return createVerify("RSA-SHA256")
      .update(rawBody, "utf8")
      .verify(publicKey, signature, "base64");
  } catch {
    return false;
  }
}

export type BogOrderStatus = "pending" | "paid" | "failed";

/**
 * `partial_completed` means BOG captured less than the full amount. We treat it
 * as unpaid rather than paid: the caller compares the captured amount against
 * the order total and only a full match becomes `paid`.
 */
export function mapBogStatus(statusKey: string | null | undefined): BogOrderStatus {
  switch ((statusKey ?? "").toLowerCase()) {
    case "completed":
      return "paid";
    case "rejected":
    case "refunded_partially":
    case "refunded":
      return "failed";
    case "partial_completed":
    case "created":
    case "processing":
      return "pending";
    default:
      return "pending";
  }
}

/** BOG sends `expiration` for abandoned sessions; other reasons are already prose. */
export function humanizeRejectReason(reason: string | null | undefined): string | null {
  if (!reason) return null;
  if (reason === "expiration") return "Payment session expired before completion";
  return reason;
}

/** Shape of the `body` object inside an `order_payment` callback / receipt. */
export type BogOrderBody = {
  order_id?: string;
  external_order_id?: string;
  order_status?: { key?: string; value?: string };
  reject_reason?: string;
  transaction_id?: string;
  payment_detail?: {
    transaction_id?: string;
    payment_method?: string;
    code?: string;
    code_description?: string;
  };
  purchase_units?: {
    request_amount?: string | number;
    transfer_amount?: string | number;
    currency_code?: string;
  };
};

/** Amount BOG actually captured, in tetri — `null` when absent or unparseable. */
export function capturedTetri(body: BogOrderBody): number | null {
  const raw = body.purchase_units?.transfer_amount ?? body.purchase_units?.request_amount;
  if (raw === undefined || raw === null) return null;
  const gel = typeof raw === "number" ? raw : Number.parseFloat(raw);
  if (!Number.isFinite(gel)) return null;
  return Math.round(gel * 100);
}

/**
 * Re-reads an order straight from BOG. Used by the status page when our row is
 * still `pending`, so a dropped or delayed callback self-heals on the customer's
 * next page view instead of needing manual intervention.
 */
export async function fetchBogOrder(bogOrderId: string): Promise<BogOrderBody | null> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/receipt/${bogOrderId}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new BogError(
      `BOG receipt fetch failed: ${response.status}`,
      response.status,
    );
  }
  return (await response.json()) as BogOrderBody;
}
