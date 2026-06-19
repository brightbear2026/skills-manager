import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import { getServiceConfig, getServiceStatus } from "./serviceStore.mjs";

export function buildServiceStartPlan(options = {}) {
  const config = getServiceConfig(options);

  return {
    command: config.nodePath,
    args: [config.serverPath],
    cwd: config.projectRoot,
    env: {
      PORT: String(config.port),
      SKILLSMANGER_HOME: config.managerHome,
      SKILLSMANGER_SERVICE_LABEL: config.label,
      SKILLSMANGER_PROJECT_ROOT: config.projectRoot,
      SKILLSMANGER_SERVER_PATH: config.serverPath,
      SKILLSMANGER_PUBLIC_DIR: config.publicDir,
    },
    url: config.baseUrl,
    healthUrl: `${config.baseUrl}/api/health`,
    stdoutPath: config.stdoutPath,
    stderrPath: config.stderrPath,
  };
}

export async function resolveAppShellLaunch(options = {}) {
  const status = await readServiceStatus(options);
  const startPlan = buildServiceStartPlan(options);

  if (status.running) {
    return {
      ready: true,
      action: "open",
      url: status.url,
      status,
      startPlan: null,
    };
  }

  if (status.action === "choose-port") {
    return {
      ready: false,
      action: "choose-port",
      url: status.url,
      status,
      startPlan: null,
    };
  }

  return {
    ready: false,
    action: "start",
    url: startPlan.url,
    status,
    startPlan,
  };
}

export function startLocalService(options = {}) {
  const startPlan = buildServiceStartPlan(options);
  const stdio = options.stdio || createServiceLogStdio(startPlan);
  const child = spawn(startPlan.command, startPlan.args, {
    cwd: startPlan.cwd,
    detached: Boolean(options.detached),
    env: {
      ...process.env,
      ...startPlan.env,
    },
    stdio,
  });

  if (options.detached) child.unref();

  return {
    pid: child.pid,
    child,
    startPlan,
  };
}

function createServiceLogStdio(startPlan) {
  mkdirSync(path.dirname(startPlan.stdoutPath), { recursive: true });
  mkdirSync(path.dirname(startPlan.stderrPath), { recursive: true });
  return [
    "ignore",
    openSync(startPlan.stdoutPath, "a"),
    openSync(startPlan.stderrPath, "a"),
  ];
}

export async function waitForServiceReady(options = {}) {
  const timeoutMs = Number(options.timeoutMs || 5000);
  const healthTimeoutMs = Number(options.healthTimeoutMs || 500);
  const intervalMs = Number(options.intervalMs || 150);
  const deadline = Date.now() + timeoutMs;
  let lastStatus = null;

  while (Date.now() <= deadline) {
    lastStatus = await readServiceStatus({
      ...options,
      timeoutMs: healthTimeoutMs,
    });
    if (lastStatus.running) {
      return {
        ready: true,
        timedOut: false,
        action: "open",
        url: lastStatus.url,
        status: lastStatus,
      };
    }

    if (lastStatus.action === "choose-port") {
      return {
        ready: false,
        timedOut: false,
        action: "choose-port",
        url: lastStatus.url,
        status: lastStatus,
      };
    }

    await sleep(intervalMs);
  }

  return {
    ready: false,
    timedOut: true,
    action: "start",
    url: buildServiceStartPlan(options).url,
    status: lastStatus,
  };
}

export async function ensureServiceReady(options = {}) {
  const launch = await resolveAppShellLaunch(options);
  if (launch.action !== "start") return launch;
  if (options.start === false) return launch;

  const started = startLocalService(options);
  const ready = await waitForServiceReady(options);

  return {
    ...ready,
    startedPid: started.pid,
    startPlan: started.startPlan,
  };
}

async function readServiceStatus(options) {
  if (typeof options.statusProvider === "function") {
    return options.statusProvider(options);
  }
  return getServiceStatus(options);
}
