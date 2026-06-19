import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getManagerHome } from "./runtimeStore.mjs";

const SETTINGS_FILE = "ai-settings.json";
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
  const settings = await readAiSettings(options);
  if (!settings.enabled) {
    const error = new Error("AI interpretation is not enabled.");
    error.statusCode = 400;
    error.code = "AI_NOT_ENABLED";
    throw error;
  }
  ensureAiSettingsComplete(settings);

  const preview = payload.preview || payload;
  const locale = normalizeLocale(payload.locale || payload.language || preview.locale);
  const prompt = buildInterpretationPrompt(preview, { locale });
  const text = await requestChatCompletion(
    settings,
    [
      {
        role: "system",
        content:
          "You help a local macOS Agent Skills manager explain skills. Be concise, practical, and safety-aware. The local scanner provides risk signals; you explain them and suggest next steps. Do not claim the skill is safe. Return only JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    { timeoutMs: options.timeoutMs || 45_000 },
  );

  const sections = parseAiInterpretation(text);
  return {
    provider: settings.provider,
    model: settings.model,
    interpretedAt: new Date().toISOString(),
    text,
    sections,
  };
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
      riskExplanation: cleanSection(
        parsed.riskExplanation || parsed.risk_explanation || parsed.riskSignals || parsed.risk_signals,
      ),
      recommendation: cleanSection(
        parsed.recommendation || parsed.recommendedNextStep || parsed.recommended_next_step,
      ),
    };
  } catch {
    return {
      summary: raw,
      riskExplanation: "",
      recommendation: "",
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
        `Explain this Agent Skill for a local user. ${languageInstruction} Return only JSON with string fields: summary, riskExplanation, recommendation. summary says what it does. riskExplanation explains the local risk signals from the scanner and should say when there are no obvious local signals. recommendation gives one practical next step: add to library, inspect first, block, or do not distribute yet.`,
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
        instructionsPreview: String(preview.bodyPreview || preview.body || "").slice(0, 3000),
      },
    },
    null,
    2,
  );
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
