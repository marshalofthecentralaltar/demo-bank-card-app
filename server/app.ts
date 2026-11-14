import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBalance } from "./balance";
import { gitDeployReader, type DeployReader } from "./deploys";
import { OPENING_BALANCE_CENTS, TRANSFERS } from "./data";
import { createMetrics, routeLabel } from "./metrics";
import { createRequestLog } from "./requestLog";

export const PAGE_PATHS = ["/card", "/transfers", "/account", "/deploys"] as const;

export type AppOptions = {
  /** Folder holding the built client (index.html and assets/). */
  clientDir?: string;
  /** Where request log lines are appended. Defaults to logs/requests.log in the repository root. */
  logFile?: string;
  /** Also print each request log line to stdout. Defaults to true. */
  echoLog?: boolean;
  /**
   * Test helper for monitoring tests only, never set on the demo path:
   * a GET on this path answers 500. The server reads it from env FAIL_PATH.
   */
  failPath?: string;
  /** Reads the deploy history for /api/deploys. Defaults to `git log --first-parent` in the repository root. */
  readDeploys?: DeployReader;
};

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function createApp(options: AppOptions = {}) {
  const clientDir = options.clientDir ?? path.join(ROOT_DIR, "dist");
  const balance = createBalance(OPENING_BALANCE_CENTS);
  const metrics = createMetrics();
  const readDeploys = options.readDeploys ?? gitDeployReader(ROOT_DIR);
  const requestLog = createRequestLog(
    options.logFile ?? path.join(ROOT_DIR, "logs", "requests.log"),
    options.echoLog === false ? () => {} : undefined,
  );
  const app = express();
  app.disable("x-powered-by");

  // One metric sample and one log line per request. Scrapes of /metrics are left out of both.
  app.use((req, res, next) => {
    if (req.path === "/metrics") return next();
    // Read the path now: routers mounted under a prefix (like /assets) rewrite req.url while they run.
    const requestPath = req.path;
    const started = process.hrtime.bigint();
    res.on("finish", () => {
      const seconds = Number(process.hrtime.bigint() - started) / 1e9;
      metrics.observe(req.method, routeLabel(requestPath), res.statusCode, seconds);
      requestLog.write({
        time: new Date().toISOString(),
        method: req.method,
        path: requestPath,
        status: res.statusCode,
        ms: Math.round(seconds * 1000),
      });
    });
    next();
  });

  app.get("/metrics", async (_req, res) => {
    res.type(metrics.registry.contentType).send(await metrics.registry.metrics());
  });

  // Monitoring tests only (see AppOptions.failPath).
  if (options.failPath) {
    app.get(options.failPath, (_req, res) => {
      res.status(500).type("text/plain").send("Internal Server Error");
    });
  }

  app.get("/api/balance", (_req, res) => {
    res.json({ balance_cents: balance.readCents(), currency: "EUR", as_of: new Date().toISOString() });
  });

  app.get("/api/transfers", (_req, res) => {
    res.json({ transfers: TRANSFERS });
  });

  app.get("/api/deploys", async (_req, res) => {
    let deploys: Awaited<ReturnType<DeployReader>> = [];
    try {
      deploys = await readDeploys();
    } catch {
      deploys = [];
    }
    res.json(deploys);
  });

  app.use("/assets", express.static(path.join(clientDir, "assets"), { immutable: true, maxAge: "1y" }));

  app.get("/", (_req, res) => {
    res.redirect(302, "/card");
  });

  for (const pagePath of PAGE_PATHS) {
    app.get(pagePath, (_req, res) => {
      res.sendFile(path.join(clientDir, "index.html"));
    });
  }

  return app;
}
