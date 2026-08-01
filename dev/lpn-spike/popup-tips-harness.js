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
    tagName: (tag || 'div').toUpperCase(), _tag: tag, children: [], style: {}, dataset: {},
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
[
  'lpn_canvas', 'lpn_popup', 'lpn_popup_fields', 'lpn_popup_title', 'lpn_popup_close',
  'lpn_settings_popup', 'lpn_settings_fields', 'lpn_settings_popup_close',
  'lpn_labels_popup', 'lpn_labels_popup_close', 'lpn_labels_node', 'lpn_labels_link',
  'lpn_projects_popup', 'lpn_projects_popup_close', 'lpn_projects_list',
  'lpn_toolbar', 'lpn_status', 'lpn_mode_hint', 'lpn_empty_hint', 'lpn_legend'
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
  unitFactorFor: () => 1
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
eval(fs.readFileSync(ROOT + 'js/lpn-solver.js', 'utf8'));

// lpn-solver.js declares `var EngCalcs`, which in CommonJS module scope SHADOWS global.EngCalcs.
// Re-attach the config and the tip stub to whatever object the evaluated code actually sees.
EngCalcs.pageConfig = global.EngCalcs.pageConfig;
EngCalcs.initTips = global.EngCalcs.initTips;

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
  "\t\trebuildSettingsFields: rebuildSettingsFields, resetTip: resetTip,\n" +
  "\t\tsetDoc: function (d, s2) { doc = d; if (s2) { scenarios = s2; } },\n" +
  "\t\tgetDoc: function () { return doc; } };\n" + marker);
eval(src);

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

// --- 10. the three reset controls share one tip -------------------------
// Tom, 2026-07-31: Clear project / Restore all settings / Delete all projects each undo a
// different scope, and none alone returns the page to a first-time-visitor state. The shared tip
// is what makes that legible, so a missing one on any of the three is a real defect.
const rb = mkEl('button');
L.resetTip(rb);
ok('resetTip sets the shared tip', rb.title === PC.lpn_reset_all_tip);
ok('resetTip marks the button .ec-help (touch reachability)',
   String(rb.className).split(/\s+/).includes('ec-help'));
const withClass = mkEl('button'); withClass.className = 'lpn-x';
L.resetTip(withClass);
ok('resetTip APPENDS ec-help rather than clobbering an existing class',
   withClass.className === 'lpn-x ec-help', withClass.className);

const sf = byId.lpn_settings_fields;
L.rebuildSettingsFields();
function buttonsIn(root) {
  const out = [];
  (function walk(n) { (n.children || []).forEach(c => { if (c.tagName === 'BUTTON') out.push(c); walk(c); }); })(root);
  return out;
}
const resetBtns = buttonsIn(sf).filter(b =>
  b.textContent === PC.lpn_settings_restore_btn || b.textContent === PC.lpn_settings_wipe_btn);
ok('both Settings reset buttons are present', resetBtns.length === 2,
   buttonsIn(sf).map(b => b.textContent).join(' | '));
ok('both carry the shared reset tip', resetBtns.every(b => b.title === PC.lpn_reset_all_tip),
   JSON.stringify(resetBtns.map(b => [b.textContent, b.title === PC.lpn_reset_all_tip])));

// The tip must not quote the other buttons' labels -- that is the cross-key dependency this same
// pass removed from lpn_empty_hint, and it would be hypocritical to reintroduce here.
const quoted = [PC.lpn_tool_clear, PC.lpn_settings_restore_btn, PC.lpn_settings_wipe_btn]
  .filter(lbl => PC.lpn_reset_all_tip.indexOf(lbl) >= 0);
ok('shared tip quotes no other key\'s value', quoted.length === 0, quoted.join(' / '));

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall green');
process.exit(fails ? 1 : 0);
