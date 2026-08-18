"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M11 3h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.586 1.414l-8 8a2 2 0 0 1-2.828 0l-6-6a2 2 0 0 1 0-2.828l8-8A2 2 0 0 1 11 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 7h12l-1.2 12.2A2 2 0 0 1 14.8 21H9.2a2 2 0 0 1-2-1.8L6 7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V5.5a3 3 0 0 1 6 0V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: ProductsIcon, exact: false },
  { href: "/admin/orders", label: "Orders", icon: OrdersIcon, exact: false },
] as const;

export function Sidebar({
  productCount,
  pendingOrderCount,
}: {
  productCount: number;
  pendingOrderCount: number;
}) {
  const pathname = usePathname();
  const badges: Record<string, number> = {
    "/admin/products": productCount,
    "/admin/orders": pendingOrderCount,
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ink text-cream lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="px-6 py-7">
        <Link href="/admin" className="font-display text-2xl uppercase tracking-wide">
          TSOMI
        </Link>
        <p className="mt-0.5 text-xs uppercase tracking-widest text-cream/50">
          Admin panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-cream text-ink"
                  : "text-cream/70 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
              {badges[href] !== undefined && badges[href] > 0 && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-ink/10 text-ink" : "bg-cream/10 text-cream/70"
                  }`}
                >
                  {badges[href]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-cream/10 px-3 py-4">
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
