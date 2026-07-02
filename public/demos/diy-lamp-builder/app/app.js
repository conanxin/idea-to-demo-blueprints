/* DIY Lamp Builder Demo
 * Pure vanilla JS. No dependencies. No build step.
 * Drives: SVG shell style + engraving, real-time Manufacturing Plan JSON,
 * AI Analyze section (mock — represents what an LLM would output).
 */

(function () {
  'use strict';

  // ---------- Static reference data ----------

  var DEFAULT_IDEA = '北京风格阅读台灯，外壳可定制，适合书桌使用';

  var COLOR_MAP = {
    'Warm White':    { hex: '#f5efe6', label: 'Warm White' },
    'Hutong Gray':   { hex: '#7a7a78', label: 'Hutong Gray' },
    'Palace Red':    { hex: '#a83232', label: 'Palace Red' },
    'Night Black':   { hex: '#1c1c1e', label: 'Night Black' }
  };

  var SHELL_STYLES = {
    'Minimal Bar': {
      label: 'Minimal Bar',
      // simple horizontal bar above the core
      draw: function (svg, color) {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'shell-minimal-bar');
        g.innerHTML =
          '<rect x="40" y="50" width="240" height="22" rx="3" fill="' + color + '" stroke="#2a2722" stroke-width="1.5"/>' +
          '<rect x="40" y="72" width="240" height="6" fill="#2a2722" opacity="0.35"/>';
        return g;
      }
    },
    'Hutong Window': {
      label: 'Hutong Window',
      // lattice window frame above the core
      draw: function (svg, color) {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'shell-hutong-window');
        g.innerHTML =
          '<rect x="40" y="36" width="240" height="38" rx="2" fill="' + color + '" stroke="#2a2722" stroke-width="1.5"/>' +
          '<line x1="100" y1="36" x2="100" y2="74" stroke="#2a2722" stroke-width="1.5"/>' +
          '<line x1="160" y1="36" x2="160" y2="74" stroke="#2a2722" stroke-width="1.5"/>' +
          '<line x1="220" y1="36" x2="220" y2="74" stroke="#2a2722" stroke-width="1.5"/>' +
          '<line x1="40" y1="55" x2="280" y2="55" stroke="#2a2722" stroke-width="1.5"/>';
        return g;
      }
    },
    'Beijing Pavilion': {
      label: 'Beijing Pavilion',
      // curved roofline above the core
      draw: function (svg, color) {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'shell-beijing-pavilion');
        g.innerHTML =
          '<path d="M 40 76 Q 100 28 160 32 Q 220 28 280 76 Z" fill="' + color + '" stroke="#2a2722" stroke-width="1.5"/>' +
          '<rect x="44" y="76" width="232" height="6" fill="#2a2722" opacity="0.4"/>' +
          '<circle cx="160" cy="30" r="3" fill="#a83232"/>';
        return g;
      }
    },
    'Book Arc': {
      label: 'Book Arc',
      // open book curve above the core
      draw: function (svg, color) {
        var ns = 'http://www.w3.org/2000/svg';
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'shell-book-arc');
        g.innerHTML =
          '<path d="M 40 70 Q 80 36 160 50 Q 240 36 280 70 L 280 78 L 40 78 Z" fill="' + color + '" stroke="#2a2722" stroke-width="1.5"/>' +
          '<line x1="160" y1="50" x2="160" y2="78" stroke="#2a2722" stroke-width="1.2"/>';
        return g;
      }
    }
  };

  // ---------- DOM refs ----------

  var $ = function (id) { return document.getElementById(id); };

  var dom = {
    ideaInput:        $('idea-input'),
    btnGenerate:      $('btn-generate'),
    archLampType:     $('arch-lamp-type'),
    archCoreModule:   $('arch-core-module'),
    archLightType:    $('arch-light-type'),
    archBrightness:   $('arch-brightness'),
    archDistance:     $('arch-distance'),
    archShell:        $('arch-shell'),
    archInterface:    $('arch-interface'),
    cfgLampType:      $('cfg-lamp-type'),
    cfgShellStyle:    $('cfg-shell-style'),
    cfgEngraving:     $('cfg-engraving'),
    colorRow:         $('color-row'),
    colorName:        $('color-name'),
    lampShell:        $('lamp-shell'),
    engravingText:    $('engraving-text'),
    previewCaption:   $('preview-caption'),
    manufacturingJSON:$('manufacturing-json'),
    btnCopyJSON:      $('btn-copy-json')
  };

  // ---------- State ----------

  var state = {
    color:    'Warm White',
    colorHex: '#f5efe6'
  };

  // ---------- Rendering ----------

  function renderShell() {
    var styleName = dom.cfgShellStyle.value;
    var style = SHELL_STYLES[styleName];
    if (!style) return;

    // clear existing shell
    while (dom.lampShell.firstChild) {
      dom.lampShell.removeChild(dom.lampShell.firstChild);
    }
    var g = style.draw(null, state.colorHex);
    dom.lampShell.appendChild(g);

    // engraving
    var text = (dom.cfgEngraving.value || '').trim();
    dom.engravingText.textContent = text || '—';

    // caption
    dom.previewCaption.textContent =
      style.label + ' · ' + state.color + (text ? ' · ' + text : '');
  }

  function buildManufacturingJSON() {
    var styleName = dom.cfgShellStyle.value;
    var lampType = dom.cfgLampType.value;
    var color = state.color;
    var engraving = (dom.cfgEngraving.value || '').trim();

    return {
      core: 'ReadingCore-01',
      core_type: '24V linear LED cassette',
      led_mount: 'aluminum channel with opal diffuser',
      shell_style: styleName,
      color: color,
      engraving: engraving || '(none)',
      estimated_luminous_flux: '500-800 lm',
      estimated_print_time: '4h',
      estimated_material: 'PETG / PLA+',
      estimated_bom_cost: '$40-80 prototype',
      lamp_type: lampType,
      assembly_steps: [
        'Cut 24V high-CRI LED strip to lamp-head length',
        'Attach LED strip to aluminum channel',
        'Install opal diffuser',
        'Mount ReadingCore-01 into customizable shell',
        'Attach arm and base',
        'Run brightness, heat and glare checks'
      ]
    };
  }

  function renderManufacturingJSON() {
    var data = buildManufacturingJSON();
    dom.manufacturingJSON.textContent = JSON.stringify(data, null, 2);
  }

  function updateAnalyzeSection() {
    // Mock — represents what AI would output for this idea.
    // In a real workflow this section would be populated by an LLM response.
    var lampType = dom.cfgLampType.value;
    dom.archLampType.textContent = lampType === 'Ambient Lamp'
      ? 'Ambient Desk Lamp'
      : 'Reading Desk Lamp';

    // core module is fixed
    dom.archCoreModule.innerHTML = '<span class="locked">🔒 ReadingCore-01</span>';

    // shell depends on whether it's customizable
    dom.archShell.textContent = 'Customizable';
  }

  function renderAll() {
    renderShell();
    renderManufacturingJSON();
    updateAnalyzeSection();
  }

  // ---------- Color chip handling ----------

  function selectColor(colorName) {
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
    renderShell();
    renderManufacturingJSON();
  }

  function initColorChips() {
    var chips = dom.colorRow.querySelectorAll('.color-chip');
    for (var i = 0; i < chips.length; i++) {
      var c = chips[i];
      var hex = c.getAttribute('data-hex');
      var name = c.getAttribute('data-color');
      c.style.backgroundColor = hex;
      c.addEventListener('click', function (e) {
        var target = e.currentTarget;
        selectColor(target.getAttribute('data-color'));
      });
    }
    // set initial active
    selectColor(state.color);
  }

  // ---------- Event wiring ----------

  function wire() {
    dom.btnGenerate.addEventListener('click', function () {
      // "Generate Product Demo" just re-renders.
      // In a real workflow this would call an LLM.
      renderAll();
      // smooth scroll to analyze section
      var target = document.getElementById('analyze-section');
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    dom.cfgLampType.addEventListener('change', function () {
      updateAnalyzeSection();
      renderManufacturingJSON();
    });

    dom.cfgShellStyle.addEventListener('change', function () {
      renderShell();
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
          setTimeout(function () {
            dom.btnCopyJSON.textContent = 'Copy';
          }, 1500);
        });
      } else {
        // fallback
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        dom.btnCopyJSON.textContent = 'Copied!';
        setTimeout(function () {
          dom.btnCopyJSON.textContent = 'Copy';
        }, 1500);
      }
    });
  }

  // ---------- Init ----------

  function init() {
    // Make sure the default idea is set
    if (!dom.ideaInput.value) {
      dom.ideaInput.value = DEFAULT_IDEA;
    }
    initColorChips();
    wire();
    // initial render so the page is "live" on first paint
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();