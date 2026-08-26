"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/components/cart-provider";
import { formatGel } from "@/lib/money";
import { productColors, type Product } from "@/lib/products";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Modal for products with variants: pick a color (swatches), then a size.
 * Sizes show live stock — disabled at zero, "only N left" when low.
 */
export function VariantPicker({
  product,
  dict,
  open,
  onClose,
}: {
  product: Product;
  dict?: Dictionary;
  open: boolean;
  onClose: () => void;
}) {
  const { add, openCart } = useCart();
  const colors = useMemo(() => productColors(product.variants), [product.variants]);
  const hasColors = colors.length > 0;

  const [colorName, setColorName] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);

  // Fresh state each open; preselect when there's only one choice.
  useEffect(() => {
    if (!open) return;
    const onlyColor = colors.length === 1 ? colors[0].colorName : null;
    setColorName(onlyColor);
    const candidates = product.variants.filter(
      (variant) => !hasColors || variant.colorName === onlyColor,
    );
    const inStock = candidates.filter((variant) => variant.stock > 0);
    setVariantId(
      candidates.length === 1
        ? candidates[0].id
        : inStock.length === 1
          ? inStock[0].id
          : null,
    );
  }, [open, colors, product.variants, hasColors]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  /** Variants visible for the current color choice (all, when no colors). */
  const sizeOptions = product.variants.filter(
    (variant) => !hasColors || variant.colorName === colorName,
  );
  const selected =
    product.variants.find((variant) => variant.id === variantId) ?? null;

  /** Total stock per color, so sold-out colors grey out. */
  const colorStock = (name: string) =>
    product.variants
      .filter((variant) => variant.colorName === name)
      .reduce((sum, variant) => sum + variant.stock, 0);

  function pickColor(name: string) {
    setColorName(name);
    // Size chosen for another color no longer applies.
    const candidates = product.variants.filter(
      (variant) => variant.colorName === name && variant.stock > 0,
    );
    setVariantId(candidates.length === 1 ? candidates[0].id : null);
  }

  function confirm() {
    if (!selected || selected.stock <= 0) return;
    add(product, selected);
    onClose();
    openCart();
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="w-full max-w-md rounded-t-3xl bg-cream p-5 shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold leading-tight">{product.name}</h2>
                <p className="mt-0.5 font-display text-lg text-terracotta">
                  {formatGel(product.price)} ₾
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={dict?.cart.close ?? "Close"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-ink transition-colors hover:bg-tan"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {hasColors && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/55">
                  {dict?.product.color ?? "Color"}
                  {colorName && (
                    <span className="ml-2 normal-case tracking-normal text-ink/70">
                      {colorName}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(({ colorName: name, colorHex }) => {
                    const soldOut = colorStock(name) <= 0;
                    const active = colorName === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => pickColor(name)}
                        disabled={soldOut}
                        aria-label={name}
                        aria-pressed={active}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          active
                            ? "ring-2 ring-ink ring-offset-2 ring-offset-cream"
                            : "ring-1 ring-ink/15 hover:ring-ink/40"
                        } ${soldOut ? "opacity-35" : ""}`}
                      >
                        <span
                          className="h-7 w-7 rounded-full border border-ink/10"
                          style={{ backgroundColor: colorHex ?? "#d2bd9c" }}
                        />
                        {soldOut && (
                          <span className="absolute h-px w-8 rotate-45 bg-ink/60" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {(!hasColors || colorName) && sizeOptions.length > 0 && (
              <div className="mt-5">
                {/* One-size products get a picker only if they have colors; a
                    lone null-size row is auto-selected, so hide the row. */}
                {sizeOptions.some((variant) => variant.size) && (
                  <>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/55">
                      {dict?.product.size ?? "Size"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((variant) => {
                        const soldOut = variant.stock <= 0;
                        const active = variantId === variant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => setVariantId(variant.id)}
                            disabled={soldOut}
                            aria-pressed={active}
                            className={`min-w-12 rounded-full border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                              active
                                ? "border-ink bg-ink text-cream"
                                : soldOut
                                  ? "border-tan/40 text-ink/30 line-through"
                                  : "border-tan/60 text-ink/70 hover:border-ink hover:text-ink"
                            }`}
                          >
                            {variant.size ?? "—"}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {selected && selected.stock > 0 && selected.stock <= 3 && (
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gold">
                    {(dict?.product.lowStock ?? "Only {count} left").replace(
                      "{count}",
                      String(selected.stock),
                    )}
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={confirm}
              disabled={!selected || selected.stock <= 0}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:bg-terracotta hover:shadow-terracotta/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dict?.cart.add ?? "Add to cart"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
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
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
