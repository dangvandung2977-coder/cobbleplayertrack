import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import next from "next";

if (!process.env.NODE_ENV) {
  Object.assign(process.env, { NODE_ENV: "production" });
}

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || process.env.SERVER_PORT || 3000);
const hostname = process.env.HOST || "0.0.0.0";

const buildIdPath = path.join(rootDir, ".next", "BUILD_ID");
const watchedPaths = [
  "src",
  "next.config.ts",
  "package.json",
  "package-lock.json",
  "postcss.config.mjs",
  "tsconfig.json",
];

function newestMtime(targetPath: string): number {
  if (!fs.existsSync(targetPath)) {
    return 0;
  }

  const stats = fs.statSync(targetPath);
  if (!stats.isDirectory()) {
    return stats.mtimeMs;
  }

  let newest = stats.mtimeMs;
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    const entryPath = path.join(targetPath, entry.name);
    const entryMtime = newestMtime(entryPath);
    if (entryMtime > newest) {
      newest = entryMtime;
    }
  }

  return newest;
}

function needsBuild() {
  if (!fs.existsSync(buildIdPath)) {
    return true;
  }

  const buildMtime = fs.statSync(buildIdPath).mtimeMs;
  return watchedPaths.some((relativePath) => {
    const targetPath = path.join(rootDir, relativePath);
    return newestMtime(targetPath) > buildMtime;
  });
}

function runBuildIfNeeded() {
  if (!needsBuild()) {
    console.log("Next.js build is up to date.");
    return;
  }

  console.log("Building Next.js app before startup...");
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["run", "build"], {
    cwd: rootDir,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

runBuildIfNeeded();

const app = next({
  dev: false,
  dir: rootDir,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((request: IncomingMessage, response: ServerResponse) => {
        handle(request, response);
      })
      .listen(port, hostname, () => {
        console.log(`Cobblemon tracking web is running on http://${hostname}:${port}`);
      });
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
