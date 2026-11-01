import assert from "node:assert/strict";
import { test } from "node:test";
import { toCents, formatPrice } from "../src/money.js";

test("prices become integer cents before calculations", () => {
  assert.equal(toCents(89), 8900);
  assert.equal(toCents(19.99), 1999);
  assert.equal(toCents(0.1) + toCents(0.2), 30);
});

test("cent amounts display as USD with two decimal places", () => {
  assert.equal(formatPrice(0), "$0.00");
  assert.equal(formatPrice(1999), "$19.99");
});
