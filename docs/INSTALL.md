# Installation Guide

## Download

macOS Apple Silicon:

[Download Skills-Manager_0.5.1_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.1_aarch64.dmg)

Releases:

[https://github.com/brightbear2026/skills-manager/releases](https://github.com/brightbear2026/skills-manager/releases)

## Install

1. Download the DMG.
2. Open the DMG.
3. Drag `Skills Manager.app` to `Applications`.
4. Open `Skills Manager.app` from `Applications`.

## If macOS Blocks The App

The current test build is ad-hoc signed, but it is not Developer ID signed or Apple-notarized. On first launch, macOS may say that it cannot verify the developer.

To open it:

1. Open `Applications`.
2. Find `Skills Manager.app`.
3. Right-click it and choose `Open`.
4. Confirm `Open` again.

If macOS still blocks it:

1. Open `System Settings`.
2. Go to `Privacy & Security`.
3. Find the Skills Manager warning.
4. Choose `Open Anyway`.

Company-managed or school-managed Macs may block apps that are not Developer ID signed or notarized.

## Local Service

Skills Manager starts a local service on this Mac:

```text
http://127.0.0.1:5173
```

Closing the app window exits the desktop shell and stops the service process it started.

## Local Data

Default data directory:

```text
~/.skillsmanager
```

Removing the app does not automatically remove this directory.

## Developer Local Build

```bash
npm run app:build-local
```

Outputs:

```text
src-tauri/target/release/bundle/macos/Skills Manager.app
src-tauri/target/release/bundle/dmg/Skills Manager_0.5.1_aarch64.dmg
```
