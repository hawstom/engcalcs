// EACH SETTING READ ONCE PER LABEL PASS DRAWS THE SAME LABELS, in a real Chromium with real fonts
// (ROADMAP Task 812, port-plan Step 1). Run with:
//   node dev/lpn-spike/label-pass-memo-browser-harness.js
//
// The node twin is label-pass-memo-harness.js (it also covers a non-Base scenario). Here each
// drawing is opened twice, as shipped and with the memo's begin/end calls rewritten away on the way
// to the browser, and laid out at the views the port plan measured: Net3 and Net3 near Novato at
// fit, 2x, 4x and 8x, and the bench's 600-junction downtown network at its five zooms (node fields
// ID, P, Qb, Z; link fields ID, Q, V). Every element in the layers that hold label text must
// serialise identically. The pass time (median of five refreshLabelText() calls at each view) is
// printed for both; it is reported, not asserted, because a shared machine's timing is noise.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_MEMO_BROWSER_LOCKED';
const NAME = 'label-pass-memo-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
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

const MEMO_CALL = '\t\tbeginLabelPassMemo();\n\t\ttry { refreshLabelTextPass(); } finally { endLabelPassMemo(); ';
const NO_MEMO = '\t\ttry { refreshLabelTextPass(); } finally { ';
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
// The harness's handles: the first view's centre and scale, computed as the node harnesses compute
// them, a view setter, and one timed label pass.
const HOOK = '\twindow.__lpnMemo = {\n' +
	'\t\torigin: function (kind, spacing) {\n' +
	'\t\t\tvar pts = doc.nodes.filter(function (n) { return n.type !== "reservoir"; }).map(function (n) { return nodeAt(n); }), cx = 0, cy = 0, s1, gx = 0, gy = 0, cen, nn;\n' +
	'\t\t\tif (kind === "fit") { zoomExtent(true); s1 = state.s; pts.forEach(function (p) { cx += p.x; cy += p.y; }); return { cx: cx / pts.length, cy: cy / pts.length, s1: s1 }; }\n' +
	'\t\t\tpts.forEach(function (p) { gx += p.x; gy += p.y; }); gx /= pts.length; gy /= pts.length; cen = pts[0];\n' +
	'\t\t\tpts.forEach(function (p) { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });\n' +
	'\t\t\tnn = pts.map(function (p, i) { var b = Infinity; pts.forEach(function (q, j) { if (j !== i) { b = Math.min(b, Math.hypot(q.x - p.x, q.y - p.y)); } }); return b; }).sort(function (a, b) { return a - b; });\n' +
	'\t\t\treturn { cx: cen.x, cy: cen.y, s1: spacing / nn[Math.floor(nn.length / 2)] };\n' +
	'\t\t},\n' +
	'\t\tview: function (v) { return applyView(v); },\n' +
	'\t\tsolved: function () { return !!lastSolveResult; },\n' +
	'\t\tpass: function () { var t = performance.now(); refreshLabelText(); return performance.now() - t; }\n' +
	'\t};\n';

const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const SCENES = [
	{ name: 'Net3', file: 'dev/water-network-examples/Net3.lwn', view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'Novato', file: 'dev/water-network-examples/Net3-Novato-CA-World.lwn', view: 'fit', mults: [1, 2, 4, 8] },
	{ name: 'n600', file: 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', view: 'density', spacing: 28, mults: [1, 1.5, 2, 3, 4] }
];
const REPS = Number(process.env.REPS || 5);

function projectText(file) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, file), 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null, engine: 'epanet' });
	d.labelSettings = d.labelSettings || {};
	const node = {}, link = {};
	Object.keys(d.labelSettings.node || {}).concat(NODE_FIELDS).forEach((k) => { node[k] = NODE_FIELDS.indexOf(k) >= 0; });
	Object.keys(d.labelSettings.link || {}).concat(LINK_FIELDS).forEach((k) => { link[k] = LINK_FIELDS.indexOf(k) >= 0; });
	d.labelSettings.node = node; d.labelSettings.link = link;
	return JSON.stringify(d);
}

function drawn(page) {
	return page.evaluate(() => {
		const out = [], layers = new Set();
		document.querySelectorAll('#lpn_canvas text').forEach((t) => layers.add(t.parentNode));
		layers.forEach((g) => Array.from(g.children).forEach((e) => {
			if (e.tagName === 'image') { return; }
			const cs = getComputedStyle(e);
			out.push((cs.display === 'none' || cs.visibility === 'hidden') ? '<' + e.tagName + ' hidden>' : e.outerHTML);
		}));
		return out;
	});
}

async function layOut(Session, browser, sc, memoOn) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (!memoOn && body.split(MEMO_CALL).length === 2) { body = body.replace(MEMO_CALL, NO_MEMO); rewritten++; }
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_memo', txt); }, projectText(sc.file));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		await a.page.waitForFunction(() => window.__lpnMemo && window.__lpnMemo.solved(), null, { timeout: 30000 });
		const o = await a.page.evaluate(([k, s]) => window.__lpnMemo.origin(k, s), [sc.view, sc.spacing || 0]);
		const views = [], ms = [];
		for (const m of sc.mults) {
			await a.page.evaluate((v) => window.__lpnMemo.view(v), { cx: o.cx, cy: o.cy, s: o.s1 * m });
			await a.settle(1500);
			const ts = [];
			for (let r = 0; r < REPS; r++) { ts.push(await a.page.evaluate(() => window.__lpnMemo.pass())); }
			ts.sort((x, y) => x - y); ms.push(ts[Math.floor(ts.length / 2)]);
			await a.settle(300);
			views.push(await drawn(a.page));
		}
		return { views, ms, rewritten, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
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
		ok('the memo call is where the reference run expects it', src.split(MEMO_CALL).length === 2);
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const ship = await layOut(Session, browser, sc, true);
			const ref = await layOut(Session, browser, sc, false);
			ok('the reference run really served the page without the memo', ref.rewritten >= 1 && ship.rewritten === 0);
			ok('no page errors', !ship.errors.length && !ref.errors.length, (ship.errors.concat(ref.errors)[0] || '').slice(0, 200));
			sc.mults.forEach((m, i) => {
				const A = ship.views[i], B = ref.views[i];
				const texts = A.filter((s) => s.indexOf('<text') === 0 && s.indexOf('<text hidden>') !== 0).length;
				let first = -1;
				for (let k = 0; k < Math.max(A.length, B.length); k++) { if (A[k] !== B[k]) { first = k; break; } }
				ok(sc.name + ' ' + m + 'x: every label drawn identically', first < 0 && texts > 0,
					texts + ' texts shown of ' + A.length + ' elements' + (first < 0 ? '' : '; first difference at ' + first + ': ' +
					String(A[first]).slice(0, 160) + '  vs  ' + String(B[first]).slice(0, 160)));
			});
			console.log('        ms per pass, median of ' + REPS + ': memo ' + ship.ms.map((t) => t.toFixed(1)).join(' ') +
				' | reference ' + ref.ms.map((t) => t.toFixed(1)).join(' '));
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
