import { useEffect, useState } from "react";

export type Transfer = {
  id: string;
  date: string;
  recipient: string;
  amount_cents: number;
  fee_cents?: number;
  currency: string;
  status: "Sent" | "Arriving";
};

export type TransfersState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; transfers: Transfer[] };

export function useTransfers(): TransfersState {
  const [state, setState] = useState<TransfersState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/transfers", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Transfers request failed with ${response.status}`);
        const body = (await response.json()) as { transfers: Transfer[] };
        setState({ kind: "ready", transfers: body.transfers });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: "error" });
      });
    return () => controller.abort();
  }, []);

  return state;
}
