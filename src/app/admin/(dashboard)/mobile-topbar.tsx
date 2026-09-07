import Link from "next/link";
import { logout } from "./actions";

export function MobileTopbar() {
  return (
    <header className="border-b border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/admin" className="font-semibold tracking-tight text-gray-900">
          TSOMI Admin
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Orders
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
