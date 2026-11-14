import { execFile } from "node:child_process";

export type Deploy = {
  sha: string;
  /** Commit time, ISO 8601 with offset (git %cI). */
  date: string;
  author: string;
  title: string;
  description: string;
};

export type DeployReader = () => Promise<Deploy[]>;

const FIELD = "\x1f";
const RECORD = "\x1e";
export const GIT_LOG_ARGS = ["log", "--first-parent", "-n", "30", `--format=%H${FIELD}%cI${FIELD}%an${FIELD}%s${FIELD}%b${RECORD}`];

const MERGE_PR = /^Merge pull request (#\d+) from \S+/;
const TRAILER = /^(co-authored-by|signed-off-by|claude-session):/i;

function bodyLines(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !TRAILER.test(line));
}

/** Parses `git log` output written with GIT_LOG_ARGS. Every first-parent commit on main is one deploy. */
export function parseGitLog(output: string): Deploy[] {
  const deploys: Deploy[] = [];
  for (const raw of output.split(RECORD)) {
    const record = raw.replace(/^\r?\n/, "");
    if (record.trim() === "") continue;
    const [sha = "", date = "", author = "", subject = "", body = ""] = record.split(FIELD);
    if (!sha) continue;
    const lines = bodyLines(body);
    const merge = MERGE_PR.exec(subject);
    let title: string;
    let description: string;
    if (merge) {
      const prTitle = lines[0] ?? subject;
      title = lines[0] ? `${merge[1]} ${prTitle}` : subject;
      description = lines[1] ?? prTitle;
    } else {
      title = subject;
      description = lines[0] ?? subject;
    }
    deploys.push({ sha: sha.trim(), date: date.trim(), author: author.trim(), title, description });
  }
  return deploys;
}

/** Reads deploy history from git in `cwd`. Resolves to [] when git is missing or the folder is not a repository. */
export function gitDeployReader(cwd: string): DeployReader {
  return () =>
    new Promise((resolve) => {
      execFile("git", GIT_LOG_ARGS, { cwd, timeout: 5000, maxBuffer: 1024 * 1024, windowsHide: true }, (error, stdout) => {
        if (error) return resolve([]);
        try {
          resolve(parseGitLog(String(stdout)));
        } catch {
          resolve([]);
        }
      });
    });
}
