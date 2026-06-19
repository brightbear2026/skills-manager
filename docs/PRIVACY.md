# Privacy and Local Data

Skills Manager is currently a local Agent Skills console.

## No Upload By Default

By default, Skills Manager does not upload:

- your skill contents
- local library contents
- Agent folders
- scan results
- logs
- API keys

Scanning and risk hints run locally on this Mac.

## Local Data Directory

Default directory:

```text
~/.skillsmanager
```

Common contents:

```text
library/       local skills library
logs/          local service logs
secrets/       profile-scoped secret storage
exports/       diagnostics exports
ai-settings.json
profiles.json
state.json
```

## AI Interpretation

AI interpretation is optional. If AI settings are disabled, Skills Manager does not call a model API.

When enabled:

- Requests may include skill metadata, risk hints, file summaries, and a truncated instruction preview.
- Requests are sent to the OpenAI-compatible endpoint you configure.
- Compatible providers include DeepSeek, Qwen, Kimi, Zhipu-compatible endpoints, and other OpenAI-compatible APIs.
- Skills Manager does not bundle API keys into the app or DMG.

In the current version, AI API keys are stored at:

```text
~/.skillsmanager/ai-settings.json
```

This is a local plain-text JSON file. A future version should move this storage to macOS Keychain.

## Packaging Safety

The app bundle includes only:

- `src/`
- `public/`
- `package.json`
- `README.md`
- selected `docs/`
- bundled Node runtime

The packaging flow does not include:

- `~/.skillsmanager`
- `.env`
- `.skillsmanger-cache`
- `src-tauri/target`
- `node_modules`

## Diagnostics Export

Diagnostics exports do not include:

- secret values
- invocation prompts
- invocation outputs
- full skill instruction bodies

Exports may still include local paths and state summaries. Review exports before sharing them.

## Uninstall

Removing the app does not automatically remove local data. To fully remove local data:

```bash
rm -rf ~/.skillsmanager
```

Only run this if you no longer need your local library and settings.
