import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { getServiceConfig } from "./serviceStore.mjs";

const execFileAsync = promisify(execFile);

export async function checkAppPackagingReadiness(options = {}) {
  const config = getServiceConfig(options);
  const stagedResourcesDir = path.resolve(
    options.stagedResourcesDir ||
      options.outputDir ||
      path.join(config.projectRoot, ".skillsmanger-cache", "app-resources"),
  );
  const checks = [
    checkNodeVersion(options),
    ...(isMacOs(options)
      ? [
          await checkCommand("xcode-select", ["-p"], {
            ...options,
            label: "Xcode Command Line Tools",
            installHint: "Install Xcode Command Line Tools with xcode-select --install.",
          }),
        ]
      : []),
    await checkCommand("cargo", ["--version"], {
      ...options,
      label: "Rust Cargo",
      installHint: "Install Rust/Cargo before running the Tauri shell.",
    }),
    await checkCommand("cargo", ["tauri", "--version"], {
      ...options,
      label: "Tauri CLI",
      installHint: "Install the Tauri CLI after Rust/Cargo is available.",
    }),
    await checkStagedResources(stagedResourcesDir),
  ];

  return {
    ready: checks.every((check) => check.ok),
    checks,
    stagedResourcesDir,
    nextActions: checks.filter((check) => !check.ok).map((check) => check.nextAction),
  };
}

function isMacOs(options = {}) {
  return String(options.platform || process.platform) === "darwin";
}

function checkNodeVersion(options = {}) {
  const version = String(options.nodeVersion || process.versions.node);
  const major = Number(version.split(".")[0]);
  const ok = major >= 20;

  return {
    id: "node",
    label: "Node.js",
    ok,
    version,
    requirement: ">=20",
    nextAction: ok ? null : "Install Node.js 20 or newer.",
  };
}

async function checkCommand(command, args, options = {}) {
  const runCommand = options.commandRunner || defaultCommandRunner;
  try {
    const result = await runCommand(command, args);
    return {
      id: command === "cargo" && args[0] === "tauri" ? "tauri-cli" : command,
      label: options.label,
      ok: true,
      command: [command, ...args].join(" "),
      version: String(result.stdout || result.stderr || "").trim(),
      nextAction: null,
    };
  } catch (error) {
    return {
      id: command === "cargo" && args[0] === "tauri" ? "tauri-cli" : command,
      label: options.label,
      ok: false,
      command: [command, ...args].join(" "),
      error: error instanceof Error ? error.message : String(error),
      nextAction: options.installHint,
    };
  }
}

async function checkStagedResources(stagedResourcesDir) {
  const required = [
    "src/server.mjs",
    "public/index.html",
    "package.json",
    "skillsmanager-resource-manifest.json",
  ];
  const missing = [];

  for (const relativePath of required) {
    try {
      await access(path.join(stagedResourcesDir, relativePath));
    } catch {
      missing.push(relativePath);
    }
  }

  return {
    id: "staged-resources",
    label: "Staged app resources",
    ok: missing.length === 0,
    path: stagedResourcesDir,
    missing,
    nextAction: missing.length === 0 ? null : "Run npm run app:stage-resources.",
  };
}

async function defaultCommandRunner(command, args) {
  return execFileAsync(await resolveCommand(command), args);
}

async function resolveCommand(command) {
  if (command !== "cargo") return command;
  if (process.env.CARGO) {
    await access(process.env.CARGO);
    return process.env.CARGO;
  }

  const homeCargo = path.join(process.env.HOME || "", ".cargo", "bin", "cargo");
  try {
    await access(homeCargo);
    return homeCargo;
  } catch {
    return command;
  }
}
