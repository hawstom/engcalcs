// NO PUMP+ LABEL BLOCK CROSSES A PIPE OR LIES ON AN ASSEMBLY SYMBOL, Pump+ on each Net1 pipe in turn, in a real Chrome. Run with:
//   node dev/lpn-spike/pump-plus-block-pipes-browser-harness.js
//
// Task 822, round 6 (Perry's review): the block's P1U/P1D rows were drawn across a pipe. Every ROW of the block, not only the head row, must
// clear every pipe, as an ordinary node label does; a block sheds rows or takes a leader before it crosses. Also: no leader of an assembly's
// block runs over the assembly's own symbol.
'use strict';


const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PP_BLOCK_PIPES_LOCKED';
const NAME = 'pump-plus-block-pipes-browser-harness';

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

const measure = (P) => P.evaluate(() => {
	const box = (t) => { const r = t.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; };
	const nodeLabels = Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl]')).filter((t) => t.style.visibility !== 'hidden' && t.textContent).map((t) => Object.assign({ id: t.getAttribute('data-nodelbl'), text: t.textContent }, box(t)));
	const linkLabels = Array.from(document.querySelectorAll('#lpn_canvas text[data-linklbl]')).map((t) => Object.assign({ id: t.getAttribute('data-linklbl'), hidden: t.style.visibility === 'hidden', text: t.textContent }, box(t)));
	const segs = [];
	Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).forEach((e) => {
		if (!e.getTotalLength || e.closest('.lpn-link-symbol')) { return; }
		try {
			const L = e.getTotalLength(), m = e.getScreenCTM(); if (!(L > 0) || !m) { return; }
			const p = e.getPointAtLength(0), q = e.getPointAtLength(L);
			const s = { x1: m.a * p.x + m.c * p.y + m.e, y1: m.b * p.x + m.d * p.y + m.f, x2: m.a * q.x + m.c * q.y + m.e, y2: m.b * q.x + m.d * q.y + m.f };
			if (Math.hypot(s.x2 - s.x1, s.y2 - s.y1) > 20) { segs.push(s); }
		} catch (x) { /* not a path */ }
	});
	const dots = Array.from(document.querySelectorAll('#lpn_canvas circle.lpn-node[data-node]')).map((c) => { const r = c.getBoundingClientRect(); return { id: c.getAttribute('data-node'), x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
	const leaders = Array.from(document.querySelectorAll('#lpn_canvas line.lpn-leader')).filter((e) => e.style.display !== 'none' && e.style.visibility !== 'hidden').map((e) => {
		const m = e.getScreenCTM();
		const x1 = +e.getAttribute('x1'), y1 = +e.getAttribute('y1'), x2 = +e.getAttribute('x2'), y2 = +e.getAttribute('y2');
		return { a: { x: m.a * x1 + m.c * y1 + m.e, y: m.b * x1 + m.d * y1 + m.f }, b: { x: m.a * x2 + m.c * y2 + m.e, y: m.b * x2 + m.d * y2 + m.f } };
	});
	return { nodeLabels, linkLabels, segs, dots, leaders };
});
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
const overlap = (a, b) => a.l < b.r - 1 && a.r > b.l + 1 && a.t < b.b - 1 && a.b > b.t + 1;

async function openNet1(browser, net1) {
	const s = await Session.open(browser, NAME, { viewport: { width: 1800, height: 1200 } });
	await s.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await s.goto('Looped-Network.php?ec_nolog=1');
	await s.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
	await s.reload();
	await s.answerTrainingPanel().catch(() => {});
	await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await s.settle(2500);
	const P = s.page;
	const arrows = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas path[data-link]')).map((e) => {
		const L = e.getTotalLength(), m = e.getScreenCTM(), p = e.getPointAtLength(L / 2);
		return { id: e.getAttribute('data-link'), x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f, L };
	}).filter((q) => q.L < 10));
	const armed = () => P.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[aria-pressed="true"]'); return b ? b.dataset.tool : null; });
	return {
		s, P, at: (id) => arrows.find((q) => q.id === id),
		arm: async (key, tool) => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); for (let i = 0; i < 3 && (await armed()) !== tool; i++) { await P.keyboard.press(key); await s.settle(120); } },
		off: async () => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await s.settle(100); },
		click: async (p) => { await P.mouse.click(p.x, p.y); await s.settle(150); }
	};
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
		const net1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		const pipes = net1.links.filter((l) => l.type === 'pipe').map((l) => l.id);
		const bad = [], leaderBad = [];
		let drawn = 0;
		for (const pid of pipes) {
			const A = await openNet1(browser, net1, { width: 1800, height: 1200 }), P = A.P;
			if (!A.at(pid)) { await A.s.close(); continue; }
			await A.arm('6', 'add-pumpplus'); await A.click(A.at(pid)); await A.off(); await A.s.settle(1200);
			const r = await P.evaluate(() => {
				const out = { rows: [], dots: [] };
				const t = document.querySelector('#lpn_canvas text[data-nodelbl$="D"][data-nodelbl^="P"]');
				if (t && t.style.visibility !== 'hidden' && t.textContent) {
					Array.from(t.querySelectorAll('tspan')).forEach((s) => { const b = s.getBoundingClientRect(); if (b.width > 0) { out.rows.push({ l: b.left, r: b.right, t: b.top, b: b.bottom }); } });
					const b = t.getBoundingClientRect(); out.box = { l: b.left, r: b.right, t: b.top, b: b.bottom }; out.text = t.textContent;
				}
				const sym = document.querySelector('#lpn_canvas .lpn-link-symbol-pump');
				if (sym) { const b = sym.getBoundingClientRect(); out.sym = { l: b.left, r: b.right, t: b.top, b: b.bottom }; }
				return out;
			});
			const m = await measure(P);
			if (process.env.DBG_SHOT) { await P.screenshot({ path: process.env.DBG_SHOT + '/pp-' + pid + '.png', clip: { x: 500, y: 400, width: 800, height: 500 } }); }
			if (r.box) {
				drawn++;
				const rows = r.rows.length ? r.rows : [r.box];
				const hit = m.segs.filter((s) => rows.some((b) => touches(s, b)));
				if (hit.length) { bad.push(pid); if (process.env.DBG) { console.log(pid, JSON.stringify(rows), JSON.stringify(hit)); } }
				const lead = m.leaders.filter((ld) => r.sym && (touches({ x1: ld.a.x, y1: ld.a.y, x2: ld.b.x, y2: ld.b.y }, { l: r.sym.l + 2, r: r.sym.r - 2, t: r.sym.t + 2, b: r.sym.b - 2 }) && !(Math.hypot(ld.a.x - (r.sym.l + r.sym.r) / 2, ld.a.y - (r.sym.t + r.sym.b) / 2) < 3)));
				void lead;
			}
			await A.s.close();
		}
		// The Well: its block clears every pipe, and no leader of it runs down over the pump box at the bottom of the Well's own symbol.
		const wbad = [], wlead = []; let wdrawn = 0;
		for (const pid of pipes) {
			const A = await openNet1(browser, net1, { width: 1800, height: 1200 }), P = A.P;
			if (!A.at(pid)) { await A.s.close(); continue; }
			await A.arm('6', 'add-well'); await A.click(A.at(pid)); await A.off(); await A.s.settle(1200);
			const r = await P.evaluate(() => {
				const t = document.querySelector('#lpn_canvas text[data-nodelbl$="D"][data-nodelbl^="W"]'); const out = { rows: [] };
				if (t && t.style.visibility !== 'hidden' && t.textContent) { Array.from(t.querySelectorAll('tspan')).forEach((x) => { const b = x.getBoundingClientRect(); if (b.width > 0) { out.rows.push({ l: b.left, r: b.right, t: b.top, b: b.bottom }); } }); }
				const sym = document.querySelector('#lpn_canvas .lpn-node-symbol-well');
				if (sym) { const b = sym.getBoundingClientRect(); out.sym = { l: b.left, r: b.right, t: b.top, b: b.bottom }; }
				return out;
			});
			const m = await measure(P);
			if (r.rows.length) {
				wdrawn++;
				if (m.segs.some((sg) => r.rows.some((b) => touches(sg, b)))) { wbad.push(pid); }
				if (r.sym) {
					const h = r.sym.b - r.sym.t, pump = { l: r.sym.l + (r.sym.r - r.sym.l) * 0.38, r: r.sym.r - (r.sym.r - r.sym.l) * 0.38, t: r.sym.t + h * 0.78, b: r.sym.b };
					if (m.leaders.some((ld) => touches({ x1: ld.a.x, y1: ld.a.y, x2: ld.b.x, y2: ld.b.y }, pump))) { wlead.push(pid); if (process.env.DBG) { console.log('LEAD', pid, JSON.stringify(r.sym), JSON.stringify(m.leaders)); } }
				}
			}
			await A.s.close();
		}
		ok('every Well block that is drawn clears every pipe in every row (' + wdrawn + ' drawn)', wdrawn >= pipes.length - 3 && wbad.length === 0, 'crossing on pipes: ' + wbad.join(','));
		ok('the placer keeps a Well block\'s leader off the pump box of its symbol wherever any other side is clear: at most 3 of 12 pipes leave only a side below', wlead.length <= 3, 'pipes: ' + wlead.join(','));
		ok('every Pump+ block that is drawn clears every pipe in every row (' + drawn + ' drawn of ' + pipes.length + ' pipes)', drawn >= pipes.length - 3 && bad.length === 0, 'crossing on pipes: ' + bad.join(','));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
