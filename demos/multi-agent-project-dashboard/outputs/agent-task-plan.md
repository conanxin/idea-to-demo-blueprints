# Agent 任务计划：多 Agent 项目管理面板

## 任务清单

| 编号 | 任务 | 文件/组件 | 输出 | 验收 |
|------|------|----------|------|------|
| T-001 | 准备 6 个项目的模拟数据 | `app/data.json` | data.json 合法 JSON | 通过 jsonlint 验证 |
| T-002 | 创建 HTML 骨架（5 个区域） | `app/index.html` | header / stats / filters / cards / footer | 5 个区域齐全 |
| T-003 | 实现统计卡片渲染 | `app/app.js` | 5 张统计卡片显示正确 | 总数、active、blocked、done、high risk 正确 |
| T-004 | 实现项目卡片渲染 | `app/app.js` | 6 张项目卡片 | 每张显示 10 个字段 |
| T-005 | 实现筛选按钮（按 status） | `app/app.js` | 6 个筛选按钮可点击 | 点击切换显示 |
| T-006 | 实现筛选按钮（按 risk） | `app/app.js` | 高风险筛选可工作 | 点击 high risk 只显示 high |
| T-007 | 添加 CSS 样式 | `app/index.html`（内嵌） | Notion 风格 | 移动端可读 |
| T-008 | 添加 Demo 限制说明 | `app/index.html` | 底部说明 | 标注静态模拟数据 |
| T-009 | 测试本地打开 | 浏览器 | 可正常显示 | - |
| T-010 | 测试 GitHub Pages | gh-pages | 200 OK | curl 验证 |

## 实施策略

### 为什么选择静态 Demo

- 不需要后端，部署最简单
- 直接打开 index.html 即可使用
- 适合 GitHub Pages 部署
- 便于演示和分享

### 为什么使用模拟数据

- 不依赖真实 API 权限
- 不依赖真实项目状态（避免泄漏隐私）
- 演示效果一致
- 易于扩展到真实数据

### 哪些部分本阶段不做

- 真实 GitHub API 集成
- 报告自动解析
- 历史快照
- Telegram bot 接入
- 自动调度建议

### 如何从 Demo 演进到真实系统

1. 增加数据采集脚本（解析 reports/ 目录）
2. 增加 GitHub API 集成（替换静态 commits）
3. 增加历史快照（每日保存 data.json）
4. 增加 Telegram bot（自动推送 blocked 提醒）
5. 增加自动调度（基于 next action 触发 agent）

## 风险与缓解

| 风险 | 应对 |
|------|------|
| 数据格式不统一 | 标准化前人工审查 |
| 报告过长导致遗漏 | Dashboard 卡片突出关键字段 |
| 多 agent 状态不一致 | 设置权威源（GitHub Pages URL） |
| 静态数据过期 | 标注 generated_at，定期更新 |

---

*Agent task plan for Multi-Agent Project Dashboard. Phase: IDB-3.*