"use client";

import { useCart } from "@/components/cart-provider";

export function CartButton({ label }: { label: string }) {
  const { count, openCart, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 hover:text-terracotta"
    >
      <BagIcon className="h-5 w-5" />
      {/* Only after hydration: the server has no idea what's in localStorage, and
          rendering a count during SSR would flash the wrong number. */}
      {hydrated && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-cream shadow-sm tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      )}
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
