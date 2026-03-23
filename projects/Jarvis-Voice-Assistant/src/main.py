"""
main.py - Jarvis 语音助手入口

三节点架构: STT → LLM → TTS
支持热插拔，通过配置文件切换 Provider
"""

import sys
import json
import threading
from pathlib import Path
from typing import Optional

# 项目根目录
BASE_DIR = Path(__file__).parent

# 添加到路径
sys.path.insert(0, str(BASE_DIR))

from src.core.state import State, StateMachine
from src.core.audio import AudioCapture
from src.core.intent import IntentClassifier, CommandMatcher
from src.memory.manager import MemoryManager
from src.personality.loader import PersonalityLoader
from src.ahk.executor import AHKExecutor, SoftwareScanner


class JarvisConfig:
    """配置管理器"""

    def __init__(self, config_file: str = None):
        if config_file is None:
            config_file = BASE_DIR / "config" / "config.json"
        self.config_file = Path(config_file)
        self.config = self._load()

    def _load(self) -> dict:
        """加载配置"""
        if self.config_file.exists():
            return json.loads(self.config_file.read_text(encoding="utf-8"))
        return {}

    def get(self, key: str, default=None):
        """获取配置项"""
        keys = key.split(".")
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default


class JarvisCore:
    """
    Jarvis 核心引擎

    协调 STT、LLM、TTS、AHK、记忆、人设等模块
    """

    def __init__(self, config: JarvisConfig = None):
        self.config = config or JarvisConfig()

        # 核心组件
        self.state_machine = StateMachine()
        self.audio_capture: Optional[AudioCapture] = None
        self.intent_classifier = IntentClassifier()
        self.memory = MemoryManager(str(BASE_DIR / "memory"))
        self.personality = PersonalityLoader(str(BASE_DIR / "personality"))

        # Provider (延迟加载)
        self._stt_provider = None
        self._llm_provider = None
        self._tts_provider = None

        # AHK
        self.scanner = SoftwareScanner(str(BASE_DIR / "config" / "software_cache.json"))
        self.ahk_executor = AHKExecutor(self.scanner)

        # 状态变化监听
        self.state_machine.on_state_change(self._on_state_change)

    def _on_state_change(self, old_state: State, new_state: State):
        """状态变化处理"""
        print(f"[状态] {old_state.name} → {new_state.name}")

        if new_state == State.ON:
            self._start_listening()
        elif new_state == State.OFF:
            self._stop_listening()

    def _start_listening(self):
        """开始监听模式"""
        if not self.audio_capture:
            self.audio_capture = AudioCapture()

        self.audio_capture.start_listening(on_speech_end=self._on_speech_end)
        print("[音频] 开始监听...")

    def _stop_listening(self):
        """停止监听"""
        if self.audio_capture:
            self.audio_capture.stop_listening()
        print("[音频] 已停止监听")

    def _on_speech_end(self, audio_bytes: bytes):
        """
        语音识别完成回调

        执行完整链路: STT → 意图判断 → LLM/AHK → TTS
        """
        if not self.state_machine.is_on:
            return

        # STT 识别
        stt = self._get_stt_provider()
        text = stt.recognize(audio_bytes)

        if not text:
            return

        print(f"[STT] 识别结果: {text}")

        # 添加到记忆
        self.memory.add_message("user", text)

        # 意图判断
        intent, action, obj = self.intent_classifier.classify(text)

        if intent.value == "command" and action:
            # 执行命令
            result = self.ahk_executor.execute(action, obj)
            print(f"[AHK] {result}")

            # 生成反馈
            feedback = f"已{action}"
            if obj:
                feedback += f" {obj}"

            # 添加到记忆
            self.memory.add_message("assistant", feedback, action=action)

            # TTS 播报
            tts = self._get_tts_provider()
            tts.speak(feedback)
        else:
            # 闲聊 - 调用 LLM
            llm = self._get_llm_provider()

            system_prompt = self.personality.load()
            context = self.memory.get_context()

            messages = [{"role": "user", "content": text}]
            if context:
                messages.insert(0, {"role": "system", "content": context})

            response = llm.chat(messages, system_prompt=system_prompt)
            print(f"[LLM] {response}")

            # 添加到记忆
            self.memory.add_message("assistant", response)

            # TTS 播报
            tts = self._get_tts_provider()
            tts.speak(response)

    def _get_stt_provider(self):
        """获取 STT Provider (懒加载)"""
        if self._stt_provider is None:
            from src.providers.stt.local import LocalSTT

            self._stt_provider = LocalSTT(model_size="small")
            self._stt_provider.load()
        return self._stt_provider

    def _get_llm_provider(self):
        """获取 LLM Provider (懒加载)"""
        if self._llm_provider is None:
            from src.providers.llm.api import DeepSeekProvider

            api_key = self.config.get("llm.api.api_key", "")
            self._llm_provider = DeepSeekProvider(api_key=api_key)
            self._llm_provider.load()
        return self._llm_provider

    def _get_tts_provider(self):
        """获取 TTS Provider (懒加载)"""
        if self._tts_provider is None:
            from src.providers.tts.edge import EdgeTTSProvider

            self._tts_provider = EdgeTTSProvider()
            self._tts_provider.load()
        return self._tts_provider

    def start(self):
        """启动 Jarvis"""
        print("=" * 50)
        print("  Jarvis 语音助手启动中...")
        print("=" * 50)

        # 预加载人设
        print(f"[人设] 已加载: {len(self.personality.load())} 字符")

        # 预扫描软件
        print("[扫描] 正在扫描已安装软件...")

        print("[就绪] Jarvis 已就绪")
        print("")
        print("操作说明:")
        print("  - 左键单击小圆点: 切换 监听/闲置")
        print("  - 按住 CAPS: 语音上屏模式")
        print("  - 右键小圆点: 打开设置菜单")
        print("")

    def stop(self):
        """停止 Jarvis"""
        if self.audio_capture:
            self.audio_capture.stop_listening()
        print("[停止] Jarvis 已停止")


def main():
    """主函数"""
    from src.ui.tray import JarvisTray

    # 初始化核心
    core = JarvisCore()
    core.start()

    # 设置退出回调
    def on_exit():
        core.stop()

    # 启动 UI
    tray = JarvisTray(core.state_machine)
    tray.on_exit = on_exit
    tray.show()


if __name__ == "__main__":
    main()
