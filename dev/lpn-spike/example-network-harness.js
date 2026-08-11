// Harness for drawExampleNetwork() in js/looped-network.js -- run with:
//   node dev/lpn-spike/example-network-harness.js
//
// WHY THIS EXISTS. The example network is the first thing a visitor sees the calculator do, and
// ROADMAP Task 254 rewrote it from a two-pipe placeholder into a five-junction ring main sized
// like a real project. Everything that can be wrong with it is invisible from reading the code:
// whether it converges, whether the pressures a reviewer sees are plausible, whether the two unit
// presets produce the same drawing at different scales, and whether the flow actually splits both
// ways round the ring (a ring that all flows one way is a series main wearing a circle). Tom's
// browser passes are slow and tiring, so this checks all of that in ~200 ms with no browser.
//
// TECHNIQUE is the same as popup-tips-harness.js: eval the REAL file against DOM stubs, injecting
// a test-only export just before the DOMContentLoaded listener so init() never runs. The one
// addition here is a REAL unit-select stub (options + selectedIndex + dataset.unit), because
// niceDefault()/unitKey() are exactly what this test is about -- popup-tips-harness.js stubs
// querySelector to null, which silently pins every value to its SI branch.

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

const GPM = 6.309019640343977e-5, FT = 0.3048, IN = 0.0254;

// ---- minimal DOM --------------------------------------------------------
function mkEl(tag) {
  const el = {
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
    getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; },
    getComputedTextLength() { return 10; },
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

const byId = {};
function ensure(id) { if (!byId[id]) { byId[id] = mkEl('div'); byId[id].id = id; } return byId[id]; }
// Same harvested list popup-tips-harness.js uses:
//   grep -o "getElementById('[a-z_0-9]*')" js/looped-network.js | sort -u
[
  'lpn_backdrop_file', 'lpn_backdrop_menu', 'lpn_backdrop_target_continue',
  'lpn_backdrop_target_mode', 'lpn_backdrop_target_panel', 'lpn_canvas', 'lpn_coords',
  'lpn_empty_hint', 'lpn_labels_legend', 'lpn_labels_link_fields', 'lpn_labels_node_fields',
  'lpn_labels_options', 'lpn_labels_popup', 'lpn_labels_popup_close', 'lpn_mode_hint',
  'lpn_popup', 'lpn_popup_close', 'lpn_popup_fields', 'lpn_popup_title', 'lpn_projects_btn',
  'lpn_projects_list', 'lpn_projects_popup', 'lpn_projects_popup_close', 'lpn_settings_fields',
  'lpn_settings_popup', 'lpn_settings_popup_close', 'lpn_status', 'lpn_toolbar',
  'lpn_project_file', 'lpn_menubar', 'lpn_menu_popup', 'lpn_menu_list', 'lpn_dialog',
  'lpn_dialog_body', 'lpn_dialog_buttons', 'lpn_menu_popup2', 'lpn_menu_list2'
].forEach(ensure);
// Looped-Network.php nests each menu LIST inside its POPUP. The ensure() list above creates them as
// unrelated stubs, so popup.contains(row) answered false for a row that really is inside -- and the
// dismissal rule in wireTabs() is written entirely in those terms. Reproduce the nesting, or a test
// of that rule tests nothing.
byId.lpn_menu_popup.appendChild(byId.lpn_menu_list);
byId.lpn_menu_popup2.appendChild(byId.lpn_menu_list2);

// A unit <select> the way echoUnitSelect() renders one: option.value is "units per SI unit" and
// option.dataset.unit is the family's key for that unit. unitEl() finds these by NAME, not id.
const unitSelects = {};
function mkUnitSelect(name, opts, chosen) {
  const s = mkEl('select');
  s.name = name;
  s.options = opts.map(o => ({ value: String(o[1]), textContent: o[0], dataset: { unit: o[0] } }));
  s.selectedIndex = opts.findIndex(o => o[0] === chosen);
  if (s.selectedIndex < 0) { throw new Error('no such unit ' + chosen + ' on ' + name); }
  Object.defineProperty(s, 'value', { get() { return this.options[this.selectedIndex].value; } });
  unitSelects[name] = s;
  return s;
}
// Factors are "number of that unit per SI unit" -- lib/Units.lib.php's own convention.
function setUnitSet(which) {
  const us = which === 'us';
  mkUnitSelect('lpn_u_length', [['m', 1], ['ft', 1 / FT]], us ? 'ft' : 'm');
  mkUnitSelect('lpn_u_elevhead', [['mh2o', 1], ['fth2o', 1 / FT]], us ? 'fth2o' : 'mh2o');
  mkUnitSelect('lpn_u_pressure', [['kpa', 9.80638], ['psi', 1.42233]], us ? 'psi' : 'kpa');
  mkUnitSelect('lpn_u_diameter', [['mm', 1000], ['in', 1 / IN]], us ? 'in' : 'mm');
  mkUnitSelect('lpn_u_flow', [['lps', 1000], ['gpm', 1 / GPM]], us ? 'gpm' : 'lps');
  mkUnitSelect('lpn_u_velocity', [['mps', 1], ['fps', 1 / FT]], us ? 'fps' : 'mps');
  mkUnitSelect('lpn_u_gradient', [['gradePercent', 100], ['grade', 1]], 'gradePercent');
}

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
  body: mkEl('body'),
  documentElement: mkEl('html')
};
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
  pageConfig: {}, initTips: () => {}, unitFactorFor: () => 1,
  iconEl: () => mkEl('g'),
  setLabel: (el, iconName, text) => { el.textContent = text; }
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

let src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
const marker = "\tdocument.addEventListener('DOMContentLoaded'";
if (src.indexOf(marker) < 0) { throw new Error('injection marker not found'); }
src = src.replace(marker,
  "\tglobal.__LPN = {\n" +
  "\t\tdrawExample: drawExampleNetwork, runSolve: runSolve, assembleModel: assembleModel,\n" +
  "\t\tsettings: function () { return settings; }, getDoc: function () { return doc; },\n" +
  "\t\tseedDefaultInputs: seedDefaultInputs, bbox: bbox, effective: effective,\n" +
  "\t\tfitPending: function () { return fitAfterSolve; },\n" +
  "\t\tlinkLengthSI: linkLengthSI, rebuildSettingsFields: rebuildSettingsFields,\n" +
  // Task 263: the document stores DECLARED values, so a test that wants SI has to cross the
  // same boundary the solver does. Exported rather than re-derived here, or the test would
  // agree with itself instead of with the app -- the same rule the hwCoef note below states.
  "\t\ttoSI: toSI, toDisplay: toDisplay, unitFactor: unitFactor,\n" +
  // ...and the rest of the Task 263 boundary: what the document records about its own units, the
  // v2 migration, and the one-time restore offer's two halves (what it SHOWS and what it DOES).
  "\t\treadUnitSelections: readUnitSelections, applyUnitSelections: applyUnitSelections,\n" +
  "\t\tmigrateSaved: migrateSaved, serializeProject: serializeProject,\n" +
  "\t\tv2RestoreEvidence: v2RestoreEvidence, applyV2Restore: applyV2Restore,\n" +
  "\t\tgetProject: function () { return project; },\n" +
  "\t\tdocVersion: function () { return openDocVersion; },\n" +
  "\t\tsetDocVersion: function (v) { openDocVersion = v; },\n" +
  "\t\tstampDocAnswered: stampDocAnswered, storageVersion: function () { return LPN_STORAGE_VERSION; },\n" +
  "\t\tapplySaved: applySaved, restorePending: function () { return pendingV2Restore; },\n" +
  "\t\tnewProject: newProject, offerUnitRestore: offerUnitRestore,\n" +
  "\t\ttabAsterisk: tabAsterisk, indexEntry: indexEntry, openId: function () { return library.openId; },\n" +
  "\t\tnewProjectFromExample: newProjectFromExample, saveToStorage: saveToStorage,\n" +
  "\t\tbuildMenuBar: buildMenuBar, menuPopupOpen: function () { return document.getElementById('lpn_menu_popup').style.display === 'block'; },\n" +
  "\t\tsubMenuOpen: function () { return document.getElementById('lpn_menu_popup2').style.display === 'block'; },\n" +
  "\t\tsubClosePending: function () { return subCloseTimer !== null; },\n" +
  "\t\tmenuRowLabels: function () { return Array.prototype.map.call(document.getElementById('lpn_menu_list').children, function (c) { return c.textContent || (c.children[1] && c.children[1].textContent) || ''; }); },\n" +
  "\t\tniceDefault: niceDefault, setUnitEl: function (name) { return unitEl(name); },\n" +
  "\t\taddNode: addNode, addLink: addLink,\n" +
  "\t\tlabelWidth: function (id) { return labelEls[id] ? labelEls[id].width : 0; },\n" +
  "\t\tlabelSide: function (id) { return labelEls[id] ? labelEls[id].side : null; },\n" +
  "\t\ttoggleSettingsPopup: toggleSettingsPopup, defaultSettings: defaultSettings,\n" +
  "\t\tsettingsFieldsEl: function () { return document.getElementById('lpn_settings_fields'); },\n" +
  "\t\treset: function () { doc = { nodes: [], links: [], labels: [] };\n" +
  "\t\t\tnodeEls = {}; linkEls = {}; labelEls = {}; incidentLinks = {}; labelsByAnchor = {};\n" +
  "\t\t\tnextId = { J: 1, R: 1, L: 1, P: 1, T: 1 };\n" +
  "\t\t\tsettings = defaultSettings(); seedDefaultInputs();\n" +
  "\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
  "\t\t\tworld = el('g', {}, svg);\n" +
  "\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
  "\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
  "\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
  "\t\t\trubberBandEl = el('line', {}, world); } };\n" + marker);
eval(src);

const L = global.__LPN;
let fails = 0;
function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '   ' + extra));
  if (!cond) { fails++; }
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }

// setMode() drives the real toolbar, which init() never built here; the example calls it last, so
// stub the buttons out of the way rather than reproduce the whole strip.
byId.lpn_toolbar.querySelectorAll = () => [];

['us', 'si'].forEach(which => {
  const us = which === 'us';
  console.log('\n--- ' + which.toUpperCase() + ' unit set ---');
  setUnitSet(which);
  L.reset();
  // Simulate a RETURNING visitor: loadFromStorage() merges a saved settings object onto the
  // defaults, so someone who used the page before the default moved to 20 still carries 2.5. The
  // example must override that -- raising the default alone never reaches them. This is exactly
  // the state Tom was in when he reported the map still drawing at the old size.
  L.settings().textSize = 2.5;
  L.drawExample();

  const doc = L.getDoc(), s = L.settings();
  const nodes = doc.nodes, links = doc.links;
  const res = nodes.filter(n => n.type === 'reservoir'), junc = nodes.filter(n => n.type === 'junction');
  const pipes = links.filter(l => l.type === 'pipe'), pumps = links.filter(l => l.type === 'pump');

  ok('2 reservoirs, 6 junctions', res.length === 2 && junc.length === 6, res.length + ' / ' + junc.length);
  ok('6 pipes, 1 pump', pipes.length === 6 && pumps.length === 1, pipes.length + ' / ' + pumps.length);

  // TWO SEPARATE SYSTEMS (Tom, 2026-08-09) -- the pumped ring, and a standalone gravity feed that
  // touches it nowhere. Demonstrating that disjoint components are legal is the whole point, so
  // the count is asserted rather than assumed.
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  links.forEach(l => { adj[l.from].push(l.to); adj[l.to].push(l.from); });
  const seen = {}, components = [];
  nodes.forEach(n => {
    if (seen[n.id]) { return; }
    const q = [n.id], comp = [];
    seen[n.id] = true;
    while (q.length) { const id = q.shift(); comp.push(id); adj[id].forEach(x => { if (!seen[x]) { seen[x] = true; q.push(x); } }); }
    components.push(comp);
  });
  ok('exactly two separate systems', components.length === 2,
    components.map(c => c.length + ' nodes').join(' + '));
  const ring = components.find(c => c.length === 6), sepComp = components.find(c => c.length === 2);
  ok('one is a 6-node ring system, the other a 2-node gravity feed', !!ring && !!sepComp);

  // A RING, not a tree: every ring junction has degree 2 except the tie-in, which also takes pump.
  const deg = {};
  links.forEach(l => { deg[l.from] = (deg[l.from] || 0) + 1; deg[l.to] = (deg[l.to] || 0) + 1; });
  const ringJunc = junc.filter(n => ring.indexOf(n.id) >= 0);
  ok('every ring junction has degree 2 except one tie-in with 3',
    ringJunc.filter(n => deg[n.id] === 3).length === 1 && ringJunc.filter(n => deg[n.id] === 2).length === 4);
  // links - nodes + components independent cycles. A forest scores 0; this must score exactly 1,
  // so the second system genuinely adds no loop of its own.
  const cyclomatic = links.length - nodes.length + components.length;
  ok('exactly one independent loop across the whole drawing', cyclomatic === 1, 'cyclomatic ' + cyclomatic);
  const sepLinks = links.filter(l => sepComp.indexOf(l.from) >= 0);
  ok('the separate system is one pipe with no pump -- gravity, not pumping',
    sepLinks.length === 1 && sepLinks[0].type === 'pipe');
  // Tom, 2026-08-09: "it would be nice to have more than one vertex for demonstration" -- one
  // vertex shows pipes can bend, several show they are polylines.
  const bent = pipes.filter(p => p.verts.length > 0);
  const verts = pipes.reduce((t, p) => t + p.verts.length, 0);
  ok('more than one bend vertex, spread over more than one pipe', verts >= 3 && bent.length >= 2,
    verts + ' vertices on ' + bent.length + ' pipes');

  // SCALE (Task 254's opening complaint), measured on the RING, which is the part sized and
  // anchored on purpose. The title block and the separate system sit outside it by design.
  const ringNodes = nodes.filter(n => ring.indexOf(n.id) >= 0);
  const xs = ringNodes.map(n => n.x), ys = ringNodes.map(n => n.y);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  // ONE drawing for both presets. Map coordinates FOLLOW the Length/Map declaration (they are not
  // unitless), so this same 1400 x 700 layout is a 1400 ft ring in US and a 1400 m ring in SI --
  // a physically larger system, accepted deliberately. See drawExampleNetwork()'s comment.
  ok('ring extent is 1400 x 700 in both unit sets', near(w, 1400, 1) && near(h, 700, 1),
    w.toFixed(0) + ' x ' + h.toFixed(0));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  ok('ring anchored on 5000,5000', near(cx, 5000, 1) && near(cy, 5000, 1), cx + ',' + cy);
  // THE SEPARATE SYSTEM LIVES INSIDE THE RING'S FOOTPRINT. Tom, 2026-08-09: "Drawing the separate
  // system outside our main loop effectively changes the scale of the project too much... so that
  // our text doesn't look too small." The ring's interior is space zoom-to-fit already pays for;
  // anything slung outside it shrinks every label on the map.
  const sepNodes = nodes.filter(n => sepComp.indexOf(n.id) >= 0);
  ok('the separate system sits inside the ring footprint, costing the fit nothing',
    sepNodes.every(n => n.x > Math.min(...xs) && n.x < Math.max(...xs)
      && n.y > Math.min(...ys) && n.y < Math.max(...ys)),
    sepNodes.map(n => n.id + '(' + n.x + ',' + n.y + ')').join(' '));
  // ...and the title block must stay tucked above the ring without touching it. Measured edge to
  // edge, not centre to node: the lower title line is `dominant-baseline: central`, so half its
  // rendered height sticks out below its y. Too small and it collides with the ring's top node and
  // that node's own data label; too large and zoom-to-fit shrinks the whole map for white space.
  const lowerTitle = doc.labels.filter(t => !t.anchorNode)
    .reduce((a, b) => (a.y > b.y ? a : b));
  // Judged at the DEFAULT text size, not this run's seeded 2.5: the title's y is a fixed map
  // coordinate, so the layout was composed for the size it ships with. A visitor who shrinks their
  // text only opens the gap further, which is harmless.
  const dts = L.defaultSettings().textSize;
  const titleGap = Math.min(...ys) - (lowerTitle.y + dts * lowerTitle.sizeMult / 2);
  ok('title block clears the ring top without stranding it in white space',
    titleGap > 15 && titleGap < 80, titleGap.toFixed(1) + ' units at the shipped text size');
  // TEXT SIZE IS THE SHIPPED DEFAULT AND THE EXAMPLE MUST NOT TOUCH IT. Tom, 2026-08-09: ship a
  // default that suits the example, and "anything other is on the user, not us." So the stored 2.5
  // seeded above must survive the draw -- a visitor who set their own size keeps it.
  ok('20 is the shipped default, for a first-time visitor',
    L.defaultSettings().textSize === 20, L.defaultSettings().textSize);
  ok('the example does NOT overwrite a size the visitor had already chosen', s.textSize === 2.5,
    s.textSize);
  const ratio = w / L.defaultSettings().textSize;
  ok('extent:default-text ratio reads like plan lettering (50-100)', ratio > 50 && ratio < 100,
    ratio.toFixed(0));

  // ---- annotations, all composed from already-translated strings ----
  const PC = EngCalcs.pageConfig;
  const texts = doc.labels.map(t => t.text);
  ok('four Text annotations were placed', doc.labels.length === 4, doc.labels.length);
  ok('title block uses the real brand and menu strings',
    texts.includes(PC.menu_brand) && texts.includes(PC.lpn_main_menu));
  ok('reservoir and lowest-pressure callouts use real strings',
    texts.includes(PC.lpn_tool_add_reservoir) && texts.includes(PC.bpn_p_min));
  ok('no annotation was left on the placeholder "Text"',
    !texts.some(t => t === PC.lpn_new_text || t === 'Text'), JSON.stringify(texts));
  ok('the two callouts are anchored to nodes, the title block is not',
    doc.labels.filter(t => t.anchorNode).length === 2);
  ok('size multipliers are set (a 2 and two 1.5s), not left at 1',
    doc.labels.filter(t => t.sizeMult === 2).length === 1
    && doc.labels.filter(t => t.sizeMult === 1.5).length === 3,
    doc.labels.map(t => t.sizeMult).join(','));

  // ANCHOR ORIENTATION (Tom, 2026-08-09). An anchored Text is text-anchor:middle, so lb.x offsets
  // its CENTRE and updateLabelGeometry() runs the leader to the near edge (px +/- halfW). If the
  // offset is smaller than half the text width, that edge is inside the words and the leader is a
  // stub emerging from the middle of them -- "the worst of all possible positions". The whole label
  // must clear its node horizontally, which is a property of the MEASURED width, not of a constant.
  doc.labels.filter(t => t.anchorNode).forEach(t => {
    const halfW = L.labelWidth(t.id) / 2;
    ok('"' + t.text + '" sits entirely to one side of its anchor',
      Math.abs(t.x) > halfW,
      'offset ' + t.x.toFixed(1) + ' vs half-width ' + halfW.toFixed(1));
    // ...and the side the leader is drawn for must agree with the side the label is actually on.
    ok('..."' + t.text + '" leader is drawn on the matching side',
      L.labelSide(t.id) === (t.x < 0 ? 'left' : 'right'), L.labelSide(t.id));
    // LEADER ANGLE. The leader runs from the node to the label's near edge, which sits exactly
    // `gap` away horizontally -- the text width cancels -- so the slope is atan(|dy| / gap) and
    // `gap` is |t.x| minus half the width. Both callouts must come out at the SAME angle even
    // though a reservoir's radius and a junction's differ, which is the thing a fixed dy could
    // not deliver. Tom, 2026-08-09: "Leaders don't look great horizontal."
    const gap = Math.abs(t.x) - halfW;
    const deg = Math.atan2(Math.abs(t.y), gap) * 180 / Math.PI;
    ok('..."' + t.text + '" leader rises at the shared callout angle, not flat',
      near(deg, 70, 0.5), deg.toFixed(1) + ' degrees');
    ok('..."' + t.text + '" leader rises (label is above its node, not level)', t.y < 0,
      't.y = ' + t.y.toFixed(1));
  });

  // The pump curve is real datasheet shape: 3 points, head falling with flow, from zero flow.
  const cp = pumps[0].curvePoints;
  ok('pump curve has 3 points starting at zero flow', cp.length === 3 && cp[0][0] === 0);
  ok('pump curve head falls monotonically', cp[0][1] > cp[1][1] && cp[1][1] > cp[2][1]);

  // Diameters/roughness were pinned by the example, not left on the page default.
  // Declared 6 (in) or 150 (mm) since Task 263 -- checked in SI so ONE assertion covers both, and
  // so it is the number the solver will actually see that is being checked.
  ok('pipes are 6 in / 150 mm',
    pipes.every(p => near(L.toSI(L.effective(p, 'diameter'), 'lpn_u_diameter'), 0.1524, 0.003)),
    (L.toSI(L.effective(pipes[0], 'diameter'), 'lpn_u_diameter') * 1000).toFixed(0) + ' mm');
  ok('pipes are C = 130', pipes.every(p => L.effective(p, 'roughness') === 130));

  // ---- and it must actually solve, to numbers a reviewer accepts --------
  // The second half of Task 254: the fit done inside drawExampleNetwork() happens before the
  // debounced solve has produced any label text, so a re-fit must still be pending, and the solve
  // must consume it exactly once.
  ok('a re-fit is pending after drawing', L.fitPending() === true);
  L.runSolve();
  ok('the solve consumed the pending re-fit', L.fitPending() === false);
  const model = L.assembleModel(), r = EngCalcs.lpnSolve(model, { tol: 1e-6 });
  ok('solves and converges', r.ok && r.converged === true);

  const press = {}; // in the visitor's own pressure unit
  model.nodes.forEach(n => {
    if (n.type !== 'junction') { return; }
    press[n.id] = (r.heads[n.id] - n.elev) * (us ? 1 / FT * 0.4335 : 9.80638);
  });
  const pv = Object.values(press);
  const lo = Math.min(...pv), hi = Math.max(...pv);
  const loWant = us ? 40 : 275, hiWant = us ? 80 : 550; // 40-80 psi is the distribution band
  ok('every junction pressure lands in the normal distribution band',
    lo > loWant && hi < hiWant,
    lo.toFixed(0) + '-' + hi.toFixed(0) + (us ? ' psi' : ' kPa'));

  // The "Lowest pressure" callout is anchored to a HARD-CODED node, because at draw time the solve
  // has not run. This is the assertion that makes that safe: if a tweak moves the minimum, fail
  // here rather than ship a map that points at the wrong junction.
  // Across BOTH systems -- the separate gravity feed is deliberately sized to stay above the ring's
  // minimum, because a second system that quietly stole the network low would make this callout a
  // lie while every other assertion still passed.
  const minId = Object.keys(press).reduce((a, b) => (press[a] <= press[b] ? a : b));
  const callout = doc.labels.find(t => t.text === PC.bpn_p_min);
  ok('the "Lowest pressure" callout is on the actual minimum-pressure junction',
    callout && callout.anchorNode === minId,
    'callout on ' + (callout && callout.anchorNode) + ', minimum at ' + minId);

  // THE POINT OF A RING: flow leaves the tie-in both ways and meets at a divide, so around the
  // ring in a consistent direction the sign of Q must change. A series main cannot do this.
  // Ring pipes only -- the separate gravity feed always flows one way and would mask a ring that
  // had stopped splitting.
  const ringQ = pipes.filter(p => ring.indexOf(p.from) >= 0).map(p => r.flows[p.id]);
  ok('flow reverses somewhere on the ring (a real hydraulic divide)',
    ringQ.some(q => q > 0) && ringQ.some(q => q < 0),
    ringQ.map(q => (us ? (q / GPM).toFixed(0) + 'gpm' : (q * 1000).toFixed(1) + 'L/s')).join(' '));

  const vel = pipes.map(p => Math.abs(r.flows[p.id]) / (Math.PI / 4 * Math.pow(L.toSI(L.effective(p, 'diameter'), 'lpn_u_diameter'), 2)));
  ok('velocities stay under the 5 fps / 1.5 m/s design ceiling', Math.max(...vel) < 1.5,
    vel.map(v => (us ? (v / FT).toFixed(2) + 'fps' : v.toFixed(2) + 'm/s')).join(' '));

  // Auto length must already include the bends -- the defect Tom caught on the old example.
  const dogleg = pipes.find(p => p.verts.length > 1);
  const straightDist = (() => {
    const a = doc.nodes.find(n => n.id === dogleg.from), b = doc.nodes.find(n => n.id === dogleg.to);
    return Math.hypot(a.x - b.x, a.y - b.y);
  })();
  ok('dog-legged pipe length already counts both bends (no drag needed)',
    L.effective(dogleg, 'length') > straightDist + 1,
    L.effective(dogleg, 'length').toFixed(0) + ' vs straight ' + straightDist.toFixed(0));

  // ---- ROADMAP Task 255: the declared length reaches the solver in METRES ----
  // The guard the ROADMAP asked for: a HAND-COMPUTED Hazen-Williams case, never a comparison
  // against the other engine (both engines read the same model, so they were wrong together).
  const p1 = pipes[0], declared = L.effective(p1, 'length');
  const expectSI = us ? declared * FT : declared;
  ok('linkLengthSI converts the declared length to metres',
    near(L.linkLengthSI(p1), expectSI, 1e-9),
    declared.toFixed(0) + (us ? ' ft -> ' : ' m -> ') + L.linkLengthSI(p1).toFixed(1) + ' m');
  ok('the model handed to the solver carries the SI length',
    near(model.links.find(x => x.id === p1.id).length, expectSI, 1e-9));
  // hf = 10.67 L Q^1.852 / (C^1.852 d^4.87), plus the minor loss k Q^2 / (2 g A^2) the solver adds.
  const Q1 = Math.abs(r.flows[p1.id]), d1 = L.toSI(L.effective(p1, 'diameter'), 'lpn_u_diameter'), A1 = Math.PI / 4 * d1 * d1;
  const hand = 10.67 * expectSI * Math.pow(Q1, 1.852) / (Math.pow(130, 1.852) * Math.pow(d1, 4.871))
    + L.effective(p1, 'k') * Q1 * Q1 / (2 * 9.806 * A1 * A1);
  ok('reported head loss matches hand-computed Hazen-Williams to 1%',
    Math.abs(Math.abs(r.headlosses[p1.id]) - hand) / hand < 0.01,
    'solver ' + Math.abs(r.headlosses[p1.id]).toFixed(4) + ' m vs hand ' + hand.toFixed(4) + ' m');

  // bbox() must contain every node AND every annotation -- this is what zoomExtent() fits to, and
  // a title that falls outside it gets clipped by the fit (which is Task 254's second complaint).
  const b = L.bbox();
  ok('bbox encloses every node, both systems', nodes.every(n => n.x >= b.minx && n.x <= b.maxx && n.y >= b.miny && n.y <= b.maxy));
  const title = doc.labels.find(t => t.text === PC.menu_brand);
  // The CURRENT text size, not the default -- this run deliberately seeds a returning visitor's
  // stored 2.5, and bbox() must track whatever size the labels are actually rendered at.
  const titleHalfH = s.textSize * title.sizeMult / 2;   // dominant-baseline:central
  ok('bbox reserves the title block\'s real height, not a constant',
    b.miny <= title.y - titleHalfH + 1e-9,
    'title top ' + (title.y - titleHalfH).toFixed(1) + ' vs bbox top ' + b.miny.toFixed(1));
});

// ---- the Settings panel is a VIEW of `settings`, not a copy taken at page load ----
// Tom, 2026-08-09: the map drew 20-unit text while the Text size box read 2.5, "a condition
// [that] should be impossible". It was possible for every setting, because the panel was built
// once at init and only repainted by the writers that remembered to. toggleSettingsPopup() now
// rebuilds on open; this proves it for a value changed behind the panel's back.
// ---- the annotation strings must actually reach the browser -------------
// drawExampleNetwork() reads these off EngCalcs.pageConfig, which Looped-Network.php builds by
// hand, one line per key. A key that exists in the lang file but is never emitted there arrives
// as undefined and the annotation is silently skipped -- nothing throws, the map is just missing
// a label. This is the check that turns that into a failure.
// ---- ZERO-PRESSURE CALIBRATION (Tom's idea, 2026-08-09) -----------------
// Tom proposed adding "independent systems whose length and upper elevation are tweaked so that
// their lower elevation or pressure is exactly 0", one tuned for US and one for SI, as a sneaky
// regression test -- a 0.00 on the map that stops reading 0.00 the moment a unit or a constant
// drifts. The idea is exactly right; this is that idea with two changes.
//
//  1. It lives HERE, not in the shipped example. On the map only one of the two can read zero at a
//     time (the other is tuned for the other unit set), so a visitor in the wrong preset sees a
//     stray reservoir-and-stub reporting an arbitrary pressure next to a ring main we spent Task
//     254 making look like real work. And a check nobody runs is not a check. Here BOTH are exact,
//     both run on every invocation, and a drift fails loudly instead of waiting to be noticed.
//  2. The demand is DERIVED, not iterated. Tom's screenshot shows 537.15 gpm found by hand; the
//     Hazen-Williams law inverts in closed form, so the length that makes the pressure exactly
//     zero is computed here and the tolerance can be 1e-9 m instead of "looks like 0.00".
//
// WHAT IT ACTUALLY CATCHES, and why it is not redundant with the hand-computed check above: this
// one runs end to end through the APP -- addNode/addLink, effective(), linkLengthSI(),
// assembleModel() -- with the Length/Map selector set, so it exercises the unit boundary that
// Task 255 got wrong. Before that fix, the US case reported 68 ft of pressure where zero was
// designed in.
console.log('\n--- zero-pressure calibration, end to end through the app ---');
['us', 'si'].forEach(which => {
  const us = which === 'us';
  setUnitSet(which);
  L.reset();
  // A reservoir at 100 ft / 30 m feeding one pipe to a junction at elevation zero. Choose the
  // demand, then solve Hazen-Williams backwards for the pipe length that burns EXACTLY the whole
  // static head: L = hf C^n d^m / (coef Q^n), in metres, then declared in map units.
  // CONSTANTS COME FROM EngCalcs, never restated here. Restating them makes the test agree with
  // itself instead of with the app -- literal 10.67/1.852/4.871 left a 0.03% residual against the
  // shipped hwCoef of 10.66682948893005, which is precisely the drift this test exists to catch.
  const coef = EngCalcs.hwCoef, n = EngCalcs.hwExp, m = EngCalcs.hwDiaExp;
  const head = us ? 100 * FT : 30;               // metres
  const Q = us ? 500 * GPM : 0.030;              // m3/s
  const d = us ? 4 * IN : 0.10, C = 130;
  const lenSI = head * Math.pow(C, n) * Math.pow(d, m) / (coef * Math.pow(Q, n));
  const lenDeclared = lenSI * (us ? 1 / FT : 1); // map units -- the number a user would type

  // Written in the DISPLAYED unit, not SI (Task 263): the document now stores what a user types,
  // so a test that wrote metres into a millimetre project would be testing a network 1000x too
  // small -- which is precisely the mistake the wizard in offerUnitRestore() exists to undo.
  const r2 = L.addNode('reservoir', 1000, 1000);
  r2.elev = head * L.unitFactor('lpn_u_elevhead');
  const j = L.addNode('junction', 1000 + lenDeclared, 1000);
  j.elev = 0;
  j._demand = Q * L.unitFactor('lpn_u_flow');
  const pipe = L.addLink('pipe', r2.id, j.id);
  pipe._diameter = d * L.unitFactor('lpn_u_diameter');
  pipe._roughness = C;
  pipe._k = 0;                 // keep the closed form exact -- no minor-loss term
  pipe._length = lenDeclared;
  pipe.lenAuto = false;

  // The unit boundary is engaged: in US the declared number and the SI number genuinely differ,
  // which is the whole thing Task 255 was getting wrong.
  ok(which.toUpperCase() + ': the declared length converts to the intended SI length',
    near(L.linkLengthSI(pipe), lenSI, 1e-9),
    lenDeclared.toFixed(1) + (us ? ' ft -> ' : ' m -> ') + lenSI.toFixed(1) + ' m');

  const model = L.assembleModel(), out = EngCalcs.lpnSolve(model, { tol: 1e-12 });
  const gauge = out.heads[j.id] - j.elev;
  ok(which.toUpperCase() + ': pressure at the calibration junction is exactly zero',
    out.converged && Math.abs(gauge) < 1e-6,
    'gauge head ' + gauge.toExponential(2) + ' m, from a '
      + lenDeclared.toFixed(1) + (us ? ' ft' : ' m') + ' pipe at '
      + (us ? (Q / GPM).toFixed(0) + ' gpm' : (Q * 1000).toFixed(0) + ' L/s'));
});

console.log('\n--- annotation strings are wired end to end ---');
{
  const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
  const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
  ['menu_brand', 'lpn_main_menu', 'lpn_tool_add_reservoir', 'bpn_p_min'].forEach(k => {
    ok(k + ' exists in lang.ec.en.php', langSrc.indexOf("$ec_lang['" + k + "']=") >= 0);
    ok(k + ' is emitted into pageConfig by Looped-Network.php', php.indexOf('\t' + k + ':') >= 0);
  });
  // The whole point of composing from existing strings was zero new translation load, and lpn_'s
  // translated languages are the Task 203 core four. Anything borrowed must already exist there.
  ['es', 'pt', 'fr', 'tr'].forEach(lang => {
    const src = fs.readFileSync(ROOT + 'lib/lang.ec.' + lang + '.php', 'utf8');
    const missing = ['menu_brand', 'lpn_main_menu', 'lpn_tool_add_reservoir', 'bpn_p_min']
      .filter(k => src.indexOf("$ec_lang['" + k + "']=") < 0);
    ok('every borrowed string already exists in ' + lang, missing.length === 0, missing.join(','));
  });
}

console.log('\n--- Settings panel stays in sync ---');
{
  const fieldsEl = L.settingsFieldsEl();
  function textSizeInputValue() {
    let found;
    (function walk(n) {
      (n.children || []).forEach(c => {
        if (c.type === 'number' && c.step === 'any' && c.min === '0.1' && found === undefined) { found = c.value; }
        walk(c);
      });
    })(fieldsEl);
    return found;
  }
  // Clear the returning-visitor 2.5 the draw loop above seeded, so this section starts from the
  // shipped default rather than from the previous block's leftovers.
  L.settings().textSize = L.defaultSettings().textSize;
  L.rebuildSettingsFields();
  ok('panel opens on the shipped default', String(textSizeInputValue()) === '20', textSizeInputValue());
  L.settings().textSize = 37;                       // a writer that does NOT repaint the panel
  const popup = byId.lpn_settings_popup;
  popup.style.display = 'none';
  L.toggleSettingsPopup({ currentTarget: mkEl('button') });   // reopening must repaint it
  ok('reopening the panel shows a value changed behind its back',
    String(textSizeInputValue()) === '37', textSizeInputValue());
}


// ---- ROADMAP Task 263: the unit boundary ----------------------------------
// The ban Tom stated: "no inputs conversion on units change." Everything here is about WHERE a
// number is allowed to be multiplied by a unit factor -- at the solver, and on the way back from
// it, and nowhere else. These assertions fail loudly if anybody reintroduces a third site.
{
  console.log('\n--- Task 263: inputs are declared, not converted ---');
  setUnitSet('us');
  L.reset();
  L.drawExample();
  const doc = L.getDoc();
  const pipe = doc.links.find(l => l.type !== 'pump');
  const junction = doc.nodes.find(n => n.type === 'junction');

  // 1. THE BAN ITSELF. Snapshot the declared inputs, switch the strip to metric, and require that
  //    not one stored number moved. This is the whole task in one assertion.
  const before = {
    d: pipe._diameter, len: pipe._length, rough: pipe._roughness,
    elev: junction.elev, demand: junction._demand
  };
  const siBefore = L.assembleModel().links.find(l => l.id === pipe.id).diameter;
  setUnitSet('si');
  ok('switching units changes NO stored input',
    pipe._diameter === before.d && pipe._length === before.len &&
    pipe._roughness === before.rough && junction.elev === before.elev &&
    junction._demand === before.demand,
    'diameter still ' + pipe._diameter);
  // 2. ...and the physics DOES move, which is the other half of "reinterpret". A 6 that meant
  //    6 inches now means 6 mm, so the model the solver sees must have changed.
  const siAfter = L.assembleModel().links.find(l => l.id === pipe.id).diameter;
  ok('...but the SI value handed to the solver does change',
    Math.abs(siAfter - siBefore) > 1e-9,
    (siBefore * 1000).toFixed(1) + ' mm -> ' + (siAfter * 1000).toFixed(1) + ' mm');

  // 3. niceDefault returns a number IN THE SELECTED UNIT, both branches. The SI branch is the one
  //    that bit us: siVal is quoted in the SI BASE unit, but the SI preset shows mm and l/s.
  setUnitSet('us');
  ok('niceDefault US branch is the US number as typed', L.niceDefault('lpn_u_diameter', 'in', 6, 0.15) === 6);
  setUnitSet('si');
  ok('niceDefault SI branch scales base SI to the shown unit (0.15 m -> 150 mm)',
    near(L.niceDefault('lpn_u_diameter', 'in', 6, 0.15), 150, 1e-9),
    String(L.niceDefault('lpn_u_diameter', 'in', 6, 0.15)));
  ok('...and 0.015 m3/s -> 15 l/s', near(L.niceDefault('lpn_u_flow', 'gpm', 250, 0.015), 15, 1e-9),
    String(L.niceDefault('lpn_u_flow', 'gpm', 250, 0.015)));

  // 4. THE PROJECT OWNS ITS UNITS. Tom: "it would be another disaster for projects not to be stored
  //    with their units. Imagine opening a 400 diameter pipe into an inch browser!"
  const savedSI = L.serializeProject();
  ok('the saved document records its units by KEY', savedSI.units.lpn_u_diameter === 'mm', JSON.stringify(savedSI.units));
  setUnitSet('us');
  ok('a browser left in inches really is in inches', L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'in');
  L.applyUnitSelections(savedSI.units);
  ok('opening that document puts the browser back in mm -- the 400 mm pipe stays 400 mm',
    L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'mm');
  // A unit this browser does not offer is skipped, not forced: a wrong selection beats a broken one.
  L.applyUnitSelections({ lpn_u_diameter: 'furlong' });
  ok('an unknown unit is ignored rather than breaking the select',
    L.setUnitEl('lpn_u_diameter').options[L.setUnitEl('lpn_u_diameter').selectedIndex].dataset.unit === 'mm');

  // 5. MIGRATION. v2 documents hold SI and say nothing about units. migrateSaved must stamp and
  //    flag, and must NOT touch a single number -- the rewrite is the user's to authorise.
  const v2 = { v: 2, nodes: [{ id: 'J1', type: 'junction', elev: 15.24, _demand: 0.0157 }],
    links: [{ id: 'P1', type: 'pipe', _diameter: 0.1524, _length: 461, _roughness: 130 }], labels: [] };
  const out = L.migrateSaved(JSON.parse(JSON.stringify(v2)));
  // THE MISSING STAMP *IS* THE PENDING QUESTION -- there is no second flag. migrateSaved must
  // therefore leave a v2 document at v2, or the offer would be silently answered on the user's
  // behalf the first time it was read.
  ok('migrateSaved leaves a v2 document at v2 -- the conversion is the user\'s to authorise',
    out.v === 2, 'v = ' + out.v);
  ok('...and changes no number at all',
    out.nodes[0].elev === 15.24 && out.links[0]._diameter === 0.1524 && out.links[0]._length === 461);

  // 6. WHAT THE DIALOG SHOWS. Five most COMMON diameters, then those sorted smallest to largest,
  //    rendered before -> after so the user can recognise their own pipe schedule.
  setUnitSet('us');
  L.reset();
  const dias = [0.1016, 0.1016, 0.1016, 0.2032, 0.2032, 0.1524, 0.3048, 0.4064, 0.508, 0.6096];
  const nA = L.addNode('junction', 0, 0), nB = L.addNode('junction', 100, 0);
  dias.forEach(d => { const l = L.addLink('pipe', nA.id, nB.id); l._diameter = d; });
  const rows = L.v2RestoreEvidence();
  ok('the offer shows at most 5 diameters', rows.length === 5, rows.join(', '));
  ok('...sorted smallest to largest', rows.map(r => +r.split(' → ')[0]).every((v, i, arr) => i === 0 || arr[i - 1] <= v), rows.join(', '));
  ok('...as before → after, in the units on the strip (0.1016 → 4)',
    rows.some(r => r === '0.1016 → 4'), rows.join(', '));
  // The two genuinely common sizes must survive the cut; the ten-entry set has five singletons
  // tied for the last three slots, so WHICH singletons make it is arbitrary and not asserted.
  ok('...keeping the two most common sizes',
    rows.some(r => r.indexOf('0.1016 ') === 0) && rows.some(r => r.indexOf('0.2032 ') === 0), rows.join(', '));
  ok('...and dropping some of the singletons rather than listing all ten',
    !rows.some(r => r.indexOf('0.6096 ') === 0), rows.join(', '));

  // 7. WHAT THE DIALOG DOES. Scale the SI-stored inputs into the displayed unit -- and only those.
  //    _length was already declarative before this task, and roughness/k are dimensionless: any of
  //    the three getting scaled here would be a new bug wearing a migration's clothes.
  L.reset();
  setUnitSet('us');
  const r3 = L.addNode('reservoir', 0, 0), j3 = L.addNode('junction', 500, 0);
  r3.elev = 30.48; r3._head = 33.53;            // metres, v2 style
  j3.elev = 15.24; j3._demand = 0.0315;          // metres, m3/s
  const p3 = L.addLink('pipe', r3.id, j3.id);
  p3._diameter = 0.2032; p3._length = 675.4; p3._roughness = 130; p3._k = 2;
  p3.curvePoints = null;
  L.setDocVersion(2);
  ok('the document is below the declarative version before the answer', L.docVersion() === 2);
  ok('...and a save of it writes v2, so the offer survives a round trip',
    L.serializeProject().v === 2, 'v = ' + L.serializeProject().v);
  L.applyV2Restore();
  ok('converting stamps the version, so the offer does not return',
    L.docVersion() === L.storageVersion(), 'v = ' + L.docVersion());
  ok('restore scales elevation to feet', near(r3.elev, 100, 0.01), r3.elev.toFixed(2));
  ok('restore scales the reservoir head', near(r3._head, 110, 0.01), r3._head.toFixed(2));
  ok('restore scales demand to gpm', near(j3._demand, 499.2, 1), j3._demand.toFixed(1));
  ok('restore scales diameter to inches', near(p3._diameter, 8, 0.001), p3._diameter.toFixed(3));
  ok('restore leaves LENGTH alone (already declarative before this task)', p3._length === 675.4);
  ok('restore leaves roughness alone (dimensionless)', p3._roughness === 130);
  ok('restore leaves k alone (dimensionless)', p3._k === 2);

  // "Never ask again" is the third answer (Tom, 2026-08-10). It must stamp the version WITHOUT
  // touching a number -- that is the whole difference between it and Convert.
  L.setDocVersion(2);
  const keepD = p3._diameter, keepElev = r3.elev;
  L.stampDocAnswered();
  ok('never-ask-again stamps the version', L.docVersion() === L.storageVersion());
  ok('...and changes nothing', p3._diameter === keepD && r3.elev === keepElev);
  ok('...so a save of it writes the current version, and the offer is gone',
    L.serializeProject().v === L.storageVersion());

  // THE LINE THAT DECIDES WHETHER ANY OF THIS EVER RUNS. applySaved() reads the version off the
  // document; hard-coding it to current there would silently answer the question for every user,
  // and every assertion above would still pass. A mutation test found exactly that hole.
  const v2doc = L.migrateSaved({ v: 2, project: { name: 'old' }, nodes: [], links: [], labels: [] });
  L.applySaved(v2doc);
  ok('opening a v2 document leaves the version at 2 and arms the offer',
    L.docVersion() === 2 && L.restorePending() === true, 'v = ' + L.docVersion() + ', pending = ' + L.restorePending());
  L.applySaved({ v: L.storageVersion(), project: { name: 'new' }, nodes: [], links: [], labels: [], units: {} });
  ok('opening a current document arms nothing',
    L.docVersion() === L.storageVersion() && L.restorePending() === false,
    'v = ' + L.docVersion() + ', pending = ' + L.restorePending());

  // A NEW project made while a v2 one is open must not inherit its version, or File > New project
  // from inside an unmigrated project would save as v2 and be offered a conversion it cannot need.
  //
  // The v2 document here needs REAL PIPES. With none, offerUnitRestore() takes its "nothing to
  // convert" exit and stamps the version itself, so the assertion passed whether newProject() did
  // its job or not -- caught by mutation testing, and the reason this comment is here.
  L.applySaved(L.migrateSaved({ v: 2, project: { name: 'old' },
    nodes: [{ id: 'J1', type: 'junction', elev: 15.24 }, { id: 'J2', type: 'junction', elev: 15.24 }],
    links: [{ id: 'P1', type: 'pipe', from: 'J1', to: 'J2', _diameter: 0.2032 }], labels: [] }));
  ok('a v2 document with real pipes stays at 2 with the offer still standing',
    L.docVersion() === 2 && L.restorePending() === true, 'v = ' + L.docVersion());
  // Consume the offer first (the dialog itself is a no-op here -- there is no #lpn_dialog), so the
  // NEXT refreshAllFromDocument() cannot reach the "nothing to convert" exit and stamp the version
  // on newProject()'s behalf. Without this step the assertion below passes either way.
  L.offerUnitRestore();
  ok('...and showing the offer does not itself answer it', L.docVersion() === 2);
  L.newProject();
  ok('a new project starts at the current version, whatever was open before it',
    L.docVersion() === L.storageVersion(), 'v = ' + L.docVersion());
  // No scenario-override assertion: scenarios are not reachable from any UI, so no v2 document can
  // carry an override. A test for it would be testing code that cannot run.
}


// ---- ROADMAP Task 264: File > New project actually opens ------------------
// Tom, 2026-08-10: "264 is broken. File New has no options. And it does nothing."
//
// The cause was not in the menu contents at all. A row's click bubbles to the document-level
// dismissal in wireTabs(), and by the time it gets there openMenu() has already run
// `list.innerHTML = ''` -- so the clicked button is DETACHED, popup.contains(e.target) is false,
// and the dismissal closes the submenu the row just opened. Every menubar button avoids this by
// calling stopPropagation(); the row handler and the new toolbar button did not.
//
// This is testable without a browser because the stubs record listeners: drive the real handler,
// then run the real dismissal predicate against the result. It is worth testing rather than just
// fixing, because the failure mode is silent -- no error, no menu, and the feature simply looks
// unbuilt.
{
  console.log('\n--- Task 264: the New project submenu survives its own click ---');
  const PC = EngCalcs.pageConfig;
  L.buildMenuBar();
  const bar = byId.lpn_menubar;
  const fileBtn = bar.children[0];
  function fire(el, target) {
    let stopped = false;
    const ev = { currentTarget: el, target: target || el, stopPropagation() { stopped = true; } };
    (el._listeners.click || []).forEach(fn => fn(ev));
    return { stopped, ev };
  }
  // The document dismissal, transcribed from wireTabs(). If a handler did not stop the click, this
  // is what would run next -- so asserting against it is asserting against the real rule.
  function dismissalWouldClose(target) {
    const popup = byId.lpn_menu_popup;
    return popup.style.display === 'block' && !popup.contains(target);
  }

  const openFile = fire(fileBtn);
  ok('the File menu opens', L.menuPopupOpen());
  ok('...and the menubar button stops its click reaching the dismissal', openFile.stopped);

  const rows = byId.lpn_menu_list.children;
  const newRow = rows.find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_new);
  ok('File carries a New project row', !!newRow);

  ok('...and it is marked as opening a submenu', !!newRow.children.find(c => c.textContent === '▸'));

  const clicked = fire(newRow);
  // THE FLY-OUT CONTRACT (Tom, 2026-08-10): the parent stays on screen. The first cut replaced the
  // File menu's own contents, which reads as having navigated away from File rather than into it.
  ok('clicking it leaves the PARENT menu open', L.menuPopupOpen());
  ok('...and opens the fly-out beside it', L.subMenuOpen());
  const labels = byId.lpn_menu_list2.children
    .map(c => (c.children && c.children[1] && c.children[1].textContent) || '')
    .filter(Boolean);
  ok('...carrying the real options', 
    labels.indexOf(PC.lpn_new_blank) >= 0 && labels.indexOf(PC.lpn_new_example_us) >= 0 &&
    labels.indexOf(PC.lpn_new_example_si) >= 0, labels.join(' | '));
  ok('...and the parent list is untouched, so File is still File',
    byId.lpn_menu_list.children.length > 3);
  ok('the row stops its own click, so the dismissal cannot reach past it', clicked.stopped);
  // The fly-out also removes the ORIGINAL failure mode rather than merely working around it: the
  // clicked row is still in the parent popup, so the dismissal predicate would not have closed
  // anything even if the click had got through.
  ok('...and the clicked row is still inside the parent popup', dismissalWouldClose(newRow) === false);

  // HOVER opens it as well -- both gestures are the convention, and a fly-out that only answers to
  // clicks is the half-built version of one.
  fire(fileBtn);              // toggles the whole menu shut, fly-out with it
  ok('closing the parent takes the fly-out with it', !L.menuPopupOpen() && !L.subMenuOpen());
  fire(fileBtn);              // and open again, fresh rows
  const newRow2 = byId.lpn_menu_list.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_new);
  (newRow2._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('hovering the row opens the fly-out too', L.subMenuOpen());
  // ...and moving onto a plain row takes it away again.
  // THE BUG TOM HIT: "it disappears before the mouse can reach it; it honestly seems to disappear
  // BECAUSE you reach it." The dismiss-on-hover was attached to every plain row at EVERY level, so
  // entering a row of the fly-out closed the fly-out that row was in. Reaching it was fatal.
  const blankRow = byId.lpn_menu_list2.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_new_blank);
  ok('the fly-out has a Blank project row to reach', !!blankRow);
  (blankRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('hovering a row INSIDE the fly-out does not close it', L.subMenuOpen());

  // The other half: the path from the parent row to the fly-out is diagonal and crosses the rows
  // below it, so those must not dismiss on contact either -- they ARM a close that anything inside
  // the fly-out cancels.
  const openRow = byId.lpn_menu_list.children
    .find(r => (r.children[1] && r.children[1].textContent) === PC.lpn_file_open);
  (openRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('crossing a parent row on the way there does not close it immediately', L.subMenuOpen());
  ok('...it arms a close instead', L.subClosePending() === true);
  (blankRow._listeners.mouseenter || []).forEach(fn => fn({}));
  ok('...which reaching the fly-out cancels', L.subClosePending() === false && L.subMenuOpen());

  // The TOOLBAR route to the same submenu had the identical defect. Building the whole toolbar here
  // is more scaffolding than the check is worth, so this is a source-level guard instead: any click
  // handler that opens this menu must stop the click. Crude, and it would not catch a third route
  // written differently -- but it holds the two that exist, and it costs nothing.
  {
    const appSrc = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
    const openers = appSrc.split('\n').filter(l => /addEventListener\('click'/.test(l) && /openNewProjectMenu/.test(l));
    ok('every click handler that opens the New project menu stops its click',
      openers.length > 0 && openers.every(l => /stopPropagation\(\)/.test(l)),
      openers.length + ' handler(s)');
  }
}


// ---- Task 264 follow-up: a brand-new project wears no asterisk ------------
// Tom, 2026-08-10: "New blank projects and from template appear with asterisk, which is bad. But a
// blank project with asterisk closes without confirmation, which is bad." Both halves are the same
// defect -- the mark claimed unsaved work a second after creation, and closeTab() had to special-
// case the claim back out again. The fix is a BASELINE at birth, so `dirty` starts false.
{
  console.log('\n--- Task 264 follow-up: no asterisk on a new project ---');
  setUnitSet('us');
  L.reset();

  const blankId = L.newProject();
  ok('a blank project starts clean -- no asterisk',
    L.tabAsterisk(L.indexEntry(blankId)).show === false);

  // ...and it must EARN one. Anything else would make the mark meaningless in the other direction.
  L.addNode('junction', 10, 10);
  L.saveToStorage();
  ok('...and earns one at the first edit', L.tabAsterisk(L.indexEntry(blankId)).show === true);
  ok('...faint, because it lives only in this browser',
    L.tabAsterisk(L.indexEntry(blankId)).faded === true);

  // The example arrives by the user choosing it from a menu and is two clicks to recreate, so it is
  // not unsaved work either.
  L.newProjectFromExample('us');
  const exId = L.openId();
  ok('a project made from an example starts clean too',
    L.tabAsterisk(L.indexEntry(exId)).show === false, 'dirty = ' + L.indexEntry(exId).dirty);
  ok('...even though it is full of network', L.getDoc().links.length > 0);
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
