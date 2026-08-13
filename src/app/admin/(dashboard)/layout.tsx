import { getProductStats } from "@/db/queries";
import { Sidebar } from "./sidebar";
import { MobileTopbar } from "./mobile-topbar";

// Admin always reflects the live database — never prerendered at build time
// (the build environment has no DATABASE_URL) and never cached.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const stats = await getProductStats();

  return (
    <div className="min-h-screen bg-cream text-ink lg:flex">
      <Sidebar productCount={stats.total} />

      <div className="flex-1">
        <MobileTopbar />
        <main className="mx-auto max-w-330 px-4 py-10 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
