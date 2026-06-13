# 技术背景：MediaPipe + TouchDesigner + 创意编码

> 来源：方案 IDB-5 — 手势实时视觉实验室  
> 目的：为 Blueprint 提供技术背景参考，让 AI Agent 和创意人员理解底层技术栈

---

## 1. MediaPipe Hand Landmarker

### 是什么
- Google 出品的开源机器学习框架
- MediaPipe Solutions 套件中包含 Hand Landmarker 解决方案
- 实时检测手部 21 个 3D 关键点

### 关键点编号（每只手 21 个点）

```
        4 (THUMB_TIP)
         \
          3 (THUMB_IP)
           \
            2 (THUMB_MCP)
             \
   17----------0 (WRIST)----------5
   (PINKY_MCP)                    (INDEX_MCP)
    |                              |
   18 (PINKY_PIP)                6 (INDEX_PIP)
    |                              |
   19 (PINKY_DIP)                7 (INDEX_DIP)
    |                              |
   20 (PINKY_TIP)                8 (INDEX_TIP)
                                  
   13 (RING_MCP)         10 (MIDDLE_MCP)
   14 (RING_PIP)         11 (MIDDLE_PIP)
   15 (RING_DIP)         12 (MIDDLE_DIP)
   16 (RING_TIP)          9 (MIDDLE_TIP)
```

### 重要关键点（本方案使用）

| 关键点 | 编号 | 用途 |
|--------|------|------|
| WRIST | 0 | 双手中点计算 |
| THUMB_TIP | 4 | 捏合度计算 |
| INDEX_TIP | 8 | 捏合度计算 |
| 其他手指 MCP/PIP/TIP | 5-20 | 握拳判定 |

### API（Web 版）

```javascript
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    delegate: "GPU"
  },
  runningMode: "VIDEO",
  numHands: 2
});
```

### API（Python 版）

```python
import mediapipe as mp

hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
# results.multi_hand_landmarks 包含左右手的关键点列表
```

### 官方资源
- https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker

---

## 2. TouchDesigner

### 是什么
- Derivative 公司出品的节点图创意编码平台
- 实时视觉、互动装置、VJ 表演的事实标准
- Non-Commercial 版免费（功能受限，但足够学习和原型）

### 节点类型概览

| 类型 | 全称 | 用途 |
|------|------|------|
| TOP | Texture Operator | 图像、视频、纹理、噪点 |
| CHOP | Channel Operator | 信号、数值、动画曲线 |
| SOP | Surface Operator | 3D 几何 |
| DAT | Data Operator | 文本、表格、脚本 |
| COMP | Component | 容器，组织节点层级 |

### 本方案涉及的节点

```
Camera TOP (摄像头)
  ↓
MediaPipe TouchDesigner 插件 (手部追踪)
  ↓
Math CHOP (手势语义计算)
  ↓
Noise TOP (噪点效果)
  ↓
Geometry SOP (3D cube)
  ↓
Output (屏幕)
```

### Python DAT

```python
# 简化示例：每帧更新 cube 缩放
def onFrameStart(frame):
    # 从 MediaPipe CHOP 读取 distance
    distance = op('mediapipe_chop')['distance'][0]
    
    # 映射到 cube 缩放
    scale = mapRange(distance, 0.2, 1.5, 0.5, 2.0)
    
    # 更新节点参数
    op('cube_geo').par.scale = scale
    
def mapRange(value, inMin, inMax, outMin, outMax):
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))
```

### 官方资源
- https://derivative.ca/product/touchdesigner-non-commercial/77
- https://docs.derivative.ca/index.php?title=Python

---

## 3. MediaPipe TouchDesigner 插件

### 是什么
- torinmb 开源的第三方 TouchDesigner 插件
- 把 MediaPipe Hand Landmarker 包装成 TouchDesigner CHOP
- 用户在本地克隆源码编译

### 安装方式
1. 克隆 GitHub 仓库：https://github.com/torinmb/mediapipe-touchdesigner
2. 按照 README 编译 .dll
3. 复制到 TouchDesigner 插件目录

### 注意事项
- 第三方维护，稳定性可能不如官方插件
- 编译需要 Visual Studio / CMake
- 性能取决于本地 GPU

### 替代方案
- 用户也可以在 TouchDesigner Python DAT 中直接调用 mediapipe Python 包
- 不依赖第三方插件，但需要写更多代码

---

## 4. 创意编码生态对比

| 工具 | 类型 | 难度 | 实时性 | 适合场景 |
|------|------|------|--------|---------|
| TouchDesigner | 商业 / 节点图 | 中高 | 高 | VJ / 装置 / 舞台 |
| Notch | 商业 / 节点图 | 中高 | 高 | 大型舞台 / 演唱会 |
| Resolume | 商业 / VJ 软件 | 低 | 高 | VJ 表演 |
| openFrameworks | 开源 / C++ | 高 | 高 | 互动装置 / 学术 |
| Processing | 开源 / Java | 低 | 中 | 学习 / 教学 |
| p5.js | 开源 / JS | 低 | 中 | Web / 学习 |
| Three.js | 开源 / JS | 中 | 中 | Web 3D |

### 本方案定位
- **TouchDesigner 是真机首选** — 节点图 + Python DAT + 实时 GLSL
- **Web 端是 companion demo** — 不调用真实摄像头，用拖动手点 + slider
- **可扩展到 Three.js / openFrameworks** — 同样的手势映射规则可平移

---

## 5. 手势识别的相关技术

### 替代方案
- **OpenPose** — 全身姿态估计，包含手部但更重
- **MediaPipe Holistic** — 包含姿态 + 手 + 脸，组合方案
- **Apple Vision Framework** — 仅限 Apple 平台
- **Leap Motion** — 专用硬件，已停产
- **Intel RealSense** — 深度摄像头方案

### 选择 MediaPipe Hands 的理由
- 跨平台（Web / Python / C++ / Android / iOS）
- 免费开源
- 不需要专用硬件（普通摄像头即可）
- 性能足够（30 FPS 在普通笔记本上）
- 21 个关键点足以做手势语义计算

---

## 6. AI Agent 在创意编码中的角色

### 能做的
- 生成 TouchDesigner Python DAT 脚本
- 生成 Web Demo 代码（HTML/CSS/JS）
- 生成 Three.js / openFrameworks 代码
- 把手势映射规则文档化
- 根据描述生成颜色 / 形状 / 噪点配置
- 生成验收清单和复现步骤

### 不能做的（需要人工）
- 选择摄像头硬件
- 真实环境调试（光照、背景）
- 视觉美学判断（"这个颜色 / 形状好不好看"）
- 客户 / 观众的具体反馈

### AI 辅助工作流
1. 人工定义手势映射规则
2. AI 生成代码（按 prompt 模板）
3. 人工在本地环境调试
4. AI 生成复现文档和验收清单

---

## 7. 性能注意事项

| 环节 | 性能瓶颈 | 应对 |
|------|---------|------|
| 摄像头 30 FPS | CPU 解码视频 | 用 GPU 加速 |
| MediaPipe 检测 | GPU 推理 | 用 GPU delegate |
| 手势语义计算 | JS / Python 计算 | 纯函数，无需优化 |
| TouchDesigner 渲染 | GPU shader | 简化 shader 复杂度 |
| Web Demo | CSS 3D + filter | 现代浏览器即可 |

---

## 8. 安全与隐私

### 摄像头数据
- 摄像头视频流只在本地处理，不上传到云
- Web 端用 getUserMedia 需用户授权
- TouchDesigner 端只在本地处理

### 数据脱敏
- 不保存摄像头视频
- 不保存人脸 / 手部照片
- 只保存手部关键点坐标（21 个 3D 点）
- 坐标数据不含个人身份信息

### 内容审核
- 视觉内容（噪点 / glitch / 色相）是抽象艺术，不需要审核
- 真实人脸出现在画面中时，需要用户授权

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
