import { BalancePanel } from "./BalancePanel";
import { CardPicture } from "./CardPicture";
import { RecentPayments } from "./RecentPayments";
import { useBalance } from "./useBalance";

export function CardPage() {
  const balanceCents = useBalance();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="m-0 text-[2rem] font-bold">Your card</h1>
      <section
        aria-label="Card and balance"
        className="grid items-center gap-8 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[minmax(0,380px)_1fr]"
      >
        <CardPicture />
        <BalancePanel cents={balanceCents} />
      </section>
      <RecentPayments />
    </div>
  );
}
