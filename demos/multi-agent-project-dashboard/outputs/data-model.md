# 数据模型：多 Agent 项目管理面板

## 顶层结构

```json
{
  "meta": { ... },
  "projects": [ ... ]
}
```

## meta 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| generated_at | string | ISO 8601 时间戳 |
| total_projects | number | 项目总数 |
| by_status | object | 按状态分组的项目数 |
| by_risk | object | 按风险等级分组的项目数 |

### meta 示例

```json
{
  "meta": {
    "generated_at": "2026-06-13T00:30:00+08:00",
    "total_projects": 6,
    "by_status": {
      "active": 3,
      "blocked": 1,
      "done": 1,
      "needs_review": 1,
      "planned": 0
    },
    "by_risk": {
      "low": 4,
      "medium": 1,
      "high": 1
    }
  }
}
```

## project 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 项目 slug，唯一标识 |
| name | string | 是 | 项目显示名 |
| agent | string | 是 | agent 名称 |
| machine | string | 是 | 运行机器 |
| phase | string | 是 | 当前阶段描述 |
| status | enum | 是 | active / blocked / done / needs-review / planned |
| risk | enum | 是 | low / medium / high |
| latest_commit | object | 否 | { hash, message, branch, pushed, timestamp } |
| latest_report | string | 否 | 报告路径，无则为空字符串 |
| blocker | string | 否 | 阻塞事项，无则为空字符串 |
| next_action | string | 是 | 下一步动作 |

### project 示例

```json
{
  "id": "idea-to-demo-blueprints",
  "name": "idea-to-demo-blueprints",
  "agent": "OpenClaw (kimi-coding/k2p5)",
  "machine": "VM-0-4-ubuntu",
  "phase": "IDB-2R 完成",
  "status": "active",
  "risk": "low",
  "latest_commit": {
    "hash": "6a89bef",
    "message": "IDB-2R: Add reproducible demo pack system",
    "branch": "main",
    "pushed": true,
    "timestamp": "2026-06-13T00:05:00+08:00"
  },
  "latest_report": "reports/PHASE_IDB_2R_REPRODUCIBLE_DEMO_PACK_SYSTEM_REPORT.md",
  "blocker": "",
  "next_action": "等待 IDB-3 启动"
}
```

## 状态枚举

- **active** — 进行中，无阻塞
- **blocked** — 有阻塞，需要解决才能继续
- **done** — 已完成
- **needs-review** — 需要人工审查或确认
- **planned** — 已规划但未开始

## 风险等级

- **low** — 低风险，按计划进行
- **medium** — 中等风险，需要关注
- **high** — 高风险，需要立即介入

## 设计原则

1. **单一数据源**：meta 自动从 projects 计算，不手动维护
2. **可读优先**：字段名清晰，无需查阅文档即可理解
3. **可扩展**：新增字段不影响现有字段，向后兼容
4. **人工可确认**：所有状态字段都对应人工判断，便于审查

---

*Data model for Multi-Agent Project Dashboard. Phase: IDB-3.*