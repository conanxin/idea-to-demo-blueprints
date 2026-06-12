你是多 Agent 项目的统一观察层构建助手。

请基于以下多个项目的 agent 状态报告、commit 数据和风险记录，生成统一 Dashboard Brief、标准化 JSON 数据和静态面板构建任务。

## 项目状态报告

[在此粘贴 sample-agent-status-reports.md]

## Git Commit 数据

[在此粘贴 sample-git-commits.md]

## 项目风险记录

[在此粘贴 sample-project-risk-notes.md]

## 请输出以下内容

### 1. 项目状态摘要

用 3-5 句话概括所有项目的整体状态。包含：
- 项目总数
- active / blocked / done / needs-review 的分布
- 整体风险评估

### 2. 每个项目的当前阶段

列出每个项目的当前 phase（例如 IDB-2R 完成、Phase 1: 基础设施搭建）。

### 3. 每个项目的状态

从以下状态中选择：active / blocked / done / needs-review / planned。

### 4. 最近 commit

每个项目显示最近一次 commit 的哈希和 message。

### 5. 最近报告路径

每个项目的最近阶段报告路径（如 `reports/PHASE_*.md`）。

### 6. 风险等级

每个项目标记：low / medium / high。

### 7. 阻塞事项

每个项目的 blocker（如有），没有则为空。

### 8. 下一步动作

每个项目的 next action，具体到可以执行。

### 9. 统一 JSON 数据结构

定义 Dashboard 使用的标准 JSON 格式：

```json
{
  "meta": {
    "generated_at": "ISO 8601 时间戳",
    "total_projects": 0,
    "by_status": { "active": 0, "blocked": 0, "done": 0, "needs_review": 0 },
    "by_risk": { "low": 0, "medium": 0, "high": 0 }
  },
  "projects": [
    {
      "id": "项目名 slug",
      "name": "项目显示名",
      "agent": "agent 名称",
      "machine": "机器名",
      "phase": "当前阶段",
      "status": "active|blocked|done|needs-review|planned",
      "risk": "low|medium|high",
      "latest_commit": { "hash": "...", "message": "..." },
      "latest_report": "reports/...",
      "blocker": "阻塞事项（无则为空字符串）",
      "next_action": "下一步动作"
    }
  ]
}
```

### 10. Dashboard 页面结构

设计静态 Dashboard 页面布局：
- 顶部标题 + 总体说明
- 统计卡片区（5 个：Total / Active / Blocked / Done / High Risk）
- 筛选按钮区（6 个：All / Active / Blocked / Done / Needs Review / High Risk）
- 项目卡片列表（每张卡片显示完整字段）
- 底部说明（数据来源、复现方法、限制）

### 11. Agent 构建任务

将 Dashboard 拆解为 Agent 可执行的任务：
1. 准备 data.json（5+ 项目）
2. 创建 HTML 结构（标题、统计、筛选、卡片、底部）
3. 实现 CSS 样式（清爽、Notion 风格、移动端可读）
4. 实现 JS 交互（数据读取、筛选逻辑、卡片渲染）
5. 测试交互（点击筛选按钮更新显示）
6. 标注 Demo 限制（静态数据、不连接 API）

### 12. 验收标准

- Demo 页面可打开
- 展示不少于 5 个项目
- 每个项目都有完整字段
- 筛选功能可工作
- JSON 合法
- 移动端可读

### 13. 每日复盘建议

提供项目负责人每日使用 Dashboard 的建议：
- 早晨：检查 blocked 和 needs-review
- 上午：跟踪 active 项目的进展
- 下午：关注 high risk 项目
- 晚上：复盘当日 commit 和状态变化

## 要求

- **不要编造**：不要编造不存在的 commit、报告或项目。所有数据必须来自输入材料
- **不要伪装**：不要把模拟数据伪装成真实数据，明确标注 sample data
- **标记不确定**：不确定内容标记为 [待确认]
- **区分来源**：明确区分 agent 明确报告和 AI 推断
- **适合 Agent**：输出适合直接交给 Agent 继续构建
- **可人工确认**：所有项目状态必须可人工确认（保留确认点）

## 输出格式

请用 Markdown 格式输出，包含标题、列表、表格、代码块等结构化元素。