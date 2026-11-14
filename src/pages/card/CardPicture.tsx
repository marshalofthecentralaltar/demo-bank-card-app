export function CardPicture() {
  return (
    <div
      id="card-picture"
      role="img"
      aria-label="Demo Bank debit card ending in 4821, holder A. TAMM, expires 09/29"
      className="relative flex aspect-[1.586] w-full max-w-[420px] min-w-0 animate-fade-in flex-col justify-between overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#244d00] via-[#1a3a00] to-[#102600] p-6 text-white shadow-xl"
    >
      <div className="flex items-start justify-between">
        <span className="text-lg font-extrabold tracking-tight text-bright">Demo Bank</span>
        <span className="rounded-full bg-bright/15 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-bright">Debit</span>
      </div>
      <span
        aria-hidden="true"
        className="block h-10 w-13 rounded-lg border border-bright/60 bg-gradient-to-br from-[#d6f7bd] via-[#9fe870] to-[#6fc247]"
      />
      <span className="font-mono text-[1.35rem] tracking-[0.12em] whitespace-nowrap">•••• •••• •••• 4821</span>
      <div className="flex items-end justify-between text-base">
        <span>
          <span className="block text-sm uppercase tracking-wider text-bright/80">Card holder</span>
          <span className="font-semibold tracking-wider">A. TAMM</span>
        </span>
        <span className="text-right">
          <span className="block text-sm uppercase tracking-wider text-bright/80">Expires</span>
          <span className="font-semibold">09/29</span>
        </span>
      </div>
    </div>
  );
}
