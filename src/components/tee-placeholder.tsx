type TeeProps = {
  /** tee fabric color */
  tee: "black" | "cream";
  /** chest graphic accent color */
  accent: string;
  className?: string;
};

/*
 * SVG tee mockup — stands in for product photos until real shots land.
 * Swap for <Image> once photos are in /public/products.
 */
export function TeePlaceholder({ tee, accent, className = "" }: TeeProps) {
  const fabric = tee === "black" ? "#221e19" : "#f0e9db";
  const seam = tee === "black" ? "#3a342c" : "#d8cdb8";

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M62 32 L22 56 L40 92 L60 81 L60 174 L140 174 L140 81 L160 92 L178 56 L138 32 C 128 46 72 46 62 32 Z"
        fill={fabric}
        stroke={seam}
        strokeWidth="2"
      />
      {/* collar */}
      <path
        d="M78 33 C 86 42 114 42 122 33"
        fill="none"
        stroke={seam}
        strokeWidth="3"
      />
      {/* chest graphic with mini khinkali */}
      <rect x="78" y="70" width="44" height="54" rx="3" fill={accent} />
      <g
        transform="translate(85, 78) scale(0.25)"
        fill="none"
        stroke={fabric}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="52" y="8" width="16" height="26" rx="6" />
        <path d="M60 34 C 24 40 12 74 16 95 C 20 118 38 132 60 132 C 82 132 100 118 104 95 C 108 74 96 40 60 34 Z" />
        <path d="M60 36 C 42 52 30 72 27 92" />
        <path d="M60 36 C 52 62 48 98 50 128" />
        <path d="M60 36 C 68 62 72 98 70 128" />
        <path d="M60 36 C 78 52 90 72 93 92" />
      </g>
    </svg>
  );
}
