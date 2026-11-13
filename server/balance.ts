/**
 * Simulated card payments settling against the account. Every second the
 * balance moves by a few cents; the steps sum to zero, so it stays near the
 * opening balance however long the server runs.
 */
const SETTLEMENT_STEPS_CENTS = [-3, 2, -5, 4, -2, 3, -4, 5];

const CUMULATIVE = SETTLEMENT_STEPS_CENTS.reduce<number[]>(
  (sums, step) => [...sums, (sums[sums.length - 1] ?? 0) + step],
  [0],
);

export function createBalance(openingCents: number, now: () => number = Date.now) {
  const startSecond = Math.floor(now() / 1000);

  return {
    readCents(): number {
      const elapsed = Math.floor(now() / 1000) - startSecond;
      const position = elapsed % SETTLEMENT_STEPS_CENTS.length;
      return openingCents + (CUMULATIVE[position] ?? 0);
    },
  };
}
