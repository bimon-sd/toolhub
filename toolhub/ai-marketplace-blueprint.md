# AI Agent 工具市场 - 完整蓝图

## 一、愿景与定位

> **让 AI Agent 能够自主发现、购买、使用工具的市场**
>
> 不是 AI 开发者工具市场，是**纯 AI Agent 用的工具市场**
>
> 类比：美团是给人点外卖的，我们是给 AI Agent 点工具的

---

## 二、蓝图总览

```
┌─────────────────────────────────────────────────────────────┐
│                      用户层 (AI Agent)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 语义搜索 │  │ 一键调用 │  │ 自动结算 │  │ 质量反馈 │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      市场核心层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 工具索引 │  │ 智能匹配 │  │ 调用网关 │  │ 数据反馈 │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│          │            │            │            │           │
│          ▼            ▼            ▼            ▼           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AI-Ready 标准化描述 (YAML/JSON)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      开发者层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 入驻上架 │  │ 能力定义 │  │ 收益管理 │  │ 流量分析 │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、核心数据模型

### 工具 (Tool)
```yaml
id: "faster-whisper-001"
name: "faster-whisper"
version: "1.0.0"
description: "快速英文音频转文字"

capabilities:
  input: ["audio/*", "video/*"]
  output: ["text", "srt"]
  language: ["en", "zh"]
  category: ["transcription", "audio"]

cli:
  install: "pip install faster-whisper"
  usage: "faster-whisper --input {file} --model {model} --output {dir}"

api:
  endpoint: "https://api.example.com/transcribe"
  method: "POST"
  auth: "api_key"

pricing:
  free_tier: 100        # 每天免费调用次数
  per_call: 0.01        # 超出后每次收费

ai_prompt: |
  ## How AI should use this tool
  1. Accept audio file URL or path
  2. Call POST /transcribe with audio file
  3. Return JSON with text and timestamps

stats:
  success_rate: 98.5%
  avg_latency: 1.2s
  calls_today: 1540
```

### AI Agent
```yaml
id: "agent-001"
name: "TranscribeBot"
type: "langchain-auto-gpt"  # agent类型
api_key: "ak_xxxxx"
calls_today: 45
balance: 10.00
```

### 调用记录 (CallLog)
```yaml
id: "call-001"
tool_id: "faster-whisper-001"
agent_id: "agent-001"
timestamp: "2026-04-20T10:30:00Z"
success: true
latency: 1.2s
cost: 0.01
```

---

## 四、AI-Ready 标准格式

每个工具上架时必须提供 YAML 格式描述：

```yaml
# AI-Ready Tool Description
tool:
  name: string                    # 工具名称
  version: string                 # 版本号
  description: string             # 一句话描述

  capabilities:
    input: [string]              # 支持的输入类型
    output: [string]             # 输出的类型
    language: [string]           # 支持的语言
    category: [string]           # 分类标签

  cli:
    install: string              # 安装命令
    usage: string                # 使用示例，{param} 是参数占位符

  api:
    endpoint: string             # API 地址
    method: string               # HTTP 方法
    auth: string                 # 认证方式

  pricing:
    free_tier: number            # 免费额度
    per_call: number             # 每次调用费用

  ai_prompt: |                   # AI 如何使用这个工具的说明
    ## Step-by-step usage
    1. ...
    2. ...
```

---

## 五、页面结构

```
/                           首页
├── /marketplace            工具市场（列表）
│   └── /tool/[id]          工具详情
├── /developer               开发者入口
│   ├── /developer/register  注册
│   ├── /developer/login     登录
│   ├── /developer/dashboard 管理后台
│   └── /developer/submit    上架工具
├── /agent                   AI Agent 入口
│   └── /agent/api           API 文档
├── /docs                    文档
│   ├── /docs/getting-started 如何让工具 AI-Ready
│   └── /docs/api            API 文档
└── /about                   关于我们
```

---

## 六、技术架构

```
                    ┌─────────────┐
                    │   用户/AI   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Next.js   │  前端
                    │    网站     │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │FastAPI  │      │  PostgreSQL│     │  Redis   │
    │ 后端API │◄────►│   数据库   │     │  缓存    │
    └────┬────┘      └───────────┘     └──────────┘
         │
         │                 │
    ┌────▼────┐      ┌─────▼─────┐
    │ Qdrant  │      │ Stripe   │  支付
    │ 向量库  │      │  支付    │
    └─────────┘      └──────────┘
```

---

## 七、里程碑

| 阶段 | 时间 | 完成标准 |
|------|------|----------|
| **蓝图确定** | 今天 | 蓝图画完，人人确认 |
| **MVP上线** | 2周后 | 落地页 + 10个工具 + 1个AI调用成功 |
| **v0.5** | 1个月 | 开发者可以上架工具，AI可以搜索 |
| **v1.0** | 2个月 | 支付上线、调用网关、数据反馈 |
| **规模化** | 3个月 | 100+工具、集成LangChain |
