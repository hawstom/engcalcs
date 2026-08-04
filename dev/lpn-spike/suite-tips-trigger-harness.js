// Harness for EngCalcs.initTips() in js/Calculators.lib.js -- run with:
//   node dev/lpn-spike/suite-tips-trigger-harness.js
//
// This tests SUITE-WIDE code, not lpn_. It lives in dev/lpn-spike/ only because that is where this
// repo's JS harnesses currently live; a neutral home would be better once there is more than two.
//
// What it guards: the tooltip "stuck visible" defect, reported by Tom twice (2026-07-30 on
// controls, 2026-08-03 on mtc_n). Bootstrap will not hide a tooltip while ANY of its triggers is
// still active, so an element wired with both a hover trigger and a click trigger stays pinned open
// after the pointer leaves. The invariant is therefore blunt and easy to check:
//
//     NO ELEMENT MAY EVER BE WIRED WITH BOTH A HOVER TRIGGER AND A CLICK TRIGGER.
//
// The first fix only covered controls, which is why a plain label regressed. This asserts the rule
// for every combination of (is a control, device can hover) rather than for the case that happened
// to be reported.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..') + path.sep;

let fails = 0;
function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '  ' + extra));
  if (!cond) fails++;
}

// ---- stubs -------------------------------------------------------------
function mkEl(opts) {
  opts = opts || {};
  return {
    className: opts.className || '', title: opts.title || 'a tip', dataset: {},
    style: {}, _listeners: {},
    closest(sel) { return opts.insideControl ? { sel: sel } : null; },
    addEventListener(t, f) { (this._listeners[t] = this._listeners[t] || []).push(f); },
    matches() { return true; }
  };
}

let wired = [];
global.window = { matchMedia: null, addEventListener() {}, removeEventListener() {}, location: { search: '', href: 'http://x/' }, navigator: { userAgent: 'node' } };
global.document = {
  addEventListener() {},
  querySelectorAll() { return []; },
  createElement: () => mkEl(),
  body: mkEl(), documentElement: mkEl()
};
global.bootstrap = {
  Tooltip: {
    getOrCreateInstance(el, cfg) {
      wired.push({ el: el, trigger: cfg.trigger });
      return { hide() { el._hidden = (el._hidden || 0) + 1; }, dispose() {} };
    }
  }
};

// ---- load the real file ------------------------------------------------
eval(fs.readFileSync(ROOT + 'js/Calculators.lib.js', 'utf8'));

// ---- drive it ----------------------------------------------------------
function run(elements, canHover) {
  wired = [];
  global.window.matchMedia = function (q) { return { matches: canHover && /hover:\s*hover/.test(q) }; };
  const root = { querySelectorAll: () => elements };
  EngCalcs.initTips(root);
  return wired;
}

const HOVERISH = /hover|focus/;
const CLICKISH = /\bclick\b/;

[true, false].forEach(function (canHover) {
  [true, false].forEach(function (insideControl) {
    const label = (insideControl ? 'control' : 'plain label') + ', canHover=' + canHover;
    const el = mkEl({ insideControl: insideControl, className: 'ec-help' });
    const w = run([el], canHover)[0];
    ok('THE RULE — never both hover and click: ' + label,
       !(HOVERISH.test(w.trigger) && CLICKISH.test(w.trigger)), 'trigger="' + w.trigger + '"');
    ok('  ...tip is reachable at all: ' + label,
       w.trigger && w.trigger.length > 0, 'trigger="' + w.trigger + '"');
  });
});

// The specific regression: a PLAIN LABEL on a mouse device used to get 'hover focus click'.
// mtc_n reaches this branch -- its .ec-help sits beside the <a>, not inside it.
const plainOnMouse = run([mkEl({ insideControl: false, className: 'ec-help' })], true)[0];
ok('mtc_n case (plain label, mouse) is hover-only, not hover+click',
   plainOnMouse.trigger === 'hover focus', 'trigger="' + plainOnMouse.trigger + '"');

// A plain label on touch must still be openable -- click is the only gesture it has.
const plainOnTouch = run([mkEl({ insideControl: false, className: 'ec-help' })], false)[0];
ok('plain label on touch stays tap-openable', plainOnTouch.trigger === 'click',
   'trigger="' + plainOnTouch.trigger + '"');

// A control never gets click as an OPENING trigger, on any device -- a tap must perform the
// button's own action, not raise a tip over the panel it just opened.
[true, false].forEach(function (canHover) {
  const c = run([mkEl({ insideControl: true, className: 'ec-help' })], canHover)[0];
  ok('control never opens on click (canHover=' + canHover + ')', !CLICKISH.test(c.trigger),
     'trigger="' + c.trigger + '"');
});

// ...but a control DOES still get the explicit hide-on-click stabilizer, which is what breaks the
// hover-then-click cycle for the keyboard/focus path.
const ctl = mkEl({ insideControl: true, className: 'ec-help' });
run([ctl], true);
ok('control gets the hide-on-click stabilizer', !!(ctl._listeners.click || []).length);
ok('...wired only once across repeated initTips calls',
   (run([ctl], true), (ctl._listeners.click || []).length === 1),
   'listeners=' + (ctl._listeners.click || []).length);

const plain = mkEl({ insideControl: false, className: 'ec-help' });
run([plain], false);
ok('plain label gets NO hide-on-click (it would cancel its own opening tap)',
   !(plain._listeners.click || []).length);

// No matchMedia at all (very old browser) must degrade to hover, never crash.
global.window.matchMedia = null;
wired = [];
EngCalcs.initTips({ querySelectorAll: () => [mkEl({ insideControl: false })] });
ok('no matchMedia degrades to hover without throwing', wired[0].trigger === 'hover focus',
   'trigger="' + wired[0].trigger + '"');

console.log(fails ? '\n' + fails + ' FAILURES' : '\nall green');
process.exit(fails ? 1 : 0);
