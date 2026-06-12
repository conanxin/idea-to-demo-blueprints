# Dashboard Brief: 多 Agent 项目管理面板

> 基于模拟 agent 报告 + commit 数据 + 风险记录生成

---

## 1. 项目状态摘要

当前共 6 个模拟项目处于不同状态：1 个 active（idea-to-demo-blueprints）、1 个 blocked（medium-archive-astro）、2 个 active（conan-vps-control-tower, artvee-library）、1 个 needs-review（claimlens）、1 个 done（booktrans-desk）。整体风险等级以 low 为主，但有 1 个 high risk 项目（claimlens）需要用户尽快介入。

---

## 2-8. 项目字段

参见 `data-model.md` 和 `data.json` 中的结构。

---

## 9. 统一 JSON 数据结构

参见 `data-model.md`。

---

## 10. Dashboard 页面结构

```
┌────────────────────────────────────────────────────┐
│ AgentOps Control Tower Demo                        │
│ 统一查看多个 agent 项目的进展、风险、commit 和下一步 │
├────────────────────────────────────────────────────┤
│ [Total: 6] [Active: 3] [Blocked: 1] [Done: 1]      │
│ [High Risk: 1]                                      │
├────────────────────────────────────────────────────┤
│ [All] [Active] [Blocked] [Done] [Needs Review]     │
│ [High Risk]                                         │
├────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐                  │
│ │ idea-to-demo │ │ medium-archi│ ...              │
│ │ agent: OpenClaw│ agent: Codex │                 │
│ │ status: active│ status: blocked│                │
│ │ ...           │ ...           │                  │
│ └──────────────┘ └──────────────┘                  │
├────────────────────────────────────────────────────┤
│ 数据来源 / 复现方法 / 本 Demo 限制                  │
└────────────────────────────────────────────────────┘
```

---

## 11. Agent 构建任务

| 编号 | 任务 | 输出 |
|------|------|------|
| T-001 | 创建 data.json（6 个项目） | `app/data.json` |
| T-002 | 创建 HTML 结构（header/stats/filters/cards/footer） | `app/index.html` |
| T-003 | 创建 CSS 样式（Notion 风格、移动端可读） | `app/index.html`（内嵌） |
| T-004 | 创建 JS 逻辑（fetch data.json + 渲染卡片） | `app/app.js` |
| T-005 | 实现筛选交互（按 status 和 risk 筛选） | `app/app.js` |
| T-006 | 实现统计卡片（实时计算） | `app/app.js` |
| T-007 | 添加 Demo 限制说明 | `app/index.html` |
| T-008 | 测试本地和 Pages 访问 | - |

---

## 12. 验收标准

- [ ] Demo 页面可打开（任何浏览器直接打开 index.html）
- [ ] 展示 6 个项目卡片
- [ ] 每个卡片显示完整 10 个字段
- [ ] 统计卡片实时计算
- [ ] 6 个筛选按钮可点击并切换显示
- [ ] data.json 合法
- [ ] 移动端可读
- [ ] 标注 "Demo 使用静态模拟数据"

---

## 13. 每日复盘建议

1. **早晨（9:00）：** 检查 Blocked 和 Needs Review 项目，识别需要立即介入的
2. **上午（10:00-12:00）：** 跟踪 Active 项目的进展，关注最近 commit
3. **下午（14:00-17:00）：** 关注 High Risk 项目，推动解决阻塞
4. **晚上（21:00）：** 复盘当日状态变化，更新 next action

---

*Dashboard Brief for Multi-Agent Project Dashboard. Phase: IDB-3.*