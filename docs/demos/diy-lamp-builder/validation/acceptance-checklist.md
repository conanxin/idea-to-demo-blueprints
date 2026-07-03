# 验收清单：DIY Lamp Builder Demo

> 所有项目必须勾选为 [x]，Demo 才算 demo-ready。

---

## 文件结构验收

- [x] `demos/diy-lamp-builder/README.md` 存在
- [x] `demos/diy-lamp-builder/inputs/source-idea.md` 存在
- [x] `demos/diy-lamp-builder/inputs/background.md` 存在
- [x] `demos/diy-lamp-builder/inputs/transcript.md` 存在
- [x] `demos/diy-lamp-builder/prompts/build-prompt.md` 存在
- [x] `demos/diy-lamp-builder/outputs/brief.md` 存在
- [x] `demos/diy-lamp-builder/outputs/task-plan.md` 存在
- [x] `demos/diy-lamp-builder/outputs/generated-demo-notes.md` 存在
- [x] `demos/diy-lamp-builder/app/index.html` 存在
- [x] `demos/diy-lamp-builder/app/style.css` 存在
- [x] `demos/diy-lamp-builder/app/app.js` 存在
- [x] `demos/diy-lamp-builder/validation/acceptance-checklist.md` 存在（本文档）

## 镜像验收

- [x] `docs/diy-lamp-builder.md` 存在（Blueprint doc）
- [x] `docs/demos/diy-lamp-builder/index.html` 存在（跳转页）
- [x] `docs/demos/diy-lamp-builder/app/index.html` 存在
- [x] `docs/demos/diy-lamp-builder/app/style.css` 存在
- [x] `docs/demos/diy-lamp-builder/app/app.js` 存在
- [x] `docs/blueprints/diy-lamp-builder.html` 存在
- [x] `public/demos/diy-lamp-builder/index.html` 存在
- [x] `public/demos/diy-lamp-builder/app/index.html` 存在
- [x] `public/demos/diy-lamp-builder/app/style.css` 存在
- [x] `public/demos/diy-lamp-builder/app/app.js` 存在
- [x] `public/blueprints/diy-lamp-builder.html` 存在
- [x] `docs/media/demo-diy-lamp-builder.png` 存在
- [x] `public/media/demo-diy-lamp-builder.png` 存在

## Blueprint 元数据验收

- [x] `data/blueprints.json` 包含 5 个 blueprints
- [x] `data/blueprints.json` `meta.total` = 5
- [x] `docs/data/blueprints.json` 与 `data/blueprints.json` sha256 完全一致
- [x] `public/data/blueprints.json` 与 `data/blueprints.json` sha256 完全一致
- [x] `meta.last_updated` = "2026-07-03"
- [x] `meta.version` = "4.2"（catalog schema 版本，未升级）
- [x] 项目版本徽章 `v0.1.1-alpha` 在 README.md / docs/index.html / public/index.html 中保留
- [x] 新 blueprint slug = `diy-lamp-builder`
- [x] 新 blueprint status = `demo-ready`
- [x] 新 blueprint 含 page_url / demo_url / demo_pack_path / md_url

## 功能验收

- [x] 打开 `app/index.html`，默认填入 "北京风格阅读台灯，外壳可定制，适合书桌使用"
- [x] 页面加载后自动渲染 4 区内容
- [x] 4 区依次为：Idea Input / AI Analyze / Configurator / Manufacturing Plan
- [x] AI Analyze 显示 7 字段（Use Case / Core Choice / Brightness Target / Color Temperature / Shell Style / Glare Strategy / Estimated Position）
- [x] Configurator Lamp Type 有 2 选项：Reading Lamp / Ambient Lamp
- [x] Configurator Shell Style 有 4 选项：Minimal Bar / Hutong Window / Beijing Pavilion / Book Arc
- [x] Configurator Color 有 4 选项：Warm White / Hutong Gray / Palace Red / Night Black
- [x] Configurator Engraving 是文本输入框，实时显示在底座或灯头上
- [x] Configurator Core 字段固定显示 "ReadingCore-01"，不可编辑
- [x] 改变任何配置，SVG 预览实时更新（4 种外壳明显不同）
- [x] 改变任何配置，Manufacturing Plan JSON 实时更新
- [x] Manufacturing Plan 包含 `assembly_steps` 数组，8 步，带状态标签
- [x] BOM 成本随 shell style 和颜色变化
- [x] 4 个示例 idea button 可更新配置
- [x] Manufacturing JSON 含 `phase: IDB-6C`

## 结构正确性验收

- [x] Demo 中明确写出"LED 灯带贴铝槽 + 乳白扩散罩 + 外壳装配"三层结构
- [x] Demo 中明确写出"外壳不接触 LED，不承担散热"
- [x] Demo 中明确写出 ReadingCore-01 是固定模块，不可变

## 依赖验收

- [x] 不引入任何 CDN
- [x] 不引入 build step（webpack/vite/npm）
- [x] 不引入 Three.js / 任何 3D 库
- [x] 不引入 jQuery / Vue / React / Svelte / Solid 等前端框架
- [x] 纯原生 HTML/CSS/JS
- [x] 不引用外部图片资源（截图除外）
- [x] 不引用 Google Fonts（用 system font stack）

## 安全验收

- [x] 不包含真实 API key / token / secret
- [x] 不包含真实采购链接
- [x] 不发起真实支付
- [x] 不发起真实 LLM API 调用
- [x] 不发起真实 CAD / STL 生成

## 复现验收

- [x] `prompts/build-prompt.md` 提供完整可复制 Prompt
- [x] README.md 提供分步复现说明
- [x] 所有 mock 部分在 `generated-demo-notes.md` 中明确标注
- [x] GitHub Pages 预计可访问路径：`/demos/diy-lamp-builder/`

## 元脚本验收

- [x] `scripts/check-catalog.sh` 不再硬编码 `total=3`
- [x] `scripts/check-catalog.sh` 遍历 `blueprints[].slug` 动态检查文件
- [x] `bash scripts/check-catalog.sh` 输出 `RESULT: PASS`

## IDB-6B.1 Polish Fix Acceptance

- [x] Removed stale current-stage copy that described AI Analyze as hardcoded constants.
- [x] Removed stale $40-80 prototype current-cost reference and updated to dynamic BOM range wording.
- [x] Kept historical “IDB-6 → IDB-6B” comparison intact.
- [x] Updated updated_phase to IDB-6B.1 in all three synchronized blueprint JSON files.
- [x] Did not add a 6th Blueprint; meta.total remains 5.
- [x] Preserved project version v0.1.1-alpha and catalog schema 4.2.
- [x] Browser smoke is optional and recorded as SKIP in the phase report.

## IDB-6B.2 Blueprint Mirror Fix Acceptance

- [x] Removed stale “AI Analyze 区是硬编码常量” from visible Blueprint/docs/public mirror pages.
- [x] Removed stale $40-80 prototype from visible Blueprint/docs/public mirror pages.
- [x] Preserved historical “IDB-6 → IDB-6B” comparison.
- [x] Updated updated_phase to IDB-6B.2 in all synchronized blueprint JSON files.
- [x] Did not add a 6th Blueprint; meta.total remains 5.
- [x] Preserved project version v0.1.1-alpha and catalog schema 4.2.

## IDB-6C CAD Export Acceptance

- [x] `demos/diy-lamp-builder/outputs/cad/README.md` 存在并说明 IDB-6C 目标
- [x] `demos/diy-lamp-builder/outputs/cad/readingcore-01-keepout.scad` 存在，定义 ReadingCore-01 不可侵犯空间
- [x] `demos/diy-lamp-builder/outputs/cad/sample-hutong-window-shell.scad` 存在，参数化示例外壳
- [x] `demos/diy-lamp-builder/outputs/cad/sample-config.json` 存在，可配置关键参数
- [x] `demos/diy-lamp-builder/outputs/cad/export-notes.md` 存在，包含安装、导出命令与约束
- [x] `demos/diy-lamp-builder/scripts/export-openscad-stl.sh` 存在且可执行（chmod +x）
- [x] 脚本在未安装 OpenSCAD 时输出 `SKIP` 并给出安装提示
- [x] 脚本在已安装 OpenSCAD 时导出 `readingcore-01-keepout.stl` 和 `sample-hutong-window-shell.stl`
- [x] `README.md` 阶段更新为 IDB-6C，并包含 CAD/脚本引用
- [x] `outputs/productization-pass.md` 包含 IDB-6C CAD Export Pass 章节
- [x] `validation/acceptance-checklist.md` 包含 IDB-6C CAD Export Acceptance 章节
- [x] `docs/demos/diy-lamp-builder/` 镜像包含上述更新
- [x] `public/demos/diy-lamp-builder/` 镜像包含上述更新
- [x] 未引入新的外部依赖（OpenSCAD 为可选，脚本不强制安装）

## IDB-6D CAD Validation + Print Orientation + Slicer Profile Acceptance

- [x] Print Validation section visible in `app/index.html`.
- [x] `validateCadParams` implemented in `app.js`.
- [x] `buildPrintOrientationPlan` implemented in `app.js`.
- [x] `buildSlicerProfile` implemented in `app.js`.
- [x] `generateFitTestCouponScad` implemented in `app.js`.
- [x] Download Fit-Test .scad button present.
- [x] Download Slicer Profile button present.
- [x] Download Validation Report JSON button present.
- [x] `outputs/cad-validation/` directory added with README, rules, orientation, slicer profiles, coupon, logs, report template.
- [x] `fit-test-coupon.scad` exists and contains required modules.
- [x] `slicer-profile-prusaslicer.ini` exists with baseline values.
- [x] `validate-cad-export.py` runs and reports PASS.
- [x] OpenSCAD export reports PASS or SKIP if CLI missing.
- [x] `bash scripts/check-catalog.sh` still PASS.
- [x] No 6th Blueprint added; meta.total remains 5.
- [x] Project version remains v0.1.1-alpha and catalog schema remains 4.2.
- [x] Updated `docs/diy-lamp-builder.md` and blueprints HTML with IDB-6D section.
- [x] Synchronized all three mirrors (demos, docs, public).

## IDB-6C.1 Pages Demo Refresh Fix Acceptance

- [x] Demo app is already IDB-6C and contains CAD Export.
- [x] Redirect / entry page title synchronized to IDB-6C CAD Export.
- [x] Added IDB-6C.1-pages-refresh build marker to entry pages.
- [x] updated_phase set to IDB-6C.1 in all three synchronized blueprint JSON files.
- [x] Did not add a 6th Blueprint; meta.total remains 5.
- [x] Preserved project version v0.1.1-alpha and catalog schema 4.2.
