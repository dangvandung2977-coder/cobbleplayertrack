import { spawn } from "node:child_process";

const port = process.env.PORT || process.env.SERVER_PORT || "3000";
const hostname = process.env.HOST || "0.0.0.0";

const child = spawn(process.execPath, ["server.js"], {
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname,
  },
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
