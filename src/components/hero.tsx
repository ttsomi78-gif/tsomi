import { KhinkaliIcon } from "./khinkali";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-sand px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
          <span className="font-georgian normal-case tracking-normal">
            ქართული სტრიტვეარი
          </span>
          · Tbilisi, Georgia
        </p>

        <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
          Streetwear
          <br />
          raised on
          <br />
          <span className="text-terracotta">khinkali.</span>
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
          <span className="font-georgian font-bold text-ink">ცომი</span> [tsomi]
          — <em>dough</em>. We fold the food every Georgian grew up on into tees
          you can wear to the supra and the street.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#catalog"
            className="rounded-full bg-ink px-7 py-3.5 font-bold text-cream transition-colors hover:bg-terracotta"
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

      {/* visual panel — swap for a hero photo when real shots land */}
      <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-sand p-10">
        <span className="font-georgian absolute -right-6 -top-10 select-none text-[11rem] font-black leading-none text-tan/50">
          ცომი
        </span>
        <KhinkaliIcon className="relative mx-auto h-72 w-auto text-ink sm:h-80" />
        <div className="relative mt-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/60">
          <span>Est. Tbilisi</span>
          <span>100% cotton, 100% dough</span>
        </div>
      </div>
    </section>
  );
}
