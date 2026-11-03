import { formatPrice, toCents } from "./money.ts";
import type { ProductFilters } from "./product-logic.ts";
import type { Cart, Product } from "./types.ts";

type CartAction = "decrease" | "increase" | "remove";

interface PageCallbacks {
  categories: string[];
  onProductsChange: (filters: ProductFilters) => void;
  onAddToCart: (id: Product["id"]) => void;
  onCartAction: (id: Product["id"], action: CartAction) => void;
  onClearCart: () => void;
}

// Require the expected element type so missing or changed markup fails at its source.
function getElement<T extends HTMLElement>(
  selector: string,
  elementType: new () => T,
  root: ParentNode = document,
): T {
  const element = root.querySelector(selector);
  if (!(element instanceof elementType)) {
    throw new Error(`Expected ${elementType.name} matching ${selector}.`);
  }
  return element;
}

// Clone the template's root element and reject a missing or non-HTML root.
function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
  const clone = template.content.firstElementChild?.cloneNode(true);
  if (!(clone instanceof HTMLElement)) throw new Error(`Invalid template: ${template.id}`);
  return clone;
}

const productGrid = getElement("#product-grid", HTMLElement);
const productTemplate = getElement("#product-template", HTMLTemplateElement);
const searchInput = getElement("#product-search", HTMLInputElement);
const categorySelect = getElement("#product-category", HTMLSelectElement);
const sortSelect = getElement("#product-sort", HTMLSelectElement);
const productResults = getElement("#product-results", HTMLElement);
const cartItems = getElement("#cart-items", HTMLUListElement);
const cartItemTemplate = getElement("#cart-item-template", HTMLTemplateElement);
const cartCount = getElement("#cart-count", HTMLElement);
const cartItemCount = getElement("#cart-item-count", HTMLElement);
const cartTotal = getElement("#cart-total", HTMLElement);
const cartEmpty = getElement("#cart-empty", HTMLElement);
const clearCartButton = getElement("#clear-cart", HTMLButtonElement);
const cartFeedback = getElement("#cart-feedback", HTMLElement);
const storageStatus = getElement("#cart-storage-status", HTMLElement);
const cartTitle = getElement("#cart-title", HTMLElement);

// Display the already-filtered products without deciding which products match.
export function renderProducts(visibleProducts: Product[]): void {
  const cards = visibleProducts.map((product) => {
    const card = cloneTemplate(productTemplate);
    getElement("h3", HTMLElement, card).textContent = product.name;
    getElement(".category", HTMLElement, card).textContent = product.category;
    getElement(".price", HTMLElement, card).textContent = formatPrice(toCents(product.price));
    const button = getElement("button", HTMLButtonElement, card);
    button.dataset.productId = String(product.id);
    button.setAttribute("aria-label", `Add ${product.name} to cart`);
    return card;
  });

  productGrid.replaceChildren(...cards);
  productResults.textContent = visibleProducts.length
    ? `${visibleProducts.length} products found.`
    : "No products match. Try another search or category.";
}

// Display a cart summary supplied by cart.ts, including feedback and storage errors.
export function renderCart({ items, count, totalCents, storageMessage }: Cart, message = ""): void {
  const rows = items.map((item) => {
    const row = cloneTemplate(cartItemTemplate);
    row.dataset.productId = String(item.id);
    getElement("h3", HTMLElement, row).textContent = item.name;
    getElement(".cart-unit-price", HTMLElement, row).textContent =
      `${formatPrice(item.unitCents)} each`;
    getElement(".cart-quantity", HTMLElement, row).textContent = `Quantity: ${item.quantity}`;
    getElement(".cart-line-total", HTMLElement, row).textContent = formatPrice(item.lineCents);
    getElement('[data-action="decrease"]', HTMLButtonElement, row).setAttribute(
      "aria-label",
      `Decrease ${item.name} quantity`,
    );
    getElement('[data-action="increase"]', HTMLButtonElement, row).setAttribute(
      "aria-label",
      `Increase ${item.name} quantity`,
    );
    getElement('[data-action="remove"]', HTMLButtonElement, row).setAttribute(
      "aria-label",
      `Remove ${item.name} from cart`,
    );
    return row;
  });

  cartItems.replaceChildren(...rows);
  cartCount.textContent = String(count);
  cartItemCount.textContent = String(count);
  cartTotal.textContent = formatPrice(totalCents);
  cartEmpty.hidden = items.length > 0;
  clearCartButton.disabled = items.length === 0;
  storageStatus.textContent = storageMessage;
  cartFeedback.textContent = message
    ? `${message} Cart: ${count} items, total ${formatPrice(totalCents)}.`
    : "";
}

// Translate the current form values into plain data for the product logic.
function readFilters(): ProductFilters {
  const sort = sortSelect.value;
  if (sort !== "default" && sort !== "ascending" && sort !== "descending") {
    throw new Error(`Unknown product sort: ${sort}`);
  }
  return { search: searchInput.value, category: categorySelect.value, sort };
}

// Restore keyboard focus after a cart row is replaced or removed.
function focusCartControl(index: number, action: CartAction): void {
  const nextRow = cartItems.children[Math.min(index, cartItems.children.length - 1)];
  if (nextRow) {
    getElement(`[data-action="${action}"]`, HTMLButtonElement, nextRow).focus();
  } else {
    cartTitle.focus();
  }
}

// Populate categories and register listeners once, passing values rather than DOM events to main.ts.
export function initializePage({
  categories,
  onProductsChange,
  onAddToCart,
  onCartAction,
  onClearCart,
}: PageCallbacks): void {
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  }

  getElement("#product-controls", HTMLFormElement).addEventListener("submit", (event) => {
    event.preventDefault();
    onProductsChange(readFilters());
  });
  searchInput.addEventListener("input", () => onProductsChange(readFilters()));
  categorySelect.addEventListener("change", () => onProductsChange(readFilters()));
  sortSelect.addEventListener("change", () => onProductsChange(readFilters()));

  productGrid.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-product-id]");
    if (button instanceof HTMLButtonElement) onAddToCart(Number(button.dataset.productId));
  });
  cartItems.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-action]");
    if (!(button instanceof HTMLButtonElement)) return;

    const row = button.closest("li");
    if (!(row instanceof HTMLLIElement)) throw new Error("Cart action is missing its row.");
    const index = [...cartItems.children].indexOf(row);
    const action = button.dataset.action;
    if (action !== "decrease" && action !== "increase" && action !== "remove") {
      throw new Error(`Unknown cart action: ${action}`);
    }
    onCartAction(Number(row.dataset.productId), action);
    focusCartControl(index, action);
  });
  clearCartButton.addEventListener("click", () => {
    if (!window.confirm("Clear all items from your cart?")) return;
    onClearCart();
    cartTitle.focus();
  });

  onProductsChange(readFilters());
}
