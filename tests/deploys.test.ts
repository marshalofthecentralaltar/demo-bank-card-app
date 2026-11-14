import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "../server/app";
import { parseGitLog, type Deploy } from "../server/deploys";
import { routeLabel } from "../server/metrics";

const F = "\x1f";
const R = "\x1e";

describe("parseGitLog", () => {
  it("turns first-parent git log output into deploys, merges titled by their pull request", () => {
    const output =
      `bd6fd24440f1ee4a62dc549d925f08d531f8de9c${F}2026-11-14T11:32:05+02:00${F}Ralf${F}Merge pull request #28 from someone/wise-look${F}Restyle in the look of Wise\n\nLonger notes here.\n${R}\n` +
      `04431706c06e83063ea06a9b87e1bdc636d94173${F}2026-11-13T09:00:00+02:00${F}Ralf${F}Add tests for the pages${F}Also read the request path early.\nSecond line.\n\nCo-Authored-By: Someone <x@y.z>\n${R}\n` +
      `0e748ac7c4e36f62503750bafa231c15e8d95b62${F}2026-11-12T08:00:00+02:00${F}Ralf${F}Add request metrics${F}Co-Authored-By: Someone <x@y.z>\n${R}\n` +
      `1111111111111111111111111111111111111111${F}2026-11-11T08:00:00+02:00${F}Ralf${F}Merge pull request #3 from someone/empty${F}${R}\n`;

    expect(parseGitLog(output)).toEqual<Deploy[]>([
      {
        sha: "bd6fd24440f1ee4a62dc549d925f08d531f8de9c",
        date: "2026-11-14T11:32:05+02:00",
        author: "Ralf",
        title: "#28 Restyle in the look of Wise",
        description: "Longer notes here.",
      },
      {
        sha: "04431706c06e83063ea06a9b87e1bdc636d94173",
        date: "2026-11-13T09:00:00+02:00",
        author: "Ralf",
        title: "Add tests for the pages",
        description: "Also read the request path early.",
      },
      {
        sha: "0e748ac7c4e36f62503750bafa231c15e8d95b62",
        date: "2026-11-12T08:00:00+02:00",
        author: "Ralf",
        title: "Add request metrics",
        description: "Add request metrics",
      },
      {
        sha: "1111111111111111111111111111111111111111",
        date: "2026-11-11T08:00:00+02:00",
        author: "Ralf",
        title: "Merge pull request #3 from someone/empty",
        description: "Merge pull request #3 from someone/empty",
      },
    ]);
  });

  it("returns nothing for empty output", () => {
    expect(parseGitLog("")).toEqual([]);
    expect(parseGitLog("\n")).toEqual([]);
  });
});

async function start(readDeploys: () => Promise<Deploy[]>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "demo-bank-deploys-"));
  const app = createApp({ clientDir: dir, logFile: path.join(dir, "requests.log"), echoLog: false, readDeploys });
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  return { baseUrl: `http://127.0.0.1:${port}`, server };
}

describe("GET /api/deploys", () => {
  const sample: Deploy[] = [
    { sha: "a".repeat(40), date: "2026-11-14T11:32:05+02:00", author: "Ralf", title: "#28 Restyle", description: "Restyle" },
  ];

  it("answers the injected reader's deploys and counts them under their own route label", async () => {
    const { baseUrl, server } = await start(async () => sample);
    try {
      const response = await fetch(`${baseUrl}/api/deploys`);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(sample);
      const metrics = await (await fetch(`${baseUrl}/metrics`)).text();
      expect(metrics).toContain('http_requests_total{method="GET",path="/api/deploys",status="200"} 1');
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("answers 200 with [] when the reader fails", async () => {
    const { baseUrl, server } = await start(async () => {
      throw new Error("git missing");
    });
    try {
      const response = await fetch(`${baseUrl}/api/deploys`);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it("keeps the deploys routes out of the card and balance labels", () => {
    expect(routeLabel("/api/deploys")).toBe("/api/deploys");
    expect(routeLabel("/deploys")).toBe("/deploys");
  });
});
