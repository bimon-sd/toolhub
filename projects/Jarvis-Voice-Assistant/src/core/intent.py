"""
core/intent.py - 意图判断模块

两层意图判断:
- Layer 1: 命令词硬匹配 (快速路径)
- Layer 2: LLM 意图分类 (fallback)
"""

import re
from typing import Optional, List
from enum import Enum


class IntentType(Enum):
    """意图类型"""

    COMMAND = "command"  # 系统命令
    CHAT = "chat"  # 闲聊
    UNKNOWN = "unknown"  # 未知


class CommandMatcher:
    """
    Layer 1: 命令词硬匹配

    通过关键词匹配快速判断是否为系统命令
    """

    # 默认命令词列表
    DEFAULT_ACTIONS = [
        # 打开/关闭类
        "打开",
        "关闭",
        "启动",
        "退出",
        "退出",
        "运行",
        "停止",
        "开始",
        # 窗口控制
        "最大化",
        "最小化",
        "还原",
        "全屏",
        "上移",
        "下移",
        "左移",
        "右移",
        "切换",
        "切换到",
        # 系统操作
        "截图",
        "截屏",
        "录屏",
        "录象",
        "锁屏",
        "锁屏",
        "关机",
        "重启",
        "注销",
        # 音量控制
        "音量加",
        "音量减",
        "静音",
        "取消静音",
        "增大音量",
        "减小音量",
        # 亮度控制
        "亮度加",
        "亮度减",
        "增加亮度",
        "降低亮度",
        # 媒体控制
        "上一首",
        "下一首",
        "播放",
        "暂停",
        "继续",
        "快进",
        "快退",
        # 文本操作
        "剪切",
        "复制",
        "粘贴",
        "撤销",
        "重做",
        "全选",
        "保存",
        "新建",
    ]

    def __init__(self, actions: List[str] = None):
        self.actions = actions or self.DEFAULT_ACTIONS
        # 按长度排序，优先匹配长关键词
        self.actions.sort(key=len, reverse=True)

    def match(self, text: str) -> Optional[str]:
        """
        匹配命令词

        Args:
            text: 用户输入文本
        Returns:
            匹配到的动作词，如果没有匹配返回 None
        """
        text = text.strip()
        for action in self.actions:
            if action in text:
                return action
        return None

    def extract_object(self, text: str, action: str) -> str:
        """
        从文本中提取操作对象

        Args:
            text: 原始文本
            action: 匹配到的动作词
        Returns:
            操作对象
        """
        # 移除动作词，提取剩余部分作为对象
        obj = text.replace(action, "", 1).strip()
        # 移除常见语气词
        obj = re.sub(r"[的了呢吗啊吧呀]", "", obj)
        return obj.strip()


class IntentClassifier:
    """
    意图判断器

    结合 Layer1 和 Layer2 进行意图判断
    """

    def __init__(self, command_matcher: CommandMatcher = None):
        self.command_matcher = command_matcher or CommandMatcher()

    def classify(self, text: str) -> tuple[IntentType, Optional[str], Optional[str]]:
        """
        判断意图

        Args:
            text: 用户输入文本
        Returns:
            (IntentType, action, object)
            - IntentType: 意图类型
            - action: 匹配到的动作 (如果是命令)
            - object: 操作对象 (如果是命令)
        """
        # Layer 1: 命令词硬匹配
        action = self.command_matcher.match(text)
        if action:
            obj = self.command_matcher.extract_object(text, action)
            return (IntentType.COMMAND, action, obj)

        # 无法确定，返回 UNKNOWN (由 Layer 2 LLM 处理)
        return (IntentType.UNKNOWN, None, None)

    def classify_with_llm(
        self, text: str, llm_provider
    ) -> tuple[IntentType, Optional[str], Optional[str]]:
        """
        使用 LLM 进行 Layer 2 意图判断

        Args:
            text: 用户输入文本
            llm_provider: LLM provider 实例
        Returns:
            (IntentType, action, object)
        """
        # 先尝试 Layer 1
        result = self.classify(text)
        if result[0] != IntentType.UNKNOWN:
            return result

        # Layer 2: LLM 判断
        prompt = f"""判断以下用户输入的意图类型，只回复 "command" 或 "chat"：

用户输入: {text}

如果是命令（如打开软件、执行操作等），回复 "command"
如果是闲聊或提问，回复 "chat"

回复:"""

        response = llm_provider.generate(prompt).strip().lower()

        if "command" in response:
            return (IntentType.COMMAND, None, None)
        else:
            return (IntentType.CHAT, None, None)


if __name__ == "__main__":
    # 测试意图判断
    matcher = CommandMatcher()
    classifier = IntentClassifier(matcher)

    test_cases = [
        "打开微信",
        "关闭 Chrome",
        "最大化窗口",
        "今天天气怎么样",
        "你是谁",
    ]

    for text in test_cases:
        intent, action, obj = classifier.classify(text)
        print(f"输入: {text}")
        print(f"  意图: {intent.value}, 动作: {action}, 对象: {obj}")
