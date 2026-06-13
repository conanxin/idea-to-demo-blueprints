# Blueprint Brief: GestureVisual Lab

> 用途：Blueprint 摘要文档，用于快速理解方案核心  
> 阶段：IDB-5

---

## 1. 方案标题

手势实时视觉实验室 (GestureVisual Lab)

---

## 2. 核心目标

把"摄像头 + MediaPipe + TouchDesigner + AI 辅助脚本"这套技术方案整理成可复现的 Blueprint，并构建一个可打开的静态交互 Demo Pack。

---

## 3. 解决的问题

| 问题 | 影响 |
|------|------|
| 工具门槛高 | TouchDesigner 节点图 + Python DAT 学习曲线陡峭 |
| 手势追踪方案分散 | 没有选型标准 |
| 手势到视觉映射不可记录 | 设计师个人直觉，无法复现 |
| AI 辅助脚本缺位 | TouchDesigner Python 集成没 prompt 模板 |
| 缺少可解释 Demo | 观众看到结果，但不知道底层链路 |

---

## 4. 核心洞察

**"爆款视频"和"可复现 Blueprint"是两件事。**

视频带来灵感，Blueprint 带来技能。本方案把"一双手控制 3D 故障视觉"的爆款链路拆成 4 层：

1. **输入层** — 摄像头 + MediaPipe Hand Landmarker
2. **语义层** — 双手中点 / 距离 / 角度 / 捏合 / 速度 / 握拳
3. **映射层** — 语义 → 视觉参数（位置 / 缩放 / 旋转 / 噪点 / 主题 / glitch / freeze）
4. **视觉层** — TouchDesigner 节点图 + GLSL

---

## 5. MVP (Gesture Cube Lite)

7 项核心手势到视觉映射：

| 手势输入 | 视觉输出 | 映射 |
|---------|---------|------|
| 双手中点 | cube 位置 | mapRange(center, -1, 1, -2, 2) |
| 双手距离 | cube 缩放 | mapRange(distance, 0.2, 1.5, 0.5, 2.0) |
| 双手角度 | cube 旋转 | angle 直接赋值 |
| 左手捏合 | 噪点强度 | mapRange(pinch, 0, 1, 0, 1) |
| 右手捏合 | 主题切换 | neon / mono / cyber |
| 移动速度 | glitch 闪烁 | speed > 0.7 开启 |
| 双手握拳 | freeze | freeze=true 暂停 |

---

## 6. 三层交付

| 层 | 内容 | 形式 |
|----|------|------|
| **真实运行层** | TouchDesigner + MediaPipe 真机 | 本地 .toe（不提交二进制） |
| **Web 模拟器** | HTML/CSS/JS 拖动手点 | GitHub Pages 静态部署 |
| **AI 辅助层** | TouchDesigner Python DAT Prompt | prompt 模板 + 参考实现 |

---

## 7. 目标用户

- 创意技术学习者
- 视觉设计师 / VJ
- AI Agent 使用者
- 独立创作者
- 互动装置艺术家
- 教学场景（workshop）

---

## 8. 边界声明（重要）

- ✅ Web Demo 是 companion demo / 交互模拟器，不调用摄像头
- ✅ 真机版需要本地 TouchDesigner + MediaPipe TouchDesigner 插件
- ✅ 本仓库**不提交** TouchDesigner .toe / .tox 二进制
- ✅ 不使用构建框架（HTML/CSS/JS/Markdown/JSON）
- ✅ 不创建 tag 或 GitHub Release（保持 v0.1.1-alpha baseline）
- ✅ 不依赖外部 CDN
- ✅ 不含 API key / secret / token

---

## 9. 验收结果

| 维度 | 结果 |
|------|------|
| Markdown Blueprint | ✅ 完整 |
| HTML Blueprint 页面 | ✅ 完整 |
| Demo Pack | ✅ 完整（README + inputs + prompts + outputs + app + validation） |
| Web Demo | ✅ 可打开、可交互 |
| TouchDesigner Prompt | ✅ 完整 + 参考实现 |
| 数据同步 | ✅ data/blueprints.json 和 docs/data/blueprints.json 一致 |
| 本地预览 | ✅ 三个 URL HTTP 200 |
| 推送 | ✅ main 分支推送成功 |
| Pages 验证 | ✅ GitHub Pages 三个 URL 可访问 |

---

## 10. 沉淀资产

- 7 项手势映射规则文档
- TouchDesigner Python DAT Prompt + 参考实现
- Web Demo 源码（HTML/CSS/JS）
- AI 辅助创意编码工作流（可复用到其他 TouchDesigner 项目）
- 完整的 inputs / outputs / validation 文档

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
