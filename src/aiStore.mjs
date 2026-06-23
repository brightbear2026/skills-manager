import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { getManagerHome } from "./runtimeStore.mjs";

const SETTINGS_FILE = "ai-settings.json";
const INTERPRETATIONS_FILE = "ai-interpretations.json";
const DEFAULT_SETTINGS = {
  enabled: false,
  provider: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-5.5",
  apiKey: "",
};

export async function getAiSettings(options = {}) {
  const settings = await readAiSettings(options);
  return sanitizeAiSettings(settings);
}

export async function updateAiSettings(payload = {}, options = {}) {
  const previous = await readAiSettings(options);
  const next = normalizeAiSettings(payload, previous);
  await writeAiSettings(next, options);
  return sanitizeAiSettings(next);
}

export async function testAiSettingsConnection(payload = {}, options = {}) {
  const settings = await readAiSettings(options);
  ensureAiSettingsComplete(settings);
  const locale = normalizeLocale(payload.locale || payload.language);
  const text = await requestChatCompletion(
    settings,
    [
      {
        role: "system",
        content: "You are testing a model connection for a local macOS app. Return only JSON.",
      },
      {
        role: "user",
        content:
          locale === "zh"
            ? '请只返回 JSON：{"ok":true,"message":"connected"}'
            : 'Return only JSON: {"ok":true,"message":"connected"}',
      },
    ],
    { timeoutMs: options.timeoutMs || 20_000 },
  );
  return {
    ok: true,
    provider: settings.provider,
    model: settings.model,
    checkedAt: new Date().toISOString(),
    responsePreview: text.slice(0, 200),
  };
}

export async function interpretSkillWithAi(payload = {}, options = {}) {
  const preview = payload.preview || payload;
  const locale = normalizeLocale(payload.locale || payload.language || preview.locale);
  const cacheKey = buildInterpretationCacheKey(preview, { locale });
  if (!payload.force) {
    const cached = await readCachedInterpretation(cacheKey, options);
    if (cached) {
      return {
        ...cached,
        cached: true,
      };
    }
  }

  const settings = await readAiSettings(options);
  if (!settings.enabled) {
    const error = new Error("AI interpretation is not enabled.");
    error.statusCode = 400;
    error.code = "AI_NOT_ENABLED";
    throw error;
  }
  ensureAiSettingsComplete(settings);

  const prompt = buildInterpretationPrompt(preview, { locale });
  const text = await requestChatCompletion(
    settings,
    [
      {
        role: "system",
        content:
          "You help a local Agent Skills manager explain skills. Be practical, concrete, and safety-aware. The scanner provides local signals; you explain what the skill appears to do, when a user would use it, what files matter, risks, and the next action. Do not claim the skill is safe. Return only JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    { timeoutMs: options.timeoutMs || 45_000 },
  );

  const sections = parseAiInterpretation(text);
  const result = {
    provider: settings.provider,
    model: settings.model,
    interpretedAt: new Date().toISOString(),
    cacheKey,
    cached: false,
    text,
    sections,
  };
  await writeCachedInterpretation(cacheKey, result, options);
  return result;
}

export function parseAiInterpretation(text) {
  const raw = String(text || "").trim();
  const jsonText = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    const parsed = JSON.parse(jsonText);
    return {
      summary: cleanSection(parsed.summary || parsed.whatItDoes || parsed.what_it_does),
      capabilities: cleanSection(parsed.capabilities || parsed.whatItCanDo || parsed.what_it_can_do),
      useCases: cleanSection(parsed.useCases || parsed.use_cases || parsed.whenToUse || parsed.when_to_use),
      howToUse: cleanSection(parsed.howToUse || parsed.how_to_use || parsed.workflow),
      inputsOutputs: cleanSection(parsed.inputsOutputs || parsed.inputs_outputs || parsed.io),
      riskExplanation: cleanSection(
        parsed.riskExplanation || parsed.risk_explanation || parsed.riskSignals || parsed.risk_signals,
      ),
      filesToReview: cleanSection(parsed.filesToReview || parsed.files_to_review || parsed.reviewFiles),
      recommendation: cleanSection(
        parsed.recommendation || parsed.recommendedNextStep || parsed.recommended_next_step,
      ),
      distributionDecision: cleanSection(
        parsed.distributionDecision || parsed.distribution_decision || parsed.copyDecision || parsed.copy_decision,
      ),
    };
  } catch {
    return {
      summary: raw,
      capabilities: "",
      useCases: "",
      howToUse: "",
      inputsOutputs: "",
      riskExplanation: "",
      filesToReview: "",
      recommendation: "",
      distributionDecision: "",
    };
  }
}

function buildInterpretationPrompt(preview = {}, options = {}) {
  const locale = normalizeLocale(options.locale);
  const languageInstruction =
    locale === "zh" ? "Write all JSON string values in Simplified Chinese." : "Write all JSON string values in English.";
  const findings = (preview.risk?.findings || []).map((finding) => ({
    id: finding.id,
    level: finding.level,
    label: finding.label,
  }));
  const files = (preview.files || []).slice(0, 80).map((file) => ({
    path: file.path,
    kind: file.kind,
    executable: Boolean(file.executable),
  }));
  return JSON.stringify(
    {
      language: locale,
      task:
        `Explain this Agent Skill for a local user. ${languageInstruction} Return only JSON with string fields: summary, capabilities, useCases, howToUse, inputsOutputs, riskExplanation, filesToReview, recommendation, distributionDecision. Be specific and infer from SKILL.md instructions and file names. summary is one short paragraph. capabilities lists what the skill can help the agent do. useCases says when a user would pick it. howToUse explains the likely workflow in plain language. inputsOutputs describes likely inputs, outputs, or side effects. riskExplanation explains scanner risk signals and says when there are no obvious local signals. filesToReview lists the most relevant files to inspect. recommendation gives one practical next step: save, inspect first, block, or do not copy yet. distributionDecision says whether it should be copied to agents now and why.`,
      skill: {
        name: preview.name,
        description: preview.description,
        version: preview.version,
        sourceType: preview.sourceType,
        origin: preview.origin,
        risk: {
          level: preview.risk?.level || "low",
          findings,
        },
        validation: preview.validation || [],
        files,
        frontmatter: preview.frontmatter || {},
        instructionsPreview: String(preview.bodyPreview || preview.body || "").slice(0, 6000),
      },
    },
    null,
    2,
  );
}

function buildInterpretationCacheKey(preview = {}, options = {}) {
  const locale = normalizeLocale(options.locale);
  const stableId =
    preview.id ||
    preview.recordId ||
    preview.libraryRecord?.id ||
    preview.governance?.recordId ||
    preview.fingerprint ||
    [
      preview.name || "",
      preview.version || "",
      preview.sourceType || "",
      preview.origin?.url || preview.origin?.path || preview.path || "",
    ].join("|");
  const fingerprint = preview.fingerprint || preview.governance?.fingerprint || "";
  const raw = `${locale}\n${stableId}\n${fingerprint}`;
  return createHash("sha256").update(raw).digest("hex");
}

async function readCachedInterpretation(cacheKey, options) {
  const index = await readInterpretationIndex(options);
  return index.items?.[cacheKey] || null;
}

async function writeCachedInterpretation(cacheKey, interpretation, options) {
  const index = await readInterpretationIndex(options);
  index.items[cacheKey] = {
    ...interpretation,
    cacheKey,
    cached: false,
  };
  await writeInterpretationIndex(index, options);
}

async function readInterpretationIndex(options) {
  const home = getManagerHome(options);
  try {
    const parsed = JSON.parse(await readFile(path.join(home, INTERPRETATIONS_FILE), "utf8"));
    return {
      version: 1,
      items: parsed.items && typeof parsed.items === "object" ? parsed.items : {},
    };
  } catch {
    return {
      version: 1,
      items: {},
    };
  }
}

async function writeInterpretationIndex(index, options) {
  const home = getManagerHome(options);
  await mkdir(home, { recursive: true });
  await writeFile(path.join(home, INTERPRETATIONS_FILE), `${JSON.stringify(index, null, 2)}\n`, "utf8");
}

function normalizeLocale(value) {
  return String(value || "").toLowerCase().startsWith("zh") ? "zh" : "en";
}

async function requestChatCompletion(settings, messages, options = {}) {
  const endpoint = `${settings.baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const timeoutMs = Number(options.timeoutMs || 45_000);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "authorization": `Bearer ${settings.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        temperature: 0.2,
      }),
    });
  } catch (cause) {
    const timedOut = cause?.name === "AbortError";
    const error = new Error(
      timedOut
        ? "Model request timed out. Check the provider endpoint or try a smaller model."
        : "Could not reach the model provider. Check Base URL, network, and API key.",
    );
    error.statusCode = 502;
    error.code = "AI_REQUEST_FAILED";
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body?.error?.message || body?.message || `Model request failed: ${response.status}`;
    const error = new Error(detail);
    error.statusCode = 502;
    error.code = "AI_REQUEST_FAILED";
    throw error;
  }

  const text = String(body?.choices?.[0]?.message?.content || "").trim();
  if (!text) {
    const error = new Error("Model returned an empty interpretation.");
    error.statusCode = 502;
    error.code = "AI_EMPTY_RESPONSE";
    throw error;
  }
  return text;
}

function ensureAiSettingsComplete(settings) {
  if (!settings.baseUrl || !settings.model || !settings.apiKey) {
    const error = new Error("AI settings are incomplete.");
    error.statusCode = 400;
    error.code = "AI_SETTINGS_INCOMPLETE";
    throw error;
  }
}

function cleanSection(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join("\n");
  return String(value || "").trim();
}

function normalizeAiSettings(payload, previous) {
  const baseUrl = String(payload.baseUrl || previous.baseUrl || DEFAULT_SETTINGS.baseUrl).trim();
  const model = String(payload.model || previous.model || DEFAULT_SETTINGS.model).trim();
  const provider = String(payload.provider || previous.provider || DEFAULT_SETTINGS.provider).trim();
  const apiKeyInput = String(payload.apiKey || "").trim();
  const apiKey =
    apiKeyInput && apiKeyInput !== "__keep__" ? apiKeyInput : previous.apiKey || DEFAULT_SETTINGS.apiKey;
  return {
    enabled: Boolean(payload.enabled),
    provider: provider || DEFAULT_SETTINGS.provider,
    baseUrl: baseUrl || DEFAULT_SETTINGS.baseUrl,
    model: model || DEFAULT_SETTINGS.model,
    apiKey,
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeAiSettings(settings) {
  return {
    enabled: Boolean(settings.enabled),
    provider: settings.provider || DEFAULT_SETTINGS.provider,
    baseUrl: settings.baseUrl || DEFAULT_SETTINGS.baseUrl,
    model: settings.model || DEFAULT_SETTINGS.model,
    apiKeySet: Boolean(settings.apiKey),
    updatedAt: settings.updatedAt || null,
  };
}

async function readAiSettings(options) {
  const home = getManagerHome(options);
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(await readFile(path.join(home, SETTINGS_FILE), "utf8")),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

async function writeAiSettings(settings, options) {
  const home = getManagerHome(options);
  await mkdir(home, { recursive: true });
  await writeFile(path.join(home, SETTINGS_FILE), `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
