# ToolHub 项目状态文档

> 最后更新：2026-04-23
> 作者：Claude (AI Assistant)
> 用途：记录项目决策、进度、待办，方便中断后恢复

---

## 项目概述

| 项目 | 内容 |
|------|------|
| **项目名称** | ToolHub |
| **定位** | AI Agent 工具市场 / 全球第一个 AI 广告平台 |
| **目标用户** | AI Agent 开发者、工具开发者 |
| **核心价值** | 让 AI 工具被 AI 发现、购买、使用 |
| **GitHub** | https://github.com/bimon-sd/toolhub |

---

## 技术栈（已确定）

| 组件 | 选择 | 理由 |
|------|------|------|
| **前端框架** | Next.js 16 + TypeScript | Cloudflare Pages 支持 |
| **样式** | Tailwind CSS | 已配置 |
| **数据库** | Neon PostgreSQL | 与 Cloudflare 同生态 |
| **支付** | Stripe | 海外事实标准 |
| **部署** | Cloudflare Pages | CDN快，稳定，GitHub自动部署 |
| **缓存** | Cloudflare KV | 热门工具缓存 |

**注意：原方案 FastAPI (Python) 已放弃，改用 Node.js/Next.js API Routes**

---

## 设计方向（已确定）

### 核心原则
- **AI优先** - 信息密度大，对人类可以不友好
- **功能效率极致** - 每一个交互都要最优
- **SEO友好** - 充分的提示词优化，面向 AI 的广告系统

### 视觉方向

- **配色**：
  - 背景：墨绿色 (#0D3B3B 或 #1A4D4D)
  - 文字/高亮：橙色 (#E67E22 或 #F39C12)
  - 辅助色：深色墨绿渐变、白色文字
- **风格**：暗色系，高对比度，信息密度大
- **目标**：全球第一个 AI 广告平台的独特视觉识别

---

## 研究竞品（已完成 ✅）

目标：找到配色、架构、功能模块、UX 的参考

### 研究成果

#### ClawHub (clawhub.ai)
- **配色**: 深色主题，蓝色高亮，卡片式布局
- **规模**: 52.7k工具，180k用户，12M下载
- **特点**: Skills/Plugins分类，GitHub集成，自改进Agent
- **SEO问题**: SPA无服务端meta标签，SEO弱
- **AI-Ready**: Skills框架，Agent原生封装

#### RapidAPI (rapidapi.com)
- **配色**: 蓝色系 #4a90e2，深蓝头尾
- **规模**: 最大API市场
- **特点**: 
  - OAuth2/Header/Basic Auth认证
  - 4层定价 (Basic/Pro/Ultra/Mega)
  - MCP连接器 (Claude/Cursor/VSCode)
  - API健康监测、Webhooks、企业功能
- **SEO**: 基本OG标签，无JSON-LD

#### Toolify (toolify.ai)
- **配色**: 中性灰色，专业内容导向
- **规模**: 28,838 AIs，459分类，多语言支持
- **特点**: 
  - 按月访问量/分类/地区排名
  - AI新闻、提示词库、Discord社区
  - 广告位赞助、链接插入付费

### 关键发现

| 平台 | SEO | AI-Ready | 定价 |
|------|-----|----------|------|
| ClawHub | ❌ SPA无meta | ✅ Skills框架 | 不明确 |
| RapidAPI | ⚠️ 基础OG | ✅ MCP连接器 | 4层+按量 |
| Toolify | ⚠️ 分类URL | ⚠️ 目录结构 | 混合模式 |

### 设计方向参考

- **配色**: 蓝色系（RapidAPI） + 深色模式（ClawHub）
- **布局**: 卡片式网格，分类导航
- **AI-Ready**: 结构化YAML描述，MCP兼容
- **SEO**: Schema.org markup，分类页面URL

---

## 配置 Cloudflare Pages（需用户授权）

### 已安装工具
- [x] wrangler CLI 已安装

### 待用户操作
需要在终端运行 `npx wrangler login` 授权 Cloudflare

---

## 当前进度

### ✅ 已完成

| 任务 | 状态 | 说明 |
|------|------|------|
| GitHub 仓库创建 | ✅ | bimon-sd/toolhub |
| Next.js 项目初始化 | ✅ | D:\toolhub\ |
| 蓝图文档迁移 | ✅ | ai-marketplace-*.md |
| 竞品研究 | ✅ | ClawHub/RapidAPI/Toolify |

### ⏳ 进行中

| 任务 | 状态 | 说明 |
|------|------|------|
| Cloudflare Pages 配置 | ⏳ | 等待用户授权 |

### ❌ 待完成

| 任务 | 优先级 |
|------|--------|
| Cloudflare Pages 配置 + GitHub 自动部署 | P0 |
| 设计定稿（配色、功能模块、信息架构） | P0 |
| 开发落地页 | P1 |
| 连接 Neon 数据库 | P1 |
| 开发者注册/登录 | P2 |
| 工具上架功能 | P2 |
| AI Agent 接入 API | P3 |
| 支付系统集成 | P3 |

---

## 下一步行动

1. **用户授权 Cloudflare** - 运行 `npx wrangler login`
2. **设计定稿** - 讨论配色、功能模块、信息架构
3. **配置 Cloudflare Pages** - 连接 GitHub 自动部署
4. **开发落地页** - 开始写代码

---

## 环境信息

```
项目路径：D:\toolhub\
Node版本：v22.x（推测）
包管理器：npm
Git仓库：https://github.com/bimon-sd/toolhub
```

---

## 决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-04-22 | 改用 Next.js + Cloudflare Pages | 交易逻辑需要 Node.js 环境 |
| 2026-04-22 | 放弃 FastAPI Python | Cloudflare Workers 不支持 Python |

---

## 待定事项

- [ ] 项目配色方案
- [ ] 具体功能模块划分
- [ ] 信息架构设计
- [ ] 域名规划
- [ ] Neon 数据库配置

---

*此文档随项目更新，每次重要决策后更新*