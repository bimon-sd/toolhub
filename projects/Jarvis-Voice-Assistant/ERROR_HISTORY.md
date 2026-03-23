# 错误回溯与解决方案库

## [2026-03-23] Git Remote 指向错误仓库
- **现象**：git push 时提示 Repository not found。
- **原因**：origin 指向了 Chenyme/Qwen-TTS-WebUI 而非 bimongl-coder/Jarvis-Voice-Assistant。
- **对策**：使用 `git remote set-url origin` 修正仓库地址。

## [2026-03-23] Git Add 未添加文件
- **现象**：git add 后 git status 显示 nothing to commit。
- **原因**：使用了反斜杠路径 D:\projects，应使用正斜杠 /d/projects。
- **对策**：使用 `cd /d/projects/Jarvis-Voice-Assistant && git add .`。

---

*此文件由 AI 自主维护，遇到新错误时自动添加。*
