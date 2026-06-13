# Prompt B: 生成 Web Demo 代码

> 用途：驱动 Claude / Codex / Hermes Agent 生成静态 Web Demo，用于 GestureVisual Lab Blueprint 的 GitHub Pages 展示。  
> 输出：HTML + CSS + 原生 JS，无需构建步骤，直接打开 index.html 可用。

---

## Prompt 模板（可直接复制）

```
你是前端工程师。请基于以下手势映射规则，生成一个静态 Web Demo
（HTML + CSS + 原生 JS），用于 GestureVisual Lab Blueprint 的 GitHub Pages
展示。这是一个"交互模拟器 / companion demo"，不调用摄像头。

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

## Web Demo 要求

1. 不依赖外部 CDN（所有代码 inline 或本地）
2. 不使用构建步骤（直接打开 index.html 可用）
3. 移动端也能基本使用（touch events 兼容）
4. 只用 HTML / CSS / 原生 JS
5. 代码内有简短注释

## 页面结构

- 顶部：标题 + 返回链接 + demo 状态标注（"交互模拟器 / companion demo"）
- 左侧：交互控制区（width: 280px）
  - 两个可拖动手点（Left Hand 蓝色 / Right Hand 红色），用鼠标 / touch 拖动
  - slider: left pinch (0-1)
  - slider: right pinch (0-1)
  - slider: movement speed (0-1)
  - toggle: both fists freeze
  - button: reset
- 中间：3D cube stage（CSS 3D）
  - 中心位置，size 240x240px
  - 6 个面用 CSS transform: rotateY/Z 构造
  - 根据手势映射实时变化
- 右侧：参数面板（width: 320px）
  - 实时显示 9-10 项参数：center_x / center_y / distance / angle / scale / rotation / left_pinch / right_pinch / glitch / freeze
- 底部：说明区
  - 显著标注："这是 Web 模拟器，真机版需要本地 TouchDesigner + MediaPipe 插件"
  - 不依赖摄像头，不提交 .toe 二进制文件

## 关键函数（必须分离实现）

- getCenter(left, right) → {x, y}
- getDistance(left, right) → number
- getAngle(left, right) → number (degrees)
- getPinch(hand) → number (0-1)
- mapRange(value, inMin, inMax, outMin, outMax) → number
- updateCube() → 应用映射到 CSS transform
- triggerGlitch() → 切换 glitch class
- switchTheme() → 根据 right_pinch 切换 3 个主题
- freezeFrame() → 暂停/恢复动画

## 视觉规则

- cube 用 CSS 3D transform（translate / scale / rotateY / rotateZ）
- 噪点用 CSS filter: contrast / hue-rotate / saturate
- glitch 用 CSS animation 闪烁 + filter 组合（CSS keyframes）
- 主题用 CSS class 切换（neon: 紫红荧光 / mono: 黑白 / cyber: 青绿霓虹）

## 输出要求

- index.html（页面，含样式和脚本 inline 或分别加载）
- style.css（样式，可选 inline）
- app.js（逻辑，可选 inline）
- 移动端响应式（媒体查询）
- 3 个主题的 CSS class 完整定义
- 顶部显著位置标注 "companion demo / 交互模拟器"
```

---

## 关键代码片段参考

### HTML 结构

```html
<div class="demo-app">
  <header class="demo-header">
    <a href="../../blueprints/gesture-visual-lab.html" class="back-link">← 返回方案页</a>
    <h1>Gesture Cube Lite</h1>
    <span class="badge">companion demo / 交互模拟器</span>
  </header>

  <main class="demo-main">
    <aside class="control-panel">
      <h3>交互控制</h3>
      <div class="hand-control">
        <label>Left Hand</label>
        <div class="hand-point" id="hand-left"></div>
      </div>
      <div class="hand-control">
        <label>Right Hand</label>
        <div class="hand-point" id="hand-right"></div>
      </div>
      <div class="slider-control">
        <label>Left Pinch</label>
        <input type="range" id="left-pinch" min="0" max="1" step="0.01" value="0">
      </div>
      <div class="slider-control">
        <label>Right Pinch</label>
        <input type="range" id="right-pinch" min="0" max="1" step="0.01" value="0">
      </div>
      <div class="slider-control">
        <label>Movement Speed</label>
        <input type="range" id="speed" min="0" max="1" step="0.01" value="0">
      </div>
      <div class="toggle-control">
        <label>Both Fists Freeze</label>
        <input type="checkbox" id="freeze">
      </div>
      <button id="reset">Reset</button>
    </aside>

    <section class="cube-stage">
      <div class="cube" id="cube">
        <div class="cube-face front"></div>
        <div class="cube-face back"></div>
        <div class="cube-face left"></div>
        <div class="cube-face right"></div>
        <div class="cube-face top"></div>
        <div class="cube-face bottom"></div>
      </div>
    </section>

    <aside class="param-panel">
      <h3>实时参数</h3>
      <div class="param-row"><span>center_x</span><span id="param-center-x">0.00</span></div>
      <div class="param-row"><span>center_y</span><span id="param-center-y">0.00</span></div>
      <div class="param-row"><span>distance</span><span id="param-distance">0.00</span></div>
      <div class="param-row"><span>angle</span><span id="param-angle">0°</span></div>
      <div class="param-row"><span>scale</span><span id="param-scale">1.00</span></div>
      <div class="param-row"><span>rotation</span><span id="param-rotation">0°</span></div>
      <div class="param-row"><span>left_pinch</span><span id="param-left-pinch">0.00</span></div>
      <div class="param-row"><span>right_pinch</span><span id="param-right-pinch">0.00</span></div>
      <div class="param-row"><span>glitch</span><span id="param-glitch">off</span></div>
      <div class="param-row"><span>freeze</span><span id="param-freeze">off</span></div>
    </aside>
  </main>

  <footer class="demo-footer">
    <p><strong>⚠️ 这是 Web 模拟器，真机版需要本地 TouchDesigner + MediaPipe 插件</strong></p>
    <p>拖动手点模拟手势，调节 slider 控制捏合度 / 速度，验证手势映射逻辑</p>
  </footer>
</div>
```

### JS 关键函数

```javascript
// === 手势语义计算（纯函数） ===

function getCenter(left, right) {
  return { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
}

function getDistance(left, right) {
  return Math.sqrt((left.x - right.x) ** 2 + (left.y - right.y) ** 2);
}

function getAngle(left, right) {
  return Math.atan2(right.y - left.y, right.x - left.x) * 180 / Math.PI;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

// === 视觉参数映射 ===

function computeVisualParams(left, right, leftPinch, rightPinch, speed, freeze) {
  const center = getCenter(left, right);
  const distance = getDistance(left, right);
  const angle = getAngle(left, right);

  return {
    translate_x: mapRange(center.x, -1, 1, -2, 2),
    translate_y: mapRange(center.y, -1, 1, -2, 2),
    scale: mapRange(distance, 0.2, 1.5, 0.5, 2.0),
    rotation_z: angle,
    noise_amount: leftPinch,
    theme: rightPinch < 0.3 ? 'neon' : rightPinch < 0.7 ? 'mono' : 'cyber',
    glitch: speed > 0.7,
    freeze: freeze
  };
}

// === Cube 更新 ===

function updateCube() {
  if (state.params.freeze) return;  // freeze 时不更新

  const cube = document.getElementById('cube');
  cube.style.transform = `
    translate3d(${state.params.translate_x * 50}px, ${state.params.translate_y * 50}px, 0)
    scale(${state.params.scale})
    rotateZ(${state.params.rotation_z}deg)
  `;

  // 噪点
  cube.style.filter = `
    contrast(${1 + state.params.noise_amount * 2})
    hue-rotate(${state.params.noise_amount * 180}deg)
  `;

  // 主题
  cube.classList.remove('theme-neon', 'theme-mono', 'theme-cyber');
  cube.classList.add(`theme-${state.params.theme}`);

  // Glitch
  if (state.params.glitch) {
    cube.classList.add('glitch');
  } else {
    cube.classList.remove('glitch');
  }

  // 更新参数面板
  updateParamPanel();
}
```

---

## 注意事项

1. **不调用摄像头** — 这是 companion demo，模拟手势用拖动手点
2. **不依赖 CDN** — 全部代码 inline 或本地，避免 CDN 失败
3. **不构建** — 直接打开 index.html 即可
4. **不写"已跑通 TouchDesigner 真机"** — 明确标注是 Web 模拟器
5. **响应式** — 移动端 768px 以下切换为竖向布局
6. **可注释** — 每个关键函数加简短注释，说明输入输出

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
