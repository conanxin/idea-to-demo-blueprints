# Demo Pack: AgentOps Control Tower

> **方案：** 多 Agent 项目管理面板  
> **Demo 场景：** 统一查看多个 agent 项目的状态、风险、commit 和下一步  
> **状态：** demo-ready

---

## 快速复现

1. 阅读 `inputs/` 中的模拟数据
2. 查看 `prompts/` 中的关键 Prompt
3. 查看 `outputs/` 中的生成结果
4. 打开 `app/index.html` 查看可交互 Dashboard

---

## 文件结构

```
demo/
├── README.md
├── inputs/
│   ├── source-idea.md
│   ├── background.md
│   ├── sample-agent-status-reports.md
│   ├── sample-git-commits.md
│   └── sample-project-risk-notes.md
├── prompts/
│   └── dashboard-build-prompt.md
├── outputs/
│   ├── dashboard-brief.md
│   ├── data-model.md
│   ├── agent-task-plan.md
│   └── demo-notes.md
├── app/
│   ├── index.html
│   ├── app.js
│   └── data.json
└── validation/
    └── acceptance-checklist.md
```

---

## 复现步骤

1. 准备多个项目阶段报告
2. 准备 commit 摘要
3. 准备风险记录
4. 使用 Prompt 生成 dashboard brief
5. 生成统一 JSON
6. 复制 Demo app
7. 替换 data.json
8. 本地打开 index.html
9. 发布到 GitHub Pages
10. 根据验收清单检查

---

## 关键输入

- **6 个模拟项目：** idea-to-demo-blueprints, medium-archive-astro, conan-vps-control-tower, claimlens, artvee-library, booktrans-desk
- **Commit 数据：** 模拟每个项目的最近 commit
- **风险记录：** 通用风险 + 项目特定风险

## 关键输出

- **统一 JSON 数据：** 标准化项目状态、commit、风险等
- **Dashboard 页面：** 5 个统计卡片 + 6 个筛选按钮 + 6 个项目卡片
- **可读字段：** agent / machine / phase / status / risk / commit / blocker / next action

---

## 验收标准

- [ ] Demo 页面可打开
- [ ] 展示 6 个项目
- [ ] 每个项目都有完整字段
- [ ] 6 个筛选按钮可工作
- [ ] JSON 合法
- [ ] 移动端可读

---

*Demo Pack for Idea-to-Demo Blueprints. Phase: IDB-3.*