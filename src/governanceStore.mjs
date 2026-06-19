import { cp, lstat, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { getManagerHome, getRuntimeState } from "./runtimeStore.mjs";
import { expandHome, parseSkillMarkdown, readSkill } from "./skillScanner.mjs";

const INDEX_FILE = "index.json";
const MARKER_FILE = ".skillsmanager.json";
const ORIGIN_FILE = "origin.json";
const VALID_INVOCATION_MODES = new Set(["native", "managed", "hybrid"]);
const VALID_ADOPTION_STATUSES = new Set(["adopted", "adopted-existing"]);
const VALID_TRUST_STATUSES = new Set(["unreviewed", "trusted", "reviewed", "blocked"]);
const VALID_PUBLISH_MODES = new Set(["managed-mirror", "copy", "symlink"]);
const SYMLINK_MARKER_SUFFIX = ".skillsmanager.json";
const SKIP_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".next",
  ".venv",
  "venv",
  "__pycache__",
]);

export async function enrichCatalogWithGovernance(catalog, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const index = await readIndex(home);

  const skills = [];
  for (const skill of catalog.skills) {
    const governance = await inspectSkillGovernance(skill, index, home);
    skills.push({
      ...skill,
      governance,
    });
  }

  return {
    ...catalog,
    skills,
    governance: {
      home,
      libraryPath: path.join(home, "library"),
      records: index.records.length,
      managed: skills.filter((skill) => skill.governance.status === "managed").length,
      adopted: skills.filter((skill) =>
        ["adopted", "adopted-existing"].includes(skill.governance.status),
      ).length,
      adoptedExisting: skills.filter((skill) => skill.governance.status === "adopted-existing")
        .length,
      unmanaged: skills.filter((skill) => skill.governance.status === "unmanaged").length,
    },
  };
}

export async function adoptSkill(catalog, skillId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const skill = resolveSkill(catalog, skillId);
  const invocationMode = normalizeInvocationMode(request.invocationMode);
  const adoptionStatus = normalizeAdoptionStatus(request.adoptionStatus);
  const writeSourceMarker = request.writeSourceMarker !== false;
  const fingerprint = await fingerprintSkillDir(skill.path);
  const versionKey = getVersionKey(skill, fingerprint);
  const slug = slugify(skill.name);
  const recordId = `${slug}@${versionKey}`;
  const libraryPath = path.join(home, "library", slug, "versions", versionKey);
  const now = new Date().toISOString();

  await copySkillDirectory(skill.path, libraryPath, {
    replace: true,
  });

  const origin = {
    manager: "skillsmanager",
    recordId,
    name: skill.name,
    version: String(skill.frontmatter?.version || "unversioned"),
    fingerprint,
    sourcePath: skill.path,
    sourceType: request.sourceType || "local-adoption",
    adoptionStatus,
    risk: summarizeRisk(skill.risk),
    adoptedAt: now,
    invocationMode,
  };
  await writeJson(path.join(libraryPath, ORIGIN_FILE), origin);

  const marker = {
    manager: "skillsmanager",
    status: adoptionStatus,
    recordId,
    name: skill.name,
    version: origin.version,
    fingerprint,
    libraryPath,
    invocationMode,
    adoptionStatus,
    adoptedAt: now,
  };
  if (writeSourceMarker) {
    await writeMarker(skill.path, marker);
  }

  const index = await readIndex(home);
  const existingRecord = index.records.find((record) => record.id === recordId);
  const existingPolicy = findTrustPolicy(index, {
    recordId,
    fingerprint,
    sourcePath: skill.path,
  });
  const trust = existingRecord?.trust || existingPolicy?.trust || null;
  if (existingPolicy && !existingPolicy.recordId) {
    existingPolicy.recordId = recordId;
    existingPolicy.updatedAt = now;
  }
  const record = upsertRecord(index, {
    id: recordId,
    name: skill.name,
    slug,
    version: origin.version,
    versionKey,
    fingerprint,
    libraryPath,
    sourcePath: skill.path,
    invocationMode,
    sourceType: origin.sourceType,
    adoptionStatus,
    risk: origin.risk,
    riskLevel: origin.risk.level,
    trust,
    status: adoptionStatus,
    adoptedAt: now,
    updatedAt: now,
    publishedTo: [],
  });
  await writeIndex(home, index);

  return {
    record,
    marker: writeSourceMarker ? marker : null,
  };
}

export async function publishSkill(catalog, skillId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const skill = resolveSkill(catalog, skillId);
  const runtime = await getRuntimeState(options);
  const profile = resolveProfile(runtime.profiles, request.profileId);

  const invocationMode = normalizeInvocationMode(request.invocationMode);
  const requestedPublishMode = normalizePublishMode(request.publishMode || profile.publishMode);
  let index = await readIndex(home);
  let governance = await inspectSkillGovernance(skill, index, home);
  let record = governance.record;

  if (!record) {
    assertPublishAllowed({
      riskLevel: skill.risk?.level || "unknown",
      trust: governance.trust,
    });
    const adopted = await adoptSkill(catalog, skillId, { invocationMode }, options);
    record = adopted.record;
    index = await readIndex(home);
    governance = await inspectSkillGovernance(skill, index, home);
  }

  assertPublishAllowed({
    riskLevel: skill.risk?.level || record.riskLevel || "unknown",
    trust: governance.trust || record.trust,
  });

  const targetRoot = path.resolve(expandHome(profile.skillRoot));
  const targetPath = path.join(targetRoot, record.slug);
  const sourcePath = record.libraryPath;
  const now = new Date().toISOString();
  const samePath = await isSamePath(skill.path, targetPath);
  const publishMode = samePath ? "in-place" : requestedPublishMode;

  if (samePath) {
    await writeMarker(targetPath, {
      manager: "skillsmanager",
      status: "managed",
      recordId: record.id,
      name: record.name,
      version: record.version,
      fingerprint: record.fingerprint,
      libraryPath: record.libraryPath,
      profileId: profile.id,
      profileName: profile.name,
      publishMode: "in-place",
      invocationMode,
      publishedAt: now,
    });
  } else {
    await preparePublishTarget(targetPath);
    await publishSkillDirectory(sourcePath, targetPath, publishMode);
    await writePublishMarker(targetPath, publishMode, {
      manager: "skillsmanager",
      status: "managed",
      recordId: record.id,
      name: record.name,
      version: record.version,
      fingerprint: record.fingerprint,
      libraryPath: record.libraryPath,
      profileId: profile.id,
      profileName: profile.name,
      publishMode,
      invocationMode,
      publishedAt: now,
    });
  }

  record.invocationMode = invocationMode;
  record.status = "managed";
  record.updatedAt = now;
  record.publishedTo = upsertPublication(record.publishedTo || [], {
    profileId: profile.id,
    profileName: profile.name,
    targetPath,
    publishMode,
    publishedAt: now,
  });
  removePublicationConflicts(index, {
    recordId: record.id,
    profileId: profile.id,
    targetPath,
    slug: record.slug,
    now,
  });
  upsertRecord(index, record);
  await writeIndex(home, index);

  return {
    record,
    profile,
    targetPath,
    governance,
  };
}

export async function getLibraryCatalog(options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const runtime = await getRuntimeState(options);
  const index = await readIndex(home);
  const records = (
    await Promise.all(
      index.records.map(async (record) => ({
        ...record,
        publishedTo: record.publishedTo || [],
        targetStates: await inspectRecordTargetStates(record, runtime.profiles),
      })),
    )
  ).sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version));

  return {
    home,
    libraryPath: path.join(home, "library"),
    records,
    counts: {
      records: records.length,
      managed: records.filter((record) => record.status === "managed").length,
      library: records.filter((record) => record.status === "library").length,
      adopted: records.filter((record) =>
        ["adopted", "adopted-existing"].includes(record.status),
      ).length,
      adoptedExisting: records.filter((record) => record.status === "adopted-existing").length,
      publications: records.reduce((sum, record) => sum + (record.publishedTo || []).length, 0),
      trusted: records.filter((record) => record.trust?.status === "trusted").length,
      reviewed: records.filter((record) => record.trust?.status === "reviewed").length,
      blocked: records.filter((record) => record.trust?.status === "blocked").length,
      unreviewed: records.filter((record) => !record.trust || record.trust.status === "unreviewed")
        .length,
    },
  };
}

export async function getLibraryRecordDetail(recordId, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const index = await readIndex(home);
  const record = index.records.find((item) => item.id === recordId);
  if (!record) {
    const error = new Error("Library record not found.");
    error.statusCode = 404;
    throw error;
  }

  const libraryPath = path.resolve(expandHome(record.libraryPath));
  const skill = await readSkill(libraryPath, {
    key: "library",
    label: "My Library",
    tool: "Skills Manager",
    path: libraryPath,
    realPath: libraryPath,
  });
  return {
    ...skill,
    id: record.id,
    record,
    sourceType: record.sourceType,
    origin: {
      path: record.sourcePath,
      url: record.source?.url,
      sourceType: record.sourceType,
    },
  };
}

async function inspectRecordTargetStates(record, profiles = []) {
  const states = [];
  for (const profile of profiles) {
    if (profile.enabled === false) continue;
    const targetRoot = path.resolve(expandHome(profile.skillRoot));
    const targetPath = path.join(targetRoot, record.slug);
    const publication = (record.publishedTo || []).find((item) => item.profileId === profile.id);
    const exists = await pathExists(targetPath);
    const marker = exists ? await readPublishMarker(targetPath) : await readJson(getSymlinkMarkerPath(targetPath), null);
    let status = "available";
    let reason = "empty";
    if (publication) {
      if (!exists) {
        status = "stale";
        reason = "missing-target";
      } else if (marker?.fingerprint && marker.fingerprint !== record.fingerprint) {
        status = "outdated";
        reason = "fingerprint-mismatch";
      } else {
        status = "managed";
        reason = "managed-copy";
      }
    } else if (exists && marker?.manager === "skillsmanager" && marker.status === "managed") {
      status = "managed-other";
      reason = "managed-by-skillsmanager";
    } else if (exists) {
      status = "conflict";
      reason = "unmanaged-target";
    }
    states.push({
      profileId: profile.id,
      profileName: profile.name,
      targetPath,
      publishMode: profile.publishMode,
      status,
      reason,
    });
  }
  return states;
}

export async function publishLibraryRecord(recordId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const runtime = await getRuntimeState(options);
  const profile = resolveProfile(runtime.profiles, request.profileId);
  const index = await readIndex(home);
  const record = index.records.find((item) => item.id === recordId);
  if (!record) {
    const error = new Error("Library record not found.");
    error.statusCode = 404;
    throw error;
  }

  const invocationMode = normalizeInvocationMode(request.invocationMode || record.invocationMode);
  const publishMode = normalizePublishMode(request.publishMode || profile.publishMode);
  const targetRoot = path.resolve(expandHome(profile.skillRoot));
  const targetPath = path.join(targetRoot, record.slug);
  const now = new Date().toISOString();

  assertPublishAllowed({
    riskLevel: record.riskLevel || record.risk?.level || "unknown",
    trust: normalizeTrustPolicy(record.trust, {
      previous: null,
      reviewedAt: now,
    }),
  });

  await preparePublishTarget(targetPath);
  await publishSkillDirectory(record.libraryPath, targetPath, publishMode);
  await writePublishMarker(targetPath, publishMode, {
    manager: "skillsmanager",
    status: "managed",
    recordId: record.id,
    name: record.name,
    version: record.version,
    fingerprint: record.fingerprint,
    libraryPath: record.libraryPath,
    profileId: profile.id,
    profileName: profile.name,
    publishMode,
    invocationMode,
    publishedAt: now,
  });

  record.invocationMode = invocationMode;
  record.status = "managed";
  record.updatedAt = now;
  record.publishedTo = upsertPublication(record.publishedTo || [], {
    profileId: profile.id,
    profileName: profile.name,
    targetPath,
    publishMode,
    publishedAt: now,
  });
  removePublicationConflicts(index, {
    recordId: record.id,
    profileId: profile.id,
    targetPath,
    slug: record.slug,
    now,
  });
  upsertRecord(index, record);
  await writeIndex(home, index);

  return {
    record,
    profile,
    targetPath,
  };
}

export async function unpublishLibraryRecord(recordId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const runtime = await getRuntimeState(options);
  const profile = resolveProfile(runtime.profiles, request.profileId);
  const index = await readIndex(home);
  const record = index.records.find((item) => item.id === recordId);
  if (!record) {
    const error = new Error("Library record not found.");
    error.statusCode = 404;
    throw error;
  }

  const targetRoot = path.resolve(expandHome(profile.skillRoot));
  const publication = (record.publishedTo || []).find((item) => item.profileId === profile.id);
  const targetPath = publication?.targetPath || path.join(targetRoot, record.slug);
  const exists = await pathExists(targetPath);
  if (!publication && !exists) {
    const error = new Error("Publication not found.");
    error.statusCode = 404;
    throw error;
  }

  let removed = false;
  if (exists) {
    const marker = await readPublishMarker(targetPath);
    if (
      marker?.manager !== "skillsmanager" ||
      marker.status !== "managed" ||
      marker.recordId !== record.id ||
      marker.profileId !== profile.id ||
      marker.publishMode === "in-place"
    ) {
      const error = new Error("Publish target is not a managed mirror for this library record.");
      error.statusCode = 409;
      throw error;
    }
    await removePublishTarget(targetPath);
    removed = true;
  }

  const now = new Date().toISOString();
  record.publishedTo = (record.publishedTo || []).filter((item) => item.profileId !== profile.id);
  record.status = getRecordStatusAfterPublicationChange(record);
  record.updatedAt = now;
  upsertRecord(index, record);
  await writeIndex(home, index);

  return {
    record,
    profile,
    targetPath,
    removed,
    stalePublication: publication && !exists,
  };
}

export async function republishLibraryRecord(recordId, request = {}, options = {}) {
  const result = await publishLibraryRecord(recordId, request, options);
  return {
    ...result,
    action: "republished",
  };
}

export async function rollbackLibraryRecord(recordId, request = {}, options = {}) {
  const result = await publishLibraryRecord(recordId, request, options);
  return {
    ...result,
    action: "rolled-back",
    rollback: {
      recordId,
      profileId: result.profile.id,
      targetPath: result.targetPath,
    },
  };
}

export async function updateSkillTrustPolicy(catalog, skillId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const skill = resolveSkill(catalog, skillId);
  const index = await readIndex(home);
  const governance = await inspectSkillGovernance(skill, index, home);
  const now = new Date().toISOString();
  const trust = normalizeTrustPolicy(request, {
    previous: governance.trust,
    reviewedAt: now,
  });
  const policy = buildSkillPolicy(skill, governance.record, trust, now, governance.fingerprint);

  upsertPolicy(index, policy);
  if (governance.record) {
    governance.record.trust = trust;
    governance.record.updatedAt = now;
    upsertRecord(index, governance.record);
  }
  await writeIndex(home, index);

  return {
    trust,
    policy: checkPolicy({
      riskLevel: skill.risk?.level || governance.record?.riskLevel || "unknown",
      trust,
    }),
  };
}

export async function updateLibraryTrustPolicy(recordId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const index = await readIndex(home);
  const record = index.records.find((item) => item.id === recordId);
  if (!record) {
    const error = new Error("Library record not found.");
    error.statusCode = 404;
    throw error;
  }

  const now = new Date().toISOString();
  const trust = normalizeTrustPolicy(request, {
    previous: record.trust,
    reviewedAt: now,
  });
  record.trust = trust;
  record.updatedAt = now;
  upsertRecord(index, record);
  await writeIndex(home, index);

  return {
    record,
    trust,
    policy: checkPolicy({
      riskLevel: record.riskLevel || record.risk?.level || "unknown",
      trust,
    }),
  };
}

export async function updateInvocationMode(catalog, skillId, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const skill = resolveSkill(catalog, skillId);
  const invocationMode = normalizeInvocationMode(request.invocationMode);
  const index = await readIndex(home);
  const governance = await inspectSkillGovernance(skill, index, home);
  const now = new Date().toISOString();

  if (governance.record) {
    governance.record.invocationMode = invocationMode;
    governance.record.updatedAt = now;
    upsertRecord(index, governance.record);
    await writeIndex(home, index);
  }

  const marker = await readMarker(skill.path);
  await writeMarker(skill.path, {
    manager: "skillsmanager",
    status: marker?.status || governance.status,
    recordId: marker?.recordId || governance.record?.id || null,
    name: skill.name,
    version: String(skill.frontmatter?.version || "unversioned"),
    fingerprint: governance.fingerprint,
    libraryPath: marker?.libraryPath || governance.record?.libraryPath || null,
    profileId: marker?.profileId || null,
    profileName: marker?.profileName || null,
    publishMode: marker?.publishMode || null,
    invocationMode,
    updatedAt: now,
  });

  return {
    invocationMode,
  };
}

export async function installLibrarySkillFromPath(sourcePath, request = {}, options = {}) {
  const home = getManagerHome(options);
  await ensureGovernanceStore(home);
  const skillPath = path.resolve(expandHome(sourcePath));
  const markdown = await readFile(path.join(skillPath, "SKILL.md"), "utf8");
  const parsed = parseSkillMarkdown(markdown, path.basename(skillPath));
  const fingerprint = await fingerprintSkillDir(skillPath);
  const invocationMode = normalizeInvocationMode(request.invocationMode);
  const version = String(parsed.frontmatter?.version || "unversioned");
  const versionKey = slugify(version || fingerprint.slice(0, 12));
  const slug = slugify(parsed.name);
  const recordId = `${slug}@${versionKey}`;
  const libraryPath = path.join(home, "library", slug, "versions", versionKey);
  const now = new Date().toISOString();
  const replace = Boolean(request.replace);
  const index = await readIndex(home);
  const existing = index.records.find((record) => record.id === recordId);

  if (existing && existing.fingerprint !== fingerprint && !replace) {
    const error = new Error(
      "A library record with the same skill name and version already exists with different content.",
    );
    error.statusCode = 409;
    throw error;
  }

  await copySkillDirectory(skillPath, libraryPath, {
    replace: true,
  });

  const origin = {
    manager: "skillsmanager",
    recordId,
    name: parsed.name,
    description: parsed.description,
    version,
    fingerprint,
    sourceType: request.sourceType || "local",
    source: request.source || {},
    risk: summarizeRisk(request.risk),
    installedAt: now,
    invocationMode,
  };
  await writeJson(path.join(libraryPath, ORIGIN_FILE), origin);

  const previousPublishedTo = existing?.publishedTo || [];
  const existingPolicy = findTrustPolicy(index, {
    recordId,
    fingerprint,
    sourcePath: skillPath,
  });
  const trust = existing?.trust || existingPolicy?.trust || null;
  if (existingPolicy && !existingPolicy.recordId) {
    existingPolicy.recordId = recordId;
    existingPolicy.updatedAt = now;
  }
  const record = upsertRecord(index, {
    id: recordId,
    name: parsed.name,
    slug,
    version,
    versionKey,
    description: parsed.description,
    fingerprint,
    libraryPath,
    sourcePath: skillPath,
    sourceType: origin.sourceType,
    source: origin.source,
    risk: origin.risk,
    riskLevel: origin.risk.level,
    trust,
    invocationMode,
    status: existing?.status === "managed" ? "managed" : "library",
    installedAt: existing?.installedAt || now,
    updatedAt: now,
    publishedTo: previousPublishedTo,
  });
  await writeIndex(home, index);

  return {
    record,
    origin,
  };
}

export async function fingerprintSkillDir(skillDir) {
  const files = await listHashableFiles(skillDir);
  const hash = createHash("sha256");
  for (const filePath of files) {
    const relativePath = path.relative(skillDir, filePath);
    hash.update(relativePath);
    hash.update("\0");
    hash.update(await readFile(filePath));
    hash.update("\0");
  }
  return hash.digest("hex");
}

async function inspectSkillGovernance(skill, index, home) {
  const marker = await readMarker(skill.path);
  const fingerprint = await fingerprintSkillDir(skill.path);
  const versionKey = getVersionKey(skill, fingerprint);
  const slug = slugify(skill.name);
  const record =
    index.records.find((item) => item.id === marker?.recordId) ||
    index.records.find((item) => item.slug === slug && item.fingerprint === fingerprint) ||
    index.records.find((item) => item.slug === slug && item.versionKey === versionKey) ||
    null;

  const markerStatus =
    marker?.manager === "skillsmanager" &&
    ["managed", "adopted", "adopted-existing"].includes(marker.status)
      ? marker.status
      : null;
  const recordStatus = record?.status === "adopted-existing" ? "adopted-existing" : null;
  const status = markerStatus || recordStatus || "unmanaged";
  const invocationMode = normalizeInvocationMode(
    marker?.invocationMode || record?.invocationMode || "native",
  );
  const trust = resolveTrustForSkill(skill, record, index);
  const policy = checkPolicy({
    riskLevel: skill.risk?.level || record?.riskLevel || "unknown",
    trust,
  });

  return {
    status,
    invocationMode,
    fingerprint,
    versionKey,
    recordId: record?.id || marker?.recordId || null,
    record: record || null,
    libraryPath: record?.libraryPath || marker?.libraryPath || null,
    inLibrary: Boolean(record),
    publishedTo: record?.publishedTo || [],
    marker: marker || null,
    markerPath: path.join(skill.path, MARKER_FILE),
    managerHome: home,
    trust,
    policy,
  };
}

function resolveTrustForSkill(skill, record, index) {
  const policy = findTrustPolicy(index, {
    recordId: record?.id || null,
    fingerprint: record?.fingerprint || null,
    sourcePath: skill.path,
  });

  return normalizeTrustPolicy(record?.trust || policy?.trust || policy, {
    previous: null,
  });
}

function findTrustPolicy(index, { recordId = null, fingerprint = null, sourcePath = null } = {}) {
  if (!Array.isArray(index.policies)) return null;
  if (recordId) {
    const policy = index.policies.find((item) => item.recordId === recordId);
    if (policy) return policy;
  }
  if (fingerprint) {
    const policy = index.policies.find((item) => item.fingerprint === fingerprint);
    if (policy) return policy;
  }
  if (sourcePath) {
    const policy = index.policies.find((item) => item.sourcePath === sourcePath);
    if (policy) return policy;
  }
  return null;
}

function normalizeTrustPolicy(request = {}, { previous = null, reviewedAt = null } = {}) {
  const status = VALID_TRUST_STATUSES.has(request?.status) ? request.status : previous?.status || "unreviewed";
  const isReviewedStatus = ["trusted", "reviewed", "blocked"].includes(status);
  const now = reviewedAt || new Date().toISOString();

  return {
    status,
    notes: String(request?.notes ?? previous?.notes ?? ""),
    reviewer: String(request?.reviewer ?? previous?.reviewer ?? "local"),
    reviewedAt: isReviewedStatus ? request?.reviewedAt || previous?.reviewedAt || now : null,
    updatedAt: now,
  };
}

function buildSkillPolicy(skill, record, trust, now, inspectedFingerprint = null) {
  const fingerprint = record?.fingerprint || inspectedFingerprint || null;
  return {
    id: record?.id || `${slugify(skill.name)}@${fingerprint || "unversioned"}`,
    recordId: record?.id || null,
    name: skill.name,
    slug: slugify(skill.name),
    sourcePath: skill.path,
    fingerprint,
    version: String(skill.frontmatter?.version || record?.version || "unversioned"),
    riskLevel: skill.risk?.level || record?.riskLevel || "unknown",
    trust,
    updatedAt: now,
  };
}

function upsertPolicy(index, policy) {
  if (!Array.isArray(index.policies)) index.policies = [];
  const policyIndex = index.policies.findIndex((item) => {
    if (policy.recordId && item.recordId === policy.recordId) return true;
    if (policy.fingerprint && item.fingerprint === policy.fingerprint) return true;
    return item.sourcePath === policy.sourcePath;
  });
  if (policyIndex === -1) {
    index.policies.push(policy);
    return policy;
  }
  index.policies[policyIndex] = {
    ...index.policies[policyIndex],
    ...policy,
  };
  return index.policies[policyIndex];
}

function checkPolicy({ riskLevel, trust }) {
  const normalizedTrust = normalizeTrustPolicy(trust);
  const blocked = normalizedTrust.status === "blocked";
  const highRiskReviewRequired = riskLevel === "high" && normalizedTrust.status === "unreviewed";
  return {
    allowedToPublish: !blocked && !highRiskReviewRequired,
    allowedManagedInvocation: !blocked,
    blocked,
    highRiskReviewRequired,
    trustStatus: normalizedTrust.status,
    reasons: [
      ...(blocked ? ["Skill is blocked by local trust policy."] : []),
      ...(highRiskReviewRequired ? ["High-risk skills require review before publishing."] : []),
    ],
  };
}

function assertPublishAllowed({ riskLevel, trust }) {
  const policy = checkPolicy({ riskLevel, trust });
  if (policy.allowedToPublish) return policy;

  const error = new Error(policy.reasons.join(" "));
  error.statusCode = 403;
  error.policy = policy;
  throw error;
}

async function ensureGovernanceStore(home) {
  await mkdir(path.join(home, "library"), { recursive: true });
  await writeJsonIfMissing(path.join(home, "library", INDEX_FILE), {
    version: 1,
    records: [],
    policies: [],
  });
}

async function readIndex(home) {
  const index = await readJson(path.join(home, "library", INDEX_FILE), {
    version: 1,
    records: [],
    policies: [],
  });
  if (!Array.isArray(index.records)) index.records = [];
  if (!Array.isArray(index.policies)) index.policies = [];
  return index;
}

async function writeIndex(home, index) {
  await writeJson(path.join(home, "library", INDEX_FILE), index);
}

async function readMarker(skillPath) {
  return readJson(path.join(skillPath, MARKER_FILE), null);
}

async function writeMarker(skillPath, marker) {
  await writeJson(path.join(skillPath, MARKER_FILE), marker);
}

async function readPublishMarker(targetPath) {
  const marker = await readMarker(targetPath);
  if (marker) return marker;
  return readJson(getSymlinkMarkerPath(targetPath), null);
}

async function writePublishMarker(targetPath, publishMode, marker) {
  if (publishMode === "symlink") {
    await writeJson(getSymlinkMarkerPath(targetPath), marker);
    return;
  }
  await writeMarker(targetPath, marker);
}

async function copySkillDirectory(sourcePath, targetPath, { replace }) {
  if (replace) {
    await rm(targetPath, { recursive: true, force: true });
  }
  await mkdir(path.dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, {
    recursive: true,
    force: false,
    errorOnExist: false,
    filter: (source) => {
      const name = path.basename(source);
      if (name === MARKER_FILE) return false;
      if (SKIP_DIRS.has(name)) return false;
      return true;
    },
  });
}

async function publishSkillDirectory(sourcePath, targetPath, publishMode) {
  if (publishMode === "symlink") {
    await mkdir(path.dirname(targetPath), { recursive: true });
    await symlink(sourcePath, targetPath, "dir");
    return;
  }
  await copySkillDirectory(sourcePath, targetPath, {
    replace: false,
  });
}

async function preparePublishTarget(targetPath) {
  try {
    const info = await lstat(targetPath);
    if (info.isSymbolicLink()) {
      const marker = await readPublishMarker(targetPath);
      if (marker?.manager === "skillsmanager" && marker.status === "managed") {
        await removePublishTarget(targetPath);
        return;
      }
      const error = new Error("Publish target symlink already exists and is not managed by Skills Manager.");
      error.statusCode = 409;
      throw error;
    }
    if (!info.isDirectory()) {
      const error = new Error("Publish target exists and is not a directory.");
      error.statusCode = 409;
      throw error;
    }
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  const marker = await readPublishMarker(targetPath);
  if (marker?.manager === "skillsmanager" && marker.status === "managed") {
    await removePublishTarget(targetPath);
    return;
  }

  const error = new Error("Publish target already exists and is not managed by Skills Manager.");
  error.statusCode = 409;
  throw error;
}

async function removePublishTarget(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
  await rm(getSymlinkMarkerPath(targetPath), { force: true });
}

function getSymlinkMarkerPath(targetPath) {
  return `${targetPath}${SYMLINK_MARKER_SUFFIX}`;
}

async function isSamePath(left, right) {
  try {
    return (await realpath(left)) === (await realpath(right));
  } catch {
    return path.resolve(left) === path.resolve(right);
  }
}

async function pathExists(inputPath) {
  try {
    await lstat(inputPath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function listHashableFiles(skillDir) {
  const files = [];
  const queue = [skillDir];

  while (queue.length > 0) {
    const dir = queue.shift();
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) queue.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name === MARKER_FILE) continue;
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
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

function resolveProfile(profiles, profileId) {
  const profile = profiles.find((item) => item.id === profileId);
  if (!profile) {
    const error = new Error("Agent profile not found.");
    error.statusCode = 404;
    throw error;
  }
  if (profile.enabled === false) {
    const error = new Error("Agent profile is disabled.");
    error.statusCode = 403;
    throw error;
  }
  return profile;
}

function upsertRecord(index, nextRecord) {
  const existingIndex = index.records.findIndex((record) => record.id === nextRecord.id);
  if (existingIndex === -1) {
    index.records.push(nextRecord);
    return nextRecord;
  }

  index.records[existingIndex] = {
    ...index.records[existingIndex],
    ...nextRecord,
    publishedTo: nextRecord.publishedTo || index.records[existingIndex].publishedTo || [],
  };
  return index.records[existingIndex];
}

function upsertPublication(publications, publication) {
  const index = publications.findIndex((item) => item.profileId === publication.profileId);
  if (index === -1) return [...publications, publication];
  const next = [...publications];
  next[index] = publication;
  return next;
}

function removePublicationConflicts(index, { recordId, profileId, targetPath, slug, now }) {
  for (const record of index.records) {
    if (record.id === recordId || !Array.isArray(record.publishedTo)) continue;
    const nextPublications = record.publishedTo.filter((publication) => {
      if (publication.profileId !== profileId) return true;
      if (publication.targetPath === targetPath) return false;
      return path.basename(publication.targetPath || "") !== slug;
    });
    if (nextPublications.length === record.publishedTo.length) continue;
    record.publishedTo = nextPublications;
    record.status = getRecordStatusAfterPublicationChange(record);
    record.updatedAt = now;
  }
}

function getRecordStatusAfterPublicationChange(record) {
  if ((record.publishedTo || []).length > 0) return "managed";
  if (VALID_ADOPTION_STATUSES.has(record.adoptionStatus)) return record.adoptionStatus;
  if (record.sourceType === "local-adoption") return "adopted";
  return "library";
}

function normalizeInvocationMode(mode) {
  if (VALID_INVOCATION_MODES.has(mode)) return mode;
  return "native";
}

function normalizePublishMode(mode) {
  if (VALID_PUBLISH_MODES.has(mode)) return mode;
  return "managed-mirror";
}

function normalizeAdoptionStatus(status) {
  if (VALID_ADOPTION_STATUSES.has(status)) return status;
  return "adopted";
}

function summarizeRisk(risk = {}) {
  const level = ["low", "medium", "high"].includes(risk?.level) ? risk.level : "unknown";
  const findings = Array.isArray(risk?.findings)
    ? risk.findings.map((finding) => ({
        id: String(finding.id || "unknown"),
        level: String(finding.level || "info"),
        label: String(finding.label || finding.id || "Finding"),
      }))
    : [];

  return {
    level,
    findings,
  };
}

function getVersionKey(skill, fingerprint) {
  const version = String(skill.frontmatter?.version || "").trim();
  return slugify(version || fingerprint.slice(0, 12));
}

function slugify(value) {
  return String(value || "skill")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback === null ? null : structuredClone(fallback);
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
