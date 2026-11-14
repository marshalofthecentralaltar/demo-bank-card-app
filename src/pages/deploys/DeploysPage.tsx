import { useEffect, useState } from "react";

type Deploy = {
  sha: string;
  date: string;
  author: string;
  title: string;
  description: string;
};

/** "14 Nov 2026, 11:32" in the viewer's local time. */
export function formatDeployDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${day}, ${time}`;
}

export function DeploysPage() {
  const [deploys, setDeploys] = useState<Deploy[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/deploys")
      .then((response) => (response.ok ? response.json() : []))
      .then((body: unknown) => {
        if (!cancelled) setDeploys(Array.isArray(body) ? (body as Deploy[]) : []);
      })
      .catch(() => {
        if (!cancelled) setDeploys([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0">Deploys</h1>
        <p className="mt-2 mb-0 text-ink-soft">Every merge to main is a deploy. Newest first.</p>
      </div>
      <section aria-label="Deploy history" className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8">
        {deploys === null ? (
          <p className="m-0 text-ink-soft">Loading deploy history...</p>
        ) : deploys.length === 0 ? (
          <p className="m-0 text-ink-soft">No deploy history found</p>
        ) : (
          <ol className="m-0 list-none p-0">
            {deploys.map((deploy) => (
              <li
                key={deploy.sha}
                className="grid gap-1 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[11rem_5.5rem_1fr] sm:gap-6"
              >
                <time dateTime={deploy.date} className="text-sm font-semibold text-ink-soft">
                  {formatDeployDate(deploy.date)}
                </time>
                <code className="text-sm text-ink-soft">{deploy.sha.slice(0, 7)}</code>
                <div className="min-w-0">
                  <div className="font-semibold break-words text-forest">{deploy.title}</div>
                  <div className="text-sm break-words text-ink-soft">{deploy.description}</div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
