# CLAUDE.md

## Project

ShopBoard: a shop landing page with a product list and a sign-up form.

## Stack

- Vite (vanilla template), plain HTML, CSS and JavaScript. No frameworks.
- Prettier formats the code. ESLint checks it.
- husky + lint-staged run both on every commit.

## Commands

- `npm run dev`: start the dev server
- `npm run lint`: check the JavaScript
- `npm run format`: format every file
- `npm run build`: build for production

## Rules

1. Semantic HTML first: header, nav, main, section, article, footer. One h1 per page.
2. Buttons are `<button>`, links are `<a href>`. Never a clickable div.
3. Every input has a `<label>`. Use native validation (required, type, minlength) before JavaScript.
4. Mobile-first CSS: base styles are for phones, then `min-width` media queries only. No `!important`.
5. Use `===`, `const` by default, `let` only when the value changes. Never `var`.
6. No magic numbers: give them a name (`TAX_RATE`, not `1.2`).
7. Reuse existing functions. Don't duplicate logic.
8. Explain every new file and function in one line.
9. Don't change what I didn't ask for.

## Project structure

- `index.html`: the page
- `src/style.css`: all styles
- `src/products.js`: the product data
- `src/product-logic.js`: search, category filtering and price sorting without changing the catalog
- `src/cart.js`: cart state, totals and Local Storage; returns plain summaries
- `src/money.js`: shared cents conversion and USD formatting
- `src/ui.js`: the only file for DOM access, rendering, listeners and focus
- `src/main.js`: connects the modules through plain values and callbacks
- `tests/`: Node tests for the product logic, cart and money

For new features, keep page interactions in `src/ui.js` and feature state in its own module. A future wishlist belongs in `src/wishlist.js`, connected by `src/main.js`. See README.md for the module walkthrough.

## Resuming work

Before starting or resuming implementation, read `docs/ai/tasks.md` if it exists. It is an ignored local tracker, not a file supplied by a fresh clone. Check the working tree and the current task's progress before choosing the first unfinished stage whose dependencies are complete. Update the tracker with changes, checks, blockers, and the next action. Pause for user review before committing each stage; continue to the next stage only after approval. If the tracker is missing, ask for the current task rather than reconstructing one from old homework.
