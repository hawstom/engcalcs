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
  'lpn_project_file'
].forEach(ensure);

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
global.EngCalcs = {
  pageConfig: {}, initTips: () => {}, unitFactorFor: () => 1,
  iconEl: () => mkEl('g'),
  setLabel: (el, iconName, text) => { el.textContent = text; }
};
global.bootstrap = global.window.bootstrap = { Tooltip: { getInstance: () => null, getOrCreateInstance: () => ({ hide() {}, dispose() {} }) } };

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
  L.drawExample();

  const doc = L.getDoc(), s = L.settings();
  const nodes = doc.nodes, links = doc.links;
  const res = nodes.filter(n => n.type === 'reservoir'), junc = nodes.filter(n => n.type === 'junction');
  const pipes = links.filter(l => l.type === 'pipe'), pumps = links.filter(l => l.type === 'pump');

  ok('1 reservoir, 5 junctions', res.length === 1 && junc.length === 5, res.length + ' / ' + junc.length);
  ok('5 pipes, 1 pump', pipes.length === 5 && pumps.length === 1, pipes.length + ' / ' + pumps.length);

  // A RING, not a tree: every junction has degree 2 except the tie-in, which also takes the pump.
  const deg = {};
  links.forEach(l => { deg[l.from] = (deg[l.from] || 0) + 1; deg[l.to] = (deg[l.to] || 0) + 1; });
  const tie = junc.find(n => deg[n.id] === 3);
  ok('every ring junction has degree 2 except one tie-in with 3',
    tie !== undefined && junc.filter(n => deg[n.id] === 2).length === 4);
  // links - nodes + 1 independent cycles; a tree scores 0, this must score exactly 1.
  ok('exactly one independent loop', links.length - nodes.length + 1 === 1,
    'cyclomatic ' + (links.length - nodes.length + 1));
  // Tom, 2026-08-09: "it would be nice to have more than one vertex for demonstration" -- one
  // vertex shows pipes can bend, several show they are polylines.
  const bent = pipes.filter(p => p.verts.length > 0);
  const verts = pipes.reduce((t, p) => t + p.verts.length, 0);
  ok('more than one bend vertex, spread over more than one pipe', verts >= 3 && bent.length >= 2,
    verts + ' vertices on ' + bent.length + ' pipes');

  // SCALE (Task 254's opening complaint). Coordinates are declarative, so they are read raw.
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  // ONE drawing for both presets -- map units are unitless, so there is nothing to scale.
  ok('extent is 1400 x 700 in both unit sets', near(w, 1400, 1) && near(h, 700, 1),
    w.toFixed(0) + ' x ' + h.toFixed(0));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  ok('anchored on 5000,5000', near(cx, 5000, 1) && near(cy, 5000, 1), cx + ',' + cy);
  // The example must NOT write settings.textSize -- that was the desync Tom found. It inherits
  // the shipped default, which is now 20.
  ok('example leaves textSize on the shipped default', s.textSize === L.defaultSettings().textSize
    && s.textSize === 20, s.textSize);
  const ratio = w / s.textSize;
  ok('extent:text ratio reads like plan lettering (50-100)', ratio > 50 && ratio < 100, ratio.toFixed(0));

  // The pump curve is real datasheet shape: 3 points, head falling with flow, from zero flow.
  const cp = pumps[0].curvePoints;
  ok('pump curve has 3 points starting at zero flow', cp.length === 3 && cp[0][0] === 0);
  ok('pump curve head falls monotonically', cp[0][1] > cp[1][1] && cp[1][1] > cp[2][1]);

  // Diameters/roughness were pinned by the example, not left on the page default.
  ok('pipes are 6 in / 150 mm', pipes.every(p => near(L.effective(p, 'diameter'), 0.1524, 0.003)),
    (L.effective(pipes[0], 'diameter') * 1000).toFixed(0) + ' mm');
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

  // THE POINT OF A RING: flow leaves the tie-in both ways and meets at a divide, so around the
  // ring in a consistent direction the sign of Q must change. A series main cannot do this.
  const ringQ = pipes.map(p => r.flows[p.id]);
  ok('flow reverses somewhere on the ring (a real hydraulic divide)',
    ringQ.some(q => q > 0) && ringQ.some(q => q < 0),
    ringQ.map(q => (us ? (q / GPM).toFixed(0) + 'gpm' : (q * 1000).toFixed(1) + 'L/s')).join(' '));

  const vel = pipes.map(p => Math.abs(r.flows[p.id]) / (Math.PI / 4 * Math.pow(L.effective(p, 'diameter'), 2)));
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
  const Q1 = Math.abs(r.flows[p1.id]), d1 = L.effective(p1, 'diameter'), A1 = Math.PI / 4 * d1 * d1;
  const hand = 10.67 * expectSI * Math.pow(Q1, 1.852) / (Math.pow(130, 1.852) * Math.pow(d1, 4.871))
    + L.effective(p1, 'k') * Q1 * Q1 / (2 * 9.806 * A1 * A1);
  ok('reported head loss matches hand-computed Hazen-Williams to 1%',
    Math.abs(Math.abs(r.headlosses[p1.id]) - hand) / hand < 0.01,
    'solver ' + Math.abs(r.headlosses[p1.id]).toFixed(4) + ' m vs hand ' + hand.toFixed(4) + ' m');

  // bbox() must contain every node -- this is what zoomExtent() fits to.
  const b = L.bbox();
  ok('bbox encloses every node', nodes.every(n => n.x >= b.minx && n.x <= b.maxx && n.y >= b.miny && n.y <= b.maxy));
});

// ---- the Settings panel is a VIEW of `settings`, not a copy taken at page load ----
// Tom, 2026-08-09: the map drew 20-unit text while the Text size box read 2.5, "a condition
// [that] should be impossible". It was possible for every setting, because the panel was built
// once at init and only repainted by the writers that remembered to. toggleSettingsPopup() now
// rebuilds on open; this proves it for a value changed behind the panel's back.
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
  L.rebuildSettingsFields();
  ok('panel opens on the shipped default', String(textSizeInputValue()) === '20', textSizeInputValue());
  L.settings().textSize = 37;                       // a writer that does NOT repaint the panel
  const popup = byId.lpn_settings_popup;
  popup.style.display = 'none';
  L.toggleSettingsPopup({ currentTarget: mkEl('button') });   // reopening must repaint it
  ok('reopening the panel shows a value changed behind its back',
    String(textSizeInputValue()) === '37', textSizeInputValue());
}

console.log('\n' + (fails === 0 ? 'ALL PASS' : fails + ' FAILURE(S)'));
process.exit(fails === 0 ? 0 : 1);
