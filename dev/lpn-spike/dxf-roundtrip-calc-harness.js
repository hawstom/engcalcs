// A DXF THIS PAGE WROTE, IMPORTED BACK, MUST GIVE THE SAME CALCULATE RESULTS (ROADMAP Task 772,
// import slice 1, round 2), in a real Chrome through the real menu rows.
//
//   node dev/lpn-spike/dxf-roundtrip-calc-harness.js
//
// Tom, 2026-10-29: "I think we should export everything that our format can hold." So, for Net1,
// Net2 and Net3, a Darcy-Weisbach project, a project with a closed pipe and a closed pump, and a
// scenario that is not Base: open it, let it solve, export the DXF, import the DXF as a new project,
// let that solve, and compare every head and every flow. The pattern, clock, control and rule parts
// of the examples are removed first because a DXF file cannot hold them (the receipt lists them);
// what remains is everything a DXF file CAN hold, and it must come back to the same answers.
// Also: a scenario's own export (layers named for the scenario, no BASE) opens as a network, with
// the receipt saying which alternative was read.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DXF_CALC_RT_LOCKED';
const NAME = 'dxf-roundtrip-calc-harness';

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
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond || detail === undefined ? '' : '   ' + detail));
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, acceptDownloads: true, serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}
async function closeDialogs(a) {
	for (let i = 0; i < 4; i++) {
		const d = await a.dialog();
		if (!d) { return; }
		await a.dialogClick(d.buttons[d.buttons.length - 1]);
	}
}
async function exportDxf(a) {
	const downloads = [], onDl = (d) => downloads.push(d);
	a.page.on('download', onDl);
	await a.page.keyboard.press('Escape');
	await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_dxf'), 'file');
	const t0 = Date.now();
	while (!downloads.length && Date.now() - t0 < 15000) { await a.page.waitForTimeout(200); }
	await a.page.waitForTimeout(500);
	a.page.off('download', onDl);
	await closeDialogs(a);
	if (!downloads.length) { return null; }
	const p = await downloads[0].path();
	return p ? fs.readFileSync(p) : null;
}
async function importDxf(a, name, buffer) {
	await a.page.keyboard.press('Escape');
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser', { timeout: 10000 }),
		a.menuClickSub(await a.lang('lpn_file_import_menu'), await a.lang('lpn_file_import_dxfnet'), 'file', 'lpn_calib_network')
	]);
	await chooser.setFiles({ name: name, mimeType: 'application/dxf', buffer: buffer });
	const d = await a.waitDialog(8000).catch(() => null);
	const items = d ? await a.page.$$eval('#lpn_dxfnet_report > li', (ls) => ls.map((li) => ({ code: li.getAttribute('data-code'), text: li.textContent }))) : [];
	if (d) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
	return { dialog: d, items: items };
}
const stored = (a) => a.page.evaluate(() => {
	const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
	return { id: idx.openId, doc: JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null') };
});
// The answer on screen, once a solve has landed that covers `n` nodes (and is not the `prev` object).
async function solved(a, n) {
	for (let i = 0; i < 80; i++) {
		const r = await a.page.evaluate((want) => {
			const s = EngCalcs.lpnSolveProbe();
			return s && s.heads && Object.keys(s.heads).length === want ? JSON.parse(JSON.stringify({ heads: s.heads, flows: s.flows, ok: s.ok, converged: s.converged, engine: s.engine })) : null;
		}, n);
		if (r) { return r; }
		await a.page.waitForTimeout(500);
	}
	return null;
}
// A head must agree to one part in a million. A flow is only as good as the solver's own stopping rule
// (accuracy 0.001), and a nearly dead pipe in a loop can settle on a different small flow when the
// elements arrive in another order (Net2 has three), so a flow must agree to one percent of the largest flow. A missing minor loss, a closed
// pipe read open or a wrong roughness moves the main flows by far more.
function compare(A, B) {
	const bad = [], big = Math.max.apply(null, Object.keys(A.flows || {}).map((k) => Math.abs(A.flows[k])).concat([1e-9]));
	Object.keys(A.heads || {}).forEach((id) => {
		const x = A.heads[id], y = (B.heads || {})[id];
		if (y === undefined) { bad.push('heads ' + id + ' missing'); }
		else if (Math.abs(x - y) > 1e-6 * Math.max(1, Math.abs(x))) { bad.push('heads ' + id + ': ' + x + ' became ' + y); }
	});
	Object.keys(A.flows || {}).forEach((id) => {
		const x = A.flows[id], y = (B.flows || {})[id];
		if (y === undefined) { bad.push('flows ' + id + ' missing'); }
		else if (Math.abs(x - y) > 1e-2 * big) { bad.push('flows ' + id + ': ' + x + ' became ' + y); }
	});
	return bad;
}

// ---- the projects: the gallery examples with what a DXF cannot hold taken away ------------------
function example(file, edit, keepCalc) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', file), 'utf8'));
	d.patterns = []; d.defaultPattern = null; d.times = null; d.controls = []; d.rules = [];
	d.nodes.forEach((n) => { delete n.demandPattern; delete n.headPattern; });
	d.links.forEach((l) => { delete l.speedPattern; });
	// A scenario's demand multiplier is a calculation setting, like EPANET's Demand Multiplier option: a DXF file does not hold it.
	if (!keepCalc) { delete d.calcSets; (d.scenarios || []).forEach((sc) => { delete sc.calc; }); }
	if (edit) { edit(d); }
	return d;
}
const lk = (d, id) => d.links.find((l) => l.id === id);
const CASES = [
	{ label: 'Net1 (a pump with a one-point curve)', doc: example('Net1.lwn'), pumps: 1 },
	{ label: 'Net2 (a tank, no pump)', doc: example('Net2.lwn'), pumps: 0 },
	{ label: 'Net3 (two pumps with three-point curves, one closed, a closed pipe, tanks)', doc: example('Net3.lwn'), pumps: 2, closed: true },
	{ label: 'Net1 with pipe 111 closed and a minor loss on pipe 21', doc: example('Net1.lwn', (d) => { lk(d, '111')._status = 'closed'; lk(d, '21')._k = 7.5; }), pumps: 1, closed: true, minor: ['21', 7.5] },
	{ label: 'Net1 as a Darcy-Weisbach project', doc: example('Net1.lwn', (d) => {
		d.settings.method = 'dw';
		d.units = Object.assign({}, d.units, { lpn_u_roughness: 'mm' });
		d.links.forEach((l, i) => { if (l.type === 'pipe') { l._roughness = 0.25 + 0.05 * (i % 7); } });
	}), pumps: 1, method: 'dw' },
	{ label: 'Net1-Scenarios with Max day with main break on screen, calculation set kept (not compared)', doc: example('Net1-Scenarios.lwn', (d) => { d.project.activeScenario = 's2'; }, true), pumps: 1, scenario: true, keepCalc: true },
	{ label: 'Net1 with the scenario Max day with main break on screen', doc: example('Net1-Scenarios.lwn', (d) => { d.project.activeScenario = 's2'; }), pumps: 1, scenario: true }
];

async function runCase(browser, c) {
	console.log('\n--- ' + c.label + ' ---');
	const label = c.label.split(' (')[0];
	const a = await open(browser);
	await a.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_orig', t); }, JSON.stringify(c.doc));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const x = document.getElementById('ec-consent'); if (x) { x.remove(); } });
	await a.settle(2500);
	const before = await stored(a);
	const nNodes = before.doc.nodes.length;
	const A = await solved(a, nNodes);
	ok(label + ': the original solves (' + nNodes + ' nodes) and converges', !!A && A.ok !== false && A.converged !== false, JSON.stringify(A && { ok: A.ok, converged: A.converged }));
	if (!A) { await a.close(); return; }
	const dxf = await exportDxf(a);
	ok(label + ': the page exports a DXF', !!dxf && dxf.length > 1000);
	const txt = dxf.toString('latin1');
	const imp = await importDxf(a, 'rt.dxf', dxf);
	const codes = imp.items.map((i) => i.code);
	const allowed = ['not-in-dxf', 'alt-read', 'alternative', 'pump-no-curve', 'method'];
	ok(label + ': the receipt names only what a DXF cannot hold (and, for a scenario, the alternative read)', codes.every((x) => allowed.indexOf(x) >= 0) && codes.indexOf('method') < 0 && codes.indexOf('pump-no-curve') < 0, JSON.stringify(imp.items.map((i) => i.text.slice(0, 100))));
	{
		const held = imp.items.find((i) => i.code === 'not-in-dxf');
		ok(label + ': the read-me states the demand multiplier when the scenario has one other than 1, and not otherwise', !!c.keepCalc === /DEMAND MULTIPLIER: 1\.5\./.test(txt), String(/DEMAND MULTIPLIER: [^\r\n]*/.exec(txt)));
		if (c.keepCalc) { ok(label + ': the receipt names the scenario\'s calculation settings and the demand multiplier among what a DXF cannot hold', !!held && /calculation settings \(demand multiplier and other options\)/.test(held.text), held && held.text); }
	}
	if (c.scenario) {
		const alt = imp.items.find((i) => i.code === 'alt-read');
		ok(label + ': a scenario\'s own export has no BASE layers, and the receipt says which alternative was read', !/-BASE\r?\n/.test(txt) && !!alt && /MAX_DAY_WITH_MAIN_BREAK/.test(alt.text), alt && alt.text);
		ok(label + ': ...and imports as a network, not as "nothing imported"', (imp.dialog.text || '').indexOf((await a.lang('lpn_dxfnet_none')).split('{file}')[0]) !== 0, (imp.dialog.text || '').slice(0, 160));
	} else {
		ok(label + ': a Base export reads as BASE and no alternative line appears', codes.indexOf('alt-read') < 0 && codes.indexOf('alternative') < 0);
	}
	const after = await stored(a);
	ok(label + ': a new project with the same count of nodes and links', after.id !== before.id && after.doc.nodes.length === nNodes && after.doc.links.length >= 1, after.doc.nodes.length + ' nodes / ' + after.doc.links.length + ' links');
	ok(label + ': the head loss formula is ' + (c.method || 'hw'), after.doc.settings.method === (c.method || 'hw'), String(after.doc.settings.method));
	const pumps = after.doc.links.filter((l) => l.type === 'pump');
	ok(label + ': every pump is a pump with its head curve (' + c.pumps + ')', pumps.length === c.pumps && pumps.every((p) => p._curveId && (after.doc.curves || []).some((q) => q.id === p._curveId && q.points.length >= 1)), JSON.stringify(pumps.map((p) => p._curveId)));
	if (c.closed) {
		const was = before.doc.links.filter((l) => l._status === 'closed').map((l) => l.id).sort().join();
		const now = after.doc.links.filter((l) => l._status === 'closed').map((l) => l.id).sort().join();
		ok(label + ': the closed links (' + was + ') are closed in the import', was.length > 0 && was === now, was + ' / ' + now);
	}
	if (c.scenario) {
		const off = (after.doc.links.concat(after.doc.nodes)).filter((e) => e._active === false).map((e) => e.id).join();
		ok(label + ': pipe 112, which the scenario takes out of the network, is not active in the import', off === '112', off);
	}
	if (c.minor) { ok(label + ': the minor loss on pipe ' + c.minor[0] + ' is ' + c.minor[1], (after.doc.links.find((l) => l.id === c.minor[0]) || {})._k === c.minor[1]); }
	const B = await solved(a, nNodes);
	ok(label + ': the import solves', !!B && B.converged !== false);
	if (B && !c.keepCalc) {
		const bad = compare(A, B);
		ok(label + ': ' + Object.keys(A.heads).length + ' heads and ' + Object.keys(A.flows).length + ' flows come back the same as the original\'s', bad.length === 0 && Object.keys(B.flows).length === Object.keys(A.flows).length, bad.slice(0, 5).join('; '));
		if (c.closed) {
			const closedId = (c.minor ? '111' : null);
			if (closedId) { ok(label + ': the closed pipe carries no flow in either', Math.abs(A.flows[closedId]) < 1e-9 && Math.abs(B.flows[closedId]) < 1e-9, A.flows[closedId] + ' / ' + B.flows[closedId]); }
		}
	}
	ok(label + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.close();
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
		for (const c of CASES) { await runCase(browser, c); }
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
