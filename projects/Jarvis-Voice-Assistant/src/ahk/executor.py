"""
ahk/executor.py - AHK 执行模块

两层架构:
- Layer 1: 动作集 (系统命令)
- Layer 2: 对象集 (软件/文件)
"""

import json
import subprocess
from pathlib import Path
from typing import Optional, Dict, List
from enum import Enum


class ActionType(Enum):
    """动作类型"""

    OPEN = "打开"
    CLOSE = "关闭"
    MAXIMIZE = "最大化"
    MINIMIZE = "最小化"
    RESTORE = "还原"
    SCREENSHOT = "截图"
    LOCK = "锁屏"
    SHUTDOWN = "关机"
    RESTART = "重启"
    VOLUME_UP = "音量加"
    VOLUME_DOWN = "音量减"
    MUTE = "静音"


class SoftwareScanner:
    """
    软件扫描器

    扫描系统中已安装的软件，建立对象集
    """

    def __init__(self, cache_file: str = "config/software_cache.json"):
        self.cache_file = Path(cache_file)
        self.cache: Dict[str, List[str]] = {}
        self._load_cache()

    def _load_cache(self):
        """加载缓存"""
        if self.cache_file.exists():
            self.cache = json.loads(self.cache_file.read_text(encoding="utf-8"))

    def save_cache(self):
        """保存缓存"""
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        self.cache_file.write_text(
            json.dumps(self.cache, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    def scan_registry(self) -> Dict[str, str]:
        """
        扫描注册表中的已安装软件

        Returns:
            {软件名: exe路径}
        """
        import winreg

        results = {}

        # 扫描注册表路径
        reg_paths = [
            r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
            r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
        ]

        for reg_path in reg_paths:
            try:
                key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, reg_path)
                for i in range(1024):
                    try:
                        subkey_name = winreg.EnumKey(key, i)
                        subkey = winreg.OpenKey(key, subkey_name)

                        try:
                            name = winreg.QueryValueEx(subkey, "DisplayName")[0]
                            exe_path = winreg.QueryValueEx(subkey, "InstallLocation")[0]
                            if exe_path:
                                results[name.lower()] = exe_path
                        except FileNotFoundError:
                            pass

                        winreg.CloseKey(subkey)
                    except OSError:
                        break
                winreg.CloseKey(key)
            except FileNotFoundError:
                pass

        return results

    def search(self, query: str) -> Optional[str]:
        """
        搜索软件

        Args:
            query: 搜索关键词
        Returns:
            软件路径，如果未找到返回 None
        """
        query_lower = query.lower()

        # 精确匹配
        if query_lower in self.cache:
            paths = self.cache[query_lower]
            if paths:
                return paths[0]

        # 模糊匹配
        for name, paths in self.cache.items():
            if query_lower in name or name in query_lower:
                if paths:
                    return paths[0]

        return None


class AHKExecutor:
    """
    AHK 执行器

    执行系统级命令
    """

    # 默认动作列表
    DEFAULT_ACTIONS = [
        "打开",
        "关闭",
        "启动",
        "停止",
        "最大化",
        "最小化",
        "还原",
        "截图",
        "截屏",
        "录屏",
        "锁屏",
        "关机",
        "重启",
        "音量加",
        "音量减",
        "静音",
        "上一首",
        "下一首",
        "播放",
        "暂停",
    ]

    def __init__(self, scanner: SoftwareScanner = None):
        self.scanner = scanner or SoftwareScanner()

    def execute(self, action: str, target: str = None) -> str:
        """
        执行命令

        Args:
            action: 动作 (如 "打开", "关闭")
            target: 目标 (如 "微信", "Chrome")
        Returns:
            执行结果
        """
        # 系统命令
        if action in ["截图", "截屏"]:
            return self._take_screenshot()
        elif action == "锁屏":
            return self._lock_screen()
        elif action == "关机":
            return self._shutdown()
        elif action == "重启":
            return self._restart()
        elif action in ["音量加", "音量减", "静音"]:
            return self._volume_control(action)

        # 软件操作
        if target:
            if action in ["打开", "启动"]:
                return self._open_software(target)
            elif action in ["关闭", "停止"]:
                return self._close_software(target)

        return f"不支持的命令: {action} {target or ''}"

    def _open_software(self, name: str) -> str:
        """打开软件"""
        exe_path = self.scanner.search(name)
        if exe_path:
            try:
                subprocess.Popen(exe_path, shell=True)
                return f"已打开 {name}"
            except Exception as e:
                return f"打开失败: {e}"
        else:
            # 尝试直接运行
            try:
                subprocess.Popen(f"start {name}", shell=True)
                return f"已尝试打开 {name}"
            except Exception as e:
                return f"未找到软件: {name}"

    def _close_software(self, name: str) -> str:
        """关闭软件"""
        try:
            # 使用 taskkill 关闭
            subprocess.run(
                f'taskkill /F /IM "{name}.exe"', shell=True, capture_output=True
            )
            return f"已关闭 {name}"
        except Exception as e:
            return f"关闭失败: {e}"

    def _take_screenshot(self) -> str:
        """截图"""
        # 使用 Windows 内置截图
        subprocess.Popen("snippingtool /clip", shell=True)
        return "截图工具已启动"

    def _lock_screen(self) -> str:
        """锁屏"""
        subprocess.run("rundll32.exe user32.dll,LockWorkStation", shell=True)
        return "已锁屏"

    def _shutdown(self) -> str:
        """关机"""
        subprocess.run("shutdown /s /t 0", shell=True)
        return "正在关机"

    def _restart(self) -> str:
        """重启"""
        subprocess.run("shutdown /r /t 0", shell=True)
        return "正在重启"

    def _volume_control(self, action: str) -> str:
        """音量控制"""
        # 使用 PowerShell 控制音量
        if action == "音量加":
            script = "(New-Object -ComObject WScript.Shell).SendKeys([char]175)"
        elif action == "音量减":
            script = "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"
        else:  # 静音
            script = "(New-Object -ComObject WScript.Shell).SendKeys([char]173)"

        subprocess.run(["powershell", "-Command", script], capture_output=True)
        return f"已执行: {action}"


if __name__ == "__main__":
    # 测试执行器
    scanner = SoftwareScanner()
    executor = AHKExecutor(scanner)

    # 测试命令
    print(executor.execute("截图"))
    print(executor.execute("锁屏"))
    print(executor.execute("打开", "notepad"))
