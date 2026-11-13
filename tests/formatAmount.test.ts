import { describe, expect, it } from "vitest";
import { formatAmount } from "../src/pages/transfers/formatAmount";

describe("formatAmount", () => {
  it("shows cents with two digits", () => {
    expect(formatAmount(3875, "EUR")).toBe("38.75 EUR");
    expect(formatAmount(410, "EUR")).toBe("4.10 EUR");
    expect(formatAmount(12000, "EUR")).toBe("120.00 EUR");
  });

  it("puts a comma between thousands", () => {
    expect(formatAmount(125000, "EUR")).toBe("1,250.00 EUR");
    expect(formatAmount(1250075, "EUR")).toBe("12,500.75 EUR");
  });
});
