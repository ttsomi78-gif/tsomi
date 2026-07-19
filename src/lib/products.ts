export type Product = {
  id: string;
  name: string;
  georgian: string;
  price: number; // GEL (₾)
  kind: "tee" | "tote";
  base: "black" | "white" | "canvas";
  print: "khinkali" | "khachapuri" | "frame" | "khachapuri-trio";
  tag?: string;
};

/* The current drop — matched to the pieces on the feed */
export const featuredProducts: Product[] = [
  {
    id: "khachapuri-shopper",
    name: "Khachapuri Shopper",
    georgian: "ხაჭაპურის შოპერი",
    price: 69,
    kind: "tote",
    base: "canvas",
    print: "khachapuri-trio",
    tag: "Icon",
  },
  {
    id: "khinkali-street",
    name: "Khinkali Street Tee",
    georgian: "ხინკალი",
    price: 89,
    kind: "tee",
    base: "white",
    print: "khinkali",
    tag: "New",
  },
  {
    id: "mr-khachapuri",
    name: "Mr. Khachapuri Tee",
    georgian: "ბატონი ხაჭაპური",
    price: 89,
    kind: "tee",
    base: "black",
    print: "khachapuri",
    tag: "Best seller",
  },
  {
    id: "gallery-tee",
    name: "Gallery Back-Print Tee",
    georgian: "გალერეა",
    price: 95,
    kind: "tee",
    base: "black",
    print: "frame",
  },
];
