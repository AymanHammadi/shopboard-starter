import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { loadCart, addToCart, changeQuantity, removeFromCart, clearCart } from "../src/cart.ts";

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
let saved: Map<string, string>;

beforeEach(() => {
  saved = new Map();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => saved.get(key) ?? null,
      setItem: (key: string, value: string) => saved.set(key, value),
    },
  });
  loadCart();
});

after(() => {
  if (originalStorage) {
    Object.defineProperty(globalThis, "localStorage", originalStorage);
  } else {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
});

await test("a missing saved cart starts empty", () => {
  assert.deepEqual(loadCart(), { items: [], count: 0, totalCents: 0, storageMessage: "" });
});

await test("repeated additions merge quantities and calculate totals", () => {
  addToCart(1);
  const two = addToCart(1);
  assert.equal(two.items.length, 1);
  assert.equal(two.items[0]?.quantity, 2);
  assert.equal(two.count, 2);
  assert.equal(two.totalCents, 17800);

  const three = addToCart(2);
  assert.equal(three.count, 3);
  assert.equal(three.totalCents, 22700);
  assert.equal(three.items.length, 2);
});

await test("quantity changes update totals and a quantity of one decreases to removal", () => {
  addToCart(1);
  addToCart(2);
  const increased = changeQuantity(1, 1);
  assert.equal(increased.count, 3);
  assert.equal(increased.totalCents, 22700);
  const decreased = changeQuantity(1, -1);
  assert.equal(decreased.count, 2);
  assert.equal(decreased.totalCents, 13800);
  const removed = changeQuantity(1, -1);
  assert.deepEqual(
    removed.items.map((item) => item.id),
    [2],
  );
  assert.equal(removed.count, 1);
  assert.equal(removed.totalCents, 4900);
});

await test("removing one product leaves the other product and its quantity untouched", () => {
  addToCart(1);
  addToCart(2);
  addToCart(2);
  const cart = removeFromCart(1);
  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0]?.id, 2);
  assert.equal(cart.items[0]?.quantity, 2);
  assert.equal(cart.count, 2);
  assert.equal(cart.totalCents, 9800);
});

await test("clear resets rows, count, total, and the saved cart", () => {
  addToCart(1);
  addToCart(2);
  assert.deepEqual(clearCart(), { items: [], count: 0, totalCents: 0, storageMessage: "" });
  assert.equal(saved.get("shopboard-cart"), "[]");
  assert.equal(loadCart().count, 0);
});

await test("only IDs and quantities are saved and reloading restores the same cart", () => {
  addToCart(1);
  addToCart(1);
  const beforeReload = addToCart(2);
  const stored = saved.get("shopboard-cart");
  assert.ok(stored);
  const entries: unknown = JSON.parse(stored);
  assert.deepEqual(entries, [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ]);
  assert.deepEqual(loadCart(), beforeReload);
});

await test("callers cannot mutate cart quantities through a returned summary", () => {
  const summary = addToCart(1);
  const item = summary.items[0];
  assert.ok(item);
  item.quantity = 500;
  summary.items.push({
    id: 2,
    name: "Canvas Backpack",
    quantity: 1,
    unitCents: 4900,
    lineCents: 4900,
  });
  const next = addToCart(1);
  assert.equal(next.items.length, 1);
  assert.equal(next.items[0]?.quantity, 2);
  assert.equal(next.totalCents, 17800);
});

await test("invalid saved carts are rejected with a visible-error message for the UI", () => {
  for (const value of [
    "broken json",
    "null",
    "{}",
    "[null]",
    "[1]",
    '["item"]',
    "[{}]",
    '[{"id":"1","quantity":1}]',
    '[{"id":1}]',
    '[{"id":1,"quantity":"2"}]',
    '[{"id":999,"quantity":1}]',
    '[{"id":1,"quantity":0}]',
    '[{"id":1,"quantity":-1}]',
    '[{"id":1,"quantity":1.5}]',
    '[{"id":1,"quantity":9007199254740992}]',
    '[{"id":1,"quantity":1},{"id":1,"quantity":2}]',
  ]) {
    saved.set("shopboard-cart", value);
    const cart = loadCart();
    assert.equal(cart.items.length, 0);
    assert.equal(cart.count, 0);
    assert.equal(cart.totalCents, 0);
    assert.notEqual(cart.storageMessage, "");
  }
});

await test("unknown product IDs are rejected without changing the cart", () => {
  const before = addToCart(1);
  assert.throws(() => addToCart(999), /Unknown product ID/);
  assert.deepEqual(loadCart(), before);
});

await test("quantity changes reject missing entries without changing the cart", () => {
  const before = addToCart(1);
  assert.throws(() => changeQuantity(2, 1), /not in the cart/);
  assert.deepEqual(loadCart(), before);
});

await test("unavailable browser storage reports errors but shopping still works in memory", () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() {
      throw new Error("Storage blocked");
    },
  });
  assert.match(loadCart().storageMessage, /could not be loaded/);
  const cart = addToCart(2);
  assert.equal(cart.count, 1);
  assert.equal(cart.totalCents, 4900);
  assert.match(cart.storageMessage, /could not be saved/);
});
