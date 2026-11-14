import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

export type PagePath = "/card" | "/transfers" | "/account" | "/deploys";

export const PAGES: { path: PagePath; label: string }[] = [
  { path: "/card", label: "Card" },
  { path: "/transfers", label: "Transfers" },
  { path: "/account", label: "Account" },
  { path: "/deploys", label: "Deploys" },
];

const NAVIGATE_EVENT = "demobank:navigate";

export function usePath(): string {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    window.addEventListener(NAVIGATE_EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener(NAVIGATE_EVENT, update);
    };
  }, []);

  return path;
}

export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState(null, "", to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.scrollTo(0, 0);
}

type LinkProps = {
  to: string;
  className?: string;
  current?: boolean;
  children: ReactNode;
};

export function Link({ to, className, current, children }: LinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={onClick} className={className} aria-current={current ? "page" : undefined}>
      {children}
    </a>
  );
}
