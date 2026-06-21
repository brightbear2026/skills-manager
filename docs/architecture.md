# Architecture

## v0.1 Shape

The current prototype is a zero-dependency Node application:

```text
Browser UI
  |
  | HTTP JSON
  v
Node server
  |
  | filesystem scan
  v
Local skill roots
```

This keeps the first version easy to run on macOS without Rust, Xcode, Electron, or npm dependency installation.

## Core Runtime Model

Skills Manager separates storage from invocation:

```text
Central library / discovered skill package
  - read-only skill source

Invocation run
  - agent id
  - skill id and version
  - input
  - output
  - logs
  - isolated run directory

Lock
  - optional coordination primitive
  - acquired only when the selected invocation mode requires it
```

Two agents can call the same skill at the same time only when the selected resource locks allow it. They never share a run directory.

```text
Agent A -> invocation inv_a -> runs/inv_a
Agent B -> invocation inv_b -> runs/inv_b
```

The skill package remains a shared read-only source. Runtime state is per invocation.

## Manager Home

The default manager home is:

```text
~/.skillsmanager/
  library/
  runs/
  bridge/
  launchd/
  logs/
  secrets/
  exports/
  profiles.json
  runs.json
  locks.json
  state.json
```

For tests or local experiments, set:

```bash
SKILLSMANGER_HOME=/tmp/skillsmanger npm run dev
```

The environment variable intentionally follows the current repository spelling.

## Modules

- `src/server.mjs`: HTTP server and static file serving.
- `src/skillScanner.mjs`: skill root discovery, `SKILL.md` parsing, risk scan, and catalog building.
- `src/runtimeStore.mjs`: agent profiles, invocation runs, lock state, and queue promotion.
- `src/governanceStore.mjs`: local management records, marker files, fingerprints, adopt, and publish flows.
- `src/sourceInstaller.mjs`: local path and GitHub source preview/install flow.
- `src/bridgeStore.mjs`: generated bridge skill for managed/hybrid invocation handoff.
- `src/serviceStore.mjs`: service health metadata and macOS launchd plist generation.
- `src/appShellStore.mjs`: app-shell launch planning, service start command construction, and readiness waiting.
- `src/exportStore.mjs`: local diagnostics snapshot generation with sensitive fields redacted.
- `src/cli.mjs`: local health and service-management CLI.
- `public/app.js`: browser UI state and rendering.
- `public/styles.css`: application styling.

## API

### `GET /api/health`

Returns local service health metadata for app shells, menu bar status, and CLI checks.

```json
{
  "ok": true,
  "service": "com.skillsmanager.local",
  "version": "0.5.1",
  "port": 5173,
  "baseUrl": "http://127.0.0.1:5173"
}
```

### `GET /api/export`

Returns a local diagnostics snapshot for troubleshooting the current Mac installation.
It includes service metadata, scanned root summaries, local library records, profiles, locks, and run metadata.
It does not include secret values, invocation prompts, invocation outputs, or full skill instruction bodies.

### `GET /api/skills`

Returns the full scanned catalog.

```json
{
  "scannedAt": "2026-06-14T00:00:00.000Z",
  "roots": [],
  "skills": [],
  "counts": {
    "skills": 0,
    "roots": 0,
    "highRisk": 0,
    "mediumRisk": 0,
    "lowRisk": 0
  }
}
```

### `GET /api/skills/:id`

Returns one skill detail from the current scan.

### `GET /api/runtime`

Returns manager home, profiles, recent invocations, active locks, and runtime counts.

### `POST /api/invocations`

Creates a simulated invocation.

```json
{
  "agentId": "claude-code",
  "skillId": "abc123",
  "policy": "serialized",
  "resourceKey": "/path/to/project",
  "prompt": "Summarize this input"
}
```

The response is `running`, `queued`, or `completed` depending on the selected concurrency policy and current locks.

### `POST /api/invocations/:id/complete`

Completes a running invocation, releases its lock, and promotes the next queued invocation when possible.

### `POST /api/skills/:id/adopt`

Copies a discovered skill into the central library and writes an adopted marker into the source directory.

### `POST /api/skills/:id/publish`

Publishes a managed mirror to the selected agent profile. Existing unmanaged targets are not overwritten.

### `POST /api/skills/:id/mode`

Updates the invocation mode for a discovered skill.

### `POST /api/sources/preview`

Prepares a local or GitHub source and returns metadata, file inventory, fingerprint, validation warnings, and risk hints. For GitHub sources, this uses `git clone` in a temporary directory.

```json
{
  "source": "owner/repo",
  "ref": "v1.0.0",
  "subdir": "skills/example"
}
```

### `POST /api/sources/install`

Installs the previewed source into the central library. It does not publish to any agent profile.

```json
{
  "source": "/path/to/skill",
  "invocationMode": "hybrid",
  "replace": false
}
```

### `GET /api/library`

Returns all central library records, including records that are not present in any scanned skill root.

### `POST /api/library/:recordId/publish`

Publishes a library record directly to an agent profile.

```json
{
  "profileId": "codex",
  "invocationMode": "hybrid"
}
```

## Scanner Rules

- A skill is any directory containing a `SKILL.md`.
- The scanner recursively searches roots to a bounded depth.
- The scanner skips common heavy directories like `.git`, `node_modules`, `dist`, and `coverage`.
- Symlink behavior is conservative in v0.1.
- Missing roots are reported but ignored.

## Risk Model

The v0.1 risk model is heuristic. It produces hints for human review, not a final security verdict.

Risk signals include:

- Shell commands capable of deleting, moving, or changing permissions.
- Network fetch or upload commands.
- Access to environment variables and common secret names.
- References to sensitive paths such as `.ssh`, `.aws`, `.config`, and Keychain.
- Dynamic context injection in `SKILL.md`.
- Bundled executable scripts.

## Concurrency Policies

- `parallel`: no lock; safe for read-only context, search, summarization, and other stateless work.
- `serialized`: locks by skill id; useful when the skill has mutable local state.
- `singleton`: locks by skill name; useful when the skill starts a local service or binds a fixed port.
- `keyed`: locks by resource key; useful when the real conflict is a project, folder, database, or external system.

The product should prefer resource locks over broad skill locks whenever possible.

## Local Management Plane

Skills Manager has a local management plane separate from the invocation plane.

```text
Discovered agent skill
  |
  | adopt
  v
~/.skillsmanager/library/<skill>/versions/<version>/
  |
  | publish
  v
Agent-native skill root
```

The published directory is a complete skill folder. Agents do not need Skills Manager to read it.

Each managed or adopted skill directory can contain:

```text
.skillsmanager.json
```

This marker is ignored by agents and used by Skills Manager to track management status, library record id, fingerprint, profile target, publish mode, and invocation mode.

Management statuses:

- `unmanaged`: no managed marker, still visible and reviewable.
- `adopted`: copied into the central library.
- `managed`: published by Skills Manager into an agent profile.

Invocation modes:

- `native`: agent-native call path.
- `managed`: Skills Manager Bridge/runtime call path.
- `hybrid`: native for ordinary use, managed when local locking, review, secrets, or runtime logs are needed.

## Source Import Plane

Source import is intentionally separate from publish:

```text
Local path or GitHub repo
  |
  | preview
  v
metadata + risk + fingerprint
  |
  | install
  v
~/.skillsmanager/library/<skill>/versions/<version>/
  |
  | later publish
  v
Agent-native skill root
```

This keeps downloading and agent distribution as two separate user decisions.

## Library Publishing Plane

Library publishing closes the gap between install and agent availability:

```text
Install to library
  |
  v
Library record
  |
  | publish
  v
Agent-native managed mirror
```

The record can be published even when the skill has never appeared in a scanned agent directory.

## Future Native App

Once the product flow is proven, wrap the same core scanner in one of:

- Tauri: best fit if we want a small app with a Rust native shell.
- SwiftUI: best fit if we want the most native macOS experience.
- Electron: fastest if the product grows into a complex desktop app.

The scanner should remain a standalone package so it can power the local CLI, desktop UI, and future native app shell.
