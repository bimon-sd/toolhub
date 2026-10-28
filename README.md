# ToolHub — AI Agent 工具市场

**一句话**：给 AI Agent 用的工具市场（不是给开发者的），Agent 能自己搜到工具、按需调用；当前是搁置中的半成品，只有前端骨架。

## 功能清单（用户视角）

- **分类入口**：Audio / Video / Text / Image / Data / API 六类，带工具数量角标。
- **工具卡片墙**：名称、简介、标签的网格展示（数据目前写死在页面里）。
- **落地页**：Hero + 分类导航 + 精选工具 + AI-Ready 工具格式说明。
- **配套工具**：`tools/reader/` 是一个 Tauri 桌面阅读器（壳已搭好，界面在 `src/index.html`）。

## 使用说明

| 场景 | 操作 |
|---|---|
| 本地预览市集站点 | `cd toolhub && npm install && npm run dev`（默认 3000 端口） |
| 部署 | Cloudflare Workers：`npx wrangler deploy`，CI 见 `toolhub/.github/workflows/deploy.yml` |
| 改分类/卡片 | 编辑 `toolhub/src/app/page.tsx` 顶部常量 |
| 看产品规划 | 按顺序读 `toolhub/ai-marketplace-blueprint.md` → `-v2.md` → `roadmap` → `execution-checklist` |

## 架构

```
toolhub/                      Next.js 16 App Router + Tailwind 4（单页骨架，无后端）
├─ src/app/{layout,page}.tsx  唯一页面，分类与工具数据为常量
├─ .wrangler.json             部署目标 Cloudflare Workers
└─ .github/workflows/deploy.yml   main 推送即部署

tools/reader/                 Tauri 桌面阅读器（Rust 壳 + 纯 HTML 界面）
projects/                     空目录（Jarvis 源码已移除，见下方雷区）
```

没有数据库、没有 API、没有鉴权；"市场"目前只是视觉稿。

## 关键文件

| 文件 | 作用 |
|---|---|
| `toolhub/src/app/page.tsx` | 全站唯一页面：分类常量、卡片数据、区块结构 |
| `toolhub/.wrangler.json` | Cloudflare Workers 部署配置（name/兼容日期） |
| `toolhub/.github/workflows/deploy.yml` | CI：push 到 main 自动部署 |
| `toolhub/ai-marketplace-blueprint.md` | 完整愿景与分层设计（Agent 自主发现/调用/结算） |
| `toolhub/PROJECT_STATUS.md` | 停在哪一步的现状记录 |
| `tools/reader/src/index.html` | 阅读器界面 | 

## 跑起来

```bash
cd toolhub
npm install
npm run dev        # http://localhost:3000
npx wrangler deploy  # 发布（需先 wrangler login）
```

## 雷区

- **分类数量和卡片数据是硬编码常量**，不是接口；接后端时先换 `page.tsx` 里的 `CATEGORIES`。
- **Jarvis-Voice-Assistant 源码已从本仓库移除**（`projects/Jarvis-Voice-Assistant`）。项目已确认不做，需要翻旧代码请用 `git log -- projects/Jarvis-Voice-Assistant` 从历史里取。
- **仓库根目录不是 Next.js 工程**，应用在 `toolhub/` 子目录里，`npm install` 必须先进那个目录，否则装不上。
- `.wrangler.json` 里的项目名与 Cloudflare 账号绑定，换账号部署要改名。
- 仓库没有 LICENSE，对外发布前需补。
