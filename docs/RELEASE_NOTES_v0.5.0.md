# Skills Manager v0.5.0 Release Notes

## 中文

这是 Skills Manager 的首个公开测试版本。当前定位是本地 Agent Skills 控制台。

### 下载

- macOS Apple Silicon DMG: [Skills-Manager_0.5.0_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.0_aarch64.dmg)

### 主要功能

- 自动发现本机 Agent Skills。
- 集中查看 skills 的来源、路径、文件和风险提示。
- 支持首次导入和本机库。
- 支持从本地文件夹、Git/GitHub、压缩包和部分 SkillsMP 页面获取 skill。
- 支持复制 skill 到 Claude Code、Codex、OpenClaw 或自定义 Agent 目录。
- 支持 AI 解读，可使用 OpenAI-compatible API，包括 DeepSeek、Qwen、Kimi、智谱等兼容端点。
- 支持中文和英文 UI。
- 提供 macOS App 和 DMG。

### 重要说明

当前 DMG 使用 ad-hoc 签名，但没有 Developer ID 签名和 Apple notarization，适合小范围测试。首次打开时，macOS 可能提示无法验证开发者，需要右键 App 选择“打开”。

API key 不会被打进 App 或 DMG。当前版本的 AI API key 会明文存储在本机 `~/.skillsmanager/ai-settings.json`，后续版本计划迁移到 macOS Keychain。

## English

This is the first public test build of Skills Manager. The current product scope is a local Agent Skills console.

### Download

- macOS Apple Silicon DMG: [Skills-Manager_0.5.0_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.0_aarch64.dmg)

### Highlights

- Discover local Agent Skills automatically.
- Review skill source, path, files, and risk hints in one place.
- First-run import and local library support.
- Get skills from local folders, Git/GitHub, archives, and supported SkillsMP pages.
- Copy skills to Claude Code, Codex, OpenClaw, or custom Agent folders.
- Optional AI interpretation through OpenAI-compatible APIs, including DeepSeek, Qwen, Kimi, and Zhipu-compatible endpoints.
- Chinese and English UI.
- macOS app and DMG packaging.

### Important Notes

The current DMG is ad-hoc signed, but it is not Developer ID signed or Apple-notarized. It is suitable for small test distribution. On first launch, macOS may require right-clicking the app and choosing “Open”.

API keys are not bundled into the app or DMG. In the current version, AI API keys are stored locally in plain text at `~/.skillsmanager/ai-settings.json`. A future version should move them to macOS Keychain.
