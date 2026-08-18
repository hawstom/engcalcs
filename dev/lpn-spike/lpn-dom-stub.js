// Shared headless-browser scaffolding for the js/looped-network.js harnesses.
//
// EXTRACTED, not written (2026-08-11, ROADMAP Task 196). Every line below came out of
// example-network-harness.js unchanged; it moved here the moment a SECOND harness needed the whole
// of it (inp-import-harness.js, which drives File > Import EPANET file end to end and therefore
// touches storage, units, the document, the dialog and the renderer at once). One copy is the
// point: a stub that drifts between two harnesses makes both of them agree with themselves.
//
// The technique, in one line: eval the REAL page file against DOM stubs, injecting a test-only
// export object just before its DOMContentLoaded listener, so init() never runs and the test picks
// its own entry points.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

const GPM = 6.309019640343977e-5, FT = 0.3048, IN = 0.0254;

// ---- minimal DOM --------------------------------------------------------
function mkEl(tag) {
  const el = {
    // nodeType 1 is not decoration: repositionMultilineText() moves ONLY element children
    // (`child.nodeType === 1`), so a stub element without it silently skipped every tspan and a
    // harness would have reported a multi-line label moving when the real page leaves its rows
    // behind. A createTextNode() result already carries nodeType 3 below.
    nodeType: 1,
    tagName: (tag || 'div').toUpperCase(), _tag: tag, children: [], dataset: {},
    style: { _props: {}, setProperty(k, v) { this._props[k] = v; }, getPropertyValue(k) { return this._props[k] || ''; }, removeProperty(k) { delete this._props[k]; } },
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); }, remove(...c) { c.forEach(x => this._s.delete(x)); },
      contains(c) { return this._s.has(c); },
      toggle(c, on) { if (on === undefined) { on = !this._s.has(c); } if (on) { this._s.add(c); } else { this._s.delete(c); } return on; }
    },
    className: '', id: '', title: '', type: '', value: '', textContent: '', _innerHTML: '',
    checked: false, placeholder: '', step: '', min: '', _listeners: {},
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    insertBefore(c) { this.children.unshift(c); c.parentNode = this; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) { this.children.splice(i, 1); } return c; },
    // 'style' must not clobber the style OBJECT -- el() passes style as an attribute string, and
    // the layout code then writes .style.display on the same element.
    setAttribute(k, v) { if (k === 'style') { this._styleAttr = v; return; } this[k] = v; },
    getAttribute(k) { return k === 'style' ? this._styleAttr : this[k]; },
    removeAttribute(k) { delete this[k]; },
    addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    removeEventListener() {},
    querySelectorAll() { return []; }, querySelector() { return null; }, closest() { return null; },
    // Real containment, walking the stub tree -- the menu-dismissal rule in wireTabs() is written in
    // terms of popup.contains(e.target), so a stub that always said false (or always true) would
    // make the Task 264 regression test below meaningless.
    contains(n) { if (n === this) { return true; } return this.children.some(c => c.contains && c.contains(n)); },
    getBoundingClientRect() { return { left: 0, top: 0, right: 1000, bottom: 500, width: 1000, height: 500 }; },
    // WIDTH VARIES WITH FONT WEIGHT AND WITH HOW MANY CHARACTERS THERE ARE, and those are the two
    // physical relationships this stub is required to know.
    //
    // Weight (Task 337): bold glyphs are wider, so a constant width would let a bold label be
    // measured as though it were light -- collision box and zoom-to-fit sized for the wrong glyphs,
    // with every assertion still passing. The exact ratio does not matter; only that it is not 1.
    //
    // CONTENT (Task 399): a label that sheds a value must come out NARROWER, and a stub returning a
    // constant makes the whole fitting cascade untestable while looking fine -- the harness would be
    // asserting that shedding changes nothing, and passing. This is the stub failure CLAUDE.md warns
    // about by name: ask which quantity the real thing varies that the stub holds constant.
    //
    // CHAR_W is a nominal advance per character. It is not a real font metric and nothing may read a
    // precise width off it; what a harness may rely on is only that width RISES with characters and
    // FALLS when characters go.
    getBBox() { return { x: 0, y: 0, width: this._textWidth(), height: 10 }; },
    _textLength() {
      // A <text> owns its tspans' characters; a tspan owns its own.
      //
      // **A STACK IS AS WIDE AS ITS WIDEST ROW, NOT AS WIDE AS ALL OF THEM LAID END TO END.** That
      // is what a real getBBox() reports, and the sum this used to return made a three-row label
      // three times too wide in every harness that measured one -- the stub failure CLAUDE.md
      // names, where the quantity the real thing varies (which row is longest) was held constant.
      // A ROW is a tspan with its own x plus every following tspan without one, exactly
      // setMultilineText()'s idiom; a tspan's own length is still its characters.
      if (this.children.length) {
        let widest = 0, row = 0, started = false;
        for (const c of this.children) {
          const n = c._textLength ? c._textLength() : 0;
          const ownX = c.getAttribute && c.getAttribute('x') != null;
          if (ownX || !started) { row = n; started = true; } else { row += n; }
          if (row > widest) { widest = row; }
        }
        return widest;
      }
      return (this.textContent || '').length;
    },
    _textWidth() {
      const n = this._textLength();
      return (n ? n * CHAR_W : 10) * (this._isBold() ? 1.12 : 1);
    },
    _isBold() {
      // Two write paths reach the same declaration: the style ATTRIBUTE (buildLabelEls / the
      // popup) and the style OBJECT (anything setting .style.fontWeight). Read both.
      return /bold/.test((this._styleAttr || '') + ' ' + (this.style.fontWeight || ''));
    },
    getComputedTextLength() { return this._textWidth(); },
    setPointerCapture() {}, releasePointerCapture() {},
    remove() { if (this.parentNode) { this.parentNode.removeChild(this); } },
    focus() {}, select() {}, click() {}
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(v) { this._innerHTML = v; if (v === '') { this.children.length = 0; } }
  });
  // The label layout code walks childNodes (tspans), not children -- same array here.
  Object.defineProperty(el, 'childNodes', { get() { return this.children; } });
  Object.defineProperty(el, 'firstChild', { get() { return this.children[0] || null; } });
  return el;
}

// Nominal glyph advance for the stub's text metrics -- see getBBox() above. A number, not a
// measurement: what matters is that it is positive and constant, so width tracks character count.
const CHAR_W = 6;

const byId = {};
function ensure(id) { if (!byId[id]) { byId[id] = mkEl('div'); byId[id].id = id; } return byId[id]; }
// Same harvested list popup-tips-harness.js uses:
//   grep -o "getElementById('[a-z_0-9]*')" js/looped-network.js | sort -u
[
  'lpn_backdrop_file', 'lpn_backdrop_menu', 'lpn_backdrop_target_continue',
  'lpn_backdrop_target_mode', 'lpn_backdrop_target_panel', 'lpn_canvas', 'lpn_coords',
  'lpn_empty_hint', 'lpn_labels_legend', 'lpn_labels_link_fields', 'lpn_labels_node_fields',
  'lpn_labels_options', 'lpn_labels_popup', 'lpn_labels_popup_close', 'lpn_mode_hint', 'lpn_map_notice', 'lpn_map_overlay_tl',
  'lpn_popup', 'lpn_popup_close', 'lpn_popup_fields', 'lpn_popup_title', 'lpn_projects_btn',
  'lpn_projects_list', 'lpn_projects_popup', 'lpn_projects_popup_close', 'lpn_settings_fields',
  'lpn_settings_popup', 'lpn_settings_popup_close', 'lpn_status', 'lpn_toolbar',
  'lpn_project_file', 'lpn_inp_file', 'lpn_menubar', 'lpn_menu_popup', 'lpn_menu_list', 'lpn_dialog',
  'lpn_dialog_body', 'lpn_dialog_buttons', 'lpn_menu_popup2', 'lpn_menu_list2', 'lpn_map_status',
  'lpn_map_footer',
  // The scenario selector/readout in the map's status strip (ROADMAP Task 184).
  'lpn_scenario_btn'
].forEach(ensure);
// Looped-Network.php nests each menu LIST inside its POPUP. The ensure() list above creates them as
// unrelated stubs, so popup.contains(row) answered false for a row that really is inside -- and the
// dismissal rule in wireTabs() is written entirely in those terms. Reproduce the nesting, or a test
// of that rule tests nothing.
byId.lpn_menu_popup.appendChild(byId.lpn_menu_list);
byId.lpn_menu_popup2.appendChild(byId.lpn_menu_list2);

// A unit <select> the way echoUnitSelect() renders one: option.value is the unit's KEY ('ft'),
// and the factor is a lookup from it (Task 390). unitEl() finds these by NAME, not id.
const unitSelects = {};
// `family` is NOT decoration: echoUnitSelect() puts data-family on every real select, and Task
// 265's unitSetName() reads it to ask whether the strip matches a preset. A stub without it makes
// that function skip every select and vacuously report "us", which is a test agreeing with itself.
function mkUnitSelect(name, family, opts, chosen) {
  const s = mkEl('select');
  s.name = name;
  s.dataset.family = family;
  s.options = opts.map(n => ({ value: n, textContent: n }));
  s.selectedIndex = opts.indexOf(chosen);
  if (s.selectedIndex < 0) { throw new Error('no such unit ' + chosen + ' on ' + name); }
  Object.defineProperty(s, 'value', { get() { return this.options[this.selectedIndex].value; } });
  unitSelects[name] = s;
  return s;
}
// Factors are "number of that unit per SI unit" -- lib/Units.lib.php's own convention.
//
// AND THEY ARE READ OUT OF lib/Units.lib.php, NEVER RETYPED. They used to be written here as
// `1/FT`, `1/IN`, `1/GPM` -- the exact reciprocals of js/lpn-inp.js's own constants. That made the
// stub's import round trip exactly 1.0 where the shipped page's was 0.99998784, so
// inp-import-harness.js asserted "the file's number comes back unchanged" and passed while the
// browser stored 709.9913664 for a 710 ft elevation. Textbook stub-removes-the-coupling: the one
// quantity under test was the DIFFERENCE between two sets of constants, and the stub had only one
// set. A third disagreeing set lived here too (psi 1.42233, kpa 9.80638), agreeing with neither.
const unitFactors = (function () {
  const src = fs.readFileSync(ROOT + 'lib/Units.lib.php', 'utf8');
  const out = {};
  for (const m of src.matchAll(/\$ec_units\['([a-zA-Z0-9_]+)'\]\s*=\s*([0-9.eE+-]+)\s*;/g)) {
    out[m[1]] = parseFloat(m[2]);
  }
  if (!out.ft || !out.gpm) {
    throw new Error('lpn-dom-stub.js: could not read $ec_units out of lib/Units.lib.php. ' +
      'Point this reader at its new home -- do NOT hard-code the factors.');
  }
  return out;
}());
// An option's value is the unit NAME (Task 390), so this returns the name -- but it still
// checks the name against lib/Units.lib.php, which is the point: a select built here on a unit
// the suite does not actually define would otherwise sit in the stub looking real.
function u(name) {
  if (!(name in unitFactors)) { throw new Error('no $ec_units factor named ' + name); }
  return name;
}
// A FAMILY'S OPTION LIST, read out of lib/Units.lib.php for the same reason the factors are.
// Every other select here is stubbed with a short plausible list, which is fine while the test is
// about the SELECTED unit -- but lpn_u_flow's list is itself under test since Task 390 step 4: the
// question is whether all ten EPANET flow keywords land on a unit this page offers, and a stub
// holding two of them would answer that question for the stub rather than for the page.
function familyUnits(family) {
  const src = fs.readFileSync(ROOT + 'lib/Units.lib.php', 'utf8');
  const m = new RegExp("'" + family + "'\\s*=>\\s*Array\\(([^)]*)\\)").exec(src);
  if (!m) { throw new Error("lpn-dom-stub.js: no unit family '" + family + "' in lib/Units.lib.php"); }
  return m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean).map(u);
}
function setUnitSet(which) {
  const us = which === 'us';
  mkUnitSelect('lpn_u_length', 'distance_site', [u('m'), u('ft')], us ? 'ft' : 'm');
  mkUnitSelect('lpn_u_elevhead', 'total_head', [u('mh2o'), u('fth2o')], us ? 'fth2o' : 'mh2o');
  mkUnitSelect('lpn_u_pressure', 'partial_head', [u('mh2o'), u('kpa'), u('psi')], us ? 'psi' : 'mh2o');
  mkUnitSelect('lpn_u_diameter', 'distance_small', [u('mm'), u('in')], us ? 'in' : 'mm');
  mkUnitSelect('lpn_u_flow', 'flow_epanet', familyUnits('flow_epanet'), us ? 'gpm' : 'lps');
  mkUnitSelect('lpn_u_velocity', 'velocity', [u('mps'), u('ftps')], us ? 'ftps' : 'mps');
  mkUnitSelect('lpn_u_gradient', 'gradient', [u('gradePercent'), u('grade')], 'gradePercent');
  // Darcy-Weisbach roughness height e (ROADMAP Task 271) -- family `roughness`, which lib/Units.lib.php
  // aliases to $u_distance (m/mm/ft/in), us => ft, si => mm. Conditional in the PAGE (shown only
  // under Darcy-Weisbach) but unconditional here: applyMethodUI() hides the row, and a stub that
  // withheld the select would make that hiding untestable.
  mkUnitSelect('lpn_u_roughness', 'roughness', [u('m'), u('mm'), u('ft'), u('in')], us ? 'ft' : 'mm');
  // The wrapper applyMethodUI() shows and hides. Created here so every harness has it, since it is
  // part of the units strip's markup rather than of any one test.
  ensure('lpn_u_roughness_row');
}
// The two presets exactly as lib/Units.lib.php declares them for the eight families this page owns.
// EngCalcs.unitSets is emitted by echoUnitsRow() in the browser; unitSetName() compares the strip
// against it, so the harness needs the real mapping, not a placeholder.
const LPN_UNIT_PRESETS = {
  us: { distance_site: 'ft', total_head: 'fth2o', partial_head: 'psi', distance_small: 'in', flow_epanet: 'gpm', velocity: 'ftps', gradient: 'gradePercent', roughness: 'ft' },
  si: { distance_site: 'm', total_head: 'mh2o', partial_head: 'mh2o', distance_small: 'mm', flow_epanet: 'lps', velocity: 'mps', gradient: 'gradePercent', roughness: 'mm' }
};

global.document = {
  createElement: mkEl,
  createElementNS: (ns, tag) => mkEl(tag),
  createTextNode: t => ({ nodeType: 3, textContent: t, _text: true, children: [] }),
  getElementById: id => byId[id] || null,
  querySelector: sel => {
    const m = /^select\[name="([^"]+)"\]$/.exec(sel);
    return m ? (unitSelects[m[1]] || null) : null;
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
  // The pointerUP handlers hit-test with this rather than trusting e.target (a real tap moves a few
  // pixels between down and up). Tests set `hitTarget` to whatever they are pretending is under the
  // pointer; null means bare canvas, which is what a pan or an empty-space click lands on.
  elementFromPoint: () => hitTarget,
  body: mkEl('body'),
  documentElement: mkEl('html'),
  title: ''   // Task 265 writes here; a stub without it would let document.title = ... pass unseen
};
let hitTarget = null;
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  key: i => Object.keys(store)[i],
  get length() { return Object.keys(store).length; }
};
global.window = {
  localStorage: global.localStorage, document: global.document,
  addEventListener: () => {}, innerWidth: 1200, innerHeight: 900,
  confirm: () => true, prompt: () => 'X', alert: () => {},
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  location: { search: '' },   // refreshPageTitle() reads ?name= off it (Task 265)
  devicePixelRatio: 1, getComputedStyle: () => ({ getPropertyValue: () => '' })
};
global.alert = global.window.alert;
global.confirm = global.window.confirm;
global.prompt = global.window.prompt;
global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = f => setTimeout(f, 0);
// iconEl comes from js/Icons.lib.js in the browser; the map symbols only need to not throw here.
// iconEl/setLabel come from js/Icons.lib.js in the browser; here they only need to not throw.
// The example's annotations are composed from strings that already exist elsewhere in the suite
// (see drawExampleNetwork()); the page emits them into pageConfig, so the harness must too, read
// from the real lang file rather than restated here.
global.EngCalcs = {
  pageConfig: {}, initTips: () => {},
  unitSets: LPN_UNIT_PRESETS,
  // Task 390: the browser gets this table from echoHTMLHead(), straight out of lib/Units.lib.php.
  // Here it comes from the same file, read above -- NEVER a retyped set of constants, for exactly
  // the reason spelled out at the top of that block.
  unitFactors,
  unitFactor: (u) => {
    const name = (u && typeof u === 'object') ? u.value : u;
    return (typeof name === 'string' && Object.prototype.hasOwnProperty.call(unitFactors, name))
      ? unitFactors[name] : 1;
  },
  iconEl: () => mkEl('g'),
  setLabel: (el, iconName, text) => { el.textContent = text; },
  // The REAL EngCalcs.setUnits (js/Calculators.lib.js) moves every unit select to a preset and then
  // calls submitForm(), which re-enters EngCalcs.pageCalculator. Both halves matter and this stub
  // does both: without it `if (EngCalcs.setUnits)` was simply false here, so every code path that
  // commits a project to a unit system was untested -- two mutations survived on exactly that.
  setUnits: (which) => {
    setUnitSet(which);
    if (global.EngCalcs.pageCalculator) { global.EngCalcs.pageCalculator(); }
  }
};
global.bootstrap = global.window.bootstrap = { Tooltip: { getInstance: () => null, getOrCreateInstance: () => ({ hide() {}, dispose() {} }) } };

// ---- pageConfig, read from the real lang file ---------------------------
// Not stubbed: the example's annotations ARE lang strings, so a harness with an empty pageConfig
// would silently assert that four labels reading "undefined" are fine. Harvest every key the page
// could emit, then check below that the page really does emit the ones the JS reaches for.
{
  const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
  const re = /^\$ec_lang\['([a-z0-9_]+)'\]\s*=\s*'((?:[^'\\]|\\.)*)';$/gm;
  let m;
  while ((m = re.exec(langSrc))) {
    global.EngCalcs.pageConfig[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  }
}
// ---- solver + the file under test ---------------------------------------
// bootstrap.js FIRST, for the same reason validate.js says: it supplies EngCalcs.G out of
// js/Calculators.lib.js, and without it every minor-loss term goes NaN and the solver reports a
// converged network with no head loss anywhere.
require('./bootstrap.js');
// require() rather than eval() for the solver: lpn-solver.js's own require('./PipeHydraulics.lib.js')
// would resolve relative to THIS file if it were eval'd here, not to js/.
var EngCalcs = Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-solver.js'));
// The map editor's pure halves (ROADMAP Task 293), which looped-network.js reads as
// EngCalcs.lpnGeom/lpnCollide the moment its IIFE runs -- so they must be in place before
// the eval below, exactly as their <script> tags precede it in Looped-Network.php.
// require()d rather than eval'd for the same reason as the solver: they are real modules.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-geom.js'), require(ROOT + 'js/lpn-collide.js'));

// The pointer handlers hit-test through document.elementFromPoint rather than trusting e.target (a
// real tap moves a few pixels between down and up). A test sets this to whatever it is pretending
// is under the pointer; null means bare canvas.
function setHitTarget(el) { hitTarget = el; }

/**
 * Load js/looped-network.js with `injectSource` -- the body of a `global.__LPN = { ... }`
 * assignment -- spliced in just before its DOMContentLoaded listener, and return that object.
 * Each harness names only the internals it actually drives.
 */
function loadLoopedNetwork(injectSource) {
	let src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
	const marker = "\tdocument.addEventListener('DOMContentLoaded'";
	if (src.indexOf(marker) < 0) { throw new Error('injection marker not found'); }
	src = src.replace(marker, '\tglobal.__LPN = {\n' + injectSource + '\n\t};\n' + marker);
	// INDIRECT eval, and the indirection is load-bearing. js/looped-network.js opens with
	// `var EngCalcs = EngCalcs || {};` -- the browser idiom for "reuse the one the earlier script
	// tags made". A DIRECT eval inside this function would hoist a fresh function-scoped
	// `EngCalcs`, so that line would read its own undefined binding and start a SECOND, empty
	// EngCalcs: no solver, no iconEl, no pageConfig, and every failure downstream of it looking
	// like something else. Running at global scope makes the same line find global.EngCalcs, which
	// is exactly what the browser's script order gives it. (The original harness got this for free
	// by eval'ing at its own module scope, where `var EngCalcs` was already declared.)
	(0, eval)(src);
	return global.__LPN;
}

module.exports = { ROOT, mkEl, byId, ensure, unitSelects, setUnitSet, setHitTarget, loadLoopedNetwork, LPN_UNIT_PRESETS, GPM, FT, IN };
