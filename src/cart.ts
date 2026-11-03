import { getProduct, products } from "./products.ts";
import { toCents } from "./money.ts";
import type { Cart, CartItem, Product } from "./types.ts";

const CART_STORAGE_KEY = "shopboard-cart";
let cart: CartItem[] = [];
let storageMessage = "";

// Build display rows and totals without exposing the mutable cart entries.
function getCart(): Cart {
  let count = 0;
  let totalCents = 0;
  const items = cart.map((entry) => {
    const product = getProduct(entry.id);
    const unitCents = toCents(product.price);
    const lineCents = unitCents * entry.quantity;
    count += entry.quantity;
    totalCents += lineCents;
    return { id: entry.id, name: product.name, quantity: entry.quantity, unitCents, lineCents };
  });

  return { items, count, totalCents, storageMessage };
}

// Validate one untrusted storage entry before using its ID or quantity.
function isCartItem(entry: unknown): entry is CartItem {
  return (
    entry !== null &&
    typeof entry === "object" &&
    "id" in entry &&
    typeof entry.id === "number" &&
    products.some((product) => product.id === entry.id) &&
    "quantity" in entry &&
    typeof entry.quantity === "number" &&
    Number.isSafeInteger(entry.quantity) &&
    entry.quantity > 0
  );
}

// Accept only arrays of valid entries with no repeated product IDs.
function isCartItems(value: unknown): value is CartItem[] {
  if (!Array.isArray(value) || !value.every(isCartItem)) return false;
  return new Set(value.map((entry) => entry.id)).size === value.length;
}

// Load validated IDs and quantities, reporting invalid or inaccessible storage in the result.
export function loadCart(): Cart {
  cart = [];
  storageMessage = "";
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved === null) return getCart();

    const entries: unknown = JSON.parse(saved);
    if (!isCartItems(entries)) {
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
function saveCart(): Cart {
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
export function addToCart(id: Product["id"]): Cart {
  getProduct(id);
  const entry = cart.find((entry) => entry.id === id);
  if (entry) {
    entry.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  return saveCart();
}

// Increase or decrease a quantity and remove entries that reach zero.
export function changeQuantity(id: Product["id"], change: 1 | -1): Cart {
  const entry = cart.find((entry) => entry.id === id);
  if (!entry) throw new Error(`Product ${id} is not in the cart.`);
  entry.quantity += change;
  cart = cart.filter((entry) => entry.quantity > 0);
  return saveCart();
}

// Remove only the entry with this product ID.
export function removeFromCart(id: Product["id"]): Cart {
  cart = cart.filter((entry) => entry.id !== id);
  return saveCart();
}

// Empty the cart and persist the empty list.
export function clearCart(): Cart {
  cart = [];
  return saveCart();
}
