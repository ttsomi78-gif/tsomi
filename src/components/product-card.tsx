"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { categories, productColors, type Product } from "@/lib/products";
import { formatGel } from "@/lib/money";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export const productImageSizes =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

const LOW_STOCK_THRESHOLD = 3;

/**
 * Catalog card — the whole card is a link to the product page, where color,
 * size and add-to-cart live (Nike-style PDP flow).
 */
export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: Product;
  locale: LocaleId;
  dict?: Dictionary;
}) {
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const categoryLabel = categories.find((c) => c.id === product.category)?.label;
  const colors = productColors(product.variants);
  /** Distinct sizes that are actually in stock, in variant order. */
  const sizesInStock = [
    ...new Set(
      product.variants
        .filter((variant) => variant.size && variant.stock > 0)
        .map((variant) => variant.size as string),
    ),
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group h-full"
    >
      <Link
        href={`/${locale}/product/${product.id}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-ink/5 ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/15 hover:ring-terracotta/20"
      >
        <div className="relative block aspect-4/5 w-full overflow-hidden bg-sand">
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-4">
            {soldOut ? (
              <span className="rounded-full bg-ink/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream shadow-md backdrop-blur-sm">
                {dict?.product.soldOut ?? "Sold out"}
              </span>
            ) : product.tag ? (
              <span className="rounded-full bg-terracotta px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream shadow-md shadow-terracotta/30">
                {product.tag}
              </span>
            ) : (
              <span />
            )}
            {lowStock && (
              <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink shadow-md">
                {(dict?.product.lowStock ?? "Only {count} left").replace(
                  "{count}",
                  String(product.stock),
                )}
              </span>
            )}
          </div>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes={productImageSizes}
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${soldOut ? "opacity-60 grayscale" : ""}`}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes={productImageSizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex flex-1 flex-col gap-3 border-t border-ink/[0.06] bg-white px-5 py-4">
          <div>
            {categoryLabel && (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta/70">
                {categoryLabel}
              </p>
            )}
            <h3 className="mt-1 font-bold leading-tight">{product.name}</h3>
            <p className="font-georgian mt-0.5 text-sm text-ink/45">
              {product.georgian}
            </p>
            {(colors.length > 0 || sizesInStock.length > 0) && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {colors.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    {colors.map(({ colorName, colorHex }) => (
                      <span
                        key={colorName}
                        title={colorName}
                        className="h-4 w-4 rounded-full border border-ink/15 shadow-sm"
                        style={{ backgroundColor: colorHex ?? "#d2bd9c" }}
                      />
                    ))}
                  </span>
                )}
                {sizesInStock.length > 0 && (
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/45">
                    {sizesInStock.join(" · ")}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/[0.06] pt-3">
            <span className="font-display text-lg text-terracotta">
              {formatGel(product.price)} ₾
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink ring-1 ring-tan/50 transition-all duration-200 group-hover:bg-yolk group-hover:ring-yolk">
              <ArrowIcon className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
