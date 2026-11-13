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
    <div className="flex min-w-0 flex-col justify-center gap-2">
      <span className="text-lg font-semibold text-ink-soft">Balance</span>
      <span id="balance" className="text-[2.2rem] leading-tight font-bold text-ink tabular-nums">
        {cents === null ? "…" : formatEur(cents)}
      </span>
      <span className="text-ink-soft">
        Main account · EUR{updatedAt ? ` · updated ${timeOfDay(updatedAt)}` : ""}
      </span>
    </div>
  );
}
