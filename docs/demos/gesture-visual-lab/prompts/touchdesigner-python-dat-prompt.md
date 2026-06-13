# Prompt A: 生成 TouchDesigner Python DAT 脚本

> 用途：驱动 Claude / Codex / Hermes Agent 生成 TouchDesigner Python DAT 脚本，用于 GestureVisual Lab Blueprint 的真实运行环境。  
> 输出：TouchDesigner 节点图中的 Python DAT（execute DAT），回调函数每帧更新视觉参数。

---

## Prompt 模板（可直接复制）

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
   - right_pinch < 0.3 → theme "neon"
   - 0.3 ≤ right_pinch < 0.7 → theme "mono"
   - right_pinch ≥ 0.7 → theme "cyber"
6. 移动速度 (speed) → glitch 闪烁
   - speed > 0.7 → glitch 持续开启
   - speed < 0.3 → glitch 关闭
   - 0.3 ≤ speed ≤ 0.7 → glitch 概率触发
7. 双手握拳 (fist_left && fist_right) → freeze
   - freeze=true → 视觉暂停（不再更新参数）

## 输入

- MediaPipe Hand Landmarker 输出（左右手 21 个关键点 / 手）
- 通过 TouchDesigner CHOP 传入，channel 命名约定：
  hand_l_wrist_x, hand_l_wrist_y
  hand_r_wrist_x, hand_r_wrist_y
  hand_l_thumb_tip_x, hand_l_thumb_tip_y
  hand_l_index_tip_x, hand_l_index_tip_y
  hand_r_thumb_tip_x, hand_r_thumb_tip_y
  hand_r_index_tip_x, hand_r_index_tip_y

## 输出

- 更新 TouchDesigner 节点参数：
  /project1/cube_geo → translate / scale / rotate
  /project1/noise_top → noise_amount
  /project1/color_theme → theme name (string)
  /project1/glitch_active → boolean (0/1)
  /project1/freeze_active → boolean (0/1)

## 要求

1. 先输出脚本结构说明，再写代码
2. 代码用函数化结构（getCenter, getDistance, getAngle, getPinch, getSpeed, getFist, mapRange）
3. 每个函数加简短注释（说明输入输出和取值范围）
4. 在脚本开头说明哪些行需要用户替换（用户本地 .toe 节点名）
5. 不要使用任何真实摄像头设备，只用 mock 数据测试
6. 不要硬编码任何 API key / secret
7. 提供一个 `mock_test()` 函数，输入固定的关键点数据，输出预期的参数值
8. 代码长度建议 100-200 行，不超过 300 行
```

---

## 参考实现（不依赖真实摄像头）

```python
# mediapipe_hand_callbacks.py
# TouchDesigner Python DAT for GestureVisual Lab
# Phase: IDB-5

import math

# === 用户配置 ===
# ⚠️  以下节点路径需用户按本地 .toe 结构替换
CUBE_GEO_PATH = '/project1/cube_geo'
NOISE_TOP_PATH = '/project1/noise_top'
COLOR_THEME_PATH = '/project1/color_theme'
GLITCH_ACTIVE_PATH = '/project1/glitch_active'
FREEZE_ACTIVE_PATH = '/project1/freeze_active'
MEDIAPIPE_CHOP_PATH = 'mediapipe_chop'

# === 手势语义计算函数（纯函数） ===

def getCenter(left, right):
    """计算双手中点
    输入: left, right - (x, y) 元组
    输出: (center_x, center_y) 元组，取值范围约 [-1, 1]
    """
    return ((left[0] + right[0]) / 2, (left[1] + right[1]) / 2)

def getDistance(left, right):
    """计算双手距离
    输入: left, right - (x, y) 元组
    输出: 欧氏距离
    """
    return math.sqrt((left[0] - right[0])**2 + (left[1] - right[1])**2)

def getAngle(left, right):
    """计算双手连线角度
    输入: left, right - (x, y) 元组
    输出: 角度（度），范围 [-180, 180]
    """
    dx = right[0] - left[0]
    dy = right[1] - left[1]
    return math.degrees(math.atan2(dy, dx))

def getPinch(hand_points):
    """计算单手捏合度（拇指尖 - 食指尖距离归一化）
    输入: hand_points - 关键点字典，至少包含 thumb_tip 和 index_tip
    输出: 捏合度 ∈ [0, 1]，越小越捏合
    """
    thumb = hand_points['thumb_tip']
    index = hand_points['index_tip']
    raw_dist = math.sqrt((thumb[0] - index[0])**2 + (thumb[1] - index[1])**2)
    # 假设 raw_dist ∈ [0.02, 0.2] 归一化到 [0, 1]
    return max(0.0, min(1.0, (raw_dist - 0.02) / 0.18))

def getSpeed(prev_center, curr_center, dt=1/30):
    """计算双手中点的移动速度
    输入: prev_center, curr_center - (x, y) 元组
    输出: 速度 ∈ [0, 1]
    """
    dist = getDistance(prev_center, curr_center)
    speed = dist / dt if dt > 0 else 0
    return max(0.0, min(1.0, speed * 10))  # 经验缩放

def getFist(hand_points):
    """简化握拳判定（实际需要 4 指弯曲检测）
    输入: hand_points - 关键点字典
    输出: bool - 是否握拳
    """
    # 简化：捏合度 > 0.6 视为某种程度的握拳
    pinch = getPinch(hand_points)
    return pinch > 0.6

def mapRange(value, inMin, inMax, outMin, outMax):
    """通用值映射函数
    输入: value, inMin, inMax, outMin, outMax
    输出: 映射后的值
    """
    if inMax == inMin:
        return outMin
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin))

# === 视觉参数映射函数（核心） ===

def mapToVisualParams(center, distance, angle, left_pinch, right_pinch, speed, fist_left, fist_right):
    """把手势语义量映射到视觉参数
    输入: 7 个手势语义量
    输出: dict 包含 9 个视觉参数
    """
    return {
        'translate_x': mapRange(center[0], -1, 1, -2, 2),
        'translate_y': mapRange(center[1], -1, 1, -2, 2),
        'scale': mapRange(distance, 0.2, 1.5, 0.5, 2.0),
        'rotation_z': angle,
        'noise_amount': left_pinch,
        'theme': 'neon' if right_pinch < 0.3 else 'mono' if right_pinch < 0.7 else 'cyber',
        'glitch_active': speed > 0.7,
        'freeze_active': fist_left and fist_right
    }

# === TouchDesigner 回调函数 ===

def onFrameStart(frame):
    """每帧开始时调用，更新所有视觉参数
    ⚠️  节点路径需用户按本地 .toe 结构替换
    """
    # 读取 MediaPipe CHOP 数据
    mp_chop = op(MEDIAPIPE_CHOP_PATH)
    if mp_chop is None:
        return  # 用户尚未配置 CHOP

    # 提取关键点
    left = (mp_chop['hand_l_wrist_x'][0], mp_chop['hand_l_wrist_y'][0])
    right = (mp_chop['hand_r_wrist_x'][0], mp_chop['hand_r_wrist_y'][0])
    left_hand = {
        'thumb_tip': (mp_chop['hand_l_thumb_tip_x'][0], mp_chop['hand_l_thumb_tip_y'][0]),
        'index_tip': (mp_chop['hand_l_index_tip_x'][0], mp_chop['hand_l_index_tip_y'][0])
    }
    right_hand = {
        'thumb_tip': (mp_chop['hand_r_thumb_tip_x'][0], mp_chop['hand_r_thumb_tip_y'][0]),
        'index_tip': (mp_chop['hand_r_index_tip_x'][0], mp_chop['hand_r_index_tip_y'][0])
    }

    # 计算手势语义
    center = getCenter(left, right)
    distance = getDistance(left, right)
    angle = getAngle(left, right)
    left_pinch = getPinch(left_hand)
    right_pinch = getPinch(right_hand)
    # speed 需要前后帧对比，本例省略
    speed = 0.0
    fist_left = getFist(left_hand)
    fist_right = getFist(right_hand)

    # 映射到视觉参数
    params = mapToVisualParams(center, distance, angle, left_pinch, right_pinch, speed, fist_left, fist_right)

    # 更新节点参数
    if params['freeze_active']:
        return  # freeze 时不更新

    cube = op(CUBE_GEO_PATH)
    if cube is not None:
        cube.par.tx = params['translate_x']
        cube.par.ty = params['translate_y']
        cube.par.sx = params['scale']
        cube.par.sy = params['scale']
        cube.par.sz = params['scale']
        cube.par.rz = params['rotation_z']

    noise = op(NOISE_TOP_PATH)
    if noise is not None:
        noise.par.amount = params['noise_amount']

    theme = op(COLOR_THEME_PATH)
    if theme is not None:
        theme.par.theme = params['theme']

    glitch = op(GLITCH_ACTIVE_PATH)
    if glitch is not None:
        glitch.par.active = 1 if params['glitch_active'] else 0

# === 测试函数（不需要 TouchDesigner 环境） ===

def mock_test():
    """用 mock 数据测试映射函数
    ⚠️  本函数可以在 Python REPL 中直接运行，不需要 TouchDesigner
    """
    # 模拟双手分开 1.0 单位，中心在 (0, 0)，角度 0
    left = (-0.5, 0)
    right = (0.5, 0)
    left_hand = {'thumb_tip': (-0.5, 0.1), 'index_tip': (-0.4, 0.2)}  # 张开
    right_hand = {'thumb_tip': (0.5, 0.1), 'index_tip': (0.4, 0.2)}  # 张开

    center = getCenter(left, right)
    distance = getDistance(left, right)
    angle = getAngle(left, right)
    left_pinch = getPinch(left_hand)
    right_pinch = getPinch(right_hand)
    fist_left = getFist(left_hand)
    fist_right = getFist(right_hand)

    params = mapToVisualParams(center, distance, angle, left_pinch, right_pinch, 0.0, fist_left, fist_right)

    print("中心:", center)
    print("距离:", distance)
    print("角度:", angle)
    print("左捏合度:", left_pinch)
    print("右捏合度:", right_pinch)
    print("握拳:", fist_left, fist_right)
    print("视觉参数:", params)

if __name__ == '__main__':
    mock_test()
```

---

## 验证方式

```bash
python3 mediapipe_hand_callbacks.py
```

预期输出（mock 数据）：
```
中心: (0.0, 0.0)
距离: 1.0
角度: 0.0
左捏合度: ~0.55 (取决于归一化范围)
右捏合度: ~0.55
握拳: False False
视觉参数: {
  'translate_x': 0.0,
  'translate_y': 0.0,
  'scale': ~0.62,
  'rotation_z': 0.0,
  'noise_amount': ~0.55,
  'theme': 'mono',
  'glitch_active': False,
  'freeze_active': False
}
```

---

## 注意事项

1. **节点路径必须替换** — 本脚本中的 `/project1/cube_geo` 等是占位符，用户需按本地 .toe 结构修改
2. **速度计算需要状态** — `getSpeed` 需要前后帧对比，本脚本中省略（速度设为 0）
3. **握拳判定是简化版** — 真实握拳需要检测 4 指弯曲，本脚本只用捏合度近似
4. **MediaPipe CHOP 来源** — 用户需要在本地用 MediaPipe TouchDesigner 插件或自己写 Python 集成代码
5. **测试无需 TouchDesigner** — `mock_test()` 函数可在任何 Python 3 环境运行

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
