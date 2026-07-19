import Image from "next/image";
import { featuredProducts } from "@/lib/products";

const imageSizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export function Products() {
  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
          The drop
        </h2>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/50">
          Full catalog — coming soon
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-2xl border border-tan/60 bg-blush"
          >
            <div className="relative aspect-4/5 overflow-hidden">
              {product.tag && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
                  {product.tag}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes={imageSizes}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.hoverImage && (
                <Image
                  src={product.hoverImage}
                  alt=""
                  fill
                  sizes={imageSizes}
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-tan/60 bg-cream px-5 py-4">
              <div>
                <h3 className="font-bold leading-tight">{product.name}</h3>
                <p className="font-georgian mt-0.5 text-sm text-ink/50">
                  {product.georgian}
                </p>
              </div>
              <span className="font-display text-lg text-terracotta">
                {product.price} ₾
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
