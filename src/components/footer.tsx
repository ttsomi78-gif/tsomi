import { Wordmark } from "./logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink py-14 text-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <Wordmark className="text-5xl sm:text-6xl" />
            <p className="font-georgian mt-2 text-xl text-cream/50">ცომი</p>
          </div>

          <nav className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-bold uppercase tracking-widest text-cream/40">
                Shop
              </span>
              <a href="#catalog" className="hover:text-mustard">
                Catalog
              </a>
              <a href="#story" className="hover:text-mustard">
                Story
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold uppercase tracking-widest text-cream/40">
                Social
              </span>
              <a
                href="https://www.instagram.com/tsomi.streetwear/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-mustard"
              >
                Instagram
              </a>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cream/15 pt-6 text-xs font-bold uppercase tracking-widest text-cream/40">
          <span>© 2026 TSOMI · Tbilisi, Georgia</span>
          <span>Made of dough</span>
        </div>
      </div>
    </footer>
  );
}
