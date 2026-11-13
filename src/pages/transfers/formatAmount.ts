/**
 * Formats an amount held in cents for the transfers table, with a comma
 * between thousands and a dot before the cents: 125000 -> "1,250.00 EUR".
 * Written out by hand instead of using Intl, so the table reads the same
 * whichever language the browser is set to.
 */
export function formatAmount(cents: number, currency: string): string {
  const units = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, "0");
  const thousands = Math.floor(units / 1000);
  const rest = units % 1000;
  const whole = thousands > 0 ? `${thousands},${rest}` : `${rest}`;
  return `${whole}.${fraction} ${currency}`;
}
