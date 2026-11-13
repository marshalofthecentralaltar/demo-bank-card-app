import { Link, PAGES } from "../lib/router";

type HeaderProps = {
  currentPath: string;
};

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="border-b border-line bg-brand-deep text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-4">
        <Link to="/card" className="flex items-center gap-3 text-[1.35rem] font-bold tracking-tight text-white no-underline">
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-lg bg-white text-base font-extrabold text-brand-deep">
            DB
          </span>
          Demo Bank
        </Link>
        <nav aria-label="Main">
          <ul className="m-0 flex list-none gap-1 p-0">
            {PAGES.map((page) => {
              const current = currentPath === page.path;
              return (
                <li key={page.path}>
                  <Link
                    to={page.path}
                    current={current}
                    className={
                      "block rounded-md px-3 py-1.5 font-semibold no-underline " +
                      (current ? "bg-white text-brand-deep" : "text-white hover:bg-white/15")
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
