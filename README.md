# Idea-to-Demo Blueprints

> **中文名：** 想法到 Demo 方案库
> **定位：** 把一个个想法变成别人可以照着做出 Demo 的方案

---

## 项目定位

这是一个开源方案库，记录"从一个想法出发，整理背景、问题、设计出切实可行的方案，并让其他人基本照着方案就能做出 Demo"的内容。每一个想法/方案都生成一个独立页面，包含完整的可执行蓝图。

## 为什么做这个项目

每个人在工作中都会冒出"如果这样做会怎么样"的想法。但大多数想法停留在脑子里、聊天记录里，或者是一个模糊的文档中，最终没有落地。这不是因为想法不好，而是因为：

- 缺少完整的上下文梳理
- 没有清晰的实施步骤
- 没有可以执行的验证方法
- 没有共享的场景，导致同样的思考被重复

本项目就是解决这个问题：让好的想法变成可执行的 Demo，让其他人可以快速验证、复用、改进。

## 什么是 Blueprint

一个 Blueprint 包含以下要素：

| 要素 | 说明 |
|------|------|
| **原始想法** | 记录这个想法最初是如何产生的，保留原始文本 |
| **背景与问题** | 这个想法要解决什么问题？当前的真实痛点是什么？ |
| **方案概述** | 核心思路，用一两句话讲清楚 |
| **技术架构** | 最小技术栈，描述组件和它们的关系 |
| **实施步骤** | 具体到每一步可以执行的操作 |
| **验收标准** | 怎么判断这个 Demo 做成功了？ |
| **Prompt 模板** | 可以直接复制给 AI Agent 使用的提示词 |
| **后续扩展** | 验证成功后可以往哪些方向继续 |

## 当前已收录方案

### 方案 #1：项目记忆型会议助手

- **英文名：** Project Memory Meeting Assistant
- **类型：** AI Workflow
- **难度：** 中等
- **Demo 周期：** 1-2 天
- **适合对象：** 项目负责人、研发团队、AI Agent 使用者
- **页面：** [`blueprints/project-memory-meeting-assistant.html`](./blueprints/project-memory-meeting-assistant.html)
- **简介：** 基于项目知识库，让 AI 不是简单记录"会上说了什么"，而是回答"这场会对项目意味着什么"。

### 方案 #2：客户会议触发的自主循环构建

- **英文名：** Customer Meeting Triggered Autonomous Build
- **类型：** AI Workflow / Agent Automation / Product Demo
- **难度：** 中高
- **Demo 周期：** 2-3 天
- **适合对象：** 产品经理、售前团队、研发团队、AI Agent 使用者、创业团队
- **页面：** [`blueprints/customer-meeting-autonomous-build.html`](./blueprints/customer-meeting-autonomous-build.html)
- **简介：** 把客户会议中的自然语言需求，实时转化为结构化需求、工作流设计、原型任务，并触发 Agent 构建一个可演示 Demo。

## 如何新增一个方案

### 新增 Blueprint Checklist

新增一个方案至少需要：

1. [ ] 在 `data/blueprints.json` 增加元数据
2. [ ] 在 `public/blueprints/` 增加页面（HTML）
3. [ ] 在 `docs/blueprints/` 增加发布页面（HTML，同步复制）
4. [ ] 在 `docs/` 增加 Markdown 文档
5. [ ] 更新首页卡片（已由 `data/blueprints.json` 驱动，但需确保 JSON 正确）
6. [ ] 本地预览：`cd public && python3 -m http.server 8080`
7. [ ] 检查 GitHub Pages 链接可访问
8. [ ] 提交并 push
9. [ ] 生成阶段报告（可选）

### 快速步骤

1. 复制 `docs/blueprint-template.md` 作为起点
2. 填写所有必填章节，保留原始想法
3. 将 Markdown 方案放入 `docs/<your-blueprint>.md`
4. 生成对应的 HTML 页面放入 `public/blueprints/<your-blueprint>.html`
5. 同步复制到 `docs/blueprints/<your-blueprint>.html`
6. 在 `data/blueprints.json` 中补充数据条目
7. 同步复制到 `public/data/blueprints.json` 和 `docs/data/blueprints.json`
8. 本地预览，检查链接和样式
9. 提交 PR 或直接 push

## 目录结构

```
idea-to-demo-blueprints/
├── README.md                          # 本文件
├── LICENSE                            # MIT License
├── data/
│   └── blueprints.json                # 方案数据（源文件）
├── docs/                              # GitHub Pages 发布目录
│   ├── .nojekyll                      # 禁用 Jekyll 处理
│   ├── blueprint-template.md          # 新增方案模板
│   ├── writing-guide.md               # 写作指南
│   ├── project-memory-meeting-assistant.md
│   ├── customer-meeting-autonomous-build.md
│   ├── data/
│   │   └── blueprints.json            # 方案数据（Pages 副本）
│   ├── index.html                     # 首页（Pages 副本）
│   ├── style.css                      # 样式（Pages 副本）
│   ├── app.js                         # 脚本（Pages 副本）
│   └── blueprints/
│       ├── project-memory-meeting-assistant.html
│       └── customer-meeting-autonomous-build.html
├── public/                            # 静态站源码（本地预览）
│   ├── index.html                     # 首页
│   ├── style.css                      # 全局样式
│   ├── app.js                         # 交互逻辑（支持 JSON 数据驱动）
│   ├── data/
│   │   └── blueprints.json            # 方案数据（本地预览副本）
│   └── blueprints/
│       ├── project-memory-meeting-assistant.html
│       └── customer-meeting-autonomous-build.html
└── reports/                           # 阶段报告
    ├── PHASE_IDB_1_PROJECT_MEMORY_AGENT_REPORT.md
    ├── PHASE_IDB_1A_PAGES_FIX_REPORT.md
    └── PHASE_IDB_2_CUSTOMER_MEETING_AUTONOMOUS_BUILD_REPORT.md
```

**注意：** `docs/` 是 GitHub Pages 发布目录，`public/` 是静态站源码副本。新增方案时需要同步更新两个目录。未来可考虑使用 GitHub Actions 自动化同步。

## 本地预览方式

本项目是纯静态站点，无需构建步骤。

```bash
cd public
# 方式 1：用 Python 启动简单 HTTP 服务器
python3 -m http.server 8080

# 方式 2：用 Node.js 的 http-server
npx http-server -p 8080

# 方式 3：直接用浏览器打开 index.html
open index.html
```

访问 http://localhost:8080 即可预览。

---

## License

MIT License
