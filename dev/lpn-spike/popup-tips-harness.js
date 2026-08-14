// Harness for js/looped-network.js -- run with: node dev/lpn-spike/popup-tips-harness.js
//
// Evals the REAL file (not a copy) against DOM/localStorage stubs, injecting a test-only export
// line just before the DOMContentLoaded listener so init() never runs. Written for Task 193's
// popup field tips; kept because the same technique is what caught the assembleModel() bypass in
// 146.08 and is the cheapest way to check anything in this file without a browser.
//
// What it covers: setFieldLabel's .ec-help/.ec-tip nesting, clearFields disposing Bootstrap
// tooltips before wiping, every lpn_ key referenced by JS or PHP existing in lang.ec.en.php,
// the {id} placeholder in the pump curve reference note, a four-node looped solve through
// effective(), and -- the part unit tests miss -- rendering the real node/link popups and reading
// the tips back off them, which is where a mis-threaded argument hides.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

// ---- minimal DOM -------------------------------------------------------
let created = [];
function mkEl(tag) {
  const el = {
    tagName: (tag || 'div').toUpperCase(), _tag: tag, children: [], dataset: {},
    style: {
      _props: {},
      setProperty(k, v) { this._props[k] = v; },
      getPropertyValue(k) { return this._props[k] || ''; },
      removeProperty(k) { delete this._props[k]; }
    },
    classList: {
      _s: new Set(),
      add(...c) { c.forEach(x => this._s.add(x)); },
      remove(...c) { c.forEach(x => this._s.delete(x)); },
      contains(c) { return this._s.has(c); },
      toggle(c, on) { if (on === undefined) { on = !this._s.has(c); } if (on) { this._s.add(c); } else { this._s.delete(c); } return on; }
    },
    className: '', id: '', title: '', type: '', value: '', textContent: '', _innerHTML: '',
    checked: false, placeholder: '', step: '', min: '', _listeners: {},
    appendChild(c) { this.children.push(c); c.parentNode = this; return c; },
    setAttribute(k, v) { this[k] = v; }, getAttribute(k) { return this[k]; },
    addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    removeEventListener() {},
    querySelectorAll(sel) {
      const out = [];
      (function walk(n) {
        (n.children || []).forEach(c => {
          if (sel === '.ec-help' && String(c.className).split(/\s+/).includes('ec-help')) out.push(c);
          walk(c);
        });
      })(el);
      return out;
    },
    querySelector() { return null; },
    closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600 }; },
    getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; },
    remove() {},
    focus() {}, select() {}, click() {}
  };
  // innerHTML must really detach children -- a plain data property makes `fields.innerHTML = ''`
  // a no-op, which silently turns "does not accumulate stale nodes" into a vacuous pass.
  Object.defineProperty(el, 'innerHTML', {
    get() { return this._innerHTML; },
    set(v) { this._innerHTML = v; if (v === '') { this.children.length = 0; } }
  });
  created.push(el);
  return el;
}
const byId = {};
function ensure(id) { if (!byId[id]) { byId[id] = mkEl('div'); byId[id].id = id; } return byId[id]; }
// Every id js/looped-network.js reaches for, harvested from the source itself so a new
// getElementById() in the app cannot silently leave the harness one stub short:
//   grep -o "getElementById('[a-z_0-9]*')" js/looped-network.js | sort -u
[
  'lpn_backdrop_file', 'lpn_backdrop_menu', 'lpn_backdrop_target_continue',
  'lpn_backdrop_target_mode', 'lpn_backdrop_target_panel', 'lpn_canvas', 'lpn_coords',
  'lpn_empty_hint', 'lpn_labels_legend', 'lpn_labels_link_fields', 'lpn_labels_node_fields',
  'lpn_labels_options', 'lpn_labels_popup', 'lpn_labels_popup_close', 'lpn_mode_hint',
  'lpn_popup', 'lpn_popup_close', 'lpn_popup_fields', 'lpn_popup_title', 'lpn_projects_btn',
  'lpn_projects_list', 'lpn_projects_popup', 'lpn_projects_popup_close', 'lpn_settings_fields',
  'lpn_settings_popup', 'lpn_settings_popup_close', 'lpn_status', 'lpn_toolbar'
].forEach(ensure);

global.document = {
  createElement: mkEl,
  createElementNS: (ns, tag) => mkEl(tag),
  createTextNode: t => ({ nodeType: 3, textContent: t, _text: true, children: [] }),
  getElementById: id => byId[id] || null,
  querySelector: () => null,
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
  confirm: () => true, prompt: () => 'X', alert: m => { console.log('ALERT:', m); },
  matchMedia: () => ({ matches: false, addEventListener: () => {} }),
  devicePixelRatio: 1, getComputedStyle: () => ({ getPropertyValue: () => '' })
};
global.alert = global.window.alert;
global.confirm = global.window.confirm;
global.prompt = global.window.prompt;
global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = f => setTimeout(f, 0);
global.EngCalcs = {
  pageConfig: {},
  initTips: function (root) { global.__initTipsCalls.push(root); },
  unitFactorFor: () => 1,
  // js/Icons.lib.js in the browser; here they only need to not throw and to produce something
  // setLabel() can append -- see EngCalcs.setLabel in js/Calculators.lib.js for the real shape.
  iconEl: () => mkEl('g'),
  setLabel: function (el, iconName, text) {
    el.textContent = '';
    var ic = iconName ? this.iconEl(iconName) : null;
    if (ic) { el.appendChild(ic); }
    el.appendChild(document.createTextNode(text));
  }
};
global.__initTipsCalls = [];
global.window.bootstrap = global.bootstrap = { Tooltip: { getInstance: () => null, getOrCreateInstance: () => ({ hide() {}, dispose() {} }) } };

// ---- load pageConfig from the real PHP source ---------------------------
const langSrc = fs.readFileSync(ROOT + 'lib/lang.ec.en.php', 'utf8');
const re = /^\$ec_lang\['(lpn_[a-z0-9_]+|bpn_demand)'\]='((?:[^'\\]|\\.)*)';$/gm;
let m;
while ((m = re.exec(langSrc))) {
  EngCalcs.pageConfig[m[1]] = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}
// unit selects the page would render
['lpn_u_length', 'lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_diameter', 'lpn_u_flow',
 'lpn_u_velocity', 'lpn_u_gradient'].forEach(id => {
  const s = mkEl('select'); s.id = id; s.value = { lpn_u_diameter: 'in', lpn_u_flow: 'gpm' }[id] || 'ft';
  byId[id] = s;
});

// ---- solver -------------------------------------------------------------
// bootstrap.js FIRST -- it supplies EngCalcs.G out of js/Calculators.lib.js, and without it every
// minor-loss term goes NaN (see bootstrap.js's own header for the full story). require(), not
// eval(): lpn-solver.js's own require('./PipeHydraulics.lib.js') would otherwise resolve against
// THIS file's directory (dev/lpn-spike/) instead of js/, which is why this harness died on
// MODULE_NOT_FOUND (ROADMAP Task 256).
require('./bootstrap.js');
// Deliberately no `var EngCalcs` here -- that would be hoisted to the top of this script and
// shadow global.EngCalcs for the pageConfig loader above, which reads/writes the bare identifier.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-solver.js'));
// The map editor's pure halves (ROADMAP Task 293) -- looped-network.js reads
// EngCalcs.lpnGeom/lpnCollide as its IIFE runs, so they go in before the eval below, in the
// same order their <script> tags have in Looped-Network.php.
Object.assign(global.EngCalcs, require(ROOT + 'js/lpn-geom.js'), require(ROOT + 'js/lpn-collide.js'));

// ---- the file under test ------------------------------------------------
let src = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
const marker = "\tdocument.addEventListener('DOMContentLoaded'";
if (src.indexOf(marker) < 0) { throw new Error('injection marker not found'); }
src = src.replace(marker,
  "\tglobal.__LPN = { setFieldLabel: setFieldLabel, clearFields: clearFields, tipsIn: tipsIn,\n" +
  "\t\tnumberFieldPlain: numberFieldPlain, readonlyField: readonlyField,\n" +
  "\t\tmigrateSaved: (typeof migrateSaved === 'function' ? migrateSaved : null),\n" +
  "\t\tassembleModel: assembleModel, effective: effective,\n" +
  "\t\trenderNodeFields: renderNodeFields, renderLinkFields: renderLinkFields,\n" +
  "\t\trebuildSettingsFields: rebuildSettingsFields, helpTip: helpTip,\n" +
  "\t\tsetStatus: setStatus, setNotice: setNotice, discardProject: discardProject,\n" +
  "\t\tsetLibrary: function (l) { library = l; }, getLibrary: function () { return library; },\n" +
  // refreshAllFromDocument() touches the SVG layer variables, which only init() assigns -- and the
  // harness deliberately never runs init(). Build just the layer scaffold, mirroring init()'s own
  // lines, so the delete path can run without dragging in toolbar wiring and zoomExtent.
  "\t\tbuildLayers: function () {\n" +
  "\t\t\tsvg = document.getElementById('lpn_canvas');\n" +
  "\t\t\tworld = el('g', {}, svg);\n" +
  "\t\t\tbackdropLayer = el('g', {}, world); gridLayer = el('g', {}, world);\n" +
  "\t\t\tlinksLayer = el('g', {}, world); nodesLayer = el('g', {}, world);\n" +
  "\t\t\tmaskLayer = el('g', {}, world); labelsLayer = el('g', {}, world);\n" +
  "\t\t\trubberBandEl = el('line', {}, world);\n" +
  "\t\t},\n" +
  "\t\twipeAllStorage: wipeAllStorage,\n" +
  "\t\tsetDoc: function (d, s2) { doc = d; if (s2) { scenarios = s2; } },\n" +
  "\t\tgetDoc: function () { return doc; } };\n" + marker);
// INDIRECT eval, and the indirection is load-bearing -- the same reasoning lpn-dom-stub.js
// spells out. js/looped-network.js opens with `var EngCalcs = EngCalcs || {};`, the browser
// idiom for "reuse the one the earlier script tags made". A DIRECT eval here would hoist a
// fresh module-scope `EngCalcs`, so that line would read its own undefined binding and start
// a SECOND, empty EngCalcs -- which used to be survivable (the solver was only read later,
// and a trailing Object.assign patched it up) but stopped being so once Task 293 made the
// file read EngCalcs.lpnGeom/lpnCollide as its IIFE runs. Running at global scope makes the
// line find global.EngCalcs, exactly as the browser's script order gives it.
(0, eval)(src);

const L = global.__LPN;
let fails = 0;
function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '  ' + extra));
  if (!cond) fails++;
}

// --- 1. setFieldLabel without a tip is a plain text label ---------------
let lab = mkEl('label');
L.setFieldLabel(lab, 'Diameter (in)', undefined);
ok('no tip -> plain textContent', lab.textContent === 'Diameter (in) ' && lab.children.length === 0,
   JSON.stringify(lab.textContent));

// --- 2. with a tip: .ec-help wraps words + nested .ec-tip glyph ---------
lab = mkEl('label');
L.setFieldLabel(lab, 'Head (ft)', 'It is a height, not a pressure.');
const help = lab.children[0];
ok('tip -> .ec-help wrapper', help && help.className === 'ec-help');
ok('tip -> title carries the tip text', help && help.title === 'It is a height, not a pressure.');
const words = help.children[0], glyph = help.children[1];
ok('tip -> label WORDS inside .ec-help', words && words._text && words.textContent === 'Head (ft) ',
   words && JSON.stringify(words.textContent));
ok('tip -> only the glyph is .ec-tip', glyph && glyph.className === 'ec-tip' && glyph.textContent === '?');
ok('tip -> .ec-tip nests INSIDE .ec-help', help.children.includes(glyph) && !lab.children.includes(glyph));

// --- 3. clearFields disposes tooltips before wiping --------------------
let disposed = 0;
global.window.bootstrap.Tooltip.getInstance = () => ({ dispose() { disposed++; } });
const box = mkEl('div');
const l1 = mkEl('label'); L.setFieldLabel(l1, 'A', 'tip A'); box.appendChild(l1);
const l2 = mkEl('label'); L.setFieldLabel(l2, 'B', 'tip B'); box.appendChild(l2);
const l3 = mkEl('label'); L.setFieldLabel(l3, 'C', undefined); box.appendChild(l3);
L.clearFields(box);
ok('clearFields disposes one tooltip per .ec-help', disposed === 2, 'disposed=' + disposed);
ok('clearFields empties the container', box.innerHTML === '');
global.window.bootstrap.Tooltip.getInstance = () => null;

// --- 4. every tip key the JS reads actually exists in the lang file -----
const jsSrc = fs.readFileSync(ROOT + 'js/looped-network.js', 'utf8');
const wanted = [...new Set([...jsSrc.matchAll(/pc\.(lpn_[a-z0-9_]*_tip)\b/g)].map(x => x[1]))];
const missing = wanted.filter(k => !(k in EngCalcs.pageConfig));
ok('every pc.*_tip the JS reads exists in lang.ec.en.php', missing.length === 0, missing.join(','));

// --- 5. ...and each is also emitted into pageConfig by the PHP page -----
const php = fs.readFileSync(ROOT + 'Looped-Network.php', 'utf8');
const notEmitted = wanted.filter(k => php.indexOf('\t' + k + ':') < 0);
ok('every tip key is emitted into pageConfig', notEmitted.length === 0, notEmitted.join(','));

// --- 6. no key referenced anywhere in JS/PHP is absent from the lang file
const allRefs = [...new Set([
  ...[...jsSrc.matchAll(/pc\.(lpn_[a-z0-9_]+)/g)].map(x => x[1]),
  ...[...php.matchAll(/\$ec_lang\['(lpn_[a-z0-9_]+)'\]/g)].map(x => x[1])
])];
const dangling = allRefs.filter(k => !(k in EngCalcs.pageConfig));
ok('no dangling lpn_ key reference', dangling.length === 0, dangling.join(','));

// --- 7. the {id} placeholder is not left unsubstituted ------------------
ok('pump ref note carries {id}', EngCalcs.pageConfig.lpn_pump_curve_ref_note.indexOf('{id}') >= 0);
ok('pump ref note is substituted at the call site',
   /lpn_pump_curve_ref_note[\s\S]{0,180}\.replace\('\{id\}'/.test(jsSrc));

// --- 8. solver still works through effective() --------------------------
L.setDoc({
  nodes: [
    { id: 'R-1', type: 'reservoir', x: 0, y: 0, elev: 100, _head: 100 },
    { id: 'J-1', type: 'junction', x: 100, y: 0, elev: 50, _demand: 0.006 },
    { id: 'J-2', type: 'junction', x: 100, y: 100, elev: 50, _demand: 0.006 },
    { id: 'J-3', type: 'junction', x: 0, y: 100, elev: 50, _demand: 0.006 }
  ],
  links: [
    { id: 'P-1', type: 'pipe', from: 'R-1', to: 'J-1', _diameter: 0.2, _roughness: 100, _length: 100, _k: 0, _status: 'open' },
    { id: 'P-2', type: 'pipe', from: 'J-1', to: 'J-2', _diameter: 0.15, _roughness: 100, _length: 100, _k: 0, _status: 'open' },
    { id: 'P-3', type: 'pipe', from: 'J-2', to: 'J-3', _diameter: 0.15, _roughness: 100, _length: 100, _k: 0, _status: 'open' },
    { id: 'P-4', type: 'pipe', from: 'J-3', to: 'R-1', _diameter: 0.2, _roughness: 100, _length: 100, _k: 0, _status: 'open' }
  ],
  labels: []
});
const model = L.assembleModel();
ok('assembleModel reads through effective() (diameter present)',
   model.links.every(l => l.diameter > 0), JSON.stringify(model.links.map(l => l.diameter)));
const res = EngCalcs.lpnSolve(model, { tolerance: 1e-6, maxIter: 50 });
ok('looped network converges', res.converged === true);
const inflow = -res.flows['P-1'] - res.flows['P-4'];
ok('continuity at the reservoir (sum of demands = 0.018)',
   Math.abs(Math.abs(inflow) - 0.018) < 1e-6 || Math.abs(Math.abs(res.flows['P-1']) + Math.abs(res.flows['P-4']) - 0.018) < 1e-6,
   'P-1=' + res.flows['P-1'].toFixed(6) + ' P-4=' + res.flows['P-4'].toFixed(6));
ok('heads below the reservoir head', ['J-1', 'J-2', 'J-3'].every(n => res.heads[n] < 100));

// --- 9. INTEGRATION: render the real popups and read the tips off them --
// This is what catches a mis-threaded argument -- setFieldLabel's own unit tests pass whether or
// not the caller actually hands it the tip.
function tipsOf(container) {
  const out = {};
  container.querySelectorAll('.ec-help').forEach(h => {
    const words = h.children.find(c => c._text);
    out[(words ? words.textContent : '').trim()] = h.title;
  });
  return out;
}
const pf = byId.lpn_popup_fields;
global.__initTipsCalls.length = 0;
L.renderLinkFields('P-1');
let t = tipsOf(pf);
const PC = EngCalcs.pageConfig;
ok('link popup: Roughness carries its tip',
   Object.keys(t).some(k => k.startsWith('Roughness') && t[k] === PC.lpn_field_roughness_tip),
   JSON.stringify(Object.keys(t)));
ok('link popup: Minor loss k carries its tip',
   Object.values(t).includes(PC.lpn_field_km_tip));
ok('link popup: Length carries its tip', Object.values(t).includes(PC.lpn_field_length_tip));
ok('link popup calls initTips on its container', global.__initTipsCalls.includes(pf));

global.__initTipsCalls.length = 0;
L.renderNodeFields('J-1');
t = tipsOf(pf);
ok('junction popup: Elevation carries its tip', Object.values(t).includes(PC.lpn_field_elev_tip));
ok('junction popup: Demand carries lpn_demand_tip, not bpn_demand_tip',
   Object.values(t).includes(PC.lpn_demand_tip));
ok('junction popup calls initTips', global.__initTipsCalls.includes(pf));

L.renderNodeFields('R-1');
t = tipsOf(pf);
ok('reservoir popup: Head carries the height-not-pressure tip',
   Object.values(t).includes(PC.lpn_field_head_tip), JSON.stringify(t));

// re-rendering must not accumulate stale .ec-help nodes
const before = pf.querySelectorAll('.ec-help').length;
L.renderNodeFields('R-1');
ok('re-render does not accumulate labels', pf.querySelectorAll('.ec-help').length === before,
   before + ' -> ' + pf.querySelectorAll('.ec-help').length);

// --- 10. the two reset controls: TWO scoped tips, not one shared ---------
// "Clear project" (lpn_tool_clear / lpn_tool_clear_tip) was REMOVED by Task 211 -- see
// lpn_edit_delete_network in lib/lang.ec.en.php for what replaced it. What is left is Settings'
// own two buttons: Restore defaults (settings only) and Erase everything on this page (full
// reset). This section used to check for a THIRD, no-longer-existing tip -- fixed 2026-08-09
// (ROADMAP Task 256) rather than restated, so a future removal shows up here again instead of
// silently rotting the harness a second time. The original point still holds: settings live
// inside each project document, so Erase everything alone is the full reset, and no tip may claim
// otherwise.
const rb = mkEl('button');
L.helpTip(rb, 'some tip');
ok('helpTip sets the title', rb.title === 'some tip');
ok('helpTip marks the button .ec-help (touch reachability)',
   String(rb.className).split(/\s+/).includes('ec-help'));
const withClass = mkEl('button'); withClass.className = 'lpn-x';
L.helpTip(withClass, 't');
ok('helpTip APPENDS ec-help rather than clobbering an existing class',
   withClass.className === 'lpn-x ec-help', withClass.className);
const noTip = mkEl('button');
L.helpTip(noTip, undefined);
ok('helpTip is a no-op with no text', noTip.title === '' && noTip.className === '');

const two = [PC.lpn_settings_restore_tip, PC.lpn_reset_all_tip];
ok('both reset tips exist', two.every(t => t && t.length > 20));
ok('the two reset tips are distinct', new Set(two).size === 2);

const sf = byId.lpn_settings_fields;
L.rebuildSettingsFields();
function buttonsIn(root) {
  const out = [];
  (function walk(n) { (n.children || []).forEach(c => { if (c.tagName === 'BUTTON') out.push(c); walk(c); }); })(root);
  return out;
}
// Restore defaults sets .textContent directly; Erase everything goes through
// EngCalcs.setLabel(icon, text), which appends a text NODE instead -- so a button's label is
// whichever one it actually has, not always the bare property.
function buttonLabel(b) {
  if (b.textContent) { return b.textContent; }
  const words = b.children.find(c => c._text);
  return words ? words.textContent : '';
}
const restoreBtn = buttonsIn(sf).find(b => buttonLabel(b) === (PC.calc_defaults || 'Restore defaults'));
const wipeBtn = buttonsIn(sf).find(b => buttonLabel(b) === PC.lpn_settings_wipe_btn);
ok('both Settings reset buttons are present', !!restoreBtn && !!wipeBtn,
   buttonsIn(sf).map(buttonLabel).join(' | '));
ok('Restore defaults carries ITS OWN tip', restoreBtn.title === PC.lpn_settings_restore_tip);
ok('Erase everything carries ITS OWN tip', wipeBtn.title === PC.lpn_reset_all_tip);

// No reset tip may quote another button's label -- the cross-key dependency lpn_empty_hint was
// fixed for in this same pass.
const labels = [PC.calc_defaults, PC.lpn_settings_wipe_btn];
const quoted = [];
two.forEach(t => labels.forEach(lbl => { if (t.indexOf(lbl) >= 0) { quoted.push(lbl); } }));
ok('no reset tip quotes another key\'s value', quoted.length === 0, quoted.join(' / '));

// No tip may claim the buttons must be combined -- that was the false statement.
ok('no reset tip claims they must be used together',
   !two.some(t => /used together|all three|three reset buttons/i.test(t)));

// --- 11. the full reset really is full ----------------------------------
// "reloads the page exactly as a first-time visitor sees it" is only true if the suite unit
// cookie goes too: Looped-Network.php calls echoCookieScript() and the unit selects post through
// EngCalcs.submitForm(), so unit choices round-trip through a cookie that localStorage wiping
// cannot reach.
localStorage.setItem('lpn_index', '{"projects":[]}');
localStorage.setItem('lpn_project_pabc', '{}');
localStorage.setItem('unrelated_key', 'keep me');
let expired = 0;
EngCalcs.expireCookie = function () { expired++; };
L.wipeAllStorage();
ok('wipeAllStorage removes the index', localStorage.getItem('lpn_index') === null);
ok('wipeAllStorage removes every project key', localStorage.getItem('lpn_project_pabc') === null);
ok('wipeAllStorage leaves unrelated keys alone', localStorage.getItem('unrelated_key') === 'keep me');
ok('wipeAllStorage expires the suite unit cookie', expired === 1, 'expireCookie calls=' + expired);

// --- 12. status bar: notice vs diagnostic ------------------------------
// The bar has two writers. runSolve() rewrites it on a 300ms debounce after EVERY mutation,
// including the empty string on a clean solve -- so a naive setStatus() notice is wiped just after
// it appears. These checks pin the split down.
const bar = byId.lpn_status;
L.setStatus('');
ok('empty status with no notice blanks the bar', bar.textContent === '');

L.setNotice('Deleted A. Now showing B.');
ok('setNotice shows immediately', bar.textContent === 'Deleted A. Now showing B.');
L.setStatus('');                       // <- this is what runSolve() does on a clean solve
ok('a CLEAN SOLVE does not wipe the notice', bar.textContent === 'Deleted A. Now showing B.',
   JSON.stringify(bar.textContent));
L.setStatus('');
ok('...and still does not on a second clean solve', bar.textContent === 'Deleted A. Now showing B.');

L.setStatus('Add a reservoir.');       // <- a real diagnostic
ok('a real diagnostic outranks the notice while it is live', bar.textContent === 'Add a reservoir.');
L.setStatus('');
// Fixed 2026-08-09 (ROADMAP Task 225 punch list §4, Tom 2026-08-06): a diagnostic used to DISCARD
// the notice outright -- "nodes have no path to a reservoir" ate "Closed X. Now showing Y." for
// good, the instant the freshly-opened project's own solve produced a diagnostic. The notice must
// only be OUTRANKED while the diagnostic is live, and resurface once it clears.
ok('...and the notice resurfaces once the diagnostic clears', bar.textContent === 'Deleted A. Now showing B.',
   JSON.stringify(bar.textContent));

L.setNotice('');
ok('setNotice("") clears the bar', bar.textContent === '');

// --- 13. deleting the OPEN project narrates where you landed ------------
// Tom, 2026-07-31: no warning beforehand; say afterwards where you landed.
L.buildLayers();
function seedLibrary(projects, openId) {
  L.setLibrary({ projects: projects, openId: openId });
  projects.forEach(p => localStorage.setItem('lpn_project_' + p.id,
    JSON.stringify({ v: 2, project: { name: p.name, activeScenario: 'base' },
      scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
      nodes: [], links: [], labels: [], nextId: { J: 1, R: 1, L: 1, P: 1, T: 1 },
      labelSettings: {}, backdrop: null, settings: {} })));
}

seedLibrary([{ id: 'p1', name: 'Fire flow test', updated: 10 },
             { id: 'p2', name: 'Water main study', updated: 20 }], 'p1');
L.discardProject('p1');
ok('deleting the open project opens a survivor', L.getLibrary().openId === 'p2');
ok('...and names BOTH projects in the status bar',
   bar.textContent.indexOf('Fire flow test') >= 0 && bar.textContent.indexOf('Water main study') >= 0,
   JSON.stringify(bar.textContent));
ok('...with the placeholders substituted',
   bar.textContent.indexOf('{deleted}') < 0 && bar.textContent.indexOf('{opened}') < 0,
   JSON.stringify(bar.textContent));

// TAB-STRIP POSITION wins, not recency -- fixed 2026-08-09 (ROADMAP Task 225 punch list §4): every
// tab strip in the world lands on the neighbor that slides into the closed tab's spot (next
// rightward), not on whatever was touched last. 'q3' is the most-recently-updated of the three but
// sits to the LEFT of the closed tab in library order, so it must NOT be the one landed on.
seedLibrary([{ id: 'q1', name: 'Open one', updated: 5 },
             { id: 'q2', name: 'Older', updated: 1 },
             { id: 'q3', name: 'Newer', updated: 99 }], 'q2');
L.discardProject('q2');
ok('the tab to the RIGHT is the one opened, not the most recently updated', L.getLibrary().openId === 'q3',
   L.getLibrary().openId);
ok('...and it is the one named', bar.textContent.indexOf('Newer') >= 0,
   JSON.stringify(bar.textContent));

// closing the RIGHTMOST tab lands on its new rightmost neighbor (the one to its left)
seedLibrary([{ id: 'v1', name: 'Left', updated: 1 },
             { id: 'v2', name: 'Right', updated: 99 }], 'v2');
L.discardProject('v2');
ok('closing the rightmost tab lands on its left neighbor', L.getLibrary().openId === 'v1',
   L.getLibrary().openId);

// last project standing -> a fresh empty one, different message, no dangling placeholder
seedLibrary([{ id: 'r1', name: 'Only project', updated: 1 }], 'r1');
L.discardProject('r1');
ok('deleting the last project leaves something open', !!L.getLibrary().openId);
ok('...and says a new empty project was started',
   bar.textContent.indexOf('Only project') >= 0 && bar.textContent.indexOf('{') < 0,
   JSON.stringify(bar.textContent));

// deleting a NON-open project must not narrate or navigate
seedLibrary([{ id: 's1', name: 'Keep me open', updated: 9 },
             { id: 's2', name: 'Throwaway', updated: 1 }], 's1');
L.setNotice('');
L.discardProject('s2');
ok('deleting a non-open project does not switch projects', L.getLibrary().openId === 's1');
ok('...and posts no notice', bar.textContent === '', JSON.stringify(bar.textContent));

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall green');
process.exit(fails ? 1 : 0);
