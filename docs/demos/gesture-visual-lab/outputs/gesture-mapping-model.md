# 手势映射模型 (Gesture Mapping Model)

> 用途：把手势语义量映射到视觉参数的核心模型  
> 阶段：IDB-5  
> 这是 Blueprint 的核心资产，可被 AI Agent 复用

---

## 1. 输入：手势语义量 (7 项)

| 名称 | 类型 | 取值范围 | 来源 |
|------|------|---------|------|
| `center_x` | float | [-1, 1] | 双手中点 x |
| `center_y` | float | [-1, 1] | 双手中点 y |
| `distance` | float | [0.2, 1.5] | 双手 wrist 欧氏距离 |
| `angle` | float | [-180, 180] (度) | 双手连线角度 |
| `left_pinch` | float | [0, 1] | 左手拇指-食指距离归一化 |
| `right_pinch` | float | [0, 1] | 右手拇指-食指距离归一化 |
| `speed` | float | [0, 1] | 双手中点连续帧差 |
| `fist_left` | bool | - | 左手握拳状态 |
| `fist_right` | bool | - | 右手握拳状态 |

---

## 2. 输出：视觉参数 (9 项)

| 名称 | 类型 | 取值范围 | 用途 |
|------|------|---------|------|
| `translate_x` | float | [-2, 2] | cube 位置 x |
| `translate_y` | float | [-2, 2] | cube 位置 y |
| `scale` | float | [0.5, 2.0] | cube 缩放 |
| `rotation_z` | float | [-180, 180] (度) | cube 旋转 |
| `noise_amount` | float | [0, 1] | 噪点强度 |
| `theme` | string | neon / mono / cyber | 颜色主题 |
| `glitch_active` | bool | - | glitch 是否激活 |
| `freeze_active` | bool | - | freeze 是否激活 |

---

## 3. 映射规则（核心）

### 3.1 位置映射

```
center_x ∈ [-1, 1] → translate_x ∈ [-2, 2]
center_y ∈ [-1, 1] → translate_y ∈ [-2, 2]
```

函数：`mapRange(value, -1, 1, -2, 2)`

### 3.2 缩放映射

```
distance ∈ [0.2, 1.5] → scale ∈ [0.5, 2.0]
```

函数：`mapRange(value, 0.2, 1.5, 0.5, 2.0)`

### 3.3 旋转映射

```
angle ∈ [-180°, 180°] → rotation_z 跟随
```

函数：`rotation_z = angle`（直接赋值）

### 3.4 噪点映射

```
left_pinch ∈ [0, 1] → noise_amount ∈ [0, 1]
```

函数：`noise_amount = left_pinch`（直接赋值）

### 3.5 主题映射

```
right_pinch < 0.3 → theme "neon"
0.3 ≤ right_pinch < 0.7 → theme "mono"
right_pinch ≥ 0.7 → theme "cyber"
```

函数：分段函数（threshold = 0.3, 0.7）

### 3.6 Glitch 映射

```
speed > 0.7 → glitch 持续开启
speed < 0.3 → glitch 关闭
0.3 ≤ speed ≤ 0.7 → glitch 概率触发
```

函数：`glitch_active = speed > 0.7`（MVP 用简化版）

### 3.7 Freeze 映射

```
fist_left && fist_right → freeze_active = true
否则 → freeze_active = false
```

函数：`freeze_active = fist_left && fist_right`

---

## 4. 通用映射函数

```javascript
function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}
```

```python
def map_range(value, in_min, in_max, out_min, out_max):
    if in_max == in_min:
        return out_min
    return out_min + (out_max - out_min) * ((value - in_min) / (in_max - in_min))
```

---

## 5. 完整映射函数

### JavaScript 版本

```javascript
function mapGesturesToVisual(left, right, leftPinch, rightPinch, speed, freeze) {
  // === 手势语义计算 ===
  const center = getCenter(left, right);
  const distance = getDistance(left, right);
  const angle = getAngle(left, right);

  // === 视觉参数映射 ===
  return {
    translate_x: mapRange(center.x, -1, 1, -2, 2),
    translate_y: mapRange(center.y, -1, 1, -2, 2),
    scale: mapRange(distance, 0.2, 1.5, 0.5, 2.0),
    rotation_z: angle,
    noise_amount: leftPinch,
    theme: rightPinch < 0.3 ? 'neon' : rightPinch < 0.7 ? 'mono' : 'cyber',
    glitch_active: speed > 0.7,
    freeze_active: freeze
  };
}
```

### Python 版本

```python
def map_gestures_to_visual(left, right, left_pinch, right_pinch, speed, freeze):
    center = get_center(left, right)
    distance = get_distance(left, right)
    angle = get_angle(left, right)

    return {
        'translate_x': map_range(center[0], -1, 1, -2, 2),
        'translate_y': map_range(center[1], -1, 1, -2, 2),
        'scale': map_range(distance, 0.2, 1.5, 0.5, 2.0),
        'rotation_z': angle,
        'noise_amount': left_pinch,
        'theme': 'neon' if right_pinch < 0.3 else 'mono' if right_pinch < 0.7 else 'cyber',
        'glitch_active': speed > 0.7,
        'freeze_active': freeze
    }
```

---

## 6. 边界情况处理

| 边界 | 处理 |
|------|------|
| `distance` 超出 [0.2, 1.5] | 截断到边界 |
| `left_pinch` / `right_pinch` 超出 [0, 1] | 截断到边界 |
| 双手未检测到（只有一只手） | 用单手 + 屏幕中心作为虚拟中点 |
| 完全未检测到手 | 所有视觉参数保持上一次值 |

---

## 7. 映射的可解释性

每个映射都可以用一句话解释：

- **中点 → 位置** — "双手合在一起时，cube 在屏幕中心"
- **距离 → 缩放** — "双手张开越大，cube 越大"
- **角度 → 旋转** — "双手连线旋转时，cube 跟随旋转"
- **捏合 → 噪点** — "左手捏合时画面变得扭曲"
- **捏合 → 主题** — "右手捏合时颜色主题切换"
- **速度 → glitch** — "快速移动时画面闪烁"
- **握拳 → freeze** — "双手握拳时画面暂停"

---

## 8. 映射的可扩展性

可以新增的映射：

- **OK 手势**（拇指食指圈）→ 切换视觉预设
- **指点**（食指伸出）→ 触发动画
- **张开**（五指张开）→ 粒子爆炸
- **竖大拇指** → 切换到下一个主题

每个新映射都是一个纯函数，可独立测试。

---

## 9. 映射的 AI 辅助潜力

AI Agent 可以：

- 根据映射规则自动生成 Python / JS 代码
- 根据"想要赛博朋克风"自动生成主题配置
- 根据"想要更激烈的 glitch"调整 speed 阈值
- 根据用户反馈调整映射范围

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
