# Demo Pack: DIY Lamp Builder

> **方案：** DIY 可定制阅读台灯构建器
> **Demo 场景：** 把"做一个北京风格、可定制外壳、适合桌旁阅读"的台灯想法，转成可交互配置器 + 产品架构 + 制造计划
> **状态：** demo-ready
> **阶段：** IDB-6E

---

## 快速复现

1. 阅读 `inputs/source-idea.md` 中的原始想法
2. 阅读 `inputs/background.md` 中的背景与受控定制参考
3. 查看 `prompts/build-prompt.md` 中的关键 Prompt
4. 查看 `outputs/brief.md` 中 AI 生成的方案 Brief
5. 查看 `outputs/task-plan.md` 中 AI 生成的任务计划
6. 打开 `app/index.html` 体验可交互 Demo
7. 查看 `outputs/cad/` 中的 CAD 示意文件与 `export-notes.md`
8. 查看 `outputs/cad-validation/` 中的打印验证、切片配置与测试件
9. （可选）运行 `scripts/export-openscad-stl.sh` 导出 STL
10. （可选）运行 `scripts/validate-cad-export.py` 做本地 CAD 检查
11. 对照 `validation/acceptance-checklist.md` 逐项验收

---

## 这是什么

一个纯静态、单文件家族的 Demo，用来演示 **"想法 → 可定制实体产品 Demo → 打印前验证"** 的完整链路：

- **Idea Input** — 输入一句产品想法，4 个示例按钮可一键触发
- **Idea Parser** — 轻量规则解析器，把关键词转成产品决策
- **AI Analyze** — 自动推导产品架构（ReadingCore-01 + 可定制外壳）
- **Configurator** — 选择外壳风格、颜色、刻字，实时预览（4 种外壳明显不同）
- **BOM Cost Model** — 动态成本估算，按 shell / 颜色变化
- **Manufacturing Plan** — 实时输出制造 JSON + 8 步装配流程
- **CAD Export** — 生成 OpenSCAD 外壳源码，含 ReadingCore-01 keepout
- **Print Validation** — CAD validation、打印方向、切片配置、fit-test coupon、测量日志

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
   │
   ▼
[CAD Export] ──▶ OpenSCAD shell
   │
   ▼
[Print Validation] ──▶ CAD validation / orientation / slicer / fit-test coupon / measurement log
   │
   ▼
[Physical Prototype Testing] ──▶ lux grid / heat soak / glare review / readiness gate
```

关键原则：

- **ReadingCore-01 是固定的** — 灯芯模块、光电参数、装配接口都不变
- **Shell 是可变的** — 外壳只承担造型与文化表达
- **结构隔离** — LED 灯带不直接贴塑料外壳；先贴铝型材散热件，再加乳白扩散罩，最后装进可定制外壳
- **先打 coupon 再打 shell** — IDB-6D 引入 fit-test coupon 和测量日志，先验证关键尺寸再打印完整外壳

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
│   ├── bom-model.json          # BOM 成本模型数据结构
│   ├── cad/                    # IDB-6C CAD 示意文件与导出说明
│   │   ├── README.md
│   │   ├── readingcore-01-keepout.scad
│   │   ├── sample-hutong-window-shell.scad
│   │   ├── sample-config.json
│   │   └── export-notes.md
│   └── cad-validation/         # IDB-6D 打印验证包
│       ├── README.md
│       ├── cad-validation-rules.json
│       ├── print-orientation-guide.md
│       ├── slicer-profile-prusaslicer.ini
│       ├── slicer-profile-cura.md
│       ├── fit-test-coupon.scad
│       ├── measured-fit-test-log-template.csv
│       ├── measured-fit-test-log-template.md
│       └── validation-report-template.json
├── app/
│   ├── index.html              # 单页应用（含 CAD Export + Print Validation）
│   ├── style.css               # 样式
│   └── app.js                  # 交互与 JSON 输出
├── scripts/
│   ├── export-openscad-stl.sh # 可选 STL 导出脚本
│   ├── validate-cad-export.py # IDB-6D CAD 验证脚本
│   └── export-fit-test-coupon-stl.sh # fit-test coupon STL 导出脚本
└── validation/
    └── acceptance-checklist.md # 验收清单
```

---

## 与其他 Blueprint 的区别

- **项目记忆型会议助手** — 解决"会后怎么推进"
- **客户会议自主循环构建** — 解决"客户需求怎么立刻出原型"
- **多 Agent 项目管理面板** — 解决"多个 agent 怎么观测"
- **手势实时视觉实验室** — 解决"手势怎么驱动视觉"
- **DIY Lamp Builder（这个）** — 解决"实体产品想法怎么变成可定制 Demo + 打印前验证"

它跟前四个最大的不同是：**输出可以是一个真实存在的物体**。在 IDB-6C 中，我们增加了 OpenSCAD 示意文件与可选的 STL 导出脚本；在 IDB-6D 中，进一步增加了 CAD validation、打印方向、切片配置、fit-test coupon 和测量日志；在 IDB-6E 中，进一步增加了 lux grid、heat soak、glare review、physical prototype checklist 和 readiness gate，展示“想法 → 可定制配置 → 可制造几何 → 打样前检查包 → 第一台样机测量”的链路。但 Demo 本身不做真实采购、不做支付、不做真实加工，也不提供工程认证。

|---

## IDB-6E 新增能力

- **Physical Prototype Testing** — Demo 内新增 Physical Prototype Testing 区块，包含 lux grid、heat soak、glare review、prototype checklist、downloads。
- **Lux Test Grid** — 35–45 cm 阅读距离，中心 ≥ 300 lux，阅读区 ≥ 200 lux，5 点网格。
- **Heat Soak Test** — 30 / 60 分钟热稳定观察，5 个测量点，触感通过标准。
- **Glare Review** — 5 项从正常阅读姿势出发的主观检查。
- **Prototype Readiness Checklist** — 4 组检查 + PENDING/READY/ITERATE 决策门。
- **Downloads** — Test Protocol.md、Measurement Log CSV、Readiness Report JSON、Prototype Checklist.md。
- **Physical Testing Pack** — `outputs/physical-testing/` 包含协议、CSV/MD 模板、checklist、report template、risk register、sample report。
- **Validation Scripts** — `scripts/validate-physical-test-pack.py` 检查 pack 完整性；`scripts/evaluate-physical-test-report.py` 读取样例报告并给出简短评估。

## 限制

- IDB-6E 是**第一台物理样机测量工作流**，不是工程合格承诺、不是认证、不是实验室测试。
- 不包含热仿真、电气认证、结构强度计算或最终量产图纸。
- 手机 lux app 仅作为趋势参考，不能替代专业照度计。
- 所有建议尺寸都需要根据实际打印机、耗材、环境和后处理校准。

|---

*Created following the Idea-to-Demo Blueprints format. Phase: IDB-6E.*