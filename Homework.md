# Day 2 homework: Interactive ShopBoard

---

# Claude can write the code. You have to understand it.

After every change, you should be able to say **what changed, where, and why**. If you can't, you're not done.

- **Ask for a walkthrough.** "Walk me through what you just changed, file by file, like I'm new to this project."
- **Ask about the details.** "Why did you put this here?" "What does this line do?" "What happens if I remove it?"
- **Don't know a file or a tool?** Search it on Google, or ask Claude: "What is this, what is it for, and what does it do in my project?"

---

ShopBoard has to work, and the code has to be organized well enough that you know where everything lives.

There are no ready-made prompts or rules here. You write them. That's how you learn to direct the AI instead of copying.

The homework has 3 parts.

---

## Part 1: Interactive ShopBoard

### What to build

- Products are not hardcoded in the HTML. They must be rendered from `src/products.js`.
- Search by name, filter by category, sort by price. All three work together.
- A cart that survives a page refresh, where the user can:
  - add a product
  - increase or decrease its quantity
  - remove a product
  - clear the whole cart
  - see the item count and the total, always up to date

You can keep our products or replace them with your own. Make it your shop.

### Before your first prompt

Write **at least 3 rules** in `CLAUDE.md`, in your own words, about the mistakes you don't want the AI to make. What did we see the AI get wrong on Day 2?

Not using Claude? Use your tool's rules file instead, like `AGENTS.md` or `.github/copilot-instructions.md`. Wherever this file says `CLAUDE.md`, use that.

### Think about these

- Sort the products, then pick "Default" again. Do you get the original order back? Why not?
- Change the filter 5 times, then click "Add to cart" once. How many items were added?
- Open Application > Local Storage. What is actually saved? Is it what you expected?

If any answer surprised you, there's something to fix. Once it's fixed, add a rule to `CLAUDE.md` so it doesn't happen again.

### Part 1 checks (all must pass)

- [ ] Search finds products by name, and upper or lower case doesn't matter.
- [ ] Picking a category shows only the products in that category.
- [ ] Sorting works both ways, and "Default" brings back the original order.
- [ ] Search, filter and sort work together.
- [ ] Adding the same product twice shows a quantity of 2, not two separate lines.
- [ ] Decreasing a quantity of 1 removes the product. It never shows 0 or a negative number.
- [ ] Remove takes out only that product. The rest of the cart stays.
- [ ] Clear empties the cart, and the count and total go back to 0.
- [ ] The item count and the total are correct after every action. Check them by hand.
- [ ] After a refresh, the cart is still there, exactly as you left it.
- [ ] One click adds one item, no matter how many times you changed the filter.
- [ ] No red errors in the Console.

> **Before you move on:** can you explain what changed in this part, and where? If not, ask Claude for a walkthrough before you continue.

---

## Part 2: You're the architect

### What to do

Split the code into modules: separate files, each with one job, talking to each other through `import` and `export`. Like we did in class: one file for the data, one for the logic, one for the cart, one for the page, and one that connects them.

Once it's split, keep building on that structure. Every new feature should have an obvious home.

### Part 2 checks

- [ ] You can explain every file in one sentence.
- [ ] Only one file touches the page (the DOM). Check it with a search in VS Code (`Ctrl/Cmd + Shift + F`).
- [ ] Someone else opening the project knows where a wishlist feature would go, without asking you.
- [ ] All Part 1 checks still pass.
- [ ] Your commit goes through and the hook doesn't block it.

> **Before you move on:** can you explain what changed in this part, and where? If not, ask Claude for a walkthrough before you continue.

---

## Part 3: Debugging log

Create `debugging-log.md` and write down every bug you hit during the homework, or in the debugging lab if you didn't finish it in class.

Copy this block for each bug:

```md
## Bug 1

- **What I saw:**
- **Type:** runtime / logic / state
- **How I found it:** (Console error, breakpoint, Application tab, console.log...)
- **Cause:** (the file and line, and why it was wrong)
- **Fix:**
- **Did I use AI? For what?**
```

**Rule:** before you ask the AI about a bug, spend 10 minutes on it yourself with the Console and breakpoints. Note in the log whether you used AI.

> **Before you move on:** can you explain each bug in your own words, without reading the AI's answer? If not, ask Claude for a walkthrough before you continue.

---

## Challenge (optional)

- Find a mistake the AI made twice. Write a rule in `CLAUDE.md` to stop it. Does it follow the rule next time?
- Ask for the same feature twice: once with a short prompt, once with a precise one. What's different in the code?

---

## Submit

- Push the project to a public GitHub repo.
- Send the link.
- The repo must include:
  - [ ] Code split into modules
  - [ ] A rules file for your AI tool (`CLAUDE.md`, `AGENTS.md`, or your tool's equivalent) with your rules
  - [ ] `debugging-log.md`

---

## If you get stuck

- Read the red error in the Console: what happened, and in which file and line.
- Set a breakpoint in Sources and look at the values.
- Check what is actually saved in Application > Local Storage.
- Ask the AI why the bug happened, not just "fix it".
- Still stuck? Post a screenshot in the group.

---

# If you can't explain it, it isn't done.

Before you submit, open your project and explain it out loud, file by file, as if you were teaching it. Every part you can't explain is a question to ask Claude, Google, or the group.
