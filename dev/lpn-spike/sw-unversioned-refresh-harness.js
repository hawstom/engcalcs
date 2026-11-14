// A CHANGED ICON REACHES A RETURNING VISITOR (Task 620). Run with:
//   node dev/lpn-spike/sw-unversioned-refresh-harness.js
//
// Defect: the worker precaches icons/*.{svg,png,ico} by URLs with no ?v= (the <link rel="icon"> and
// the manifest cannot carry one), and cacheFirst() serves them for ever. The worker's own bytes did
// not move when an icon did, so the browser never re-ran `install`, and a changed icon never reached
// a returning visitor. The same holds for the runtime-cached EPANET engine (imported with no query).
// Fix: sw.php writes a digest of those files' CONTENT into the worker, so a changed icon changes the
// worker, `install` re-runs, and its cache:'reload' fetches overwrite the entries.
//
// No browser. The real sw.php is run by PHP over a temporary copy of the suite's icons and vendor
// files; the generated worker is then executed in a node vm against a model of Cache Storage and of
// the HTTP cache (a default-mode fetch is answered from the HTTP cache once it holds the URL, which is
// the "would addAll be served stale?" question). A browser installs a worker only when its bytes
// differ from the installed one, and the model does the same.
// EC_SW_REPO=<dir holding sw.php and lib/ServiceWorker.lib.php> runs the harness against another copy
// of them (used to prove it fails on master); the icons and vendor files still come from this checkout.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const SRC = process.env.EC_SW_REPO || REPO;
const ORIGIN = 'https://example.test';
let fails = 0;
function ok(what, cond, detail) {
	if (!cond) fails++;
	console.log((cond ? '  ok   ' : '  FAIL ') + what + (detail !== undefined ? '   ' + detail : ''));
}

// ---- the temporary suite ----------------------------------------------------------------------
const T = fs.mkdtempSync(path.join(os.tmpdir(), 'engcalcs-sw-unversioned-'));
process.on('exit', () => { try { fs.rmSync(T, { recursive: true, force: true }); } catch (e) { /* best effort */ } });
function put(rel, data) {
	const f = path.join(T, rel);
	fs.mkdirSync(path.dirname(f), { recursive: true });
	fs.writeFileSync(f, data);
}
put('sw.php', fs.readFileSync(path.join(SRC, 'sw.php')));
put('lib/ServiceWorker.lib.php', fs.readFileSync(path.join(SRC, 'lib', 'ServiceWorker.lib.php')));
for (const f of fs.readdirSync(path.join(REPO, 'icons'))) {
	if (/\.(svg|png|ico)$/.test(f)) put('icons/' + f, fs.readFileSync(path.join(REPO, 'icons', f)));
}
fs.cpSync(path.join(REPO, 'js', 'vendor'), path.join(T, 'js', 'vendor'), { recursive: true });
put('css/a.css', 'a{}');
put('js/a.js', 'var a;');
put('index.php', '<?php');

function generate() {
	return execFileSync('php', [path.join(T, 'sw.php')], { encoding: 'utf8', maxBuffer: 1 << 26 });
}
function touchLater(rel) {   // mtime moves, bytes do not
	const t = new Date(Date.now() + 5000);
	fs.utimesSync(path.join(T, rel), t, t);
}
function mutate(rel) {
	fs.appendFileSync(path.join(T, rel), rel.endsWith('.svg') || rel.endsWith('.js') ? '\n<!-- changed -->\n' : Buffer.from([0]));
}

// ---- a model of Cache Storage, the HTTP cache and the server ---------------------------------
const store = {
	caches: new Map(),     // cache name -> Map(url -> body)
	http: new Map(),       // url -> body, what the HTTP cache holds
	fetches: []            // {url, cache}
};
function serverBody(url) {
	const p = new URL(url).pathname.replace(/^\/engcalcs\//, '');
	const f = path.join(T, p);
	return fs.existsSync(f) && fs.statSync(f).isFile() ? fs.readFileSync(f).toString('latin1') : 'page ' + p;
}
function abs(u) { return new URL(typeof u === 'string' ? u : u.url, ORIGIN).href; }
class FakeRequest {
	constructor(url, init) {
		init = init || {};
		this.url = abs(url);
		this.cache = init.cache || 'default';
		this.method = 'GET';
		this.headers = init.headers || {};
	}
}
async function fakeFetch(req) {
	const r = req instanceof FakeRequest ? req : new FakeRequest(req);
	store.fetches.push({ url: r.url, cache: r.cache });
	let body;
	// 'default' is answered from the HTTP cache when it has the URL; 'reload' and 'no-cache' reach
	// the server (no-cache revalidates, which for a changed file returns the new body).
	if (r.cache === 'default' && store.http.has(r.url)) body = store.http.get(r.url);
	else { body = serverBody(r.url); store.http.set(r.url, body); }
	return { ok: true, status: 200, body, clone() { return this; } };
}
function openCache(name) {
	if (!store.caches.has(name)) store.caches.set(name, new Map());
	const m = store.caches.get(name);
	return {
		async match(r) { return m.has(abs(r)) ? { body: m.get(abs(r)) } : undefined; },
		async put(r, resp) { m.set(abs(r), resp.body); },
		async add(r) { const resp = await fakeFetch(r); m.set(abs(r), resp.body); },
		async keys() { return [...m.keys()].map(u => ({ url: u })); },
		async delete(r) { return m.delete(abs(r)); }
	};
}
function runWorker(source) {
	const handlers = {};
	const self = {
		location: new URL(ORIGIN + '/engcalcs/sw.php'),
		addEventListener(type, fn) { handlers[type] = fn; },
		skipWaiting() { return Promise.resolve(); },
		clients: { claim() { return Promise.resolve(); } }
	};
	const sandbox = {
		self, URL, Promise, Set, Map, console,
		Request: FakeRequest, fetch: fakeFetch,
		caches: {
			open: async n => openCache(n),
			match: async r => { for (const m of store.caches.values()) if (m.has(abs(r))) return { body: m.get(abs(r)) }; },
			keys: async () => [...store.caches.keys()],
			delete: async n => store.caches.delete(n)
		}
	};
	vm.runInNewContext(source, sandbox);
	return handlers;
}
async function install(source) {
	let waited;
	runWorker(source).install({ waitUntil(p) { waited = p; } });
	await waited;
}
function cached(url) {
	const m = store.caches.get('engcalcs-assets');
	return m ? m.get(abs(url)) : undefined;
}
function iconUrl(name) { return '/engcalcs/icons/' + name; }
function disk(rel) { return fs.readFileSync(path.join(T, rel)).toString('latin1'); }

async function main() {
	// A browser installs a worker only when its bytes differ from the installed one.
	let installed = null;
	async function visit() {
		const src = generate();
		const reinstalled = src !== installed;
		if (reinstalled) { await install(src); installed = src; }
		return { src, reinstalled };
	}

	console.log('1. First visit installs and precaches every icon');
	const v1 = await visit();
	ok('installed', v1.reinstalled);
	const icons = fs.readdirSync(path.join(T, 'icons')).filter(f => /\.(svg|png|ico)$/.test(f));
	ok('every icon is precached with its current bytes',
		icons.every(f => cached(iconUrl(f)) === disk('icons/' + f)), icons.length + ' icons');
	ok('every icon fetch bypasses the HTTP cache (cache: reload)',
		icons.every(f => store.fetches.some(x => x.url.endsWith(iconUrl(f)) && x.cache === 'reload')));

	console.log('2. Nothing changed: no reinstall, even if every mtime moved');
	for (const f of icons) touchLater('icons/' + f);
	touchLater('js/vendor/epanet-js.js');
	const v2 = await visit();
	ok('worker bytes are identical after an mtime-only change', !v2.reinstalled);

	console.log('3. An icon changes: the returning visitor gets it');
	mutate('icons/icon.svg');
	ok('the HTTP cache still holds the old icon (the stale-addAll trap is real)',
		store.http.get(abs(iconUrl('icon.svg'))) !== disk('icons/icon.svg'));
	const v3 = await visit();
	ok('the worker reinstalls', v3.reinstalled);
	ok('the cached icon is the new one', cached(iconUrl('icon.svg')) === disk('icons/icon.svg'));
	ok('an icon that did not change is unchanged', cached(iconUrl('icon-192.png')) === disk('icons/icon-192.png'));

	console.log('4. The runtime-cached engine: refreshed only for a visitor who has it');
	const engine = '/engcalcs/js/vendor/epanet-js.js';
	const slim = '/engcalcs/js/vendor/slim/index.js';
	ok('a visitor who never ran EPANET has no engine cached', cached(engine) === undefined);
	// This visitor ran EPANET once: cacheFirst() put the engine in the cache.
	store.caches.get('engcalcs-assets').set(abs(engine), disk('js/vendor/epanet-js.js'));
	store.http.set(abs(engine), disk('js/vendor/epanet-js.js'));
	mutate('js/vendor/epanet-js.js');
	const v4 = await visit();
	ok('the worker reinstalls when the engine changes', v4.reinstalled);
	ok('the cached engine is the new one', cached(engine) === disk('js/vendor/epanet-js.js'));
	ok('the engine is revalidated, not blindly re-downloaded (cache: no-cache)',
		store.fetches.some(x => x.url.endsWith(engine) && x.cache === 'no-cache'));
	ok('slim/index.js, not cached for this visitor, is still not cached', cached(slim) === undefined);

	console.log('5. Every URL the worker keeps without a ?v= is covered by the digest');
	const m = /const STATIC_ASSETS = (\[[\s\S]*?\]);/.exec(installed);
	const r = /const RUNTIME_UNVERSIONED = (\[[\s\S]*?\]);/.exec(installed);
	const bare = JSON.parse(m[1]).filter(u => u.indexOf('?v=') < 0).concat(r ? JSON.parse(r[1]) : []);
	ok('there are unversioned URLs to test', bare.length >= 5, bare.length + ' of them');
	for (const u of bare) {
		const rel = u.replace(/^\/engcalcs\//, '');
		if (!fs.existsSync(path.join(T, rel))) { ok(rel + ' exists', false); continue; }
		const before = generate();
		mutate(rel);
		const after = generate();
		ok(rel + ': a change to it changes the worker', before !== after);
	}
	const syntax = path.join(T, 'worker.js');
	fs.writeFileSync(syntax, generate());
	try { execFileSync('node', ['--check', syntax]); ok('the generated worker parses', true); }
	catch (e) { ok('the generated worker parses', false, String(e.stderr || e)); }

	console.log(fails ? '\nFAILED: ' + fails : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
