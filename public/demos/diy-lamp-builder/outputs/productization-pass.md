# IDB-6C CAD Export Pass

## 产品化目标

在 IDB-6B 的 DIY Lamp Builder 基础上，增加可导出的 CAD 示意文件与可选的 STL 导出脚本，把“想法 → 可定制实体产品”进一步延伸到“可制造几何”：

- 新增 `outputs/cad/` 目录，包含 keepout 与示例外壳 OpenSCAD 文件
- 新增 `outputs/cad/sample-config.json` 参数配置示例
- 新增 `scripts/export-openscad-stl.sh` 可选导出脚本
- 更新 README.md、productization-pass.md、acceptance-checklist.md
- 同步所有镜像与 Blueprint 文档

## 与 IDB-6B 的差异

| 维度 | IDB-6B | IDB-6C |
|------|--------|--------|
| 输出 | 网页配置器 + 产品化文档 | 增加 CAD 示意文件 + 可选 STL 导出脚本 |
| 制造阶段 | 计划 JSON | 计划 JSON + 可导出几何 |
| 可制造性 | 规则说明 | 提供 keepout 与示例外壳几何 |
| 依赖 | 无外部依赖 | 仅脚本可选依赖 OpenSCAD CLI |

## CAD 文件说明

| 文件 | 作用 |
|------|------|
| `readingcore-01-keepout.scad` | ReadingCore-01 固定灯芯模块的不可侵犯空间占位 |
| `sample-hutong-window-shell.scad` | 胡同窗棂风格外壳参数化示例 |
| `sample-config.json` | 与示例外壳配套的参数配置文件 |
| `export-notes.md` | 安装、导出命令、设计约束与后续方向 |
| `scripts/export-openscad-stl.sh` | 可选 STL 导出脚本；未安装 OpenSCAD 时输出 SKIP |

## 导出脚本行为

```bash
cd demos/diy-lamp-builder/scripts
bash export-openscad-stl.sh
```

1. 检查 `openscad` 是否在 PATH 中。
2. 若未安装：输出 `SKIP` 与安装提示，退出码 0（非错误）。
3. 若已安装：读取 `outputs/cad/sample-config.json`，创建 `outputs/cad/stl/` 目录，导出两个 STL 文件。

## 结构正确性保留

- ReadingCore-01 固定不变，外壳通过 keepout 与其隔离。
- LED → 铝槽 + 扩散罩 → 外壳 的三层结构不变。
- 外壳不承担散热。

## 后续真实方向

- 替换 mock 尺寸为真实 ReadingCore-01 工程图纸尺寸。
- 为 4 种 Shell Style 分别建立 SCAD 文件。
- 增加外壳与铝槽的卡扣/螺丝柱细节。
- 增加 FDM 3D 打印可制造性检查（壁厚、悬空、支撑）。
- 增加光照方向与扩散罩光学模拟。

---

# IDB-6B Productization Pass

## 产品化目标

在 IDB-6 的 DIY Lamp Builder 基础上，把它从一个"可配置 Demo"升级为更像"产品原型工具"的可交互页面，并在 IDB-6C 中进一步扩展为可导出 CAD 示意文件与可选 STL 脚本：

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
| BOM 成本 | 动态 BOM range，例如 `$58-126 prototype` | 按 shell style 复杂度 + 颜色涂装动态计算 |
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

## 已纳入 IDB-6C 的 CAD 导出方向

- 增加 `outputs/cad/` OpenSCAD 示意文件与 `sample-config.json`
- 增加可选 `scripts/export-openscad-stl.sh` STL 导出脚本
- 保持无外部依赖：OpenSCAD 为可选，未安装时脚本输出 SKIP

## 仍待后续真实方向

- 用真实工程尺寸替换所有 mock 尺寸
- 为 4 种 Shell Style 分别建立 SCAD 文件
- 真实元器件 sourcing
- 真实亮度/照度测试
- 接入真实 LLM parser 替代规则解析器
- 更多颜色和材质选项
