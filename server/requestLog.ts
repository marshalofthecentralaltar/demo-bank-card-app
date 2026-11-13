import fs from "node:fs";
import path from "node:path";

export type LogLevel = "info" | "warn" | "error";

export type RequestLogLine = {
  time: string;
  level: LogLevel;
  method: string;
  path: string;
  status: number;
  ms: number;
};

export function levelFor(status: number): LogLevel {
  if (status >= 500) return "error";
  if (status >= 400) return "warn";
  return "info";
}

export function createRequestLog(filePath: string, echo: (line: string) => void = (line) => process.stdout.write(line)) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  return {
    filePath,
    write(entry: Omit<RequestLogLine, "level">) {
      const line: RequestLogLine = {
        time: entry.time,
        level: levelFor(entry.status),
        method: entry.method,
        path: entry.path,
        status: entry.status,
        ms: entry.ms,
      };
      const text = `${JSON.stringify(line)}\n`;
      fs.appendFileSync(filePath, text);
      echo(text);
    },
  };
}
