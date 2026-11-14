import { TransferRow } from "./TransferRow";
import { useTransfers } from "./useTransfers";

export function TransfersPage() {
  const state = useTransfers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0">Transfers</h1>
      <section className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
        <table id="transfers-table" className="w-full border-collapse text-left">
          <caption className="px-6 pt-7 pb-3 text-left text-[1.5rem] font-extrabold tracking-tight text-forest">
            Recent transfers
          </caption>
          <thead className="max-sm:hidden">
            <tr className="border-b border-line text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
              <th scope="col" className="px-6 py-3 font-semibold">Date</th>
              <th scope="col" className="px-6 py-3 font-semibold">Recipient</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold">Amount</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="max-sm:block max-sm:px-6">
            {state.kind === "ready" &&
              state.transfers.map((transfer) => <TransferRow key={transfer.id} transfer={transfer} />)}
            {state.kind === "loading" && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-ink-soft">
                  Loading transfers…
                </td>
              </tr>
            )}
            {state.kind === "error" && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-forest">
                  Transfers could not be loaded. Please try again later.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
