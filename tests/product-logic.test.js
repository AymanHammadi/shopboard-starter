import assert from "node:assert/strict";
import { test } from "node:test";
import { products } from "../src/products.js";
import { getCategories, getVisibleProducts } from "../src/product-logic.js";

test("categories come from the catalog without duplicates", () => {
  assert.deepEqual(getCategories(), ["Bags", "Shoes", "Accessories"]);
});

test("search ignores case and surrounding whitespace", () => {
  const matches = getVisibleProducts({ search: "  LEATHER  ", category: "", sort: "default" });
  assert.deepEqual(
    matches.map((product) => product.id),
    [1, 12],
  );
});

test("search, category, and both price sorts work together", () => {
  const filters = { search: "bag", category: "Bags", sort: "ascending" };
  assert.deepEqual(
    getVisibleProducts(filters).map((product) => product.id),
    [3, 1, 10],
  );
  assert.deepEqual(
    getVisibleProducts({ ...filters, sort: "descending" }).map((product) => product.id),
    [10, 1, 3],
  );
  assert.deepEqual(getVisibleProducts({ ...filters, category: "Shoes" }), []);
});

test("Default restores the original order after sorting without changing product data", () => {
  const original = structuredClone(products);
  getVisibleProducts({ search: "", category: "", sort: "ascending" });
  getVisibleProducts({ search: "", category: "", sort: "descending" });
  const restored = getVisibleProducts({ search: "", category: "", sort: "default" });
  assert.deepEqual(
    restored.map((product) => product.id),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  );
  assert.deepEqual(products, original);
  assert.notEqual(restored, products);
});
