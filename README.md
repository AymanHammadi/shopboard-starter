# ShopBoard

A one-page shop with 12 products, combined name search/category filtering/price sorting, and a cart saved in Local Storage. Built with Vite, strict TypeScript, semantic HTML, and mobile-first CSS. No framework, backend, checkout, or authentication.

The sign-up form uses native required, email, password-length, and terms validation. It does not create accounts, transmit credentials, or save them. `method="dialog"` also prevents network submission when JavaScript is unavailable.

## Run locally

Use Node.js 24 or newer and Git. From a clone of this repository:

```bash
npm ci
npm run dev
```

Open the URL Vite prints. Installation also sets up the husky commit hook.

## Project map

```text
index.html                # page, native forms, and reusable card templates
src/
├── types.ts              # Product, saved CartItem, CartLine, and Cart summary types
├── products.ts           # 12-product catalog, photo URLs, alt text, and ID lookup
├── product-logic.ts      # combined search/filter/sort without changing catalog order
├── cart.ts               # cart quantities, totals, persistence, and storage warnings
├── money.ts              # integer-cent conversion and USD formatting
├── ui.ts                 # all DOM access, rendering, listeners, and keyboard focus
└── main.ts               # startup and module wiring through values and callbacks
styles/style.css          # design tokens, fonts, controls, and responsive layouts
public/                   # favicon and self-hosted Inter fonts with their license
tests/                    # TypeScript cart, product-logic, and money tests
tsconfig.json             # strict TypeScript checks for source and tests
eslint.config.js          # lint rules, including type safety and DOM boundaries
CLAUDE.md                 # coding rules and local task-resume procedure
DESIGN.md                 # visual guidelines, asset credits, and usage restrictions
```

### How the modules work together

```text
Add to cart
  ui.ts reads the product ID
  main.ts calls cart.ts
  cart.ts updates quantities, saves, and returns a Cart summary
  main.ts passes the summary to ui.ts for rendering
```

`ui.ts` registers listeners once and passes plain values to callbacks. Filters work together; selecting Default restores catalog order. Money calculations use integer cents.

The `shopboard-cart` storage key holds only IDs and quantities, for example `[{"id":1,"quantity":2}]`. Names and prices come from the catalog. Invalid saved data starts an empty cart with a warning. If storage is blocked, shopping still works in memory but cannot survive a refresh.

A future wishlist belongs in `src/wishlist.ts`. Keep its state there, its page interactions in `ui.ts`, and its wiring in `main.ts`.

## Commands and checks

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start Vite                                      |
| `npm run typecheck`    | Check source and test types without emitting JS |
| `npm test`             | Run the 17 Node tests                           |
| `npm run lint`         | Run ESLint                                      |
| `npm run format:check` | Check formatting                                |
| `npm run format`       | Format files                                    |
| `npm run build`        | Typecheck and build into `dist/`                |
| `npm run preview`      | Serve the production build locally              |

Tests cover combined filters, default order, cart actions/totals/persistence, invalid or blocked storage, and money formatting. Node runs the TypeScript tests directly; `typecheck` checks their types.

```text
git commit
  husky → lint-staged
    JS/TS → ESLint --fix → Prettier
    HTML/CSS/Markdown/JSON → Prettier
```

The hook does not run typechecking, tests, or the build. Run those separately before review. `.vscode/` recommends ESLint and Prettier and configures format-on-save.

## Design and assets

The interface uses lime actions, sage surfaces, rounded white cards, and self-hosted Inter. The product grid has one column below 768px, two from 768px, and three from 1280px. See [DESIGN.md](DESIGN.md) for tokens, interaction rules, photo credits, and license details.

Product photos load from fixed Pexels URLs with compressed responsive sizes. Pexels attribution is optional; third-party rights and endorsement restrictions still apply. These are stock illustrations of the catalog, not verified supplier inventory. A real store needs photos of the actual goods and any required permissions. Retain `public/fonts/OFL.txt` when distributing Inter.

## Verification limits

Development and production checks passed in headless Chrome, including cart persistence, combined filters, keyboard actions, form submission safety, image/storage failures, and 360/768/1280px layouts. This is not a full accessibility audit.

Firefox, Safari, real phones, and screen readers remain untested. External photo availability and product authenticity are not guaranteed. The last dependency audit reported 11 moderate development-tooling findings related to minimatch advisory `GHSA-g3hv-75wg-m249`; no dependency fixes are included in this upgrade.
