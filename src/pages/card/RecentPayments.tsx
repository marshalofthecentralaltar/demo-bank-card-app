import { formatEur } from "../../lib/money";
import { RECENT_CARD_PAYMENTS } from "./payments";

export function RecentPayments() {
  return (
    <section aria-labelledby="payments-heading" className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 id="payments-heading" className="mt-0 mb-3 text-[1.3rem] font-bold">
        Recent card payments
      </h2>
      <ul className="m-0 list-none divide-y divide-line p-0">
        {RECENT_CARD_PAYMENTS.map((payment) => (
          <li key={payment.id} className="flex items-center justify-between gap-4 py-3">
            <span className="min-w-0">
              <span className="block font-semibold">{payment.shop}</span>
              <span className="block text-ink-soft">{payment.date}</span>
            </span>
            <span className="font-semibold whitespace-nowrap tabular-nums">−{formatEur(payment.amount_cents)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
