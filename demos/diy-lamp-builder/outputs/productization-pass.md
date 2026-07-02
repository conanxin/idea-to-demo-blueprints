# IDB-6B Productization Pass

## 产品化目标

在 IDB-6 的 DIY Lamp Builder 基础上，把它从一个"可配置 Demo"升级为更像"产品原型工具"的可交互页面：

- 4 种 Shell Style 在视觉上明显不同
- 增加动态 BOM 成本模型，解释成本随 shell / 颜色变化的原因
- 增加 Idea → Config 轻量规则解析器
- 增加清晰的产品化流程 / Assembly Workflow
- 补全 productization-pass.md 和 bom-model.json 输出物
- 同步所有镜像和 Blueprint 文档

## 与 IDB-6 的差异

| 维度 | IDB-6 | IDB-6B |
|------|-------|--------|
| Manufacturing JSON | 简单字段 + assembly_steps | 扩展为 IDB-6B 完整结构，含 phase、core_locked、reading_target、core_stack、risk_notes |
| BOM 成本 | 固定范围 `$40-80 prototype` | 按 shell style 复杂度 + 颜色涂装动态计算 |
| Idea 解析 | 无解析，点击 Generate 只重新渲染 | 轻量规则解析器，4 个示例按钮可自动触发解析 |
| 装配流程 | 6 步文字列表 | 8 步，带状态标签（prototype-ready / manual / future-automation） |
| 预览 | 4 种外壳有基础差异 | 4 种外壳在轮廓、纹样、刻字位置上有明显差异 |
| 文档/页面 | IDB-6 基本版 | 增加 Productization Pass 章节、BOM 模型表、Idea Parser 规则表、Before/After |

## 新增成本模型

成本模型在 `demos/diy-lamp-builder/app/app.js` 中实现，核心函数：

- `calculateBom(styleName, colorName)`：计算基础元件 + shell + 涂装的总成本
- `formatBomRange(low, high)`：输出 `$58-126 prototype` 格式

Shell 复杂度乘数：

- Minimal Bar: 1.0
- Hutong Window: 1.25
- Beijing Pavilion: 1.45
- Book Arc: 1.35

基础 BOM 范围：

- 24V high-CRI LED strip: $8-18
- Aluminum channel + opal diffuser: $6-14
- 24V power adapter: $8-15
- Dimmer / controller: $4-12
- Wires / screws / M3 inserts: $2-5
- Base + arm mock: $10-25
- 3D printed shell: 按复杂度
- Finishing / paint: 按颜色

## 新增解析器规则

`parseIdeaToConfig(text)` 通过关键词匹配推荐配置：

- "孩子/儿童/睡前" → warm 2700K、Book Arc、low glare
- "北京/胡同/四合院/窗" → Hutong Window、Warm White / Hutong Gray
- "天坛/宫殿/中式/亭" → Beijing Pavilion、Palace Red
- "极简/黑色/工作/桌面" → Minimal Bar、Night Black、600-800 lm
- "书卷/床头/弧形" → Book Arc
- "阅读/读书/书桌/图书" → Reading Lamp、ReadingCore-01

## 4 种 Shell 设计

- **Minimal Bar**：极简长条、圆角、干净线条，适合现代桌面
- **Hutong Window**：窗棂网格/格栅，体现北京胡同元素
- **Beijing Pavilion**：屋檐/檐口轮廓，带中式亭阁屋顶线
- **Book Arc**：书页弧线/拱形灯罩，适合床头/阅读场景

## 后续真实方向

- 真实 CAD / STL 导出（OpenSCAD / SVG-to-CAD）
- 真实元器件 sourcing
- 真实亮度/照度测试
- 接入真实 LLM parser 替代规则解析器
- 更多颜色和材质选项
