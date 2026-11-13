// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { CardPage } from "../src/pages/card/CardPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("refreshes the balance while the card page is open", async () => {
  const balances = [124050, 124047];
  let calls = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      const cents = balances[Math.min(calls, balances.length - 1)];
      calls += 1;
      return new Response(JSON.stringify({ balance_cents: cents, currency: "EUR", as_of: new Date().toISOString() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );

  render(<CardPage />);
  await waitFor(() => expect(document.getElementById("balance")?.textContent).toBe("1,240.50 EUR"));
  await waitFor(() => expect(document.getElementById("balance")?.textContent).toBe("1,240.47 EUR"), { timeout: 2500 });
  expect(document.querySelectorAll("#card-picture")).toHaveLength(1);
});
