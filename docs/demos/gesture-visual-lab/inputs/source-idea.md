# 原始想法：手势实时视觉实验室

> 来源：方案 IDB-5 — 手势实时视觉实验室 (GestureVisual Lab)

---

## 原始文本

"最近有个爆款视频：一双手在摄像头前快速变换动作，屏幕上就跟着出现夸张的 3D 故障视觉——画面挤压、扭曲、闪烁、色彩切换，像把 Figma 和 Photoshop 打垮了一样。看起来很惊艳，但更值得拆解的是背后的真实技术链路：摄像头 → 手部关键点 → 手势语义 → 视觉参数映射。

如果把这套链路整理成一个可复现的 Blueprint，再让 Claude / Agent 辅助生成 TouchDesigner Python DAT 脚本和 Web 交互模拟器，创意技术人员就能在 2-3 天内做出来一个属于自己风格的实时视觉 Demo。"

---

## 想法的关键洞察

1. **爆款视频 vs 可复现 Blueprint 是两件事** — 视频带来灵感，但 Blueprint 带来技能
2. **真实链路是结构化的** — 不是"创作者的个人直觉"，而是清晰的输入 → 语义 → 视觉映射
3. **AI Agent 可以辅助生成** — TouchDesigner Python DAT + MediaPipe 集成代码可以用 prompt 驱动 Claude / Codex 生成
4. **Web 模拟器有独立价值** — 即使没有 TouchDesigner 的人也能理解手势映射逻辑

---

## 为什么这个想法值得拆解

- **学习价值** — 把"爆款效果"拆成可学习的 7 项手势映射规则
- **复用价值** — 映射规则文档可被 AI Agent 复用，prompt 模板可驱动脚本生成
- **教学价值** — 可作为创意技术 / TouchDesigner / MediaPipe 学习入门
- **创作价值** — 设计师、VJ、互动装置艺术家可以直接用身体控制视觉

---

## 不做什么

- ❌ 不承诺"已经跑通 TouchDesigner 真机工程"
- ❌ 不提交 .toe / .tox 等 TouchDesigner 二进制文件
- ❌ 不调用真实摄像头做 Web Demo（GitHub Pages 静态部署 + 隐私考虑）
- ❌ 不使用构建框架（HTML/CSS/JS/Markdown/JSON/Bash 为主）
- ❌ 不创建 tag 或 GitHub Release（保持 v0.1.1-alpha baseline）

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
