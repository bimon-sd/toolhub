"""
core/audio.py - 音频采集模块

负责:
1. 麦克风音频流采集
2. VAD (语音活动检测)
3. 音频分段和缓冲
"""

import numpy as np
import sounddevice as sd
from typing import Callable, Optional
from enum import Enum


class AudioState(Enum):
    """音频状态"""

    IDLE = 0  # 空闲
    LISTENING = 1  # 监听中
    SPEAKING = 2  # 说话中


class VADDetector:
    """简易 VAD 检测器 (基于能量阈值)"""

    def __init__(self, threshold: float = 0.02, silence_duration: float = 0.8):
        self.threshold = threshold
        self.silence_duration = silence_duration
        self._silence_start: Optional[float] = None

    def is_speech(self, audio_chunk: np.ndarray) -> bool:
        """
        判断音频块是否包含语音

        Args:
            audio_chunk: 音频数据 (float32, mono)
        Returns:
            True 如果检测到语音
        """
        energy = np.sqrt(np.mean(audio_chunk**2))
        return energy > self.threshold

    def reset(self):
        """重置状态"""
        self._silence_start = None


class AudioCapture:
    """
    音频采集器

    支持:
    - 持续监听模式 (用于实时对话)
    - 按键触发模式 (用于语音上屏)
    """

    def __init__(
        self,
        sample_rate: int = 16000,
        chunk_size: int = 1024,
        vad_threshold: float = 0.02,
        silence_duration: float = 0.8,
    ):
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.vad = VADDetector(vad_threshold, silence_duration)

        self._stream: Optional[sd.InputStream] = None
        self._buffer: list = []
        self._state = AudioState.IDLE
        self._on_speech_end: Optional[Callable] = None

    def start_listening(self, on_speech_end: Callable = None):
        """
        开始持续监听模式

        Args:
            on_speech_end: 语音结束时的回调函数，参数为音频数据 bytes
        """
        self._on_speech_end = on_speech_end
        self._state = AudioState.LISTENING
        self._buffer = []

        self._stream = sd.InputStream(
            samplerate=self.sample_rate,
            channels=1,
            dtype="float32",
            blocksize=self.chunk_size,
            callback=self._audio_callback,
        )
        self._stream.start()

    def stop_listening(self):
        """停止监听"""
        self._state = AudioState.IDLE
        if self._stream:
            self._stream.stop()
            self._stream.close()
            self._stream = None
        self._buffer = []
        self.vad.reset()

    def _audio_callback(self, indata, frames, time_info, status):
        """音频回调函数"""
        if self._state != AudioState.LISTENING:
            return

        audio_chunk = indata[:, 0]  # 取第一通道

        if self.vad.is_speech(audio_chunk):
            # 检测到语音，加入缓冲
            self._buffer.append(audio_chunk.copy())
            self.vad._silence_start = None
        else:
            # 静音
            if self._buffer:
                # 如果已有语音数据，开始计时
                import time

                if self.vad._silence_start is None:
                    self.vad._silence_start = time.time()
                elif time.time() - self.vad._silence_start > self.vad.silence_duration:
                    # 静音超过阈值，认为语音结束
                    audio_data = np.concatenate(self._buffer)
                    self._buffer = []
                    self.vad.reset()

                    if self._on_speech_end:
                        # 转换为 bytes
                        audio_bytes = audio_data.tobytes()
                        self._on_speech_end(audio_bytes)

    def capture_once(self, duration: float = 5.0) -> bytes:
        """
        录制一段音频 (用于按键触发模式)

        Args:
            duration: 最大录制时长 (秒)
        Returns:
            音频数据 bytes
        """
        audio = sd.rec(
            int(duration * self.sample_rate),
            samplerate=self.sample_rate,
            channels=1,
            dtype="float32",
        )
        sd.wait()  # 等待录制完成

        # 截断静音部分
        audio = audio[:, 0]
        return audio.tobytes()

    @property
    def state(self) -> AudioState:
        return self._state

    @property
    def is_listening(self) -> bool:
        return self._state == AudioState.LISTENING


if __name__ == "__main__":
    # 测试音频采集
    import time

    def on_speech(audio_bytes):
        print(f"收到音频数据: {len(audio_bytes)} bytes")

    capture = AudioCapture()
    capture.start_listening(on_speech)

    print("开始监听... (Ctrl+C 退出)")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        capture.stop_listening()
        print("已停止")
