import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getLibraryCatalog } from "./governanceStore.mjs";
import { getProfileSecrets, getRuntimeState } from "./runtimeStore.mjs";
import { scanCatalog } from "./skillScanner.mjs";
import { APP_VERSION, buildHealthPayload, getServiceConfig } from "./serviceStore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PROJECT_ROOT = path.resolve(__dirname, "..");
const EXPORT_FORMAT = "skillsmanager.local-export";
const EXPORT_FORMAT_VERSION = 1;

export async function buildLocalExport(options = {}) {
  const generatedAt = options.generatedAt || new Date().toISOString();
  const projectRoot = path.resolve(options.projectRoot || DEFAULT_PROJECT_ROOT);
  const env = options.env || process.env;
  const runtime = await getRuntimeState({ env });
  const library = await getLibraryCatalog({ env });
  const catalog =
    options.catalog ||
    (await scanCatalog({
      cwd: projectRoot,
      env,
    }));

  return {
    format: EXPORT_FORMAT,
    formatVersion: EXPORT_FORMAT_VERSION,
    generatedAt,
    app: {
      name: "Skills Manager",
      version: APP_VERSION,
      scope: "local-only",
    },
    privacy: {
      includesSecretValues: false,
      includesInvocationPrompts: false,
      includesInvocationOutputs: false,
      includesSkillInstructionBodies: false,
      includesLocalPaths: true,
    },
    health: buildHealthPayload({
      env,
      projectRoot,
      startedAt: options.startedAt || null,
    }),
    service: getServiceConfig({
      env,
      projectRoot,
      port: options.port,
      label: options.label,
    }),
    catalog: summarizeCatalog(catalog),
    library: summarizeLibrary(library),
    runtime: await summarizeRuntime(runtime, { env }),
  };
}

export async function writeLocalExport(options = {}) {
  const bundle = await buildLocalExport(options);
  const targetPath = path.resolve(options.targetPath || defaultExportPath(bundle));
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

  return {
    targetPath,
    generatedAt: bundle.generatedAt,
    format: bundle.format,
    formatVersion: bundle.formatVersion,
    counts: {
      skills: bundle.catalog.counts.skills,
      roots: bundle.catalog.counts.roots,
      records: bundle.library.counts.records,
      runs: bundle.runtime.counts.runs,
      profiles: bundle.runtime.counts.profiles,
    },
  };
}

function summarizeCatalog(catalog) {
  const skills = Array.isArray(catalog.skills) ? catalog.skills : [];
  const roots = Array.isArray(catalog.roots) ? catalog.roots : [];

  return {
    scannedAt: catalog.scannedAt || null,
    counts: {
      skills: skills.length,
      roots: roots.length,
      availableRoots: roots.filter((root) => root.exists && root.readable).length,
      conflicts: skills.filter((skill) => (skill.conflicts || []).length > 1).length,
      highRisk: skills.filter((skill) => skill.risk?.level === "high").length,
      mediumRisk: skills.filter((skill) => skill.risk?.level === "medium").length,
      lowRisk: skills.filter((skill) => skill.risk?.level === "low").length,
    },
    roots: roots.map((root) => ({
      key: root.key,
      label: root.label,
      tool: root.tool,
      path: root.path,
      exists: Boolean(root.exists),
      readable: Boolean(root.readable),
      error: root.error || null,
    })),
    skills: skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      tool: skill.tool,
      rootKey: skill.rootKey,
      rootLabel: skill.rootLabel,
      path: skill.path,
      relativePath: skill.relativePath,
      updatedAt: skill.updatedAt || null,
      version: String(skill.frontmatter?.version || "unversioned"),
      risk: summarizeRisk(skill.risk),
      validation: summarizeValidation(skill.validation),
      files: {
        count: Array.isArray(skill.files) ? skill.files.length : 0,
        executable: (skill.files || []).filter((file) => file.executable).length,
      },
      governance: summarizeSkillManagement(skill.governance),
    })),
  };
}

function summarizeLibrary(library) {
  const records = Array.isArray(library.records) ? library.records : [];

  return {
    home: library.home || null,
    libraryPath: library.libraryPath || null,
    counts: library.counts || {
      records: records.length,
    },
    records: records.map((record) => ({
      id: record.id,
      name: record.name,
      version: record.version,
      versionKey: record.versionKey,
      status: record.status,
      sourceType: record.sourceType || null,
      sourcePath: record.sourcePath || null,
      libraryPath: record.libraryPath || null,
      fingerprint: record.fingerprint || null,
      riskLevel: record.riskLevel || record.risk?.level || "unknown",
      invocationMode: record.invocationMode || "native",
      trust: summarizeTrust(record.trust),
      publishedTo: (record.publishedTo || []).map((target) => ({
        profileId: target.profileId,
        profileName: target.profileName,
        targetPath: target.targetPath,
        publishMode: target.publishMode,
        invocationMode: target.invocationMode,
        publishedAt: target.publishedAt || null,
        updatedAt: target.updatedAt || null,
      })),
      createdAt: record.createdAt || null,
      updatedAt: record.updatedAt || null,
    })),
  };
}

async function summarizeRuntime(runtime, options = {}) {
  const profiles = Array.isArray(runtime.profiles) ? runtime.profiles : [];
  const secrets = [];
  for (const profile of profiles) {
    try {
      secrets.push(await getProfileSecrets(profile.id, options));
    } catch (error) {
      secrets.push({
        profileId: profile.id,
        profileName: profile.name,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    version: runtime.version,
    home: runtime.home,
    counts: runtime.counts || {
      profiles: profiles.length,
      runs: 0,
      locks: 0,
    },
    profiles: profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      adapter: profile.adapter,
      skillRoot: profile.skillRoot,
      enabled: Boolean(profile.enabled),
      publishMode: profile.publishMode,
      secretScope: profile.secretScope || "profile",
    })),
    secretKeys: secrets.map((summary) => ({
      profileId: summary.profileId,
      profileName: summary.profileName,
      secretScope: summary.secretScope || "profile",
      keys: summary.keys || [],
      updatedAt: summary.updatedAt || null,
      error: summary.error || null,
    })),
    locks: (runtime.locks || []).map((lock) => ({
      lockKey: lock.lockKey,
      runId: lock.runId,
      agentId: lock.agentId,
      agentName: lock.agentName,
      skillId: lock.skillId,
      skillName: lock.skillName,
      policy: lock.policy,
      resourceKey: lock.resourceKey,
      acquiredAt: lock.acquiredAt || null,
    })),
    runs: (runtime.runs || []).map((run) => ({
      id: run.id,
      status: run.status,
      agentId: run.agentId,
      agentName: run.agentName,
      skillId: run.skillId,
      skillName: run.skillName,
      skillPath: run.skillPath,
      skillVersion: run.skillVersion,
      invocationMode: run.invocationMode,
      policy: run.policy,
      lockKey: run.lockKey,
      resourceKey: run.resourceKey,
      blockedBy: run.blockedBy,
      createdAt: run.createdAt || null,
      startedAt: run.startedAt || null,
      completedAt: run.completedAt || null,
      runDir: run.runDir,
      execution: run.execution || null,
      eventTypes: (run.events || []).map((event) => event.type),
    })),
  };
}

function summarizeSkillManagement(governance) {
  if (!governance) return null;
  return {
    status: governance.status,
    recordId: governance.recordId || null,
    inLibrary: Boolean(governance.inLibrary),
    invocationMode: governance.invocationMode || "native",
    fingerprint: governance.fingerprint || null,
    libraryPath: governance.libraryPath || null,
    trust: summarizeTrust(governance.trust),
    policy: governance.policy
      ? {
          allowedToPublish: Boolean(governance.policy.allowedToPublish),
          reasons: governance.policy.reasons || [],
        }
      : null,
  };
}

function summarizeRisk(risk) {
  return {
    level: risk?.level || "unknown",
    findings: (risk?.findings || []).map((finding) => ({
      id: finding.id,
      level: finding.level,
      label: finding.label,
    })),
  };
}

function summarizeValidation(validation = []) {
  return validation.map((item) => ({
    level: item.level || "info",
    message: item.message || "",
  }));
}

function summarizeTrust(trust) {
  if (!trust) return { status: "unreviewed" };
  return {
    status: trust.status || "unreviewed",
    reviewer: trust.reviewer || null,
    notes: trust.notes || "",
    reviewedAt: trust.reviewedAt || null,
    updatedAt: trust.updatedAt || null,
  };
}

function defaultExportPath(bundle) {
  const stamp = bundle.generatedAt.replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
  return path.join(bundle.service.managerHome, "exports", `skillsmanager-local-${stamp}.json`);
}
