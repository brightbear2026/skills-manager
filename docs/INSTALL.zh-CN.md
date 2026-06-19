# 安装说明

## 下载

macOS Apple Silicon:

[下载 Skills-Manager_0.5.0_aarch64.dmg](https://github.com/brightbear2026/skills-manager/releases/latest/download/Skills-Manager_0.5.0_aarch64.dmg)

Release 页面：

[https://github.com/brightbear2026/skills-manager/releases](https://github.com/brightbear2026/skills-manager/releases)

## 安装步骤

1. 下载 DMG。
2. 打开 DMG。
3. 把 `Skills Manager.app` 拖到 `Applications`。
4. 从 `Applications` 打开 `Skills Manager.app`。

## 如果 macOS 阻止打开

当前测试包未签名、未公证。首次打开时，macOS 可能提示无法验证开发者。

可以这样打开：

1. 打开 `Applications`。
2. 找到 `Skills Manager.app`。
3. 右键点击，选择“打开”。
4. 在确认窗口中再次选择“打开”。

如果仍然被拦截：

1. 打开“系统设置”。
2. 进入“隐私与安全性”。
3. 找到 Skills Manager 的拦截提示。
4. 选择“仍要打开”。

受公司或学校管理的 Mac 可能禁止运行未签名 App。

## 本地服务

Skills Manager 打开后会在本机启动本地服务：

```text
http://127.0.0.1:5173
```

关闭 App 窗口会退出桌面壳，并停止它启动的本地服务。

## 本机数据位置

默认数据目录：

```text
~/.skillsmanager
```

删除 App 不会自动删除这个目录。

## 开发者本地打包

```bash
npm run app:build-local
```

产物：

```text
src-tauri/target/release/bundle/macos/Skills Manager.app
src-tauri/target/release/bundle/dmg/Skills Manager_0.5.0_aarch64.dmg
```
