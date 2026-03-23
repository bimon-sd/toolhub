"""
providers/tts/edge.py - Edge TTS Provider

微软 Edge TTS，免费、快速、音质不错
作为默认 TTS 方案
"""

import asyncio
from ..base import TTSProvider


class EdgeTTSProvider(TTSProvider):
    """Edge TTS provider 实现"""

    def __init__(self, voice: str = "zh-CN-XiaoxiaoNeural", rate: int = 0):
        self.voice = voice
        self.rate = rate
        self._edge_tts = None

    def load(self) -> None:
        """加载 edge_tts"""
        try:
            import edge_tts

            self._edge_tts = edge_tts
        except ImportError:
            raise ImportError("请安装 edge_tts: pip install edge-tts")

    def speak(self, text: str) -> None:
        """同步语音播报"""
        asyncio.run(self._async_speak(text))

    async def _async_speak(self, text: str) -> None:
        """异步语音播报"""
        import sounddevice as sd
        import numpy as np

        communicate = self._edge_tts.Communicate(text, self.voice, rate=self.rate)

        # 收集音频数据
        audio_chunks = []
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_chunks.append(chunk["data"])

        if audio_chunks:
            audio_data = b"".join(audio_chunks)
            # 播放音频 (简化实现，实际需要解析 mp3)
            # 这里用 edge_tts 的 play 功能
            player = self._edge_tts.Communicate(text, self.voice, rate=self.rate)
            await player.play()

    def stop(self) -> None:
        """停止播报 (Edge TTS 播放时较难中断)"""
        pass

    @staticmethod
    def list_voices() -> list:
        """列出可用声音"""
        import asyncio
        from edge_tts import list_voices

        voices = asyncio.run(list_voices())
        return [v["ShortName"] for v in voices if v["Locale"].startswith("zh")]
