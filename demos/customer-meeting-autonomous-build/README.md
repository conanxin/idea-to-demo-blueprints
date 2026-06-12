# Demo Pack: 客户跟进看板原型

> **方案：** 客户会议触发的自主循环构建  
> **Demo 场景：** 基于客户会议需求构建可演示原型  
> **状态：** demo-ready

---

## 快速复现

1. 阅读 `inputs/` 中的客户会议转写和产品背景
2. 查看 `prompts/` 中的关键 Prompt
3. 查看 `outputs/` 中基于该输入生成的 Demo Brief、用户故事、任务计划
4. 打开 `app/index.html` 查看可运行 Demo

---

## 文件结构

```
demo/
├── README.md
├── inputs/
│   ├── source-idea.md
│   ├── product-background.md
│   └── sample-customer-meeting-transcript.md
├── prompts/
│   └── demo-brief-and-build-prompt.md
├── outputs/
│   ├── demo-brief.md
│   ├── user-stories.md
│   ├── agent-task-plan.md
│   └── demo-presentation-script.md
├── app/
│   └── index.html
└── validation/
    └── acceptance-checklist.md
```

---

## 复现步骤

1. 准备客户会议转写文本
2. 准备产品/项目背景文档
3. 使用 Prompt 驱动 AI 生成 Demo Brief
4. 让 Agent 基于 Demo Brief 生成任务计划
5. 让 Agent 构建最小原型（HTML/CSS/JS）
6. 人工检查原型是否符合客户表达
7. 将会议、Brief、Demo 和反馈回写知识库

---

## 关键输入

- **客户会议转写：** 模拟客户描述销售跟进痛点
- **产品背景：** 产品定位、技术约束、限制条件

## 关键输出

- **Demo Brief：** 结构化需求、页面结构、数据模型
- **用户故事：** 基于客户描述的标准用户故事
- **Agent 任务计划：** 可执行的构建任务清单
- **可运行原型：** 客户跟进看板 HTML 页面

---

## 验收标准

- [ ] 能从会议文本中提取客户目标
- [ ] 能识别痛点、约束和隐含需求
- [ ] 能生成清晰用户故事
- [ ] 能生成 Agent 可执行任务
- [ ] 能构建一个可打开的 Demo 页面
- [ ] Demo 能对应客户会议中的真实表达
- [ ] 不确定内容标记为"待确认"
- [ ] 能生成下一轮客户沟通材料
- [ ] 页面能让别人照着复现这个 Demo 流程

---

*Demo Pack for Idea-to-Demo Blueprints. Phase: IDB-2R.*
