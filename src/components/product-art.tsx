import type { Product } from "@/lib/products";

/*
 * SVG product mockups — stand in for real photos until shots land.
 * Swap for <Image> once photos are in /public/products.
 */

/* Filled Adjarian khachapuri print — golden crust, cheese, yolk */
function MiniKhachapuri({ transform = "" }: { transform?: string }) {
  return (
    <g transform={transform}>
      <path
        d="M-30 0 C -18 -14 -6 -17 0 -17 C 6 -17 18 -14 30 0 C 18 14 6 17 0 17 C -6 17 -18 14 -30 0 Z"
        fill="#e0a23c"
        stroke="#a15c22"
        strokeWidth="2"
      />
      <path d="M-18 0 C -10 -8 -4 -9 0 -9 C 4 -9 10 -8 18 0 C 10 8 4 9 0 9 C -4 9 -10 8 -18 0 Z" fill="#f3d98b" />
      <circle r="4.5" fill="#e07b1f" />
    </g>
  );
}

/* Canvas shopper covered in khachapuri prints */
function ToteArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {/* handle */}
      <path
        d="M68 64 C 68 18 132 18 132 64"
        fill="none"
        stroke="#ded2b8"
        strokeWidth="14"
      />
      <path
        d="M68 64 C 68 18 132 18 132 64"
        fill="none"
        stroke="#f0e8d5"
        strokeWidth="9"
      />
      {/* bag body */}
      <path
        d="M46 60 L154 60 C 168 98 170 140 158 168 C 120 182 80 182 42 168 C 30 140 32 98 46 60 Z"
        fill="#f0e8d5"
        stroke="#ded2b8"
        strokeWidth="2.5"
      />
      {/* khachapuri prints */}
      <MiniKhachapuri transform="translate(75, 105) rotate(-14)" />
      <MiniKhachapuri transform="translate(133, 92) rotate(10) scale(0.72)" />
      <MiniKhachapuri transform="translate(118, 148) rotate(-6) scale(0.88)" />
    </svg>
  );
}

/* Oversized tee with a chest print */
function TeeArt({
  base,
  print,
  className = "",
}: {
  base: "black" | "white";
  print: Product["print"];
  className?: string;
}) {
  const fabric = base === "black" ? "#241f19" : "#f4efe4";
  const seam = base === "black" ? "#3a342c" : "#dcd2bd";
  const inkOnTee = base === "black" ? "#f0e8d5" : "#2a2118";

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M62 32 L22 56 L40 92 L60 81 L60 174 L140 174 L140 81 L160 92 L178 56 L138 32 C 128 46 72 46 62 32 Z"
        fill={fabric}
        stroke={seam}
        strokeWidth="2"
      />
      {/* collar */}
      <path d="M78 33 C 86 42 114 42 122 33" fill="none" stroke={seam} strokeWidth="3" />

      {print === "khachapuri" && <MiniKhachapuri transform="translate(100, 100)" />}

      {print === "khinkali" && (
        <g
          transform="translate(85, 74) scale(0.26)"
          fill="none"
          stroke={inkOnTee}
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
      )}

      {print === "frame" && (
        <g>
          {/* gallery-style framed print */}
          <rect x="72" y="68" width="56" height="66" fill="#efe6d4" />
          <rect x="79" y="76" width="42" height="50" fill="#c9bda6" />
          {/* small standing figure with a khinkali head */}
          <circle cx="100" cy="90" r="6" fill="#3a342c" />
          <path
            d="M100 84 L100 79 M97 81 L103 81"
            stroke="#3a342c"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M93 98 C 93 95 107 95 107 98 L 105 112 L 95 112 Z"
            fill="#3a342c"
          />
          <path d="M96 112 L96 121 M104 112 L104 121" stroke="#3a342c" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  if (product.kind === "tote") {
    return <ToteArt className={className} />;
  }
  return (
    <TeeArt
      base={product.base === "canvas" ? "white" : product.base}
      print={product.print}
      className={className}
    />
  );
}
