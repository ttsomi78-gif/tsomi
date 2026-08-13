"use client";

import { useMemo, useState } from "react";
import { categories, type CategoryId, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import type { Dictionary } from "@/i18n/get-dictionary";

type Filter = CategoryId | "all";

export function CatalogGrid({
  products,
  dict,
}: {
  products: Product[];
  dict: Dictionary;
}) {
  const [active, setActive] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? products
        : products.filter((product) => product.category === active),
    [active, products],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={active === "all"} onClick={() => setActive("all")}>
            {dict.catalog.filterAll}
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              active={active === category.id}
              onClick={() => setActive(category.id)}
            >
              {category.label}
            </FilterButton>
          ))}
        </div>
        <p className="text-sm font-medium text-ink/45">
          {dict.catalog.itemCount.replace("{count}", String(filtered.length))}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-ink/40">
            <EmptyIcon className="h-5 w-5" />
          </span>
          <p className="text-ink/50">{dict.catalog.empty}</p>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
        active
          ? "border-ink bg-ink text-cream shadow-md shadow-ink/20"
          : "border-tan/60 bg-white/40 text-ink/60 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyIcon({ className = "" }: { className?: string }) {
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
      <path d="M3 3h18l-2 13H5L3 3Z" />
      <path d="M3 3l-1-2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}
