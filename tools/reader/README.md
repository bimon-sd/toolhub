# G-Reader 语音合成工具

一个简洁高效的文本转语音（TTS）桌面应用，支持 Azure TTS 和 Edge TTS 双引擎。

![G-Reader](icons/128x128.png)

## 功能特点

- **双引擎支持**：Azure TTS（高质量）+ Edge TTS（免费备用）
- **零依赖运行**：内置 Python 和 edge-tts，无需额外安装
- **多种语音**：支持中文、英文、日文等多种语言和声音
- **语速调节**：支持 0.5x - 2.0x 语速调节
- **简洁界面**：现代化深色主题，无边框窗口设计

## 系统要求

- Windows 10/11（64位）
- 无需安装 Python
- 无需安装其他运行时

## 安装方法

1. 下载 `G-Reader-Setup.exe`
2. 双击运行安装程序
3. 按向导完成安装
4. 从桌面快捷方式启动

## 使用方法

### 基本使用

1. 在文本框输入要转换的文字
2. 选择语言（中文、英文、日文等）
3. 选择音色（每个语言提供多种声音选项）
4. 调节语速（可选，支持 0.5x - 2.0x）
5. 点击「Generate」生成语音
6. 音频文件将保存到下载文件夹

### 设置 Azure TTS（可选）

如需使用 Azure TTS（音质更好）：

1. 点击右上角设置图标
2. 输入 Azure Speech API Key
3. 选择对应的区域（Region）
4. 点击「Save」保存

> **获取 Azure API Key**：访问 [Azure 语音服务](https://azure.microsoft.com/services/cognitive-services/speech-services/) 创建免费账户

### 语音引擎说明

| 引擎 | 特点 | 需要配置 |
|------|------|----------|
| Azure TTS | 音质最佳，专业级 | 需要 API Key |
| Edge TTS | 免费使用，音质良好 | 无需配置 |

**默认行为**：
- 如果配置了 Azure API Key，优先使用 Azure TTS
- 如果 Azure 失败或没有配置，自动使用 Edge TTS

## 文件说明

```
G-Reader/
├── G-Reader.exe          # 主程序
├── python/               # 内置 Python 运行环境
├── uninstall.exe         # 卸载程序
└── ...
```

## 卸载

1. 运行安装目录下的 `uninstall.exe`
2. 或在「设置 → 应用」中找到 G-Reader 卸载

## 隐私说明

- API Key 仅存储在本地配置文件
- 不会上传任何数据到远程服务器
- 文本转语音通过 Azure 或 Edge 服务处理

## 技术信息

- 版本：1.0.0
- 开发框架：Tauri + Rust
- 内置 Python：3.10.11
- 语音引擎：edge-tts 7.2.7

## 许可证

MIT License

## 问题反馈

如有问题或建议，欢迎提交 Issue。

联系邮箱：bimongl@gmail.com
