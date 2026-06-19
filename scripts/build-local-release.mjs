import { spawnSync } from "node:child_process";

const steps = [
  ["npm", ["run", "app:assets"]],
  ["npm", ["run", "app:preflight"]],
  ["npm", ["run", "tauri:build"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
