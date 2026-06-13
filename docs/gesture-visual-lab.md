# 方案标题：手势实时视觉实验室 (GestureVisual Lab)

- **英文名：** GestureVisual Lab
- **类型：** Creative Coding / Realtime Visual / AI Workflow
- **难度：** 中高
- **Demo 周期：** 2-3 天
- **适合对象：** 创意技术人员、设计师、AI Agent 使用者、互动装置创作者、实时视觉学习者
- **标签：** TouchDesigner、MediaPipe、Gesture Control、Realtime Visual、Creative Coding、Claude Code
- **状态：** demo-ready
- **创建阶段：** IDB-5

---

## 一句话介绍

用摄像头、MediaPipe 手部追踪、TouchDesigner 和 AI 辅助脚本，把双手的 21 个关键点动作映射为实时 3D 故障视觉控制，让创意技术人员能在 2-3 天内做出可表演、可复现、可讲解的互动视觉 Demo。

---

## 原始想法

> 记录这个想法最初是如何产生的。保留原始文本，不要改写。

"最近有个爆款视频：一双手在摄像头前快速变换动作，屏幕上就跟着出现夸张的 3D 故障视觉——画面挤压、扭曲、闪烁、色彩切换，像把 Figma 和 Photoshop 打垮了一样。看起来很惊艳，但更值得拆解的是背后的真实技术链路：摄像头 → 手部关键点 → 手势语义 → 视觉参数映射。 如果把这套链路整理成一个可复现的 Blueprint，再让 Claude / Agent 辅助生成 TouchDesigner Python DAT 脚本和 Web 交互模拟器，创意技术人员就能在 2-3 天内做出来一个属于自己风格的实时视觉 Demo。"

---

## 背景与问题

### 当前场景

创意技术、互动装置、舞台视觉、VJ 表演领域一直存在一个共同痛点：**实时视觉需要"复杂工具 + 复杂输入"**。常见工作流：

- 用 TouchDesigner / Notch / Resolume 搭建视觉管线
- 用 MIDI 控制器、Kinect、Leap Motion、自定义硬件做输入
- 把两者联调需要懂节点图、信号流、Python / GLSL

这导致一个尴尬的局面：真正"懂视觉"的设计师不一定会写节点图，会写节点图的技术人不一定有表演感的肢体表现力。两者之间缺一座"用身体自然动作直接驱动视觉"的桥。

最近社交媒体上爆火的"手势控视觉"视频正好是这座桥：摄像头 + MediaPipe 手部关键点（左右手各 21 个点）就能识别捏合、张开、移动、握拳等基本手势，再把关键点几何（中心、距离、角度）映射到 TouchDesigner 的参数，**视觉表现就完全跟着演员的身体走**。

### 现有痛点

- **痛点 1：工具门槛高** — TouchDesigner 非商用版虽然免费，但节点图 + Python DAT + CHOP 信号流的组合学习曲线陡峭，初学者在"调通摄像头输入"这一步就卡住
- **痛点 2：手部追踪方案分散** — MediaPipe Hands、MediaPipe Hand Landmarker、Leap Motion、Kinect 各有优缺点，选型没有标准答案
- **痛点 3：手势到视觉的映射关系藏在脑子里** — 设计师凭直觉做"双手中点 → 位置"、"双手距离 → 缩放"，但没有结构化记录，导致方案不可复现、不可讲解
- **痛点 4：AI 辅助脚本缺位** — TouchDesigner 的 Python DAT 可以写，但让 Claude / Codex 一次性写一个能跑通摄像头 + MediaPipe + 节点图的脚本，prompt 和上下文都不容易凑齐
- **痛点 5：缺少可解释的 Demo** — 观众看到的只是"哇好酷"，但创作者需要向同行、老师、客户解释每一帧视觉变化对应哪个手势

### 为什么需要解决

如果不解决这些问题，"手势控视觉"会停留在少数创意技术大神的演示视频里，无法成为创意技术学习者、设计师、独立创作者可以**亲手复现**的技能。复现门槛高就意味着：

- 学习者只能模仿视频表面效果，不知道底层链路
- 设计师想做提案时，只能给客户看视频截图，无法演示交互逻辑
- 创作者无法把"手势 → 视觉"变成可教学的流程
- Agent 辅助脚本缺少标准 prompt 模板，每次都要从零写

---

## 为什么这个想法重要

**"爆款视频"和"可复现 Blueprint"是两件事。**

视频带来灵感，但 Blueprint 带来技能。这个方案把"一双手控制 3D 故障视觉"的爆款链路拆成：

| 层级 | 内容 | 谁来负责 |
|------|------|---------|
| **输入层** | 摄像头 + MediaPipe Hand Landmarker → 21 个关键点 / 手 | 已有现成 API |
| **语义层** | 双手中点 / 距离 / 角度 / 捏合度 / 速度 | 可用 JS 或 Python 计算 |
| **映射层** | 语义特征 → TouchDesigner 参数（位置 / 缩放 / 旋转 / 噪点 / 主题） | 需要结构化设计 |
| **视觉层** | TouchDesigner 节点图输出 3D 故障视觉 | 节点图 + GLSL |

**这个方案真正的价值是：**

- **让"手势 → 视觉映射"变成可写、可教、可复现的设计资产**，而不是创作者的个人直觉
- **让 AI Agent 能辅助生成 TouchDesigner Python DAT 脚本**，因为映射规则和 prompt 模板都已结构化
- **让创作者能在 GitHub Pages 上展示"手势映射逻辑模拟器"**，即使观众没装 TouchDesigner 也能理解每一帧视觉变化对应哪个手势
- **让"手势控视觉"从大神的私人技艺变成可以开源学习的标准方案**

---

## 目标用户与使用场景

### 目标用户

| 用户角色 | 使用场景 | 核心价值 |
|---------|---------|---------|
| 创意技术学习者 | 学 TouchDesigner、MediaPipe、手势识别 | 有完整链路可学，不是只看到结果视频 |
| 视觉设计师 / VJ | 做表演视觉、品牌快闪、互动装置 | 不用学硬件编程也能用身体控制视觉 |
| AI Agent 使用者 | 让 Claude / Codex 辅助生成 TouchDesigner 脚本 | 有标准 prompt 模板和映射规则可复用 |
| 独立创作者 | 做可讲解的 Demo 给客户、老师、同行 | GitHub Pages 上的交互模拟器可直接演示 |
| 互动装置艺术家 | 装置输入源设计 | 标准化的"手势 → 参数"映射库可拼装 |
| 教学场景 | 创意技术课程、workshop | 有完整 demo pack 可让学生复现 |

### 使用场景

1. **场景 1：创意技术学习** — 从摄像头开始，按 Blueprint 一步步搭建手势识别和视觉映射管线，跑通 Gesture Cube Lite MVP
2. **场景 2：VJ 表演 / 舞台视觉** — 把双手动作作为表演输入，配合 TouchDesigner 输出定制化的视觉主题
3. **场景 3：互动装置艺术展** — 观众站在摄像头前做手势，屏幕上实时出现 3D 故障视觉，强调"身体即控制器"
4. **场景 4：AI 辅助脚本开发** — 用 Claude / Codex 生成 TouchDesigner Python DAT 脚本，把"手势 → 视觉"逻辑自动化
5. **场景 5：客户演示与教学** — 用 Web 交互模拟器讲解手势映射逻辑，观众可以拖动手点看视觉变化
6. **场景 6：创意技术课程作业** — 学生按 Blueprint 复现、扩展、加自己的视觉主题，作为考核项目

---

## 方案概述

这个方案的核心是把"摄像头 → MediaPipe → 手势语义 → TouchDesigner → 实时视觉"这条链路**结构化、可记录、可复现**。

**它由三层组成：**

1. **真实运行层（TouchDesigner 端）** — 在本地 TouchDesigner + MediaPipe TouchDesigner 插件环境下运行。这是真正的"成品"，但需要用户本地安装 TouchDesigner（Non-Commercial 免费版即可）。
2. **Web 交互模拟器（GitHub Pages 端）** — 用 HTML/CSS/JS 复现手势映射逻辑，让没有 TouchDesigner 的人也能拖动手点、看视觉变化、读懂映射规则。
3. **AI 辅助脚本层（Claude / Codex / Agent 端）** — 用 prompt 模板让 AI 生成 TouchDesigner Python DAT、MediaPipe 集成代码、Web Demo 代码。

**MVP（Gesture Cube Lite）核心手势映射：**

- 双手中点 → cube 位置
- 双手距离 → cube 缩放
- 双手连线角度 → cube 旋转
- 左手捏合 → 噪点 / distortion 强度
- 右手捏合 → 切换颜色主题
- 快速移动 → 触发 glitch 闪烁
- 双手握拳 → freeze frame（暂停视觉更新）

**Web Demo 的定位明确：**

> 这是静态 Web 模拟器，验证手势映射逻辑和 Demo 可解释性。  
> 真实 TouchDesigner 版本需要在本地安装 TouchDesigner + MediaPipe 插件。  
> 不能把 Web Demo 误读为"已经跑通 TouchDesigner 真机工程"。

---

## Demo 最小可行版本（MVP）

### 目标

用 2-3 天验证：**"手势 → 视觉"映射规则能不能被结构化记录、复现、讲解？** 不要求做到完整的 TouchDesigner 真机工程，但要求：

- Web 交互模拟器可拖动、可观察视觉变化
- 映射规则和参数面板完整可见
- TouchDesigner Python DAT 脚本有完整模板，可在本地真实环境复现

### 第一版策略（Gesture Cube Lite）

如果完整方案需要 TouchDesigner 真机调通，第一版可以用 **"Web 模拟器 + TouchDesigner 脚本模板"** 双轨验证：

1. Web 端：完整跑通手势映射逻辑（拖动 = 模拟手势）
2. TouchDesigner 端：脚本模板写完整，标注哪些行需要用户在本地替换

### 输入

1. **Web Demo 输入** — 浏览器内拖动两个手点（Left Hand / Right Hand）+ slider 控制捏合度 + toggle 控制 freeze
2. **TouchDesigner 输入** — 摄像头实时画面 + MediaPipe Hand Landmarker 输出（左右手 21 个关键点 / 手）
3. **Agent 输入** — 固定的 Prompt 模板 + 当前手势映射规则文档 + 项目脚手架（TouchDesigner .toe 项目骨架）

### 输出

1. **Web 端输出** — 实时更新的 cube 视觉（位置 / 缩放 / 旋转 / 噪点 / 颜色主题 / glitch / freeze）+ 参数面板
2. **TouchDesigner 端输出** — 实时 3D 故障视觉（与 Web 模拟器行为一致）
3. **沉淀产物** — 手势映射规则文档、TouchDesigner Python DAT 脚本、Web Demo 源码、可讲解的 Demo Pack

### 验证标准

- [ ] Web Demo 打开后立即可交互，无需摄像头授权
- [ ] 拖动 Left Hand → cube 跟随移动
- [ ] 拖动 Right Hand → cube 跟随移动
- [ ] 双手距离变化 → cube 缩放
- [ ] 双手角度变化 → cube 旋转
- [ ] Left Pinch slider → 噪点强度变化
- [ ] Right Pinch slider → 颜色主题切换
- [ ] Movement Speed 高 → glitch 闪烁
- [ ] Both Fists Freeze toggle 开启 → 视觉暂停
- [ ] Reset 按钮 → 回到初始状态
- [ ] 参数面板实时显示 9 项核心参数
- [ ] TouchDesigner Python DAT 脚本模板包含 MediaPipe 集成代码
- [ ] Demo Pack 完整：README / inputs / prompts / outputs / app / validation
- [ ] 明确标注 Web Demo 是"交互模拟器"而非 TouchDesigner 真机

---

## 技术架构

### 最小技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 摄像头输入 | Webcam (getUserMedia) / TouchDesigner TOP | 实时视频流 |
| 手部追踪 | MediaPipe Hand Landmarker (Web) / MediaPipe TouchDesigner 插件 (本地) | 左右手各 21 个关键点 |
| 手势语义层 | 原生 JS（Web）/ Python DAT（TouchDesigner） | 计算中心、距离、角度、捏合度、速度 |
| 视觉输出 | CSS 3D cube + filter effects（Web）/ TouchDesigner 节点图（GLSL） | 实时视觉 |
| AI 辅助 | Claude / Codex / Hermes Agent | 生成 TouchDesigner Python DAT、Web Demo 代码 |
| 文档 / Demo | Markdown / HTML / CSS / 原生 JS | 不依赖构建框架 |
| 发布 | GitHub Pages（Web Demo）/ 本地 .toe 文件（TouchDesigner 真机） | 不提交 .toe 二进制 |

### 架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                       输入层                                          │
│                                                                     │
│  Web: 浏览器拖动手点（mock 手势）                                       │
│  TouchDesigner: 摄像头 + MediaPipe 插件 → 21 个关键点 / 手            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       手势语义层（Gesture Semantics）                │
│                                                                     │
│  - 双手中点 → center_x, center_y                                      │
│  - 双手距离 → distance                                                │
│  - 双手连线角度 → angle                                              │
│  - 捏合度 → left_pinch, right_pinch （拇指-食指距离）                │
│  - 移动速度 → speed                                                  │
│  - 握拳状态 → fist_left, fist_right                                 │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       视觉映射层（Visual Mapping）                    │
│                                                                     │
│  - center → cube 位置 (translate)                                    │
│  - distance → cube 缩放 (scale)                                      │
│  - angle → cube 旋转 (rotate)                                        │
│  - left_pinch → 噪点强度 (filter: contrast / hue-rotate)            │
│  - right_pinch → 颜色主题切换 (theme: neon / mono / cyber)          │
│  - speed > 阈值 → glitch 闪烁 (filter + class toggle)               │
│  - fist_left && fist_right → freeze (animation-play-state: paused)  │
│                                                                     │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       视觉输出层                                      │
│                                                                     │
│  Web: CSS 3D cube + CSS filter + CSS transition                     │
│  TouchDesigner: 节点图 → SOP / TOP / GLSL → 屏幕输出                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 数据流 / 工作流

### 核心流程

```
手势输入（拖动 or 摄像头）
→ 手部关键点检测（MediaPipe）
→ 手势语义计算（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳）
→ 视觉参数映射（cube 位置 / 缩放 / 旋转 / 噪点 / 主题 / glitch / freeze）
→ 视觉输出更新（CSS 3D 或 TouchDesigner 节点图）
→ 参数面板实时显示
→ （可选）AI Agent 辅助生成 / 修改映射规则
```

### 每个步骤说明

1. **手势输入** — Web 端用鼠标拖动两个手点（模拟双手位置）；TouchDesigner 端用摄像头 + MediaPipe 检测真实手部
2. **手部关键点检测** — MediaPipe Hand Landmarker 输出每只手的 21 个关键点坐标 + 置信度
3. **手势语义计算** — 从 21 个关键点计算：双手中点（取 9 号点 wrist 平均）、双手距离（双 wrist 距离）、双手连线角度（arctan2）、捏合度（4 号拇指尖 - 8 号食指尖距离归一化）、移动速度（连续帧差）、握拳状态（4 指弯曲判定）
4. **视觉参数映射** — 每个手势语义量映射到具体的视觉参数。映射规则用纯函数实现（输入 → 输出），便于讲解和 AI 辅助生成
5. **视觉输出更新** — Web 端用 CSS transform / filter / class 切换；TouchDesigner 端用 CHOP 信号传到节点图参数
6. **参数面板实时显示** — Web 端有 9 项参数面板（center_x, center_y, distance, angle, scale, rotation, left_pinch, right_pinch, glitch, freeze）
7. **AI 辅助** — 用 prompt 模板让 Claude / Codex 生成 / 调整 TouchDesigner Python DAT 脚本或 Web Demo 代码

---

## 页面或系统设计

### Web Demo 页面结构

| 区域 | 内容 | 说明 |
|------|------|------|
| 顶部 | 标题、分类、Demo 状态、返回链接 | 跟现有 demo 页一致 |
| 左侧 | 交互控制区 | 两个手点（可拖动）、捏合 slider、speed slider、freeze toggle、reset 按钮 |
| 中间 | 3D cube stage | 实时跟随手势变化的 CSS 3D cube |
| 右侧 | 参数面板 | 9 项实时参数（center_x, center_y, distance, angle, scale, rotation, left_pinch, right_pinch, glitch, freeze） |
| 底部 | 说明区 | "这是 Web 模拟器，真机版需要本地 TouchDesigner" |
| 链接区 | 输入材料 / Prompt / 生成输出 / 文件结构 / 验收 / 复现 | 跟现有 demo 页一致 |

### 关键界面元素

- **手点 (hand point)** — 两个圆形手点（Left Hand 蓝色 / Right Hand 红色），鼠标拖动 = 模拟手部位置
- **slider (left pinch)** — 控制左手捏合度 0-1
- **slider (right pinch)** — 控制右手捏合度 0-1
- **slider (movement speed)** — 控制模拟移动速度 0-1
- **toggle (both fists freeze)** — 切换 freeze frame
- **button (reset)** — 重置所有参数到初始状态
- **cube stage** — 中央 CSS 3D cube，根据手势映射实时变化
- **参数面板** — 实时显示 9-10 项参数
- **主题切换** — 根据 right_pinch 在 3 个主题间循环（neon / mono / cyber）

### TouchDesigner 真机设计（说明用，本 Blueprint 不交付 .toe 二进制）

- 节点图结构：Camera TOP → MediaPipe CHOP → Math CHOP → Noise TOP → Geometry SOP → Output
- Python DAT：mediapipe_hand_landmarker_callbacks.py（每帧更新参数）
- 节点命名：/project1/hand_left, /project1/hand_right, /project1/cube_geo
- 用户在本地新建 .toe，按 references 复制节点结构，运行 Python DAT 即可

---

## 实施步骤

### 步骤 1：定义手势映射规则（1 小时）

- [ ] 列出 7 项核心手势映射（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳 / freeze）
- [ ] 每个映射明确输入、输出、映射函数（纯函数）
- [ ] 把映射规则写入手势映射模型文档（`outputs/gesture-mapping-model.md`）

### 步骤 2：编写 Web Demo 代码（2-3 小时）

- [ ] 创建 `app/index.html`：左侧控制区 + 中间 cube + 右侧参数面板 + 底部说明
- [ ] 创建 `app/style.css`：3D cube + 噪点 filter + glitch flash + 主题切换
- [ ] 创建 `app/app.js`：手点拖动、slider 联动、cube 更新、参数面板、glitch 触发、freeze 切换、reset
- [ ] 测试：浏览器打开、移动端可用、9 项参数实时更新

### 步骤 3：编写 TouchDesigner Python DAT 模板（1-2 小时）

- [ ] 创建 `prompts/touchdesigner-python-dat-prompt.md`：驱动 Claude / Codex 生成 Python DAT 脚本的 prompt
- [ ] 在 `prompts/` 中提供生成的 Python DAT 脚本参考实现（不依赖真实摄像头）
- [ ] 标注哪些行需要用户在本地 TouchDesigner 环境替换

### 步骤 4：编写 inputs / outputs / validation 文档（1 小时）

- [ ] `inputs/source-idea.md` — 原始想法
- [ ] `inputs/source-analysis.md` — 爆款视频的技术链路拆解
- [ ] `inputs/technical-background.md` — MediaPipe + TouchDesigner + 创意编码技术背景
- [ ] `outputs/blueprint-brief.md` — Blueprint 摘要
- [ ] `outputs/gesture-mapping-model.md` — 手势映射模型
- [ ] `outputs/touchdesigner-network-plan.md` — TouchDesigner 节点图规划
- [ ] `outputs/demo-notes.md` — Demo 演示笔记
- [ ] `validation/acceptance-checklist.md` — 完整验收清单

### 步骤 5：编写 Blueprint HTML 和 Markdown（1 小时）

- [ ] `docs/gesture-visual-lab.md` — Markdown blueprint（本文档）
- [ ] `docs/blueprints/gesture-visual-lab.html` — HTML blueprint 页面
- [ ] `public/blueprints/gesture-visual-lab.html` — 同步镜像
- [ ] `docs/index.html` 和 `public/index.html` — 更新首页文案、确认卡片渲染

### 步骤 6：更新数据文件（15 分钟）

- [ ] `data/blueprints.json` 和 `docs/data/blueprints.json` — 新增第 4 条目，meta.total = 4

### 步骤 7：本地预览 + Pages 验证（15 分钟）

- [ ] `python3 -m http.server 8080` 本地启动
- [ ] curl 验证 / /blueprints/gesture-visual-lab.html / /demos/gesture-visual-lab/ 三个 URL
- [ ] 推送到 main 后验证 GitHub Pages URL

---

## 验收标准

### 功能验收

- [ ] Web Demo 打开后立即可交互，无需摄像头授权
- [ ] 两个手点可拖动
- [ ] 三个 slider 可调节
- [ ] freeze toggle 可切换
- [ ] reset 按钮可重置
- [ ] 9-10 项参数实时显示
- [ ] 双手中点 → cube 位置映射正确
- [ ] 双手距离 → cube 缩放映射正确
- [ ] 双手角度 → cube 旋转映射正确
- [ ] left pinch → 噪点强度变化
- [ ] right pinch → 主题切换
- [ ] speed 高 → glitch 闪烁
- [ ] freeze 开启 → 视觉暂停
- [ ] 移动端基本可用（拖动手点响应）

### 质量验收

- [ ] 不依赖外部 CDN
- [ ] 不使用构建步骤
- [ ] 不提交 .toe / .tox 等二进制文件
- [ ] 不含 OPENAI_API_KEY / ANTHROPIC_API_KEY / TELEGRAM_BOT_TOKEN / password / secret
- [ ] 代码内有简短注释
- [ ] mapping 函数明确分离（getCenter / getDistance / getAngle / mapRange / updateCube / triggerGlitch / switchTheme / freezeFrame）
- [ ] Web Demo 显著标注"交互模拟器 / companion demo"
- [ ] 不写"已经跑通 TouchDesigner 真机工程"的虚假结论
- [ ] 参考资源包含 MediaPipe + TouchDesigner + MediaPipe-TouchDesigner 插件三个核心链接

### 数据验收

- [ ] `data/blueprints.json` 和 `docs/data/blueprints.json` 完全同步
- [ ] 4 个条目都保留（不破坏已有 3 个）
- [ ] 新条目 `gesture-visual-lab` 字段完整（id / title / title_en / slug / summary / category / difficulty / difficulty_en / demo_time / demo_time_en / audience / audience_en / tags / status / created_at / updated_at / page_url / demo_url / demo_pack_path / md_url / created_phase / updated_phase）
- [ ] meta.total = 4，meta.last_updated = 2026-06-13
- [ ] status = "demo-ready"（因为 Demo Pack 完整、Web Demo 可打开、验收清单完成）

### 发布验收

- [ ] `docs/demos/gesture-visual-lab/index.html` 可访问
- [ ] `docs/blueprints/gesture-visual-lab.html` 可访问
- [ ] `public/blueprints/gesture-visual-lab.html` 与 docs 镜像同步
- [ ] GitHub Pages 三个 URL 都返回 HTTP 200

---

## 风险与限制

| 风险 | 影响 | 应对 |
|------|------|------|
| TouchDesigner 真实运行环境差异 | 中 | Web Demo 标注为"模拟器"，明确真机需要本地 TouchDesigner + MediaPipe 插件 |
| MediaPipe Hand Landmarker 在低光照下效果差 | 中 | 说明真机使用环境要求（光线、背景、单人双手） |
| Web Demo 没法用真实摄像头（避免权限问题） | 低 | 用拖动手点 + slider 作为"mock 手势"，明确标注是 companion demo |
| 双手交叉或重叠时 MediaPipe 跟踪错位 | 中 | 真机版需要选手势定义规则避免歧义；Web 模拟器无此问题 |
| TouchDesigner 节点图学习曲线陡峭 | 高 | 提供完整 Python DAT 模板 + 节点命名规范，用户只需新建 .toe 后复制节点结构 |
| AI Agent 生成的 Python DAT 可能语法错 | 中 | 在 prompt 模板中要求"先输出脚本说明再写代码"，并提供参考实现 |
| 创意视觉效果（噪点 / glitch）实现难度差异大 | 中 | Web 端用 CSS filter；TouchDesigner 端用 GLSL；不在 Web 端模拟 TouchDesigner GLSL 效果 |
| 移动端触控与桌面拖动行为不同 | 低 | 移动端用 touch events 做兼容，但明确 MVP 优先桌面体验 |
| 公众误以为 Web Demo 是 TouchDesigner 真机 | 中 | 在 Web Demo 顶部显著位置标注"companion demo / 交互模拟器"，并在方案页明确说明 |

### 已知限制

- **Web Demo 不调用摄像头** — 因为 GitHub Pages 静态部署 + 隐私考虑，Web Demo 用拖动手点 + slider 模拟手势。真实摄像头调用需要本地 TouchDesigner + MediaPipe 集成。
- **本 Blueprint 不交付 .toe 二进制文件** — TouchDesigner 真机工程（.toe / .tox）是二进制，不在 Git 仓库中提交。用户需在本地 TouchDesigner 环境中按 references 复制节点结构。
- **Web 端无法模拟 TouchDesigner GLSL 高级效果** — GLSL 是 GPU shader，Web Demo 只用 CSS filter 模拟基础效果（噪点 / 色相 / glitch flash），不模拟复杂的几何变换和粒子系统。
- **AI Agent 辅助脚本可能需要多轮迭代** — TouchDesigner Python DAT 与 MediaPipe 集成的细节多，一次性 prompt 不一定完美。用户需要根据本地环境调试。
- **本 Blueprint 是"教学 / 学习用"，不是"产品化方案"** — 创意技术人员可以用它做学习、表演、教学、客户演示，但要做产品级方案还需要工程化（错误处理、性能优化、多人协作）。

---

## 后续扩展方向

1. **真实摄像头集成** — Web Demo 增加 getUserMedia + MediaPipe Hand Landmarker JS 版，让 Web Demo 也能识别真实手势（需用户授权摄像头）
2. **更多手势定义** — 加入 OK 手势（拇指食指圈）、指点、握拳、张开等更细粒度的手势
3. **多人多手支持** — 支持多人（每人一双手）协同控制视觉，适合多人互动装置
4. **手势 → MIDI 映射** — 把手势映射为 MIDI 信号，让 Ableton / Resolume 等软件也能接收
5. **手势 → 颜色 / 形状库** — 不只控制参数，还能切换预设的颜色 / 形状 / 主题
6. **录制与回放** — 录制手势序列，回放时让视觉按手势时间轴重现
7. **TouchDesigner 真实插件打包** — 把手势识别 + 视觉节点图打包成 TouchDesigner 插件，方便其他用户安装
8. **AI Agent 自动生成视觉主题** — 让 Claude 根据"想要赛博朋克风"自动生成对应的颜色 / 形状 / 噪点配置
9. **与项目记忆型会议助手联动** — 把创意技术 workshop 的会议记录联动到 Blueprint 知识库，形成可教学的项目资产
10. **多平台适配** — 让 Gesture Cube Lite 也能在 Unity / Unreal / Three.js 等其他引擎中复现

---

## 可直接复制给 Agent 的 Prompt 模板

### Prompt A：生成 TouchDesigner Python DAT 脚本

```
你是 TouchDesigner + MediaPipe 集成专家。请基于以下手势映射规则，生成一个
完整的 TouchDesigner Python DAT 脚本（mediapipe_hand_callbacks.py），用于
GestureVisual Lab Blueprint。

## 手势映射规则（必须严格按此映射）

1. 双手中点 (center_x, center_y) → cube 位置 (translate_x, translate_y)
   - center_x ∈ [-1, 1] → translate_x ∈ [-2, 2]
   - center_y ∈ [-1, 1] → translate_y ∈ [-2, 2]
2. 双手距离 (distance) → cube 缩放 (scale)
   - distance ∈ [0.2, 1.5] → scale ∈ [0.5, 2.0]
3. 双手连线角度 (angle) → cube 旋转 (rotation_z)
   - angle ∈ [-180°, 180°] → rotation_z 跟随
4. 左手捏合 (left_pinch) → 噪点强度 (noise_amount)
   - left_pinch ∈ [0, 1] → noise_amount ∈ [0, 1]
5. 右手捏合 (right_pinch) → 主题切换
   - right_pinch < 0.3 → theme neon
   - 0.3 ≤ right_pinch < 0.7 → theme mono
   - right_pinch ≥ 0.7 → theme cyber
6. 移动速度 (speed) → glitch 闪烁
   - speed > 0.7 → glitch 持续开启
   - speed < 0.3 → glitch 关闭
7. 双手握拳 (fist_left && fist_right) → freeze
   - freeze=true → 视觉暂停

## 输入

- MediaPipe Hand Landmarker 输出（左右手 21 个关键点 / 手）
- 通过 TouchDesigner CHOP 传入，channel 命名约定：
  hand_l_wrist_x, hand_l_wrist_y, hand_r_wrist_x, hand_r_wrist_y
  hand_l_thumb_tip_x, hand_l_thumb_tip_y, hand_l_index_tip_x, hand_l_index_tip_y
  hand_r_thumb_tip_x, hand_r_thumb_tip_y, hand_r_index_tip_x, hand_r_index_tip_y

## 输出

- 更新 TouchDesigner 节点参数：
  /project1/cube_geo/transform → translate / scale / rotate
  /project1/noise_top/amount → noise_amount
  /project1/color_theme → theme name
  /project1/glitch_active → boolean
  /project1/freeze_active → boolean

## 要求

1. 先输出脚本结构说明，再写代码
2. 代码用函数化结构（getCenter, getDistance, getAngle, getPinch, getSpeed, getFist, mapRange）
3. 每个函数加简短注释
4. 在脚本开头说明哪些行需要用户替换（用户本地 .toe 节点名）
5. 不要使用任何真实摄像头设备，只用 mock 数据测试
6. 不要硬编码任何 API key / secret
```

### Prompt B：生成 Web Demo 代码

```
你是前端工程师。请基于以下手势映射规则，生成一个静态 Web Demo
（HTML + CSS + 原生 JS），用于 GestureVisual Lab Blueprint 的 GitHub Pages
展示。这是一个"交互模拟器 / companion demo"，不调用摄像头。

## 手势映射规则（必须严格按此映射）

[同 Prompt A 的 7 条映射规则]

## Web Demo 要求

1. 不依赖外部 CDN
2. 不使用构建步骤（直接打开 index.html 可用）
3. 移动端也能基本使用
4. 只用 HTML / CSS / 原生 JS
5. 代码内有简短注释

## 页面结构

- 顶部：标题 + 返回链接 + demo 状态标注（"交互模拟器 / companion demo"）
- 左侧：交互控制区
  - 两个可拖动手点（Left Hand / Right Hand）
  - slider: left pinch
  - slider: right pinch
  - slider: movement speed
  - toggle: both fists freeze
  - button: reset
- 中间：3D cube stage（CSS 3D）
- 右侧：参数面板（实时显示 9-10 项参数）
- 底部：说明区（"Web 模拟器，真机版需本地 TouchDesigner + MediaPipe"）

## 关键函数

- getCenter(left, right) → {x, y}
- getDistance(left, right) → number
- getAngle(left, right) → number (radians)
- getPinch(hand) → number (0-1)
- mapRange(value, inMin, inMax, outMin, outMax) → number
- updateCube() → 应用映射到 CSS transform
- triggerGlitch() → 切换 glitch class
- switchTheme() → 根据 right_pinch 切换 3 个主题
- freezeFrame() → 暂停/恢复动画

## 视觉规则

- cube 用 CSS 3D transform（translate / scale / rotate）
- 噪点用 CSS filter: contrast / hue-rotate
- glitch 用 CSS animation 闪烁 + filter 组合
- 主题用 CSS class 切换（neon / mono / cyber）

## 输出要求

- app/index.html（页面）
- app/style.css（样式）
- app/app.js（逻辑）
- 移动端响应式
```

---

## 人工确认点

- [ ] 确认点 1：手势映射规则是否符合预期（位置 / 缩放 / 旋转 / 噪点 / 主题 / glitch / freeze 的映射方向和取值范围）
- [ ] 确认点 2：Web Demo 的"模拟器"定位是否清晰（不要让用户误以为这是 TouchDesigner 真机）
- [ ] 确认点 3：是否需要在 Web Demo 中加入真实摄像头支持（目前方案不含，因为 GitHub Pages 静态部署 + 隐私考虑）
- [ ] 确认点 4：TouchDesigner Python DAT 脚本模板的详细程度（是给完整脚本还是给 prompt 让用户跑）
- [ ] 确认点 5：参考资源链接是否准确（MediaPipe 官方文档、MediaPipe-TouchDesigner 插件、TouchDesigner Non-Commercial 下载页）
- [ ] 确认点 6：是否需要在 MVP 中加入更多手势（OK / 指点 / 握拳 / 张开 等）
- [ ] 确认点 7：是否需要在 Web Demo 中加入手势识别（mock 手势 vs 真实摄像头）

---

## 项目沉淀方式

完成这个方案后，以下内容可以沉淀为项目资产：

- **沉淀物 1：手势映射规则文档** — `outputs/gesture-mapping-model.md`，包含 7 项映射的纯函数定义，可被 AI Agent 复用
- **沉淀物 2：TouchDesigner Python DAT 模板** — `prompts/touchdesigner-python-dat-prompt.md` + 参考实现，可驱动 Claude / Codex 生成本地脚本
- **沉淀物 3：Web Demo 源码** — `app/index.html + style.css + app.js`，可在 GitHub Pages 展示
- **沉淀物 4：创意技术学习路径** — 本 Blueprint 整体可作为 TouchDesigner + MediaPipe + 创意编码的学习入门
- **沉淀物 5：AI Agent 辅助工作流** — Prompt 模板可复用到其他创意编码项目（不只是 TouchDesigner）
- **沉淀物 6：可讲解的 Demo Pack** — 完整的 inputs / prompts / outputs / app / validation，让其他人能复现

---

## Demo Pack（必须包含）

### 构建过程记录

记录如何构建这个 Demo：

1. **步骤 1** — 拆解爆款视频的技术链路（摄像头 → MediaPipe → 手势语义 → TouchDesigner → 视觉）
2. **步骤 2** — 定义 7 项核心手势映射规则（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳 / freeze）
3. **步骤 3** — 编写 Web Demo（HTML + CSS + 原生 JS），拖动手点模拟手势
4. **步骤 4** — 编写 TouchDesigner Python DAT Prompt 模板，让 Claude 生成参考实现
5. **步骤 5** — 编写 inputs / outputs / validation 文档，组成完整 Demo Pack
6. **步骤 6** — 编写 Blueprint Markdown 和 HTML，同步到 docs/ 和 public/
7. **步骤 7** — 更新数据文件，验证 GitHub Pages

### 关键 Prompt

驱动 Agent 构建 Demo 的关键 Prompt 见上方"可直接复制给 Agent 的 Prompt 模板"部分。两个核心 Prompt：

- **Prompt A** — 生成 TouchDesigner Python DAT 脚本
- **Prompt B** — 生成 Web Demo 代码

### 复现步骤

1. 准备 Markdown blueprint（`docs/gesture-visual-lab.md`）
2. 准备 HTML blueprint（`docs/blueprints/gesture-visual-lab.html`）
3. 准备 Web Demo 源码（`docs/demos/gesture-visual-lab/app/`）
4. 准备 inputs / outputs / validation 文档
5. 准备 TouchDesigner Python DAT Prompt 模板
6. 更新 `data/blueprints.json` 和 `docs/data/blueprints.json`
7. 更新首页 `docs/index.html` 和 `public/index.html`
8. 本地 `python3 -m http.server 8080` 验证三个 URL
9. 显式 `git add` 相关文件，`git commit`，`git push origin main`
10. 等待 GitHub Pages 更新，验证 `https://conanxin.github.io/idea-to-demo-blueprints/demos/gesture-visual-lab/`

### 验收记录

- [x] Web Demo 可打开、可交互（拖动手点、slider、toggle、reset 全部响应）
- [x] 9-10 项参数面板实时更新
- [x] 7 项手势映射全部生效（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳 / freeze）
- [x] TouchDesigner Python DAT Prompt 模板完整
- [x] inputs / outputs / validation 文档完整
- [x] 不含敏感信息（API key / secret / token）
- [x] 不含二进制文件（.toe / .tox）
- [x] 不依赖外部 CDN
- [x] 移动端可基本使用
- [x] 显著标注"Web 模拟器 / companion demo"，未宣称 TouchDesigner 真机跑通

---

## 参考资源

- [MediaPipe Hand Landmarker 官方文档](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker)
- [torinmb / mediapipe-touchdesigner（GitHub 插件）](https://github.com/torinmb/mediapipe-touchdesigner)
- [TouchDesigner Non-Commercial 免费下载](https://derivative.ca/product/touchdesigner-non-commercial/77)
- [TouchDesigner 官方文档（Python DAT）](https://docs.derivative.ca/index.php?title=Python)
- [Idea-to-Demo Blueprints 项目主页](https://github.com/conanxin/idea-to-demo-blueprints)

---

*Created following the [Idea-to-Demo Blueprints](https://github.com/conanxin/idea-to-demo-blueprints) format. Phase: IDB-5.*
