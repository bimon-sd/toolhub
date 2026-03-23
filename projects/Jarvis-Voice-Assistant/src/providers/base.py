"""
providers/base.py - Provider 接口规范

所有 STT/LLM/TTS provider 必须实现对应抽象接口
支持热插拔，通过配置文件切换
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Optional


class STTProvider(ABC):
    """语音识别 provider 接口"""

    @abstractmethod
    def load(self) -> None:
        """加载模型"""
        pass

    @abstractmethod
    def recognize(self, audio_bytes: bytes) -> str:
        """
        识别音频为文字

        Args:
            audio_bytes: 原始音频 bytes (16kHz, mono, float32)
        Returns:
            识别的文本
        """
        pass

    @abstractmethod
    def unload(self) -> None:
        """释放资源"""
        pass


class LLMProvider(ABC):
    """大模型 provider 接口"""

    @abstractmethod
    def load(self) -> None:
        """加载模型/API配置"""
        pass

    @abstractmethod
    def chat(self, messages: List[Dict], system_prompt: Optional[str] = None) -> str:
        """
        对话

        Args:
            messages: [{"role": "user/assistant", "content": "..."}]
            system_prompt: 系统提示词
        Returns:
            模型回复
        """
        pass

    @abstractmethod
    def classify_intent(self, text: str) -> str:
        """
        意图分类

        Returns:
            "command" / "chat" / "unknown"
        """
        pass

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """生成回复"""
        pass


class TTSProvider(ABC):
    """语音合成 provider 接口"""

    @abstractmethod
    def load(self) -> None:
        """加载模型/配置"""
        pass

    @abstractmethod
    def speak(self, text: str) -> None:
        """
        语音播报 (阻塞直到完成)

        Args:
            text: 要播报的文本
        """
        pass

    @abstractmethod
    def stop(self) -> None:
        """停止当前播报"""
        pass
