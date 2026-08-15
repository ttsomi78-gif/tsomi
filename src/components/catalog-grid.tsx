"use client";

import { useMemo, useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { categories, type CategoryId, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import type { Dictionary } from "@/i18n/get-dictionary";

type Filter = CategoryId | "all";
type SortId = "featured" | "price-asc" | "price-desc" | "name";

export function CatalogGrid({
  products,
  dict,
}: {
  products: Product[];
  dict: Dictionary;
}) {
  const [active, setActive] = useState<Filter>("all");
  const [sort, setSort] = useState<SortId>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", products.length]]);
    for (const category of categories) {
      map.set(
        category.id,
        products.filter((product) => product.category === category.id).length,
      );
    }
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    let list =
      active === "all"
        ? products
        : products.filter((product) => product.category === active);
    if (inStockOnly) list = list.filter((product) => product.stock > 0);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [active, sort, inStockOnly, products]);

  const sortOptions: { id: SortId; label: string }[] = [
    { id: "featured", label: dict.catalog.sortFeatured },
    { id: "price-asc", label: dict.catalog.sortPriceAsc },
    { id: "price-desc", label: dict.catalog.sortPriceDesc },
    { id: "name", label: dict.catalog.sortName },
  ];

  return (
    <div>
      {/* toolbar — sticks under the site header like a shop filter bar */}
      <div className="sticky top-[calc(4rem+2px)] z-30 -mx-4 mb-8 border-b border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-330 flex-wrap items-center justify-between gap-x-4 gap-y-3">
          {/* category pills with live counts */}
          <div className="flex max-w-full gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterButton
              active={active === "all"}
              onClick={() => setActive("all")}
              count={counts.get("all") ?? 0}
            >
              {dict.catalog.filterAll}
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                active={active === category.id}
                onClick={() => setActive(category.id)}
                count={counts.get(category.id) ?? 0}
              >
                {category.label}
              </FilterButton>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* in-stock toggle */}
            <button
              type="button"
              aria-pressed={inStockOnly}
              onClick={() => setInStockOnly((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                inStockOnly
                  ? "border-green bg-green text-cream shadow-md shadow-green/20"
                  : "border-tan/60 bg-white/40 text-ink/60 hover:border-green hover:text-green"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                  inStockOnly ? "border-cream/60 bg-cream/20" : "border-ink/25"
                }`}
              >
                {inStockOnly && <CheckIcon className="h-3 w-3" />}
              </span>
              {dict.catalog.inStockOnly}
            </button>

            {/* sort select */}
            <label className="relative inline-flex items-center">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortId)}
                className="appearance-none rounded-full border-2 border-tan/60 bg-white/40 py-2 pl-4 pr-9 text-xs font-bold uppercase tracking-wide text-ink/70 transition-colors hover:border-ink hover:text-ink focus:border-ink focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 h-4 w-4 text-ink/50" />
            </label>

            <p className="hidden text-sm font-medium text-ink/45 lg:block">
              {dict.catalog.itemCount.replace("{count}", String(filtered.length))}
            </p>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-ink/40">
            <EmptyIcon className="h-6 w-6" />
          </span>
          <p className="text-ink/50">{dict.catalog.empty}</p>
          <button
            type="button"
            onClick={() => {
              setActive("all");
              setInStockOnly(false);
            }}
            className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            {dict.catalog.filterAll}
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
        active
          ? "border-ink bg-ink text-cream shadow-md shadow-ink/20"
          : "border-tan/60 bg-white/40 text-ink/60 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
          active ? "bg-cream/20 text-cream" : "bg-ink/10 text-ink/50"
        }`}
      >
        {count}
      </span>
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
