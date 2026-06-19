import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { access, lstat, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import {
  fingerprintSkillDir,
  getLibraryCatalog,
  installLibrarySkillFromPath,
} from "./governanceStore.mjs";
import { expandHome, parseSkillMarkdown, scanRisk } from "./skillScanner.mjs";

const execFileAsync = promisify(execFile);
const MAX_SCAN_DEPTH = 5;
const MAX_FILES = 120;
const MAX_SCRIPT_BYTES = 120_000;
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
const COMPARABLE_SKIP_FILES = new Set([".skillsmanager.json", "origin.json"]);

export async function previewSkillSource(request = {}, options = {}) {
  const prepared = await prepareSource(request, options);
  try {
    return await buildPreview(prepared, options);
  } finally {
    await prepared.cleanup();
  }
}

export async function installSkillSource(request = {}, options = {}) {
  const prepared = await prepareSource(request, options);
  try {
    const preview = await buildPreview(prepared, options);
    if (
      preview.libraryRecord?.exists &&
      preview.libraryRecord.fingerprint !== preview.fingerprint &&
      !request.replace
    ) {
      const error = new Error(
        "A library record with the same skill name and version already exists with different content. Preview the diff and pass replace=true to update it.",
      );
      error.statusCode = 409;
      error.code = "LIBRARY_RECORD_DIFFERS";
      error.record = preview.libraryRecord;
      error.diff = preview.diff;
      throw error;
    }
    const install = await installLibrarySkillFromPath(
      prepared.skillPath,
      {
        sourceType: prepared.sourceType,
        source: prepared.origin,
        risk: preview.risk,
        invocationMode: request.invocationMode || "native",
        replace: request.replace,
      },
      options,
    );
    return {
      preview,
      install,
    };
  } finally {
    await prepared.cleanup();
  }
}

async function prepareSource(request, options) {
  const source = normalizeSourceRequest(request);
  if (source.sourceType === "local") {
    return prepareLocalSource(source);
  }
  if (source.sourceType === "git" || source.sourceType === "github") {
    return prepareGitSource(source, options);
  }
  if (source.sourceType === "webpage") {
    return prepareWebpageSource(source, options);
  }
  if (source.sourceType === "archive") {
    return prepareArchiveSource(source);
  }
  const error = new Error(`Unsupported source type: ${source.sourceType}`);
  error.statusCode = 400;
  throw error;
}

function normalizeSourceRequest(request) {
  const sourceValue = String(request.source || request.sourceUrl || request.sourcePath || "").trim();
  if (!sourceValue) {
    const error = new Error("Source is required.");
    error.statusCode = 400;
    throw error;
  }

  const sourceType =
    request.sourceType ||
    (isSkillPageSource(sourceValue)
      ? "webpage"
      : isArchiveSource(sourceValue)
      ? "archive"
      : isGitSource(sourceValue)
        ? inferGitSourceType(sourceValue)
        : isWebpageSource(sourceValue)
          ? "webpage"
        : "local");

  return {
    sourceType,
    source: sourceValue,
    ref: String(request.ref || "").trim(),
    subdir: String(request.subdir || "").trim(),
    pin: normalizePinMode(request.pin),
  };
}

async function prepareLocalSource(source) {
  const rootPath = path.resolve(expandHome(source.source));
  await assertReadableDirectory(rootPath);
  const skillPath = await resolveSkillPath(rootPath, source.subdir);
  return {
    sourceType: "local",
    rootPath,
    skillPath,
    origin: {
      type: "local",
      path: rootPath,
      subdir: source.subdir || null,
    },
    cleanup: async () => {},
  };
}

async function prepareGitSource(source) {
  const repoUrl = normalizeGitUrl(source.source);
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-git-"));
  const cloneDir = path.join(tempRoot, "repo");
  const args = ["clone", "--depth", "1"];
  const refLooksLikeCommit = looksLikeCommitSha(source.ref);
  if (source.ref && !refLooksLikeCommit) args.push("--branch", source.ref);
  args.push(repoUrl, cloneDir);

  try {
    await execFileAsync("git", args, {
      timeout: 120_000,
      maxBuffer: 1024 * 1024,
    });
    if (source.ref && refLooksLikeCommit) {
      await execFileAsync("git", ["-C", cloneDir, "fetch", "--depth", "1", "origin", source.ref], {
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      });
      await execFileAsync("git", ["-C", cloneDir, "checkout", "--detach", source.ref], {
        timeout: 120_000,
        maxBuffer: 1024 * 1024,
      });
    }
    const resolvedCommit = await readGitOutput(cloneDir, ["rev-parse", "HEAD"]);
    const resolvedTag = await readOptionalGitOutput(cloneDir, [
      "describe",
      "--tags",
      "--exact-match",
      "HEAD",
    ]);
    const currentBranch = await readOptionalGitOutput(cloneDir, ["branch", "--show-current"]);
    if (source.pin === "tag" && !resolvedTag) {
      const error = new Error("Selected Git ref is not an exact tag. Choose a tag or pin the commit.");
      error.statusCode = 400;
      error.code = "GITHUB_REF_NOT_TAG";
      throw error;
    }
    const skillPath = await resolveSkillPath(cloneDir, source.subdir, source.subdirCandidates);
    return {
      sourceType: source.sourceType === "github" ? "github" : "git",
      rootPath: cloneDir,
      skillPath,
      origin: {
        type: source.sourceType === "github" ? "github" : "git",
        url: repoUrl,
        ref: source.pin === "commit" ? resolvedCommit : source.ref || null,
        requestedRef: source.ref || null,
        resolvedCommit,
        resolvedShortCommit: resolvedCommit.slice(0, 12),
        resolvedTag,
        currentBranch,
        pinned: source.pin !== "none" || refLooksLikeCommit,
        pinType: source.pin !== "none" ? source.pin : refLooksLikeCommit ? "commit" : null,
        pinnedRef:
          source.pin === "commit"
            ? resolvedCommit
            : source.pin === "tag"
              ? resolvedTag
              : refLooksLikeCommit
                ? resolvedCommit
                : null,
        subdir: source.subdir || null,
        sourcePage: source.sourcePage || null,
        marketplaceSkill: source.marketplaceSkill || null,
      },
      cleanup: async () => {
        await rm(tempRoot, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    if (error.statusCode) throw error;
    const wrapped = new Error(`Failed to prepare Git source: ${error.message}`);
    wrapped.statusCode = 502;
    wrapped.code = "GIT_SOURCE_PREPARE_FAILED";
    wrapped.hint = "Check network access, repository URL, credentials, ref, and skill folder.";
    throw wrapped;
  }
}

async function prepareWebpageSource(source, options) {
  const response = await fetch(source.source);
  if (!response.ok) {
    const error = new Error(`Skill page download failed: ${response.status}`);
    error.statusCode = 502;
    error.code = "WEBPAGE_SOURCE_FETCH_FAILED";
    throw error;
  }
  const html = await response.text();
  const resolved = resolveWebpageSkillSource(html, source.source);
  if (!resolved) {
    const error = new Error("This page does not expose a supported Git, GitHub, or archive skill source.");
    error.statusCode = 400;
    error.code = "WEBPAGE_SOURCE_UNSUPPORTED";
    error.hint = "Paste a GitHub repository, Git URL, local folder, or downloadable .zip/.tar source instead.";
    throw error;
  }
  if (resolved.sourceType === "archive") {
    return prepareArchiveSource({
      sourceType: "archive",
      source: resolved.source,
      subdir: source.subdir || resolved.subdir || "",
    });
  }
  return prepareGitSource(
    {
      sourceType: inferGitSourceType(resolved.source),
      source: resolved.source,
      ref: source.ref || resolved.ref || "",
      subdir: source.subdir || resolved.subdir || "",
      pin: source.pin,
      subdirCandidates: resolved.subdirCandidates,
      sourcePage: source.source,
      marketplaceSkill: resolved.skillName || null,
    },
    options,
  );
}

async function prepareArchiveSource(source) {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-archive-"));
  const extractDir = path.join(tempRoot, "extract");
  const archivePath = await prepareArchiveFile(source.source, tempRoot);
  try {
    await mkdir(extractDir, { recursive: true });
    await validateArchiveEntries(archivePath);
    await extractArchive(archivePath, extractDir);
    const skillPath = await resolveSkillPath(extractDir, source.subdir);
    const isRemote = isRemoteArchiveUrl(source.source);
    return {
      sourceType: "archive",
      rootPath: extractDir,
      skillPath,
      origin: {
        type: "archive",
        [isRemote ? "url" : "path"]: isRemote ? source.source : sourceToLocalPath(source.source),
        subdir: source.subdir || null,
      },
      cleanup: async () => {
        await rm(tempRoot, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    if (error.statusCode) throw error;
    const wrapped = new Error(`Failed to prepare archive source: ${error.message}`);
    wrapped.statusCode = 400;
    wrapped.code = "ARCHIVE_SOURCE_PREPARE_FAILED";
    throw wrapped;
  }
}

async function buildPreview(prepared, options) {
  const skillFile = path.join(prepared.skillPath, "SKILL.md");
  const markdown = await readFile(skillFile, "utf8");
  const parsed = parseSkillMarkdown(markdown, path.basename(prepared.skillPath));
  const files = await listSourceFiles(prepared.skillPath);
  const fingerprint = await fingerprintSkillDir(prepared.skillPath);
  const risk = scanRisk({
    skillText: markdown,
    files,
  });
  const version = String(parsed.frontmatter?.version || "unversioned");
  const libraryRecord = await findMatchingLibraryRecord(parsed.name, version, options);
  const diff =
    libraryRecord.exists && libraryRecord.fingerprint !== fingerprint
      ? await diffSkillDirectories(libraryRecord.libraryPath, prepared.skillPath)
      : null;

  return {
    sourceType: prepared.sourceType,
    origin: prepared.origin,
    skillPath: prepared.skillPath,
    name: parsed.name,
    description: parsed.description,
    version,
    fingerprint,
    risk,
    libraryRecord,
    diff,
    validation: parsed.validation,
    files: files.map(({ preview, ...file }) => file),
    frontmatter: parsed.frontmatter,
    frontmatterRaw: parsed.frontmatterRaw,
    bodyPreview: parsed.body.slice(0, 3000),
  };
}

async function findMatchingLibraryRecord(name, version, options) {
  const library = await getLibraryCatalog(options);
  const record = library.records.find((item) => item.name === name && item.version === version);
  if (!record) {
    return {
      exists: false,
      id: null,
    };
  }

  return {
    exists: true,
    id: record.id,
    name: record.name,
    version: record.version,
    fingerprint: record.fingerprint,
    libraryPath: record.libraryPath,
    sourceType: record.sourceType,
    source: record.source || {},
    riskLevel: record.riskLevel || record.risk?.level || "unknown",
    trustStatus: record.trust?.status || "unreviewed",
    status: record.status,
    updatedAt: record.updatedAt || record.installedAt || null,
    publications: (record.publishedTo || []).length,
  };
}

async function diffSkillDirectories(previousPath, nextPath) {
  const previous = await buildComparableFileMap(previousPath);
  const next = await buildComparableFileMap(nextPath);
  const allPaths = [...new Set([...previous.keys(), ...next.keys()])].sort((a, b) =>
    a.localeCompare(b),
  );
  const added = [];
  const removed = [];
  const modified = [];
  let unchanged = 0;

  for (const filePath of allPaths) {
    const previousFile = previous.get(filePath);
    const nextFile = next.get(filePath);
    if (!previousFile && nextFile) {
      added.push(nextFile);
      continue;
    }
    if (previousFile && !nextFile) {
      removed.push(previousFile);
      continue;
    }
    if (previousFile.hash !== nextFile.hash) {
      modified.push({
        path: filePath,
        previousSize: previousFile.size,
        nextSize: nextFile.size,
      });
      continue;
    }
    unchanged += 1;
  }

  return {
    changed: added.length + removed.length + modified.length,
    added,
    removed,
    modified,
    unchanged,
  };
}

async function buildComparableFileMap(rootPath) {
  const files = new Map();
  const queue = [rootPath];

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
      const relativePath = path.relative(rootPath, fullPath);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) queue.push(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (COMPARABLE_SKIP_FILES.has(entry.name)) continue;

      const body = await readFile(fullPath);
      files.set(relativePath, {
        path: relativePath,
        size: body.length,
        hash: createHash("sha256").update(body).digest("hex"),
      });
    }
  }

  return files;
}

async function resolveSkillPath(rootPath, subdir, subdirCandidates = []) {
  const candidate = subdir ? path.resolve(rootPath, subdir) : rootPath;
  if (candidate !== rootPath && !candidate.startsWith(`${rootPath}${path.sep}`)) {
    const error = new Error("Subdirectory escapes source root.");
    error.statusCode = 400;
    throw error;
  }
  await assertReadableDirectory(candidate);

  try {
    await access(path.join(candidate, "SKILL.md"), constants.R_OK);
    return candidate;
  } catch {
    if (subdir) {
      const error = new Error("Selected subdirectory does not contain SKILL.md.");
      error.statusCode = 400;
      throw error;
    }
  }

  for (const subdirCandidate of subdirCandidates || []) {
    const found = await tryResolveSkillSubdir(rootPath, subdirCandidate);
    if (found) return found;
  }

  const found = await findFirstSkillDir(candidate);
  if (!found) {
    const error = new Error("No SKILL.md found in source.");
    error.statusCode = 400;
    throw error;
  }
  return found;
}

async function tryResolveSkillSubdir(rootPath, subdir) {
  if (!subdir) return null;
  const candidate = path.resolve(rootPath, subdir);
  if (candidate !== rootPath && !candidate.startsWith(`${rootPath}${path.sep}`)) return null;
  try {
    await access(path.join(candidate, "SKILL.md"), constants.R_OK);
    return candidate;
  } catch {
    return null;
  }
}

async function findFirstSkillDir(rootPath) {
  const queue = [{ dir: rootPath, depth: 0 }];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.depth > MAX_SCAN_DEPTH) continue;
    let entries;
    try {
      entries = await readdir(current.dir, { withFileTypes: true });
    } catch {
      continue;
    }
    if (entries.some((entry) => entry.isFile() && entry.name === "SKILL.md")) {
      return current.dir;
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
  return null;
}

async function listSourceFiles(skillPath) {
  const files = [];
  const queue = [{ dir: skillPath, depth: 0 }];

  while (queue.length > 0 && files.length < MAX_FILES) {
    const current = queue.shift();
    let entries;
    try {
      entries = await readdir(current.dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current.dir, entry.name);
      const relativePath = path.relative(skillPath, fullPath);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name) && current.depth < 4) {
          queue.push({ dir: fullPath, depth: current.depth + 1 });
        }
        continue;
      }
      if (!entry.isFile()) continue;

      const info = await lstat(fullPath);
      const extension = path.extname(entry.name);
      const isScript =
        relativePath.startsWith(`scripts${path.sep}`) || SCRIPT_EXTENSIONS.has(extension);
      const file = {
        path: relativePath,
        size: info.size,
        executable: Boolean(info.mode & constants.X_OK),
        kind: entry.name === "SKILL.md" ? "skill" : isScript ? "script" : "resource",
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

async function assertReadableDirectory(inputPath) {
  const info = await lstat(inputPath);
  if (!info.isDirectory()) {
    const error = new Error("Source path is not a directory.");
    error.statusCode = 400;
    throw error;
  }
  await access(inputPath, constants.R_OK);
}

async function assertReadableFile(inputPath) {
  const info = await lstat(inputPath);
  if (!info.isFile()) {
    const error = new Error("Source archive is not a file.");
    error.statusCode = 400;
    throw error;
  }
  await access(inputPath, constants.R_OK);
}

async function prepareArchiveFile(source, tempRoot) {
  if (isRemoteArchiveUrl(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      const error = new Error(`Archive download failed: ${response.status}`);
      error.statusCode = 502;
      throw error;
    }
    const archivePath = path.join(tempRoot, archiveFileName(source));
    const body = Buffer.from(await response.arrayBuffer());
    await writeFile(archivePath, body);
    return archivePath;
  }
  const archivePath = sourceToLocalPath(source);
  await assertReadableFile(archivePath);
  return archivePath;
}

function sourceToLocalPath(source) {
  if (/^file:\/\//i.test(source)) return fileURLToPath(source);
  return path.resolve(expandHome(source));
}

async function validateArchiveEntries(archivePath) {
  const entries = await listArchiveEntries(archivePath);
  for (const entry of entries) {
    const normalized = path.posix.normalize(entry.replace(/\\/g, "/"));
    if (
      !normalized ||
      normalized === "." ||
      normalized.startsWith("../") ||
      normalized.includes("/../") ||
      path.posix.isAbsolute(normalized)
    ) {
      const error = new Error("Archive contains an unsafe path.");
      error.statusCode = 400;
      throw error;
    }
  }
}

async function listArchiveEntries(archivePath) {
  if (isZipArchive(archivePath)) {
    const { stdout } = await execFileAsync("unzip", ["-Z1", archivePath], {
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });
    return stdout.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  if (isTarArchive(archivePath)) {
    const { stdout } = await execFileAsync("tar", ["-tf", archivePath], {
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });
    return stdout.split("\n").map((line) => line.trim()).filter(Boolean);
  }
  const error = new Error("Unsupported archive format.");
  error.statusCode = 400;
  throw error;
}

async function extractArchive(archivePath, extractDir) {
  if (isZipArchive(archivePath)) {
    await execFileAsync("unzip", ["-q", archivePath, "-d", extractDir], {
      timeout: 120_000,
      maxBuffer: 1024 * 1024,
    });
    return;
  }
  if (isTarArchive(archivePath)) {
    await execFileAsync("tar", ["-xf", archivePath, "-C", extractDir], {
      timeout: 120_000,
      maxBuffer: 1024 * 1024,
    });
    return;
  }
  const error = new Error("Unsupported archive format.");
  error.statusCode = 400;
  throw error;
}

function isArchiveSource(source) {
  const name = archiveFileName(source).toLowerCase();
  return isArchiveName(name);
}

function isWebpageSource(source) {
  return /^https?:\/\//i.test(source);
}

function isSkillPageSource(source) {
  try {
    const url = new URL(source);
    return ["skillsmp.com", "www.skillsmp.com"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function resolveWebpageSkillSource(html, pageUrl) {
  const text = String(html || "");
  const installCommand = extractSkillsInstallCommand(text);
  if (installCommand) return installCommand;

  const archiveUrl = extractArchiveUrl(text, pageUrl);
  if (archiveUrl) {
    return {
      sourceType: "archive",
      source: archiveUrl,
    };
  }

  const gitUrl = extractGitUrl(text);
  if (!gitUrl) return null;
  return {
    sourceType: inferGitSourceType(gitUrl),
    source: gitUrl,
  };
}

function extractSkillsInstallCommand(text) {
  const commandMatch = text.match(
    /\bskills\s+add\s+([^\s"'`<>]+)(?:\s+--skill\s+([A-Za-z0-9_.-]+))?/i,
  );
  if (!commandMatch) return null;
  const source = cleanupHtmlText(commandMatch[1]);
  const skillName = cleanupHtmlText(commandMatch[2] || "");
  return {
    sourceType: isArchiveSource(source) ? "archive" : inferGitSourceType(source),
    source,
    skillName: skillName || null,
    subdirCandidates: skillName ? skillSubdirCandidates(skillName) : [],
  };
}

function extractArchiveUrl(text, pageUrl) {
  const matches = [...text.matchAll(/https?:\/\/[^\s"'`<>]+/gi)]
    .map((match) => cleanupHtmlText(match[0]))
    .filter((url) => isArchiveSource(url));
  if (matches.length) return matches[0];
  try {
    const base = new URL(pageUrl);
    const relativeMatch = text.match(/href=["']([^"']+\.(?:zip|tar|tgz|tar\.gz)(?:\?[^"']*)?)["']/i);
    if (relativeMatch) return new URL(relativeMatch[1], base).toString();
  } catch {
    return null;
  }
  return null;
}

function extractGitUrl(text) {
  const matches = [...text.matchAll(/(?:https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+|git@[^\s"'`<>]+|ssh:\/\/[^\s"'`<>]+|https?:\/\/[^\s"'`<>]+\.git)/gi)]
    .map((match) => cleanupHtmlText(match[0]))
    .map((url) => url.replace(/[),.;]+$/, ""));
  return matches[0] || null;
}

function cleanupHtmlText(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&#47;/g, "/")
    .replace(/[),.;]+$/, "")
    .trim();
}

function skillSubdirCandidates(skillName) {
  const name = String(skillName || "").trim();
  if (!name || name.includes("/") || name.includes("\\")) return [];
  return [
    name,
    `skills/${name}`,
    `src/${name}`,
    `.claude/skills/${name}`,
    `.codex/skills/${name}`,
    `claude-skills/${name}`,
  ];
}

function isRemoteArchiveUrl(source) {
  return /^https?:\/\//i.test(source) && isArchiveSource(source);
}

function archiveFileName(source) {
  try {
    const url = new URL(source);
    return path.basename(url.pathname);
  } catch {
    return path.basename(String(source || ""));
  }
}

function isArchiveName(name) {
  return /\.(zip|tar|tgz|tar\.gz)$/i.test(name);
}

function isZipArchive(archivePath) {
  return /\.zip$/i.test(archivePath);
}

function isTarArchive(archivePath) {
  return /\.(tar|tgz|tar\.gz)$/i.test(archivePath);
}

function isGitSource(source) {
  return (
    isGithubShortcut(source) ||
    isRemoteGitUrl(source) ||
    /^file:\/\//i.test(source) ||
    source.endsWith(".git")
  );
}

function inferGitSourceType(source) {
  return isGithubShortcut(source) || /^https:\/\/github\.com\/[^/]+\/[^/]+/i.test(source)
    ? "github"
    : "git";
}

function normalizeGitUrl(source) {
  if (/^file:\/\//i.test(source) || path.isAbsolute(source)) {
    return source;
  }
  if (/^https:\/\/github\.com\/[^/]+\/[^/]+/i.test(source)) {
    return source.replace(/\/$/, "");
  }
  if (isGithubShortcut(source)) {
    return `https://github.com/${source}`;
  }
  if (isRemoteGitUrl(source) || source.endsWith(".git")) {
    return source.replace(/\/$/, "");
  }
  const error = new Error("Git source must be a local folder, Git URL, or GitHub owner/repo shortcut.");
  error.statusCode = 400;
  throw error;
}

function isGithubShortcut(source) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source);
}

function isRemoteGitUrl(source) {
  return /^(https?:\/\/|ssh:\/\/|git@)[^\s]+/i.test(source);
}

function normalizePinMode(pin) {
  if (pin === true) return "commit";
  if (["commit", "tag", "none"].includes(pin)) return pin;
  return "none";
}

function looksLikeCommitSha(ref) {
  return /^[a-f0-9]{7,40}$/i.test(String(ref || ""));
}

async function readGitOutput(repoPath, args) {
  const { stdout } = await execFileAsync("git", ["-C", repoPath, ...args], {
    timeout: 120_000,
    maxBuffer: 1024 * 1024,
  });
  return stdout.trim();
}

async function readOptionalGitOutput(repoPath, args) {
  try {
    return await readGitOutput(repoPath, args);
  } catch {
    return null;
  }
}
