export type Product = {
  id: string;
  name: string;
  georgian: string;
  price: number; // GEL (₾)
  image: string;
  /** optional second shot, shown on hover */
  hoverImage?: string;
  alt: string;
  tag?: string;
};

/* The current drop — photos from the feed, in /public/products */
export const featuredProducts: Product[] = [
  {
    id: "khachapuri-shopper",
    name: "Khachapuri Shopper",
    georgian: "ხაჭაპურის შოპერი",
    price: 69,
    image: "/products/khachapuri-shopper.jpg",
    hoverImage: "/products/khachapuri-shopper-worn.jpg",
    alt: "Cream canvas shopper bag covered in adjaruli khachapuri prints, with a plush khachapuri pocket",
    tag: "Icon",
  },
  {
    id: "khinkali-street",
    name: "Khinkali Street Tee",
    georgian: "ხინკალი",
    price: 89,
    image: "/products/khinkali-street.jpg",
    alt: "White oversized tee with a khinkali-headed character in a bomber jacket, next to TSOMI craft packaging",
    tag: "New",
  },
  {
    id: "mr-khachapuri",
    name: "Mr. Khachapuri Tee",
    georgian: "ბატონი ხაჭაპური",
    price: 89,
    image: "/products/mr-khachapuri.jpg",
    alt: "Black oversized tee with Mr. Khachapuri in a grey suit and sunglasses, holding a glass of wine",
    tag: "Best seller",
  },
  {
    id: "gallery-tee",
    name: "Gallery Back-Print Tee",
    georgian: "გალერეა",
    price: 95,
    image: "/products/gallery-tee.jpg",
    alt: "Black oversized tee with a framed gallery-style back print of a khinkali-headed figure",
  },
];
