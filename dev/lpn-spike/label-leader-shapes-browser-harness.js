// LEADERS A PERSON WOULD DRAW, IN A REAL CHROMIUM (ROADMAP Task 812, Tom's lesson "leaders a person would draw"). Two rules,
// each one flag on the page (the harness lays every view out twice from the same files, the rules on and off):
//   LPN_LEADER_NEAREST_ROW a stack's leader meets the row nearest its node, not always the first (dropStruckLeaders());
//   LPN_TIE_RETRY          a stack that shows everything and found no line is tried for its line a second time, after its
//                          neighbours have taken theirs (N163 on Novato, Tom's "why not one line").
// Run with:
//   node dev/lpn-spike/label-leader-shapes-browser-harness.js
//   LEADER_SHAPES_SHOTS=<dir>   saves the pictures Tom is shown, rules off ("before") and on ("after")
// One fixed scale per view: Novato at wheel notches about N163 (1920 x 1000), Net3 in a phone-sized window, the 600-junction
// network at notches 3, 6 and 9. Node fields ID, Qb, Z, H, P; link fields ID, Q, V. A leader "crosses a pipe" when it runs across a
// pipe that is not its own element's (a node's own pipes arrive at the leader's start and do not count). A leader "runs long" when it
// is more than 8 px longer than the way from its node to the nearest row of its label.
// ALSO ASSERTED, for the nearest-row rule: a leader's end stands on its row in every view, in a project whose origin is 1e7 ft away, after a zoom frame (font sizes rewritten, nothing laid out), and after an edit with Recalculate off cut the label
// to two rows; and attachToNearestRow() names the right row of a stack whose first row is blank.
// ASSERTED: N163 on Novato is a one-line label at 12 and 14 notches with the rules on and a stack with them off; over all views the rules leave fewer drawn leaders running long and no more across a pipe, show no fewer node labels
// and no fewer pipe fields, draw no more leaders through another label; and the label pass costs at most half as much again
// (a gross guard: the measure of time is label-settle-bench-browser.js).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LEADER_SHAPES_BROWSER_LOCKED';
const NAME = 'label-leader-shapes-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
		stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
	});
	if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
	if (r.status === 75) { console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s.'); process.exit(1); }
	process.exit(r.status === null ? 1 : r.status);
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const MARKER = "\tdocument.addEventListener('DOMContentLoaded'";
const HOOK = fs.readFileSync(path.join(__dirname, 'label-form-hook.inc.js'), 'utf8');
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'], LINK_FIELDS = ['id', 'flow', 'velocity'];
const NOVATO = 'dev/water-network-examples/Net3-Novato-CA-World.lwn', NET3 = 'dev/water-network-examples/Net3.lwn', N600 = 'dev/lpn-spike/fixtures/plain-downtown-n600-seed71.lwn';
const SHOTS = process.env.LEADER_SHAPES_SHOTS || null;
const SCENES = [
	{ key: 'novato', file: NOVATO, view: { width: 1920, height: 1000 }, around: '163', notches: [2, 4, 6, 8, 9, 10, 12, 14], shots: [9, 12] },
	{ key: 'net3-phone', file: NET3, view: { width: 390, height: 844 }, around: null, notches: [0, 3, 6], shots: [3] },
	// the same network with its origin 1e7 ft away, as a projected project is stored
	{ key: 'net3-far', file: NET3, shift: 1e7, view: { width: 1400, height: 900 }, around: null, notches: [2, 4, 6], shots: [] },
	{ key: 'net3-wide', file: NET3, view: { width: 1400, height: 900 }, around: null, notches: [2, 4, 6], shots: [] },
	{ key: 'n600', file: N600, view: { width: 1920, height: 1000 }, around: null, notches: [3, 6, 9], shots: [] }
];

function cross(a, b, c, d) {
	const o = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
	return o(c, d, a) * o(c, d, b) < 0 && o(a, b, c) * o(a, b, d) < 0;
}
// Is a leader's end on its label's rows (the row it was set to meet, when the rows are all drawn), in pixels?
function onItsRow(st) {
	if (!st.shown || !st.rows.length) { return true; }
	const top = st.rows[0].t, bottom = st.rows[st.rows.length - 1].b;
	if (st.y2 < top - 3 || st.y2 > bottom + 3) { return false; }
	if (st.row !== null && st.rows.length === st.lineCount) { return st.y2 >= st.rows[st.row].t - 4 && st.y2 <= st.rows[st.row].b + 4; }
	return true;
}
function rectDist(p, r) { return Math.hypot(Math.max(r.l - p.x, 0, p.x - r.r), Math.max(r.t - p.y, 0, p.y - r.b)); }
// Drawn leaders that cross a pipe other than their own element's, those that run long, and the drawn leaders' count.
function faults(S) {
	let across = 0, long = 0;
	const ids = [];
	S.leaders.forEach((g) => {
		let n = 0;
		S.pipes.forEach((p) => {
			if (g.own.link === p.id) { return; }
			if (g.own.node !== undefined && (p.from === g.own.node || p.to === g.own.node)) { return; }
			if (cross(g.a, g.b, p.a, p.b)) { n++; }
		});
		if (n) { across++; ids.push(g.k); }
		const len = Math.hypot(g.b.x - g.a.x, g.b.y - g.a.y);
		if (g.rows.length && len - Math.min(...g.rows.map((r) => rectDist(g.a, r))) > 8) { long++; }
	});
	return { across: across, long: long, leaders: S.leaders.length, ids: ids };
}

async function layOut(Session, browser, sc, mode) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: sc.view });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		if (mode === 'off') {
			['LPN_LEADER_NEAREST_ROW', 'LPN_TIE_RETRY'].forEach((f) => {
				if (body.indexOf('var ' + f + ' = true') < 0) { throw new Error('no ' + f); }
				body = body.replace('var ' + f + ' = true', 'var ' + f + ' = false');
			});
		}
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const proj = JSON.parse(fs.readFileSync(path.join(REPO, sc.file), 'utf8'));
		proj.settings = Object.assign({}, proj.settings, { labelMaxWidth: null });
		// A file's coordinates are local to its origin, so a project drawn 1e7 ft from the origin of its grid is the same drawing numbers
		// with a far origin; the drawing numbers themselves never reach 1e7 (the renderer's float32 could not place a label there).
		if (sc.shift) { proj.origin = { x: sc.shift, y: sc.shift }; delete proj.view; }
		await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_wheel', txt); }, JSON.stringify(proj));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.waitForFunction(() => window.__lpnForm && window.__lpnForm.solved(), null, { timeout: 120000 });
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [NODE_FIELDS, LINK_FIELDS]);
		await a.settle(2000);
		const rows = [];
		for (const k of sc.notches) {
			await a.page.evaluate(([n, around]) => { window.__lpnForm.fitNotch(n, around); window.__lpnForm.content(); }, [k, sc.around]);
			await a.settle(1500);
			const S = await a.page.evaluate(() => window.__lpnForm.leaderShapes());
			const strikes = await a.page.evaluate(() => window.__lpnForm.leaderStrikes().length);
			const pf = await a.page.evaluate(() => window.__lpnForm.pipeFields());
			const n163 = (await a.page.evaluate(() => window.__lpnForm.nodeForms(['163'])))['163'];
			const att = await a.page.evaluate(() => window.__lpnForm.attachedIds().map((id) => [id, window.__lpnForm.attachState(id)]));
			rows.push({ k: k, f: faults(S), nodesShown: S.nodesShown, pipesShown: S.pipesShown, pipeRows: pf.rows, n163: n163, strikes: strikes, attached: att.length, off: att.filter(([id, st]) => !onItsRow(st)).map(([id]) => id) });
			if (SHOTS && sc.shots.indexOf(k) >= 0) {
				fs.mkdirSync(SHOTS, { recursive: true });
				await a.page.screenshot({ path: path.join(SHOTS, sc.key + '-notch' + k + '-' + (mode === 'off' ? 'before' : 'after') + '.png') });
			}
		}
		return { rows: rows, errors: a.errors.slice() };
	} finally {
		await a.close();
	}
}

// A zoom frame, and an edit with Recalculate off, on Novato at 12 notches with the rule on: no pass runs, and each leader still ends on a row.
async function frameChecks(Session, browser) {
	const sc = SCENES[0], a = await Session.open(browser, NAME + '-frames', { serviceWorkers: 'block', viewport: sc.view });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
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
		await a.page.evaluate(([n, l]) => window.__lpnForm.fields(n, l), [NODE_FIELDS, LINK_FIELDS]);
		await a.settle(2000);
		await a.page.evaluate(([n, around]) => { window.__lpnForm.fitNotch(n, around); window.__lpnForm.content(); }, [12, sc.around]);
		await a.settle(1500);
		const att = await a.page.evaluate(() => window.__lpnForm.attachedIds().map((id) => [id, window.__lpnForm.attachState(id)]));
		const tall = att.filter(([id, st]) => st.lineCount >= 3);
		ok('Novato 12 notches: stacks of three rows or more have a leader set to meet a row', tall.length >= 2, tall.length + ' of ' + att.length);
		// a zoom frame, out and in
		for (const f of [1.07, 1 / 1.07 / 1.07]) {
			await a.page.evaluate((x) => window.__lpnForm.zoomFrame(x), f);
			const bad = [];
			for (const [id] of att) { const st = await a.page.evaluate((i) => window.__lpnForm.attachState(i), id); if (!onItsRow(st)) { bad.push(id + ' ' + JSON.stringify([st.y2, st.rows[0] && st.rows[0].t, st.rows[st.rows.length - 1] && st.rows[st.rows.length - 1].b])); } }
			ok('after a zoom frame (x' + f.toFixed(3) + ', nothing laid out) every leader still ends on its row', !bad.length, bad.slice(0, 3).join('; '));
		}
		// an edit with Recalculate off: the label is cut to two rows and rewritten in place
		const id = (tall[tall.length - 1] || [])[0];
		const before = (tall[tall.length - 1] || [0, {}])[1].lineCount;
		await a.page.evaluate((i) => window.__lpnForm.editInPlace(i, 2), id);
		const st = await a.page.evaluate((i) => window.__lpnForm.attachState(i), id);
		ok('N' + id + ' cut from ' + before + ' rows to ' + st.lineCount + ' in place: its leader ends within the label', st.lineCount < before && onItsRow(st), JSON.stringify([st.lineCount, st.row, st.y2, st.rows]));
	} finally {
		await a.close();
	}
}
// attachToNearestRow() on made-up labels, the stack whose first row is blank among them: the leader meets the row it should.
async function probeChecks(Session, browser) {
	const a = await Session.open(browser, NAME + '-probe', { serviceWorkers: 'block', viewport: { width: 800, height: 600 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (body.indexOf(MARKER) >= 0) { body = body.replace(MARKER, HOOK + MARKER); }
		await route.fulfill({ response: resp, body: body });
	});
	try {
		await a.goto('Looped-Network.php?ec_nolog=1');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.waitForFunction(() => window.__lpnForm, null, { timeout: 60000 });
		const probe = (w, r) => a.page.evaluate(([x, y]) => window.__lpnForm.attachProbe(x, y), [w, r]);
		const cases = [
			['four rows, the node level with the last', [60, 60, 60, 60], 3.1, 3],
			['four rows, the node level with the second', [60, 60, 60, 60], 1, 1],
			['four rows, the node above the first (it stays on the first)', [60, 60, 60, 60], -0.5, null],
			['first row blank, the node level with the second', [0, 60, 60, 60], 1, 1],
			['first row blank, the node level with the last', [0, 60, 60, 60], 3, 3],
			['a blank row in the middle, the node level with the last', [60, 0, 60, 60], 3, 3],
			['a blank row in the middle, the node level with the blank (the nearer drawn row)', [60, 0, 60, 60], 1.4, 2]
		];
		for (const [name, w, r, want] of cases) { const got = await probe(w, r); ok('attachToNearestRow, ' + name, got === want, 'row ' + got + ', wanted ' + want); }
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	const T = { on: { across: 0, long: 0, leaders: 0, nodes: 0, pipes: 0, rows: 0, strikes: 0, attached: 0, off: 0 }, off: { across: 0, long: 0, leaders: 0, nodes: 0, pipes: 0, rows: 0, strikes: 0, attached: 0, off: 0 } };
	let novato = null, farRows = null, nearRows = null;
	try {
		for (const sc of SCENES) {
			const on = await layOut(Session, browser, sc, 'on'), off = await layOut(Session, browser, sc, 'off');
			if (sc.key === 'novato') { novato = { on: on, off: off }; }
			if (sc.key === 'net3-far') { farRows = { on: on.rows, off: off.rows }; }
			if (sc.key === 'net3-wide') { nearRows = on.rows; }
			ok(sc.key + ': no page errors', !on.errors.length && !off.errors.length, (on.errors[0] || off.errors[0] || '').slice(0, 200));
			on.rows.forEach((r, i) => {
				const b = off.rows[i];
				console.log(`        ${sc.key} ${String(r.k).padStart(2)}: leaders across a pipe ${b.f.across} -> ${r.f.across}, running long ${b.f.long} -> ${r.f.long}, of ${b.f.leaders} -> ${r.f.leaders}; node labels ${b.nodesShown} -> ${r.nodesShown}; pipe labels ${b.pipesShown} -> ${r.pipesShown}; strikes ${b.strikes} -> ${r.strikes}; leaders on a row ${r.attached - r.off.length} of ${r.attached} set to meet one`);
				[['on', r], ['off', b]].forEach(([t, x]) => { T[t].across += x.f.across; T[t].long += x.f.long; T[t].rows += x.pipeRows; T[t].leaders += x.f.leaders; T[t].nodes += x.nodesShown; T[t].pipes += x.pipesShown; T[t].strikes += x.strikes; T[t].attached += x.attached || 0; T[t].off += (x.off || []).length; });
			});
		}
		console.log(`        TOTAL leaders across a pipe ${T.off.across} -> ${T.on.across}; running long ${T.off.long} -> ${T.on.long}; pipe fields ${T.off.rows} -> ${T.on.rows}; leaders ${T.off.leaders} -> ${T.on.leaders}; node labels ${T.off.nodes} -> ${T.on.nodes}; pipe labels ${T.off.pipes} -> ${T.on.pipes}; strikes ${T.off.strikes} -> ${T.on.strikes}; leaders set to meet a row ${T.on.attached}, off their row ${T.on.off}`);
		const at = (rows, k) => (rows.find((r) => r.k === k) || {}).n163;
		[12, 14].forEach((k) => {
			ok('Novato ' + k + ' notches: N163 is a one-line label with the rules on', /^line/.test(at(novato.on.rows, k) || ''), String(at(novato.on.rows, k)));
			ok('Novato ' + k + ' notches: N163 is a stack with the rules off', /^stack/.test(at(novato.off.rows, k) || ''), String(at(novato.off.rows, k)));
		});
		ok('over all views, no more drawn leaders across a pipe', T.on.across <= T.off.across, `${T.off.across} -> ${T.on.across}`);
		ok('over all views, fewer drawn leaders running long', T.on.long < T.off.long, `${T.off.long} -> ${T.on.long}`);
		ok('over all views, no fewer pipe fields shown', T.on.rows >= T.off.rows, `${T.off.rows} -> ${T.on.rows}`);
		ok('over all views, no fewer node labels shown', T.on.nodes >= T.off.nodes, `${T.off.nodes} -> ${T.on.nodes}`);
		ok('over all views, no more drawn leaders through a label', T.on.strikes <= T.off.strikes, `${T.off.strikes} -> ${T.on.strikes}`);
		ok('every leader set to meet a row ends on that row, in every view', T.on.off === 0 && T.on.attached > 0, `${T.on.attached} set, ${T.on.off} off their row`);
		const far = farRows;
		ok('origin 1e7 ft away, leaders are set to meet a row', far.on.some((r) => r.attached > 0), far.on.map((r) => r.attached).join(','));
		ok('origin 1e7 ft away, as many leaders are set to meet a row as near the origin (+/- one in ten)', Math.abs(far.on.reduce((t, r) => t + r.attached, 0) - nearRows.reduce((t, r) => t + r.attached, 0)) <= Math.max(1, 0.1 * nearRows.reduce((t, r) => t + r.attached, 0)), far.on.map((r) => r.attached).join(',') + ' against ' + nearRows.map((r) => r.attached).join(','));
		ok('origin 1e7 ft away, fewer leaders run long than with the rule off', far.on.reduce((t, r) => t + r.f.long, 0) < far.off.reduce((t, r) => t + r.f.long, 0), far.on.map((r) => r.f.long).join(',') + ' against ' + far.off.map((r) => r.f.long).join(','));
		await frameChecks(Session, browser);
		await probeChecks(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
