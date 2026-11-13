// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { CardPage } from "../src/pages/card/CardPage";
import { TransfersPage } from "../src/pages/transfers/TransfersPage";
import { AccountPage } from "../src/pages/account/AccountPage";
import { TRANSFERS } from "../server/data";

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/api/balance")) {
        return jsonResponse({ balance_cents: 124050, currency: "EUR", as_of: "2026-11-14T09:30:00.000Z" });
      }
      if (url.endsWith("/api/transfers")) return jsonResponse({ transfers: TRANSFERS });
      return new Response("Not found", { status: 404 });
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("card page", () => {
  it("renders the card picture and the balance", async () => {
    render(<CardPage />);
    expect(document.querySelectorAll("#card-picture")).toHaveLength(1);
    expect(document.querySelectorAll("#balance")).toHaveLength(1);
    expect(screen.getByText("•••• •••• •••• 4821")).toBeTruthy();
    await waitFor(() => expect(document.getElementById("balance")?.textContent).toBe("1,240.50 EUR"));
  });

  it("lists the last four card payments", () => {
    render(<CardPage />);
    const list = screen.getByRole("list");
    expect(list.querySelectorAll("li")).toHaveLength(4);
  });
});

describe("transfers page", () => {
  it("renders the transfers table with one row per stored transfer", async () => {
    render(<TransfersPage />);
    expect(document.querySelectorAll("#transfers-table")).toHaveLength(1);
    await waitFor(() => expect(screen.getByText("Mari K.")).toBeTruthy());
    const rows = document.querySelectorAll("#transfers-table tbody tr");
    expect(rows).toHaveLength(TRANSFERS.length);
    expect(rows[0]?.textContent).toContain("Arriving");
  });
});

describe("account page", () => {
  it("renders the account holder's name", () => {
    render(<AccountPage />);
    expect(document.querySelectorAll("#account-name")).toHaveLength(1);
    expect(document.getElementById("account-name")?.textContent).toBe("Anneli Tamm");
  });
});
