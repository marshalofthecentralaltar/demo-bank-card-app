import { BalancePanel } from "./BalancePanel";
import { CardPicture } from "./CardPicture";
import { RecentPayments } from "./RecentPayments";
import { useLiveBalance } from "./useBalance";

/** How often the card page asks for the balance while it is open. */
const BALANCE_REFRESH_MS = 1000;

export function CardPage() {
  const balance = useLiveBalance(BALANCE_REFRESH_MS);

  const cardSummary = (
    <section
      aria-label="Card and balance"
      className="grid items-center gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[minmax(0,380px)_1fr]"
    >
      <CardPicture />
      <BalancePanel cents={balance.cents} updatedAt={balance.updatedAt} />
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 text-[2rem] font-bold">Your card</h1>
      {cardSummary}
      <RecentPayments />
    </div>
  );
}
