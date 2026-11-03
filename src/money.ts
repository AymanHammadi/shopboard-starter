const CENTS_PER_DOLLAR = 100;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

// Convert a catalog price to integer cents before calculating cart totals.
export function toCents(price: number): number {
  return Math.round(price * CENTS_PER_DOLLAR);
}

// Format an integer number of cents as a dollar price.
export function formatPrice(cents: number): string {
  return currency.format(cents / CENTS_PER_DOLLAR);
}
