import { formatPrice, toCents } from "./money.js";

const productGrid = document.querySelector("#product-grid");
const productTemplate = document.querySelector("#product-template");
const searchInput = document.querySelector("#product-search");
const categorySelect = document.querySelector("#product-category");
const sortSelect = document.querySelector("#product-sort");
const productResults = document.querySelector("#product-results");
const cartItems = document.querySelector("#cart-items");
const cartItemTemplate = document.querySelector("#cart-item-template");
const cartCount = document.querySelector("#cart-count");
const cartItemCount = document.querySelector("#cart-item-count");
const cartTotal = document.querySelector("#cart-total");
const cartEmpty = document.querySelector("#cart-empty");
const clearCartButton = document.querySelector("#clear-cart");
const cartFeedback = document.querySelector("#cart-feedback");
const storageStatus = document.querySelector("#cart-storage-status");
const cartTitle = document.querySelector("#cart-title");

// Display the already-filtered products without deciding which products match.
export function renderProducts(visibleProducts) {
  const cards = visibleProducts.map((product) => {
    const card = productTemplate.content.firstElementChild.cloneNode(true);
    card.querySelector("h3").textContent = product.name;
    card.querySelector(".category").textContent = product.category;
    card.querySelector(".price").textContent = formatPrice(toCents(product.price));
    const button = card.querySelector("button");
    button.dataset.productId = product.id;
    button.setAttribute("aria-label", `Add ${product.name} to cart`);
    return card;
  });

  productGrid.replaceChildren(...cards);
  productResults.textContent = visibleProducts.length
    ? `${visibleProducts.length} products found.`
    : "No products match. Try another search or category.";
}

// Display a cart summary supplied by cart.js, including feedback and storage errors.
export function renderCart({ items, count, totalCents, storageMessage }, message = "") {
  const rows = items.map((item) => {
    const row = cartItemTemplate.content.firstElementChild.cloneNode(true);
    row.dataset.productId = item.id;
    row.querySelector("h3").textContent = item.name;
    row.querySelector(".cart-unit-price").textContent = `${formatPrice(item.unitCents)} each`;
    row.querySelector(".cart-quantity").textContent = `Quantity: ${item.quantity}`;
    row.querySelector(".cart-line-total").textContent = formatPrice(item.lineCents);
    row
      .querySelector('[data-action="decrease"]')
      .setAttribute("aria-label", `Decrease ${item.name} quantity`);
    row
      .querySelector('[data-action="increase"]')
      .setAttribute("aria-label", `Increase ${item.name} quantity`);
    row
      .querySelector('[data-action="remove"]')
      .setAttribute("aria-label", `Remove ${item.name} from cart`);
    return row;
  });

  cartItems.replaceChildren(...rows);
  cartCount.textContent = count;
  cartItemCount.textContent = count;
  cartTotal.textContent = formatPrice(totalCents);
  cartEmpty.hidden = items.length > 0;
  clearCartButton.disabled = items.length === 0;
  storageStatus.textContent = storageMessage;
  cartFeedback.textContent = message
    ? `${message} Cart: ${count} items, total ${formatPrice(totalCents)}.`
    : "";
}

// Translate the current form values into plain data for the product logic.
function readFilters() {
  return { search: searchInput.value, category: categorySelect.value, sort: sortSelect.value };
}

// Restore keyboard focus after a cart row is replaced or removed.
function focusCartControl(index, action) {
  const nextRow = cartItems.children[Math.min(index, cartItems.children.length - 1)];
  if (nextRow) {
    nextRow.querySelector(`[data-action="${action}"]`).focus();
  } else {
    cartTitle.focus();
  }
}

// Populate categories and register listeners once, passing values rather than DOM events to main.js.
export function initializePage({
  categories,
  onProductsChange,
  onAddToCart,
  onCartAction,
  onClearCart,
}) {
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  }

  document.querySelector("#product-controls").addEventListener("submit", (event) => {
    event.preventDefault();
    onProductsChange(readFilters());
  });
  searchInput.addEventListener("input", () => onProductsChange(readFilters()));
  categorySelect.addEventListener("change", () => onProductsChange(readFilters()));
  sortSelect.addEventListener("change", () => onProductsChange(readFilters()));

  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product-id]");
    if (button) onAddToCart(Number(button.dataset.productId));
  });
  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = button.closest("li");
    const index = [...cartItems.children].indexOf(row);
    const action = button.dataset.action;
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
