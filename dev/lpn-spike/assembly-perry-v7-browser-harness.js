// PERRY'S FIVE FINDINGS ON TIP 6af7fa10d, in a real Chrome. Run with:
//   node dev/lpn-spike/assembly-perry-v7-browser-harness.js
//
// Task 822. (1) A refusal (a Well with no curves) leaves the previous results on screen, as the snapshot rule says.
// (3) A Pump+ link label does not overlap an ordinary link label at Net1's fit view. (4) The two coincident-node labels of a
// Valve+ on a vertical pipe do not overlap each other. (5) A reopened Well's node label has no leader through its text.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_ASM_PERRY_V7_LOCKED';
const NAME = 'assembly-perry-v7-browser-harness';

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

async function openNet1(browser, net1, vp) {
	const s = await Session.open(browser, NAME, { viewport: vp || { width: 1800, height: 1200 } });
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



const clickRow = (P, sel, text) => P.evaluate(([q, t]) => {
	const r = Array.from(document.querySelectorAll(q)).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
	if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
	return !!r;
}, [sel, text]);
async function exportInp(s) {
	const P = s.page, L = (k) => s.lang(k);
	let dl = null;
	const w = P.waitForEvent('download', { timeout: 8000 }).then((x) => { dl = x; }, () => {});
	await P.click('#lpn_menu_file');
	await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	await clickRow(P, '#lpn_menu_list button.lpn-menu-row', (await L('lpn_file_export_menu')).trim());
	await P.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
	const item = (await L('lpn_file_export_item_inp')).trim();
	if (!(await clickRow(P, '#lpn_menu_list2 button.lpn-menu-row', item))) {
		const groups = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.filter((e) => e.querySelector('.lpn-menu-arrow')).map((e) => e.textContent.replace(/[▸\s]+$/, '').trim()));
		for (const g of groups) {
			await clickRow(P, '#lpn_menu_list2 button.lpn-menu-row', g);
			await P.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
			if (await clickRow(P, '#lpn_menu_list3 button.lpn-menu-row', item)) { break; }
		}
	}
	await s.settle(500);
	const asked = await s.dialog();
	if (asked) { await s.dialogClick(asked.buttons[0]); }
	await w; await s.settle(500);
	const dlg = await s.dialog();
	if (dlg) { await s.dialogClick((await L('lpn_dialog_ok')).trim()); }
	return dl ? fs.readFileSync(await dl.path(), 'utf8') : null;
}
async function closeDialogs(s) {
	for (let k = 0; k < 6; k++) {
		const d = await s.dialog();
		if (!d) { return; }
		await s.dialogClick(d.buttons[0]); await s.settle(400);
	}
}
const PICS = process.env.EC_PICS || '';
const labelTexts = (P) => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas text[data-nodelbl], #lpn_canvas text[data-linklbl]')).filter((t) => t.style.visibility !== 'hidden').map((t) => t.textContent).filter((x) => /\d/.test(x) && /[=:]|\d\.\d/.test(x)));

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
		console.log('\n--- 1. a refusal keeps the previous results ---');
		const A = await openNet1(browser, net1), P = A.P;
		const before = await labelTexts(P);
		ok('Net1 shows result labels before the Well', before.length > 5, before.length + ' labels');
		await A.arm('6', 'add-well');
		await A.click({ x: 900, y: 900 }); await A.off(); await A.s.settle(1200);
		const banner = await P.evaluate(() => (document.getElementById('lpn_status') || document.body).textContent);
		ok('the banner asks for the drawdown and pump head curves', /drawdown curve and a pump head curve/.test(banner));
		const after = await labelTexts(P);
		ok('the previous result labels are still on the map', after.length >= before.length, before.length + ' -> ' + after.length);
		if (PICS) { await P.screenshot({ path: path.join(PICS, 'well-no-curves-keeps-results-v7.png') }); }
		await A.s.close();

		console.log('\n--- 3. a Pump+ block on L11 against the ordinary labels ---');
		for (const vp of [{ width: 1800, height: 1200 }, { width: 420, height: 800 }]) {
			const B = await openNet1(browser, net1, vp), Q = B.P;
			await B.arm('6', 'add-pumpplus'); await B.click(B.at('11')); await B.off(); await B.s.settle(1200);
			const m = await measure(Q);
			const vis = m.linkLabels.filter((l) => !l.hidden && l.text);
			const blk = m.nodeLabels.find((l) => /^P\d+D$/.test(l.id));
			const hits = blk ? vis.filter((l) => overlap(blk, l)) : [];
			if (vp.width > 1000) { ok('viewport ' + vp.width + ': the Pump+ block is drawn', !!blk, blk ? blk.text : 'none'); }
			ok('viewport ' + vp.width + ': no link label overlaps it', hits.length === 0, hits.map((h) => h.id + ':' + h.text).join(','));
			ok('viewport ' + vp.width + ': no link label is drawn for the pump itself', !vis.some((l) => /^P\d+$/.test(l.id)), '');
			const others = vis.filter((l) => !/^P\d+$/.test(l.id));
			let bad = [];
			others.forEach((a, i) => others.slice(i + 1).forEach((b) => { if (overlap(a, b)) { bad.push(a.id + '/' + b.id); } }));
			ok('viewport ' + vp.width + ': no two other link labels overlap', bad.length === 0, bad.join(','));
			if (PICS && vp.width > 1000) { await Q.screenshot({ path: path.join(PICS, 'pump-plus-label-overlap-fixed-v7.png') }); }
			await B.s.close();
		}

		console.log('\n--- 4. Valve+ on a vertical pipe: one block, the other node labels empty ---');
		for (const zoom of [0, 3, 6]) {
			const C = await openNet1(browser, net1), R = C.P;
			await C.arm('7', 'add-valveplus'); await C.click(C.at('112')); await C.off(); await C.s.settle(800);
			for (let i = 0; i < zoom; i++) { await R.mouse.move(900, 600); await R.mouse.wheel(0, -300); await C.s.settle(200); }
			await C.s.settle(800);
			const m = await measure(R);
			const u = m.nodeLabels.find((l) => /^V\d+U$/.test(l.id)), d = m.nodeLabels.find((l) => /^V\d+D$/.test(l.id));
			ok('zoom ' + zoom + ': no upstream label; the downstream node\'s block is drawn once the view has room (zoom 3 and up)', !u && (zoom === 0 || !!d));
			const vd = m.dots.find((q) => /^V\d+U$/.test(q.id));
			ok('zoom ' + zoom + ': the block stands within 200 px of its device, and its rows are tagged by member ID', !d || (vd && Math.hypot((d.l + d.r) / 2 - vd.x, (d.t + d.b) / 2 - vd.y) <= 200 && /^V\d+ /.test(d.text)), d ? d.text : '');
			if (PICS && zoom === 0) { await R.screenshot({ path: path.join(PICS, 'valve-plus-vertical-labels-v7.png') }); }
			await C.s.close();
		}

		console.log('\n--- 5. a reopened Well: its labels carry no leader through their own text ---');
		const W = await openNet1(browser, net1);
		await W.arm('6', 'add-well'); await W.click({ x: 1500, y: 330 }); await W.off(); await W.s.settle(800);
		await W.s.menuClick(await W.s.lang('lpn_file_saveas')); await W.s.settle(600);
		if (await W.s.dialog()) { await W.s.answerTrainingPanel(); await W.s.settle(1500); }
		const savedName = (await W.s.listFiles()).filter((f) => /\.(epp|lwn|json)$/i.test(f))[0];
		const proj = JSON.parse(await W.s.readFile(savedName));
		await W.s.close();
		// Curves for the Well, so it solves and every label carries results as in a real project.
		proj.curves = (proj.curves || []).concat([{ id: 'C1', kind: 'headloss', points: [[0, 0], [1000, 20], [2000, 60]] }, { id: 'C2', kind: 'head', points: [[0, 400], [1000, 330], [2000, 200]] }]);
		const wa = proj.assemblies.find((g) => g.kind === 'well');
		proj.links.forEach((l) => { if (l.id === wa.links[0]) { l.curveId = 'C1'; } if (l.id === wa.links[1]) { l.curveId = 'C2'; } });
		const V = await Session.open(browser, NAME, { viewport: { width: 1800, height: 1200 } });
		await V.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await V.goto('Looped-Network.php?ec_nolog=1');
		await V.page.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await V.reload(); await V.answerTrainingPanel().catch(() => {});
		await V.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await V.settle(1500);
		await V.page.setInputFiles('#lpn_project_file', { name: 'well-curves.lwn', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(proj)) });
		await V.settle(2500); await closeDialogs(V); await V.settle(1500);
		const inpText = await exportInp(V);
		ok('the Well with curves exports to an .inp with its assembly line', !!inpText && /;ASSEMBLY: well/.test(inpText) && /\[CURVES\]/.test(inpText), inpText ? inpText.length + ' chars' : 'no download');
		await V.close();
		const Z = await Session.open(browser, NAME, { viewport: { width: 1800, height: 1200 } });
		await Z.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await Z.goto('Looped-Network.php?ec_nolog=1');
		await Z.page.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await Z.reload(); await Z.answerTrainingPanel().catch(() => {});
		await Z.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await Z.settle(1500);
		await Z.page.setInputFiles('#lpn_inp_file', { name: 'out.inp', mimeType: 'text/plain', buffer: Buffer.from(inpText || '') });
		await Z.settle(1500); await closeDialogs(Z); await Z.settle(1500);
		const mz = await measure(Z.page);
		const wl = mz.nodeLabels.concat(mz.linkLabels.filter((l) => !l.hidden && l.text)).filter((l) => /W1/.test(l.id));
		ok('the reopened Well has labels', wl.length >= 1, wl.map((l) => l.id).join(','));
		if (process.env.EC_DEBUG) { console.log(JSON.stringify(mz.leaders.filter((g) => g.a.x > 1400 && g.a.y < 320).map((g) => [g.a, g.b])), JSON.stringify(wl.map((l) => [l.id, Math.round(l.l), Math.round(l.t), Math.round(l.r), Math.round(l.b)]))); }
		const through = [];
		mz.leaders.forEach((ld) => wl.forEach((l) => { if (touches({ x1: ld.a.x, y1: ld.a.y, x2: ld.b.x, y2: ld.b.y }, l)) { through.push(l.id); } }));
		const stacked = [];
		wl.forEach((a, i) => wl.slice(i + 1).forEach((b) => { if (overlap(a, b)) { stacked.push(a.id + '/' + b.id); } }));
		ok('no two Well labels overlap (the pump and the tank\'s virtual pipe drew on one spot)', stacked.length === 0, stacked.join(','));
		ok('no leader runs through a Well label', through.length === 0, through.join(','));
		if (PICS) { await Z.page.screenshot({ path: path.join(PICS, 'inp-reopened-v7.png') }); }
		await Z.close();

	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
