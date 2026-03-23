"""
memory/manager.py - 记忆系统管理器

基于 0GMem/ReMe 研究设计的双层记忆架构:
- 短期记忆: JSON 文件，最近 N 轮对话
- 长期记忆: Markdown 文件，按天归档
- 记忆摘要: 注入人设系统
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional


class MemoryManager:
    """记忆系统管理器"""

    def __init__(self, base_dir: str = None, short_term_turns: int = 10):
        if base_dir is None:
            base_dir = Path(__file__).parent
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

        # 子目录
        self.daily_dir = self.base_dir / "daily"
        self.daily_dir.mkdir(exist_ok=True)

        # 短期记忆文件
        self.short_term_file = self.base_dir / "short_term.json"
        self.short_term_turns = short_term_turns

        # 加载短期记忆
        self.short_term = self._load_short_term()

    def _load_short_term(self) -> List[Dict]:
        """加载短期记忆"""
        if self.short_term_file.exists():
            data = json.loads(self.short_term_file.read_text(encoding="utf-8"))
            return data.get("turns", [])
        return []

    def _save_short_term(self):
        """保存短期记忆"""
        data = {
            "updated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "turns": self.short_term[-self.short_term_turns * 2 :],  # 保留最近 N 轮
        }
        self.short_term_file.write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    def add_message(self, role: str, content: str, action: str = None):
        """
        添加一条消息到短期记忆

        Args:
            role: "user" 或 "assistant"
            content: 消息内容
            action: 执行的动作 (可选)
        """
        message = {
            "role": role,
            "content": content,
            "time": datetime.now().strftime("%H:%M:%S"),
        }
        if action:
            message["action"] = action

        self.short_term.append(message)
        self._save_short_term()

        # 如果满了，归档到长期记忆
        if len(self.short_term) >= self.short_term_turns * 2:
            self._archive_to_long_term()

    def _archive_to_long_term(self):
        """归档到长期记忆"""
        today = datetime.now().strftime("%Y-%m-%d")
        daily_file = self.daily_dir / f"{today}.md"

        # 生成当天的摘要
        summary = self._generate_daily_summary()

        if daily_file.exists():
            # 追加到已存在的文件
            content = daily_file.read_text(encoding="utf-8")
            content += f"\n\n{summary}"
        else:
            content = f"# {today} 记忆\n\n{summary}"

        daily_file.write_text(content, encoding="utf-8")

        # 清空短期记忆，保留最近 2 轮
        self.short_term = self.short_term[-2:]
        self._save_short_term()

    def _generate_daily_summary(self) -> str:
        """生成每日摘要 (简化版，实际应调用 LLM)"""
        lines = ["## 对话摘要\n"]
        for msg in self.short_term[-6:]:  # 取最近 6 条
            role = "用户" if msg["role"] == "user" else "Jarvis"
            lines.append(f"- [{msg.get('time', '')}] {role}: {msg['content'][:50]}")
        return "\n".join(lines)

    def get_context(self) -> str:
        """
        获取短期记忆作为 LLM 上下文

        Returns:
            格式化的对话历史
        """
        if not self.short_term:
            return ""

        lines = ["[最近对话]"]
        for msg in self.short_term[-6:]:  # 最近 3 轮
            role = "用户" if msg["role"] == "user" else "Jarvis"
            lines.append(f"{role}: {msg['content']}")

        return "\n".join(lines)

    def search_long_term(self, query: str, days: int = 7) -> List[str]:
        """
        搜索长期记忆

        Args:
            query: 搜索关键词
            days: 搜索最近多少天
        Returns:
            匹配的记忆列表
        """
        results = []
        cutoff = datetime.now() - timedelta(days=days)

        for md_file in self.daily_dir.glob("*.md"):
            # 解析日期
            date_str = md_file.stem
            try:
                file_date = datetime.strptime(date_str, "%Y-%m-%d")
                if file_date < cutoff:
                    continue
            except ValueError:
                continue

            # 简单关键词匹配
            content = md_file.read_text(encoding="utf-8")
            if query.lower() in content.lower():
                results.append(f"[{date_str}] {content[:200]}")

        return results

    def update_memory_summary(self) -> str:
        """
        生成记忆摘要 (供人设系统使用)

        Returns:
            记忆摘要文本
        """
        lines = ["# 记忆摘要\n"]

        # 短期记忆统计
        lines.append(f"## 当前会话")
        lines.append(f"- 对话轮数: {len(self.short_term) // 2}")

        # 最近重要信息
        if self.short_term:
            lines.append(f"\n## 最近对话")
            for msg in self.short_term[-4:]:
                role = "用户" if msg["role"] == "user" else "Jarvis"
                lines.append(f"- {role}: {msg['content'][:50]}")

        return "\n".join(lines)


if __name__ == "__main__":
    # 测试记忆系统
    mem = MemoryManager()
    mem.add_message("user", "打开微信")
    mem.add_message("assistant", "已打开微信", action="open_wechat")
    mem.add_message("user", "帮我查一下今天天气")

    print("短期记忆上下文:")
    print(mem.get_context())
    print("\n记忆摘要:")
    print(mem.update_memory_summary())
