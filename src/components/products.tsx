import Link from "next/link";
import { getActiveProducts } from "@/db/queries";
import { ProductCard } from "@/components/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { LocaleId } from "@/lib/products";

export async function Products({ locale, dict }: { locale: LocaleId; dict: Dictionary }) {
  const featuredProducts = await getActiveProducts(locale);

  return (
    <section id="catalog" className="mx-auto max-w-330 px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
          {dict.products.heading}
        </h2>
        <Link
          href={`/${locale}/catalog`}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50 underline underline-offset-4 transition-colors hover:text-terracotta"
        >
          {dict.products.viewCatalog}
        </Link>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="px-1">
        <CarouselContent>
          {featuredProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <ProductCard product={product} dict={dict} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
