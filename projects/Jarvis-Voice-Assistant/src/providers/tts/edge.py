"""
providers/tts/edge.py - Edge TTS Provider

微软 Edge TTS，免费、快速、音质不错
作为默认 TTS 方案
"""

import asyncio
import io
import tempfile
from pathlib import Path
from ..base import TTSProvider


class EdgeTTSProvider(TTSProvider):
    """
    Edge TTS provider 实现

    使用微软 Edge TTS 服务
    免费、快速、支持中文
    """

    def __init__(self, voice: str = "zh-CN-XiaoxiaoNeural", rate: int = 0):
        """
        Args:
            voice: 语音名称 (默认: zh-CN-XiaoxiaoNeural)
            rate: 语速调整 (范围: -100 到 100)
        """
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
        """
        同步语音播报

        Args:
            text: 要播报的文本
        """
        asyncio.run(self._async_speak(text))

    async def _async_speak(self, text: str) -> None:
        """
        异步语音播报

        Args:
            text: 要播报的文本
        """
        if not self._edge_tts:
            self.load()

        # 生成音频
        communicate = self._edge_tts.Communicate(
            text, self.voice, rate=f"{self.rate:+d}%"
        )

        # 保存到临时文件
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
            temp_path = f.name

        await communicate.save(temp_path)

        # 播放音频
        self._play_audio(temp_path)

        # 清理临时文件
        Path(temp_path).unlink(missing_ok=True)

    def _play_audio(self, file_path: str):
        """
        播放音频文件

        Args:
            file_path: 音频文件路径
        """
        import platform
        import subprocess

        system = platform.system()

        if system == "Windows":
            # Windows: 使用 powershell 播放
            subprocess.run(
                [
                    "powershell",
                    "-c",
                    f"(New-Object System.Media.SoundPlayer '{file_path}').PlaySync()",
                ],
                capture_output=True,
            )
        elif system == "Darwin":
            # macOS: 使用 afplay
            subprocess.run(["afplay", file_path], capture_output=True)
        else:
            # Linux: 使用 mpv 或 ffplay
            try:
                subprocess.run(["mpv", "--no-terminal", file_path], capture_output=True)
            except FileNotFoundError:
                subprocess.run(
                    ["ffplay", "-nodisp", "-autoexit", file_path], capture_output=True
                )

    def stop(self) -> None:
        """
        停止当前播报

        注意: Edge TTS 播放时较难中断
        """
        pass

    @staticmethod
    def list_voices() -> list:
        """
        列出可用的中文语音

        Returns:
            语音名称列表
        """
        import asyncio
        from edge_tts import list_voices

        voices = asyncio.run(list_voices())
        return [
            {"name": v["ShortName"], "gender": v["Gender"], "locale": v["Locale"]}
            for v in voices
            if v["Locale"].startswith("zh")
        ]


class LocalTTS(TTSProvider):
    """
    本地 TTS Provider

    使用 pyttsx3 或其他本地 TTS 引擎
    作为 Edge TTS 的离线备选方案
    """

    def __init__(self, voice_index: int = 0, rate: int = 200):
        """
        Args:
            voice_index: 语音索引
            rate: 语速 (默认 200)
        """
        self.voice_index = voice_index
        self.rate = rate
        self._engine = None

    def load(self) -> None:
        """加载 TTS 引擎"""
        try:
            import pyttsx3

            self._engine = pyttsx3.init()
            self._engine.setProperty("rate", self.rate)

            voices = self._engine.getProperty("voices")
            if voices and self.voice_index < len(voices):
                self._engine.setProperty("voice", voices[self.voice_index].id)
        except ImportError:
            raise ImportError("请安装 pyttsx3: pip install pyttsx3")

    def speak(self, text: str) -> None:
        """
        语音播报

        Args:
            text: 要播报的文本
        """
        if not self._engine:
            self.load()

        self._engine.say(text)
        self._engine.runAndWait()

    def stop(self) -> None:
        """停止播报"""
        if self._engine:
            self._engine.stop()


if __name__ == "__main__":
    # 测试 Edge TTS
    tts = EdgeTTSProvider()
    tts.load()
    tts.speak("你好，我是 Jarvis，你的语音助手。")
