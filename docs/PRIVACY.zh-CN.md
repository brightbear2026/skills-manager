# 隐私和本机数据

Skills Manager 当前定位为本地 Agent Skills 控制台。

## 默认不会上传

默认情况下，Skills Manager 不会上传：

- 你的 skills 内容
- 本机库内容
- Agent 目录
- 扫描结果
- 日志
- API key

所有扫描和风险提示都在本机完成。

## 本机数据目录

默认目录：

```text
~/.skillsmanager
```

常见内容：

```text
library/       本机 skills 库
logs/          本地服务日志
secrets/       profile 级密钥存储
exports/       诊断导出
ai-settings.json
profiles.json
state.json
```

## AI 解读

AI 解读是可选功能。不开启 AI 设置时，不会调用模型 API。

开启后，请注意：

- 请求会发送 skill 的元数据、风险提示、文件摘要和截断后的说明预览。
- 请求会发往你配置的 OpenAI-compatible API endpoint。
- 支持 DeepSeek、Qwen、Kimi、智谱等兼容端点。
- Skills Manager 不会把 API key 打进 App 或 DMG。

当前版本的 AI API key 存储在：

```text
~/.skillsmanager/ai-settings.json
```

这是本机明文 JSON。后续版本应改为 macOS Keychain。

## 打包安全

App 打包资源只包含：

- `src/`
- `public/`
- `package.json`
- `README.md`
- 部分 `docs/`
- 内置 Node runtime

打包流程不会包含：

- `~/.skillsmanager`
- `.env`
- `.skillsmanger-cache`
- `src-tauri/target`
- `node_modules`

## 导出诊断

诊断导出不会包含：

- secret 值
- invocation prompt
- invocation output
- 完整 skill instruction body

导出文件仍可能包含本机路径和状态摘要，分享前请自行检查。

## 卸载

删除 App 不会自动删除本机数据目录。如需完全清理：

```bash
rm -rf ~/.skillsmanager
```

执行前请确认不再需要本机库和设置。
