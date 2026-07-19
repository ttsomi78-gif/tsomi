/*
 * The ornamental "O" from the TSOMI logotype — a medallion ringed in gold,
 * filled with leopard spots, with a red diamond at its heart.
 */
export function OrnamentO({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#f1e4cd" stroke="#b3862f" strokeWidth="6" />
      {/* red diamond */}
      <rect
        x="38"
        y="38"
        width="24"
        height="24"
        rx="2"
        transform="rotate(45 50 50)"
        fill="#b34e28"
      />
      {/* leopard spots ringing the diamond */}
      <g fill="#c9962e">
        <circle cx="50" cy="20" r="5.5" />
        <circle cx="71" cy="29" r="5" />
        <circle cx="80" cy="51" r="5.5" />
        <circle cx="70" cy="72" r="5" />
        <circle cx="49" cy="81" r="5.5" />
        <circle cx="28" cy="71" r="5" />
        <circle cx="20" cy="50" r="5.5" />
        <circle cx="29" cy="29" r="5" />
      </g>
      {/* broken rosette arcs around the spots */}
      <g fill="none" stroke="#4a3826" strokeWidth="3" strokeLinecap="round">
        <path d="M42 15 A 9 9 0 0 1 56 13" />
        <path d="M77 25 A 9 9 0 0 1 79 38" />
        <path d="M87 57 A 9 9 0 0 1 79 66" />
        <path d="M64 79 A 9 9 0 0 1 56 86" />
        <path d="M42 88 A 9 9 0 0 1 34 79" />
        <path d="M21 65 A 9 9 0 0 1 13 56" />
        <path d="M13 43 A 9 9 0 0 1 22 35" />
        <path d="M35 22 A 9 9 0 0 1 36 21" />
      </g>
    </svg>
  );
}

/* Multicolor serif wordmark: terracotta T, green S, medallion O, navy M, gold I */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display inline-flex items-center leading-none tracking-[0.08em] ${className}`}
    >
      <span className="text-terracotta">T</span>
      <span className="text-green">S</span>
      <OrnamentO className="mx-[0.08em] h-[0.68em] w-[0.68em] translate-y-[0.01em]" />
      <span className="text-navy">M</span>
      <span className="text-gold">I</span>
    </span>
  );
}

/* Full brand lockup — wordmark, Georgian script, MADE IN GEORGIA */
export function LogoLockup({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Wordmark className="text-6xl sm:text-7xl" />
      <span className="font-georgian mt-4 text-2xl tracking-[0.35em] [text-indent:0.35em] sm:text-3xl">
        <span className="text-terracotta">ც</span>
        <span className="text-green">ო</span>
        <span className="text-navy">მ</span>
        <span className="text-gold">ი</span>
      </span>
      <span className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.45em] [text-indent:0.45em] text-ink/60">
        Made in Georgia
      </span>
    </div>
  );
}
