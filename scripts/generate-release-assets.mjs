import { spawnSync } from "node:child_process";

const steps = [
  ["node", ["scripts/generate-app-icon.mjs", "src-tauri/icons/icon.png"]],
  ["node", ["src/tauriRunner.mjs", "icon", "src-tauri/icons/icon.png"]],
  ["node", ["scripts/generate-dmg-background.mjs", "src-tauri/assets/dmg-background.png"]],
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
