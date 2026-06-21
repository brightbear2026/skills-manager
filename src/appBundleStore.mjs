import { cp, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getServiceConfig } from "./serviceStore.mjs";

export function buildAppResourceManifest(options = {}) {
  const config = getServiceConfig(options);
  const resourceRoot = path.resolve(options.resourceRoot || config.projectRoot);
  const relative = (targetPath) => path.relative(resourceRoot, targetPath) || ".";

  return {
    version: config.version,
    resourceRoot,
    service: {
      entry: relative(config.serverPath),
      publicDir: relative(config.publicDir),
      managerHome: config.managerHome,
      defaultPort: config.port,
      label: config.label,
    },
    include: [
      {
        path: "src",
        reason: "Local HTTP service, scanner, source import, AI interpretation, and storage modules.",
      },
      {
        path: "public",
        reason: "Browser UI served by the local service.",
      },
      {
        path: "package.json",
        reason: "App version, module type, and local command metadata.",
      },
      {
        path: "README.md",
        reason: "Local support and troubleshooting reference.",
      },
      {
        path: "docs/app-packaging.md",
        reason: "Packaging decisions and service lifecycle notes.",
      },
    ],
    generated: [
      {
        path: bundledNodePath(),
        source: process.execPath,
        reason: "Bundled Node runtime used by the native app shell.",
      },
    ],
    exclude: [
      "node_modules",
      "src-tauri/target",
      "coverage",
      ".DS_Store",
      ".env",
      ".skillsmanger-cache",
    ],
    openDecisions: [
      "Run the service only while the app is open or allow explicit background mode.",
      "Choose the final icon, signing identity, and notarization workflow.",
    ],
  };
}

function bundledNodePath() {
  return process.platform === "win32" ? "node/node.exe" : "node/bin/node";
}

export async function stageAppResources(options = {}) {
  const config = getServiceConfig(options);
  const manifest = buildAppResourceManifest(options);
  const outputDir = path.resolve(
    options.outputDir || options.targetPath || path.join(config.projectRoot, ".skillsmanger-cache", "app-resources"),
  );

  await mkdir(outputDir, { recursive: true });

  const copied = [];
  for (const item of manifest.include) {
    const source = path.join(manifest.resourceRoot, item.path);
    const destination = path.join(outputDir, item.path);
    await copyResource(source, destination);
    copied.push({
      path: item.path,
      source,
      destination,
    });
  }
  for (const item of manifest.generated) {
    const destination = path.join(outputDir, item.path);
    await copyResource(item.source, destination);
    copied.push({
      path: item.path,
      source: item.source,
      destination,
    });
  }

  const manifestPath = path.join(outputDir, "skillsmanager-resource-manifest.json");
  const stagedManifest = {
    ...manifest,
    outputDir,
    copied,
    stagedAt: new Date().toISOString(),
  };
  await writeFile(manifestPath, `${JSON.stringify(stagedManifest, null, 2)}\n`, "utf8");

  return {
    outputDir,
    manifestPath,
    copied,
    manifest: stagedManifest,
  };
}

async function copyResource(source, destination) {
  const info = await stat(source);
  await mkdir(path.dirname(destination), { recursive: true });
  if (info.isDirectory()) {
    await cp(source, destination, {
      recursive: true,
      force: true,
      filter: (candidate) => !shouldSkipPath(candidate),
    });
    return;
  }

  await cp(source, destination, { force: true });
}

function shouldSkipPath(candidate) {
  return candidate
    .split(path.sep)
    .some((part) => part === ".DS_Store" || part === "node_modules" || part === "target");
}
