import Link from "next/link";
import { logout } from "./actions";

export function MobileTopbar() {
  return (
    <header className="border-b border-tan/60 bg-cream lg:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/admin" className="font-display text-xl uppercase tracking-wide">
          TSOMI Admin
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-sm font-semibold uppercase tracking-wide transition-colors hover:text-terracotta"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold uppercase tracking-wide transition-colors hover:text-terracotta"
          >
            Orders
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-cream"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
