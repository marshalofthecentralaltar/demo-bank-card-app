const eurFormat = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats an amount held in cents, e.g. 124050 -> "1,240.50 EUR". */
export function formatEur(cents: number): string {
  return `${eurFormat.format(cents / 100)} EUR`;
}
