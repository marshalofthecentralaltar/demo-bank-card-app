export type CardPayment = {
  id: string;
  shop: string;
  date: string;
  amount_cents: number;
};

/** The last four card payments, newest first. */
export const RECENT_CARD_PAYMENTS: CardPayment[] = [
  { id: "cp_4004", shop: "Kalamaja Bakery", date: "12 Nov 2026", amount_cents: 685 },
  { id: "cp_4003", shop: "Northline Groceries", date: "11 Nov 2026", amount_cents: 4312 },
  { id: "cp_4002", shop: "City Bike Rental", date: "9 Nov 2026", amount_cents: 1200 },
  { id: "cp_4001", shop: "Harbour Books", date: "6 Nov 2026", amount_cents: 2399 },
];
