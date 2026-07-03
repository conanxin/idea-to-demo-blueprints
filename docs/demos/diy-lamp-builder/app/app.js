/* DIY Lamp Builder Demo — IDB-6C CAD Export
 * Pure vanilla JS. No dependencies. No build step.
 * Drives: SVG shell style + engraving, real-time Manufacturing Plan JSON,
 * BOM cost model, idea-to-config parser, assembly workflow,
 * OpenSCAD export with controlled core keepout.
 */

(function () {
  'use strict';

  // ---------- Static reference data ----------

  var DEFAULT_IDEA = '北京风格阅读台灯，外壳可定制，适合书桌使用';

  var COLOR_MAP = {
    'Warm White':  { hex: '#f5efe6', label: 'Warm White', finishing: 1.0 },
    'Hutong Gray': { hex: '#7a7a78', label: 'Hutong Gray', finishing: 1.0 },
    'Palace Red':  { hex: '#a83232', label: 'Palace Red', finishing: 1.15 },
    'Night Black': { hex: '#1c1c1e', label: 'Night Black', finishing: 1.1 }
  };

  var SHELL_STYLES = {
    'Minimal Bar': {
      label: 'Minimal Bar',
      complexity: 1.0,
      printTime: '3.5h',
      finishing: 'low',
      riskLevel: 'low',
      recommendedIteration: '1st',
      draw: function (color, secondary) {
        var g = svgGroup('shell-minimal-bar');
        // long rounded bar with a thin highlight strip
        g.appendChild(rect(40, 52, 240, 24, 4, color, '#2a2722', 1.5));
        g.appendChild(rect(40, 76, 240, 4, 0, '#2a2722', null, 0));
        g.lastChild.setAttribute('opacity', '0.25');
        // two subtle mounting slots
        g.appendChild(rect(60, 56, 12, 16, 2, secondary, '#2a2722', 1));
        g.appendChild(rect(248, 56, 12, 16, 2, secondary, '#2a2722', 1));
        return g;
      }
    },
    'Hutong Window': {
      label: 'Hutong Window',
      complexity: 1.25,
      printTime: '5h',
      finishing: 'medium',
      riskLevel: 'medium',
      recommendedIteration: '2nd',
      draw: function (color, secondary) {
        var g = svgGroup('shell-hutong-window');
        // window frame
        g.appendChild(rect(40, 38, 240, 40, 2, color, '#2a2722', 1.5));
        // vertical mullions
        var xs = [100, 160, 220];
        for (var i = 0; i < xs.length; i++) {
          g.appendChild(line(xs[i], 38, xs[i], 78, '#2a2722', 1.5));
        }
        // horizontal bar
        g.appendChild(line(40, 58, 280, 58, '#2a2722', 1.5));
        // inner lattice accent
        g.appendChild(rect(44, 42, 232, 32, 0, 'none', '#c7b299', 1));
        g.lastChild.setAttribute('opacity', '0.25');
        return g;
      }
    },
    'Beijing Pavilion': {
      label: 'Beijing Pavilion',
      complexity: 1.45,
      printTime: '6.5h',
      finishing: 'high',
      riskLevel: 'medium',
      recommendedIteration: '2nd',
      draw: function (color, secondary) {
        var g = svgGroup('shell-beijing-pavilion');
        // curved roof outline
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 36 76 Q 80 24 160 28 Q 240 24 284 76 Z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#2a2722');
        path.setAttribute('stroke-width', '1.5');
        g.appendChild(path);
        // eave tier
        var eave = rect(48, 74, 224, 8, 1, secondary, '#2a2722', 1);
        g.appendChild(eave);
        // central finial
        g.appendChild(circle(160, 26, 4, '#a83232'));
        // decorative ridge lines
        g.appendChild(line(80, 40, 120, 55, '#2a2722', 1));
        g.appendChild(line(240, 40, 200, 55, '#2a2722', 1));
        return g;
      }
    },
    'Book Arc': {
      label: 'Book Arc',
      complexity: 1.35,
      printTime: '5.5h',
      finishing: 'medium',
      riskLevel: 'low',
      recommendedIteration: '2nd',
      draw: function (color, secondary) {
        var g = svgGroup('shell-book-arc');
        // two open book pages as a curved shade
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', 'M 40 72 Q 80 30 160 44 Q 240 30 280 72 L 280 80 L 40 80 Z');
        path.setAttribute('fill', color);
        path.setAttribute('stroke', '#2a2722');
        path.setAttribute('stroke-width', '1.5');
        g.appendChild(path);
        // page fold line
        g.appendChild(line(160, 44, 160, 80, '#2a2722', 1.2));
        // page edge accents
        g.appendChild(line(44, 72, 80, 48, '#c7b299', 1));
        g.appendChild(line(276, 72, 240, 48, '#c7b299', 1));
        return g;
      }
    }
  };

  var BASE_COMPONENTS = [
    { key: 'led', name: '24V high-CRI LED strip', low: 8, high: 18 },
    { key: 'channel', name: 'Aluminum channel + opal diffuser', low: 6, high: 14 },
    { key: 'psu', name: '24V power adapter', low: 8, high: 15 },
    { key: 'dimmer', name: 'Dimmer / controller', low: 4, high: 12 },
    { key: 'hardware', name: 'Wires / screws / M3 inserts', low: 2, high: 5 },
    { key: 'base', name: 'Base + arm mock', low: 10, high: 25 }
  ];

  var FINISHING_COSTS = {
    'Warm White':  { low: 4, high: 8 },
    'Hutong Gray': { low: 4, high: 8 },
    'Palace Red':  { low: 8, high: 14 },
    'Night Black': { low: 6, high: 12 }
  };

  var NS = 'http://www.w3.org/2000/svg';

  // ---------- SVG helpers ----------

  function svgGroup(cls) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', cls);
    return g;
  }

  function rect(x, y, w, h, r, fill, stroke, sw) {
    var el = document.createElementNS(NS, 'rect');
    el.setAttribute('x', x); el.setAttribute('y', y);
    el.setAttribute('width', w); el.setAttribute('height', h);
    if (r) el.setAttribute('rx', r);
    el.setAttribute('fill', fill);
    if (stroke) el.setAttribute('stroke', stroke);
    if (sw) el.setAttribute('stroke-width', sw);
    return el;
  }

  function line(x1, y1, x2, y2, stroke, sw) {
    var el = document.createElementNS(NS, 'line');
    el.setAttribute('x1', x1); el.setAttribute('y1', y1);
    el.setAttribute('x2', x2); el.setAttribute('y2', y2);
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', sw);
    return el;
  }

  function circle(cx, cy, r, fill) {
    var el = document.createElementNS(NS, 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy);
    el.setAttribute('r', r); el.setAttribute('fill', fill);
    return el;
  }

  // ---------- DOM refs ----------

  var $ = function (id) { return document.getElementById(id); };

  var dom = {
    ideaInput:        $('idea-input'),
    btnGenerate:      $('btn-generate'),
    ideaButtons:      document.querySelectorAll('.idea-chip'),
    archUseCase:      $('arch-use-case'),
    archCoreChoice:   $('arch-core-choice'),
    archBrightness:   $('arch-brightness'),
    archColorTemp:    $('arch-color-temp'),
    archShell:        $('arch-shell'),
    archGlare:        $('arch-glare'),
    archPosition:     $('arch-position'),
    cfgLampType:      $('cfg-lamp-type'),
    cfgShellStyle:    $('cfg-shell-style'),
    cfgEngraving:     $('cfg-engraving'),
    colorRow:         $('color-row'),
    colorName:        $('color-name'),
    lampShell:        $('lamp-shell'),
    engravingText:    $('engraving-text'),
    previewCaption:   $('preview-caption'),
    manufacturingJSON:$('manufacturing-json'),
    btnCopyJSON:      $('btn-copy-json'),
    bomSummary:       $('bom-summary'),
    bomTbody:         $('bom-tbody'),
    assemblySteps:    $('assembly-steps'),
    cadOpenScad:      $('cad-openscad'),
    cadFilename:      $('cad-filename'),
    cadParamTbody:    $('cad-param-tbody'),
    btnCopyOpenScad:  $('btn-copy-openscad'),
    btnDownloadScad:  $('btn-download-scad'),
    btnDownloadConfig:$('btn-download-config')
  };

  // ---------- State ----------

  var state = {
    color:    'Warm White',
    colorHex: '#f5efe6',
    parsed:   null
  };

  // ---------- Idea parser (lightweight rule-based, no LLM) ----------

  function parseIdeaToConfig(text) {
    var t = (text || '').toLowerCase();
    var config = {
      useCase: 'Reading desk lamp',
      lampType: 'Reading Lamp',
      colorTemperature: 'Warm 3000K',
      shellStyle: 'Hutong Window',
      color: 'Warm White',
      glareStrategy: 'Recessed opal diffuser',
      brightnessTarget: '500-800 lm',
      estimatedPosition: 'Desk, 35-45 cm',
      core: 'ReadingCore-01'
    };

    if (/北京|胡同|四合院|窗/.test(t)) {
      config.shellStyle = 'Hutong Window';
      config.color = /灰/.test(t) ? 'Hutong Gray' : 'Warm White';
    }
    if (/天坛|宫殿|中式|亭|阁/.test(t)) {
      config.shellStyle = 'Beijing Pavilion';
      config.color = 'Palace Red';
    }
    if (/极简|黑色|工作|桌面|办公/.test(t)) {
      config.shellStyle = 'Minimal Bar';
      config.color = 'Night Black';
      config.brightnessTarget = '600-800 lm';
      config.useCase = 'Desktop work lamp';
      config.estimatedPosition = 'Desk, 40-50 cm';
    }
    if (/书卷|床头|弧形|孩子|儿童|睡前|读书|阅读/.test(t)) {
      if (/书卷|床头|弧形/.test(t)) {
        config.shellStyle = 'Book Arc';
      }
      if (/孩子|儿童|睡前|读书|阅读/.test(t)) {
        config.colorTemperature = 'Warm 2700K';
        config.glareStrategy = 'Low glare, recessed diffuser';
        config.brightnessTarget = 'Soft reading 400-600 lm';
        config.useCase = 'Bedside reading lamp';
        config.estimatedPosition = 'Bedside, 35-45 cm';
      }
    }
    if (/孩子|儿童|睡前/.test(t)) {
      config.shellStyle = 'Book Arc';
    }

    if (/阅读|读书|书桌|图书|台灯/.test(t)) {
      config.lampType = 'Reading Lamp';
    } else if (/氛围|装饰|环境|ambient/.test(t)) {
      config.lampType = 'Ambient Lamp';
      config.brightnessTarget = '200-400 lm';
      config.useCase = 'Ambient lamp';
    }

    return config;
  }

  // ---------- Rendering ----------

  function selectedColorOrFallback(colorName) {
    var info = COLOR_MAP[colorName] || COLOR_MAP['Warm White'];
    return info;
  }

  function secondaryColor(hex) {
    // compute a slightly darker/lighter accent for inner details
    var map = {
      '#f5efe6': '#e6dcc8',
      '#7a7a78': '#9a9a98',
      '#a83232': '#7d2424',
      '#1c1c1e': '#3a3a3c'
    };
    return map[hex] || '#d8d2c4';
  }

  function renderShell() {
    var styleName = dom.cfgShellStyle.value;
    var style = SHELL_STYLES[styleName];
    if (!style) return;

    while (dom.lampShell.firstChild) {
      dom.lampShell.removeChild(dom.lampShell.firstChild);
    }
    var sec = secondaryColor(state.colorHex);
    var g = style.draw(state.colorHex, sec);
    dom.lampShell.appendChild(g);

    var text = (dom.cfgEngraving.value || '').trim();
    dom.engravingText.textContent = text || '—';

    // pick engraving color based on shell brightness
    var darkShell = (state.color === 'Night Black' || state.color === 'Palace Red');
    dom.engravingText.setAttribute('fill', darkShell ? '#f5efe6' : '#5a5648');

    // place engraving either on base or head depending on style
    var baseY = 326;
    if (styleName === 'Minimal Bar') {
      dom.engravingText.setAttribute('y', '120');
      dom.engravingText.setAttribute('font-size', '14');
    } else if (styleName === 'Hutong Window') {
      dom.engravingText.setAttribute('y', '120');
      dom.engravingText.setAttribute('font-size', '13');
    } else {
      dom.engravingText.setAttribute('y', baseY);
      dom.engravingText.setAttribute('font-size', '16');
    }

    dom.previewCaption.textContent =
      style.label + ' · ' + state.color + (text ? ' · ' + text : '');
  }

  function calculateBom(styleName, colorName) {
    var style = SHELL_STYLES[styleName];
    var shellLow = 6 + Math.round(6 * (style.complexity - 1.0));
    var shellHigh = 12 + Math.round(12 * (style.complexity - 1.0));
    var finishing = FINISHING_COSTS[colorName] || FINISHING_COSTS['Warm White'];

    var rows = [];
    var baseLow = 0, baseHigh = 0;
    for (var i = 0; i < BASE_COMPONENTS.length; i++) {
      var c = BASE_COMPONENTS[i];
      rows.push({ name: c.name, low: c.low, high: c.high });
      baseLow += c.low;
      baseHigh += c.high;
    }
    rows.push({ name: '3D printed shell (' + style.label + ')', low: shellLow, high: shellHigh });
    rows.push({ name: 'Finishing / paint (' + colorName + ')', low: finishing.low, high: finishing.high });

    var totalLow = baseLow + shellLow + finishing.low;
    var totalHigh = baseHigh + shellHigh + finishing.high;
    return { rows: rows, totalLow: totalLow, totalHigh: totalHigh };
  }

  function formatBomRange(low, high) {
    return '$' + low + '-' + high + ' prototype';
  }

  function renderBomTable() {
    var styleName = dom.cfgShellStyle.value;
    var bom = calculateBom(styleName, state.color);
    dom.bomSummary.textContent = formatBomRange(bom.totalLow, bom.totalHigh);

    var tbody = dom.bomTbody;
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

    for (var i = 0; i < bom.rows.length; i++) {
      var r = bom.rows[i];
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(r.name) + '</td>' +
        '<td>$' + r.low + '</td>' +
        '<td>$' + r.high + '</td>';
      tbody.appendChild(tr);
    }
  }

  function buildManufacturingJSON() {
    var styleName = dom.cfgShellStyle.value;
    var style = SHELL_STYLES[styleName];
    var lampType = dom.cfgLampType.value;
    var color = state.color;
    var engraving = (dom.cfgEngraving.value || '').trim();
    var parsed = state.parsed || parseIdeaToConfig(dom.ideaInput.value || DEFAULT_IDEA);
    var bom = calculateBom(styleName, color);

    return {
      phase: 'IDB-6C',
      core_locked: true,
      idea_summary: (dom.ideaInput.value || '').trim().substring(0, 120),
      use_case: parsed.useCase,
      shell_style: styleName,
      color: color,
      engraving: engraving || '(none)',
      reading_target: {
        luminous_flux: parsed.brightnessTarget,
        desk_lux: '300-500 lux',
        distance: '35-45 cm',
        glare_control: 'recessed opal diffuser + downward beam'
      },
      core_stack: [
        '24V high-CRI linear LED strip',
        'aluminum channel heat sink',
        'opal diffuser',
        'M3 dual mount',
        'custom shell'
      ],
      estimated_bom_cost: formatBomRange(bom.totalLow, bom.totalHigh),
      estimated_print_time: style.printTime,
      risk_notes: [
        'Shell complexity multiplier: ' + style.complexity + 'x',
        'Finishing level: ' + style.finishing,
        'Risk level: ' + style.riskLevel,
        'Recommended iteration: ' + style.recommendedIteration
      ],
      assembly_steps: [
        { step: 'Cut 24V high-CRI LED strip to lamp-head length', status: 'manual' },
        { step: 'Attach LED strip to aluminum channel', status: 'manual' },
        { step: 'Install opal diffuser', status: 'manual' },
        { step: 'Mount ReadingCore-01 into custom shell', status: 'prototype-ready' },
        { step: 'Attach arm and base', status: 'manual' },
        { step: 'Run 30-min heat check', status: 'prototype-ready' },
        { step: 'Run glare check at 35-45 cm reading distance', status: 'prototype-ready' },
        { step: 'Save configuration JSON as prototype spec', status: 'future-automation' }
      ]
    };
  }

  function renderManufacturingJSON() {
    var data = buildManufacturingJSON();
    dom.manufacturingJSON.textContent = JSON.stringify(data, null, 2);
  }

  function updateAnalyzeSection() {
    var parsed = state.parsed || parseIdeaToConfig(dom.ideaInput.value || DEFAULT_IDEA);
    state.parsed = parsed;

    dom.archUseCase.textContent = parsed.useCase;
    dom.archCoreChoice.innerHTML = '<span class="locked">🔒 ' + parsed.core + '</span>';
    dom.archBrightness.textContent = parsed.brightnessTarget;
    dom.archColorTemp.textContent = parsed.colorTemperature;
    dom.archShell.textContent = parsed.shellStyle;
    dom.archGlare.textContent = parsed.glareStrategy;
    dom.archPosition.textContent = parsed.estimatedPosition;

    // reflect parsed choices into controls without triggering infinite loops
    if (dom.cfgShellStyle.value !== parsed.shellStyle) {
      dom.cfgShellStyle.value = parsed.shellStyle;
    }
    if (dom.cfgLampType.value !== parsed.lampType) {
      dom.cfgLampType.value = parsed.lampType;
    }
    selectColor(parsed.color, false);
  }

  function renderAll() {
    updateAnalyzeSection();
    renderShell();
    renderBomTable();
    renderManufacturingJSON();
  }

  // ---------- Color chip handling ----------

  function selectColor(colorName, render) {
    var info = COLOR_MAP[colorName];
    if (!info) return;
    state.color = colorName;
    state.colorHex = info.hex;

    var chips = dom.colorRow.querySelectorAll('.color-chip');
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      if (c.getAttribute('data-color') === colorName) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    }

    dom.colorName.textContent = colorName;
    if (render !== false) {
      renderShell();
      renderBomTable();
      renderManufacturingJSON();
    }
  }

  function initColorChips() {
    var chips = dom.colorRow.querySelectorAll('.color-chip');
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      c.style.backgroundColor = c.getAttribute('data-hex');
      c.addEventListener('click', function (e) {
        selectColor(e.currentTarget.getAttribute('data-color'), true);
      });
    }
  }

  // ---------- Helpers ----------

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------- Event wiring ----------

  function wire() {
    dom.btnGenerate.addEventListener('click', function () {
      state.parsed = parseIdeaToConfig(dom.ideaInput.value);
      renderAll();
      var target = document.getElementById('analyze-section');
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    for (var i = 0; i < dom.ideaButtons.length; i++) {
      dom.ideaButtons[i].addEventListener('click', function (e) {
        var idea = e.currentTarget.getAttribute('data-idea');
        dom.ideaInput.value = idea;
        state.parsed = parseIdeaToConfig(idea);
        renderAll();
      });
    }

    dom.cfgLampType.addEventListener('change', function () {
      renderManufacturingJSON();
    });

    dom.cfgShellStyle.addEventListener('change', function () {
      renderShell();
      renderBomTable();
      renderManufacturingJSON();
    });

    dom.cfgEngraving.addEventListener('input', function () {
      renderShell();
      renderManufacturingJSON();
    });

    dom.btnCopyJSON.addEventListener('click', function () {
      var text = dom.manufacturingJSON.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          dom.btnCopyJSON.textContent = 'Copied!';
          setTimeout(function () { dom.btnCopyJSON.textContent = 'Copy'; }, 1500);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        dom.btnCopyJSON.textContent = 'Copied!';
        setTimeout(function () { dom.btnCopyJSON.textContent = 'Copy'; }, 1500);
      }
    });
  }

  // ---------- Init ----------

  function init() {
    if (!dom.ideaInput.value) {
      dom.ideaInput.value = DEFAULT_IDEA;
    }
    initColorChips();
    wire();
    selectColor('Warm White', false);
    state.parsed = parseIdeaToConfig(dom.ideaInput.value);
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
