import { Counter, Histogram, Registry } from "prom-client";

export type Metrics = ReturnType<typeof createMetrics>;

export function createMetrics() {
  const registry = new Registry();

  const requests = new Counter({
    name: "http_requests_total",
    help: "HTTP requests answered, by method, route and status code.",
    labelNames: ["method", "path", "status"] as const,
    registers: [registry],
  });

  const duration = new Histogram({
    name: "http_request_duration_seconds",
    help: "Time taken to answer HTTP requests, by method and route.",
    labelNames: ["method", "path"] as const,
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [registry],
  });

  return {
    registry,
    observe(method: string, path: string, status: number, seconds: number) {
      requests.inc({ method, path, status: String(status) });
      duration.observe({ method, path }, seconds);
    },
  };
}

const KNOWN_ROUTES = new Set(["/", "/card", "/transfers", "/account", "/deploys", "/api/balance", "/api/transfers", "/api/deploys"]);

/** Maps a request path to a bounded route label, so the metric does not grow a series per URL. */
export function routeLabel(requestPath: string): string {
  if (KNOWN_ROUTES.has(requestPath)) return requestPath;
  if (requestPath.startsWith("/assets/")) return "/assets";
  return "other";
}
