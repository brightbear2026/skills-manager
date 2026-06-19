import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const cargoPath = await findCargo();
const cargoDir = path.dirname(cargoPath);
const child = spawn(cargoPath, ["tauri", ...args], {
  cwd: process.cwd(),
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${cargoDir}:${process.env.PATH || ""}`,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

async function findCargo() {
  if (process.env.CARGO) {
    await access(process.env.CARGO);
    return process.env.CARGO;
  }

  const homeCargo = path.join(process.env.HOME || "", ".cargo", "bin", "cargo");
  try {
    await access(homeCargo);
    return homeCargo;
  } catch {
    return "cargo";
  }
}
