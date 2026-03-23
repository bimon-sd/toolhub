"""
ui/tray.py - Jarvis 小圆点托盘组件

三状态视觉反馈:
- OFF (闲置): 灰色静态
- ON (监听): 绿色脉冲呼吸
- TYPING (上屏): 蓝色闪烁

支持:
- 左键单击切换状态
- 右键菜单配置
- 系统托盘图标
"""

import sys
from pathlib import Path
from typing import Callable, Optional

from PyQt6.QtWidgets import (
    QApplication,
    QWidget,
    QLabel,
    QMenu,
    QSystemTrayIcon,
    QVBoxLayout,
)
from PyQt6.QtCore import Qt, QTimer, QPoint, pyqtSignal
from PyQt6.QtGui import QFont, QAction, QIcon, QColor, QPainter, QBrush

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from src.core.state import State, StateMachine


class DotWidget(QWidget):
    """
    小圆点悬浮窗组件

    显示当前 Jarvis 状态
    """

    # 颜色配置
    COLORS = {
        State.OFF: QColor(128, 128, 128),  # 灰色
        State.ON: QColor(0, 200, 83),  # 绿色
        State.TYPING: QColor(33, 150, 243),  # 蓝色
    }

    def __init__(self, state_machine: StateMachine, size: int = 48):
        super().__init__()
        self.state_machine = state_machine
        self.dot_size = size
        self.opacity = 1.0
        self.pulse_direction = 1

        # 无边框、置顶、透明背景
        self.setWindowFlags(
            Qt.WindowType.FramelessWindowHint
            | Qt.WindowType.WindowStaysOnTopHint
            | Qt.WindowType.Tool
        )
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents, False)

        # 设置大小
        self.setFixedSize(size + 16, size + 16)

        # 脉冲动画定时器
        self.pulse_timer = QTimer()
        self.pulse_timer.timeout.connect(self._pulse_animation)
        self.pulse_timer.start(50)  # 20 FPS

        # 注册状态变化监听
        self.state_machine.on_state_change(self._on_state_change)

    def _on_state_change(self, old_state: State, new_state: State):
        """状态变化回调"""
        self.update()

    def _pulse_animation(self):
        """脉冲动画"""
        if self.state_machine.is_on:
            # 监听状态: 绿色呼吸
            self.opacity += 0.03 * self.pulse_direction
            if self.opacity >= 1.0:
                self.opacity = 1.0
                self.pulse_direction = -1
            elif self.opacity <= 0.4:
                self.opacity = 0.4
                self.pulse_direction = 1
        elif self.state_machine.is_typing:
            # 上屏状态: 蓝色快速闪烁
            self.opacity = 0.5 if self.opacity > 0.9 else 1.0
        else:
            # 闲置状态: 灰色静态
            self.opacity = 0.6

        self.update()

    def paintEvent(self, event):
        """绘制小圆点"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        # 获取当前状态颜色
        color = self.COLORS[self.state_machine.current_state]
        color.setAlphaF(self.opacity)

        # 绘制圆形
        margin = 8
        painter.setBrush(QBrush(color))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawEllipse(
            QPoint(self.width() // 2, self.height() // 2),
            self.dot_size // 2,
            self.dot_size // 2,
        )

        painter.end()

    def mousePressEvent(self, event):
        """鼠标点击事件"""
        if event.button() == Qt.MouseButton.LeftButton:
            self.state_machine.toggle()


class SettingsWindow(QWidget):
    """设置窗口"""

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Jarvis 设置")
        self.setFixedSize(400, 500)
        self._init_ui()

    def _init_ui(self):
        """初始化 UI"""
        layout = QVBoxLayout()

        # 标题
        title = QLabel("Jarvis 语音助手设置")
        title.setFont(QFont("Microsoft YaHei", 14, QFont.Weight.Bold))
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        # STT 设置
        layout.addWidget(QLabel("STT 语音识别:"))
        layout.addWidget(QLabel("  Provider: Capswriter / Local Whisper"))

        # LLM 设置
        layout.addWidget(QLabel("LLM 大模型:"))
        layout.addWidget(QLabel("  Provider: DeepSeek / OpenAI / Ollama"))

        # TTS 设置
        layout.addWidget(QLabel("TTS 语音合成:"))
        layout.addWidget(QLabel("  Provider: Edge TTS / Local TTS"))

        # 记忆设置
        layout.addWidget(QLabel("记忆系统:"))
        layout.addWidget(QLabel("  短期记忆: 10 轮"))
        layout.addWidget(QLabel("  长期记忆: 按天归档"))

        layout.addStretch()
        self.setLayout(layout)


class JarvisTray:
    """
    Jarvis 系统托盘管理器

    整合小圆点、托盘图标、右键菜单
    """

    def __init__(self, state_machine: StateMachine):
        self.state_machine = state_machine
        self.app: Optional[QApplication] = None
        self.dot_widget: Optional[DotWidget] = None
        self.tray_icon: Optional[QSystemTrayIcon] = None
        self.settings_window: Optional[SettingsWindow] = None

        # 回调
        self.on_exit: Optional[Callable] = None

    def show(self):
        """显示托盘和小圆点"""
        self.app = QApplication(sys.argv)
        self.app.setQuitOnLastWindowClosed(False)

        # 创建小圆点
        self.dot_widget = DotWidget(self.state_machine)
        self.dot_widget.move(100, 100)  # 默认位置
        self.dot_widget.show()

        # 创建系统托盘图标
        self._create_tray_icon()

        # 运行
        self.app.exec()

    def _create_tray_icon(self):
        """创建系统托盘图标"""
        # 使用默认图标
        self.tray_icon = QSystemTrayIcon(self.app)

        # 创建右键菜单
        menu = QMenu()

        # 状态切换
        toggle_action = QAction("切换状态 (左键单击小圆点)", self.app)
        toggle_action.triggered.connect(self.state_machine.toggle)
        menu.addAction(toggle_action)

        menu.addSeparator()

        # 设置
        settings_action = QAction("设置", self.app)
        settings_action.triggered.connect(self._show_settings)
        menu.addAction(settings_action)

        # 人设编辑
        personality_action = QAction("编辑人设", self.app)
        personality_action.triggered.connect(self._edit_personality)
        menu.addAction(personality_action)

        # 记忆管理
        memory_action = QAction("查看记忆", self.app)
        memory_action.triggered.connect(self._view_memory)
        menu.addAction(memory_action)

        menu.addSeparator()

        # 退出
        exit_action = QAction("退出", self.app)
        exit_action.triggered.connect(self._exit)
        menu.addAction(exit_action)

        self.tray_icon.setContextMenu(menu)
        self.tray_icon.show()

    def _show_settings(self):
        """显示设置窗口"""
        if not self.settings_window:
            self.settings_window = SettingsWindow()
        self.settings_window.show()
        self.settings_window.activateWindow()

    def _edit_personality(self):
        """打开人设文件"""
        import subprocess

        personality_dir = Path(__file__).parent.parent / "personality"
        subprocess.Popen(f'explorer "{personality_dir}"')

    def _view_memory(self):
        """查看记忆文件"""
        import subprocess

        memory_dir = Path(__file__).parent.parent / "memory"
        subprocess.Popen(f'explorer "{memory_dir}"')

    def _exit(self):
        """退出程序"""
        if self.on_exit:
            self.on_exit()
        if self.app:
            self.app.quit()


if __name__ == "__main__":
    # 测试托盘组件
    sm = StateMachine()
    sm.on_state_change = lambda old, new: print(f"状态: {old.name} → {new.name}")

    tray = JarvisTray(sm)
    tray.show()
