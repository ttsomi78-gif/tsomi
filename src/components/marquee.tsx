const items = [
  "TSOMI",
  "ცომი",
  "KHINKALI",
  "ხინკალი",
  "KHACHAPURI",
  "ხაჭაპური",
  "SUPRA",
  "სუფრა",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-6 pr-6 text-lg font-black uppercase tracking-wider"
        >
          <span className={/[ა-ჰ]/.test(item) ? "font-georgian" : undefined}>
            {item}
          </span>
          <span className="text-terracotta">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-3 text-cream">
      <div className="flex w-max animate-marquee">
        <Row />
        <div aria-hidden="true" className="flex shrink-0">
          <Row />
        </div>
      </div>
    </div>
  );
}
