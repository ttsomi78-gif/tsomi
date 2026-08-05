import {
  pgEnum,
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
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
