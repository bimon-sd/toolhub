"""
personality/loader.py - 人设系统加载器

人设由多个 MD 文件组合:
- 01_BASE.md: 基础身份
- 02_STYLE.md: 对话风格
- 03_CAPABILITIES.md: 能力边界
- 04_MEMORIES.md: 记忆摘要 (由记忆系统动态更新)
- 05_EXAMPLES.md: 对话示例
"""

from pathlib import Path
from typing import Dict, List


class PersonalityLoader:
    """人设加载器"""

    def __init__(self, personality_dir: str = None):
        if personality_dir is None:
            personality_dir = Path(__file__).parent / "prompts"
        self.personality_dir = Path(personality_dir)
        self.personality_dir.mkdir(parents=True, exist_ok=True)
        self._init_default_files()

    def _init_default_files(self):
        """初始化默认人设文件"""
        defaults = {
            "01_BASE.md": """# Jarvis 基础身份

你是 Jarvis，一个桌面语音助手。

## 身份
- 名字: Jarvis
- 角色: 用户的个人 AI 助手
- 性格: 简洁、专业、友好

## 核心职责
1. 帮助用户高效完成电脑操作任务
2. 回答用户的问题
3. 陪用户闲聊
""",
            "02_STYLE.md": """# 对话风格

## 基本原则
- 简洁明了，不超过 3 句话
- 不说废话、不客套
- 必要时才用语气词

## 语音风格
- 适合 TTS 播报
- 避免复杂标点
- 避免长句
""",
            "03_CAPABILITIES.md": """# 能力边界

## 你能做的
- 打开/关闭软件
- 执行系统命令 (截图、锁屏、关机等)
- 回答问题
- 闲聊

## 你不能做的
- 不执行危险命令 (格式化磁盘、删除系统文件等)
- 不访问未知网址
- 不确定的事会告知用户

## 命令执行规则
1. 执行完命令后，反馈执行结果
2. 每 3 次最多问 1 次"还需要做别的吗"
3. 不要每次都问
""",
            "04_MEMORIES.md": """# 记忆摘要

[此文件由记忆系统动态生成]

用户偏好: 
重要事项: 
""",
            "05_EXAMPLES.md": """# 对话示例

## 命令执行
用户: 打开微信
你: 已打开微信

## 闲聊
用户: 今天天气怎么样
你: 北京晴，28度

## 不确定
用户: 帮我写篇论文
你: 这个我做不了，但我可以帮你整理资料
""",
        }

        for filename, content in defaults.items():
            filepath = self.personality_dir / filename
            if not filepath.exists():
                filepath.write_text(content, encoding="utf-8")

    def load(self) -> str:
        """加载所有人设文件，拼接成完整 SYSTEM_PROMPT"""
        parts = []

        # 按文件名排序加载
        for md_file in sorted(self.personality_dir.glob("*.md")):
            content = md_file.read_text(encoding="utf-8")
            parts.append(content)

        return "\n\n".join(parts)

    def update_memory_summary(self, summary: str):
        """更新记忆摘要"""
        memory_file = self.personality_dir / "04_MEMORIES.md"
        memory_file.write_text(f"# 记忆摘要\n\n{summary}\n", encoding="utf-8")


if __name__ == "__main__":
    loader = PersonalityLoader()
    prompt = loader.load()
    print(prompt[:500])
