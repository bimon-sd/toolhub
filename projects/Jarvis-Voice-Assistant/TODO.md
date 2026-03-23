# Jarvis 项目进度看板

## 待办事项 (Priority)

### Phase 1: 核心引擎
- [x] 项目结构搭建
- [x] 状态机实现 (OFF/ON/TYPING)
- [x] 音频采集模块 (VAD + 麦克风)
- [x] 意图判断模块 (Layer1 命令词 + Layer2 LLM)

### Phase 2: Provider 实现
- [x] STT Provider 接口实现
- [x] LLM Provider 接口实现  
- [x] TTS Provider (Edge TTS) 实现

### Phase 3: 记忆系统
- [x] 记忆管理器基础实现
- [ ] 短期记忆 JSON 读写
- [ ] 长期记忆 Markdown 归档
- [ ] 记忆摘要生成

### Phase 4: 人设系统
- [x] 人设加载器基础实现
- [ ] 默认人设文件创建
- [ ] 动态记忆注入

### Phase 5: AHK 执行模块
- [x] 动作集定义
- [x] 软件扫描器
- [x] 命令解析器

### Phase 6: UI 组件
- [x] 小圆点托盘图标
- [x] 三状态视觉反馈
- [x] 右键菜单配置界面

### Phase 7: 集成测试
- [ ] 全链路功能测试
- [ ] 性能测试
- [ ] 边界情况测试

## 已完成 (Done)
- [x] 项目需求确认与架构设计
- [x] GitHub 仓库创建
- [x] 项目结构搭建
- [x] 状态机核心实现
- [x] Provider 接口规范定义
- [x] 记忆管理器基础实现
- [x] 人设加载器基础实现
- [x] 开发文档编写
- [x] 音频采集模块
- [x] 意图判断模块
- [x] STT/LLM/TTS Provider
- [x] AHK 执行模块
- [x] UI 小圆点组件
- [x] main.py 主入口

## 阻塞中 (Blocked)
- (无)
