# DIY 可定制阅读台灯构建器

- **英文名：** DIY Lamp Builder
- **类型：** Physical Product / AI Workflow / Configurator
- **难度：** 中等
- **Demo 周期：** 1-2 天
- **适合对象：** 独立开发者 / 产品经理 / 文创产品设计师 / AI Agent 使用者 / 硬件原型爱好者
- **标签：** AI、实体产品、灯具、配置器、3D Demo、Manufacturing Plan、CAD、OpenSCAD、STL Export、SVG-to-CAD、Lux Test、Heat Soak、Glare Review、Physical Prototype
- **状态：** demo-ready
- **创建阶段：** IDB-6
- **更新阶段：** IDB-6E
- **productization_pass：** completed
- **cad_export_pass：** completed
- **print_validation_pass：** completed
- **physical_testing_pass：** completed

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
5. （IDB-6C）把选中的外壳 SVG 路径**导出为 OpenSCAD 模块并生成可 3D 打印的 STL**，实现"想法 → 预览 → 切片"的完整链路

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

DIY Lamp Builder 是一个**纯静态单页 Demo**，由 4 个区组成，并在 IDB-6C 新增第 5 个 CAD Export 区：

- **A. Idea Input** —— 一句话产品想法输入
- **B. AI Analyze** —— 自动产品架构（ReadingCore-01 固定 / Shell 可变）
- **C. Configurator** —— 风格 / 颜色 / 刻字 + SVG 实时预览
- **D. Manufacturing Plan** —— 实时 JSON 输出 + 装配步骤
- **E. CAD Export**（IDB-6C 新增）—— SVG 路径 → OpenSCAD 模块 → STL 导出命令

整个 Demo 不依赖任何外部资源（无 CDN、无 build step、无 Three.js），用 HTML/CSS/JS 直接表达"实体产品想法 → 受控定制 Demo → 可打印 3D 模型"的完整链路。

核心架构原则：

- **ReadingCore-01 永远是同一个内核** —— 灯芯模块、光电参数、装配接口都不变
- **Shell 永远可变** —— 外壳只承担造型与文化表达
- **结构隔离** —— LED 灯带不直接贴塑料外壳；先贴铝型材散热件，再加乳白扩散罩，最后装进可定制外壳

---

## Demo 最小可行版本（MVP）

### 目标

用 1-2 天时间，做出能让"产品小白" 5 分钟看懂"ReadingCore-01 + 可定制外壳"架构的可交互 Demo。

### 第一版策略

- 不做真实 LLM 调用 —— AI Analyze 区使用轻量规则解析器，把关键词映射到产品决策；真实场景可复用 Prompt 模板接入 LLM。
- 不做真实 CAD —— SVG mock 预览足够
- 不做真实采购/支付 —— BOM 估算给动态范围即可
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
4. CAD Export 代码片段（OpenSCAD 模块 + STL 命令，IDB-6C）
5. Copy 按钮（可复制 JSON）

### 验证标准

- [x] 标准 1：4 区都在单页应用里
- [x] 标准 2：ReadingCore-01 字段不可编辑（视觉上 + 代码上都禁用）
- [x] 标准 3：改变任一配置，SVG 预览 + JSON 实时更新
- [x] 标准 4：装配步骤至少 6 步
- [x] 标准 5：移动端可读（响应式）
- [x] 标准 6：Chrome / Firefox 最新版能打开
- [x] 标准 7：不依赖 CDN / build step / Three.js
- [x] 标准 8：CAD Export 区输出 OpenSCAD 模块与 STL 命令（IDB-6C）

---

## 技术架构

### 最小技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 页面结构 | HTML | 5 个 `<section>` 区块（含 IDB-6C 新增的 CAD Export） |
| 样式 | CSS | CSS 变量 + 媒体查询 |
| 交互 | Vanilla JS | 无框架，无构建 |
| 预览 | SVG | 4 种外壳形状 + 4 种颜色 + 文本 |
| CAD 模块 | OpenSCAD | 4 种外壳对应 4 个参数化模块，线性拉伸成 3D |
| JSON 输出 | JSON.stringify | 实时序列化，含 `cad_export` 字段 |
| STL 导出 | OpenSCAD CLI | `openscad -o shell.stl shell.scad` |
| 部署 | GitHub Pages | 静态托管 |

### 架构图

```
[Idea Input]                              ← 用户输入想法
       │
       ▼
[AI Analyze]                              ← 轻量规则解析器（非真实 LLM）
       │                                       （演示 AI 推导后的结构，真实场景复用 Prompt 模板）
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
       ├─ assembly_steps[]
       └─ cad_export                       ← IDB-6C 新增：SVG 路径 → OpenSCAD 模块 → STL 命令
       │
       ▼
[CAD Export]                              ← 可 3D 打印外壳
       │
       ├─ shell_style → openscad_module
       ├─ linear_extrude(height = 40)
       └─ openscad -o shell.stl shell.scad
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
2. **步骤 2（AI Analyze）**：轻量规则解析器展示 6 字段 + 锁定标记。代表"AI 推理后会输出什么"，演示中**不是真实 LLM 调用**，真实场景可复用 Prompt 模板。
3. **步骤 3（Configurator）**：用户改变任一控件，SVG preview + JSON 实时更新。Core 字段永远显示 ReadingCore-01。
4. **步骤 4（Manufacturing Plan）**：实时 JSON 输出在 dark code block 里，可 Copy。assembly_steps 数组固化。
5. **步骤 5（CAD Export）**：用户切换 Shell Style 时，Demo 自动生成对应的 OpenSCAD 模块代码与 `openscad -o shell.stl shell.scad` CLI 命令，供用户复制到本地生成可打印 STL。

---

## 页面或系统设计

### 页面结构

| 页面 | 功能 | 说明 |
|------|------|------|
| Idea Input | 一句话想法输入 | 默认填入 demo idea |
| AI Analyze | 产品架构 6 字段 | Core 字段带锁定标记 |
| Configurator | 风格/颜色/刻字 | 左侧表单 + 右侧 SVG 实时预览 |
| Manufacturing Plan | 实时 JSON + 装配步骤 | Copy 按钮可复制 JSON |
| CAD Export | OpenSCAD 模块 + STL 命令 | 根据 Shell Style 输出可 3D 打印的代码 |

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
- [x] 任务 8：IDB-6C 新增 CAD Export 章节、OpenSCAD 模块表、STL 导出命令与能力矩阵
- [x] 任务 9：更新 docs/blueprints/diy-lamp-builder.html 和 public/ 镜像到 IDB-6C
- [x] 任务 10：同步三份 blueprints.json 元数据（tags + updated_phase = IDB-6C）

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
- [x] 质量项 8：blueprints.json 三份完全一致，meta.total = 5，updated_phase = IDB-6E

### 性能验收（可选）

- [x] 性能项 1：3 个 JS / CSS / HTML 文件总大小 < 30 KB
- [x] 性能项 2：页面加载到首次渲染 < 200 ms（本地静态文件）

---

## IDB-6E Measured Lux / Heat / Glare Workflow + Physical Prototype Checklist

本阶段在 IDB-6D Print Validation 之后，把验证从"打印前"推进到"第一台实物样机"：增加可执行的照度测试、热稳定测试、眩光检查、样机装配清单与数据记录模板。它不是任何认证或实验室测试，而是给第一次物理 build 一个结构化的决策流程。

### 为什么需要 IDB-6E

打印出来的几何正确，不代表装配后的灯适合阅读。第一版样机经常暴露这些问题：

- 阅读中心照度不足，边缘衰减过快。
- 扩散罩或外壳没有遮住直射 LED，产生眩光。
- LED 热量让打印外壳发软、变色、产生气味。
- 底座不稳、线缆拉扯、装配间隙。
- 刻字太小、分层开裂、外观面有严重层纹。

IDB-6E 给出一个低成本的测量工作流：

```
Idea → Config → SVG Preview → OpenSCAD → CAD Validation → Fit-Test Coupon → Slicer Profile → Physical Prototype → Lux Grid → Heat Soak → Glare Review → Readiness Gate
```

### Lux Grid 测量方法

- 目标距离：灯头到书本/阅读面 35–45 cm。
- 目标中心照度：300–500 lux（阅读台灯常用范围）。
- 最低点要求：阅读区域（中心、左右页）不得低于 200 lux。
- 工具：照度计优先；手机 lux app 仅用于趋势对比。

| 测量点 | 目标值 | 备注 |
|--------|--------|------|
| Center | ≥ 300 lux | 阅读面中心 |
| Left page | ≥ 200 lux | 左侧书页 |
| Right page | ≥ 200 lux | 右侧书页 |
| Front edge | trend only | 前边缘，仅作趋势参考 |
| Back edge | trend only | 后边缘，仅作趋势参考 |

### Heat Soak 测量方法

- 第一档：常亮 30 分钟，记录铝槽、外壳近 LED 处、扩散罩、底座、线缆出口的温度和触感。
- 第二档：如 30 分钟安全，可延长至 60 分钟。
- 通过标准：外壳不发软、不翘曲、无异味、不变色、手触不觉烫。
- 如果手触不舒服，应降低功率或改善散热路径。

### Glare Review 方法

- 观察者坐在正常阅读姿势，眼高 35–45 cm 距离。
- 检查清单：
  - 直射 LED 不可见。
  - 扩散罩内缩或被外壳遮蔽。
  - 纸面无锐利高光点。
  - 光面书页无刺眼光斑。
  - 手或书产生的阴影不遮挡阅读。

### Physical Prototype Checklist

- **电气边界**：仅使用低压适配器，无裸露导体，线缆出口有 strain relief。
- **机械装配**：ReadingCore-01 装入外壳、M3 孔位配合、扩散罩顺畅、底座稳定。
- **打印质量**：无翘曲、安装孔附近无层裂、无毛刺锐边。
- **测量完成**：lux grid、heat soak、glare review 均已记录。
- **决策门**：Ready for full build / Iterate CAD。

### 如何判断进入下一轮 CAD 调整

- 如果 lux 不达标 → 检查 LED 功率、扩散罩透光率、灯头高度。
- 如果眩光失败 → 增加扩散罩内缩深度、加外壳遮光沿。
- 如果外壳过热 → 改用 PETG、增加壁厚、改善铝槽接触、降低电流。
- 如果装配过松/过紧 → 按 fit-test coupon 重新校准孔径和槽宽。
- 如果刻字不清 → 放大字号、减薄层纹（0.2 mm 层高）、换更细喷嘴。

### 限制

- **不含认证**：本阶段不是 UL、CCC、IEC、GB 或任何国家/地区电气安全认证。
- **不含热仿真**：仅通过实测和触感观察判断热稳定性。
- **不含电气安全认证**：低压适配器仍需符合其自身规格，Demo 不保证任何电气参数。
- **手机 lux app 仅作趋势参考**：精度远低于专业照度计，不能用于正式光学评估。

---

## IDB-6D CAD Validation + Print Orientation + Slicer Profile

本阶段在 IDB-6C CAD Export 之后增加"第一轮 FDM 打样前验证包"：CAD validation、打印方向、切片配置、fit-test coupon、测量日志。它不是工程合格认证，而是让 DIY 台灯在真实打印前有一个结构化的检查清单。

### 为什么需要 IDB-6D

OpenSCAD 能生成几何，但不代表这个几何适合你的打印机。FDM 打印常见失败点：

- M3 孔径太小，螺丝拧不进去或太松。
- Diffuser slot 宽度不对，铝槽装不进或晃动。
- Cable exit 半径太小，线缆弯折或接口断裂。
- 壁厚太薄，薄壁壳体在打印时塌陷。
- 打印方向错误，支撑面破坏外观。
- 支撑策略错误，格栅/屋檐细节打失败。

IDB-6D 在真实打印前给出一个可执行的检查流程：

```
Idea → Config → SVG Preview → OpenSCAD → CAD Validation → Fit-Test Coupon → Slicer Profile → Measured Fit Log → Full Shell Print
```

### CAD Validation 检查项

| 检查项 | 规则 | 当前状态 |
|--------|------|----------|
| ReadingCore-01 keepout | 外壳不能与 240×24×18 mm 内核保护区相交 | PASS |
| Diffuser slot clearance | 标称 18 mm，测试 17.8 / 18.0 / 18.2 / 18.4 mm | 依赖实测 |
| M3 mount holes | 标称 3.2 mm，测试 3.0 / 3.2 / 3.4 mm | 依赖实测 |
| Cable exit | 最小半径 4 mm，推荐 5 mm | PASS |
| Minimum wall thickness | ≥ 2.0 mm，推荐 2.4 mm | WARN（需按具体 shell 检查） |
| Engraving manufacturability | 刻字高度 ≥ 0.3 mm、线条宽度 ≥ 0.4 mm | WARN（需按具体刻字检查） |

### 4 种 Shell Style 打印方向

| Shell Style | 推荐方向 | 支撑策略 | 风险等级 |
|-------------|----------|----------|----------|
| Minimal Bar | 扩散罩开口向上或侧向上 | 通常无需支撑 | 低 |
| Hutong Window | 背面贴床，格栅向上 | 格栅细节需要支撑 | 中 |
| Beijing Pavilion | 屋脊向上，背面贴床 | 屋檐需要支撑 | 高 |
| Book Arc | 弧形向上，背面贴床 | 弧形下方需要支撑 | 中高 |

### Slicer Profile 基线

- Nozzle: 0.4 mm
- Layer height: 0.20 mm
- Perimeters: 3
- Top / bottom layers: 5
- Infill: 18%（PLA+ 可降至 15%，PETG 建议 20%）
- Supports: 按 shell style 决定
- Brim: 5 mm（推荐，尤其长条形外壳）
- Seam: 背面

材料建议：

- **PETG**：功能原型首选，更耐热、更耐摔。
- **PLA+**：视觉 mock-up 首选，表面更好、更容易打印。

### Fit-Test Coupon

`demos/diy-lamp-builder/outputs/cad-validation/fit-test-coupon.scad` 包含：

- M3 孔径阶梯：3.0 / 3.2 / 3.4 mm
- Diffuser slot 宽度阶梯：17.8 / 18.0 / 18.2 / 18.4 mm
- Cable exit 半径测试：4 / 5 mm
- 小字刻印样本

先打印这个 coupon，用真实螺丝、铝槽、线缆验证尺寸，再决定是否调整 CAD 并打印完整外壳。

### Measurement Log

使用 `outputs/cad-validation/measured-fit-test-log-template.csv` 或 `.md` 记录：

- 打印机、材料、喷嘴、层高
- 每个 M3 孔 / slot 的实测结果
- 铝槽是否能滑入
- 线缆出口是否舒适
- 下一次 CAD 调整

只有 fit-test coupon 的实测结果落在可接受范围内，才把 `ready_for_full_shell_print` 标记为 true。

### Validation Report Template

```json
{
  "phase": "IDB-6D",
  "configuration_id": "sample-hutong-window",
  "cad_validation": "PASS",
  "openscad_export": "PASS_or_SKIP",
  "fit_test_coupon": "PENDING",
  "measured_fit": "PENDING",
  "ready_for_full_shell_print": false
}
```

### 限制

- IDB-6D 是**第一轮 FDM 打样前验证包**，不是工程合格承诺。
- 不包含热仿真、电气认证、结构强度计算或最终量产图纸。
- 所有尺寸和参数都需要根据实际打印机、耗材、环境和后处理校准。

---

## IDB-6C CAD Export Pass

本阶段把 IDB-6B 的 Demo 升级为"可输出可打印 3D 模型"的产品原型工具，新增 SVG-to-CAD / OpenSCAD STL 导出能力。

### 新增能力（IDB-6C）

| 能力 | 说明 | 状态 |
|------|------|------|
| **SVG-to-CAD Mapping** | 4 种 Shell Style 各自映射到 1 个 OpenSCAD 参数化模块 | 已完成 |
| **OpenSCAD Modules** | 每个模块使用 `linear_extrude()` 将 2D 外壳轮廓拉伸为 3D 壳体 | 已完成 |
| **STL Export Command** | 提供可直接复制的 `openscad -o shell.stl shell.scad` 命令 | 已完成 |
| **CAD Export Panel** | Demo 新增第 5 区，实时展示当前 Shell 的 OpenSCAD 代码 | 已完成 |
| **Historical Compatibility** | 保留 IDB-6 / IDB-6A / IDB-6B 全部内容与章节 | 已完成 |

### 4 种外壳设计说明

| Shell Style | 视觉特征 | 复杂度 | 打印时间 | 风险 |
|-------------|----------|--------|----------|------|
| Minimal Bar | 极简长条、圆角、干净线条 | 1.0 | 3.5h | low |
| Hutong Window | 窗棂网格/格栅，北京胡同元素 | 1.25 | 5h | medium |
| Beijing Pavilion | 屋檐/檐口轮廓，中式亭阁屋顶线 | 1.45 | 6.5h | medium |
| Book Arc | 书页弧线/拱形灯罩，适合床头 | 1.35 | 5.5h | low |

### BOM 计算说明

总成本 = 基础元器件 + 3D 打印外壳 + 颜色涂装

- 基础元器件：LED strip、铝槽+扩散罩、电源、控制器、紧固件、底座/支架，合计 `$38-87`。
- 外壳成本：按复杂度乘数在 `$6-24` 之间浮动。
- 涂装成本：按颜色工艺在 `$4-16` 之间浮动。
- 最终输出格式：`$58-126 prototype`。

详细数据结构见 `demos/diy-lamp-builder/outputs/bom-model.json`。

### CAD Export 能力矩阵（IDB-6C）

| 能力 | 当前实现 | 后续扩展 |
|------|----------|----------|
| SVG 路径解析 | 4 种 Shell Style 的 SVG `d` 路径已硬编码为 OpenSCAD 多边形 | 后续支持上传自定义 SVG 并自动解析 |
| 参数化 OpenSCAD 模块 | 4 个模块：`shell_minimal_bar()` / `shell_hutong_window()` / `shell_beijing_pavilion()` / `shell_book_arc()` | 后续可支持 `height` / `wall_thickness` / `clearance` 参数 |
| 3D 拉伸 | `linear_extrude(height = 40)` 统一厚度 | 后续可区分灯头罩、底座盖、装饰板等厚度 |
| STL 导出命令 | `openscad -o shell.stl shell.scad` | 后续可打包为 `.zip` 或一键下载 `.scad` 文件 |
| ReadingCore-01 安装槽 | 每个模块预留 `core_slot()` 负形挖孔 | 后续可导出装配爆炸图 / BOM 中的 3D 打印件 |

### OpenSCAD 模块表（Shell → Module 映射）

| Shell Style | OpenSCAD 模块名 | 2D 轮廓特征 | 拉伸高度 | 关键参数 |
|-------------|----------------|------------|----------|----------|
| Minimal Bar | `shell_minimal_bar()` | 圆角长条矩形 | 40 mm | `length=240`, `radius=12`, `slot=30x8` |
| Hutong Window | `shell_hutong_window()` | 长条矩形 + 3 条竖窗棂 | 40 mm | `length=240`, `bar_w=6`, `slot=30x8` |
| Beijing Pavilion | `shell_beijing_pavilion()` | 梯形屋顶 + 矩形檐口 | 40 mm | `length=240`, `roof_h=35`, `slot=30x8` |
| Book Arc | `shell_book_arc()` | 拱形外框 + 内凹弧线 | 40 mm | `length=240`, `arc_h=40`, `slot=30x8` |

### Shell Style → CAD 模块使用示例

```scad
// Include the matching module based on selected shell style
use <lamp-shells.scad>

shell_beijing_pavilion();

// Subtract ReadingCore-01 mounting slot
module core_slot() {
    translate([105, 10, 8])
        cube([30, 8, 40 + 2]);
}

difference() {
    shell_beijing_pavilion();
    core_slot();
}
```

### STL 导出命令

```bash
openscad -o shell.stl shell.scad
```

推荐参数（quality 与 speed 平衡）：

```bash
openscad -o shell.stl --enable=fast-csg --D quality=24 shell.scad
```

### 在 Manufacturing JSON 中的 CAD 字段（IDB-6C）

```json
{
  "phase": "IDB-6C",
  "cad_export": {
    "format": "OpenSCAD",
    "module": "shell_beijing_pavilion",
    "extrusion_height_mm": 40,
    "core_slot": "30x8 mm",
    "stl_command": "openscad -o shell.stl shell.scad",
    "svg_to_cad_ready": true
  }
}
```

### Idea Parser 规则示例

| 关键词 | 推荐决策 |
|--------|----------|
| 孩子/儿童/睡前 | warm 2700K、Book Arc、low glare |
| 北京/胡同/四合院/窗 | Hutong Window、Warm White / Hutong Gray |
| 天坛/宫殿/中式/亭/阁 | Beijing Pavilion、Palace Red |
| 极简/黑色/工作/桌面 | Minimal Bar、Night Black、600-800 lm |
| 书卷/床头/弧形 | Book Arc |
| 阅读/读书/书桌/图书 | Reading Lamp、ReadingCore-01 |

### Before / After：IDB-6 → IDB-6C

| 维度 | IDB-6 | IDB-6B | IDB-6C |
|------|-------|--------|--------|
| Manufacturing JSON | 简单字段 | 含 phase、core_locked、reading_target、core_stack、risk_notes | 新增 `cad_export` 字段，含 OpenSCAD 模块、拉伸高度、STL 命令 |
| BOM 成本 | 固定范围 | 按 shell / 颜色动态计算 | 保持 IDB-6B 动态模型，未来可接入 3D 打印耗材重量估算 |
| Idea 解析 | 无 | 规则解析器 + 4 个示例按钮 | 保持 IDB-6B 解析器，新增 CAD Export 联动 |
| 装配流程 | 6 步文字 | 8 步带状态标签 | 保持 8 步，新增第 9 步"导出 STL 并切片"（future-automation） |
| 外壳预览 | 基础差异 | 轮廓、纹样、刻字位置明显不同 | 相同 SVG 预览，新增 OpenSCAD 模块映射与 STL 导出命令 |
| 3D 可打印 | 无 | 仅提及后续扩展 | 正式输出 OpenSCAD 模块与 `openscad -o shell.stl shell.scad` 命令 |

### 产品化风险

| 风险 | 影响 | 应对 |
|------|------|------|
| AI Analyze 区仍是 mock 不是真 LLM | 中 | 规则解析器已标注；真实 LLM 可复用 Prompt 模板 |
| SVG 预览精度有限 | 中 | 仅作示意；IDB-6C 已提供 OpenSCAD / SVG-to-CAD 导出真实 STL |
| BOM 估算成本不准确 | 中 | 给范围；实际采购和量产成本会大幅下降 |
| 散热设计未验证 | 低 | 结构已强制"铝槽散热 + 外壳不接触 LED" |
| 风格/颜色仅 4 款 | 低 | 架构正确即可扩展 |
| CAD Export 仍需本地 OpenSCAD 环境 | 低 | 提供 STL 命令与 `.scad` 代码片段；未来可打包下载 |

---

## 风险与限制

| 风险 | 影响 | 应对 |
|------|------|------|
| AI Analyze 区是 mock 不是真 LLM | 中 | 使用轻量规则解析器；真实场景复用 Prompt 模板 |
| SVG 预览精度有限 | 中 | 仅作示意；IDB-6C 已提供 OpenSCAD / SVG-to-CAD 导出真实 STL |
| BOM 估算成本不准确 | 中 | 输出动态 BOM range，例如 `$58-126 prototype`；明确免责声明 |
| 散热设计未在 Demo 中验证 | 低 | 在结构图中明确"铝槽是散热通道"，建议实际打样做热测试 |
| 风格 / 颜色只有 4 款 | 低 | Demo 演示架构正确性，款式扩展留给后续版本 |
| CAD Export 仍需本地 OpenSCAD 环境 | 低 | 提供 STL 命令与 `.scad` 代码片段；未来可打包下载 |

### 已知限制

- 限制 1：不支持自定义 Style（仅 4 款预定义）
- 限制 2：不支持上传图片 / 文件
- 限制 3：不支持保存 / 分享配置（仅 Copy JSON）
- 限制 4：装配步骤是英文（不针对中文用户改写）
- 限制 5：BOM 价格是估算范围，不根据地区浮动
- 限制 6：Idea Parser 是规则匹配，不是真实 LLM
- 限制 7：CAD Export 为代码片段，仍需本地 OpenSCAD 运行（未打包下载）

---

## 后续扩展方向

1. **真实 LLM 接入** —— 把 Idea Input 接到 Claude / GPT，按 build-prompt.md 输出架构和 JSON
2. **更多 Style** —— 把 4 款外壳扩展到 8 款 / 12 款，加入材质选项（PETG / PLA+ / 树脂 / 木材）
3. **真实 CAD / STL 导出** —— 用 OpenSCAD 或 SVG-to-CAD 把预览转成可打印 STL（**已在 IDB-6C 实现代码片段**）
4. **SVG 路径自动解析** —— 支持用户上传自定义 SVG，自动转成 OpenSCAD 多边形
5. **更多 Color** —— 加入 Pantone 色卡导入、自定义 hex
6. **装配动画** —— SVG 中做分步装配动画，每步高亮一个部件
7. **配置保存 / 分享** —— URL hash 编码当前配置，方便分享链接
8. **多 ReadingCore 变体** —— ReadingCore-02（高显色 95+）、ReadingCore-03（带 USB-C 充电口）
9. **真实元器件 sourcing** —— 给出可采购的 SKU 和替代方案
10. **真实亮度/照度测试** —— 用 lux meter 验证 35-45 cm 处的 desk lux
11. **一键打包下载** —— 将 `.scad`、`.stl`、装配说明 PDF 一起打包
12. **与本 IDB 库的其他 Demo 联动** —— 用「项目记忆型会议助手」管理 ReadingCore-01 的迭代历史；用「多 Agent 项目管理面板」管理多个 SKU 状态

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

按 [Idea Input → AI Analyze → Configurator → Manufacturing Plan → CAD Export] 五步列出 Demo 任务。

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
  "estimated_bom_cost": "$58-126 prototype",  // 动态 BOM，随 shell style / 颜色 / base mock 变化
  "assembly_steps": ["...", "...", ...]
}

# 约束

- 灯芯模块不可编辑
- 外壳只承担造型，不承担散热和电气
- 输出必须是结构化 JSON
- 不要给真实采购链接；CAD/STL 部分在 IDB-6C 中已提供 OpenSCAD 代码片段与导出命令，但不生成真实可下载文件
```

---

## 人工确认点

- [x] 确认点 1：ReadingCore-01 是固定模块（不可编辑）
- [x] 确认点 2：外壳风格选 4 款（Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc）
- [x] 确认点 3：颜色选 4 款（Warm White / Hutong Gray / Palace Red / Night Black）
- [x] 确认点 4：BOM 价格范围为动态范围，例如 `$58-126 prototype`，随 shell style / 颜色 / base mock 变化
- [x] 确认点 5：装配步骤数 ≥ 6
- [x] 确认点 6：不做真实 LLM 调用 / 真实 CAD / 真实采购
- [x] 确认点 7：IDB-6C 提供 OpenSCAD 代码片段与 STL 导出命令，但不生成真实可下载文件

---

## 项目沉淀方式

这个方案完成后，可以沉淀为项目资产：

- **沉淀物 1**：ReadingCore-01 架构模板 —— 未来任何"灯具"或类似"功能 + 装饰"二分的实体产品都可以复用
- **沉淀物 2**：受控定制 Prompt 模板 —— 处理"实体产品想法"输入的标准化流程
- **沉淀物 3**：5 区 Demo 模板 —— 可作为 IDB 库中"产品 Demo + CAD 导出"类的参考实现（IDB-6C）
- **沉淀物 4**：结构原则清单 —— "外壳不接触 LED / 不承担散热 / 不接触电气"作为产品架构硬约束
- **沉淀物 5**：SVG-to-CAD 映射表 —— 为后续"2D 预览 → 3D 打印"提供标准化转换范例（IDB-6C）

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
9. IDB-6C：扩展为 5 区 Demo，新增 CAD Export 区、OpenSCAD 模块表与 STL 命令
10. IDB-6C：重新生成 docs/media 与 public/media 的 demo 截图，使用 Pillow 并标注 IDB-6C

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
- 5 区内容渲染完整（含 IDB-6C 新增 CAD Export）
- 16 种 Style × Color 组合预览正常
- JSON 输出格式正确，含 `cad_export` 字段，Copy 按钮工作
- CAD Export 区输出正确的 OpenSCAD 模块与 STL 命令
- 移动端 375×667 视口下可读

---

## 参考资源

- **Gantri** —— 3D 打印灯厂，受控定制典范：https://gantri.com
- **Framework Laptop** —— 主板固定 + 外壳可换的受控定制模式
- **Local Motors** —— 汽车"动力总成固定 + 车身可换"模式（已停业但概念仍有效）
- **OpenSCAD** —— 程序化生成 3D 模型的工具，IDB-6C 已作为 CAD Export 扩展
- **Pantone 色卡** —— 颜色一致性参考

---

*Created following the [Idea-to-Demo Blueprints](https://github.com/conanxin/idea-to-demo-blueprints) format. Phase: IDB-6C.*

## IDB-6F Physical Prototype Build Package + Sourcing Checklist + Purchase-ready BOM

IDB-6F 把 DIY Lamp Builder 从“测试流程已定义”推进到“可以准备采购并组装第一台样机”。

### 新增内容

- Purchase-ready BOM
- Component spec sheet
- Sourcing checklist
- Quote comparison template
- First prototype assembly runbook
- Supplier risk register
- Purchase decision gate
- First build issue log

### 采购边界

本阶段不是供应商背书，也不是实时价格确认。它定义的是首台样机的规格与采购检查框架。真实供应商 shortlist 和实时价格对比留到 IDB-6G。

### 第一台样机建议顺序

1. 先填 quote comparison template。
2. 只购买一套样机料。
3. 打印 fit-test coupon。
4. 验证 M3 孔、扩散罩槽、铝槽间隙和线缆出口。
5. 打印完整 shell。
6. 装配 ReadingCore-01。
7. 执行 IDB-6E 的照度、热稳定和眩光测试。

## IDB-6G Real Component Research + Supplier Shortlist

IDB-6G 把 IDB-6F 的采购框架推进到真实候选件研究。它不会直接下单，也不对供应商背书，而是形成一套第一台样机的候选组件池和比较矩阵。

### 新增内容

- real-component-candidates.csv / json
- supplier-shortlist.md
- purchase-search-keywords.md
- first-prototype-shopping-list.md
- supplier-risk-notes.md
- sourcing-decision-matrix.csv
- source-notes.md

### 研究结论

第一台 ReadingCore-01 样机优先围绕以下组件组合：

- 24V high-CRI COB / dense LED strip
- aluminum channel + opal diffuser
- 24V 1A–2A adapter
- 12–24V inline PWM dimmer
- M3 hardware + cable strain relief
- PETG / PLA+ printed shell

### 边界

价格和库存会变化；下单前必须重新打开候选链接确认。IDB-6G 不是采购承诺，也不是认证供应商清单。

## IDB-6H First Prototype Build Runbook + Build Report Template

IDB-6H 把 IDB-6G 的 sourcing pack 推进到首台样机的 build day workflow。

### 新增内容

- first-build-runbook.md
- first-build-report-template.md / json
- assembly-photo-shot-list.md
- build-day-checklist.md
- troubleshooting-guide.md
- prototype-iteration-decision.md
- sample-first-build-report.json

### 目标

把真实采购件、3D 打印件、ReadingCore-01 cassette 和 IDB-6E 测试流程串起来，形成一次可复盘的首台样机装配流程。

### Build day 顺序

1. 组件到货检查。
2. 打印 fit-test coupon。
3. 打印完整外壳。
4. 装配 ReadingCore-01 cassette。
5. 安装底座和支臂。
6. 首次低亮度通电观察。
7. 执行照度、热稳定和眩光测试。
8. 填写 first-build report。
9. 做迭代决策。
