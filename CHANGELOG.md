# 更新日志
## [0.0.7] - 2025-04-27
### 🚀 优化
- 更新 README 文件，修正图标链接路径，新增版本、许可证和 Windows 支持徽章，提升文档专业度与可读性。
- 新增应用截图与使用指南，优化内容结构，帮助用户快速了解与上手应用
- 删除模型弹窗提示信息优化，避免显示空模型名称，提升交互体验。
- 模型自定义页面中优化 token 计数逻辑。
- 聊天页面滚动逻辑优化，彻底修复上下抖动问题，体验更顺滑自然。

### 🎉 新增
- 聊天页面用户消息区域新增图片预览功能，支持更丰富的内容展示形式。

### 📌 其他
- MCP 服务模块开发进度推进中，更多功能即将上线，敬请期待。

## [0.0.6] - 2025-04-26
### 🚀 优化
- 聊天模块全面重构，优化 API 路由与模块导入，提升系统结构清晰度与执行效率。
- WebSocket 连接管理优化，提升连接稳定性与消息响应速度，增强用户体验。
- 消息处理逻辑精简，支持思考状态与工具调用展示，交互体验更自然流畅。
- 多个组件新增内容渲染完成事件，改善消息展示节奏与动画效果。
- 网页搜索适配所有ollama模型，不过以后可能会改。

### 🎉 新增
- 新增 ConversationUpdate 支持，丰富对话更新功能。
- schemas.py 中新增模型加载状态相关类，支持前端实时感知模型状态。
- 新增网页搜索状态动画，让页面更多乐趣。

### 🛠 修复
- 修复若干组件样式与功能问题，优化界面一致性与交互体验。
- 修复桌面应用端无法导出 .md 文件的问题（原因是系统路径解析异常）。

### 📌 其他
- MCP 服务模块开发进度推进中，更多功能即将上线，敬请期待。

## [0.0.5] - 2025-04-20

## 重要：
v0.0.4的版本更新会有报错，GitHub问题，请直接下载v0.0.5。

### 🚀 优化
- 客户端桌面应用构建配置优化，提升构建效率。
- 客户端桌面应用版本信息更新模块逻辑优化，确保版本更新准确高效。

### 🛠 修复
- 修复自定义模型重名问题，优化模型名称冲突的提示信息。
- 重构并优化部分组件样式，提升界面可读性和用户体验。

### 📌 其他
- MCP 服务模块持续开发中，敬请期待后续更新。

## [0.0.4] - 2025-04-13

### 🎉 新增
- 模型库新增魔搭社区 GGUF 模型拉取功能，丰富模型选择。

### 🚀 优化
- 持续提升系统性能与用户体验。
- 拉取模型模块优化代码结构，增强应用稳定性。
- 改善部分页面交互细节。
- 拉取模型后端日志减少显示，提升日志可读性。

### 🛠 修复
- 修复部分已知问题，进一步提升系统稳定性。

### MCP 服务模块正在开发中，敬请期待。

## [0.0.3] - 2025-04-11

### 🎉 新增
- 新增模型库GPU 内存计算器，帮助用户精准选择适合的模型。

### 🚀 优化
- 优化快速笔记HTML格式转markdown语法。
- 调整多个页面的样式以改善布局和间距。
- 文档上传支持的字数限制由原来的2万字增加至20万字。

### 🛠 修复
- 修复部分已知问题，提升整体稳定性。

## [0.0.2] - 2025-04-08

### 🎉 新增
- 增加开机载入动画，提升应用启动流畅度。


### 🚀 优化
- 优化后端启动逻辑，减少冗余日志输出。
- 精简前端启动逻辑，提升页面加载速度。
- 改进主题初始化逻辑，更快更稳定。
- 优化外部链接跳转体验。

### 🛠 修复
- 修复首次进入应用可能出现的页面白屏问题。
- 页面跳转紫色背景修复页面跳转时出现的紫色背景异常。

## [0.0.1] - 2025-04-07

### 新增
- windows客户端，开箱即用；
- 快速笔记功能，实现实时预览；
- 新增聊天对话页选中内容一键复制功能；

### 优化
- 多账户数据隔离；
- 账户认证机制更稳定；
- 本地模型高级参数；

### 修复
- 已知BUG
