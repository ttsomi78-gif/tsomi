import Image from "next/image";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative flex items-center overflow-hidden bg-cream lg:min-h-[calc(100svh_-_var(--header-h))]">
      {/* ambient warmth behind the composition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-yolk/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-terracotta/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-330 items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-[var(--hero-pad)]">
        {/* copy */}
        <div>
          <h1 className="font-display uppercase">
            <span className="block text-4xl leading-tight tracking-wide sm:text-5xl lg:text-[clamp(1.9rem,4.8vh,3rem)]">
              {dict.hero.line1}
            </span>
            <span className="block text-4xl leading-tight tracking-wide sm:text-5xl lg:text-[clamp(1.9rem,4.8vh,3rem)]">
              {dict.hero.line2}
            </span>
            <span className="mt-3 block text-[3.4rem] leading-none text-terracotta sm:text-7xl lg:mt-[clamp(0.4rem,1.2vh,0.75rem)] lg:text-[clamp(3rem,9.6vh,6rem)]">
              {dict.hero.highlight}
            </span>
            <span className="mt-3 block text-4xl leading-tight tracking-wide sm:text-5xl lg:mt-[clamp(0.4rem,1.2vh,0.75rem)] lg:text-[clamp(1.9rem,4.8vh,3rem)]">
              <span className="text-gold">{dict.hero.and}</span>{" "}
              <span className="text-navy">{dict.hero.khinkali}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60 lg:mt-[clamp(0.75rem,2.4vh,1.5rem)] lg:text-[clamp(0.95rem,1.8vh,1.125rem)]">
            {dict.hero.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-[clamp(1rem,3.2vh,2rem)]">
            <a
              href="#catalog"
              className="group inline-flex items-center gap-3 rounded-full bg-yolk px-8 py-4 lg:py-[clamp(0.7rem,1.6vh,1rem)] font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:shadow-xl hover:shadow-gold/30"
            >
              {dict.hero.cta}
              <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5 motion-safe:animate-bounce" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-3 rounded-full border-2 border-ink/15 px-8 py-[0.85rem] lg:py-[clamp(0.55rem,1.45vh,0.85rem)] font-bold uppercase tracking-wide text-ink/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta hover:text-terracotta"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* layered photo composition */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-[min(100%,calc((var(--hero-space)_-_2.5rem)_/_1.075))]">
          {/* main shot */}
          <div className="relative ml-auto aspect-4/5 w-[86%] overflow-hidden rounded-4xl shadow-2xl shadow-ink/20 ring-1 ring-ink/10">
            <Image
              src="/products/khinkali-street.jpg"
              alt="White oversized tee with the khinkali-headed character"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 86vw"
              className="object-cover"
            />
            {/* brand chip on the photo */}
            <span className="font-georgian absolute right-5 top-5 rounded-full bg-cream/90 px-4 py-1.5 text-sm tracking-[0.2em] text-ink shadow-md backdrop-blur-sm">
              ცომი
            </span>
          </div>

          {/* overlapping secondary shot */}
          <div className="absolute -bottom-6 left-0 z-10 w-[44%] -rotate-3 overflow-hidden rounded-2xl border-4 border-cream shadow-xl transition-transform duration-300 hover:rotate-0 sm:-bottom-8">
            <div className="relative aspect-4/5">
              <Image
                src="/products/khachapuri-shopper-worn.jpg"
                alt="Model carrying the khachapuri shopper over one shoulder"
                fill
                sizes="(min-width: 1024px) 22vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* floating food cutouts */}
          <Image
            src="/icons/khachapuri.png"
            alt=""
            width={200}
            height={168}
            className="absolute -top-4 left-[4%] z-20 w-[19%] rotate-12 drop-shadow-lg"
          />
          <Image
            src="/icons/khinkali.png"
            alt=""
            width={450}
            height={350}
            className="absolute -right-2 bottom-[6%] z-20 w-[17%] -rotate-12 drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
