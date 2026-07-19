import { featuredProducts } from "@/lib/products";
import { TeePlaceholder } from "./tee-placeholder";

export function Products() {
  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          The drop
        </h2>
        <p className="text-sm font-bold uppercase tracking-widest text-ink/50">
          Full catalog — coming soon
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-2xl border border-ink/10 bg-sand"
          >
            <div className="relative p-6">
              {product.tag && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase tracking-wide text-cream">
                  {product.tag}
                </span>
              )}
              <TeePlaceholder
                tee={product.tee}
                accent={product.accent}
                className="w-full transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-1"
              />
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 px-5 py-4">
              <h3 className="font-bold">{product.name}</h3>
              <span className="font-black text-terracotta">
                {product.price} ₾
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
