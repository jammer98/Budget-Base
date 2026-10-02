const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

/** Expense amounts come back as strings from the API — always cast first. */
export function formatCurrency(amount: string | number): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return currencyFormatter.format(n);
}

/** For display, e.g. table cells: "Oct 1, 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** For <input type="date">, which requires exactly "YYYY-MM-DD" */
export function toDateInputValue(iso: string): string {
  return iso.slice(0, 10);
}