"""
providers/llm/api.py - LLM API Provider

支持:
- DeepSeek
- OpenAI
- 兼容 OpenAI 格式的其他 API
"""

import httpx
from typing import List, Dict, Optional
from ..base import LLMProvider


class LLMAPiProvider(LLMProvider):
    """
    LLM API Provider

    兼容 OpenAI 格式的 API 实现
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.openai.com/v1",
        model: str = "gpt-4o-mini",
        max_tokens: int = 512,
        temperature: float = 0.3,
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self._client: Optional[httpx.Client] = None

    def load(self) -> None:
        """初始化 HTTP 客户端"""
        self._client = httpx.Client(
            base_url=self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=60.0,
        )

    def chat(self, messages: List[Dict], system_prompt: Optional[str] = None) -> str:
        """
        对话

        Args:
            messages: [{"role": "user/assistant", "content": "..."}]
            system_prompt: 系统提示词
        Returns:
            模型回复
        """
        if not self._client:
            self.load()

        # 构建消息列表
        api_messages = []
        if system_prompt:
            api_messages.append({"role": "system", "content": system_prompt})
        api_messages.extend(messages)

        # 调用 API
        response = self._client.post(
            "/chat/completions",
            json={
                "model": self.model,
                "messages": api_messages,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
            },
        )
        response.raise_for_status()

        result = response.json()
        return result["choices"][0]["message"]["content"]

    def classify_intent(self, text: str) -> str:
        """
        意图分类

        Args:
            text: 用户输入文本
        Returns:
            "command" / "chat" / "unknown"
        """
        prompt = f"""判断以下用户输入的意图类型，只回复一个词：command 或 chat

用户输入: {text}

如果用户想要执行某个操作（如打开软件、执行命令等），回复 command
如果用户只是想聊天或提问，回复 chat

回复:"""

        response = self.chat([{"role": "user", "content": prompt}])
        response = response.strip().lower()

        if "command" in response:
            return "command"
        elif "chat" in response:
            return "chat"
        return "unknown"

    def generate(self, prompt: str) -> str:
        """
        生成回复

        Args:
            prompt: 完整提示词
        Returns:
            生成的文本
        """
        return self.chat([{"role": "user", "content": prompt}])

    def unload(self) -> None:
        """释放资源"""
        if self._client:
            self._client.close()
            self._client = None


class DeepSeekProvider(LLMAPiProvider):
    """DeepSeek 专用 Provider"""

    def __init__(self, api_key: str, model: str = "deepseek-chat", **kwargs):
        super().__init__(
            api_key=api_key,
            base_url="https://api.deepseek.com/v1",
            model=model,
            **kwargs,
        )
