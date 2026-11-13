import { useEffect, useState } from "react";

type BalanceResponse = {
  balance_cents: number;
  currency: string;
  as_of: string;
};

export type LiveBalance = {
  cents: number | null;
  updatedAt: Date | null;
};

export async function fetchBalance(signal?: AbortSignal): Promise<BalanceResponse> {
  const response = await fetch("/api/balance", { signal });
  if (!response.ok) throw new Error(`Balance request failed with ${response.status}`);
  return (await response.json()) as BalanceResponse;
}

/**
 * Keeps the account balance current while the card page is open, so card
 * payments show up as they settle. Asks the server every `intervalMs`.
 */
export function useLiveBalance(intervalMs: number): LiveBalance {
  const [balance, setBalance] = useState<LiveBalance>({ cents: null, updatedAt: null });

  useEffect(() => {
    let controller = new AbortController();

    const load = () => {
      controller.abort();
      controller = new AbortController();
      fetchBalance(controller.signal)
        .then((body) => setBalance({ cents: body.balance_cents, updatedAt: new Date(body.as_of) }))
        .catch(() => {
          // Aborted by the next refresh or on unmount, or offline: keep the last balance shown.
        });
    };

    load();
    const timer = window.setInterval(load, intervalMs);
    return () => {
      window.clearInterval(timer);
      controller.abort();
    };
  }, [intervalMs]);

  return balance;
}
