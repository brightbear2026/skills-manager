# Roadmap

## v0.1 - Local Audit MVP

- Local scan.
- Metadata parsing.
- Risk hints.
- Browser UI.
- CLI JSON output.

## v0.2 - Local Library

- Central manager home at `~/.skillsmanager`.
- Add discovered skills into a local library.
- Preserve agent-native skill usage.
- Track known local skills without deleting or overwriting user-owned folders.

## v0.3 - Copy to Agent

- Configure local Agent folders.
- Copy library skills into Claude Code, Codex, OpenClaw, or custom roots.
- Detect same-name target conflicts before writing.
- Track copied locations.

## v0.4 - Source Import

- Preview local skill directory.
- Preview Git repository, GitHub shorthand, archive, or supported SkillsMP source.
- Compute fingerprint and risk before adding.
- Add into the local library without copying to an agent.
- Store origin metadata.

## v0.5 - Local Console UX

- Five primary pages:
  - Discover
  - Review
  - My Library
  - Get Skills
  - Agent Folders
- First-run import.
- Copy decisions for high-risk skills.
- AI interpretation settings with OpenAI-compatible providers.
- Chinese and English UI.

## v0.6 - Native macOS App

- Package the current local console in an app shell.
- Start, stop, and restart the local service.
- Show service health.
- Reveal local library, logs, and Agent folders in Finder.
- Optional LaunchAgent generation, installed only after explicit user action.

## v0.7 - Import and Update Quality

- Pin commit or tag.
- Show resolved commit after source check.
- Show file diff before update.
- Improve archive and non-Git source handling.
- Better failure messages for network and source parsing errors.

## v0.8 - Copy Management

- Show every Agent folder a library skill has been copied to.
- Update existing copies.
- Remove copied skill folders that Skills Manager created.
- Roll back to an older library version.
- Keep protecting user-owned target folders from overwrite.

## v0.9 - App Polish

- App icon.
- Menu bar status.
- Start-at-login setting.
- In-app log viewer or Finder reveal.
- Signed and notarized macOS release.

## Later / Experimental

These are not part of the current local-console product:

- managed invocation runtime
- bridge skill UI
- team registry
- cloud sync
- policy-as-code
- signed skill packages
- shared allowlist/blocklist
