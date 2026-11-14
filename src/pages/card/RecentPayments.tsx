import { formatEur } from "../../lib/money";
import { RECENT_CARD_PAYMENTS } from "./payments";

export function RecentPayments() {
  return (
    <section aria-labelledby="payments-heading" className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-7">
      <h2 id="payments-heading" className="mt-0 mb-1 text-[1.5rem] font-extrabold tracking-tight text-forest">
        Recent card payments
      </h2>
      <ul className="m-0 list-none p-0">
        {RECENT_CARD_PAYMENTS.map((payment) => (
          <li key={payment.id} className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-base font-bold text-forest"
            >
              {payment.shop.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-forest">{payment.shop}</span>
              <span className="block text-sm text-ink-soft">{payment.date}</span>
            </span>
            <span className="font-bold whitespace-nowrap text-forest tabular-nums">−{formatEur(payment.amount_cents)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
