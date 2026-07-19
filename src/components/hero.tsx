import Image from "next/image";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
      <div>
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-blush px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
          Made in Georgia
          <span aria-hidden="true" className="text-terracotta">
            ◆
          </span>
          <span className="font-georgian normal-case tracking-normal">
            თბილისი
          </span>
        </p>

        <h1 className="font-display text-5xl uppercase leading-[1.04] tracking-wide sm:text-6xl lg:text-7xl">
          Streetwear
          <br />
          raised on
          <br />
          <span className="text-terracotta">khachapuri</span>
          <span className="text-gold"> &amp; </span>
          <span className="text-navy">khinkali</span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
          <span className="font-georgian font-bold text-ink">ცომი</span> [tsomi]
          — <em>dough</em>. We fold the food every Georgian grew up on into tees
        and shoppers you can carry to the supra and the street.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#catalog"
            className="rounded-full bg-terracotta px-7 py-3.5 font-bold text-cream transition-colors hover:bg-brick"
          >
            Browse the drop
          </a>
          <a
            href="https://www.instagram.com/tsomi.streetwear/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-ink px-7 py-3.5 font-bold transition-colors hover:bg-ink hover:text-cream"
          >
            @tsomi.streetwear
          </a>
        </div>
      </div>

      {/* brand card — the real logo label from the packaging */}
      <div className="overflow-hidden rounded-3xl border border-tan/60 bg-blush">
        <Image
          src="/brand/logo-card.jpg"
          alt="TSOMI logo — multicolor serif wordmark with an ornamental medallion O, ცომი in Georgian script below"
          width={1080}
          height={720}
          priority
          className="w-full"
        />
        <div className="flex items-center justify-between px-6 pb-5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ink/50">
          <span>Est. Tbilisi</span>
          <span>100% cotton, 100% dough</span>
        </div>
      </div>
    </section>
  );
}
