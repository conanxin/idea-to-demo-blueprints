# 验收清单：GestureVisual Lab Demo

> 阶段：IDB-5  
> 状态：demo-ready

---

## 功能验收

### Web Demo 交互

- [x] 打开 `app/index.html` 立即可交互，无需登录 / 授权 / 安装
- [x] 两个手点（Left Hand / Right Hand）可拖动（鼠标 + 触摸）
- [x] Left Pinch slider 可调节（0-1）
- [x] Right Pinch slider 可调节（0-1）
- [x] Movement Speed slider 可调节（0-1）
- [x] Both Fists Freeze toggle 可切换
- [x] Reset 按钮可重置所有参数到初始状态

### 7 项手势映射

- [x] 双手中点 → cube 位置（translate_x, translate_y）
- [x] 双手距离 → cube 缩放（scale ∈ [0.5, 2.0]）
- [x] 双手连线角度 → cube 旋转（rotation_z）
- [x] Left Pinch → 噪点强度（CSS filter contrast / hue-rotate）
- [x] Right Pinch → 颜色主题切换（neon / mono / cyber）
- [x] Movement Speed > 0.7 → glitch 闪烁（CSS animation + filter）
- [x] Freeze toggle → 视觉暂停（不更新 transform）

### 参数面板

- [x] center_x / center_y 实时显示
- [x] distance 实时显示
- [x] angle 实时显示（度）
- [x] scale 实时显示
- [x] rotation 实时显示
- [x] left_pinch / right_pinch 实时显示
- [x] glitch 状态实时显示
- [x] freeze 状态实时显示

---

## 质量验收

### 技术约束

- [x] 不依赖外部 CDN（所有代码 inline 或本地）
- [x] 不使用构建步骤（直接打开 index.html 即可）
- [x] 不提交 .toe / .tox 等 TouchDesigner 二进制文件
- [x] 移动端可基本使用（touch events 兼容）
- [x] 代码内有简短注释（每个函数说明输入输出）
- [x] mapping 函数明确分离（getCenter / getDistance / getAngle / mapRange / updateCube / triggerGlitch / switchTheme / freezeFrame）

### 内容约束

- [x] 不含 OPENAI_API_KEY / ANTHROPIC_API_KEY / TELEGRAM_BOT_TOKEN
- [x] 不含 password / secret / token 等敏感信息
- [x] Web Demo 显著位置标注"交互模拟器 / companion demo"
- [x] 不写"已经跑通 TouchDesigner 真机工程"的虚假结论
- [x] 参考资源包含 MediaPipe + TouchDesigner + MediaPipe-TouchDesigner 插件三个核心链接

### 视觉约束

- [x] 顶部有标题 + 返回链接 + demo 状态标注
- [x] 左侧控制区布局清晰
- [x] 中间 cube stage 居中显示
- [x] 右侧参数面板等宽对齐
- [x] 底部说明区显示真机版依赖
- [x] 主题切换有视觉差异（neon 紫红 / mono 黑白 / cyber 青绿）

---

## 数据验收

### JSON 数据

- [x] `data/blueprints.json` 是合法 JSON
- [x] `docs/data/blueprints.json` 是合法 JSON
- [x] 两个文件完全同步（sha256 一致）
- [x] 包含 4 个 blueprint 条目（已有 3 个 + 新增 gesture-visual-lab）
- [x] 新条目字段完整（id / title / title_en / slug / summary / category / difficulty / difficulty_en / demo_time / demo_time_en / audience / audience_en / tags / status / created_at / updated_at / page_url / demo_url / demo_pack_path / md_url / created_phase / updated_phase）
- [x] meta.total = 4
- [x] meta.last_updated = 2026-06-13
- [x] 新条目 status = "demo-ready"
- [x] 不破坏已有 3 个条目

### Demo Pack 完整性

- [x] `README.md` — 复现说明
- [x] `inputs/source-idea.md` — 原始想法
- [x] `inputs/source-analysis.md` — 爆款视频技术链路拆解
- [x] `inputs/technical-background.md` — MediaPipe + TouchDesigner 技术背景
- [x] `prompts/touchdesigner-python-dat-prompt.md` — TouchDesigner Python DAT Prompt + 参考实现
- [x] `prompts/static-demo-build-prompt.md` — Web Demo Prompt
- [x] `outputs/blueprint-brief.md` — Blueprint 摘要
- [x] `outputs/gesture-mapping-model.md` — 手势映射模型
- [x] `outputs/touchdesigner-network-plan.md` — TouchDesigner 节点图规划
- [x] `outputs/demo-notes.md` — Demo 演示笔记
- [x] `app/index.html` — Web Demo 入口
- [x] `app/style.css` — 样式
- [x] `app/app.js` — 手势映射 + cube 更新逻辑
- [x] `validation/acceptance-checklist.md` — 本文件

### 蓝图文档

- [x] `docs/gesture-visual-lab.md` — Markdown blueprint（按模板完整结构）
- [x] `docs/blueprints/gesture-visual-lab.html` — HTML blueprint 页面
- [x] `public/blueprints/gesture-visual-lab.html` — 同步镜像

---

## 发布验收

### 本地预览

- [x] `python3 -m http.server 8080` 启动成功
- [x] http://127.0.0.1:8080/ 返回 HTTP 200
- [x] http://127.0.0.1:8080/blueprints/gesture-visual-lab.html 返回 HTTP 200
- [x] http://127.0.0.1:8080/demos/gesture-visual-lab/ 返回 HTTP 200

### GitHub Pages

- [x] 仓库推到 main 分支
- [x] Pages URL 可访问
- [x] https://conanxin.github.io/idea-to-demo-blueprints/ 返回 HTTP 200
- [x] https://conanxin.github.io/idea-to-demo-blueprints/blueprints/gesture-visual-lab.html 返回 HTTP 200
- [x] https://conanxin.github.io/idea-to-demo-blueprints/demos/gesture-visual-lab/ 返回 HTTP 200

### Catalog 检查

- [x] `bash scripts/check-catalog.sh` 现有版本对 3 个 blueprint 校验通过
- [ ] 新增第 4 条目后，`scripts/check-catalog.sh` 需要更新（下一步）

---

## 已知限制（明确不修）

- [x] Web Demo 不调用真实摄像头（GitHub Pages 静态部署 + 隐私考虑）
- [x] 本仓库不提交 TouchDesigner .toe / .tox 二进制
- [x] Web 端 CSS filter 无法模拟 TouchDesigner GLSL 高级效果
- [x] AI Agent 辅助脚本可能需要多轮迭代
- [x] 本 Blueprint 是"教学 / 学习用"，不是"产品级方案"

---

## 边界声明（重要）

- ✅ status = "demo-ready" 因为：
  - Web Demo 可打开、可交互
  - Demo Pack 完整（README + inputs + prompts + outputs + app + validation）
  - 验收清单完成
  - Markdown + HTML blueprint 都已生成

- ✅ 没有虚假结论："已经跑通 TouchDesigner 真机工程" → 明确标注真机需要本地环境

- ✅ 没有引入构建框架：纯 HTML/CSS/JS/Markdown/JSON/Bash

- ✅ 没有创建 tag 或 GitHub Release：保持 v0.1.1-alpha baseline

---

## 验收结果

**总体结果：PASS**

本 Blueprint 已完成所有 IDB-5 阶段要求的交付物：
- Markdown blueprint（完整结构）
- HTML blueprint 页面
- Web Demo Pack（README + inputs + prompts + outputs + app + validation）
- 静态 Web Demo（可打开、可交互）
- TouchDesigner Python DAT Prompt + 参考实现
- 数据文件同步更新
- 首页更新
- 本地预览验证
- 推送验证

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
