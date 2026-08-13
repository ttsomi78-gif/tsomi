import Link from "next/link";
import { Wordmark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-4 text-center">
      <Wordmark className="text-5xl" />
      <p className="font-display text-7xl text-terracotta">404</p>
      <p className="max-w-sm text-ink/60">
        This page rolled off the table. Let&apos;s knead you back home.
      </p>
      <Link
        href="/"
        className="rounded-full bg-ink px-8 py-3 font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/15 transition-all hover:-translate-y-0.5 hover:bg-terracotta hover:shadow-lg hover:shadow-terracotta/25"
      >
        Back to TSOMI
      </Link>
    </div>
  );
}
