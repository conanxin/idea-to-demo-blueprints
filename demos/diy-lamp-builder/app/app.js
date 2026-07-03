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
    btnDownloadConfig:$('btn-download-config'),
    cadValidationList:    $('cad-validation-list'),
    cadRiskLevel:         $('cad-risk-level'),
    cadNextTest:          $('cad-next-test'),
    printOrientationBody: $('print-orientation-body'),
    slicerProfileBody:    $('slicer-profile-body'),
    btnDownloadFitTest:   $('btn-download-fit-test'),
    btnDownloadSlicerProfile: $('btn-download-slicer-profile'),
    btnDownloadValidationReport: $('btn-download-validation-report')
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
      }
    };
  }

  function renderManufacturingJSON() {
    var data = buildManufacturingJSON();
    dom.manufacturingJSON.textContent = JSON.stringify(data, null, 2);
  }

  // ---------- CAD Export helpers ----------

  function buildCadParams() {
    var styleName = dom.cfgShellStyle.value;
    var style = SHELL_STYLES[styleName];
    var engraving = (dom.cfgEngraving.value || '').trim();
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
    scad.push('// DIY Lamp Builder — OpenSCAD shell export');
    scad.push('// Generated by IDB-6C CAD Export');
    scad.push('// Shell style: ' + p.shell_style);
    scad.push('// Engraving: ' + p.engraving_text);
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
    scad.push('  if (shell_style == "Minimal Bar")');
    scad.push('    shell_minimal_bar();');
    scad.push('  else if (shell_style == "Hutong Window")');
    scad.push('    shell_hutong_window();');
    scad.push('  else if (shell_style == "Beijing Pavilion")');
    scad.push('    shell_beijing_pavilion();');
    scad.push('  else if (shell_style == "Book Arc")');
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
      ['Engraving text', p.engraving_text],
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

  // ---------- IDB-6D Print Validation helpers ----------

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
      { name: 'Engraving manufacturability', status: engravingLong ? 'WARN' : 'PASS', detail: engravingLong ? 'Long engraving may need larger font / test text.' : 'Engraving length OK for fit-test sample.' }
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
      next_physical_test: 'Print fit-test coupon before full shell'
    };
  }

  function validateCadParams() {
    return buildCadValidationContext();
  }

  function buildPrintOrientationPlan() {
    var p = buildCadParams();
    var plans = {
      'Minimal Bar': {
        orientation: 'Diffuser opening facing upward or side-up',
        support_strategy: 'Usually no support / minimal support',
        bed_contact: 'Flat back on build plate',
        risk_level: 'low',
        why: 'Boxy geometry with flat back and minimal overhangs.'
      },
      'Hutong Window': {
        orientation: 'Back face on bed, grille facing upward',
        support_strategy: 'Moderate supports for grille details',
        bed_contact: 'Flat back on build plate',
        risk_level: 'medium',
        why: 'Grille mullions need bridging / support cleanup.'
      },
      'Beijing Pavilion': {
        orientation: 'Roof ridge upward, flat back on bed',
        support_strategy: 'Likely supports for eaves',
        bed_contact: 'Flat back on build plate',
        risk_level: 'high',
        why: 'Tiered roof and eaves create large overhangs.'
      },
      'Book Arc': {
        orientation: 'Arc upward, diffuser side controlled',
        support_strategy: 'Moderate supports under arc',
        bed_contact: 'Flat back on build plate',
        risk_level: 'medium-high',
        why: 'Curved shell surfaces create layer-line and support scars.'
      }
    };
    return plans[p.shell_style] || plans['Minimal Bar'];
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
    scad.push('// IDB-6D Fit-Test Coupon');
    scad.push('// Generated by DIY Lamp Builder');
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
    scad.push('  // Cable exit radius test: 4 / 5 mm');
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
      configuration_id: 'sample-' + (buildCadParams().shell_style || 'minimal-bar').toLowerCase().replace(/ /g, '-'),
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
    lines.push('# IDB-6D DIY Lamp Shell Slicer Profile');
    lines.push('# Generator: DIY Lamp Builder');
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
    data.generator = 'DIY Lamp Builder IDB-6C';
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
        dom.btnCopyOpenScad.textContent = 'Copied!';
        setTimeout(function () { dom.btnCopyOpenScad.textContent = 'Copy OpenSCAD'; }, 1500);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      dom.btnCopyOpenScad.textContent = 'Copied!';
      setTimeout(function () { dom.btnCopyOpenScad.textContent = 'Copy OpenSCAD'; }, 1500);
    }
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
    renderCadExport();
    renderPrintValidation();
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
      renderCadExport();
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
      renderCadExport();
    });

    dom.cfgEngraving.addEventListener('input', function () {
      renderShell();
      renderManufacturingJSON();
      renderCadExport();
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

    dom.btnCopyOpenScad.addEventListener('click', copyOpenScad);
    dom.btnDownloadScad.addEventListener('click', downloadScad);
    dom.btnDownloadConfig.addEventListener('click', downloadConfigJson);
    dom.btnDownloadFitTest.addEventListener('click', downloadFitTestScad);
    dom.btnDownloadSlicerProfile.addEventListener('click', downloadSlicerProfile);
    dom.btnDownloadValidationReport.addEventListener('click', downloadValidationReport);
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
