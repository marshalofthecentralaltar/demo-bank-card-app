import { TransferRow } from "./TransferRow";
import { useTransfers } from "./useTransfers";

export function TransfersPage() {
  const state = useTransfers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 text-[2rem] font-bold">Transfers</h1>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table id="transfers-table" className="w-full border-collapse text-left">
          <caption className="px-4 pt-5 pb-2 text-left text-[1.3rem] font-bold">Recent transfers</caption>
          <thead className="max-sm:hidden">
            <tr className="border-b-2 border-line text-ink-soft">
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold">Recipient</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Amount</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="max-sm:block max-sm:px-4">
            {state.kind === "ready" &&
              state.transfers.map((transfer) => <TransferRow key={transfer.id} transfer={transfer} />)}
            {state.kind === "loading" && (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-ink-soft">Loading transfers…</td>
              </tr>
            )}
            {state.kind === "error" && (
              <tr>
                <td colSpan={4} className="px-4 py-3">Transfers could not be loaded. Please try again later.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
