import { access, lstat, readFile, readdir, realpath } from "node:fs/promises";
import { accessSync, constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";

const SKILL_FILE = "SKILL.md";
const MAX_SCAN_DEPTH = 6;
const MAX_SCRIPT_BYTES = 200_000;
const MAX_FILES_PER_SKILL = 120;
const MAX_BODY_BYTES = 50_000;
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

const SCRIPT_EXTENSIONS = new Set([
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".py",
  ".js",
  ".mjs",
  ".cjs",
  ".ts",
  ".rb",
  ".pl",
  ".ps1",
]);

const RISK_PATTERNS = [
  {
    id: "destructive-delete",
    level: "high",
    label: "Destructive delete command",
    pattern: /\b(rm\s+-[^\n]*r[f]?|rimraf|Remove-Item\b[^\n]*-Recurse)\b/i,
  },
  {
    id: "permission-change",
    level: "medium",
    label: "Permission or ownership change",
    pattern: /\b(chmod|chown|chgrp)\b/i,
  },
  {
    id: "privileged-command",
    level: "high",
    label: "Privileged command",
    pattern: /\b(sudo|su\s+-|launchctl|security\s+find-|security\s+dump-keychain)\b/i,
  },
  {
    id: "network-download",
    level: "medium",
    label: "Network download or upload",
    pattern: /\b(curl|wget|Invoke-WebRequest|fetch\(|XMLHttpRequest|scp|rsync)\b/i,
  },
  {
    id: "secret-access",
    level: "high",
    label: "Secret or credential access",
    pattern: /\b(API_KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY|process\.env|os\.environ|dotenv)\b/i,
  },
  {
    id: "sensitive-path",
    level: "high",
    label: "Sensitive local path reference",
    pattern: /(\.ssh|\.aws|\.gnupg|\.kube|\.config|Keychain|Library\/Keychains|id_rsa|id_ed25519)/i,
  },
  {
    id: "shell-eval",
    level: "high",
    label: "Shell eval or dynamic execution",
    pattern: /\b(eval|exec\(|spawn\(|child_process|subprocess|osascript)\b/i,
  },
];

export function expandHome(inputPath, home = os.homedir()) {
  if (!inputPath) return inputPath;
  if (inputPath === "~") return home;
  if (inputPath.startsWith("~/")) return path.join(home, inputPath.slice(2));
  return inputPath;
}

export function getDefaultRoots({ cwd = process.cwd(), env = process.env } = {}) {
  const home = os.homedir();
  const codexHome = env.CODEX_HOME || path.join(home, ".codex");
  const roots = [
    {
      key: "claude-personal",
      label: "Claude Code personal",
      tool: "Claude Code",
      path: path.join(home, ".claude", "skills"),
    },
    {
      key: "codex-home",
      label: "Codex home",
      tool: "Codex",
      path: path.join(codexHome, "skills"),
    },
    {
      key: "openclaw-managed",
      label: "OpenClaw folder",
      tool: "OpenClaw",
      path: path.join(home, ".openclaw", "skills"),
    },
    {
      key: "agents-personal",
      label: "Personal agent skills",
      tool: "Agent Skills",
      path: path.join(home, ".agents", "skills"),
    },
    {
      key: "project-skills",
      label: "Project skills",
      tool: "Generic",
      path: path.join(cwd, "skills"),
    },
    {
      key: "project-claude",
      label: "Project Claude Code",
      tool: "Claude Code",
      path: path.join(cwd, ".claude", "skills"),
    },
    {
      key: "project-codex",
      label: "Project Codex",
      tool: "Codex",
      path: path.join(cwd, ".codex", "skills"),
    },
    {
      key: "project-agents",
      label: "Project agent skills",
      tool: "Agent Skills",
      path: path.join(cwd, ".agents", "skills"),
    },
  ];

  const extraRoots = (env.SKILLSMANGER_EXTRA_ROOTS || "")
    .split(path.delimiter)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => ({
      key: `extra-${index + 1}`,
      label: `Extra root ${index + 1}`,
      tool: "Generic",
      path: expandHome(item, home),
    }));

  return dedupeRoots([...roots, ...extraRoots]);
}

export async function scanCatalog(options = {}) {
  const roots = getDefaultRoots(options);
  const scannedRoots = [];
  const skills = [];

  for (const root of roots) {
    const rootStatus = await inspectRoot(root);
    scannedRoots.push(rootStatus);
    if (!rootStatus.exists || !rootStatus.readable) continue;

    const skillDirs = await findSkillDirs(rootStatus.realPath, MAX_SCAN_DEPTH);
    for (const skillDir of skillDirs) {
      const skill = await readSkill(skillDir, rootStatus);
      skills.push(skill);
    }
  }

  const conflicts = findConflicts(skills);
  for (const skill of skills) {
    skill.conflicts = conflicts.get(skill.name) || [];
    if (skill.conflicts.length > 1) {
      skill.validation.push({
        level: "warning",
        message: `Name conflict with ${skill.conflicts.length - 1} other skill(s).`,
      });
    }
  }

  const sortedSkills = skills.sort((a, b) => {
    const riskDelta = riskRank(b.risk.level) - riskRank(a.risk.level);
    if (riskDelta !== 0) return riskDelta;
    return a.name.localeCompare(b.name);
  });

  return {
    scannedAt: new Date().toISOString(),
    roots: scannedRoots,
    skills: sortedSkills,
    counts: buildCounts(scannedRoots, sortedSkills),
  };
}

export function parseSkillMarkdown(markdown, fallbackName = "unknown-skill") {
  const normalized = markdown.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return {
      frontmatter: {},
      frontmatterRaw: "",
      body: normalized,
      validation: [
        {
          level: "warning",
          message: "Missing YAML frontmatter.",
        },
      ],
      name: fallbackName,
      description: "",
    };
  }

  const closeIndex = normalized.indexOf("\n---", 4);
  if (closeIndex === -1) {
    return {
      frontmatter: {},
      frontmatterRaw: "",
      body: normalized,
      validation: [
        {
          level: "error",
          message: "Unclosed YAML frontmatter.",
        },
      ],
      name: fallbackName,
      description: "",
    };
  }

  const frontmatterRaw = normalized.slice(4, closeIndex).trim();
  const body = normalized.slice(closeIndex + 4).trimStart();
  const frontmatter = parseSimpleFrontmatter(frontmatterRaw);
  const validation = [];
  const name = String(frontmatter.name || fallbackName).trim();
  const description = String(frontmatter.description || "").trim();

  if (!frontmatter.name) {
    validation.push({
      level: "warning",
      message: "Missing required frontmatter field: name.",
    });
  }
  if (!description) {
    validation.push({
      level: "warning",
      message: "Missing required frontmatter field: description.",
    });
  }

  return {
    frontmatter,
    frontmatterRaw,
    body,
    validation,
    name,
    description,
  };
}

export function scanRisk({ skillText = "", files = [] } = {}) {
  const findings = [];
  const combined = [skillText, ...files.map((file) => file.preview || "")].join("\n\n");

  for (const riskPattern of RISK_PATTERNS) {
    if (riskPattern.pattern.test(combined)) {
      findings.push({
        id: riskPattern.id,
        level: riskPattern.level,
        label: riskPattern.label,
      });
    }
  }

  if (/^\s*!\s*`?[^`\n]+`?/m.test(skillText)) {
    findings.push({
      id: "dynamic-context-command",
      level: "medium",
      label: "Dynamic command injection in SKILL.md",
    });
  }

  const scriptFiles = files.filter((file) => file.kind === "script");
  if (scriptFiles.length > 0) {
    findings.push({
      id: "bundled-scripts",
      level: scriptFiles.some((file) => file.executable) ? "medium" : "low",
      label: `${scriptFiles.length} bundled script file(s)`,
    });
  }

  const strongest = findings.reduce((level, finding) => {
    return riskRank(finding.level) > riskRank(level) ? finding.level : level;
  }, "low");

  return {
    level: findings.length === 0 ? "low" : strongest,
    findings: uniqueFindings(findings),
  };
}

function parseSimpleFrontmatter(raw) {
  const frontmatter = {};
  for (const line of raw.split("\n")) {
    if (/^\s/.test(line)) continue;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }
  return frontmatter;
}

async function inspectRoot(root) {
  const absolutePath = path.resolve(expandHome(root.path));
  const status = {
    ...root,
    path: absolutePath,
    exists: false,
    readable: false,
    realPath: null,
    error: null,
  };

  try {
    const info = await lstat(absolutePath);
    status.exists = info.isDirectory();
    if (!status.exists) return status;
    status.realPath = await realpath(absolutePath);
    await access(status.realPath, constants.R_OK);
    status.readable = true;
  } catch (error) {
    status.error = error.message;
  }

  return status;
}

async function findSkillDirs(rootPath, maxDepth) {
  const found = [];
  const queue = [{ dir: rootPath, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth > maxDepth) continue;

    let entries;
    try {
      entries = await readdir(current.dir, { withFileTypes: true });
    } catch {
      continue;
    }

    if (entries.some((entry) => entry.isFile() && entry.name === SKILL_FILE)) {
      found.push(current.dir);
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (SKIP_DIRS.has(entry.name)) continue;
      queue.push({
        dir: path.join(current.dir, entry.name),
        depth: current.depth + 1,
      });
    }
  }

  return found;
}

export async function readSkill(skillDir, root) {
  const skillPath = path.join(skillDir, SKILL_FILE);
  const markdown = await readFile(skillPath, "utf8");
  const fallbackName = path.basename(skillDir);
  const parsed = parseSkillMarkdown(markdown, fallbackName);
  const files = await listSkillFiles(skillDir);
  const risk = scanRisk({
    skillText: markdown,
    files,
  });
  const publicFiles = files.map(({ preview, ...file }) => file);
  const dependencies = extractDependencyHints(parsed.frontmatterRaw, parsed.body);
  const relativePath = toPosixPath(path.relative(root.realPath, skillDir) || ".");
  const body = trimText(parsed.body, MAX_BODY_BYTES);

  return {
    id: hashId(skillDir),
    name: parsed.name,
    description: parsed.description,
    tool: root.tool,
    rootKey: root.key,
    rootLabel: root.label,
    rootPath: root.path,
    path: skillDir,
    relativePath,
    updatedAt: await getUpdatedAt(skillPath),
    frontmatter: parsed.frontmatter,
    frontmatterRaw: parsed.frontmatterRaw,
    body,
    bodyTruncated: body.length < parsed.body.length,
    validation: parsed.validation,
    files: publicFiles,
    risk,
    dependencies,
    conflicts: [],
  };
}

function trimText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength);
}

async function listSkillFiles(skillDir) {
  const files = [];
  const queue = [{ dir: skillDir, depth: 0 }];

  while (queue.length > 0 && files.length < MAX_FILES_PER_SKILL) {
    const current = queue.shift();
    let entries;
    try {
      entries = await readdir(current.dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current.dir, entry.name);
      const relativePath = toPosixPath(path.relative(skillDir, fullPath));
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && current.depth < 4) {
          queue.push({ dir: fullPath, depth: current.depth + 1 });
        }
        continue;
      }
      if (!entry.isFile()) continue;

      const info = await lstat(fullPath);
      const extension = path.extname(entry.name);
      const isScript = relativePath.startsWith("scripts/") || SCRIPT_EXTENSIONS.has(extension);
      const file = {
        path: relativePath,
        size: info.size,
        executable: Boolean(info.mode & constants.X_OK),
        kind: entry.name === SKILL_FILE ? "skill" : isScript ? "script" : "resource",
        preview: "",
      };

      if (file.kind === "script" && info.size <= MAX_SCRIPT_BYTES) {
        try {
          file.preview = await readFile(fullPath, "utf8");
        } catch {
          file.preview = "";
        }
      }

      files.push(file);
    }
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function toPosixPath(relativePath) {
  return String(relativePath).split(path.sep).join("/");
}

async function getUpdatedAt(filePath) {
  try {
    const info = await lstat(filePath);
    return info.mtime.toISOString();
  } catch {
    return null;
  }
}

function extractDependencyHints(frontmatterRaw, body) {
  const text = `${frontmatterRaw}\n${body}`;
  const bins = new Set();
  for (const match of text.matchAll(/"bins"\s*:\s*\[([^\]]*)\]/g)) {
    for (const bin of extractQuotedItems(match[1])) bins.add(bin);
  }
  for (const match of text.matchAll(/requires\.bins\s*:\s*\[([^\]]*)\]/g)) {
    for (const bin of extractQuotedItems(match[1])) bins.add(bin);
  }

  return [...bins].sort().map((bin) => ({
    name: bin,
    installed: isOnPath(bin),
  }));
}

function extractQuotedItems(input) {
  return [...input.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
}

function isOnPath(binaryName) {
  if (!binaryName || binaryName.includes(path.sep)) return false;
  const dirs = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  return dirs.some((dir) => {
    try {
      accessSync(path.join(dir, binaryName), constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });
}

function findConflicts(skills) {
  const byName = new Map();
  for (const skill of skills) {
    const normalizedName = skill.name.toLowerCase();
    if (!byName.has(normalizedName)) byName.set(normalizedName, []);
    byName.get(normalizedName).push({
      id: skill.id,
      path: skill.path,
      rootLabel: skill.rootLabel,
    });
  }
  return byName;
}

function buildCounts(roots, skills) {
  return {
    roots: roots.length,
    availableRoots: roots.filter((root) => root.exists && root.readable).length,
    skills: skills.length,
    highRisk: skills.filter((skill) => skill.risk.level === "high").length,
    mediumRisk: skills.filter((skill) => skill.risk.level === "medium").length,
    lowRisk: skills.filter((skill) => skill.risk.level === "low").length,
    conflicts: skills.filter((skill) => skill.conflicts.length > 1).length,
  };
}

function dedupeRoots(roots) {
  const seen = new Set();
  const result = [];
  for (const root of roots) {
    const rootPath = path.resolve(expandHome(root.path));
    if (seen.has(rootPath)) continue;
    seen.add(rootPath);
    result.push({ ...root, path: rootPath });
  }
  return result;
}

function uniqueFindings(findings) {
  const seen = new Set();
  const result = [];
  for (const finding of findings) {
    if (seen.has(finding.id)) continue;
    seen.add(finding.id);
    result.push(finding);
  }
  return result.sort((a, b) => riskRank(b.level) - riskRank(a.level));
}

function riskRank(level) {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

function hashId(input) {
  return createHash("sha1").update(input).digest("hex").slice(0, 16);
}
