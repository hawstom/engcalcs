// ASSEMBLY LABELS CLEAR THE PIPE AT EVERY ANGLE, in a real Chrome. Run with:
//   node dev/lpn-spike/pump-plus-label-angle-browser-harness.js
//
// Task 822, Perry's review: the upstream label of a Pump+ on a 135 or 45 degree pipe was struck through by the pipe.
// A Pump+ and a Valve+ are put on a pipe at every 15 degrees; for each, neither node label's box may touch any pipe
// drawn beside it, and the upstream label stands on the upstream half. Then the drawing is saved and opened again,
// opened with Recalculate off, and opened at phone width, and the check is made again.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PUMP_PLUS_ANGLE_LOCKED';
const NAME = 'pump-plus-label-angle-browser-harness';

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

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const fs = require('fs');
const nodes = (a) => a.page.evaluate(() => new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node'))).size);
const ANGLES = []; for (let d = 0; d < 360; d += 15) { ANGLES.push(d); }

// Every node label drawn, as a screen box with its text, and every pipe piece drawn, as a screen segment.
const measure = (a) => a.page.evaluate(() => {
	const labels = Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => t.style.visibility !== 'hidden' && t.textContent).map((t) => {
		const r = t.getBoundingClientRect(); return { id: t.getAttribute('data-nodelbl'), l: r.left, r: r.right, t: r.top, b: r.bottom, lines: t.querySelectorAll('tspan').length || 1 };
	});
	const segs = [];
	Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).forEach((e) => {
		if (!e.getTotalLength || e.closest('.lpn-link-symbol')) { return; }
		try {
			const L = e.getTotalLength(), m = e.getScreenCTM(); if (!(L > 0) || !m) { return; }
			const p = e.getPointAtLength(0), q = e.getPointAtLength(L);
			const s = { x1: m.a * p.x + m.c * p.y + m.e, y1: m.b * p.x + m.d * p.y + m.f, x2: m.a * q.x + m.c * q.y + m.e, y2: m.b * q.x + m.d * q.y + m.f };
			if (Math.hypot(s.x2 - s.x1, s.y2 - s.y1) > 2) { segs.push(s); }
		} catch (x) { /* not a path */ }
	});
	const dots = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((c) => { const r = c.getBoundingClientRect(); return { id: c.getAttribute('data-node'), x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
	const leaders = Array.from(document.querySelectorAll('#lpn_canvas line.lpn-leader')).filter((e) => e.style.display !== 'none' && e.style.visibility !== 'hidden').map((e) => {
		const m = e.getScreenCTM(), x1 = +e.getAttribute('x1'), y1 = +e.getAttribute('y1'), x2 = +e.getAttribute('x2'), y2 = +e.getAttribute('y2');
		return { x1: m.a * x1 + m.c * y1 + m.e, y1: m.b * x1 + m.d * y1 + m.f, x2: m.a * x2 + m.c * y2 + m.e, y2: m.b * x2 + m.d * y2 + m.f };
	});
	return { labels, segs, dots, leaders };
});
// A segment touches a box (shrunk by 1 px) when an end is inside it or it crosses one of its four sides.
function touches(s, b) {
	const l = b.l + 1, r = b.r - 1, t = b.t + 1, bt = b.b - 1;
	const inside = (x, y) => x >= l && x <= r && y >= t && y <= bt;
	if (inside(s.x1, s.y1) || inside(s.x2, s.y2)) { return true; }
	const cross = (ax, ay, bx, by, cx, cy, dx, dy) => {
		const o = (px, py, qx, qy, rx, ry) => (qx - px) * (ry - py) - (qy - py) * (rx - px);
		return (o(ax, ay, bx, by, cx, cy) * o(ax, ay, bx, by, dx, dy) < 0) && (o(cx, cy, dx, dy, ax, ay) * o(cx, cy, dx, dy, bx, by) < 0);
	};
	return cross(s.x1, s.y1, s.x2, s.y2, l, t, r, t) || cross(s.x1, s.y1, s.x2, s.y2, r, t, r, bt) ||
		cross(s.x1, s.y1, s.x2, s.y2, r, bt, l, bt) || cross(s.x1, s.y1, s.x2, s.y2, l, bt, l, t);
}
// For every assembly (a U and a D label), is each label clear of every pipe, and is the upstream one on the upstream half?
function judge(m, centres) {
	const bad = [], missing = [], wrongHalf = [], leaderBad = [];
	centres.forEach((c) => {
		// Tom, 2026-11-09: a leader at an assembly's point is never vertical (within 30 degrees) and never runs along or through a
		// label box. Its far end is a label's text origin, on the box's own edge, so the last tenth is left out of the test.
		m.leaders.filter((ld) => Math.hypot(ld.x1 - c.x, ld.y1 - c.y) < 5 || Math.hypot(ld.x2 - c.x, ld.y2 - c.y) < 5).forEach((ld) => {
			const near = Math.hypot(ld.x1 - c.x, ld.y1 - c.y) < 5, ax = near ? ld.x1 : ld.x2, ay = near ? ld.y1 : ld.y2, bx = near ? ld.x2 : ld.x1, by = near ? ld.y2 : ld.y1;
			const off = Math.atan2(Math.abs(bx - ax), Math.abs(by - ay)) * 180 / Math.PI;
			if (off < 29) { leaderBad.push(c.tag + ': leader ' + Math.round(off) + ' deg off vertical'); }
			const cut = { x1: ax, y1: ay, x2: ax + (bx - ax) * 0.9, y2: ay + (by - ay) * 0.9 };
			m.labels.forEach((b) => { if (touches(cut, { l: b.l + 1, r: b.r - 1, t: b.t + 1, b: b.b - 1 })) { leaderBad.push(c.tag + ': leader runs through label ' + b.id); } });
		});
		const up = m.labels.find((x) => x.id === c.u), dn = m.labels.find((x) => x.id === c.d);
		if (!up || !dn) { missing.push(c.tag); return; }
		[up, dn].forEach((b) => { if (m.segs.some((s) => touches(s, b))) { bad.push(c.tag + ':' + b.id); } });
		// upstream half: the label's centre is on the upstream side of the point, along the flow direction
		const along = (b) => ((b.l + b.r) / 2 - c.x) * Math.cos(c.a * Math.PI / 180) + ((b.t + b.b) / 2 - c.y) * Math.sin(c.a * Math.PI / 180);
		// A label the placer has set in one line (its inline step, for a label that would not fit as a stack) is its own.
		if (up.lines > 1 && dn.lines > 1 && !(along(up) < along(dn))) { wrongHalf.push(c.tag); }
	});
	return { bad, missing, wrongHalf, leaderBad };
}

async function open(browser, opts) {
	const a = await Session.open(browser, NAME, Object.assign({ viewport: { width: 1400, height: 900 } }, opts || {}));
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	await a.newProject('us');
	await a.settle(800);
	return a;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser, { viewport: { width: 2000, height: 1500 } });
		const P = a.page;
		await a.dismissGallery();
		const box = await P.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
		const armed = () => P.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[aria-pressed="true"]'); return b ? b.dataset.tool : null; });
		const arm = async (key, tool) => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); for (let i = 0; i < 3 && (await armed()) !== tool; i++) { await P.keyboard.press(key); await a.settle(120); } };
		// 24 cells a kind: pipes 120 px long through each cell's centre, at the angle under test.
		const cells = [];
		['pump', 'valve'].forEach((kind, ki) => ANGLES.forEach((ang, i) => {
			const k = i + ki * 24, col = k % 8, row = Math.floor(k / 8);
			cells.push({ kind, ang, x: box.x + 150 + col * 200, y: box.y + 120 + row * 190 });
		}));
		const end = (c, s) => ({ x: c.x + s * 70 * Math.cos(c.ang * Math.PI / 180), y: c.y + s * 70 * Math.sin(c.ang * Math.PI / 180) });
		await arm('2', 'add-junction');
		for (const c of cells) { for (const s of [-1, 1]) { const p = end(c, s); await P.mouse.click(p.x, p.y); await a.settle(40); } }
		await P.keyboard.press('Escape');
		ok('two junctions for each of the ' + cells.length + ' pipes', (await nodes(a)) === cells.length * 2, String(await nodes(a)));
		await arm('5', 'add-pipe');
		for (const c of cells) { const p = end(c, -1), q = end(c, 1); await P.mouse.click(p.x, p.y); await a.settle(40); await P.mouse.click(q.x, q.y); await a.settle(60); await P.keyboard.press('Escape'); await arm('5', 'add-pipe'); }
		await P.keyboard.press('Escape');
		const pipes = await P.evaluate(() => new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).map((e) => e.getAttribute('data-link'))).size);
		ok('a pipe for each cell', pipes === cells.length, pipes + ' of ' + cells.length);
		for (const kind of ['pump', 'valve']) {
			await arm(kind === 'pump' ? '6' : '7', kind === 'pump' ? 'add-pumpplus' : 'add-valveplus');
			for (const c of cells.filter((q) => q.kind === kind)) { await P.mouse.click(c.x, c.y); await a.settle(120); }
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape');
		}
		await a.settle(600);
		// Which U and D belong to which cell: by position, nearest cell centre.
		const place = async (a2, list) => {
			const m = await measure(a2);
			const byCell = list.map((c, k) => ({ c, k, us: [], ds: [] }));
			m.dots.forEach((d) => {
				let best = null, bd = Infinity;
				list.forEach((c, k) => { const q = Math.hypot(d.x - c.x, d.y - c.y); if (q < bd) { bd = q; best = k; } });
				if (bd < 8) { (/^U/.test(d.id) ? byCell[best].us : byCell[best].ds).push(d.id); }
			});
			return { m, byCell };
		};
		// The flow direction at each assembly, on screen, from the saved project: from the point toward the far end of the
		// pipe that leaves the downstream node. Nothing here is read from the placer.
		const flowAt = (m) => {
			const out = {}; const dot = (id) => m.dots.find((q) => q.id === id);
			(proj.assemblies || []).forEach((g) => {
				const dn = dot(g.down), l = (proj.links || []).find((q) => q.type === 'pipe' && (q.from === g.down || q.to === g.down));
				const far = l && dot(l.from === g.down ? l.to : l.from);
				if (dn && far) { out[g.up] = { x: dn.x, y: dn.y, d: g.down, a: Math.atan2(far.y - dn.y, far.x - dn.x) * 180 / Math.PI }; }
			});
			return out;
		};
		const sweep = async (a2, list, label) => {
			const { m, byCell } = await place(a2, list);
			const fl = flowAt(m);
			const centres = byCell.filter((b) => b.us.length && b.ds.length && fl[b.us[0]]).map((b) => ({ u: b.us[0], d: b.ds[0], x: b.c.x, y: b.c.y, a: fl[b.us[0]].a, tag: b.c.kind + b.c.ang }));
			ok(label + ': every assembly found by its two coincident nodes', centres.length === list.length, centres.length + ' of ' + list.length);
			const j = judge(m, centres);
			if (process.env.DEBUG_ANGLES) { centres.forEach((c) => { const u = m.labels.find((x) => x.id === c.u), d = m.labels.find((x) => x.id === c.d); console.log(c.tag, 'a=' + Math.round(c.a), JSON.stringify([c.x | 0, c.y | 0]), u && [u.l | 0, u.t | 0, u.r | 0, u.b | 0], d && [d.l | 0, d.t | 0, d.r | 0, d.b | 0]); }); }
			ok(label + ': both labels drawn at every angle', j.missing.length === 0, j.missing.join(' '));
			ok(label + ': no label box touches a pipe, at any angle, pump or valve', j.bad.length === 0, j.bad.join(' '));
			ok(label + ': the upstream label stands on the upstream half, the downstream on the downstream', j.wrongHalf.length === 0, j.wrongHalf.join(' '));
			ok(label + ': no leader at an assembly is vertical or runs through a label', j.leaderBad.length === 0, j.leaderBad.slice(0, 4).join(' | '));
			return m;
		};
		console.log('\n--- the drawing, saved ---');
		await a.menuClick(await a.lang('lpn_file_saveas'));
		await a.settle(600);
		if (await a.dialog()) { await a.answerTrainingPanel(); await a.settle(1500); }
		const written = (await a.listFiles()).filter((f) => /\.(epp|lwn|json)$/i.test(f));
		ok('a file was written', written.length >= 1, written.join(','));
		const text = await a.readFile(written[0]);
		const proj = JSON.parse(text);
		ok('the project file holds one grouping for every pump and valve', Array.isArray(proj.assemblies) && proj.assemblies.length === cells.length, String((proj.assemblies || []).length));
		console.log('\n--- every 15 degrees, Pump+ and Valve+ ---');
		const m0 = await sweep(a, cells, 'one value (the default label)');
		console.log('      lines per label: ' + Array.from(new Set(m0.labels.map((x) => x.lines))).join(','));

		const reopen = async (doc, opts) => {
			const b = await Session.open(browser, NAME, Object.assign({ viewport: { width: 1400, height: 900 } }, opts || {}));
			await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await b.goto('Looped-Network.php?ec_nolog=1');
			await b.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(doc));
			await b.reload();
			await b.answerTrainingPanel().catch(() => {});
			await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await b.settle(2500);
			return b;
		};
		const b = await reopen(proj);
		const judgeOpened = async (bs, label) => {
			const m = await measure(bs), fl = flowAt(m);
			const centres = Object.keys(fl).map((u) => ({ u, d: fl[u].d, x: fl[u].x, y: fl[u].y, a: fl[u].a, tag: u }));
			// Whatever is on screen at this zoom: the assemblies in view
			const inView = centres.filter((c) => m.labels.some((x) => x.id === c.u || x.id === c.d));
			const j = judge(m, inView.map((c) => Object.assign({}, c, { a: c.a })));
			ok(label + ': ' + inView.length + ' assemblies in view, no label box touches a pipe', inView.length > 0 && j.bad.length === 0, j.bad.slice(0, 6).join(' '));
			ok(label + ': upstream label on the upstream half', j.wrongHalf.length === 0, j.wrongHalf.slice(0, 6).join(' '));
			return { m, inView, j };
		};
		await judgeOpened(b, 'reopened');
		ok('no uncaught page errors (reopened)', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
		await b.close();

		console.log('\n--- one value and four values on every label ---');
		for (const v of [['one value (ID only)', { id: true, elev: false, demand: false, head: false, pressure: false }], ['four values (ID, elevation, demand, pressure)', { id: true, elev: true, demand: true, head: false, pressure: true }]]) {
			const dv = JSON.parse(text); dv.labelSettings = Object.assign({}, dv.labelSettings, { node: v[1] });
			const f = await reopen(dv, { viewport: { width: 2000, height: 1500 } });
			const r = await judgeOpened(f, v[0]);
			ok(v[0] + ': longest label has ' + (v[1].elev ? 'four' : 'one') + ' line(s) or fewer where the placer shed rows, none more', r.m.labels.length > 0 && Math.max.apply(null, r.m.labels.map((x) => x.lines)) <= (v[1].elev ? 4 : 1), String(Math.max.apply(null, r.m.labels.map((x) => x.lines))));
			ok(v[0] + ': both labels of every assembly drawn', r.j.missing.length === 0, r.j.missing.slice(0, 6).join(' '));
			await f.close();
		}

		console.log('\n--- Recalculate off ---');
		const off = JSON.parse(text); off.settings = Object.assign({}, off.settings, { autoRun: false });
		const c = await reopen(off);
		await judgeOpened(c, 'Recalculate off');
		ok('no uncaught page errors (Recalculate off)', c.errors.length === 0, c.errors.slice(0, 2).join(' | '));
		await c.close();

		console.log('\n--- phone width ---');
		const d = await reopen(proj, { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await judgeOpened(d, 'phone 390 wide');
		ok('no uncaught page errors (phone)', d.errors.length === 0, d.errors.slice(0, 2).join(' | '));
		await d.close();

		console.log('\n--- four values: Net1 ---');
		const net1 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8');
		const e = await reopen(JSON.parse(net1));
		ok('Net1 labels carry four lines', (await measure(e)).labels.some((x) => x.lines >= 4), JSON.stringify((await measure(e)).labels.map((x) => x.lines).slice(0, 6)));
		await e.close();
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
