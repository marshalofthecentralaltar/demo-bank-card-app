export type TransferStatus = "Sent" | "Arriving";

export type Transfer = {
  id: string;
  date: string;
  recipient: string;
  amount_cents: number;
  fee_cents?: number;
  currency: "EUR";
  status: TransferStatus;
};

/** Opening balance of the demo account, in cents. */
export const OPENING_BALANCE_CENTS = 124050;

/** The six most recent outgoing transfers, newest first. Amounts are stored in cents. */
export const TRANSFERS: Transfer[] = [
  { id: "tr_1006", date: "2026-11-12", recipient: "Mari K.", amount_cents: 12000, currency: "EUR", status: "Arriving" },
  { id: "tr_1005", date: "2026-11-11", recipient: "Jaan P.", amount_cents: 125000, fee_cents: 410, currency: "EUR", status: "Sent" },
  { id: "tr_1004", date: "2026-11-09", recipient: "Liis T.", amount_cents: 3875, currency: "EUR", status: "Sent" },
  { id: "tr_1003", date: "2026-11-07", recipient: "Karl M.", amount_cents: 204000, fee_cents: 620, currency: "EUR", status: "Sent" },
  { id: "tr_1002", date: "2026-11-05", recipient: "Kadri S.", amount_cents: 6420, currency: "EUR", status: "Sent" },
  { id: "tr_1001", date: "2026-11-03", recipient: "Peeter V.", amount_cents: 31500, fee_cents: 150, currency: "EUR", status: "Sent" },
];
