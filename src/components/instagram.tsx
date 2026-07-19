import { KhachapuriIcon, KhinkaliIcon, ToteIcon } from "./khinkali";
import { OrnamentO } from "./logo";

/* Tiles stand in for real grid posts — swap for photos from the feed */
const tiles = [
  {
    bg: "bg-terracotta",
    fg: "text-cream",
    render: () => <KhinkaliIcon className="h-1/2 w-auto max-w-[50%]" />,
  },
  {
    bg: "bg-blush",
    fg: "text-ink",
    render: () => <OrnamentO className="h-1/2 w-auto max-w-[50%]" />,
  },
  {
    bg: "bg-navy",
    fg: "text-cream",
    render: () => <KhachapuriIcon className="h-2/5 w-auto max-w-[55%]" />,
  },
  {
    bg: "bg-gold",
    fg: "text-cream",
    render: () => <ToteIcon className="h-1/2 w-auto max-w-[50%]" />,
  },
];

export function Instagram() {
  return (
    <section id="instagram" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
          Follow the dough
        </h2>
        <a
          href="https://www.instagram.com/tsomi.streetwear/"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta hover:underline"
        >
          @tsomi.streetwear ↗
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiles.map((tile, index) => (
          <a
            key={index}
            href="https://www.instagram.com/tsomi.streetwear/"
            target="_blank"
            rel="noreferrer"
            aria-label="TSOMI on Instagram"
            className={`flex aspect-square items-center justify-center rounded-2xl ${tile.bg} ${tile.fg} transition-transform duration-300 hover:scale-[1.03] hover:-rotate-1`}
          >
            {tile.render()}
          </a>
        ))}
      </div>
    </section>
  );
}
