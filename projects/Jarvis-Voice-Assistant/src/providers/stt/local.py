"""
providers/stt/capswriter.py - CapsWriter STT Provider

基于 CapsWriter-Offline 的本地 STT 实现
使用 WebSocket 连接 CapsWriter 服务端
"""

import asyncio
import websockets
import json
import base64
from typing import Optional
from ..base import STTProvider


class CapsWriterSTT(STTProvider):
    """
    CapsWriter STT Provider

    通过 WebSocket 连接到 CapsWriter 服务端
    默认地址: ws://127.0.0.1:6016
    """

    def __init__(self, host: str = "127.0.0.1", port: int = 6016):
        self.host = host
        self.port = port
        self.uri = f"ws://{host}:{port}"
        self._websocket: Optional[websockets.WebSocketClientProtocol] = None

    def load(self) -> None:
        """初始化连接 (异步)"""
        pass

    async def _connect(self):
        """建立 WebSocket 连接"""
        try:
            self._websocket = await websockets.connect(
                self.uri, subprotocols=["binary"], max_size=None
            )
        except Exception as e:
            raise ConnectionError(f"无法连接到 CapsWriter 服务端: {e}")

    async def _disconnect(self):
        """关闭连接"""
        if self._websocket:
            await self._websocket.close()
            self._websocket = None

    async def recognize_async(
        self, audio_bytes: bytes, sample_rate: int = 16000
    ) -> str:
        """
        异步识别音频

        Args:
            audio_bytes: 音频数据 (float32, mono)
            sample_rate: 采样率
        Returns:
            识别的文本
        """
        if not self._websocket:
            await self._connect()

        # 构建消息
        message = {
            "source": "mic",
            "is_final": True,
            "is_start": True,
            "task_id": "jarvis_001",
            "context": "",
            "seg_duration": 60,
            "seg_overlap": 4,
            "time_start": 0,
            "data": base64.b64encode(audio_bytes).decode("utf-8"),
        }

        # 发送音频数据
        await self._websocket.send(json.dumps(message))

        # 接收识别结果
        result = ""
        async for response in self._websocket:
            data = json.loads(response)
            if "text" in data:
                result = data["text"]
                break

        return result

    def recognize(self, audio_bytes: bytes) -> str:
        """
        同步识别音频

        Args:
            audio_bytes: 音频数据
        Returns:
            识别的文本
        """
        return asyncio.run(self.recognize_async(audio_bytes))

    def unload(self) -> None:
        """释放资源"""
        asyncio.run(self._disconnect())


class LocalSTT(STTProvider):
    """
    本地 STT Provider

    使用 faster-whisper 进行本地语音识别
    作为 CapsWriter 的备选方案
    """

    def __init__(self, model_size: str = "small", device: str = "auto"):
        self.model_size = model_size
        self.device = device
        self._model = None

    def load(self) -> None:
        """加载模型"""
        try:
            from faster_whisper import WhisperModel

            self._model = WhisperModel(
                self.model_size, device=self.device, compute_type="int8"
            )
        except ImportError:
            raise ImportError("请安装 faster-whisper: pip install faster-whisper")

    def recognize(self, audio_bytes: bytes) -> str:
        """
        识别音频

        Args:
            audio_bytes: 音频数据 (float32, 16kHz, mono)
        Returns:
            识别的文本
        """
        if not self._model:
            self.load()

        import numpy as np

        # 转换为 numpy 数组
        audio_array = np.frombuffer(audio_bytes, dtype=np.float32)

        # 使用 faster-whisper 识别
        segments, info = self._model.transcribe(
            audio_array, language="zh", vad_filter=True
        )

        # 合并所有片段
        text = " ".join([seg.text for seg in segments])
        return text.strip()

    def unload(self) -> None:
        """释放模型"""
        self._model = None
