# CAD Export Notes

> IDB-6C CAD Export Demo Pack

---

## 1. 这些 CAD 文件是什么

本目录下的 `.scad` 文件是**示意性 CAD 几何**（mock geometry），用于展示：

- `readingcore-01-keepout.scad` — ReadingCore-01 固定灯芯模块的不可侵犯空间。
- `sample-hutong-window-shell.scad` — 一个参数化的胡同窗棂风格外壳。

它们**不替代真实工程 CAD**，所有尺寸均可在后续用真实测量值替换。

---

## 2. 如何渲染 STL（可选）

### 2.1 安装 OpenSCAD

- **Ubuntu / Debian**：
  ```bash
  sudo apt update
  sudo apt install openscad
  ```
- **macOS**：
  ```bash
  brew install openscad
  ```
- **Windows**：
  访问 https://openscad.org/downloads.html 下载安装包，并确保 `openscad.com` 或 `openscad.exe` 在系统 PATH 中。

### 2.2 使用脚本导出

```bash
cd demos/diy-lamp-builder/scripts
bash export-openscad-stl.sh
```

脚本会：

1. 检查 `openscad` 是否可用。
2. 若可用，读取 `outputs/cad/sample-config.json`，创建 `outputs/cad/stl/` 目录，并导出两个 STL 文件。
3. 若不可用，输出 `SKIP` 并提示用户安装 OpenSCAD。

### 2.3 手动导出

```bash
openscad -o outputs/cad/stl/readingcore-01-keepout.stl outputs/cad/readingcore-01-keepout.scad
openscad -D shell_length=340 -D shell_width=40 -D shell_height=35 -D window_count=5 \
         -o outputs/cad/stl/sample-hutong-window-shell.stl outputs/cad/sample-hutong-window-shell.scad
```

---

## 3. 设计约束

- **Keepout 完整**：外壳任何部分不得进入 `readingcore-01-keepout.scad` 定义的体积。
- **结构分层**：LED → 铝槽 + 扩散罩 → 外壳；外壳不接触 LED，不承担散热。
- **装配间隙**：外壳内壁与 keepout 至少保留 2mm 装配间隙。
- **M3 安装接口**：两端安装孔不可被外壳遮挡。

---

## 4. 后续真实方向

- 替换 mock 尺寸为真实 ReadingCore-01 工程图纸尺寸。
- 为 4 种 Shell Style（Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc）分别建立 SCAD 文件。
- 增加外壳与铝槽的卡扣/螺丝柱细节。
- 增加 FDM 3D 打印可制造性检查（壁厚、悬空、支撑）。
- 增加光照方向与扩散罩光学模拟。

---

## 5. 依赖说明

- **OpenSCAD**：仅脚本可选依赖；若未安装，Demo 仍可用，仅 STL 导出显示 SKIP。
- **无其他外部依赖**：不依赖 npm/pip/docker/LLM API。
