import { useEffect, useState } from "react";

type BalanceResponse = {
  balance_cents: number;
  currency: string;
  as_of: string;
};

export async function fetchBalance(signal?: AbortSignal): Promise<BalanceResponse> {
  const response = await fetch("/api/balance", { signal });
  if (!response.ok) throw new Error(`Balance request failed with ${response.status}`);
  return (await response.json()) as BalanceResponse;
}

/** Loads the account balance once when the card page opens. */
export function useBalance(): number | null {
  const [cents, setCents] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchBalance(controller.signal)
      .then((body) => setCents(body.balance_cents))
      .catch(() => {
        // Aborted on unmount, or offline: the page keeps showing the placeholder.
      });
    return () => controller.abort();
  }, []);

  return cents;
}
