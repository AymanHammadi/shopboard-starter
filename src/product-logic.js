import { products } from "./products.js";

// Return the catalog categories in their original order.
export function getCategories() {
  return [...new Set(products.map((product) => product.category))];
}

// Search, filter, and sort a copy so Default always preserves the catalog order.
export function getVisibleProducts({ search, category, sort }) {
  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) &&
      (category === "" || product.category === category),
  );

  if (sort === "ascending") {
    visibleProducts.sort((first, second) => first.price - second.price);
  } else if (sort === "descending") {
    visibleProducts.sort((first, second) => second.price - first.price);
  }

  return visibleProducts;
}
