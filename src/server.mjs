import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  adoptSkill,
  enrichCatalogWithGovernance,
  getLibraryCatalog,
  getLibraryRecordDetail,
  publishLibraryRecord,
  republishLibraryRecord,
  rollbackLibraryRecord,
  publishSkill,
  unpublishLibraryRecord,
  updateInvocationMode,
  updateLibraryTrustPolicy,
  updateSkillTrustPolicy,
} from "./governanceStore.mjs";
import {
  adoptFirstRunSkills,
  completeFirstRunImport,
  getFirstRunImport,
} from "./firstRunStore.mjs";
import { ensureBridgeSkill } from "./bridgeStore.mjs";
import { scanCatalog } from "./skillScanner.mjs";
import {
  completeInvocation,
  createProfile,
  createInvocation,
  deleteProfile,
  deleteProfileSecret,
  getProfileSecrets,
  getProfiles,
  getRuntimeState,
  resetRuntimeState,
  resetProfiles,
  setProfileSecret,
  updateProfile,
} from "./runtimeStore.mjs";
import { installSkillSource, previewSkillSource } from "./sourceInstaller.mjs";
import { buildHealthPayload } from "./serviceStore.mjs";
import { buildLocalExport } from "./exportStore.mjs";
import { getAiSettings, interpretSkillWithAi, testAiSettingsConnection, updateAiSettings } from "./aiStore.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(process.env.SKILLSMANGER_PROJECT_ROOT || path.resolve(__dirname, ".."));
const publicDir = path.resolve(process.env.SKILLSMANGER_PUBLIC_DIR || path.join(projectRoot, "public"));
const port = Number(process.env.PORT || 5173);
const startedAt = new Date().toISOString();

if (process.argv.includes("--scan")) {
  const catalog = await scanCatalog({ cwd: projectRoot });
  process.stdout.write(`${JSON.stringify(catalog, null, 2)}\n`);
  process.exit(0);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (url.pathname === "/api/health") {
      return json(response, buildHealthPayload({ startedAt }));
    }

    if (url.pathname === "/api/export") {
      const catalog = await loadCatalog();
      const bundle = await buildLocalExport({ catalog, startedAt, projectRoot });
      return json(response, bundle);
    }

    if (url.pathname === "/api/skills") {
      const catalog = await loadCatalog();
      return json(response, catalog);
    }

    if (url.pathname === "/api/runtime") {
      const runtime = await getRuntimeState();
      return json(response, runtime);
    }

    if (url.pathname === "/api/profiles" && request.method === "GET") {
      const profiles = await getProfiles();
      return json(response, profiles);
    }

    if (url.pathname === "/api/profiles" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await createProfile(payload);
      return json(response, result, 201);
    }

    if (url.pathname === "/api/profiles/reset" && request.method === "POST") {
      const profiles = await resetProfiles();
      return json(response, profiles);
    }

    const profileMatch = url.pathname.match(/^\/api\/profiles\/([^/]+)$/);
    if (profileMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await updateProfile(decodeURIComponent(profileMatch[1]), payload);
      return json(response, result);
    }
    if (profileMatch && request.method === "DELETE") {
      const result = await deleteProfile(decodeURIComponent(profileMatch[1]));
      return json(response, result);
    }

    if (url.pathname === "/api/library") {
      const library = await getLibraryCatalog();
      return json(response, library);
    }

    const libraryDetailMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/detail$/);
    if (libraryDetailMatch && request.method === "GET") {
      const result = await getLibraryRecordDetail(decodeURIComponent(libraryDetailMatch[1]));
      return json(response, result);
    }

    if (url.pathname === "/api/first-run") {
      const catalog = await loadCatalog();
      const result = await getFirstRunImport(catalog);
      return json(response, result);
    }

    if (url.pathname === "/api/first-run/adopt" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await adoptFirstRunSkills(catalog, payload);
      return json(response, result, 201);
    }

    if (url.pathname === "/api/first-run/complete" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await completeFirstRunImport(payload);
      return json(response, result);
    }

    if (url.pathname === "/api/invocations" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await createInvocation(catalog, payload);
      return json(response, result, 201);
    }

    const completeMatch = url.pathname.match(/^\/api\/invocations\/(inv_[a-f0-9]{8})\/complete$/);
    if (completeMatch && request.method === "POST") {
      const result = await completeInvocation(completeMatch[1]);
      return json(response, result);
    }

    if (url.pathname === "/api/runtime/reset" && request.method === "POST") {
      const result = await resetRuntimeState();
      return json(response, result);
    }

    if (url.pathname === "/api/bridge" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await ensureBridgeSkill(payload);
      return json(response, result, 201);
    }

    const profileSecretsMatch = url.pathname.match(/^\/api\/profiles\/([^/]+)\/secrets$/);
    if (profileSecretsMatch && request.method === "GET") {
      const result = await getProfileSecrets(decodeURIComponent(profileSecretsMatch[1]));
      return json(response, result);
    }

    if (profileSecretsMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await setProfileSecret(decodeURIComponent(profileSecretsMatch[1]), payload);
      return json(response, result);
    }

    const profileSecretDeleteMatch = url.pathname.match(
      /^\/api\/profiles\/([^/]+)\/secrets\/([^/]+)$/,
    );
    if (profileSecretDeleteMatch && request.method === "DELETE") {
      const result = await deleteProfileSecret(
        decodeURIComponent(profileSecretDeleteMatch[1]),
        decodeURIComponent(profileSecretDeleteMatch[2]),
      );
      return json(response, result);
    }

    if (url.pathname === "/api/sources/preview" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await previewSkillSource(payload);
      return json(response, result);
    }

    if (url.pathname === "/api/sources/install" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await installSkillSource(payload);
      return json(response, result, 201);
    }

    if (url.pathname === "/api/ai/settings" && request.method === "GET") {
      const result = await getAiSettings();
      return json(response, result);
    }

    if (url.pathname === "/api/ai/settings" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await updateAiSettings(payload);
      return json(response, result);
    }

    if (url.pathname === "/api/ai/test" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await testAiSettingsConnection(payload);
      return json(response, result);
    }

    if (url.pathname === "/api/ai/interpret" && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await interpretSkillWithAi(payload);
      return json(response, result);
    }

    const libraryPublishMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/publish$/);
    if (libraryPublishMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await publishLibraryRecord(decodeURIComponent(libraryPublishMatch[1]), payload);
      return json(response, result, 201);
    }

    const libraryRepublishMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/republish$/);
    if (libraryRepublishMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await republishLibraryRecord(
        decodeURIComponent(libraryRepublishMatch[1]),
        payload,
      );
      return json(response, result, 201);
    }

    const libraryRollbackMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/rollback$/);
    if (libraryRollbackMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await rollbackLibraryRecord(
        decodeURIComponent(libraryRollbackMatch[1]),
        payload,
      );
      return json(response, result, 201);
    }

    const libraryUnpublishMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/unpublish$/);
    if (libraryUnpublishMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await unpublishLibraryRecord(
        decodeURIComponent(libraryUnpublishMatch[1]),
        payload,
      );
      return json(response, result);
    }

    const libraryTrustMatch = url.pathname.match(/^\/api\/library\/([^/]+)\/trust$/);
    if (libraryTrustMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const result = await updateLibraryTrustPolicy(decodeURIComponent(libraryTrustMatch[1]), payload);
      return json(response, result);
    }

    const skillMatch = url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})$/);
    if (skillMatch) {
      const catalog = await loadCatalog();
      const skill = catalog.skills.find((item) => item.id === skillMatch[1]);
      if (!skill) return json(response, { error: "Skill not found" }, 404);
      return json(response, skill);
    }

    const adoptMatch = url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})\/adopt$/);
    if (adoptMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await adoptSkill(catalog, adoptMatch[1], payload);
      return json(response, result, 201);
    }

    const publishMatch = url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})\/publish$/);
    if (publishMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await publishSkill(catalog, publishMatch[1], payload);
      return json(response, result, 201);
    }

    const modeMatch = url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})\/mode$/);
    const governanceMatch =
      modeMatch || url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})\/governance$/);
    if (governanceMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await updateInvocationMode(catalog, governanceMatch[1], payload);
      return json(response, result);
    }

    const trustMatch = url.pathname.match(/^\/api\/skills\/([a-f0-9]{16})\/trust$/);
    if (trustMatch && request.method === "POST") {
      const payload = await readJsonBody(request);
      const catalog = await loadCatalog();
      const result = await updateSkillTrustPolicy(catalog, trustMatch[1], payload);
      return json(response, result);
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    const payload = {
      error: "Internal server error",
      detail: error instanceof Error ? error.message : String(error),
    };
    for (const key of ["code", "hint", "policy", "diff", "record"]) {
      if (error?.[key] !== undefined) payload[key] = error[key];
    }
    return json(
      response,
      payload,
      error.statusCode || 500,
    );
  }
});

server.on("error", (error) => {
  if (error?.code === "EADDRINUSE") {
    process.stderr.write(
      `Skills Manager could not start because http://127.0.0.1:${port} is already in use.\n`,
    );
    process.stderr.write("Run `npm run health` to check whether Skills Manager is already running.\n");
    process.stderr.write("Or start with another port, for example: PORT=5174 npm run dev\n");
    process.exitCode = 1;
    return;
  }

  throw error;
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Skills Manager running at http://127.0.0.1:${port}\n`);
});

async function loadCatalog() {
  const catalog = await scanCatalog({ cwd: projectRoot });
  return enrichCatalogWithGovernance(catalog);
}

async function serveStatic(requestPath, response) {
  const safePath = requestPath === "/" ? "/index.html" : decodeURIComponent(requestPath);
  const candidate = path.normalize(path.join(publicDir, safePath));
  if (candidate !== publicDir && !candidate.startsWith(`${publicDir}${path.sep}`)) {
    response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const info = await stat(candidate);
    if (!info.isFile()) throw new Error("Not a file");
    const body = await readFile(candidate);
    response.writeHead(200, {
      "content-type": contentType(candidate),
      "cache-control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function json(response, payload, status = 200) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload, null, 2));
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function contentType(filePath) {
  const extension = path.extname(filePath);
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".js") return "text/javascript; charset=utf-8";
  if (extension === ".json") return "application/json; charset=utf-8";
  if (extension === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}
