# Demo Pack: DIY Lamp Builder

> **方案：** DIY 可定制阅读台灯构建器
> **Demo 场景：** 把"做一个北京风格、可定制外壳、适合桌旁阅读"的台灯想法，转成可交互配置器 + 产品架构 + 制造计划
> **状态：** demo-ready
> **阶段：** IDB-6B

---

## 快速复现

1. 阅读 `inputs/source-idea.md` 中的原始想法
2. 阅读 `inputs/background.md` 中的背景与受控定制参考
3. 查看 `prompts/build-prompt.md` 中的关键 Prompt
4. 查看 `outputs/brief.md` 中 AI 生成的方案 Brief
5. 查看 `outputs/task-plan.md` 中 AI 生成的任务计划
6. 打开 `app/index.html` 体验可交互 Demo
7. 对照 `validation/acceptance-checklist.md` 逐项验收

---

## 这是什么

一个纯静态、单文件家族的 Demo，用来演示 **"想法 → 可定制实体产品 Demo"** 的完整链路：

- **Idea Input** — 输入一句产品想法，4 个示例按钮可一键触发
- **Idea Parser** — 轻量规则解析器，把关键词转成产品决策
- **AI Analyze** — 自动推导产品架构（ReadingCore-01 + 可定制外壳）
- **Configurator** — 选择外壳风格、颜色、刻字，实时预览（4 种外壳明显不同）
- **BOM Cost Model** — 动态成本估算，按 shell / 颜色变化
- **Manufacturing Plan** — 实时输出制造 JSON + 8 步装配流程

整个 Demo 没有任何外部依赖（无 CDN、无 build step、无 Three.js），只用 HTML / CSS / JS，可直接在 GitHub Pages 上打开。

---

## 核心产品架构

```
[Idea Input]
   │
   ▼
[AI Analyze] ──▶ ReadingCore-01（固定灯芯模块）
   │                 - 24V 线性 LED
   │                 - 500–800 lm
   │                 - 35–45 cm 阅读距离
   │                 - M3 dual mount / 铝槽卡扣
   ▼
[Configurator] ─▶ Shell（可定制外壳）
   │                - Style: Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc
   │                - Color: Warm White / Hutong Gray / Palace Red / Night Black
   │                - Engraving: 自由文本
   ▼
[Manufacturing Plan] ─▶ 制造 JSON
                        - LED 贴装 → 铝槽 → 扩散罩 → 外壳装配 → 校验
```

关键原则：

- **ReadingCore-01 是固定的** — 灯芯模块、光电参数、装配接口都不变
- **Shell 是可变的** — 外壳只承担造型与文化表达
- **结构隔离** — LED 灯带不直接贴塑料外壳；先贴铝型材散热件，再加乳白扩散罩，最后装进可定制外壳

---

## 文件结构

```
demos/diy-lamp-builder/
├── README.md
├── inputs/
│   ├── source-idea.md          # 原始想法原文
│   ├── background.md           # 背景与受控定制参考
│   └── transcript.md           # 与 Agent 的需求对话模拟
├── prompts/
│   └── build-prompt.md         # 驱动 Agent 生成 Demo 的 Prompt 模板
├── outputs/
│   ├── brief.md                # AI 生成的方案 Brief
│   ├── task-plan.md            # AI 生成的任务计划
│   ├── generated-demo-notes.md # Demo 构建说明
│   ├── productization-pass.md  # IDB-6B 产品化目标与变化
│   └── bom-model.json          # BOM 成本模型数据结构
├── app/
│   ├── index.html              # 4 区单页应用
│   ├── style.css               # 样式
│   └── app.js                  # 交互与 JSON 输出
└── validation/
    └── acceptance-checklist.md # 验收清单
```

---

## 与其他 Blueprint 的区别

- **项目记忆型会议助手** — 解决"会后怎么推进"
- **客户会议自主循环构建** — 解决"客户需求怎么立刻出原型"
- **多 Agent 项目管理面板** — 解决"多个 agent 怎么观测"
- **手势实时视觉实验室** — 解决"手势怎么驱动视觉"
- **DIY Lamp Builder（这个）** — 解决"实体产品想法怎么变成可定制 Demo"

它跟前四个最大的不同是：**输出可以是一个真实存在的物体**。但 Demo 本身仍然是网页原型，不做真实 CAD、不做采购、不做支付。

---

*Created following the Idea-to-Demo Blueprints format. Phase: IDB-6B.*