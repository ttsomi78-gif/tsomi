import {
  pgEnum,
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", ["tees", "bags"]);

export const products = pgTable("products", {
  id: text("id").primaryKey(),

  // Per-language copy. English is the only required language — every other
  // language falls back to the English value when left blank (see
  // `resolveLocalizedProduct` in `@/lib/products`).
  nameEn: text("name_en").notNull(),
  nameRu: text("name_ru"),
  nameKa: text("name_ka"),
  nameJa: text("name_ja"),

  altEn: text("alt_en").notNull(),
  altRu: text("alt_ru"),
  altKa: text("alt_ka"),
  altJa: text("alt_ja"),

  tagEn: text("tag_en"),
  tagRu: text("tag_ru"),
  tagKa: text("tag_ka"),
  tagJa: text("tag_ja"),

  category: categoryEnum("category").notNull(),
  priceTetri: integer("price_tetri").notNull(),
  imageUrl: text("image_url").notNull(),
  hoverImageUrl: text("hover_image_url"),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  /** Hand-picked by the admin to appear in the homepage carousel — e.g. bestsellers. */
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;

/**
 * `pending` until Bank of Georgia calls back. `expired` is set by the sweep in
 * `@/lib/orders` for sessions the customer abandoned — BOG stops caring about
 * an order after its TTL, so nothing else would ever move those rows.
 */
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
]);

export const orders = pgTable(
  "orders",
  {
    // Also sent to BOG as `external_order_id`, and used as the public status
    // URL (/[locale]/order/<id>), so it must stay unguessable — see `newOrderId`.
    id: text("id").primaryKey(),

    status: orderStatusEnum("status").notNull().default("pending"),

    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),

    shippingCity: text("shipping_city").notNull(),
    shippingAddress: text("shipping_address").notNull(),
    shippingNote: text("shipping_note"),

    /** Language the order was placed in — the status page and any receipt use it. */
    locale: text("locale").notNull().default("en"),

    // Money is stored in tetri (integers) end to end, exactly like `products`.
    // GEL only ever appears at the BOG boundary and in the UI.
    itemsTetri: integer("items_tetri").notNull(),
    deliveryTetri: integer("delivery_tetri").notNull(),
    totalTetri: integer("total_tetri").notNull(),

    bogOrderId: text("bog_order_id").unique(),
    paymentUrl: text("payment_url"),
    transactionId: text("transaction_id"),
    paymentMethod: text("payment_method"),
    failureReason: text("failure_reason"),
    /** Raw BOG callback payload, kept verbatim for support and disputes. */
    callbackData: jsonb("callback_data"),

    /**
     * Guards the one-time stock decrement. BOG retries callbacks, and the status
     * page reconciles independently, so "did we already take the stock?" has to be
     * a fact in the row rather than an inference from `status`.
     */
    stockApplied: boolean("stock_applied").notNull().default(false),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("orders_status_created_idx").on(table.status, table.createdAt),
    index("orders_email_idx").on(table.customerEmail),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    // Nulled rather than blocked when a product is deleted — a paid order has to
    // survive the admin removing the product it was for.
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),

    // Snapshot of what was actually bought. Re-reading today's product row would
    // misreport old orders after any rename or price change.
    name: text("name").notNull(),
    unitPriceTetri: integer("unit_price_tetri").notNull(),
    quantity: integer("quantity").notNull(),
    totalTetri: integer("total_tetri").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export type OrderRow = typeof orders.$inferSelect;
export type NewOrderRow = typeof orders.$inferInsert;
export type OrderItemRow = typeof orderItems.$inferSelect;
export type NewOrderItemRow = typeof orderItems.$inferInsert;
export type OrderStatus = OrderRow["status"];
