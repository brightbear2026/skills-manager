import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { lstat, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  adoptSkill,
  enrichCatalogWithGovernance,
  getLibraryCatalog,
  getLibraryRecordDetail,
  publishLibraryRecord,
  publishSkill,
  republishLibraryRecord,
  rollbackLibraryRecord,
  unpublishLibraryRecord,
  updateLibraryTrustPolicy,
  updateSkillTrustPolicy,
} from "../src/governanceStore.mjs";
import {
  adoptFirstRunSkills,
  completeFirstRunImport,
  getFirstRunImport,
} from "../src/firstRunStore.mjs";
import { ensureBridgeSkill } from "../src/bridgeStore.mjs";
import {
  completeInvocation,
  createProfile,
  createInvocation,
  deleteProfile,
  deleteProfileSecret,
  getProfileSecrets,
  getProfiles,
  getRuntimeState,
  resetProfiles,
  setProfileSecret,
  updateProfile,
} from "../src/runtimeStore.mjs";
import { installSkillSource, previewSkillSource } from "../src/sourceInstaller.mjs";
import { buildLocalExport, writeLocalExport } from "../src/exportStore.mjs";
import { parseSkillMarkdown, scanRisk } from "../src/skillScanner.mjs";
import {
  buildHealthPayload,
  checkServiceHealth,
  getServiceConfig,
  getServiceStatus,
  isSkillsManagerHealthPayload,
  renderLaunchAgentPlist,
  writeLaunchAgentPlist,
} from "../src/serviceStore.mjs";
import {
  buildServiceStartPlan,
  ensureServiceReady,
  resolveAppShellLaunch,
  waitForServiceReady,
} from "../src/appShellStore.mjs";
import { buildAppResourceManifest, stageAppResources } from "../src/appBundleStore.mjs";
import { checkAppPackagingReadiness } from "../src/appPreflightStore.mjs";
import { checkAppSigningReadiness } from "../src/appSigningStore.mjs";
import {
  getAiSettings,
  interpretSkillWithAi,
  parseAiInterpretation,
  testAiSettingsConnection,
  updateAiSettings,
} from "../src/aiStore.mjs";

const execFileAsync = promisify(execFile);

test("parseSkillMarkdown extracts frontmatter fields", () => {
  const parsed = parseSkillMarkdown(`---
name: demo-skill
description: Helps with demo workflows.
---

Follow these steps.
`);

  assert.equal(parsed.name, "demo-skill");
  assert.equal(parsed.description, "Helps with demo workflows.");
  assert.equal(parsed.validation.length, 0);
  assert.match(parsed.body, /Follow these steps/);
});

test("parseSkillMarkdown ignores nested yaml while reading top-level fields", () => {
  const parsed = parseSkillMarkdown(`---
name: parent-skill
description: Top-level description.
credentials:
  - name: API_KEY
    description: Nested credential description.
---

Use the top-level description.
`);

  assert.equal(parsed.name, "parent-skill");
  assert.equal(parsed.description, "Top-level description.");
});

test("parseSkillMarkdown reports missing frontmatter", () => {
  const parsed = parseSkillMarkdown("No frontmatter", "fallback");

  assert.equal(parsed.name, "fallback");
  assert.equal(parsed.validation[0].level, "warning");
});

test("scanRisk flags destructive and secret access", () => {
  const risk = scanRisk({
    skillText: "Run rm -rf ./tmp and read process.env.API_KEY",
    files: [],
  });

  assert.equal(risk.level, "high");
  assert.ok(risk.findings.some((finding) => finding.id === "destructive-delete"));
  assert.ok(risk.findings.some((finding) => finding.id === "secret-access"));
});

test("service manager builds health payloads and launchd plists", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-service-"));
  const projectRoot = path.join(home, "project");
  const options = {
    projectRoot,
    port: 61234,
    nodePath: "/usr/local/bin/node",
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const config = getServiceConfig(options);
  const health = buildHealthPayload(options);
  const plist = renderLaunchAgentPlist(config);
  const written = await writeLaunchAgentPlist(options);
  const offline = await checkServiceHealth({
    ...options,
    url: "http://127.0.0.1:9/api/health",
    timeoutMs: 50,
  });
  const status = await getServiceStatus({
    ...options,
    url: "http://127.0.0.1:9/api/health",
    timeoutMs: 50,
  });
  const startPlan = buildServiceStartPlan(options);
  const packagedRoot = path.join(home, "Skills Manager.app", "Contents", "Resources", "app");
  const packagedConfig = getServiceConfig({
    env: {
      SKILLSMANGER_HOME: home,
      SKILLSMANGER_PROJECT_ROOT: packagedRoot,
      SKILLSMANGER_SERVER_PATH: path.join(packagedRoot, "src", "server.mjs"),
      SKILLSMANGER_PUBLIC_DIR: path.join(packagedRoot, "public"),
    },
  });
  const packagedStartPlan = buildServiceStartPlan({
    ...options,
    projectRoot: packagedRoot,
    serverPath: path.join(packagedRoot, "src", "server.mjs"),
    publicDir: path.join(packagedRoot, "public"),
  });
  const resourceManifest = buildAppResourceManifest(options);
  const staged = await stageAppResources({
    ...options,
    resourceRoot: path.resolve("."),
    outputDir: path.join(home, "staged-app"),
  });
  const preflightReady = await checkAppPackagingReadiness({
    ...options,
    stagedResourcesDir: staged.outputDir,
    commandRunner: async (command, args) => ({
      stdout: args[0] === "tauri" ? "tauri-cli 2.0.0" : "cargo 1.80.0",
      stderr: "",
    }),
  });
  const preflightMissingTools = await checkAppPackagingReadiness({
    ...options,
    stagedResourcesDir: staged.outputDir,
    commandRunner: async () => {
      throw new Error("command not found");
    },
  });
  const signingReady = await checkAppSigningReadiness({
    ...options,
    platform: "darwin",
    env: {
      NOTARYTOOL_KEYCHAIN_PROFILE: "skills-manager-release",
    },
    commandRunner: async (command, args) => {
      if (command === "security") {
        return {
          stdout: '  1) ABCDEF1234567890 "Developer ID Application: Example Studio (TEAM123456)"\n',
          stderr: "",
        };
      }
      return {
        stdout: args[0] === "notarytool" ? "notarytool 1.0" : "codesign 1.0",
        stderr: "",
      };
    },
  });
  const signingMissing = await checkAppSigningReadiness({
    ...options,
    platform: "darwin",
    env: {},
    commandRunner: async (command) => {
      if (command === "security") {
        return {
          stdout: '  1) ABCDEF1234567890 "Apple Development: Example Studio (TEAM123456)"\n',
          stderr: "",
        };
      }
      return { stdout: "ok", stderr: "" };
    },
  });
  const launchPlan = await resolveAppShellLaunch({
    ...options,
    statusProvider: async () => ({
      running: false,
      action: "start",
      url: config.baseUrl,
    }),
  });
  const occupiedPlan = await resolveAppShellLaunch({
    ...options,
    statusProvider: async () => ({
      running: false,
      action: "choose-port",
      url: config.baseUrl,
    }),
  });
  let waitChecks = 0;
  const readyPlan = await waitForServiceReady({
    ...options,
    intervalMs: 1,
    timeoutMs: 200,
    statusProvider: async () => {
      waitChecks += 1;
      return {
        running: waitChecks > 1,
        action: waitChecks > 1 ? "open" : "start",
        url: config.baseUrl,
      };
    },
  });
  const dryRunPlan = await ensureServiceReady({
    ...options,
    start: false,
    statusProvider: async () => ({
      running: false,
      action: "start",
      url: config.baseUrl,
    }),
  });

  assert.equal(config.port, 61234);
  assert.equal(health.ok, true);
  assert.equal(health.baseUrl, "http://127.0.0.1:61234");
  assert.equal(isSkillsManagerHealthPayload(health, config), true);
  assert.equal(isSkillsManagerHealthPayload({ ok: true, service: "other" }, config), false);
  assert.match(plist, /com\.skillsmanager\.local/);
  assert.match(plist, /SKILLSMANGER_HOME/);
  assert.match(plist, /RunAtLoad/);
  assert.match(await readFile(written.targetPath, "utf8"), /KeepAlive/);
  assert.equal(offline.running, false);
  assert.equal(status.running, false);
  assert.equal(status.action, "start");
  assert.equal(status.portOccupied, false);
  assert.equal(status.url, "http://127.0.0.1:61234");
  assert.equal(status.healthUrl, "http://127.0.0.1:9/api/health");
  assert.equal(status.config.baseUrl, "http://127.0.0.1:61234");
  assert.equal(startPlan.command, "/usr/local/bin/node");
  assert.deepEqual(startPlan.args, [path.join(projectRoot, "src", "server.mjs")]);
  assert.equal(startPlan.env.PORT, "61234");
  assert.equal(packagedConfig.projectRoot, packagedRoot);
  assert.equal(packagedConfig.publicDir, path.join(packagedRoot, "public"));
  assert.equal(packagedStartPlan.env.SKILLSMANGER_PROJECT_ROOT, packagedRoot);
  assert.equal(packagedStartPlan.env.SKILLSMANGER_PUBLIC_DIR, path.join(packagedRoot, "public"));
  assert.ok(resourceManifest.include.some((item) => item.path === "src"));
  assert.ok(resourceManifest.exclude.includes("src-tauri/target"));
  assert.match(await readFile(path.join(staged.outputDir, "src", "server.mjs"), "utf8"), /createServer/);
  assert.match(await readFile(path.join(staged.outputDir, "public", "index.html"), "utf8"), /Skills Manager/);
  const stagedNodePath = resourceManifest.generated.find((item) => item.reason.includes("Node runtime"))?.path;
  assert.ok(stagedNodePath);
  assert.ok((await lstat(path.join(staged.outputDir, ...stagedNodePath.split("/")))).size > 1_000_000);
  const stagedManifest = JSON.parse(await readFile(staged.manifestPath, "utf8"));
  assert.equal(path.basename(staged.manifestPath), "skillsmanager-resource-manifest.json");
  assert.equal(stagedManifest.outputDir, staged.outputDir);
  assert.ok(stagedManifest.copied.some((item) => item.path === "public"));
  assert.ok(stagedManifest.copied.some((item) => item.path === stagedNodePath));
  assert.equal(preflightReady.ready, true);
  assert.equal(preflightReady.nextActions.length, 0);
  assert.equal(preflightMissingTools.ready, false);
  assert.ok(preflightMissingTools.nextActions.some((action) => action.includes("Rust/Cargo")));
  assert.equal(signingReady.ready, true);
  assert.equal(
    signingReady.checks.find((check) => check.id === "developer-id-application").identity,
    "Developer ID Application: Example Studio (TEAMID)",
  );
  assert.equal(signingMissing.ready, false);
  assert.equal(signingMissing.checks.find((check) => check.id === "notary-credentials").ok, false);
  assert.equal(launchPlan.action, "start");
  assert.equal(launchPlan.startPlan.url, "http://127.0.0.1:61234");
  assert.equal(occupiedPlan.action, "choose-port");
  assert.equal(occupiedPlan.startPlan, null);
  assert.equal(readyPlan.ready, true);
  assert.equal(readyPlan.action, "open");
  assert.equal(dryRunPlan.ready, false);
  assert.equal(dryRunPlan.action, "start");
  assert.equal(dryRunPlan.startPlan.url, "http://127.0.0.1:61234");
});

test("local export summarizes diagnostics without secret values or invocation prompts", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-export-"));
  const home = path.join(tmp, "manager");
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
    projectRoot: tmp,
  };
  const catalog = {
    scannedAt: "2026-06-15T00:00:00.000Z",
    roots: [
      {
        key: "codex-test",
        label: "Codex Test",
        tool: "Codex",
        path: path.join(tmp, "codex-skills"),
        exists: true,
        readable: true,
      },
    ],
    skills: [
      {
        id: "aaaaaaaaaaaaaaaa",
        name: "export-skill",
        description: "Skill included in local export.",
        tool: "Codex",
        rootKey: "codex-test",
        rootLabel: "Codex Test",
        path: path.join(tmp, "codex-skills", "export-skill"),
        relativePath: "export-skill",
        frontmatter: {
          version: "1.0.0",
        },
        body: "Do not include instruction bodies in diagnostics.",
        risk: {
          level: "low",
          findings: [],
        },
        files: [
          {
            path: "SKILL.md",
            size: 120,
          },
        ],
        validation: [],
      },
    ],
  };

  await setProfileSecret(
    "codex",
    {
      key: "API_KEY",
      value: "super-secret-value",
    },
    options,
  );
  await createInvocation(
    catalog,
    {
      agentId: "codex",
      skillId: "aaaaaaaaaaaaaaaa",
      policy: "serialized",
      prompt: "private prompt value",
    },
    options,
  );

  const bundle = await buildLocalExport({
    ...options,
    catalog,
  });
  const serialized = JSON.stringify(bundle);

  assert.equal(bundle.format, "skillsmanager.local-export");
  assert.equal(bundle.privacy.includesSecretValues, false);
  assert.equal(bundle.privacy.includesInvocationPrompts, false);
  assert.equal(bundle.catalog.counts.skills, 1);
  assert.equal(bundle.runtime.counts.runs, 1);
  const codexSecrets = bundle.runtime.secretKeys.find((summary) => summary.profileId === "codex");
  assert.equal(codexSecrets.keys[0].key, "API_KEY");
  assert.equal(bundle.runtime.runs[0].input, undefined);
  assert.equal(bundle.runtime.runs[0].output, undefined);
  assert.equal(serialized.includes("super-secret-value"), false);
  assert.equal(serialized.includes("private prompt value"), false);
  assert.equal(serialized.includes("Do not include instruction bodies"), false);

  const written = await writeLocalExport({
    ...options,
    catalog,
    targetPath: path.join(tmp, "export.json"),
  });
  assert.equal(written.counts.skills, 1);
  assert.match(await readFile(written.targetPath, "utf8"), /skillsmanager\.local-export/);
});

test("runtime serializes two agents invoking the same skill", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-runtime-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const catalog = {
    skills: [
      {
        id: "skill1234567890ab",
        name: "demo-skill",
        path: "/tmp/demo-skill",
        rootPath: "/tmp",
        frontmatter: {
          version: "1.0.0",
        },
      },
    ],
  };

  const first = await createInvocation(
    catalog,
    {
      agentId: "claude-code",
      skillId: "skill1234567890ab",
      policy: "serialized",
    },
    options,
  );
  const second = await createInvocation(
    catalog,
    {
      agentId: "codex",
      skillId: "skill1234567890ab",
      policy: "serialized",
    },
    options,
  );

  assert.equal(first.run.status, "running");
  assert.equal(second.run.status, "queued");
  assert.equal(second.run.blockedBy, first.run.id);

  const completed = await completeInvocation(first.run.id, options);
  assert.equal(completed.run.status, "completed");
  assert.equal(completed.promoted.length, 1);
  assert.equal(completed.promoted[0].id, second.run.id);
  assert.equal(completed.promoted[0].status, "running");

  const state = await getRuntimeState(options);
  assert.equal(state.counts.running, 1);
  assert.equal(state.counts.queued, 0);
  assert.equal(state.counts.locks, 1);
});

test("governance adopts a skill and publishes an agent-native managed mirror", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-governance-"));
  const home = path.join(tmp, "manager");
  const sourceRoot = path.join(tmp, "source-skills");
  const sourceSkill = path.join(sourceRoot, "demo-skill");
  const targetRoot = path.join(tmp, "codex-skills");
  await mkdir(path.join(sourceSkill, "scripts"), { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: demo-skill
description: Demo skill.
version: 1.0.0
---

Use the demo skill.
`,
    "utf8",
  );
  await writeFile(path.join(sourceSkill, "scripts", "tool.sh"), "echo demo\n", "utf8");
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "codex-test",
          name: "Codex Test",
          adapter: "codex",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const catalog = {
    skills: [
      {
        id: "aaaaaaaaaaaaaaaa",
        name: "demo-skill",
        description: "Demo skill.",
        path: sourceSkill,
        rootPath: sourceRoot,
        frontmatter: {
          version: "1.0.0",
        },
      },
    ],
  };

  const initial = await enrichCatalogWithGovernance(catalog, options);
  assert.equal(initial.skills[0].governance.status, "unmanaged");

  const adopted = await adoptSkill(
    catalog,
    "aaaaaaaaaaaaaaaa",
    {
      invocationMode: "hybrid",
    },
    options,
  );
  assert.equal(adopted.marker.status, "adopted");
  assert.equal(adopted.record.invocationMode, "hybrid");

  const afterAdopt = await enrichCatalogWithGovernance(catalog, options);
  assert.equal(afterAdopt.skills[0].governance.status, "adopted");
  assert.equal(afterAdopt.skills[0].governance.inLibrary, true);

  const published = await publishSkill(
    catalog,
    "aaaaaaaaaaaaaaaa",
    {
      profileId: "codex-test",
      invocationMode: "native",
    },
    options,
  );
  const targetSkill = path.join(targetRoot, "demo-skill");
  const targetMarker = JSON.parse(await readFile(path.join(targetSkill, ".skillsmanager.json")));

  assert.equal(published.profile.id, "codex-test");
  assert.equal(targetMarker.status, "managed");
  assert.equal(targetMarker.invocationMode, "native");
  assert.match(await readFile(path.join(targetSkill, "SKILL.md"), "utf8"), /Demo skill/);
});

test("first-run import adopts low-risk existing skills without changing source roots", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-first-run-"));
  const home = path.join(tmp, "manager");
  const sourceRoot = path.join(tmp, "codex-skills");
  const lowSkill = path.join(sourceRoot, "low-skill");
  const highSkill = path.join(sourceRoot, "high-skill");
  await mkdir(lowSkill, { recursive: true });
  await mkdir(highSkill, { recursive: true });
  await writeFile(
    path.join(lowSkill, "SKILL.md"),
    `---
name: low-skill
description: Safe existing skill.
version: 1.0.0
---

Use the safe skill.
`,
    "utf8",
  );
  await writeFile(
    path.join(highSkill, "SKILL.md"),
    `---
name: high-skill
description: Risky existing skill.
version: 1.0.0
---

Read process.env.API_KEY before running.
`,
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const rawCatalog = {
    scannedAt: new Date().toISOString(),
    roots: [
      {
        key: "codex-test",
        label: "Codex Test",
        tool: "Codex",
        path: sourceRoot,
        exists: true,
        readable: true,
      },
    ],
    skills: [
      {
        id: "1111111111111111",
        name: "low-skill",
        description: "Safe existing skill.",
        tool: "Codex",
        rootKey: "codex-test",
        rootLabel: "Codex Test",
        rootPath: sourceRoot,
        path: lowSkill,
        relativePath: "low-skill",
        frontmatter: {
          version: "1.0.0",
        },
        risk: {
          level: "low",
          findings: [],
        },
        files: [],
        validation: [],
      },
      {
        id: "2222222222222222",
        name: "high-skill",
        description: "Risky existing skill.",
        tool: "Codex",
        rootKey: "codex-test",
        rootLabel: "Codex Test",
        rootPath: sourceRoot,
        path: highSkill,
        relativePath: "high-skill",
        frontmatter: {
          version: "1.0.0",
        },
        risk: {
          level: "high",
          findings: [
            {
              id: "secret-access",
              level: "high",
              label: "Secret or credential access",
            },
          ],
        },
        files: [],
        validation: [],
      },
    ],
  };

  const initialCatalog = await enrichCatalogWithGovernance(rawCatalog, options);
  const initialImport = await getFirstRunImport(initialCatalog, options);
  assert.equal(initialImport.isFirstRun, true);
  assert.equal(initialImport.summary.adoptable, 2);
  assert.equal(initialImport.summary.lowRiskAdoptable, 1);
  assert.equal(initialImport.summary.reviewRequired, 1);

  const adopted = await adoptFirstRunSkills(
    initialCatalog,
    {
      mode: "low-risk",
    },
    options,
  );
  assert.equal(adopted.counts.adopted, 1);
  assert.equal(adopted.outcomes[0].status, "adopted-existing");

  await assert.rejects(readFile(path.join(lowSkill, ".skillsmanager.json"), "utf8"));

  const afterCatalog = await enrichCatalogWithGovernance(rawCatalog, options);
  const low = afterCatalog.skills.find((skill) => skill.id === "1111111111111111");
  const high = afterCatalog.skills.find((skill) => skill.id === "2222222222222222");
  assert.equal(low.governance.status, "adopted-existing");
  assert.equal(high.governance.status, "unmanaged");

  const afterImport = await getFirstRunImport(afterCatalog, options);
  assert.equal(afterImport.summary.adoptable, 1);
  assert.equal(afterImport.summary.adoptedExisting, 1);

  await completeFirstRunImport({}, options);
  const completed = await getFirstRunImport(afterCatalog, options);
  assert.equal(completed.isFirstRun, false);
});

test("source installer previews and installs a local skill into the library", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-source-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "incoming-skill");
  await mkdir(path.join(sourceSkill, "scripts"), { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: incoming-skill
description: Imported from a source path.
version: 2.0.0
---

Use the imported skill.
`,
    "utf8",
  );
  await writeFile(
    path.join(sourceSkill, "scripts", "fetch.js"),
    "console.log(process.env.API_KEY); fetch('https://example.com');\n",
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };

  const preview = await previewSkillSource(
    {
      source: sourceSkill,
    },
    options,
  );

  assert.equal(preview.name, "incoming-skill");
  assert.equal(preview.version, "2.0.0");
  assert.equal(preview.risk.level, "high");

  const installed = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "hybrid",
    },
    options,
  );

  assert.equal(installed.install.record.id, "incoming-skill@2.0.0");
  assert.equal(installed.install.record.status, "library");
  assert.equal(installed.install.record.invocationMode, "hybrid");
  assert.match(
    await readFile(path.join(installed.install.record.libraryPath, "SKILL.md"), "utf8"),
    /Imported from a source path/,
  );

  const samePreview = await previewSkillSource({ source: sourceSkill }, options);
  assert.equal(samePreview.sourceAction.type, "already-saved");
  assert.equal(samePreview.libraryRecord.id, "incoming-skill@2.0.0");

  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: incoming-skill
description: Imported from a source path.
version: 2.1.0
---

Use the imported skill v2.1.
`,
    "utf8",
  );
  const newVersionPreview = await previewSkillSource({ source: sourceSkill }, options);
  assert.equal(newVersionPreview.sourceAction.type, "new-version");
  assert.equal(newVersionPreview.relatedRecords.length, 1);
  assert.equal(newVersionPreview.relatedRecords[0].version, "2.0.0");

  const detail = await getLibraryRecordDetail(installed.install.record.id, options);
  assert.equal(detail.id, "incoming-skill@2.0.0");
  assert.equal(detail.name, "incoming-skill");
  assert.match(detail.body, /Use the imported skill/);
  assert.equal(detail.risk.level, "high");
  assert.ok(detail.files.some((file) => file.path === "scripts/fetch.js" && file.kind === "script"));
});

test("source installer previews and installs a skill from an archive", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-archive-source-"));
  const home = path.join(tmp, "manager");
  const archiveRoot = path.join(tmp, "archive-root");
  const skillDir = path.join(archiveRoot, "nested", "archive-skill");
  const archivePath = path.join(tmp, "archive-skill.tar.gz");
  await mkdir(skillDir, { recursive: true });
  await writeFile(
    path.join(skillDir, "SKILL.md"),
    `---
name: archive-skill
description: Imported from an archive.
version: 1.0.0
---

Use the archived skill.
`,
    "utf8",
  );
  await execFileAsync("tar", ["-czf", archivePath, "-C", archiveRoot, "."], {
    timeout: 120_000,
    maxBuffer: 1024 * 1024,
  });

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const preview = await previewSkillSource({ source: archivePath }, options);
  assert.equal(preview.sourceType, "archive");
  assert.equal(preview.origin.type, "archive");
  assert.equal(preview.name, "archive-skill");
  assert.equal(preview.risk.level, "low");

  const installed = await installSkillSource({ source: archivePath }, options);
  assert.equal(installed.install.record.name, "archive-skill");
  assert.equal(installed.install.origin.source.type, "archive");
});

test("library catalog publishes an installed-only record to an agent profile", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-library-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "incoming-library-skill");
  const targetRoot = path.join(tmp, "claude-skills");
  await mkdir(sourceSkill, { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: incoming-library-skill
description: Installed-only library record.
version: 3.0.0
---

Use the installed-only skill.
`,
    "utf8",
  );
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "claude-test",
          name: "Claude Test",
          adapter: "claude",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const installed = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );

  const library = await getLibraryCatalog(options);
  assert.equal(library.records.length, 1);
  assert.equal(library.records[0].id, "incoming-library-skill@3.0.0");

  const published = await publishLibraryRecord(
    installed.install.record.id,
    {
      profileId: "claude-test",
      invocationMode: "hybrid",
    },
    options,
  );
  const targetSkill = path.join(targetRoot, "incoming-library-skill");
  const targetMarker = JSON.parse(await readFile(path.join(targetSkill, ".skillsmanager.json")));
  const nextLibrary = await getLibraryCatalog(options);

  assert.equal(published.profile.id, "claude-test");
  assert.equal(targetMarker.status, "managed");
  assert.equal(targetMarker.invocationMode, "hybrid");
  assert.equal(nextLibrary.records[0].publishedTo.length, 1);
  assert.match(
    await readFile(path.join(targetSkill, "SKILL.md"), "utf8"),
    /Installed-only library record/,
  );
});

test("library publishing supports republish, rollback, and unpublish", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-publish-management-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "versioned-skill-source");
  const targetRoot = path.join(tmp, "codex-skills");
  await mkdir(sourceSkill, { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "codex-test",
          name: "Codex Test",
          adapter: "codex",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };

  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: versioned-skill
description: Version one.
version: 1.0.0
---

Use version one.
`,
    "utf8",
  );
  const v1 = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );
  await publishLibraryRecord(
    v1.install.record.id,
    {
      profileId: "codex-test",
    },
    options,
  );

  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: versioned-skill
description: Version two.
version: 2.0.0
---

Use version two.
`,
    "utf8",
  );
  const v2 = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );
  await publishLibraryRecord(
    v2.install.record.id,
    {
      profileId: "codex-test",
    },
    options,
  );

  const targetSkill = path.join(targetRoot, "versioned-skill");
  let library = await getLibraryCatalog(options);
  let v1Record = library.records.find((record) => record.id === v1.install.record.id);
  let v2Record = library.records.find((record) => record.id === v2.install.record.id);
  assert.equal(v1Record.publishedTo.length, 0);
  assert.equal(v2Record.publishedTo.length, 1);
  assert.match(await readFile(path.join(targetSkill, "SKILL.md"), "utf8"), /Version two/);

  const rollback = await rollbackLibraryRecord(
    v1.install.record.id,
    {
      profileId: "codex-test",
    },
    options,
  );
  library = await getLibraryCatalog(options);
  v1Record = library.records.find((record) => record.id === v1.install.record.id);
  v2Record = library.records.find((record) => record.id === v2.install.record.id);
  assert.equal(rollback.action, "rolled-back");
  assert.equal(v1Record.publishedTo.length, 1);
  assert.equal(v2Record.publishedTo.length, 0);
  assert.match(await readFile(path.join(targetSkill, "SKILL.md"), "utf8"), /Version one/);

  await writeFile(path.join(v1.install.record.libraryPath, "NOTES.md"), "Republished notes.\n", "utf8");
  const republished = await republishLibraryRecord(
    v1.install.record.id,
    {
      profileId: "codex-test",
    },
    options,
  );
  assert.equal(republished.action, "republished");
  assert.match(await readFile(path.join(targetSkill, "NOTES.md"), "utf8"), /Republished notes/);
  const targetMarkerPath = path.join(targetSkill, ".skillsmanager.json");
  const marker = JSON.parse(await readFile(targetMarkerPath, "utf8"));
  await writeFile(
    targetMarkerPath,
    `${JSON.stringify({ ...marker, fingerprint: "old-fingerprint" }, null, 2)}\n`,
    "utf8",
  );
  library = await getLibraryCatalog(options);
  v1Record = library.records.find((record) => record.id === v1.install.record.id);
  assert.equal(v1Record.targetStates[0].status, "outdated");
  assert.equal(v1Record.targetStates[0].reason, "fingerprint-mismatch");

  const unpublished = await unpublishLibraryRecord(
    v1.install.record.id,
    {
      profileId: "codex-test",
    },
    options,
  );
  library = await getLibraryCatalog(options);
  v1Record = library.records.find((record) => record.id === v1.install.record.id);
  assert.equal(unpublished.removed, true);
  assert.equal(v1Record.publishedTo.length, 0);
  assert.equal(v1Record.status, "library");
  await assert.rejects(readFile(path.join(targetSkill, "SKILL.md"), "utf8"));
});

test("library catalog flags unmanaged copy target conflicts before publishing", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-target-conflict-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "conflict-skill-source");
  const targetRoot = path.join(tmp, "codex-skills");
  const unmanagedTarget = path.join(targetRoot, "conflict-skill");
  await mkdir(sourceSkill, { recursive: true });
  await mkdir(unmanagedTarget, { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "codex-test",
          name: "Codex Test",
          adapter: "codex",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: conflict-skill
description: Conflicts with an unmanaged target.
version: 1.0.0
---

Use conflict skill.
`,
    "utf8",
  );
  await writeFile(
    path.join(unmanagedTarget, "SKILL.md"),
    `---
name: conflict-skill
description: User-owned target.
---

Do not overwrite.
`,
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const installed = await installSkillSource({ source: sourceSkill }, options);
  const library = await getLibraryCatalog(options);
  const record = library.records.find((item) => item.id === installed.install.record.id);
  assert.equal(record.targetStates[0].status, "conflict");
  assert.equal(record.targetStates[0].reason, "unmanaged-target");
  await assert.rejects(
    publishLibraryRecord(
      installed.install.record.id,
      {
        profileId: "codex-test",
      },
      options,
    ),
    /not managed/,
  );
});

test("high-risk skills require review before publishing", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-policy-"));
  const home = path.join(tmp, "manager");
  const sourceRoot = path.join(tmp, "source-skills");
  const highSkill = path.join(sourceRoot, "risky-skill");
  const targetRoot = path.join(tmp, "codex-skills");
  await mkdir(highSkill, { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(highSkill, "SKILL.md"),
    `---
name: risky-skill
description: Needs review before publish.
version: 1.0.0
---

Read process.env.API_KEY before running.
`,
    "utf8",
  );
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "codex-test",
          name: "Codex Test",
          adapter: "codex",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const catalog = {
    skills: [
      {
        id: "3333333333333333",
        name: "risky-skill",
        description: "Needs review before publish.",
        path: highSkill,
        rootPath: sourceRoot,
        frontmatter: {
          version: "1.0.0",
        },
        risk: {
          level: "high",
          findings: [
            {
              id: "secret-access",
              level: "high",
              label: "Secret or credential access",
            },
          ],
        },
      },
    ],
  };

  await assert.rejects(
    publishSkill(
      catalog,
      "3333333333333333",
      {
        profileId: "codex-test",
      },
      options,
    ),
    /High-risk skills require review/,
  );

  const reviewed = await updateSkillTrustPolicy(
    catalog,
    "3333333333333333",
    {
      status: "reviewed",
      notes: "Manual review completed.",
      reviewer: "test",
    },
    options,
  );
  assert.equal(reviewed.trust.status, "reviewed");
  assert.equal(reviewed.policy.allowedToPublish, true);

  const published = await publishSkill(
    catalog,
    "3333333333333333",
    {
      profileId: "codex-test",
      invocationMode: "hybrid",
    },
    options,
  );
  const targetSkill = path.join(targetRoot, "risky-skill");
  const library = await getLibraryCatalog(options);

  assert.equal(published.profile.id, "codex-test");
  assert.equal(library.records[0].trust.status, "reviewed");
  assert.equal(library.counts.reviewed, 1);
  assert.match(await readFile(path.join(targetSkill, "SKILL.md"), "utf8"), /Needs review/);
});

test("blocked library records cannot be published", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-blocked-library-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "blocked-library-skill");
  const targetRoot = path.join(tmp, "claude-skills");
  await mkdir(sourceSkill, { recursive: true });
  await mkdir(home, { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: blocked-library-skill
description: Blocked library record.
version: 1.0.0
---

Use the blocked skill.
`,
    "utf8",
  );
  await writeFile(
    path.join(home, "profiles.json"),
    JSON.stringify(
      [
        {
          id: "claude-test",
          name: "Claude Test",
          adapter: "claude",
          skillRoot: targetRoot,
          secretScope: "profile",
        },
      ],
      null,
      2,
    ),
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const installed = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );

  const trust = await updateLibraryTrustPolicy(
    installed.install.record.id,
    {
      status: "blocked",
      notes: "Do not distribute.",
      reviewer: "test",
    },
    options,
  );
  assert.equal(trust.policy.allowedToPublish, false);

  await assert.rejects(
    publishLibraryRecord(
      installed.install.record.id,
      {
        profileId: "claude-test",
      },
      options,
    ),
    /blocked/,
  );
});

test("blocked managed skills cannot be invoked through runtime", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-blocked-runtime-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const catalog = {
    skills: [
      {
        id: "4444444444444444",
        name: "blocked-managed-skill",
        path: "/tmp/blocked-managed-skill",
        rootPath: "/tmp",
        frontmatter: {
          version: "1.0.0",
        },
        governance: {
          invocationMode: "managed",
          trust: {
            status: "blocked",
          },
        },
      },
    ],
  };

  await assert.rejects(
    createInvocation(
      catalog,
      {
        agentId: "codex",
        skillId: "4444444444444444",
        policy: "parallel",
      },
      options,
    ),
    /Blocked skills cannot be invoked/,
  );
});

test("bridge skill is generated as a trusted library record", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-bridge-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };

  const bridge = await ensureBridgeSkill(
    {
      baseUrl: "http://127.0.0.1:9999",
    },
    options,
  );
  const library = await getLibraryCatalog(options);
  const record = library.records.find((item) => item.id === "skills-manager-bridge@0.1.0");

  assert.equal(bridge.record.id, "skills-manager-bridge@0.1.0");
  assert.equal(record.trust.status, "trusted");
  assert.match(await readFile(path.join(bridge.bridgePath, "SKILL.md"), "utf8"), /127\.0\.0\.1:9999/);
  assert.match(
    await readFile(path.join(bridge.bridgePath, "scripts", "bridge-client.mjs"), "utf8"),
    /api\/invocations/,
  );
});

test("managed runtime invocations write bridge runtime artifacts", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-managed-runtime-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const catalog = {
    skills: [
      {
        id: "5555555555555555",
        name: "managed-skill",
        path: "/tmp/managed-skill",
        rootPath: "/tmp",
        frontmatter: {
          version: "1.0.0",
        },
        governance: {
          invocationMode: "hybrid",
          trust: {
            status: "reviewed",
          },
        },
      },
    ],
  };

  const result = await createInvocation(
    catalog,
    {
      agentId: "codex",
      skillId: "5555555555555555",
      policy: "serialized",
      prompt: "Run the managed workflow.",
    },
    options,
  );
  const metadata = JSON.parse(await readFile(path.join(result.run.runDir, "metadata.json"), "utf8"));
  const output = JSON.parse(await readFile(path.join(result.run.runDir, "output.json"), "utf8"));
  const events = JSON.parse(await readFile(path.join(result.run.runDir, "events.json"), "utf8"));

  assert.equal(result.run.status, "completed");
  assert.equal(result.locks.length, 0);
  assert.equal(metadata.execution.type, "managed-runtime");
  assert.equal(output.bridgeRequest.skillId, "5555555555555555");
  assert.equal(output.bridgeRequest.prompt, "Run the managed workflow.");
  assert.ok(events.some((event) => event.type === "managed-runtime-recorded"));
});

test("profile secrets are isolated and summarized without values", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-profile-secrets-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };

  const codex = await setProfileSecret(
    "codex",
    {
      key: "API_KEY",
      value: "codex-secret",
    },
    options,
  );
  await setProfileSecret(
    "claude-code",
    {
      key: "API_KEY",
      value: "claude-secret",
    },
    options,
  );

  assert.deepEqual(
    codex.keys.map((item) => item.key),
    ["API_KEY"],
  );
  assert.equal("value" in codex.keys[0], false);

  const claude = await getProfileSecrets("claude-code", options);
  assert.deepEqual(
    claude.keys.map((item) => item.key),
    ["API_KEY"],
  );

  const deleted = await deleteProfileSecret("codex", "API_KEY", options);
  const claudeAfterDelete = await getProfileSecrets("claude-code", options);
  assert.equal(deleted.keys.length, 0);
  assert.deepEqual(
    claudeAfterDelete.keys.map((item) => item.key),
    ["API_KEY"],
  );
});

test("profiles can be edited, disabled, and used for symlink publishing", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-profiles-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "profile-skill");
  const targetRoot = path.join(tmp, "codex-skills");
  await mkdir(sourceSkill, { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: profile-skill
description: Profile-managed skill.
version: 1.0.0
---

Use the profile skill.
`,
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  await resetProfiles(options);
  const updated = await updateProfile(
    "codex",
    {
      skillRoot: targetRoot,
      publishMode: "symlink",
      enabled: true,
    },
    options,
  );
  assert.equal(updated.profile.skillRoot, targetRoot);
  assert.equal(updated.profile.publishMode, "symlink");

  const profiles = await getProfiles(options);
  assert.equal(profiles.counts.enabled, 3);

  const installed = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );
  const published = await publishLibraryRecord(
    installed.install.record.id,
    {
      profileId: "codex",
    },
    options,
  );
  const targetSkill = path.join(targetRoot, "profile-skill");
  const sidecarMarker = `${targetSkill}.skillsmanager.json`;
  const targetInfo = await lstat(targetSkill);
  assert.equal(published.record.publishedTo[0].publishMode, "symlink");
  assert.equal(targetInfo.isSymbolicLink(), true);
  assert.match(await readFile(sidecarMarker, "utf8"), /profile-skill/);

  await unpublishLibraryRecord(
    installed.install.record.id,
    {
      profileId: "codex",
    },
    options,
  );
  await assert.rejects(lstat(targetSkill));
  await assert.rejects(readFile(sidecarMarker, "utf8"));

  await updateProfile(
    "codex",
    {
      enabled: false,
    },
    options,
  );
  await assert.rejects(
    publishLibraryRecord(
      installed.install.record.id,
      {
        profileId: "codex",
      },
      options,
    ),
    /disabled/,
  );
  await assert.rejects(
    createInvocation(
      {
        skills: [
          {
            id: "6666666666666666",
            name: "profile-skill",
            path: sourceSkill,
            rootPath: tmp,
            frontmatter: {
              version: "1.0.0",
            },
          },
        ],
      },
      {
        agentId: "codex",
        skillId: "6666666666666666",
      },
      options,
    ),
    /disabled/,
  );
});

test("custom agent folders can be created, used, and deleted", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-custom-profile-"));
  const home = path.join(tmp, "manager");
  const sourceSkill = path.join(tmp, "custom-profile-skill");
  const customRoot = path.join(tmp, "custom-agent-skills");
  await mkdir(sourceSkill, { recursive: true });
  await writeFile(
    path.join(sourceSkill, "SKILL.md"),
    `---
name: custom-profile-skill
description: Custom profile skill.
version: 1.0.0
---

Use the custom profile skill.
`,
    "utf8",
  );

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  await resetProfiles(options);
  await assert.rejects(
    createProfile(
      {
        name: "Broken Agent",
        skillRoot: " ",
      },
      options,
    ),
    /Skills folder is required/,
  );
  const created = await createProfile(
    {
      name: "  My Local Agent  ",
      skillRoot: ` ${customRoot} `,
    },
    options,
  );
  assert.equal(created.profile.name, "My Local Agent");
  assert.equal(created.profile.skillRoot, customRoot);
  assert.equal(created.profile.adapter, "custom");
  assert.equal(created.profile.canDelete, true);

  const installed = await installSkillSource(
    {
      source: sourceSkill,
      invocationMode: "native",
    },
    options,
  );
  await publishLibraryRecord(
    installed.install.record.id,
    {
      profileId: created.profile.id,
      publishMode: "copy",
    },
    options,
  );
  assert.match(await readFile(path.join(customRoot, "custom-profile-skill", "SKILL.md"), "utf8"), /Custom profile skill/);

  await assert.rejects(deleteProfile("codex", options), /Default agent folders/);
  const deleted = await deleteProfile(created.profile.id, options);
  assert.equal(deleted.profiles.some((profile) => profile.id === created.profile.id), false);
});

test("github source preview records resolved commits and diffs existing library records", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-github-source-"));
  const home = path.join(tmp, "manager");
  const repo = path.join(tmp, "repo");
  const skillDir = path.join(repo, "skills", "git-skill");
  await mkdir(skillDir, { recursive: true });
  await writeFile(
    path.join(skillDir, "SKILL.md"),
    `---
name: git-skill
description: Imported from git.
version: 1.0.0
---

Use the git skill.
`,
    "utf8",
  );
  await runGit(repo, ["init"]);
  await runGit(repo, ["config", "user.email", "skillsmanager@example.test"]);
  await runGit(repo, ["config", "user.name", "Skills Manager"]);
  await runGit(repo, ["add", "."]);
  await runGit(repo, ["commit", "-m", "initial skill"]);
  const firstCommit = await gitOutput(repo, ["rev-parse", "HEAD"]);

  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  const sourceRequest = {
    sourceType: "github",
    source: repo,
    subdir: "skills/git-skill",
    pin: true,
  };
  const genericGitPreview = await previewSkillSource(
    {
      sourceType: "git",
      source: repo,
      subdir: "skills/git-skill",
      pin: true,
    },
    options,
  );
  assert.equal(genericGitPreview.sourceType, "git");
  assert.equal(genericGitPreview.origin.type, "git");
  assert.equal(genericGitPreview.origin.resolvedCommit, firstCommit);

  const firstPreview = await previewSkillSource(sourceRequest, options);
  assert.equal(firstPreview.origin.resolvedCommit, firstCommit);
  assert.equal(firstPreview.origin.ref, firstCommit);
  assert.equal(firstPreview.origin.pinned, true);
  assert.equal(firstPreview.libraryRecord.exists, false);

  const installed = await installSkillSource(sourceRequest, options);
  assert.equal(installed.install.origin.source.resolvedCommit, firstCommit);

  await writeFile(
    path.join(skillDir, "SKILL.md"),
    `---
name: git-skill
description: Imported from git, updated.
version: 1.0.0
---

Use the updated git skill.
`,
    "utf8",
  );
  await writeFile(path.join(skillDir, "README.md"), "Extra instructions.\n", "utf8");
  await runGit(repo, ["add", "."]);
  await runGit(repo, ["commit", "-m", "update skill"]);
  const secondCommit = await gitOutput(repo, ["rev-parse", "HEAD"]);

  const updatePreview = await previewSkillSource(sourceRequest, options);
  assert.equal(updatePreview.origin.resolvedCommit, secondCommit);
  assert.equal(updatePreview.libraryRecord.exists, true);
  assert.equal(updatePreview.libraryRecord.id, "git-skill@1.0.0");
  assert.equal(updatePreview.sourceAction.type, "update-existing");
  assert.ok(updatePreview.diff.changed >= 2);
  assert.ok(updatePreview.diff.modified.some((file) => file.path === "SKILL.md"));
  assert.ok(updatePreview.diff.added.some((file) => file.path === "README.md"));

  await assert.rejects(
    installSkillSource(sourceRequest, options),
    (error) => {
      assert.equal(error.statusCode, 409);
      assert.equal(error.code, "LIBRARY_RECORD_DIFFERS");
      assert.ok(error.diff.changed >= 2);
      return true;
    },
  );

  const replaced = await installSkillSource(
    {
      ...sourceRequest,
      replace: true,
    },
    options,
  );
  const origin = JSON.parse(
    await readFile(path.join(replaced.install.record.libraryPath, "origin.json"), "utf8"),
  );

  assert.equal(replaced.install.record.fingerprint, updatePreview.fingerprint);
  assert.equal(origin.source.resolvedCommit, secondCommit);
  assert.equal(origin.source.pinnedRef, secondCommit);
});

test("source installer resolves SkillsMP pages through their install command", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-skillsmp-source-"));
  const home = path.join(tmp, "manager");
  const repo = path.join(tmp, "repo");
  const skillDir = path.join(repo, "src", "ui-ux-pro-max");
  await mkdir(skillDir, { recursive: true });
  await writeFile(
    path.join(skillDir, "SKILL.md"),
    `---
name: ui-ux-pro-max
description: UI UX design review skill.
version: 1.0.0
---

Review product flows and visual hierarchy.
`,
    "utf8",
  );
  await runGit(repo, ["init"]);
  await runGit(repo, ["config", "user.email", "skillsmanager@example.test"]);
  await runGit(repo, ["config", "user.name", "Skills Manager"]);
  await runGit(repo, ["add", "."]);
  await runGit(repo, ["commit", "-m", "initial marketplace skill"]);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(
      url,
      "https://skillsmp.com/creators/nextlevelbuilder/ui-ux-pro-max-skill/claude-skills-ui-ux-pro-max",
    );
    return {
      ok: true,
      text: async () => `
        <html>
          <body>
            <code>npx skills add file://${repo} --skill ui-ux-pro-max</code>
          </body>
        </html>
      `,
    };
  };

  try {
    const preview = await previewSkillSource(
      {
        source:
          "https://skillsmp.com/creators/nextlevelbuilder/ui-ux-pro-max-skill/claude-skills-ui-ux-pro-max",
      },
      {
        env: {
          SKILLSMANGER_HOME: home,
        },
      },
    );
    assert.equal(preview.sourceType, "git");
    assert.equal(preview.name, "ui-ux-pro-max");
    assert.equal(preview.origin.sourcePage, "https://skillsmp.com/creators/nextlevelbuilder/ui-ux-pro-max-skill/claude-skills-ui-ux-pro-max");
    assert.equal(preview.origin.marketplaceSkill, "ui-ux-pro-max");
    assert.match(preview.bodyPreview, /Review product flows/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("ai settings are stored locally without exposing the api key", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-ai-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };

  const saved = await updateAiSettings(
    {
      enabled: true,
      provider: "deepseek",
      baseUrl: "https://api.example.test/v1",
      model: "test-model",
      apiKey: "secret-key",
    },
    options,
  );

  assert.equal(saved.enabled, true);
  assert.equal(saved.apiKeySet, true);
  assert.equal(saved.apiKey, undefined);

  const loaded = await getAiSettings(options);
  assert.equal(loaded.provider, "deepseek");
  assert.equal(loaded.baseUrl, "https://api.example.test/v1");
  assert.equal(loaded.model, "test-model");
  assert.equal(loaded.apiKeySet, true);
  assert.equal(JSON.stringify(loaded).includes("secret-key"), false);
});

test("ai interpretation requires enabled model settings", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-ai-disabled-"));
  await assert.rejects(
    () =>
      interpretSkillWithAi(
        {
          name: "demo",
          description: "Demo skill",
        },
        {
          env: {
            SKILLSMANGER_HOME: home,
          },
        },
      ),
    /not enabled/,
  );
});

test("ai interpretation sends locale guidance to compatible providers", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-ai-locale-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  await updateAiSettings(
    {
      enabled: true,
      provider: "kimi",
      baseUrl: "https://api.example.test/v1",
      model: "kimi-test",
      apiKey: "secret-key",
    },
    options,
  );

  const originalFetch = globalThis.fetch;
  let capturedRequest;
  let requestCount = 0;
  globalThis.fetch = async (url, request) => {
    requestCount += 1;
    capturedRequest = {
      url,
      body: JSON.parse(request.body),
    };
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content:
                '{"summary":"用于整理技能。","capabilities":"整理和解释本地 skills。","useCases":"当用户需要理解 skills 时使用。","howToUse":"先扫描，再阅读结果。","inputsOutputs":"输入为 SKILL.md，输出为说明。","riskExplanation":"没有明显本地风险信号。","filesToReview":"SKILL.md","recommendation":"可以先加入本机库。","distributionDecision":"可先保存，复制前再确认。"}',
            },
          },
        ],
      }),
    };
  };

  try {
    const result = await interpretSkillWithAi(
      {
        locale: "zh",
        preview: {
          name: "demo",
          description: "Demo skill",
          fingerprint: "same-fingerprint",
          body: "Use this skill to organize local agent skills.",
          risk: { level: "low", findings: [] },
        },
      },
      options,
    );
    assert.equal(result.provider, "kimi");
    assert.equal(result.sections.capabilities, "整理和解释本地 skills。");
    assert.equal(result.sections.distributionDecision, "可先保存，复制前再确认。");
    assert.equal(capturedRequest.url, "https://api.example.test/v1/chat/completions");
    assert.equal(capturedRequest.body.model, "kimi-test");
    assert.match(capturedRequest.body.messages[1].content, /Simplified Chinese/);
    assert.match(capturedRequest.body.messages[1].content, /"language": "zh"/);
    assert.match(capturedRequest.body.messages[1].content, /organize local agent skills/);

    const cached = await interpretSkillWithAi(
      {
        locale: "zh",
        preview: {
          name: "demo",
          description: "Demo skill",
          fingerprint: "same-fingerprint",
          body: "Use this skill to organize local agent skills.",
          risk: { level: "low", findings: [] },
        },
      },
      options,
    );
    assert.equal(cached.cached, true);
    assert.equal(cached.sections.capabilities, "整理和解释本地 skills。");
    assert.equal(requestCount, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("ai settings connection test uses saved compatible provider settings", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-ai-test-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  await updateAiSettings(
    {
      enabled: false,
      provider: "qwen-dashscope",
      baseUrl: "https://dashscope.example.test/compatible-mode/v1",
      model: "qwen-test",
      apiKey: "secret-key",
    },
    options,
  );

  const originalFetch = globalThis.fetch;
  let capturedRequest;
  globalThis.fetch = async (url, request) => {
    capturedRequest = {
      url,
      headers: request.headers,
      body: JSON.parse(request.body),
    };
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: '{"ok":true,"message":"connected"}',
            },
          },
        ],
      }),
    };
  };

  try {
    const result = await testAiSettingsConnection({ locale: "zh" }, options);
    assert.equal(result.ok, true);
    assert.equal(result.provider, "qwen-dashscope");
    assert.equal(result.model, "qwen-test");
    assert.equal(capturedRequest.url, "https://dashscope.example.test/compatible-mode/v1/chat/completions");
    assert.equal(capturedRequest.body.model, "qwen-test");
    assert.match(capturedRequest.body.messages[1].content, /请只返回 JSON/);
    assert.equal(capturedRequest.headers.authorization, "Bearer secret-key");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("ai interpretation reports provider connection failures clearly", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "skillsmanger-ai-network-"));
  const options = {
    env: {
      SKILLSMANGER_HOME: home,
    },
  };
  await updateAiSettings(
    {
      enabled: true,
      provider: "zhipu",
      baseUrl: "https://api.example.test/v1",
      model: "glm-test",
      apiKey: "secret-key",
    },
    options,
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("network unavailable");
  };

  try {
    await assert.rejects(
      () =>
        interpretSkillWithAi(
          {
            preview: {
              name: "demo",
              description: "Demo skill",
            },
          },
          options,
        ),
      /Could not reach the model provider/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("ai interpretation parser normalizes json and text responses", () => {
  const parsed = parseAiInterpretation(`{
    "summary": "Reads SKILL.md and explains workflows.",
    "riskExplanation": "No script files were found.",
    "recommendation": "Add to the local library."
  }`);
  assert.equal(parsed.summary, "Reads SKILL.md and explains workflows.");
  assert.equal(parsed.capabilities, "");
  assert.equal(parsed.riskExplanation, "No script files were found.");
  assert.equal(parsed.recommendation, "Add to the local library.");

  const fenced = parseAiInterpretation("```json\n{\"whatItDoes\":\"Demo\",\"risk_signals\":\"Check scripts\",\"recommended_next_step\":\"Inspect first\"}\n```");
  assert.equal(fenced.summary, "Demo");
  assert.equal(fenced.riskExplanation, "Check scripts");
  assert.equal(fenced.recommendation, "Inspect first");

  const fallback = parseAiInterpretation("Plain model response.");
  assert.equal(fallback.summary, "Plain model response.");
  assert.equal(fallback.riskExplanation, "");
  assert.equal(fallback.recommendation, "");
});

async function runGit(cwd, args) {
  await execFileAsync("git", args, {
    cwd,
    timeout: 120_000,
    maxBuffer: 1024 * 1024,
  });
}

async function gitOutput(cwd, args) {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    timeout: 120_000,
    maxBuffer: 1024 * 1024,
  });
  return stdout.trim();
}
