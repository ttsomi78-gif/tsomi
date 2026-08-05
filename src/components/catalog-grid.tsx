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
      <div className="mb-10 flex flex-wrap gap-2">
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

      {filtered.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} dict={dict} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink/50">{dict.catalog.empty}</p>
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
      className={`rounded-full border-2 px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
        active
          ? "border-ink bg-ink text-cream"
          : "border-tan/60 text-ink/60 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
