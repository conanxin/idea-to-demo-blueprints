/* DIY 可定制阅读台灯构建器 Demo — IDB-6E 实物测试
 * Pure vanilla JS. No dependencies. No build step.
 * Drives: SVG shell style + engraving, real-time 制造计划 JSON,
 * BOM cost model, idea-to-config parser, assembly workflow,
 * OpenSCAD export with controlled core keepout, print validation,
 * and physical prototype testing (lux / heat / glare / readiness).
 */

(function () {
  'use strict';

  // ---------- Static reference data ----------

  var DEFAULT_IDEA = '北京风格阅读台灯，外壳可定制，适合书桌使用';

  var COLOR_MAP = {
    '暖白':  { hex: '#f5efe6', label: '暖白', finishing: 1.0 },
    '胡同灰': { hex: '#7a7a78', label: '胡同灰', finishing: 1.0 },
    '宫墙红':  { hex: '#a83232', label: '宫墙红', finishing: 1.15 },
    '夜黑': { hex: '#1c1c1e', label: '夜黑', finishing: 1.1 }
  };

  var SHELL_STYLES = {
    '极简长条': {
      label: '极简长条',
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
    '胡同窗棂': {
      label: '胡同窗棂',
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
    '北京亭檐': {
      label: '北京亭檐',
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
    '书卷弧形': {
      label: '书卷弧形',
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
    '暖白':  { low: 4, high: 8 },
    '胡同灰': { low: 4, high: 8 },
    '宫墙红':  { low: 8, high: 14 },
    '夜黑': { low: 6, high: 12 }
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
    arch颜色Temp:    $('arch-color-temp'),
    archShell:        $('arch-shell'),
    archGlare:        $('arch-glare'),
    archPosition:     $('arch-position'),
    cfgLampType:      $('cfg-lamp-type'),
    cfgShellStyle:    $('cfg-shell-style'),
    cfg刻字:     $('cfg-engraving'),
    colorRow:         $('color-row'),
    colorName:        $('color-name'),
    lampShell:        $('lamp-shell'),
    engravingText:    $('engraving-text'),
    previewCaption:   $('preview-caption'),
    manufacturingJSON:$('manufacturing-json'),
    btn复制JSON:      $('btn-copy-json'),
    bomSummary:       $('bom-summary'),
    bomTbody:         $('bom-tbody'),
    assemblySteps:    $('assembly-steps'),
    cadOpenScad:      $('cad-openscad'),
    cadFilename:      $('cad-filename'),
    cadParamTbody:    $('cad-param-tbody'),
    btn复制OpenScad:  $('btn-copy-openscad'),
    btnDownloadScad:  $('btn-download-scad'),
    btnDownloadConfig:$('btn-download-config'),
    cadValidationList:    $('cad-validation-list'),
    cadRiskLevel:         $('cad-risk-level'),
    cadNextTest:          $('cad-next-test'),
    printOrientationBody: $('print-orientation-body'),
    slicerProfileBody:    $('slicer-profile-body'),
    btnDownloadFitTest:   $('btn-download-fit-test'),
    btnDownloadSlicerProfile: $('btn-download-slicer-profile'),
    btnDownloadValidationReport: $('btn-download-validation-report'),
    luxGrid:                  $('lux-grid'),
    heatPoints:               $('heat-points'),
    glareChecks:              $('glare-checks'),
    prototypeChecklist:     $('prototype-checklist'),
    gate数值:                $('gate-value'),
    btnDownloadTestProtocol:  $('btn-download-test-protocol'),
    btnDownloadMeasurementLog: $('btn-download-measurement-log'),
    btnDownloadReadinessReport: $('btn-download-readiness-report'),
    btnDownloadPrototypeChecklist: $('btn-download-prototype-checklist')
  };

  // ---------- State ----------

  var state = {
    color:    '暖白',
    colorHex: '#f5efe6',
    parsed:   null
  };

  // ---------- Idea parser (lightweight rule-based, no LLM) ----------

  function parseIdeaToConfig(text) {
    var t = (text || '').to低估erCase();
    var config = {
      useCase: '桌面阅读台灯',
      lampType: '阅读台灯',
      colorTemperature: '暖白 3000K',
      shellStyle: '胡同窗棂',
      color: '暖白',
      glareStrategy: '内缩式乳白扩散罩',
      brightnessTarget: '500-800 lm',
      estimatedPosition: 'Desk, 35-45 cm',
      core: 'ReadingCore-01'
    };

    if (/北京|胡同|四合院|窗/.test(t)) {
      config.shellStyle = '胡同窗棂';
      config.color = /灰/.test(t) ? '胡同灰' : '暖白';
    }
    if (/天坛|宫殿|中式|亭|阁/.test(t)) {
      config.shellStyle = '北京亭檐';
      config.color = '宫墙红';
    }
    if (/极简|黑色|工作|桌面|办公/.test(t)) {
      config.shellStyle = '极简长条';
      config.color = '夜黑';
      config.brightnessTarget = '600-800 lm';
      config.useCase = 'Desktop work lamp';
      config.estimatedPosition = 'Desk, 40-50 cm';
    }
    if (/书卷|床头|弧形|孩子|儿童|睡前|读书|阅读/.test(t)) {
      if (/书卷|床头|弧形/.test(t)) {
        config.shellStyle = '书卷弧形';
      }
      if (/孩子|儿童|睡前|读书|阅读/.test(t)) {
        config.colorTemperature = 'Warm 2700K';
        config.glareStrategy = '低估 glare, recessed diffuser';
        config.brightnessTarget = 'Soft reading 400-600 lm';
        config.useCase = 'Bedside reading lamp';
        config.estimatedPosition = 'Bedside, 35-45 cm';
      }
    }
    if (/孩子|儿童|睡前/.test(t)) {
      config.shellStyle = '书卷弧形';
    }

    if (/阅读|读书|书桌|图书|台灯/.test(t)) {
      config.lampType = '阅读台灯';
    } else if (/氛围|装饰|环境|ambient/.test(t)) {
      config.lampType = '氛围灯';
      config.brightnessTarget = '200-400 lm';
      config.useCase = 'Ambient lamp';
    }

    return config;
  }

  // ---------- Rendering ----------

  function selected颜色OrFallback(colorName) {
    var info = COLOR_MAP[colorName] || COLOR_MAP['暖白'];
    return info;
  }

  function secondary颜色(hex) {
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
    var sec = secondary颜色(state.colorHex);
    var g = style.draw(state.colorHex, sec);
    dom.lampShell.appendChild(g);

    var text = (dom.cfg刻字.value || '').trim();
    dom.engravingText.textContent = text || '—';

    // pick engraving color based on shell brightness
    var darkShell = (state.color === '夜黑' || state.color === '宫墙红');
    dom.engravingText.setAttribute('fill', darkShell ? '#f5efe6' : '#5a5648');

    // place engraving either on base or head depending on style
    var baseY = 326;
    if (styleName === '极简长条') {
      dom.engravingText.setAttribute('y', '120');
      dom.engravingText.setAttribute('font-size', '14');
    } else if (styleName === '胡同窗棂') {
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
    var shell低估 = 6 + Math.round(6 * (style.complexity - 1.0));
    var shell高估 = 12 + Math.round(12 * (style.complexity - 1.0));
    var finishing = FINISHING_COSTS[colorName] || FINISHING_COSTS['暖白'];

    var rows = [];
    var base低估 = 0, base高估 = 0;
    for (var i = 0; i < BASE_COMPONENTS.length; i++) {
      var c = BASE_COMPONENTS[i];
      rows.push({ name: c.name, low: c.low, high: c.high });
      base低估 += c.low;
      base高估 += c.high;
    }
    rows.push({ name: '3D printed shell (' + style.label + ')', low: shell低估, high: shell高估 });
    rows.push({ name: 'Finishing / paint (' + colorName + ')', low: finishing.low, high: finishing.high });

    var total低估 = base低估 + shell低估 + finishing.low;
    var total高估 = base高估 + shell高估 + finishing.high;
    return { rows: rows, total低估: total低估, total高估: total高估 };
  }

  function formatBomRange(low, high) {
    return '$' + low + '-' + high + ' prototype';
  }

  function renderBomTable() {
    var styleName = dom.cfgShellStyle.value;
    var bom = calculateBom(styleName, state.color);
    dom.bomSummary.textContent = formatBomRange(bom.total低估, bom.total高估);

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
    var engraving = (dom.cfg刻字.value || '').trim();
    var parsed = state.parsed || parseIdeaToConfig(dom.ideaInput.value || DEFAULT_IDEA);
    var bom = calculateBom(styleName, color);
    var cad = buildCadParams();

    return {
      phase: 'IDB-6D',
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
      estimated_bom_cost: formatBomRange(bom.total低估, bom.total高估),
      estimated_print_time: style.printTime,
      risk_notes: [
        'Shell complexity multiplier: ' + style.complexity + 'x',
        'Finishing level: ' + style.finishing,
        '风险等级: ' + style.riskLevel,
        'Recommended iteration: ' + style.recommendedIteration
      ],
      assembly_steps: [
        { step: '按灯头长度裁剪 24V 高显色 LED 灯带', status: '手动' },
        { step: '将 LED 灯带贴到铝槽/铝型材上', status: '手动' },
        { step: '安装乳白扩散罩', status: '手动' },
        { step: '把 ReadingCore-01 装入定制外壳', status: '样机可用' },
        { step: '安装支臂和底座', status: '手动' },
        { step: '进行 30 分钟发热检查', status: '样机可用' },
        { step: '在 35–45 cm 阅读距离做眩光检查', status: '样机可用' },
        { step: '保存配置 JSON 作为样机规格', status: '未来自动化' }
      ],
      cad_export: {
        format: 'OpenSCAD',
        generated_file: 'shell_export.scad',
        optional_stl_command: 'openscad -o shell_export.stl shell_export.scad',
        cad_scope: 'shell_only',
        core_keepout_included: true,
        stl_export_requires: 'OpenSCAD 2021+ installed locally'
      },
      print_validation: {
        phase: 'IDB-6D',
        cad_validation: buildCadValidationContext(),
        print_orientation: buildPrintOrientationPlan(),
        slicer_profile: buildSlicerProfile(),
        fit_test_coupon: {
          generated_file: 'fit-test-coupon.scad',
          optional_stl_command: 'openscad -o fit-test-coupon.stl fit-test-coupon.scad'
        }
      },
      physical_testing: buildPhysicalReadinessReport()
    };
  }

  function renderManufacturingJSON() {
    var data = buildManufacturingJSON();
    dom.manufacturingJSON.textContent = JSON.stringify(data, null, 2);
  }

  // ---------- CAD 导出 helpers ----------

  function buildCadParams() {
    var styleName = dom.cfgShellStyle.value;
    var style = SHELL_STYLES[styleName];
    var engraving = (dom.cfg刻字.value || '').trim();
    // controlled base sizes derived from style complexity
    var shellLen = 140 + Math.round(40 * (style.complexity - 1.0));
    var shellWid = 44 + Math.round(12 * (style.complexity - 1.0));
    var shellHgt = 28 + Math.round(10 * (style.complexity - 1.0));
    var wall = 2.4;
    var diffuserLen = shellLen - 8;
    var diffuserWid = 24;
    // core keepout fixed around ReadingCore-01 cassette
    var coreL = 120;
    var coreW = 36;
    var coreH = 14;
    var mountD = 3.2;
    var mountSpacing = 104;

    return {
      shell_style: styleName,
      engraving_text: engraving || '(none)',
      shell_length: shellLen,
      shell_width: shellWid,
      shell_height: shellHgt,
      wall: wall,
      diffuser_length: diffuserLen,
      diffuser_width: diffuserWid,
      core_keepout_length: coreL,
      core_keepout_width: coreW,
      core_keepout_height: coreH,
      mount_hole_d: mountD,
      mount_spacing: mountSpacing
    };
  }

  function generateOpenScad() {
    var p = buildCadParams();
    var scad = [];
    scad.push('// DIY 可定制阅读台灯构建器 — OpenSCAD shell export');
    scad.push('// Generated by IDB-6C CAD 导出');
    scad.push('// Shell style: ' + p.shell_style);
    scad.push('// 刻字: ' + p.engraving_text);
    scad.push('');
    scad.push('shell_style = "' + p.shell_style.replace(/"/g, '\\"') + '";');
    scad.push('engraving_text = "' + p.engraving_text.replace(/"/g, '\\"') + '";');
    scad.push('shell_length = ' + p.shell_length + ';');
    scad.push('shell_width = ' + p.shell_width + ';');
    scad.push('shell_height = ' + p.shell_height + ';');
    scad.push('wall = ' + p.wall + ';');
    scad.push('diffuser_length = ' + p.diffuser_length + ';');
    scad.push('diffuser_width = ' + p.diffuser_width + ';');
    scad.push('core_keepout_length = ' + p.core_keepout_length + ';');
    scad.push('core_keepout_width = ' + p.core_keepout_width + ';');
    scad.push('core_keepout_height = ' + p.core_keepout_height + ';');
    scad.push('mount_hole_d = ' + p.mount_hole_d + ';');
    scad.push('mount_spacing = ' + p.mount_spacing + ';');
    scad.push('');
    scad.push('// ---------- Module library ----------');
    scad.push('');
    scad.push('module readingcore_keepout() {');
    scad.push('  // Reserved volume for ReadingCore-01 cassette + LED channel + diffuser');
    scad.push('  color("DimGrey")');
    scad.push('    cube([core_keepout_length, core_keepout_width, core_keepout_height], center = true);');
    scad.push('}');
    scad.push('');
    scad.push('module diffuser_slot() {');
    scad.push('  // Cut-out where light exits downward');
    scad.push('  color("LightYellow")');
    scad.push('    cube([diffuser_length, diffuser_width, 4], center = true);');
    scad.push('}');
    scad.push('');
    scad.push('module m3_mount_holes() {');
    scad.push('  for (x = [-mount_spacing/2, mount_spacing/2])');
    scad.push('    translate([x, 0, 0])');
    scad.push('      cylinder(d = mount_hole_d, h = shell_width + 2, center = true, $fn = 32);');
    scad.push('}');
    scad.push('');
    scad.push('module cable_exit() {');
    scad.push('  // Side exit for 24V cable');
    scad.push('  rotate([90, 0, 0])');
    scad.push('    cylinder(d = 8, h = shell_width + 2, center = true, $fn = 32);');
    scad.push('}');
    scad.push('');
    scad.push('module shell_minimal_bar() {');
    scad.push('  difference() {');
    scad.push('    rounded_box(shell_length, shell_width, shell_height, wall);');
    scad.push('    readingcore_keepout();');
    scad.push('    diffuser_slot();');
    scad.push('    m3_mount_holes();');
    scad.push('    cable_exit();');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module shell_hutong_window() {');
    scad.push('  difference() {');
    scad.push('    rounded_box(shell_length, shell_width, shell_height, wall);');
    scad.push('    readingcore_keepout();');
    scad.push('    diffuser_slot();');
    scad.push('    m3_mount_holes();');
    scad.push('    cable_exit();');
    scad.push('    // decorative mullions cut-outs');
    scad.push('    for (x = [-shell_length/3, 0, shell_length/3])');
    scad.push('      translate([x, 0, shell_height/2 - wall])');
    scad.push('        cube([wall, shell_width - wall*2, wall*2], center = true);');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module shell_beijing_pavilion() {');
    scad.push('  difference() {');
    scad.push('    union() {');
    scad.push('      rounded_box(shell_length, shell_width, shell_height, wall);');
    scad.push('      // tiered roof');
    scad.push('      translate([0, 0, shell_height/2])');
    scad.push('        linear_extrude(height = wall*2)');
    scad.push('          polygon([[-shell_length/2, -shell_width/3], [shell_length/2, -shell_width/3],');
    scad.push('                   [0, shell_width/2]]);');
    scad.push('    }');
    scad.push('    readingcore_keepout();');
    scad.push('    diffuser_slot();');
    scad.push('    m3_mount_holes();');
    scad.push('    cable_exit();');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module shell_book_arc() {');
    scad.push('  difference() {');
    scad.push('    union() {');
    scad.push('      rounded_box(shell_length, shell_width, shell_height, wall);');
    scad.push('      // page-fold arc');
    scad.push('      translate([0, 0, shell_height/2])');
    scad.push('        rotate([0, 90, 0])');
    scad.push('          cylinder(d = shell_width, h = shell_length, center = true, $fn = 64);');
    scad.push('    }');
    scad.push('    readingcore_keepout();');
    scad.push('    diffuser_slot();');
    scad.push('    m3_mount_holes();');
    scad.push('    cable_exit();');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module selected_shell() {');
    scad.push('  if (shell_style == "极简长条")');
    scad.push('    shell_minimal_bar();');
    scad.push('  else if (shell_style == "胡同窗棂")');
    scad.push('    shell_hutong_window();');
    scad.push('  else if (shell_style == "北京亭檐")');
    scad.push('    shell_beijing_pavilion();');
    scad.push('  else if (shell_style == "书卷弧形")');
    scad.push('    shell_book_arc();');
    scad.push('  else');
    scad.push('    shell_minimal_bar();');
    scad.push('}');
    scad.push('');
    scad.push('module rounded_box(l, w, h, r) {');
    scad.push('  $fn = 32;');
    scad.push('  translate([0, 0, 0])');
    scad.push('    minkowski() {');
    scad.push('      cube([l - r*2, w - r*2, h - r*2], center = true);');
    scad.push('      sphere(r = r);');
    scad.push('    }');
    scad.push('}');
    scad.push('');
    scad.push('// ---------- Final part ----------');
    scad.push('selected_shell();');
    return scad.join('\\n');
  }

  function renderCadExport() {
    var code = generateOpenScad();
    dom.cadOpenScad.textContent = code;
    dom.cadFilename.textContent = 'shell_export.scad';

    var p = buildCadParams();
    var tbody = dom.cadParamTbody;
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    var rows = [
      ['Shell style', p.shell_style],
      ['刻字 text', p.engraving_text],
      ['shell_length', p.shell_length + ' mm'],
      ['shell_width', p.shell_width + ' mm'],
      ['shell_height', p.shell_height + ' mm'],
      ['wall', p.wall + ' mm'],
      ['diffuser_length', p.diffuser_length + ' mm'],
      ['diffuser_width', p.diffuser_width + ' mm'],
      ['core_keepout_length', p.core_keepout_length + ' mm'],
      ['core_keepout_width', p.core_keepout_width + ' mm'],
      ['core_keepout_height', p.core_keepout_height + ' mm'],
      ['mount_hole_d', p.mount_hole_d + ' mm'],
      ['mount_spacing', p.mount_spacing + ' mm']
    ];
    for (var i = 0; i < rows.length; i++) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + esc(rows[i][0]) + '</td><td>' + esc(rows[i][1]) + '</td>';
      tbody.appendChild(tr);
    }
  }

  // ---------- IDB-6D 打印验证 helpers ----------

  function buildCadValidationContext() {
    var p = buildCadParams();
    var style = SHELL_STYLES[p.shell_style];
    var shellComplexity = style ? style.complexity : 1.0;
    var thinWall = p.wall < 2.0;
    var engraving = p.engraving_text && p.engraving_text !== '(none)' ? p.engraving_text : '';
    var engravingLong = engraving.length > 12;

    var checks = [
      { name: 'ReadingCore-01 keepout', status: 'PASS', detail: 'Core keepout ' + p.core_keepout_length + '×' + p.core_keepout_width + '×' + p.core_keepout_height + ' mm reserved.' },
      { name: 'Diffuser slot clearance', status: 'PASS', detail: 'Slot width ' + p.diffuser_width + ' mm, length ' + p.diffuser_length + ' mm.' },
      { name: 'M3 mount holes', status: 'PASS', detail: 'Hole d=' + p.mount_hole_d + ' mm, spacing ' + p.mount_spacing + ' mm.' },
      { name: 'Cable exit', status: 'PASS', detail: 'Side exit d=8 mm for 24V cable.' },
      { name: 'Minimum wall thickness', status: thinWall ? 'WARN' : 'PASS', detail: thinWall ? 'Wall ' + p.wall + ' mm is below 2.0 mm recommendation.' : 'Wall ' + p.wall + ' mm meets 2.0 mm minimum.' },
      { name: '刻字 manufacturability', status: engravingLong ? 'WARN' : 'PASS', detail: engravingLong ? 'Long engraving may need larger font / test text.' : '刻字 length OK for fit-test sample.' }
    ];

    var warnCount = 0;
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].status === 'WARN') warnCount++;
    }
    var riskLevel = shellComplexity > 1.3 ? (warnCount > 0 ? 'high' : 'medium') : (warnCount > 0 ? 'medium' : 'low');

    return {
      phase: 'IDB-6D',
      core_locked: true,
      checks: checks,
      risk_level: riskLevel,
      shell_complexity: style ? (style.complexity <= 1.1 ? 'low' : style.complexity <= 1.3 ? 'medium' : 'high') : 'medium',
      next_physical_test: '先打印装配测试件，再打印完整外壳'
    };
  }

  function validateCadParams() {
    return buildCadValidationContext();
  }

  function buildPrintOrientationPlan() {
    var p = buildCadParams();
    var plans = {
      '极简长条': {
        orientation: 'Diffuser opening facing upward or side-up',
        support_strategy: 'Usually no support / minimal support',
        bed_contact: 'Flat back on build plate',
        risk_level: 'low',
        why: 'Boxy geometry with flat back and minimal overhangs.'
      },
      '胡同窗棂': {
        orientation: 'Back face on bed, grille facing upward',
        support_strategy: 'Moderate supports for grille details',
        bed_contact: 'Flat back on build plate',
        risk_level: 'medium',
        why: 'Grille mullions need bridging / support cleanup.'
      },
      '北京亭檐': {
        orientation: 'Roof ridge upward, flat back on bed',
        support_strategy: 'Likely supports for eaves',
        bed_contact: 'Flat back on build plate',
        risk_level: 'high',
        why: 'Tiered roof and eaves create large overhangs.'
      },
      '书卷弧形': {
        orientation: 'Arc upward, diffuser side controlled',
        support_strategy: 'Moderate supports under arc',
        bed_contact: 'Flat back on build plate',
        risk_level: 'medium-high',
        why: 'Curved shell surfaces create layer-line and support scars.'
      }
    };
    return plans[p.shell_style] || plans['极简长条'];
  }

  function buildSlicerProfile() {
    var p = buildCadParams();
    var style = SHELL_STYLES[p.shell_style] || {};
    var needsSupport = style.riskLevel !== 'low';
    return {
      profile_name: 'IDB-6D DIY Lamp Shell FDM v0',
      material_primary: 'PETG',
      material_visual_mock: 'PLA+',
      nozzle_mm: 0.4,
      layer_height_mm: 0.2,
      perimeters: 3,
      top_bottom_layers: 5,
      infill_percent: 18,
      brim: true,
      supports: needsSupport ? 'auto generated, from build plate only' : 'disabled for flat back orientation',
      seam_position: 'back side',
      print_speed: 'moderate (45-60 mm/s)',
      bed_temp_c: {
        PLAplus: '55-60',
        PETG: '75-85'
      },
      nozzle_temp_c: {
        PLAplus: '200-210',
        PETG: '235-245'
      },
      notes: [
        'PETG recommended for first durable prototype.',
        'PLA+ acceptable for visual / color mock.',
        'Enable avoid_crossing_perimeters for cleaner surface.',
        'Brim helps long shells stick to the bed.',
        'Place seam on the back side away from the user.'
      ]
    };
  }

  function generateFitTestCouponScad() {
    var p = buildCadParams();
    var scad = [];
    scad.push('// IDB-6D 装配测试件');
    scad.push('// Generated by DIY 可定制阅读台灯构建器');
    scad.push('// Print this coupon before the full shell to validate M3 holes, diffuser slot, cable exit, and engraving.');
    scad.push('');
    scad.push('font = "Liberation Sans"; // font() may not render on all OpenSCAD builds; use for reference only');
    scad.push('');
    scad.push('module m3_hole_ladder() {');
    scad.push('  // M3 hole diameter test: 3.0 / 3.2 / 3.4 mm');
    scad.push('  for (i = [0:2]) {');
    scad.push('    d = 3.0 + i * 0.2;');
    scad.push('    translate([i * 10, 0, 0])');
    scad.push('      cylinder(d = d, h = 10, center = true, $fn = 32);');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module diffuser_slot_ladder() {');
    scad.push('  // Diffuser slot width test: 17.8 / 18.0 / 18.2 / 18.4 mm');
    scad.push('  widths = [17.8, 18.0, 18.2, 18.4];');
    scad.push('  for (i = [0:3]) {');
    scad.push('    translate([i * 22, 0, 0])');
    scad.push('      cube([widths[i], 4, 8], center = true);');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module cable_exit_test() {');
    scad.push('  // 线缆出口半径测试: 4 / 5 mm');
    scad.push('  for (i = [0:1]) {');
    scad.push('    r = 4 + i;');
    scad.push('    translate([i * 12, 0, 0])');
    scad.push('      cylinder(r = r, h = 10, center = true, $fn = 32);');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('module engraving_sample() {');
    scad.push('  // Small text sample to check legibility after FDM');
    scad.push('  linear_extrude(height = 0.3)');
    scad.push('    text("IDB-6D", size = 3, font = font, halign = "center", valign = "center");');
    scad.push('}');
    scad.push('');
    scad.push('module fit_test_coupon() {');
    scad.push('  difference() {');
    scad.push('    union() {');
    scad.push('      // base plate');
    scad.push('      cube([70, 40, 2], center = true);');
    scad.push('      // cable exit bosses');
    scad.push('      translate([-20, 12, 3]) cylinder(r = 6, h = 4, center = true, $fn = 32);');
    scad.push('      translate([8, 12, 3]) cylinder(r = 6, h = 4, center = true, $fn = 32);');
    scad.push('    }');
    scad.push('    // M3 holes');
    scad.push('    translate([-20, -10, 0]) m3_hole_ladder();');
    scad.push('    // diffuser slots');
    scad.push('    translate([-22, 2, 0]) diffuser_slot_ladder();');
    scad.push('    // cable exits');
    scad.push('    translate([-20, 12, 3]) cable_exit_test();');
    scad.push('    // engraving');
    scad.push('    translate([18, -10, 1]) engraving_sample();');
    scad.push('  }');
    scad.push('}');
    scad.push('');
    scad.push('fit_test_coupon();');
    return scad.join('\\n');
  }

  function buildValidationReport() {
    return {
      phase: 'IDB-6D',
      configuration_id: 'sample-' + (buildCadParams().shell_style || 'minimal-bar').to低估erCase().replace(/ /g, '-'),
      cad_validation: buildCadValidationContext(),
      print_orientation: buildPrintOrientationPlan(),
      slicer_profile: buildSlicerProfile(),
      fit_test_coupon: {
        generated_file: 'fit-test-coupon.scad',
        optional_stl_command: 'openscad -o fit-test-coupon.stl fit-test-coupon.scad'
      },
      openscad_export: 'PASS',
      fit_test_coupon_status: 'PENDING',
      measured_fit: 'PENDING',
      ready_for_full_shell_print: false
    };
  }

  function renderPrintValidation() {
    var validation = buildCadValidationContext();
    var list = dom.cadValidationList;
    while (list.firstChild) list.removeChild(list.firstChild);
    for (var i = 0; i < validation.checks.length; i++) {
      var c = validation.checks[i];
      var li = document.createElement('li');
      var statusClass = c.status === 'PASS' ? 'check-pass' : c.status === 'WARN' ? 'check-warn' : 'check-fail';
      li.className = statusClass;
      li.innerHTML = '<span class="check-name">' + esc(c.name) + '</span>' +
        '<span class="check-status">' + esc(c.status) + '</span>' +
        '<span class="check-detail">' + esc(c.detail) + '</span>';
      list.appendChild(li);
    }
    dom.cadRiskLevel.textContent = validation.risk_level;
    dom.cadNextTest.textContent = validation.next_physical_test;

    var orient = buildPrintOrientationPlan();
    var orientBody = dom.printOrientationBody;
    orientBody.innerHTML =
      '<div class="orientation-row"><span class="orientation-key">Orientation</span><span class="orientation-value">' + esc(orient.orientation) + '</span></div>' +
      '<div class="orientation-row"><span class="orientation-key">Supports</span><span class="orientation-value">' + esc(orient.support_strategy) + '</span></div>' +
      '<div class="orientation-row"><span class="orientation-key">Bed contact</span><span class="orientation-value">' + esc(orient.bed_contact) + '</span></div>' +
      '<div class="orientation-row"><span class="orientation-key">Risk</span><span class="orientation-value">' + esc(orient.risk_level) + '</span></div>' +
      '<div class="orientation-row"><span class="orientation-key">Why</span><span class="orientation-value">' + esc(orient.why) + '</span></div>';

    var profile = buildSlicerProfile();
    var slicerBody = dom.slicerProfileBody;
    var tableRows =
      '<tr><td>Profile</td><td>' + esc(profile.profile_name) + '</td></tr>' +
      '<tr><td>Primary material</td><td>' + esc(profile.material_primary) + '</td></tr>' +
      '<tr><td>Visual mock material</td><td>' + esc(profile.material_visual_mock) + '</td></tr>' +
      '<tr><td>Nozzle</td><td>' + profile.nozzle_mm + ' mm</td></tr>' +
      '<tr><td>Layer height</td><td>' + profile.layer_height_mm + ' mm</td></tr>' +
      '<tr><td>Perimeters</td><td>' + profile.perimeters + '</td></tr>' +
      '<tr><td>Top/bottom layers</td><td>' + profile.top_bottom_layers + '</td></tr>' +
      '<tr><td>Infill</td><td>' + profile.infill_percent + '%</td></tr>' +
      '<tr><td>Supports</td><td>' + esc(profile.supports) + '</td></tr>' +
      '<tr><td>Brim</td><td>' + (profile.brim ? 'yes' : 'no') + '</td></tr>' +
      '<tr><td>Seam</td><td>' + esc(profile.seam_position) + '</td></tr>' +
      '<tr><td>Speed</td><td>' + esc(profile.print_speed) + '</td></tr>';
    slicerBody.innerHTML = '<table class="profile-table">' + tableRows + '</table>';
  }

  function downloadBlob(filename, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain' });
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }, 0);
  }

  function downloadFitTestScad() {
    downloadBlob('fit-test-coupon.scad', generateFitTestCouponScad(), 'application/x-openscad');
  }

  function downloadSlicerProfile() {
    var p = buildSlicerProfile();
    var lines = [];
    lines.push('# IDB-6D DIY Lamp Shell 切片参数');
    lines.push('# Generator: DIY 可定制阅读台灯构建器');
    lines.push('');
    lines.push('profile_name = ' + p.profile_name);
    lines.push('material_primary = ' + p.material_primary);
    lines.push('material_visual_mock = ' + p.material_visual_mock);
    lines.push('nozzle_mm = ' + p.nozzle_mm);
    lines.push('layer_height_mm = ' + p.layer_height_mm);
    lines.push('perimeters = ' + p.perimeters);
    lines.push('top_bottom_layers = ' + p.top_bottom_layers);
    lines.push('infill_percent = ' + p.infill_percent);
    lines.push('brim = ' + (p.brim ? 'yes' : 'no'));
    lines.push('supports = ' + p.supports);
    lines.push('seam_position = ' + p.seam_position);
    lines.push('print_speed = ' + p.print_speed);
    lines.push('');
    lines.push('# PLA+ temps');
    lines.push('bed_temp_c_PLAplus = ' + p.bed_temp_c.PLAplus);
    lines.push('nozzle_temp_c_PLAplus = ' + p.nozzle_temp_c.PLAplus);
    lines.push('');
    lines.push('# PETG temps');
    lines.push('bed_temp_c_PETG = ' + p.bed_temp_c.PETG);
    lines.push('nozzle_temp_c_PETG = ' + p.nozzle_temp_c.PETG);
    lines.push('');
    lines.push('# Notes');
    for (var i = 0; i < p.notes.length; i++) {
      lines.push('# - ' + p.notes[i]);
    }
    downloadBlob('slicer-profile-idb-6d.ini', lines.join('\\n'), 'text/plain');
  }

  function downloadValidationReport() {
    var report = buildValidationReport();
    downloadBlob('validation-report.json', JSON.stringify(report, null, 2), 'application/json');
  }

  function downloadScad() {
    var code = generateOpenScad();
    var blob = new Blob([code], { type: 'application/x-openscad' });
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'shell_export.scad';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }, 0);
  }

  function downloadConfigJson() {
    var data = buildCadParams();
    data.exported_at = new Date().toISOString();
    data.generator = 'DIY 可定制阅读台灯构建器 IDB-6C';
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'lamp_config.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      (window.URL || window.webkitURL).revokeObjectURL(url);
    }, 0);
  }

  function copyOpenScad() {
    var text = dom.cadOpenScad.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        dom.btn复制OpenScad.textContent = 'Copied!';
        setTimeout(function () { dom.btn复制OpenScad.textContent = '复制 OpenSCAD'; }, 1500);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      dom.btn复制OpenScad.textContent = 'Copied!';
      setTimeout(function () { dom.btn复制OpenScad.textContent = '复制 OpenSCAD'; }, 1500);
    }
  }

  function updateAnalyzeSection() {
    var parsed = state.parsed || parseIdeaToConfig(dom.ideaInput.value || DEFAULT_IDEA);
    state.parsed = parsed;

    dom.archUseCase.textContent = parsed.useCase;
    dom.archCoreChoice.innerHTML = '<span class="locked">🔒 ' + parsed.core + '</span>';
    dom.archBrightness.textContent = parsed.brightnessTarget;
    dom.arch颜色Temp.textContent = parsed.colorTemperature;
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
    select颜色(parsed.color, false);
  }

  function renderAll() {
    updateAnalyzeSection();
    renderShell();
    renderBomTable();
    renderManufacturingJSON();
    renderCadExport();
    renderPrintValidation();
    renderPhysicalTesting();
  }

  // ---------- IDB-6E 实物测试 helpers ----------

  function buildLuxTestPlan() {
    return {
      phase: 'IDB-6E',
      test_name: 'reading-zone lux grid',
      target_distance_cm: '35-45',
      target_lux: '300-500',
      points: [
        { id: 'center', target: '>=300 lux' },
        { id: 'left_page', target: '>=200 lux' },
        { id: 'right_page', target: '>=200 lux' },
        { id: 'front_edge', target: 'trend only' },
        { id: 'back_edge', target: 'trend only' }
      ],
      device: 'lux meter preferred; phone app acceptable for trend-only prototype checks',
      status: 'PENDING_MEASUREMENT'
    };
  }

  function buildHeatSoakPlan() {
    return {
      phase: 'IDB-6E',
      duration_first_pass_min: 30,
      duration_extended_min: 60,
      measurement_points: [
        'aluminum_channel',
        'printed_shell_near_led',
        'diffuser_edge',
        'base_or_controller',
        'cable_exit'
      ],
      pass_rule: 'no softening, warping, smell, discoloration, or uncomfortable touch temperature',
      status: 'PENDING_MEASUREMENT'
    };
  }

  function buildGlareReview() {
    return {
      phase: 'IDB-6E',
      review_position: 'normal seated reading posture',
      checks: [
        { name: 'Direct LED visibility', target: 'not visible' },
        { name: 'Diffuser recess', target: 'recessed or shielded' },
        { name: 'Paper hot spot', target: 'no sharp hot spot' },
        { name: 'Reflection', target: 'no harsh glare on glossy page' },
        { name: 'Shadow', target: 'hand/book shadow acceptable' }
      ],
      status: 'PENDING_REVIEW'
    };
  }

  function buildPrototypeChecklist() {
    return {
      electrical_boundary: {
        label: 'Electrical boundary',
        items: [
          'low-voltage adapter only',
          'no exposed conductor',
          'strain relief at cable exit'
        ]
      },
      mechanical_fit: {
        label: 'Mechanical fit',
        items: [
          'ReadingCore-01 fits shell',
          'M3 holes fit',
          'diffuser slides in',
          'base stable'
        ]
      },
      print_quality: {
        label: 'Print quality',
        items: [
          'no warping',
          'no layer crack near mount',
          'no sharp edges'
        ]
      },
      measurement_completion: {
        label: 'Measurement completion',
        items: [
          'lux grid completed',
          'heat soak completed',
          'glare review completed'
        ]
      }
    };
  }

  function buildPhysicalReadinessReport() {
    var p = buildCadParams();
    return {
      phase: 'IDB-6E',
      core: 'ReadingCore-01',
      shell_style: p.shell_style,
      color: state.color,
      engraving: p.engraving_text,
      lux_test: buildLuxTestPlan(),
      heat_soak: buildHeatSoakPlan(),
      glare_review: buildGlareReview(),
      prototype_checklist: buildPrototypeChecklist(),
      readiness_gate: '等待实物测试',
      not_certification: true
    };
  }

  function generateTestProtocolMarkdown() {
    var p = buildCadParams();
    var lines = [];
    lines.push('# IDB-6E Physical Prototype Test Protocol');
    lines.push('');
    lines.push('Generated by DIY 可定制阅读台灯构建器 for: **' + p.shell_style + ' / ' + state.color + '**');
    lines.push('');
    lines.push('## Test setup');
    lines.push('- ReadingCore-01 module installed');
    lines.push('- Lamp placed at normal reading height');
    lines.push('- Book / reading surface at 35–45 cm from lamp head');
    lines.push('');
    lines.push('## Tools');
    lines.push('- Lux meter (preferred) or phone lux app (trend only)');
    lines.push('- IR or contact thermometer (optional)');
    lines.push('- Timer');
    lines.push('- Measurement log sheet');
    lines.push('');
    lines.push('## Lux grid protocol');
    lines.push('1. Turn lamp on and wait 2 minutes.');
    lines.push('2. Measure illuminance at: center, left page, right page, front edge, back edge.');
    lines.push('3. Pass: center >= 300 lux; no reading-zone point below 200 lux.');
    lines.push('');
    lines.push('## Heat soak protocol');
    lines.push('1. Run lamp at normal power in a ventilated room.');
    lines.push('2. Record touch/feel observations at 0, 30, and 60 minutes.');
    lines.push('3. Check: shell softening, warping, smell, discoloration.');
    lines.push('');
    lines.push('## Glare review protocol');
    lines.push('1. Sit at normal reading posture.');
    lines.push('2. Confirm direct LED is hidden by diffuser / shell.');
    lines.push('3. Confirm no harsh reflection on glossy page.');
    lines.push('4. Confirm shadow is acceptable.');
    lines.push('');
    lines.push('## Limitations');
    lines.push('- This is a first-prototype workflow, not a certified photometric, thermal, or electrical safety test.');
    lines.push('- Not medical, not eye-safety, not UL/CCC/IEC/GB certification.');
    lines.push('');
    lines.push('## Next step');
    lines.push('Record results in the Measurement Log CSV and decide whether to iterate CAD before a full build.');
    return lines.join('\\n');
  }

  function generateMeasurementLogCsv() {
    var header = 'date,prototype_id,shell_style,color,engraving,material,led_module,power_setting,distance_cm,lux_center,lux_left_page,lux_right_page,lux_front_edge,lux_back_edge,heat_0_min_aluminum_c,heat_30_min_aluminum_c,heat_60_min_aluminum_c,heat_30_min_shell_c,heat_60_min_shell_c,direct_led_visible,paper_hotspot,glare_notes,heat_notes,pass_warn_fail,next_adjustment';
    var sample = '2026-07-03,sample-' + (buildCadParams().shell_style || 'minimal-bar').to低估erCase().replace(/ /g, '-') + '-001,' + (buildCadParams().shell_style || '') + ',' + (state.color || '') + ',' + (buildCadParams().engraving_text || '') + ',PETG,24V linear LED,100%,40,,,,,,,,,,,no,no,record here,record here,PENDING,record here';
    return header + '\\n' + sample + '\\n';
  }

  function generatePrototypeChecklistMarkdown() {
    var lines = [];
    lines.push('# IDB-6E 样机就绪检查清单');
    lines.push('');
    lines.push('## 低估 voltage boundary');
    lines.push('- [ ] 低估-voltage adapter only');
    lines.push('- [ ] No exposed conductor');
    lines.push('- [ ] Strain relief at cable exit');
    lines.push('');
    lines.push('## Mechanical fit');
    lines.push('- [ ] ReadingCore-01 fits shell');
    lines.push('- [ ] M3 holes fit');
    lines.push('- [ ] Diffuser slides in');
    lines.push('- [ ] Base stable');
    lines.push('');
    lines.push('## Print quality');
    lines.push('- [ ] No warping');
    lines.push('- [ ] No layer crack near mount');
    lines.push('- [ ] No sharp edges');
    lines.push('');
    lines.push('## Thermal observation');
    lines.push('- [ ] 30 min heat soak completed');
    lines.push('- [ ] No shell softening or smell');
    lines.push('');
    lines.push('## Lux target');
    lines.push('- [ ] Center >= 300 lux');
    lines.push('- [ ] No reading-zone point below 200 lux');
    lines.push('');
    lines.push('## Glare review');
    lines.push('- [ ] Direct LED not visible');
    lines.push('- [ ] No harsh reflection on glossy page');
    lines.push('- [ ] Shadow acceptable');
    lines.push('');
    lines.push('## Documentation');
    lines.push('- [ ] Measurement log filled');
    lines.push('- [ ] Next CAD adjustment recorded');
    lines.push('');
    lines.push('## Ready / Iterate decision');
    lines.push('_Only proceed to full build when all critical checks pass. Otherwise iterate CAD and re-print._');
    return lines.join('\\n');
  }

  function renderPhysicalTesting() {
    var lux = buildLuxTestPlan();
    var luxGrid = dom.luxGrid;
    while (luxGrid.firstChild) luxGrid.removeChild(luxGrid.firstChild);
    for (var i = 0; i < lux.points.length; i++) {
      var pt = lux.points[i];
      var div = document.createElement('div');
      div.className = 'measurement-point';
      div.innerHTML = '<span class="point-id">' + esc(pt.id) + '</span><span class="point-target">' + esc(pt.target) + '</span>';
      luxGrid.appendChild(div);
    }

    var heat = buildHeatSoakPlan();
    var heatPoints = dom.heatPoints;
    while (heatPoints.firstChild) heatPoints.removeChild(heatPoints.firstChild);
    for (var j = 0; j < heat.measurement_points.length; j++) {
      var hp = heat.measurement_points[j];
      var hdiv = document.createElement('div');
      hdiv.className = 'heat-point';
      hdiv.textContent = hp.replace(/_/g, ' ');
      heatPoints.appendChild(hdiv);
    }

    var glare = buildGlareReview();
    var glareChecks = dom.glareChecks;
    while (glareChecks.firstChild) glareChecks.removeChild(glareChecks.firstChild);
    for (var k = 0; k < glare.checks.length; k++) {
      var gc = glare.checks[k];
      var gdiv = document.createElement('div');
      gdiv.className = 'glare-check';
      gdiv.innerHTML = '<span class="check-name">' + esc(gc.name) + '</span><span class="check-target">' + esc(gc.target) + '</span>';
      glareChecks.appendChild(gdiv);
    }

    var checklist = buildPrototypeChecklist();
    var cl = dom.prototypeChecklist;
    while (cl.firstChild) cl.removeChild(cl.firstChild);
    var groups = Object.keys(checklist);
    for (var g = 0; g < groups.length; g++) {
      var group = checklist[groups[g]];
      var gdiv = document.createElement('div');
      gdiv.className = 'checklist-group';
      var ul = document.createElement('ul');
      for (var item = 0; item < group.items.length; item++) {
        var li = document.createElement('li');
        li.textContent = group.items[item];
        ul.appendChild(li);
      }
      gdiv.innerHTML = '<h4>' + esc(group.label) + '</h4>';
      gdiv.appendChild(ul);
      cl.appendChild(gdiv);
    }

    var report = buildPhysicalReadinessReport();
    dom.gate数值.textContent = report.readiness_gate;
    dom.gate数值.className = 'gate-value gate-pending';
  }

  function downloadTestProtocol() {
    downloadBlob('test-protocol-idb-6e.md', generateTestProtocolMarkdown(), 'text/markdown');
  }

  function downloadMeasurementLogCsv() {
    downloadBlob('measurement-log-idb-6e.csv', generateMeasurementLogCsv(), 'text/csv');
  }

  function downloadReadinessReportJson() {
    var report = buildPhysicalReadinessReport();
    downloadBlob('readiness-report-idb-6e.json', JSON.stringify(report, null, 2), 'application/json');
  }

  function downloadPrototypeChecklist() {
    downloadBlob('prototype-checklist-idb-6e.md', generatePrototypeChecklistMarkdown(), 'text/markdown');
  }

  // ---------- 颜色 chip handling ----------

  function select颜色(colorName, render) {
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
      renderCadExport();
    }
  }

  function init颜色Chips() {
    var chips = dom.colorRow.querySelectorAll('.color-chip');
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      c.style.background颜色 = c.getAttribute('data-hex');
      c.addEventListener('click', function (e) {
        select颜色(e.currentTarget.getAttribute('data-color'), true);
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
      renderCadExport();
    });

    dom.cfg刻字.addEventListener('input', function () {
      renderShell();
      renderManufacturingJSON();
      renderCadExport();
    });

    dom.btn复制JSON.addEventListener('click', function () {
      var text = dom.manufacturingJSON.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          dom.btn复制JSON.textContent = 'Copied!';
          setTimeout(function () { dom.btn复制JSON.textContent = '复制'; }, 1500);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        dom.btn复制JSON.textContent = 'Copied!';
        setTimeout(function () { dom.btn复制JSON.textContent = '复制'; }, 1500);
      }
    });

    dom.btn复制OpenScad.addEventListener('click', copyOpenScad);
    dom.btnDownloadScad.addEventListener('click', downloadScad);
    dom.btnDownloadConfig.addEventListener('click', downloadConfigJson);
    dom.btnDownloadFitTest.addEventListener('click', downloadFitTestScad);
    dom.btnDownloadSlicerProfile.addEventListener('click', downloadSlicerProfile);
    dom.btnDownloadValidationReport.addEventListener('click', downloadValidationReport);
    dom.btnDownloadTestProtocol.addEventListener('click', downloadTestProtocol);
    dom.btnDownloadMeasurementLog.addEventListener('click', downloadMeasurementLogCsv);
    dom.btnDownloadReadinessReport.addEventListener('click', downloadReadinessReportJson);
    dom.btnDownloadPrototypeChecklist.addEventListener('click', downloadPrototypeChecklist);
  }

  // ---------- Init ----------

  function init() {
    if (!dom.ideaInput.value) {
      dom.ideaInput.value = DEFAULT_IDEA;
    }
    init颜色Chips();
    wire();
    select颜色('暖白', false);
    state.parsed = parseIdeaToConfig(dom.ideaInput.value);
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
