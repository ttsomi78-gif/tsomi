"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/products";
import type { Dictionary } from "@/i18n/get-dictionary";

export function AddToCartButton({
  product,
  dict,
  className = "",
}: {
  product: Product;
  dict?: Dictionary;
  className?: string;
}) {
  const { add, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const soldOut = product.stock <= 0;

  function handleClick() {
    if (soldOut) return;
    add(product);
    openCart();
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1600);
  }

  const label = soldOut
    ? (dict?.product.soldOut ?? "Sold out")
    : justAdded
      ? (dict?.cart.added ?? "Added")
      : (dict?.cart.add ?? "Add to cart");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
        soldOut
          ? "bg-ink/10 text-ink/40"
          : justAdded
            ? "bg-green text-cream shadow-md shadow-green/25"
            : "bg-ink text-cream shadow-md shadow-ink/15 hover:bg-terracotta hover:shadow-terracotta/25"
      } ${className}`}
    >
      {justAdded && !soldOut ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        !soldOut && <BagIcon className="h-3.5 w-3.5" />
      )}
      {label}
    </button>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
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
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
