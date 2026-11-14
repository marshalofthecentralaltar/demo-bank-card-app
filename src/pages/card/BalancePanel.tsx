import { formatEur } from "../../lib/money";

type BalancePanelProps = {
  cents: number | null;
  updatedAt?: Date | null;
};

function timeOfDay(date: Date): string {
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":");
}

export function BalancePanel({ cents, updatedAt }: BalancePanelProps) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-3">
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">Balance</span>
      <span id="balance" className="text-[3rem] leading-none font-extrabold tracking-tight text-forest tabular-nums">
        {cents === null ? "…" : formatEur(cents)}
      </span>
      <span className="inline-flex w-fit items-center rounded-full bg-mint px-4 py-1.5 text-sm font-semibold text-forest">
        Main account · EUR{updatedAt ? ` · updated ${timeOfDay(updatedAt)}` : ""}
      </span>
    </div>
  );
}
