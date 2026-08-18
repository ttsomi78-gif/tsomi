import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  orderItems,
  orders,
  products,
  type OrderItemRow,
  type OrderRow,
} from "@/db/schema";
import {
  BOG_ORDER_TTL_MINUTES,
  capturedTetri,
  fetchBogOrder,
  humanizeRejectReason,
  mapBogStatus,
  type BogOrderBody,
} from "@/lib/bog";
import { resolveLocalized, type LocaleId } from "@/lib/products";

/** 5 ₾ unless DELIVERY_FEE_TETRI says otherwise. Georgia-wide flat rate. */
const DEFAULT_DELIVERY_FEE_TETRI = 500;

/** Nobody legitimately orders 500 of one tee; this bounds a hostile cart payload. */
const MAX_QUANTITY_PER_LINE = 20;

export function getDeliveryFeeTetri(): number {
  const raw = process.env.DELIVERY_FEE_TETRI;
  if (!raw) return DEFAULT_DELIVERY_FEE_TETRI;
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : DEFAULT_DELIVERY_FEE_TETRI;
}

export type CartLine = { productId: string; quantity: number };

export type PricedLine = {
  productId: string;
  name: string;
  unitPriceTetri: number;
  quantity: number;
  totalTetri: number;
};

export type PricedCart = {
  lines: PricedLine[];
  itemsTetri: number;
  deliveryTetri: number;
  totalTetri: number;
};

export type CartErrorCode = "empty" | "unavailable" | "out_of_stock";

export class CartError extends Error {
  constructor(
    readonly code: CartErrorCode,
    message: string,
    /** Name of the offending product, when the failure is about one item. */
    readonly productName?: string,
    /** Units actually left, so the UI can say how many rather than just "no". */
    readonly remaining?: number,
  ) {
    super(message);
    this.name = "CartError";
  }
}

/**
 * Recomputes the cart from the database.
 *
 * The client cart holds prices only so it can render a running total — none of
 * those numbers are trusted here. Every price, name and stock level is re-read
 * from `products`, so a tampered request can change *what* is bought but never
 * *what it costs*.
 */
export async function priceCart(
  lines: CartLine[],
  locale: LocaleId,
): Promise<PricedCart> {
  // Merge duplicate lines before validating, or two lines of 15 would each pass
  // a stock check of 20 while together exceeding it.
  const wanted = new Map<string, number>();
  for (const line of lines) {
    const quantity = Math.floor(Number(line.quantity));
    if (!line.productId || !Number.isFinite(quantity) || quantity <= 0) continue;
    wanted.set(line.productId, (wanted.get(line.productId) ?? 0) + quantity);
  }
  if (wanted.size === 0) throw new CartError("empty", "Your cart is empty");

  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.id, [...wanted.keys()]));
  const byId = new Map(rows.map((row) => [row.id, row]));

  const priced: PricedLine[] = [];
  for (const [productId, rawQuantity] of wanted) {
    const row = byId.get(productId);
    if (!row || !row.isActive) {
      throw new CartError("unavailable", "An item in your cart is no longer available");
    }

    const name = resolveLocalized(
      { en: row.nameEn, ru: row.nameRu, ka: row.nameKa, ja: row.nameJa },
      locale,
    );
    const quantity = Math.min(rawQuantity, MAX_QUANTITY_PER_LINE);
    if (row.stock < quantity) {
      throw new CartError(
        "out_of_stock",
        row.stock <= 0
          ? `"${name}" is sold out`
          : `Only ${row.stock} left of "${name}"`,
        name,
        row.stock,
      );
    }

    priced.push({
      productId,
      name,
      unitPriceTetri: row.priceTetri,
      quantity,
      totalTetri: row.priceTetri * quantity,
    });
  }

  const itemsTetri = priced.reduce((sum, line) => sum + line.totalTetri, 0);
  const deliveryTetri = getDeliveryFeeTetri();
  return {
    lines: priced,
    itemsTetri,
    deliveryTetri,
    totalTetri: itemsTetri + deliveryTetri,
  };
}

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  note?: string | null;
};

/**
 * Writes the `pending` order and its line snapshot.
 *
 * Stock is checked here but deliberately *not* reserved — an abandoned checkout
 * would otherwise hold inventory hostage with no release path. The decrement
 * happens in `settleOrder` once payment actually lands.
 */
export async function createPendingOrder(input: {
  cart: PricedCart;
  customer: CustomerDetails;
  locale: LocaleId;
}): Promise<OrderRow> {
  // A random UUID rather than a sequence: this id is the public status-page URL,
  // so it must not be guessable from a neighbouring order.
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + BOG_ORDER_TTL_MINUTES * 60_000);

  return db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        id,
        status: "pending",
        customerName: input.customer.name,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        shippingCity: input.customer.city,
        shippingAddress: input.customer.address,
        shippingNote: input.customer.note?.trim() || null,
        locale: input.locale,
        itemsTetri: input.cart.itemsTetri,
        deliveryTetri: input.cart.deliveryTetri,
        totalTetri: input.cart.totalTetri,
        expiresAt,
      })
      .returning();

    await tx.insert(orderItems).values(
      input.cart.lines.map((line) => ({
        id: randomUUID(),
        orderId: id,
        productId: line.productId,
        name: line.name,
        unitPriceTetri: line.unitPriceTetri,
        quantity: line.quantity,
        totalTetri: line.totalTetri,
      })),
    );

    return order;
  });
}

export async function attachBogOrder(
  orderId: string,
  bogOrderId: string,
  paymentUrl: string,
): Promise<void> {
  await db
    .update(orders)
    .set({ bogOrderId, paymentUrl, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}

export async function getOrderById(id: string): Promise<OrderRow | null> {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row ?? null;
}

export async function getOrderByBogId(bogOrderId: string): Promise<OrderRow | null> {
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.bogOrderId, bogOrderId))
    .limit(1);
  return row ?? null;
}

export async function getOrderItems(orderId: string): Promise<OrderItemRow[]> {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

/**
 * Applies a BOG result to an order. Safe to call repeatedly and concurrently:
 * BOG retries callbacks, and the status page reconciles on its own, so this can
 * genuinely run twice for the same order at the same moment.
 *
 * Idempotency comes from the `status = 'pending'` predicate on the UPDATE —
 * whichever caller loses the race updates zero rows and returns the row the
 * winner wrote.
 */
export async function settleOrder(
  orderId: string,
  body: BogOrderBody,
): Promise<OrderRow | null> {
  const existing = await getOrderById(orderId);
  if (!existing) return null;
  // `expired` is our own guess that the customer walked away, not a fact from
  // the bank — a real payment arriving late must still be able to overturn it.
  // Anything else is already resolved, so this is a retry, not new information.
  if (existing.status !== "pending" && existing.status !== "expired") {
    return existing;
  }

  const mapped = mapBogStatus(body.order_status?.key);
  if (mapped === "pending") return existing;

  let status: OrderRow["status"] = mapped === "paid" ? "paid" : "failed";
  let failureReason = humanizeRejectReason(
    body.payment_detail?.code_description ?? body.reject_reason,
  );

  // A failure tells us nothing we didn't already record when we expired it.
  if (status === "failed" && existing.status === "expired") return existing;

  // Never mark an order paid on BOG's word alone — confirm the amount captured
  // matches what we charged. A short capture is a failure, not a sale.
  if (status === "paid") {
    const captured = capturedTetri(body);
    if (captured !== null && captured !== existing.totalTetri) {
      status = "failed";
      failureReason = `Amount mismatch: captured ${(captured / 100).toFixed(2)} ₾, expected ${(existing.totalTetri / 100).toFixed(2)} ₾`;
    }
  }

  const now = new Date();

  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(orders)
      .set({
        status,
        failureReason,
        transactionId:
          body.payment_detail?.transaction_id ?? body.transaction_id ?? null,
        paymentMethod: body.payment_detail?.payment_method ?? null,
        callbackData: body,
        paidAt: status === "paid" ? now : null,
        failedAt: status === "failed" ? now : null,
        updatedAt: now,
      })
      // The status predicate is what makes this idempotent: a concurrent
      // callback and reconcile both run this UPDATE, and only one matches a row.
      .where(
        and(
          eq(orders.id, orderId),
          inArray(orders.status, ["pending", "expired"]),
        ),
      )
      .returning();

    // Lost the race to a concurrent callback/reconcile — its write stands.
    if (!updated) {
      const [current] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      return current ?? null;
    }

    if (updated.status === "paid" && !updated.stockApplied) {
      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));

      for (const item of items) {
        if (!item.productId) continue;
        // GREATEST floors at zero: two customers can pay for the last unit within
        // the same second, and a negative stock column helps nobody. The admin
        // sees both paid orders and reconciles manually.
        await tx
          .update(products)
          .set({
            stock: sql`GREATEST(${products.stock} - ${item.quantity}, 0)`,
            updatedAt: now,
          })
          .where(eq(products.id, item.productId));
      }

      const [withStock] = await tx
        .update(orders)
        .set({ stockApplied: true, updatedAt: now })
        .where(eq(orders.id, orderId))
        .returning();
      return withStock ?? updated;
    }

    return updated;
  });
}

/**
 * Self-heal for a `pending` order: asks BOG directly what happened.
 *
 * Without this, a single dropped callback strands an order forever — the
 * customer is charged and the shop never knows. Called from the status page, so
 * the customer returning from BOG is itself the trigger.
 */
export async function reconcileOrder(order: OrderRow): Promise<OrderRow> {
  if (order.status !== "pending") return order;

  if (order.bogOrderId) {
    try {
      const body = await fetchBogOrder(order.bogOrderId);
      if (body) {
        const settled = await settleOrder(order.id, body);
        if (settled) return settled;
      }
    } catch (error) {
      // Reconciliation is best-effort: BOG being unreachable must not turn the
      // customer's status page into an error page.
      console.error("[bog] reconcile failed for order", order.id, error);
    }
  }

  if (order.expiresAt.getTime() < Date.now()) {
    const [expired] = await db
      .update(orders)
      .set({
        status: "expired",
        failureReason: "Payment session expired before completion",
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, order.id), eq(orders.status, "pending")))
      .returning();
    if (expired) return expired;
  }

  return order;
}

/**
 * Marks abandoned checkouts `expired`. BOG never calls back for a session the
 * customer walked away from, so without a sweep those rows sit `pending` forever
 * and make the admin list unreadable. Called when the admin opens Orders.
 */
export async function expireStaleOrders(): Promise<number> {
  const rows = await db
    .update(orders)
    .set({
      status: "expired",
      failureReason: "Payment session expired before completion",
      updatedAt: new Date(),
    })
    .where(and(eq(orders.status, "pending"), lt(orders.expiresAt, new Date())))
    .returning({ id: orders.id });
  return rows.length;
}
