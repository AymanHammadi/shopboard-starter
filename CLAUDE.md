# CLAUDE.md

## Project

ShopBoard: a one-page shop with 12 products, combined search/filter/sort, a persistent cart, and a sign-up form. No backend, checkout, or authentication.

## Stack

- Vite, strict TypeScript, semantic HTML, and mobile-first CSS. No frameworks.
- All files in `src/` and all tests are TypeScript. CSS lives in `styles/`.
- Prettier formats the code. ESLint checks it.
- husky + lint-staged run both on every commit.

## Commands

- `npm run dev`: start the dev server
- `npm run typecheck`: check source and test types
- `npm test`: run the Node tests
- `npm run lint`: check JavaScript and TypeScript
- `npm run format`: format every file
- `npm run format:check`: check formatting without edits
- `npm run build`: typecheck and build for production

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
10. Keep strict types. Use the shared Product, CartItem, and Cart types; narrow unknown values with runtime checks. No `any`, type assertions, non-null assertions, or TypeScript suppression comments.
11. Keep necessary input labels and accessible names, but remove redundant visible explanations. Do not add demo notices, fake account-success messages, or implementation instructions to the page.
12. Use solid fills, not gradients, to keep the agreed visual style.
13. Use surface contrast and ordinary dividers, not decorative colored side borders.

Before changing the interface, read `DESIGN.md` for tokens, component treatments, interaction states, and asset requirements. Keep native sign-up validation and prevent credential transmission or storage; there is no account backend.

## Project structure

- `index.html`: the page
- `styles/style.css`: all styles and design tokens
- `src/types.ts`: shared product, persisted cart entry, and cart summary types
- `src/products.ts`: product data, photo URLs, alt text, and ID lookup
- `src/product-logic.ts`: search, category filtering and price sorting without changing the catalog
- `src/cart.ts`: cart state, totals and Local Storage; returns plain summaries
- `src/money.ts`: shared cents conversion and USD formatting
- `src/ui.ts`: the only file for DOM access, rendering, listeners and focus
- `src/main.ts`: connects the modules through plain values and callbacks
- `public/`: favicon and self-hosted fonts; retain the font license
- `tests/`: TypeScript Node tests for the product logic, cart and money

For new features, keep page interactions in `src/ui.ts` and feature state in its own module. A future wishlist belongs in `src/wishlist.ts`, connected by `src/main.ts`. See README.md for the module walkthrough.

## Resuming work

Before starting or resuming implementation, read `docs/ai/tasks.md` if it exists. It is an ignored local tracker, not a file supplied by a fresh clone. Check the working tree and the current task's progress before choosing the first unfinished stage whose dependencies are complete. Update the tracker with changes, checks, blockers, and the next action. Pause for user review before committing each stage; continue to the next stage only after approval. If the tracker is missing, ask for the current task rather than reconstructing one from old homework.
