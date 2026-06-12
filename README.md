# Idea-to-Demo Blueprints

> **中文名：** 想法到 Demo 方案库  
> **状态：** v0.1.0-alpha  
> **类型：** 可复现 Demo 蓝图库  
> **License:** MIT

[Demo Pages](https://conanxin.github.io/idea-to-demo-blueprints/) · [GitHub Repo](https://github.com/conanxin/idea-to-demo-blueprints) · [Roadmap](./docs/ROADMAP.md) · [Contributing](./docs/CONTRIBUTING.md) · [Changelog](./docs/CHANGELOG.md)

---

## What is this?

**Idea-to-Demo Blueprints** 是一个开源的可复现 Demo 蓝图库。

每个 Blueprint 不只是记录一个想法和方案，而是包含：

- 一个真实做出来的最小可运行 Demo
- 完整的构建过程记录
- 关键 Prompt 模板
- 标准化的 Demo Pack（inputs / prompts / outputs / app / validation）
- 验收清单和复现步骤

**让其他人可以根据记录复现同类 Demo。**

---

## Why this exists

大多数"AI Demo"项目停留在截图、视频或描述层面。本项目回答一个核心问题：

> 别人看到你的 Demo 后，能不能真正照着做出类似的 Demo？

答案是：**只有把构建过程、关键 Prompt、文件结构、验收标准全部公开，才能说"可复现"。**

所以这个项目坚持一条原则：

> **没有 Demo Pack 的方案只能算草稿；有完整 Demo Pack、可打开 Demo 页面和验收记录，才算完整 Blueprint。**

---

## What makes a Blueprint complete?

一个完整的 Blueprint 必须包含：

| 要素 | 说明 |
|------|------|
| **原始想法** | 想法最初是如何产生的，保留原始文本 |
| **背景与问题** | 解决什么问题、当前痛点是什么 |
| **方案概述** | 一两句话讲清楚做什么 |
| **技术架构** | 最小技术栈和组件关系 |
| **实施步骤** | 每一步可以执行的操作 |
| **Demo Pack** | 真实 Demo + 构建过程（详见下方） |
| **验收标准** | 怎么判断 Demo 做成功了 |
| **Prompt 模板** | 可直接复制的 AI Agent 提示词 |
| **复现步骤** | 别人照着复现的具体步骤 |

---

## Demo Pack standard

每个 Blueprint 必须包含标准化目录：

```
demos/<slug>/
├── README.md                    # 复现说明
├── inputs/                      # 输入材料
│   ├── source-idea.md           # 原始想法
│   ├── background.md            # 背景材料
│   └── transcript.md            # 会议转写或需求文本
├── prompts/                     # 关键 Prompt
│   └── build-prompt.md
├── outputs/                     # Agent 生成结果
│   ├── brief.md                 # 结构化 Brief
│   ├── task-plan.md             # 任务计划
│   └── generated-demo-notes.md
├── app/                         # 可运行的最小 Demo
│   └── index.html
└── validation/                  # 验收清单
    └── acceptance-checklist.md
```

**状态规则：**
- `draft` — 只有方案文档，没有 Demo Pack
- `demo-ready` — 有完整 Demo Pack + 可打开 Demo 页面 + 验收记录

---

## Current demo-ready Blueprints

| # | Blueprint | Demo | Status | What it proves |
|---|-----------|------|--------|----------------|
| 1 | [项目记忆型会议助手](./blueprints/project-memory-meeting-assistant.html) | [TeamFlow Dashboard 会议纪要](./demos/project-memory-meeting-assistant/) | `demo-ready` ✅ | AI 基于项目知识库可以回答"这场会对项目意味着什么" |
| 2 | [客户会议触发的自主循环构建](./blueprints/customer-meeting-autonomous-build.html) | [客户跟进看板原型](./demos/customer-meeting-autonomous-build/) | `demo-ready` ✅ | 客户会议中的自然语言可以实时转化为可演示 Demo |
| 3 | [多 Agent 项目管理面板](./blueprints/multi-agent-project-dashboard.html) | [AgentOps Control Tower](./demos/multi-agent-project-dashboard/) | `demo-ready` ✅ | 多 Agent 项目状态可以统一汇总到可观察面板 |

**三个 Demo 全部可在线访问。**

---

## How to read a Blueprint

每个 Blueprint 页面包含完整章节：

1. 方案概览 — 一句话介绍
2. 原始想法 — 完整保留原始文本
3. 背景与问题 — 痛点和场景
4. 目标用户 — 谁会用、什么时候用
5. **Demo 最终效果** — 在线可访问的 Demo
6. **Demo 文件结构** — 完整目录树
7. **构建过程记录** — 怎么做的
8. **关键 Prompt** — 可以直接复制的 AI 提示词
9. 验收标准 — 怎么判断做成功了
10. **复现步骤** — 别人怎么照着做

**建议阅读顺序：** 先看 Demo → 再看构建过程 → 最后看 Prompt

---

## How to reproduce a Demo

最快的方式是直接打开对应的 Demo 页面（URL 见上表）。

如果你想用自己的项目材料重新跑一遍：

1. 准备你自己的 inputs/（想法、背景、会议转写或需求文本）
2. 复制 `prompts/build-prompt.md`
3. 把你的 inputs 填入 Prompt，运行 AI 生成 outputs
4. 让 AI 基于 outputs 构建 app/index.html
5. 对照 `validation/acceptance-checklist.md` 验收

详细步骤见每个 Blueprint 的 README.md 和 docs/writing-guide.md。

---

## How to add a new Blueprint

### 新增 Blueprint Checklist

1. [ ] 复制 `docs/blueprint-template.md` 作为起点
2. [ ] 填写所有必填章节，保留原始想法
3. [ ] 创建 Demo Pack（`demos/<slug>/` 完整目录结构）
4. [ ] 在 `data/blueprints.json` 增加元数据（含 `demo_url` 和 `status: demo-ready`）
5. [ ] 同步复制到 `public/data/blueprints.json` 和 `docs/data/blueprints.json`
6. [ ] 生成方案页 HTML 放入 `public/blueprints/` 和 `docs/blueprints/`
7. [ ] 同步 Demo app 到 `public/demos/` 和 `docs/demos/`
8. [ ] 本地预览：`cd public && python3 -m http.server 8080`
9. [ ] 检查 GitHub Pages 链接可访问
10. [ ] 提交并 push
11. [ ] 生成阶段报告

详细说明见 [docs/writing-guide.md](./docs/writing-guide.md)。

---

## Project structure

```
idea-to-demo-blueprints/
├── README.md                          # 本文件
├── CHANGELOG.md                       # 版本变更日志
├── LICENSE                            # MIT
├── SYNC_VERIFICATION.md               # IDB-3A 数据同步验证
├── data/
│   └── blueprints.json                # 方案元数据（源）
├── docs/                              # GitHub Pages 发布目录
│   ├── .nojekyll
│   ├── ROADMAP.md
│   ├── CONTRIBUTING.md
│   ├── RELEASE_NOTES.md
│   ├── media/                         # 截图（待补充）
│   ├── blueprint-template.md
│   ├── writing-guide.md
│   ├── data/blueprints.json
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── blueprints/
│   │   ├── project-memory-meeting-assistant.html
│   │   ├── customer-meeting-autonomous-build.html
│   │   └── multi-agent-project-dashboard.html
│   ├── demos/
│   │   ├── project-memory-meeting-assistant/
│   │   ├── customer-meeting-autonomous-build/
│   │   └── multi-agent-project-dashboard/
│   └── [3 个方案的 Markdown 文档]
├── public/                            # 静态站源码副本
│   └── [与 docs/ 镜像对应]
├── demos/                             # Demo Pack 源文件
│   ├── project-memory-meeting-assistant/
│   ├── customer-meeting-autonomous-build/
│   └── multi-agent-project-dashboard/
└── reports/                           # 阶段报告
```

---

## GitHub Pages

- **Pages 源：** `main` 分支 `/docs` 目录
- **首页：** https://conanxin.github.io/idea-to-demo-blueprints/
- **本地预览：** `cd public && python3 -m http.server 8080`

每次 push 后 Pages 需要 1-2 分钟重新构建。

---

## Roadmap

见 [docs/ROADMAP.md](./docs/ROADMAP.md)。

---

## Contributing

见 [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)。

---

## Changelog

见 [docs/CHANGELOG.md](./docs/CHANGELOG.md)。

---

## License

MIT License