import Image from "next/image";

const items = [
  "TSOMI",
  "ცომი",
  "MADE IN GEORGIA",
  "KHACHAPURI",
  "ხაჭაპური",
  "KHINKALI",
  "ხინკალი",
  "SUPRA",
  "სუფრა",
  "TBILISI",
];

/*
 * Photo cutouts between the words — adjaruli khachapuri (pngimg.com)
 * and khinkali (vecteezy.com), in /public/icons.
 */
const separators = [
  { src: "/icons/khachapuri.png", width: 200, height: 168 },
  { src: "/icons/khinkali.png", width: 450, height: 350 },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item, index) => {
        const icon = separators[index % separators.length];
        return (
          <span
            key={item}
            className="flex items-center gap-5 pr-5 text-lg uppercase tracking-[0.15em]"
          >
            <span
              className={/[ა-ჰ]/.test(item) ? "font-georgian" : "font-display"}
            >
              {item}
            </span>
            <Image
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              className="h-9 w-auto drop-shadow-sm"
            />
          </span>
        );
      })}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden bg-terracotta py-2.5 text-cream">
      <div className="flex w-max animate-marquee">
        <Row />
        <div aria-hidden="true" className="flex shrink-0">
          <Row />
        </div>
      </div>
    </div>
  );
}
