# Native App Runbook

This runbook tracks the path from the current local web console to a macOS app shell.

Skills Manager remains a local Agent Skills console. The native shell should open and
supervise the local service; it should not add accounts, cloud sync, team registry, or
managed invocation UI.

## Current State

Implemented:

- local service health and status commands
- app launch plan and ensure-ready commands
- app resource manifest
- app resource staging
- Tauri shell scaffold in `src-tauri/`
- packaging preflight checks
- generated app icon set and DMG background
- signing and notarization preflight command

Still required for a real native build on this Mac:

- Apple Developer signing identity and notarization credentials
- clean-Mac QA

## Local Checklist

1. Stage resources:

```bash
npm run app:assets
npm run app:stage-resources
```

2. Run packaging preflight:

```bash
npm run app:preflight
```

3. If Xcode Command Line Tools are missing:

```bash
xcode-select --install
```

4. If Rust/Cargo are missing, install Rust from the official Rust toolchain installer:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

5. Install the Tauri CLI after Cargo is available:

```bash
cargo install tauri-cli --version "^2"
```

6. Re-run preflight:

```bash
npm run app:preflight
```

7. Check signing readiness before release packaging:

```bash
npm run app:signing-preflight
```

8. Start the native shell:

```bash
npm run tauri:dev
```

9. Build the app package:

```bash
npm run app:build-local
```

`app:build-local` creates an unsigned local `.app` and `.dmg`. Public distribution still
requires signing, notarization, and QA.

## Runtime Decision

The first app shell bundles the current Node runtime into:

```text
Contents/Resources/app/node/bin/node
```

This keeps the app usable for non-developers. The app falls back to a system `node` only if
the bundled runtime is missing.

## Verification

Before considering an app build usable:

- `npm test` passes
- `npm run app:assets` regenerates app icons and the DMG background
- `npm run app:stage-resources` succeeds
- `npm run app:preflight` returns `ready: true`
- `npm run app:signing-preflight` returns `ready: true` before release distribution
- `npm run app:build-local` creates the local `.app` and `.dmg`
- `npm run tauri:dev` opens the local console
- packaged `.app` starts the local service from `Contents/Resources/app`
- closing the app exits the shell and stops the service process it started
- service startup failure opens `native-error.html` and writes `~/.skillsmanager/logs/native-startup-error.log`
- clean-Mac QA is still required before release distribution

## Signing And Notarization

Release distribution needs an Apple Developer account. Keep credentials out of the repo.

Accepted notarization credential modes:

- `NOTARYTOOL_KEYCHAIN_PROFILE`
- `APPLE_API_KEY` and `APPLE_API_ISSUER`
- `APPLE_ID`, `APPLE_TEAM_ID`, and `APPLE_APP_SPECIFIC_PASSWORD`

Optional signing identity override:

```bash
npm run app:signing-preflight -- --signing-identity "Developer ID Application: Your Name"
```

For Tauri release signing, provide the same identity through the Tauri environment or final
release configuration. Do not commit account-specific signing identities or secrets.

## References

- Tauri v2 prerequisites: https://v2.tauri.app/start/prerequisites/
- Tauri v2 create project: https://v2.tauri.app/start/create-project/
- Rust install: https://www.rust-lang.org/tools/install
