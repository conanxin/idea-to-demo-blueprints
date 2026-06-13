# Demo 演示笔记

> 用途：演示 GestureVisual Lab Demo 时的讲解要点  
> 阶段：IDB-5

---

## 1. 开场（30 秒）

**关键信息：**

- "这是一个手势实时视觉实验室 Blueprint"
- "Demo 是 companion demo / 交互模拟器，不调用摄像头"
- "真机版需要本地 TouchDesigner + MediaPipe 插件"
- "我们演示的是手势到视觉的映射规则"

---

## 2. 核心演示（3 分钟）

### 2.1 演示位置映射（30 秒）

- "双手中点控制 cube 位置"
- 拖动两个手点 → 看 cube 跟随移动
- 解释："双手合在一起时，cube 在屏幕中心；分开到边缘时，cube 也跟着移动"

### 2.2 演示缩放映射（30 秒）

- "双手距离控制 cube 缩放"
- 拉远两个手点 → 看 cube 变大
- 拉近两个手点 → 看 cube 变小
- 解释："双手张开越大，cube 越大"

### 2.3 演示旋转映射（30 秒）

- "双手连线角度控制 cube 旋转"
- 让两个手点上下错位 → 看 cube 倾斜
- 解释："双手连线旋转时，cube 跟随旋转"

### 2.4 演示捏合 → 噪点（30 秒）

- "左手捏合控制噪点强度"
- 拉 Left Pinch slider → 看 cube 颜色变化、对比度变化
- 解释："左手捏合时画面变得扭曲"

### 2.5 演示捏合 → 主题（30 秒）

- "右手捏合切换颜色主题"
- 拉 Right Pinch slider → 看主题切换（neon / mono / cyber）
- 解释："右手捏合时颜色主题切换"

### 2.6 演示 Glitch（30 秒）

- "快速移动触发 glitch 闪烁"
- 拉 Movement Speed slider 到 0.8+ → 看 glitch 闪烁
- 解释："快速移动时画面闪烁"

### 2.7 演示 Freeze（30 秒）

- "双手握拳触发 freeze frame"
- 打开 Both Fists Freeze toggle → 看视觉暂停
- 解释："双手握拳时画面暂停"

---

## 3. 演示参数面板（1 分钟）

"右侧参数面板实时显示 9-10 项核心参数，包括中心位置、距离、角度、缩放、旋转、捏合度、glitch 状态、freeze 状态。"

- 指出每个参数如何变化
- 说明"参数面板是映射规则的可视化"

---

## 4. 关键边界声明（30 秒）

"⚠️ 这是 Web 模拟器，不调用真实摄像头。"

"真机版需要本地 TouchDesigner + MediaPipe TouchDesigner 插件。"

"本仓库不提交 .toe 二进制文件，用户需在本地新建。"

"Web 端用 CSS filter 模拟基础效果，不模拟 TouchDesigner GLSL 高级效果。"

---

## 5. 讲解技术架构（1 分钟）

```
输入层（Web: 拖动手点 | TD: 摄像头 + MediaPipe）
  ↓
手势语义层（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳）
  ↓
视觉映射层（位置 / 缩放 / 旋转 / 噪点 / 主题 / glitch / freeze）
  ↓
视觉输出层（Web: CSS 3D | TD: GLSL shader）
```

"这是结构化的链路，不是创作者的个人直觉。"

---

## 6. 讲解 AI 辅助（30 秒）

"我们提供了两个核心 Prompt："

- "Prompt A：生成 TouchDesigner Python DAT 脚本"
- "Prompt B：生成 Web Demo 代码"

"AI Agent 可以基于这两个 Prompt 帮用户快速生成代码，但用户需要在本地环境调试。"

---

## 7. 扩展讨论（2 分钟，可选）

- 真实摄像头集成
- 多人多手支持
- 手势 → MIDI 映射
- 手势录制与回放
- TouchDesigner 真实插件打包

---

## 8. 结尾（30 秒）

"这个 Blueprint 的核心价值是："

- "把爆款视频的技术链路拆成可复现的结构化资产"
- "让 AI Agent 能辅助生成 TouchDesigner Python DAT"
- "让创意技术人员能在 2-3 天内做出来属于自己的实时视觉 Demo"
- "Web Demo 是入门，真机版需要本地 TouchDesigner"

---

## 9. FAQ（常见问题）

### Q1：为什么不调用真实摄像头？
A：GitHub Pages 静态部署 + 隐私考虑。Web Demo 用拖动手点 + slider 作为"mock 手势"，更可控、更适合讲解。

### Q2：真机版需要什么？
A：本地 TouchDesigner Non-Commercial + MediaPipe TouchDesigner 插件 + 普通 USB 摄像头。

### Q3：为什么仓库里没有 .toe 文件？
A：.toe 是二进制文件，体积大且不适合版本控制。用户需在本地新建 .toe，按节点图规划复制节点结构。

### Q4：CSS filter 和 TouchDesigner GLSL 效果差异大吗？
A：差异大。CSS filter 只能模拟基础效果（噪点、色相、对比度）；GLSL shader 可实现复杂的几何变换和粒子系统。

### Q5：AI 辅助生成的代码可靠吗？
A：AI 生成的是参考实现，用户需要在本地环境调试。建议先用 Prompt 驱动生成代码，再按本地节点结构修改。

### Q6：可以扩展到其他手势吗？
A：可以。新增手势 = 新增映射规则。每个映射是纯函数，可独立测试。

### Q7：可以多人多手吗？
A：可以，但需要修改 MediaPipe CHOP 的 max_hands 参数，以及增加更多视觉通道。

### Q8：可以做产品级方案吗？
A：本 Blueprint 是"教学 / 学习用"。要做产品级方案还需要工程化（错误处理、性能优化、多人协作）。

---

## 10. 演示前的准备

### 检查清单

- [ ] 本地 HTTP 服务运行（python3 -m http.server 8080）
- [ ] 三个 URL 可访问
  - http://127.0.0.1:8080/
  - http://127.0.0.1:8080/blueprints/gesture-visual-lab.html
  - http://127.0.0.1:8080/demos/gesture-visual-lab/
- [ ] 浏览器 Chrome / Firefox / Safari 最新版
- [ ] 鼠标可拖动手点
- [ ] Slider 可调节
- [ ] Toggle 可切换
- [ ] Reset 按钮可点击
- [ ] 参数面板实时显示

### 现场检查

- [ ] 投影 / 屏幕分辨率适配
- [ ] 鼠标 / 触控板可用
- [ ] 网络稳定（虽然 Demo 是本地）

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
