import type { Transfer } from "./useTransfers";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`;
}

function amountText(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

export function TransferRow({ transfer }: { transfer: Transfer }) {
  const arriving = transfer.status === "Arriving";

  return (
    <tr className="border-b border-line last:border-b-0 max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:gap-x-4 max-sm:py-3">
      <td className="px-4 py-3 whitespace-nowrap text-ink-soft max-sm:order-3 max-sm:p-0">{formatDate(transfer.date)}</td>
      <td className="px-4 py-3 font-semibold max-sm:order-1 max-sm:p-0">{transfer.recipient}</td>
      <td className="px-4 py-3 text-right tabular-nums max-sm:order-2 max-sm:p-0">
        <span className="block font-semibold whitespace-nowrap">{amountText(transfer.amount_cents, transfer.currency)}</span>
        {transfer.fee_cents !== undefined && (
          <span className="block whitespace-nowrap text-ink-soft">fee {amountText(transfer.fee_cents, transfer.currency)}</span>
        )}
      </td>
      <td className="px-4 py-3 text-right max-sm:order-4 max-sm:p-0">
        <span
          className={
            "inline-block rounded-full px-3 py-0.5 font-semibold " +
            (arriving ? "bg-[#fdebd3] text-pending" : "bg-[#dcefe8] text-done")
          }
        >
          {transfer.status}
        </span>
      </td>
    </tr>
  );
}
