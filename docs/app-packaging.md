# App Packaging

## Goal

Package Skills Manager as a macOS-first local app for managing Agent Skills on one Mac.

The app should feel like a local control console, not a team registry, cloud service, or developer-only dashboard.

## Recommended First App Shell

Use a lightweight native shell that loads the local web UI:

```text
macOS app shell
  |
  | opens / supervises
  v
Local Node service on 127.0.0.1:5173
  |
  | serves
  v
Existing browser UI
```

Tauri is the preferred first option because the current UI is already web-based and dependency-free. SwiftUI can be considered later if the UI is rebuilt natively.

The initial Tauri scaffold lives in:

```text
src-tauri/
```

It loads the local console and delegates service readiness to the Node app-shell helpers.
This keeps native code thin while the product is still focused on local Agent Skills
management.

For the concrete setup and verification checklist, see [Native App Runbook](native-app-runbook.md).

## First App Responsibilities

The first app shell should:

- start the local service if it is not running
- open the Skills Manager UI
- show service health
- stop or restart the local service from the app
- reveal important local folders in Finder
- keep all data on this Mac

The first app shell should not introduce:

- team registries
- cloud sync
- account login
- shared policy management
- managed invocation UI
- bridge setup UI

## Local Data

Default data directory:

```text
~/.skillsmanager/
```

Important subdirectories:

```text
library/   local skill library
launchd/   generated LaunchAgent plist files
logs/      local service logs
secrets/   profile-scoped secret metadata
exports/   local diagnostic exports
```

The app should show this location in settings and provide a Finder reveal action.

## Service Lifecycle

Existing service helpers:

```bash
npm run health
npm run service:status
npm run app:launch-plan
npm run app:ensure-ready
npm run app:resource-manifest
npm run app:stage-resources
npm run app:preflight
npm run service:config
npm run service:plist
```

`service:status` is the preferred app-shell diagnostic entry point. It confirms that the
health payload actually belongs to Skills Manager, returns the URL to open, the configured
port, manager home, log paths, and the next action (`open`, `start`, or `choose-port`). It
exits successfully even when the service is stopped or the port is occupied so the app can
handle the state itself.

`app:launch-plan` is the cleaner app-shell entry point. It wraps `service:status` and returns
the exact next action plus the local command needed to start the service when appropriate.
`app:ensure-ready` can be used by a shell that wants Skills Manager to handle start-and-wait
itself; use `--no-start` for a dry run.
`app:resource-manifest` describes which project files belong in the native app resources and
which build/runtime directories should stay out.
`app:stage-resources` copies those files into `.skillsmanger-cache/app-resources` and writes
the resolved manifest beside them.
`app:preflight` checks whether Node, Rust/Cargo, Tauri CLI, and staged resources are ready
for a native build.

First version lifecycle:

1. Resolve bundled resources from `Contents/Resources/app`.
2. Start the bundled Node service when `/api/health` is not already ready.
3. Open the main app window at `http://127.0.0.1:5173`.
4. If startup fails, open `native-error.html` and write `~/.skillsmanager/logs/native-startup-error.log`.
5. When the app window closes, exit the desktop shell and stop the service process it started.

If port `5173` is occupied, the service prints a clear message instead of a raw stack trace.
The app should use `service:status` to distinguish "Skills Manager is already running" from
"another local service is using this port."

LaunchAgent support should remain explicit. The app can offer “Start at login” later, but should not silently install a LaunchAgent.

## Permissions

The app needs local file access to:

- scan common skill roots
- copy skills into selected Agent folders
- read local source folders selected by the user
- write to `~/.skillsmanager`

The app should explain that Skills Manager does not upload skill contents unless the user configures and runs AI interpretation.

## AI Interpretation

AI interpretation remains optional.

The app should clearly state:

- local static checks work without a model
- API keys stay on this Mac
- AI requests send skill metadata and selected content summaries to the configured provider
- supported providers use OpenAI-compatible APIs

## Build Readiness Checklist

- UI has one clear user path: Discover, Review, My Library, Get Skills, Agent Folders.
- Hidden prototype concepts are not exposed in the primary UI.
- Health endpoint is stable.
- `service:status` returns a single app-shell status payload.
- Service config returns port, base URL, manager home, logs, and plist paths.
- Local export excludes secrets and full skill instruction bodies.
- Tests pass with `npm test`.
- The app can recover if port `5173` is already occupied.

## Open Packaging Decisions

- Whether the service runs only while the app is open or can run in the background.
- Whether “Start at login” is included in the first app release.
- Whether logs are shown inside the app or only revealed in Finder.
- Whether the app icon and menu bar status are part of the first package.

## Resolved Packaging Decisions

- The first native app bundles Node at `Contents/Resources/app/node/bin/node`.
- The app shell starts the local service from `Contents/Resources/app/src/server.mjs`.
