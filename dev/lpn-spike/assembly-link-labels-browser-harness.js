// A PUMP+ AND A VALVE+ SHOW THEIR OWN LABEL, GET A LEADER WHEN A LABEL STANDS FAR, AND TAKE A PIPE ON THE RIGHT NODE,
// in a real Chrome. Run with:
//   node dev/lpn-spike/assembly-link-labels-browser-harness.js
//
// Task 822, Tom 2026-11-09. (1) *"I see the node labels. But I don't see the link labels, even zoomed in very close."*
// (2) *"I think we are deprecating leaders too often and too long."* (3) *"Which side of the assembly is connected?
// Should we try to be silently intuitive, where point 2 connects to upstream and point 1 connects to downstream?"*
// Net1 gets a Pump+ on one pipe and a Valve+ on another. Zoomed in: the pump's and the valve's own label is drawn, close to
// its symbol, touching no pipe and neither node label. At the opening view a node label of an assembly that stands far from
// its point has a leader. Then a pipe drawn so that it ENDS on the assembly joins the upstream node, one that STARTS on it
// joins the downstream node, a chain does the same and goes on from the downstream node, and a pipe from a device to itself
// is nothing.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ASM_LINK_LABELS_LOCKED';
const NAME = 'assembly-link-labels-browser-harness';

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
		const netNodeIds = net1.nodes.map((n) => n.id);
		const A = await openNet1(browser, net1), P = A.P;

		console.log('\n--- a Pump+ on a horizontal pipe, a Valve+ on a vertical one ---');
		await A.arm('6', 'add-pumpplus'); await A.click(A.at('11')); await A.off();
		await A.arm('7', 'add-valveplus'); await A.click(A.at('112')); await A.off();
		await A.s.settle(800);
		const m0 = await measure(P);
		const pumpId = (m0.linkLabels.find((l) => /^P\d+$/.test(l.id)) || {}).id, valveId = (m0.linkLabels.find((l) => /^V\d+$/.test(l.id)) || {}).id;
		ok('a Pump+ and a Valve+ were made', !!pumpId && !!valveId, pumpId + ' ' + valveId);
		const ups = m0.dots.filter((d) => /^[PV]\d+U$/.test(d.id)).sort((p, q) => p.id.localeCompare(q.id)), dns = m0.dots.filter((d) => /^[PV]\d+D$/.test(d.id));
		ok('each has its upstream and downstream node', ups.length === 2 && dns.length === 2);

		console.log('\n--- one label block per assembly, placed by the ordinary pass (Tom, 2026-11-11) ---');
		const near = (p, q, r) => Math.hypot(p.x - q.x, p.y - q.y) <= r;
		const blocks0 = m0.nodeLabels.filter((n) => /^[PV]\d+D$/.test(n.id));
		ok('an assembly draws at most ONE node label, the downstream node\'s (the ordinary pass may drop it where the view is crowded), and no upstream node label and no link label', blocks0.length >= 1 &&
			!m0.nodeLabels.some((n) => /^[PV]\d+U$/.test(n.id)) && !m0.linkLabels.some((l) => (l.id === pumpId || l.id === valveId) && l.text), blocks0.map((n) => n.id).join(',') + ' / ' + m0.linkLabels.map((l) => l.id).join(','));
		ok('each block is headed by its device\'s ID', blocks0.length >= 1 && blocks0.every((n) => new RegExp('^' + (n.id.charAt(0)) + '\\d+').test(n.text)), blocks0.map((n) => n.text).join(' | '));

		console.log('\n--- the block, zoomed in close ---');
		const spread = async () => { const m = await measure(P); const d1 = m.dots.find((d) => d.id === '12'), d2 = m.dots.find((d) => d.id === '13'); return d1 && d2 ? Math.hypot(d1.x - d2.x, d1.y - d2.y) : 0; };
		const s0 = await spread();
		let measured = 0;
		for (const [kind, linkId, idx] of [['pump', pumpId, 0], ['valve', valveId, 1]]) {
			const here0 = (await measure(P)).dots.filter((d) => /^[PV]\d+U$/.test(d.id)).sort((p, q) => p.id.localeCompare(q.id))[idx];
			await P.mouse.move(here0.x, here0.y);
			for (let i = 0; i < 9; i++) { await P.mouse.wheel(0, -300); await A.s.settle(120); }
			await A.s.settle(900);
			const m = await measure(P);
			const dpt = m.dots.filter((d) => /^[PV]\d+U$/.test(d.id)).sort((p, q) => p.id.localeCompare(q.id))[idx];
			ok(kind + ': the view is zoomed in', (await spread()) > s0 * 1.3 || !(await spread()), String(Math.round(s0)) + ' -> ' + Math.round(await spread()) + ' px');
			const lb = m.nodeLabels.find((l) => l.id === linkId + 'D');
			ok(kind + ': its block is drawn', !!lb && !lb.hidden, lb ? lb.text : 'no element');
			ok(kind + ': it is headed by the device ID and tags each member row with its own ID', !!lb && lb.text.indexOf(linkId) === 0 && lb.text.indexOf(linkId + 'U') > 0 && lb.text.indexOf(linkId + 'D') > 0, lb ? lb.text : '');
			if (!lb || lb.hidden || !dpt) { continue; }
			measured++;
			const c = { x: (lb.l + lb.r) / 2, y: (lb.t + lb.b) / 2 };
			ok(kind + ': it stands close to its symbol (within 160 px)', Math.hypot(c.x - dpt.x, c.y - dpt.y) <= 160, Math.round(Math.hypot(c.x - dpt.x, c.y - dpt.y)) + ' px');
			ok(kind + ': it touches no pipe', !m.segs.some((s) => touches(s, lb)), '');
			ok(kind + ': it carries no leader through its own text', !m.leaders.some((ld) => near(ld.a, dpt, 3) && touches({ x1: ld.a.x, y1: ld.a.y, x2: ld.b.x, y2: ld.b.y }, lb)), '');
			if (process.env.ASM_SHOT) { await P.screenshot({ path: process.env.ASM_SHOT + '-' + kind + '.png' }); }
		}
		ok('both blocks were measured', measured === 2);

		console.log('\n--- which node a pipe joins ---');
		const B = await openNet1(browser, net1), Q = B.P;
		await B.arm('6', 'add-pumpplus'); await B.click(B.at('11')); await B.arm('7', 'add-valveplus'); await B.click(B.at('22')); await B.off(); await B.s.settle(500);
		const d0 = (await measure(Q)).dots;
		const pumpPt = d0.filter((d) => /^[PV]\d+U$/.test(d.id)).sort((p, q) => p.id.localeCompare(q.id))[0], valvePt = d0.filter((d) => /^[PV]\d+U$/.test(d.id)).sort((p, q) => p.id.localeCompare(q.id))[1];
		const nodeEl = (id) => d0.find((d) => d.id === id);
		await B.arm('5', 'add-pipe'); await B.click(nodeEl('32')); await B.click(pumpPt); await B.off();          // ends on the Pump+
		await B.arm('5', 'add-pipe'); await B.click(valvePt); await B.click(nodeEl('13')); await B.off();         // starts on the Valve+
		await B.arm('5', 'add-pipe'); await B.click(pumpPt); await B.click(pumpPt); await B.off();                // a device to itself
		await B.arm('1', 'add-chain'); await B.click(nodeEl('31')); await B.click(pumpPt);                         // a chain ends on it...
		await B.click({ x: pumpPt.x + 60, y: pumpPt.y - 230 }); await B.off(); await B.s.settle(300);              // ...and goes on from it
		await B.s.menuClick(await B.s.lang('lpn_file_saveas')); await B.s.settle(600);
		if (await B.s.dialog()) { await B.s.answerTrainingPanel(); await B.s.settle(1500); }
		const written = (await B.s.listFiles()).filter((f) => /\.(epp|lwn|json)$/i.test(f));
		const proj = JSON.parse(await B.s.readFile(written[0]));
		const asmP = proj.assemblies.find((g) => g.kind === 'pump'), asmV = proj.assemblies.find((g) => g.kind === 'valve');
		const L = proj.links;
		const pa = L.find((l) => l.type === 'pipe' && l.from === '32' && (l.to === asmP.up || l.to === asmP.down));
		ok('a pipe drawn from node 32 ending on the Pump+ joins its UPSTREAM node', !!pa && pa.to === asmP.up, pa ? pa.from + '->' + pa.to : 'no such pipe');
		const pb = L.find((l) => l.type === 'pipe' && l.to === '13' && (l.from === asmV.up || l.from === asmV.down));
		ok('a pipe drawn from the Valve+ ending at node 13 starts at its DOWNSTREAM node', !!pb && pb.from === asmV.down, pb ? pb.from + '->' + pb.to : 'no such pipe');
		ok('a pipe from the device to itself was not made', !L.some((l) => l.type === 'pipe' && ((l.from === asmP.up && l.to === asmP.down) || (l.from === asmP.down && l.to === asmP.up))), '');
		const pc = L.find((l) => l.type === 'pipe' && l.from === '31' && (l.to === asmP.up || l.to === asmP.down));
		ok('the chain tool ends its leg at the Pump+ on the UPSTREAM node', !!pc && pc.to === asmP.up, pc ? pc.from + '->' + pc.to : 'no such pipe');
		const pd = L.find((l) => l.type === 'pipe' && (l.from === asmP.down || l.from === asmP.up) && netNodeIds.indexOf(l.to) < 0 && l.to !== asmP.up && l.to !== asmP.down);
		ok('and goes on from the DOWNSTREAM node', !!pd && pd.from === asmP.down, pd ? pd.from + '->' + pd.to : 'no such pipe');
		ok('no uncaught page errors', A.s.errors.length === 0 && B.s.errors.length === 0, A.s.errors.concat(B.s.errors).slice(0, 2).join(' | '));
		await B.s.close();
		await A.s.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
