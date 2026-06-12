# Demo Pack: 项目记忆型会议纪要生成

> **方案：** 项目记忆型会议助手  
> **Demo 场景：** 基于虚拟项目知识库生成项目级会议纪要  
> **状态：** demo-ready

---

## 快速复现

1. 阅读 `inputs/` 中的项目知识库文件和会议转写
2. 查看 `prompts/` 中的关键 Prompt
3. 查看 `outputs/` 中基于该输入生成的项目级会议纪要
4. 打开 `app/index.html` 查看可视化 Demo

---

## 文件结构

```
demo/
├── README.md
├── inputs/
│   ├── source-idea.md
│   ├── project-overview.md
│   ├── roadmap.md
│   ├── architecture.md
│   ├── phase-report.md
│   └── sample-meeting-transcript.md
├── prompts/
│   └── meeting-brief-prompt.md
├── outputs/
│   ├── generated-project-meeting-brief.md
│   ├── decisions.md
│   ├── action-items.md
│   └── project-state-update.md
├── app/
│   └── index.html
└── validation/
    └── acceptance-checklist.md
```

---

## 复现步骤

1. 准备项目知识库（5 个文档）
2. 准备会议转写文本
3. 使用 Prompt 驱动 AI 生成会议纪要
4. 检查输出是否符合验收标准
5. 人工确认关键决策和负责人
6. 将确认的会议纪要回写知识库

---

## 关键输入

- **项目知识库：** 5 个 Markdown 文档描述 TeamFlow Dashboard 项目
- **会议转写：** 模拟团队会议，包含讨论、决策、行动项

## 关键输出

- **项目级会议纪要：** 10 项结构化输出（摘要、背景、决策、行动项、风险等）
- **决策记录：** 明确记录会议做出的决策
- **行动项：** 具体到负责人和时间的执行清单
- **项目状态变化：** 从会议前的状态到会议后的状态

---

## 验收标准

- [ ] AI 输出包含至少 3 个基于项目知识库的关联
- [ ] 行动项明确到可以执行（含"谁做什么"）
- [ ] 决策记录可以被后续会议引用
- [ ] 输出适合直接发给团队成员阅读
- [ ] 区分"会议明确提到的内容"和"基于知识库推断的内容"
- [ ] 没有编造负责人、时间、数据
- [ ] 不确定的地方标记为"待确认"

---

*Demo Pack for Idea-to-Demo Blueprints. Phase: IDB-2R.*
