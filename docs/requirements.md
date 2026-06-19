# Requirements

## Product Positioning

Skills Manager is a local package manager and control console for Agent Skills. The first product goal is not to create another folder viewer. The first product goal is to make local skills discoverable, reviewable, and portable across agent clients.

## Core Problems

1. Skills are fragmented across tool-specific directories.
2. Users cannot easily tell which skills are installed, enabled, duplicated, or stale.
3. Third-party skills can contain scripts, dynamic commands, and hidden access to sensitive data.
4. There is no simple workflow for installing from GitHub, pinning a version, reviewing diffs, and publishing the same skill to multiple agent clients.

## Primary Users

- Individual power users running Claude Code, Codex, OpenClaw, Cursor, OpenCode, or similar tools.
- Developers building and testing custom Agent Skills.
- Security-conscious local users who want to review skills before enabling them.

## MVP Scope

The v0.1 MVP must:

- Scan common local skills directories.
- Discover directories containing `SKILL.md`.
- Parse required metadata: `name` and `description`.
- Show the skill source, path, target tool, file inventory, and update timestamp.
- Detect same-name conflicts across roots.
- Flag basic risk indicators:
  - executable scripts
  - destructive commands
  - network downloads
  - secret and environment variable access
  - sensitive filesystem paths
  - dynamic command injection
- Provide a local browser UI with search and filters.
- Provide a CLI scan mode that outputs JSON.

## v0.2 Invocation Coordination Scope

The v0.2 prototype must:

- Create a central Skills Manager home at `~/.skillsmanager` by default.
- Store agent profiles for Claude Code, Codex, and OpenClaw.
- Treat discovered skill packages as read-only sources during invocation.
- Create one isolated invocation record per agent request.
- Persist invocation metadata, input, output, and run directory paths.
- Support concurrency policies:
  - `parallel`: no lock
  - `serialized`: one running invocation per skill id
  - `singleton`: one running invocation per skill name
  - `keyed`: one running invocation per resource key
- Queue a second invocation when a required lock is already held.
- Promote the next queued invocation after the lock holder completes.
- Expose the runtime through local API endpoints and the browser UI.

## v0.3 Local Management and Distribution Scope

The v0.3 prototype must:

- Preserve agent-native skill usage when Skills Manager is not running.
- Classify discovered skills as:
  - `unmanaged`: found in an agent directory but not controlled by Skills Manager
  - `adopted`: copied into the central library and marked as known
  - `managed`: published by Skills Manager to an agent profile
- Create a central library under `~/.skillsmanager/library`.
- Store library records with source path, fingerprint, version, invocation mode, and publish targets.
- Publish managed mirrors into agent-native skill roots.
- Refuse to overwrite an existing unmanaged target.
- Write `.skillsmanager.json` marker files for adopted and managed skill directories.
- Support invocation modes:
  - `native`: agent calls the skill directly
  - `managed`: bridge/runtime should handle invocation
  - `hybrid`: native by default, managed when local review or locking is needed

## v0.4 Source Import Scope

The v0.4 prototype must:

- Accept a local path or GitHub source.
- Support optional Git ref and repo subdirectory.
- Preview a source before install.
- Parse `SKILL.md`, list files, compute fingerprint, and show heuristic risk.
- Install into the central library without publishing to any agent.
- Refuse same name/version content conflicts unless replace is explicitly requested.
- Store source origin metadata in the library version directory.

## v0.5 Library Publishing Scope

The v0.5 prototype must:

- List central library records independently from scanned agent skill roots.
- Select a library record as a first-class detail view.
- Publish a library-only record to an agent profile.
- Preserve the install and publish separation:
  - install means stored in the central library
  - publish means copied to an agent-native skill root
- Show existing publish targets for each library record.

## Out of Scope for v0.1

- Installing from GitHub.
- Updating skills.
- Editing skills in place.
- Running skill scripts.
- Executing real invocation scripts.
- Publishing to registries.
- Full YAML parsing.
- Code signing and notarized macOS app packaging.

## Acceptance Criteria

- `npm run dev` starts a local server without installing dependencies.
- The UI loads at `http://localhost:5173`.
- The scanner reports existing skills from at least one configured root when present.
- A missing root does not cause an error.
- A malformed `SKILL.md` is shown with a validation warning.
- Risk flags are visible in both the list and detail panel.
- The scanner never serves arbitrary files outside the static UI directory through the web server.

## Product Principles

- Local first: no cloud dependency for scanning or viewing skills.
- Trust is explicit: third-party skills start as untrusted.
- Inspect before install: every future install/update flow must show files and diffs before writing.
- Cross-client by design: skills should be portable across compatible agents when possible.
- Small core, pluggable adapters: tool-specific behavior should live behind adapters.
