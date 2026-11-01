import { products } from "./products.js";
import { toCents } from "./money.js";

const CART_STORAGE_KEY = "shopboard-cart";
let cart = [];
let storageMessage = "";

// Build display rows and totals without exposing the mutable cart entries.
function getCart() {
  let count = 0;
  let totalCents = 0;
  const items = cart.map((entry) => {
    const product = products.find((product) => product.id === entry.id);
    const unitCents = toCents(product.price);
    const lineCents = unitCents * entry.quantity;
    count += entry.quantity;
    totalCents += lineCents;
    return { id: entry.id, name: product.name, quantity: entry.quantity, unitCents, lineCents };
  });

  return { items, count, totalCents, storageMessage };
}

// Load validated IDs and quantities, reporting invalid or inaccessible storage in the result.
export function loadCart() {
  cart = [];
  storageMessage = "";
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved === null) return getCart();

    const entries = JSON.parse(saved);
    if (
      !Array.isArray(entries) ||
      entries.some(
        (entry) =>
          entry === null ||
          typeof entry !== "object" ||
          !products.some((product) => product.id === entry.id) ||
          !Number.isSafeInteger(entry.quantity) ||
          entry.quantity <= 0,
      ) ||
      new Set(entries.map((entry) => entry.id)).size !== entries.length
    ) {
      storageMessage = "The saved cart has invalid items. Starting with an empty cart.";
    } else {
      cart = entries.map(({ id, quantity }) => ({ id, quantity }));
    }
  } catch {
    storageMessage =
      "Your saved cart could not be loaded. You can still shop, but check that browser storage is enabled.";
  }
  return getCart();
}

// Persist only IDs and quantities and return a fresh cart summary, including any storage error.
function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    storageMessage = "";
  } catch {
    storageMessage =
      "Your cart could not be saved. Changes will be lost on refresh; check browser storage settings.";
  }
  return getCart();
}

// Add one unit, combining repeated additions into the same cart entry.
export function addToCart(id) {
  const entry = cart.find((entry) => entry.id === id);
  if (entry) {
    entry.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  return saveCart();
}

// Increase or decrease a quantity and remove entries that reach zero.
export function changeQuantity(id, change) {
  const entry = cart.find((entry) => entry.id === id);
  entry.quantity += change;
  cart = cart.filter((entry) => entry.quantity > 0);
  return saveCart();
}

// Remove only the entry with this product ID.
export function removeFromCart(id) {
  cart = cart.filter((entry) => entry.id !== id);
  return saveCart();
}

// Empty the cart and persist the empty list.
export function clearCart() {
  cart = [];
  return saveCart();
}
