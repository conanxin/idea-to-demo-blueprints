# Demo 构建说明（Generated Demo Notes）

> 记录 Demo 是怎么构建的，以及哪些地方是 mock、哪些是真实可用的。

---

## 一句话总结

这是一个**纯静态、单页面、不依赖任何外部资源**的 Demo，用 HTML + CSS + JS 表达"实体产品想法 → 受控定制 Demo"的完整链路。

## 文件清单

```
app/
├── index.html    主页面（4 区单页应用）
├── style.css     全部样式（不引外部 CSS）
└── app.js        全部交互逻辑（不引外部 JS）
```

3 个文件加起来不到 30 KB。

## 4 区实现

### A. Idea Input

- `<textarea id="idea-input">` 默认填入 demo 想法
- `<button id="btn-generate">Generate Product Demo</button>`
- 页面加载时**自动填入**默认想法并触发一次渲染，这样用户进页面就看到完整 4 区

### B. AI Analyze

- 表格 6 字段，硬编码常量
- "Core Module" 字段加 `disabled` 标记，强调 ReadingCore-01 不可编辑
- 这一步在 Demo 里**不是真实 LLM 调用**，而是用固定 schema 模拟"AI 推理后会输出什么"

### C. Configurator

- 左侧表单：Lamp Type / Shell Style / Color / Engraving
- Lamp Type 是 `<select>`，Shell Style 是 `<select>`，Color 是 4 个色块按钮，Engraving 是 `<input>`
- 右侧 `<svg id="lamp-preview">` 渲染台灯
  - 不同 Style → 灯头轮廓变化（矩形 / 拱形 / 飞檐形 / 书页形）
  - 不同 Color → 外壳 fill 切换
  - Engraving → `<text>` 元素实时更新
  - Core 区域始终显示暖白 + "ReadingCore-01" 字样（不可变）

### D. Manufacturing Plan

- `<pre id="manufacturing-json">` 实时显示 JSON
- `<ol id="assembly-steps">` 显示装配步骤
- BOM 估算 / 打印时间固化在 JS 常量

## 哪些是 Mock

- ❌ **不真实采购** —— 不接任何电商 API
- ❌ **不真实 CAD/STL 生成** —— SVG 只是 mock 预览
- ❌ **不真实 LLM 调用** —— AI Analyze 区是硬编码常量
- ❌ **不真实制造计划成本** —— BOM 价格是估算范围，不是报价
- ❌ **不真实光路计算** —— 500-800 lm 是 ReadingCore-01 设计目标

## 哪些是真实可用的

- ✅ **4 区结构** —— 是真实可交互的单页应用
- ✅ **配置 + JSON 输出映射** —— 是真实运行的，输入改变 JSON 立刻改变
- ✅ **SVG 预览** —— 是真实根据选择渲染
- ✅ **架构思路** —— 是真实可用于指导实物设计的
- ✅ **装配步骤** —— 是真实可执行的（拿铝槽 + LED 灯带 + 螺丝刀可以复刻）

## 如何验证它不是"骗人 Demo"

1. **打开 `app/index.html`**，调整所有配置，确认 JSON 实时变化
2. **对照 `outputs/brief.md`**，确认架构表中的所有字段在 Demo 中都有体现
3. **对照 `outputs/task-plan.md`**，确认 4 区都按计划实现
4. **对照 `validation/acceptance-checklist.md`**，逐项验收

## 如何用这个 Demo 推进到实物

1. **找元器件** —— 按 Manufacturing Plan 中的"estimated_bom_cost"区间找 LED 灯带、铝槽、PC 扩散片
2. **3D 打印外壳** —— 按 SVG 预览的外形画真实 STL（这一步在 Demo 之外）
3. **装配** —— 按 assembly_steps 顺序操作
4. **测试** —— 亮度测试、热测试、眩光测试

## 与同 IDB 库中其他 Demo 的关系

| Demo | 解决什么问题 |
|------|------------|
| 项目记忆型会议助手 | 会后怎么推进 |
| 客户会议自主循环构建 | 客户需求怎么立刻出原型 |
| 多 Agent 项目管理面板 | 多 agent 怎么观测 |
| 手势实时视觉实验室 | 手势怎么驱动视觉 |
| **DIY Lamp Builder（本 Demo）** | **实体产品想法怎么变成可定制 Demo** |

它的特点是**最接近物理世界**，但仍是网页原型。