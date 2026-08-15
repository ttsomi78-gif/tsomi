import Link from "next/link";
import { getActiveProducts } from "@/db/queries";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "@/components/ui/carousel";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export async function Products({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  const featuredProducts = await getActiveProducts(locale);

  return (
    <section id="catalog" className="mx-auto max-w-330 px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-4 flex flex-wrap items-end justify-center gap-4 sm:mb-10 sm:justify-between">
        {/* heading hidden on mobile to keep the section within one screen */}
        <div className="hidden sm:block">
          <div
            aria-hidden="true"
            className="mb-3 h-1.5 w-16 rounded-full bg-terracotta sm:mb-4"
          />
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-5xl">
            {dict.products.heading}
          </h2>
        </div>
        <Link
          href={`/${locale}/catalog`}
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/70 transition-all hover:-translate-y-0.5 hover:border-terracotta hover:text-terracotta"
        >
          {dict.products.viewCatalog}
        </Link>
      </div>

      {featuredProducts.length === 0 ? (
        <p className="rounded-2xl border border-tan/60 bg-white/50 px-6 py-10 text-center text-ink/50">
          {dict.catalog.empty}
        </p>
      ) : (
        <Carousel opts={{ align: "start", loop: false }} className="px-1">
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[72%] py-4 sm:basis-1/2 sm:py-8 lg:basis-1/4"
              >
                <ProductCard product={product} dict={dict} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
          <CarouselDots className="mt-3 sm:hidden" />
        </Carousel>
      )}
    </section>
  );
}
