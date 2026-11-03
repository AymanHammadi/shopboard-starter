import type { Product } from "./types.ts";

// The twelve-product catalog with Pexels photography; source pages are recorded in DESIGN.md.
export const products: Product[] = [
  {
    id: 1,
    name: "Leather Tote Bag",
    category: "Bags",
    price: 89,
    image: {
      url: "https://images.pexels.com/photos/36364964/pexels-photo-36364964.jpeg",
      alt: "Tan leather with contrasting brown handles",
    },
  },
  {
    id: 2,
    name: "Canvas Backpack",
    category: "Bags",
    price: 49,
    image: {
      url: "https://images.pexels.com/photos/9630186/pexels-photo-9630186.jpeg",
      alt: "Gray canvas with brown leather buckle straps, worn outdoors",
    },
  },
  {
    id: 3,
    name: "Mini Crossbody Bag",
    category: "Bags",
    price: 39,
    image: {
      url: "https://images.pexels.com/photos/27204288/pexels-photo-27204288.jpeg",
      alt: "Brown pebbled leather with a front zip and adjustable shoulder strap",
    },
  },
  {
    id: 4,
    name: "White Sneakers",
    category: "Shoes",
    price: 75,
    image: {
      url: "https://images.pexels.com/photos/23491456/pexels-photo-23491456.jpeg",
      alt: "White lace-up sneaker with a textured mesh upper",
    },
  },
  {
    id: 5,
    name: "Running Shoes",
    category: "Shoes",
    price: 110,
    image: {
      url: "https://images.pexels.com/photos/28381500/pexels-photo-28381500.jpeg",
      alt: "Lilac athletic shoe with a white cushioned sole",
    },
  },
  {
    id: 6,
    name: "Suede Loafers",
    category: "Shoes",
    price: 95,
    image: {
      url: "https://images.pexels.com/photos/32776950/pexels-photo-32776950.jpeg",
      alt: "Rust-brown suede slip-ons with tassel details",
    },
  },
  {
    id: 7,
    name: "Wool Scarf",
    category: "Accessories",
    price: 25,
    image: {
      url: "https://images.pexels.com/photos/5603011/pexels-photo-5603011.jpeg",
      alt: "Chunky brown knit draped over a sculpture and wooden stool",
    },
  },
  {
    id: 8,
    name: "Silver Watch",
    category: "Accessories",
    price: 150,
    image: {
      url: "https://images.pexels.com/photos/278299/pexels-photo-278299.jpeg",
      alt: "Minimal round face with a silver metal expansion band",
    },
  },
  {
    id: 9,
    name: "Sunglasses",
    category: "Accessories",
    price: 35,
    image: {
      url: "https://images.pexels.com/photos/27111647/pexels-photo-27111647.jpeg",
      alt: "Gold aviator frames with pale pink lenses",
    },
  },
  {
    id: 10,
    name: "Travel Duffel Bag",
    category: "Bags",
    price: 120,
    image: {
      url: "https://images.pexels.com/photos/9582665/pexels-photo-9582665.jpeg",
      alt: "Dark overnight bag with brown handles resting on a patterned armchair",
    },
  },
  {
    id: 11,
    name: "Rain Boots",
    category: "Shoes",
    price: 60,
    image: {
      url: "https://images.pexels.com/photos/14833098/pexels-photo-14833098.jpeg",
      alt: "Purple rubber boots on weathered wooden boards",
    },
  },
  {
    id: 12,
    name: "Leather Belt",
    category: "Accessories",
    price: 30,
    image: {
      url: "https://images.pexels.com/photos/38053174/pexels-photo-38053174.jpeg",
      alt: "Coiled black leather with a rectangular silver buckle",
    },
  },
];

// Resolve a catalog ID or report an invalid caller instead of returning a missing product.
export function getProduct(id: Product["id"]): Product {
  const product = products.find((product) => product.id === id);
  if (!product) throw new Error(`Unknown product ID: ${id}`);
  return product;
}
