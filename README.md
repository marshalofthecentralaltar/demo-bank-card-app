# Demo Bank card app

A stand-in product for a hackathon demo: three pages (card, transfers, account). Nothing here belongs to a real bank.

## Run

```sh
npm ci
npm run build   # client into dist/, server into dist-server/
npm start       # http://localhost:3000, or set PORT
```

`npm test` runs the tests and `npm run typecheck` checks types. `npm run dev` starts the Vite dev server and proxies `/api` to a server on port 3000.

## Pages

| Path | Folder | What it shows |
|---|---|---|
| `/card` | `src/pages/card/` | The card, the balance, the last four card payments |
| `/transfers` | `src/pages/transfers/` | The last six transfers |
| `/account` | `src/pages/account/` | The holder's details and the language setting |

Owners per page are in `.github/CODEOWNERS`.

## API

- `GET /api/balance`: `{ "balance_cents": 124050, "currency": "EUR", "as_of": "..." }`. Card payments settle continuously, so the balance moves by a few cents every second.
- `GET /api/transfers`: `{ "transfers": [...] }`, amounts as integer `amount_cents`, some with `fee_cents`. The stored data is in `server/data.ts`.

## Monitoring

- `GET /metrics` in Prometheus text format: counter `http_requests_total{method,path,status}` and histogram `http_request_duration_seconds{method,path}`. `path` is the route (`/card`, `/transfers`, `/account`, `/api/balance`, `/api/transfers`), static files are `/assets`. Requests to `/metrics` are not counted.
- Request log: one JSON line per request, appended to `logs/requests.log` and printed to stdout:

```json
{"time":"2026-11-14T09:30:00.000Z","level":"info","method":"GET","path":"/card","status":200,"ms":12}
```

`level` is `error` for 5xx, `warn` for 4xx, otherwise `info`.

`FAIL_PATH=/card npm start` makes GET `/card` answer 500. It exists for monitoring tests only.
