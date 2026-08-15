"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";
import { categories, type Product } from "@/lib/products";
import { formatGel } from "@/lib/money";
import type { Dictionary } from "@/i18n/get-dictionary";

export const productImageSizes =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

const LOW_STOCK_THRESHOLD = 3;

export function ProductCard({
  product,
  dict,
}: {
  product: Product;
  dict?: Dictionary;
}) {
  const [zoomed, setZoomed] = useState(false);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const categoryLabel = categories.find((c) => c.id === product.category)?.label;

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-ink/5 ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/15 hover:ring-terracotta/20"
      >
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`Zoom in on ${product.name}`}
          className="relative block aspect-4/5 w-full cursor-zoom-in overflow-hidden bg-sand"
        >
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
          {/* zoom chip — revealed on hover, always visible on touch devices */}
          <span className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-cream opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 pointer-coarse:opacity-100">
            <ZoomIcon className="h-4 w-4" />
          </span>
        </button>
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
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink/[0.06] pt-3">
            <span className="font-display text-lg text-terracotta">
              {formatGel(product.price)} ₾
            </span>
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={`Zoom in on ${product.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink ring-1 ring-tan/50 transition-all duration-200 hover:bg-yolk hover:ring-yolk active:scale-95"
            >
              <ZoomIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.article>

      {zoomed &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-10"
            onClick={() => setZoomed(false)}
          >
            <button
              type="button"
              onClick={() => setZoomed(false)}
              aria-label="Close zoomed image"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:bg-cream/10 sm:right-8 sm:top-8"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative h-full w-full max-w-3xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>,
          document.body,
        )}
    </>
  );
}

function ZoomIcon({ className = "" }: { className?: string }) {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
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
