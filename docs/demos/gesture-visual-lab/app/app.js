/* ===========================================================
   GestureVisual Lab — Companion Demo Logic
   Phase: IDB-5
   验证 7 项手势 → cube 视觉 的映射规则
   =========================================================== */

(function () {
  'use strict';

  // === 状态 ===
  const state = {
    // 手点归一化坐标 [-1, 1]
    left:  { x: -0.35, y:  0.0 },
    right: { x:  0.35, y:  0.0 },
    // 滑块 [0, 1]
    leftPinch:  0,
    rightPinch: 0,
    speed:      0,
    // 状态
    freeze: false,
    // 派生参数
    params: {
      translateX: 0, translateY: 0,
      scale: 1, rotationZ: 0,
      noiseAmount: 0, theme: 'neon',
      glitch: false, freeze: false
    },
    // 性能统计
    lastFrameTime: 0
  };

  // === 元素引用 ===
  const $ = (id) => document.getElementById(id);
  const handLeft   = $('hand-left');
  const handRight  = $('hand-right');
  const stage      = document.querySelector('.hand-stage');
  const cube       = $('cube');
  const statusText = $('status-text');

  const sliLeftPinch  = $('sli-left-pinch');
  const sliRightPinch = $('sli-right-pinch');
  const sliSpeed      = $('sli-speed');
  const chkFreeze     = $('chk-freeze');
  const btnReset      = $('btn-reset');

  // ============================================================
  //  核心：手势语义计算（纯函数）
  // ============================================================

  /**
   * 双手中点
   * @param {{x:number,y:number}} left
   * @param {{x:number,y:number}} right
   * @returns {{x:number, y:number}} center ∈ [-1, 1]
   */
  function getCenter(left, right) {
    return {
      x: (left.x + right.x) / 2,
      y: (left.y + right.y) / 2
    };
  }

  /**
   * 双手距离（欧氏距离，归一化到 [0, 1]）
   * @param {{x:number,y:number}} left
   * @param {{x:number,y:number}} right
   * @returns {number} distance ∈ [0, 1]
   */
  function getDistance(left, right) {
    const dx = left.x - right.x;
    const dy = left.y - right.y;
    return Math.min(1, Math.sqrt(dx * dx + dy * dy) / 2);  // 归一化：x 跨度 2 → 距离 1
  }

  /**
   * 双手连线角度
   * @returns {number} angle ∈ [-180, 180] 度
   */
  function getAngle(left, right) {
    return Math.atan2(right.y - left.y, right.x - left.x) * 180 / Math.PI;
  }

  /**
   * 通用值映射
   */
  function mapRange(value, inMin, inMax, outMin, outMax) {
    if (inMax === inMin) return outMin;
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
  }

  // ============================================================
  //  视觉参数映射（核心映射规则）
  // ============================================================

  /**
   * 把手势语义量映射到 9 项视觉参数
   */
  function computeVisualParams() {
    const center   = getCenter(state.left, state.right);
    const distance = getDistance(state.left, state.right);
    const angle    = getAngle(state.left, state.right);

    // 1. 双手中点 → cube 位置
    const translateX = mapRange(center.x, -1, 1, -2, 2);
    const translateY = mapRange(center.y, -1, 1, -2, 2);

    // 2. 双手距离 → cube 缩放
    const scale = mapRange(distance, 0, 1, 0.5, 2.0);

    // 3. 双手角度 → cube 旋转
    const rotationZ = angle;

    // 4. 左手捏合 → 噪点强度
    const noiseAmount = state.leftPinch;

    // 5. 右手捏合 → 主题切换
    const theme = state.rightPinch < 0.3
      ? 'neon'
      : state.rightPinch < 0.7
        ? 'mono'
        : 'cyber';

    // 6. 速度 → glitch
    const glitch = state.speed > 0.7;

    // 7. freeze 状态
    const freeze = state.freeze;

    return {
      centerX: center.x, centerY: center.y,
      distance, angle,
      translateX, translateY, scale, rotationZ,
      noiseAmount, theme, glitch, freeze
    };
  }

  // ============================================================
  //  Cube 更新（DOM 应用）
  // ============================================================

  function updateCube() {
    if (state.params.freeze) {
      // freeze 时只更新参数面板，不改 cube
      updateParamPanel();
      return;
    }

    const p = state.params;
    // translate 用像素位移：translateX ∈ [-2, 2] → 像素 [-160, 160]
    const px = p.translateX * 80;
    const py = -p.translateY * 80;  // y 翻转（屏幕 y 向下）
    cube.style.transform =
      `translate3d(${px}px, ${py}px, 0) ` +
      `scale(${p.scale}) ` +
      `rotateZ(${p.rotationZ}deg)`;

    // 噪点
    const contrast = 1 + p.noiseAmount * 2;
    const hue      = p.noiseAmount * 180;
    cube.style.filter =
      `contrast(${contrast}) ` +
      `hue-rotate(${hue}deg) ` +
      `saturate(${1 + p.noiseAmount * 0.5})`;

    // 主题
    cube.classList.remove('theme-neon', 'theme-mono', 'theme-cyber');
    cube.classList.add('theme-' + p.theme);

    // glitch
    if (p.glitch) {
      cube.classList.add('glitch');
    } else {
      cube.classList.remove('glitch');
    }

    updateParamPanel();
  }

  // ============================================================
  //  参数面板更新
  // ============================================================

  function fmt(n, d = 2) { return Number(n).toFixed(d); }

  function updateParamPanel() {
    const p = state.params;
    $('p-center-x').textContent = fmt(p.centerX);
    $('p-center-y').textContent = fmt(p.centerY);
    $('p-distance').textContent = fmt(p.distance);
    $('p-angle').textContent    = fmt(p.angle, 0) + '°';
    $('p-tx').textContent       = fmt(p.translateX);
    $('p-ty').textContent       = fmt(p.translateY);
    $('p-scale').textContent    = fmt(p.scale);
    $('p-rz').textContent       = fmt(p.rotationZ, 0) + '°';
    $('p-noise').textContent    = fmt(p.noiseAmount);
    $('p-theme').textContent    = p.theme;
    $('p-glitch').textContent   = p.glitch ? 'on' : 'off';
    $('p-freeze').textContent   = p.freeze ? 'on' : 'off';
  }

  // ============================================================
  //  手点拖拽（mouse + touch）
  // ============================================================

  function setupHandDrag(handEl, handKey) {
    let dragging = false;

    const onStart = (e) => {
      dragging = true;
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const pt = e.touches ? e.touches[0] : e;
      const x = pt.clientX - rect.left;
      const y = pt.clientY - rect.top;
      // 归一化到 [-1, 1]（x 向右 +1，y 向下 -1）
      state[handKey].x = Math.max(-1, Math.min(1, (x / rect.width)  * 2 - 1));
      state[handKey].y = Math.max(-1, Math.min(1, -((y / rect.height) * 2 - 1)));
      updateHandPosition(handEl, state[handKey], rect);
    };
    const onEnd = () => { dragging = false; };

    handEl.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    handEl.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  }

  function updateHandPosition(el, hand, rect) {
    // 把归一化坐标 [-1, 1] 转回像素
    const px = ((hand.x + 1) / 2) * (rect.width  - 36);
    const py = ((-hand.y + 1) / 2) * (rect.height - 36);
    el.style.left = px + 'px';
    el.style.top  = py + 'px';
  }

  // ============================================================
  //  滑块 / toggle / button
  // ============================================================

  function setupControls() {
    sliLeftPinch.addEventListener('input', () => {
      state.leftPinch = parseFloat(sliLeftPinch.value);
      $('val-left-pinch').textContent = fmt(state.leftPinch);
    });
    sliRightPinch.addEventListener('input', () => {
      state.rightPinch = parseFloat(sliRightPinch.value);
      $('val-right-pinch').textContent = fmt(state.rightPinch);
    });
    sliSpeed.addEventListener('input', () => {
      state.speed = parseFloat(sliSpeed.value);
      $('val-speed').textContent = fmt(state.speed);
    });
    chkFreeze.addEventListener('change', () => {
      state.freeze = chkFreeze.checked;
    });
    btnReset.addEventListener('click', resetAll);
  }

  function resetAll() {
    state.left  = { x: -0.35, y:  0.0 };
    state.right = { x:  0.35, y:  0.0 };
    state.leftPinch = 0;
    state.rightPinch = 0;
    state.speed = 0;
    state.freeze = false;
    sliLeftPinch.value = 0;
    sliRightPinch.value = 0;
    sliSpeed.value = 0;
    chkFreeze.checked = false;
    $('val-left-pinch').textContent  = '0.00';
    $('val-right-pinch').textContent = '0.00';
    $('val-speed').textContent       = '0.00';
    const rect = stage.getBoundingClientRect();
    updateHandPosition(handLeft, state.left, rect);
    updateHandPosition(handRight, state.right, rect);
  }

  // ============================================================
  //  主循环
  // ============================================================

  function tick() {
    state.params = computeVisualParams();
    updateCube();
    requestAnimationFrame(tick);
  }

  // ============================================================
  //  初始化
  // ============================================================

  function init() {
    // 初始手点位置
    const rect = stage.getBoundingClientRect();
    updateHandPosition(handLeft,  state.left,  rect);
    updateHandPosition(handRight, state.right, rect);

    setupHandDrag(handLeft,  'left');
    setupHandDrag(handRight, 'right');
    setupControls();

    // 启动主循环
    requestAnimationFrame(tick);

    if (statusText) {
      statusText.textContent = 'Ready · 拖动左侧手点开始';
    }
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
