import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { products, type NewProductRow } from "../src/db/schema";

// This script runs via plain `tsx`, outside Next's bundler — it can't import
// `src/db/client.ts` because that file's `server-only` guard always throws
// under plain Node/tsx execution (the "react-server" condition that makes it
// a no-op is only applied inside Next's own build). Connect directly instead.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

/** The original hardcoded catalog, migrated once into the database. */
const seedProducts: NewProductRow[] = [
  {
    id: "khachapuri-shopper",
    nameEn: "Khachapuri Shopper",
    nameKa: "ხაჭაპურის შოპერი",
    category: "bags",
    priceTetri: 6900,
    imageUrl: "/products/khachapuri-shopper.jpg",
    hoverImageUrl: "/products/khachapuri-shopper-worn.jpg",
    altEn: "Cream canvas shopper bag covered in adjaruli khachapuri prints, with a plush khachapuri pocket",
    tagEn: "Icon",
    stock: 20,
    sortOrder: 0,
  },
  {
    id: "khinkali-street",
    nameEn: "Khinkali Street Tee",
    nameKa: "ხინკალი",
    category: "tees",
    priceTetri: 8900,
    imageUrl: "/products/khinkali-street.jpg",
    altEn: "White oversized tee with a khinkali-headed character in a bomber jacket, next to TSOMI craft packaging",
    tagEn: "New",
    stock: 20,
    sortOrder: 1,
  },
  {
    id: "mr-khachapuri",
    nameEn: "Mr. Khachapuri Tee",
    nameKa: "ბატონი ხაჭაპური",
    category: "tees",
    priceTetri: 8900,
    imageUrl: "/products/mr-khachapuri.jpg",
    altEn: "Black oversized tee with Mr. Khachapuri in a grey suit and sunglasses, holding a glass of wine",
    tagEn: "Best seller",
    stock: 20,
    sortOrder: 2,
  },
  {
    id: "gallery-tee",
    nameEn: "Gallery Back-Print Tee",
    nameKa: "გალერეა",
    category: "tees",
    priceTetri: 9500,
    imageUrl: "/products/gallery-tee.jpg",
    altEn: "Black oversized tee with a framed gallery-style back print of a khinkali-headed figure",
    stock: 20,
    sortOrder: 3,
  },
  {
    id: "khinkali-trio",
    nameEn: "Khinkali Trio Tee",
    nameKa: "სამი ხინკალი",
    category: "tees",
    priceTetri: 8900,
    imageUrl: "/products/khinkali-tee.png",
    altEn: "Black oversized tee with a leopard-print patch holding three colorful khinkali dumplings",
    stock: 20,
    sortOrder: 4,
  },
];

async function main() {
  await db.insert(products).values(seedProducts).onConflictDoNothing();
  console.log(`Seeded ${seedProducts.length} products (existing rows left untouched).`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
