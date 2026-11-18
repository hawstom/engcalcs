// LEADERS A PERSON WOULD NOT DRAW, COUNTED IN A REAL CHROMIUM (ROADMAP Task 812). Per view: the drawn leaders that cross another
// leader, pass through another node's symbol (within SYM px of its centre), cross a pipe that is not theirs (and at under 30 degrees),
// or run longer than LONG row heights. A leader is counted once per fault kind; "bad" is the leaders with at least one fault.
//   node dev/lpn-spike/label-leader-draw-measure.js
//   DRAW_SHOTS=<dir>  pictures about N163 (crop 520 x 360), DRAW_ONLY=novato,net3,n600  DRAW_JSON=<file>  DRAW_LONG=6  DRAW_NOTCHES=10,11,..
//   DRAW_MUT='[["old","new"]]'  a text swap in looped-network.js for a trial, without editing the file
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DRAW_MEASURE_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	const r = spawnSync('flock', ['-E', '75', '-w', '600', LOCK_FILE, process.execPath, __filename], { stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
	process.exit(r.status === null || r.status === 75 ? 1 : r.status);
}
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOVATO = 'dev/water-network-examples/Net3-Novato-CA-World.lwn', NET3 = 'dev/water-network-examples/Net3.lwn', N600 = 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn';
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const SYM = +(process.env.DRAW_SYM || 5), LONG = +(process.env.DRAW_LONG || 6), SHOTS = process.env.DRAW_SHOTS || null;
const NOTCH_OVERRIDE = process.env.DRAW_NOTCHES ? process.env.DRAW_NOTCHES.split(',').map(Number) : null;
const SCENES = [
	{ key: 'novato', file: NOVATO, view: { width: 1920, height: 1000 }, around: '163', notches: range(8, 17), shots: range(10, 16) },
	{ key: 'net3', file: NET3, view: { width: 390, height: 844 }, around: null, notches: [0, 3, 6, 9], shots: [] },
	{ key: 'n600', file: N600, view: { width: 1920, height: 1000 }, around: null, notches: [3, 6, 9], shots: [] }
];
function orient(p, q, r) { return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x); }
function cross(a, b, c, d) { return orient(c, d, a) * orient(c, d, b) < 0 && orient(a, b, c) * orient(a, b, d) < 0; }
function distPtSeg(p, a, b) { const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy; let t = l2 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy); }
function judge(S) {
	const out = { leaders: S.leaders.length, xLeader: 0, xSymbol: 0, xPipe: 0, xShallow: 0, long: 0, bad: 0, ids: { xLeader: [], xSymbol: [], xShallow: [], long: [] } };
	S.leaders.forEach((g, i) => {
		let f = {};
		S.leaders.forEach((h, j) => { if (j !== i && cross(g.a, g.b, h.a, h.b)) { f.xLeader = 1; } });
		S.nodes.forEach((n) => {
			if (g.own.node === n.id) { return; }
			if (Math.hypot(n.x - g.a.x, n.y - g.a.y) < 1.5) { return; }
			if (distPtSeg(n, g.a, g.b) < SYM) { f.xSymbol = 1; }
		});
		S.pipes.forEach((p) => {
			if (g.own.link === p.id) { return; }
			if (g.own.node !== undefined && (p.from === g.own.node || p.to === g.own.node)) { return; }
			if (cross(g.a, g.b, p.a, p.b)) {
				f.xPipe = 1;
				let d = Math.abs(Math.atan2(g.b.y - g.a.y, g.b.x - g.a.x) - Math.atan2(p.b.y - p.a.y, p.b.x - p.a.x)) * 180 / Math.PI % 180;
				if (Math.min(d, 180 - d) < 30) { f.xShallow = 1; }
			}
		});
		const rh = g.rows.length ? (g.rows[0].b - g.rows[0].t) : 12, len = Math.hypot(g.b.x - g.a.x, g.b.y - g.a.y);
		if (len > LONG * rh) { f.long = 1; }
		['xLeader', 'xSymbol', 'xPipe', 'xShallow', 'long'].forEach((k) => { if (f[k]) { out[k]++; if (out.ids[k]) { out.ids[k].push(g.k); } } });
		if (f.xLeader || f.xSymbol || f.xShallow || f.long) { out.bad++; }
	});
	return out;
}
async function run(Session, browser, sc) {
	const a = await Session.open(browser, 'draw-measure', { serviceWorkers: 'block', viewport: sc.view });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (process.env.DRAW_MUT) { JSON.parse(process.env.DRAW_MUT).forEach((m) => { if (body.indexOf(m[0]) < 0) { throw new Error('mut miss ' + m[0]); } body = body.split(m[0]).join(m[1]); }); }
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	const rows = [];
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const proj = JSON.parse(fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
		proj.settings = Object.assign({}, proj.settings, { labelMaxWidth: null });
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(proj));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 120000 });
		await a.settle(2000);
		for (const k of (NOTCH_OVERRIDE || sc.notches)) {
			await a.page.evaluate(([n, around]) => { window.__lpnForm.fitNotch(n, around); window.__lpnForm.content(); }, [k, sc.around]);
			await a.settle(1500);
			const S = await a.page.evaluate(() => window.__lpnForm.leaderShapes());
			const j = judge(S);
			j.k = k; j.nodes = S.nodesShown; j.pipes = S.pipesShown;
			if (sc.around) {
				const g = S.leaders.find((x) => x.k === 'N' + sc.around);
				j.n163 = g ? { len: Math.round(Math.hypot(g.b.x - g.a.x, g.b.y - g.a.y)), rows: g.rows.length, w: g.rows.length ? Math.round(Math.max(...g.rows.map((r) => r.r)) - Math.min(...g.rows.map((r) => r.l))) : 0 } : null;
				const st = await a.page.evaluate((id) => { const ne = nodeEls[id]; return ne && ne.text ? { lines: ne.lineCount, shown: ne.text.checkVisibility && ne.text.checkVisibility({ visibilityProperty: true, opacityProperty: true }), inline: !!ne.inline } : null; }, sc.around).catch(() => null);
				j.n163s = st;
			}
			if (SHOTS && sc.shots.indexOf(k) >= 0) {
				fs.mkdirSync(SHOTS, { recursive: true });
				const ns = await a.page.evaluate((id) => window.__lpnForm.nodeScreen(id), sc.around);
				const w = 560, h = 380, x = Math.max(0, Math.min(sc.view.width - w, ns.x - w / 2)), y = Math.max(0, Math.min(sc.view.height - h, ns.y - h / 2));
				await a.page.screenshot({ path: path.join(SHOTS, sc.key + '-notch' + k + '.png'), clip: { x, y, width: w, height: h } });
			}
			rows.push(j);
		}
	} finally { await a.close(); }
	return rows;
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const only = process.env.DRAW_ONLY ? process.env.DRAW_ONLY.split(',') : null, all = {}, T = { leaders: 0, xLeader: 0, xSymbol: 0, xPipe: 0, xShallow: 0, long: 0, bad: 0, nodes: 0, pipes: 0 };
	try {
		for (const sc of SCENES) {
			if (only && only.indexOf(sc.key) < 0) { continue; }
			const rows = await run(Session, browser, sc);
			all[sc.key] = rows;
			rows.forEach((r) => {
				Object.keys(T).forEach((k) => { T[k] += r[k] === undefined ? (k === 'nodes' ? r.nodes : 0) : r[k]; });
				console.log(`  ${sc.key} ${String(r.k).padStart(2)}: leaders ${r.leaders}, bad ${r.bad} (across leader ${r.xLeader}, through symbol ${r.xSymbol}, across pipe ${r.xPipe} / shallow ${r.xShallow}, over ${LONG} rows ${r.long}); nodes ${r.nodes}, pipes ${r.pipes}` + (sc.around ? '; N' + sc.around + ' ' + JSON.stringify(r.n163s) + ' leader ' + JSON.stringify(r.n163) : ''));
			});
		}
		console.log('  TOTAL ' + JSON.stringify(T));
		if (process.env.DRAW_JSON) { fs.writeFileSync(process.env.DRAW_JSON, JSON.stringify(all, null, 1)); }
	} finally { await browser.close(); env.stopServer(); }
}
main().catch((e) => { console.error(e); process.exit(1); });
