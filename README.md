# Skills Manager

[中文](#中文) | [English](#english)

## 中文

Skills Manager 是一个 **本地 Agent Skills 控制台**。它会自动发现这台 Mac 上已有的 Agent Skills，帮助你集中查看、审查风险、加入本机库，并按需复制到 Claude Code、Codex、OpenClaw 或自定义 Agent 的 skills 目录。

> 当前版本：`v0.5.0`  
> 当前打包：macOS Apple Silicon / aarch64  
> 说明：当前 DMG 是 ad-hoc signed，但没有 Developer ID 签名和 Apple notarization，适合小范围试用。首次打开可能需要右键 App 选择“打开”。

### 下载

- macOS Apple Silicon DMG: [Skills-Manager_0.5.0_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.0_aarch64.dmg)
- Release 页面: [GitHub Releases](https://github.com/brightbear2026/skills-manager/releases)

### 它解决什么问题

- 不同 Agent 的 skills 分散在多个目录里，难以统一查看。
- 第三方 skill 可能包含脚本、联网、删除文件、读取密钥等风险。
- 用户需要先看清一个 skill 做什么，再决定是否加入本机库或复制给某个 Agent。
- 同一个 skill 需要复制到多个 Agent 时，手工操作容易混乱。

### 核心功能

- 自动发现本机常见 skills 目录。
- 解析 `SKILL.md` 的名称、描述、版本和说明。
- 显示文件清单、来源、本机状态和风险提示。
- 支持首次导入：只读扫描，不覆盖、不删除、不自动复制。
- 支持本机库：把可信或待管理的 skills 集中存放在 `~/.skillsmanager/library`。
- 支持获取新 skill：本地文件夹、Git 仓库、GitHub shorthand、压缩包、部分 SkillsMP 页面。
- 支持 AI 解读：可接 OpenAI-compatible API，包括 DeepSeek、Qwen、Kimi、智谱等兼容端点。
- 支持复制到 Agent：从本机库复制到 Claude Code、Codex、OpenClaw 或自定义目录。
- 支持中文/英文 UI 切换。

### 当前产品边界

Skills Manager 当前只做本机控制台：

- 不做云同步。
- 不做团队注册表。
- 不上传你的 skills。
- 不托管执行你的 skills。
- 不自动修改 Agent 目录，除非你明确点击复制。

### 安装

1. 下载 DMG。
2. 打开 DMG，把 `Skills Manager.app` 拖到 `Applications`。
3. 首次打开如果 macOS 拦截，右键 `Skills Manager.app`，选择“打开”。
4. App 会在本机启动服务并打开控制台。

更多说明见：[中文安装说明](docs/INSTALL.zh-CN.md)。

### 本机数据和隐私

默认本机数据目录：

```text
~/.skillsmanager
```

这里会存放本机库、扫描状态、日志、AI 设置等。API key 不会被打进 App 或 DMG，但当前版本会明文保存在本机 `~/.skillsmanager/ai-settings.json`。后续版本计划改为 macOS Keychain。

更多说明见：[中文隐私说明](docs/PRIVACY.zh-CN.md)。

### 开发运行

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:5173
```

### 本地打包

```bash
npm run app:build-local
```

产物位置：

```text
src-tauri/target/release/bundle/macos/Skills Manager.app
src-tauri/target/release/bundle/dmg/Skills Manager_0.5.0_aarch64.dmg
```

发布前检查：

```bash
npm run app:preflight
npm run app:signing-preflight
```

正式公开分发前仍需要 Apple Developer `Developer ID Application` 证书、notarytool 公证凭据，以及干净 Mac QA。

### 文档

- [安装说明](docs/INSTALL.zh-CN.md)
- [隐私和本机数据](docs/PRIVACY.zh-CN.md)
- [需求说明](docs/requirements.md)
- [架构说明](docs/architecture.md)
- [路线图](docs/roadmap.md)
- [原生 App 打包说明](docs/native-app-runbook.md)

---

## English

Skills Manager is a **local Agent Skills console** for macOS. It discovers Agent Skills already on your Mac, helps you review risk signals, collects trusted skills into a local library, and copies selected skills into Claude Code, Codex, OpenClaw, or custom Agent skill folders.

> Current version: `v0.5.0`  
> Current build: macOS Apple Silicon / aarch64  
> Note: the current DMG is ad-hoc signed, but it is not Developer ID signed or Apple-notarized. It is suitable for small test distribution. On first launch, macOS may require right-clicking the app and choosing “Open”.

### Download

- macOS Apple Silicon DMG: [Skills-Manager_0.5.0_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.0_aarch64.dmg)
- Releases: [GitHub Releases](https://github.com/brightbear2026/skills-manager/releases)

### Why It Exists

- Agent skills are scattered across tool-specific folders.
- Third-party skills may contain scripts, network access, destructive commands, or secret access.
- Users need to understand a skill before adding it to a local library or copying it to an Agent.
- Copying the same skill to multiple Agents manually is error-prone.

### Features

- Discover common local skills folders automatically.
- Parse `SKILL.md` names, descriptions, versions, and instructions.
- Show file inventory, source, local status, and risk hints.
- First-run import: read-only scan, no overwrite, no delete, no automatic copy.
- Local library under `~/.skillsmanager/library`.
- Get new skills from local folders, Git repositories, GitHub shorthand, archives, and supported SkillsMP pages.
- Optional AI interpretation through OpenAI-compatible APIs, including DeepSeek, Qwen, Kimi, and Zhipu-compatible endpoints.
- Copy library skills to Claude Code, Codex, OpenClaw, or custom Agent folders.
- Chinese and English UI.

### Product Scope

Skills Manager is currently local-only:

- No cloud sync.
- No team registry.
- No skill upload.
- No managed remote execution.
- No automatic changes to Agent folders unless you explicitly copy a skill.

### Installation

1. Download the DMG.
2. Open it and drag `Skills Manager.app` to `Applications`.
3. If macOS blocks the first launch, right-click `Skills Manager.app` and choose “Open”.
4. The app starts the local service and opens the console.

See: [Installation Guide](docs/INSTALL.md).

### Local Data and Privacy

Default local data directory:

```text
~/.skillsmanager
```

This stores the local library, scan state, logs, and AI settings. API keys are not bundled into the app or DMG. In the current version, AI API keys are stored locally in plain text at `~/.skillsmanager/ai-settings.json`. A future version should move them to macOS Keychain.

See: [Privacy and Local Data](docs/PRIVACY.md).

### Development

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

### Local Packaging

```bash
npm run app:build-local
```

Build outputs:

```text
src-tauri/target/release/bundle/macos/Skills Manager.app
src-tauri/target/release/bundle/dmg/Skills Manager_0.5.0_aarch64.dmg
```

Release checks:

```bash
npm run app:preflight
npm run app:signing-preflight
```

Public distribution still requires an Apple Developer `Developer ID Application` certificate, notarytool credentials, and clean-Mac QA.

### Docs

- [Installation Guide](docs/INSTALL.md)
- [Privacy and Local Data](docs/PRIVACY.md)
- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Roadmap](docs/roadmap.md)
- [Native App Runbook](docs/native-app-runbook.md)
