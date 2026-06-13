# 爆款视频技术链路拆解

> 来源：方案 IDB-5 — 手势实时视觉实验室  
> 目的：把"一双手控制 3D 故障视觉"的爆款叙事拆成可复现的技术链路

---

## 1. 视频表面效果 vs 真实链路

### 视频表面看到的
- 一双手在摄像头前快速变换动作
- 屏幕上跟着出现夸张的 3D 故障视觉
- 画面挤压、扭曲、闪烁、色彩切换
- 像把 Figma 和 Photoshop 打垮了一样

### 真实技术链路
```
摄像头输入（Webcam）
  ↓
MediaPipe Hand Landmarker 检测
  ↓
双手各 21 个关键点（含 wrist, thumb_tip, index_tip, ...）
  ↓
手势语义计算
  - 双手中点（wrist 平均）
  - 双手距离（双 wrist 距离）
  - 双手连线角度（arctan2）
  - 捏合度（拇指尖 - 食指尖距离归一化）
  - 移动速度（连续帧 wrist 差）
  - 握拳状态（4 指弯曲判定）
  ↓
视觉参数映射
  - center → 位置
  - distance → 缩放
  - angle → 旋转
  - pinch → 噪点 / 主题
  - speed → glitch
  - fist → freeze
  ↓
TouchDesigner 节点图输出 3D 故障视觉
  - SOP（几何）
  - TOP（纹理 / 噪点）
  - GLSL（shader）
```

---

## 2. 链路中的关键技术

### 摄像头输入
- 普通 USB 摄像头即可，无需深度摄像头
- TouchDesigner 用 TOP（Texture Operator）拉流
- Web 端用 getUserMedia API

### MediaPipe Hand Landmarker
- Google 出品，免费开源
- 每只手输出 21 个 3D 关键点
- Web 端有 JS 版（基于 TensorFlow.js WASM）
- 桌面端有 Python 版，可被 TouchDesigner 通过 Python DAT 调用
- 第三方有 torinmb/mediapipe-touchdesigner TouchDesigner 插件

### 手势语义计算
- 纯函数化，可独立测试
- 输入：21 个关键点坐标
- 输出：6-7 个语义量（center / distance / angle / pinch / speed / fist）

### 视觉参数映射
- 7 项核心映射（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳 / freeze）
- 每个映射是一个 mapRange 函数：map(value, inMin, inMax, outMin, outMax)
- 映射规则文档化，可被 AI Agent 复用

### TouchDesigner 视觉输出
- 节点图：Camera TOP → MediaPipe CHOP → Math CHOP → Noise TOP → Geometry SOP → Output
- GLSL shader 用于自定义视觉效果（噪点 / 色相 / glitch）
- Python DAT 用于回调函数（每帧更新节点参数）

---

## 3. 链路中容易出错的地方

| 环节 | 易错点 | 应对 |
|------|--------|------|
| 摄像头 | 光线不足 / 背景复杂 / 单人 vs 多人 | 标注使用环境要求 |
| MediaPipe | 双手交叉 / 手指重叠 / 距离太近 | 选择合适的手势定义规则 |
| 手势语义 | 捏合度阈值 / 握拳判定逻辑 | 用纯函数 + 单元测试 |
| 视觉映射 | 映射范围不对 / 反向 | 明确输入输出范围 |
| TouchDesigner | 节点命名错 / CHOP 信号不通 | 提供完整 Python DAT 模板 |
| AI Agent | 生成的 Python DAT 语法错 / 节点名错 | Prompt 中要求"先说明再写代码" |

---

## 4. 链路中可 AI 辅助的部分

| 任务 | AI 辅助方式 |
|------|------------|
| MediaPipe 集成代码 | Claude / Codex 写 Python 调用脚本 |
| 手势语义计算 | Claude 生成纯函数代码 |
| TouchDesigner Python DAT | Prompt 驱动生成 + 用户本地替换节点名 |
| Web Demo | Prompt 驱动生成 HTML/CSS/JS |
| 视觉效果创意 | Claude 生成颜色 / 形状 / 噪点配置建议 |
| 验收清单 | Claude 生成验收用例 |

---

## 5. 链路中不能 AI 辅助的部分（需要人工）

- 摄像头硬件选型
- TouchDesigner 真实环境调试
- 视觉风格的最终美学判断
- 客户 / 观众的具体反馈

---

## 6. 链路的"创意人员友好度"评估

| 创意人员类型 | 友好度 | 说明 |
|-------------|--------|------|
| 视觉设计师 | 中高 | 不用学硬件编程，但需要理解映射规则 |
| VJ | 中高 | 可直接表演，但需要本地环境 |
| 互动装置艺术家 | 高 | 标准化的"手势 → 参数"映射库可拼装 |
| 创意技术学习者 | 高 | 有完整链路可学 |
| 纯程序员 | 中 | 需要理解视觉设计语言 |

---

## 7. 与其他技术的关系

- **OpenPose** — 全身姿态估计，更重；本方案只用 MediaPipe Hands
- **Leap Motion** — 专用硬件，已停产；本方案用普通摄像头
- **Kinect** — 深度摄像头，已停产；本方案用普通摄像头
- **Apple Vision Pro hand tracking** — 限定 Apple 设备；本方案跨平台
- **Move.ai / Quick Pose** — 商业方案；本方案免费开源

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
