import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { expandHome } from "./skillScanner.mjs";

const STATE_VERSION = 1;
const MAX_RUNS = 200;
const MANAGED_INVOCATION_MODES = new Set(["managed", "hybrid"]);
const SECRET_KEY_PATTERN = /^[A-Za-z0-9_.-]{1,128}$/;
const VALID_ADAPTERS = new Set(["claude", "codex", "openclaw", "custom"]);
const VALID_PUBLISH_MODES = new Set(["managed-mirror", "copy", "symlink"]);

const DEFAULT_PROFILES = [
  {
    id: "claude-code",
    name: "Claude Code",
    adapter: "claude",
    skillRoot: "~/.claude/skills",
    secretScope: "profile",
    enabled: true,
    publishMode: "managed-mirror",
  },
  {
    id: "codex",
    name: "Codex",
    adapter: "codex",
    skillRoot: "~/.codex/skills",
    secretScope: "profile",
    enabled: true,
    publishMode: "managed-mirror",
  },
  {
    id: "openclaw",
    name: "OpenClaw",
    adapter: "openclaw",
    skillRoot: "~/.openclaw/skills",
    secretScope: "profile",
    enabled: true,
    publishMode: "managed-mirror",
  },
];

export function getManagerHome({ env = process.env } = {}) {
  return path.resolve(expandHome(env.SKILLSMANGER_HOME || "~/.skillsmanager"));
}

export async function getRuntimeState(options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const runs = await readJson(path.join(home, "runs.json"), []);
  const locks = await readJson(path.join(home, "locks.json"), {});

  return {
    version: STATE_VERSION,
    home,
    profiles,
    runs: sortRuns(runs),
    locks: Object.values(locks).sort((a, b) => a.lockKey.localeCompare(b.lockKey)),
    counts: {
      profiles: profiles.length,
      runs: runs.length,
      running: runs.filter((run) => run.status === "running").length,
      queued: runs.filter((run) => run.status === "queued").length,
      locks: Object.keys(locks).length,
    },
  };
}

export async function getProfiles(options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));

  return {
    profiles,
    counts: {
      profiles: profiles.length,
      enabled: profiles.filter((profile) => profile.enabled).length,
      disabled: profiles.filter((profile) => !profile.enabled).length,
    },
  };
}

export async function updateProfile(profileId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const nextProfile = normalizeProfile({
    ...(profiles.find((profile) => profile.id === profileId) || { id: profileId }),
    ...request,
    id: profileId,
  });
  const index = profiles.findIndex((profile) => profile.id === profileId);
  if (index === -1) {
    profiles.push(nextProfile);
  } else {
    profiles[index] = nextProfile;
  }
  await writeJson(path.join(home, "profiles.json"), profiles);

  return {
    profile: nextProfile,
    profiles,
  };
}

export async function resetProfiles(options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(DEFAULT_PROFILES);
  await writeJson(path.join(home, "profiles.json"), profiles);

  return {
    profiles,
  };
}

export async function createInvocation(catalog, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);

  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const runs = await readJson(path.join(home, "runs.json"), []);
  const locks = await readJson(path.join(home, "locks.json"), {});
  const skill = resolveSkill(catalog, request.skillId);
  assertManagedInvocationAllowed(skill);
  const profile = resolveProfile(profiles, request.agentId);
  const policy = normalizePolicy(request.policy);
  const invocationMode = skill.governance?.invocationMode || "native";
  const managedInvocation = MANAGED_INVOCATION_MODES.has(invocationMode);
  const resourceKey = normalizeResourceKey(request.resourceKey, skill);
  const lockKey = buildLockKey(policy, skill, resourceKey);
  const now = new Date().toISOString();
  const runId = `inv_${randomUUID().slice(0, 8)}`;
  const existingLock = lockKey ? locks[lockKey] : null;

  const run = {
    id: runId,
    status: existingLock ? "queued" : managedInvocation || policy === "parallel" ? "completed" : "running",
    agentId: profile.id,
    agentName: profile.name,
    skillId: skill.id,
    skillName: skill.name,
    skillPath: skill.path,
    skillVersion: String(skill.frontmatter?.version || "unversioned"),
    invocationMode,
    policy,
    lockKey,
    resourceKey: lockKey ? resourceKey : null,
    blockedBy: existingLock?.runId || null,
    createdAt: now,
    startedAt: existingLock ? null : now,
    completedAt: (managedInvocation || policy === "parallel") && !existingLock ? now : null,
    runDir: path.join(home, "runs", runId),
    execution: managedInvocation
      ? {
          type: "managed-runtime",
          sandbox: "record-only",
          bridge: true,
        }
      : {
          type: "native",
          sandbox: "agent-native",
          bridge: false,
        },
    input: {
      prompt: String(request.prompt || ""),
    },
    output: null,
    events: [
      {
        at: now,
        type: "created",
        message: existingLock ? "Invocation queued behind an existing lock." : "Invocation created.",
      },
    ],
  };

  if (managedInvocation && !existingLock) {
    run.output = buildManagedRuntimeOutput(run);
    run.events.push({
      at: now,
      type: "managed-runtime-recorded",
      message: "Managed invocation was captured for bridge runtime execution.",
    });
  } else if (policy === "parallel" && !existingLock) {
    run.output = {
      message: "Parallel invocation completed without acquiring a lock.",
    };
    run.events.push({
      at: now,
      type: "parallel-completed",
      message: "Parallel invocation completed without acquiring a lock.",
    });
  }

  if (lockKey && !existingLock && !managedInvocation) {
    locks[lockKey] = {
      lockKey,
      runId,
      agentId: profile.id,
      agentName: profile.name,
      skillId: skill.id,
      skillName: skill.name,
      policy,
      resourceKey,
      acquiredAt: now,
    };
  }

  await persistRunArtifacts(home, run);
  runs.unshift(run);
  await writeJson(path.join(home, "runs.json"), sortRuns(runs).slice(0, MAX_RUNS));
  await writeJson(path.join(home, "locks.json"), locks);

  return {
    run,
    locks: Object.values(locks),
  };
}

export async function getProfileSecrets(profileId, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const profile = resolveProfile(profiles, profileId);
  const store = await readProfileSecretStore(home, profile.id);

  return summarizeProfileSecrets(profile, store);
}

export async function setProfileSecret(profileId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const profile = resolveProfile(profiles, profileId);
  const key = normalizeSecretKey(request.key);
  const now = new Date().toISOString();
  const store = await readProfileSecretStore(home, profile.id);

  store.secrets[key] = {
    value: String(request.value ?? ""),
    updatedAt: now,
  };
  store.updatedAt = now;
  await writeProfileSecretStore(home, profile.id, store);

  return summarizeProfileSecrets(profile, store);
}

export async function deleteProfileSecret(profileId, key, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  const profiles = normalizeProfiles(await readJson(path.join(home, "profiles.json"), DEFAULT_PROFILES));
  const profile = resolveProfile(profiles, profileId);
  const normalizedKey = normalizeSecretKey(key);
  const now = new Date().toISOString();
  const store = await readProfileSecretStore(home, profile.id);

  delete store.secrets[normalizedKey];
  store.updatedAt = now;
  await writeProfileSecretStore(home, profile.id, store);

  return summarizeProfileSecrets(profile, store);
}

export async function completeInvocation(runId, options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);

  const runsPath = path.join(home, "runs.json");
  const locksPath = path.join(home, "locks.json");
  const runs = await readJson(runsPath, []);
  const locks = await readJson(locksPath, {});
  const run = runs.find((item) => item.id === runId);
  if (!run) {
    const error = new Error("Invocation not found.");
    error.statusCode = 404;
    throw error;
  }

  const now = new Date().toISOString();
  if (run.status === "running") {
    run.status = "completed";
    run.completedAt = now;
    run.output = {
      message: "Invocation completed and any held lock was released.",
    };

    for (const [lockKey, lock] of Object.entries(locks)) {
      if (lock.runId === run.id) delete locks[lockKey];
    }
  }

  const promoted = promoteQueuedRuns(runs, locks, now);

  for (const item of [run, ...promoted]) {
    await persistRunArtifacts(home, item);
  }

  await writeJson(runsPath, sortRuns(runs).slice(0, MAX_RUNS));
  await writeJson(locksPath, locks);

  return {
    run,
    promoted,
    locks: Object.values(locks),
  };
}

export async function resetRuntimeState(options = {}) {
  const home = getManagerHome(options);
  await ensureStore(home);
  await rm(path.join(home, "runs"), { recursive: true, force: true });
  await mkdir(path.join(home, "runs"), { recursive: true });
  await writeJson(path.join(home, "runs.json"), []);
  await writeJson(path.join(home, "locks.json"), {});
  return getRuntimeState(options);
}

function promoteQueuedRuns(runs, locks, now) {
  const promoted = [];
  const queued = sortRuns(runs)
    .filter((run) => run.status === "queued" && run.lockKey)
    .reverse();

  for (const run of queued) {
    if (locks[run.lockKey]) continue;
    if (run.execution?.type === "managed-runtime") {
      run.status = "completed";
      run.startedAt = now;
      run.completedAt = now;
      run.blockedBy = null;
      run.output = buildManagedRuntimeOutput(run);
      run.events = [
        ...(run.events || []),
        {
          at: now,
          type: "managed-runtime-recorded",
          message: "Queued managed invocation was captured after lock release.",
        },
      ];
      promoted.push(run);
      continue;
    }
    run.status = "running";
    run.startedAt = now;
    run.blockedBy = null;
    run.output = null;
    locks[run.lockKey] = {
      lockKey: run.lockKey,
      runId: run.id,
      agentId: run.agentId,
      agentName: run.agentName,
      skillId: run.skillId,
      skillName: run.skillName,
      policy: run.policy,
      resourceKey: run.resourceKey,
      acquiredAt: now,
    };
    promoted.push(run);
  }

  return promoted;
}

function normalizeProfiles(profiles) {
  return (Array.isArray(profiles) ? profiles : DEFAULT_PROFILES).map((profile) =>
    normalizeProfile(profile),
  );
}

function normalizeProfile(profile) {
  const id = String(profile.id || slugProfileId(profile.name || profile.adapter || "profile")).trim();
  const adapter = VALID_ADAPTERS.has(profile.adapter) ? profile.adapter : "custom";
  const publishMode = VALID_PUBLISH_MODES.has(profile.publishMode)
    ? profile.publishMode
    : "managed-mirror";

  return {
    id,
    name: String(profile.name || id),
    adapter,
    skillRoot: String(profile.skillRoot || `~/.${adapter}/skills`),
    secretScope: profile.secretScope === "global" ? "global" : "profile",
    enabled: profile.enabled !== false,
    publishMode,
  };
}

function slugProfileId(value) {
  return String(value || "profile")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function resolveSkill(catalog, skillId) {
  const skill = catalog.skills.find((item) => item.id === skillId);
  if (!skill) {
    const error = new Error("Skill not found.");
    error.statusCode = 404;
    throw error;
  }
  return skill;
}

function resolveProfile(profiles, agentId) {
  const profile = agentId
    ? profiles.find((item) => item.id === agentId)
    : profiles.find((item) => item.enabled) || profiles[0];
  if (!profile) {
    const error = new Error("No agent profiles are configured.");
    error.statusCode = 400;
    throw error;
  }
  if (!profile.enabled) {
    const error = new Error("Agent profile is disabled.");
    error.statusCode = 403;
    throw error;
  }
  return profile;
}

function assertManagedInvocationAllowed(skill) {
  const invocationMode = skill.governance?.invocationMode || "native";
  const trustStatus = skill.governance?.trust?.status || "unreviewed";
  if (trustStatus !== "blocked") return;
  if (!["managed", "hybrid"].includes(invocationMode)) return;

  const error = new Error("Blocked skills cannot be invoked through the managed runtime.");
  error.statusCode = 403;
  throw error;
}

function buildManagedRuntimeOutput(run) {
  return {
    message: "Managed invocation captured for Skills Manager bridge runtime.",
    bridgeRequest: {
      runId: run.id,
      agentId: run.agentId,
      skillId: run.skillId,
      skillName: run.skillName,
      skillPath: run.skillPath,
      invocationMode: run.invocationMode,
      prompt: run.input?.prompt || "",
    },
  };
}

function normalizePolicy(policy) {
  if (["parallel", "serialized", "singleton", "keyed"].includes(policy)) return policy;
  return "parallel";
}

function normalizeSecretKey(key) {
  const normalized = String(key || "").trim();
  if (SECRET_KEY_PATTERN.test(normalized)) return normalized;
  const error = new Error(
    "Secret key must be 1-128 characters of letters, numbers, dots, dashes, or underscores.",
  );
  error.statusCode = 400;
  throw error;
}

function normalizeResourceKey(resourceKey, skill) {
  const normalized = String(resourceKey || "").trim();
  if (normalized) return normalized;
  return skill.rootPath || skill.path;
}

function buildLockKey(policy, skill, resourceKey) {
  if (policy === "parallel") return null;
  if (policy === "singleton") return `singleton:${skill.name}`;
  if (policy === "serialized") return `skill:${skill.id}`;
  return `resource:${resourceKey}`;
}

async function ensureStore(home) {
  await mkdir(home, { recursive: true });
  await mkdir(path.join(home, "library"), { recursive: true });
  await mkdir(path.join(home, "runs"), { recursive: true });
  await mkdir(path.join(home, "secrets"), { recursive: true });

  await writeJsonIfMissing(path.join(home, "profiles.json"), DEFAULT_PROFILES);
  await writeJsonIfMissing(path.join(home, "runs.json"), []);
  await writeJsonIfMissing(path.join(home, "locks.json"), {});
  await writeJsonIfMissing(path.join(home, "state.json"), {
    version: STATE_VERSION,
    createdAt: new Date().toISOString(),
  });
}

async function persistRunArtifacts(home, run) {
  await mkdir(run.runDir, { recursive: true });
  await writeJson(path.join(run.runDir, "metadata.json"), {
    id: run.id,
    status: run.status,
    agentId: run.agentId,
    agentName: run.agentName,
    skillId: run.skillId,
    skillName: run.skillName,
    skillVersion: run.skillVersion,
    invocationMode: run.invocationMode,
    policy: run.policy,
    lockKey: run.lockKey,
    resourceKey: run.resourceKey,
    blockedBy: run.blockedBy,
    createdAt: run.createdAt,
    startedAt: run.startedAt,
    completedAt: run.completedAt,
    execution: run.execution,
  });
  await writeJson(path.join(run.runDir, "input.json"), run.input || {});
  await writeJson(path.join(run.runDir, "output.json"), run.output || {});
  await writeJson(path.join(run.runDir, "events.json"), run.events || []);
}

async function readProfileSecretStore(home, profileId) {
  const store = await readJson(profileSecretPath(home, profileId), {
    version: 1,
    profileId,
    secrets: {},
    updatedAt: null,
  });
  if (!store.secrets || typeof store.secrets !== "object") store.secrets = {};
  return store;
}

async function writeProfileSecretStore(home, profileId, store) {
  await writeJson(profileSecretPath(home, profileId), {
    version: 1,
    profileId,
    secrets: store.secrets || {},
    updatedAt: store.updatedAt || new Date().toISOString(),
  });
}

function summarizeProfileSecrets(profile, store) {
  return {
    profileId: profile.id,
    profileName: profile.name,
    secretScope: profile.secretScope || "profile",
    keys: Object.entries(store.secrets || {})
      .map(([key, value]) => ({
        key,
        updatedAt: value.updatedAt || null,
      }))
      .sort((a, b) => a.key.localeCompare(b.key)),
    updatedAt: store.updatedAt || null,
  };
}

function profileSecretPath(home, profileId) {
  return path.join(home, "secrets", `${safeFileSegment(profileId)}.json`);
}

function safeFileSegment(value) {
  return String(value || "profile").replace(/[^A-Za-z0-9_.-]+/g, "_");
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return structuredClone(fallback);
  }
}

async function writeJsonIfMissing(filePath, payload) {
  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeJson(filePath, payload);
  }
}

async function writeJson(filePath, payload) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function sortRuns(runs) {
  return [...runs].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
