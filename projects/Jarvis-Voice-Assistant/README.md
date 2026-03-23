# Jarvis Voice Assistant

桌面语音助手 - STT/LLM/TTS 三节点热插拔架构

## 功能特性

- 🎙️ 语音识别 (STT) - 支持本地/云端多种模型
- 🤖 大模型对话 (LLM) - 支持 API/本地大模型
- 🔊 语音合成 (TTS) - 支持 Edge TTS/本地模型
- 💻 系统控制 (AHK) - 动作集+对象集两层设计
- 🧠 记忆系统 - 短期+长期记忆
- 🎭 人设系统 - 多文件组合人设
- 🔌 热插拔架构 - 每个节点可自由替换

## 状态机

```
闲置 (OFF) ←── 左键单击 ──→ 监听 (ON)
    ↑                            │
    │                            │ 按住 CAPS
    └──────── 左键单击 ──────────┘
                                    ↓
                              语音上屏 (CAPS)
                                    │
                                    │ 松开 CAPS
                                    ↓
                                 监听 (ON)
```

## 项目结构

```
Jarvis-Voice-Assistant/
├── AGENT_PROTOCOL.md       # AI 开发协议
├── TODO.md                 # 任务清单
├── ERROR_HISTORY.md        # 错误记录库
├── DEVELOPMENT_LOG.md      # 开发日志
├── README.md               # 项目说明
│
├── config/
│   ├── config.json         # 主配置文件
│   └── software_cache.json # 软件扫描缓存
│
├── docs/
│   └── 开发文档.md          # 详细开发文档
│
└── src/
    ├── __init__.py
    ├── main.py             # 主入口
    │
    ├── core/               # 核心模块
    │   ├── state.py        #   状态机 (OFF/ON/TYPING)
    │   ├── audio.py        #   音频采集 (VAD)
    │   └── intent.py       #   意图判断 (Layer1+2)
    │
    ├── providers/          # Provider 实现
    │   ├── base.py         #   接口规范 (ABC)
    │   ├── stt/
    │   │   └── local.py    #   STT: CapsWriter/Whisper
    │   ├── llm/
    │   │   └── api.py      #   LLM: DeepSeek/OpenAI
    │   └── tts/
    │       └── edge.py     #   TTS: Edge TTS/Local
    │
    ├── memory/
    │   └── manager.py      # 记忆系统 (短期/长期)
    │
    ├── personality/
    │   └── loader.py       # 人设加载器
    │
    ├── ahk/
    │   └── executor.py     # AHK 执行器 (动作+对象)
    │
    └── ui/
        └── tray.py         # 小圆点托盘组件
```

## 安装

```bash
pip install -r requirements.txt
```

## 运行

```bash
python src/main.py
```

## License

MIT
