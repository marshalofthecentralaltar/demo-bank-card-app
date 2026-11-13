import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "../server/app";
import { TRANSFERS } from "../server/data";

type Running = { baseUrl: string; server: Server; logFile: string };

async function start(options: { failPath?: string } = {}): Promise<Running> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demo-bank-"));
  const clientDir = path.join(dir, "client");
  fs.mkdirSync(path.join(clientDir, "assets"), { recursive: true });
  fs.writeFileSync(path.join(clientDir, "index.html"), "<!doctype html><title>Demo Bank</title><div id=root></div>");
  fs.writeFileSync(path.join(clientDir, "assets", "app.js"), "console.log('ok')");
  const logFile = path.join(dir, "logs", "requests.log");
  const app = createApp({ clientDir, logFile, failPath: options.failPath, echoLog: false });
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  return { baseUrl: `http://127.0.0.1:${port}`, server, logFile };
}

function stop(running: Running) {
  return new Promise<void>((resolve) => running.server.close(() => resolve()));
}

function logLines(running: Running) {
  return fs
    .readFileSync(running.logFile, "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

/** Reads one counter sample from Prometheus text, or 0 when the series does not exist yet. */
function counterValue(metricsText: string, labels: string): number {
  const line = metricsText.split("\n").find((l) => l.startsWith(`http_requests_total{${labels}}`));
  return line ? Number(line.split(" ").pop()) : 0;
}

describe("server", () => {
  let running: Running;
  beforeAll(async () => {
    running = await start();
  });
  afterAll(() => stop(running));

  it("answers each page with the app", async () => {
    for (const page of ["/card", "/transfers", "/account"]) {
      const response = await fetch(`${running.baseUrl}${page}`);
      expect(response.status).toBe(200);
      expect(await response.text()).toContain('<div id=root>');
    }
  });

  it("returns the stored transfers with integer cents", async () => {
    const response = await fetch(`${running.baseUrl}/api/transfers`);
    const body = (await response.json()) as { transfers: typeof TRANSFERS };
    expect(body.transfers).toEqual(TRANSFERS);
    expect(body.transfers).toHaveLength(6);
    for (const transfer of body.transfers) expect(Number.isInteger(transfer.amount_cents)).toBe(true);
  });

  it("returns the balance in cents", async () => {
    const response = await fetch(`${running.baseUrl}/api/balance`);
    const body = (await response.json()) as { balance_cents: number; currency: string };
    expect(Number.isInteger(body.balance_cents)).toBe(true);
    expect(Math.abs(body.balance_cents - 124050)).toBeLessThan(100);
    expect(body.currency).toBe("EUR");
  });

  it("counts a request in /metrics and leaves /metrics itself out", async () => {
    const before = await (await fetch(`${running.baseUrl}/metrics`)).text();
    await fetch(`${running.baseUrl}/card`);
    await fetch(`${running.baseUrl}/assets/app.js`);
    const after = await (await fetch(`${running.baseUrl}/metrics`)).text();

    expect(counterValue(after, 'method="GET",path="/card",status="200"')).toBe(
      counterValue(before, 'method="GET",path="/card",status="200"') + 1,
    );
    expect(counterValue(after, 'method="GET",path="/assets",status="200"')).toBeGreaterThanOrEqual(1);
    expect(after).toContain('http_request_duration_seconds_bucket{le="0.005",method="GET",path="/card"}');
    expect(after).not.toContain('path="/metrics"');
  });

  it("writes one log line per request in the contract's shape", async () => {
    await fetch(`${running.baseUrl}/transfers`);
    await fetch(`${running.baseUrl}/no-such-page`);
    const lines = logLines(running);
    const [page, missing] = lines.slice(-2);

    expect(Object.keys(page ?? {})).toEqual(["time", "level", "method", "path", "status", "ms"]);
    expect(page).toMatchObject({ level: "info", method: "GET", path: "/transfers", status: 200 });
    expect(new Date(String(page?.time)).toISOString()).toBe(page?.time);
    expect(Number.isInteger(page?.ms)).toBe(true);
    expect(missing).toMatchObject({ level: "warn", path: "/no-such-page", status: 404 });
  });
});

describe("FAIL_PATH test helper", () => {
  it("answers 500 on the configured path, counts it and logs it as an error", async () => {
    const running = await start({ failPath: "/card" });
    try {
      const response = await fetch(`${running.baseUrl}/card`);
      expect(response.status).toBe(500);
      const metrics = await (await fetch(`${running.baseUrl}/metrics`)).text();
      expect(counterValue(metrics, 'method="GET",path="/card",status="500"')).toBe(1);
      expect(logLines(running).at(-1)).toMatchObject({ level: "error", path: "/card", status: 500 });
    } finally {
      await stop(running);
    }
  });
});
