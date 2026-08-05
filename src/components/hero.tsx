import Image from "next/image";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="flex min-h-[84vh] flex-col bg-cream">
      <div className="flex flex-1 items-center">
        <div className="-mt-16 mx-auto grid w-full max-w-330 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
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

            <div className="mt-8">
              <a
                href="#catalog"
                className="group inline-flex items-center gap-3 rounded-lg bg-yolk px-8 py-4 font-bold uppercase tracking-wide text-ink shadow-lg shadow-yolk/40 transition-colors hover:bg-gold"
              >
                {dict.hero.cta}
                <ArrowDownIcon className="h-4 w-4 animate-bounce transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* photo collage — catalog shots layered over an organic blob */}
          <div className="relative aspect-square w-full max-w-xl justify-self-center lg:max-w-130 lg:justify-self-end">
            {/* main shot in a blob mask */}
            <div
              className="absolute right-0 top-0 h-[86%] w-[74%] overflow-hidden"
              style={{ borderRadius: "56% 44% 52% 48% / 44% 54% 46% 56%" }}
            >
              <Image
                src="/products/khinkali-street.jpg"
                alt="White oversized tee with the khinkali-headed character"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 95vw"
                className="object-cover"
              />
            </div>

            {/* overlapping tee cards */}
            <div className="absolute left-0 top-[36%] z-10 w-[36%] -rotate-3 overflow-hidden rounded-2xl border-4 border-cream shadow-xl">
              <div className="relative aspect-4/5">
                <Image
                  src="/products/mr-khachapuri.jpg"
                  alt="Black tee with Mr. Khachapuri holding a glass of wine"
                  fill
                  sizes="(min-width: 1024px) 24vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-[22%] z-20 w-[46%] rotate-1 overflow-hidden rounded-3xl border-4 border-cream shadow-2xl">
              <div className="relative aspect-4/5">
                <Image
                  src="/products/khachapuri-shopper-worn.jpg"
                  alt="Model carrying the khachapuri shopper over one shoulder"
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
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
              className="absolute left-[14%] top-[3%] z-20 w-[20%] rotate-12 drop-shadow-lg"
            />
            <Image
              src="/icons/khinkali.png"
              alt=""
              width={450}
              height={350}
              className="absolute bottom-[10%] right-[1%] z-20 w-[19%] -rotate-12 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

    </section>
  );
}
