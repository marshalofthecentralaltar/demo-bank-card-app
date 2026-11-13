import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3000);

// FAIL_PATH exists for monitoring tests only: with FAIL_PATH=/card, GET /card answers 500.
const failPath = process.env.FAIL_PATH || undefined;

createApp({ failPath }).listen(port, () => {
  console.log(`Demo Bank listening on http://localhost:${port}${failPath ? ` (FAIL_PATH=${failPath})` : ""}`);
});
