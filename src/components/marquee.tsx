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
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span
          key={item}
          className="flex items-center gap-6 pr-6 text-lg uppercase tracking-[0.15em]"
        >
          <span
            className={
              /[ა-ჰ]/.test(item) ? "font-georgian" : "font-display"
            }
          >
            {item}
          </span>
          <span aria-hidden="true" className="text-sm text-gold">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden bg-terracotta py-3 text-cream">
      <div className="flex w-max animate-marquee">
        <Row />
        <div aria-hidden="true" className="flex shrink-0">
          <Row />
        </div>
      </div>
    </div>
  );
}
