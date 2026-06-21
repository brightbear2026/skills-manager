# Skills Manager v0.5.1 Release Notes

## 中文

这是 `v0.5.0` 之后的体验更新版，继续聚焦本地 Agent Skills 控制台。

### 下载

- macOS Apple Silicon DMG: [Skills-Manager_0.5.1_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.1_aarch64.dmg)
- Windows x64 installer: [Skills-Manager_0.5.1_x64-setup.exe](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.1_x64-setup.exe)

### 更新内容

- 重做控制台信息架构，突出 Agent 和 skills 的关系、纳管状态、风险和复制目标。
- 优化“全部 Skills / 已纳管 / 获取 / Agent 目录”的页面职责，减少重复说明。
- 获取页在检查来源前隐藏右侧说明栏，检查后才显示结果面板。
- 支持自定义 Agent 目录，并在复制 skill 时选择目标。
- 更新应用图标和 DMG 背景。
- 同步更新版本号、下载说明和安装说明。
- 新增 Windows x64 安装包。

### 重要说明

当前 macOS DMG 使用 ad-hoc 签名，但没有 Developer ID 签名和 Apple notarization。Windows 安装包也未做正式代码签名，可能出现 SmartScreen 提示。这些包适合小范围测试。

API key 不会被打进 App 或 DMG。当前版本的 AI API key 会明文存储在本机 `~/.skillsmanager/ai-settings.json`，后续版本计划迁移到 macOS Keychain。

## English

This is a UX update after `v0.5.0`, still focused on the local Agent Skills console.

### Download

- macOS Apple Silicon DMG: [Skills-Manager_0.5.1_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.1_aarch64.dmg)
- Windows x64 installer: [Skills-Manager_0.5.1_x64-setup.exe](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.1_x64-setup.exe)

### Changes

- Redesigned the console information architecture around the relationship between agents and skills.
- Clarified the role of All Skills, Managed Skills, Get Skills, and Agent Folders to reduce duplicated guidance.
- The Get Skills page now hides the right-side guide before checking a source, then shows a result panel after the check.
- Added custom Agent folder support and target selection when copying a skill.
- Updated the app icon and DMG background.
- Synchronized version numbers, download links, and installation notes.
- Added a Windows x64 installer.

### Important Notes

The current macOS DMG is ad-hoc signed, but it is not Developer ID signed or Apple-notarized. The Windows installer is not formally code-signed yet, so SmartScreen may show a warning. These builds are suitable for small test distribution.

API keys are not bundled into the app or DMG. In the current version, AI API keys are stored locally in plain text at `~/.skillsmanager/ai-settings.json`. A future version should move them to macOS Keychain.
