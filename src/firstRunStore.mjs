import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { adoptSkill } from "./governanceStore.mjs";
import { getManagerHome } from "./runtimeStore.mjs";

const FIRST_RUN_FILE = "first-run.json";
const STATE_VERSION = 1;
const VALID_INVOCATION_MODES = new Set(["native", "managed", "hybrid"]);

export async function getFirstRunImport(catalog, options = {}) {
  const home = getManagerHome(options);
  const state = await readFirstRunState(home);
  const summary = buildFirstRunSummary(catalog);

  return {
    version: STATE_VERSION,
    home,
    isFirstRun: !state.completedAt,
    completedAt: state.completedAt || null,
    updatedAt: state.updatedAt || null,
    scannedAt: catalog.scannedAt,
    ...summary,
  };
}

export async function adoptFirstRunSkills(catalog, request = {}, options = {}) {
  const mode = request.mode === "low-risk" ? "low-risk" : "selected";
  const invocationMode = normalizeInvocationMode(request.invocationMode);
  const requestedIds = new Set(
    Array.isArray(request.skillIds) ? request.skillIds.map((id) => String(id)) : [],
  );

  if (mode === "selected" && requestedIds.size === 0) {
    const error = new Error("Select at least one skill to adopt.");
    error.statusCode = 400;
    throw error;
  }

  const skills = catalog.skills || [];
  const outcomes = [];
  for (const skill of skills) {
    if (mode === "selected" && !requestedIds.has(skill.id)) continue;
    if (mode === "low-risk" && skill.risk?.level !== "low") continue;

    if (!canAdoptExisting(skill)) {
      outcomes.push({
        skillId: skill.id,
        name: skill.name,
        status: "skipped",
        reason: `already ${skill.governance?.status || "managed"}`,
      });
      continue;
    }

    const adopted = await adoptSkill(
      catalog,
      skill.id,
      {
        adoptionStatus: "adopted-existing",
        invocationMode,
        sourceType: "first-run-import",
        writeSourceMarker: false,
      },
      options,
    );

    outcomes.push({
      skillId: skill.id,
      name: skill.name,
      status: "adopted-existing",
      recordId: adopted.record.id,
      risk: skill.risk?.level || "low",
      reviewRequired: skill.risk?.level === "high",
    });
  }

  return {
    mode,
    invocationMode,
    outcomes,
    counts: {
      adopted: outcomes.filter((item) => item.status === "adopted-existing").length,
      skipped: outcomes.filter((item) => item.status === "skipped").length,
    },
  };
}

export async function completeFirstRunImport(request = {}, options = {}) {
  const home = getManagerHome(options);
  const previous = await readFirstRunState(home);
  const now = new Date().toISOString();
  const next = {
    ...previous,
    version: STATE_VERSION,
    completedAt: previous.completedAt || now,
    updatedAt: now,
    note: String(request.note || previous.note || ""),
  };
  await writeFirstRunState(home, next);
  return next;
}

function buildFirstRunSummary(catalog) {
  const roots = new Map();
  for (const root of catalog.roots || []) {
    roots.set(root.key, {
      key: root.key,
      label: root.label,
      tool: root.tool,
      path: root.path,
      exists: root.exists,
      readable: root.readable,
      total: 0,
      adoptable: 0,
      adoptedExisting: 0,
      managed: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
    });
  }

  const skills = (catalog.skills || []).map((skill) => {
    const importSkill = toImportSkill(skill);
    if (!roots.has(skill.rootKey)) {
      roots.set(skill.rootKey, {
        key: skill.rootKey,
        label: skill.rootLabel,
        tool: skill.tool,
        path: skill.rootPath,
        exists: true,
        readable: true,
        total: 0,
        adoptable: 0,
        adoptedExisting: 0,
        managed: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
      });
    }

    const root = roots.get(skill.rootKey);
    root.total += 1;
    if (importSkill.canAdopt) root.adoptable += 1;
    if (importSkill.importStatus === "adopted-existing") root.adoptedExisting += 1;
    if (importSkill.importStatus === "managed") root.managed += 1;
    if (importSkill.risk.level === "high") root.highRisk += 1;
    if (importSkill.risk.level === "medium") root.mediumRisk += 1;
    if (importSkill.risk.level === "low") root.lowRisk += 1;

    return importSkill;
  });

  return {
    summary: {
      totalSkills: skills.length,
      adoptable: skills.filter((skill) => skill.canAdopt).length,
      lowRiskAdoptable: skills.filter((skill) => skill.canAdopt && skill.risk.level === "low")
        .length,
      reviewRequired: skills.filter((skill) => skill.canAdopt && skill.risk.level === "high")
        .length,
      adoptedExisting: skills.filter((skill) => skill.importStatus === "adopted-existing").length,
      managed: skills.filter((skill) => skill.importStatus === "managed").length,
    },
    roots: [...roots.values()],
    skills,
  };
}

function toImportSkill(skill) {
  const governanceStatus = skill.governance?.status || "unmanaged";
  const canAdopt = canAdoptExisting(skill);
  const importStatus = canAdopt ? "ready" : governanceStatus;

  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    tool: skill.tool,
    rootKey: skill.rootKey,
    rootLabel: skill.rootLabel,
    rootPath: skill.rootPath,
    path: skill.path,
    relativePath: skill.relativePath,
    risk: {
      level: skill.risk?.level || "low",
      findings: skill.risk?.findings || [],
    },
    governance: {
      status: governanceStatus,
      recordId: skill.governance?.recordId || null,
      inLibrary: Boolean(skill.governance?.inLibrary),
    },
    importStatus,
    canAdopt,
    reviewRequired: canAdopt && skill.risk?.level === "high",
  };
}

function canAdoptExisting(skill) {
  return (skill.governance?.status || "unmanaged") === "unmanaged";
}

async function readFirstRunState(home) {
  try {
    return JSON.parse(await readFile(path.join(home, FIRST_RUN_FILE), "utf8"));
  } catch {
    return {
      version: STATE_VERSION,
      completedAt: null,
      updatedAt: null,
    };
  }
}

async function writeFirstRunState(home, payload) {
  await mkdir(home, { recursive: true });
  await writeFile(path.join(home, FIRST_RUN_FILE), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function normalizeInvocationMode(mode) {
  if (VALID_INVOCATION_MODES.has(mode)) return mode;
  return "native";
}
