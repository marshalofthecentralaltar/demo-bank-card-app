import { formatAmount } from "./formatAmount";
import type { Transfer } from "./useTransfers";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function TransferRow({ transfer }: { transfer: Transfer }) {
  const arriving = transfer.status === "Arriving";

  return (
    <tr className="border-b border-line transition-colors last:border-b-0 hover:bg-mist/70 max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:gap-x-4 max-sm:py-4">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-soft max-sm:order-3 max-sm:p-0">{formatDate(transfer.date)}</td>
      <td className="px-6 py-4 font-semibold text-forest max-sm:order-1 max-sm:p-0">
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-sm font-bold text-forest"
          >
            {initials(transfer.recipient)}
          </span>
          {transfer.recipient}
        </span>
      </td>
      <td className="px-6 py-4 text-right tabular-nums max-sm:order-2 max-sm:p-0">
        <span className="block font-bold whitespace-nowrap text-forest">{formatAmount(transfer.amount_cents, transfer.currency)}</span>
        {transfer.fee_cents !== undefined && (
          <span className="block text-sm whitespace-nowrap text-ink-soft">fee {formatAmount(transfer.fee_cents, transfer.currency)}</span>
        )}
      </td>
      <td className="px-6 py-4 text-right max-sm:order-4 max-sm:p-0">
        <span
          className={
            "inline-block rounded-full px-3 py-1 text-sm font-semibold " +
            (arriving ? "bg-pending-bg text-pending" : "bg-done-bg text-done")
          }
        >
          {transfer.status}
        </span>
      </td>
    </tr>
  );
}
