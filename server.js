const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawnSync } = require("child_process");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const next = require("next");

const rootDir = __dirname;
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

function newestMtime(targetPath) {
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

app.prepare().then(() => {
  http
    .createServer((request, response) => {
      handle(request, response);
    })
    .listen(port, hostname, () => {
      console.log(`Cobblemon tracking web is running on http://${hostname}:${port}`);
    });
});
