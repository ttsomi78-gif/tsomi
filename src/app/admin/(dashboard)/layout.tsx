import { getOrderStats, getProductStats } from "@/db/queries";
import { Sidebar } from "./sidebar";
import { MobileTopbar } from "./mobile-topbar";

// Admin always reflects the live database — never prerendered at build time
// (the build environment has no DATABASE_URL) and never cached.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [stats, orderStats] = await Promise.all([
    getProductStats(),
    getOrderStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 antialiased lg:flex">
      <Sidebar
        productCount={stats.total}
        pendingOrderCount={orderStats.pending}
      />

      <div className="flex-1">
        <MobileTopbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
