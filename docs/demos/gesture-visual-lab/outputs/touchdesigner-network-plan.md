# TouchDesigner 节点图规划

> 用途：说明在本地 TouchDesigner 环境中如何搭建节点图  
> 阶段：IDB-5  
> 重要：.toe 二进制文件不在 Git 仓库中提交

---

## 1. 节点图整体结构

```
/project1 (COMP 容器)
├── camera_top (Camera TOP)              # 摄像头输入
├── mediapipe_chop (MediaPipe CHOP)      # 手部追踪
├── mediapipe_callbacks (Python DAT)     # 回调函数，每帧更新
├── noise_top (Noise TOP)                # 噪点效果
├── color_theme (Constant CHOP)          # 颜色主题参数
├── glitch_active (Constant CHOP)        # glitch 开关
├── freeze_active (Constant CHOP)        # freeze 开关
└── cube_geo (Geometry SOP / Container)  # 3D cube
    ├── cube_box (Box SOP)               # cube 几何
    └── cube_render (Geometry COMP)      # 渲染
```

---

## 2. 每个节点的详细配置

### 2.1 Camera TOP

```
类型：TOP (Texture Operator)
名称：camera_top
参数：
  - Camera: 0 (选择第一个摄像头)
  - Resolution: 1280x720
  - Frame Rate: 30
输出：TOP 纹理
```

### 2.2 MediaPipe CHOP

```
类型：第三方插件（torinmb/mediapipe-touchdesigner）
名称：mediapipe_chop
输入：camera_top (TOP)
输出：CHOP channels
channels（输出约定）：
  - hand_l_wrist_x, hand_l_wrist_y
  - hand_r_wrist_x, hand_r_wrist_y
  - hand_l_thumb_tip_x, hand_l_thumb_tip_y
  - hand_l_index_tip_x, hand_l_index_tip_y
  - hand_r_thumb_tip_x, hand_r_thumb_tip_y
  - hand_r_index_tip_x, hand_r_index_tip_y
  - hand_count (0 / 1 / 2)
```

### 2.3 Python DAT (mediapipe_callbacks)

```
类型：DAT (Data Operator)
名称：mediapipe_callbacks
模式：Execute DAT
内容：见 prompts/touchdesigner-python-dat-prompt.md 的参考实现
回调：
  - onFrameStart(frame)
  - onCook()
输出：更新其他节点的参数
```

### 2.4 Noise TOP

```
类型：TOP (Texture Operator)
名称：noise_top
参数：
  - Type: Perlin
  - Period: 0.1
  - Contrast: 由 mediapipe_callbacks 动态更新
输出：噪点纹理
```

### 2.5 Color Theme (Constant CHOP)

```
类型：CHOP (Channel Operator)
名称：color_theme
参数：
  - Value 0: 0 (neon)
  - Value 1: 1 (mono)
  - Value 2: 2 (cyber)
输出：被 cube_render 引用
```

### 2.6 Cube Geometry

```
类型：SOP (Surface Operator) 或 Geometry COMP
名称：cube_geo
参数：
  - tx, ty: 由 mediapipe_callbacks 动态更新
  - sx, sy, sz: 由 mediapipe_callbacks 动态更新
  - rz: 由 mediapipe_callbacks 动态更新
内容：Box SOP (size 1x1x1)
```

---

## 3. 节点命名规范

### 3.1 命名约定

- 顶层组件：`/project1`
- 子节点：`/project1/<node_name>`
- 节点名使用 snake_case
- 关键节点添加前缀：`cube_*`, `hand_*`, `noise_*`

### 3.2 关键路径

```python
CUBE_GEO_PATH = '/project1/cube_geo'
NOISE_TOP_PATH = '/project1/noise_top'
COLOR_THEME_PATH = '/project1/color_theme'
GLITCH_ACTIVE_PATH = '/project1/glitch_active'
FREEZE_ACTIVE_PATH = '/project1/freeze_active'
MEDIAPIPE_CHOP_PATH = 'mediapipe_chop'
```

⚠️ **用户在本地新建 .toe 时，需按实际节点路径修改 Python DAT 中的路径常量**

---

## 4. Python DAT 回调流程

```
每帧开始 (onFrameStart)
  ↓
读取 mediapipe_chop 的 channels
  ↓
提取关键点坐标
  ↓
计算手势语义（中心、距离、角度、捏合、速度、握拳）
  ↓
映射到视觉参数（位置、缩放、旋转、噪点、主题、glitch、freeze）
  ↓
更新各节点参数
  - cube_geo.par.tx/ty/sx/sy/sz/rz
  - noise_top.par.contrast
  - color_theme.par.value0
  - glitch_active.par.value0
  - freeze_active.par.value0
```

---

## 5. GLSL Shader（可选）

如果要做更高级的视觉效果（如 glitch 闪烁、动态噪点），可以添加 GLSL TOP：

```glsl
// 简化版 glitch shader
uniform float u_time;
uniform float u_noise;
uniform float u_glitch;

void main() {
  vec2 uv = vUV;
  
  // 噪点
  float n = noise(uv * 10.0 + u_time) * u_noise;
  
  // Glitch 色相偏移
  if (u_glitch > 0.5) {
    uv.x += sin(u_time * 10.0 + uv.y * 20.0) * 0.05;
  }
  
  vec3 col = texture(sTD2DInfos[0], uv).rgb;
  col += n * 0.3;
  
  // RGB 偏移（glitch 效果）
  if (u_glitch > 0.5) {
    col.r = texture(sTD2DInfos[0], uv + vec2(0.01, 0.0)).r;
    col.b = texture(sTD2DInfos[0], uv - vec2(0.01, 0.0)).b;
  }
  
  fragColor = vec4(col, 1.0);
}
```

---

## 6. 用户本地搭建步骤

1. **下载 TouchDesigner Non-Commercial**
   - 网址：https://derivative.ca/product/touchdesigner-non-commercial/77
   - 注册 Derivative 账号（免费）
   - 安装到本地

2. **安装 MediaPipe TouchDesigner 插件**
   - 克隆 https://github.com/torinmb/mediapipe-touchdesigner
   - 按 README 编译 .dll
   - 复制到 TouchDesigner 插件目录

3. **新建 .toe 文件**
   - 打开 TouchDesigner
   - File → New
   - 保存为 `gesture_visual_lab.toe`

4. **创建节点图**
   - 按本文档 §1 搭建节点
   - 按 §2 配置每个节点
   - 复制 Python DAT 内容（参考 prompts/touchdesigner-python-dat-prompt.md）
   - 修改节点路径常量

5. **测试**
   - 接上摄像头
   - 按空格键运行
   - 看 3D cube 是否跟随手势变化

6. **调整**
   - 调整 mapRange 范围
   - 调整主题颜色
   - 调整 glitch 阈值

---

## 7. 性能注意事项

| 节点 | 性能瓶颈 | 优化 |
|------|---------|------|
| Camera TOP | USB 带宽 | 用 720p 而非 1080p |
| MediaPipe CHOP | GPU 推理 | 用 GPU delegate |
| Noise TOP | GPU 计算 | 减小纹理尺寸 |
| Geometry SOP | GPU 渲染 | 简化 cube 几何 |
| GLSL Shader | GPU 渲染 | 简化 shader 复杂度 |

---

## 8. 调试技巧

| 问题 | 调试方法 |
|------|---------|
| 摄像头没画面 | 检查 Camera TOP 的 Camera 参数 |
| MediaPipe 不工作 | 检查插件是否正确安装，看 CHOP 是否有数据 |
| 手势语义不对 | 在 Python DAT 中加 print() 看中间值 |
| 视觉参数没更新 | 检查节点路径常量是否正确 |
| Glitch 没效果 | 检查 glitch_active.par.value0 是否被更新 |

---

## 9. 扩展方向

- **多人多手支持** — 增加 MediaPipe CHOP 的 max_hands 到 4+
- **更多手势** — OK 手势、指点、张开、竖大拇指
- **手势录制** — 录制关键点序列，回放时让视觉按时间轴重现
- **MIDI 输出** — 把手势映射为 MIDI 信号，输出给 Ableton
- **OSC 输出** — 用 OSC 协议把参数发给其他软件
- **多机协同** — 多台 TouchDesigner 实例同步

---

## 10. 重要边界

- ✅ 本仓库**不提交** .toe / .tox 二进制
- ✅ 用户在本地新建 .toe 后按本文档复制节点结构
- ✅ Python DAT 内容可复用，但节点路径需按本地结构修改
- ✅ 真机效果可能与 Web Demo 有差异（CSS filter vs GLSL shader）

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
