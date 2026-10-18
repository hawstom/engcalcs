// A PIPE LABEL SET LEVEL BESIDE ITS PIPE, IN A REAL CHROMIUM WITH REAL FONTS (ROADMAP Task 812,
// dev/label-trials/port-plan.md Step 3). Run with:
//   node dev/lpn-spike/pipe-label-level-browser-harness.js
//
// The node twin is pipe-label-level-harness.js, which checks every never-rule on the stub's nominal
// text widths. Here the widths are the browser's: each drawing is opened twice, as shipped and with
// placeLevelPipeLabels() rewritten away on the way to the browser, at 1x, 2x and 4x on Net3, Net3
// near Novato and the bench's 600-junction downtown network. Labels and values shown in view are
// counted both ways and must not fall; every level label's drawn text box (getBBox, turned by its
// own transform) must not overlap another label's text or a node symbol by more than 1.5 screen px
// (N1), nor its leader pass within a node symbol (N3), and a level label drawn without a leader must
// lie nearer its own pipe than any other (its drawn rows, every pipe in the drawing). Pass time is printed, median of three, and
// so is the same overlap reading over the labels that are not level, which is the layout before.
// LEVEL_PROBE=l:ID,n:ID prints the model's boxes and the drawn text for those labels at each view.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PIPE_LEVEL_BROWSER_LOCKED';
const NAME = 'pipe-label-level-browser-harness';

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

const CALL = "\t\tperfDebugAccum('  cl:level', function () {\n\t\t\tplaceLevelPipeLabels(obs, nodeObs, nodeLabels, nodePlaced, labels, placed, holders, fs);\n\t\t});\n";
const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
// The harness's handles: the first view, a view setter, one timed label pass, and every shown data
// label as drawn: its text's own box (getBBox, real fonts) turned by its own rotate(), its rows,
// and whether the pass set it level beside its pipe.
const HOOK = '\twindow.__lpnLevel = {\n' +
	'\t\torigin: function (kind, spacing) {\n' +
	'\t\t\tvar pts = doc.nodes.filter(function (n) { return n.type !== "reservoir"; }).map(function (n) { return nodeAt(n); }), cx = 0, cy = 0, s1, gx = 0, gy = 0, cen, nn;\n' +
	'\t\t\tif (kind === "fit") { zoomExtent(true); s1 = state.s; pts.forEach(function (p) { cx += p.x; cy += p.y; }); return { cx: cx / pts.length, cy: cy / pts.length, s1: s1 }; }\n' +
	'\t\t\tpts.forEach(function (p) { gx += p.x; gy += p.y; }); gx /= pts.length; gy /= pts.length; cen = pts[0];\n' +
	'\t\t\tpts.forEach(function (p) { if (Math.hypot(p.x - gx, p.y - gy) < Math.hypot(cen.x - gx, cen.y - gy)) { cen = p; } });\n' +
	'\t\t\tnn = pts.map(function (p, i) { var b = Infinity; pts.forEach(function (q, j) { if (j !== i) { b = Math.min(b, Math.hypot(q.x - p.x, q.y - p.y)); } }); return b; }).sort(function (a, b) { return a - b; });\n' +
	'\t\t\treturn { cx: cen.x, cy: cen.y, s1: spacing / nn[Math.floor(nn.length / 2)] };\n' +
	'\t\t},\n' +
	'\t\tview: function (v) { return applyView(v); },\n' +
	'\t\tprobe: function (ids) { var C = EngCalcs.lpnCollide, got = {}, real = C.placeLabelsFirstFit, realR = C.repairCrossingGangs;\n' +
	'\t\t\tC.placeLabelsFirstFit = function (L, o, op) { var r = real.call(this, L, o, op); r.forEach(function (x, i) { if (ids.indexOf(x.id) >= 0) { got[(op && op.strict ? "level " : "ff ") + x.id] = { x: x.x, y: x.y, dropped: x.dropped, boxes: x.boxes }; } }); return r; };\n' +
	'\t\t\tC.repairCrossingGangs = function (L, p, o, op) { var r = realR.call(this, L, p, o, op); r.results.forEach(function (x) { if (ids.indexOf(x.id) >= 0) { got["repair " + x.id] = { x: x.x, y: x.y, dropped: x.dropped, boxes: x.boxes }; } }); return r; };\n' +
	'\t\t\ttry { refreshLabelText(); } finally { C.placeLabelsFirstFit = real; C.repairCrossingGangs = realR; }\n' +
	'\t\t\tids.forEach(function (k) { var h = k.charAt(0) === "n" ? nodeEls[k.slice(2)] : linkEls[k.slice(2)]; got["drawn " + k] = { x: h.text.getAttribute("x"), y: h.text.getAttribute("y"), vis: h.text.style.visibility, bb: h.text.getBBox(), nudge: h.nudge, lines: (h.lines || []).length, tw: labelBoxWidth(h) }; });\n' +
	'\t\t\treturn got; },\n' +
	'\t\tsolved: function () { return !!lastSolveResult; },\n' +
	'\t\tpass: function () { var t = performance.now(); refreshLabelText(); return performance.now() - t; },\n' +
	'\t\tdrawn: function () {\n' +
	'\t\t\tvar out = [], W = svg.clientWidth, H = svg.clientHeight;\n' +
	'\t\t\tfunction one(kind, id, h, ax, ay) {\n' +
	'\t\t\t\tif (!h || h.empty || !h.text || h.text.style.visibility === "hidden") { return; }\n' +
	'\t\t\t\tvar sx = ax * state.s + state.tx, sy = ay * state.s + state.ty, m = /rotate\\(([-0-9.e]+) ([-0-9.e]+) ([-0-9.e]+)\\)/.exec(h.text.getAttribute("transform") || ""), a = m ? +m[1] : 0, rows = [], cur = null;\n' +
	// One box per ROW (Task 406's staircase): a tspan carrying its own x starts a row.
	'\t\t\t\tArray.prototype.forEach.call(h.text.children, function (t) { var b = t.getBBox(); if (!b.width) { return; } if (!cur || t.hasAttribute("x")) { cur = { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height }; rows.push(cur); } else { cur.x0 = Math.min(cur.x0, b.x); cur.y0 = Math.min(cur.y0, b.y); cur.x1 = Math.max(cur.x1, b.x + b.width); cur.y1 = Math.max(cur.y1, b.y + b.height); } });\n' +
	'\t\t\t\tvar boxes = rows.map(function (q) { var cx = (q.x0 + q.x1) / 2, cy = (q.y0 + q.y1) / 2, r, dx, dy; if (m) { r = a * Math.PI / 180; dx = cx - +m[2]; dy = cy - +m[3]; cx = +m[2] + dx * Math.cos(r) - dy * Math.sin(r); cy = +m[3] + dx * Math.sin(r) + dy * Math.cos(r); } return { cx: cx, cy: cy, w: q.x1 - q.x0, h: q.y1 - q.y0, a: a }; });\n' +
	'\t\t\t\tvar ld = h.leader && h.leader.style.display !== "none" ? { ax: +h.leader.getAttribute("x1"), ay: +h.leader.getAttribute("y1"), bx: +h.leader.getAttribute("x2"), by: +h.leader.getAttribute("y2") } : null;\n' +
	'\t\t\t\tout.push({ kind: kind, id: id, level: !!h.levelBeside, rows: (h.lines || []).length, asked: (h.allLines || h.lines || []).length,\n' +
	'\t\t\t\t\tinView: sx >= 0 && sx <= W && sy >= 0 && sy <= H, boxes: boxes, leader: ld });\n' +
	'\t\t\t}\n' +
	'\t\t\tdoc.nodes.forEach(function (n) { var p = nodeAt(n); one("n", n.id, nodeEls[n.id], p.x, p.y); });\n' +
	'\t\t\tdoc.links.forEach(function (l) { var p = linkLabelMid(l); one("l", l.id, linkEls[l.id], p.x, p.y); });\n' +
	'\t\t\tvar sym = doc.nodes.map(function (n) { var e = nodeEls[n.id]; return e && e.circle ? { id: n.id, x: +e.circle.getAttribute("cx"), y: +e.circle.getAttribute("cy"), r: +e.circle.getAttribute("r") } : null; }).filter(Boolean);\n' +
	'\t\t\tvar asked = { n: 0, l: 0 };\n' +
	'\t\t\tdoc.nodes.forEach(function (n) { var e = nodeEls[n.id], p = nodeAt(n); if (e && !e.empty && p.x * state.s + state.tx >= 0 && p.x * state.s + state.tx <= W && p.y * state.s + state.ty >= 0 && p.y * state.s + state.ty <= H) { asked.n++; } });\n' +
	'\t\t\tdoc.links.forEach(function (l) { var e = linkEls[l.id], p = linkLabelMid(l); if (e && !e.empty && p.x * state.s + state.tx >= 0 && p.x * state.s + state.tx <= W && p.y * state.s + state.ty >= 0 && p.y * state.s + state.ty <= H) { asked.l++; } });\n' +
	// Which pipe is it for: a level label with no leader whose drawn rows lie nearer another pipe.
	'\t\t\tvar C = EngCalcs.lpnCollide, segs = []; doc.links.forEach(function (l) { var p = linkPointList(l), i; for (i = 1; i < p.length; i++) { segs.push({ id: l.id, ax: p[i - 1].x, ay: p[i - 1].y, bx: p[i].x, by: p[i].y }); } });\n' +
	'\t\t\tvar astray = out.filter(function (d) { if (d.kind !== "l" || !d.level || d.leader) { return false; } var own = Infinity, other = Infinity; segs.forEach(function (g) { d.boxes.forEach(function (b) { var x = C.segmentBoxDistance(g, b); if (g.id === d.id) { own = Math.min(own, x); } else { other = Math.min(other, x); } }); }); return other < own; }).map(function (d) { return d.id; });\n' +
	'\t\t\treturn { s: state.s, labels: out, sym: sym, asked: asked, astray: astray };\n' +
	'\t\t}\n' +
	'\t};\n';

const NODE_FIELDS = ['id', 'pressure', 'demand', 'elev'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const SCENES = [
	{ name: 'Net3', file: 'dev/water-network-examples/Net3.lwn', view: 'fit', mults: [1, 2, 4] },
	{ name: 'Novato', file: 'dev/water-network-examples/Net3-Novato-CA-World.lwn', view: 'fit', mults: [1, 2, 4] },
	{ name: 'n600', file: 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn', view: 'density', spacing: 28, mults: [1, 2, 4] }
];
const REPS = Number(process.env.REPS || 3);
const EPS_PX = 1.5;

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

async function layOut(Session, browser, sc, levelOn) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (!levelOn && body.split(CALL).length === 2) { body = body.replace(CALL, ''); rewritten++; }
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_level', txt); }, projectText(sc.file));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(2500);
		await a.page.waitForFunction(() => window.__lpnLevel && window.__lpnLevel.solved(), null, { timeout: 30000 });
		const o = await a.page.evaluate(([k, s]) => window.__lpnLevel.origin(k, s), [sc.view, sc.spacing || 0]);
		const views = [];
		for (const m of sc.mults) {
			await a.page.evaluate((v) => window.__lpnLevel.view(v), { cx: o.cx, cy: o.cy, s: o.s1 * m });
			await a.settle(1500);
			const ts = [];
			for (let r = 0; r < REPS; r++) { ts.push(await a.page.evaluate(() => window.__lpnLevel.pass())); }
			ts.sort((x, y) => x - y);
			await a.settle(300);
			views.push(Object.assign({ m: m, ms: ts[Math.floor(ts.length / 2)] }, await a.page.evaluate(() => window.__lpnLevel.drawn())));
			if (process.env.LEVEL_PROBE) {
				const ids = process.env.LEVEL_PROBE.split(',');
				console.log(JSON.stringify(await a.page.evaluate((ids) => window.__lpnLevel.probe(ids), ids)));
			}
		}
		return { views, rewritten, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
}

// Breaks that involve a level label, off the drawn glyph boxes: its text on another label's text or
// on a node symbol (N1), and its leader within a node symbol (N3).
function levelBreaks(Collide, v) {
	const eps = EPS_PX / v.s, out = [];
	const rows = (d) => d.boxes.map((q) => Collide.box(q.cx, q.cy, q.w, q.h, q.a));
	const all = v.labels.map((d) => ({ d: d, rows: rows(d) }));
	const depth = (A, B) => { let w = 0; A.forEach((p) => B.forEach((q) => { w = Math.max(w, Collide.boxOverlapDepth(p, q)); })); return w; };
	all.forEach((P, i) => {
		if (!P.d.level) { return; }
		all.forEach((Q, j) => { if (j === i || (Q.d.level && j < i)) { return; } const dep = depth(P.rows, Q.rows); if (dep > eps) { out.push('N1 l:' + P.d.id + ' on ' + Q.d.kind + ':' + Q.d.id + ' by ' + (dep * v.s).toFixed(1) + ' px'); } });
		v.sym.forEach((c) => { const dep = depth(P.rows, [Collide.box(c.x, c.y, 2 * c.r, 2 * c.r, 0)]); if (dep > eps) { out.push('N1 l:' + P.d.id + ' on node ' + c.id + ' by ' + (dep * v.s).toFixed(1) + ' px'); } });
		const g = P.d.leader;
		if (g) {
			v.sym.forEach((c) => {
				const vx = g.bx - g.ax, vy = g.by - g.ay, L2 = vx * vx + vy * vy;
				let t = L2 ? ((c.x - g.ax) * vx + (c.y - g.ay) * vy) / L2 : 0; t = Math.max(0, Math.min(1, t));
				if (Math.hypot(g.ax + vx * t - c.x, g.ay + vy * t - c.y) < c.r - eps) { out.push('N3 l:' + P.d.id + ' leader through node ' + c.id); }
			});
		}
	});
	return out;
}
// The same reading over the labels that are not level: what the layout before already does.
function baseOverlaps(Collide, v) {
	const eps = EPS_PX / v.s, ls = v.labels.filter((d) => !d.level).map((d) => d.boxes.map((q) => Collide.box(q.cx, q.cy, q.w, q.h, q.a)));
	let n = 0, worst = 0;
	for (let i = 0; i < ls.length; i++) {
		for (let j = i + 1; j < ls.length; j++) {
			let dep = 0; ls[i].forEach((p) => ls[j].forEach((q) => { dep = Math.max(dep, Collide.boxOverlapDepth(p, q)); }));
			if (dep > eps) { n++; worst = Math.max(worst, dep * v.s); }
		}
	}
	return { n: n, worst: worst };
}
function tally(v) {
	const t = { pipes: 0, nodes: 0, rows: 0, level: 0 };
	v.labels.forEach((d) => { if (!d.inView) { return; } if (d.kind === 'l') { t.pipes++; } else { t.nodes++; } t.rows += d.rows; if (d.level) { t.level++; } });
	return t;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const Collide = require(path.join(REPO, 'js', 'lpn-collide.js')).lpnCollide;
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
		ok('the level call is where the reference run expects it', src.split(CALL).length === 2);
		for (const sc of SCENES) {
			console.log('=== ' + sc.name + ' ===');
			const on = await layOut(Session, browser, sc, true);
			const off = await layOut(Session, browser, sc, false);
			ok('the reference run really served the page without the level pass', off.rewritten >= 1 && on.rewritten === 0);
			ok('no page errors', !on.errors.length && !off.errors.length, (on.errors.concat(off.errors)[0] || '').slice(0, 200));
			let level = 0;
			sc.mults.forEach((m, i) => {
				const A = tally(on.views[i]), B = tally(off.views[i]), br = levelBreaks(Collide, on.views[i]);
				level += A.level;
				console.log(`        ${sc.name} ${m}x: pipe labels ${B.pipes} -> ${A.pipes} (${A.level} level) of ${on.views[i].asked.l}, node labels ${B.nodes} -> ${A.nodes} of ${on.views[i].asked.n}, values ${B.rows} -> ${A.rows}; ms per pass ${off.views[i].ms.toFixed(1)} -> ${on.views[i].ms.toFixed(1)}`);
				const bo = baseOverlaps(Collide, on.views[i]);
				console.log(`        (labels not level overlapping each other in real fonts: ${bo.n}, worst ${bo.worst.toFixed(1)} px)`);
				ok(sc.name + ' ' + m + 'x: no fewer labels or values than before', A.pipes + A.nodes >= B.pipes + B.nodes && A.rows >= B.rows);
				ok(sc.name + ' ' + m + 'x: every level label without a leader is nearer its own pipe, in real fonts', !on.views[i].astray.length,
					on.views[i].astray.length + ' of ' + A.level + (on.views[i].astray.length ? ': ' + on.views[i].astray.slice(0, 4).join(' ') : ''));
				ok(sc.name + ' ' + m + 'x: no level label breaks N1 or N3 in real fonts', br.length === 0, br.length + (br.length ? ': ' + br.slice(0, 3).join('; ') : ''));
			});
			ok(sc.name + ': the level pass shows labels', level > 0, String(level));
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
