# ShopBoard design guidelines

This file defines the target for the interface redesign, not the current appearance. Implement it in `styles/style.css` and `index.html`, with DOM behavior in `src/ui.ts` and product photography data in `src/products.ts` and `src/types.ts`.

Adapted from the external `DESIGN-wise.md` reference: lime actions, sage surfaces, heavy Inter headlines, and rounded white cards. Keep ShopBoard's identity and shopping flow; do not copy the reference kit, proprietary Wise Sans, or fintech examples. This is a light-only design.

## Color tokens

Define these target custom properties in `styles/style.css` under `:root`. Reuse the existing names where listed. Components use tokens, never raw color values. The darker secondary text and control border replace the reference's low-contrast muted gray.

| Token              | Value     | Use                                       |
| ------------------ | --------- | ----------------------------------------- |
| `--paper`          | `#e8ebe6` | Sage page and hero canvas                 |
| `--white`          | `#ffffff` | Cards, header, and fields                 |
| `--ink`            | `#0e0f0c` | Headings, body, and text on lime          |
| `--muted`          | `#454745` | Categories, hints, and secondary text     |
| `--accent`         | `#9fe870` | Primary action fill, never body text      |
| `--accent-hover`   | `#cdffad` | Primary hover fill                        |
| `--accent-pressed` | `#c5edab` | Primary pressed fill                      |
| `--line`           | `#ced3c9` | Decorative dividers, not field boundaries |
| `--control-border` | `#6e7368` | Input and outlined-control boundaries     |
| `--focus`          | `#163300` | Keyboard focus outline and inline links   |
| `--danger`         | `#a72027` | Remove and clear-cart text                |
| `--warning-bg`     | `#ffd11a` | Storage-warning surface                   |
| `--warning-ink`    | `#4a3b1c` | Storage-warning text                      |

Use white cards on sage, ink text on white or sage, and ink labels on lime. Secondary controls use white with `--control-border`, then sage on hover and `--line` when pressed. Disabled controls use `--line` with `--muted`, not opacity. Storage warnings use both warning tokens and a text explanation. Do not add a success palette for local cart updates.

## Typography

Use `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Load open-source Inter as WOFF2 with `font-display: swap`, only weights 400, 600, and 900; retain its font license. Do not load Wise Sans or add another font family.

| Role                          | Size                       | Weight                          | Line height |
| ----------------------------- | -------------------------- | ------------------------------- | ----------- |
| Hero h1                       | `clamp(2.5rem, 6vw, 5rem)` | 900                             | 1.05        |
| Section h2                    | `clamp(2rem, 3vw, 2.5rem)` | 900                             | 1.1         |
| Product/cart h3               | `1.25rem`                  | 600                             | 1.3         |
| Body, fields, buttons, prices | `1rem`                     | 400; 600 for actions and prices | 1.5         |
| Categories, hints, footer     | `0.875rem`                 | 400                             | 1.5         |

Use a 16px base, normal body tracking, and `-0.03em` tracking only on h1/h2. Keep body lines within 65ch. Product names wrap rather than truncate. Prices, quantities, and counters use tabular numbers so updates do not shift adjacent text. Keep one h1, then h2 sections and h3 product names.

## Layout and surfaces

- Use mobile-first CSS with `min-width` breakpoints only. Keep the catalog at one column below 768px, two from 768px, and three from 1280px. At 360px, nothing may cause horizontal page scrolling.
- Center content within 1200px. Use 16px horizontal gutters on phones and 32px from 768px; align the header, main sections, and footer to the same content edges.
- Preserve page order: header/navigation/cart count, hero, product controls/grid, cart, sign-up, footer. Keep the hero left-aligned with one shop link; do not add a dashboard, cart drawer, checkout, or new sections.
- Use a 4px spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px. Name reused sizes in `:root`; retain `--space: 16px`. Use 16px grid gaps on phones and 24px from 768px, with 32px section padding vertically on phones and 48px from 768px.
- Set `--radius: 24px` for cards, `--radius-control: 12px` for fields, `--radius-media: 8px` for inset photographs, and `--radius-pill: 9999px` for buttons. Cards have 16px padding, keeping the inset image radius concentric with the outer card.
- Use surface contrast for depth, not shadows. Keep the footer sage with muted text. Use solid fills; no gradients, decorative colored side borders, glass effects, or extra accent colors.
- Stack filters, cart-row content, and form fields on phones. From 768px, filters may share a row and cart controls may sit beside the item name; wrap controls before they overflow. Keep the sign-up form within 480px. Visual and DOM order must agree.

## Buttons and links

Use buttons for actions and anchors for navigation. The supported treatments are primary, secondary, and destructive; these are visual roles, not a new component API. Secondary is the default for utility actions.

- Primary uses lime with ink text. Apply to the hero's shop link, each product's Add to cart button, and the sign-up submit button. These repeated product actions are the catalog's primary action, not a reason to make every control lime.
- Secondary uses the outlined neutral treatment for Search and quantity controls. Destructive uses that treatment with `--danger` text for Remove and Clear cart, never a lime fill. Retain the clear-cart confirmation.
- Keep `.button` for button-styled anchors and `.button-secondary` for neutral buttons. For example, `<a class="button" href="#products">Shop now</a>` navigates; do not replace it with a button. `<button class="button-secondary" type="button" data-action="increase">+</button>` changes quantity; do not turn the cart row into a clickable wrapper.
- Standard controls are at least 48px tall with 12px vertical and 24px horizontal padding. Quantity buttons may be 44px square. Text links remain underlined except the logo, header navigation, and button-styled anchors.

## Product cards and photography

Use the existing `#product-template` article for products and `#cart-item-template` list item for cart rows. White is the only card treatment; use the sage page surface for section grouping rather than adding feature-card variants. Keep the explicit Add to cart button; the card itself is not interactive.

Show each product's photograph, name, category, USD price, and action in that order. Unlike the reference's illustrations, photography must help shoppers identify all 12 existing products. Keep catalog names, IDs, categories, prices, and default order unchanged.

Use stable, product-specific free-stock image URLs, never random-image endpoints. Verify each photo matches the named product and record the provider's usage and attribution requirements before shipping. Request compressed images at appropriate widths with responsive sources; reserve a 4:3 area with intrinsic dimensions and `object-fit: cover`. Lazy-load only below-the-fold images. Keep text and actions usable if an image fails; do not silently substitute an unrelated product. Give informative images concise alt text without repeating adjacent labels unnecessarily.

## Fields and sign-up

Use the existing native inputs, selects, checkbox, and `.field` labels rather than custom dropdowns or placeholder-only labels. The single field treatment is white, ink text, a 1px `--control-border` border, 12px corners, 16px text, and at least 48px height. For example, keep `<label for="product-search">Search products</label>` associated with its input; a placeholder is not a replacement. The checkbox and its label together provide a target at least 44px tall.

Keep native `required`, email, password-length, and terms validation. Do not show invalid states before interaction; use native validation feedback rather than inventing a parallel error system. Handle valid sign-up submission in `src/ui.ts` without navigation, transmitting credentials, or saving them in storage. There is no account backend: add no fake success message, demo notice, or implementation instructions to the page.

## Interaction states and copy

- Hover changes fills only inside `(hover: hover) and (pointer: fine)`; keep pressed feedback available on touch. Use a 3px `--focus` outline with 2px offset for `:focus-visible`, including links and checkbox controls. Never replace focus with hover styling.
- Keep feedback immediate. Limit optional transitions to named color/background/border properties at 150ms ease-out; disable them for `prefers-reduced-motion: reduce`. Do not animate grid reflow, cart updates, or page entrance, and do not use `transition: all`.
- Preserve product-specific accessible names, keyboard operation, focus restoration after cart changes, and existing status regions. Keep Clear cart disabled when empty and maintain visible item counts and totals after every action and refresh.
- Use sentence case and outcome labels such as Add to cart and Remove. Keep necessary labels and the password requirement; remove redundant visible explanations. Empty results suggest another search or category, an empty cart points back to products, and storage failures explain the refresh limitation. Use inline status text rather than adding toast infrastructure.

## Redesign acceptance

During implementation, inspect 360px, 768px, and 1280px layouts, keyboard focus, every button state, empty results/cart, blocked storage, image loading/failure, and native form validation/submission. Check text contrast at 4.5:1, large text at 3:1, and control boundaries/focus at 3:1 against adjacent surfaces. These are acceptance targets, not claims of completed accessibility testing. Preserve combined search/filter/sort, default order, cart totals, and persistence. Report checks that could not be performed.
