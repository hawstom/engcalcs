// WHERE A PROJECT SWITCH SPENDS ITS TIME NOW (ROADMAP Task 681), in a real Chromium, and proof that
// a cut to it draws the same labels. Run with:
//   node dev/lpn-spike/switch-cost-browser-harness.js            sameness only (what check_all runs)
//   SWITCH_MEASURE=1 node dev/lpn-spike/switch-cost-browser-harness.js   measure first, then sameness
//   SWITCH_MEASURE=1 SWITCH_BEFORE=1 ...  also measures the reference page (the cut undone): before/after
//   SWITCH_ROUNDS=9 ...   arrivals per median (5 by default)
//   SWITCH_PAIR=ref,ref ...  compares a page with itself, the noise floor of the comparison
//
// **WHAT IT MEASURES.** Three tabs: Net1 (the tab you leave), Net3 on the world map near Novato and
// the 600-junction generated "plain downtown" network, both with EVERY node and link label field on
// -- Tom's case, 2026-09-16: 4.6 s on his machine, about 1.9 s of it the label pass. The page's own
// `?debug=perf` line is read for every arrival and split into its rows; the table is the median of
// SWITCH_ROUNDS arrivals (5 by default).
//
//   cold  the drawing is NOT kept (the Task 680 keep switched off through a harness hook), which is
//         what a tab that was edited, evicted or never yet visited costs: buildDom() and one label
//         pass. This is the switch the task is about.
//   warm  the shipped keep, switching back to a tab nobody touched.
//
// **WHAT IT FOUND, 2026-10-15** (median of 5, Chromium on jasmine): a cold arrival ran the label pass
// TWICE -- once in the switch, at the view it arrives at, and again 120 ms later in the zoom settle
// the view change had queued, at the same scale, for the identical picture. Net3 geographic 186 ms
// switch + 128 ms settle; downtown n600 1,830 + 1,393. With the settle banking what is on screen
// (labelCacheSettle()): 178 + 1.5 and 1,734 + 2.6.
//
// Then the crossing shed (cl:crossShed), 488 ms of the n600 switch: it counted every crossing in the
// drawing afresh on each of its rounds, and asked again each round which labels cover which, for
// answers that only ever lose the pairs of the label just hidden. Counted once, 488 -> 29 ms; the
// switch 1,773 -> 1,338. The node shed's re-fits (cl:nodeShed, ns:refit 248 ms) were tried the same
// way and kept: reusing unchanged verdicts saved about a tenth (see shedNodeLabelsForCrowding()).
//
// **WHAT MUST NOT CHANGE: A SINGLE LABEL.** For each network the label layers are serialised after a
// cold arrival -- every element, text, rows, leaders, visibility -- and compared with the same arrival
// made through a REFERENCE copy of the page script in which the cut is undone (REF_REWRITES below,
// applied to the served file on its way to the browser; otherwise byte for byte the shipped one). The
// two must match exactly, at the arrival view and after wheel bursts in and out.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SWITCH_COST_BROWSER_LOCKED';
const NAME = 'switch-cost-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '600', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 600 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const ROUNDS = Number(process.env.SWITCH_ROUNDS || 5);
const MEASURE = process.env.SWITCH_MEASURE === '1';
const SAME = process.env.SWITCH_SAME !== '0';

// **THE CUT, UNDONE.** Each pair is [shipped text, reference text]; the reference run serves the page
// with every one swapped. Empty means there is no cut on this branch yet, and the sameness half then
// compares the shipped page with itself (which still proves the comparison is deterministic).
const REF_REWRITES = [
	// The settle after an arrival banks the layout the arrival's own pass left (labelCacheSettle()).
	// Without the stamp it never can, and the settle runs the whole pass again -- as shipped before.
	['contentPassAt = { gen: labelCacheGen, s: state.s };', 'contentPassAt = null;']
];
// **A CUT THAT REWRITES A WHOLE FUNCTION IS UNDONE WHOLE**: the reference serves the named function
// exactly as it stood at REF_BASE (the commit before the cut), spliced into the otherwise shipped
// file. Task 681: the crossing shed counted every crossing afresh each round; it now counts once
// and takes each victim's pairs away.
const REF_BASE = '2ece408d';
const REF_FUNCS = [
	{ file: 'js/lpn-collide.js', fn: 'shedCrossingSurvivors' }
];

// One top-level function of a file's text: from its `\tfunction NAME(` line to the first line that
// is a lone `\t}` after it. Both files indent their functions one tab inside their IIFE.
function functionText(src, fn) {
	const head = '\n\tfunction ' + fn + '(';
	const a = src.indexOf(head);
	if (a < 0 || src.indexOf(head, a + 1) >= 0) { return null; }
	const b = src.indexOf('\n\t}\n', a + 1);
	return b < 0 ? null : src.slice(a, b + 4);
}
// [shipped text, reference text] for every REF_FUNCS entry of one file, read from REF_BASE.
function funcRewrites(file) {
	const shipped = fs.readFileSync(path.join(REPO, file), 'utf8');
	const base = execFileSync('git', ['-C', REPO, 'show', REF_BASE + ':' + file], { encoding: 'utf8', maxBuffer: 1 << 26 });
	return REF_FUNCS.filter((f) => f.file === file).map((f) => {
		const from = functionText(shipped, f.fn), to = functionText(base, f.fn);
		if (!from || !to) { throw new Error('cannot find function ' + f.fn + ' in ' + file + (from ? ' at ' + REF_BASE : '')); }
		return [from, to];
	});
}
const REF_FILES = ['js/looped-network.js', 'js/lpn-collide.js'];
// What each served file is rewritten with: the shipped page gets nothing, the reference everything.
function refRewrites() {
	const out = {};
	REF_FILES.forEach((f) => { out[f] = funcRewrites(f); });
	out['js/looped-network.js'] = out['js/looped-network.js'].concat(REF_REWRITES);
	return out;
}
const NO_REWRITES = {};

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
// The harness's handles on the page: the Task 680 keep switch, the bank's pass counter and reason,
// and enough to tell when an arrival has finished (quiet()). SWITCH_DEBUG=1 prints bank() per view.
const HOOK = '\twindow.__lpnSwitch = { setKeep: function (v) { keepLayoutEnabled = v; },\n' +
	'\t\tpasses: function () { return labelCachePasses; }, bankMiss: function () { return labelCacheMiss; },\n' +
	'\t\tsolved: function () { return !!lastSolveResult; },\n' +
	'\t\tbank: function () { return { anchor: labelCache.anchor, keys: Object.keys(labelCache.entries), s: state.s, miss: labelCacheMiss, hits: labelCacheHits, passes: labelCachePasses }; },\n' +
	'\t\tdecisions: function () { var c = lastCrossingShed; return { nodeShedRungs: lastNodeShedRungs, crossShed: c && { hidden: c.hidden, residual: c.residual, rounds: c.rounds, before: c.before, after: c.after } }; },\n' +
	'\t\tbusy: function () { return !!(reshedTimer || labelRefreshPending); } };\n';

const NODE_FIELDS = ['id', 'desc', 'tag', 'demand', 'elev', 'initQuality', 'demandActual', 'level', 'head', 'pressure', 'quality'];
const LINK_FIELDS = ['id', 'desc', 'tag', 'length', 'diameter', 'roughness', 'km', 'initStatus', 'bulkCoeff', 'wallCoeff',
	'flow', 'velocity', 'headloss', 'gradient', 'friction', 'rate', 'quality', 'status'];
const AWAY = { key: 'swAway', file: 'dev/water-network-examples/Net1.lwn', all: false };
const TARGETS = [
	{ key: 'swNet3', file: 'dev/water-network-examples/Net3-Novato-CA-World.lwn', all: true, title: 'Net3 geographic' },
	{ key: 'swTown', file: 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', all: true, title: 'downtown n600' }
];

function projectText(t) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, t.file), 'utf8'));
	d.project = Object.assign({}, d.project, { name: t.key });
	if (t.all) {
		// The file's labeling threshold hides every label at these views (Novato's is 65000).
		d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
		d.labelSettings = d.labelSettings || {};
		d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = true; });
		d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = true; });
	}
	return JSON.stringify(d);
}

// Every element in the layers that hold label text, as drawn: hidden ones as hidden and nothing more.
function drawn(page) {
	return page.evaluate(() => {
		const out = [], layers = new Set();
		document.querySelectorAll('#lpn_canvas text').forEach((t) => layers.add(t.parentNode));
		layers.forEach((g) => Array.from(g.children).forEach((e) => {
			if (e.tagName === 'image') { return; }
			const cs = getComputedStyle(e);
			// An EMPTY style attribute is the trace of a hover the wheel's pointer passed over (set,
			// then cleared), which draws nothing; whether it is there depends on where the pointer
			// happened to rest, not on the layout.
			out.push((cs.display === 'none' || cs.visibility === 'hidden') ? '<' + e.tagName + ' hidden>'
				: e.outerHTML.replace(/ style=""/g, ''));
		}));
		return out;
	});
}

// "  nodes 12.3ms  links 4.0ms ..." -> { nodes: 12.3, links: 4.0, ... }, a repeated row summed.
function parseRows(line) {
	const out = {}, re = /([A-Za-z][A-Za-z:]*) (-?\d+(?:\.\d+)?)ms/g;
	let m;
	const body = line.replace(/^.*?\]\s+/, '').split('  |')[0];
	while ((m = re.exec(body))) { out[m[1]] = (out[m[1]] || 0) + Number(m[2]); }
	const lm = /label measurements (\d+)/.exec(line);
	if (lm) { out['(measurements)'] = Number(lm[1]); }
	return out;
}

async function openPage(Session, browser, rewrites) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	const st = { fetched: 0, rewritten: 0, hooked: 0, expected: 0 };
	await a.page.route(/\/js\/(looped-network|lpn-collide)\.js/, async (route) => {
		const file = 'js/' + /\/js\/([a-z-]+\.js)/.exec(route.request().url())[1];
		const list = rewrites[file] || [];
		st.fetched++;
		st.expected += list.length;
		const resp = await route.fetch();
		let body = await resp.text();
		list.forEach(([from, to]) => {
			const n = body.split(from).length - 1;
			body = body.split(from).join(to);
			st.rewritten += n;
		});
		if (body.indexOf(MARKER) >= 0) { st.hooked++; body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	const lines = [];
	a.page.on('console', (m) => { const t = m.text(); if (t.indexOf('[lpn perf]') === 0) { lines.push(t); } });
	await a.goto('Looped-Network.php?ec_nolog=1&debug=perf');
	await a.page.evaluate((docs) => {
		localStorage.clear();
		docs.forEach(([k, txt]) => localStorage.setItem('lpn_project_' + k, txt));
	}, [AWAY].concat(TARGETS).map((t) => [t.key, projectText(t)]));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	return { a, st, lines };
}

async function switchTo(a, name) {
	const r = await a.page.evaluate((nm) => {
		const t = Array.from(document.querySelectorAll('button.lpn-tab-name'))
			.find((e) => e.textContent.replace('*', '').trim() === nm);
		if (!t) { return 'no such tab'; }
		t.click();
		return 'clicked';
	}, name);
	if (r !== 'clicked') { throw new Error('switch to ' + name + ': ' + r); }
	await quiet(a);
}

// **UNTIL THE TAB HAS FINISHED ARRIVING**: no solve, settle or label refresh queued, a solve on screen,
// and the main thread answering promptly. Leaving earlier carries an unsolved document away, so the
// next arrival re-solves and every number this measures would be an arrival nobody makes.
async function quiet(a) {
	const t0 = Date.now();
	// Past the 300 ms solve debounce whatever happens, so a queued solve has started.
	await a.settle(700);
	for (;;) {
		const st = await a.page.evaluate(() => new Promise((res) => {
			const t = performance.now();
			setTimeout(() => res({ lag: performance.now() - t - 200, busy: window.__lpnSwitch.busy(), solved: window.__lpnSwitch.solved() }), 200);
		}));
		if (!st.busy && st.solved && st.lag < 50) { return; }
		if (Date.now() - t0 > 20000) { throw new Error('the page never went quiet: ' + JSON.stringify(st)); }
	}
}

// The two strings from a little before the first character where they part.
function around(x, y) {
	let i = 0;
	while (i < x.length && x[i] === y[i]) { i++; }
	const from = Math.max(0, i - 60);
	return '...' + x.slice(from, i + 100) + '  vs  ...' + y.slice(from, i + 100);
}

function median(xs) {
	const s = xs.slice().sort((p, q) => p - q);
	return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : NaN;
}

async function measure(Session, browser, label, rewrites) {
	const { a, lines } = await openPage(Session, browser, rewrites);
	const res = {};
	try {
		for (const mode of ['cold', 'warm']) {
			await a.page.evaluate((v) => window.__lpnSwitch.setKeep(v), mode === 'warm');
			// One untimed visit each, so a warm round has something kept and a cold one starts warm
			// in every other sense (JIT, measured-width bank, fonts).
			for (const t of TARGETS) { await switchTo(a, AWAY.key); await switchTo(a, t.key); }
			for (const t of TARGETS) { res[mode + ' ' + t.title] = []; }
			for (let r = 0; r < ROUNDS; r++) {
				for (const t of TARGETS) {
					await switchTo(a, AWAY.key);
					lines.length = 0;
					await switchTo(a, t.key);
					// The switch's own line, then whatever the arrival queued: the zoom settle the view
					// change scheduled, whose label pass the reader waits for just the same.
					const sw = lines.filter((l) => l.indexOf('SWITCH') > 0);
					if (sw.length !== 1) { continue; }
					const row = parseRows(sw[0]);
					let after = 0;
					lines.filter((l) => l.indexOf('labelSettle') > 0).forEach((l) => { after += parseRows(l).labelSettle || 0; });
					row['settle after'] = after;
					row['SWITCH + settle'] = row.SWITCH + after;
					res[mode + ' ' + t.title].push(row);
				}
			}
		}
		ok(label + ': no page errors', !a.errors.length, (a.errors[0] || '').slice(0, 200));
	} finally { await a.close(); }
	return res;
}

function table(res) {
	Object.keys(res).forEach((k) => {
		const runs = res[k];
		if (!runs.length) { console.log('  ' + k + ': NO PERF LINES'); return; }
		const names = [];
		runs.forEach((r) => Object.keys(r).forEach((n) => { if (names.indexOf(n) < 0) { names.push(n); } }));
		console.log('\n  ' + k + '  (median of ' + runs.length + ' arrivals, ms)');
		names.forEach((n) => {
			const m = median(runs.map((r) => r[n] || 0));
			if (n.indexOf('SWITCH') === 0 || n === '(measurements)' || n === 'settle after' || m >= 0.5) {
				console.log('    ' + (n + '                        ').slice(0, 24) + m.toFixed(1).padStart(8));
			}
		});
	});
}

// A cold arrival at each network, then three wheel notches in, three more, and three back out.
async function layouts(Session, browser, rewrites) {
	const { a, st } = await openPage(Session, browser, rewrites);
	const out = {};
	try {
		await a.page.evaluate(() => window.__lpnSwitch.setKeep(false));
		for (const t of TARGETS) {
			await switchTo(a, AWAY.key);
			const p0 = await a.page.evaluate(() => window.__lpnSwitch.passes());
			await switchTo(a, t.key);
			out[t.title + ' settle passes'] = (await a.page.evaluate(() => window.__lpnSwitch.passes())) - p0;
			out[t.title + ' settle miss'] = await a.page.evaluate(() => window.__lpnSwitch.bankMiss());
			const r = await a.page.evaluate(() => {
				const b = document.getElementById('lpn_canvas').getBoundingClientRect();
				return { x: b.left + b.width / 2 + 37, y: b.top + b.height / 2 - 23 };
			});
			out[t.title] = [await drawn(a.page)];
			out[t.title + ' decisions'] = [await a.page.evaluate(() => window.__lpnSwitch.decisions())];
			// **A BURST IS DISPATCHED IN ONE TASK, NOT WHEELED WITH GAPS.** Real wheel events 60 ms apart
			// sometimes straddle the 120 ms settle debounce, and a burst split into two settles visits
			// a bucket the other run never did -- which moved hit boxes by a few parts in 10^5 between
			// two runs of the UNCHANGED page. One task is one settle, every time.
			for (const n of [-3, -3, 3, 3]) {
				await a.page.evaluate(([x, y, n]) => {
					const svg = document.getElementById('lpn_canvas');
					for (let k = 0; k < Math.abs(n); k++) {
						svg.dispatchEvent(new WheelEvent('wheel', { clientX: x, clientY: y, deltaY: n < 0 ? -100 : 100,
							bubbles: true, cancelable: true }));
					}
				}, [r.x, r.y, n]);
				await quiet(a);
				if (process.env.SWITCH_DEBUG) { console.log('      ' + t.title + ' ' + JSON.stringify(await a.page.evaluate(() => window.__lpnSwitch.bank()))); }
				out[t.title].push(await drawn(a.page));
				out[t.title + ' decisions'].push(await a.page.evaluate(() => window.__lpnSwitch.decisions()));
			}
		}
		out.errors = a.errors.slice();
		out.st = st;
	} finally { await a.close(); }
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const src = fs.readFileSync(path.join(REPO, 'js', 'looped-network.js'), 'utf8');
		ok('the hook marker is in the page script', src.indexOf(MARKER) >= 0);
		REF_REWRITES.forEach(([from]) => ok('the cut the reference undoes is in the page script once', src.split(from).length === 2, from.slice(0, 80)));
		const REF = refRewrites();
		REF_FUNCS.forEach((f) => {
			const pair = REF[f.file].find((p) => p[0].indexOf('function ' + f.fn + '(') >= 0);
			ok(f.fn + '(): the reference serves it as it stood at ' + REF_BASE + ', and that differs from the shipped one',
				!!pair && pair[0] !== pair[1]);
		});
		if (MEASURE) {
			// SWITCH_BEFORE=1 measures the reference page too, which is the "before" of the cut.
			if (process.env.SWITCH_BEFORE === '1') {
				console.log('=== where a switch goes (reference page, the cut undone) ===');
				table(await measure(Session, browser, 'measure reference', REF));
			}
			console.log('\n=== where a switch goes (shipped page) ===');
			table(await measure(Session, browser, 'measure', NO_REWRITES));
		}
		if (SAME) {
			console.log('\n=== the same labels, with the cut and without it ===');
			// SWITCH_PAIR=ref,ref (or ship,ship) compares a page with itself: the noise floor.
			const pair = (process.env.SWITCH_PAIR || 'ship,ref').split(',');
			const ship = await layouts(Session, browser, pair[0] === 'ref' ? REF : NO_REWRITES);
			const ref = await layouts(Session, browser, pair[1] === 'ship' ? NO_REWRITES : REF);
			ok('the page script was hooked on both runs', ship.st.hooked >= 2 && ref.st.hooked >= 2, ship.st.hooked + '/' + ref.st.hooked);
			ok('the reference run really served the page without the cut', ref.st.expected > 0 && ref.st.rewritten === ref.st.expected,
				'rewritten ' + ref.st.rewritten + ' of ' + ref.st.expected + ' over ' + ref.st.fetched + ' loads');
			ok('no page errors', !ship.errors.length && !ref.errors.length, (ship.errors.concat(ref.errors)[0] || '').slice(0, 200));
			TARGETS.forEach((t) => {
				// **AND THE CUT HAS TO HAVE HAPPENED**, or the comparison below compares a page with itself.
				if (pair[0] === 'ship' && pair[1] === 'ref') {
					ok(t.title + ': the settle after a cold arrival runs NO second pass (shipped)', ship[t.title + ' settle passes'] === 0,
						ship[t.title + ' settle passes'] + ' passes; bank: ' + ship[t.title + ' settle miss']);
					ok(t.title + ': ...where the page without the cut ran one', ref[t.title + ' settle passes'] === 1,
						ref[t.title + ' settle passes'] + ' passes; bank: ' + ref[t.title + ' settle miss']);
				}
				// **THE SAME DECISIONS IN THE SAME ORDER**, not only the same picture: every label the
				// crossing shed hid, in the order it hid them, its residual pairs and rounds, and the
				// rungs the node shed ran.
				const crossHid = ship[t.title + ' decisions'].reduce((n, d) => n + ((d.crossShed && d.crossShed.hidden.length) || 0), 0);
				ok(t.title + ': the crossing shed hid labels in these views, so its sameness is tested', crossHid > 0, crossHid + ' hides over 5 views');
				ship[t.title + ' decisions'].forEach((d, i) => {
					const A = JSON.stringify(d), B = JSON.stringify(ref[t.title + ' decisions'][i]);
					ok(t.title + ', view ' + i + ': the same shed decisions in the same order', A === B,
						A === B ? 'hid ' + ((d.crossShed && d.crossShed.hidden.length) || 0) + ', node rungs ' + d.nodeShedRungs : around(A, B));
				});
				ship[t.title].forEach((A, i) => {
					const B = ref[t.title][i];
					const shown = A.filter((s) => s.indexOf('<text') === 0).length;
					let firstDiff = -1;
					for (let k = 0; k < Math.max(A.length, B.length); k++) { if (A[k] !== B[k]) { firstDiff = k; break; } }
					ok(t.title + ', view ' + i + ' (' + ['arrival', '3 notches in', '6 notches in', '3 back out', 'back at the arrival bucket'][i] + '): every label drawn identically',
						firstDiff < 0 && shown > 0, shown + ' texts shown of ' + A.length + ' elements' +
						(firstDiff < 0 ? '' : '; first difference at element ' + firstDiff + ': ' + around(String(A[firstDiff]), String(B[firstDiff]))));
				});
			});
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
