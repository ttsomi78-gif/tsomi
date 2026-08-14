import Image from "next/image";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* ambient warmth behind the composition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-yolk/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-terracotta/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-330 items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-24 lg:pt-16">
        {/* copy */}
        <div>
          <h1 className="font-display uppercase">
            <span className="block text-4xl leading-tight tracking-wide sm:text-5xl">
              {dict.hero.line1}
            </span>
            <span className="block text-4xl leading-tight tracking-wide sm:text-5xl">
              {dict.hero.line2}
            </span>
            <span className="mt-3 block text-[3.4rem] leading-none text-terracotta sm:text-7xl xl:text-[6rem]">
              {dict.hero.highlight}
            </span>
            <span className="mt-3 block text-4xl leading-tight tracking-wide sm:text-5xl">
              <span className="text-gold">{dict.hero.and}</span>{" "}
              <span className="text-navy">{dict.hero.khinkali}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
            {dict.hero.sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#catalog"
              className="group inline-flex items-center gap-3 rounded-full bg-yolk px-8 py-4 font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:shadow-xl hover:shadow-gold/30"
            >
              {dict.hero.cta}
              <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5 motion-safe:animate-bounce" />
            </a>
            <a
              href="#story"
              className="inline-flex items-center gap-3 rounded-full border-2 border-ink/15 px-8 py-[0.85rem] font-bold uppercase tracking-wide text-ink/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta hover:text-terracotta"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* layered photo composition */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
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
