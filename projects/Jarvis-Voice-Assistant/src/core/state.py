"""
core/state.py - Jarvis 状态机定义

三状态模型:
- OFF: 闲置状态，释放麦克风
- ON: 监听状态，语音 → LLM → TTS
- TYPING: 语音上屏状态，语音 → 文字 → 光标焦点
"""

from enum import Enum


class State(Enum):
    """Jarvis 状态枚举"""

    OFF = 0  # 闲置
    ON = 1  # 监听
    TYPING = 2  # 语音上屏


class StateMachine:
    """
    状态机管理器

    状态转换规则:
    - OFF → ON: 左键单击
    - ON → OFF: 左键单击
    - ON → TYPING: 按住 CAPS
    - TYPING → ON: 松开 CAPS
    - TYPING → OFF: 左键单击
    """

    def __init__(self):
        self.current_state = State.OFF
        self._listeners = []

    @property
    def is_off(self) -> bool:
        return self.current_state == State.OFF

    @property
    def is_on(self) -> bool:
        return self.current_state == State.ON

    @property
    def is_typing(self) -> bool:
        return self.current_state == State.TYPING

    def toggle(self) -> State:
        """左键单击切换: OFF↔ON 或 TYPING→OFF"""
        if self.current_state == State.OFF:
            self._set_state(State.ON)
        elif self.current_state == State.ON:
            self._set_state(State.OFF)
        elif self.current_state == State.TYPING:
            self._set_state(State.OFF)
        return self.current_state

    def caps_press(self) -> State:
        """按下 CAPS: ON → TYPING"""
        if self.current_state == State.ON:
            self._set_state(State.TYPING)
        return self.current_state

    def caps_release(self) -> State:
        """松开 CAPS: TYPING → ON"""
        if self.current_state == State.TYPING:
            self._set_state(State.ON)
        return self.current_state

    def _set_state(self, new_state: State):
        old_state = self.current_state
        self.current_state = new_state
        for listener in self._listeners:
            listener(old_state, new_state)

    def on_state_change(self, callback):
        """注册状态变化监听器"""
        self._listeners.append(callback)


if __name__ == "__main__":
    # 测试状态机
    sm = StateMachine()
    sm.on_state_change = lambda old, new: print(f"{old.name} → {new.name}")

    print(f"初始状态: {sm.current_state.name}")
    sm.toggle()  # OFF → ON
    sm.caps_press()  # ON → TYPING
    sm.caps_release()  # TYPING → ON
    sm.toggle()  # ON → OFF
