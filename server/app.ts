import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBalance } from "./balance";
import { OPENING_BALANCE_CENTS, TRANSFERS } from "./data";

export const PAGE_PATHS = ["/card", "/transfers", "/account"] as const;

export type AppOptions = {
  /** Folder holding the built client (index.html and assets/). */
  clientDir?: string;
};

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function createApp(options: AppOptions = {}) {
  const clientDir = options.clientDir ?? path.join(ROOT_DIR, "dist");
  const balance = createBalance(OPENING_BALANCE_CENTS);
  const app = express();
  app.disable("x-powered-by");

  app.get("/api/balance", (_req, res) => {
    res.json({ balance_cents: balance.readCents(), currency: "EUR", as_of: new Date().toISOString() });
  });

  app.get("/api/transfers", (_req, res) => {
    res.json({ transfers: TRANSFERS });
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
