import { LogoLockup } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-tan/60 bg-blush py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-12">
          <LogoLockup className="items-start! text-left!" />

          <nav className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
                Shop
              </span>
              <a href="#catalog" className="hover:text-terracotta">
                Catalog
              </a>
              <a href="#story" className="hover:text-terracotta">
                Story
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
                Social
              </span>
              <a
                href="https://www.instagram.com/tsomi.streetwear/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-terracotta"
              >
                Instagram
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-tan/60 pt-6 text-xs font-semibold uppercase tracking-[0.25em] text-ink/40">
          <span>© 2026 TSOMI · Tbilisi, Georgia</span>
          <span>Made of dough</span>
        </div>
      </div>
    </footer>
  );
}
