import { KhachapuriIcon, KhinkaliIcon } from "./khinkali";
import { SpiralO } from "./logo";

/* Tiles stand in for real grid posts — swap for photos from the feed */
const tiles = [
  { bg: "bg-terracotta", fg: "text-cream", icon: KhinkaliIcon },
  { bg: "bg-sand", fg: "text-ink", icon: KhachapuriIcon },
  { bg: "bg-olive", fg: "text-cream", icon: SpiralO },
  { bg: "bg-mustard", fg: "text-ink", icon: KhinkaliIcon },
];

export function Instagram() {
  return (
    <section id="instagram" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Follow the dough
        </h2>
        <a
          href="https://www.instagram.com/tsomi.streetwear/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold uppercase tracking-widest text-terracotta hover:underline"
        >
          @tsomi.streetwear ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <a
              key={index}
              href="https://www.instagram.com/tsomi.streetwear/"
              target="_blank"
              rel="noreferrer"
              aria-label="TSOMI on Instagram"
              className={`flex aspect-square items-center justify-center rounded-2xl ${tile.bg} ${tile.fg} transition-transform duration-300 hover:scale-[1.03] hover:-rotate-1`}
            >
              <Icon className="h-1/2 w-auto max-w-[50%]" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
