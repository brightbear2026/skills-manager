import {
  checkServiceHealth,
  getServiceConfig,
  getServiceStatus,
  renderLaunchAgentPlist,
  writeLaunchAgentPlist,
} from "./serviceStore.mjs";
import { ensureServiceReady, resolveAppShellLaunch } from "./appShellStore.mjs";
import { buildAppResourceManifest, stageAppResources } from "./appBundleStore.mjs";
import { checkAppPackagingReadiness } from "./appPreflightStore.mjs";
import { checkAppSigningReadiness } from "./appSigningStore.mjs";
import { buildLocalExport, writeLocalExport } from "./exportStore.mjs";

const command = process.argv[2] || "help";

if (command === "health") {
  const result = await checkServiceHealth(parseOptions(process.argv.slice(3)));
  writeJson(result);
  process.exit(result.running ? 0 : 1);
}

if (command === "service:config") {
  writeJson(getServiceConfig(parseOptions(process.argv.slice(3))));
  process.exit(0);
}

if (command === "service:status") {
  writeJson(await getServiceStatus(parseOptions(process.argv.slice(3))));
  process.exit(0);
}

if (command === "app:launch-plan") {
  writeJson(await resolveAppShellLaunch(parseOptions(process.argv.slice(3))));
  process.exit(0);
}

if (command === "app:ensure-ready") {
  const options = parseOptions(process.argv.slice(3));
  const result = await ensureServiceReady({
    ...options,
    detached: options.detached !== false,
  });
  writeJson(result);
  process.exit(result.ready ? 0 : result.action === "choose-port" ? 2 : 1);
}

if (command === "app:resource-manifest") {
  writeJson(buildAppResourceManifest(parseOptions(process.argv.slice(3))));
  process.exit(0);
}

if (command === "app:stage-resources") {
  writeJson(await stageAppResources(parseOptions(process.argv.slice(3))));
  process.exit(0);
}

if (command === "app:preflight") {
  const result = await checkAppPackagingReadiness(parseOptions(process.argv.slice(3)));
  writeJson(result);
  process.exit(result.ready ? 0 : 1);
}

if (command === "app:signing-preflight") {
  const result = await checkAppSigningReadiness(parseOptions(process.argv.slice(3)));
  writeJson(result);
  process.exit(result.ready ? 0 : 1);
}

if (command === "service:plist") {
  const options = parseOptions(process.argv.slice(3));
  if (options.print) {
    process.stdout.write(renderLaunchAgentPlist(getServiceConfig(options)));
    process.exit(0);
  }
  writeJson(await writeLaunchAgentPlist(options));
  process.exit(0);
}

if (command === "export") {
  const options = parseOptions(process.argv.slice(3));
  if (options.targetPath) {
    writeJson(await writeLocalExport(options));
  } else {
    writeJson(await buildLocalExport(options));
  }
  process.exit(0);
}

printHelp();
process.exit(command === "help" ? 0 : 1);

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--print") {
      options.print = true;
      continue;
    }
    if (arg === "--no-start") {
      options.start = false;
      continue;
    }
    if (arg === "--foreground") {
      options.detached = false;
      continue;
    }
    if (arg === "--timeout") {
      options.timeoutMs = Number(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--health-timeout") {
      options.healthTimeoutMs = Number(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--interval") {
      options.intervalMs = Number(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--port") {
      options.port = Number(args[index + 1]);
      index += 1;
      continue;
    }
    if (arg === "--url") {
      options.url = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--output") {
      options.targetPath = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--label") {
      options.label = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--project-root") {
      options.projectRoot = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--server-path") {
      options.serverPath = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--public-dir") {
      options.publicDir = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--resource-root") {
      options.resourceRoot = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--signing-identity") {
      options.signingIdentity = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--keychain-profile") {
      options.keychainProfile = args[index + 1];
      index += 1;
      continue;
    }
  }
  return options;
}

function writeJson(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function printHelp() {
  process.stdout.write(`Skills Manager CLI

Usage:
  node src/cli.mjs health [--url http://127.0.0.1:5173/api/health]
  node src/cli.mjs service:status [--port 5173]
  node src/cli.mjs app:launch-plan [--port 5173]
  node src/cli.mjs app:ensure-ready [--port 5173] [--no-start] [--timeout 5000]
  node src/cli.mjs app:resource-manifest [--resource-root ./]
  node src/cli.mjs app:stage-resources [--output ./.skillsmanger-cache/app-resources]
  node src/cli.mjs app:preflight
  node src/cli.mjs app:signing-preflight [--signing-identity "Developer ID Application: ..."] [--keychain-profile profile]
  node src/cli.mjs service:config [--port 5173]
  node src/cli.mjs service:plist [--output ./com.skillsmanager.local.plist]
  node src/cli.mjs service:plist --print
  node src/cli.mjs export [--output ./skillsmanager-local-export.json]

The plist command writes a launchd-ready file into the Skills Manager home by default.
It does not install or load the LaunchAgent automatically.
The service:status command is app-shell friendly and can return open, start, or choose-port.
The app:launch-plan command returns the next app-shell action and service start command.
The app:ensure-ready command starts the service when needed and waits for health.
The app:resource-manifest command describes the files the native app must bundle.
The app:stage-resources command copies those files into a staging directory.
The app:preflight command checks Node, Rust/Cargo, Tauri CLI, and staged resources.
The app:signing-preflight command checks codesign, Developer ID, notarytool, and notarization credentials.
The export command produces a local diagnostics snapshot and never includes secret values.
`);
}
