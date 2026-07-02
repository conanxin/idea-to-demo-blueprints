# DIY 可定制阅读台灯构建器

- **英文名：** DIY Lamp Builder
- **类型：** Physical Product / AI Workflow / Configurator
- **难度：** 中等
- **Demo 周期：** 1-2 天
- **适合对象：** 独立开发者 / 产品经理 / 文创产品设计师 / AI Agent 使用者 / 硬件原型爱好者
- **标签：** AI、实体产品、灯具、配置器、3D Demo、Manufacturing Plan
- **状态：** demo-ready
- **创建阶段：** IDB-6

---

## 一句话介绍

把"一个实体产品想法"在 5 分钟内转成"可演示的受控定制产品 Demo"——固定内核 ReadingCore-01 + 可换外壳 Shell，让独立开发者和文创团队能低成本验证产品可行性。

---

## 原始想法

> 这一段是用户在聊天里说出来的原始想法，未经润色。

我想要做一个"北京风格"的阅读台灯：

- 适合放在书桌旁边，晚上看书用
- 外壳可以是**可定制**的，比如不同的风格、颜色、纹样、刻字
- 但**灯芯**我想做成一个固定的、稳定的模块：24V 线性 LED，足够亮但不能刺眼
- 我希望这个灯**不要像网红灯具那样把灯带直接贴在塑料外壳上** —— 那样散热很差，时间长了塑料会发黄
- 我想要的真正结构是：LED 灯带先贴到铝型材/铝槽上，前面再加一片乳白扩散罩，再整体装进那个可定制外壳
- 外壳**只承担造型**，不参与散热，也不接触电气
- 灯芯模块我叫它 **ReadingCore-01**，所有产品都用同一个内核，只是换外壳

参考一下 Gantri / Gantri 那种"受控定制"的思路，但比它更小、更轻、更像阅读灯而不是氛围灯。

我要的 Demo 不是真的去下单做灯，而是要一个**网页原型**，能让人：

1. 输一句产品想法
2. 看到 AI 怎么把它拆成"固定内核 + 可变外壳"
3. 自己选外壳风格/颜色/刻字，看到预览
4. 拿到一份**制造 JSON**（要装哪些东西、估计花多少钱、装配顺序是什么）

---

## 背景与问题

### 当前场景

独立开发者和小品牌文创团队想做实体产品时，最常见的死法：

1. **每个 SKU 都从零设计** —— 成本爆炸、迭代极慢
2. **外包打样一次性消耗** —— 几百块一个样品，错了就报废
3. **结构错了重来** —— LED 灯带贴塑料外壳、电源藏不进底座、散热不够外壳发黄
4. **没有任何"可定制"的中间形态** —— 要么全定制，要么完全标准款

设计-制造-销售的链路里，**没有任何一个"想法 → 可演示原型"的快速通道**。

### 现有痛点

- 痛点 1：把模糊想法直接做成实物，时间和金钱成本太高
- 痛点 2：现有"配置器"（如 Nike By You）只做配色选择，没有架构推理
- 痛点 3：AI 拿到"北京风格阅读台灯"这种短文本，直接生成"标准台灯方案"，丢失了"ReadingCore-01 固定内核"的灵魂

### 为什么需要解决

如果不解决：

- 文创团队继续一次性打样，烧钱烧时间
- 产品经理继续用 PPT 跟客户解释"为什么这个灯值这个价"，没有可交互 Demo
- 独立开发者继续把"灯带贴塑料"这种结构错误带到量产阶段
- AI Workflow 继续停在"生成文本"，没有"生成产品架构 + 制造 JSON"

---

## 为什么这个想法重要

这个想法比现有方案好在哪里：

1. **架构即哲学** —— 把 ReadingCore-01 当成"硬件 IP"，把 Shell 当成"风格语言"，结构清楚到一句话能讲完
2. **结构正确** —— "LED 灯带贴铝槽 + 乳白扩散罩 + 外壳装配"三层结构，从根本上避免灯带直贴塑料的发黄陷阱
3. **可演示** —— 纯静态网页，无 build step、无 CDN，GitHub Pages 直接打开
4. **可制造** —— 输出 BOM 估算 + 装配步骤，让 1:1 复刻成为可能
5. **AI Workflow 是天然场景** —— "北京风格阅读台灯" 输入后，AI 必须先做架构推理再出配置，不能跳步

它带来哪些改变：

- **对文创团队** —— 受控定制替代全定制，每个 SKU 共享 ReadingCore-01 工程
- **对产品经理** —— 用 4 区 Demo 跟客户解释"为什么这个灯值这个价"
- **对独立开发者** —— 先 Demo 后打样，错在 Demo 阶段而不是生产阶段
- **对 AI Agent 用户** —— 有一个可复制的 Prompt 模板，能让 Agent 处理同类"实体产品想法"输入

---

## 目标用户与使用场景

### 目标用户

| 用户角色 | 使用场景 | 价值 |
|---------|---------|------|
| 独立开发者 | 想试水实体产品但不敢大批量打样 | 先用 Demo 验证想法 |
| 文创产品设计师 | 想做"有北京味儿"的灯具 | 用受控定制快速出款 |
| 产品经理 | 想跟客户解释"为什么这个灯值这个价" | 用架构图直观说明 |
| AI Agent 使用者 | 想让 AI 把"想法"变成"产品 Demo" | 直接复用 Prompt 模板 |
| 硬件原型爱好者 | 想做 1:1 实物 | 按 JSON 找元器件自己打样 |

### 使用场景

1. **场景 1：想法验证** —— 输入一句"北京风格阅读台灯"，5 分钟看到 4 区 Demo，确认 ReadingCore-01 架构
2. **场景 2：风格选型** —— 在 Configurator 里选 4×4=16 种风格 × 颜色组合，输出制造 JSON 给工程师
3. **场景 3：客户演示** —— 产品经理在客户面前现场改刻字、改颜色、改风格，实时看到 JSON 变化
4. **场景 4：教学示范** —— 给新入职员工演示"实体产品 Demo 怎么从一句话做出可交互原型"

---

## 方案概述

DIY Lamp Builder 是一个**纯静态单页 Demo**，由 4 个区组成：

- **A. Idea Input** —— 一句话产品想法输入
- **B. AI Analyze** —— 自动产品架构（ReadingCore-01 固定 / Shell 可变）
- **C. Configurator** —— 风格 / 颜色 / 刻字 + SVG 实时预览
- **D. Manufacturing Plan** —— 实时 JSON 输出 + 装配步骤

整个 Demo 不依赖任何外部资源（无 CDN、无 build step、无 Three.js），用 HTML/CSS/JS 直接表达"实体产品想法 → 受控定制 Demo"的完整链路。

核心架构原则：

- **ReadingCore-01 永远是同一个内核** —— 灯芯模块、光电参数、装配接口都不变
- **Shell 永远可变** —— 外壳只承担造型与文化表达
- **结构隔离** —— LED 灯带不直接贴塑料外壳；先贴铝型材散热件，再加乳白扩散罩，最后装进可定制外壳

---

## Demo 最小可行版本（MVP）

### 目标

用 1-2 天时间，做出能让"产品小白" 5 分钟看懂"ReadingCore-01 + 可定制外壳"架构的可交互 Demo。

### 第一版策略

- 不做真实 LLM 调用 —— AI Analyze 区是硬编码常量（因为 Demo 重点不是 LLM 推理，而是结构表达）
- 不做真实 CAD —— SVG mock 预览足够
- 不做真实采购/支付 —— BOM 估算给范围即可
- 不做真实光路计算 —— 500-800 lm 是设计目标，不是实测

### 输入

1. 一句话产品想法（textarea）
2. 4 个 Shell Style 选项
3. 4 个 Color 选项
4. 1 个 Engraving 文本输入

### 输出

1. AI Analyze 6 字段表（带 ReadingCore-01 锁定标记）
2. SVG 预览（外壳随选择变化，Core 区不变）
3. Manufacturing Plan JSON（含 assembly_steps 数组）
4. Copy 按钮（可复制 JSON）

### 验证标准

- [x] 标准 1：4 区都在单页应用里
- [x] 标准 2：ReadingCore-01 字段不可编辑（视觉上 + 代码上都禁用）
- [x] 标准 3：改变任一配置，SVG 预览 + JSON 实时更新
- [x] 标准 4：装配步骤至少 6 步
- [x] 标准 5：移动端可读（响应式）
- [x] 标准 6：Chrome / Firefox 最新版能打开
- [x] 标准 7：不依赖 CDN / build step / Three.js

---

## 技术架构

### 最小技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 页面结构 | HTML | 4 个 `<section>` 区块 |
| 样式 | CSS | CSS 变量 + 媒体查询 |
| 交互 | Vanilla JS | 无框架，无构建 |
| 预览 | SVG | 4 种外壳形状 + 4 种颜色 + 文本 |
| JSON 输出 | JSON.stringify | 实时序列化 |
| 部署 | GitHub Pages | 静态托管 |

### 架构图

```
[Idea Input]                              ← 用户输入想法
       │
       ▼
[AI Analyze]                              ← 自动推导产品架构
       │                                       (Demo 中为硬编码常量)
       ├─ Lamp Type: Reading Desk Lamp
       ├─ Core Module: 🔒 ReadingCore-01   ← 固定不可变
       ├─ Light Type: 24V Linear LED
       ├─ Brightness: 500–800 lm
       ├─ Reading Distance: 35–45 cm
       ├─ Shell: Customizable              ← 可变
       └─ Interface: M3 dual mount / 铝槽卡扣
       │
       ▼
[Configurator]                            ← 用户选外壳
       │
       ├─ Lamp Type: Reading / Ambient
       ├─ Shell Style: Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc
       ├─ Color: Warm White / Hutong Gray / Palace Red / Night Black
       ├─ Engraving: 自由文本
       └─ Core: 🔒 ReadingCore-01         ← 固定
       │
       ▼
[Manufacturing Plan]                      ← 实时 JSON 输出
       │
       ├─ core / core_type / led_mount
       ├─ shell_style / color / engraving
       ├─ estimated_* (luminous_flux, print_time, material, bom_cost)
       └─ assembly_steps[]
```

### 物理结构图（ReadingCore-01 内核）

```
       [可定制外壳]      ← 只承担造型，不参与散热和电气
            │
            ▼
       [乳白扩散罩]      ← 柔光，避免眩光
            │
            ▼
       [铝型材/铝槽]      ← 关键散热通道
            │
            ▼
       [24V 线性 LED]    ← 切到灯头长度
            │
            ▼
       [M3 双孔法兰]     ← 装配接口
```

**结构原则** —— LED 灯带**不直接贴塑料外壳**。

---

## 数据流 / 工作流

### 核心流程

```
用户输入想法
  → AI 推导产品架构
    → ReadingCore-01 锁定 / Shell 解锁
      → 用户选外壳风格 + 颜色 + 刻字
        → SVG 实时预览更新
          → Manufacturing Plan JSON 实时更新
            → Copy 按钮可复制 JSON
              → 工程师按 JSON 找元器件打样
```

### 每个步骤说明

1. **步骤 1（Idea Input）**：用户在 textarea 输入想法，默认填入 demo idea。点击 Generate 触发后续 3 区渲染。
2. **步骤 2（AI Analyze）**：硬编码常量展示 6 字段 + 锁定标记。代表"AI 推理后会输出什么"，演示中**不是真实 LLM 调用**。
3. **步骤 3（Configurator）**：用户改变任一控件，SVG preview + JSON 实时更新。Core 字段永远显示 ReadingCore-01。
4. **步骤 4（Manufacturing Plan）**：实时 JSON 输出在 dark code block 里，可 Copy。assembly_steps 数组固化。

---

## 页面或系统设计

### 页面结构

| 页面 | 功能 | 说明 |
|------|------|------|
| Idea Input | 一句话想法输入 | 默认填入 demo idea |
| AI Analyze | 产品架构 6 字段 | Core 字段带锁定标记 |
| Configurator | 风格/颜色/刻字 | 左侧表单 + 右侧 SVG 预览 |
| Manufacturing Plan | 实时 JSON + 装配步骤 | Copy 按钮可复制 JSON |

### 关键界面元素

- **元素 1：Step Tag（A/B/C/D）** —— 圆形红色徽章，视觉上锚定 4 区
- **元素 2：架构表 6 字段** —— 左侧带 accent 色条；Core 字段带 🔒 锁定图标
- **元素 3：色块按钮组** —— 4 个圆形色块，点击切换 fill 颜色
- **元素 4：SVG 预览** —— 灯头外壳 / 灯芯模块 / 灯杆 / 底座 / 刻字，所有元素按视图框 `0 0 320 360` 排布
- **元素 5：Manufacturing JSON** —— dark theme 代码块，monospace 字体，可复制
- **元素 6：装配步骤** —— `<ol>` 列表，6 步固化
- **元素 7：免责声明** —— 明确说明 Demo 输出为估算参考

---

## 实施步骤

### 步骤 1：准备工作

- [x] 任务 1：克隆仓库，确认 main 分支干净
- [x] 任务 2：阅读 4 个现有 Blueprint 的目录结构
- [x] 任务 3：阅读 `docs/blueprint-template.md` 模板
- [x] 任务 4：阅读 `scripts/check-catalog.sh` 现状（确认有 hardcoded `total=3`）

### 步骤 2：核心实现

- [x] 任务 1：编写 Demo Pack（inputs / prompts / outputs / validation / README）
- [x] 任务 2：编写 4 区 Demo（HTML / CSS / JS）
- [x] 任务 3：镜像 Demo Pack + Demo 到 docs/ 和 public/
- [x] 任务 4：编写 Blueprint doc（本文档）
- [x] 任务 5：编写 Blueprint HTML 页 + 公共镜像
- [x] 任务 6：更新首页 index.html 添加 5th 截图卡片
- [x] 任务 7：生成 screenshot placeholder PNG

### 步骤 3：验证与测试

- [x] 任务 1：浏览器打开 `app/index.html`，确认 4 区渲染
- [x] 任务 2：调整所有配置，确认 SVG + JSON 实时更新
- [x] 任务 3：检查 Chrome / Firefox 兼容性
- [x] 任务 4：检查 1280×800 和 375×667 响应式

### 步骤 4：交付与文档

- [x] 任务 1：升级 `scripts/check-catalog.sh` 为动态读取 JSON
- [x] 任务 2：运行 `check-catalog.sh` 确认 PASS
- [x] 任务 3：编写 `reports/PHASE_IDB_6_DIY_LAMP_BUILDER_REPORT.md`
- [x] 任务 4：git commit + push

---

## 验收标准

### 功能验收

- [x] 验收项 1：Demo 页面在浏览器中可打开（任何浏览器直接打开 `app/index.html`）
- [x] 验收项 2：4 区都在页面中渲染
- [x] 验收项 3：ReadingCore-01 字段在 UI 上不可编辑
- [x] 验收项 4：4 风格 × 4 颜色 = 16 种组合都可预览
- [x] 验收项 5：刻字输入实时反映在 SVG 上
- [x] 验收项 6：Manufacturing JSON 实时更新
- [x] 验收项 7：Copy 按钮可复制 JSON
- [x] 验收项 8：装配步骤固化显示

### 质量验收

- [x] 质量项 1：不依赖外部 CDN
- [x] 质量项 2：不使用构建步骤
- [x] 质量项 3：不引入 Three.js / 任何 3D 库
- [x] 质量项 4：不包含 API key / secret / token
- [x] 质量项 5：移动端可读（响应式布局）
- [x] 质量项 6：项目版本徽章 v0.1.1-alpha 不变
- [x] 质量项 7：catalog schema 版本 meta.version 4.2 不变

### 性能验收（可选）

- [x] 性能项 1：3 个 JS / CSS / HTML 文件总大小 < 30 KB
- [x] 性能项 2：页面加载到首次渲染 < 200 ms（本地静态文件）

---

## 风险与限制

| 风险 | 影响 | 应对 |
|------|------|------|
| AI Analyze 区是 mock 不是真 LLM | 中 | 在 generated-demo-notes.md 中明确标注；架构推理逻辑交给真实 LLM 处理时复用 Prompt 模板 |
| SVG 预览精度有限 | 中 | 仅作示意用，不替代真实 CAD / STL；如需高精度可后续接 Three.js |
| BOM 估算成本不准确 | 中 | 给范围 `$40-80 prototype` 而非单一价格；明确免责声明 |
| 散热设计未在 Demo 中验证 | 低 | 在结构图中明确"铝槽是散热通道"，建议实际打样做热测试 |
| 风格 / 颜色只有 4 款 | 低 | Demo 演示架构正确性，款式扩展留给后续版本 |

### 已知限制

- 限制 1：不支持自定义 Style（仅 4 款预定义）
- 限制 2：不支持上传图片 / 文件
- 限制 3：不支持保存 / 分享配置（仅 Copy JSON）
- 限制 4：装配步骤是英文（不针对中文用户改写）
- 限制 5：BOM 价格是估算范围，不根据地区浮动

---

## 后续扩展方向

1. **真实 LLM 接入** —— 把 Idea Input 接到 Claude / GPT，按 build-prompt.md 输出架构和 JSON
2. **更多 Style** —— 把 4 款外壳扩展到 8 款 / 12 款，加入材质选项（PETG / PLA+ / 树脂 / 木材）
3. **真实 CAD / STL 导出** —— 用 OpenSCAD 或 Three.js 把 SVG 转成可打印 STL
4. **更多 Color** —— 加入 Pantone 色卡导入、自定义 hex
5. **装配动画** —— SVG 中做分步装配动画，每步高亮一个部件
6. **配置保存 / 分享** —— URL hash 编码当前配置，方便分享链接
7. **多 ReadingCore 变体** —— ReadingCore-02（高显色 95+）、ReadingCore-03（带 USB-C 充电口）
8. **与本 IDB 库的其他 Demo 联动** —— 用「项目记忆型会议助手」管理 ReadingCore-01 的迭代历史；用「多 Agent 项目管理面板」管理多个 SKU 状态

---

## 可直接复制给 Agent 的 Prompt 模板

> 完整版见 `demos/diy-lamp-builder/prompts/build-prompt.md`，下面是精简核心版：

```
你是「DIY 可定制阅读台灯构建器」的方案 Agent。

# 用户原始想法（粘到这里）
{{USER_IDEA}}

# 你的任务

请基于用户的想法，按以下四步生成产物：

## 1. Product Architecture（产品架构推理）

识别输入想法，把它拆成两层结构：
- **固定灯芯模块**：默认命名 ReadingCore-01，包含 24V 线性 LED、500–800 lm、CRI ≥ 95、M3 dual mount 装配接口
- **可定制外壳（Shell）**：包含 Style / Color / Engraving 三类自由度

## 2. Brief（方案 Brief）

300-500 字，包含定位、人群、价值主张、关键风险。

## 3. Task Plan（任务计划）

按 [Idea Input → AI Analyze → Configurator → Manufacturing Plan] 四步列出 Demo 任务。

## 4. Manufacturing Plan JSON

输出严格按以下结构的 JSON：

{
  "core": "ReadingCore-01",
  "core_type": "24V linear LED cassette",
  "led_mount": "aluminum channel with opal diffuser",
  "shell_style": "<4 选 1>",
  "color": "<4 选 1>",
  "engraving": "<用户刻字>",
  "estimated_luminous_flux": "500-800 lm",
  "estimated_print_time": "4h",
  "estimated_material": "PETG / PLA+",
  "estimated_bom_cost": "$40-80 prototype",
  "assembly_steps": ["...", "...", ...]
}

# 约束

- 灯芯模块不可编辑
- 外壳只承担造型，不承担散热和电气
- 输出必须是结构化 JSON
- 不要给真实采购链接，不要给真实 CAD/STL
```

---

## 人工确认点

- [x] 确认点 1：ReadingCore-01 是固定模块（不可编辑）
- [x] 确认点 2：外壳风格选 4 款（Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc）
- [x] 确认点 3：颜色选 4 款（Warm White / Hutong Gray / Palace Red / Night Black）
- [x] 确认点 4：BOM 价格范围定为 `$40-80 prototype`
- [x] 确认点 5：装配步骤数 ≥ 6
- [x] 确认点 6：不做真实 LLM 调用 / 真实 CAD / 真实采购

---

## 项目沉淀方式

这个方案完成后，可以沉淀为项目资产：

- **沉淀物 1**：ReadingCore-01 架构模板 —— 未来任何"灯具"或类似"功能 + 装饰"二分的实体产品都可以复用
- **沉淀物 2**：受控定制 Prompt 模板 —— 处理"实体产品想法"输入的标准化流程
- **沉淀物 3**：4 区 Demo 模板 —— 可作为 IDB 库中"产品 Demo"类的参考实现
- **沉淀物 4**：结构原则清单 —— "外壳不接触 LED / 不承担散热 / 不接触电气"作为产品架构硬约束

---

## Demo Pack（必须包含）

```
demos/diy-lamp-builder/
├── README.md              # 复现说明
├── inputs/                # 原始想法、背景材料、对话模拟
│   ├── source-idea.md
│   ├── background.md
│   └── transcript.md
├── prompts/               # 关键 Prompt
│   └── build-prompt.md
├── outputs/               # Brief、任务计划、生成说明
│   ├── brief.md
│   ├── task-plan.md
│   └── generated-demo-notes.md
├── app/                   # 可运行的最小 Demo
│   ├── index.html
│   ├── style.css
│   └── app.js
└── validation/            # 验收清单
    └── acceptance-checklist.md
```

完整文件已就位（镜像到 `docs/demos/diy-lamp-builder/` 和 `public/demos/diy-lamp-builder/`）。

### 构建过程记录

1. 阅读 4 个现有 Blueprint 的目录结构作为参考
2. 按 `blueprint-template.md` 编写本文档
3. 写 Demo Pack 的 inputs / prompts / outputs
4. 写 4 区 Demo（HTML / CSS / JS 三个文件，总 < 30 KB）
5. 镜像到 docs/ 和 public/（确保三份蓝图元数据 JSON 完全一致）
6. 升级 `check-catalog.sh` 为动态读取 JSON
7. 运行 check-catalog.sh + 三份 JSON sha256 校验
8. git commit + push

### 关键 Prompt

见 `demos/diy-lamp-builder/prompts/build-prompt.md`。

### 复现步骤

1. 阅读 `docs/diy-lamp-builder.md` 和 Blueprint HTML 页
2. 阅读 `demos/diy-lamp-builder/README.md`
3. 查看 `inputs/` 中的原始想法、背景、对话模拟
4. 查看 `prompts/build-prompt.md` 中的 Prompt 模板
5. 查看 `outputs/` 中的 Brief、任务计划、构建说明
6. 打开 `app/index.html` 体验可交互 Demo
7. 改变 Style / Color / Engraving，观察 SVG + JSON 实时更新
8. 对照 `validation/acceptance-checklist.md` 逐项验收

### 验收记录

- Demo 在 Chrome 最新版加载正常
- Demo 在 Firefox 最新版加载正常
- 4 区内容渲染完整
- 16 种 Style × Color 组合预览正常
- JSON 输出格式正确，Copy 按钮工作
- 移动端 375×667 视口下可读

---

## 参考资源

- **Gantri** —— 3D 打印灯厂，受控定制典范：https://gantri.com
- **Framework Laptop** —— 主板固定 + 外壳可换的受控定制模式
- **Local Motors** —— 汽车"动力总成固定 + 车身可换"模式（已停业但概念仍有效）
- **OpenSCAD** —— 程序化生成 3D 模型的工具，可作为后续 STL 导出扩展
- **Pantone 色卡** —— 颜色一致性参考

---

*Created following the [Idea-to-Demo Blueprints](https://github.com/conanxin/idea-to-demo-blueprints) format. Phase: IDB-6.*