import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getManagerHome } from "./runtimeStore.mjs";

export const SERVICE_LABEL = "com.skillsmanager.local";
export const DEFAULT_PORT = 5173;
export const APP_VERSION = "0.5.1";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROJECT_ROOT = path.resolve(__dirname, "..");

export function getServiceConfig(options = {}) {
  const env = options.env || process.env;
  const projectRoot = path.resolve(
    options.projectRoot || env.SKILLSMANGER_PROJECT_ROOT || DEFAULT_PROJECT_ROOT,
  );
  const managerHome = getManagerHome({ env });
  const port = Number(options.port || env.PORT || DEFAULT_PORT);
  const label = String(options.label || env.SKILLSMANGER_SERVICE_LABEL || SERVICE_LABEL);
  const nodePath = String(options.nodePath || env.SKILLSMANGER_NODE_PATH || process.execPath);
  const serverPath = path.resolve(
    options.serverPath || env.SKILLSMANGER_SERVER_PATH || path.join(projectRoot, "src", "server.mjs"),
  );
  const publicDir = path.resolve(
    options.publicDir || env.SKILLSMANGER_PUBLIC_DIR || path.join(projectRoot, "public"),
  );
  const launchdDir = path.join(managerHome, "launchd");
  const logsDir = path.join(managerHome, "logs");

  return {
    label,
    version: APP_VERSION,
    port,
    baseUrl: `http://127.0.0.1:${port}`,
    projectRoot,
    managerHome,
    nodePath,
    serverPath,
    publicDir,
    plistPath: path.join(launchdDir, `${label}.plist`),
    userLaunchAgentsPath: path.join(process.env.HOME || "~", "Library", "LaunchAgents", `${label}.plist`),
    stdoutPath: path.join(logsDir, "service.out.log"),
    stderrPath: path.join(logsDir, "service.err.log"),
  };
}

export function buildHealthPayload(options = {}) {
  const config = getServiceConfig(options);
  return {
    ok: true,
    service: config.label,
    version: config.version,
    port: config.port,
    baseUrl: config.baseUrl,
    projectRoot: config.projectRoot,
    managerHome: config.managerHome,
    uptimeSeconds: Math.round(process.uptime()),
    pid: process.pid,
    startedAt: options.startedAt || null,
  };
}

export async function checkServiceHealth(options = {}) {
  const config = getServiceConfig(options);
  const url = String(options.url || `${config.baseUrl}/api/health`);
  const timeoutMs = Number(options.timeoutMs || 1500);

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        accept: "application/json",
      },
    });
    const payload = await response.json().catch(() => null);
    const matchedService = response.ok && isSkillsManagerHealthPayload(payload, config);
    return {
      running: matchedService,
      reachable: response.ok,
      matchedService,
      statusCode: response.status,
      url,
      health: payload,
    };
  } catch (error) {
    return {
      running: false,
      reachable: false,
      matchedService: false,
      statusCode: null,
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getServiceStatus(options = {}) {
  const config = getServiceConfig(options);
  const health = await checkServiceHealth({
    ...options,
    url: options.url || `${config.baseUrl}/api/health`,
  });

  return {
    running: health.running,
    action: health.running ? "open" : health.statusCode === null ? "start" : "choose-port",
    portOccupied: !health.running && health.statusCode !== null,
    url: config.baseUrl,
    baseUrl: config.baseUrl,
    healthUrl: health.url,
    config,
    health: health.health || null,
    reachable: health.reachable,
    matchedService: health.matchedService,
    statusCode: health.statusCode,
    error: health.error || null,
  };
}

export function isSkillsManagerHealthPayload(payload, config = getServiceConfig()) {
  return Boolean(
    payload &&
      payload.ok === true &&
      payload.service === config.label &&
      payload.baseUrl === config.baseUrl &&
      Number(payload.port) === Number(config.port),
  );
}

export async function writeLaunchAgentPlist(options = {}) {
  const config = getServiceConfig(options);
  const targetPath = path.resolve(options.targetPath || config.plistPath);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await mkdir(path.dirname(config.stdoutPath), { recursive: true });
  await writeFile(targetPath, renderLaunchAgentPlist(config), "utf8");

  return {
    ...config,
    targetPath,
    installCommand: `cp ${shellQuote(targetPath)} ${shellQuote(config.userLaunchAgentsPath)}`,
    loadCommand: `launchctl load ${shellQuote(config.userLaunchAgentsPath)}`,
    unloadCommand: `launchctl unload ${shellQuote(config.userLaunchAgentsPath)}`,
  };
}

export function renderLaunchAgentPlist(config = getServiceConfig()) {
  const env = {
    PORT: String(config.port),
    SKILLSMANGER_HOME: config.managerHome,
    SKILLSMANGER_PROJECT_ROOT: config.projectRoot,
    SKILLSMANGER_SERVER_PATH: config.serverPath,
    SKILLSMANGER_PUBLIC_DIR: config.publicDir,
    PATH: "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin",
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${escapePlist(config.label)}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${escapePlist(config.nodePath)}</string>
    <string>${escapePlist(config.serverPath)}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${escapePlist(config.projectRoot)}</string>
  <key>EnvironmentVariables</key>
  <dict>
${Object.entries(env)
  .map(
    ([key, value]) => `    <key>${escapePlist(key)}</key>
    <string>${escapePlist(value)}</string>`,
  )
  .join("\n")}
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${escapePlist(config.stdoutPath)}</string>
  <key>StandardErrorPath</key>
  <string>${escapePlist(config.stderrPath)}</string>
</dict>
</plist>
`;
}

function escapePlist(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}
