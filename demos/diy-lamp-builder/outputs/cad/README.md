# IDB-6C CAD Export Demo Pack

> **阶段：** IDB-6C
> **目标：** 在 IDB-6B 产品化 Demo 基础上，增加可导出的 CAD 示意文件与可选 STL 导出脚本，展示“想法 → 可定制实体产品 → 可制造几何”的完整链路。
> **状态：** demo-ready

---

## 本目录包含什么

| 文件 | 说明 |
|------|------|
| `readingcore-01-keepout.scad` | ReadingCore-01 固定灯芯模块的占位/隔离几何，用于 CAD 装配时确保外壳不侵犯散热与光路空间 |
| `sample-hutong-window-shell.scad` | 胡同窗棂风格外壳的 OpenSCAD 示例，参数化可调整宽度、高度、格栅数量 |
| `sample-config.json` | 与 `sample-hutong-window-shell.scad` 配套的参数配置文件，可被导出脚本读取 |
| `export-notes.md` | CAD 导出注意事项、OpenSCAD 安装提示、后续真实方向 |

这些文件均为**示意性几何**（mock geometry），用于演示链路，不替代真实工程 CAD。

---

## 设计原则

1. **ReadingCore-01 固定不变** — 光电模块、散热铝槽、M3 安装接口全部锁定。
2. **外壳与灯芯隔离** — 外壳只包裹在 `readingcore-01-keepout.scad` 的 keepout 体积之外，不接触 LED 与铝槽。
3. **结构分层** — LED → 铝槽 + 扩散罩 → 外壳；外壳不承担散热。
4. **参数化可扩展** — 通过 `sample-config.json` 可调整外壳尺寸，便于后续风格迁移。

---

## 快速使用

```bash
# 1. 安装 OpenSCAD（可选）
#    Ubuntu/Debian:  sudo apt install openscad
#    macOS:          brew install openscad
#    Windows:        https://openscad.org/downloads.html

# 2. 进入脚本目录
# cd scripts

# 3. 生成 STL（可选，若未安装 OpenSCAD 会显示 SKIP）
# bash export-openscad-stl.sh
```

---

## 与 IDB-6B 的差异

| 维度 | IDB-6B | IDB-6C |
|------|--------|--------|
| 输出 | 网页配置器 + 产品化文档 | 增加 CAD 示意文件 + 可选 STL 导出脚本 |
| 制造阶段 | 计划 JSON | 计划 JSON + 可导出几何 |
| 可制造性 | 规则说明 | 提供 keepout 与示例外壳几何 |
| 依赖 | 无外部依赖 | 仅脚本可选依赖 OpenSCAD CLI |

---

## 后续真实方向

- 用真实测量值替换 mock 尺寸
- 用真实 3D 打印/注塑工艺约束替代示意参数
- 引入 FEA/热仿真或光照仿真
- 接入真实 LLM parser 替代规则解析器
- 多外壳风格的批量 STL 导出
