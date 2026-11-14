import { Link, PAGES } from "../lib/router";

type HeaderProps = {
  currentPath: string;
};

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 sm:px-6">
        <Link to="/card" className="flex items-center gap-3 text-[1.35rem] font-extrabold tracking-tight text-forest no-underline">
          <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-bright text-base font-extrabold text-forest">
            DB
          </span>
          Demo Bank
        </Link>
        <nav aria-label="Main">
          <ul className="m-0 flex list-none gap-1.5 p-0">
            {PAGES.map((page) => {
              const current = currentPath === page.path;
              return (
                <li key={page.path}>
                  <Link
                    to={page.path}
                    current={current}
                    className={
                      "block rounded-full px-4 py-2 font-semibold no-underline transition-colors " +
                      (current ? "bg-bright text-forest" : "text-forest hover:bg-mint")
                    }
                  >
                    {page.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
