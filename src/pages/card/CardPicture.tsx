export function CardPicture() {
  return (
    <div
      id="card-picture"
      role="img"
      aria-label="Demo Bank debit card ending in 4821, holder A. TAMM, expires 09/29"
      className="relative flex aspect-[1.586] w-full max-w-[380px] min-w-0 animate-fade-in flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#26346f] via-[#1b2552] to-[#0d1430] p-6 text-white shadow-xl"
    >
      <div className="flex items-start justify-between">
        <span className="text-lg font-bold tracking-wide">Demo Bank</span>
        <span className="text-base font-semibold uppercase tracking-widest">Debit</span>
      </div>
      <span
        aria-hidden="true"
        className="block h-10 w-13 rounded-md border border-[#8a6a1f] bg-gradient-to-br from-[#f3d98b] via-[#d9b25a] to-[#b48a35]"
      />
      <span className="font-mono text-[1.35rem] tracking-[0.12em] whitespace-nowrap">•••• •••• •••• 4821</span>
      <div className="flex items-end justify-between text-base">
        <span>
          <span className="block text-sm uppercase opacity-90">Card holder</span>
          <span className="font-semibold tracking-wider">A. TAMM</span>
        </span>
        <span className="text-right">
          <span className="block text-sm uppercase opacity-90">Expires</span>
          <span className="font-semibold">09/29</span>
        </span>
      </div>
    </div>
  );
}
