# 可复现 Demo 蓝图库

> **中文名：** 想法到 Demo 方案库
> **定位：** 把想法变成真实 Demo，并把 Demo 的制作过程变成别人可以复现的路线图

---

## 项目目标

**这不是灵感收藏夹，而是可复现 Demo 蓝图库。**

每个 Blueprint 不只记录一个想法和方案，还必须包含：
- 一个真实做出来的最小 Demo
- 完整构建过程
- 关键 Prompt
- 文件结构
- 验收标准
- 复现步骤

**让其他人可以根据记录复现同类 Demo。**

## 为什么只写方案还不够

方案文档回答"做什么"，但缺少：
- "做出来是什么样" — 没有 Demo，无法验证可行性
- "怎么做的" — 没有构建过程，别人无法复现
- "用了什么 Prompt" — 没有 Prompt，别人无法驱动 Agent
- "怎么判断成功了" — 没有验收标准，不知道何时完成

本项目解决这些问题：每个 Blueprint 都包含真实 Demo + 完整过程 + 复现指南。

## 什么是可复现 Demo Blueprint

一个 Blueprint 包含：

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
| **Demo Pack** | 真实 Demo + 构建过程 + 复现指南（详见下方） |

## 什么是 Demo Pack

每个 Blueprint 必须包含 Demo Pack：

```
demo/
├── README.md              # 复现说明
├── inputs/                # 原始想法、背景材料、会议转写
├── prompts/               # 关键 Prompt
├── outputs/               # Brief、任务计划、生成说明
├── app/                   # 可运行的最小 Demo
└── validation/            # 验收清单
```

**规则：** 没有 Demo Pack 的方案只能算草稿（draft）；有完整 Demo Pack、可打开 Demo 页面和验收记录，才算完整 Blueprint（demo-ready）。

## 当前 demo-ready 方案

### 方案 #1：项目记忆型会议助手

- **英文名：** Project Memory Meeting Assistant
- **类型：** AI Workflow
- **难度：** 中等
- **Demo 周期：** 1-2 天
- **状态：** demo-ready ✅
- **适合对象：** 项目负责人、研发团队、AI Agent 使用者
- **方案页：** [blueprints/project-memory-meeting-assistant.html](https://conanxin.github.io/idea-to-demo-blueprints/blueprints/project-memory-meeting-assistant.html)
- **Demo：** [demos/project-memory-meeting-assistant/](https://conanxin.github.io/idea-to-demo-blueprints/demos/project-memory-meeting-assistant/)
- **简介：** 基于项目知识库，让 AI 不是简单记录"会上说了什么"，而是回答"这场会对项目意味着什么"。Demo 包含虚拟项目知识库（5个文档）+ 模拟会议转写 + 生成的项目级会议纪要。

### 方案 #2：客户会议触发的自主循环构建

- **英文名：** Customer Meeting Triggered Autonomous Build
- **类型：** AI Workflow / Agent Automation / Product Demo
- **难度：** 中高
- **Demo 周期：** 2-3 天
- **状态：** demo-ready ✅
- **适合对象：** 产品经理、售前团队、研发团队、AI Agent 使用者、创业团队
- **方案页：** [blueprints/customer-meeting-autonomous-build.html](https://conanxin.github.io/idea-to-demo-blueprints/blueprints/customer-meeting-autonomous-build.html)
- **Demo：** [demos/customer-meeting-autonomous-build/](https://conanxin.github.io/idea-to-demo-blueprints/demos/customer-meeting-autonomous-build/)
- **简介：** 把客户会议中的自然语言需求，实时转化为结构化需求、工作流设计、原型任务，并触发 Agent 构建一个可演示 Demo。Demo 包含客户跟进看板原型（可运行 HTML 页面）。

## 如何新增一个 Blueprint

### 新增 Blueprint Checklist

新增一个方案至少需要：

1. [ ] 在 `data/blueprints.json` 增加元数据（含 `demo_url` 和 `demo_pack_path`）
2. [ ] 在 `public/blueprints/` 增加方案页面（HTML）
3. [ ] 在 `docs/blueprints/` 增加发布页面（HTML，同步复制）
4. [ ] 在 `docs/` 增加 Markdown 文档
5. [ ] **创建 Demo Pack**（`demos/<slug>/` 目录）：
   - `inputs/` — 原始想法、背景材料、会议转写或需求文本
   - `prompts/` — 驱动 Agent 的关键 Prompt
   - `outputs/` — Agent 生成的 brief、任务计划、说明
   - `app/` — 可运行的最小 Demo（HTML/CSS/JS 或其他）
   - `validation/` — 验收清单
   - `README.md` — 复现说明
6. [ ] 同步 Demo app 到 `docs/demos/<slug>/index.html`
7. [ ] 更新首页卡片（已由 `data/blueprints.json` 驱动，但需确保 JSON 正确）
8. [ ] 本地预览：`cd public && python3 -m http.server 8080`
9. [ ] 检查 GitHub Pages 链接可访问（首页 + 方案页 + Demo 页）
10. [ ] 提交并 push
11. [ ] 生成阶段报告（可选）

### 快速步骤

1. 复制 `docs/blueprint-template.md` 作为起点
2. 填写所有必填章节，保留原始想法，构建最小 Demo
3. 创建 Demo Pack（`demos/<slug>/` 目录结构）
4. 将 Markdown 方案放入 `docs/<slug>.md`
5. 生成对应的 HTML 页面放入 `public/blueprints/<slug>.html`
6. 同步复制到 `docs/blueprints/<slug>.html`
7. 同步 Demo app 到 `docs/demos/<slug>/index.html`
8. 在 `data/blueprints.json` 中补充数据条目（含 `demo_url` 和 `status: demo-ready`）
9. 同步复制到 `public/data/blueprints.json` 和 `docs/data/blueprints.json`
10. 本地预览，检查链接和样式
11. 提交 PR 或直接 push

## 复现一个 Demo

1. 进入 `demos/<slug>/` 目录
2. 阅读 `README.md` 了解复现步骤
3. 查看 `inputs/` 中的输入材料
4. 查看 `prompts/` 中的关键 Prompt
5. 查看 `outputs/` 中的生成结果
6. 打开 `app/index.html` 查看可运行 Demo
7. 对照 `validation/acceptance-checklist.md` 验证结果

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
│   ├── data/
│   │   └── blueprints.json            # 方案数据（Pages 副本）
│   ├── index.html                     # 首页（Pages 副本）
│   ├── style.css                      # 样式（Pages 副本）
│   ├── app.js                         # 脚本（Pages 副本）
│   ├── blueprints/
│   │   ├── project-memory-meeting-assistant.html
│   │   └── customer-meeting-autonomous-build.html
│   └── demos/
│       ├── project-memory-meeting-assistant/
│       │   └── index.html             # Demo 页面（Pages 副本）
│       └── customer-meeting-autonomous-build/
│           └── index.html             # Demo 页面（Pages 副本）
├── public/                            # 静态站源码（本地预览）
│   ├── index.html                     # 首页
│   ├── style.css                      # 全局样式
│   ├── app.js                         # 交互逻辑（支持 JSON 数据驱动）
│   ├── data/
│   │   └── blueprints.json            # 方案数据（本地预览副本）
│   ├── blueprints/
│   │   ├── project-memory-meeting-assistant.html
│   │   └── customer-meeting-autonomous-build.html
│   └── demos/                         # Demo 页面（本地预览）
│       ├── project-memory-meeting-assistant/
│       │   └── index.html
│       └── customer-meeting-autonomous-build/
│           └── index.html
├── demos/                             # Demo Pack（源文件）
│   ├── project-memory-meeting-assistant/
│   │   ├── README.md
│   │   ├── inputs/
│   │   ├── prompts/
│   │   ├── outputs/
│   │   ├── app/
│   │   │   └── index.html
│   │   └── validation/
│   └── customer-meeting-autonomous-build/
│       ├── README.md
│       ├── inputs/
│       ├── prompts/
│       ├── outputs/
│       ├── app/
│       │   └── index.html
│       └── validation/
└── reports/                           # 阶段报告
    ├── PHASE_IDB_1_PROJECT_MEMORY_AGENT_REPORT.md
    ├── PHASE_IDB_1A_PAGES_FIX_REPORT.md
    ├── PHASE_IDB_2_CUSTOMER_MEETING_AUTONOMOUS_BUILD_REPORT.md
    └── PHASE_IDB_2R_REPRODUCIBLE_DEMO_PACK_SYSTEM_REPORT.md
```

**注意：** `docs/` 是 GitHub Pages 发布目录，`public/` 是静态站源码副本，`demos/` 是 Demo Pack 源文件。新增方案时需要同步更新三个目录。

## GitHub Pages 发布说明

- **Pages 源：** `main` 分支 `/docs` 目录
- **首页：** https://conanxin.github.io/idea-to-demo-blueprints/
- **方案页：** https://conanxin.github.io/idea-to-demo-blueprints/blueprints/
- **Demo 页：** https://conanxin.github.io/idea-to-demo-blueprints/demos/

每次 push 后，Pages 需要 1-2 分钟重新构建。

## 本地预览方式

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
