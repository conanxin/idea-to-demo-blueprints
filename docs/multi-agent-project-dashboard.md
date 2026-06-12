# 多 Agent 项目管理面板

> **英文名：** Multi-Agent Project Dashboard
> **类型：** AI Workflow / AgentOps / Project Management
> **难度：** 中等
> **Demo 周期：** 2-3 天
> **适合对象：** 项目负责人、AI Agent 使用者、独立开发者、研发团队、多项目管理者
> **标签：** AI Agent, AgentOps, Project Dashboard, Git, Reports, Workflow
> **状态：** 完成
> **创建阶段：** IDB-3

---

## 一句话介绍

把多个 agent、多个机器和多个项目的进展、阶段、报告、commit、风险和下一步动作统一汇总到一个可观察的项目管理面板中。

---

## 原始想法

> 你现在同时使用多个 agent 在不同机器上推进多个项目，需要一个统一项目管理面板，自动汇总每个项目的进展、阶段、报告、commit、风险和下一步动作。

---

## 背景与问题

### 当前场景

使用多个 agent 同时推进项目时，项目状态容易分散在不同机器、不同报告、不同 Telegram 消息、不同 Git commit 中。项目负责人很难快速知道每个项目现在处于哪个阶段。

### 现有痛点

- **痛点 1：任务完成、失败、阻塞、风险和下一步动作容易被埋在长报告里** — 长报告缺乏结构化展示，关键信息淹没在文字中
- **痛点 2：多 Agent 项目管理面板的可读性缺失** — 多项目并行时，最大问题不是 agent 不会做事，而是人类缺少一个统一观察层
- **痛点 3：分散在 Telegram / report / commit 中的状态难以汇总** — 每次要看状态都要打开多个工具翻找
- **痛点 4：多机器部署的项目状态难以追踪** — 本地 agent 和云端 agent 状态分布在不同位置
- **痛点 5：缺少项目优先级判断依据** — 不知道哪个项目最紧急、哪个项目可以稍后处理
- **痛点 6：缺少项目复盘数据** — 历史状态没有沉淀，无法回顾项目演化

### 为什么需要解决

需要一个轻量级面板，把 agent 输出转成可视化、可追踪、可复盘的项目状态。

---

## 为什么这个想法重要

普通 agent 工作流回答："这个任务完成了吗？"

多 Agent 项目管理面板回答："所有项目现在分别处于什么状态，哪个项目需要我介入，哪个项目可以继续自动推进？"

**核心价值：**

- 降低多项目管理成本
- 减少 Telegram / report / commit 来回翻找
- 形成 agent 工作的可观察层
- 帮助项目负责人快速判断优先级
- 为未来自动调度 agent 打基础

---

## 目标用户与使用场景

### 目标用户

- 同时运行多个 agent 的个人开发者
- 管理多个 AI 项目的项目负责人
- 多机器部署 OpenClaw / Hermes / Codex / Claude Code 的用户
- 小团队研发负责人
- AI Workflow 实验者
- 需要统一查看项目进度的人

### 使用场景

- 本地 agent 和云端 agent 同时运行
- 多个 GitHub 项目并行推进
- 每个项目都有阶段报告和 commit
- 每天需要快速查看所有项目状态
- 需要知道哪个项目 blocked、哪个项目 ready、哪个项目需要人工确认
- 需要把阶段报告沉淀成统一项目状态数据

---

## 方案概述

核心流程：

```
Agent 执行报告 → Git commit → 阶段报告 → 风险记录
→ 状态标准化 → dashboard data.json → 静态面板
→ 人工确认 → 下一步调度建议 → 状态快照归档
```

这个方案不是要取代 agent，而是建立一个统一的可观察层，让分散在报告、commit、消息和机器里的状态，整理成可读、可判断、可复盘的项目视图。

---

## Demo 最终效果

本 Demo 是一个真实可交互的静态 HTML Dashboard：

- 顶部标题 + 总体说明
- 5 个统计卡片（Total / Active / Blocked / Done / High Risk）
- 6 个筛选按钮（All / Active / Blocked / Done / Needs Review / High Risk）
- 6 个项目卡片，每个显示 10 个字段（name / agent / machine / phase / status / risk / latest commit / latest report / blocker / next action）
- 底部说明（数据来源、复现方法、限制、后续扩展）

---

## Demo 在线地址

**Demo URL：** https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/

---

## Demo 文件结构

```
demos/multi-agent-project-dashboard/
├── README.md
├── inputs/
│   ├── source-idea.md
│   ├── background.md
│   ├── sample-agent-status-reports.md    # 6 个模拟项目状态
│   ├── sample-git-commits.md             # 模拟 commit 数据
│   └── sample-project-risk-notes.md      # 风险记录
├── prompts/
│   └── dashboard-build-prompt.md         # 关键 Prompt
├── outputs/
│   ├── dashboard-brief.md                # Dashboard Brief
│   ├── data-model.md                     # JSON 数据结构
│   ├── agent-task-plan.md                # 任务计划
│   └── demo-notes.md                     # Demo 取舍和限制
├── app/
│   ├── index.html                        # 可运行 Demo 页面
│   ├── app.js                            # 交互逻辑
│   └── data.json                         # 6 个项目的标准化 JSON
└── validation/
    └── acceptance-checklist.md           # 验收清单
```

---

## 最小可行 Demo 范围

MVP 只需要静态数据，不需要后端。

### 输入

1. 模拟 agent 状态报告（6 个项目）
2. 模拟 git commit 列表
3. 模拟风险记录
4. 一个 dashboard build prompt
5. 一个静态 JSON 数据文件

### 输出

1. 多项目总览（统计卡片）
2. 项目卡片（6 个）
3. Agent 来源（每张卡片显示）
4. 当前阶段（每张卡片显示）
5. 最近 commit（每张卡片显示）
6. 最近报告（每张卡片显示）
7. 风险等级（每张卡片显示）
8. 阻塞事项（每张卡片显示）
9. 下一步动作（每张卡片显示）
10. 可筛选的静态管理面板（6 个筛选按钮）

---

## 技术架构

### 最小技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 数据采集层 | Agent 报告 + Telegram + Git commit + 阶段报告 | 多源数据采集 |
| 数据标准化层 | JSON 数据结构 | 把不同来源整理成统一 JSON |
| 项目状态模型 | meta + projects 结构 | 单一数据源 |
| 展示层 | HTML + CSS + 原生 JS | 静态 Dashboard |
| 人工确认层 | 手动审查 + 筛选交互 | 项目负责人确认 blocked / ready / needs-review |
| 沉淀层 | 静态 JSON 文件 | 把状态数据保存为快照 |
| 后续扩展层 | GitHub API / report parser / Telegram bot | 未来可扩展 |

### 架构图

```
┌────────────────────────────────────────────────────────┐
│              数据采集层                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Agent    │  │ Git      │  │ 阶段     │  │ 风险    │ │
│  │ 报告     │  │ commit   │  │ 报告     │  │ 记录    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└────────────────────────┬───────────────────────────────┘
                         │ 标准化
                         ▼
┌────────────────────────────────────────────────────────┐
│              数据标准化层                                │
│                                                         │
│  输出：统一 JSON 结构（meta + projects）                 │
│                                                         │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│              展示层                                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 统计卡片  │  │ 筛选按钮  │  │ 项目卡片  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                         │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│              人工确认层                                  │
│                                                         │
│  - 项目负责人审查项目状态                                │
│  - 确认 blocked / ready / needs-review                  │
│  - 决定是否介入或继续自动推进                            │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 数据流 / 工作流

```
Agent 执行报告
→ Git commit
→ 阶段报告
→ 风险记录
→ 状态标准化
→ dashboard data.json
→ 静态面板
→ 人工确认
→ 下一步调度建议
→ 状态快照归档
```

---

## 页面或系统设计

### Demo 页面结构

| 区域 | 内容 | 说明 |
|------|------|------|
| 顶部标题 | AgentOps Control Tower Demo | 标识这是一个 Demo |
| Demo 限制说明 | 显著位置标注静态数据 | 避免误用 |
| 统计卡片 | 5 个统计卡片 | 实时计算 |
| 筛选按钮 | 6 个筛选按钮 | 按状态或风险筛选 |
| 项目卡片 | 6 个项目卡片 | 完整字段展示 |
| 数据来源说明 | 模拟数据来源 | 增加透明度 |
| 复现方法 | 9 步复现 | 降低复现门槛 |
| 本 Demo 限制 | 5 个限制 | 明确边界 |
| 后续扩展 | 7 个方向 | 展望未来 |

### 关键界面元素

- **统计卡片：** 5 个，每个有大数字 + 标签
- **状态标签：** 颜色编码（绿/红/紫/黄/灰）
- **风险标签：** 颜色编码（绿/黄/红）
- **Commit 显示：** 短哈希（7 位）+ message
- **阻塞事项：** 红底高亮
- **下一步动作：** 蓝底高亮

---

## 实施步骤

### 步骤 1：收集多个 agent 项目的阶段报告

- [ ] 从各项目 reports/ 目录收集 PHASE_*.md 报告
- [ ] 提取项目名、agent、机器、阶段、状态、commit、风险、下一步

### 步骤 2：提取关键信息

- [ ] 设计统一提取模板
- [ ] 编写提取脚本或人工提取

### 步骤 3：设计统一 JSON 数据结构

- [ ] 定义 meta 字段
- [ ] 定义 projects 字段
- [ ] 定义状态和风险枚举

### 步骤 4：编写 Dashboard Build Prompt

- [ ] 定义输入格式
- [ ] 定义输出要求
- [ ] 区分 agent 报告和 AI 推断

### 步骤 5：生成 data.json

- [ ] 准备 5+ 项目数据
- [ ] 验证 JSON 合法

### 步骤 6：构建静态 HTML Dashboard

- [ ] HTML 结构（5 个区域）
- [ ] CSS 样式（Notion 风格）
- [ ] JS 交互（fetch + render + filter）

### 步骤 7：增加筛选交互

- [ ] 6 个筛选按钮
- [ ] 点击切换显示

### 步骤 8：人工确认项目状态

- [ ] 项目负责人审查
- [ ] 确认或修正状态

### 步骤 9：发布到 GitHub Pages

- [ ] 同步到 docs/
- [ ] push 到 main
- [ ] 等待 Pages 构建

### 步骤 10：写回仓库

- [ ] 更新 README 和数据文件
- [ ] 生成阶段报告

---

## 构建过程记录

### 为什么选择静态 Demo

- 部署最简单（无需后端）
- 任何浏览器可直接打开 index.html
- 适合 GitHub Pages 部署
- 便于演示和分享
- 维护成本低

### 为什么使用模拟数据

- 不依赖真实 API 权限
- 不依赖真实项目状态（避免泄漏隐私）
- 演示效果稳定
- 易于扩展到真实数据

### 数据字段如何设计

参见 `outputs/data-model.md`。核心思想：
- 单一数据源：meta 自动从 projects 计算
- 可读优先：字段名清晰，无需查阅文档即可理解
- 可扩展：新增字段不影响现有字段
- 人工可确认：所有状态字段都对应人工判断

### 面板布局如何设计

- 顶部标题 + Demo 限制说明
- 统计卡片（5 个，自动计算）
- 筛选按钮（6 个，覆盖所有状态）
- 项目卡片网格（auto-fill，每张卡片显示 10 个字段）
- 底部说明（数据来源、复现、限制、扩展）

### 筛选功能如何实现

- 使用纯 JS + DOM 操作
- 不引入框架
- 点击筛选按钮 → 切换 currentFilter → 重新渲染
- 支持组合筛选（status + risk）

### 哪些部分是本阶段不做的

- 真实 GitHub API 集成
- 报告自动解析
- 历史快照
- Telegram bot 接入
- 自动调度建议
- 趋势分析图

### 如何从 Demo 演进到真实系统

1. **第二阶段（半自动）：** 数据采集脚本 + 手动触发更新
2. **第三阶段（自动）：** GitHub API + 报告解析 + 定时刷新
3. **第四阶段（智能）：** 历史快照 + 趋势分析 + 调度建议
4. **第五阶段（生态）：** Telegram bot + 自动派单 + 跨平台集成

---

## 关键 Prompt

参见 `prompts/dashboard-build-prompt.md`。Prompt 要求 AI 输出：

1. 项目状态摘要
2. 每个项目的当前阶段
3. 每个项目的状态
4. 最近 commit
5. 最近报告路径
6. 风险等级
7. 阻塞事项
8. 下一步动作
9. 统一 JSON 数据结构
10. Dashboard 页面结构
11. Agent 构建任务
12. 验收标准
13. 每日复盘建议

**要求：**
- 不要编造不存在的 commit
- 不要编造不存在的报告
- 不确定内容标记为"待确认"
- 区分 agent 明确报告和 AI 推断
- 输出适合交给 Agent 继续构建
- 项目状态必须可人工确认

---

## Agent 执行步骤

1. 收集所有项目的 agent 报告、commit 数据、风险记录
2. 使用 Prompt 让 AI 生成 Dashboard Brief
3. 验证生成的 JSON 数据合法
4. 构建静态 HTML Dashboard
5. 实现筛选交互
6. 标注 Demo 限制
7. 测试本地打开和 GitHub Pages

---

## 人工确认点

- [ ] 项目是否真的完成
- [ ] commit 是否已 push
- [ ] Pages 或 Demo 是否可访问
- [ ] blocked 是否真实存在
- [ ] 下一步动作是否需要人类决策
- [ ] 风险等级是否合理
- [ ] 项目是否可以继续自动推进

---

## 遇到的问题与修复

本 Demo 使用静态模拟数据，因此没有真实 API 权限问题。

真实系统会遇到报告格式不统一、commit 解析不稳定、agent 状态不一致等问题。

在 Dashboard 设计中通过以下方式缓解：
- **字段标准化：** 严格定义 JSON 数据结构
- **关键字段突出：** status / risk / blocker / next action 单独高亮
- **筛选功能：** 帮助快速定位需要关注的项目
- **Demo 限制说明：** 明确标注静态数据，避免误用

---

## 验收标准

参见 `validation/acceptance-checklist.md`。

**核心标准：**
- [ ] Demo 页面可打开
- [ ] 展示不少于 5 个项目
- [ ] 每个项目都有完整字段
- [ ] 6 个筛选按钮可工作
- [ ] JSON 数据合法
- [ ] 方案页包含 Demo 地址、构建过程和复现步骤
- [ ] Demo Pack 完整
- [ ] 首页展示第三组 Blueprint
- [ ] GitHub Pages 三个方案页和 Demo 页均返回 HTTP 200
- [ ] 页面不包含真实 token、secret、私密路径

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

## 后续扩展方向

1. 接入真实 GitHub API
2. 自动解析 reports 目录
3. 接入 Telegram bot 状态消息
4. 增加历史状态快照
5. 增加项目趋势图
6. 增加 agent 调度建议
7. 增加风险自动归因
8. 增加每日自动项目摘要
9. 增加"需要我介入"的队列
10. 与项目记忆型会议助手联动

---

## 本方案沉淀出的通用方法

多 Agent 管理的关键不是让每个 agent 单独更强，而是建立一个统一的可观察层，把分散在报告、commit、消息和机器里的状态整理成可读、可判断、可复盘的项目视图。

---

## 参考资源

- [OpenClaw](https://github.com/openclaw/openclaw) — 本地 AI Agent 框架
- [Hermes Agent](https://github.com/openclaw/hermes) — AI 助手
- [Codex](https://openai.com/blog/openai-codex) — OpenAI 编码助手
- [Claude Code](https://claude.ai/code) — Anthropic 编码助手
- [GitHub API](https://docs.github.com/rest) — 项目状态数据源

---

*Created following the [Idea-to-Demo Blueprints](https://github.com/conanxin/idea-to-demo-blueprints) format. Phase: IDB-3.*