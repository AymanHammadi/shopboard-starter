# ShopBoard: Interactive shop

ShopBoard renders 12 products with name search, category filtering, price sorting, and a cart that survives a page refresh.

It uses plain JavaScript modules, semantic HTML, and mobile-first CSS. The original sign-up form still uses native validation; account creation is not connected to a backend.

---

## 1. Run the project

You need Node.js (LTS) and Git. Check in your terminal:

```bash
node -v
git --version
```

Then:

```bash
git clone <repo-url>
cd shopboard
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

Note: `npm install` downloads all the tools and sets up husky. The project must be inside a git repo. If you cloned it, it already is.

---

## 2. What each file does

```
shopboard/
├── index.html            ← the whole page (HTML)
├── src/
│   ├── style.css         ← all the styles (CSS)
│   ├── products.js       ← the product catalog
│   ├── product-logic.js  ← search, category filtering, and price sorting
│   ├── cart.js           ← cart quantities, totals, and Local Storage
│   ├── money.js          ← cents conversion and USD formatting
│   ├── ui.js             ← all DOM access, rendering, and event listeners
│   └── main.js           ← connects the modules and starts the page
├── tests/                ← product, cart, and money tests using Node's test runner
├── CLAUDE.md             ← project rules for the AI
├── debugging-log.md      ← bug observations, investigations, causes, and fixes
├── package.json          ← project name, commands and tools
├── package-lock.json     ← exact tool versions (don't edit by hand)
├── eslint.config.js      ← ESLint rules
├── .prettierrc           ← Prettier settings
├── .prettierignore       ← files Prettier skips
├── .husky/pre-commit     ← the command that runs before every commit
├── .vscode/              ← suggested VS Code settings
└── .gitignore            ← files that never go to GitHub
```

### `index.html`

The page, split with the right tags:

- `header` holds the logo, the `nav` with the links, and the cart counter.
- `main` holds 4 sections (`section`):
  - **hero:** the only `h1` on the page.
  - **products:** controls and a grid filled from the product catalog.
  - **shopping-cart:** cart rows, quantities, item count, and total.
  - **register:** the sign-up form.
- `footer` closes the page.

The two `<template>` elements hold reusable card markup, not product data. `ui.js` clones them and fills in the text.

In the form:

- Every `input` has a `label`, linked with `for` and `id`.
- `type="email"` checks the email format for you.
- `required` blocks sending an empty field.
- `minlength="8"` forces at least 8 characters for the password.

The browser does all this validation, **with zero lines of JavaScript**.

### `src/style.css`

Written **mobile-first**:

- The base styles are for phones (360px): cards in one column.
- `@media (min-width: 768px)` for tablets: two columns.
- `@media (min-width: 1280px)` for desktops: three columns.

At the top of the file there are **variables** (`--ink`, `--accent`, ...). To change a color, change it in one place.

`:focus-visible` draws a clear outline on any element you reach with Tab. This matters for people who use only a keyboard.

### `src/products.js`

An array of 12 products. Each product has an `id`, `name`, `category` and `price`. This is the only catalog to edit when adding or changing products.

### `src/product-logic.js`

`getCategories()` returns unique categories. `getVisibleProducts(filters)` applies search, category, and sorting together and returns a new array. Sorting never changes the original catalog, so selecting "Default" restores the original order.

### `src/cart.js`

Owns the cart entries and Local Storage. `loadCart()` restores valid saved entries. `addToCart(id)`, `changeQuantity(id, change)`, `removeFromCart(id)`, and `clearCart()` save each change and return a fresh summary with rows, item count, total cents, and any storage warning.

Cart action IDs come from the product catalog. Quantity buttons pass `1` or `-1`; a quantity reaching zero removes that entry. Call `loadCart()` at startup before handling actions.

The `shopboard-cart` storage key contains only IDs and quantities, for example `[{"id":1,"quantity":2}]`. Names and prices always come from `products.js`. Invalid saved carts start empty with a warning. If storage is unavailable, shopping still works in memory and the page explains that changes cannot survive a refresh.

### `src/money.js`

`toCents(price)` converts dollar prices to integer cents for calculations. `formatPrice(cents)` formats cents as USD for display. Keeping these together avoids separate money rules in the cart and the page.

### `src/ui.js`

The only JavaScript file that touches the DOM. `initializePage(...)` fills categories and registers listeners once. It sends plain values to callbacks, not HTML elements or browser events. `renderProducts(products)` and `renderCart(summary, message)` display results supplied by the other modules. Keyboard focus, clear-cart confirmation, and status messages also live here.

### `src/main.js`

The entry point connects the modules through imports and callbacks. It loads the cart, starts the page, sends filter values to the product logic, and sends cart actions to the cart module. It never queries or changes HTML itself.

For example, clicking "Add to cart" follows this path:

1. `ui.js` reads the clicked product ID and calls `onAddToCart(id)`.
2. `main.js` calls `addToCart(id)` in `cart.js`.
3. `cart.js` changes the quantity, saves it, and returns the updated summary.
4. `main.js` passes that summary to `renderCart(...)` in `ui.js`.

### Where would a wishlist go?

Add `src/wishlist.js` for saved product IDs and wishlist actions. Put its buttons, listeners, and rendering in the existing `ui.js`, then connect the callbacks in `main.js`. Wishlist state does not belong in `cart.js`, and the new module should not access the DOM. This is a placement guide, not an implemented feature.

### `tests/`

`product-logic.test.js` checks combined controls and original-order preservation. `cart.test.js` checks quantities, totals, persistence, and invalid or blocked storage. `money.test.js` checks cents conversion and price formatting. Run all tests with `npm test`; no additional test library is needed.

### `CLAUDE.md`

The rules we want the AI to follow. AI coding tools read this file before writing code in the project. If you see the AI making the same mistake again and again, **add a rule**.

---

## 3. Code quality tools

| Tool            | What it does                                                              |
| --------------- | ------------------------------------------------------------------------- |
| **Prettier**    | Formats the code: spacing, commas, line length.                           |
| **ESLint**      | Finds mistakes, like an undefined variable or `==` instead of `===`.      |
| **husky**       | Runs commands automatically before every `git commit`.                    |
| **lint-staged** | Runs those commands only on the files you changed, not the whole project. |

**What happens when you commit:**

```
git commit
  → husky runs .husky/pre-commit
    → lint-staged
      → ESLint fixes what it can, and blocks the commit if an error can't be fixed
      → Prettier formats the files
  → if everything passes, the commit goes through
```

### Try it yourself (important)

**1. Prettier fixes formatting for you.** Write some ugly code in `src/main.js`:

```js
const x = 1;
console.log(x);
```

Run `git add` and `git commit`, then open the file again. It's formatted now.

**2. ESLint blocks the commit.** Write:

```js
if (count == 1) {
  console.log("one");
}
```

Try to commit. You'll get an error and the commit stops: `count` is not defined, and you must use `===` instead of `==`. Fix both and try again.

When you're done, delete these lines.

### Useful commands

```bash
npm run dev            # start the project
npm run lint           # check the JavaScript
npm test               # run module tests
npm run format         # format every file
npm run format:check   # check formatting without changing anything
npm run build          # build the production version into dist/
```

### VS Code

When you open the project, VS Code will suggest two extensions: **Prettier** and **ESLint**. Install both.
After that, every file formats itself when you save, and ESLint errors show a red underline.

---

## 4. Checks before you say "done"

- [ ] There is only one `h1` on the page.
- [ ] Every `input` has a `label`.
- [ ] Sending the empty form shows browser messages.
- [ ] The whole page works with Tab and Enter, no mouse, and the focus outline is visible.
- [ ] No horizontal scroll at 360px (DevTools → Toggle device toolbar).
- [ ] Cards: 1 column at 360, 2 at 768, 3 at 1280.
- [ ] Lighthouse → Accessibility is above 90.
- [ ] `npm run lint` passes with no errors.

---

## 5. The golden rule

> AI makes it look done. You make it work.

We don't accept code we don't understand. If the AI writes something you don't get, ask it to explain in simple words.
