export type Product = {
  id: string;
  name: string;
  price: number; // GEL (₾)
  tee: "black" | "cream";
  accent: string;
  tag?: string;
};

/* Placeholder drop — replace with the real catalog when it lands */
export const featuredProducts: Product[] = [
  {
    id: "khinkali-reader",
    name: "Khinkali Reader Tee",
    price: 89,
    tee: "black",
    accent: "#c99c8c",
    tag: "New",
  },
  {
    id: "leopard-khinkali",
    name: "Leopard Khinkali Tee",
    price: 95,
    tee: "black",
    accent: "#d9a441",
  },
  {
    id: "mr-khachapuri",
    name: "Mr. Khachapuri Tee",
    price: 89,
    tee: "cream",
    accent: "#bc5a2e",
    tag: "Best seller",
  },
  {
    id: "supra-club",
    name: "Supra Club Tee",
    price: 85,
    tee: "black",
    accent: "#77784f",
  },
];
