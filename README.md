# ShopBoard: Day 1 project

This is the complete Day 1 project. It is your starting point for the Day 2 homework.

It includes a ShopBoard page built with semantic HTML, a sign-up form with native validation, mobile-first CSS, and the code quality tools: Prettier, ESLint, husky and lint-staged.

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
│   ├── products.js       ← data for 12 products, used on Day 2
│   └── main.js           ← where the JavaScript starts (almost empty for now)
├── CLAUDE.md             ← project rules for the AI
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
- `main` holds 3 sections (`section`):
  - **hero:** the only `h1` on the page.
  - **products:** 6 cards, each one an `article`.
  - **register:** the sign-up form.
- `footer` closes the page.

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

An array of 12 products. Each product has an `id`, `name`, `category` and `price`. On Day 2 you'll render the cards from this data instead of writing them by hand in the HTML.

### `src/main.js`

The first JavaScript file that loads. For now it only imports the CSS. Day 2 starts here.

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
