import "./style.css";
import { products } from "./products.js";
import { getCategories, getVisibleProducts } from "./product-logic.js";
import { loadCart, addToCart, changeQuantity, removeFromCart, clearCart } from "./cart.js";
import { initializePage, renderProducts, renderCart } from "./ui.js";

renderCart(loadCart());
initializePage({
  categories: getCategories(),
  // Send form values to the product logic and display its result.
  onProductsChange(filters) {
    renderProducts(getVisibleProducts(filters));
  },
  // Add one item and show the updated cart.
  onAddToCart(id) {
    const product = products.find((product) => product.id === id);
    renderCart(addToCart(id), `Added ${product.name}.`);
  },
  // Route quantity and removal actions to the cart module.
  onCartAction(id, action) {
    const product = products.find((product) => product.id === id);
    const cart =
      action === "remove" ? removeFromCart(id) : changeQuantity(id, action === "increase" ? 1 : -1);
    renderCart(cart, `Updated ${product.name}.`);
  },
  // Clear the cart after the page has confirmed the action.
  onClearCart() {
    renderCart(clearCart(), "Cart cleared.");
  },
});
