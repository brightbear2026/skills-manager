import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function checkAppSigningReadiness(options = {}) {
  const checks = [];

  if (String(options.platform || process.platform) !== "darwin") {
    return {
      ready: false,
      checks: [
        {
          id: "platform",
          label: "macOS",
          ok: false,
          nextAction: "Run signing and notarization checks on macOS.",
        },
      ],
      nextActions: ["Run signing and notarization checks on macOS."],
    };
  }

  checks.push(
    await checkCommand("xcrun", ["--find", "codesign"], {
      ...options,
      id: "codesign",
      label: "codesign",
      installHint: "Install Xcode Command Line Tools.",
    }),
  );
  checks.push(await checkDeveloperIdIdentity(options));
  checks.push(
    await checkCommand("xcrun", ["notarytool", "--version"], {
      ...options,
      id: "notarytool",
      label: "notarytool",
      installHint: "Install or update Xcode Command Line Tools so xcrun notarytool is available.",
    }),
  );
  checks.push(checkNotaryCredentials(options));

  return {
    ready: checks.every((check) => check.ok),
    checks,
    nextActions: checks.filter((check) => !check.ok).map((check) => check.nextAction),
  };
}

async function checkDeveloperIdIdentity(options = {}) {
  const runCommand = options.commandRunner || defaultCommandRunner;
  const requestedIdentity = String(options.signingIdentity || process.env.APPLE_SIGNING_IDENTITY || "").trim();

  try {
    const result = await runCommand("security", ["find-identity", "-v", "-p", "codesigning"]);
    const output = String(result.stdout || result.stderr || "");
    const identities = parseCodeSigningIdentities(output);
    const developerIdIdentities = identities.filter((identity) =>
      identity.name.includes("Developer ID Application:"),
    );
    const matchedIdentity = requestedIdentity
      ? identities.find((identity) => identity.name.includes(requestedIdentity))
      : developerIdIdentities[0];

    return {
      id: "developer-id-application",
      label: "Developer ID Application certificate",
      ok: Boolean(matchedIdentity),
      requestedIdentity: requestedIdentity || null,
      identity: matchedIdentity ? redactIdentity(matchedIdentity.name) : null,
      availableCount: developerIdIdentities.length,
      nextAction: matchedIdentity
        ? null
        : requestedIdentity
          ? `Install the requested Developer ID Application certificate or change --signing-identity.`
          : "Install a Developer ID Application certificate in this Mac keychain.",
    };
  } catch (error) {
    return {
      id: "developer-id-application",
      label: "Developer ID Application certificate",
      ok: false,
      requestedIdentity: requestedIdentity || null,
      error: error instanceof Error ? error.message : String(error),
      nextAction: "Allow keychain access and install a Developer ID Application certificate.",
    };
  }
}

function parseCodeSigningIdentities(output) {
  return String(output)
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*\d+\)\s+([A-Fa-f0-9]+)\s+"(.+)"\s*$/))
    .filter(Boolean)
    .map((match) => ({
      hash: match[1],
      name: match[2],
    }));
}

function redactIdentity(identity) {
  return String(identity).replace(/\(([A-Z0-9]{10})\)/g, "(TEAMID)");
}

function checkNotaryCredentials(options = {}) {
  const env = options.env || process.env;
  const keychainProfile = String(options.keychainProfile || env.NOTARYTOOL_KEYCHAIN_PROFILE || "").trim();
  const hasApiKey = Boolean(env.APPLE_API_KEY && env.APPLE_API_ISSUER);
  const hasAppleIdCredentials = Boolean(
    env.APPLE_ID && env.APPLE_TEAM_ID && env.APPLE_APP_SPECIFIC_PASSWORD,
  );
  const ok = Boolean(keychainProfile || hasApiKey || hasAppleIdCredentials);

  return {
    id: "notary-credentials",
    label: "Notarization credentials",
    ok,
    mode: keychainProfile ? "keychain-profile" : hasApiKey ? "api-key" : hasAppleIdCredentials ? "apple-id" : null,
    nextAction: ok
      ? null
      : "Configure NOTARYTOOL_KEYCHAIN_PROFILE, or APPLE_API_KEY + APPLE_API_ISSUER, or APPLE_ID + APPLE_TEAM_ID + APPLE_APP_SPECIFIC_PASSWORD.",
  };
}

async function checkCommand(command, args, options = {}) {
  const runCommand = options.commandRunner || defaultCommandRunner;
  try {
    const result = await runCommand(command, args);
    return {
      id: options.id || command,
      label: options.label || command,
      ok: true,
      command: [command, ...args].join(" "),
      version: String(result.stdout || result.stderr || "").trim(),
      nextAction: null,
    };
  } catch (error) {
    return {
      id: options.id || command,
      label: options.label || command,
      ok: false,
      command: [command, ...args].join(" "),
      error: error instanceof Error ? error.message : String(error),
      nextAction: options.installHint,
    };
  }
}

async function defaultCommandRunner(command, args) {
  return execFileAsync(command, args);
}
