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
    <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="px-5 py-6">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-semibold text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 font-display text-sm uppercase text-white">
            T
          </span>
          <span className="text-[15px] tracking-tight">TSOMI Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{label}</span>
              {badges[href] !== undefined && badges[href] > 0 && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
                    active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {badges[href]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 px-3 py-3">
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
