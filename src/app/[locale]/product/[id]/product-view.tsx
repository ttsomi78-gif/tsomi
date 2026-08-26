"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatGel } from "@/lib/money";
import {
  imagesForColor,
  productColors,
  type Product,
  type ProductVariant,
} from "@/lib/products";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

/**
 * The interactive half of the product page: gallery on the left, color/size
 * selection and add-to-cart on the right. Selecting a color swaps the gallery
 * to that color's images.
 */
export function ProductView({
  product,
  locale,
  dict,
  deliveryNote,
}: {
  product: Product;
  locale: LocaleId;
  dict: Dictionary;
  deliveryNote: string;
}) {
  const { add, openCart } = useCart();
  const colors = useMemo(() => productColors(product.variants), [product.variants]);
  const hasColors = colors.length > 0;
  const hasVariants = product.variants.length > 0;

  const firstAvailableColor =
    colors.find(({ colorName }) =>
      product.variants.some(
        (variant) => variant.colorName === colorName && variant.stock > 0,
      ),
    )?.colorName ??
    colors[0]?.colorName ??
    null;

  const [colorName, setColorName] = useState<string | null>(firstAvailableColor);
  const [variantId, setVariantId] = useState<string | null>(() => {
    // One-size products (bags with colors, or no variants at all) need no size
    // click — preselect the single candidate.
    const candidates = product.variants.filter(
      (variant) => !hasColors || variant.colorName === firstAvailableColor,
    );
    return candidates.length === 1 ? candidates[0].id : null;
  });
  const [imageIndex, setImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const gallery = imagesForColor(product, colorName);
  const activeImage = gallery[Math.min(imageIndex, gallery.length - 1)];

  const sizeOptions = product.variants.filter(
    (variant) => !hasColors || variant.colorName === colorName,
  );
  const showSizeRow = sizeOptions.some((variant) => variant.size);
  const selected =
    product.variants.find((variant) => variant.id === variantId) ?? null;

  const colorStock = (name: string) =>
    product.variants
      .filter((variant) => variant.colorName === name)
      .reduce((sum, variant) => sum + variant.stock, 0);

  const soldOut = product.stock <= 0;

  function pickColor(name: string) {
    setColorName(name);
    setImageIndex(0);
    setSizeError(false);
    const candidates = product.variants.filter(
      (variant) => variant.colorName === name,
    );
    const inStock = candidates.filter((variant) => variant.stock > 0);
    setVariantId(
      candidates.length === 1
        ? candidates[0].id
        : inStock.length === 1
          ? inStock[0].id
          : null,
    );
  }

  function pickSize(variant: ProductVariant) {
    setVariantId(variant.id);
    setSizeError(false);
  }

  function handleAdd() {
    if (soldOut) return;
    if (hasVariants) {
      if (!selected || selected.stock <= 0) {
        setSizeError(true);
        return;
      }
      // The cart line's thumbnail should be the color the customer chose.
      add({ ...product, image: activeImage.url }, selected);
    } else {
      add(product);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    openCart();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
      {/* ── gallery ── */}
      <div>
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-sand">
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={product.alt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          {soldOut && (
            <span className="absolute left-4 top-4 rounded-full bg-ink/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream shadow-md">
              {dict.product.soldOut}
            </span>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setImageIndex(index)}
                aria-label={`Image ${index + 1}`}
                aria-current={index === imageIndex}
                className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand transition-all ${
                  index === imageIndex
                    ? "ring-2 ring-ink"
                    : "opacity-70 ring-1 ring-ink/10 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── info / selection ── */}
      <div className="lg:pt-2">
        {product.tag && (
          <p className="mb-2 inline-block rounded-full bg-terracotta px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-cream">
            {product.tag}
          </p>
        )}
        <h1 className="font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
          {product.name}
        </h1>
        <p className="font-georgian mt-1 text-ink/45">{product.georgian}</p>
        <p className="mt-4 font-display text-2xl text-terracotta">
          {formatGel(product.price)} ₾
        </p>

        {hasColors && (
          <div className="mt-7">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink/55">
              {dict.product.color}
              {colorName && (
                <span className="ml-2 normal-case tracking-normal text-ink/75">
                  {colorName}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map(({ colorName: name, colorHex }) => {
                const isSoldOut = colorStock(name) <= 0;
                const active = colorName === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pickColor(name)}
                    aria-label={name}
                    aria-pressed={active}
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                      active
                        ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                        : "ring-1 ring-ink/15 hover:ring-ink/40"
                    } ${isSoldOut ? "opacity-40" : ""}`}
                  >
                    <span
                      className="h-8 w-8 rounded-full border border-ink/10"
                      style={{ backgroundColor: colorHex ?? "#d2bd9c" }}
                    />
                    {isSoldOut && (
                      <span className="absolute h-px w-9 rotate-45 bg-ink/60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showSizeRow && (
          <div className="mt-7">
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink/55">
              {dict.product.selectSize}
            </p>
            <div
              className={`grid grid-cols-4 gap-2 rounded-2xl transition-shadow sm:grid-cols-5 ${
                sizeError ? "ring-2 ring-brick ring-offset-4 ring-offset-cream" : ""
              }`}
            >
              {sizeOptions.map((variant) => {
                const isSoldOut = variant.stock <= 0;
                const active = variantId === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => pickSize(variant)}
                    disabled={isSoldOut}
                    aria-pressed={active}
                    className={`rounded-xl border-2 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : isSoldOut
                          ? "cursor-not-allowed border-tan/40 text-ink/25 line-through"
                          : "border-tan/60 text-ink/75 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {variant.size ?? "—"}
                  </button>
                );
              })}
            </div>
            {sizeError && (
              <p className="mt-2 text-sm font-semibold text-brick" role="alert">
                {dict.product.sizeRequired}
              </p>
            )}
            {selected && selected.stock > 0 && selected.stock <= 3 && (
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gold">
                {dict.product.lowStock.replace("{count}", String(selected.stock))}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wide transition-all active:scale-[0.99] disabled:cursor-not-allowed ${
            soldOut
              ? "bg-ink/10 text-ink/40"
              : justAdded
                ? "bg-green text-cream shadow-md shadow-green/25"
                : "bg-ink text-cream shadow-md shadow-ink/15 hover:bg-terracotta hover:shadow-terracotta/25"
          }`}
        >
          {soldOut
            ? dict.product.soldOut
            : justAdded
              ? dict.cart.added
              : dict.cart.add}
        </button>

        <div className="mt-6 space-y-1.5 border-t border-tan/60 pt-5 text-sm text-ink/55">
          <p>{deliveryNote}</p>
          <Link
            href={`/${locale}/shipping`}
            className="inline-block font-semibold text-ink/70 underline decoration-2 underline-offset-4 transition-colors hover:text-terracotta"
          >
            {dict.footer.shipping}
          </Link>
        </div>
      </div>
    </div>
  );
}
