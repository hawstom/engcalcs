// Harness for EngCalcs.maybeLogTitleEvent() in js/Calculators.lib.js -- run with:
//   node dev/lpn-spike/title-beacon-harness.js
//
// This tests SUITE-WIDE code, not lpn_. It lives in dev/lpn-spike/ only because that is where this
// repo's JS harnesses currently live -- same note as suite-tips-trigger-harness.js.
//
// What it guards (ROADMAP Task 215): the "somebody named this calculation" beacon, which is the
// closest instrument the suite has to its own reason for existing. Four properties matter, and
// three of them are the kind that fail silently -- the log just stays emptier or fuller than the
// truth, and nobody can tell by looking:
//
//   1. A value restored from a cookie or a shared URL is NOT a person naming something. Programmatic
//      assignment fires no 'change' event, which is exactly why the listener uses 'change' and not
//      'input'. Get this wrong and every returning visitor inflates the count.
//   2. Blurring an empty field is not naming anything either.
//   3. Editing the same field repeatedly is one person naming one thing.
//   4. The typed text is NEVER transmitted. What the calculation is called is the user's business;
//      that they named one is ours. A regression here is a privacy defect, not a metrics defect.
//
// Both transports are exercised. Browsers take the fetch() path; the navigator.sendBeacon() path is
// the fallback for browsers without fetch, and a beacon that only works on one of them is a beacon
// that quietly under-reports on the other.
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '..', '..', 'js', 'Calculators.lib.js');

let fails = 0;
function ok(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra === undefined ? '' : '  ' + extra));
  if (!cond) fails++;
}

// ---- stubs -------------------------------------------------------------
function mkInput(id) {
  return {
    id: id,
    value: '',
    _h: {},
    addEventListener: function (t, f) { (this._h[t] = this._h[t] || []).push(f); },
    // Dispatch the way a browser would: only because a USER did something.
    fire: function (t) { (this._h[t] || []).forEach(function (f) { f.call(this, { type: t }); }, this); }
  };
}

// Loads a fresh copy of the library with the given transport available, and returns the handles a
// test needs. Fresh per run because the beacon dedupes in module state.
function load(transport) {
  const posts = [];
  const els = {
    printable_title: mkInput('printable_title'),
    printable_subtitle: mkInput('printable_subtitle')
  };
  const docHandlers = {};

  global.document = {
    documentElement: { lang: 'es' },
    getElementById: function (id) { return els[id] || null; },
    querySelectorAll: function () { return []; },
    addEventListener: function (t, f) { (docHandlers[t] = docHandlers[t] || []).push(f); },
    forms: {}
  };
  global.window = {
    addEventListener: function () {},
    location: { href: 'x', search: '' },
    history: { replaceState: function () {} },
    // null, not undefined: the library branches on !window.fetch.
    fetch: null
  };
  global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
  global.URLSearchParams = require('url').URLSearchParams;

  // Node 21+ ships a READ-ONLY built-in `navigator`, so `global.navigator = {...}` is silently
  // ignored and every beacon disappears into a stub that was never installed -- which reads exactly
  // like the feature being broken. Cost an hour on 2026-08-08; defineProperty is required.
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      sendBeacon: function (url, body) {
        if (transport === 'sendBeacon') { posts.push({ url: url, body: String(body) }); return true; }
        return false;
      }
    },
    configurable: true, writable: true
  });

  if (transport === 'fetch') {
    const spy = function (url, opts) {
      posts.push({ url: url, body: String((opts || {}).body || '') });
      return Promise.resolve({ ok: true });
    };
    global.window.fetch = spy;
    global.fetch = spy;
  }

  // runInThisContext, not new Function(): the library declares EngCalcs with `var` at top level, so
  // a function wrapper would keep it local and nothing here could reach it.
  require('vm').runInThisContext(fs.readFileSync(SRC, 'utf8'));
  (docHandlers['DOMContentLoaded'] || []).forEach(function (f) { f(); });
  globalThis.EngCalcs.cookieName = 'Manning-Pipe-Flow';

  return {
    els: els,
    titlePosts: function () {
      return posts.filter(function (p) { return p.url.indexOf('log-title-event.php') !== -1; });
    }
  };
}

// ---- the run -----------------------------------------------------------
['fetch', 'sendBeacon'].forEach(function (transport) {
  console.log('\n--- transport: ' + transport + ' ---');
  const t = load(transport);
  const title = t.els.printable_title;
  const subtitle = t.els.printable_subtitle;

  title.value = 'Restored from a cookie';
  ok('a programmatically restored title logs nothing', t.titlePosts().length === 0);

  title.value = '   ';
  title.fire('change');
  ok('blurring an empty/whitespace title logs nothing', t.titlePosts().length === 0);

  title.value = 'North Main sizing';
  title.fire('change');
  ok('a typed title logs exactly one event', t.titlePosts().length === 1);

  const body = t.titlePosts()[0] ? t.titlePosts()[0].body : '';
  ok('  it says which field', /field=title/.test(body), body);
  ok('  it says which page', /page=Manning-Pipe-Flow/.test(body));
  ok('  it says which served language', /lang=es/.test(body));
  ok('  it does NOT carry the typed text', !/North|Main|sizing/i.test(body));

  title.value = 'North Main sizing rev B';
  title.fire('change');
  ok('re-editing the same title does not log twice', t.titlePosts().length === 1);

  subtitle.value = 'For the Tuesday submittal';
  subtitle.fire('change');
  ok('the subtitle is its own event', t.titlePosts().length === 2);
  ok('  tagged field=subtitle', /field=subtitle/.test(t.titlePosts()[1].body));
});


// ---- the map page's own naming call sites (2026-09-08) -----------------
//
// Looped-Network has no title field, so the two gestures that mean the same thing are SAVING a
// project to a file and RENAMING a tab. Read out of the source rather than driven, because the save
// path is three awaits deep in the File System Access API and a stub of it would be testing the
// stub. What can silently rot is the WIRING, and that is what these read:
//
//   - the beacon is on the one routine all three save routes pass through, so Save, Save as and
//     Save all each count once rather than Save alone counting;
//   - a project opened from the examples gallery is excluded, or the wall inflates the count with
//     saves nobody named anything for;
//   - both calls are GUARDED. The save one runs inside the try whose catch reports a file error to
//     the user, so an absent instrument would turn a written file into a reported failure -- the
//     beacon breaking the thing it measures.
console.log('\n--- Looped-Network naming call sites ---');
{
  const LPN = fs.readFileSync(path.resolve(__dirname, '..', '..', 'js', 'looped-network.js'), 'utf8');
  const save = LPN.slice(LPN.indexOf('async function writeOpenProjectToFile'));
  const saveBody = save.slice(0, save.indexOf('\n\tfunction ', 10));
  ok('a successful file write logs a naming event',
    /EngCalcs\.logNamingEvent\('save'\)/.test(saveBody));
  ok('  gated on the project not having come from the gallery',
    /!project\.gallery[\s\S]{0,80}?EngCalcs\.logNamingEvent\('save'\)/.test(saveBody));
  ok('  and guarded, so a missing instrument cannot fail the save',
    /&& EngCalcs\.logNamingEvent\)[\s\S]{0,40}?logNamingEvent\('save'\)/.test(saveBody));
  ok('  it is on the shared write routine, not on one save command',
    saveBody.indexOf("logNamingEvent('save')") > 0 &&
    !/function saveCurrent[\s\S]*logNamingEvent\('save'\)/.test(LPN));
  ok('renaming a tab logs its own event',
    /renameProject\(id, v\.trim\(\)\);[\s\S]{0,400}?logNamingEvent\('rename'\)/.test(LPN));
  ok('  guarded the same way',
    /if \(EngCalcs\.logNamingEvent\) \{ EngCalcs\.logNamingEvent\('rename'\); \}/.test(LPN));
  ok('opening an example records which file it was',
    /project\.gallery = ex\.file;/.test(LPN));
  const ex = LPN.slice(LPN.indexOf('function openExample'));
  ok('  before the saved baseline is stamped, or the new tab wears an asterisk',
    ex.indexOf('project.gallery = ex.file;') < ex.indexOf('stampProjectSaved(id)'));
  // The server answers 400 to a field outside its closed set, so a typo here is a silent zero.
  const CFG = fs.readFileSync(path.resolve(__dirname, '..', '..', 'lib', 'config.inc.php'), 'utf8');
  const bits = CFG.slice(CFG.indexOf('function ecNamingFieldBit'));
  ['save', 'rename'].forEach(function (f) {
    ok("  '" + f + "' is a field the server accepts",
      new RegExp("'" + f + "'\\s*=>").test(bits.slice(0, bits.indexOf('}'))));
  });
}

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
