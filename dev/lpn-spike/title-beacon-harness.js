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

console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
process.exit(fails ? 1 : 0);
