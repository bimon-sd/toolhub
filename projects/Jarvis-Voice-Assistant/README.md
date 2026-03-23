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
jarvis-voice-assistant/
├── src/
│   ├── core/           # 核心引擎
│   ├── providers/      # STT/LLM/TTS 实现
│   ├── ahk/            # AHK 执行模块
│   ├── personality/    # 人设系统
│   ├── memory/         # 记忆系统
│   └── ui/             # 小圆点 UI
├── config/             # 配置文件
├── tests/              # 测试
└── docs/               # 文档
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
